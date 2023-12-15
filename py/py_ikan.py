#coding=utf-8
#!/usr/bin/python
import sys
import math
import json
import base64
import requests
sys.path.append('..')
from base.spider import Spider


class Spider(Spider):
	def getName(self):
		return "爱看影视"
	def init(self,extend=""):
		pass
	def isVideoFormat(self,url):
		pass
	def manualVideoCheck(self):
		pass

	def homeContent(self,filter):
		result = {}
		cateManual = {
			"电影": "1",
			"剧集": "2",
			"综艺": "3",
			"动漫": "4",
			"美剧": "16",
			"日韩剧": "15",
		}
		classes = []
		for k in cateManual:
			classes.append({
				'type_name': k,
				'type_id': cateManual[k]
			})

		result['class'] = classes
		if (filter):
			result['filters'] = self.config['filter']
		return result

	def homeVideoContent(self):
		result = {}
		return result

	def categoryContent(self,tid,pg,filter,extend):
		result = {}
		return result

	def detailContent(self,array):
		aid = array[0]
		url = 'https://ikanys.tv/voddetail/{0}/'.format(aid)
		rsp = self.fetch(url)
		html = self.html(rsp.text)
		node = html.xpath("//div[@class='box-width flex between rel']")[0]
		title = html.xpath("//h3[@class='slide-info-title hide']/text()")[0]
		pic = html.xpath("//a[@class='detail-pic lazy mask-1']/@data-original")[0]
		vod = {
			"vod_id": aid,
			"vod_name": title,
			"vod_pic": pic,
			"type_name": '',
			"vod_year": '',
			"vod_area": '',
			"vod_remarks": '',
			"vod_actor": '',
			"vod_director": '',
			"vod_content": ''
		}
		playFrom = ''
		playfromList = html.xpath("//div[@class='swiper-wrapper']/a")
		for pL in playfromList:
			pL = pL.xpath("./text()")[0].strip()
			playFrom = playFrom + '$$$' + pL
		urlList = html.xpath("//div[contains(@class,'anthology-list-box none')]")
		playUrl = ''
		for uL in urlList:
			for playurl in uL.xpath(".//li"):
				purl = self.regStr(reg=r'/vodplay/(.*?)/', src=playurl.xpath("./a/@href")[0])
				name = playurl.xpath("./a/text()")[0]
				playUrl = playUrl + '{}${}#'.format(name, purl)
			playUrl = playUrl + '$$$'
		vod['vod_play_from'] = playFrom.strip('$$$')
		vod['vod_play_url'] = playUrl.strip('$$$')

		result = {
			'list': [
				vod
			]
		}
		return result

	def verifyCode(self,tag):
		header = {
			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
		}
		try:
			session = requests.session()
			r = session.post('https://ddddocr.lm317379829.repl.co', json={'url': 'https://ikanys.tv/index.php/verify/index.html', 'comp': 'digit'})
			jo = r.json()
			if jo['code'] == 1:
				code = jo['result']
				session.cookies.update(jo['cookies'])
			else:
				return False, None
			res = session.post(url="https://ikanys.tv/index.php/ajax/verify_check?type={}&verify={}".format(tag, code), headers=header, timeout=5).json()
			if res["msg"] == "ok":
				return True, session
		except:
			pass
		return False, None

	def searchContent(self,key,quick):
		result = {}
		header = {
			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
		}
		url = 'https://ikanys.tv/vodsearch/-------------/?wd={0}'.format(key)
		_, session = self.verifyCode('search')
		rsp = session.get(url, headers=header)
		root = self.html(rsp.text)
		vodList = root.xpath("//div[@class='search-box flex rel']")
		videos = []
		for vod in vodList:
			name = vod.xpath(".//div[@class='thumb-txt cor4 hide']/text()")[0]
			pic = vod.xpath(".//div[@class='lazy gen-movie-img mask-1']/@data-original")[0]
			mark = vod.xpath(".//span[@class='public-list-prb hide ft2']/text()")[0]
			sid = vod.xpath(".//a[@class='public-list-exp']/@href")[0]
			sid = self.regStr(sid,"/voddetail/(\\S+)/")
			videos.append({
				"vod_id":sid,
				"vod_name":name,
				"vod_pic":pic,
				"vod_remarks":mark
			})
		result = {
				'list': videos
			}
		return result

	def playerContent(self,flag,id,vipFlags):
		header = {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
			"Referer": "https://ikanys.tv/"
		}
		result = {}
		url = 'https://ikanys.tv/vodplay/{0}/'.format(id)
		rsp = self.fetch(url, headers=header)
		info = json.loads(self.regStr(reg=r'var player_data=(.*?)</script>', src=self.cleanText(rsp.text)))
		parse = 0
		purl = base64.b64decode(info['url'].encode())[14:-8].decode()
		if purl.startswith('http'):
			purl = purl
		else:
			parse = 1
			purl = url
		result["parse"] = parse
		result["playUrl"] = ''
		result["url"] = purl
		result["header"] = ''
		return result

	config = {
		"player": {},
		"filter": {}
	}
	header = {}

	def localProxy(self,param):
		action = {
			'url':'',
			'header':'',
			'param':'',
			'type':'string',
			'after':''
		}
		return [200, "video/MP2T", action, ""]