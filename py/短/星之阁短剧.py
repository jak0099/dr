# 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
# 严禁将其用于任何商业用途，下载后请于 24 小时内删除，搜索结果均来自源站，本人不承担任何责任。

import sys
from base.spider import Spider
sys.path.append('..')

class Spider(Spider):
    headers = {
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        'Accept-Encoding': "gzip",
        'Referer': 'https://api.xingzhige.com/'
    }
    host = 'https://api.xingzhige.com'

    def init(self, extend=''):
        ext = extend.strip()
        if ext.startswith('http'):
            self.host = ext

    def homeContent(self, filter):
        return {'class': [
            {'type_id': '逆袭', 'type_name': '逆袭'}, 
            {'type_id': '总裁', 'type_name': '总裁'}, 
            {'type_id': '奇幻脑洞', 'type_name': '奇幻脑洞'}, 
            {'type_id': '战斗热血', 'type_name': '战斗热血'},
            {'type_id': '时空穿越', 'type_name': '时空穿越'}, 
            {'type_id': '权谋身份', 'type_name': '权谋身份'}
        ]}

    def search(self, key, pg=1):
        try:
            response = self.fetch(f'{self.host}/API/playlet/?keyword={key}&page={pg}', headers=self.headers).json()
            data = response.get('data', [])
            videos = []
            for i in data:
                videos.append({
                    'vod_id': i.get('book_id'),
                    'vod_name': i.get('title'),
                    'vod_pic': i.get('cover'),
                    'vod_remarks': i.get('type', '')
                })
            return {'list': videos, 'page': pg}
        except:
            return {'list': [], 'page': 1}

    def homeVideoContent(self):
        return self.search('热门')

    def detailContent(self, ids):
        try:
            response = self.fetch(f'{self.host}/API/playlet/?book_id={ids[0]}', headers=self.headers).json()
            data = response.get('data', {})
            detail = data.get('detail', {})            
            vod_play_url = ''
            video_list = data.get('video_list', [])
            
            for i in video_list:
                title = i.get('title', '正片')
                video_id = i.get('video_id', '')
                if video_id:
                    vod_play_url += f"{title}${video_id}#"
            
            if vod_play_url:
                vod_play_url = vod_play_url.rstrip('#')
            else:
                vod_play_url = "正片$unknown#"
            
            videos = [{
                'vod_id': detail.get('book_id', ids[0]),
                'vod_name': detail.get('title', ''),
                'vod_content': detail.get('desc', ''),
                'vod_remarks': f"集数：{detail.get('total', len(video_list))}",
                'vod_area': detail.get('vod_area', ''),
                'vod_play_from': '星之阁',
                'vod_play_url': vod_play_url
            }]
            return {'list': videos}
        except Exception as e:
            return {'list': []}

    def searchContent(self, key, quick, pg=1):
        return self.search(key, pg)

    def categoryContent(self, tid, pg, filter, extend):
        return self.search(tid, pg)

    def playerContent(self, flag, id, vipFlags):
        try:
            qualities = ['1080p', '720p']
            video_url = None
            
            for quality in qualities:
                url = f'{self.host}/API/playlet/?video_id={id}&quality={quality}'
                response = self.fetch(url, headers=self.headers)
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('data', {}).get('video', {}).get('url'):
                        video_url = data['data']['video']['url']
                        break
            
            if video_url:
                return {
                    'jx': 0, 
                    'parse': 0, 
                    'url': video_url,
                    'header': self.headers
                }
            else:
                return {
                    'jx': 1, 
                    'parse': 1, 
                    'url': id,
                    'header': self.headers
                }
                
        except Exception as e:
            return {
                'jx': 1, 
                'parse': 1, 
                'url': id,
                'header': self.headers
            }

    def getName(self):
        return "星之阁短剧"

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass

    def localProxy(self, param):
        pass