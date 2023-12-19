#coding=utf-8
#!/usr/bin/python
import sys
import json
from difflib import SequenceMatcher

sys.path.append('..')
from base.spider import Spider

class Spider(Spider):  # 元类 默认的元类 type
	def getName(self):
		return "急救指南"

	def init(self, extend):
		pass

	def isVideoFormat(self, url):
		pass

	def manualVideoCheck(self):
		pass

	def homeVideoContent(self):
		return self.categoryContent('FIRSTAID', 1, False, {})

	def homeContent(self, filter):
		result = {}
		cateManual = {
			"急救指南": "FIRSTAID"
		}
		classes = []
		for k in cateManual:
			classes.append({
				'type_name': k,
				'type_id': cateManual[k]
			})
		result['class'] = classes
		return result

	def categoryContent(self, cid, page, filter, ext):
		result = {}
		header = self.header.copy()
		r = self.fetch('https://m.youlai.cn/jijiu', headers=header)
		html = self.html(r.text)
		vodList = html.xpath("//ul[contains(@class,'list-flex-br')]/li")
		videos = []
		for vod in vodList:
			title = vod.xpath(".//div/text()")[0].strip()
			cid = vod.xpath("./a/@href")[0]
			videos.append({
				"vod_id": cid,
				"vod_name": title,
				"vod_pic": 'https://api-lmteam.koyeb.app/files/firstaid.png',
				"vod_remarks": ''
			})
		lenvideos = len(videos)
		result['list'] = videos
		result['page'] = page
		result['pagecount'] = page
		result['limit'] = lenvideos
		result['total'] = lenvideos
		return result

	def detailContent(self, did):
		did = did[0]
		header = self.header.copy()
		url = f'https://m.youlai.cn{did}'
		r = self.fetch(url, headers=header)
		if '/video/article' in did:
			data = json.loads(self.regStr(reg='_DATA__ =(.*?});', src=r.text))
			title = data['videoDetailData']['title']
			director = f"{data['videoDetailData']['doctor']['name']}|{data['videoDetailData']['doctor']['medical_title']}|{data['videoDetailData']['doctor']['hospital_name']}"
			content = data['videoDetailData']['description'].strip()
			playUrl = data['videoDetailData']['media_url']
		else:
			html = self.html(r.text)
			title = html.xpath("//h2[contains(@class,'video-title')]/text()")[0].strip()
			director = '|'.join(html.xpath("//div[contains(@class,'list-flex')]/span /text()")).strip()
			content = '\n'.join(html.xpath("//div[@class='img-text-con']//text()[not(parent::span[@class='breakpoint-item'])]")).strip()
			playUrl = html.xpath("//video[contains(@id,'video')]/source/@src")[0]
		vod = {
			"vod_id": did,
			"vod_name": title,
			"vod_pic": 'https://img1.imgtp.com/2023/09/19/bydPPaLp.png',
			"vod_content": content.strip(),
			"vod_director": director,
			"vod_play_from": '急救指南',
			"vod_play_url": title + '$' + playUrl
		}
		result = {'list': [vod]}
		return result

	def searchContent(self, key, quick):
		return self.searchContentPage(key, quick, '1')

	def searchContentPage(self, key, quick, page):
		header = self.header.copy()
		url = f'https://m.youlai.cn/kp/videobydise?q={key}&page={page}&keyword={key}'
		r = self.fetch(url, headers=header, timeout=5)
		html = self.html(r.text)
		vodList = html.xpath("//div[contains(@class,'re-li li-video')]")
		videos = []
		for vod in vodList:
			sid = vod.xpath("./a/@href")[0]
			title = vod.xpath(".//h5/text()")[0].strip()
			if SequenceMatcher(None, title, key).ratio() < 0.6 and not key in title:
				continue
			img = vod.xpath(".//img/@src")[0]
			if not img.startswith('http'):
				img = 'https:' + img
			videos.append({
				"vod_id": sid,
				"vod_name": title,
				"vod_pic": img,
				"vod_remarks": ''
			})
		result = {'list': videos}
		return result

	def playerContent(self, flag, pid, vipFlags):
		result = {}
		result["parse"] = 0
		result["playUrl"] = ''
		result["url"] = pid
		result["header"] = ''
		return result

	def localProxy(self, param):
		return [200, "video/MP2T", {}, ""]

	header = {
		"User-Agent":"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36 Edg/116.0.1938.76"
	}