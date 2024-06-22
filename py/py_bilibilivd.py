#coding=utf-8
#!/usr/bin/python
import sys
import json
import time
from datetime import datetime
from urllib.parse import quote, unquote
sys.path.append('..')
from base.spider import Spider

class Spider(Spider):  # 元类 默认的元类 type
	def getName(self):
		return "B站视频"

	def init(self, extend):
		try:
			self.extendDict = json.loads(extend)
		except:
			self.extendDict = {}

	def isVideoFormat(self, url):
		pass

	def manualVideoCheck(self):
		pass

	def homeContent(self, filter):
		result = {}
		result['filters'] = {}
		cookie = ''
		if 'cookie' in self.extendDict:
			cookie = self.extendDict['cookie']
		if 'json' in self.extendDict:
			r = self.fetch(self.extendDict['json'], timeout=10)
			if 'cookie' in r.json():
				cookie = r.json()['cookie']
		if cookie == '':
			cookie = '{}'
		elif type(cookie) == str and cookie.startswith('http'):
			cookie = self.fetch(cookie, timeout=10).text.strip()
		try:
			if type(cookie) == dict:
				cookie = json.dumps(cookie, ensure_ascii=False)
		except:
			pass
		_, _, _ = self.getCookie(cookie)
		bblogin = self.getCache('bblogin')
		if bblogin:
			result['class'] = [{"type_name": "动态", "type_id": "动态"}, {"type_name": "收藏夹", "type_id": "收藏夹"}, {"type_name": "历史记录", "type_id": "历史记录"}]
		else:
			result['class'] = []
		if 'json' in self.extendDict:
			r = self.fetch(self.extendDict['json'], timeout=10)
			params = r.json()
			if 'classes' in params:
				result['class'] = result['class'] + params['classes']
			if filter:
				if 'filter' in params:
					result['filters'] = params['filter']
		elif 'categories' in self.extendDict or 'type' in self.extendDict:
			if 'categories' in self.extendDict:
				cateList = self.extendDict['categories'].split('#')
			else:
				cateList = self.extendDict['type'].split('#')
			for cate in cateList:
				result['class'].append({'type_name': cate, 'type_id': cate})
		if not 'class' in result:
			result['class'] = {"type_name": "沙雕动漫", "type_id": "沙雕动漫"}
		return result

	def homeVideoContent(self):
		result = {}
		cookie = ''
		if 'cookie' in self.extendDict:
			cookie = self.extendDict['cookie']
		if 'json' in self.extendDict:
			r = self.fetch(self.extendDict['json'], timeout=10)
			if 'cookie' in r.json():
				cookie = r.json()['cookie']
		if cookie == '':
			cookie = '{}'
		elif type(cookie) == str and cookie.startswith('http'):
			cookie = self.fetch(cookie, timeout=10).text.strip()
		try:
			if type(cookie) == dict:
				cookie = json.dumps(cookie, ensure_ascii=False)
		except:
			pass
		cookie, imgKey, subKey = self.getCookie(cookie)
		url = 'https://api.bilibili.com/x/web-interface/index/top/feed/rcmd?&y_num=1&fresh_type=3&feed_version=SEO_VIDEO&fresh_idx_1h=1&fetch_row=1&fresh_idx=1&brush=0&homepage_ver=1&ps=20'
		r = self.fetch(url, cookies=cookie, headers=self.header, timeout=5)
		data = json.loads(self.cleanText(r.text))
		try:
			vodList = data['data']['item']
			for vod in vodList:
				aid = str(vod['id']).strip()
				title = self.removeHtmlTags(vod['title']).strip()
				img = vod['pic'].strip()
				remark = time.strftime('%H:%M:%S', time.gmtime(vod['duration']))
				if remark.startswith('00:'):
					remark = remark[3:]
				if remark == '00:00':
					continue
				result['list'].append({
					'vod_id': aid,
					'vod_name': title,
					'vod_pic': img,
					'vod_remarks': remark
				})
		except:
			pass
		return result

	def categoryContent(self, cid, page, filter, ext):
		page = int(page)
		result = {}
		videos = []
		cookie = ''
		pagecount = page
		if 'cookie' in self.extendDict:
			cookie = self.extendDict['cookie']
		if 'json' in self.extendDict:
			r = self.fetch(self.extendDict['json'], timeout=10)
			if 'cookie' in r.json():
				cookie = r.json()['cookie']
		if cookie == '':
			cookie = '{}'
		elif type(cookie) == str and cookie.startswith('http'):
			cookie = self.fetch(cookie, timeout=10).text.strip()
		try:
			if type(cookie) == dict:
				cookie = json.dumps(cookie, ensure_ascii=False)
		except:
			pass
		cookie, imgKey, subKey = self.getCookie(cookie)
		if cid == '动态':
			if page > 1:
				offset = self.getCache('offset')
				if not offset:
					offset = ''
				url = f'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=all&offset={offset}&page={page}'
			else:
				url = f'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=all&page={page}'
			r = self.fetch(url, cookies=cookie, headers=self.header, timeout=5)
			data = json.loads(self.cleanText(r.text))
			self.setCache('offset', data['data']['offset'])
			vodList = data['data']['items']
			if data['data']['has_more']:
				pagecount = page + 1
			for vod in vodList:
				if vod['type'] != 'DYNAMIC_TYPE_AV':
					continue
				vid = str(vod['modules']['module_dynamic']['major']['archive']['aid']).strip()
				remark = vod['modules']['module_dynamic']['major']['archive']['duration_text'].strip()
				title = self.removeHtmlTags(vod['modules']['module_dynamic']['major']['archive']['title']).strip()
				img = vod['modules']['module_dynamic']['major']['archive']['cover']
				videos.append({
					"vod_id": vid,
					"vod_name": title,
					"vod_pic": img,
					"vod_remarks": remark
				})
		elif cid == "收藏夹":
			userid = self.getUserid(cookie)
			if userid is None:
				return {}, 1
			url = f'http://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid={userid}&jsonp=jsonp'
			r = self.fetch(url, cookies=cookie, headers=self.header, timeout=5)
			data = json.loads(self.cleanText(r.text))
			vodList = data['data']['list']
			pagecount = page
			for vod in vodList:
				vid = vod['id']
				title = vod['title'].strip()
				remark = vod['media_count']
				img = 'https://api-lmteam.koyeb.app/files/shoucang.png'
				videos.append({
					"vod_id": f'fav&&&{vid}',
					"vod_name": title,
					"vod_pic": img,
					"vod_tag": 'folder',
					"vod_remarks": remark
				})
		elif cid.startswith('fav&&&'):
			cid = cid[6:]
			url = f'http://api.bilibili.com/x/v3/fav/resource/list?media_id={cid}&pn={page}&ps=20&platform=web&type=0'
			r = self.fetch(url, cookies=cookie, headers=self.header, timeout=5)
			data = json.loads(self.cleanText(r.text))
			if data['data']['has_more']:
				pagecount = page + 1
			else:
				pagecount = page
			vodList = data['data']['medias']
			for vod in vodList:
				vid = str(vod['id']).strip()
				title = self.removeHtmlTags(vod['title']).replace("&quot;", '"')
				img = vod['cover'].strip()
				remark = time.strftime('%H:%M:%S', time.gmtime(vod['duration']))
				if remark.startswith('00:'):
					remark = remark[3:]
				videos.append({
					"vod_id": vid,
					"vod_name": title,
					"vod_pic": img,
					"vod_remarks": remark
				})
		elif cid.startswith('UP主&&&'):
			cid = cid[6:]
			params = {'mid': cid, 'ps': 30, 'pn': page}
			# params = WBI().encWbi(params, imgKey, subKey)
			url = 'https://api.bilibili.com/x/space/wbi/arc/search?'
			for key in params:
				url += f'&{key}={quote(params[key])}'
			r = self.fetch(url, cookies=cookie, headers=self.header, timeout=5)
			data = json.loads(self.cleanText(r.text))
			if page < data['data']['page']['count']:
				pagecount = page + 1
			else:
				pagecount = page
			if page == 1:
				bizId = self.regStr(reg='play/(.*?)\?', src=data['data']['episodic_button']['uri'])
				videos = [{"vod_id": f'UP主&&&{bizId}', "vod_name": '播放列表'}]
			vodList = data['data']['list']['vlist']
			for vod in vodList:
				vid = str(vod['aid']).strip()
				title = self.removeHtmlTags(vod['title']).replace("&quot;", '"')
				img = vod['pic'].strip()
				remarkinfos = vod['length'].split(':')
				minutes = int(remarkinfos[0])
				if minutes >= 60:
					hours = str(minutes // 60)
					minutes = str(minutes % 60)
					if len(hours) == 1:
						hours = '0' + hours
					if len(minutes) == 1:
						minutes = '0' + minutes
					remark = hours + ':' + minutes + ':' + remarkinfos[1]
				else:
					remark = vod['length']
				videos.append({
					"vod_id": vid,
					"vod_name": title,
					"vod_pic": img,
					"vod_remarks": remark
				})
		elif cid == '历史记录':
			url = f'http://api.bilibili.com/x/v2/history?pn={page}'
			r = self.fetch(url, cookies=cookie, headers=self.header, timeout=5)
			data = json.loads(self.cleanText(r.text))
			if len(data['data']) == 300:
				pagecount = page + 1
			else:
				pagecount = page
			vodList = data['data']
			for vod in vodList:
				if vod['duration'] <= 0:
					continue
				vid = str(vod["aid"]).strip()
				img = vod["pic"].strip()
				title = self.removeHtmlTags(vod["title"]).replace("&quot;", '"')
				if vod['progress'] != -1:
					process = time.strftime('%H:%M:%S', time.gmtime(vod['progress']))
					totalTime = time.strftime('%H:%M:%S', time.gmtime(vod['duration']))
					if process.startswith('00:'):
						process = process[3:]
					if totalTime.startswith('00:'):
						totalTime = totalTime[3:]
					remark = process + '|' + totalTime
					videos.append({
						"vod_id": vid,
						"vod_name": title,
						"vod_pic": img,
						"vod_remarks": remark
					})
		else:
			url = 'https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword={}&page={}'
			for key in ext:
				if key == 'tid':
					cid = ext[key]
					continue
				url += f'&{key}={ext[key]}'
			url = url.format(cid, page)
			r = self.fetch(url, cookies=cookie, headers=self.header, timeout=5)
			data = json.loads(self.cleanText(r.text))
			pagecount = data['data']['numPages']
			vodList = data['data']['result']
			for vod in vodList:
				if vod['type'] != 'video':
					continue
				vid = str(vod['aid']).strip()
				title = self.removeHtmlTags(self.cleanText(vod['title']))
				img = 'https:' + vod['pic'].strip()
				remarkinfo = vod['duration'].split(':')
				minutes = int(remarkinfo[0])
				seconds = remarkinfo[1]
				if len(seconds) == 1:
					seconds = '0' + seconds
				if minutes >= 60:
					hour = str(minutes // 60)
					minutes = str(minutes % 60)
					if len(hour) == 1:
						hour = '0' + hour
					if len(minutes) == 1:
						minutes = '0' + minutes
					remark = f'{hour}:{m