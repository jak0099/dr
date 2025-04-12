# PyramidStore 视频网站爬虫开发完全指南

## 1. PyramidStore爬虫框架简介

PyramidStore是一个用于开发Python影视爬虫的框架，它允许开发者通过简单的配置和代码实现，从各类视频网站抓取影视资源并以标准格式展示。该框架采用插件化设计，方便开发者快速实现不同网站的爬虫。

### 1.1 基本概念

- **插件机制**：每个爬虫作为一个独立插件，放置在`plugin`目录下
- **标准化输出**：统一的数据结构，便于上层应用处理
- **代理功能**：支持本地代理，处理特殊格式的视频流

### 1.2 前提条件

- 基本的Python编程知识
- 了解HTTP请求和HTML/JSON解析
- 熟悉网络爬虫的基本概念
- 具备基础的网页分析能力

## 2. 爬虫开发环境准备

### 2.1 工具准备

- Python 3.6+ 环境
- 开发工具（如VS Code、PyCharm等）
- 网页分析工具（如Chrome开发者工具）
- HTTP调试工具（如Postman、Fiddler）

### 2.2 依赖库安装

```bash
pip install requests
pip install beautifulsoup4
pip install lxml
pip install pycryptodome  # 用于某些加密解密场景
```

### 2.3 项目结构

基于[fish2018/py_spider](https://github.com/fish2018/py_spider)项目的结构如下：

```
py_spider/
├── PyramidStore/         # PyramidStore核心库文件
│   ├── base/             # 基础工具
│   │   ├── spider.py     # 爬虫基类
│   │   ├── local.py      # 本地调试工具基类
│   │   └── localproxy.py # 本地代理工具
│   ├── plugin/           # 爬虫插件目录
│   │   ├── custom/       # 自定义爬虫目录
│   │   │   └── py_*.py   # 自定义爬虫插件
│   │   └── ...
│   └── example.json      # 影视json配置
├── local_spider_debug.py # 本地爬虫调试工具，用于快速测试爬虫各个功能
└── README.md             # 项目说明文档
```

#### 2.3.1 local_spider_debug.py 说明

`local_spider_debug.py` 是一个非常重要的调试工具，它可以帮助开发者在本地测试爬虫各个功能，而无需部署到完整环境中。该工具支持测试爬虫的主页、分类、搜索、详情和播放链接等功能，使用方法会在后面的章节中详细说明。

#### 2.3.2 PyramidStore 核心目录

PyramidStore 目录包含框架的核心代码，所有爬虫类都需要继承自 `spider.py` 中定义的基类。自定义爬虫应该存放在 `plugin/custom` 目录下，并且文件名必须以 `py_` 开头。

## 3. PyramidStore爬虫基本结构

在PyramidStore框架中，所有爬虫都继承自基础的`spider.py`类，并且遵循特定的命名规范和实现约定。

### 3.1 文件命名规范

- 爬虫文件必须以`py_`开头
- 文件名应具有描述性，通常基于目标网站名称

### 3.2 Spider类继承与初始化

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from bs4 import BeautifulSoup
import urllib.parse
import requests
import json
import time
import re
import sys


sys.path.append('../../')
try:
    from base.spider import Spider
except ImportError:
    # 定义一个基础接口类，用于本地测试
    class Spider:
        def init(self, extend=""):
            pass

class Spider(Spider):
    def __init__(self):
        # 设置爬虫基本属性
        self.siteUrl = 'https://example.com'  # 目标网站地址
        # 其他初始化配置
```

### 3.3 必须实现的核心方法

根据PyramidStore爬虫框架规范，每个爬虫插件必须实现以下核心方法：

#### 3.3.1 获取爬虫名称

```python
def getName(self):
    """返回爬虫名称"""
    return "我的影视站"
```

#### 3.3.2 获取主页内容

```python
def homeContent(self, filter):
    """获取主页分类及筛选"""
    result = {}
    # 手动设置分类
    cateManual = {
        "电影": "1",
        "电视剧": "2",
        "动漫": "3",
        "综艺": "4",
        "纪录片": "5"
    }
    classes = []
    for k in cateManual:
        classes.append({
            'type_id': cateManual[k],
            'type_name': k
        })
    
    result['class'] = classes
    # 如果需要返回筛选配置
    if filter:
        result['filters'] = self.config['filter']
    return result
```

#### 3.3.3 获取首页推荐视频

```python
def homeVideoContent(self):
    """获取首页推荐视频"""
    result = {}
    videos = []
    
    # 请求首页
    url = self.siteUrl
    response = self.fetch(url)
    
    # 解析HTML提取推荐视频
    # ...提取视频信息代码...
    
    for item in items:
        videos.append({
            "vod_id": item_id,
            "vod_name": title,
            "vod_pic": img_url,
            "vod_remarks": remarks  # 视频状态说明，如"更新至x集"
        })
    
    result['list'] = videos
    return result
```

#### 3.3.4 获取分类内容

```python
def categoryContent(self, tid, pg, filter, extend):
    """获取分类内容"""
    result = {}
    # 构建分类页URL
    url = f'{self.siteUrl}/category/{tid}/page/{pg}'
    
    # 如果有筛选参数
    if extend:
        # 处理筛选参数
        if 'year' in extend and extend['year'] != '0':
            url += f'?year={extend["year"]}'
        # 更多筛选参数处理...
    
    # 请求并解析页面
    response = self.fetch(url)
    
    # 提取视频列表
    videos = []
    # ...解析代码...
    
    result['list'] = videos
    result['page'] = pg
    result['pagecount'] = total_pages  # 总页数
    result['limit'] = 20  # 每页数量
    result['total'] = total_count  # 总条数
    
    return result
```

#### 3.3.5 获取详情页内容

```python
def detailContent(self, ids):
    """获取详情页内容"""
    # 获取视频ID
    video_id = ids[0]
    
    # 构建详情页URL
    url = f'{self.siteUrl}/detail/{video_id}'
    
    # 请求详情页
    response = self.fetch(url)
    
    # 解析详情页
    # ...解析代码...
    
    # 提取视频基本信息
    title = ...  # 标题
    img = ...    # 封面图
    desc = ...   # 描述
    
    # 提取播放源和剧集
    play_from = []  # 播放源列表
    play_url = []   # 播放地址列表
    
    # ...提取播放信息代码...
    
    # 构建标准化返回结果
    vod = {
        "vod_id": video_id,
        "vod_name": title,
        "vod_pic": img,
        "vod_year": year,
        "vod_area": area,
        "vod_remarks": remarks,
        "vod_actor": actor,
        "vod_director": director,
        "vod_content": desc,
        "vod_play_from": "$$$".join(play_from),
        "vod_play_url": "$$$".join(play_url)
    }
    
    result = {
        'list': [vod]
    }
    return result
```

#### 3.3.6 获取搜索内容

```python
def searchContent(self, key, quick, pg=1):
    """搜索功能"""
    # 构建搜索URL
    search_url = f'{self.siteUrl}/search?keyword={quote_plus(key)}'
    
    # 请求搜索页面
    response = self.fetch(search_url)
    
    # 解析搜索结果
    # ...解析代码...
    
    videos = []
    for item in items:
        videos.append({
            "vod_id": item_id,
            "vod_name": title,
            "vod_pic": img,
            "vod_remarks": remarks
        })
    
    return videos

def searchContentPage(self, key, quick, pg=1):
        return self.searchContent(key, quick, pg)    
```

#### 3.3.7 获取播放内容

```python
def playerContent(self, flag, id, vipFlags):
    """获取播放内容"""
    result = {}
    
    try:
        # 处理播放链接
        if self.isVideoFormat(id):
            # 直接使用链接
            result["parse"] = 0
            result["url"] = id
        else:
            # 需要进一步解析
            play_page_url = f"{self.siteUrl}/play/{id}"
            response = self.fetch(play_page_url)
            
            # 从播放页提取视频链接
            html_content = response.text
            video_url = self.extractVideoUrl(html_content)
            
            if video_url:
                result["parse"] = 0
                result["url"] = video_url
            else:
                # 无法提取直链，返回播放页
                result["parse"] = 1
                result["url"] = play_page_url
        
        # 添加请求头
        result["header"] = {
            "User-Agent": self.userAgent,
            "Referer": self.siteUrl
        }
        
        return result
    except Exception as e:
        print(f"解析播放内容失败: {e}")
        return {}
```

#### 3.3.8 检查URL是否为视频格式

```python
def isVideoFormat(self, url):
    """判断是否为视频格式"""
    video_formats = ['.mp4', '.m3u8', '.ts', '.mkv', '.avi', '.webm']
    if url.startswith('http'):
        for format in video_formats:
            if url.lower().find(format) > -1:
                return True
    return False
```

#### 3.3.9 手动检查视频

```python
def manualVideoCheck(self):
    """是否需要手动检查视频"""
    return False  # 默认不需要
```

### 3.4 辅助方法

#### 3.4.1 页面请求方法

```python
def fetch(self, url, headers=None):
    """统一的请求方法"""
    if headers is None:
        headers = {
            'User-Agent': self.userAgent,
            'Referer': self.siteUrl
        }
    try:
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()  # 检查请求是否成功
        return response
    except Exception as e:
        print(f"请求失败: {url}, 错误: {e}")
        return None
```

#### 3.4.2 视频链接提取方法

```python
def extractVideoUrl(self, html_content):
    """从HTML中提取视频链接"""
    # 方法1：正则表达式匹配
    pattern = r'player.src\s*=\s*[\'"]([^\'"]+\.mp4)[\'"]'
    match = re.search(pattern, html_content)
    if match:
        return match.group(1)
    
    # 方法2：从JSON数据中提取
    json_pattern = r'var\s+player_data\s*=\s*({[^}]+})'
    json_match = re.search(json_pattern, html_content)
    if json_match:
        try:
            data = json.loads(json_match.group(1))
            return data.get('url', '')
        except:
            pass
    
    # 方法3：从iframe中提取
    soup = BeautifulSoup(html_content, 'html.parser')
    iframe = soup.select_one('iframe')
    if iframe and 'src' in iframe.attrs:
        return iframe['src']
    
    return ''
```

### 3.5 本地代理功能

某些网站的视频内容可能需要代理才能正确播放，PyramidStore框架提供了本地代理支持：

```python
def localProxy(self, param):
    """本地代理"""
    action = param.get('action')
    
    if action == 'proxy':
        url = param.get('url')
        headers = {
            'User-Agent': self.userAgent,
            'Referer': self.siteUrl
        }
        
        # 处理不同类型的内容
        if param.get('type') == 'mpd':
            # 处理DASH流
            content = requests.get(url, headers=headers).text
            return [200, "application/dash+xml", content]
        elif param.get('type') == 'm3u8':
            # 处理HLS流
            content = requests.get(url, headers=headers).text
            return [200, "application/vnd.apple.mpegurl", content]
        elif param.get('type') == 'media':
            # 处理媒体流
            r = requests.get(url, headers=headers, stream=True)
            return [206, "application/octet-stream", r.content]
    
    return None
```

### 3.6 从零开始的爬虫开发流程

以下是一个完整的爬虫开发流程示例，以开发一个名为"DemoSite"的爬虫插件为例，展示从分析到实现的全过程。

#### 3.6.1 网站分析

首先，我们需要分析目标网站的结构，以确定各个页面和数据的获取方式：

1. **首页结构分析**：
   - 网站首页地址：`https://example.com`
   - 分类菜单位置：顶部导航栏
   - 分类项有：电影、电视剧、动漫、综艺

2. **分类页面分析**：
   - 分类页面URL格式：`https://example.com/list/{分类ID}_{页码}.html`
   - 视频列表项选择器：`.video-list .video-item`
   - 视频标题选择器：`.video-item .title`
   - 视频封面选择器：`.video-item .pic img[src]`
   - 视频ID提取：从链接中提取，格式为`/detail/{视频ID}.html`

3. **详情页面分析**：
   - 详情页URL格式：`https://example.com/detail/{视频ID}.html`
   - 标题选择器：`.video-info .title`
   - 封面图选择器：`.video-cover img[src]`
   - 年份选择器：`.video-info .year`
   - 地区选择器：`.video-info .area`
   - 演员选择器：`.video-info .actor`
   - 导演选择器：`.video-info .director`
   - 简介选择器：`.video-info .desc`
   - 播放列表选择器：`.play-list`
   - 播放源选择器：`.source-list .source-item`

4. **播放页面分析**：
   - 播放页URL格式：`https://example.com/play/{视频ID}/{集数ID}.html`
   - 视频播放器选择器：`#player`
   - 视频链接提取方式：从JavaScript变量中提取或网络请求分析

#### 3.6.2 基本结构实现

基于上述分析，我们可以实现爬虫的基本结构：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re
import time
import requests
from urllib.parse import quote_plus, urljoin
from bs4 import BeautifulSoup
import sys

sys.path.append('../../')
try:
    from base.spider import Spider
except ImportError:
    # 定义一个基础接口类，用于本地测试
    class Spider:
        def init(self, extend=""):
            pass

class Spider(Spider):
    def __init__(self):
        self.siteUrl = 'https://example.com'
        self.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

    def getName(self):
        return "示例影视站"
```

#### 3.6.3 网页请求与解析函数

实现基础的网页请求与解析函数，用于后续功能开发：

```python
def fetch(self, url, headers=None):
    """统一的网页请求函数"""
    if headers is None:
        headers = {
            'User-Agent': self.userAgent,
            'Referer': self.siteUrl
        }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        response.encoding = 'utf-8'  # 确保编码正确
        return response
    except Exception as e:
        print(f"请求{url}失败: {e}")
        return None

def parseHtml(self, html):
    """解析HTML为BeautifulSoup对象"""
    return BeautifulSoup(html, 'html.parser')

def extractVideoItem(self, item_element):
    """从列表项元素中提取视频信息"""
    video = {}
    try:
        # 提取标题
        title_element = item_element.select_one('.title')
        if title_element:
            video['vod_name'] = title_element.text.strip()
        
        # 提取封面图
        img_element = item_element.select_one('.pic img')
        if img_element and 'src' in img_element.attrs:
            video['vod_pic'] = urljoin(self.siteUrl, img_element['src'])
        
        # 提取备注信息
        remarks_element = item_element.select_one('.remarks')
        if remarks_element:
            video['vod_remarks'] = remarks_element.text.strip()
        
        # 提取视频ID
        link_element = item_element.select_one('a[href]')
        if link_element and 'href' in link_element.attrs:
            href = link_element['href']
            id_match = re.search(r'/detail/([^.]+)', href)
            if id_match:
                video['vod_id'] = id_match.group(1)
    except Exception as e:
        print(f"提取视频项信息失败: {e}")
    
    return video
```

#### 3.6.4 实现首页功能

实现`homeContent`方法，返回网站的分类信息：

```python
def homeContent(self, filter):
    """获取首页分类及筛选"""
    result = {}
    
    # 手动设置分类信息
    cateManual = {
        "电影": "1",
        "电视剧": "2",
        "动漫": "3",
        "综艺": "4"
    }
    
    # 构建分类列表
    classes = []
    for k in cateManual:
        classes.append({
            'type_id': cateManual[k],
            'type_name': k
        })
    
    result['class'] = classes
    
    # 如果需要，返回筛选配置
    if filter:
        result['filters'] = {
            "1": [  # 电影分类的筛选
                {"key": "year", "name": "年份", "value": [{"n": "全部", "v": "0"}, {"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}]},
                {"key": "area", "name": "地区", "value": [{"n": "全部", "v": "0"}, {"n": "中国大陆", "v": "中国大陆"}, {"n": "美国", "v": "美国"}]}
            ],
            "2": [  # 电视剧分类的筛选
                {"key": "year", "name": "年份", "value": [{"n": "全部", "v": "0"}, {"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}]},
                {"key": "area", "name": "地区", "value": [{"n": "全部", "v": "0"}, {"n": "中国大陆", "v": "中国大陆"}, {"n": "韩国", "v": "韩国"}]}
            ]
        }
    
    return result
```

#### 3.6.5 实现分类内容功能

实现`categoryContent`方法，爬取分类页面的视频列表：

```python
def categoryContent(self, tid, pg, filter, extend):
    """获取分类内容"""
    result = {}
    
    # 构建分类页URL
    url = f'{self.siteUrl}/list/{tid}_{pg}.html'
    
    # 处理筛选参数
    if extend:
        params = []
        if 'year' in extend and extend['year'] != '0':
            params.append(f'year={extend["year"]}')
        if 'area' in extend and extend['area'] != '0':
            params.append(f'area={extend["area"]}')
        
        if params:
            url += '?' + '&'.join(params)
    
    # 请求分类页
    response = self.fetch(url)
    if not response:
        return result
    
    # 解析HTML
    soup = self.parseHtml(response.text)
    
    # 提取视频列表
    videos = []
    items = soup.select('.video-list .video-item')
    for item in items:
        video = self.extractVideoItem(item)
        if 'vod_id' in video:  # 确保提取到了视频ID
            videos.append(video)
    
    # 提取分页信息
    page_info = soup.select_one('.pagination')
    total_pages = 1
    if page_info:
        # 尝试从分页器提取总页数
        page_text = page_info.text
        total_match = re.search(r'共(\d+)页', page_text)
        if total_match:
            total_pages = int(total_match.group(1))
    
    # 构建返回结果
    result['list'] = videos
    result['page'] = pg
    result['pagecount'] = total_pages
    result['limit'] = len(videos)
    result['total'] = total_pages * len(videos)  # 估计总条数
    
    return result
```

#### 3.6.6 实现详情页功能

实现`detailContent`方法，解析视频详情页并提取剧集信息：

```python
def detailContent(self, ids):
    """获取详情页内容"""
    video_id = ids[0]
    
    # 构建详情页URL
    url = f'{self.siteUrl}/detail/{video_id}.html'
    
    # 请求详情页
    response = self.fetch(url)
    if not response:
        return {}
    
    # 解析HTML
    soup = self.parseHtml(response.text)
    
    # 提取基本信息
    title = ''
    title_element = soup.select_one('.video-info .title')
    if title_element:
        title = title_element.text.strip()
    
    img = ''
    img_element = soup.select_one('.video-cover img')
    if img_element and 'src' in img_element.attrs:
        img = urljoin(self.siteUrl, img_element['src'])
    
    # 提取其他信息
    infos = {}
    info_items = soup.select('.video-info .info-item')
    for item in info_items:
        item_text = item.text.strip()
        if ':' in item_text:
            key, value = item_text.split(':', 1)
            infos[key.strip()] = value.strip()
    
    # 提取简介
    desc = ''
    desc_element = soup.select_one('.video-info .desc')
    if desc_element:
        desc = desc_element.text.strip()
    
    # 提取播放源和剧集
    play_from = []
    play_url = []
    
    source_items = soup.select('.source-list .source-item')
    for source in source_items:
        source_name = source.text.strip()
        play_from.append(source_name)
        
        # 获取对应播放列表
        source_id = source.get('data-id', '')
        episode_list = soup.select(f'.play-list[data-source="{source_id}"] a')
        
        episodes = []
        for ep in episode_list:
            ep_name = ep.text.strip()
            ep_url = ep.get('href', '')
            if ep_url:
                ep_id = re.search(r'/play/[^/]+/([^.]+)', ep_url)
                if ep_id:
                    episodes.append(f"{ep_name}${video_id}_{ep_id.group(1)}")
        
        play_url.append('#'.join(episodes))
    
    # 构建返回数据
    vod = {
        "vod_id": video_id,
        "vod_name": title,
        "vod_pic": img,
        "type_name": infos.get('类型', ''),
        "vod_year": infos.get('年份', ''),
        "vod_area": infos.get('地区', ''),
        "vod_remarks": infos.get('状态', ''),
        "vod_actor": infos.get('演员', ''),
        "vod_director": infos.get('导演', ''),
        "vod_content": desc,
        "vod_play_from": "$$$".join(play_from),
        "vod_play_url": "$$$".join(play_url)
    }
    
    result = {
        'list': [vod]
    }
    return result
```

#### 3.6.7 实现播放功能

实现`playerContent`方法，提取视频播放链接：

```python
def playerContent(self, flag, id, vipFlags):
    """获取播放内容"""
    result = {}
    
    # 分解视频ID和剧集ID
    parts = id.split('_')
    if len(parts) != 2:
        return result
    
    video_id, episode_id = parts
    
    # 构建播放页URL
    url = f'{self.siteUrl}/play/{video_id}/{episode_id}.html'
    
    # 请求播放页
    response = self.fetch(url)
    if not response:
        return result
    
    # 解析HTML
    html_content = response.text
    
    # 尝试提取播放链接
    # 方法1: 从JavaScript变量中提取
    player_data_pattern = r'var\s+player_data\s*=\s*({[^}]+})'
    player_match = re.search(player_data_pattern, html_content)
    
    if player_match:
        try:
            player_data = json.loads(player_match.group(1))
            if 'url' in player_data:
                play_url = player_data['url']
                
                # 设置结果
                result["parse"] = 0  # 直链
                result["playUrl"] = ""
                result["url"] = play_url
                result["header"] = {
                    "User-Agent": self.userAgent,
                    "Referer": url
                }
                return result
        except Exception as e:
            print(f"解析播放数据失败: {e}")
    
    # 方法2: 直接匹配视频URL
    video_url_pattern = r'(https?://[^"\']+\.(mp4|m3u8))'
    video_match = re.search(video_url_pattern, html_content)
    
    if video_match:
        play_url = video_match.group(0)
        
        # 设置结果
        result["parse"] = 0  # 直链
        result["playUrl"] = ""
        result["url"] = play_url
        result["header"] = {
            "User-Agent": self.userAgent,
            "Referer": url
        }
        return result
    
    # 方法3: 如果以上方法都失败，返回播放页面地址
    result["parse"] = 1  # 需要嗅探
    result["playUrl"] = ""
    result["url"] = url
    result["header"] = {
        "User-Agent": self.userAgent,
        "Referer": self.siteUrl
    }
    
    return result
```

#### 3.6.8 实现搜索功能

实现`searchContent`方法，爬取搜索页面的结果：

```python
def searchContent(self, key, quick):
    """搜索功能"""
    # 构建搜索URL
    search_url = f'{self.siteUrl}/search.html?keyword={quote_plus(key)}'
    
    # 请求搜索页
    response = self.fetch(search_url)
    if not response:
        return []
    
    # 解析HTML
    soup = self.parseHtml(response.text)
    
    # 提取视频列表
    videos = []
    items = soup.select('.search-list .video-item')
    for item in items:
        video = self.extractVideoItem(item)
        if 'vod_id' in video:  # 确保提取到了视频ID
            videos.append(video)
    
    return videos
```

#### 3.6.9 实现其他必要方法

最后，实现`isVideoFormat`和`manualVideoCheck`方法：

```python
def isVideoFormat(self, url):
    """判断是否为视频格式"""
    video_formats = ['.mp4', '.m3u8', '.ts', '.mkv', '.avi', '.webm']
    if url.startswith('http'):
        for fmt in video_formats:
            if url.lower().find(fmt) > -1:
                return True
    return False

def manualVideoCheck(self):
    """是否需要手动检查视频"""
    return False  # 默认不需要
```

## 4. 爬虫调试与测试

### 4.1 调试工具使用

PyramidStore提供了本地调试工具`local_spider_debug.py`，该工具是开发过程中不可或缺的辅助工具，可以快速测试爬虫的各项功能，而无需将爬虫部署到完整环境中。

#### 4.1.1 基本命令格式

```bash
python local_spider_debug.py [功能] [参数1] [参数2] ...
```

#### 4.1.2 支持的功能命令

```bash
# 测试首页数据获取
python local_spider_debug.py home

# 测试分类数据获取 
python local_spider_debug.py category 分类ID [页码] [是否启用筛选]
# 例如: python local_spider_debug.py category 1 1 1

# 测试搜索功能
python local_spider_debug.py search 关键词 [页码] [快速搜索]
# 例如: python local_spider_debug.py search 战狼 1 1

# 测试详情页面解析
python local_spider_debug.py detail 视频ID
# 例如: python local_spider_debug.py detail movie/12345

# 测试播放链接获取
python local_spider_debug.py player 视频ID [播放源索引] [剧集索引]
# 例如: python local_spider_debug.py player movie/12345 0 0
# 参数说明：播放源索引和剧集索引都是从0开始的整数
```

#### 4.1.3 实际调试案例

以下是一个完整的调试流程案例：

```bash
# 1. 首先测试爬虫的首页功能
python local_spider_debug.py home

# 2. 测试电影分类的内容获取
python local_spider_debug.py category 1 1 1

# 3. 从返回的分类内容中找到一个电影ID，测试详情页
python local_spider_debug.py detail movie/12345

# 4. 测试该电影的播放链接
python local_spider_debug.py player movie/12345 0 0

# 5. 测试搜索功能
python local_spider_debug.py search 流浪地球
```

### 4.2 调试输出分析

调试工具会输出详细的执行过程和结果，包括：

1. **请求信息**：显示请求的URL、请求头和响应状态
2. **解析过程**：显示数据解析的关键步骤
3. **结果数据**：格式化输出爬虫方法返回的数据结构
4. **错误信息**：如果出现错误，会显示详细的错误信息和堆栈跟踪

同时，调试工具会将结果保存为JSON文件，便于后续分析和调试：

```
数据已保存到 debug_results/home_content_20250328_113845.json
数据已保存到 debug_results/detail_12345_20250328_113850.json
数据已保存到 debug_results/player_12345_第一集_20250328_113855.json
```

#### 4.2.1 JSON结果文件结构

以详情页结果文件为例，其JSON结构通常包含以下内容：

```json
{
  "list": [{
    "vod_id": "movie/12345",
    "vod_name": "示例电影",
    "vod_pic": "https://example.com/images/12345.jpg",
    "vod_year": "2023",
    "vod_area": "中国大陆",
    "vod_remarks": "HD高清",
    "vod_actor": "演员A,演员B,演员C",
    "vod_director": "导演A",
    "vod_content": "电影简介内容...",
    "vod_play_from": "线路1$$$线路2",
    "vod_play_url": "HD$movie/12345/1#TC$movie/12345/2$$$HD$movie/12345/3#TC$movie/12345/4"
  }]
}
```

#### 4.2.2 播放链接调试分析

播放链接调试是爬虫开发中最关键的环节，调试工具会显示以下信息：

```
[播放源] 线路1
[播放集数] 第1集
[解析方式] parse=0 (直链模式)
[播放地址] https://example.com/videos/12345.mp4
[请求头信息]
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
  Referer: https://example.com
播放链接提取耗时: 0.328秒
```

### 4.3 常见问题诊断与解决

#### 4.3.1 数据格式错误

**症状**：调试输出显示数据结构不符合规范，或者缺少必要字段

**解决方案**：
1. 检查方法返回的数据结构是否符合PyramidStore的规范
2. 确保所有必需字段都已包含，并且类型正确
3. 使用IDE的调试功能或添加打印语句检查中间数据

```python
# 在关键处添加调试输出
print(f"解析到的标题: {title}")
print(f"解析到的播放列表: {play_list}")
```

#### 4.3.2 解析失败

**症状**：无法从页面提取所需信息，返回空数据

**解决方案**：
1. 使用`local_spider_debug.py`的输出查看HTML内容
2. 使用浏览器开发者工具重新分析页面结构
3. 检查是否需要处理JavaScript动态加载的内容
4. 调整选择器或正则表达式，适应网站结构

```python
# 添加更健壮的解析逻辑
def get_safe_text(soup_element, selector, default=""):
    element = soup_element.select_one(selector)
    return element.text.strip() if element else default
```

#### 4.3.3 请求超时或失败

**症状**：请求目标网站超时或返回错误状态码

**解决方案**：
1. 检查网络连接和目标站点状态
2. 增加请求超时时间
3. 添加重试逻辑
4. 检查是否被网站的反爬机制拦截

```python
# 添加重试逻辑的请求函数
def fetch_with_retry(self, url, max_retries=3, timeout=10):
    for i in range(max_retries):
        try:
            headers = {
                "User-Agent": self.userAgent,
                "Referer": self.siteUrl
            }
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()
            return response
        except Exception as e:
            print(f"第{i+1}次请求失败: {e}")
            if i < max_retries - 1:
                time.sleep(2)  # 等待2秒后重试
    return None
```

#### 4.3.4 播放链接无效

**症状**：成功获取播放链接，但无法播放视频

**解决方案**：
1. 在浏览器中直接访问提取的链接，验证是否可以播放
2. 检查链接是否需要特定的请求头（如Referer）
3. 分析是否需要处理防盗链或地区限制
4. 检查链接是否为临时链接，需要定期刷新

```python
# 验证播放链接
def verify_play_url(self, url, headers=None):
    try:
        if headers is None:
            headers = {
                "User-Agent": self.userAgent,
                "Referer": self.siteUrl
            }
        # 只请求头部信息，不下载整个视频
        response = requests.head(url, headers=headers, timeout=5)
        return response.status_code == 200
    except Exception as e:
        print(f"链接验证失败: {e}")
        return False
```

### 4.4 高级调试技巧

#### 4.4.1 本地存储HTML内容

为了更方便地分析网页结构，可以添加代码将HTML内容保存到本地文件：

```python
def save_html_for_debug(self, html_content, filename="debug_page.html"):
    """保存HTML内容到本地文件，方便分析"""
    try:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"HTML内容已保存到 {filename}")
    except Exception as e:
        print(f"保存HTML内容失败: {e}")
```

#### 4.4.2 使用专用分析脚本

对于复杂的数据提取问题，可以创建专用的分析脚本：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import requests
import re
import json
from bs4 import BeautifulSoup

def analyze_player_page(url):
    """分析播放页面，提取可能的视频链接"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": url
    }
    
    try:
        response = requests.get(url, headers=headers)
        html_content = response.text
        
        # 查找所有可能的MP4链接
        mp4_pattern = r'(https?://[^"\']+\.mp4)'
        mp4_links = re.findall(mp4_pattern, html_content)
        
        # 查找所有可能的M3U8链接
        m3u8_pattern = r'(https?://[^"\']+\.m3u8)'
        m3u8_links = re.findall(m3u8_pattern, html_content)
        
        # 分析JavaScript变量
        js_vars = {}
        js_var_pattern = r'var\s+(\w+)\s*=\s*[\'"]([^\'"]+)[\'"]'
        js_var_matches = re.findall(js_var_pattern, html_content)
        for var_name, var_value in js_var_matches:
            js_vars[var_name] = var_value
        
        # 提取潜在的JSON数据
        json_pattern = r'var\s+\w+\s*=\s*({[^;]+});'
        json_matches = re.findall(json_pattern, html_content)
        json_data = []
        for json_str in json_matches:
            try:
                data = json.loads(json_str)
                json_data.append(data)
            except:
                pass
        
        # 汇总结果
        results = {
            "url": url,
            "mp4_links": mp4_links,
            "m3u8_links": m3u8_links,
            "js_vars": js_vars,
            "json_data": json_data
        }
        
        # 打印分析结果
        print(f"分析URL: {url}")
        print(f"找到 {len(mp4_links)} 个MP4链接:")
        for i, url in enumerate(results["mp4_links"], 1):
            print(f"  {i}. {url}")
        
        print(f"找到 {len(m3u8_links)} 个M3U8链接:")
        for i, url in enumerate(results["m3u8_links"], 1):
            print(f"  {i}. {url}")
        
        print(f"找到 {len(js_vars)} 个JavaScript变量")
        print(f"找到 {len(json_data)} 个JSON数据块")
        
        # 保存分析结果
        with open("player_analysis.json", "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        print("\n分析结果已保存到 player_analysis.json")
        
        # 保存HTML内容
        with open("player_page.html", "w", encoding="utf-8") as f:
            f.write(html_content)
        print("HTML内容已保存到 player_page.html")
        
        return results
    except Exception as e:
        print(f"分析失败: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python analyze_player.py <播放页URL>")
        sys.exit(1)
    
    url = sys.argv[1]
    analyze_player_page(url)
```

#### 4.4.3 使用代理调试

对于有地区限制或需要特定IP访问的网站，可以使用代理进行调试：

```python
def fetch_with_proxy(self, url, proxy=None):
    """使用代理的请求函数"""
    if proxy is None:
        # 可以设置默认代理
        proxy = "http://127.0.0.1:7890"  # 例如本地的Clash代理
    
    proxies = {
        "http": proxy,
        "https": proxy
    }
    
    headers = {
        "User-Agent": self.userAgent,
        "Referer": self.siteUrl
    }
    
    try:
        response = requests.get(url, headers=headers, proxies=proxies, timeout=10)
        response.raise_for_status()
        return response
    except Exception as e:
        print(f"代理请求失败: {e}")
        return None
```

## 5. 实战技巧与最佳实践

### 5.1 网站分析方法

1. **分析网页结构**：使用浏览器开发者工具检查页面元素
2. **追踪网络请求**：通过Network面板分析API请求
3. **解析JavaScript**：查找关键变量和数据加载逻辑
4. **理解数据流向**：从首页到播放页面的完整流程

### 5.2 提取视频链接技巧

#### 5.2.1 隐藏在JavaScript变量中的链接

```python
# 提取JS变量中的链接
js_var_pattern = r'var\s+(\w+)\s*=\s*[\'"]([^\'"]+\.mp4)[\'"]'
js_var_matches = re.findall(js_var_pattern, html_content)
```

#### 5.2.2 处理加密或混淆的视频链接

```python
# 对特定格式的加密链接进行解密
def decrypt_video_url(self, encrypted_url, key):
    # 实现特定的解密算法
    # ...
    return decrypted_url
```

#### 5.2.3 链接模板与替换

```python
# 通过模板构建链接
def build_video_url(self, template_url, chapter_id):
    # 替换模板中的占位符
    return template_url.replace("{chapter_id}", chapter_id)
```

### 5.3 反爬虫应对策略

#### 5.3.1 合理的请求头

```python
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": self.siteUrl,
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Cookie": "必要的Cookie信息"
}
```

#### 5.3.2 请求频率控制

```python
def fetch_with_retry(self, url, max_retries=3, delay=1):
    """带重试和延迟的请求"""
    for i in range(max_retries):
        try:
            if i > 0:
                time.sleep(delay)
            response = self.fetch(url)
            if response:
                return response
        except Exception as e:
            print(f"第{i+1}次请求失败: {e}")
    return None
```

#### 5.3.3 代理IP轮换

```python
def get_proxy(self):
    """获取代理IP"""
    # 实现代理IP获取逻辑
    # ...
    return proxy

def fetch_with_proxy(self, url):
    """使用代理的请求"""
    proxy = self.get_proxy()
    return self.fetch(url, proxies={"http": proxy, "https": proxy})
```

### 5.4 性能优化策略

#### 5.4.1 减少网络请求

```python
# 使用缓存减少重复请求
def fetch_with_cache(self, url, cache_time=3600):
    cache_key = hashlib.md5(url.encode()).hexdigest()
    cache_file = f'cache/{cache_key}.json'
    
    # 检查缓存是否存在且未过期
    if os.path.exists(cache_file):
        file_time = os.path.getmtime(cache_file)
        if time.time() - file_time < cache_time:
            with open(cache_file, 'r', encoding='utf-8') as f:
                return json.load(f)
    
    # 缓存不存在或已过期，重新请求
    response = self.fetch(url)
    if response:
        os.makedirs('cache', exist_ok=True)
        with open(cache_file, 'w', encoding='utf-8') as f:
            json.dump(response.json(), f, ensure_ascii=False)
        return response.json()
    
    return None
```

#### 5.4.2 并发请求

```python
import concurrent.futures

def fetch_multiple(self, urls, max_workers=5):
    """并发获取多个URL的内容"""
    results = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_url = {executor.submit(self.fetch, url): url for url in urls}
        for future in concurrent.futures.as_completed(future_to_url):
            url = future_to_url[future]
            try:
                results[url] = future.result()
            except Exception as e:
                print(f"获取 {url} 时出错: {e}")
    return results
```

## 6. 配置文件规范

PyramidStore爬虫插件需要在配置文件中正确设置：

```json
{
    "key": "py_mytvsite",
    "name": "我的影视站",
    "type": 3,
    "api": "http://127.0.0.1:9978/proxy?do=py&type=py_mytvsite",
    "searchable": 1,
    "quickSearch": 1,
    "filterable": 1,
    "ext": {
        "cookie": "如果需要，填写cookies信息",
        "filter": {
            "1": [
                {"key": "year", "name": "年份", "value": [{"n": "全部", "v": "0"}, {"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}]},
                {"key": "genre", "name": "类型", "value": [{"n": "全部", "v": "0"}, {"n": "动作", "v": "action"}, {"n": "喜剧", "v": "comedy"}]}
            ],
            "2": [
                // 电视剧分类的筛选配置
            ]
        }
    }
}
```

## 7. 完整爬虫示例

以下是一个简化但完整的爬虫实现示例：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import requests
from urllib.parse import quote_plus
import re
from bs4 import BeautifulSoup
import sys

sys.path.append('../../')
try:
    from base.spider import Spider
except ImportError:
    # 定义一个基础接口类，用于本地测试
    class Spider:
        def init(self, extend=""):
            pass

class Spider(Spider):
    def __init__(self):
        self.siteUrl = 'https://example.com'
        self.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    
    def getName(self):
        return "示例影视"
    
    def homeContent(self, filter):
        result = {}
        cateManual = {
            "电影": "1",
            "电视剧": "2",
            "动漫": "3"
        }
        classes = []
        for k in cateManual:
            classes.append({
                'type_id': cateManual[k],
                'type_name': k
            })
        
        result['class'] = classes
        if filter:
            result['filters'] = self.config['filter']
        return result
    
    def homeVideoContent(self):
        result = {}
        videos = []
        # 实现逻辑...
        result['list'] = videos
        return result
    
    def categoryContent(self, tid, pg, filter, extend):
        result = {}
        videos = []
        # 实现逻辑...
        result['list'] = videos
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result
    
    def detailContent(self, ids):
        video_id = ids[0]
        # 实现逻辑...
        vod = {
            "vod_id": video_id,
            "vod_name": "示例视频",
            "vod_pic": "https://example.com/image.jpg",
            "vod_content": "视频简介",
            "vod_play_from": "默认线路",
            "vod_play_url": "第1集$123#第2集$456"
        }
        result = {'list': [vod]}
        return result
    
    def searchContent(self, key, quick):
        videos = []
        # 实现逻辑...
        return videos
    
    def playerContent(self, flag, id, vipFlags):
        result = {}
        result["parse"] = 0
        result["url"] = f"https://example.com/play/{id}.mp4"
        result["header"] = {
            "User-Agent": self.userAgent,
            "Referer": self.siteUrl
        }
        return result
    
    def isVideoFormat(self, url):
        video_formats = ['.mp4', '.m3u8', '.ts']
        return any(url.lower().find(fmt) > -1 for fmt in video_formats)
    
    def manualVideoCheck(self):
        return False
```

## 8. 常见问题与解决方案

### 8.1 无法获取分类列表

- **问题**：`homeContent`方法返回空列表
- **解决方案**：
  1. 检查网站结构是否变化
  2. 尝试手动设置分类

### 8.2 无法解析视频详情

- **问题**：`detailContent`方法无法提取视频信息
- **解决方案**：
  1. 使用浏览器开发者工具分析页面结构
  2. 更新选择器或正则表达式
  3. 考虑数据是否通过API加载

### 8.3 无法获取播放链接

- **问题**：`playerContent`方法无法获取可播放的视频URL
- **解决方案**：
  1. 检查视频是否通过加密方式加载
  2. 分析网络请求找出真实播放地址
  3. 实现解密算法（如需要）

## 9. 参考资源
- [PyramidStore示例爬虫](https://github.com/JJBJJ/PyramidStore/tree/main/plugin)
- [BeautifulSoup文档](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [Requests文档](https://requests.readthedocs.io/en/latest/)

## 10. 总结

PyramidStore爬虫开发是一个结合网络分析、数据处理和优化技巧的过程。通过本指南，您应该能够掌握如何创建一个功能完整的视频网站爬虫插件，从首页数据获取到视频播放链接提取的全流程。

记住，一个好的爬虫不仅仅是能够获取数据，还应该具备良好的容错性、高效的性能以及适应网站变化的能力。在实际开发中，持续测试和优化是保持爬虫稳定运行的关键。

祝您爬虫开发顺利！ 
