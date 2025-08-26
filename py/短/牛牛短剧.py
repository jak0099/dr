# coding = utf-8
# !/usr/bin/python

"""

作者 丢丢喵推荐 🚓 内容均从互联网收集而来 仅供交流学习使用 版权归原创者所有 如侵犯了您的权益 请通知作者 将及时删除侵权内容
                    ====================Diudiumiao====================

"""

from base.spider import Spider
import requests
import sys

sys.path.append('..')

xurl = "https://new.tianjinzhitongdaohe.com"

headers = {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json;charset=UTF-8",
    "User-Agent": "okhttp/4.12.0"
}

headerx = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36'
}

class Spider(Spider):
    global xurl
    global headers
    global headerx

    def getName(self):
        return "蓝莓短剧[短]"

    def init(self, extend):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def homeContent(self, filter):
        result = {"class": []}

        try:
            payload = {}
            url = f"{xurl}/api/v1/app/screen/screenType"
            response = requests.post(url=url, headers=headers, json=payload, timeout=10)
            if response.status_code == 200:
                data = response.json()

                if data.get('data') and len(data['data']) > 0:
                    if data['data'][0].get('children') and len(data['data'][0]['children']) > 0:
                        if data['data'][0]['children'][0].get('children'):
                            setup = data['data'][0]['children'][0]['children']

                            for vod in setup:
                                name = vod['name']
                                result["class"].append({"type_id": name, "type_name": name})
            
            return result
        except:
            fixed_categories = ["都市", "穿越", "逆袭", "总裁", "虐恋", "甜宠", "重生", "玄幻"]
            for cat in fixed_categories:
                result["class"].append({"type_id": cat, "type_name": cat})
            return result

    def homeVideoContent(self):
        result = {}
        videos = []
        
        try:
            payload = {
                "condition": {
                    "classify": "都市",
                    "typeId": "S1"
                },
                "pageNum": "1",
                "pageSize": 20
            }
            
            url = f"{xurl}/api/v1/app/screen/screenMovie"
            response = requests.post(url=url, headers=headers, json=payload, timeout=10)
            if response.status_code == 200:
                data = response.json()
                
                if data.get('data') and data['data'].get('records'):
                    setup = data['data']['records']
                    
                    for vod in setup:
                        name = vod['name']
                        id = vod['id']
                        pic = vod['cover']
                        remark = f"{vod.get('totalEpisode', '0')}集" if 'totalEpisode' in vod else vod.get('classify', '短剧')
                        
                        video = {
                            "vod_id": id,
                            "vod_name": name,
                            "vod_pic": pic,
                            "vod_remarks": remark
                        }
                        videos.append(video)
            
            result = {'list': videos}
            return result
        except:
            return {'list': []}

    def categoryContent(self, cid, pg, filter, ext):
        result = {}
        videos = []

        try:
            if pg:
                page = int(pg)
            else:
                page = 1

            payload = {
                "condition": {
                    "classify": cid,
                    "typeId": "S1"
                },
                "pageNum": str(page),
                "pageSize": 40
            }

            url = f"{xurl}/api/v1/app/screen/screenMovie"
            response = requests.post(url=url, headers=headers, json=payload, timeout=10)
            if response.status_code == 200:
                data = response.json()
                
                if data.get('data') and data['data'].get('records'):
                    setup = data['data']['records']

                    for vod in setup:
                        name = vod['name']
                        id = vod['id']
                        pic = vod['cover']
                        remark = f"{vod.get('totalEpisode', '0')}集" if 'totalEpisode' in vod else vod.get('classify', '短剧')

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
            result['limit'] = 40
            result['total'] = 999999
            return result
        except:
            result = {'list': []}
            result['page'] = pg
            result['pagecount'] = 1
            result['limit'] = 40
            result['total'] = 0
            return result

    def detailContent(self, ids):
        did = ids[0]
        result = {}
        videos = []
        xianlu = ''
        bofang = ''

        try:
            payload = {
                "id": did,
                "source": 0,
                "typeId": "S1",
                "userId": "223664"
            }

            url = f"{xurl}/api/v1/app/play/movieDetails"
            response = requests.post(url=url, headers=headers, json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                vod_data = data.get('data', {})
                
                content = vod_data.get('introduce', '暂无剧情介绍')
                vod_name = vod_data.get('name', '未知名称')
                vod_pic = vod_data.get('cover', '')
                
                if 'episodeList' in vod_data and vod_data['episodeList']:
                    for episode in vod_data['episodeList']:
                        episode_name = episode.get('episode', '')
                        episode_id = episode.get('id', '')
                        bofang += f"{episode_name}${did}@{episode_id}#"
                    
                    if bofang:
                        bofang = bofang[:-1]
                        xianlu = '蓝莓短剧'
            
            videos.append({
                "vod_id": did,
                "vod_name": vod_name,
                "vod_pic": vod_pic,
                "vod_content": content,
                "vod_play_from": xianlu,
                "vod_play_url": bofang
            })

            result['list'] = videos
            return result
        except:
            videos.append({
                "vod_id": did,
                "vod_name": "加载失败",
                "vod_pic": "",
                "vod_content": "详情加载失败，请稍后重试",
                "vod_play_from": "暂无资源",
                "vod_play_url": "暂无播放地址$0"
            })
            result['list'] = videos
            return result

    def playerContent(self, flag, id, vipFlags):
        try:
            fenge = id.split("@")
            
            if len(fenge) < 2:
                return {
                    "parse": 0,
                    "playUrl": '',
                    "url": '',
                    "header": headerx
                }

            payload = {
                "episodeId": fenge[1],
                "id": fenge[0],
                "source": 0,
                "typeId": "S1",
                "userId": "223664"
            }

            url = f"{xurl}/api/v1/app/play/movieDetails"
            response = requests.post(url=url, headers=headers, json=payload, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('data') and data['data'].get('url'):
                    url = data['data']['url']
                else:
                    url = ''
            else:
                url = ''

            result = {}
            result["parse"] = 0
            result["playUrl"] = ''
            result["url"] = url
            result["header"] = headerx
            return result
        except:
            return {
                "parse": 0,
                "playUrl": '',
                "url": '',
                "header": headerx
            }

    def searchContentPage(self, key, quick, pg):
        result = {}
        videos = []

        try:
            if pg:
                page = int(pg)
            else:
                page = 1

            payload = {
                "condition": {
                    "typeId": "S1",
                    "value": key
                },
                "pageNum": str(page),
                "pageSize": 40
            }

            url = f"{xurl}/api/v1/app/search/searchMovie"
            response = requests.post(url=url, headers=headers, json=payload, timeout=10)
            if response.status_code == 200:
                data = response.json()
                
                if data.get('data') and data['data'].get('records'):
                    setup = data['data']['records']

                    for vod in setup:
                        name = vod['name']
                        id = vod['id']
                        pic = vod['cover']
                        remark = vod.get('year', '未知')

                        video = {
                            "vod_id": id,
                            "vod_name": name,
                            "vod_pic": pic,
                            "vod_remarks": remark
                        }
                        videos.append(video)

            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 40
            result['total'] = 999999
            return result
        except:
            result['list'] = []
            result['page'] = pg
            result['pagecount'] = 1
            result['limit'] = 40
            result['total'] = 0
            return result

    def searchContent(self, key, quick, pg="1"):
        return self.searchContentPage(key, quick, pg)

    def localProxy(self, params):
        return None