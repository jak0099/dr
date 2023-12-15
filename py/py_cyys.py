# coding=utf-8
# !/usr/bin/python
import sys
import re
sys.path.append('..')
from base.spider import Spider
import urllib.parse
import json
import base64
from Crypto.Cipher import AES

class Spider(Spider):  # 元类 默认的元类 type
    def getName(self):
        return "创艺影视"

    def init(self, extend=""):
        print("============{0}============".format(extend))
        pass

    def homeContent(self, filter):
        result = {}
        cateManual = {
            "电影": "1",
            "剧集": "2",
            "动漫": "4",
            "综艺": "3",
            "纪录片": "30"
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
        result = {
            'list': []
        }
        return result

    def categoryContent(self, tid, pg, filter, extend):
        result = {}
        header = {"User-Agent": "Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36"}
        url = 'https://www.30dian.cn/vodtype/{0}-{1}.html'.format(tid, pg)
        rsp = self.fetch(url,headers=header)
        root = self.html(self.cleanText(rsp.text))
        aList = root.xpath("//div[@class='module-list module-lines-list']/div/div")
        videos = []
        for a in aList:
            name = name = a.xpath("./div[@class='module-item-cover']/div/a/@title")[0]
            pic = a.xpath("./div[@class='module-item-cover']/div/img/@data-src")[0]
            mark = a.xpath("./div[@class='module-item-text']/text()")[0]
            sid = self.regStr(reg=r'voddetail\/(.*?).html', src=a.xpath("./div[@class='module-item-cover']/div/a/@href")[0])
            videos.append({
                "vod_id": sid,
                "vod_name": name,
                "vod_pic": pic,
                "vod_remarks": mark
            })
        result['list'] = videos
        result['page'] = pg
        result['pagecount'] = 999
        result['limit'] = 5
        result['total'] = 9999
        return result

    def detailContent(self, array):
        tid = array[0]
        url = 'https://www.30dian.cn/voddetail/{0}.html'.format(tid)
        header = {"User-Agent": "Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36"}
        rsp = self.fetch(url,headers=header)
        root = self.html(self.cleanText(rsp.text))
        divContent = root.xpath("//div[@class='box view-heading']")[0]
        title = divContent.xpath(".//div[@class='video-info-header']/h1/text()")[0].strip()
        pic = divContent.xpath(".//div[@class='module-item-pic']/img/@data-src")[0]
        vod = {
            "vod_id": tid,
            "vod_name": title,
            "vod_pic": pic,
            "type_name": "",
            "vod_year": "",
            "vod_area": "",
            "vod_remarks": "",
            "vod_actor": "",
            "vod_director": "",
            "vod_content": ""
        }
        vod_play_from = '$$$'
        playFrom = []
        titles = root.xpath(".//div[contains(@class,'module-player-tab')]/div[@class='module-tab-items']/div[@class='module-tab-content']")[0]
        vodHeader = titles.xpath("./div/span/text()")
        for v in vodHeader:
            playFrom.append(self.cleanText(v).replace(" ", ""))
        vod_play_from = vod_play_from.join(playFrom)
        vod_play_url = '$$$'
        playList = []
        vodList = root.xpath(".//div[@class='module']/div[contains(@id,'glist-')]")
        for vl in vodList:
            vodItems = []
            aList = vl.xpath(".//div[@class='scroll-content']/a")
            if len(aList) <= 0:
                name = '无法找到播放源'
                tId = '00000'
                vodItems.append(name + "$" + tId)
            else:
                for tA in aList:
                    href = tA.xpath('./@href')[0]
                    name = tA.xpath("./span/text()")[0].strip()
                    tId = self.regStr(href, '/vodplay/(\\S+).html')
                    vodItems.append(name + "$" + tId)
            joinStr = '#'
            joinStr = joinStr.join(vodItems)
            playList.append(joinStr)
        vod_play_url = vod_play_url.join(playList)

        vod['vod_play_from'] = vod_play_from
        vod['vod_play_url'] = vod_play_url
        result = {
            'list': [
                vod
            ]
        }
        return result

    def searchContent(self, key, quick):
        url = 'https://www.30dian.cn/vodsearch/-------------.html?wd={0}'.format(key)
        header = {
            "User-Agent": "Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36"}
        rsp = self.fetch(url, headers=header)
        root = self.html(self.cleanText(rsp.text))
        aList = root.xpath("//div[@class='module-items']/div")
        videos = []
        for a in aList:
            name = a.xpath(".//div[@class='module-item-pic']/img/@alt")[0]
            pic = a.xpath(".//div[@class='module-item-pic']/img/@data-src")[0]
            sid = a.xpath(".//div[@class='video-info']/div[@class='video-info-header']/a/@href")[0]
            sid = self.regStr(sid,'/voddetail/(\\S+).html')
            videos.append({
                "vod_id": sid,
                "vod_name": name,
                "vod_pic": pic,
                "vod_remarks": ''
            })
        result = {
            'list': videos
        }
        return result
    def parseCBC(self, enc, key, iv):
        keyBytes = key.encode("utf-8")
        ivBytes = iv.encode("utf-8")
        cipher = AES.new(keyBytes, AES.MODE_CBC, ivBytes)
        msg = cipher.decrypt(enc)
        paddingLen = msg[len(msg) - 1]
        return msg[0:-paddingLen]

    def playerContent(self, flag, id, vipFlags):
        result = {}
        header = {
            "User-Agent": "Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36"}
        if id == '00000':
            return {}
        url = 'https://www.30dian.cn/vodplay/{0}.html'.format(id)
        rsp = self.fetch(url, headers=header)
        jo = self.regStr(reg='var player_data=(.*?)</script>', src=self.cleanText(rsp.text))
        scripts = json.loads(jo)
        ukey = scripts['url']
        pf = scripts['from']
        purl = urllib.parse.unquote(ukey)
        if purl.startswith('http'):
            purl = purl
            if pf == 'wjm3u8':
                prsp = self.fetch(purl, headers=header)
                purle = prsp.text.strip('\n').split('\n')[-1]
                purls = re.findall(r"http.*://.*?/", purl)[0].strip('/')
                purl = purls + purle
        else:
            scrurl = 'https://vip.30dian.cn/?url={0}'.format(purl)
            script = self.fetch(scrurl,headers=header)
            html = script.text
            pat = 'var le_token = \\"([\\d\\w]+)\\"'
            cpat = 'getVideoInfo\\(\\"(.*)\\"\\)'
            content = self.regStr(html, cpat)
            iv = self.regStr(html, pat)
            key = 'A42EAC0C2B408472'
            purl = self.parseCBC(base64.b64decode(content), key, iv).decode()
        result["parse"] = 0
        result["playUrl"] = ''
        result["url"] = purl
        result["header"] = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"}
        return result

    config = {
        "player": {},
        "filter": {}
    }
    header = {}

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def localProxy(self, param):
        action = {
            'url': '',
            'header': '',
            'param': '',
            'type': 'string',
            'after': ''
        }
        return [200, "video/MP2T", action, ""]