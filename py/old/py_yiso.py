#coding=utf-8
#!/usr/bin/python
import os
import sys
import time
import json
import requests
from base64 import b64encode
from collections import OrderedDict

sys.path.append('..')
from base.spider import Spider

class Spider(Spider):
	def getName(self):
		return "Yiso"
	def init(self,extend):
		self.ali = extend[0]
		print("============{0}============")
		pass
	def isVideoFormat(self,url):
		pass
	def manualVideoCheck(self):
		pass
	def homeContent(self,filter):
		result = {}
		return result
	def homeVideoContent(self):
		result = {}
		return result
	def categoryContent(self,tid,pg,filter,extend):
		result = {}
		return result

	def detailContent(self,array):
		hashMap = {}
		dirname = ''
		ids = array[0].split('@@@')
		self.listFiles(hashMap, dirname, [ids[1]])
		if not hashMap:
			return {}
		sortedMap = sorted(hashMap.items(), key=lambda x: x[0])
		vod = {
			"vod_id": array[0],
			"vod_name": ids[0],
			"vod_pic": 'https://p2.itc.cn/q_70/images03/20211009/59c75745d3524163b9277c4006020ac0.jpeg',
			"type_name": "",
			"vod_year": "",
			"vod_area": "",
			"vod_remarks": "",
			"vod_actor": "",
			"vod_director": "",
			"vod_content": ""
		}
		vod['vod_play_from'] = '原画$$$超清'
		vod_play_url = ''
		YHplayurl = ''
		CQplayurl = ''
		subDict = {}
		nameList = []
		for sm in sortedMap:
			if 'subtitles' in sm:
				for subList in sm[1]:
					subDict.update({os.path.splitext(subList['name'])[0]: sm[1].index(subList)})
			else:
				name = sm[0]
				sm[1][0]['params']['downloader_switch'] = 'True'
				YHurl = 'Docker域名或IP:端口/ali_resolve?item=' + b64encode(
					json.dumps(sm[1][0]['params']).encode("utf-8")).decode("utf-8")
				CQurl = 'Docker域名或IP:端口/ali_resolve?item=' + b64encode(
					json.dumps(sm[1][1]['params']).encode("utf-8")).decode("utf-8")
				YHplayurl = '{}#{}${}'.format(YHplayurl, name, YHurl)
				CQplayurl = '{}#{}${}'.format(CQplayurl, name, CQurl)
				name = name.split('/')[0]
				if ']|' in name:
					name = name.split('|')[1]
				nameList.append(name)
			for nL in nameList:
				for sbkey in subDict:
					if os.path.splitext(nL)[0] in sbkey:
						value = json.dumps(sm[1][subDict[sbkey]]['params'])
						requests.post('Docker域名或IP:端口/cache', params={'key': 'alisub', }, data=value,  headers={'Content-Length': str(len(value))})
		vod['vod_play_url'] = YHplayurl.strip('#') + '$$$' + CQplayurl.strip('#')
		result = {
			'list': [vod]
		}
		return result

	def listFiles(self, map, dirname, list):
		header = {
			"User-Agent": "Mozilla/5.0 (Linux; Android 12; V2049A Build/SP1A.210812.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Mobile Safari/537.36"
		}
		parent_item = {
			'id': list[0],
			'params': {}
		}
		url = 'Docker域名或IP:端口/ali_list?item=' + b64encode(json.dumps(parent_item).encode("utf-8")).decode("utf-8") + '&display_file_size=True'
		rsp = self.fetch(url, headers=header)
		while rsp.status_code != 200:
			time.sleep(1)
			rsp = self.fetch(url, headers=header)
		if rsp.text in ['Erro', 'Token', 'Session', 'Lapse', 'None']:
			return {}
		jo = json.loads(rsp.text)
		folderList = []
		dirnameList = []
		subtitlesList = []
		for info in jo:
			if dirname != '' and not dirname.startswith('['):
				dirname = '[' + dirname + ']|'
			if info['params']['file_type'] == 'folder':
				folderList.append(info['id'])
				dirnameList.append(info['name'])
			else:
				size = '/[{}]'.format(info['description'].split('\n')[0].split('：')[1])
				map[dirname + info['name'] + size] = info['sources']
				if info['subtitles'] != [] and info['subtitles'][0] not in subtitlesList:
					subtitlesList = subtitlesList + info['subtitles']
		if len(subtitlesList) > 0:
			map.update({'subtitles': subtitlesList})
		for folder in folderList:
			dirname = dirnameList[folderList.index(folder)]
			self.listFiles(map, dirname, [folder])

	def searchContent(self,key,quick):
		header = {
			"User-Agent": "Mozilla/5.0 (Linux; Android 12; V2049A Build/SP1A.210812.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Mobile Safari/537.36"
		}
		url = "https://www.yunpanfenxiang.cn/api/bbs/api/getdata2?key={}".format(key)
		rsp = self.fetch(url=url, headers=header)
		vodList = json.loads(self.cleanText(rsp.text))["data"][0]['result']['items']
		videos = []
		linkList = []
		for vod in vodList:
			sid = vod["page_url"]
			if not 'www.aliyundrive.com' in sid:
				continue
			if not sid.endswith('/'):
				sid = sid + '/'
			linkid = self.regStr(sid, r'/s/(\w+)/')
			if linkid in linkList:
				continue
			linkList.append(linkid)
			name = vod['title']
			if len(name) > 15:
				name = ''.join(OrderedDict.fromkeys(name))
			videos.append({
				"vod_id": name + '@@@' + sid,
				"vod_name":name,
				"vod_pic": "https://inews.gtimg.com/newsapp_bt/0/13263837859/1000",
				"vod_remarks": vod['insert_time'].split(' ')[0]
			})
		result = {
			'list':videos
		}
		return result

	def playerContent(self,flag,id,vipFlags):
		result = {}
		token = requests.get('Token外链地址').text.replace('\n', '').replace(' ', '')
		url = id
		rsp = self.fetch(url=url)
		purl = '{}&token={}&connection={}' .format(rsp.text, token, '20')
		alisub = requests.get('Docker域名或IP:端口/cache',params={'key': 'alisub'}).text
		if alisub != '':
			requests.delete('Docker域名或IP:端口/cache', params={'key': 'alisub'})
			suburl = 'Docker域名或IP:端口/proxy_download_file?params={}&token={}&connection=1'.format(b64encode(alisub).encode("utf-8").decode("utf-8"), token)
			result['subt'] = suburl
		result["parse"] = 0
		result["playUrl"] = ''
		result["url"] = purl
		return result

	config = {
		"player": {},
		"filter": {}
	}
	header = {}

	def localProxy(self,param):
		return [200, "video/MP2T", action, ""]