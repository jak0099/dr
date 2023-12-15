#coding=utf-8
#!/usr/bin/python
import sys
sys.path.append('..')
from base.spider import Spider
import json
from requests import session, utils
import os
import time
import base64

class Spider(Spider):  # 元类 默认的元类 type
	def getName(self):
		return "B站影视"
	def init(self,extend=""):
		print("============{0}============".format(extend))
		pass
	def isVideoFormat(self,url):
		pass
	def manualVideoCheck(self):
		pass
	def homeContent(self,filter):
		result = {}
		cateManual = {
			"番剧": "1",
			"国创": "4",
			"电影": "2",
			"综艺": "7",
			"电视剧": "5",
			"纪录片": "3"
		}
		classes = []
		for k in cateManual:
			classes.append({
				'type_name':k,
				'type_id':cateManual[k]
			})
		result['class'] = classes
		if(filter):
			result['filters'] = self.config['filter']
		return result
	def homeVideoContent(self):
		tid = self.homeContent(False)['class'][0]['type_id']
		return self.categoryContent(tid, 1, False, {})

	cookies = ''
	def getCookie(self):
		try:
			cookies_str = self.fetch("buvid3=12A78977-8E04-8DA0-EACA-4280A2CBF70F26536infoc; buvid4=AC82CF17-BB02-2BA5-AEB2-880F381C8E3A15597-022020401-bEJsC6owQKOC964b3kF8aA%3D%3D; CURRENT_BLACKGAP=0; i-wanna-go-back=-1; is-2022-channel=1; b_nut=100; _uuid=C3D57961-F8CA-8BB3-EA87-1B545E435B81013328infoc; header_theme_version=CLOSE; nostalgia_conf=-1; rpdid=|(Y|)|Yukuu0J'uY~~|~|RmY; DedeUserID=3493112737433767; DedeUserID__ckMd5=b48704cc9d5767a2; CURRENT_QUALITY=80; b_ut=5; home_feed_column=5; CURRENT_FNVAL=4048; fingerprint=6072d6d047af63027d42e7b07fdc0e14; buvid_fp_plain=undefined; buvid_fp=6072d6d047af63027d42e7b07fdc0e14; bp_video_offset_3493112737433767=829654181129224199; PVID=1; innersign=0; b_lsid=7197A2E1_18A6572474D; bsource=search_baidu; SESSDATA=a3b66263%2C1709471105%2C827d3%2A92J3ek47bxV2D3NICqYMcLiGLc8j5GPYyNJ5Kany321n1pWi76HJvQF51AUZv0Xpjf5K2lxwAAQwA; bili_jct=8fefab3e2a608c421e3d5fa72de5a823; sid=77j01eei; browser_resolution=1920-398").text
			cookies_dic = dict([co.strip().split('=') for co in cookies_str.split(';')])
			rsp = session()
			cookies_jar = utils.cookiejar_from_dict(cookies_dic)
			rsp.cookies = cookies_jar
			content = self.fetch("http://api.bilibili.com/x/web-interface/nav", cookies=rsp.cookies)
			res = json.loads(content.text)
		except:
			res = {}
			res["code"] = 404
		if res["code"] == 0:
			self.cookies = rsp.cookies
		else:
			rsp = self.fetch("https://www.bilibili.com/")
			self.cookies = rsp.cookies
		return rsp.cookies

	def categoryContent(self,tid,pg,filter,extend):		
		result = {}
		url = 'https://api.bilibili.com/pgc/season/index/result?order=2&season_status=-1&style_id=-1&sort=0&area=-1&pagesize=20&type=1&st={0}&season_type={0}&page={1}'.format(tid,pg)
		if len(self.cookies) <= 0:
			self.getCookie()
		rsp = self.fetch(url, cookies=self.cookies)
		content = rsp.text
		jo = json.loads(content)
		videos = []
		vodList = jo['data']['list']
		for vod in vodList:
			aid = str(vod['season_id']).strip()
			title = vod['title'].strip()
			img =  vod['cover'].strip()
			remark = vod['index_show'].strip()
			videos.append({
				"vod_id":aid,
				"vod_name":title,
				"vod_pic":img,
				"vod_remarks":remark
			})
		result['list'] = videos
		result['page'] = pg
		result['pagecount'] = 9999
		result['limit'] = 90
		result['total'] = 999999
		return result

	def cleanSpace(self,str):
		return str.replace('\n','').replace('\t','').replace('\r','').replace(' ','')

	def detailContent(self,array):
		aid = array[0]
		url = "http://api.bilibili.com/pgc/view/web/season?season_id={0}".format(aid)
		rsp = self.fetch(url,headers=self.header)
		jRoot = json.loads(rsp.text)
		jo = jRoot['result']
		id = jo['season_id']
		title = jo['title']
		pic = jo['cover']
		areas = jo['areas'][0]['name']
		typeName = jo['share_sub_title']
		dec = jo['evaluate']
		remark = jo['new_ep']['desc']
		vod = {
			"vod_id":id,
			"vod_name":title,
			"vod_pic":pic,
			"type_name":typeName,
			"vod_year":"",
			"vod_area":areas,
			"vod_remarks":remark,
			"vod_actor":"",
			"vod_director":"",
			"vod_content":dec
		}
		ja = jo['episodes']
		playUrl = ''
		for tmpJo in ja:
			eid = tmpJo['id']
			cid = tmpJo['cid']
			part = tmpJo['title'].replace("#", "-")
			playUrl = playUrl + '{0}${1}_{2}#'.format(part, eid, cid)

		vod['vod_play_from'] = 'B站影视'
		vod['vod_play_url'] = playUrl

		result = {
			'list':[
				vod
			]
		}
		return result
	def searchContent(self,key,quick):
		url = 'https://api.bilibili.com/x/web-interface/search/type?search_type=media_bangumi&keyword={0}'.format(key)  # 番剧搜索
		if len(self.cookies) <= 0:
			self.getCookie()
		rsp = self.fetch(url, cookies=self.cookies)
		content = rsp.text
		jo = json.loads(content)
		rs = jo['data']
		if rs['numResults'] == 0:
			url = 'https://api.bilibili.com/x/web-interface/search/type?search_type=media_ft&keyword={0}'.format(key)  # 影视搜索
			rspRetry = self.fetch(url, cookies=self.cookies)
			content = rspRetry.text
		jo = json.loads(content)
		videos = []
		vodList = jo['data']['result']
		for vod in vodList:
			aid = str(vod['season_id']).strip()
			title = vod['title'].strip().replace("<em class=\"keyword\">", "").replace("</em>", "")
			img = vod['eps'][0]['cover'].strip()
			remark = vod['index_show']
			videos.append({
				"vod_id": aid,
				"vod_name": title,
				"vod_pic": img,
				"vod_remarks": remark
			})
		result = {
			'list': videos
		}
		return result

	def playerContent(self,flag,id,vipFlags):
		result = {}
		ids = id.split("_")
		header = {
			"Referer": "https://www.bilibili.com",
			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
		}
		url = 'https://api.bilibili.com/pgc/player/web/playurl?qn=116&ep_id={0}&cid={1}'.format(ids[0],ids[1])
		if len(self.cookies) <= 0:
			self.getCookie()
		rsp = self.fetch(url,cookies=self.cookies,headers=header)
		jRoot = json.loads(rsp.text)
		if jRoot['message'] != 'success':
			url = ''
		else:
			jo = jRoot['result']
			ja = jo['durl']
			maxSize = -1
			position = -1
			for i in range(len(ja)):
				tmpJo = ja[i]
				if maxSize < int(tmpJo['size']):
					maxSize = int(tmpJo['size'])
					position = i
			url = ''
			if len(ja) > 0:
				if position == -1:
					position = 0
				url = ja[position]['url']
		result["parse"] = 0
		result["playUrl"] = ''
		result["url"] = url
		result["header"] = {
			"Referer":"https://www.bilibili.com",
			"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
		}
		result["contentType"] = 'video/x-flv'
		return result

	config = {
		"player": {},
		"filter": {}
	}
	header = {}

	def localProxy(self,param):
		return [200, "video/MP2T", action, ""]