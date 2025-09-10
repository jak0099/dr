# 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
# 严禁将其用于任何商业用途，下载后请于 24 小时内删除，搜索结果均来自源站，本人不承担任何责任。

import re,sys,json,urllib3
from base.spider import Spider
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
sys.path.append('..')

class Spider(Spider):
    headers, host, detail_token, parse = {
        'User-Agent': "okhttp/4.12.0",
        'Accept-Encoding': "gzip",
        'content-type': "application/json",
        'cache-control': "no-cache"
    }, '','',{}

    def init(self, extend=""):
        try:
            ext = json.loads(extend.strip())
            self.host = ext.get('host','https://video.xqkk.app')
            self.detail_token = ext.get('detailToken','osmqrsifhjxaftgzyugrychr')
            self.parse = ext.get('parse',{})
            return None
        except Exception as e:
            return None

    def homeContent(self, filter):
        if not self.host: return None
        response = self.fetch(f'{self.host}/index.php/appapi/init', headers=self.headers, verify=False).json()
        data = response['data']
        type_list = data['type_list']
        classes = []
        for i in type_list:
            if isinstance(i,dict):
                classes.append({'type_id': i['type_id'], 'type_name': i['type_name']})
        videos = []
        banner_list = data.get('banner_list',[])
        if isinstance(banner_list, list):
            for i in banner_list:
                link_type = i.get('link_type')
                if link_type == 1:
                    videos.append({
                        'vod_name': i.get('title'),
                        'vod_pic': i.get('img_url'),
                        'vod_id': i.get('link_value')
                    })
        for j in type_list:
            recommend_list = j.get('recommend_list')
            if isinstance(recommend_list,list):
                videos.extend(recommend_list)
        return {'class': classes, 'list': videos}

    def categoryContent(self, tid, pg, filter, extend):
        response = self.fetch(f"{self.host}/index.php/appapi/typeFilterVodList?type_pid=0&page={pg}&class={extend.get('class','全部')}&year={extend.get('year','')}&area={extend.get('area','')}&lang={extend.get('lang','')}&sort={extend.get('sort','最热')}&type_id={tid}", headers=self.headers, verify=False).json()
        return {'list': response['data'], 'page': pg}

    def searchContent(self, key, quick, pg='1'):
        response = self.fetch(f"{self.host}/index.php/appapi/searchList?type_id=0&keywords={key}&page={pg}", headers=self.headers, verify=False).json()
        data = response['data']
        for i in data:
            if 'vod_blurb' in i and 'vod_content'  not in i:
                i['vod_content'] = i['vod_blurb']
        return {'list': data, 'page': pg}

    def detailContent(self, ids):
        response = self.fetch(f"{self.host}/index.php/appapi/vodDetail?vod_id={ids[0]}&token={self.detail_token}",headers=self.headers, verify=False).json()
        data = response['data']
        video = data['vod']
        if 'vod_blurb' in video and 'vod_content' not in video:
            video['vod_content'] = video['vod_blurb']
        play_from_list = []
        play_urls_list = []
        for item in data.get('vod_play_list', []):
            play_from_name = item['play_from_name']
            play_from_code = item['play_from_code']
            if play_from_name != play_from_code:
                play_from_list.append(f'{play_from_name} ({play_from_code})')
            else:
                play_from_list.append(play_from_name)
            urls = []
            for url_info in item.get('play_urls', []):
                urls.append(f"{url_info['name']}${play_from_code}@{url_info['url']}")
            play_urls_list.append('#'.join(urls))
        video['vod_play_from'] = '$$$'.join(play_from_list)
        video['vod_play_url'] = '$$$'.join(play_urls_list)
        return {'list': [video]}

    def playerContent(self, flag, id, vipflags):
        jx,url = 0,''
        parse = self.parse
        play_from, raw_url = id.split('@')
        if parse:
            for i,j in parse.items():
                if play_from in i:
                    for k in j:
                        try:
                            response = self.fetch(f'{k}{raw_url}', headers=self.headers, verify=False).json()
                            play_url = response['url']
                            if play_url.startswith('http'):
                                url,jx = play_url, 0
                                break
                        except (KeyError, ValueError, Exception):
                            continue
                    if url.startswith('http'):
                        break
        if not url:
            if re.match(r'https?:\/\/.*\.(m3u8|mp4|flv)', raw_url):
                jx, url = 0, raw_url
            else:
                jx, url = 1, raw_url
        if url.startswith('NBY'):
            jx, url = 0, ''
        return { 'jx': jx, 'parse': '0', 'url': url, 'header': {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'}}

    def homeVideoContent(self):
        pass

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
