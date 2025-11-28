# -*- coding: utf-8 -*-
# by @嗷呜
import json
import random
import re
import sys
from base64 import b64decode, b64encode
import requests
from Crypto.Hash import MD5
from pyquery import PyQuery as pq

sys.path.append('..')
from base.spider import Spider


class Spider(Spider):

    def init(self, extend=""):
        self.host = "https://www.jubaba.cc/"
        self.headers.update({
            'referer': f'{self.host}/',
            'origin': self.host,
        })
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        # 初始化时先访问一次主页获取必要cookie
        self.session.get(self.host)

    def getName(self):
        return "剧巴巴"

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass

    headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 16; 24129PN74C Build/BP2A.250605.031.A3) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/137.0.7151.115 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'sec-ch-ua': '"Android WebView";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
        'sec-fetch-dest': 'document',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'x-requested-with': 'com.example.hikerview'
    }

    config = {
        "1": [{"key": "class", "name": "剧情",
               "value": [{"n": "全部", "v": ""}, {"n": "喜剧", "v": "喜剧"}, {"n": "爱情", "v": "爱情"},
                         {"n": "恐怖", "v": "恐怖"}, {"n": "动作", "v": "动作"}, {"n": "科幻", "v": "科幻"},
                         {"n": "剧情", "v": "剧情"}, {"n": "战争", "v": "战争"}, {"n": "警匪", "v": "警匪"},
                         {"n": "犯罪", "v": "犯罪"}, {"n": "动画", "v": "动画"}, {"n": "奇幻", "v": "奇幻"},
                         {"n": "武侠", "v": "武侠"}, {"n": "冒险", "v": "冒险"}, {"n": "枪战", "v": "枪战"},
                         {"n": "悬疑", "v": "悬疑"}, {"n": "惊悚", "v": "惊悚"}, {"n": "经典", "v": "经典"},
                         {"n": "青春", "v": "青春"}, {"n": "文艺", "v": "文艺"}, {"n": "微电影", "v": "微电影"},
                         {"n": "古装", "v": "古装"}, {"n": "历史", "v": "历史"}, {"n": "运动", "v": "运动"},
                         {"n": "农村", "v": "农村"}, {"n": "儿童", "v": "儿童"}, {"n": "网络电影", "v": "网络电影"}]},
              {"key": "area", "name": "地区",
               "value": [{"n": "全部", "v": ""}, {"n": "大陆", "v": "大陆"}, {"n": "香港", "v": "香港"},
                         {"n": "台湾", "v": "台湾"}, {"n": "美国", "v": "美国"}, {"n": "法国", "v": "法国"},
                         {"n": "英国", "v": "英国"}, {"n": "日本", "v": "日本"}, {"n": "韩国", "v": "韩国"},
                         {"n": "德国", "v": "德国"}, {"n": "泰国", "v": "泰国"}, {"n": "印度", "v": "印度"},
                         {"n": "意大利", "v": "意大利"}, {"n": "西班牙", "v": "西班牙"}, {"n": "加拿大", "v": "加拿大"},
                         {"n": "其他", "v": "其他"}]},
              {"key": "year", "name": "年份",
               "value": [{"n": "全部", "v": ""}, {"n": "2025", "v": "2025"}, {"n": "2024", "v": "2024"},
                         {"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}, {"n": "2021", "v": "2021"},
                         {"n": "2020", "v": "2020"}, {"n": "2019", "v": "2019"}, {"n": "2018", "v": "2018"},
                         {"n": "2017", "v": "2017"}, {"n": "2016", "v": "2016"}, {"n": "2015", "v": "2015"},
                         {"n": "2014", "v": "2014"}, {"n": "2013", "v": "2013"}, {"n": "2012", "v": "2012"},
                         {"n": "2011", "v": "2011"}, {"n": "2010", "v": "2010"}]},
              {"key": "by", "name": "排序",
               "value": [{"n": "时间", "v": "time"}, {"n": "人气", "v": "hits"}, {"n": "评分", "v": "score"}]}],
        "2": [{"key": "class", "name": "剧情",
               "value": [{"n": "全部", "v": ""}, {"n": "古装", "v": "古装"}, {"n": "战争", "v": "战争"},
                         {"n": "青春偶像", "v": "青春偶像"}, {"n": "喜剧", "v": "喜剧"}, {"n": "家庭", "v": "家庭"},
                         {"n": "犯罪", "v": "犯罪"}, {"n": "动作", "v": "动作"}, {"n": "奇幻", "v": "奇幻"},
                         {"n": "剧情", "v": "剧情"}, {"n": "历史", "v": "历史"}, {"n": "经典", "v": "经典"},
                         {"n": "乡村", "v": "乡村"}, {"n": "情景", "v": "情景"}, {"n": "商战", "v": "商战"},
                         {"n": "网剧", "v": "网剧"}, {"n": "其他", "v": "其他"}]},
              {"key": "area", "name": "地区",
               "value": [{"n": "全部", "v": ""}, {"n": "内地", "v": "内地"}, {"n": "香港", "v": "香港"},
                         {"n": "台湾", "v": "台湾"}, {"n": "美国", "v": "美国"}, {"n": "法国", "v": "法国"},
                         {"n": "英国", "v": "英国"}, {"n": "日本", "v": "日本"}, {"n": "韩国", "v": "韩国"},
                         {"n": "德国", "v": "德国"}, {"n": "泰国", "v": "泰国"}, {"n": "印度", "v": "印度"},
                         {"n": "意大利", "v": "意大利"}, {"n": "西班牙", "v": "西班牙"}, {"n": "加拿大", "v": "加拿大"},
                         {"n": "其他", "v": "其他"}]},
              {"key": "year", "name": "年份",
               "value": [{"n": "全部", "v": ""}, {"n": "2025", "v": "2025"}, {"n": "2024", "v": "2024"},
                         {"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}, {"n": "2021", "v": "2021"},
                         {"n": "2020", "v": "2020"}, {"n": "2019", "v": "2019"}, {"n": "2018", "v": "2018"},
                         {"n": "2017", "v": "2017"}, {"n": "2016", "v": "2016"}, {"n": "2015", "v": "2015"},
                         {"n": "2014", "v": "2014"}, {"n": "2013", "v": "2013"}, {"n": "2012", "v": "2012"},
                         {"n": "2011", "v": "2011"}, {"n": "2010", "v": "2010"}]},
              {"key": "by", "name": "排序",
               "value": [{"n": "时间", "v": "time"}, {"n": "人气", "v": "hits"}, {"n": "评分", "v": "score"}]}],
        "3": [{"key": "class", "name": "剧情",
               "value": [{"n": "全部", "v": ""}, {"n": "选秀", "v": "选秀"}, {"n": "情感", "v": "情感"},
                         {"n": "访谈", "v": "访谈"}, {"n": "播报", "v": "播报"}, {"n": "旅游", "v": "旅游"},
                         {"n": "音乐", "v": "音乐"}, {"n": "美食", "v": "美食"}, {"n": "纪实", "v": "纪实"},
                         {"n": "曲艺", "v": "曲艺"}, {"n": "生活", "v": "生活"}, {"n": "游戏互动", "v": "游戏互动"},
                         {"n": "财经", "v": "财经"}, {"n": "求职", "v": "求职"}]},
              {"key": "area", "name": "地区",
               "value": [{"n": "全部", "v": ""}, {"n": "内地", "v": "内地"}, {"n": "港台", "v": "港台"},
                         {"n": "欧美", "v": "欧美"}, {"n": "日韩", "v": "日韩"}, {"n": "其他", "v": "其他"}]},
              {"key": "year", "name": "年份",
               "value": [{"n": "全部", "v": ""}, {"n": "2025", "v": "2025"}, {"n": "2024", "v": "2024"},
                         {"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}, {"n": "2021", "v": "2021"},
                         {"n": "2020", "v": "2020"}, {"n": "2019", "v": "2019"}, {"n": "2018", "v": "2018"},
                         {"n": "2017", "v": "2017"}, {"n": "2016", "v": "2016"}, {"n": "2015", "v": "2015"},
                         {"n": "2014", "v": "2014"}, {"n": "2013", "v": "2013"}, {"n": "2012", "v": "2012"},
                         {"n": "2011", "v": "2011"}, {"n": "2010", "v": "2010"}]},
              {"key": "by", "name": "排序",
               "value": [{"n": "时间", "v": "time"}, {"n": "人气", "v": "hits"}, {"n": "评分", "v": "score"}]}],
        "4": [{"key": "class", "name": "剧情",
               "value": [{"n": "全部", "v": ""}, {"n": "情感", "v": "情感"}, {"n": "科幻", "v": "科幻"},
                         {"n": "热血", "v": "热血"}, {"n": "推理", "v": "推理"}, {"n": "搞笑", "v": "搞笑"},
                         {"n": "冒险", "v": "冒险"}, {"n": "萝莉", "v": "萝莉"}, {"n": "校园", "v": "校园"},
                         {"n": "动作", "v": "动作"}, {"n": "机战", "v": "机战"}, {"n": "运动", "v": "运动"},
                         {"n": "战争", "v": "战争"}, {"n": "少年", "v": "少年"}, {"n": "少女", "v": "少女"},
                         {"n": "社会", "v": "社会"}, {"n": "原创", "v": "原创"}, {"n": "亲子", "v": "亲子"},
                         {"n": "益智", "v": "益智"}, {"n": "励志", "v": "励志"}, {"n": "其他", "v": "其他"}]},
              {"key": "area", "name": "地区",
               "value": [{"n": "全部", "v": ""}, {"n": "国产", "v": "国产"}, {"n": "欧美", "v": "欧美"},
                         {"n": "日本", "v": "日本"}, {"n": "其他", "v": "其他"}]},
              {"key": "year", "name": "年份",
               "value": [{"n": "全部", "v": ""}, {"n": "2025", "v": "2025"}, {"n": "2024", "v": "2024"},
                         {"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}, {"n": "2021", "v": "2021"},
                         {"n": "2020", "v": "2020"}, {"n": "2019", "v": "2019"}, {"n": "2018", "v": "2018"},
                         {"n": "2017", "v": "2017"}, {"n": "2016", "v": "2016"}, {"n": "2015", "v": "2015"},
                         {"n": "2014", "v": "2014"}, {"n": "2013", "v": "2013"}, {"n": "2012", "v": "2012"},
                         {"n": "2011", "v": "2011"}, {"n": "2010", "v": "2010"}]},
              {"key": "by", "name": "排序",
               "value": [{"n": "时间", "v": "time"}, {"n": "人气", "v": "hits"}, {"n": "评分", "v": "score"}]}],
    }

    def homeContent(self, filter):
        data = self.getpq()
        result = {}
        classes = []
        # 解析分类菜单
        for k in data('ul.swiper-wrapper').eq(0)('li').items():
            href = k('a').attr('href')
            if href and ('vodtype' in href or 'vodshow' in href):
                tid_match = re.findall(r'\d+', href)
                if tid_match:
                    classes.append({
                        'type_name': k.text().strip(),
                        'type_id': tid_match[0],
                    })
        result['class'] = classes
        result['list'] = self.getlist(data('.ewave-vodlist.clearfix li'))
        result['filters'] = self.config
        return result

    def homeVideoContent(self):
        pass

    def categoryContent(self, tid, pg, filter, extend):
        # 构建分类URL
        area = extend.get('area', '')
        sort_by = extend.get('by', '')
        class_type = extend.get('class', '')
        year = extend.get('year', '')
        
        path = f"/vodshow/{tid}-{area}-{sort_by}-{class_type}-----{pg}---{year}.html"
        data = self.getpq(path)
        result = {}
        result['list'] = self.getlist(data('ul.ewave-vodlist.clearfix li'))
        
        # 解析分页信息
        page_info = data('.ewave-page .hide-pc.active .num').text()
        if page_info:
            try:
                current, total = page_info.split('/')
                result['page'] = int(current.strip())
                result['pagecount'] = int(total.strip())
            except:
                result['page'] = int(pg)
                result['pagecount'] = 9999
        else:
            result['page'] = int(pg)
            result['pagecount'] = 9999
            
        result['limit'] = 90
        result['total'] = 999999
        return result

    def detailContent(self, ids):
        data = self.getpq(f"/voddetail/{ids[0]}.html")
        vod = {
            'vod_id': ids[0],
            'vod_name': data('h1').text() or data('.ewave-vodlist__detail h4 a').attr('title'),
            'vod_pic': data('.ewave-vodlist__thumb').attr('data-original') or data('.ewave-vodlist__thumb').attr('src'),
            'vod_remarks': data('.pic-text').text() or '',
            'vod_year': data('.data.hidden-sm').text() or '',
            'vod_actor': ', '.join([a.text() for a in data('.text-actor a').items()]),
            'vod_director': ', '.join([a.text() for a in data('p:contains("导演") a').items()]),
            'vod_content': data('p:last-child').text() or data('.ewave-vodlist__detail .text').text(),
            'vod_play_from': '',
            'vod_play_url': ''
        }
        
        # 解析播放源
        play_from = []
        play_url = []
        
        tabs = data('ul.nav-tabs.swiper-wrapper li')
        play_lists = data('ul.ewave-content__playlist')
        
        for i, tab in enumerate(tabs.items()):
            source_name = tab.text().strip()
            if source_name and i < play_lists.length:
                play_list = play_lists.eq(i)('li a')
                episodes = []
                for ep in play_list.items():
                    ep_name = ep.text().strip()
                    ep_url = ep.attr('href')
                    if ep_name and ep_url:
                        episodes.append(f"{ep_name}${ep_url}")
                if episodes:
                    play_from.append(source_name)
                    play_url.append('#'.join(episodes))
        
        vod['vod_play_from'] = '$$$'.join(play_from)
        vod['vod_play_url'] = '$$$'.join(play_url)
        
        return {'list': [vod]}

    def searchContent(self, key, quick, pg="1"):
        if pg == "1":
            url = f"/vodsearch/-------------.html?wd={key}"
        else:
            url = f"/vodsearch/{key}----------{pg}---.html"
        data = self.getpq(url)
        return {'list': self.getlist(data('ul.ewave-vodlist.clearfix li')), 'page': int(pg)}

    def playerContent(self, flag, id, vipFlags):
        try:
            data = self.getpq(id)
            # 尝试解析播放器脚本
            script_text = data('.ewave-player__video script').text()
            if script_text:
                # 提取JSON数据
                json_match = re.search(r'var\s+player_data\s*=\s*({.*?});', script_text)
                if json_match:
                    jstr = json.loads(json_match.group(1))
                    if 'url' in jstr:
                        url = jstr['url']
                        if re.search(r'\.m3u8|\.mp4', url):
                            return {'parse': 0, 'url': url}
            
            # 备用解析方法
            iframe_src = data('.ewave-player__video iframe').attr('src')
            if iframe_src:
                return {'parse': 1, 'url': iframe_src}
                
            raise Exception('未找到播放地址')
            
        except Exception as e:
            self.log(f"解析失败: {e}")
            return {'parse': 1, 'url': f"{self.host}{id}"}

    def localProxy(self, param):
        return None

    def liveContent(self, url):
        pass

    def getpq(self, path='', min=0, max=3):
        url = f"{self.host}{path}" if path else self.host
        try:
            response = self.session.get(url)
            data = response.text
            
            if '人机验证' in data:
                if min >= max:
                    raise Exception('人机验证重试次数超限')
                
                print(f"第{min+1}次尝试人机验证")
                doc = pq(data)
                script_content = doc('script').eq(-1).text()
                
                # 提取加密参数
                token_match = re.search(r'var\s+token\s*=\s*encrypt\("([^"]+)"\);', script_content)
                url_match = re.search(r"var\s+url\s*=\s*'([^']+)';", script_content)
                
                if token_match and url_match:
                    token_plain = token_match.group(1)
                    api_path = url_match.group(1)
                    
                    # 使用固定的staticchars
                    staticchars = "PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN"
                    
                    # 加密参数
                    value_encrypted = self.encrypt(url, staticchars)
                    token_encrypted = self.encrypt(token_plain, staticchars)
                    
                    # 提交验证
                    post_data = {'value': value_encrypted, 'token': token_encrypted}
                    verify_response = self.session.post(f"{self.host}{api_path}", data=post_data)
                    
                    if verify_response.status_code == 200:
                        # 验证成功后重新请求
                        return self.getpq(path, min + 1, max)
            
            return pq(data)
            
        except Exception as e:
            print(f"请求失败: {e}")
            return pq('')

    def encrypt(self, input_str, staticchars):
        encodechars = ""
        for char in input_str:
            num0 = staticchars.find(char)
            if num0 == -1:
                code = char
            else:
                code = staticchars[(num0 + 3) % 62]
            num1 = random.randint(0, 61)
            num2 = random.randint(0, 61)
            encodechars += staticchars[num1] + code + staticchars[num2]
        return self.e64(encodechars)

    def getlist(self, data):
        videos = []
        for item in data.items():
            thumb = item('.ewave-vodlist__thumb')
            detail = item('.ewave-vodlist__detail')
            title_link = detail('h4 a') or thumb
            title = thumb.attr('title') or title_link.attr('title') or title_link.text()
            href = title_link.attr('href')
            
            if href and title:
                vod_id_match = re.findall(r'\d+', href)
                if vod_id_match:
                    videos.append({
                        'vod_id': vod_id_match[0],
                        'vod_name': title.strip(),
                        'vod_pic': thumb.attr('data-original') or thumb.attr('src') or '',
                        'vod_remarks': item('.pic-text').text() or '',
                    })
        return videos

    def e64(self, text):
        try:
            text_bytes = text.encode('utf-8')
            encoded_bytes = b64encode(text_bytes)
            return encoded_bytes.decode('utf-8')
        except Exception as e:
            print(f"Base64编码错误: {str(e)}")
            return ""

    def d64(self, encoded_text):
        try:
            # 添加padding
            padding = 4 - len(encoded_text) % 4
            if padding != 4:
                encoded_text += '=' * padding
                
            encoded_bytes = encoded_text.encode('utf-8')
            decoded_bytes = b64decode(encoded_bytes)
            return decoded_bytes.decode('utf-8')
        except Exception as e:
            print(f"Base64解码错误: {str(e)}")
            return ""

    def md5(self, text):
        h = MD5.new()
        h.update(text.encode('utf-8'))
        return h.hexdigest()

    def log(self, msg):
        print(f"[剧巴巴] {msg}")