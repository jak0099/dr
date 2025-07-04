# coding = utf-8
# !/usr/bin/python

"""

作者 丢丢喵 🚓 内容均从互联网收集而来 仅供交流学习使用 版权归原创者所有 如侵犯了您的权益 请通知作者 将及时删除侵权内容
                    ====================Diudiumiao====================

"""

from Crypto.Util.Padding import unpad
from urllib.parse import unquote
from Crypto.Cipher import ARC4
from urllib.parse import quote
from base.spider import Spider
from Crypto.Cipher import AES
from bs4 import BeautifulSoup
from base64 import b64decode
import urllib.request
import urllib.parse
import binascii
import requests
import base64
import json
import time
import sys
import re
import os

sys.path.append('..')

xurl = "https://app.whjzjx.cn"

headerx = {
    'Host': 'app.whjzjx.cn',
    'x-app-id': '7',
    'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI5OTA1NTAsIlVzZXJJZCI6OTk3MjE1ODgsInJlZ2lzdGVyX3RpbWUiOiIyMDI1LTAzLTExIDE3OjI2OjAwIiwiaXNfbW9iaWxlX2JpbmQiOmZhbHNlfQ.kVsid49C_g8VRKKRJKgFrFk5yVMQpR42FDk5dePtRFc',
    'platform': '1',
    'manufacturer': 'vivo',
    'version_name': '3.8.3.1',
    'user_agent': 'Mozilla/5.0 (Linux; Android 9; V1938T Build/PQ3A.190705.08211809; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Safari/537.36',
    'dev_token': '',
    'app_version': '2.2.1.0',
    'device_platform': 'android',
    'device_type': 'V1938T',
    'device_brand': 'vivo',
    'os_version': '9',
    'channel': 'huawei',
    'raw_channel': 'huawei',
    'oaid': '',
    'msa_oaid': '',
    'uuid': 'randomUUID_292642bf-7ec5-4ae8-90a3-bf175942d6b9',
    'device_id': '2a50580e69d38388c94c93605241fb306',
    'ab_id': '',
    'accept-encoding': 'gzip'
          }

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36'
          }

pm = ''

class Spider(Spider):
    global xurl
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
        result = {"class": [{"type_id": "4", "type_name": "都市"},
                            {"type_id": "7", "type_name": "逆袭"},
                            {"type_id": "5", "type_name": "古装"},
                            {"type_id": "15", "type_name": "现代言情"},
                            {"type_id": "24", "type_name": "战神"},
                            {"type_id": "17", "type_name": "穿越"},
                            {"type_id": "6", "type_name": "重生"},
                            {"type_id": "33", "type_name": "甜宠"},
                            {"type_id": "41", "type_name": "亲情"},
                            {"type_id": "40", "type_name": "历史"},
                            {"type_id": "37", "type_name": "古代言情"},
                            {"type_id": "9", "type_name": "萌宝"},
                            {"type_id": "25", "type_name": "神医"},
                            {"type_id": "26", "type_name": "贤婿"},
                            {"type_id": "35", "type_name": "玄幻"}],
                  }

        return result

    def homeVideoContent(self):
        videos = []

        detail = requests.get(url=xurl + "/v1/theater/home_page?theater_class_id=1&page_num=1&page_size=24", headers=headerx)
        detail.encoding = "utf-8"
        if detail.status_code == 200:
            data = detail.json()

            for vod in data['data']['list']:

                name = vod['theater']['title']

                id = vod['theater']['id']

                pic = vod['theater']['cover_url']

                remark = vod['theater']['play_amount_str']

                video = {
                    "vod_id": id,
                    "vod_name": name,
                    "vod_pic": pic,
                    "vod_remarks": remark
                        }
                videos.append(video)

        result = {'list': videos}
        return result

    def categoryContent(self, cid, pg, filter, ext):
        result = {}
        videos = []

        url = f'{xurl}/v1/theater/home_page?theater_class_id=1&class2_id={cid}&page_num={pg}&page_size=24'
        detail = requests.get(url=url,headers=headerx)
        detail.encoding = "utf-8"
        if detail.status_code == 200:
            data = detail.json()
            for vod in data['data']['list']:

                name = vod['theater']['title']

                id = vod['theater']['id']

                pic = vod['theater']['cover_url']

                remark = vod['theater']['play_amount_str']

                video = {
                    "vod_id": id,
                    "vod_name": name,
                    "vod_pic": pic,
                    "vod_remarks": remark
                        }
                videos.append(video)

        result = {'list': videos}
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def detailContent(self, ids):
        global pm
        did = ids[0]
        result = {}
        videos = []

        url = f'{xurl}/v2/theater_parent/detail?theater_parent_id={did}'
        detail = requests.get(url=url, headers=headerx)
        detail.encoding = "utf-8"
        if detail.status_code == 200:
            data = detail.json()

        url = 'https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1732707176882/jiduo.txt'
        response = requests.get(url)
        response.encoding = 'utf-8'
        code = response.text
        name = self.extract_middle_text(code, "s1='", "'", 0)
        Jumps = self.extract_middle_text(code, "s2='", "'", 0)

        content = '😸集多🎉为您介绍剧情📢' + data['data']['introduction']

        if name not in content:
            bofang = Jumps
            xianlu = '1'
        else:
            soup = data['data']['theaters']

            xianlu = ''
            bofang = ''

            for sou in soup:

                id = sou['son_video_url']

                name = sou['num']

                bofang = bofang + str(name) + '$' + id + '#'

            bofang = bofang[:-1]

            xianlu = '乐哥专线'

        videos.append({
            "vod_id": did,
            "vod_content": content,
            "vod_play_from": xianlu,
            "vod_play_url": bofang
                     })

        result['list'] = videos
        return result

    def playerContent(self, flag, id, vipFlags):

        result = {}
        result["parse"] = 0
        result["playUrl"] = ''
        result["url"] = id
        result["header"] = headers
        return result

    def searchContentPage(self, key, quick, page):
        result = {}
        videos = []

        payload = {
            "text": "爱情"
                  }

        url = f"{xurl}/v3/search"
        detail = requests.post(url=url, headers=headerx, json=payload)
        if detail.status_code == 200:
            detail.encoding = "utf-8"
            data = detail.json()

            for vod in data['data']['theater']['search_data']:

                name = vod['title']

                id = vod['id']

                pic = vod['cover_url']

                remark = vod['score_str']

                video = {
                    "vod_id": id,
                    "vod_name": name,
                    "vod_pic": pic,
                    "vod_remarks": remark
                        }
                videos.append(video)

        result['list'] = videos
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



