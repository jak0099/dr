# coding=utf-8
# !/usr/bin/python
import binascii
import gzip
import hashlib
import re
import sys
import time
from pprint import pprint
from base64 import b64decode, b64encode
from urllib.parse import unquote
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
sys.path.append('..')
from base.spider import Spider


class Spider(Spider):

    def init(self, extend=""):
        # 直接设置host，移除动态获取逻辑
        self.host = 'https://xl01.com.de'
        self.headers['origin'] = self.host

    def getName(self):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass

    xhost = 'https://xl01.com.de/'

    headers = {
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'cache-control': 'no-cache',
        'dnt': '1',
        'priority': 'u=0, i',
        'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; ) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.61 Chrome/126.0.6478.61 Not/A)Brand/8  Safari/537.36',
    }

    def homeContent(self, filter):
        result = {}
        doc = self.pq(self.fetch(f'{self.host}/s/all', headers=self.headers).text)
        hdata = doc('.all-filter-wrapper dl')
        classes = []
        for a in hdata.eq(0).find('a').items():
            tid = a.attr('href').split('=')[-1]
            if a.text() == '不限':
                tid = 'all'
            classes.append({
                "type_id": tid,
                "type_name": '全部' if a.text() == '不限' else a.text()
            })
        filters = {}
        filter_list = []
        filter_configs = [
            {"index": 1, "key": "cate", "split_type": "path"},
            {"index": 2, "key": "area", "split_type": "param"},
            {"index": 3, "key": "year", "split_type": "param"},
            {"index": 4, "key": "order", "split_type": "param"}
        ]
        for config in filter_configs:
            values = []
            for a in hdata.eq(config['index']).find('a').items():
                if a.text() == '不限':
                    continue
                if config['split_type'] == 'path':
                    value = a.attr('href').split('/')[-1].split(';')[0]
                else:
                    value = a.attr('href').split('=')[-1]
                if config['key'] == 'area':
                    value = unquote(value)
                values.append({"n": a.text(), "v": value})
            if values:
                filter_list.append({
                    "key": config['key'],
                    "name": hdata.eq(config['index'])('dt').text()[:-1],
                    "value": values
                })
        for cls in classes:
            filters[cls['type_id']] = filter_list
        result['class'] = classes
        result['filters'] = filters
        return result

    def homeVideoContent(self):
        data = self.pq(self.fetch(self.host, headers=self.headers).text)
        html = data('.container.px-1 .row-cards')
        vods = []
        for i in html.items():
            for j in i('.col-4 .card-link').items():
                vods.append({
                    'vod_id': j('a').attr('href'),
                    'vod_name': j('h3').text(),
                    'vod_pic': j('img').attr('data-src'),
                    'vod_remarks': j('.ribbon-top').text() or j('.text-muted').text()
                })
        return {'list': vods}

    def categoryContent(self, tid, pg, filter, extend):
        params = {
            'type': '' if tid == 'all' else tid,
            'area': extend.get('area', ''),
            'order': extend.get('order', ''),
            'year': extend.get('year', '')
        }
        p = self.build_params(params, True)
        url = f"{self.host}/s/{extend.get('cate', 'all')}/{pg}{f'?{p}' if p else ''}"
        data = self.pq(self.fetch(url, headers=self.headers).text)
        vods = []
        for j in data('.row-cards .card-link').items():
            vods.append({
                'vod_id': j('a').attr('href').split(';')[0],
                'vod_name': j('h3').text(),
                'vod_pic': j('img').attr('src'),
                'vod_remarks': j('.position-absolute').text() or j('.text-muted').text()
            })
        result = {'list': vods, 'page': pg, 'pagecount': 9999, 'limit': 90, 'total': 999999}
        return result

    def detailContent(self, ids):
        try:
            html = self.fetch(f"{self.host}{ids[0]}", headers=self.headers).text
            data = self.pq(html)
            info = {
                'vod_name': data('.d-sm-block').text(),
                'type_name': data('.row.mt-3 .mb-2 p').eq(4).text(),
                'vod_year': data('.bg-purple-lt').eq(0).text(),
                'vod_area': data('.row.mt-3 .mb-2 p').eq(5).text(),
                'vod_remarks': data('.row.mt-3 .mb-2 p').eq(7).text(),
                'vod_actor': data('.row.mt-3 .mb-2 p').eq(3).text(),
                'vod_director': data('.row.mt-3 .mb-2 p').eq(1).text(),
                'vod_content': data('.accordion-collapse .card-body').text()
            }
            play_list = [f'{i.text()}${i.attr("href")}'
                         for i in data('#play-list .d-flex a').items()]
            magnet_list = [f'{j("td").eq(1).text()}${self.e64(j("td").eq(2)("a").attr("href"))}'
                           for j in data('#download-list tr').items()]
            torrent_list = [f'{j("copy").text()}${self.e64(j("a").attr("href"))}'
                            for j in data('#torrent-list ul li').items()]
            play_sources = ['嗷呜播放']
            play_urls = [play_list]

            if magnet_list:
                magnet_list.reverse()
                play_sources.append('嗷呜磁力')
                play_urls.append(magnet_list)
            if torrent_list:
                play_sources.append('嗷呜种子')
                play_urls.append(torrent_list)
            info.update({
                'vod_play_from': '$$$'.join(play_sources),
                'vod_play_url': '$$$'.join('#'.join(urls) for urls in play_urls if urls)
            })
            return {'list': [info]}
        except Exception as e:
            print(f"详情页面解析出错: {str(e)}")
            return {'list': []}

    def searchContent(self, key, quick, pg="1"):
        url = f"{self.host}/search/{key}"
        data = self.pq(self.fetch(url, headers=self.headers).text)
        vods = []
        for j in data('.row-cards .col-12').items():
            id = j('.search-movie-title')
            if id.attr('href'):
                vods.append({
                    'vod_id': id.attr('href'),
                    'vod_pic': j('.object-cover').attr('src'),
                    'vod_name': id.text(),
                    'vod_remarks': j('.mb-md-1').text()
                })
        return {'list': vods, 'page': pg}

    def playerContent(self, flag, id, vipFlags):
        h = self.headers.copy()
        if '播放' in flag:
            data = self.getjx(self.fetch(f"{self.host}{id}", headers=self.headers).text)
            result = []
            line_count = 1
            url_keys = [k for k in data['data'].keys() if 'url' in k.lower() or 'm3u8' in k.lower()]
            for key in url_keys:
                value = data['data'][key]
                urls = value.split(',')
                for url in urls:
                    if '#' in url:
                        url_part, name = url.split('#')
                        if '.jpeg' in url_part or '.jpg' in url_part or '.png' in url_part or '.m3u8' in url_part:
                            url_part = self.Mproxy(url_part)
                        result.extend([f'线路{line_count}({name})', url_part])
                        line_count += 1
                    else:
                        if url.endswith('.png'):
                            url = self.Mproxy(url)
                        result.extend([f"线路{line_count}", url])
                        line_count += 1
        elif '种子' in flag:
            result = f'{self.host}{self.d64(id)}'
        else:
            result = self.d64(id)
        return {'parse': 0, 'url': result, 'header': h}

    def localProxy(self, param):
        url = b64decode(param["url"]).decode('utf-8')
        y = self.fetch(url, headers=self.headers, allow_redirects=False)
        data = y.text
        yhost = url[:url.rfind('/')]
        if '#EXT' not in data:
            base64_str = b64encode(y.content).decode('utf-8')
            zip_data = re.search(r'H4sI.*', base64_str).group(0)
            decoded_data = b64decode(zip_data)
            data = gzip.decompress(decoded_data).decode('utf-8')
            yhost = 'https://vod.xlys.me/'
        lines = data.split('\n')
        new_lines = []
        for line in lines:
            line = line.strip()
            if not line.startswith('#EX') and not line.startswith('http') and line:
                new_lines.append(f'{yhost}{line}')
            else:
                new_lines.append(line)
        new_url = '\n'.join(new_lines)
        return [200, "application/vnd.apple.mpegur", new_url]

    def gethost(self):
        # 移除动态获取host的逻辑，直接返回固定host
        return 'https://xl01.com.de/'

    def getjx(self, input_str):
        try:
            pid = re.search(r'var pid = (\d+);', input_str).group(1)
            current_time = int(time.time() * 1000)
            str4 = f"{pid}-{current_time}"
            md5_hash = hashlib.md5(str4.encode()).hexdigest()
            md5_hash = md5_hash.zfill(32).lower()
            key = md5_hash[:16].encode('utf-8')
            cipher = AES.new(key, AES.MODE_ECB)
            padded_data = pad(str4.encode('utf-8'), AES.block_size)
            encrypted = cipher.encrypt(padded_data)
            encrypted_hex = binascii.hexlify(encrypted).decode('utf-8').upper()
            lines_url = f"{self.host}/lines?t={current_time}&sg={encrypted_hex}&pid={pid}"
            data = self.fetch(lines_url, headers=self.headers).json()
            return data
        except Exception as e:
            print(f"Error in get_lines_url: {e}")
            return None


if __name__ == "__main__":
    sp = Spider()
    formatJo = sp.init([])
    # formatJo = sp.homeContent(False)  # 主页，等于真表示启用筛选
    # formatJo = sp.homeVideoContent()  # 主页视频
    # formatJo = sp.searchContent("斗罗", False, '1') # 搜索{"area":"大陆","by":"hits","class":"国产","lg":"国语"}
    # formatJo = sp.categoryContent('all', '1', False, {'year': '2024'})  # 分类
    # formatJo = sp.detailContent(['/guoju/25132.htm'])  # 详情
    # formatJo = sp.playerContent("", "/play/25766-0.htm", {}) # 播放
    # formatJo = sp.localProxy({"url": "aHR0cHM6Ly92b2QueGx5cy5jYy51YS9obHNfc3RhcjNfODdmN2I5MWYtZjhjNS00MjkwLTliZTMtZmIwZTFlOTRmNGJlLm0zdTgucG5n"}) # 播放
    pprint(formatJo)
