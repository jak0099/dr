import requests
from bs4 import BeautifulSoup
import re
from base.spider import Spider
import sys
import json
import base64
import urllib.parse
import hashlib
import time

sys.path.append('..')

xurl = "https://www.ncat21.com"

headerx = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36'
}

class CDNDefendBypass:
    """绕过 cdndefend 反爬验证的类"""
    
    def __init__(self):
        self.original_array = ['7486084ACC778495566C82DF69A634E681EF8C87', 'cdndefend_js_cookie=', 'array']
    
    def array_shift(self, arr, times):
        """模拟JavaScript数组移位操作"""
        for _ in range(times):
            arr.append(arr.pop(0))
        return arr
    
    def calculate_sha1(self, text):
        """计算SHA1哈希值"""
        return hashlib.sha1(text.encode('utf-8')).hexdigest()
    
    def get_cookie_value(self):
        """计算cdndefend验证所需的cookie值"""
        # 模拟数组移位操作
        shifted_array = self.array_shift(self.original_array.copy(), 376)
        
        c = shifted_array[2]  # 获取移位后的第三个元素
        n1 = int(c[0], 16)   # 获取第一个字符的16进制值
        
        i = 0
        while True:
            test_str = c + str(i)
            sha1_hash = self.calculate_sha1(test_str)
            
            # 将SHA1哈希转换为字节数组进行检查
            sha1_bytes = bytes.fromhex(sha1_hash)
            
            if len(sha1_bytes) > n1 + 1 and sha1_bytes[n1] == 0xb0 and sha1_bytes[n1 + 1] == 0xb:
                cookie_value = f"cdndefend_js_cookie={c}{i}"
                return cookie_value
            i += 1
            
            # 防止无限循环，设置最大尝试次数
            if i > 100000:
                break
        
        return None

class Spider(Spider):
    global xurl
    global headerx
    
    def __init__(self):
        self.bypass = CDNDefendBypass()
        self.session = requests.Session()
        # 获取cdndefend cookie并添加到session中
        cookie_value = self.bypass.get_cookie_value()
        if cookie_value:
            self.session.headers.update({'Cookie': cookie_value})
        self.session.headers.update(headerx)

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
        result = {
	"class": [
		{
			"type_id": "1",
			"type_name": "电影"
		},
		{
			"type_id": "2",
			"type_name": "电视剧"
		},
		{
			"type_id": "4",
			"type_name": "综艺"
		},
		{
			"type_id": "3",
			"type_name": "动漫"
		},
		{
			"type_id": "6",
			"type_name": "短剧"
		}
	],
	"list": [],
	"filters": {
		"1": [
			{
				"key": "类型",
				"name": "类型",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "剧情",
						"v": "剧情"
					},
					{
						"n": "喜剧",
						"v": "喜剧"
					},
					{
						"n": "动作",
						"v": "动作"
					},
					{
						"n": "爱情",
						"v": "爱情"
					},
					{
						"n": "恐怖",
						"v": "恐怖"
					},
					{
						"n": "惊悚",
						"v": "惊悚"
					},
					{
						"n": "犯罪",
						"v": "犯罪"
					},
					{
						"n": "科幻",
						"v": "科幻"
					},
					{
						"n": "悬疑",
						"v": "悬疑"
					},
					{
						"n": "奇幻",
						"v": "奇幻"
					},
					{
						"n": "冒险",
						"v": "冒险"
					},
					{
						"n": "战争",
						"v": "战争"
					},
					{
						"n": "历史",
						"v": "历史"
					},
					{
						"n": "古装",
						"v": "古装"
					},
					{
						"n": "家庭",
						"v": "家庭"
					},
					{
						"n": "传记",
						"v": "传记"
					},
					{
						"n": "武侠",
						"v": "武侠"
					},
					{
						"n": "歌舞",
						"v": "歌舞"
					},
					{
						"n": "短片",
						"v": "短片"
					},
					{
						"n": "动画",
						"v": "动画"
					},
					{
						"n": "儿童",
						"v": "儿童"
					},
					{
						"n": "职场",
						"v": "职场"
					}
				]
			},
			{
				"key": "地区",
				"name": "地区",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "大陆",
						"v": "大陆"
					},
					{
						"n": "香港",
						"v": "香港"
					},
					{
						"n": "台湾",
						"v": "台湾"
					},
					{
						"n": "美国",
						"v": "美国"
					},
					{
						"n": "日本",
						"v": "日本"
					},
					{
						"n": "韩国",
						"v": "韩国"
					},
					{
						"n": "英国",
						"v": "英国"
					},
					{
						"n": "法国",
						"v": "法国"
					},
					{
						"n": "德国",
						"v": "德国"
					},
					{
						"n": "印度",
						"v": "印度"
					},
					{
						"n": "泰国",
						"v": "泰国"
					},
					{
						"n": "丹麦",
						"v": "丹麦"
					},
					{
						"n": "瑞典",
						"v": "瑞典"
					},
					{
						"n": "巴西",
						"v": "巴西"
					},
					{
						"n": "加拿大",
						"v": "加拿大"
					},
					{
						"n": "俄罗斯",
						"v": "俄罗斯"
					},
					{
						"n": "意大利",
						"v": "意大利"
					},
					{
						"n": "比利时",
						"v": "比利时"
					},
					{
						"n": "爱尔兰",
						"v": "爱尔兰"
					},
					{
						"n": "西班牙",
						"v": "西班牙"
					},
					{
						"n": "澳大利亚",
						"v": "澳大利亚"
					},
					{
						"n": "其他",
						"v": "其他"
					}
				]
			},
			{
				"key": "年代",
				"name": "年代",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "2024",
						"v": "2024"
					},
					{
						"n": "2023",
						"v": "2023"
					},
					{
						"n": "2022",
						"v": "2022"
					},
					{
						"n": "2021",
						"v": "2021"
					},
					{
						"n": "2020",
						"v": "2020"
					},
					{
						"n": "10年代",
						"v": "10年代"
					},
					{
						"n": "00年代",
						"v": "00年代"
					},
					{
						"n": "90年代",
						"v": "90年代"
					},
					{
						"n": "80年代",
						"v": "80年代"
					},
					{
						"n": "更早",
						"v": "更早"
					}
				]
			},
			{
				"key": "语言",
				"name": "语言",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "国语",
						"v": "国语"
					},
					{
						"n": "粤语",
						"v": "粤语"
					},
					{
						"n": "英语",
						"v": "英语"
					},
					{
						"n": "日语",
						"v": "日语"
					},
					{
						"n": "韩语",
						"v": "韩语"
					},
					{
						"n": "法语",
						"v": "法语"
					},
					{
						"n": "其他",
						"v": "其他"
					}
				]
			},
			{
				"key": "排序",
				"name": "排序",
				"value": [
					{
						"n": "综合",
						"v": "综合"
					},
					{
						"n": "最新",
						"v": "最新"
					},
					{
						"n": "最热",
						"v": "最热"
					},
					{
						"n": "评分",
						"v": "评分"
					}
				]
			}
		],
		"2": [
			{
				"key": "类型",
				"name": "类型",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "剧情",
						"v": "剧情"
					},
					{
						"n": "爱情",
						"v": "爱情"
					},
					{
						"n": "喜剧",
						"v": "喜剧"
					},
					{
						"n": "犯罪",
						"v": "犯罪"
					},
					{
						"n": "悬疑",
						"v": "悬疑"
					},
					{
						"n": "古装",
						"v": "古装"
					},
					{
						"n": "动作",
						"v": "动作"
					},
					{
						"n": "家庭",
						"v": "家庭"
					},
					{
						"n": "惊悚",
						"v": "惊悚"
					},
					{
						"n": "奇幻",
						"v": "奇幻"
					},
					{
						"n": "美剧",
						"v": "美剧"
					},
					{
						"n": "科幻",
						"v": "科幻"
					},
					{
						"n": "历史",
						"v": "历史"
					},
					{
						"n": "战争",
						"v": "战争"
					},
					{
						"n": "韩剧",
						"v": "韩剧"
					},
					{
						"n": "武侠",
						"v": "武侠"
					},
					{
						"n": "言情",
						"v": "言情"
					},
					{
						"n": "恐怖",
						"v": "恐怖"
					},
					{
						"n": "冒险",
						"v": "冒险"
					},
					{
						"n": "都市",
						"v": "都市"
					},
					{
						"n": "职场",
						"v": "职场"
					}
				]
			},
			{
				"key": "地区",
				"name": "地区",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "大陆",
						"v": "大陆"
					},
					{
						"n": "香港",
						"v": "香港"
					},
					{
						"n": "韩国",
						"v": "韩国"
					},
					{
						"n": "美国",
						"v": "美国"
					},
					{
						"n": "日本",
						"v": "日本"
					},
					{
						"n": "法国",
						"v": "法国"
					},
					{
						"n": "英国",
						"v": "英国"
					},
					{
						"n": "德国",
						"v": "德国"
					},
					{
						"n": "台湾",
						"v": "台湾"
					},
					{
						"n": "泰国",
						"v": "泰国"
					},
					{
						"n": "印度",
						"v": "印度"
					},
					{
						"n": "其他",
						"v": "其他"
					}
				]
			},
			{
				"key": "年代",
				"name": "年代",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "2024",
						"v": "2024"
					},
					{
						"n": "2023",
						"v": "2023"
					},
					{
						"n": "2022",
						"v": "2022"
					},
					{
						"n": "2021",
						"v": "2021"
					},
					{
						"n": "2020",
						"v": "2020"
					},
					{
						"n": "10年代",
						"v": "10年代"
					},
					{
						"n": "00年代",
						"v": "00年代"
					},
					{
						"n": "90年代",
						"v": "90年代"
					},
					{
						"n": "80年代",
						"v": "80年代"
					},
					{
						"n": "更早",
						"v": "更早"
					}
				]
			},
			{
				"key": "语言",
				"name": "语言",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "国语",
						"v": "国语"
					},
					{
						"n": "粤语",
						"v": "粤语"
					},
					{
						"n": "英语",
						"v": "英语"
					},
					{
						"n": "日语",
						"v": "日语"
					},
					{
						"n": "韩语",
						"v": "韩语"
					},
					{
						"n": "法语",
						"v": "法语"
					},
					{
						"n": "其他",
						"v": "其他"
					}
				]
			},
			{
				"key": "排序",
				"name": "排序",
				"value": [
					{
						"n": "综合",
						"v": "综合"
					},
					{
						"n": "最新",
						"v": "最新"
					},
					{
						"n": "最热",
						"v": "最热"
					},
					{
						"n": "评分",
						"v": "评分"
					}
				]
			}
		],
		"3": [
			{
				"key": "类型",
				"name": "类型",
				"value": [
					{
						"n": "动态漫画",
						"v": "动态漫画"
					},
					{
						"n": "剧情",
						"v": "剧情"
					},
					{
						"n": "动画",
						"v": "动画"
					},
					{
						"n": "喜剧",
						"v": "喜剧"
					},
					{
						"n": "冒险",
						"v": "冒险"
					},
					{
						"n": "动作",
						"v": "动作"
					},
					{
						"n": "奇幻",
						"v": "奇幻"
					},
					{
						"n": "科幻",
						"v": "科幻"
					},
					{
						"n": "儿童",
						"v": "儿童"
					},
					{
						"n": "搞笑",
						"v": "搞笑"
					},
					{
						"n": "爱情",
						"v": "爱情"
					},
					{
						"n": "家庭",
						"v": "家庭"
					},
					{
						"n": "短片",
						"v": "短片"
					},
					{
						"n": "热血",
						"v": "热血"
					},
					{
						"n": "益智",
						"v": "益智"
					},
					{
						"n": "悬疑",
						"v": "悬疑"
					},
					{
						"n": "经典",
						"v": "经典"
					},
					{
						"n": "校园",
						"v": "校园"
					},
					{
						"n": "Anime",
						"v": "Anime"
					},
					{
						"n": "运动",
						"v": "运动"
					},
					{
						"n": "亲子",
						"v": "亲子"
					},
					{
						"n": "青春",
						"v": "青春"
					},
					{
						"n": "恋爱",
						"v": "恋爱"
					},
					{
						"n": "武侠",
						"v": "武侠"
					},
					{
						"n": "惊悚",
						"v": "惊悚"
					}
				]
			},
			{
				"key": "地区",
				"name": "地区",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "日本",
						"v": "日本"
					},
					{
						"n": "大陆",
						"v": "大陆"
					},
					{
						"n": "台湾",
						"v": "台湾"
					},
					{
						"n": "美国",
						"v": "美国"
					},
					{
						"n": "香港",
						"v": "香港"
					},
					{
						"n": "韩国",
						"v": "韩国"
					},
					{
						"n": "英国",
						"v": "英国"
					},
					{
						"n": "法国",
						"v": "法国"
					},
					{
						"n": "德国",
						"v": "德国"
					},
					{
						"n": "印度",
						"v": "印度"
					},
					{
						"n": "泰国",
						"v": "泰国"
					},
					{
						"n": "丹麦",
						"v": "丹麦"
					},
					{
						"n": "瑞典",
						"v": "瑞典"
					},
					{
						"n": "巴西",
						"v": "巴西"
					},
					{
						"n": "加拿大",
						"v": "加拿大"
					},
					{
						"n": "俄罗斯",
						"v": "俄罗斯"
					},
					{
						"n": "意大利",
						"v": "意大利"
					},
					{
						"n": "比利时",
						"v": "比利时"
					},
					{
						"n": "爱尔兰",
						"v": "爱尔兰"
					},
					{
						"n": "西班牙",
						"v": "西班牙"
					},
					{
						"n": "澳大利亚",
						"v": "澳大利亚"
					},
					{
						"n": "其他",
						"v": "其他"
					}
				]
			},
			{
				"key": "年代",
				"name": "年代",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "2024",
						"v": "2024"
					},
					{
						"n": "2023",
						"v": "2023"
					},
					{
						"n": "2022",
						"v": "2022"
					},
					{
						"n": "2021",
						"v": "2021"
					},
					{
						"n": "2020",
						"v": "2020"
					},
					{
						"n": "10年代",
						"v": "10年代"
					},
					{
						"n": "00年代",
						"v": "00年代"
					},
					{
						"n": "90年代",
						"v": "90年代"
					},
					{
						"n": "80年代",
						"v": "80年代"
					},
					{
						"n": "更早",
						"v": "更早"
					}
				]
			},
			{
				"key": "语言",
				"name": "语言",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "国语",
						"v": "国语"
					},
					{
						"n": "粤语",
						"v": "粤语"
					},
					{
						"n": "英语",
						"v": "英语"
					},
					{
						"n": "日语",
						"v": "日语"
					},
					{
						"n": "韩语",
						"v": "韩语"
					},
					{
						"n": "法语",
						"v": "法语"
					},
					{
						"n": "其他",
						"v": "其他"
					}
				]
			},
			{
				"key": "排序",
				"name": "排序",
				"value": [
					{
						"n": "综合",
						"v": "综合"
					},
					{
						"n": "最新",
						"v": "最新"
					},
					{
						"n": "最热",
						"v": "最热"
					},
					{
						"n": "评分",
						"v": "评分"
					}
				]
			}
		],
		"6": [
			{
				"key": "类型",
				"name": "类型",
				"value": [
					{
						"n": "类型",
						"v": "类型"
					},
					{
						"n": "逆袭",
						"v": "逆袭"
					},
					{
						"n": "甜宠",
						"v": "甜宠"
					},
					{
						"n": "虐恋",
						"v": "虐恋"
					},
					{
						"n": "穿越",
						"v": "穿越"
					},
					{
						"n": "重生",
						"v": "重生"
					},
					{
						"n": "剧情",
						"v": "剧情"
					},
					{
						"n": "科幻",
						"v": "科幻"
					},
					{
						"n": "武侠",
						"v": "武侠"
					},
					{
						"n": "爱情",
						"v": "爱情"
					},
					{
						"n": "动作",
						"v": "动作"
					},
					{
						"n": "战争",
						"v": "战争"
					},
					{
						"n": "冒险",
						"v": "冒险"
					},
					{
						"n": "其它",
						"v": "其它"
					}
				]
			},
			{
				"key": "排序",
				"name": "排序",
				"value": [
					{
						"n": "综合",
						"v": "综合"
					},
					{
						"n": "最新",
						"v": "最新"
					},
					{
						"n": "最热",
						"v": "最热"
					}
				]
			}
		],
		"4": [
			{
				"key": "类型",
				"name": "类型",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "纪录",
						"v": "纪录"
					},
					{
						"n": "真人秀",
						"v": "真人秀"
					},
					{
						"n": "记录",
						"v": "记录"
					},
					{
						"n": "脱口秀",
						"v": "脱口秀"
					},
					{
						"n": "剧情",
						"v": "剧情"
					},
					{
						"n": "历史",
						"v": "历史"
					},
					{
						"n": "喜剧",
						"v": "喜剧"
					},
					{
						"n": "传记",
						"v": "传记"
					},
					{
						"n": "相声",
						"v": "相声"
					},
					{
						"n": "节目",
						"v": "节目"
					},
					{
						"n": "歌舞",
						"v": "歌舞"
					},
					{
						"n": "冒险",
						"v": "冒险"
					},
					{
						"n": "运动",
						"v": "运动"
					},
					{
						"n": "Season",
						"v": "Season"
					},
					{
						"n": "犯罪",
						"v": "犯罪"
					},
					{
						"n": "短片",
						"v": "短片"
					},
					{
						"n": "搞笑",
						"v": "搞笑"
					},
					{
						"n": "晚会",
						"v": "晚会"
					}
				]
			},
			{
				"key": "地区",
				"name": "地区",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "大陆",
						"v": "大陆"
					},
					{
						"n": "香港",
						"v": "香港"
					},
					{
						"n": "台湾",
						"v": "台湾"
					},
					{
						"n": "美国",
						"v": "美国"
					},
					{
						"n": "日本",
						"v": "日本"
					},
					{
						"n": "韩国",
						"v": "韩国"
					},
					{
						"n": "其他",
						"v": "其他"
					}
				]
			},
			{
				"key": "年代",
				"name": "年代",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "2024",
						"v": "2024"
					},
					{
						"n": "2023",
						"v": "2023"
					},
					{
						"n": "2022",
						"v": "2022"
					},
					{
						"n": "2021",
						"v": "2021"
					},
					{
						"n": "2020",
						"v": "2020"
					},
					{
						"n": "10年代",
						"v": "10年代"
					},
					{
						"n": "00年代",
						"v": "00年代"
					},
					{
						"n": "90年代",
						"v": "90年代"
					},
					{
						"n": "80年代",
						"v": "80年代"
					},
					{
						"n": "更早",
						"v": "更早"
					}
				]
			},
			{
				"key": "语言",
				"name": "语言",
				"value": [
					{
						"n": "全部",
						"v": ""
					},
					{
						"n": "国语",
						"v": "国语"
					},
					{
						"n": "粤语",
						"v": "粤语"
					},
					{
						"n": "英语",
						"v": "英语"
					},
					{
						"n": "日语",
						"v": "日语"
					},
					{
						"n": "韩语",
						"v": "韩语"
					},
					{
						"n": "法语",
						"v": "法语"
					},
					{
						"n": "其他",
						"v": "其他"
					}
				]
			},
			{
				"key": "排序",
				"name": "排序",
				"value": [
					{
						"n": "综合",
						"v": "综合"
					},
					{
						"n": "最新",
						"v": "最新"
					},
					{
						"n": "最热",
						"v": "最热"
					},
					{
						"n": "评分",
						"v": "评分"
					}
				]
			}
		]
	}
}



        return result

    def homeVideoContent(self):
        videos = []
        try:
            detail = self.session.get(url=xurl)
            detail.encoding = "utf-8"
            res = detail.text
            
            # 检查是否被重定向到反爬页面
            if "cdndefend" in res or "Protected by cdndefend" in res:
                # 重新计算cookie并重试
                cookie_value = self.bypass.get_cookie_value()
                if cookie_value:
                    self.session.headers.update({'Cookie': cookie_value})
                    detail = self.session.get(url=xurl)
                    detail.encoding = "utf-8"
                    res = detail.text
            
            doc = BeautifulSoup(res, "lxml")

            soups = doc.find('div', class_="section-main fs-margin-top")

            vods = soups.find_all('div', class_="module-item")

            for vod in vods:

                names = vod.find_all('img')
                name = names[1]['title']

                id = vod.find('a')['href']

                pics = vod.find_all('img')
                pic = pics[1]['data-original']

                if 'http' not in pic:
                    pic = "https://vres.jxlfl.cn" + pic

                remarks = vod.find('div', class_="v-item-bottom")
                remark = remarks.find_all('span')
                if len(remark) > 1:
                    remark = remark[1].get_text()
                remark = remark.replace(' ', '').replace('\n','')

                video = {
                    "vod_id": id,
                    "vod_name": name,
                    "vod_pic": pic,
                    "vod_remarks": remark
                         }
                videos.append(video)

            result = {'list': videos}
            return result
        except Exception as e:
            print(f"Error in homeVideoContent: {e}")
            return {'list': []}

    def categoryContent(self, cid, pg, filter, ext):
        result = {}
        if pg:
            page = int(pg)
        else:
            page = 1
        page = int(pg)
        videos = []

        if '类型' in ext.keys():
            lxType = ext['类型']
        else:
            lxType = ''
        if '地区' in ext.keys():
            DqType = ext['地区']
        else:
            DqType = ''
        if '语言' in ext.keys():
            YyType = ext['语言']
        else:
            YyType = ''
        if '年代' in ext.keys():
            NdType = ext['年代']
        else:
            NdType = ''
        if '剧情' in ext.keys():
            JqType = ext['剧情']
        else:
            JqType = ''

        if '排序' in ext.keys():
            pxType = ext['排序']
        else:
            pxType = ''

        url = f"{xurl}/show/{cid}-{lxType}-{DqType}-{YyType}-{NdType}-{pxType}-{pg}.html"

        try:
            detail = self.session.get(url)
            detail.encoding = "utf-8"
            res = detail.text
            
            # 检查是否被重定向到反爬页面
            if "cdndefend" in res or "Protected by cdndefend" in res:
                # 重新计算cookie并重试
                cookie_value = self.bypass.get_cookie_value()
                if cookie_value:
                    self.session.headers.update({'Cookie': cookie_value})
                    detail = self.session.get(url)
                    detail.encoding = "utf-8"
                    res = detail.text
            
            doc = BeautifulSoup(res, "lxml")

            soups = doc.find_all('div', class_="module-box-inner")

            for soup in soups:
                vods = soup.find_all('div', class_="module-item")

                for vod in vods:

                    names = vod.find_all('img')
                    name = names[1]['title']

                    id = vod.find('a')['href']

                    pics = vod.find_all('img')
                    pic = pics[1]['data-original']

                    if 'http' not in pic:
                        pic = "https://vres.jxlfl.cn" + pic

                    remarks = vod.find('div', class_="v-item-bottom")
                    remark = remarks.find_all('span')
                    if len(remark) > 1:
                        remark = remark[1].get_text()
                    remark = remark.replace(' ', '').replace('\n', '')

                    video = {
                        "vod_id": id,
                        "vod_name": name,
                        "vod_pic": pic,
                        "vod_remarks": remark
                    }
                    videos.append(video)

        except Exception as e:
            print(f"Error in categoryContent: {e}")

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
        if 'http' not in did:
            did = xurl + did
        
        try:
            res1 = self.session.get(url=did)
            res1.encoding = "utf-8"
            res = res1.text
            
            # 检查是否被重定向到反爬页面
            if "cdndefend" in res or "Protected by cdndefend" in res:
                # 重新计算cookie并重试
                cookie_value = self.bypass.get_cookie_value()
                if cookie_value:
                    self.session.headers.update({'Cookie': cookie_value})
                    res1 = self.session.get(url=did)
                    res1.encoding = "utf-8"
                    res = res1.text

            content = '😸繁华🎉为您介绍剧情📢' + self.extract_middle_text(res,'<div class="detail-desc">','</p>', 0)
            content = content.replace(' ', '').replace('\n', '').replace('<p>', '')

            xianlu = self.extract_middle_text(res, '<div class="source-box">','<div class="episode-box-main">',2, 'class=".*?" id=".*?">(.*?)</span>')

            bofang = self.extract_middle_text(res, '<div class="episode-list"', '</div>', 3,'<a href="(.*?)"\s+class=".*?">(.*?)</a>')

            # 提取演员和导演
            actors= self.extract_middle_text(res, '<div class="detail-info-row-side">演员:</div>', '</div>', 0, '<a.*?</a>')
            actors = actors.replace('/search?k=', '').replace('                ', '').replace('\n', '')
            
            # 提取导演信息
            director= self.extract_middle_text(res, '<div class="detail-info-row-side">导演:</div>', '</div>', 0, '>(.*?)</a>')
            director = director.replace('/search?k=%', '')

            videos.append({
                "vod_id": did,
                "vod_actor": actors,
                "vod_director": director,
                "vod_content": content,
                "vod_play_from": xianlu,
                "vod_play_url": bofang
                         })

            result['list'] = videos
        except Exception as e:
            print(f"Error in detailContent: {e}")
            result['list'] = []
        
        return result

    def playerContent(self, flag, id, vipFlags):
        parts = id.split("http")
        xiutan = 1
        
        if xiutan == 1:
            if len(parts) > 1:
                before_https, after_https = parts[0], 'http' + parts[1]
            result = {}
            result["parse"] = xiutan
            result["playUrl"] = ''
            result["url"] = after_https
            result["header"] = headerx
            return result

    def searchContentPage(self, key, quick, page):
        result = {}
        videos = []
        if not page:
            page = '1'
        if page == '1':
            url = f'{xurl}/search?os=pc&k={key}'
        else:
            url = f'{xurl}/search?k={key}&page={str(page)}'

        try:
            detail = self.session.get(url=url)
            detail.encoding = "utf-8"
            res = detail.text
            
            # 检查是否被重定向到反爬页面
            if "cdndefend" in res or "Protected by cdndefend" in res:
                # 重新计算cookie并重试
                cookie_value = self.bypass.get_cookie_value()
                if cookie_value:
                    self.session.headers.update({'Cookie': cookie_value})
                    detail = self.session.get(url=url)
                    detail.encoding = "utf-8"
                    res = detail.text
            
            doc = BeautifulSoup(res, "lxml")

            soups = doc.find_all('div', class_="search-result-list")

            for item in soups:
                vods = item.find_all('a')

                for vod in vods:

                    names = vod.find_all('img')
                    name = names[1]['title']

                    id = vod['href']

                    pics = vod.find_all('img')
                    pic = pics[1]['data-original']

                    if 'http' not in pic:
                        pic = "https://vres.jxlfl.cn" + pic

                    video = {
                        "vod_id": id,
                        "vod_name": name,
                        "vod_pic": pic
                            }
                    videos.append(video)

            result['list'] = videos
        except Exception as e:
            print(f"Error in searchContentPage: {e}")
            result['list'] = []
            
        result['page'] = page
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def searchContent(self, key, quick):
        return self.searchContentPage(key, quick, '1')

    def localProxy(self, params):
        if params['type'] == "m3u8":
            return self.proxyM3u8(params)
        elif params['type'] == "media":
            return self.proxyMedia(params)
        elif params['type'] == "ts":
            return self.proxyTs(params)
        return None

if __name__ == '__main__':
    spider_instance = Spider()

    # res=spider_instance.homeContent('filter')  #  分类🚨
    #
    # res = spider_instance.homeVideoContent()  # 首页🚨
    #
    # res=spider_instance.categoryContent('2', 2, 'filter', {})  #  分页🚨
    #
    res = spider_instance.detailContent(['https://www.ncat21.com/detail/253986.html'])  #  详情页🚨
    #
    # res = spider_instance.playerContent('1', '0https://www.mjzj.me/74354-1-1.html', 'vipFlags')  #  播放页🚨
    #
    # res = spider_instance.searchContentPage('爱情', 'quick', '2')  # 搜索页🚨

    print(res)