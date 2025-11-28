# -*- coding: utf-8 -*-
# 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
# 严禁将其用于任何商业用途，下载后请于 24 小时内删除，搜索结果均来自源站，本人不承担任何责任。

from base.spider import Spider
from Crypto.PublicKey import RSA
import re,sys,time,random,base64,urllib3,hashlib
from Crypto.Util.number import bytes_to_long, long_to_bytes
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
sys.path.append('..')

class Spider(Spider):
    headers,host,token = {
        'User-Agent': 'Android/OkHttp',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'APP-ID': '',
        'X-HASH-Data': '',
        'Authorization': ''
    }, '',''

    def init(self, extend=''):
        if extend.startswith('http'):
            self.host = extend
        else:
            self.host = 'https://aleig4ah.yiys05.com'
        if not self.headers['APP-ID']:
            android_id_cache_key = 'com.nbys.App_com.ququkan.www_zNiOFyj0r4ux'
            android_id = self.getCache(android_id_cache_key)
            if not android_id:
                android_id = self.android_id()
                self.setCache(android_id_cache_key, android_id)
            self.headers['APP-ID'] = android_id
        payload = {
            'appID': self.headers['APP-ID'],
            'timestamp': str(int(time.time()))
        }
        if not self.token:
            headers = {**self.headers, 'X-Auth-Flow': '1'}
            response = self.post(f'{self.host}/vod-app/index/getGenerateKey', data=payload, headers=headers).json()
            self.token = self.rsa_public_decrypt(response['data'])

    def homeContent(self, filter):
        if not self.host: return None
        params = {'timestamp': str(int(time.time()))}
        response = self.fetch(f'{self.host}/vod-app/type/pList', params=params, headers=self.header2(params)).json()
        classes = []
        for i in response['data']:
            if isinstance(i,dict):
                classes.append({'type_id': i['id'], 'type_name': i['name']})
        return {'class': classes}

    def homeVideoContent(self):
        params = {'timestamp': str(int(time.time()))}
        response = self.fetch(f'{self.host}/vod-app/rank/hotHits', params=params, headers=self.header2(params)).json()
        data = response['data']
        videos = []
        for i in data:
            videos.extend(self.arr2vods(i['vodBeans']))
        return {'list': videos}

    def categoryContent(self, tid, pg, filter, extend):
        payload = {
            'by': "time",
            'limit': "12",
            'page': pg,
            'tid': tid,
            'timestamp': str(int(time.time()))
        }
        response = self.post(f'{self.host}/vod-app/vod/list', data=payload, headers=self.header2(payload)).json()
        data = response['data']
        videos = self.arr2vods(data['data'])
        return {'list': videos, 'pagecount': data['totalPageCount'], 'page': pg}

    def searchContent(self, key, quick, pg='1'):
        payload = {
            'key': key,
            'limit': '20',
            'page': str(pg),
            'timestamp': str(int(time.time()))
        }
        response = self.post(f'{self.host}/vod-app/vod/segSearch', data=payload, headers=self.header2(payload)).json()
        data = response['data']
        videos = self.arr2vods(data['data'])
        return {'list': videos, 'page': pg}

    def detailContent(self, ids):
        payload = {
            'tid': '',
            'timestamp': str(int(time.time())),
            'vodId': str(ids[0])
        }
        response = self.post(f'{self.host}/vod-app/vod/info', data=payload, headers=self.header2(payload)).json()
        data = response['data']
        show, play_urls = [], []
        for i in data['vodSources']:
            urls = []
            for j in i['vodPlayList']['urls']:
                urls.append(f"{j['name']}${i['sourceCode']}@{j['url']}")
            play_urls.append('#'.join(urls))
            show.append(i['sourceName'])
        video = {
            'vod_id': data['vodId'],
            'vod_name': data['vodName'],
            'vod_pic': data['vodPic'],
            'vod_remarks': data['vodRemark'],
            'vod_year': data['vodYear'],
            'vod_area': data['vodArea'],
            'vod_actor': data['vodActor'],
            'vod_content': data['vodContent'],
            'vod_play_from': '$$$'.join(show),
            'vod_play_url': '$$$'.join(play_urls),
            'type_name': data['vodClass']
        }
        return {'list': [video]}

    def playerContent(self, flag, vid, vip_flags):
        jx,url = 0,''
        source_code, raw_url = vid.split('@',1)
        payload = {
            'sourceCode': source_code,
            'timestamp': str(int(time.time())),
            'urlEncode': raw_url
        }
        try:
            response = self.post(f'{self.host}/vod-app/vod/playUrl', data=payload, headers=self.header2(payload)).json()
            play_url = response['data']['url']
            if play_url.startswith('http'):
                url = play_url
        except Exception:
            url = None
        if not url:
            url = raw_url
            if re.search(r'(?:www\.iqiyi|v\.qq|v\.youku|www\.mgtv|www\.bilibili)\.com', url):
                jx = 1
        return { 'jx': jx, 'parse': '0', 'url': url, 'header': {'User-Agent':'okhttp/4.12.0','Accept-Encoding':'gzip'}}

    def remove_rsa_padding_correctly(self,data_bytes):
        if len(data_bytes) > 10 and data_bytes[0:2] == b'\x00\x02':
            separator_index = -1
            for i in range(2, len(data_bytes)):
                if data_bytes[i] == 0x00:
                    separator_index = i
                    break
            if separator_index != -1 and separator_index >= 10:
                result = data_bytes[separator_index + 1:]
                return result
        if len(data_bytes) > 10 and data_bytes[0:2] == b'\x00\x01':
            separator_index = data_bytes.find(b'\x00', 2)
            if separator_index != -1:
                return data_bytes[separator_index + 1:]
        leading_zeros = 0
        for i, byte in enumerate(data_bytes):
            if byte == 0x00:
                leading_zeros += 1
            else:
                break
        if 4 < leading_zeros < len(data_bytes) - 4:
            return data_bytes[leading_zeros:]
        return data_bytes

    def rsa_public_decrypt(self,ciphertext_base64):
        try:
            ciphertext = base64.b64decode(ciphertext_base64)
            key = RSA.import_key('''-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw4qpeOgv+MeXi57MVPqZ\nF7SRmHR3FUelCTfrvI6vZ8kgTPpe1gMyP/8ZTvedTYjTDMqZBmn8o8Ym98yTx3zH\naskPpmDR80e+rcRciPoYZcWNpwpFkrHp1l6Pjs9xHLXzf3U+N3a8QneY+jSMvgMb\nr00DC4XfvamfrkPMXQ+x9t3gNcP5YtuRhGFREBKP2q20gP783MCOBFwyxhZTIAsF\niXrLkgZ97uaUAtqW6wtKR4HWpeaN+RLLxhBdnVjuMc9jaBl6sHMdSvTJgAajBTAd\n6LLA9cDmbGTxH7RGp//iZU86kFhxGl5yssZvBcx/K95ADeTmLKCsabexZVZ0Fu3d\nDQIDAQAB\n-----END PUBLIC KEY-----''')
            n = key.n
            e = key.e
            key_size = key.size_in_bytes()
            if len(ciphertext) > key_size: raise ValueError
            data_int = bytes_to_long(ciphertext)
            if data_int >= n: raise ValueError
            result_int = pow(data_int, e, n)
            result_bytes = long_to_bytes(result_int)
            if len(result_bytes) < key_size:
                padding_length = key_size - len(result_bytes)
                result_bytes = b'\x00' * padding_length + result_bytes
            cleaned_bytes = self.remove_rsa_padding_correctly(result_bytes)
            return cleaned_bytes.decode('utf-8')
        except Exception:
            raise ValueError

    def compute_hash_header_value(self, tree_map):
        sorted_keys = sorted(tree_map.keys())
        key_value_pairs = []
        for key in sorted_keys:
            value = tree_map[key]
            key_value_pairs.append(f"{key}={str(value)}")
        joined_pairs = "&".join(key_value_pairs)
        full_str = f"{joined_pairs}&token={self.token}"
        sha256_hash = hashlib.sha256(full_str.encode('utf-8'))
        return sha256_hash.hexdigest()

    def arr2vods(self, arr):
        videos = []
        if isinstance(arr, list):
            for j in arr:
                videos.append({
                    'vod_id': j['id'],
                    'vod_name': j['name'],
                    'vod_pic': j['vodPic'],
                    'vod_remarks': j['vodRemarks'],
                    'vod_year': j['vodYear'],
                    'vod_content': j['vodBlurb']
                })
        return videos

    def header2(self, payload):
        return {**self.headers, 'X-HASH-Data': self.compute_hash_header_value(payload)}

    def android_id(self):
        return ''.join(random.choice('0123456789abcdef') for _ in range(16))

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