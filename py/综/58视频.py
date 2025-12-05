# -*- coding: utf-8 -*-
# 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
# 严禁将其用于任何商业用途，下载后请于 24 小时内删除，搜索结果均来自源站，本人不承担任何责任。

from Crypto.Cipher import AES
from base.spider import Spider
from Crypto.Util.Padding import unpad
import re,sys,uuid,json,urllib3,base64,requests
from urllib.parse import urljoin,quote_plus,unquote_plus
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
sys.path.append('..')

class Spider(Spider):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12; SM-S9080 Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.61 Safari/537.36 uni-app Html5Plus/1.0 (Immersed/0.6666667)',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'Version': '1.3.74',
        'Token': ''
    }
    play_headers = {'User-Agent': 'io.dcloud.application.DCloudApplication/1.3.74 (Linux;Android 12)'}
    host,key,iv,deviceid,categories,dj_id,block_id,bn,dn = '','','','','','',[],b'\xe6\x83\x85\xe8\x89\xb2',''

    def init(self, extend=''):
        try:
            try:
                if isinstance(extend, str) and extend.startswith('http'):
                    self.host = extend
                else:
                    config = json.loads(extend)
                    self.host = config.get('host')
                    self.key = config.get('key')
                    self.iv = config.get('iv')
                    self.deviceid = config.get('deviceid')
            except (json.JSONDecodeError, TypeError):
                pass
            self.host = self.host or 'https://1018api.bumbpv.com'
            if not self.deviceid:
                did_cache_key = f'com.hsteslgyzx.gsda_deviceid_'
                did = self.getCache(did_cache_key)
                if not did:
                    did = uuid.uuid4().hex
                    self.setCache(did_cache_key, did)
                    self.deviceid = did
            payload = {'UserId': '0', 'device_id': self.deviceid}
            response = self.post(f'{self.host}/addons/appto/app.php/tindex/home_config2', data=payload, headers=self.headers, verify=False).json()
            data = json.loads(self.decrypt(response['data']))
            block_id = []
            for i in data['viphome']:
                block_id.append(i['id'])
            self.block_id = block_id
            self.dn = {bs.decode('gbk') for bs in {b'\xb8\xa3\xc0\xfb',b'\xc7\xe9\xc9\xab',b'\xc2\xdc\xc0\xf2',b'\xc2\xd7\xc0\xed',b'\xcd\xac\xd0\xd4',b'\xc7\xe9\xc8\xa4'}}
            for j in data.get('collections',[]):
                if j.get('title') == '短剧':
                    self.dj_id = str(j.get('id')) or '3'
            self.categories = {'itemsValue': data.get('itemsValue',[]), 'collections': data.get('collections',[])}
        except Exception:
            self.host = ''

    def homeContent(self, filter):
        if not self.host: return None
        input_data = self.categories
        short_drama_map = {}
        for item in input_data.get('collections', []):
            if item.get('short') == '1':
                short_drama_map[item['title']] = f"short@{item['title']}"
        result = {'class': [], 'filters': {}}
        items_value_map = {item['title']: item for item in input_data['itemsValue']}
        for item in input_data['itemsValue']:
            title = item['title']
            if title == '全部': continue
            type_id = title
            if title in short_drama_map:
                type_id = short_drama_map[title]
            result['class'].append({'type_id': type_id, 'type_name': title})
        for class_item in result['class']:
            type_id = class_item['type_id']
            type_name = class_item['type_name']
            query_title = type_name
            if '@' in type_id:
                query_title = type_id.split('@', 1)[1]
            if query_title in items_value_map:
                item = items_value_map[query_title]
                filters = []
                if 'Classes' in item:
                    classes = [cls.strip() for cls in item['Classes'].split(',') if cls.strip()]
                    unique_classes = []
                    seen_classes = set()
                    for cls in classes:
                        if cls not in seen_classes and not any(rule in cls for rule in self.dn):
                            unique_classes.append(cls)
                            seen_classes.add(cls)
                    if unique_classes:
                        class_values = [{'n': cls, 'v': cls} for cls in unique_classes]
                        filters.append({'key': 'class', 'name': '类型',  'value': class_values})
                if 'Areas' in item:
                    areas = [area.strip() for area in item['Areas'].split(',') if area.strip()]
                    unique_areas = []
                    seen_areas = set()
                    for area in areas:
                        if area not in seen_areas:
                            unique_areas.append(area)
                            seen_areas.add(area)
                    if unique_areas:
                        area_values = [{'n': area, 'v': area} for area in unique_areas]
                        filters.append({'key': 'area', 'name': '地区', 'value': area_values})
                if 'Years' in item:
                    years = [year.strip() for year in item['Years'].split(',') if year.strip()]
                    unique_years, seen_years = [], set()
                    for year in years:
                        if year not in seen_years:
                            unique_years.append(year)
                            seen_years.add(year)
                    if unique_years:
                        year_values = [{'n': year, 'v': year} for year in unique_years]
                        filters.append({'key': 'year', 'name': '年份', 'value': year_values})
                sort_values = [{'n':'最新','v':'Time'},{'n':'评分','v':'Score'},{'n':'人气','v':'Hits'}]
                filters.append({'key': 'sort', 'name': '排序', 'value': sort_values})
                result['filters'][type_id] = filters
        return result

    def homeVideoContent(self):
        if not self.host: return None
        payload = {
            'UserId': '0',
            'device_id': self.deviceid,
            'Id': '0',
            'Type': '1',
            'Page': '1',
            'Limit': '10'
        }
        response = self.post(f'{self.host}/addons/appto/app.php/tindex/home_vod_list2', data=payload, headers=self.headers, verify=False).json()
        data = json.loads(self.decrypt(response['data']))
        vods = []
        for i in data['sections']:
            vods.extend(i['vods'])
        vods.extend(data['vods'])
        videos = self.arr2vods(vods)
        return {'list': videos}

    def categoryContent(self, tid, pg, filter, ext):
        if not self.host: return None
        tab = '影视'
        if isinstance(tid,str) and (tid.startswith('short@') or '短剧' in tid):
            tab, tid = '短剧', tid.lstrip(tid)
        payload = {
            'UserId': '0',
            'device_id': self.deviceid,
            'Page': str(pg),
            'Limit': '44',
            'Tab': tab,
            'Sort': ext.get('sort', 'Time'),
            'Type': tid,
            'Area': ext.get('area','中国大陆'),
            'Class': ext.get('class',''),
            'Year': ext.get('year','')
        }
        response = self.post(f'{self.host}/addons/appto/app.php/tindex/page_vod_lists', data=payload, headers=self.headers, verify=False).json()
        data = self.decrypt(response['data'])
        data2 = json.loads(data)
        videos = self.arr2vods(data2['list'])
        return {'list': videos, 'pg': pg}

    def searchContent(self, key, quick, pg='1'):
        if not self.host: return None
        url = f'{self.host}/addons/appto/app.php/tindex/search_film'
        videos, type_list = [], {'film','short'}
        for search_type in type_list:
            payload = {
                'UserId': '0',
                'device_id': self.deviceid,
                'Search': key,
                'type': search_type,
                'Page': pg,
                'Limit': '10'
            }
            response = self.post(url, data=payload, headers=self.headers, verify=False).json()
            data = self.decrypt(response['data'])
            vods =json.loads(data)['vods']
            videos.extend(self.arr2vods(vods['list']))
        return {'list': videos, 'page': pg}

    def detailContent(self, ids):
        if not self.host: return None
        payload = {'UserId': '0', 'device_id': self.deviceid, 'id': ids[0]}
        response = self.post(f'{self.host}/addons/appto/app.php/tindex/page_player', data=payload, headers=self.headers, verify=False).json()
        data = json.loads(self.decrypt(response['data']))
        if data['type_id'] in self.block_id:
            return {'list': []}
        if not data['group_id'] == 0:
            return {'list': []}
        if data.get('vod_serial') == '1':
            remarks = f"评分: {data['vod_douban_score']}"
        else:
            remarks = f"集数: {data.get('vod_serial')}"
        play_urls = []
        for i in data['vod_play_url'].split('#'):
            if str(data['type_id']) == self.dj_id:
                if '$' in i:
                    left, right = i.split("$", 1)
                    play_urls.append(f'{left}$direct@{right}')
            else:
                play_urls.append(i)
        video = {
            'vod_id': data['vod_id'],
            'vod_name': data['vod_name'],
            'vod_content': data.get('vod_blurb'),
            'vod_remarks': remarks,
            'vod_year': data.get('vod_year'),
            'vod_area': data.get('vod_area'),
            'vod_play_from': '58视频',
            'vod_play_url': '#'.join(play_urls)
        }
        return {'list': [video]}

    def playerContent(self, flag, vid, vip_Flags):
        url = ''
        if vid.startswith('direct@'):
            url = vid.lstrip('direct@')
        elif '.m3u8' in vid:
            try:
                proxy = f'{self.getProxyUrl(True)}&type=58sp'
            except Exception:
                proxy = 'http://127.0.0.1:9978/proxy?do=py&type=58sp'
            url = f'{proxy}&url={quote_plus(vid)}'
        return {'jx': 0, 'playUrl': '', 'parse': 0, 'url': url,'header': self.play_headers}

    def modify_m3u8_58sp(self, url, retries=3, timeout=10):
        current_url = url
        while True:
            try:
                for attempt in range(retries):
                    try:
                        response = requests.get(current_url, timeout=timeout,headers=self.play_headers)
                        response.raise_for_status()
                        content = response.text
                        break
                    except (requests.RequestException, ValueError) as e:
                        if attempt == retries - 1:
                            raise Exception
                base_url = current_url.rsplit('/', 1)[0] + '/'
                lines = content.strip().split('\n')
                is_master_playlist = any(line.startswith('#EXT-X-STREAM-INF:') for line in lines)
                if is_master_playlist:
                    highest_bandwidth = 0
                    best_playlist_url = None
                    bandwidth_regex = re.compile(r'BANDWIDTH=(\d+)')
                    for i, line in enumerate(lines):
                        if line.startswith('#EXT-X-STREAM-INF:'):
                            match = bandwidth_regex.search(line)
                            if match:
                                bandwidth = int(match.group(1))
                                if i + 1 < len(lines) and not lines[i + 1].startswith('#'):
                                    playlist_url = lines[i + 1].strip()
                                    if not playlist_url.startswith(('http://','https://')):
                                        playlist_url = urljoin(base_url, playlist_url)
                                    if bandwidth > highest_bandwidth:
                                        highest_bandwidth = bandwidth
                                        best_playlist_url = playlist_url
                    if best_playlist_url:
                        current_url = best_playlist_url
                        continue
                    else:
                        raise Exception
                key_regex = re.compile(r'#EXT-X-KEY:(.*)URI="([^"]+)"(.*)')
                segment_regex = re.compile(r'#EXTINF:([\d.]+),')
                m3u8_output = []
                first_segment_index = -1
                segment_durations = []
                segment_indices = []
                for i, line in enumerate(lines):
                    if line.startswith('#EXTINF:'):
                        match = segment_regex.search(line)
                        if match:
                            duration = float(match.group(1))
                            segment_durations.append(duration)
                            segment_indices.append(i)
                modified_remove_start_indices = []
                if len(segment_durations) >= 2:
                    second_duration_str = "{0:.3f}".format(segment_durations[1])
                    if second_duration_str.endswith('67'):
                        modified_remove_start_indices = segment_indices[:2]
                    elif len(segment_durations) >= 3:
                        third_duration_str = "{0:.3f}".format(segment_durations[2])
                        if third_duration_str.endswith('67'):
                            modified_remove_start_indices = segment_indices[:3]
                        elif len(segment_durations) >= 5:
                            dur3 = round(segment_durations[2], 3)
                            dur4 = round(segment_durations[3], 3)
                            dur5 = round(segment_durations[4], 3)
                            if dur3 == dur4 == dur5:
                                a = dur3
                                dur1 = round(segment_durations[0], 3)
                                dur2 = round(segment_durations[1], 3)
                                if not(dur1 == dur2 == a):
                                    sum_dur1_dur2 = round(segment_durations[0] + segment_durations[1], 3)
                                    if sum_dur1_dur2 == 4.0:
                                        modified_remove_start_indices = segment_indices[:2]
                lines_to_remove = set()
                for seg_idx in modified_remove_start_indices:
                    lines_to_remove.add(seg_idx)
                    if seg_idx + 1 < len(lines):
                        lines_to_remove.add(seg_idx + 1)
                for i, line in enumerate(lines):
                    line = line.strip()
                    if not line:
                        continue
                    if line.startswith('#EXT-X-KEY:'):
                        match = key_regex.search(line)
                        if match:
                            prefix = match.group(1)
                            key_url = match.group(2)
                            suffix = match.group(3)
                            if not key_url.startswith(('http:', 'https:')):
                                key_url = urljoin(base_url, key_url)
                            updated_key_line = f'#EXT-X-KEY:{prefix}URI="{key_url}"{suffix}'
                            m3u8_output.append(updated_key_line)
                            continue
                    if i in lines_to_remove:
                        continue
                    if not line.startswith('#') and i > first_segment_index:
                        segment_url = line
                        if not segment_url.startswith(('http:', 'https:')):
                            segment_url = urljoin(base_url, segment_url)
                        m3u8_output.append(segment_url)
                    else:
                        m3u8_output.append(line)
                    if first_segment_index == -1 and line.startswith('#EXTINF:'):
                        first_segment_index = i
                if not any(not line.startswith('#') for line in m3u8_output):
                    raise Exception
                if not m3u8_output or not m3u8_output[0].startswith('#EXTM3U'):
                    m3u8_output.insert(0, '#EXTM3U')
                return '\n'.join(m3u8_output)
            except Exception as e:
                return f"#EXTM3U\n#EXT-X-ERROR:{str(e)}"

    def arr2vods(self, arr):
        videos = []
        if arr and isinstance(arr, list):
            for i in arr:
                for k in self.dn:
                    if k in i.get('vod_class'): continue
                if i['group_id'] != 0: continue
                if 'payload' in i or 'action' in i or 'banner' in i['vod_class'] or i['type_id'] in self.block_id or self.bn.decode('utf-8') in i['vod_class'] or b'\xe4\xbc\x9a\xe5\x91\x98'.decode('utf-8') in i.get('vod_type_name', ''): continue
                vod_pic = i.get('vod_pic_vertical')
                if not vod_pic: vod_pic = i.get('vod_pic')
                if vod_pic.startswith('mac://'): vod_pic = vod_pic.replace('mac://', 'https://', 1)
                videos.append({
                    'vod_id': i.get('vod_id'),
                    'vod_name': i.get('vod_name'),
                    'vod_class': i.get('vod_class'),
                    'vod_pic': vod_pic,
                    'vod_score': i.get('vod_score'),
                    'vod_remarks': i.get('vod_remarks')
                })
        return videos

    def decrypt(self, ciphertext):
        try:
            key = self.key or '58928cae68092afc'
            iv = self.iv or 'e9d732a1edcdcc0a'
            ciphertext = base64.b64decode(ciphertext)
            key_bytes = key.encode('utf-8')
            iv_bytes = iv.encode('utf-8')
            cipher = AES.new(key_bytes, AES.MODE_CBC, iv_bytes)
            decrypted_data = unpad(cipher.decrypt(ciphertext), AES.block_size)
            return decrypted_data.decode('utf-8')
        except Exception:
            return None

    def page_count(self,limit, total):
        try:
            if limit <= 0: raise ValueError
            return 1 if total <= 0 else (total + limit - 1) // limit
        except Exception:
            return 1

    def localProxy(self, params):
        if params['type'] == '58sp':
            url = unquote_plus(params['url'])
            data = self.modify_m3u8_58sp(url)
            return [200, "application/vnd.apple.mpegurl", data]
        return None

    def getName(self):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass