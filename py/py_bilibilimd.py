#coding=utf-8
#!/usr/bin/python
import sys
import json
import time
from datetime import datetime
from difflib import SequenceMatcher
from urllib.parse import quote, unquote
sys.path.append('..')
from base.spider import Spider

class Spider(Spider):  # 元类 默认的元类 type
	def getName(self):
		return "B站番剧"

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
		cateManual = {
			"番剧": "1",
			"国创": "4",
			"电影": "2",
			"综艺": "7",
			"电视剧": "5",
		}
		classes = []
		for k in cateManual:
			classes.append({
				'type_name': k,
				'type_id': cateManual[k]
			})
		result['class'] = classes
		if filter:
			result['filters'] = self.config['filter']
			current_year = datetime.now().year
			for resultfilter in result['filters']:
				for rf in result['filters'][resultfilter]:
					yearList = []
					if rf['key'] == 'year':
						for rfv in rf['value']:
							if rfv['n'].isdigit():
								if int(rfv['n']) < current_year:
									pos = rf['value'].index(rfv)
									for year in range(current_year, int(rfv['n']), -1):
										yearList.append({'v': '[{},{})'.format(year, year+1), 'n': str(year)})
									rf['value'].insert(pos, yearList)
									break
								else:
									break
					elif rf['key'] == 'release_date':
						for rfv in rf['value']:
							if rfv['n'].isdigit():
								if int(rfv['n']) < current_year:
									pos = rf['value'].index(rfv)
									for year in range(current_year, int(rfv['n']), -1):
										yearList.append({'v': '[{}-01-01 00:00:00,{}-01-01 00:00:00)'.format(year, year + 1), 'n': str(year)})
									rf['value'].insert(pos, yearList)
									break
								else:
									break
		return result

	def homeVideoContent(self):
		return self.categoryContent('1', '1', False, {})

	def categoryContent(self, cid, page, filter, ext):
		page = int(page)
		result = {}
		videos = []
		cookie, _, _ = self.getCookie('{}')
		url = 'https://api.bilibili.com/pgc/season/index/result?order=2&sort=0&pagesize=20&type=1&st={}&season_type={}&page={}'.format(cid, cid, page)
		for key in ext:
			url = url + '&{}={}' .format(key, quote(ext[key]))
		r = self.fetch(url, headers=self.header, cookies=cookie, timeout=5)
		data = json.loads(self.cleanText(r.text))
		vodList = data['data']['list']
		for vod in vodList:
			aid = str(vod['season_id']).strip()
			title = self.removeHtmlTags(self.cleanText(vod['title']))
			img = vod['cover'].strip()
			remark = vod['index_show'].strip()
			videos.append({
				"vod_id": aid,
				"vod_name": title,
				"vod_pic": img,
				"vod_remarks": remark
			})
		lenvideos = len(videos)
		if data['data']['has_next'] == 1:
			pagecount = page + 1
		else:
			pagecount = page
		result['list'] = videos
		result['page'] = page
		result['pagecount'] = pagecount
		result['limit'] = lenvideos
		result['total'] = lenvideos
		return result

	def detailContent(self, did):
		did = did[0]
		url = "http://api.bilibili.com/pgc/view/web/season?season_id={0}".format(did)
		r = self.fetch(url, headers=self.header, timeout=10)
		data = json.loads(self.cleanText(r.text))
		vod = {
			"vod_id": did,
			"vod_name": self.removeHtmlTags(data['result']['title']),
			"vod_pic": data['result']['cover'],
			"type_name": data['result']['share_sub_title'],
			"vod_actor": data['result']['actors'].replace('\n', '，'),
			"vod_content": self.removeHtmlTags(data['result']['evaluate'])
		}
		videoList = data['result']['episodes']
		playUrl = ''
		for video in videoList:
			eid = video['id']
			cid = video['cid']
			name = self.removeHtmlTags(video['share_copy']).replace("#", "-").replace('$', '*')
			remark = time.strftime('%H:%M:%S', time.gmtime(video['duration']/1000))
			if remark.startswith('00:'):
				remark = remark[3:]
			playUrl = playUrl + '[{}]/{}${}_{}#'.format(remark, name, eid, cid)
		vod['vod_play_from'] = 'B站番剧'
		vod['vod_play_url'] = playUrl.strip('#')
		result = {
			'list': [
				vod
			]
		}
		return result

	def searchContent(self, key, quick):
		return self.searchContentPage(key, quick, '1')

	def searchContentPage(self, key, quick, page):
		videos = []
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
		cookie, _, _ = self.getCookie(cookie)
		url = f'https://api.bilibili.com/x/web-interface/search/type?search_type=media_bangumi&keyword={key}&page={page}'
		r = self.fetch(url, headers=self.header, cookies=cookie, timeout=5)
		data = json.loads(self.cleanText(r.text))
		if 'result' not in data['data']:
			return {'list': videos}, 1
		vodList = data['data']['result']
		for vod in vodList:
			sid = str(vod['season_id']).strip()
			title = self.removeHtmlTags(self.cleanText(vod['title']))
			if SequenceMatcher(None, title, key).ratio() < 0.6 and key not in title:
				continue
			img = vod['eps'][0]['cover'].strip()
			remark = self.removeHtmlTags(vod['index_show']).strip()
			videos.append({
				"vod_id": sid,
				"vod_name": title,
				"vod_pic": img,
				"vod_remarks": remark
			})
		result = {
			'list': videos
		}
		return result

	def playerContent(self, flag, pid, vipFlags):
		result = {}
		pidList = pid.split("_")
		aid = pidList[0]
		cid = pidList[1]
		url = 'https://api.bilibili.com/pgc/player/web/playurl?ep_id={0}&cid={1}&qn=120&fnval=4048&fnver=0&fourk=1'.format(aid, cid)
		cookie = ''
		extendDict = self.extendDict
		if 'cookie' in extendDict:
			cookie = extendDict['cookie']
		if 'json' in extendDict:
			r = self.fetch(extendDict['json'], timeout=10)
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
		cookiesDict, _, _ = self.getCookie(cookie)
		cookies = quote(json.dumps(cookiesDict))
		if 'thread' in extendDict:
			thread = str(extendDict['thread'])
		else:
			thread = '0'
		result["parse"] = '0'
		result["playUrl"] = ''
		result["url"] = f'http://127.0.0.1:UndCover/proxy?do=py&type=mpd&cookies={cookies}&url={quote(url)}&aid={aid}&cid={cid}&thread={thread}'
		result["header"] = self.header
		result['danmaku'] = 'https://api.bilibili.com/x/v1/dm/list.so?oid={}'.format(cid)
		result["format"] = 'application/dash+xml'
		return result

	def localProxy(self, params):
		if params['type'] == "mpd":
			print('localProxympd', params)
			return self.proxyMpd(params)
		if params['type'] == "media":
			print('localProxymedia', params)
			return self.proxyMedia(params)
		return None

	def proxyMpd(self, params):
		content, _, mediaType = self.getDash(params)
		if mediaType == 'mpd':
			action = {'url': '', 'header': self.header, 'param': '', 'type': 'string'}
			print('proxyMpd', action)
			return [200, "application/dash+xml", action, content]
		else:
			action = {'url': content, 'header': self.header, 'param': '', 'type': 'stream'}
			print('proxyMpd', action)
			return [200, "video/MP2T", action, '']

	def proxyMedia(self, params, forceRefresh=False):
		_, dashinfos, _ = self.getDash(params)
		if 'videoid' in params:
			videoid = int(params['videoid'])
			playurl = dashinfos['video'][videoid]['baseUrl']
		elif 'audioid' in params:
			audioid = int(params['audioid'])
			playurl = dashinfos['audio'][audioid]['baseUrl']
		else:
			return [404, "text/plain", {}, ""]
#		try:
#			r = self.fetch(playurl, headers=params['headers'], stream=True)
#			statusCode = r.status_code
#		except:
#			statusCode = 404
#		try:
#			r.close()
#		except:
#			pass
#		if statusCode != 200 and self.retry == 0:
#			self.retry += 1
#			self.proxyPlayurl(params, True)
		action = {'url': playurl, 'header': self.header, 'param': '', 'type': 'stream'}
		print('proxyMedia', action)
		return [200, "video/MP2T", action, '']

	def getDash(self, params, forceRefresh=False):
		aid = params['aid']
		cid = params['cid']
		url = unquote(params['url'])
		if 'thread' in params:
			thread = params['thread']
		else:
			thread = 0
		header = self.header.copy()
		cookieDict = json.loads(unquote(params['cookies']))
		key = 'bilimdmpdCache_{}_{}'.format(aid, cid)
		if not forceRefresh:
			data = self.getCache(key)
			print('getDash', data)
			if data:
				return data['content'], data['dashinfos'], data['type']

		cookies = cookieDict
		r = self.fetch(url, cookies=cookies, headers=header, timeout=5)
		data = json.loads(self.cleanText(r.text))
		if data['code'] != 0:
			return '', {}, ''
		if not 'dash' in data['result']:
			purl = data['result']['durl'][0]['url']
			try:
				expiresAt = int(self.regStr(reg='deadline=(\d+)', src=purl).group(1)) - 60
			except:
				expiresAt = int(time.time()) + 600
			if int(thread) > 0:
				try:
					self.fetch('http://127.0.0.1:7777')
				except:
					self.fetch('http://127.0.0.1:9978/go')
				purl = f'http://127.0.0.1:7777?url={quote(purl)}&thread={thread}'
			self.setCache(key, {'content': purl, 'type': 'mp4', 'dashinfos': {}, 'expiresAt': expiresAt})
			return purl, {}, 'mp4'

		dashinfos = data['result']['dash']
		duration = dashinfos['duration']
		minBufferTime = dashinfos['minBufferTime']
		videoinfo = ''
		videoid = 0
		deadlineList = []
		# videoList = sorted(dashinfos['video'], key=lambda x: x['bandwidth'], reverse=True)
		for video in dashinfos['video']:
			try:
				deadline = int(self.regStr(reg='deadline=(\d+)', src=video['baseUrl']).group(1))
			except:
				deadline = int(time.time()) + 600
			deadlineList.append(deadline)
			codecs = vid