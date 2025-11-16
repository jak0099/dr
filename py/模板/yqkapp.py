# -*- coding: utf-8 -*-
# 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
# 严禁将其用于任何商业用途，下载后请于 24 小时内删除，搜索结果均来自源站，本人不承担任何责任。

from base.spider import Spider
import re,sys,uuid,json,hashlib,urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
sys.path.append('..')

class Spider(Spider):
    headers,nextVal,host,appid,appkey,udid,bundlerId,source,version,versionCode = {
        'User-Agent': "Dart/3.1 (dart:io)",
        'Accept-Encoding': "gzip",
        'content-type': "application/json; charset=utf-8"
    },{'search':{'key':'','value':''},'category':{}},'','','','','','','',''

    def init(self, extend=""):
        ext = json.loads(extend)
        hosts,appid,appkey,udid,bundlerId,source,version,versionCode = ext['host'],ext['appId'],ext['appkey'],ext['udid'],ext['bundlerId'],ext['source'],ext['version'],ext['versionCode']
        if not(hosts and appid and appkey and udid and bundlerId and source and version and versionCode): return
        self.appid = appid
        self.appkey = appkey
        self.udid = udid
        self.bundlerId = bundlerId
        self.source = source
        self.version = version
        self.versionCode = versionCode
        hosts_list = hosts.split(',')
        for i in hosts_list:
            if re.match(r'^https?://[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(:\d+)?/?$',i):
                self.host = i
            else:
                try:
                    response = self.fetch(i, headers=self.headers,verify=False).json()
                    for j in response:
                        try:
                            print(j)
                            if j.startswith('http'):
                                self.host = j
                                break
                        except Exception:
                            continue
                    if self.host: break
                except Exception:
                    continue

    def homeContent(self, filter):
        if not self.host: return None
        response = self.post(f'{self.host}/v2/api/home/header', data=self.payload(), headers=self.headers, verify=False).json()
        classes = []
        for i in response['data']['channeList']:
            if isinstance(i,dict):
                classes.append({'type_id': i['channelId'], 'type_name': i['channelName']})
        return {'class': classes}

    def homeVideoContent(self):
        if not self.host: return None
        response = self.post(f'{self.host}/v2/api/home/body', data=self.payload(), headers=self.headers, verify=False).json()
        topic_list = response['data']['vodTopicList']
        videos = []
        for i in topic_list:
            if isinstance(i,dict):
                for j in i['vodList']:
                    try:
                        year = j['flags'].split(' / ')[0].strip()
                    except Exception:
                        year = None
                    videos.append({
                        'vod_id': j['vodId'],
                        'vod_name': j['vodName'],
                        'vod_pic': j['coverImg'],
                        'vod_remarks': j['remark'] or f"评分：{j['score']}",
                        'vod_year': year
                    })
        return {'list': videos}

    def categoryContent(self, tid, pg, filters, extend):
        if not self.host: return None
        if tid.startswith('actor@'):
            if pg != '1': return None
            worker_id = tid.split('actor@',1)[1]
            try:
                worker_id = int(worker_id)
            except Exception:
                worker_id = worker_id
            payload = self.payload({'vodWorkerId':worker_id})
            path = 'vodWorker/detail'
        else:
            cache_nextVal_ = self.nextVal['category'].get(tid)
            if pg != '1' and not cache_nextVal_: return None
            if cache_nextVal_:
                cache_nextVal = cache_nextVal_
            else:
                cache_nextVal = ''
            payload = self.payload({
                'nextCount': 18,
                'nextVal': cache_nextVal,
                'queryValueJson': '[{"filerName":"channelId","filerValue":'+ tid +'}]',
                'sortType': '',
            })
            path = 'search/queryNow'
        response = self.post(f'{self.host}/v1/api/{path}', data=payload, headers=self.headers, verify=False).json()
        data = response['data']
        if data.get('hasNext') == 1:
            nextVal = data['nextVal']
            if nextVal:
                self.nextVal['category'][tid] = nextVal
        else:
            self.nextVal['category'][tid] = ''
        videos =[]
        for i in data.get('items',data.get('vodList',[])):
            try:
                year = i['flags'].split(' / ')[0].strip()
            except Exception:
                year = None
            videos.append({
                'vod_id': i['vodId'],
                'vod_name': i['vodName'],
                'vod_pic': i['coverImg'],
                'vod_remarks': i['remark'] or f"评分：{i['score']}",
                'vod_year': year,
                'vod_content': i['intro']
            })
        return {'list': videos, 'page': pg}

    def searchContent(self, key, quick, pg="1"):
        if not self.host: return None
        if pg != '1': return None
        self.nextVal['search']['value'] = ''
        current_key = self.nextVal['search']['key']
        current_value = self.nextVal['search']['value']
        if current_key == key:
            if current_value == '' and str(pg) != '1':
                return None
            cache_nextVal = current_value or ''
        else:
            self.nextVal['search']['key'] = key
            cache_nextVal = ''
        payload = self.payload({
            "keyword": key,
            "nextVal": cache_nextVal
        })
        response = self.post(f'{self.host}/v1/api/search/search', data=payload, headers=self.headers, verify=False).json()
        data = response['data']
        if data['hasNext'] == 1:
            nextVal = data['nextVal']
            if nextVal:
                self.nextVal['search']['key'] = key
                self.nextVal['search']['value'] = nextVal
        else:
            self.nextVal['search']['value'] = ''
        videos = []
        for i in data['items']:
            try:
                year = i['flags'].split(' / ')[0].strip()
            except Exception:
                year = None
            videos.append({
                'vod_id': i['vodId'],
                'vod_name': i['vodName'],
                'vod_pic': i['coverImg'],
                'vod_remarks': i['remark'] or f"评分：{i['score']}",
                'vod_year': year,
                'vod_content': i['intro']
            })
        return {'list': videos, 'page': pg}

    def detailContent(self, ids):
        try:
            video_id = int(ids[0])
        except Exception:
            video_id = ids[0]
        payload = self.payload({'vodId':video_id})
        response = self.post(f'{self.host}/v2/api/vodInfo/index', data=payload, headers=self.headers, verify=False).json()
        data = response['data']
        play_urls, play_from = [], []
        for i in data['playerList']:
            play_from.append(i['playerName'])
            urls = []
            for j in i['epList']:
                urls.append(f"{j['epName']}${j['epId']}")
            play_urls.append('#'.join(urls))
        video = {
            'vod_id': data['vodId'],
            'vod_name': data['vodName'],
            'vod_pic': data['coverImg'],
            'vod_remarks': data['updateRemark'],
            'vod_year': data['year'],
            'vod_area': data['areaName'],
            'vod_actor': self.actor(data['actorList']),
            'vod_director': self.actor(data['directorList']),
            'vod_content': data['intro'],
            'vod_play_from': '$$$'.join(play_from),
            'vod_play_url': '$$$'.join(play_urls)
        }
        return {'list':[video]}

    def playerContent(self, flag, id, vipFlags):
        try:
            vodEpId = int(id)
        except Exception:
            vodEpId = id
        payload = self.payload({'vodEpId':vodEpId})
        response = self.post(f'{self.host}/v2/api/vodInfo/epDetail', data=payload, headers=self.headers, verify=False).json()
        data = response['data']
        urls = []
        for i in data:
            try:
                showName, vodResolution = i.get('showName'), i.get('vodResolution')
                if showName and vodResolution:
                    payload2 = self.payload({'epId': vodEpId, 'vodResolution': vodResolution})
                    response2 = self.post(f'{self.host}/v2/api/vodInfo/playUrl', data=payload2, headers=self.headers, verify=False).json()
                    url = response2['data']['playUrl']
                    if not url.startswith('http'): continue
                    urls.append(showName)
                    urls.append(url)
            except Exception as e:
                print(e)
                continue
        headers = {
            'User-Agent': "ExoPlayer",
            'Connection': "Keep-Alive",
            'Accept-Encoding': "gzip"
        }
        return {'parse':0,'url':urls,'header':headers}

    def actor(self,data):
        director_list = []
        try:
            for i in data:
                if isinstance(i, dict) and i.get('vodWorkerName'):
                    if i.get('vodWorkerId'):
                        director_list.append(f'[a=cr:{{"id":"actor@{i["vodWorkerId"]}","name":"{i["vodWorkerName"]}"}}/]{i["vodWorkerName"]}[/a]')
                    else:
                        director_list.append(i.get('vodWorkerName'))
            actor = ', '.join(director_list)
        except Exception:
            actor = None
        return actor

    def payload(self, data=None):
        payload = {
            "appId": self.appid,
            "bundlerId": self.bundlerId
        }
        if data: payload.update(data)
        payload.update({
            "cus1tom": "cus3tom",
            "deviceInfo": "xiaomi",
            "osInfo": "15",
            "otherParam": "1",
            "patchNumber": 0,
            "requestId": str(uuid.uuid4()),
            "source": self.source,
            "udid": self.udid,
            "version": self.version,
            "versionCode": self.versionCode
        })
        return json.dumps(self.sign(payload))

    def sign(self, data):
        param_str = self.dict_to_url_params(dict(sorted(data.items())))
        full_str = f"{param_str}&appKey={self.appkey}" if param_str else f"appKey={self.appkey}"
        return {**data, "sign": self.md5(full_str)}

    def dict_to_url_params(self, d):
        return '&'.join(f"{key}={value}" for key, value in d.items() if value != "")

    def md5(self,data):
        md5_hash = hashlib.md5()
        if isinstance(data, int): data = str(data)
        md5_hash.update(data.encode('utf-8'))
        return md5_hash.hexdigest()

    def localProxy(self, param):
        pass

    def getName(self):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass
