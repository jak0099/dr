#coding=utf-8
#!/usr/bin/python
import sys
import time
import json
import requests
from base64 import b64encode
from collections import OrderedDict

sys.path.append('..')
from base.spider import Spider

class Spider(Spider):
	def getDependence(self):
		return ['py_ali']
	def getName(self):
		return "py_zhaozy"
	def init(self,extend):
		self.ali = extend[0]
		print("============py_zhaozy============")
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
	header = {
		"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.54 Safari/537.36",
		"Referer": "https://zhaoziyuan.la/"
	}
	def detailContent(self,array):
		hashMap = {}
		dirname = ''
		ids = array[0].split('@@@')
		pattern = '(https://www.aliyundrive.com/s/[^\"]+)'
		url = self.regStr(ids[1], pattern)
		if len(url) > 0:
			self.listFiles(hashMap, dirname, [ids[1]])
		else:
			rsp = self.fetch('https://zhaoziyuan.la/' + ids[1])
			url = self.regStr(rsp.text, pattern)
			if len(url) == 0:
				return {}
			self.listFiles(hashMap, dirname, [url])
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
		map = {
			'7':'文件夹',
			'1':'视频'
		}
		ja = []
		cookies_str = requests.get('https://getplayurl.lm317379829.repl.co/cache?key=cookies')
		if cookies_str.text == '':
			cookies = self.getCookie()
		else:
			cookies_dict = cookies_str.json()
			if cookies_dict['expires'] <= int(time.time()):
				cookies = self.getCookie()
			else:
				cookies = requests.cookies.RequestsCookieJar()
				for ckey, value in cookies_dict.items():
					if ckey == 'domain' or ckey == 'expires':
						continue
					c = requests.cookies.create_cookie(ckey, value)
					c.domain = cookies_dict['domain']
					c.expires = cookies_dict['expires']
					cookies.set_cookie(c)
		for tKey in map.keys():
			url = "https://zhaoziyuan.la/so?filename={0}&t={1}".format(key,tKey)
			rsp = self.fetch(url, headers=self.header, cookies=cookies)
			root = self.html(self.cleanText(rsp.text))
			aList = root.xpath("//li[@class='clear']/div/div[@class='news_text']/a")
			for a in aList:
				name = self.xpText(a,'./h3/text()')
				if len(name) > 15:
					name = ''.join(OrderedDict.fromkeys(name))
				remark = self.xpText(a,'./p/text()').split('|')[1].strip()
				jo = {
					'vod_id': name + '@@@' + self.xpText(a,'@href'),
					'vod_name': name,
					'vod_pic': "https://inews.gtimg.com/newsapp_bt/0/13263837859/1000",
					"vod_remarks": remark
				}
				ja.append(jo)
		result = {
			'list':ja
		}
		return result

	def getCookie(self):
		header = {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.54 Safari/537.36",
			"Referer": "https://zhaoziyuan.la/login.html",
			"Origin": "https://zhaoziyuan.la/"
		}
		logininfo = {'username': 'Unbaked4136', 'password': '4hzxQkB9yxX5EP'}
		r = requests.post('https://zhaoziyuan.la/logiu.html', data=logininfo, headers=header, timeout=5)
		cookies = r.cookies.get_dict()
		cookies.update({'expires': int(time.time()) + 604200})
		cookies.update({'domain': 'zhaoziyuan.la'})
		requests.post('https://getplayurl.lm317379829.repl.co/cache?key=cookies', data=json.dumps(cookies))
		return r.cookies

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

	def localProxy(self,param):
		return [200, "video/MP2T", action, ""]