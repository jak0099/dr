# -*- coding: utf-8 -*-
# 基于原作者 @嗷呜 版本修改
# 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
# 严禁将其用于任何商业用途，下载后请于 24 小时内删除，搜索结果均来自源站，本人不承担任何责任。

from Crypto.Cipher import AES
from base.spider import Spider
import re,sys,json,base64,urllib3
from Crypto.Util.Padding import unpad
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
sys.path.append('..')

class Spider(Spider):
    headers,api,key,iv = {
        'User-Agent': "Dart/3.7 (dart:io)",
        'Accept': "application/json",
        'Accept-Encoding': "gzip"
    },'','',''

    def init(self, extend=""):
        try:
            ext = extend.rstrip()
            if ext.startswith('http'):
                self.api = ext.rstrip('/')
            else:
                arr = json.loads(ext)
                api = arr['api'].rstrip('/')
                if not api.startswith('http'): return
                self.api = api
                self.key = arr['key']
                self.iv = arr.get('iv',self.key)
                ua = arr.get('ua')
                if ua: self.headers['User-Agent'] = ua
        except Exception:
            self.api = ''

    def homeContent(self, filter):
        if not self.api: return None
        res = self.fetch(f"{self.api}/nav", headers=self.headers2(), verify=False).json()
        data = json.loads(self.decrypt(res['data']))
        keys = ["class", "area", "lang", "year", "letter", "by", "sort"]
        filters = {}
        classes = []
        for item in data:
            has_non_empty_field = False
            jsontype_extend = item["type_extend"]
            classes.append({"type_name": item["type_name"], "type_id": item["type_id"]})
            for key in keys:
                if key in jsontype_extend and jsontype_extend[key].strip() != "":
                    has_non_empty_field = True
                    break
            if has_non_empty_field:
                filters[str(item["type_id"])] = []
            for dkey in jsontype_extend:
                if dkey in keys and jsontype_extend[dkey].strip() != "":
                    values = jsontype_extend[dkey].split(",")
                    value_array = [{"n": value.strip(), "v": value.strip()} for value in values if value.strip() != ""]
                    filters[str(item["type_id"])].append({"key": dkey, "name": dkey, "value": value_array})
        return {"class": classes, "filters": filters}

    def homeVideoContent(self):
        if not self.api: return None
        res = self.fetch(f"{self.api}/index_video", headers=self.headers2(), verify=False).json()
        data = json.loads(self.decrypt(res['data']))
        videos = []
        for item in data: videos.extend(item['list'])
        return {'list': videos}

    def categoryContent(self, tid, pg, filter, extend):
        if not self.api: return None
        payload = {'page': pg, 'limit': 20, 'type_id': tid}
        filter_params = {
            k: v for k, v in {
                'class': extend.get('class'),
                'area': extend.get('area'),
                'lang': extend.get('lang'),
                'year': extend.get('year')
            }.items() if v
        }
        if filter_params:
            filter_params['sort'] = extend.get('sort', '最新')
            payload.update(filter_params)
        res = self.post(f"{self.api}/typeFilterVodList",data=json.dumps(payload), headers=self.headers2(), verify=False).json()
        data = json.loads(self.decrypt(res['data']))
        return {'list':data['recommend_list']}

    def searchContent(self, key, quick, pg='1'):
        if not self.api: return None
        res = self.fetch(f"{self.api}/searchList?keywords={key}&page={pg}", headers=self.headers2({'Content-Type':'application/json'}), verify=False).json()
        data = json.loads(self.decrypt(res['data']))
        videos = data['search_list']
        for i in videos:
            if 'vod_blurb' in i:
                i['vod_content'] = i['vod_blurb']
        return {'list': videos, 'page': pg}

    def detailContent(self, ids):
        if not self.api: return None
        res = self.post(f"{self.api}/video_detail",data=f'{{"vod_id":{ids[0]}}}', headers=self.headers2(), verify=False).json()
        data_ = json.loads(self.decrypt(res['data']))
        data = data_['vod_info']
        show, vod_play_url = [], []
        if 'vod_url_with_player' in data:
            for i in data['vod_url_with_player']:
                if i['code'] == i['name']:
                    show.append(i['name'])
                else:
                    show.append(f"{i['name']}\u2005({i['code']})")
                parse_api = i.get('parse_api', '')
                parse_secret = i.get('parse_secret', 0)
                if parse_api and parse_api.startswith('http') and not parse_secret:
                    url = i.get('url', '')
                    if url: url = '#'.join([i + '@' + parse_api for i in url.split('#')])
                    vod_play_url.append(url)
                else:
                    vod_play_url.append(i.get('url', ''))
            data.pop('vod_url_with_player')
        if show and vod_play_url:
            data['vod_play_from'] = '$$$'.join(show)
            data['vod_play_url'] = '$$$'.join(vod_play_url)
        return {'list': [data]}

    def playerContent(self, flag, vid, vip_flags):
        jx,url,raw_url,ua = 0,'','','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
        if '@' in vid:
            raw_url, jxapi = vid.split('@', 1)
            jxapis = jxapi.split(',') if ',' in jxapi else [jxapi]
            for jxapi_ in jxapis:
                try:
                    res = self.fetch(f"{jxapi_}{raw_url}", headers=self.headers, timeout=10, verify=False).text
                    res = json.loads(res[1:] if res.startswith('\ufeff') else res)
                    url = res.get('url', '')
                    if url.startswith('http'):
                        jxua = res.get('ua')
                        if jxua:
                            ua = jxua
                except Exception:
                    url = ''
                    continue
        else:
            url = vid
        if not url:
            url = raw_url
            if re.search(r'(?:www\.iqiyi|v\.qq|v\.youku|www\.mgtv|www\.bilibili)\.com', vid):
                url = 1
        return {'jx': jx,'parse': 0,'url': url,'header': {'User-Agent': ua}}

    def check_rematches(self, features, target):
        patterns = [p.strip() for p in features.split(',') if p.strip()]
        for pattern in patterns:
            try:
                if re.match(pattern, target):
                    return True
            except re.error as e:
                pass
        return False

    def decrypt(self,data):
        try:
            if not self.key: return data
            ciphertext = base64.b64decode(data)
            cipher = AES.new(self.key.encode('utf-8'), AES.MODE_CBC, self.iv.encode('utf-8'))
            plaintext_bytes = unpad(cipher.decrypt(ciphertext), AES.block_size)
            return plaintext_bytes.decode('utf-8')
        except Exception:
            return None

    def headers2(self,par={}):
        return  {**self.headers,'Content-Type':'application/json'}

    def localProxy(self, param):
        pass

    def getName(self):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass
