# -*- coding: utf-8 -*-
import re
import json
import time
import random
import requests
from urllib.parse import urljoin
from pyquery import PyQuery as pq
from base64 import b64encode

class Keke5Spider(Spider):  # 继承标准Spider基类

    def init(self, extend=""):
        self.base_url = "https://www.keke5.app"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
        }
        self.cate_mapping = {}  # 分类ID缓存
        self.proxy_enable = False  # 代理开关

    def homeContent(self, filter):
        doc = self._fetch_html("/")
        if not doc: return []
        
        # 分类导航解析
        categories = []
        for item in doc('.nav-item a[href*="/type/"]').items():
            cate_id = re.search(r'/type/(\d+)', item.attr('href')).group(1)
            self.cate_mapping[cate_id] = item.text()
            categories.append({
                'type_name': item.text(),
                'type_id': cate_id
            })
        
        # 推荐视频解析
        videos = []
        for item in doc('.video-list .video-item').items():
            vid = re.search(r'/detail/(\d+)', item.find('a').attr('href')).group(1)
            videos.append({
                'vod_id': vid,
                'vod_name': item.find('.title').text(),
                'vod_pic': self._fix_url(item.find('img').attr('src')),
                'vod_remarks': item.find('.status').text()
            })
            
        return {
            'class': categories,
            'list': videos,
            'filters': self._build_filters()  # 动态生成过滤条件
        }

    def categoryContent(self, tid, pg, filter, extend):
        params = {
            'page': pg,
            'year': extend.get('year', ''),
            'area': extend.get('area', ''),
            'sort': extend.get('sort', 'time') 
        }
        doc = self._fetch_html(f"/type/{tid}", params=params)
        videos = []
        
        for item in doc('.video-list .video-item').items():
            vid = re.search(r'/detail/(\d+)', item.find('a').attr('href')).group(1)
            videos.append({
                'vod_id': vid,
                'vod_name': item.find('.title').text(),
                'vod_pic': self._fix_url(item.find('img').attr('src')),
                'vod_year': item.find('.year').text(),
                'vod_remarks': f"{item.find('.score').text()}分"
            })
            
        return {
            'page': pg,
            'pagecount': self._get_max_page(doc),
            'list': videos
        }

    def detailContent(self, ids):
        doc = self._fetch_html(f"/detail/{ids[0]}")
        if not doc: return {}
        
        # 多播放源解析
        play_list = []
        for source in doc('.play-tab').items():
            source_name = source.text()
            episodes = []
            for ep in doc(f'div[data-source="{source.attr("data-target")}"] a').items():
                episodes.append(f"{ep.text()}${self._encode_url(ep.attr('href'))}")
                
            play_list.append({
                'flag': source_name,
                'episodes': episodes
            })
        
        return {
            'list': [{
                'vod_name': doc('h1.title').text(),
                'vod_pic': self._fix_url(doc('.cover img').attr('src')),
                'vod_year': doc('.info-item:contains("年份")').text().split("：")[1],
                'vod_director': doc('.info-item:contains("导演") a').text(),
                'vod_actor': ' '.join(doc('.info-item:contains("主演") a').map(lambda i: pq(this).text())),
                'vod_play_from': '#'.join([p['flag'] for p in play_list]),
                'vod_play_url': '#'.join(['$'.join(p['episodes']) for p in play_list])
            }]
        }

    def searchContent(self, key, quick, pg=1):
        resp = requests.post(
            urljoin(self.base_url, "/search"),
            data={'kw': key, 'page': pg},
            headers=self.headers
        )
        doc = pq(resp.json().get('html', ''))
        
        return {
            'list': [{
                'vod_id': re.search(r'/detail/(\d+)', pq(this).attr('href')).group(1),
                'vod_name': pq(this).find('.title').text(),
                'vod_pic': self._fix_url(pq(this).find('img').attr('src')),
                'vod_remarks': pq(this).find('.status').text()
            } for item in doc('.search-item').items()]
        }

    def playerContent(self, flag, id, vipFlags):
        # 智能解析播放地址
        decoded_url = self._decode_url(id)
        if 'iframe' in decoded_url:
            real_url = self._parse_iframe(decoded_url)
        else:
            real_url = self._direct_parse(decoded_url)
            
        return {
            'parse': 0 if real_url.startswith('http') else 1,
            'url': real_url
        }

    # 辅助方法 --------------------------------------------------
    def _build_filters(self):
        return {
            "year": self._get_filter_values('/filter?type=year'),
            "area": self._get_filter_values('/filter?type=area'),
            "sort": [{'n': '时间', 'v': 'time'}, {'n': '评分', 'v': 'score'}]
        }
        
    def _get_filter_values(self, path):
        doc = self._fetch_html(path)
        return [{'n': item.text(), 'v': item.attr('data-val')} 
               for item in doc('.filter-item').items()]

    def _parse_iframe(self, url):
        doc = self._fetch_html(url)
        return doc('video source').attr('src') or doc('iframe').attr('src')

    def _direct_parse(self, url):
        return re.sub(r'//.*?/', '//real.media/', url)  # 示例伪代码

    def _encode_url(self, url):
        return b64encode(urljoin(self.base_url, url).encode()).decode()

    def _decode_url(self, code):
        return b64decode(code).decode()

    def _fetch_html(self, path, params=None):
        try:
            resp = requests.get(
                urljoin(self.base_url, path),
                params=params,
                headers=self.headers,
                timeout=10
            )
            return pq(resp.content.decode('utf-8', 'ignore'))
        except Exception as e:
            self.log(f"请求失败: {path} | 错误: {str(e)}")
            return pq('')
