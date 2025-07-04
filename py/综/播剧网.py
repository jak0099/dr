# -*- coding: utf-8 -*-
# 播剧网爬虫精简版 - https://www.boju.cc/
# 基于PyramidStore框架，优化精简版本

import sys
import re
import urllib.parse
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from base.spider import Spider

class Spider(Spider):

    def init(self, extend=""):
        self.host = 'https://www.boju.cc'
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        }

    def getName(self):
        return "播剧网"

    def _get_videos(self, doc, limit=None):
        """通用视频信息提取 - 修复重复问题"""
        selectors = ['//div[contains(@class,"module-item")]', '//li[contains(@class,"module-item")]',
                    '//div[contains(@class,"video-item")]'
        ]

        videos = []
        seen_ids = set()  # 用于去重

        for selector in selectors:
            elements = doc.xpath(selector)
            if elements:
                for elem in elements:
                    video = self._extract_video_info(elem)
                    if video and video['vod_id'] not in seen_ids:
                        videos.append(video)
                        seen_ids.add(video['vod_id'])

                if videos:
                    break  # 找到视频就停止尝试其他选择器

        # 如果上面的选择器都没找到，尝试更通用的方法
        if not videos:
            # 直接查找所有详情链接的父元素，但要去重
            detail_links = doc.xpath('//a[contains(@href,"/voddetail/")]')
            for link in detail_links:
                parent = link.getparent()
                if parent is not None:
                    video = self._extract_video_info(parent)
                    if video and video['vod_id'] not in seen_ids:
                        videos.append(video)
                        seen_ids.add(video['vod_id'])

        return videos[:limit] if limit and videos else videos

    def _get_category_videos(self, doc):
        """分类页面视频提取 - 排除推荐区域"""
        videos = []
        seen_ids = set()

        # 方法1: 尝试只提取分类标题下的视频
        category_areas = doc.xpath('//h4[contains(text(),"国产") or contains(text(),"日本") or contains(text(),"欧美") or contains(text(),"其他")]')

        for h4 in category_areas:
            # 获取分类标题后面的所有视频
            following_videos = h4.xpath('./following-sibling::*//div[contains(@class,"module-item")] | ./following-sibling::*//li[contains(@class,"module-item")]')

            for elem in following_videos:
                video = self._extract_video_info(elem)
                if video and video['vod_id'] not in seen_ids:
                    videos.append(video)
                    seen_ids.add(video['vod_id'])

        # 方法2: 如果方法1没找到，使用通用方法但排除明显的推荐区域
        if not videos:
            all_videos = self._get_videos(doc)
            if all_videos:
                for video in all_videos:
                    # 排除明显的推荐视频（通常图片为空或者在页面顶部）
                    if video and video['vod_id'] not in seen_ids:
                        # 如果视频有图片，说明不是推荐区域的问题视频
                        if video.get('vod_pic') and video['vod_pic'].startswith('http'):
                            videos.append(video)
                            seen_ids.add(video['vod_id'])

        # 方法3: 如果还是没找到，放宽限制但记录日志
        if not videos:
            self.log("分类页面使用备用方法提取视频")
            all_videos = self._get_videos(doc)
            if all_videos:
                for video in all_videos:
                    if video and video['vod_id'] not in seen_ids:
                        videos.append(video)
                        seen_ids.add(video['vod_id'])

        return videos

    def _extract_search_videos(self, doc):
        """搜索页面专用视频提取"""
        videos = []

        # 搜索页面的视频通常在不同的结构中
        # 尝试多种搜索页面的选择器
        search_selectors = [
            '//div[contains(@class,"module-search-item")]',
            '//div[contains(@class,"search-item")]',
            '//div[contains(@class,"module-item")]'
        ]

        for selector in search_selectors:
            elements = doc.xpath(selector)
            if elements:
                for elem in elements:
                    video = self._extract_search_video_info(elem)
                    if video:
                        videos.append(video)
                break

        # 如果上面的选择器都没找到，尝试直接查找详情链接
        if not videos:
            detail_links = doc.xpath('//a[contains(@href,"/voddetail/")]')
            for link in detail_links:
                parent = link.getparent()
                if parent is not None:
                    video = self._extract_search_video_info(parent)
                    if video:
                        videos.append(video)

        return videos

    def _extract_search_video_info(self, element):
        """搜索页面专用视频信息提取 - 修复版"""
        try:
            # 获取链接和ID
            links = element.xpath('.//a[contains(@href,"/voddetail/")]/@href')
            if not links:
                return None

            vod_id = self.regStr(r'/voddetail/(\d+)\.html', links[0])
            if not vod_id:
                return None

            # 搜索页面的标题提取 - 更精确
            title = ''

            # 方法1: 从h3标签获取
            h3_texts = element.xpath('.//h3/text() | .//h3/a/text()')
            for t in h3_texts:
                if t and t.strip() and len(t.strip()) > 1:
                    title = t.strip()
                    break

            # 方法2: 从链接title属性获取
            if not title:
                title_attrs = element.xpath('.//a[contains(@href,"/voddetail/")]/@title')
                for t in title_attrs:
                    if t and t.strip() and t.strip() != '影片详情' and len(t.strip()) > 1:
                        title = t.strip()
                        break

            # 方法3: 从链接文本获取
            if not title:
                link_texts = element.xpath('.//a[contains(@href,"/voddetail/")]/text()')
                for t in link_texts:
                    if t and t.strip() and t.strip() != '影片详情' and len(t.strip()) > 1:
                        title = t.strip()
                        break

            # 搜索页面图片处理 - 从详情页面获取（优化版）
            pic = ''

            # 方法1: 尝试基本的图片提取
            pics = element.xpath('.//img/@data-original | .//img/@data-src | .//img/@src')
            for p in pics:
                if (p and not p.startswith('data:image/gif') and
                    'gif;base64' not in p and not p.startswith('data:') and
                    p.startswith('http')):
                    pic = p
                    break

            # 方法2: 如果没有找到真实图片，从详情页面快速获取
            if not pic and vod_id:
                try:
                    # 只获取详情页面的头部信息，减少数据传输
                    detail_url = f"{self.host}/voddetail/{vod_id}.html"
                    detail_rsp = self.fetch(detail_url, headers=self.headers)

                    # 只解析前1000个字符，寻找图片信息
                    content_preview = detail_rsp.text[:2000]

                    # 使用正则表达式快速查找图片URL
                    import re
                    # 查找可能的图片URL模式 - 修复版
                    pic_patterns = [
                        r'data-src="(https?://[^"]+\.(?:jpg|jpeg|png|gif)[^"]*)"',
                        r'data-original="(https?://[^"]+\.(?:jpg|jpeg|png|gif)[^"]*)"',
                        r'src="(https?://[^"]+\.(?:jpg|jpeg|png|gif)[^"]*)"'
                    ]

                    for pattern in pic_patterns:
                        matches = re.findall(pattern, detail_rsp.text, re.IGNORECASE)
                        for match in matches:
                            if (match and match.startswith('http') and
                                not match.startswith('data:') and
                                'vip.dytt-img.com' in match):  # 确保是正确的图片域名
                                pic = match
                                break
                        if pic:
                            break

                except Exception as e:
                    self.log(f"快速获取详情页面图片失败: {str(e)}")
                    pass

            # 获取状态信息 - 更准确的提取
            remarks = ''
            text_content = ' '.join(element.xpath('.//text()'))

            # 提取"更新至第X集"信息
            if '更新至' in text_content:
                import re
                match = re.search(r'更新至[^，\s\n]*', text_content)
                if match:
                    remarks = match.group(0).strip()

            # 如果没有更新信息，尝试提取其他状态
            if not remarks:
                # 查找年份、地区等信息作为备注
                year_match = re.search(r'\b(19|20)\d{2}\b', text_content)
                if year_match:
                    remarks = year_match.group(0)

            return {'vod_id': vod_id, 'vod_name': title, 'vod_pic': pic, 'vod_remarks': remarks, 'vod_year': ''} if title and vod_id else None
        except Exception as e:
            self.log(f"搜索页面提取视频信息出错: {str(e)}")
            return None

    def _extract_video_info(self, element):
        """提取视频信息"""
        try:
            # 获取链接和ID
            links = element.xpath('.//a[contains(@href,"/voddetail/")]/@href')
            if not links:
                links = [link for link in element.xpath('.//a/@href') if '/voddetail/' in link]
            if not links:
                return None
            
            vod_id = self.regStr(r'/voddetail/(\d+)\.html', links[0])
            if not vod_id:
                return None

            # 修复标题 - 避免"影片详情"
            title = ''
            # 优先使用title属性
            title_attrs = element.xpath('.//a[contains(@href,"/voddetail/")]/@title')
            for t in title_attrs:
                if t and t.strip() and t.strip() != '影片详情' and len(t.strip()) > 1:
                    title = t.strip()
                    break

            # 如果没有title属性，尝试其他方式
            if not title:
                h3_texts = element.xpath('.//h3/text() | .//h3/a/text()')
                for t in h3_texts:
                    if t and t.strip() and t.strip() != '影片详情' and len(t.strip()) > 1:
                        title = t.strip()
                        break

            # 修复图片 - 跳过懒加载占位符
            pic = ''
            pics = element.xpath('.//img/@data-original | .//img/@data-src | .//img/@src')
            for p in pics:
                # 跳过懒加载占位符
                if (p and not p.startswith('data:image/gif') and
                    'gif;base64' not in p and not p.startswith('data:')):
                    pic = p if p.startswith('http') else self.host + p
                    break

            # 获取状态
            remarks_selectors = ['.//span[contains(@class,"pic-text")]/text()', './/div[contains(@class,"video-serial")]/text()']
            remarks = ''
            for selector in remarks_selectors:
                r = element.xpath(selector)
                if r and r[0].strip():
                    remarks = r[0].strip()
                    break

            return {'vod_id': vod_id, 'vod_name': title, 'vod_pic': pic, 'vod_remarks': remarks, 'vod_year': ''} if title and vod_id else None
        except:
            return None

    def homeContent(self, filter):
        """获取首页内容和分类"""
        result = {
            'class': [
                {'type_name': '电影', 'type_id': 'movie'},
                {'type_name': '连续剧', 'type_id': 'tvplay'},
                {'type_name': '综艺', 'type_id': 'tvshow'},
                {'type_name': '动漫', 'type_id': 'dongman'},
                {'type_name': '短剧', 'type_id': 'duanju'},
            ]
        }
        
        try:
            rsp = self.fetch(self.host, headers=self.headers)
            doc = self.html(rsp.text)
            result['list'] = self._get_videos(doc, 50)
        except Exception as e:
            self.log(f"获取首页内容出错: {str(e)}")
            result['list'] = []
        
        return result

    def categoryContent(self, tid, pg, filter, extend):
        """获取分类内容 - 修复重复问题"""
        result = {'page': pg, 'pagecount': 999, 'limit': 20, 'total': 19980}

        try:
            url = f"{self.host}/vodtype/{tid}.html" if pg == '1' else f"{self.host}/vodtype/{tid}.html?page={pg}"
            rsp = self.fetch(url, headers=self.headers)
            doc = self.html(rsp.text)

            # 分类页面特殊处理 - 排除推荐区域
            result['list'] = self._get_category_videos(doc)
        except Exception as e:
            self.log(f"获取分类内容出错: {str(e)}")
            result['list'] = []

        return result

    def searchContent(self, key, quick, pg="1"):
        """搜索内容 - 修复版"""
        result = {}

        try:
            url = f"{self.host}/vodsearch/{urllib.parse.quote(key)}-------------.html"
            if pg != "1":
                url += f"?page={pg}"

            rsp = self.fetch(url, headers=self.headers)
            doc = self.html(rsp.text)

            videos = []
            seen_ids = set()

            # 搜索页面专用提取方法
            videos = self._extract_search_videos(doc)

            # 去重处理
            unique_videos = []
            for video in videos:
                if video and video['vod_id'] not in seen_ids:
                    unique_videos.append(video)
                    seen_ids.add(video['vod_id'])

            result['list'] = unique_videos
        except Exception as e:
            self.log(f"搜索出错: {str(e)}")
            result['list'] = []

        return result

    def detailContent(self, ids):
        """获取详情内容"""
        result = {}
        videos = []

        try:
            for vod_id in ids:
                rsp = self.fetch(f"{self.host}/voddetail/{vod_id}.html", headers=self.headers)
                doc = self.html(rsp.text)

                # 获取页面所有文本用于信息提取
                all_text = ' '.join([t.strip() for t in doc.xpath('//text()') if t.strip()])

                # 提取标题
                title_selectors = ['//h1/text()', '//title/text()']
                title = ''
                for selector in title_selectors:
                    titles = doc.xpath(selector)
                    if titles:
                        title = titles[0].strip()
                        if '播剧网' in title:
                            title = title.split('_')[0].strip()
                        if title and len(title) > 1:
                            break

                # 修复详情页封面 - 跳过懒加载占位符
                pic = ''
                pic_selectors = ['//img/@data-original', '//img/@data-src', '//img/@src']
                for selector in pic_selectors:
                    pics = doc.xpath(selector)
                    for p in pics:
                        # 跳过懒加载占位符
                        if (p and not p.startswith('data:image/gif') and
                            'gif;base64' not in p and not p.startswith('data:')):
                            pic = p if p.startswith('http') else self.host + p
                            break
                    if pic:
                        break

                # 使用正则提取详细信息
                info_patterns = {
                    'director': [r'导演[：:]\s*([^主演年份地区\n]+)', r'导演\s*([^主演年份地区\n]+)'],
                    'actor': [r'主演[：:]\s*([^导演年份地区\n]+)', r'演员[：:]\s*([^导演年份地区\n]+)'],
                    'year': [r'年份[：:]\s*(\d{4})', r'(\d{4})年'],
                    'area': [r'地区[：:]\s*([^导演主演年份\n]+)', r'(美国|中国|日本|韩国|英国|大陆|香港|台湾)']
                }

                info = {}
                for key, patterns in info_patterns.items():
                    for pattern in patterns:
                        match = re.search(pattern, all_text)
                        if match:
                            info[key] = re.sub(r'[,，]\s*$', '', match.group(1).strip())
                            if info[key]:
                                break

                # 获取描述
                desc_selectors = ['//div[contains(@class,"desc")]/text()', '//div[contains(@class,"content")]/text()']
                desc = ''
                for selector in desc_selectors:
                    descs = doc.xpath(selector)
                    if descs and len(descs[0].strip()) > 10:
                        desc = descs[0].strip()
                        break

                # 解析播放源
                play_from, play_url = self._parse_play_sources(doc, vod_id)

                videos.append({
                    'vod_id': vod_id,
                    'vod_name': title,
                    'vod_pic': pic,
                    'vod_remarks': '',
                    'vod_year': info.get('year', ''),
                    'vod_area': info.get('area', ''),
                    'vod_director': info.get('director', ''),
                    'vod_actor': info.get('actor', ''),
                    'vod_content': desc,
                    'vod_play_from': '$$$'.join(play_from),
                    'vod_play_url': '$$$'.join(play_url)
                })

            result['list'] = videos
        except Exception as e:
            self.log(f"获取详情出错: {str(e)}")
            result['list'] = []

        return result

    def _parse_play_sources(self, doc, vod_id):
        """解析播放源 - 增强版"""
        try:
            # 查找播放源标题 - 增加更多选择器
            source_selectors = [
                '//div[@class="module-tab-item tab-item"]/span/text()',
                '//h3[contains(@class,"title")]/text()',
                '//div[contains(@class,"tab-item")]/text()',
                '//span[contains(@class,"tab-title")]/text()'
            ]
            source_titles = []
            for selector in source_selectors:
                titles = doc.xpath(selector)
                if titles:
                    source_titles = [t.strip() for t in titles if t.strip()]
                    self.log(f"找到播放源标题: {source_titles}")
                    break

            if not source_titles:
                source_titles = ['播剧蓝光3']

            # 查找播放列表 - 增加更多选择器
            play_selectors = [
                '//div[@class="module-play-list"]',
                '//div[contains(@class,"play-list")]',
                '//ul[contains(@class,"play-list")]',
                '//div[contains(@class,"episode-list")]'
            ]
            play_lists = []
            for selector in play_selectors:
                lists = doc.xpath(selector)
                if lists:
                    play_lists = lists
                    self.log(f"找到播放列表: {len(lists)}个")
                    break

            play_from = []
            play_url = []

            if play_lists:
                for i, play_list in enumerate(play_lists):
                    source_name = source_titles[i] if i < len(source_titles) else f'播放源{i+1}'

                    # 增强集数查找 - 尝试多种选择器
                    episode_selectors = [
                        './/a[contains(@href,"/vodplay/")]',
                        './/li/a[contains(@href,"/vodplay/")]',
                        './/span/a[contains(@href,"/vodplay/")]'
                    ]

                    episodes = []
                    for ep_selector in episode_selectors:
                        episodes = play_list.xpath(ep_selector)
                        if episodes:
                            self.log(f"播放源{i+1}使用选择器{ep_selector}找到{len(episodes)}集")
                            break

                    if episodes:
                        episode_list = []
                        for ep in episodes:
                            ep_title = ep.xpath('./text()')[0] if ep.xpath('./text()') else ''
                            ep_url = ep.xpath('./@href')[0] if ep.xpath('./@href') else ''
                            if ep_title and ep_url:
                                ep_url = ep_url if ep_url.startswith('/') else '/' + ep_url
                                episode_list.append(f"{ep_title.strip()}${ep_url}")

                        if episode_list:
                            play_from.append(source_name.strip())
                            play_url.append('#'.join(episode_list))
                            self.log(f"播放源{source_name}: {len(episode_list)}集")

            # 如果仍然没有找到播放源，尝试直接查找所有播放链接
            if not play_from:
                self.log("未找到播放列表，尝试直接查找播放链接")
                all_episodes = doc.xpath('//a[contains(@href,"/vodplay/")]')
                if all_episodes:
                    episode_list = []
                    for ep in all_episodes:
                        ep_title = ep.xpath('./text()')[0] if ep.xpath('./text()') else ''
                        ep_url = ep.xpath('./@href')[0] if ep.xpath('./@href') else ''
                        if ep_title and ep_url:
                            ep_url = ep_url if ep_url.startswith('/') else '/' + ep_url
                            episode_list.append(f"{ep_title.strip()}${ep_url}")

                    if episode_list:
                        play_from.append('播剧蓝光3')
                        play_url.append('#'.join(episode_list))
                        self.log(f"直接查找到{len(episode_list)}集")

            # 如果还是没有找到播放源，创建默认
            if not play_from:
                play_from = ['播剧蓝光3']
                play_url = [f'第1集$/vodplay/{vod_id}-1-1.html']
                self.log("使用默认播放源")

            return play_from, play_url
        except Exception as e:
            self.log(f"解析播放源出错: {str(e)}")
            return ['播剧蓝光3'], [f'第1集$/vodplay/{vod_id}-1-1.html']

    def playerContent(self, flag, id, vipFlags):
        """获取播放链接"""
        result = {}
        try:
            play_url = self.host + id if id.startswith('/vodplay/') else self.host + id
            rsp = self.fetch(play_url, headers=self.headers)
            content = rsp.text

            # 查找iframe中的视频链接
            iframe_matches = re.findall(r'<iframe[^>]*src=["\']([^"\']*)["\'][^>]*>', content, re.IGNORECASE)
            for iframe_url in iframe_matches:
                if iframe_url and ('player' in iframe_url.lower() or 'play' in iframe_url.lower()):
                    if not iframe_url.startswith('http'):
                        iframe_url = urllib.parse.urljoin(self.host, iframe_url)
                    try:
                        iframe_rsp = self.fetch(iframe_url, headers=self.headers)
                        video_url = self._extract_video_url(iframe_rsp.text)
                        if video_url:
                            return {'parse': 0, 'playUrl': '', 'url': video_url, 'header': {}}
                    except:
                        continue

            # 直接在页面中查找视频URL
            video_url = self._extract_video_url(content)
            if video_url:
                return {'parse': 0, 'playUrl': '', 'url': video_url, 'header': {}}

        except Exception as e:
            self.log(f"获取播放链接出错: {str(e)}")
        return result

    def _extract_video_url(self, content):
        """提取视频URL"""
        patterns = [
            r'"url":\s*"([^"]*\.m3u8[^"]*)"',
            r'"url":\s*"([^"]*\.mp4[^"]*)"',
            r'src\s*=\s*["\']([^"\']*\.m3u8[^"\']*)["\']',
            r'video_url\s*=\s*["\']([^"\']*)["\']'
        ]

        for pattern in patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                if match and ('m3u8' in match or 'mp4' in match):
                    # 处理转义字符
                    clean_url = match.replace('\\/', '/')
                    try:
                        decoded_url = urllib.parse.unquote(clean_url)
                        if decoded_url.startswith('http'):
                            return decoded_url
                    except:
                        if clean_url.startswith('http'):
                            return clean_url
        return ''

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass

    def localProxy(self, param):
        return None
