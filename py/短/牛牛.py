# coding = utf-8
# !/usr/bin/python

"""

作者 丢丢喵 🚓 内容均从互联网收集而来 仅供交流学习使用 版权归原创者所有 如侵犯了您的权益 请通知作者 将及时删除侵权内容
                    ====================Diudiumiao====================

"""

from Crypto.Util.Padding import unpad
from Crypto.Util.Padding import pad
from urllib.parse import urlencode
from urllib.parse import unquote
from Crypto.Cipher import ARC4
from urllib.parse import quote
from base.spider import Spider
from Crypto.Cipher import AES
from bs4 import BeautifulSoup
from datetime import datetime
from base64 import b64decode
import urllib.request
import urllib.parse
import datetime
import binascii
import requests
import base64
import json
import time
import sys
import re
import os

sys.path.append('..')

xurl = "https://ccc.chaojichaojichanga.com:35620"

xurl1 = "http://ccs.jshh.gzbaoxian.com"

xurl2 = "http://101.42.92.211:5560"

headerx = {
    'User-Agent': 'Mozilla/5.0 (Linux; U; Android 8.0.0; zh-cn; Mi Note 2 Build/OPR1.170623.032) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.128 Mobile Safari/537.36 XiaoMi/MiuiBrowser/10.1.1'
          }

headers = {
    "User-Agent": "com.android.chrome/131.0.6778.200 (Linux;Android 9) AndroidXMedia3/1.5.1"
          }

class Spider(Spider):
    global xurl
    global xurl1
    global xurl2
    global headerx
    global headers

    def getName(self):
        return "首页"

    def init(self, extend):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def extract_middle_text(self, text, start_str, end_str, pl, start_index1: str = '', end_index2: str = ''):
        if pl == 3:
            plx = []
            while True:
                start_index = text.find(start_str)
                if start_index == -1:
                    break
                end_index = text.find(end_str, start_index + len(start_str))
                if end_index == -1:
                    break
                middle_text = text[start_index + len(start_str):end_index]
                plx.append(middle_text)
                text = text.replace(start_str + middle_text + end_str, '')
            if len(plx) > 0:
                purl = ''
                for i in range(len(plx)):
                    matches = re.findall(start_index1, plx[i])
                    output = ""
                    for match in matches:
                        match3 = re.search(r'(?:^|[^0-9])(\d+)(?:[^0-9]|$)', match[1])
                        if match3:
                            number = match3.group(1)
                        else:
                            number = 0
                        if 'http' not in match[0]:
                            output += f"#{match[1]}${number}{xurl}{match[0]}"
                        else:
                            output += f"#{match[1]}${number}{match[0]}"
                    output = output[1:]
                    purl = purl + output + "$$$"
                purl = purl[:-3]
                return purl
            else:
                return ""
        else:
            start_index = text.find(start_str)
            if start_index == -1:
                return ""
            end_index = text.find(end_str, start_index + len(start_str))
            if end_index == -1:
                return ""

        if pl == 0:
            middle_text = text[start_index + len(start_str):end_index]
            return middle_text.replace("\\", "")

        if pl == 1:
            middle_text = text[start_index + len(start_str):end_index]
            matches = re.findall(start_index1, middle_text)
            if matches:
                jg = ' '.join(matches)
                return jg

        if pl == 2:
            middle_text = text[start_index + len(start_str):end_index]
            matches = re.findall(start_index1, middle_text)
            if matches:
                new_list = [f'{item}' for item in matches]
                jg = '$$$'.join(new_list)
                return jg

    def homeContent(self, filter):
        result = {}
        result = {"class": [{"type_id": "都市@%E9%", "type_name": "都市"},
                            {"type_id": "反转@%E5%", "type_name": "反转"},
                            {"type_id": "萌宝@%E8%", "type_name": "萌宝"},
                            {"type_id": "古装@%E5%", "type_name": "古装"},
                            {"type_id": "逆袭@%E9%", "type_name": "逆袭"},
                            {"type_id": "喜剧@%E5%", "type_name": "喜剧"},
                            {"type_id": "闪婚@%E9%", "type_name": "闪婚"},
                            {"type_id": "王妃@%E7%", "type_name": "王妃"},
                            {"type_id": "校园@%E6%", "type_name": "校园"},
                            {"type_id": "民国@%E6%", "type_name": "民国"},
                            {"type_id": "年代@%E5%", "type_name": "年代"},
                            {"type_id": "脑洞@%E8%", "type_name": "脑洞"},
                            {"type_id": "总裁@%E6%", "type_name": "总裁"}],
                 }

        return result

    def decrypt1(self, encrypted_base64_content, key_text):
        key_text = key_text
        key = key_text.encode('utf-8')
        encrypted_bytes = base64.b64decode(encrypted_base64_content)
        cipher = AES.new(key, AES.MODE_ECB)
        decrypted_padded_bytes = cipher.decrypt(encrypted_bytes)
        decrypted_bytes = unpad(decrypted_padded_bytes, AES.block_size)
        decrypted_text = decrypted_bytes.decode('utf-8')
        parsed_json = json.loads(decrypted_text)
        return parsed_json

    def process_video_data(self, detail):
        videos = []
        js = detail['data']
        for vod in js:
            name = vod['vod_name']
            id = vod['vod_id']
            pic = vod['vod_pic']
            remark = vod['vod_douban_score']
            video = {
                "vod_id": id,
                "vod_name": name,
                "vod_pic": pic,
                "vod_remarks": '️豆瓣评分' + remark + '分'
                    }
            videos.append(video)
        return videos

    def homeVideoContent(self):
        videos = []

        for page in [1, 2, 3]:

            params = {
                "class": "",
                "order": "最新",
                "type_id": 5,
                "area": "",
                "year": "",
                "state": "",
                "wd": "",
                "page": page
                     }

            url = f"{xurl}/list"
            detail = requests.get(url=url, params=params, headers=headerx)
            detail.encoding = "utf-8"
            res = detail.text

            key_text = f"/list?class=&ord"
            detail = self.decrypt1(res, key_text)
            videos = self.process_video_data(detail)

        result = {'list': videos}
        return result

    def categoryContent(self, cid, pg, filter, ext):
        result = {}
        videos = []

        fenge = cid.split("@")

        if pg:
            page = int(pg)
        else:
            page = 1

        params = {
            "class": fenge[0],
            "order": "最新",
            "type_id": 5,
            "area": "",
            "year": "",
            "state": "",
            "wd": "",
            "page": str(page)
                 }

        url = f"{xurl}/list"
        detail = requests.get(url=url, params=params, headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text

        key_text = f"/list?class={fenge[1]}"
        detail = self.decrypt1(res , key_text)
        videos = self.process_video_data(detail)

        result = {'list': videos}
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def detailContent(self, ids):
        did = ids[0]
        result = {}
        videos = []
        xianlu = ''
        bofang = ''

        url = f"{xurl}/detail?vod_id={did}"
        detail = requests.get(url=url, headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text

        vod_id = str(did)[0]
        key_text = f"/detail?vod_id={vod_id}"
        detail = self.decrypt1(res, key_text)

        content = detail['data']['vod_content']

        remarks = "共" + str(detail['data']['vod_total']) + "集"

        year = detail['data']['vod_year']

        area = detail['data']['vod_area']

        soup = detail['data']['sources'][0]['episodes']

        for sou in soup:

            id = sou['url']

            name = sou['name']

            bofang = bofang + name + '$' + id + '#'

        bofang = bofang[:-1]

        xianlu = '牛牛短剧'

        videos.append({
            "vod_id": did,
            "vod_remarks": remarks,
            "vod_year": year,
            "vod_area": area,
            "vod_content": content,
            "vod_play_from": xianlu,
            "vod_play_url": bofang
                     })

        result['list'] = videos
        return result

    def playerContent(self, flag, id, vipFlags):

        url = f"{xurl1}/jx/qy.php?url={id}"
        detail = requests.get(url=url, headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text
        data = json.loads(res)
        url = data["url"]

        if url is None or url == "":
            url = f"{xurl1}/jx/dj.php?url={id}"
            detail = requests.get(url=url, headers=headerx)
            detail.encoding = "utf-8"
            res = detail.text
            data = json.loads(res)
            url = data.get("url")

            if url is None or url == "":
                url = f"{xurl2}/jx/dj.php?url={id}"
                detail = requests.get(url=url, headers=headerx)
                detail.encoding = "utf-8"
                res = detail.text
                data = json.loads(res)
                url = data.get("url")

        result = {}
        result["parse"] = 0
        result["playUrl"] = ''
        result["url"] = url
        result["header"] = headerx
        return result

    def searchContentPage(self, key, quick, pg):
        result = {}
        videos = []

        if pg:
            page = int(pg)
        else:
            page = 1

        params = {
            "class": "",
            "order": "",
            "type_id": 5,
            "area": "",
            "year": "",
            "state": "",
            "wd": key,
            "page": str(page)
                 }

        url = f"{xurl}/list"
        detail = requests.get(url=url, params=params, headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text

        key_text = f"/list?class=&ord"
        detail = self.decrypt1(res, key_text)
        videos = self.process_video_data(detail)

        result = {'list': videos}
        result['page'] = page
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def searchContent(self, key, quick, pg="1"):
        return self.searchContentPage(key, quick, '1')

    def localProxy(self, params):
        if params['type'] == "m3u8":
            return self.proxyM3u8(params)
        elif params['type'] == "media":
            return self.proxyMedia(params)
        elif params['type'] == "ts":
            return self.proxyTs(params)
        return None