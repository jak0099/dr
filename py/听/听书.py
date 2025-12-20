# coding=utf-8
# !/usr/bin/python

"""

作者 丢丢喵 🚓 内容均从互联网收集而来 仅供交流学习使用 版权归原创者所有 如侵犯了您的权益 请通知作者 将及时删除侵权内容
                    ====================Diudiumiao====================

"""

from concurrent.futures import ThreadPoolExecutor, as_completed
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

xurl = "https://www.ting39.com"

headerx = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36'
          }

class Spider(Spider):
    global xurl
    global headerx

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

    def fetch_home_data(self):
        url = f'{xurl}/book/all/lastupdate.html'
        detail = requests.get(url=url, headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text
        doc = BeautifulSoup(res, "lxml")
        return doc

    def extract_categories(self, doc):
        soups = doc.find_all('div', class_="r-zz")
        categories = []
        for soup in soups:
            vods = soup.find_all('a')
            for vod in vods:
                category = self.process_category(vod)
                if category:
                    categories.append(category)
        return categories

    def process_category(self, vod):
        name = vod.text.strip()
        skip_names = ["全部有声", "明星电台", "乡村生活", "幻想言情"]
        if name in skip_names:
            return None
        id = vod['href']
        return {"type_id": id, "type_name": name}

    def homeContent(self, filter):
        doc = self.fetch_home_data()
        categories = self.extract_categories(doc)
        result = {"class": categories}
        return result

    def homeVideoContent(self):
        pass

    def parse_page_number(self, pg):
        if pg:
            return int(pg)
        else:
            return 1

    def build_category_url(self, cid, page):
        fenge = cid.split(".html")
        return f'{xurl}{fenge[0]}/{str(page)}.html'

    def fetch_category_data(self, url):
        detail = requests.get(url=url, headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text
        return BeautifulSoup(res, "lxml")

    def extract_videos(self, doc):
        videos = []
        soups = doc.find_all('ul', class_="list-works")
        for soup in soups:
            vods = soup.find_all('li')
            for vod in vods:
                video = self.process_video_item(vod)
                if video:
                    videos.append(video)
        return videos

    def process_video_item(self, vod):
        names = vod.find('div', class_="list-imgbox")
        name = names.find('a')['title']
        id = names.find('a')['href']
        pics = vod.find('img', class_="lazy")
        pic = pics['data-original']
        if 'http' not in pic:
            pic = xurl + pic
        remarks = vod.find('div', class_="playCountText")
        remark = remarks.text.strip()
        video = {
            "vod_id": id,
            "vod_name": name,
            "vod_pic": pic,
            "vod_remarks": f"{remark} 播放量"
                }
        return video

    def build_result(self, videos, pg):
        result = {
            'list': videos,
            'page': pg,
            'pagecount': 9999,
            'limit': 90,
            'total': 999999
                  }
        return result

    def categoryContent(self, cid, pg, filter, ext):
        page = self.parse_page_number(pg)
        url = self.build_category_url(cid, page)
        doc = self.fetch_category_data(url)
        videos = self.extract_videos(doc)
        result = self.build_result(videos, pg)
        return result

    def get_initial_url(self, did):
        if 'http' not in did:
            return xurl + did
        return did

    def fetch_page_content(self, url):
        res = requests.get(url=url, headers=headerx)
        res.encoding = "utf-8"
        return res.text

    def extract_location_href(self, content):
        return self.extract_middle_text(content, 'location.href="', '"', 0)

    def build_base_path(self, location):
        return location.split('?')[0]

    def collect_all_urls(self, doc, base_path):
        soups = doc.find_all('div', class_="chapter-wrap js_chapter_wrap")
        first_page_url = f"{base_path}?page=1&sort=asc"
        all_urls = [first_page_url]
        for item in soups:
            vods = item.find_all('a')
            for vod in vods:
                id = vod['href']
                skip_names = ["javascript:;"]
                if id in skip_names:
                    continue
                all_urls.append(id)
        return all_urls

    def fetch_and_parse(self, index, url):
        full_url = f'{xurl}{url}'
        res_text = self.fetch_page_content(full_url)
        doc = BeautifulSoup(res_text, "lxml")
        temp_bofang = ""
        soups = doc.find_all('div', class_="playlist")
        for item in soups:
            vods = item.find_all('li')
            for vod in vods:
                name = vod.find('a')['title']
                id = vod.find('a')['href']
                temp_bofang = temp_bofang + name + '$' + id + '#'
            if temp_bofang:
                temp_bofang = temp_bofang[:-1]
        return index, temp_bofang

    def process_page_results(self, results):
        bofang = ""
        for page_bofang in results:
            if page_bofang:
                bofang += page_bofang + '#'
        if bofang.endswith('#'):
            bofang = bofang[:-1]
        return bofang

    def create_video_entry(self, did, xianlu, bofang):
        return {
            "vod_id": did,
            "vod_play_from": xianlu,
            "vod_play_url": bofang
               }

    def detailContent(self, ids):
        did = ids[0]
        result = {}
        videos = []
        xianlu = '听书专线'
        bofang = ''
        did = self.get_initial_url(did)
        res = self.fetch_page_content(did)
        doc = BeautifulSoup(res, "lxml")
        ress = doc.find('div', class_="fr")
        res1 = ress.find('a')['href']
        url = f'{xurl}{res1}'
        res = self.fetch_page_content(url)
        location = self.extract_location_href(res)
        url = f'{xurl}{location}'
        res = self.fetch_page_content(url)
        doc = BeautifulSoup(res, "lxml")
        base_path = self.build_base_path(location)
        all_urls = self.collect_all_urls(doc, base_path)
        results = [None] * len(all_urls)
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_index = {executor.submit(self.fetch_and_parse, i, url): i
                               for i, url in enumerate(all_urls)}
            for future in as_completed(future_to_index):
                index, page_bofang = future.result()
                results[index] = page_bofang
        bofang = self.process_page_results(results)
        videos.append(self.create_video_entry(did, xianlu, bofang))
        result['list'] = videos
        return result

    def playerContent(self, flag, id, vipFlags):
        result = {}
        result["parse"] = 1
        result["playUrl"] = ''
        result["url"] = f"{xurl}{id}"
        result["header"] = headerx
        return result

    def parse_page_number(self, pg):
        if pg:
            return int(pg)
        else:
            return 1

    def build_search_url(self, key, page):
        return f'{xurl}/search.html?searchtype=name&searchword={key}&page={str(page)}'

    def fetch_search_data(self, url):
        detail = requests.get(url=url, headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text
        return BeautifulSoup(res, "lxml")

    def extract_search_results(self, doc):
        videos = []
        soups = doc.find_all('ul', class_="list-works")
        for soup in soups:
            vods = soup.find_all('li')
            for vod in vods:
                video = self.process_search_item(vod)
                if video:
                    videos.append(video)
        return videos

    def process_search_item(self, vod):
        names = vod.find('div', class_="list-imgbox")
        name = names.find('a')['title']
        id = names.find('a')['href']
        pics = vod.find('img', class_="lazy")
        pic = pics['data-original']
        if 'http' not in pic:
            pic = xurl + pic
        remarks = vod.find('span', class_="book-zt")
        remark = remarks.text.strip()
        video = {
            "vod_id": id,
            "vod_name": name,
            "vod_pic": pic,
            "vod_remarks": f"更新日期{remark}"
                }
        return video

    def build_search_result(self, videos, pg):
        result = {
            'list': videos,
            'page': pg,
            'pagecount': 9999,
            'limit': 90,
            'total': 999999
                 }
        return result

    def searchContentPage(self, key, quick, pg):
        page = self.parse_page_number(pg)
        url = self.build_search_url(key, page)
        doc = self.fetch_search_data(url)
        videos = self.extract_search_results(doc)
        result = self.build_search_result(videos, pg)
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







