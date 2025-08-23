# 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
# 严禁将其用于任何商业用途，下载后请于 24 小时内删除，搜索结果均来自源站，本人不承担任何责任。

import sys
from base.spider import Spider
sys.path.append('..')

class Spider(Spider):
    headers = {
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        'Accept-Encoding': "gzip"
    }
    host = 'https://api.xingzhige.com'

    def init(self, extend=''):
        ext = extend.strip()
        if ext.startswith('http'):
            self.host = 'ext'

    def homeContent(self, filter):
        return {'class': [{'type_id': '逆袭', 'type_name': '逆袭'}, {'type_id': '总裁', 'type_name': '总裁'}, {'type_id': '奇幻脑洞', 'type_name': '奇幻脑洞'}, {'type_id': '战斗热血', 'type_name': '战斗热血'},{'type_id': '时空穿越', 'type_name': '时空穿越'}, {'type_id': '权谋身份', 'type_name': '权谋身份'}]}

    def search(self,key,pg=1):
        response = self.fetch(f'{self.host}/API/playlet/?keyword={key}&page={pg}', headers=self.headers).json()
        data = response['data']
        videos = []
        for i in data:
            videos.append({
                'vod_id': i.get('book_id'),
                'vod_name': i.get('title'),
                'vod_pic': i.get('cover'),
                'vod_remarks': i.get('type')
            })
        return {'list': videos, 'page': pg}

    def homeVideoContent(self):
        return self.search('热门')

    def detailContent(self, ids):
        response = self.fetch(f'{self.host}/API/playlet/?book_id={ids[0]}', headers=self.headers).json()
        data = response['data']
        detail = data['detail']
        vod_play_url = ''
        for i in data['video_list']:
            vod_play_url += f"{i.get('title','')}${i.get('video_id','')}#"
        vod_play_url.rstrip('#')
        videos = []

        videos.append({
            'vod_id': detail.get('book_id'),
            'vod_name': detail.get('title'),
            'vod_content': detail.get('desc'),
            'vod_remarks': '集数：' + str(detail.get('total')),
            'vod_area': detail.get('vod_area'),
            'vod_play_from': '星之阁',
            'vod_play_url': vod_play_url
        })
        return {'list': videos}

    def searchContent(self, key, quick, pg=1):
        return self.search(key,pg)

    def categoryContent(self, tid, pg, filter, extend):
        return self.search(tid,pg)

    def playerContent(self, flag, id, vipFlags):
        response = self.fetch(f'{self.host}/API/playlet/?video_id={id}&quality=1080p', headers=self.headers).json()
        data = response['data']
        return {'jx': 0, 'parse': 0, 'url': data['video']['url'],'header': {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'}}

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