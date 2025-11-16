# -*- coding: utf-8 -*-
# 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
# 严禁将其用于任何商业用途，下载后请于 24 小时内删除，搜索结果均来自源站，本人不承担任何责任。

from base.spider import Spider
import sys,time,base64,secrets,hashlib,urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
sys.path.append('..')

class Spider(Spider):
    headers, host = {
        'User-Agent': 'okhttp/3.12.11',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip'
    }, ''

    def init(self, extend=''):
        default_host = 'http://194.147.100.13'
        try:
            if not extend.startswith('http'):
                extend = default_host
            self.host = extend.strip().rstrip('/')
        except Exception:
            self.host = default_host

    def homeContent(self, filter):
        if not self.host: return None
        response = self.fetch(f'{self.host}/api.php/v2.vod/androidtypes', headers=self.headers, verify=False).json()
        data = response['data']
        filters, class_list = {}, []
        for item in data:
            type_id = item.get('type_id', '')
            type_name = item.get('type_name', '')
            if not (type_id == '' and type_name == ''):
                class_list.append({'type_id': type_id,'type_name': type_name})
            classes = item.get('classes', [])
            areas = item.get('areas', [])
            years = item.get('years', [])
            filter_items = []
            class_values = [{'n': '全部', 'v': ''}]
            for cls in classes:
                n_val,v_val = cls,cls
                if not (n_val == '' and v_val == ''):
                    class_values.append({'n': n_val, 'v': v_val})
            filter_items.append({'key': 'class','name': '类型','value': class_values})
            area_values = [{'n': '全部', 'v': ''}]
            for area in areas:
                n_val,v_val = area,area
                if not (n_val == '' and v_val == ''): area_values.append({'n': n_val, 'v': v_val})
            filter_items.append({'key': 'area','name': '地区','value': area_values})
            year_values = [{'n': '全部', 'v': ''}]
            for year in years:
                n_val,v_val = year,year
                if not (n_val == '' and v_val == ''):
                    year_values.append({'n': n_val, 'v': v_val})
            filter_items.append({'key': 'year','name': '年份','value': year_values})
            filter_items.append({
                'key': 'sortby','name': '排序',
                'value': [{'n': '时间', 'v': 'updatetime'},{'n': '人气', 'v': 'hits'},{'n': '评分', 'v': 'score'}]
            })
            if type_id != '': filters[type_id] = filter_items
        return {'class': class_list, 'filters': filters}

    def homeVideoContent(self):
        response = self.fetch(f'{self.host}/api.php/v2.main/androidhome', headers=self.headers, verify=False).json()
        data = response['data']
        videos = self.arr2vods(data.get('top', []))
        for i in data.get('list', []):
            if isinstance(i, dict):
                videos.extend(self.arr2vods(i.get('list', [])))
        return {'list': videos}

    def categoryContent(self, tid, pg, filter, extend):
        params = {
            k: v for k, v in {
                'page': pg,
                'type': tid,
                'area': extend.get('area'),
                'year': extend.get('year'),
                'sortby': extend.get('sortby'),
                'class': extend.get('class')
            }.items() if v is not None and v != ''
        }
        response = self.fetch(f'{self.host}/api.php/v2.vod/androidfilter10086',params=params, headers=self.headers, verify=False).json()
        videos = self.arr2vods(response.get('data', []))
        return {'list': videos, 'page': pg}

    def searchContent(self, key, quick, pg='1'):
        response = self.fetch(f"{self.host}/api.php/v2.vod/androidsearch10086?page=1&wd={key}", headers=self.headers, verify=False).json()
        videos = self.arr2vods(response.get('data', []))
        return {'list': videos, 'page': pg}

    def detailContent(self, ids):
        response = self.fetch(f"{self.host}/api.php/v3.vod/androiddetail2?vod_id={ids[0]}", headers=self.headers2(), verify=False).json()
        data = response['data']
        play_urls = []
        for i in data['urls']:
            if not(i['key'] == '及时雨' or i['url'] == 'dlNQWVppbnZXVVZsZnRhMnRpTkVNT2JaTnpyS010VEs='):
                play_urls.append(f"{i['key']}${i['url']}")
        video = {
            'vod_id': data['id'],
            'vod_name': data['name'],
            'vod_pic': data['pic'],
            'vod_year': data['year'],
            'vod_area': data['area'],
            'vod_actor': data['actor'],
            'vod_director': data['director'],
            'vod_content': data['content'],
            'vod_play_from': 'LiteApple',
            'vod_play_url': '#'.join(play_urls),
            'type_name': data['className'],
        }
        return {'list': [video]}

    def playerContent(self, flag, vid, vip_flags):
        parse, url, headers = 0, '', {'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'}
        if vid.startswith("JBN_"):
            url = "https://www.yangshipin.cn/tv/home?pid=" + vid[4:]
            parse, headers = 1, {'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'}
        elif "HTTP" in vid.upper():
            url = vid
        else:
            url = 'http://c.xpgtv.net/m3u8/' + vid + '.m3u8'
            headers = {**self.headers2(), 'User-Agent': 'com.stub.StubApp/1.6.0 (Linux;Android 12) ExoPlayerLib/2.14.2'}
        return {'jx': 0, 'parse': parse, 'url': url, 'header': headers}

    def headers2(self):
        token_param_cache_key = 'com.phoenix.tv_33ee1768b8ee539a_token_param'
        token_param = self.getCache(token_param_cache_key)
        if not token_param:
            token_param = F'{self.random32()}||||{self.random11()}||||unknown||xiaomi/b0q/b0q:12/V417IR/913:user/release-keys'
            self.setCache(token_param_cache_key, token_param)
        token2_cache_key = 'com.phoenix.tv_33ee1768b8ee539a_token2'
        token2 = self.getCache(token2_cache_key)
        if not token2:
            token2 = self.encrypt(self.random32())
            self.setCache(token2_cache_key, token2)
        timestamp = str(int(time.time()))
        version = 'XPGBOX com.phoenix.tv1.6.0'
        return {
            **self.headers.copy(),
            'token': self.encrypt(token_param),
            'token2': token2,
            'user_id': "XPGBOX",
            'version': version,
            'timestamp': timestamp,
            'hash': self.hash(f'{token_param}{version}{timestamp}'),
            'screenx': "1600",
            'screeny': "900"
        }

    def cipher(self, data):
        bytes_key = "XPINGGUO".encode('utf-8')
        b_arr2 = bytearray(i % 256 for i in range(333))
        if len(bytes_key) > 0:
            i2 = 0
            i3 = 0
            for i4 in range(333):
                i5 = bytes_key[i2] & 0xFF
                b_val = b_arr2[i4]
                i3 = (i5 + (b_val & 0xFF) + i3) % 333
                b_arr2[i4], b_arr2[i3] = b_arr2[i3], b_val
                i2 = (i2 + 1) % len(bytes_key)
        b_arr3 = bytearray(len(data))
        i6 = 0
        i7 = 0
        for i8 in range(len(data)):
            i6 = (i6 + 1) % 333
            b2 = b_arr2[i6]
            i9 = b2 & 0xFF
            i7 = (i7 + i9) % 333
            b_arr2[i6], b_arr2[i7] = b_arr2[i7], b2
            i10 = ((b_arr2[i6] & 0xFF) + i9) % 333
            b_arr3[i8] = b_arr2[i10] ^ data[i8]
        return bytes(b_arr3)

    def arr2vods(self, arr):
        videos = []
        if isinstance(arr, list):
            for i in arr:
                videos.append({
                    'vod_id': i['id'],
                    'vod_name': i['name'],
                    'vod_pic': i['pic'],
                    'vod_remarks': i['updateInfo'],
                    'vod_year': i.get('year'),
                    'vod_content': i.get('content')
                })
        return videos

    def encrypt(self, s):
        try:
            byte_data = s.encode('utf-8')
            encrypted_data = self.cipher(byte_data)
            return base64.b64encode(encrypted_data).decode('utf-8')
        except UnicodeEncodeError:
            return ""

    def random11(self):
        return ''.join(secrets.choice('0123456789ABCDEF') for _ in range(11))

    def random32(self):
        random_bytes = secrets.token_bytes(32)
        return base64.b64encode(random_bytes).decode('utf-8')

    def hash(self, s):
        hash_hex = hashlib.md5(s.encode()).hexdigest()
        return hash_hex[8:12]

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
