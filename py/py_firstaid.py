#coding=utf-8
#!/usr/bin/python
import re
import requests
import json
from lxml import etree
from base64 import b64decode
from urllib.parse import quote, unquote

class FIRSTAID():  # 元类 默认的元类 type
	def getInfo(self, params):
		if params['wd'] != '':
			return self.searchContent(params['wd'], params['pg'], params['quick'])
		elif params['t'] != '':
			return self.categoryContent(params['t'], params['pg'], json.loads(b64decode(unquote(params['ext'])).decode()))
		elif params['ids'] != '':
			return self.detailContent(params['ids'])
		elif params['play'] != '':
			return self.playerContent(params['flag'], params['play'])
		else:
			return self.homeContent(params['filter'])

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
		return result, 14400

	def categoryContent(self, tid, pg, ext):
		result = {}
		header = self.header.copy()
		r = requests.get('https://m.youlai.cn/jijiu', headers=header, timeout=5)
		html = etree.HTML(r.text)
		vodList = html.xpath("//ul[contains(@class,'list-flex-br')]/li")
		videos = []
		for vod in vodList:
			title = vod.xpath(".//div/text()")[0].strip()
			cid = re.search(r'article/(.*?).html', vod.xpath("./a/@href")[0]).group(1)
			videos.append({
				"vod_id": cid,
				"vod_name": title,
				"vod_pic": 'https://img1.imgtp.com/2023/09/19/bydPPaLp.png',
				"vod_remarks": ''
			})
		lenvideos = len(videos)
		result['list'] = videos
		result['page'] = pg
		result['pagecount'] = pg
		result['limit'] = lenvideos
		result['total'] = lenvideos
		return result, 14400

	def detailContent(self, ids):
		header = self.header.copy()
		url = 'https://m.youlai.cn/jijiu/article/{}.html'.format(ids)
		r = requests.get(url, headers=header, timeout=5)
		html = etree.HTML(r.text)
		title = html.xpath("//h2[contains(@class,'video-title')]/text()")[0].strip()
		director = '|'.join(html.xpath("//div[contains(@class,'list-flex')]/span /text()")).strip()
		content = '\n'.join(html.xpath("//div[contains(@class,'img-text-con')]//text()")).strip()
		playUrl = html.xpath("//video[contains(@id,'video')]/source/@src")[0]
		vod = {
			"vod_id": ids,
			"vod_name": title,
			"vod_pic": 'https://img1.imgtp.com/2023/09/19/bydPPaLp.png',
			"vod_content": content.strip(),
			"vod_director": director,
			"vod_play_from": 'FIRSTAID',
			"vod_play_url": title + '$' + playUrl
		}
		result = {
			'list':[
				vod
			]
		}
		return result, 14400

	def searchContent(self, key, pg, quick):
		header = self.header.copy()
		url = 'https://m.youlai.cn/kp/videobydise?q={}&page={}&keyword={}'.format(key, pg, key)
		r = requests.get(url, headers=header, timeout=5)
		html = etree.HTML(r.text)
		vodList = html.xpath("//div[contains(@class,'re-li li-video')]")
		videos = []
		for vod in vodList:
			sid = re.search(r'article/(.*?).html', vod.xpath("./a/@href")[0]).group(1)
			title = vod.xpath(".//h5/text()")[0].strip()
			img = vod.xpath(".//img/@src")[0]
			if not img.startswith('http'):
				img = 'https:' + img
			videos.append({
				"vod_id": sid,
				"vod_name": title,
				"vod_pic": img,
				"vod_remarks": ''
			})
		result = {
			'list': videos
		}
		return result, 14400

	def playerContent(self, flag, pid):
		result = {}
		result["parse"] = 0
		result["playUrl"] = ''
		result["url"] = pid
		result["header"] = ''
		return result, 14400

	header = {
		"User-Agent":"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36 Edg/116.0.1938.76"
	}