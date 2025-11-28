# -*- coding: utf-8 -*-
# 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
# 严禁将其用于任何商业用途，下载后请于 24 小时内删除，搜索结果均来自源站，本人不承担任何责任。

import re,sys,urllib3
from datetime import datetime
from base.spider import Spider
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
sys.path.append('..')

class Spider(Spider):
    headers,player,host = {
        'User-Agent': 'Dart/3.9 (dart:io)',
        'Accept-Encoding': 'gzip'
    },{},''
    headers2 = {**headers,'content-type':'application/json'}

    def init(self, extend=''):
        try:
            if extend.startswith('http'):
                host = extend
            else:
                host = "https://qiliniao-1331306839.cos.ap-chengdu.myqcloud.com/jg.txt"
            domain_set = set()
            if not re.match(r'^https?:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(:\d+)?(\/)?$', host):
                host_data = self.fetch(host, headers=self.headers, timeout=10, verify=False).text
                domain_set.update([domain.strip().rstrip('/') for domain in host_data.split('\n')])
            else:
                domain_set.add(host)
            for i in domain_set:
                try:
                    res = self.fetch(f'{i}/success.txt', headers=self.headers, timeout=(5, 5), verify=False)
                    if res.status_code == 200:
                        self.host = i
                        break
                except Exception:
                    continue
        except Exception:
            self.host = ''

    def homeContent(self, filter):
        if not self.host: return None
        response = self.fetch(f'{self.host}/api.php/type/get_list', headers=self.headers2, verify=False).json()
        classes = []
        for i in response['info']['rows']:
            try:
                if isinstance(i,dict) and i['type_status'] == 1 and i['type_name'] not in {'漫画', '小说'}:
                    classes.append({'type_id': i['type_id'], 'type_name': i['type_name']})
            except Exception:
                continue
        try:
            response2 = self.fetch(f'{self.host}/addons/getstar/api.index/shortVideoCategory', headers=self.headers2, verify=False).json()
            for j in response2['data']:
                try:
                    classes.append({'type_id': j['id'], 'type_name': j['name']})
                except Exception:
                    continue
        except Exception:
            pass
        return {'class': classes}

    def homeVideoContent(self):
        if not self.host: return None
        return self.fetch(f'{self.host}/index.php/ajax/data?mid=1&limit=100&page=1&level=7',headers=self.headers2, verify=False).json()

    def categoryContent(self, tid, pg, filter, extend):
        if not self.host: return None
        return self.fetch(f"{self.host}/index.php/ajax/data?mid=1&limit=20&page={pg}&tid={tid}&year={datetime.now().year}", headers=self.headers2, verify=False).json()

    def searchContent(self, key, quick, pg='1'):
        if not self.host: return None
        return self.fetch(f"{self.host}/index.php/ajax/data?mid=1&limit=20&page={pg}&wd={key}", headers=self.headers2, verify=False).json()

    def detailContent(self, ids):
        if not self.player:
            try:
                player_res = self.fetch(f'{self.host}/addons/getstar/api.index/getPlayerParse',headers=self.headers, verify=False).json()
                player_data = player_res['data']
                if isinstance(player_data, list):
                    self.player = player_data
            except Exception:
                pass
        response = self.fetch(f"{self.host}/api.php/vod/get_detail?vod_id={ids[0]}",headers=self.headers, verify=False).json()
        data = response['info'][0]
        if data['vod_play_from'] and data['vod_play_url']:
            show_tmp = data['vod_play_from'].split('$$$')
            urls_tmp = data['vod_play_url'].split('$$$')
            shows, play_urls = [], []
            for show, urls in zip(show_tmp, urls_tmp):
                player,parse,is_open = {},'',0
                for i in self.player:
                    if i and i.get('code') == show:
                        is_open = 1
                        name = i.get('name')
                        if name and name != show:
                            show = f'{name}\u2005({show})'
                        parse = i.get('url')
                        break
                if is_open == 0: continue
                urls2 = []
                valid_parts = [part for part in urls.split('#') if part]
                for part in valid_parts:
                    url_prefix, url_suffix = part.split('$', 1)
                    suffix = f"@{parse}" if parse else ''
                    urls2.append(f"{url_prefix}${url_suffix}{suffix}")
                play_urls.append('#'.join(urls2))
                shows.append(show)
            data['vod_play_from'] = '$$$'.join(shows)
            data['vod_play_url'] = '$$$'.join(play_urls)
        return {'list': [data]}

    def playerContent(self, flag, vid, vip_flags):
        raw_url, jx, url = vid, 0, ''
        if '@' in vid:
            raw_url, parse = vid.split('@',1)
            headers = {
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                'Accept-Encoding': "gzip"
            }
            try:
                response = self.fetch(f'{parse}{raw_url}',verify=False, headers=headers).json()
                play_url = response['url']
                if play_url.startswith('http') and play_url != raw_url:
                    url = play_url
            except Exception:
                pass
        if not url:
            url = raw_url
            if re.search(r'(?:www\.iqiyi|v\.qq|v\.youku|www\.mgtv|www\.bilibili)\.com', raw_url):
                jx = 1
        return { 'jx': jx, 'parse': '0', 'url': url, 'header': {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36','Connection':'Keep-Alive','Accept-Encoding':'gzip'}}

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
