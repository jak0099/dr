"""
@header({
  searchable: 1,
  filterable: 1,
  quickSearch: 1,
  title: 'AppGet',
  lang: 'hipy'
})
"""

# -*- coding: utf-8 -*-
# by @嗷呜 2025-07-15
import json
import re
import sys
import time
import uuid

sys.path.append("..")
from Crypto.Cipher import AES
from Crypto.Hash import MD5
from Crypto.Util.Padding import pad, unpad
from urllib.parse import quote, urlparse
from base64 import b64encode, b64decode

try:
    # from base.spider import Spider as BaseSpider
    from base.spider import BaseSpider
except ImportError:
    from t4.base.spider import BaseSpider


class Spider(BaseSpider):

    def init(self, extend=""):
        '''
        ext配置示例：
        {
            "host": "http://122.228.193.2:9988",必需
            "key": "ca94b06ca359d80e",必需
            "get_type": "2", 必需，其他为get1，2为get2
            "path": "/api.php/qijiappapi",可选，没有则根据get_type判断，优先使用config中的path
            "version": "",可选，默认210
            "deviceId": "",可选
            "user_name": "",可选
            "password": "",可选
            "playheaders": ""可选
        }
        '''
        try:
            config = json.loads(self.extend.strip())
        except Exception as e:
            config = {}
            self.log(f"配置错误：{e}")
        self.key = config['key']
        self.deviceId = config.get('deviceId', self.getdeviceId())
        self.path = config.get('path')
        self.get_type = config.get('get_type') and str(config['get_type'])
        if self.get_type:
            self.hepath, self.depath = 'initV120', 'vodDetail2'
            if not self.path: self.path = '/api.php/qijiappapi'
        else:
            self.hepath, self.depath = 'initV119', 'vodDetail'
            if not self.path: self.path = '/api.php/getappapi'
        self.version = config.get('version', '210')
        self.playheaders = config.get('playheaders', '')
        self.host = self.gethost(config)
        self.token = self.gettoken(config)

        pass

    def getName(self):
        return 'AppGet'

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def action(self, action):
        pass

    def destroy(self):
        pass

    def homeContent(self, filter):
        data = self.getdata(f"/{self.hepath}")
        dy = {"class": "类型", "area": "地区", "lang": "语言", "year": "年份", "letter": "字母", "by": "排序",
              "sort": "排序"}
        filters, classes = {}, []
        json_data = data["type_list"]
        homedata = data["banner_list"]
        for item in json_data:
            if item["type_name"] in ["全部", "直播"]:
                continue
            has_non_empty_field = False
            jsontype_extend = json.loads(item["type_extend"])
            homedata.extend(item["recommend_list"])
            jsontype_extend["sort"] = "最新,最热,最赞"
            classes.append({"type_name": item["type_name"], "type_id": item["type_id"]})
            for key in dy:
                if key in jsontype_extend and jsontype_extend[key].strip() != "":
                    has_non_empty_field = True
                    break
            if has_non_empty_field:
                filters[str(item["type_id"])] = []
                for dkey in jsontype_extend:
                    if dkey in dy and jsontype_extend[dkey].strip() != "":
                        values = jsontype_extend[dkey].split(",")
                        value_array = [{"n": value.strip(), "v": value.strip()} for value in values if
                                       value.strip() != ""]
                        filters[str(item["type_id"])].append({"key": dkey, "name": dy[dkey], "value": value_array})
        result = {}
        result["class"] = classes
        result["filters"] = filters
        result["list"] = homedata
        return result

    def homeVideoContent(self):
        pass

    def categoryContent(self, tid, pg, filter, extend):
        body = {"area": extend.get('area', '全部'), "year": extend.get('year', '全部'), "type_id": tid, "page": pg,
                "sort": extend.get('sort', '最新'), "lang": extend.get('lang', '全部'),
                "class": extend.get('class', '全部')}
        result = {}
        data = self.getdata("/typeFilterVodList", body)
        result["list"] = data["recommend_list"]
        result["page"] = pg
        result["pagecount"] = 9999
        result["limit"] = 90
        result["total"] = 999999
        return result

    def detailContent(self, ids):
        data = self.getdata(f"/{self.depath}", {'vod_id': ids[0]})
        vod = data["vod"]
        play, names = [], []
        for itt in data["vod_play_list"]:
            a = []
            names.append(itt["player_info"]["show"])
            for it in itt['urls']:
                nit = {'vid': ids[0], 'user_agent': itt["player_info"].get("user_agent"),
                       'parse': itt["player_info"].get("parse")}
                it.update(nit)
                a.append(f"{it['name']}${self.e64(json.dumps(it))}")
            play.append("#".join(a))
        vod["vod_play_from"] = "$$$".join(names)
        vod["vod_play_url"] = "$$$".join(play)
        vod.pop('vod_down_url', None)
        result = {"list": [vod]}
        return result

    def searchContent(self, key, quick, pg="1"):
        cbody = {}
        if self.get_type:
            code, vkey = self.ocr_verify()
            cbody = {'code': code, 'key': vkey}
        body = {'keywords': key, 'type_id': 0, 'page': pg, **cbody}
        data = self.getdata("/searchList", body)
        result = {"list": data["search_list"], "page": pg}
        return result

    def playerContent(self, flag, id, vipFlags):
        ids = json.loads(self.d64(id))
        # self.log(f'ids:{ids}')
        if self.is_video_url(ids.get('url', '')):
            url, p = ids['url'], 0
        else:
            try:
                if re.search(r'url=', ids['parse_api_url']):
                    userag = ids.get('user_agent') or 'okhttp/3.14.9'
                    data = self.fetch(ids['parse_api_url'], headers={'User-Agent': userag}, timeout=10)
                    data = data.json()
                    url, p = data.get('url') or data['data'].get('url'), 0
                else:
                    body = {
                        "parse_api": ids.get('parse') or ids['parse_api_url'].replace(ids['url'], ''),
                        "url": quote(self.aes(ids['url'], True)),
                        "token": ids.get('token')
                    }
                    # self.log(f'body: {body}')
                    b = self.getdata("/vodParse", body)
                    url, p = json.loads(b['json'])['url'], 0
            except Exception as e:
                self.log(f'获取播放地址错误：{e}')
                url, p = ids['parse_api_url'] or ids['url'], 1
        if re.search(r'\.(jpg|png|jpeg)$', url, re.IGNORECASE):
            self.Mproxy(url)
        return {"parse": p, "url": url, "header": ids.get('user_agent', self.playheaders)}

    def localProxy(self, param):
        try:
            headers = self.playheaders or {"User-Agent": "okhttp/3.14.9"}
            url = self.d64(param['url'])
            for _ in range(10):
                ydata = self.fetch(url, headers=headers, allow_redirects=False)
                data = ydata.content.decode('utf-8')
                if not ydata.headers.get('Location'):
                    break
                url = ydata.headers['Location']
            else:
                raise Exception("代理重定向超过10次")
            lines = data.strip().split('\n')
            last_r = url[:url.rfind('/')]
            parsed_url = urlparse(url)
            durl = parsed_url.scheme + "://" + parsed_url.netloc
            for index, string in enumerate(lines):
                if '#EXT' not in string:
                    if 'http' not in string:
                        domain = last_r if string.count('/') < 2 else durl
                        string = domain + ('' if string.startswith('/') else '/') + string
                    if string.split('.')[-1].split('?')[0] == 'm3u8':
                        string = self.Mproxy(string)
                    lines[index] = string
            data = '\n'.join(lines)
            return [200, "application/vnd.apple.mpegur", data]
        except Exception as e:
            self.log(f'代理播放地址错误：{e}')
            return [500, "text/html", ""]

    def Mproxy(self, url):
        return f"{self.getProxyUrl()}&url={self.e64(url)}&type=proxy.m3u8"

    def gethost(self, config):
        host = config.get('host')
        if host.count('/') > 2:
            try:
                headers = {'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 11; M2012K10C Build/RP1A.200720.011)'}
                response = self.fetch(host, headers=headers)
                return response.text.strip()
            except Exception as e:
                error_msg = f"获取host失败: {str(e)}"
                self.log(error_msg)
                raise Exception(error_msg)
        return host

    def getdeviceId(self):
        if self.getCache('deviceId'):
            return self.getCache('deviceId')
        else:
            device_id = self.md5(str(int(time.time() * 1000)))
            self.setCache('deviceId', device_id)
            return device_id

    def is_video_url(self, url):
        video_extensions = {
            '.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv',
            '.webm', '.mpeg', '.mpg', '.3gp', '.m4v', '.m3u8', '.ts'
        }
        return any(ext in url and url.startswith('http') for ext in video_extensions)

    def aes(self, text, b=None):
        key = self.key.encode()
        cipher = AES.new(key, AES.MODE_CBC, key)
        if b:
            ct_bytes = cipher.encrypt(pad(text.encode("utf-8"), AES.block_size))
            ct = b64encode(ct_bytes).decode("utf-8")
            return ct
        else:
            pt = unpad(cipher.decrypt(b64decode(text)), AES.block_size)
            return pt.decode("utf-8")

    def gettoken(self, config):
        try:
            if config.get('user_name') and config.get('password'):
                self.token = self.gettoken(config)
                body = {
                    "password": config['user_name'],
                    "code": "",
                    "device_id": self.deviceId,
                    "user_name": config['password'],
                    "invite_code": "",
                    "is_emulator": "0"
                }
                data = self.getdata('/appLogin', body)
                return data['user']['auth_token']
            else:
                raise ValueError('获取token失败')
        except:
            return ''

    def headers(self):
        t = str(int(time.time()))
        header = {
            "User-Agent": "okhttp/3.14.9",
            "app-version-code": self.version,
            "app-ui-mode": "light",
            "app-api-verify-time": t,
            "app-user-device-id": self.deviceId,
            "app-api-verify-sign": self.aes(t, True),
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
        if hasattr(self, 'token') and self.token: header.update({"app-user-token": self.token})
        return header

    def getdata(self, epath, data=None):
        vdata = self.post(f"{self.host}{self.path}.index{epath}", headers=self.headers(), data=data)
        # self.log(f'vdata:{vdata.json()}')
        # fixme 这里 vdata.json()['data'] 可能是个[]，参与aes解密会报错。返回值为 {'msg': '', 'code': 0, 'data': []}
        data1 = self.aes(vdata.json()['data'])
        # self.log(f'data1:{data1}')
        return json.loads(data1)

    def ocr_verify(self):
        key = str(uuid.uuid4())
        headers = {'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 11; M2012K10C Build/RP1A.200720.011)'}
        res = self.fetch(f"{self.host}{self.path}.verify/create", params={'key': key},
                         headers=headers)
        imgdata = b64encode(res.content).decode()
        print(imgdata)
        code = ''
        '''
        ocr的实现
        '''
        return code, key

    def e64(self, text):
        try:
            text_bytes = text.encode('utf-8')
            encoded_bytes = b64encode(text_bytes)
            return encoded_bytes.decode('utf-8')
        except Exception as e:
            print(f"Base64编码错误: {str(e)}")
            return ""

    def d64(self, encoded_text):
        try:
            encoded_bytes = encoded_text.encode('utf-8')
            decoded_bytes = b64decode(encoded_bytes)
            return decoded_bytes.decode('utf-8')
        except Exception as e:
            print(f"Base64解码错误: {str(e)}")
            return ""

    def md5(self, text):
        h = MD5.new()
        h.update(text.encode('utf-8'))
        return h.hexdigest()
