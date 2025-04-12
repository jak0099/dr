#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PyramidStore本地爬虫调试脚本
参考文档: https://github.com/lm317379829/PyramidStore/blob/main/spider.md
"""

import os
import sys
import json
import time
from datetime import datetime

# 确保插件目录在Python的搜索路径中
PLUGIN_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'PyramidStore/plugin')
if PLUGIN_DIR not in sys.path:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# 导入爬虫
# from PyramidStore.plugin.custom.py_河马短剧 import Spider
# from PyramidStore.plugin.custom.py_短剧狗 import Spider
from PyramidStore.plugin.custom.py_蓝莓短剧 import Spider

# 格式化输出
def pretty_print(obj):
    """优雅地打印对象"""
    if isinstance(obj, dict) or isinstance(obj, list):
        print(json.dumps(obj, ensure_ascii=False, indent=2))
    else:
        print(obj)

def save_json(data, filename):
    """保存数据到JSON文件"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"数据已保存到 {filename}")

class SpiderDebugger:
    """爬虫调试器"""
    
    def __init__(self, spider):
        self.spider = spider
        self.debug_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'debug_results')
        os.makedirs(self.debug_dir, exist_ok=True)
        self.timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    def save_result(self, data, name):
        """保存结果到JSON文件"""
        # 处理文件名中的特殊字符
        safe_name = name.replace('/', '_').replace('\\', '_').replace(':', '_')
        filename = os.path.join(self.debug_dir, f"{safe_name}_{self.timestamp}.json")
        save_json(data, filename)
        return filename
    
    def debug_home(self):
        """调试首页数据"""
        print("\n" + "=" * 50)
        print("【调试】首页数据")
        print("=" * 50)
        
        # 测试home方法
        print("\n测试 homeContent(filter=False):")
        start_time = time.time()
        home_result = self.spider.homeContent(filter=False)
        end_time = time.time()
        
        print(f"耗时: {end_time - start_time:.2f}秒")
        print(f"分类数量: {len(home_result.get('class', []))}")
        print("\n分类列表:")
        for i, item in enumerate(home_result.get('class', []), 1):
            print(f"  {i}. {item.get('type_name')}: {item.get('type_id')}")
        
        # 保存结果
        self.save_result(home_result, "home_content")
        
        # 测试homeVideoContent方法
        print("\n测试 homeVideoContent():")
        start_time = time.time()
        home_videos = self.spider.homeVideoContent()
        end_time = time.time()
        
        if not home_videos:
            return
        video_count = len(home_videos.get('list', []))
        print(f"耗时: {end_time - start_time:.2f}秒")
        print(f"视频数量: {video_count}")
        
        if video_count > 0:
            print("\n视频列表示例(前3条):")
            for i, item in enumerate(home_videos.get('list', [])[:3], 1):
                print(f"  {i}. {item.get('vod_name')} (ID: {item.get('vod_id')})")
                print(f"     图片: {item.get('vod_pic')}")
                print(f"     备注: {item.get('vod_remarks', '')}")
        
        # 保存结果
        self.save_result(home_videos, "home_videos")
        return home_videos
    
    def debug_category(self, type_id=None):
        """调试分类数据"""
        print("\n" + "=" * 50)
        print("【调试】分类数据")
        print("=" * 50)
        
        # 获取分类ID
        if not type_id:
            # 获取第一个非首页分类
            home_data = self.spider.homeContent(filter=False)
            categories = home_data.get('class', [])
            for cat in categories:
                if cat.get('type_id') != 'home':
                    type_id = cat.get('type_id')
                    type_name = cat.get('type_name')
                    break
            if not type_id:
                print("未找到可用分类")
                return
        else:
            # 找到分类名称
            home_data = self.spider.homeContent(filter=False)
            type_name = None
            for cat in home_data.get('class', []):
                if cat.get('type_id') == type_id:
                    type_name = cat.get('type_name')
                    break
            if not type_name:
                type_name = type_id
        
        print(f"分类: {type_name} (ID: {type_id})")
        
        # 测试categoryContent方法
        print("\n测试 categoryContent():")
        start_time = time.time()
        category_result = self.spider.categoryContent(tid=type_id, pg=1, filter=False, extend={})
        end_time = time.time()
        
        video_count = len(category_result.get('list', []))
        print(f"耗时: {end_time - start_time:.2f}秒")
        print(f"视频数量: {video_count}")
        print(f"当前页: {category_result.get('page', 1)}")
        print(f"总页数: {category_result.get('pagecount', 1)}")
        print(f"总条目: {category_result.get('total', 0)}")
        
        if video_count > 0:
            print("\n视频列表示例(前3条):")
            for i, item in enumerate(category_result.get('list', [])[:3], 1):
                print(f"  {i}. {item.get('vod_name')} (ID: {item.get('vod_id')})")
                print(f"     图片: {item.get('vod_pic')}")
                print(f"     备注: {item.get('vod_remarks', '')}")
        
        # 保存结果
        self.save_result(category_result, f"category_{type_id}")
        return category_result
    
    def debug_search(self, keyword="爱情"):
        """调试搜索数据"""
        print("\n" + "=" * 50)
        print(f"【调试】搜索数据 (关键词: {keyword})")
        print("=" * 50)
        
        # 测试searchContent方法
        print("\n测试 searchContent():")
        start_time = time.time()
        search_result = self.spider.searchContent(key=keyword, quick=False)
        end_time = time.time()
        
        if not search_result:
            return
        
        video_count = len(search_result.get('list', []))

        print(f"耗时: {end_time - start_time:.2f}秒")
        print(f"视频数量: {video_count}")
        
        if video_count > 0:
            print("\n搜索结果示例(前3条):")
            for i, item in enumerate(search_result.get('list', [])[:3], 1):
                print(f"  {i}. {item.get('vod_name')} (ID: {item.get('vod_id')})")
                print(f"     图片: {item.get('vod_pic')}")
                print(f"     备注: {item.get('vod_remarks', '')}")
        
        # 保存结果
        self.save_result(search_result, f"search_{keyword}")
        return search_result
    
    def debug_detail(self, video_id=None):
        """调试详情数据"""
        # 如果没有提供ID，尝试从首页获取
        if not video_id:
            home_videos = self.spider.homeVideoContent()
            if not home_videos:
                return
            if not home_videos.get('list'):
                print("未找到视频ID，请手动提供")
                return
            video_id = home_videos['list'][0]['vod_id']
        
        print("\n" + "=" * 50)
        print(f"【调试】详情数据 (ID: {video_id})")
        print("=" * 50)
        
        # 测试detailContent方法
        print("\n测试 detailContent():")
        start_time = time.time()
        detail_result = self.spider.detailContent(ids=[video_id])
        end_time = time.time()
        
        print(f"耗时: {end_time - start_time:.2f}秒")
        
        if not detail_result or not detail_result.get('list'):
            print("未获取到详情数据")
            return
        
        detail = detail_result['list'][0]
        print(f"\n详情信息:")
        print(f"  标题: {detail.get('vod_name', '未知')}")
        print(f"  副标题: {detail.get('vod_remarks', '')}")
        print(f"  分类: {detail.get('type_name', '')}")
        print(f"  年份: {detail.get('vod_year', '')}")
        print(f"  地区: {detail.get('vod_area', '')}")
        print(f"  演员: {detail.get('vod_actor', '')}")
        print(f"  导演: {detail.get('vod_director', '')}")
        
        # 显示简介
        if 'vod_content' in detail:
            content = detail['vod_content']
            if len(content) > 100:
                content = content[:100] + "..."
            print(f"  简介: {content}")
        
        # 显示播放源
        if 'vod_play_from' in detail and 'vod_play_url' in detail:
            from_list = detail['vod_play_from'].split('$$$')
            url_list = detail['vod_play_url'].split('$$$')
            
            print("\n播放源:")
            for i, from_name in enumerate(from_list):
                print(f"  {i+1}. {from_name}")
                if i < len(url_list):
                    episodes = url_list[i].split('#')
                    print(f"     共{len(episodes)}集")
                    
                    # 显示前3集
                    for j, ep in enumerate(episodes[:3], 1):
                        ep_parts = ep.split('$')
                        if len(ep_parts) > 1:
                            name, url = ep_parts[0], ep_parts[1]
                            if len(url) > 50:
                                url = url[:50] + "..."
                            print(f"     {j}. {name}: {url}")
        
        # 保存结果
        self.save_result(detail_result, f"detail_{video_id}")
        return detail_result, detail
    
    def debug_player(self, video_id=None, source_index=0, episode_index=0):
        """调试播放数据"""
        # 如果没有提供ID，先获取详情
        if not video_id:
            detail_data = self.debug_detail()
            if not detail_data:
                return
            # 因为debug_detail返回的是(detail_result, detail)，所以这里要相应调整
            detail_result, detail = detail_data
            video_id = detail['vod_id']
        else:
            # 获取详情
            detail_result = self.spider.detailContent(ids=[video_id])
            if not detail_result or not detail_result.get('list'):
                print("未获取到详情数据")
                return
            detail = detail_result['list'][0]
        
        # 获取播放信息
        if 'vod_play_from' not in detail or 'vod_play_url' not in detail:
            print("未找到播放信息")
            return
        
        from_list = detail['vod_play_from'].split('$$$')
        url_list = detail['vod_play_url'].split('$$$')
        
        if source_index >= len(from_list) or source_index >= len(url_list):
            print("播放源索引超出范围")
            return
        
        episodes = url_list[source_index].split('#')
        if episode_index >= len(episodes):
            print("剧集索引超出范围")
            return
        
        episode = episodes[episode_index]
        if '$' not in episode:
            print("播放链接格式错误")
            return
        
        episode_name, play_url = episode.split('$', 1)
        flag = from_list[source_index]
        
        print("\n" + "=" * 50)
        print(f"【调试】播放数据")
        print("=" * 50)
        print(f"视频: {detail.get('vod_name', '未知')}")
        print(f"播放源: {flag}")
        print(f"剧集: {episode_name}")
        
        # 测试playerContent方法
        print("\n测试 playerContent():")
        start_time = time.time()
        player_result = self.spider.playerContent(flag=flag, id=play_url, vipFlags={})
        end_time = time.time()
        
        print(f"耗时: {end_time - start_time:.2f}秒")
        
        if not player_result:
            print("未获取到播放数据")
            return
        
        print(f"\n播放信息:")
        print(f"  解析: {'不需要解析' if player_result.get('parse', 0) == 0 else '需要解析'}")
        if 'url' in player_result:
            url = player_result['url']
            if url.endswith('.mp4'):
                print(f"  播放URL (MP4): {url}")
            else:
                print(f"  播放URL: {url}")
                
                # 如果不是MP4链接，尝试手动提取
                if '/episode/' in url:
                    import requests
                    import re
                    import json
                    
                    print("\n尝试手动提取MP4链接...")
                    try:
                        # 构造请求头
                        headers = {}
                        if 'header' in player_result:
                            try:
                                headers = json.loads(player_result['header'])
                            except:
                                headers = {
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                                    "Referer": "https://www.kuaikaw.cn/"
                                }
                        
                        # 发出请求
                        response = requests.get(url, headers=headers, timeout=10)
                        if response.status_code == 200:
                            html = response.text
                            print(f"成功获取页面，大小: {len(html)} 字节")
                            
                            # 尝试从NEXT_DATA提取MP4链接
                            mp4_url = None
                            next_data_match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html, re.DOTALL)
                            
                            if next_data_match:
                                print("找到NEXT_DATA数据")
                                next_data = json.loads(next_data_match.group(1))
                                page_props = next_data.get("props", {}).get("pageProps", {})
                                
                                # 从URL提取章节ID
                                chapter_id = url.split('/')[-1]
                                print(f"从URL提取的章节ID: {chapter_id}")
                                
                                # 从chapterList中查找对应章节
                                chapter_list = page_props.get("chapterList", [])
                                print(f"找到章节列表，长度: {len(chapter_list)}")
                                
                                for chapter in chapter_list:
                                    if chapter.get("chapterId") == chapter_id:
                                        chapter_video = chapter.get("chapterVideoVo", {})
                                        mp4_url = chapter_video.get("mp4", "") or chapter_video.get("mp4720p", "") or chapter_video.get("vodMp4Url", "")
                                        if mp4_url:
                                            print(f"  手动提取的MP4链接: {mp4_url}")
                                            break
                            
                            # 如果没找到，尝试直接匹配MP4链接
                            if not mp4_url:
                                mp4_pattern = r'(https?://[^"\']+\.mp4)'
                                mp4_matches = re.findall(mp4_pattern, html)
                                if mp4_matches:
                                    mp4_url = mp4_matches[0]
                                    print(f"  手动提取的MP4链接: {mp4_url}")
                                    
                                    # 保存结果到JSON
                                    with open('manual_mp4_result.json', 'w', encoding='utf-8') as f:
                                        json.dump({
                                            "original_url": url,
                                            "mp4_url": mp4_url,
                                            "chapter_id": chapter_id if 'chapter_id' in locals() else None
                                        }, f, ensure_ascii=False, indent=2)
                                    print("  链接已保存到 manual_mp4_result.json")
                                else:
                                    print("  未找到MP4链接")
                    except Exception as e:
                        print(f"  手动提取失败: {str(e)}")
                        import traceback
                        print(traceback.format_exc())
        
        if 'header' in player_result:
            try:
                headers = json.loads(player_result['header'])
                print(f"  请求头:")
                for k, v in headers.items():
                    print(f"    {k}: {v}")
            except:
                print(f"  请求头: {player_result['header']}")
        
        # 保存结果
        self.save_result(player_result, f"player_{video_id}_{episode_name}")
        return player_result

def main():
    print("\n" + "=" * 50)
    print("PyramidStore爬虫本地调试工具")
    print("=" * 50)
    
    # 显示Python版本
    print(f"Python版本: {sys.version}")
    
    try:
        # 初始化爬虫
        spider = Spider()
        spider.init()
        
        # 显示爬虫信息
        print(f"爬虫名称: {spider.getName()}")
        print(f"爬虫域名: {spider.siteUrl}")
        
        # 初始化调试器
        debugger = SpiderDebugger(spider)
        
        # 解析命令行参数
        if len(sys.argv) > 1:
            command = sys.argv[1].lower()
            
            if command == 'home':
                debugger.debug_home()
            elif command == 'category':
                type_id = sys.argv[2] if len(sys.argv) > 2 else None
                debugger.debug_category(type_id)
            elif command == 'search':
                keyword = sys.argv[2] if len(sys.argv) > 2 else "爱情"
                debugger.debug_search(keyword)
            elif command == 'detail':
                video_id = sys.argv[2] if len(sys.argv) > 2 else None
                debugger.debug_detail(video_id)
            elif command == 'player':
                video_id = sys.argv[2] if len(sys.argv) > 2 else None
                source = int(sys.argv[3]) if len(sys.argv) > 3 else 0
                episode = int(sys.argv[4]) if len(sys.argv) > 4 else 0
                debugger.debug_player(video_id, source, episode)
            elif command == 'all':
                # 测试全部功能
                home_videos = debugger.debug_home()
                debugger.debug_category()
                debugger.debug_search()
                
                # 使用首页第一个视频测试详情和播放
                if home_videos and home_videos.get('list'):
                    video_id = home_videos['list'][0]['vod_id']
                    detail_result, detail = debugger.debug_detail(video_id)
                    if detail_result:
                        debugger.debug_player(video_id)
            else:
                print(f"未知命令: {command}")
                print_usage()
        else:
            # 默认测试首页
            debugger.debug_home()
            print_usage()
    
    except Exception as e:
        import traceback
        print(f"调试过程出错: {e}")
        traceback.print_exc()

def print_usage():
    """打印使用说明"""
    print("\n使用方法:")
    print("  python local_spider_debug.py [命令] [参数]")
    print("\n可用命令:")
    print("  home                - 测试首页数据")
    print("  category [类型ID]    - 测试分类数据，可选类型ID")
    print("  search [关键词]     - 测试搜索数据，默认关键词'爱情'")
    print("  detail [视频ID]     - 测试详情数据，可选视频ID")
    print("  player [视频ID] [播放源索引] [剧集索引] - 测试播放数据")
    print("  all                 - 测试所有功能")

if __name__ == "__main__":
    main() 
