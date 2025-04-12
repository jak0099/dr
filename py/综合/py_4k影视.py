#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 4k影视爬虫

import sys
import json
import re
import time
import urllib.parse
import requests
from bs4 import BeautifulSoup
import datetime
import urllib.request

# 导入基础类
sys.path.append('../../')
try:
    from base.spider import Spider
except ImportError:
    # 本地调试时的替代实现
    class Spider:
        def init(self, extend=""):
            pass

class Spider(Spider):
    def __init__(self):
        # 网站主URL
        self.siteUrl = "https://www.4kvm.net"
        
        # 分类ID映射
        self.cateManual = {
            # "首页": "",
            # "电影": "movies",
            # "电视剧": "tvshows",
            # "高分电影": "imdb",
            # "热门播放": "trending",
        }
        
        # 请求头
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Referer": "https://www.4kvm.net/",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
        }
    
    def getName(self):
        return "4K影视"
    
    def init(self, extend=""):
        # 初始化方法，可以留空
        return
    
    def isVideoFormat(self, url):
        """判断是否为视频格式"""
        if not url:
            return False
        
        # 检查URL是否以视频格式结尾
        video_extensions = ['.mp4', '.m3u8', '.ts', '.flv', '.avi', '.mkv', '.mov', '.wmv']
        return any(url.lower().endswith(ext) for ext in video_extensions)
    
    def manualVideoCheck(self):
        """手动检查视频"""
        try:
            # 获取首页数据
            response = self.fetch(self.siteUrl)
            if not response or response.status_code != 200:
                return False
            
            html = response.text
            
            # 检查是否包含视频相关元素
            video_elements = ['player-box', 'video-player', 'play-btn', 'vod-play']
            return any(element in html for element in video_elements)
        except Exception as e:
            self.log(f"手动检查视频时出错: {str(e)}", "ERROR")
            return False
    
    # 工具方法 - 网络请求    
    def fetch(self, url, data=None, headers=None):
        """获取网页数据"""
        if headers is None:
            headers = self.headers
        
        try:
            if data:
                if isinstance(data, dict):
                    response = requests.get(url, params=data, headers=headers, verify=False, timeout=10)
                else:
                    response = requests.post(url, data=data, headers=headers, verify=False, timeout=10)
            else:
                response = requests.get(url, headers=headers, verify=False, timeout=10)
            
            # 构造一个类似原来的Response对象
            class MockResponse:
                def __init__(self, response):
                    self.response = response
                    self.status_code = response.status_code
                
                def read(self):
                    return self.response.content
                
                def __enter__(self):
                    return self
                
                def __exit__(self, exc_type, exc_val, exc_tb):
                    self.response.close()
            
            return MockResponse(response)
        except Exception as e:
            self.log(f"请求出错: {str(e)}", "ERROR")
            return None
    
    # 日志方法
    def log(self, message, level="INFO"):
        """记录日志"""
        try:
            # 获取当前时间
            now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # 构建日志消息
            log_message = f"[{now}] [{level}] {message}"
            
            # 打印日志
            print(log_message)
            
            # 写入日志文件
            with open("py_4kvm.log", "a", encoding="utf-8") as f:
                f.write(log_message + "\n")
        except Exception as e:
            print(f"记录日志时出错: {str(e)}")
    
    # 辅助方法 - 从URL中提取视频ID
    def extract_vid(self, url):
        """从URL中提取视频ID"""
        try:
            # 使用正则表达式提取视频ID - 根据4kvm网站URL结构调整
            pattern = r"/(movies|tvshows|seasons)/([^/\?]+)"
            match = re.search(pattern, url)
            if match:
                return match.group(2)  # 返回匹配的ID部分
            return None
        except Exception as e:
            self.log(f"提取视频ID时出错: {str(e)}", "ERROR")
            return None
    
    # 主要接口实现
    def homeContent(self, filter):
        """获取首页内容"""
        result = {}
        
        try:
            # 分类
            classes = []
            for k, v in self.cateManual.items():
                classes.append({
                    "type_id": v,
                    "type_name": k
                })
            result['class'] = classes
            
            # 获取首页数据
            response = self.fetch(self.siteUrl)
            if not response or response.status_code != 200:
                return result
            
            html = response.read().decode('utf-8')
            self.log(f"获取到首页HTML内容: {len(html)} 字节")
            
            soup = BeautifulSoup(html, 'html.parser')
            
            # 查找所有电影卡片 - 从首页推荐区域
            videos = []
            
            # 尝试查找热门影片区域
            all_h2s = soup.find_all('h2')
            hot_section = None
            for h2 in all_h2s:
                if h2.text and ('热门' in h2.text or '推荐' in h2.text):
                    hot_section = h2
                    break
                    
            if hot_section:
                self.log(f"找到热门区域: {hot_section.text}")
                # 查找热门区域后的所有影片列表
                result_items = []
                
                # 查找热门区域后的文章列表容器
                next_div = hot_section.find_next('div', class_='items')
                if next_div:
                    result_items = next_div.find_all('article')
                    self.log(f"找到 {len(result_items)} 个热门影片")
                
                if not result_items:
                    # 如果找不到特定容器，尝试直接查找后续文章
                    result_items = hot_section.find_all_next('article', limit=20)
                    self.log(f"直接查找后续文章，找到 {len(result_items)} 个影片")
                
                for item in result_items[:20]:  # 只取前20个
                    try:
                        # 获取链接
                        link_tag = item.find('a')
                        if not link_tag:
                            continue
                        
                        link = link_tag.get('href', '')
                        if not link:
                            continue
                        
                        # 提取视频ID
                        vid = self.extract_vid(link)
                        if not vid:
                            continue
                        
                        # 获取标题
                        title = ""
                        title_tag = item.find(['h3', 'div'], class_='title')
                        if title_tag:
                            title = title_tag.text.strip()
                        else:
                            # 尝试从图片alt属性获取标题
                            img_tag = item.find('img')
                            if img_tag and img_tag.get('alt'):
                                title = img_tag.get('alt').strip()
                        
                        if not title:
                            continue
                        
                        # 获取图片
                        pic = ""
                        img_tag = item.find('img')
                        if img_tag:
                            pic = img_tag.get('src', '')
                            if not pic:
                                pic = img_tag.get('data-src', '')
                            if not pic:
                                pic = img_tag.get('data-original', '')
                                
                            if pic and not pic.startswith('http'):
                                pic = urllib.parse.urljoin(self.siteUrl, pic)
                        
                        # 获取评分信息
                        remarks = ""
                        rating_tag = item.find(['span', 'div'], class_=['rating', 'score'])
                        if rating_tag:
                            remarks = rating_tag.text.strip()
                        
                        # 检查是否为电影或电视剧
                        tv_tag = item.find('span', class_='tvshows')
                        if tv_tag:
                            if remarks:
                                remarks = f"{remarks} | 电视剧"
                            else:
                                remarks = "电视剧"
                                
                        videos.append({
                            "vod_id": vid,
                            "vod_name": title,
                            "vod_pic": pic,
                            "vod_remarks": remarks
                        })
                        self.log(f"添加首页影片: {title}")
                    except Exception as e:
                        self.log(f"处理首页视频项时出错: {str(e)}", "ERROR")
                        continue
            else:
                self.log("未找到热门区域，尝试获取所有影片")
                # 如果找不到热门区域，尝试获取所有文章
                all_articles = soup.find_all('article', limit=20)
                self.log(f"找到 {len(all_articles)} 个文章")
                
                for item in all_articles:
                    try:
                        # 获取链接
                        link_tag = item.find('a')
                        if not link_tag:
                            continue
                        
                        link = link_tag.get('href', '')
                        if not link:
                            continue
                        
                        # 提取视频ID
                        vid = self.extract_vid(link)
                        if not vid:
                            continue
                        
                        # 获取标题
                        title = ""
                        title_tag = item.find(['h3', 'div'], class_='title')
                        if title_tag:
                            title = title_tag.text.strip()
                        else:
                            # 尝试从图片alt属性获取标题
                            img_tag = item.find('img')
                            if img_tag and img_tag.get('alt'):
                                title = img_tag.get('alt').strip()
                        
                        if not title:
                            continue
                        
                        # 获取图片
                        pic = ""
                        img_tag = item.find('img')
                        if img_tag:
                            pic = img_tag.get('src', '')
                            if not pic:
                                pic = img_tag.get('data-src', '')
                            if not pic:
                                pic = img_tag.get('data-original', '')
                                
                            if pic and not pic.startswith('http'):
                                pic = urllib.parse.urljoin(self.siteUrl, pic)
                        
                        # 获取评分信息
                        remarks = ""
                        rating_tag = item.find(['span', 'div'], class_=['rating', 'score'])
                        if rating_tag:
                            remarks = rating_tag.text.strip()
                        
                        # 检查是否为电影或电视剧
                        tv_tag = item.find('span', class_='tvshows')
                        if tv_tag:
                            if remarks:
                                remarks = f"{remarks} | 电视剧"
                            else:
                                remarks = "电视剧"
                                
                        videos.append({
                            "vod_id": vid,
                            "vod_name": title,
                            "vod_pic": pic,
                            "vod_remarks": remarks
                        })
                        self.log(f"添加首页影片: {title}")
                    except Exception as e:
                        self.log(f"处理首页视频项时出错: {str(e)}", "ERROR")
                        continue
            
            result['list'] = videos
        except Exception as e:
            self.log(f"获取首页内容时出错: {str(e)}", "ERROR")
        
        return result
    
    def homeVideoContent(self):
        """获取首页推荐视频内容"""
        result = {'list': []}
        videos = []
        
        
        try:
            response = self.fetch(self.siteUrl)
            if response and response.status_code == 200:
                html = response.read().decode('utf-8')
                self.log(f"获取到首页推荐HTML内容: {len(html)} 字节")
                
                soup = BeautifulSoup(html, 'html.parser')
                
                # 查找推荐区域
                all_h2s = soup.find_all('h2')
                recommended_section = None
                for h2 in all_h2s:
                    if h2.text and ('热门' in h2.text or '推荐' in h2.text):
                        recommended_section = h2
                        break
                
                if recommended_section:
                    self.log(f"找到热门区域: {recommended_section.text}")
                    # 查找热门区域后的所有影片列表
                    result_items = []
                    
                    # 查找热门区域后的文章列表容器
                    next_div = recommended_section.find_next('div', class_='items')
                    if next_div:
                        result_items = next_div.find_all('article')
                        self.log(f"找到 {len(result_items)} 个热门影片")
                    else:
                        # 如果找不到特定容器，尝试直接查找后续文章
                        result_items = recommended_section.find_all_next('article', limit=20)
                        self.log(f"直接查找后续文章，找到 {len(result_items)} 个影片")
                    
                    for item in result_items[:20]:  # 只取前20个
                        try:
                            # 获取链接
                            link_tag = item.find('a')
                            if not link_tag:
                                continue
                            
                            link = link_tag.get('href', '')
                            if not link:
                                continue
                            
                            # 提取视频ID
                            vid = self.extract_vid(link)
                            if not vid:
                                continue
                            
                            # 获取标题
                            title = ""
                            title_tag = item.find(['h3', 'div'], class_='title')
                            if title_tag:
                                title = title_tag.text.strip()
                            else:
                                # 尝试从图片alt属性获取标题
                                img_tag = item.find('img')
                                if img_tag and img_tag.get('alt'):
                                    title = img_tag.get('alt').strip()
                            
                            if not title:
                                continue
                            
                            # 获取图片
                            pic = ""
                            img_tag = item.find('img')
                            if img_tag:
                                pic = img_tag.get('src', '')
                                if not pic:
                                    pic = img_tag.get('data-src', '')
                                if not pic:
                                    pic = img_tag.get('data-original', '')
                                    
                                if pic and not pic.startswith('http'):
                                    pic = urllib.parse.urljoin(self.siteUrl, pic)
                            
                            # 获取评分信息
                            remarks = ""
                            rating_tag = item.find(['span', 'div'], class_=['rating', 'score'])
                            if rating_tag:
                                remarks = rating_tag.text.strip()
                            
                            videos.append({
                                'vod_id': vid,
                                'vod_name': title,
                                'vod_pic': pic,
                                'vod_remarks': remarks
                            })
                            self.log(f"添加首页推荐影片: {title}")
                        except Exception as e:
                            self.log(f"处理推荐视频项时出错: {str(e)}", "ERROR")
                            continue
                
        except Exception as e:
            self.log(f"获取首页推荐视频内容发生错误: {str(e)}", "ERROR")
        
        result['list'] = videos
        return result
    
    def categoryContent(self, tid, pg, filter, extend):
        """获取分类内容"""
        result = {}
        
        try:
            # 构建分类URL
            if pg > 1:
                url = f"{self.siteUrl}/{tid}/page/{pg}"
            else:
                url = f"{self.siteUrl}/{tid}"
            
            self.log(f"获取分类内容: {url}")
            
            # 获取分类页数据
            response = self.fetch(url)
            if not response or response.status_code != 200:
                return result
            
            html = response.read().decode('utf-8')
            self.log(f"获取到分类页面HTML内容: {len(html)} 字节")
            
            soup = BeautifulSoup(html, 'html.parser')
            
            # 查找所有影片列表项
            items = soup.find_all('article')
            self.log(f"找到 {len(items)} 个分类项目")
            
            videos = []
            for item in items:
                try:
                    # 获取链接
                    link_tag = item.find('a')
                    if not link_tag:
                        continue
                    
                    link = link_tag.get('href', '')
                    if not link:
                        continue
                    
                    # 提取视频ID
                    vid = self.extract_vid(link)
                    if not vid:
                        continue
                    
                    # 获取标题
                    title = ""
                    title_tag = item.find(['h3', 'div'], class_='title')
                    if title_tag:
                        title = title_tag.text.strip()
                    else:
                        # 尝试从图片alt属性获取标题
                        img_tag = item.find('img')
                        if img_tag and img_tag.get('alt'):
                            title = img_tag.get('alt').strip()
                    
                    if not title:
                        continue
                    
                    # 获取图片
                    pic = ""
                    img_tag = item.find('img')
                    if img_tag:
                        pic = img_tag.get('src', '')
                        if not pic:
                            pic = img_tag.get('data-src', '')
                        if not pic:
                            pic = img_tag.get('data-original', '')
                            
                        if pic and not pic.startswith('http'):
                            pic = urllib.parse.urljoin(self.siteUrl, pic)
                    
                    # 获取评分信息
                    remarks = ""
                    rating_tag = item.find(['span', 'div'], class_=['rating', 'score'])
                    if rating_tag:
                        remarks = rating_tag.text.strip()
                    
                    # 检查是否为电影或电视剧
                    tv_tag = item.find('span', class_='tvshows')
                    if tv_tag:
                        if remarks:
                            remarks = f"{remarks} | 电视剧"
                        else:
                            remarks = "电视剧"
                            
                    videos.append({
                        "vod_id": vid,
                        "vod_name": title,
                        "vod_pic": pic,
                        "vod_remarks": remarks
                    })
                    self.log(f"添加分类影片: {title}")
                except Exception as e:
                    self.log(f"处理分类视频项时出错: {str(e)}", "ERROR")
                    continue
            
            # 获取总页数
            total_pages = 1
            pagination = soup.find('div', class_='pagination')
            if pagination:
                page_links = pagination.find_all('a')
                for link in page_links:
                    if link.text and link.text.isdigit():
                        total_pages = max(total_pages, int(link.text))
            
            result = {
                'list': videos,
                'page': pg,
                'pagecount': total_pages,
                'limit': len(videos),
                'total': len(videos) * total_pages
            }
        except Exception as e:
            self.log(f"获取分类内容时出错: {str(e)}", "ERROR")
        
        return result
    
    def detailContent(self, ids):
        """获取详情页内容"""
        tid = ids[0]
        result = {}
        result["ids"] = ids
        try:
            # 先尝试电视剧详情页
            detail_url = f"{self.siteUrl}/seasons/{tid}"
            self.log(f"尝试获取电视剧详情页: {detail_url}")
            
            response = self.fetch(detail_url)
            if response and response.status_code == 200:
                # 电视剧详情页处理逻辑
                html = response.read().decode('utf-8')
                soup = BeautifulSoup(html, 'html.parser')
                
                # 获取标题
                title = ""
                title_tag = soup.find('h1')
                if title_tag:
                    title = title_tag.text.strip()
                
                # 获取海报
                poster = ""
                poster_tag = soup.find('div', class_='poster')
                if poster_tag:
                    img = poster_tag.find('img')
                    if img:
                        poster = img.get('src', '')
                        if not poster.startswith('http'):
                            poster = urllib.parse.urljoin(self.siteUrl, poster)
                
                # 获取简介
                content = ""
                content_tag = soup.find('div', class_='wp-content')
                if content_tag:
                    content = content_tag.text.strip()
                
                # 查找postid
                postid_match = re.search(r'postid\s*[:=]\s*(\d+)', html)
                if postid_match:
                    postid = postid_match.group(1)
                    self.log(f"找到postid: {postid}")
                    
                    # 查找videourls
                    videourls_match = re.search(r'videourls\s*[:=]\s*(\[.*?\])', html, re.DOTALL)
                    if videourls_match:
                        videourls = videourls_match.group(1)
                        self.log(f"找到videourls: {videourls[:200]}...")
                        
                        # 清理JSON字符串
                        try:
                            # 替换单引号为双引号
                            clean_json = videourls.replace("'", '"')
                            # 修复对象键名
                            clean_json = re.sub(r'(\w+):', r'"\1":', clean_json)
                            # 修复尾部逗号
                            clean_json = re.sub(r',\s*}', '}', clean_json)
                            clean_json = re.sub(r',\s*]', ']', clean_json)
                            # 修复可能的格式问题
                            clean_json = re.sub(r'}\s*{', '},{', clean_json)
                            clean_json = re.sub(r']\s*\[', '],[', clean_json)
                            
                            self.log(f"清理后的JSON: {clean_json[:200]}...")
                            
                            # 尝试解析JSON
                            try:
                                videourls_data = json.loads(clean_json)
                                self.log(f"成功解析JSON，找到{len(videourls_data)}个视频源")
                                
                                # 只处理第一个视频源
                                if videourls_data and len(videourls_data) > 0:
                                    episodes = videourls_data[0]
                                    self.log(f"第一个视频源有{len(episodes)}集")
                                    
                                    # 构建所有分集的播放链接
                                    play_urls = []
                                    for episode in episodes:
                                        if isinstance(episode, dict) and 'name' in episode and 'url' in episode:
                                            ep_name = episode['name']
                                            ep_url = episode['url']
                                            self.log(f"处理集数: {ep_name}, URL索引: {ep_url}")
                                            
                                            # 构造播放项，只包含集数和URL索引
                                            play_urls.append(f"第{ep_name}集${tid}/{ep_url}")
                                    if play_urls:
                                        # 构建结果
                                        vod = {
                                            'vod_id': tid,
                                            'vod_name': title,
                                            'vod_pic': poster,
                                            'vod_content': content,
                                            'vod_play_from': "4kvm",
                                            'vod_play_url': "#".join(play_urls)
                                        }
                                        
                                        result = {'list': [vod]}
                                        self.log(f"成功获取所有分集信息")
                                        return result
                            except json.JSONDecodeError as e:
                                self.log(f"JSON解析失败: {e}")
                                # 尝试手动解析
                                try:
                                    # 提取所有集数信息
                                    episodes = []
                                    for match in re.finditer(r'{"name":(\d+),"url":(\d+)}', clean_json):
                                        ep_name = match.group(1)
                                        ep_url = match.group(2)
                                        episodes.append({'name': ep_name, 'url': ep_url})
                                    
                                    if episodes:
                                        self.log(f"手动解析找到{len(episodes)}集")
                                        
                                        # 构建所有分集的播放链接
                                        play_urls = []
                                        for episode in episodes:
                                            ep_name = episode['name']
                                            ep_url = episode['url']
                                            self.log(f"处理集数: {ep_name}, URL索引: {ep_url}")
                                            
                                            # 构造播放项，只包含集数和URL索引
                                            play_urls.append(f"第{ep_name}集${tid}/{ep_url}")
                                        
                                        if play_urls:
                                            # 构建结果
                                            vod = {
                                                'vod_id': tid,
                                                'vod_name': title,
                                                'vod_pic': poster,
                                                'vod_content': content,
                                                'vod_play_from': "4kvm",
                                                'vod_play_url': "#".join(play_urls)
                                            }
                                            
                                            result = {'list': [vod]}
                                            self.log(f"成功获取所有分集信息")
                                            return result
                                except Exception as e:
                                    self.log(f"手动解析失败: {e}")
                                    import traceback
                                    self.log(traceback.format_exc())
                        except Exception as e:
                            self.log(f"清理JSON失败: {e}")
                            import traceback
                            self.log(traceback.format_exc())
                else:
                    self.log("未找到postid")
            else:
                # 如果电视剧详情页404，尝试电影详情页
                detail_url = f"{self.siteUrl}/movies/{tid}"
                self.log(f"尝试获取电影详情页: {detail_url}")
                
                response = self.fetch(detail_url)
                if response and response.status_code == 200:
                    html = response.read().decode('utf-8')
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # 获取标题
                    title = ""
                    title_tag = soup.find('h1')
                    if title_tag:
                        title = title_tag.text.strip()
                    
                    # 获取海报
                    poster = ""
                    poster_tag = soup.find('div', class_='poster')
                    if poster_tag:
                        img = poster_tag.find('img')
                        if img:
                            poster = img.get('src', '')
                            if not poster.startswith('http'):
                                poster = urllib.parse.urljoin(self.siteUrl, poster)
                    
                    # 获取简介
                    content = ""
                    content_tag = soup.find('div', class_='wp-content')
                    if content_tag:
                        content = content_tag.text.strip()
                    
                    self.log(f"电影信息: 标题={title}, 海报={poster}, 内容长度={len(content)}")
                    
                    # 尝试多种方式查找postid
                    postid = None
                    
                    # 方式1: 使用正则表达式查找postid
                    postid_match = re.search(r'postid\s*[:=]\s*[\'"]?(\d+)[\'"]?', html)
                    if postid_match:
                        postid = postid_match.group(1)
                        self.log(f"方式1找到电影postid: {postid}")
                    
                    # 方式2: 查找特定的播放器数据属性
                    if not postid:
                        play_buttons = soup.find_all('a', class_=['watch-btn', 'play-btn'])
                        for btn in play_buttons:
                            data_id = btn.get('data-id') or btn.get('data-post')
                            if data_id and data_id.isdigit():
                                postid = data_id
                                self.log(f"方式2找到电影postid: {postid}")
                                break
                    
                    # 方式3: 查找播放器链接中的ID
                    if not postid:
                        player_links = soup.find_all('a', href=lambda href: href and ('player' in href or 'watch' in href))
                        for link in player_links:
                            href = link.get('href', '')
                            id_match = re.search(r'[?&]id=(\d+)', href)
                            if id_match:
                                postid = id_match.group(1)
                                self.log(f"方式3找到电影postid: {postid}")
                                break
                    
                    # 方式4: 尝试从任何包含ID的脚本中提取
                    if not postid:
                        scripts = soup.find_all('script')
                        for script in scripts:
                            if script.string:
                                id_matches = re.findall(r'id\s*[:=]\s*[\'"]?(\d+)[\'"]?', script.string)
                                for match in id_matches:
                                    if match.isdigit() and len(match) > 3:  # 确保ID看起来是合理的
                                        postid = match
                                        self.log(f"方式4找到电影postid: {postid}")
                                        break
                                if postid:
                                    break
                    
                    # 方式5: 最后尝试从URL中提取ID
                    if not postid:
                        # 直接使用tid作为postid的备用方案
                        if tid.isdigit():
                            postid = tid
                            self.log(f"方式5使用tid作为电影postid: {postid}")
                        else:
                            # 尝试提取URL中的数字部分
                            digits = re.search(r'(\d+)', tid)
                            if digits:
                                postid = digits.group(1)
                                self.log(f"方式5从tid提取电影postid: {postid}")
                    
                    if postid:
                        # 构建播放链接
                        play_url = f"正片${tid}/{postid}"
                        
                        # 构建结果
                        vod = {
                            'vod_id': tid,
                            'vod_name': title,
                            'vod_pic': poster,
                            'vod_content': content,
                            'vod_play_from': "4kvm",
                            'vod_play_url': play_url
                        }
                        
                        result = {'list': [vod]}
                        self.log(f"成功获取电影信息")
                        return result
                    else:
                        self.log("未找到电影postid，尝试使用页面ID")
                        
                        # 最后的备用方案：使用页面的第一个ID
                        all_ids = re.findall(r'id=[\'"]?([a-zA-Z0-9_-]+)[\'"]?', html)
                        if all_ids:
                            for possible_id in all_ids:
                                if possible_id.isdigit() and len(possible_id) > 3:
                                    postid = possible_id
                                    self.log(f"使用备用方案找到电影postid: {postid}")
                                    
                                    # 构建播放链接
                                    play_url = f"正片${tid}/{postid}"
                                    
                                    # 构建结果
                                    vod = {
                                        'vod_id': tid,
                                        'vod_name': title,
                                        'vod_pic': poster,
                                        'vod_content': content,
                                        'vod_play_from': "4kvm",
                                        'vod_play_url': play_url
                                    }
                                    
                                    result = {'list': [vod]}
                                    self.log(f"成功获取电影信息")
                                    return result
                        
                        self.log("所有方法都无法找到电影postid")
                else:
                    self.log(f"获取电影详情页失败: {response.status_code if response else '无响应'}")
        except Exception as e:
            self.log(f"获取详情页内容发生错误: {e}")
            import traceback
            self.log(traceback.format_exc())
            
        return result
    
    def searchContent(self, key, quick, pg=1):
        """搜索内容"""
        result = {}
        
        try:
            # 构建搜索URL
            search_url = f"{self.siteUrl}/xssearch"
            data = {
                "s": key,
                "paged": pg
            }
            
            self.log(f"搜索关键词: {key}, 页码: {pg}")
            
            # 获取搜索结果
            response = self.fetch(search_url, data=data)
            if not response or response.status_code != 200:
                return result
            
            html = response.read().decode('utf-8')
            self.log(f"获取到搜索页面HTML内容: {len(html)} 字节")
            
            soup = BeautifulSoup(html, 'html.parser')
            
            # 查找搜索结果项
            result_items = soup.find_all('div', class_='result-item')
            self.log(f"找到 {len(result_items)} 个搜索结果项")
            
            videos = []
            for item in result_items:
                try:
                    # 获取文章标签内的链接
                    article = item.find('article')
                    if not article:
                        continue
                        
                    link_tag = article.find('a')
                    if not link_tag:
                        continue
                    
                    link = link_tag.get('href', '')
                    if not link:
                        continue
                    
                    # 获取标题
                    title = ""
                    title_tag = item.find('div', class_='details').find('div', class_='title') if item.find('div', class_='details') else None
                    if title_tag and title_tag.find('a'):
                        title = title_tag.find('a').text.strip()
                    else:
                        # 尝试从图片alt属性获取标题
                        img_tag = article.find('img')
                        if img_tag and img_tag.get('alt'):
                            title = img_tag.get('alt').strip()
                    
                    if not title:
                        continue
                    
                    # 获取图片
                    pic = ""
                    img_tag = article.find('img')
                    if img_tag:
                        pic = img_tag.get('src', '')
                        if not pic:
                            pic = img_tag.get('data-src', '')
                        if not pic:
                            pic = img_tag.get('data-original', '')
                            
                        if pic and not pic.startswith('http'):
                            pic = urllib.parse.urljoin(self.siteUrl, pic)
                    
                    # 检查是否为电视剧
                    tv_tag = article.find('span', class_='tvshows')
                    if tv_tag:
                        # 获取电视剧详情页
                        show_url = link if link.startswith('http') else f"{self.siteUrl}{link}"
                        self.log(f"获取电视剧详情页: {show_url}")
                        show_response = self.fetch(show_url)
                        if show_response and show_response.status_code == 200:
                            show_html = show_response.read().decode('utf-8')
                            show_soup = BeautifulSoup(show_html, 'html.parser')
                            
                            # 查找所有季的链接
                            seasons = show_soup.find_all('div', class_='se-q')
                            for season in seasons:
                                season_link = season.find('a')
                                if season_link:
                                    season_url = season_link.get('href', '')
                                    if season_url:
                                        # 获取季标题
                                        season_title = season_link.text.strip()
                                        if not season_title:
                                            season_title = f"第{len(videos)+1}季"
                                        
                                        # 提取季ID
                                        season_id = season_url.strip('/').split('/')[-1]
                                        
                                        # 获取季数
                                        season_num = re.search(r'第(\d+)季', season_title)
                                        season_num = season_num.group(1) if season_num else str(len(videos)+1)
                                        
                                        videos.append({
                                            "vod_id": season_id,
                                            "vod_name": f"{title} 第{season_num}季",
                                            "vod_pic": pic,
                                            "vod_remarks": f"第{season_num}季",
                                            "vod_type": "电视剧"
                                        })
                                        self.log(f"添加电视剧季: {title} 第{season_num}季")
                    else:
                        # 电影直接添加
                        vid = self.extract_vid(link)
                        if vid:
                            videos.append({
                                "vod_id": vid,
                                "vod_name": title,
                                "vod_pic": pic,
                                "vod_remarks": "电影",
                                "vod_type": "电影"
                            })
                            self.log(f"添加电影: {title}")
                except Exception as e:
                    self.log(f"处理搜索结果项时出错: {str(e)}", "ERROR")
                    continue
            
            result = {
                'list': videos
            }
        except Exception as e:
            self.log(f"搜索内容时出错: {str(e)}", "ERROR")
        
        return result
    
    def searchContentPage(self, key, quick, pg=1):
        return self.searchContent(key, quick, pg)
    
    def playerContent(self, flag, id, vipFlags):
        """解析播放链接"""
        result = {}
        
        try:
            self.log(f"开始解析播放链接: flag={flag}, id={id}")
            
            # 先尝试获取电视剧详情页
            detail_url = f"{self.siteUrl}/seasons/{id.split('/')[0]}"
            self.log(f"尝试获取电视剧详情页: {detail_url}")
            response = self.fetch(detail_url)
            
            if response and response.status_code == 200:
                # 是电视剧
                self.log("确认是电视剧详情页")
                html = response.read().decode('utf-8')
                
                # 查找postid
                postid_match = re.search(r'postid\s*[:=]\s*(\d+)', html)
                if postid_match:
                    postid = postid_match.group(1)
                    self.log(f"找到postid: {postid}")
                    # 获取播放页面
                    player_url = f"{self.siteUrl}/artplayer?id={postid}&source=0&ep={id.split('/')[1]}"
                    self.log(f"获取播放页面: {player_url}")
                    player_response = self.fetch(player_url)
                    
                    if player_response and player_response.status_code == 200:
                        player_html = player_response.read().decode('utf-8')
                        
                        # 查找m3u8链接
                        m3u8_match = re.search(r'url\s*[:=]\s*[\'"]([^\'"]+\.m3u8)[\'"]', player_html)
                        if m3u8_match:
                            m3u8_url = m3u8_match.group(1)
                            result["parse"] = 0
                            result["playUrl"] = m3u8_url
                            result["url"] = ''
                            result["headers"] = {
                                "Connection": "keep-alive",
                                "Content-Type": "application/x-www-form-urlencoded",
                                "user-agent": "okhttp/4.10.0",
                                "user_agent": "Mozilla/5.0 (Linux; Android 9; ASUS_I003DD Build/PI; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.70 Mobile Safari/537.36",
                                "Referer": self.siteUrl,
                                "Accept-Encoding": "gzip"
                            }
                            self.log(f"找到m3u8链接: {m3u8_url}")
                    
            else:
                # 如果不是电视剧，尝试电影详情页
                self.log("不是电视剧，尝试电影详情页")
                detail_url = f"{self.siteUrl}/movies/{id.split('/')[0]}"
                self.log(f"获取电影详情页: {detail_url}")
                postid = id.split('/')[1]
                response = self.fetch(detail_url)
                
                if response and response.status_code == 200:
                    html = response.read().decode('utf-8')
                    
                    # 使用新的方法获取m3u8链接
                    artplayer_url = f"{self.siteUrl}/artplayer?mvsource=0&id={postid}&type=hls"
                    self.log(f"获取Artplayer页面: {artplayer_url}")
                    artplayer_response = self.fetch(artplayer_url)
                    
                    if artplayer_response and artplayer_response.status_code == 200:
                        artplayer_html = artplayer_response.read().decode('utf-8')
                        
                        # 解析页面内容
                        soup = BeautifulSoup(artplayer_html, 'html.parser')
                        
                        # 查找所有script标签
                        scripts = soup.find_all('script')
                        for script in scripts:
                            if script.string:
                                # 查找m3u8链接
                                m3u8_matches = re.findall(r'url\s*[:=]\s*[\'"]([^\'"]+\.m3u8)[\'"]', script.string)
                                if m3u8_matches:
                                    m3u8_url = m3u8_matches[0]  # 获取第一个匹配的m3u8链接
                                    result["parse"] = 0
                                    result["playUrl"] = m3u8_url
                                    result["url"] = ''
                                    result["headers"] = {
                                        "Connection": "keep-alive",
                                        "Content-Type": "application/x-www-form-urlencoded",
                                        "user-agent": "okhttp/4.10.0",
                                        "user_agent": "Mozilla/5.0 (Linux; Android 9; ASUS_I003DD Build/PI; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.70 Mobile Safari/537.36",
                                        "Referer": self.siteUrl,
                                        "Accept-Encoding": "gzip"
                                    }
                                    self.log(f"找到m3u8链接: {m3u8_url}")
                                    return result
                                
                                # 查找其他可能的视频源
                                source_matches = re.findall(r'source\s*[:=]\s*[\'"]([^\'"]+)[\'"]', script.string)
                                if source_matches:
                                    for source in source_matches:
                                        if '.m3u8' in source:
                                            result["parse"] = 0
                                            result["playUrl"] = source
                                            result["url"] = ''
                                            result["headers"] = {
                                                "Connection": "keep-alive",
                                                "Content-Type": "application/x-www-form-urlencoded",
                                                "user-agent": "okhttp/4.10.0",
                                                "user_agent": "Mozilla/5.0 (Linux; Android 9; ASUS_I003DD Build/PI; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.70 Mobile Safari/537.36",
                                                "Referer": self.siteUrl,
                                                "Accept-Encoding": "gzip"
                                            }
                                            self.log(f"找到视频源: {source}")
                                            return result
                        
                        self.log("未找到m3u8链接")
                    else:
                        self.log(f"获取Artplayer页面失败: {artplayer_url}")
                else:
                    self.log(f"获取电影详情页失败: {response.status_code if response else '无响应'}")
        except Exception as e:
            self.log(f"解析播放链接时发生错误: {e}")
            import traceback
            self.log(traceback.format_exc())
        return result
    
    def localProxy(self, param):
        """本地代理"""
        return [404, "text/plain", {}, "Not Found"]