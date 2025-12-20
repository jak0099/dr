# -*- coding: utf-8 -*-
# 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
# 严禁将其用于任何商业用途，下载后请于24小时内删除，搜索结果均来自源站，本人不承担任何责任。

from Crypto.Cipher import AES
from base.spider import Spider
from Crypto.Util.Padding import pad
import sys, json, time, random, urllib3, hashlib, uuid as uuid_module, binascii
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
sys.path.append('..')

class Spider(Spider):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12; Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.61 Safari/537.36',
        'Accept-Encoding': 'gzip',
        'authorization': '',
        'content-type': 'application/json'
    }
    host = 'https://free-api.bighotwind.cc'
    res_api = 'https://speed.hiknz.com/papaya/papaya-file/files/download/'
    cache_token_key = 'com.sha.fragment_5d091235ac87508f_token'

    def init(self, extend=''):
        self.login()

    def homeContent(self, filter):
        if not self.host: 
            return None
        
        for i in range(2):
            response = self.fetch(
                f'{self.host}/papaya/papaya-api/theater/tags', 
                headers=self.headers, 
                verify=False
            ).json()
            
            if response.get('code') == 401:
                self.re_login()
            else:
                break
        
        classes = []
        for i in response.get('data', []):
            if isinstance(i, dict):
                classes.append({
                    'type_id': i.get('id', ''),
                    'type_name': i.get('text_val', '')
                })
        
        classes.append({'type_id': '5', 'type_name': '推荐'})
        
        return {'class': classes}

    def homeVideoContent(self):
        if not self.host: 
            return None
        
        videos = []
        for i in range(2):
            response = self.fetch(
                f'{self.host}/papaya/papaya-api/videos/page?type=5&pageNum=1&pageSize=12',
                headers=self.headers, 
                verify=False
            ).json()
            
            if response.get('code') == 401:
                self.re_login()
            else:
                break
        
        for i in response.get('list', []):
            compound_id = f"{i.get('itemId', '')}@{i.get('videoCode', '')}"
            videos.append({
                'vod_id': compound_id,
                'vod_name': i.get('title', ''),
                'vod_pic': f"{self.res_api}{i.get('imageKey', '')}/{i.get('imageName', '')}",
                'vod_remarks': f"集数:{i.get('episodesMax', 0)} | 播放:{i.get('hitShowNum', 0)}",
                'vod_content': i.get('content', '') or i.get('description', '')
            })
        
        return {'list': videos, 'total': len(videos)}

    def categoryContent(self, tid, pg, filter, extend):
        if not self.host: 
            return None
        
        url = f'{self.host}/papaya/papaya-api/videos/page?type=5&pageNum={pg}&pageSize=12'
        if tid and tid != '5':
            url += f'&tagId={tid}'
        
        videos = []
        for i in range(2):
            response = self.fetch(url, headers=self.headers, verify=False).json()
            if response.get('code') == 401:
                self.re_login()
            else:
                break
        
        for i in response.get('list', []):
            compound_id = f"{i.get('itemId', '')}@{i.get('videoCode', '')}"
            videos.append({
                'vod_id': compound_id,
                'vod_name': i.get('title', ''),
                'vod_pic': f"{self.res_api}{i.get('imageKey', '')}/{i.get('imageName', '')}",
                'vod_remarks': f"集数:{i.get('episodesMax', 0)} | 播放:{i.get('hitShowNum', 0)}",
                'vod_content': i.get('content', '') or i.get('description', '')
            })
        
        return {'list': videos, 'total': response.get('total', len(videos))}

    def searchContent(self, key, quick, pg='1'):
        if not self.host: 
            return None
        
        url = f'{self.host}/papaya/papaya-api/videos/page?type=5&pageNum={pg}&pageSize=12&title={key}'
        
        videos = []
        for i in range(2):
            response = self.fetch(url, headers=self.headers, verify=False).json()
            if response.get('code') == 401:
                self.re_login()
            else:
                break
        
        for i in response.get('list', []):
            compound_id = f"{i.get('itemId', '')}@{i.get('videoCode', '')}"
            videos.append({
                'vod_id': compound_id,
                'vod_name': i.get('title', ''),
                'vod_pic': f"{self.res_api}{i.get('imageKey', '')}/{i.get('imageName', '')}",
                'vod_remarks': f"集数:{i.get('episodesMax', 0)} | 播放:{i.get('hitShowNum', 0)}",
                'vod_content': i.get('content', '') or i.get('description', '')
            })
        
        return {'list': videos, 'total': response.get('total', len(videos))}

    def detailContent(self, ids):
        if not self.host: 
            return None
        
        compound_id = ids[0]
        item_id, video_code = compound_id.split('@')
        
        url = f'{self.host}/papaya/papaya-api/videos/info?videoCode={video_code}&itemId={item_id}'
        
        for i in range(2):
            response = self.fetch(url, headers=self.headers, verify=False).json()
            if response.get('code') == 401:
                self.re_login()
            else:
                break
        
        data = response.get('data', response)
        
        if not data:
            return None
        
        play_urls = []
        episodes_list = data.get('episodesList', [])
        
        for episode in episodes_list:
            if not isinstance(episode, dict):
                continue
            
            episode_num = episode.get('episodes', 1)
            
            resolution_list = episode.get('resolutionList', [])
            if resolution_list:
                resolution_list.sort(key=lambda x: x.get('resolution', 0), reverse=True)
                best_resolution = resolution_list[0]
                
                file_key = best_resolution.get('fileKey', '')
                file_name = best_resolution.get('fileName', '')
                
                if file_key and file_name:
                    play_url = f"{self.res_api}{file_key}/{file_name}"
                    play_urls.append(f"第{episode_num}集${play_url}")
        
        video = {
            'vod_id': compound_id,
            'vod_name': data.get('title', ''),
            'vod_pic': f"{self.res_api}{data.get('imageKey', '')}/{data.get('imageName', '')}",
            'vod_remarks': f"共{len(episodes_list)}集 | 播放:{data.get('hitShowNum', 0)} | 点赞:{data.get('likeNum', 0)}",
            'vod_content': data.get('content', '') or data.get('description', ''),
            'vod_play_from': '碎片剧场',
            'vod_play_url': '#'.join(play_urls),
        }
        
        return {'list': [video]}

    def playerContent(self, flag, id, vipflags):
        if not id.startswith('http'):
            id = f'{self.res_api}{id}'
        
        return {
            'jx': 0, 
            'parse': 0, 
            'url': id, 
            'header': {
                'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 12; Build/3480d86.0)',
                'Connection': 'Keep-Alive',
                'Accept-Encoding': 'identity'
            }
        }

    def login(self):
        try:
            guid_str = str(uuid_module.uuid4())
            open_id = hashlib.md5(guid_str.encode()).hexdigest()[:16]
            
            timestamp = str(int(time.time() * 1000))
            key = self.encrypt(timestamp)
            
            token = self.getCache(self.cache_token_key)
            if not token:
                headers = {
                    'Content-Type': 'application/json',
                    'key': key
                }
                
                data = json.dumps({"openId": open_id})
                
                response = self.fetch(
                    f'{self.host}/papaya/papaya-api/oauth2/uuid',
                    method='POST',
                    data=data,
                    headers=headers,
                    verify=False
                ).json()
                
                if response.get('code') == 200 and response.get('data', {}).get('token'):
                    token = response['data']['token']
                    self.setCache(self.cache_token_key, token)
                else:
                    print(f"获取token失败: {response}")
                    self.host = None
                    return
            
            self.headers['authorization'] = token
            
        except Exception as e:
            print(f"登录异常: {e}")
            import traceback
            traceback.print_exc()
            self.host = None

    def convert_minutes(self, total_minutes):
        try:
            total_minutes = int(total_minutes)
        except (ValueError, TypeError):
            return str(total_minutes)
        
        if total_minutes <= 0:
            return "0分钟"
        
        hours = total_minutes // 60
        minutes = total_minutes % 60
        
        if hours == 0:
            return f"{minutes}分钟"
        elif minutes == 0:
            return f"{hours}小时"
        else:
            return f"{hours}小时{minutes}分钟"

    def encrypt(self, plaintext):
        try:
            key = "p0sfjw@k&qmewu#w".encode('utf-8')
            
            cipher = AES.new(key, AES.MODE_ECB)
            
            block_size = AES.block_size
            padded_data = pad(plaintext.encode('utf-8'), block_size)
            
            encrypted_bytes = cipher.encrypt(padded_data)
            
            return binascii.hexlify(encrypted_bytes).decode('utf-8')
            
        except Exception as e:
            print(f"加密失败: {e}")
            return ""

    def re_login(self):
        self.delCache(self.cache_token_key)
        self.login()

    def getName(self):
        return "碎片剧场"

    def isVideoFormat(self, url):
        video_ext = ['.mp4', '.m3u8', '.flv', '.avi', '.mov', '.mkv', '.ts']
        return any(url.lower().endswith(ext) for ext in video_ext)

    def manualVideoCheck(self):
        return True

    def destroy(self):
        pass

    def localProxy(self, param):
        pass