import requests
import json
import re
import time
import datetime
from urllib.parse import quote, unquote
from base.spider import Spider

class Spider(Spider):
    name = "西饭短剧"
    host = "https://xifan-api-cn.youlishipin.com"
    
    def __init__(self):
        super().__init__()
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 8.0; DUK-AL20 Build/HUAWEIDUK-AL20; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044353 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/WIFI Language/zh_CN Process/tools'
        }
        self.session_params = "&session=eyJpbmZvIjp7InVpZCI6IiIsInJ0IjoiMTc0MDY1ODI5NCIsInVuIjoiT1BHXzFlZGQ5OTZhNjQ3ZTQ1MjU4Nzc1MTE2YzFkNzViN2QwIiwiZnQiOiIxNzQwNjU4Mjk0In19&feedssession=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1dHlwIjowLCJidWlkIjoxNjMzOTY4MTI2MTQ4NjQxNTM2LCJhdWQiOiJkcmFtYSIsInZlciI6MiwicmF0IjoxNzQwNjU4Mjk0LCJ1bm0iOiJPUEdfMWVkZDk5NmE2NDdlNDUyNTg3NzUxMTZjMWQ3NWI3ZDAiLCJpZCI6IjNiMzViZmYzYWE0OTgxNDQxNDBlZjI5N2JkMDY5NGNhIiwiZXhwIjoxNzQxMjYzMDk0LCJkYyI6Imd6cXkifQ.JS3QY6ER0P2cQSxAE_OGKSMIWNAMsYUZ3mJTnEpf-Rc"
    
    def getName(self):
        return self.name

    def init(self, extend):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def homeContent(self, filter):
        return {
            "class": [
                {"type_id": "%E9%83%BD%E5%B8%82", "type_name": "都市"},
                {"type_id": "%E9%9D%92%E6%98%A5", "type_name": "青春"},
                {"type_id": "%E7%8E%B0%E4%BB%A3", "type_name": "现代"},
                {"type_id": "%E8%B1%AA%E9%97%A8", "type_name": "豪门"},
                {"type_id": "%E9%80%86%E8%A2%AD", "type_name": "逆袭"},
                {"type_id": "%E7%A9%BF%E8%B6%8A", "type_name": "穿越"},
                {"type_id": "%E6%89%93%E8%84%B8%E8%99%90%E6%B8%A3", "type_name": "打脸"}
            ]
        }

    def homeVideoContent(self):
        videos = []
        current_timestamp = int(datetime.datetime.now().timestamp())

        try:
            url = f"{self.host}/xifan/drama/portalPage?reqType=aggregationPage&offset=0&quickEngineVersion=-1&scene=&categoryNames=&categoryVersion=&density=1.5&pageID=page_theater&version=2001001&androidVersionCode=28&requestId={current_timestamp}d4aa487d53e646c2&appId=drama&teenMode=false&userBaseMode=false&session=eyJpbmZvIjp7InVpZCI6IiIsInJ0IjoiMTc0MDY0NjA2MiIsInVuIjoiT1BHXzYzZTYyMTdhZGJhMDQ4NGI5OWNmYTdkOWMyNmU2NTIwIiwiZnQiOiIxNzQwNjQ2MDYyIn19&feedssession=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1dHlwIjowLCJidWlkIjoxNjMzODY1NTEzMDAzNzYyNjg4LCJhdWQiOiJkrmFtYSIsInZlciI6MiwicmF0IjoxNzQwNjQ2MDYyLCJ1bm0iOiJPUEdfNjNlNjIxN2FkYmEwNDg0Yjk5Y2ZhN2Q5YzI2ZTY1MjAiLCJpZCI6Ijg4MmM2M2U3ZDRhYTQ4N2Q1M2U2NDZjMjQxMjg0NTcxIiwiZXhwIjoxNzQxMjUwODYyLCJkYyI6ImJqaHQifQ.zWhF-1Y92_NwuTzUQ_5dNoJwJN8g6UbMfVuH2QrSjjQ"
            response = requests.get(url=url, headers=self.headers)
            if response.status_code == 200:
                response_data = response.json()
                js = response_data['result']['elements']

                for soups in js:
                    for vod in soups['contents']:
                        name = vod['duanjuVo']['title']
                        id = vod['duanjuVo']['duanjuId']
                        id1 = vod['duanjuVo']['source']
                        pic = vod['duanjuVo']['coverImageUrl']
                        total_episodes = vod['duanjuVo'].get('total', '')
                        remark = f"{total_episodes}集" if total_episodes else ""

                        video = {
                            "vod_id": id + "#" + id1,
                            "vod_name": name,
                            "vod_remarks": remark,
                            "vod_pic": pic
                        }
                        videos.append(video)

            result = {'list': videos}
            return result
        except Exception as e:
            print(f"获取首页推荐失败: {e}")
            return {'list': []}

    def categoryContent(self, cid, pg, filter, ext):
        return self.getVideosByCategory(cid, pg)

    def getVideosByCategory(self, cid, pg):
        result = {}
        videos = []
        
        page = (int(pg) - 1) * 30
        current_timestamp = int(time.time())
        
        if cid and ('%E9%83%BD%E5%B8%82' in cid or '%E9%9D%92%E6%98%A5' in cid or '%E7%8E%B0%E4%BB%A3' in cid):
            category_id = "68"
        else:
            category_id = "67"
            
        url = f"{self.host}/xifan/drama/portalPage?reqType=aggregationPage&offset={page}&categoryId={category_id}&quickEngineVersion=-1&scene=&categoryNames={cid}&categoryVersion=1&density=1.5&pageID=page_theater&version=2001001&androidVersionCode=28&requestId={current_timestamp}aa498144140ef297&appId=drama&teenMode=false&userBaseMode=false{self.session_params}"
        
        try:
            response = requests.get(url=url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                elements = data.get('result', {}).get('elements', [])
                
                for element in elements:
                    contents = element.get('contents', [])
                    for vod in contents:
                        duanjuVo = vod.get('duanjuVo', {})
                        if duanjuVo:
                            video = {
                                "vod_id": f"{duanjuVo.get('duanjuId', '')}#{duanjuVo.get('source', '')}",
                                "vod_name": duanjuVo.get('title', ''),
                                "vod_remarks": f"{duanjuVo.get('total', '')}集",
                                "vod_pic": duanjuVo.get('coverImageUrl', '')
                            }
                            videos.append(video)
        except Exception as e:
            print(f"获取视频列表失败: {e}")
        
        result['list'] = videos
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def detailContent(self, ids):
        did = ids[0]
        result = {}
        videos = []
        
        if '#' in did:
            duanjuId, source = did.split("#")
        else:
            duanjuId, source = did, ""
            
        url = f"{self.host}/xifan/drama/getDuanjuInfo?duanjuId={duanjuId}&source={source}&openFrom=homescreen&type=&pageID=page_inner_flow&density=1.5&version=2001001&androidVersionCode=28&requestId=1740658944980aa498144140ef297&appId=drama&teenMode=false&userBaseMode=false{self.session_params}"
        
        try:
            response = requests.get(url=url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                result_data = data.get('result', {})
                
                playUrls = []
                episodeList = result_data.get('episodeList', [])
                for ep in episodeList:
                    playUrls.append(f"{ep.get('title', '')}${ep.get('playUrl', '')}")
                
                vod_info = {
                    "vod_id": did,
                    "vod_name": result_data.get('title', ''),
                    "vod_pic": result_data.get('coverImageUrl', ''),
                    "vod_content": result_data.get('qualification', result_data.get('desc', '暂无简介')),
                    "vod_remarks": f"{result_data.get('total', '')}集",
                    "vod_play_from": "西饭短剧",
                    "vod_play_url": "#".join(playUrls)
                }
                
                videos.append(vod_info)
        except Exception as e:
            print(f"获取详情失败: {e}")
        
        result['list'] = videos
        return result

    def playerContent(self, flag, id, vipFlags):
        result = {}
        result["parse"] = 0
        result["playUrl"] = ''
        result["url"] = id
        result["header"] = self.headers
        return result

    def searchContent(self, key, quick, pg="1"):
        return self.searchContentPage(key, quick, pg)

    def searchContentPage(self, key, quick, page):
        result = {}
        videos = []
        
        current_timestamp = int(time.time())
        url = f"{self.host}/xifan/search/getSearchList?keyword={key}84&pageIndex={page}&version=2001001&androidVersionCode=28&requestId={current_timestamp}ea3a14bc0317d76f&appId=drama&teenMode=false&userBaseMode=false{self.session_params}"
        
        try:
            response = requests.get(url=url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                elements = data.get('result', {}).get('elements', [])
                
                for element in elements:
                    contents = element.get('contents', [])
                    for vod in contents:
                        duanjuVo = vod.get('duanjuVo', {})
                        if duanjuVo:
                            video = {
                                "vod_id": f"{duanjuVo.get('duanjuId', '')}#{duanjuVo.get('source', '')}",
                                "vod_name": duanjuVo.get('title', ''),
                                "vod_remarks": f"{duanjuVo.get('total', '')}集",
                                "vod_pic": duanjuVo.get('coverImageUrl', '')
                            }
                            videos.append(video)
        except Exception as e:
            print(f"搜索失败: {e}")
        
        result['list'] = videos
        result['page'] = page
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def localProxy(self, params):
        if params['type'] == "m3u8":
            return self.proxyM3u8(params)
        elif params['type'] == "media":
            return self.proxyMedia(params)
        elif params['type'] == "ts":
            return self.proxyTs(params)
        return None