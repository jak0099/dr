# coding = utf-8
#!/usr/bin/python

"""

作者 丢丢喵 🚓 内容均从互联网收集而来 仅供交流学习使用 版权归原创者所有 如侵犯了您的权益 请通知作者 将及时删除侵权内容
                    ====================Diudiumiao====================

"""

from Crypto.Util.Padding import unpad
from Crypto.Util.Padding import pad
from urllib.parse import urlencode
from urllib.parse import unquote
from Crypto.Cipher import ARC4
from urllib.parse import quote
from base.spider import Spider
from Crypto.Cipher import AES
from bs4 import BeautifulSoup
from datetime import datetime
from base64 import b64decode
import urllib.request
import urllib.parse
import datetime
import binascii
import requests
import base64
import json
import time
import sys
import re
import os

sys.path.append('..')

xurl = "https://ccc.chaojichaojichanga.com:35620"

xurl1 = "http://ccs.jshh.gzbaoxian.com"

xurl2 = "http://101.42.92.211:5560"

# 新增的解析地址
xurl3 = "https://new.tianjinzhitongdaohe.com"

headerx = {
    'User-Agent': 'Mozilla/5.0 (Linux; U; Android 8.0.0; zh-cn; Mi Note 2 Build/OPR1.170623.032) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.128 Mobile Safari/537.36 XiaoMi/MiuiBrowser/10.1.1'
          }

headers = {
    "User-Agent": "com.android.chrome/131.0.6778.200 (Linux;Android 9) AndroidXMedia3/1.5.1"
          }

class Spider(Spider):
    global xurl
    global xurl1
    global xurl2
    global xurl3
    global headerx
    global headers

    def getName(self):
        return "首页"

    def init(self, extend):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def extract_middle_text(self, text, start_str, end_str, pl, start_index1: str = '', end_index2: str = ''):
        if pl == 3:
            plx = []
            while True:
                start_index = text.find(start_str)
                if start_index == -1:
                    break
                end_index = text.find(end_str, start_index + len(start_str))
                if end_index == -1:
                    break
                middle_text = text[start_index + len(start_str):end_index]
                plx.append(middle_text)
                text = text.replace(start_str + middle_text + end_str, '')
            if len(plx) > 0:
                purl = ''
                for i in range(len(plx)):
                    matches = re.findall(start_index1, plx[i])
                    output = ""
                    for match in matches:
                        match3 = re.search(r'(?:^|[^0-9])(\d+)(?:[^0-9]|$)', match[1])
                        if match3:
                            number = match3.group(1)
                        else:
                            number = 0
                        if 'http' not in match[0]:
                            output += f"#{match[1]}${number}{xurl}{match[0]}"
                        else:
                            output += f"#{match[1]}${number}{match[0]}"
                    output = output[1:]
                    purl = purl + output + "$$$"
                purl = purl[:-3]
                return purl
            else:
                return ""
        else:
            start_index = text.find(start_str)
            if start_index == -1:
                return ""
            end_index = text.find(end_str, start_index + len(start_str))
            if end_index == -1:
                return ""

        if pl == 0:
            middle_text = text[start_index + len(start_str):end_index]
            return middle_text.replace("\\", "")

        if pl == 1:
            middle_text = text[start_index + len(start_str):end_index]
            matches = re.findall(start_index1, middle_text)
            if matches:
                jg = ' '.join(matches)
                return jg

        if pl == 2:
            middle_text = text[start_index + len(start_str):end_index]
            matches = re.findall(start_index1, middle_text)
            if matches:
                new_list = [f'{item}' for item in matches]
                jg = '$$$'.join(new_list)
                return jg

    def homeContent(self, filter):
        result = {}
        result = {"class": [{"type_id": "都市@%E9%", "type_name": "都市"},
                            {"type_id": "反转@%E5%", "type_name": "反转"},
                            {"type_id": "萌宝@%E8%", "type_name": "萌宝"},
                            {"type_id": "古装@%E5%", "type_name": "古装"},
                            {"type_id": "逆袭@%E9%", "type_name": "逆袭"},
                            {"type_id": "喜剧@%E5%", "type_name": "喜剧"},
                            {"type_id": "闪婚@%E9%", "type_name": "闪婚"},
                            {"type_id": "王妃@%E7%", "type_name": "王妃"},
                            {"type_id": "校园@%E6%", "type_name": "校园"},
                            {"type_id": "民国@%E6%", "type_name": "民国"},
                            {"type_id": "年代@%E5%", "type_name": "年代"},
                            {"type_id": "脑洞@%E8%", "type_name": "脑洞"},
                            {"type_id": "总裁@%E6%", "type_name": "总裁"}],
                 }

        return result

    def decrypt1(self, encrypted_base64_content, key_text):
        key_text = key_text
        key = key_text.encode('utf-8')
        encrypted_bytes = base64.b64decode(encrypted_base64_content)
        cipher = AES.new(key, AES.MODE_ECB)
        decrypted_padded_bytes = cipher.decrypt(encrypted_bytes)
        decrypted_bytes = unpad(decrypted_padded_bytes, AES.block_size)
        decrypted_text = decrypted_bytes.decode('utf-8')
        parsed_json = json.loads(decrypted_text)
        return parsed_json

    def process_video_data(self, detail):
        videos = []
        js = detail['data']
        for vod in js:
            name = vod['vod_name']
            id = vod['vod_id']
            pic = vod['vod_pic']
            remark = vod['vod_douban_score']
            video = {
                "vod_id": id,
                "vod_name": name,
                "vod_pic": pic,
                "vod_remarks": '️豆瓣评分' + remark + '分'
                    }
            videos.append(video)
        return videos

    def homeVideoContent(self):
        videos = []

        for page in [1, 2, 3]:

            params = {
                "class": "",
                "order": "最新",
                "type_id": 5,
                "area": "",
                "year": "",
                "state": "",
                "wd": "",
                "page": page
                     }

            url = f"{xurl}/list"
            detail = requests.get(url=url, params=params, headers=headerx)
            detail.encoding = "utf-8"
            res = detail.text

            key_text = f"/list?class=&ord"
            detail = self.decrypt1(res, key_text)
            videos = self.process_video_data(detail)

        result = {'list': videos}
        return result

    def categoryContent(self, cid, pg, filter, ext):
        result = {}
        videos = []

        fenge = cid.split("@")

        if pg:
            page = int(pg)
        else:
            page = 1

        params = {
            "class": fenge[0],
            "order": "最新",
            "type_id": 5,
            "area": "",
            "year": "",
            "state": "",
            "wd": "",
            "page": str(page)
                 }

        url = f"{xurl}/list"
        detail = requests.get(url=url, params=params, headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text

        key_text = f"/list?class={fenge[1]}"
        detail = self.decrypt1(res , key_text)
        videos = self.process_video_data(detail)

        result = {'list': videos}
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def detailContent(self, ids):
        did = ids[0]
        result = {}
        videos = []
        xianlu = ''
        bofang = ''

        url = f"{xurl}/detail?vod_id={did}"
        detail = requests.get(url=url, headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text

        vod_id = str(did)[0]
        key_text = f"/detail?vod_id={vod_id}"
        detail = self.decrypt1(res, key_text)

        content = detail['data']['vod_content']

        remarks = "共" + str(detail['data']['vod_total']) + "集"

        year = detail['data']['vod_year']

        area = detail['data']['vod_area']

        soup = detail['data']['sources'][0]['episodes']

        for sou in soup:

            id = sou['url']

            name = sou['name']

            bofang = bofang + name + '$' + id + '#'

        bofang = bofang[:-1]

        xianlu = '牛牛短剧'

        videos.append({
            "vod_id": did,
            "vod_remarks": remarks,
            "vod_year": year,
            "vod_area": area,
            "vod_content": content,
            "vod_play_from": xianlu,
            "vod_play_url": bofang
                     })

        result['list'] = videos
        return result

    def playerContent(self, flag, id, vipFlags):
        # 定义解析接口列表（按优先级排序）
        parse_urls = [
            # 第一个接口
            f"{xurl1}/jx/qy.php?url={id}",
            f"{xurl1}/jx/dj.php?url={id}",
            # 第二个接口
            f"{xurl2}/jx/dj.php?url={id}",
            # 新增的第三个接口
            f"{xurl3}/jx/qy.php?url={id}",
            f"{xurl3}/jx/dj.php?url={id}",
            # 尝试其他可能的路径
            f"{xurl3}/player/api.php?url={id}",
            f"{xurl3}/play/api.php?url={id}",
            f"{xurl3}/parse/index.php?url={id}"
        ]
        
        url = None
        last_error = ""
        
        # 尝试所有解析接口
        for parse_url in parse_urls:
            try:
                print(f"DEBUG: Trying parse_url: {parse_url}")
                # 设置超时时间，避免长时间等待
                detail = requests.get(url=parse_url, headers=headerx, timeout=15, verify=False)
                detail.encoding = "utf-8"
                res = detail.text
                
                # 检查返回内容是否为空
                if not res or res.strip() == "":
                    print(f"DEBUG: Empty response from {parse_url}")
                    last_error = f"Empty response from {parse_url}"
                    continue
                
                # 尝试解析 JSON
                try:
                    data = json.loads(res)
                    print(f"DEBUG: JSON parsed successfully from {parse_url}")
                    
                    if "url" in data and data["url"] and data["url"].strip() != "":
                        url = data["url"]
                        print(f"DEBUG: Found url from JSON: {url}")
                        break
                    elif "m3u8" in data and data["m3u8"] and data["m3u8"].strip() != "":
                        url = data["m3u8"]
                        print(f"DEBUG: Found m3u8 from JSON: {url}")
                        break
                    elif "video" in data and data["video"] and data["video"].strip() != "":
                        url = data["video"]
                        print(f"DEBUG: Found video from JSON: {url}")
                        break
                    else:
                        print(f"DEBUG: No valid url in JSON response from {parse_url}")
                        last_error = f"No valid url in JSON response from {parse_url}"
                        
                except json.JSONDecodeError:
                    # 如果不是JSON格式，尝试从HTML中提取视频地址
                    print(f"DEBUG: Not JSON format from {parse_url}, trying to extract from HTML")
                    
                    # 尝试从HTML中提取m3u8或mp4地址
                    patterns = [
                        r'"(https?://[^"\']+\.m3u8[^"\']*)"',
                        r'"(https?://[^"\']+\.mp4[^"\']*)"',
                        r'src="(https?://[^"\']+\.m3u8[^"\']*)"',
                        r'src="(https?://[^"\']+\.mp4[^"\']*)"',
                        r'url\s*:\s*"(https?://[^"\']+)"',
                        r'video\s*:\s*"(https?://[^"\']+)"'
                    ]
                    
                    for pattern in patterns:
                        matches = re.findall(pattern, res, re.IGNORECASE)
                        if matches:
                            url = matches[0]
                            print(f"DEBUG: Found video URL from HTML with pattern {pattern}: {url}")
                            break
                    
                    if url:
                        break
                        
            except requests.RequestException as e:
                print(f"DEBUG: Request error for {parse_url}: {e}")
                last_error = f"Request error: {e}"
                continue
            except Exception as e:
                print(f"DEBUG: Unexpected error for {parse_url}: {e}")
                last_error = f"Unexpected error: {e}"
                continue
        
        # 如果所有解析接口都失败，尝试其他方法
        if not url:
            print(f"DEBUG: All parse URLs failed, trying alternative methods")
            
            # 方法1: 尝试直接使用id作为播放地址（如果是完整URL）
            if id.startswith(('http://', 'https://', '//')):
                url = id
                print(f"DEBUG: Using id as direct URL: {url}")
            
            # 方法2: 尝试base64解码
            elif id and len(id) > 10:
                try:
                    # 尝试直接base64解码
                    decoded = base64.b64decode(id).decode('utf-8')
                    if decoded.startswith(('http://', 'https://', '//')):
                        url = decoded
                        print(f"DEBUG: Using base64 decoded URL: {url}")
                except:
                    # 如果不是标准base64，尝试添加padding后解码
                    try:
                        padding = 4 - len(id) % 4
                        if padding != 4:
                            id_padded = id + '=' * padding
                            decoded = base64.b64decode(id_padded).decode('utf-8')
                            if decoded.startswith(('http://', 'https://', '//')):
                                url = decoded
                                print(f"DEBUG: Using padded base64 decoded URL: {url}")
                    except:
                        pass
        
        # 如果还是没有找到URL，尝试从固定的备用地址构建
        if not url and id:
            print(f"DEBUG: Still no URL found, trying backup methods")
            
            # 检查id是否是相对路径
            if not id.startswith(('http://', 'https://', '//', 'magnet:', 'ftp:')):
                # 尝试组合成完整URL
                backup_hosts = [
                    xurl,
                    xurl1,
                    xurl2,
                    xurl3,
                    "https://vip.ffzy-online6.com",
                    "https://vip.ffzy-online5.com"
                ]
                
                for host in backup_hosts:
                    test_url = f"{host}/{id.lstrip('/')}"
                    # 简单测试该URL是否有效
                    try:
                        test_resp = requests.head(test_url, timeout=5, allow_redirects=True)
                        if test_resp.status_code < 400:
                            url = test_url
                            print(f"DEBUG: Found working backup URL: {url}")
                            break
                    except:
                        continue
        
        # 构建结果
        result = {}
        result["parse"] = 0
        result["playUrl"] = ''
        result["header"] = headerx
        
        if url:
            result["url"] = url
            print(f"DEBUG: Success! Final URL: {url}")
        else:
            result["url"] = ''
            print(f"DEBUG: Failed to get play URL. Last error: {last_error}")
            print(f"DEBUG: Original id was: {id}")
            
            # 作为最后的手段，返回一个测试用的播放地址（如果有的话）
            # 这行代码可以注释掉，仅供测试使用
            # result["url"] = "https://example.com/test.mp4"
        
        return result

    def searchContentPage(self, key, quick, pg):
        result = {}
        videos = []

        if pg:
            page = int(pg)
        else:
            page = 1

        params = {
            "class": "",
            "order": "",
            "type_id": 5,
            "area": "",
            "year": "",
            "state": "",
            "wd": key,
            "page": str(page)
                 }

        url = f"{xurl}/list"
        detail = requests.get(url=url, params=params, headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text

        key_text = f"/list?class=&ord"
        detail = self.decrypt1(res, key_text)
        videos = self.process_video_data(detail)

        result = {'list': videos}
        result['page'] = page
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def searchContent(self, key, quick, pg="1"):
        return self.searchContentPage(key, quick, '1')

    def localProxy(self, params):
        if params['type'] == "m3u8":
            return self.proxyM3u8(params)
        elif params['type'] == "media":
            return self.proxyMedia(params)
        elif params['type'] == "ts":
            return self.proxyTs(params)
        return None