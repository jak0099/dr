# -*- coding: utf-8 -*-
# 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
# 严禁将其用于任何商业用途，下载后请于 24 小时内删除，搜索结果均来自源站，本人不承担任何责任。

from Crypto.Cipher import AES
from base.spider import Spider
from html.parser import HTMLParser
from Crypto.Util.Padding import unpad
import sys,time,uuid,hmac,json,random,base64,hashlib,urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
sys.path.append('..')

class _HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self._text = []

    def handle_data(self, data):
        self._text.append(data)

    def get_text(self):
        return ''.join(self._text)

class Spider(Spider):
    channelList,vod_tabs,pic_groups,user,app,host,user_cache_key,targets = [], [], [],{},{},'','',{b'\xc2\xd7\xc0\xed'.decode('gbk'),b'\xba\xd6\xa7Q'.decode('big5'),b'\xb1\xa1\xa6\xe2'.decode('big5')}

    def init(self, extend=''):
        try:
            if extend:
                ext = json.loads(extend)
            host, appid, package, channelid, version_name = (ext['host'],ext['appid'],ext['package'], ext['channelid'],ext['versionName'])
            if not(host.startswith('http') and package and channelid and version_name): return
            self.app = {'appid': appid,'package': package,'channelid': channelid,'version_name': version_name}
            self.host = host
            self.user_cache_key = f'{package}_user_e13cca1c0e630208'
            self.user = self.getCache(self.user_cache_key)
            if not(isinstance(self.user,dict)) or 'deviceid' not in self.user or 'deviceinfo' not in self.user:
                deviceid = self.random_android_id()
                uuid_ = str(uuid.uuid4())
                deviceinfo = base64.b64encode(f'{{"brand":"xiaomi","model":"xiaomi","type":"phone","resolutionX":"1600","resolutionY":"900","orientation":"1","osName":"android","osVersion":"15","osLevel":"32","abi":"arm64-v8a,armeabi-v7a,armeabi","androidId":"{deviceid}","uuid":"{uuid_}","gaid":""}}'.encode('utf-8')).decode('utf-8')
                self.user = {'deviceid': deviceid,'deviceinfo': deviceinfo}
            if not('devicecreatedat' in self.user and 'userid' in self.user and 'x-token' in self.user):
                self.login()
            path = '/v4/config/appInit.capi'
            params = {
                'os': 'android',
                'appId': self.app['appid'],
                'userLevel': '2'
            }
            response = self.fetch(f'{self.host}{path}', params=params, headers=self.headers(path, params), verify=False).content
            data = json.loads(self.decrypt(response))
            self.vod_tabs = data['vodTabs']
            self.pic_groups = data['groups']
        except Exception:
            self.host = ''

    def login(self):
        if not self.host: return
        if 'userid' in self.user:
            self.user.pop('userid')
        if 'x-token' in self.user:
            self.user.pop('x-token')
        self.user['devicecreatedat'] = self.timestamp()
        path = '/user/anonymous'
        response = self.post(f'{self.host}{path}', headers=self.headers(path,'',{'apiver': 'v2'},'post'), verify=False).content
        data = self.decrypt(response)
        data = json.loads(data)['data']
        uses_id = data['id']
        token = data['token']
        if uses_id and token:
            self.user['userid'], self.user['x-token'] = uses_id, token
            if True or (data['teenMode']) != '1':
                path2 = '/user/teenMode'
                params2 = {'status': '1'}
                res = self.post(f'{self.host}{path2}', data=params2,headers=self.headers(path2, params2, {'apiver': 'v2'}, 'post'), verify=False).content
                res2 = json.loads(self.decrypt(res))['data']
                if str(res2['teenMode']) != '1':
                    self.host = ''
                    return
            self.setCache(self.user_cache_key,self.user)

    def headers(self, path, params=None, header=None, method='get'):
        if header is None: header = {'x-cdn': '1'}
        sorted_params = ''
        if method == 'get' and params:
            sorted_keys = sorted(params.keys())
            sorted_params = '&'.join([f"{key}={value}" for key, value in zip(sorted_keys, [params[key] for key in sorted_keys])])
        timestamp = self.timestamp()
        deviceCreatedAt = ''
        devicecreatedat = self.user.get('devicecreatedat')
        if devicecreatedat:
            deviceCreatedAt = f"&deviceCreatedAt={self.user['devicecreatedat']}"
        sign = f"{method}|{path}|{sorted_params}|{timestamp}|appId={self.app['appid']}{deviceCreatedAt}&deviceId={self.user['deviceid']}&st=2"
        if 'userid' in self.user and self.user['userid']:
            sign += f"&userId={self.user['userid']}"
        sign += '|'
        return {
            'User-Agent': f"{self.app['package']}/{self.app['version_name']} Dalvik/2.1.0 (Linux; U; Android 12; SM-S9080 Build/3480d86.0)",
            **header,
            'appid': self.app['appid'],
            'os': 'android',
            'appversion': self.app['version_name'],
            'package': self.app['package'],
            'deviceid': '',
            'devicecreatedat': '',
            'deviceinfo': '',
            **self.user,
            'channelid': self.app['channelid'],
            'x-d-video': '1',
            'st': '2',
            'ts': timestamp,
            'sign': self.hmac_sha1(sign)
        }

    def homeContent(self, filter):
        if not self.host: return None
        classes = []
        for i in self.vod_tabs:
            if i['text'] in {bytes(b ^ 90 for b in b'\xe0\x8c\xfd\x0b').decode('big5')}:continue
            if i['index'] != 1 and i['text'] in {'短剧','电影','剧集','动漫','综艺','纪录','综艺纪录'} and i['isAdult'] == 0:
                classes.append({'type_id': i['channelId'], 'type_name': i['text']})
        return {'class': classes}

    def homeVideoContent(self):
        if not self.host: return None
        path = '/v4/vod/home.capi'
        params = {
            'os': 'android',
            'appId': self.app['appid'],
            'userLevel': '2'
        }
        response = self.fetch(f'{self.host}{path}', params=params, headers=self.headers(path, params), verify=False).content
        data = self.decrypt(response)
        data = json.loads(data)['data']
        videos = []
        fl_channel_ids = {'5'}
        for i in data['blocks']:
            for k in self.targets:
                if k in data.get('topRightLabel','None'): return None
            if str(data.get('channelId','None')) in fl_channel_ids: return None
            if any(any(target in value for item in i.get('labels',[]) for value in item.values()) for target in self.targets): continue
            if 'header' in i and i.get('_vod','').startswith('section') and isinstance(i.get('data'),list):
                for j in i.get('data',[]):
                    url = j['url']
                    if url.startswith('vod/detail?vodId=') and str(j['id']) != 0 and str(j['channelId']) != 0 and '广告' not in j['topRightLabel'] and '广告' not in j['bottomLabel'] and 'browser' not in url:
                        videos.append({
                            'vod_id': j['id'],
                            'vod_name': j['title'],
                            'vod_pic': self.pic(j['imageGroup'],j['imagePath']),
                            'vod_remarks': j['bottomLabel']
                        })
        return {'list': videos}

    def categoryContent(self, tid, pg, filter, extend):
        if not self.host: return None
        path = '/vod/channel/list.capi'
        params = {
            'channelId': tid,
            'sort': '3',
            'category': '',
            'area': '',
            'language': '',
            'year': '',
            'next': f'page={pg}',
            'os': 'android',
            'appId': self.app['appid'],
            'userLevel': '2'
        }
        response = self.fetch(f'{self.host}{path}',params=params, headers=self.headers(path, params), verify=False).content
        data = self.decrypt(response)
        data = json.loads(data)['data']
        videos = []
        for i in data['items']:
            url = i['url']
            if url.startswith('vod/detail?vodId=') and str(i['id']) != 0 and str(i['channelId']) != 0 and '广告' not in i['topRightLabel'] and '广告' not in i['bottomLabel'] and 'browser' not in url:
                videos.append({
                    'vod_id': i['id'],
                    'vod_name': i['title'],
                    'vod_pic': self.pic(i['imageGroup'],i['imagePath']),
                    'vod_remarks': i['bottomLabel'],
                })
        return {'list': videos, 'page': pg}

    def searchContent(self, key, quick, pg='1'):
        if not self.host: return None
        path = '/vod/search/query'
        params = {
            'channelId': '0',
            'k': key,
            'next': f'page={pg}',
            'os': 'android',
            'appId': self.app['appid'],
            'userChannel': self.app['channelid'],
            'userLevel': '2'
        }
        response = self.fetch(f'{self.host}{path}', params=params, headers=self.headers(path, params,{'apiver':'v2'}), verify=False).content
        data = self.decrypt(response)
        data = json.loads(data)['data']
        fl_channel_ids = {'5'}
        for k in data['tabs']:
            if 'channelId' in k and 'text' in k:
                if any(m in k['text'] for m in self.targets):
                    fl_channel_ids.add(str(k['channelId']))
        videos = []
        for i in data['items']:
            url = i['url']
            if url.startswith('vod/detail?vodId=') and str(i['id']) != 0  and str(i['channelId']) != 0 and '广告' not in i['topRightLabel'] and '广告' not in i['bottomLabel'] and 'browser' not in url:
                try:
                    if str(i['channelId']) in fl_channel_ids: continue
                    if any(j in i['topRightLabel'] for j in self.targets): continue
                    if any(any(target in value for item in i['labels'] for value in item.values()) for target in self.targets): continue
                except Exception:
                    continue
                year = ''
                year_arr = i.get('year')
                if year_arr: year = year_arr.get('name',year_arr.get('id'))
                videos.append({
                    'vod_id': url.replace('vod/detail?vodId=',''),
                    'vod_name': self.html2text(i['title']),
                    'vod_pic': self.pic(i['imageGroup'],i['imagePath']),
                    'vod_remarks': i['bottomLabel'],
                    'vod_year': year,
                    'vod_content': i['summary']
                })
        return {'list': videos, 'page': pg}

    def detailContent(self, ids):
        if not self.host: return None
        path = '/v2/vod/detail.capi'
        params = {
            'vodId': ids[0],
            'os': 'android',
            'appId': self.app['appid'],
            'userLevel': '2'
        }
        response = self.fetch(f'{self.host}{path}',params=params, headers=self.headers(path, params),  verify=False).content
        data = self.decrypt(response)
        data = json.loads(data)['data']
        fl_channel_ids = {'5'}
        for i in self.vod_tabs:
            if str(i['isAdult']) == '1' or i['text'] in self.targets:
                fl_channel_ids.add(str(i['channelId']))
        for k in self.targets:
            if k in data['channelName'] or k in data['topRightLabel']: return None
        if str(data['channelId']) in fl_channel_ids: return None
        if any(any(target in value for item in data['labels'] for value in item.values()) for target in self.targets): return None
        show, play_urls = [], []
        i2 = 0
        for i in data['playSources']:
            if i2 > 1 or i2 > len(data['playSources']): break
            i2 += 1
            if i['total'] >= 1:
                if i['list']:
                    urls = []
                    for j in i['list']:
                        urls.append(f"{j['title']}${j['playUrls'][0]['url']}")
                    play_urls.append('#'.join(urls))
                else:
                    play_urls.append(self.episode(ids[0], i['siteId'], i['episodeVodId']))
                show.append(f"{i['name']}\u2005({i['siteId']})")
        video = {
            'vod_id': ids[0],
            'vod_name': data['title'],
            'vod_pic': self.pic(data['imageGroup'],data['imagePath']),
            'vod_remarks': data['bottomLabel'],
            'vod_year': data.get('year', []).get('name'),
            'vod_area': self.labels2str(data['area']),
            'vod_actor': self.labels2str(data['actors']),
            'vod_director': self.labels2str(data['directors']),
            'vod_content': data['summary'],
            'vod_play_from': '$$$'.join(show),
            'vod_play_url': '$$$'.join(play_urls),
            'type_name': self.labels2str(data['labels'])
        }
        return {'list': [video]}

    def playerContent(self, flag, id, vipflags):
        return { 'jx': 0, 'parse': 0, 'url': id, 'header': {'User-Agent': 'com.salmon.film.app.start.App/3.3.9 (Linux;Android 12) AndroidXMedia3/1.6.1','Accept-Encoding': 'gzip','Connection': 'Keep-Alive'}}

    def episode(self,video_id,site_id,episode_id):
        path = '/v2/vod/episodes.capi'
        try:
            params = {
                'vodId': video_id,
                'siteId': site_id,
                'episodeVodId': episode_id,
                'os': 'android',
                'appId': self.app['appid'],
                'userLevel': '2'
            }
            response = self.fetch(f'{self.host}{path}', params=params, headers=self.headers(path, params), verify=False).content
            data = self.decrypt(response)
            data = json.loads(data)['data']
            urls = []
            for i in data:
                urls.append(f"{i['title']}${i['playUrls'][0]['url']}")
            play_urls = '#'.join(urls)
        except Exception:
            play_urls = ''
        return play_urls

    def decrypt(self, data):
        cipher = AES.new('ayt5wy5afwmwrpb19k9s3psx3dymyd0n'.encode('utf-8'), AES.MODE_CBC, 'b3t069ijy7pirw0j'.encode('utf-8'))
        decrypted_bytes = cipher.decrypt(data)
        decrypted_bytes = unpad(decrypted_bytes, AES.block_size)
        return decrypted_bytes.decode('utf-8')

    def hmac_sha1(self, data):
        hmac_obj = hmac.new('ksggsr4tp6difdo1c3im8fqd3g'.encode('utf-8'), data.encode('utf-8'), hashlib.sha1)
        return hmac_obj.hexdigest()

    def labels2str(self,data):
        labels = []
        if isinstance(data,list):
            for i in data:
                label = i.get('name', i.get('id'))
                if label: labels.append(label)
        return ','.join(labels)

    def pic(self,group,path):
        for i in self.pic_groups:
            if i['id'] == group:
                return f"{i['url'][0]['domain']}{path}"
        return f'https://vres.fnqty.com/vod1{path}'

    def html2text(self,html_str):
        extractor = _HTMLTextExtractor()
        extractor.feed(html_str)
        return extractor.get_text()

    def random_android_id(self):
        hex_chars = '0123456789abcdef'
        return ''.join(random.choice(hex_chars) for _ in range(16))

    def timestamp(self):
        return str(int(time.time() * 1000))

    def getName(self):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass

    def localProxy(self, param):
        pass

if __name__ == "__main__":
    sp = Spider()
    formatJo = sp.init()  # 初始化
    # formatJo = sp.homeContent(False) # 筛选分类(首页 可选)
    formatJo = sp.homeVideoContent() # (首页 可选)
    # formatJo = sp.searchContent("仙逆",False,'2') # 搜索
    # formatJo = sp.categoryContent('1', '1', False, {}) # 分类
    # formatJo = sp.detailContent(['195930']) # 详情  异常：88051
    # formatJo = sp.playerContent("","https://107.148.194.118:21306/data3/jvods/hls/dhz/4/3361/24121023/3_195930_7779/1920/index.m3u8?appId=dsdy&sign=758726ec1dd41a394fe3b5b65ab504c1&timestamp=1760847330&ref=1",{}) # 播放
    # formatJo = sp.localProxy({"":""}) # 代理
    print(formatJo)
'''
{
    "appid": "hkan",
    "channelid": "c300000",
    "versionName": "3.3.9",
    "host": "https://vcache.nxcse.cn",
    "package": "com.hkanC300000V250930.T120445"
}
'''


'''
{
    "appid": "dsdy",
    "channelid": "c100000",
    "versionName": "3.3.9",
    "host": "https://vcache.nxcse.cn",
    "package": "com.dsdyC100000V250916.T210207"
}
'''