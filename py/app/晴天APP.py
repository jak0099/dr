# coding = utf-8
# !/usr/bin/python

from Crypto.Util.Padding import unpad
from Crypto.Util.Padding import pad
from urllib.parse import unquote
from Crypto.Cipher import ARC4
from urllib.parse import quote
from base.spider import Spider
from Crypto.Cipher import AES
from datetime import datetime
from bs4 import BeautifulSoup
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

xurl = "https://qjappcms.sun4k.top"

headerx = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36'
}

pm = ''


class Spider(Spider):
    global xurl
    # global xurl1
    global headerx

    # global headers

    def getName(self):
        return "首页"

    def init(self, extend):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def homeContent(self, filter):
        result = {}
        result = {"class": [
            {"type_id": "37", "type_name": "4K区"},
            {"type_id": "42", "type_name": "HD区"},
            {"type_id": "1", "type_name": "电影"},
            {"type_id": "2", "type_name": "连续剧"},
            {"type_id": "3", "type_name": "综艺"},
            {"type_id": "4", "type_name": "动漫"},
            {"type_id": "41", "type_name": "直播区"}],
        }

        return result

    def decrypt(self, encrypted_data_b64):
        key_text = "sBxqXVF5pAHbGzrH"
        iv_text = "sBxqXVF5pAHbGzrH"
        key_bytes = key_text.encode('utf-8')
        iv_bytes = iv_text.encode('utf-8')
        encrypted_data = base64.b64decode(encrypted_data_b64)
        cipher = AES.new(key_bytes, AES.MODE_CBC, iv_bytes)
        decrypted_padded = cipher.decrypt(encrypted_data)
        decrypted = unpad(decrypted_padded, AES.block_size)
        return decrypted.decode('utf-8')

    def decrypt_wb(self, sencrypted_data):
        key_text = "sBxqXVF5pAHbGzrH"
        iv_text = "sBxqXVF5pAHbGzrH"
        key_bytes = key_text.encode('utf-8')
        iv_bytes = iv_text.encode('utf-8')
        data_bytes = sencrypted_data.encode('utf-8')
        padded_data = pad(data_bytes, AES.block_size)
        cipher = AES.new(key_bytes, AES.MODE_CBC, iv_bytes)
        encrypted_bytes = cipher.encrypt(padded_data)
        encrypted_data_b64 = base64.b64encode(encrypted_bytes).decode('utf-8')
        return encrypted_data_b64

    def homeVideoContent(self):
        result = {}
        videos = []
        url = f"{xurl}/api.php/getappapi.index/initV119"
        res = requests.get(url=url, headers=headerx).text
        res = json.loads(res)
        encrypted_data = res['data']
        kjson = self.decrypt(encrypted_data)
        kjson1 = json.loads(kjson)
        for i in kjson1['type_list']:
            for item in i['recommend_list']:
                id = item['vod_id']
                name = item['vod_name']
                pic = item['vod_pic']
                remarks = item['vod_remarks']
                video = {
                    "vod_id": id,
                    "vod_name": name,
                    "vod_pic": pic,
                    "vod_remarks": remarks
                }
                videos.append(video)

        result = {'list': videos}
        return result

    def categoryContent(self, cid, pg, filter, ext):
        result = {}
        videos = []
        payload = {
            'area': "全部",
            'year': "全部",
            'type_id': cid,
            'page': str(pg),
            'sort': "最新",
            'lang': "全部",
            'class': "全部"
        }
        url = f'{xurl}/api.php/getappapi.index/typeFilterVodList'
        res = requests.post(url=url, headers=headerx, data=payload).text
        # res1 = res.text
        res = json.loads(res)
        encrypted_data = res['data']
        kjson = self.decrypt(encrypted_data)
        kjson1 = json.loads(kjson)
        # print(kjson1)
        for i in kjson1['recommend_list']:
            id = i['vod_id']
            name = i['vod_name']
            pic = i['vod_pic']
            remarks = i['vod_remarks']

            video = {
                "vod_id": id,
                "vod_name": name,
                "vod_pic": pic,
                "vod_remarks": remarks
            }
            videos.append(video)
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
        play_form = ''
        play_url = ''
        payload = {
            'vod_id': did
        }
        url = f'{xurl}/api.php/getappapi.index/vodDetail2'
        res = requests.post(url=url, headers=headerx, data=payload).text
        res = json.loads(res)
        encrypted_data = res['data']
        kjson = self.decrypt(encrypted_data)
        # print(kjson)
        kjson1 = json.loads(kjson)
        actor = kjson1['vod']['vod_actor']
        director = kjson1['vod'].get('vod_director', '')
        area = kjson1['vod']['vod_area']
        name = kjson1['vod']['vod_name']
        year = kjson1['vod']['vod_year']
        content = kjson1['vod']['vod_content']
        subtitle = kjson1['vod']['vod_remarks']
        desc = kjson1['vod']['vod_lang']
        remark = '时间:' + subtitle + ' 语言:' + desc
        for line in kjson1['vod_play_list']:
            if line['player_info']['show'] == '自建线路':
                continue
            play_form += line['player_info']['show'] + '$$$'
            kurls = ""
            for vod in line['urls']:
                if 'qq' or 'iqiyi' or 'mgtv' or 'bilibili' or 'youku' in kurls:
                    kurls += str(vod['name']) + '$' + vod['parse_api_url'] + '@' + vod['token'] + '#'
                else:
                    if kurls and 'm3u8' in kurls:
                        kurls += str(vod['name']) + '$' + vod['url'] + '#'
                        print(kurls)
            kurls = kurls.rstrip('#')
            play_url += kurls + '$$$'
        play_form = play_form.rstrip('$$$')
        play_url = play_url.rstrip('$$$')

        videos.append({
            "vod_id": did,
            "vod_name": name,
            "vod_actor": actor.replace('演员', ''),
            "vod_director": director.replace('导演', ''),
            "vod_content": content,
            "vod_remarks": remark,
            "vod_year": year + '年',
            "vod_area": area,
            "vod_play_from": play_form.replace('(若黑屏请到HD区)', ' '),
            "vod_play_url": play_url
        })

        result['list'] = videos

        return result

    def playerContent(self, flag, id, vipFlags):
        # url = ''
        if '.m3u8' in id:
            url = id.replace('@', '')
        else:
            if 'qq' or 'iqiyi' or 'mgtv' or 'bilibili' or 'youku' in id:
                aid = id.split('http')[0]
                uid = id.split('http')[-1]
                kurl = 'http' + uid.split('@')[0]
                id1 = self.decrypt_wb(kurl)
                payload = {
                    "parse_api": aid,
                    "url": id1,
                    "token": uid.split('@')[-1]
                }
                url1 = f"{xurl}/api.php/getappapi.index/vodParse"
                response = requests.post(url=url1, headers=headerx, data=payload)
                if response.status_code == 200:
                    response_data = response.json()
                    # print(response_data)
                    encrypted_data = response_data['data']
                    kjson = self.decrypt(encrypted_data)
                    kjson1 = json.loads(kjson)
                    kjson2 = kjson1['json']
                    kjson3 = json.loads(kjson2)
                    url = kjson3['url']
        result = {}
        result["parse"] = 0
        result["playUrl"] = ''
        result["url"] = url
        result["header"] = headerx
        return result

    def searchContentPage(self, key, quick, pg):
        result = {}
        videos = []
        payload = {
            'keywords': key,
            'type_id': "0",
            'page': str(pg)
        }
        url = f'{xurl}/api.php/getappapi.index/searchList'
        response = requests.post(url=url, data=payload, headers=headerx).text
        res = json.loads(response)
        encrypted_data = res['data']
        kjson = self.decrypt(encrypted_data)
        kjson1 = json.loads(kjson)
        for i in kjson1['search_list']:
            id = i['vod_id']
            name = i['vod_name']
            pic = i['vod_pic']
            remarks = i['vod_year'] + ' ' + i['vod_class']

            video = {
                "vod_id": id,
                "vod_name": name,
                "vod_pic": pic,
                "vod_remarks": remarks
            }
            videos.append(video)
        result = {'list': videos}
        result['page'] = pg
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



