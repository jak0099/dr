# coding=utf-8
# !/usr/bin/python
import sys, os, json
from base.spider import Spider
from requests import session, utils, get as requests_get
from requests.adapters import HTTPAdapter, Retry
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
import hashlib
import time
import random
import base64
from functools import reduce
from urllib.parse import quote, urlencode

sys.path.append('..')
dirname, filename = os.path.split(os.path.abspath(__file__))
sys.path.append(dirname)

class Spider(Spider):
    #默认设置
    defaultConfig = {
        'currentVersion': "20231213_1",
        #【建议通过扫码确认】设置Cookie，在双引号内填写
        'raw_cookie_line': "",
        #如果主cookie没有vip，可以设置第二cookie，仅用于播放会员番剧，所有的操作、记录还是在主cookie，不会同步到第二cookie
        'raw_cookie_vip': "",
        #主页默认显示3图
        'maxHomeVideoContent': '3',
        #收藏标签默认显示追番1，追剧2，默认收藏夹0
        'favMode': '0',
        #部分视频列表分页，限制每次加载数量
        'page_size': 12,
        #上传播放进度间隔时间，单位秒，b站默认间隔15，0则不上传播放历史
        'heartbeatInterval': '15',
        #视频默认画质ID
        'vodDefaultQn': '80',
        #视频默认解码ID
        'vodDefaultCodec': '7',
        #音频默认码率ID
        'vodDefaultAudio': '30280',
        #获取视频热门评论
        'show_vod_hot_reply': True,
        #从正片中拆分出番剧的预告
        'hide_bangumi_preview': True,
        #登陆会员账号后，影视播放页不显示会员专享的标签，更简洁
        'hide_bangumi_vip_badge': True,
        #番剧（热门）列表使用横图
        'bangumi_horizontal_cover': True,
        #非会员播放会员专享视频时，添加一个页面可以使用解析源，解析源自行解决
        'bangumi_vip_parse': True,
        #付费视频添加一个页面可以使用解析，解析源自行解决
        'bangumi_pay_parse': True,
        #是否显示直播标签筛选中分区的细化标签, 0为不显示，1为显示
        'showLiveFilterTag': '0',
        #主页标签排序, 未登录或cookie失效时自动隐藏动态、收藏、关注、历史
        'cateManual': [
            "推荐",
            "影视",
            "直播",
            "动态",
            "频道",
            "收藏",
            "关注",
            "历史",
            "搜索",
        ],
        #自定义推荐标签的筛选
        'tuijianLis': [
            "热门",
            "排行榜",
            "每周必看",
            "入站必刷",
            "番剧时间表",
            "国创时间表"
        ],
        'rankingLis': [
            "动画",
            "音乐",
            "舞蹈",
            "游戏",
            "鬼畜",
            "知识",
            "科技",
            "运动",
            "生活",
            "美食",
            "动物",
            "汽车",
            "时尚",
            "娱乐",
            "影视",
            "原创",
            "新人",
        ],
    }

    #在动态标签的筛选中固定显示他，n为用户名或任意都可以，v必须为准确的UID
    focus_on_up_list = [
        #{"n":"徐云流浪中国", "v":"697166795"},
    ]
    
    #在搜索标签的筛选中固定显示搜索词
    focus_on_search_key = []

    def getName(self):
        return "哔哩哔哩"

    def load_config(self):
        try:
            with open(f"{self.configdir}/config.json",encoding="utf-8") as f:
                self.userConfig = json.load(f)
            old_config = {
                'master': 'cookie_dic',
                'vip': 'cookie_vip_dic',
                'fake': 'cookie_fake_dic',
            }
            for _type, old in old_config.items():
                old = self.userConfig.get(old)
                if old:
                    if not self.userConfig.get('users'):
                        self.userConfig['users'] = {}
                    self.userConfig['users'][_type] = {'cookies_dic': old}
            users = self.userConfig.get('users', {})
            if users.get('master') and users['master'].get('cookies_dic'):
                self.session_master.cookies = utils.cookiejar_from_dict(users['master']['cookies_dic'])
                self.userid = users['master']['userid']
            if users.get('fake') and users['fake'].get('cookies_dic'):
                self.session_fake.cookies = utils.cookiejar_from_dict(users['fake']['cookies_dic'])
        except:
            self.userConfig = {}
        self.userConfig = {**self.defaultConfig, **self.userConfig}

    dump_config_lock = threading.Lock()
    
    def dump_config(self):
        needSaveConfig = ['users', 'channel_list', 'cateLive', 'cateManualLive', 'cateManualLiveExtra']
        userConfig_new = {}
        for key, value in self.userConfig.items():
            dafalutValue = self.defaultConfig.get(key)
            if dafalutValue != None and value != dafalutValue or key in needSaveConfig:
                userConfig_new[key] = value
        self.dump_config_lock.acquire()
        with open(f"{self.configdir}/config.json", 'w', encoding="utf-8") as f:
            data = json.dumps(userConfig_new, indent=1, ensure_ascii=False)
            f.write(data)
        self.dump_config_lock.release()

    pool = ThreadPoolExecutor(max_workers=8)
    task_pool = []
    # 主页
    def homeContent(self, filter):
        self.pool.submit(self.add_live_filter)
        self.pool.submit(self.add_channel_filter)
        self.pool.submit(self.add_search_key)
        self.pool.submit(self.add_focus_on_up_filter)
        self.pool.submit(self.get_tuijian_filter)
        self.pool.submit(self.add_fav_filter)
        #self.pool.submit(self.homeVideoContent)
        needLogin = ['频道', '动态', '收藏', '关注', '历史']
        cateManual = self.userConfig['cateManual']
        if not self.userid and not 'UP' in cateManual or not '动态' in cateManual and not 'UP' in cateManual:
            cateManual += ['UP']
        classes = []
        for k in cateManual:
            if k in needLogin and not self.userid:
                continue
            classes.append({
                'type_name': k,
                'type_id': k
            })
        self.add_focus_on_up_filter_event.wait()
        if 'UP' in cateManual:
            self.config["filter"].update({'UP': self.config["filter"].pop('动态')})
        result = {'class': classes}
        self.add_live_filter_event.wait()
        self.add_channel_filter_event.wait()
        self.add_fav_filter_event.wait()
        self.add_search_key_event.wait()
        if filter:
            result['filters'] = self.config['filter']
        self.pool.submit(self.dump_config)
        return result

    # 用户cookies
    userid = csrf = ''
    session_master = session()
    session_vip = session()
    session_fake = session()
    con = threading.Condition()
    getCookie_event = threading.Event()
    retries = Retry(total=5,
                #status_forcelist=[ 500, 502, 503, 504 ],
                backoff_factor=0.1)
    adapter = HTTPAdapter(max_retries=retries)
    session_master.mount('https://', adapter)
    session_vip.mount('https://', adapter)
    session_fake.mount('https://', adapter)

    def getCookie_dosth(self, co):
        c = co.strip().split('=', 1)
        if not '%' in c[1]:
            c[1] = quote(c[1])
        return c

    def getCookie(self, _type='master'):
        raw_cookie = 'raw_cookie_line'
        if _type == 'vip':
            raw_cookie = 'raw_cookie_vip'
        raw_cookie = self.userConfig.get(raw_cookie)
        users = self.userConfig.get('users', {})
        user = users.get(_type, {})
        if not raw_cookie and not user:
            if _type == 'master':
                self.getCookie_event.set()
            with self.con:
                self.con.notifyAll()
            return
        cookies_dic = user.get('cookies_dic', {})
        if raw_cookie:
            cookies_dic = dict(map(self.getCookie_dosth, raw_cookie.split(';')))
        cookies = utils.cookiejar_from_dict(cookies_dic)
        url = 'https://api.bilibili.com/x/web-interface/nav'
        content = self.fetch(url, headers=self.header, cookies=cookies)
        res = json.loads(content.text)
        user['isLogin'] = 0
        if res["code"] == 0:
            user['isLogin'] = 1
            user['userid'] = res["data"]['mid']
            user['face'] = res['data']['face']
            user['uname'] = res['data']['uname']
            user['cookies_dic'] = cookies_dic
            user['isVIP'] = int(res['data']['vipStatus'])
            if _type == 'master':
                self.session_master.cookies = cookies
                self.userid = user['userid']
                self.csrf = cookies_dic['bili_jct']
            if user['isVIP']:
                self.session_vip.cookies = cookies
        else:
            self.userid = ''
        users[_type] = user
        with self.con:
            if len(user) > 1:
                self.userConfig.update({'users': users})
            if _type == 'master':
                self.getCookie_event.set()

    getFakeCookie_event = threading.Event()

    def getFakeCookie(self, fromSearch=None):
        if self.session_fake.cookies:
            self.getFakeCookie_event.set()
        header = {}
        header['User-Agent'] = self.header['User-Agent']
        rsp = self.fetch('https://space.bilibili.com/2/video', headers=header)
        self.session_fake.cookies = rsp.cookies
        self.getFakeCookie_event.set()
        with self.con:
            users = self.userConfig.get('users', {})
            users['fake'] = {'cookies_dic': dict(rsp.cookies)}
            self.userConfig.update({'users': users})
        if not fromSearch:
            self.getCookie_event.wait()
            if not self.session_master.cookies:
                self.session_master.cookies = rsp.cookies
        
    def get_fav_list_dict(self, fav):
        fav_dict = {
            'n': fav['title'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;",'"').strip(),
            'v': fav['id']}
        return fav_dict

    add_fav_filter_event = threading.Event()

    def add_fav_filter(self):
        users = self.userConfig.get('users', {})
        if users.get('master') and users['master'].get('userid'):
            userid = self.userConfig['users']['master']['userid']
        else:
            self.getCookie_event.wait()
            userid = self.userid
        fav_list = []
        if userid:
            url = 'https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=%s&jsonp=jsonp' % str(userid)
            rsp = self._get_sth(url)
            jo = json.loads(rsp.text)
            if jo['code'] == 0 and jo.get('data'):
                fav = jo['data'].get('list')
                fav_list = list(map(self.get_fav_list_dict, fav))
        fav_top = [{"n": "追番", "v": "1"},{"n": "追剧", "v": "2"}]
        fav_config = self.config["filter"].get('收藏')
        if fav_config:
            fav_config.insert(0, {
                "key": "mlid",
                "name": "分区",
                "value": fav_top + fav_list,
            })
        self.add_fav_filter_event.set()
        self.userConfig["fav_list"] = fav_list

    def get_channel_list_dict(self, channel):
        channel_dict = {
            'n': channel['name'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;",'"').strip(),
            'v': channel['id']}
        return channel_dict

    def get_channel_list(self):
        url = 'https://api.bilibili.com/x/web-interface/web/channel/category/channel/list?id=100&offset=0&page_size=15'
        rsp = self._get_sth(url, 'fake')
        jo = json.loads(rsp.text)
        channel_list = []
        if jo['code'] == 0:
            channel = jo['data'].get('channels')
            self.userConfig['channel_list'] = list(map(self.get_channel_list_dict, channel))
        return self.userConfig['channel_list']

    add_channel_filter_event = threading.Event()

    def add_channel_filter(self):
        channel_list = self.userConfig.get('channel_list', '')
        channel_list_task = self.pool.submit(self.get_channel_list)
        if not channel_list:
            channel_list = channel_list_task.result()
        channel_config = self.config["filter"].get('频道', [])
        if channel_config:
            channel_config.insert(0, {
                "key": "cid",
                "name": "分区",
                "value": channel_list,
            })
        self.config["filter"]['频道'] = channel_config
        self.add_channel_filter_event.set()

    add_focus_on_up_filter_event = threading.Event()

    def add_focus_on_up_filter(self):
        first_list = [{"n": "上个视频的UP主", "v": "上个视频的UP主"}]
        up_list = self.focus_on_up_list
        if not self.session_master.cookies:
            self.getCookie_event.wait()
        focus_on_up_list_mid = list(map(lambda x: x['v'], up_list))
        if self.session_master.cookies:
            url = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=video&page=1'
            rsp = self._get_sth(url)
            jo = json.loads(rsp.text)
            if jo['code'] == 0 and jo.get('data'):
                up = jo['data'].get('items', [])
                for u in map(lambda x: {'n': x['modules']["module_author"]['name'], 'v': str(x['modules']["module_author"]['mid'])}, up):
                    if not u in up_list and not u['v'] in focus_on_up_list_mid:
                        up_list.append(u)
        last_list = [{"n": "登录与设置", "v": "登录"}]
        if not self.isFongmi:
            up_list = first_list + up_list
        up_list += last_list
        dynamic_config = self.config["filter"].get('动态', [])
        if dynamic_config:
            dynamic_config.insert(0, {
                "key": "mid",
                "name": "UP主",
                "value": up_list,
            })
        self.config["filter"]['动态'] = dynamic_config
        self.add_focus_on_up_filter_event.set()

    def get_live_parent_area_list(self, parent_area):
        name = parent_area['name']
        id = str(parent_area['id'])
        area = parent_area['list']
        area_dict = list(map(lambda area: {'n': area['name'], 'v': str(area['parent_id']) + '_' + str(area['id'])}, area))
        live_area = {'key': 'tid', 'name': name, 'value': area_dict}
        cateLive_name = {'id': id + '_0', 'value': live_area}
        return (name, cateLive_name)

    def get_live_list(self):
        url = 'https://api.live.bilibili.com/xlive/web-interface/v1/index/getWebAreaList?source_id=2'
        rsp = self._get_sth(url, 'fake')
        jo = json.loads(rsp.text)
        cateLive = {}
        if jo['code'] == 0:
            parent = jo['data']['data']
            self.userConfig['cateLive'] = dict(self.pool.map(self.get_live_parent_area_list, parent))
        return self.userConfig['cateLive']

    def set_default_cateManualLive(self):
        cateManualLive = [{'n': '推荐', 'v': '推荐'},]
        for name in self.userConfig['cateLive']:
            area_dict = {'n': name, 'v': self.userConfig['cateLive'][name]['id']}
            cateManualLive.append(area_dict)
        self.defaultConfig['cateManualLive'] = cateManualLive
        return cateManualLive

    add_live_filter_event = threading.Event()

    def add_live_filter(self):
        cateLive = self.userConfig.get('cateLive', {})
        cateLive_task = self.pool.submit(self.get_live_list)
        if not cateLive:
            cateLive = cateLive_task.result()
        default_cateManualLive_task = self.pool.submit(self.set_default_cateManualLive)
        self.config["filter"]['直播'] = []
        #分区栏
        cateManualLive = self.userConfig.get('cateManualLive', [])
        if not cateManualLive:
            cateManualLive = default_cateManualLive_task.result()
        if cateManualLive:
            live_area = {'key': 'tid', 'name': '分区', 'value': cateManualLive}
            self.config["filter"]['直播'].append(live_area)
        #显示分区细分
        if int(self.userConfig['showLiveFilterTag']):
            for name in cateLive.values():
                if len(name['value']['value']) == 1:
                    continue
                self.config["filter"]['直播'].append(name['value'])
        self.add_live_filter_event.set()

    add_search_key_event = threading.Event()

    def add_search_key(self):
        focus_on_search_key = self.focus_on_search_key
        url = 'https://api.bilibili.com/x/web-interface/search/square?limit=10&platform=web'
        rsp = self._get_sth(url, 'fake')
        jo = json.loads(rsp.text)
        cateLive = {}
        if jo['code'] == 0:
            trending = jo['data']['trending'].get('list', [])
            focus_on_search_key += list(map(lambda x:x['keyword'], trending))
        keyword = {"key": "keyword", "name": "搜索词","value": []}
        keyword["value"] = list(map(lambda i: {'n': i, 'v': i}, focus_on_search_key))
        self.config["filter"]['搜索'].insert(0, keyword)
        self.add_search_key_event.set()

    def get_tuijian_filter(self):
        tuijian_filter = {"番剧时间表": "10001", "国创时间表": "10004", "排行榜": "0", "动画": "1", "音乐": "3", "舞蹈": "129", "游戏": "4", "鬼畜": "119", "知识": "36", "科技": "188", "运动": "234", "生活": "160", "美食": "211", "动物": "217", "汽车": "223", "时尚": "155", "娱乐": "5", "影视": "181", "原创": "origin", "新人": "rookie"}
        _dic = [{'n': 'tuijianLis', 'v': '分区'}, {'n': 'rankingLis', 'v': '排行榜'}]
        filter_lis = []
        for d in _dic:
            _filter = {"key": "tid" ,'name': d['v'],"value": []}
            t_lis = self.userConfig.get(d['n'], [])
            for t in t_lis:
                tf = tuijian_filter.get(t)
                if not tf:
                    tf = t
                tf_dict = {'n': t, 'v': tf}
                _filter["value"].append(tf_dict)
            filter_lis.append(_filter)
        self.config["filter"]['推荐'] = filter_lis

    isFongmi = False

    def __init__(self):
        self.configdir = dirname
        if dirname.startswith('/data/'):
            self.isFongmi = True
            configdir = os.path.abspath(os.path.join(dirname, ".."))
            configdir = os.path.abspath(os.path.join(configdir, ".."))
            self.configdir = f"{configdir}/files"
        self.load_config()
        self.pool.submit(self.getCookie)
        self.pool.submit(self.getFakeCookie)
        self.pool.submit(self.getCookie, 'vip')
        wts = round(time.time())
        self.pool.submit(self.get_wbiKey, wts)

    def init(self, extend=""):
        print("============{0}============".format(extend))
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    # 降低内存占用
    def format_img(self, img):
        img += "@672w_378h_1c.webp"
        if not img.startswith('http'):
            img = 'https:' + img
        return img

    def pagination(self, array, pg):
        max_number = self.userConfig['page_size'] * int(pg)
        min_number = max_number - self.userConfig['page_size']
        return array[min_number:max_number]

    # 将超过10000的数字换成成以万和亿为单位
    def zh(self, num):
        if int(num) >= 100000000:
            p = round(float(num) / float(100000000), 1)
            p = str(p) + '亿'
        else:
            if int(num) >= 10000:
                p = round(float(num) / float(10000), 1)
                p = str(p) + '万'
            else:
                p = str(num)
        return p

    # 将秒数转化为 时分秒的格式
    def second_to_time(self, a):
        a = int(a)
        if a < 3600:
            result = time.strftime("%M:%S", time.gmtime(a))
        else:
            result = time.strftime("%H:%M:%S", time.gmtime(a))
        if str(result).startswith('0'):
            result = str(result).replace('0', '', 1)
        return result

    # 字符串时分秒以及分秒形式转换成秒
    def str2sec(self, x):
        x = str(x)
        try:
            h, m, s = x.strip().split(':')  # .split()函数将其通过':'分隔开，.strip()函数用来除去空格
            return int(h) * 3600 + int(m) * 60 + int(s)  # int()函数转换成整数运算
        except:
            m, s = x.strip().split(':')  # .split()函数将其通过':'分隔开，.strip()函数用来除去空格
            return int(m) * 60 + int(s)  # int()函数转换成整数运算

    # 按时间过滤
    def filter_duration(self, vodlist, key):
        if key == '0':
            return vodlist
        else:
            vod_list_new = [i for i in vodlist if
                            self.time_diff1[key][0] <= self.str2sec(str(i["vod_remarks"])) < self.time_diff1[key][1]]
            return vod_list_new

    # 提取番剧id
    def find_bangumi_id(self, url):
        aid = str(url).strip().split(r"/")[-1]
        if not aid:
            aid = str(url).strip().split(r"/")[-2]
        aid = aid.split(r"?")[0]
        return aid

    # 登录二维码
    def get_Login_qrcode(self, pg):
        result = {}
        if int(pg) != 1:
            return result
        video = [{
            "vod_id": 'setting_tab&filter',
            "vod_name": '标签与筛选',
            "vod_pic": 'https://www.bilibili.com/favicon.ico'
        },{
            "vod_id": 'setting_liveExtra',
            "vod_name": '查看直播细化标签',
            "vod_pic": 'https://www.bilibili.com/favicon.ico'
        }]
        url = 'https://passport.bilibili.com/x/passport-login/web/qrcode/generate'
        rsp = self._get_sth(url, 'fake')
        jo = json.loads(rsp.text)
        if jo['code'] == 0:
            id = jo['data']['qrcode_key']
            url = jo['data']['url']
            account = {'master': '主账号', 'vip': '副账号'}
            isLogin = {0: '未登录', 1: '已登录'}
            isVIP = {0: '', 1: '👑'}
            users = self.userConfig.get('users', {})
            for _type, typeName in account.items():
                user = users.get(_type)
                if user:
                    video.append({
                        "vod_id": 'setting_login_' + id,
                        "vod_name": user['uname'],
                        "vod_pic": self.format_img(user['face']),
                        "vod_remarks": isVIP[user['isVIP']] + typeName + ' ' + isLogin[user['isLogin']]
                    })
            #pic_url = {'qrcode': url}
            pic_url = {'qrcode': 'https://passport.bilibili.com/h5-app/passport/login/scan?qrcode_key=' + id + '&navhide=1'}
            #if not dirname.startswith('/data/'):
            #    pic_url['qr_chs'] = '208x117'
            pic_url['qr_chs'] = '208x117'
            video.append({
                "vod_id": 'setting_login_' + id,
                #"vod_name": '扫码后点击',
                'vod_pic': 'http://jm92swf.s1002.xrea.com/?' + urlencode(pic_url),
            })
        result['list'] = video
        result['page'] = 1
        result['pagecount'] = 1
        result['limit'] = 1
        result['total'] = 1
        return result

    time_diff1 = {'1': [0, 300],
                  '2': [300, 900], '3': [900, 1800], '4': [1800, 3600],
                  '5': [3600, 99999999999999999999999999999999]
                  }
    time_diff = '0'

    dynamic_offset = ''

    def get_dynamic(self, pg, mid, order):
        if mid == '0':
            result = {}
            if int(pg) == 1:
                self.dynamic_offset = ''
            url = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=video&offset=%s&page=%s' % (self.dynamic_offset, pg)
            rsp = self._get_sth(url)
            jo = json.loads(rsp.text)
            if jo['code'] == 0:
                self.dynamic_offset = jo['data'].get('offset')
                videos = []
                vodList = jo['data']['items']
                for vod in vodList:
                    if not vod['visible']:
                        continue
                    up = vod['modules']["module_author"]['name']
                    ivod = vod['modules']['module_dynamic']['major']['archive']
                    aid = str(ivod['aid']).strip()
                    title = ivod['title'].strip().replace("<em class=\"keyword\">", "").replace("</em>", "")
                    img = ivod['cover'].strip()
                    # remark = str(ivod['duration_text']).strip()
                    remark = str(self.second_to_time(self.str2sec(ivod['duration_text']))).strip() + '  🆙' + str(
                        up).strip()  # 显示分钟数+up主名字
                    videos.append({
                        "vod_id": 'av' + aid,
                        "vod_name": title,
                        "vod_pic": self.format_img(img),
                        "vod_remarks": remark
                    })
                result['list'] = videos
                result['page'] = pg
                result['pagecount'] = 9999
                result['limit'] = 99
                result['total'] = 999999
            return result
        else:
            return self.get_up_videos(mid=mid, pg=pg, order=order)

    def get_found_vod(self, vod):
        aid = vod.get('aid', '')
        if not aid:
            aid = vod.get('id', '')
        goto = vod.get('goto', '')
        if not goto or goto and goto == 'av':
            aid = 'av' + str(aid).strip()
        elif goto == 'ad':
            return []
        title = vod['title'].strip()
        img = vod['pic'].strip()
        is_followed = vod.get('is_followed')
        if goto == 'live':
            room_info = vod['room_info']
            remark = ''
            live_status = room_info.get('live_status', '')
            if live_status:
                remark = '直播中  '
            else:
                return []
            remark += '👁' + room_info['watched_show']['text_small'] + '  🆙' + vod['owner']['name'].strip()
        else:
            rcmd_reason = vod.get('rcmd_reason', '')
            if rcmd_reason and type(rcmd_reason) == dict and rcmd_reason.get('content'):
                reason= '  🔥' + rcmd_reason['content'].strip()
                if '人气飙升' in reason:
                    reason= '  🔥人气飙升'
            elif is_followed:
                reason = '  已关注'
            else:
                #reason = "  💬" + self.zh(vod['stat']['danmaku'])
                reason = '  🆙' + vod['owner']['name'].strip()
            remark = str(self.second_to_time(vod['duration'])).strip() + "  ▶" + self.zh(vod['stat']['view']) + reason
        video = [{
            "vod_id": aid,
            "vod_name": title,
            "vod_pic": self.format_img(img),
            "vod_remarks": remark
        }]
        for v in self.pool.map(self.get_found_vod, vod.get('others', [])):
            video.extend(v)
        return video

    _popSeriesInit = 0
    
    def get_found(self, tid, rid, pg):
        result = {}
        if tid == '推荐':
            query = self.encrypt_wbi(fresh_type=4, feed_version='V3', brush=1, fresh_idx=pg, fresh_idx_1h=pg, ps=self.userConfig['page_size'])
            url = f'https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd?{query}'
        else:
            url = 'https://api.bilibili.com/x/web-interface/ranking/v2?rid={0}&type={1}'.format(rid, tid)
            if tid == '热门':
                url = 'https://api.bilibili.com/x/web-interface/popular?pn={0}&ps={1}'.format(pg, self.userConfig['page_size'])
            elif tid == "入站必刷":
                url = 'https://api.bilibili.com/x/web-interface/popular/precious'
            elif tid == "每周必看":
                if not self._popSeriesInit or int(pg) == 1:
                    url = 'https://api.bilibili.com/x/web-interface/popular/series/list'
                    rsp = self._get_sth(url, 'fake')
                    jo = json.loads(rsp.text)
                    number = self._popSeriesInit = jo['data']['list'][0]['number']
                    self._popSeriesNum = [int(number), 1]
                else:
                    number = self._popSeriesNum[0]
                url = 'https://api.bilibili.com/x/web-interface/popular/series/one?number=' + str(number)
        rsp = self._get_sth(url)
        jo = json.loads(rsp.text)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data'].get('item')
            if not vodList:
                vodList = jo['data']['list']
            if len(vodList) > self.userConfig['page_size']:
                if tid == "每周必看":
                    _tmp_pg = int(self._popSeriesNum[1])
                    value = len(vodList) / self.userConfig['page_size'] - _tmp_pg
                    if value > 0:
                        value += 1
                    if not int(value):
                        self._popSeriesNum = [int(number) - 1, 1]
                    else:
                        self._popSeriesNum[1] = _tmp_pg + 1
                else:
                    _tmp_pg = pg
                vodList = self.pagination(vodList, _tmp_pg)
            for v in self.pool.map(self.get_found_vod, vodList):
                videos.extend(v)
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 99
            result['total'] = 999999
        return result

    def get_bangumi(self, tid, pg, order, season_status):
        result = {}
        if order == '追番剧':
            url = 'https://api.bilibili.com/x/space/bangumi/follow/list?type={0}&vmid={1}&pn={2}&ps={3}'.format(tid, self.userid, pg, self.userConfig['page_size'])
            rsp = self._get_sth(url)
        else:
            url = 'https://api.bilibili.com/pgc/season/index/result?type=1&season_type={0}&page={1}&order={2}&season_status={3}&pagesize={4}'.format(tid, pg, order, season_status, self.userConfig['page_size'])
            if order == '热门':
                if tid == '1':
                    url = 'https://api.bilibili.com/pgc/web/rank/list?season_type={0}&day=3'.format(tid)
                else:
                    url = 'https://api.bilibili.com/pgc/season/rank/web/list?season_type={0}&day=3'.format(tid)
            rsp = self._get_sth(url, 'fake')
        jo = json.loads(rsp.text)
        if jo['code'] == 0:
            if 'data' in jo:
                vodList = jo['data']['list']
            else:
                vodList = jo['result']['list']
            if len(vodList) > self.userConfig['page_size']:
                vodList = self.pagination(vodList, pg)
            videos = []
            for vod in vodList:
                aid = str(vod['season_id']).strip()
                title = vod['title']
                img = vod.get('ss_horizontal_cover')
                if not img or tid == '1' and not self.userConfig['bangumi_horizontal_cover']:
                    if vod.get('first_ep_info') and 'cover' in vod['first_ep_info']:
                        img = vod['first_ep_info']['cover']
                    elif vod.get('first_ep') and 'cover' in vod['first_ep']:
                        img = vod['first_ep']['cover']
                    else:
                        img = vod['cover'].strip()
                remark = vod.get('index_show', '')
                if not remark and vod.get('new_ep') and vod['new_ep'].get('index_show'):
                    remark = vod['new_ep']['index_show']
                remark = remark.replace('更新至', '🆕')
                stat = vod.get('stat')
                if stat:
                    remark = '▶' + self.zh(stat.get('view')) + '  ' + remark
                videos.append({
                    "vod_id": 'ss' + aid,
                    "vod_name": title,
                    "vod_pic": self.format_img(img),
                    "vod_remarks": remark
                })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 90
            result['total'] = 999999
        return result

    def get_timeline(self, tid, pg):
        result = {}
        url = 'https://api.bilibili.com/pgc/web/timeline/v2?season_type={0}&day_before=2&day_after=4'.format(tid)
        rsp = self._get_sth(url, 'fake')
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] == 0:
            videos1 = []
            vodList = jo['result']['latest']
            for vod in vodList:
                aid = str(vod['season_id']).strip()
                title = vod['title'].strip()
                img = vod['ep_cover'].strip()
                remark = '🆕' + vod['pub_index'] + '  ❤ ' + vod['follows'].replace('系列', '').replace('追番', '')
                videos1.append({
                    "vod_id": 'ss' + aid,
                    "vod_name": title,
                    "vod_pic": self.format_img(img),
                    "vod_remarks": remark
                })
            videos2 = []
            vodList2 = jo['result']['timeline']
            for i in range(len(vodList2)):
                vodList = vodList2[i]['episodes']
                for vod in vodList:
                    if str(vod['published']) == "0":
                        aid = str(vod['season_id']).strip()
                        title = str(vod['title']).strip()
                        img = str(vod['ep_cover']).strip()
                        date = str(time.strftime("%m-%d %H:%M", time.localtime(vod['pub_ts'])))
                        remark = date + "   " + vod['pub_index']
                        videos2.append({
                            "vod_id": 'ss' + aid,
                            "vod_name": title,
                            "vod_pic": self.format_img(img),
                            "vod_remarks": remark
                        })
            result['list'] = videos2 + videos1
            result['page'] = 1
            result['pagecount'] = 1
            result['limit'] = 90
            result['total'] = 999999
        return result

    def get_live(self, pg, parent_area_id, area_id):
        result = {}
        if parent_area_id == '推荐':
            url = 'https://api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web&page=%s' % pg
            rsp = self._get_sth(url)
        else:
            url = 'https://api.live.bilibili.com/xlive/web-interface/v1/second/getList?platform=web&parent_area_id=%s&area_id=%s&sort_type=online&page=%s' % (parent_area_id, area_id, pg)
            if parent_area_id == '热门':
                url = 'https://api.live.bilibili.com/room/v1/room/get_user_recommend?page=%s&page_size=%s' % (pg, self.userConfig['page_size'])
            rsp = self._get_sth(url, 'fake')
        jo = json.loads(rsp.text)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data']
            if 'recommend_room_list' in vodList:
                vodList = vodList['recommend_room_list']
            elif 'list' in vodList:
                vodList = vodList['list']
            for vod in vodList:
                aid = str(vod['roomid']).strip()
                title = vod['title'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;", '"')
                img = vod.get('user_cover')
                if not img:
                    img = vod.get('cover')
                remark = '👁' + vod['watched_show']['text_small'].strip() + "  🆙" + vod['uname'].strip()
                videos.append({
                    "vod_id": aid,
                    "vod_name": title,
                    "vod_pic": self.format_img(img),
                    "vod_remarks": remark
                })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 99
            result['total'] = 999999
        return result

    def get_up_series(self, mid, pg):
        result = {}
        url = 'https://api.bilibili.com/x/polymer/web-space/seasons_series_list?mid=%s&page_num=%s&page_size=%s' % (mid, pg, self.userConfig['page_size'])
        rsp = self._get_sth(url, 'fake')
        jo = json.loads(rsp.text)
        if jo['code'] == 0:
            videos = []
            jo = jo['data']['items_lists']
            vodList = jo['seasons_list'] + jo['series_list']
            for vod in vodList:
                vod = vod.get('meta')
                aid = str(vod.get('season_id', '')).strip()
                if aid:
                    aid = 'list_' + str(mid) + '_season_' + aid
                else:
                    aid = 'list_' + str(mid) + '_series_' + str(vod.get('series_id', '')).strip()
                title = vod['name'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;", '"')
                img = vod.get('cover')
                remark = vod.get('description', '').strip()
                videos.append({
                    "vod_id": aid,
                    "vod_name": title,
                    "vod_pic": self.format_img(img),
                    "vod_remarks": remark
                })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 99
            result['total'] = 999999
        return result

    get_up_videos_result = {}
    
    def get_up_videos(self, mid, pg, order):
        result = {}
        if not mid.isdigit():
            if int(pg) == 1:
                self.get_up_videos_mid = mid = self.detailContent_args.get('mid', '')
                if not mid in self.get_up_videos_result:
                    self.get_up_videos_result.clear()
                    self.get_up_videos_result[mid] = []
            else:
                mid = self.get_up_videos_mid
        if int(pg) == 1:
            self.get_up_videoNum_event.clear()
            self.get_up_info_event.clear()
            self.pool.submit(self.get_up_info, mid)
        Space = order2 = ''
        if order == 'oldest':
            order2 = order
            order = 'pubdate'
        elif order == 'quicksearch':
            Space = '投稿: '
            videos = self.get_up_videos_result.get(mid, [])
            if videos:
                result['list'] = videos
                return result
        elif order == 'series':
            return self.get_up_series(mid=mid, pg=pg)
        tmp_pg = pg
        if order2:
            self.get_up_videoNum_event.wait()
            tmp_pg = self.up_info[mid]['vod_pc'] - int(pg) + 1
        query = self.encrypt_wbi(mid=mid, pn=tmp_pg, ps=self.userConfig['page_size'], order=order)
        url = f'https://api.bilibili.com/x/space/wbi/arc/search?{query}'
        rsp = self._get_sth(url, 'fake')
        content = rsp.text
        jo = json.loads(content)
        videos = []
        if jo['code'] == 0:
            vodList = jo['data']['list']['vlist']
            for vod in vodList:
                aid = str(vod['aid']).strip()
                title = vod['title'].strip().replace("<em class=\"keyword\">", "").replace("</em>", "")
                img = vod['pic'].strip()
                remark = self.second_to_time(self.str2sec(str(vod['length']).strip())) + "  ▶" + self.zh(vod['play'])
                if not Space:
                    remark +=  "  💬" + self.zh(vod['video_review'])
                videos.append({
                    "vod_id": 'av' + aid,
                    "vod_name": Space + title,
                    "vod_pic": self.format_img(img),
                    "vod_remarks": remark
                })
            if order2:
                videos.reverse()
            if int(pg) == 1:
                self.get_up_info_event.wait()
                vodname = self.up_info[mid]['name'] + "  个人主页"
                if Space:
                    vodname = 'UP: ' + self.up_info[mid]['name']
                gotoUPHome={
                    "vod_id": 'up' + str(mid),
                    "vod_name": vodname,
                    "vod_pic": self.format_img(self.up_info[mid]['face']),
                    "vod_remarks": self.up_info[mid]['following'] + '  👥' + self.up_info[mid]['fans'] + '  🎬' + str(self.up_info[mid]['vod_count'])
                }
                videos.insert(0, gotoUPHome)
            if Space:
                self.get_up_videos_result[mid] = videos
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 99
            result['limit'] = 99
            result['total'] = 999999
        return result

    history_view_at = 0
    
    def get_history(self, type, pg):
        result = {}
        if int(pg) == 1:
            self.history_view_at = 0
        url = 'https://api.bilibili.com/x/web-interface/history/cursor?ps={0}&view_at={1}&type={2}'.format(self.userConfig['page_size'], self.history_view_at, type)
        if type == '稍后再看':
            url = 'https://api.bilibili.com/x/v2/history/toview'
        rsp = self._get_sth(url)
        jo = json.loads(rsp.text)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data'].get('list', [])
            if type == '稍后再看':
                vodList = self.pagination(vodList, pg)
            else:
                self.history_view_at = jo['data']['cursor']['view_at']
            for vod in vodList:
                history = vod.get('history', '')
                if history:
                    business = history['business']
                    aid = str(history['oid']).strip()
                    img = vod['cover'].strip()
                    part = str(history['part']).strip()
                else:
                    business = 'archive'
                    aid = str(vod["aid"]).strip()
                    img = vod['pic'].strip()
                    part = str(vod['page']['part']).strip()
                if business == 'article':
                    continue
                elif business == 'pgc':
                    aid = 'ep' + str(history['epid'])
                    _total = vod['total']
                    part = vod.get('show_title')
                elif business == 'archive':
                    aid = 'av' + aid
                    _total = vod['videos']
                title = vod['title'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;", '"')
                if business == 'live':
                    live_status = vod.get('badge', '')
                    remark = live_status + '  🆙' + vod['author_name'].strip()
                else:
                    if str(vod['progress']) == '-1':
                        remark = '已看完'
                    elif str(vod['progress']) == '0':
                        remark = '刚开始看'
                    else:
                        process = str(self.second_to_time(vod['progress'])).strip()
                        remark = '看到  ' + process
                    if not _total in [0, 1] and part:
                        remark += ' (' + str(part) + ')'
                videos.append({
                    "vod_id": aid,
                    "vod_name": title,
                    "vod_pic": self.format_img(img),
                    "vod_remarks": remark
                })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 90
            result['total'] = 999999
        return result

    def get_fav_detail(self, pg, mlid, order):
        result = {}
        url = 'https://api.bilibili.com/x/v3/fav/resource/list?media_id=%s&order=%s&pn=%s&ps=10&platform=web&type=0' % (mlid, order, pg)
        rsp = self._get_sth(url)
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data'].get('medias', [])
            for vod in vodList:
                # 只展示类型为 视频的条目
                # 过滤去掉收藏中的 已失效视频;如果不喜欢可以去掉这个 if条件
                if vod.get('type') in [2] and vod.get('title') != '已失效视频':
                    aid = str(vod['id']).strip()
                    title = vod['title'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;",
                                                                                                            '"')
                    img = vod['cover'].strip()
                    remark = str(self.second_to_time(vod['duration'])).strip() + "  ▶" + self.zh(vod['cnt_info']['play']) + "　💬" + self.zh(vod['cnt_info']['danmaku'])
                    videos.append({
                        "vod_id": 'av' + aid + '_mlid' + str(mlid),
                        "vod_name": title,
                        "vod_pic": self.format_img(img),
                        "vod_remarks": remark
                    })
            # videos=self.filter_duration(videos, duration_diff)
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 99
            result['total'] = 999999
        return result

    get_up_videoNum_event = threading.Event()
    
    def get_up_videoNum(self, mid):
        url = "https://api.bilibili.com/x/space/navnum?mid={0}".format(mid)
        rsp = self._get_sth(url)
        jRoot = json.loads(rsp.text)
        if jRoot['code'] == 0:
            return jRoot['data']['video']
        else:
            return 0

    get_up_info_event = threading.Event()
    up_info = {}
    
    def get_up_info(self, mid, **kwargs):
        if mid in self.up_info:
            self.get_up_info_event.set()
        get_up_videoNum = self.pool.submit(self.get_up_videoNum, mid)
        data = kwargs.get('data')
        if not data:
            url = "https://api.bilibili.com/x/web-interface/card?mid={0}".format(mid)
            rsp = self._get_sth(url)
            jRoot = json.loads(rsp.text)
            if jRoot['code'] == 0:
                data = jRoot['data']
            else:
                self.get_up_info_event.set()
                return
        jo = data['card']
        info = {}
        info['following'] = '未关注'
        if data['following']:
            info['following'] = '已关注'
        info['name'] = info['crname'] = jo['name'].replace("<em class=\"keyword\">", "").replace("</em>", "")
        if self.isFongmi:
            info['crname'] = '[a=cr:{"id": "' + mid + '_pubdate_getupvideos","name": "' + info['name'].replace('"', '\\"') + '"}/]' + info['name'] + '[/a]'
        info['face'] = jo['face']
        info['fans'] = self.zh(jo['fans'])
        info['like_num'] = self.zh(data['like_num'])
        info['desc'] = jo['Official']['desc'] + "　" + jo['Official']['title']
        info['vod_count'] = str(data['archive_count']).strip()
        self.up_info[mid] = info
        self.get_up_info_event.set()
        self.up_info[mid]['vod_count'] = str(get_up_videoNum.result()).strip()
        pc = divmod(int(info['vod_count']), self.userConfig['page_size'])
        vod_pc = pc[0]
        if pc[1] != 0:
            vod_pc += 1
        self.up_info[mid]['vod_pc'] = vod_pc
        self.get_up_videoNum_event.set()
    
    def get_vod_relation(self, id):
        if id.isdigit():
            urlarg = 'aid=' + str(id)
        elif '=' in id:
            urlarg = id
        else:
            urlarg = 'bvid=' + id
        url = 'https://api.bilibili.com/x/web-interface/archive/relation?' + urlarg
        rsp = self._get_sth(url)
        jo = json.loads(rsp.text)
        relation = []
        if jo['code'] == 0:
            jo = jo['data']
            if jo['attention']:
                relation.append('已关注')
            else:
                relation.append('未关注')
            triple = []
            if jo['favorite']:
                triple.append('⭐')
            if jo['like']:
                triple.append('👍')
            coin = jo.get('coin')
            if coin:
                triple.append('💰'*coin)
            if len(triple) == 3:
                relation.append('👍💰⭐')
            else:
                relation.extend(triple)
            if jo['dislike']:
                relation.append('👎')
            if jo['season_fav']:
                relation.append('已订阅合集')
        return relation

    def get_channel(self, pg, cid, order):
        result = {}
        if str(pg) == '1':
            self.channel_offset = ''
        if order == "featured":
            url = 'https://api.bilibili.com/x/web-interface/web/channel/featured/list?channel_id={0}&filter_type=0&offset={1}&page_size={2}'.format(cid, self.channel_offset, self.userConfig['page_size'])
        else:
            url = 'https://api.bilibili.com/x/web-interface/web/channel/multiple/list?channel_id={0}&sort_type={1}&offset={2}&page_size={3}'.format(cid, order, self.channel_offset, self.userConfig['page_size'])
        rsp = self._get_sth(url, 'master')
        jo = json.loads(rsp.text)
        if jo.get('code') == 0:
            self.channel_offset = jo['data'].get('offset')
            videos = []
            vodList = jo['data']['list']
            if pg == '1' and 'items' in vodList[0]:
                vodList_rank = vodList[0]['items']
                del (vodList[0])
                vodList = vodList_rank + vodList
            for vod in vodList:
                if 'uri' in vod and 'bangumi' in vod['uri']:
                    aid = self.find_bangumi_id(vod['uri'])
                else:
                    aid = 'av' + str(vod['id']).strip()
                title = vod['name'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;", '"')
                img = vod['cover'].strip()
                remark = "▶" + str(vod['view_count'])
                duration = vod.get('duration', '')
                if duration:
                    remark = str(self.second_to_time(self.str2sec(duration))).strip() + '  ' + remark
                danmaku = vod.get('danmaku', '')
                like_count = vod.get('like_count', '')
                follow_count = vod.get('follow_count', '')
                if danmaku:
                    remark += "  💬" + self.zh(danmaku)
                elif like_count:
                    remark += "  👍" + str(like_count)
                elif follow_count:
                    remark += "  ❤" + str(follow_count)
                videos.append({
                    "vod_id": aid,
                    "vod_name": title,
                    "vod_pic": self.format_img(img),
                    "vod_remarks": remark
                })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 99
            result['total'] = 999999
        return result

    def get_follow(self, pg, sort):
        result = {}
        if sort == "最常访问":
            url = 'https://api.bilibili.com/x/relation/followings?vmid={0}&pn={1}&ps=10&order=desc&order_type=attention' .format(self.userid, pg)
        elif sort == "最近关注":
            url = 'https://api.bilibili.com/x/relation/followings?vmid={0}&pn={1}&ps=10&order=desc&order_type='.format(self.userid, pg)
        elif sort == "正在直播":
            url = 'https://api.live.bilibili.com/xlive/web-ucenter/v1/xfetter/GetWebList?page={0}&page_size=10'.format(pg)
        elif sort == "最近访问":
            url = 'https://api.bilibili.com/x/v2/history?pn={0}&ps=15'.format(pg)
        elif sort == "特别关注":
            url = 'https://api.bilibili.com/x/relation/tag?mid={0}&tagid=-10&pn={1}&ps=10'.format(self.userid, pg)
        elif sort == "悄悄关注":
            url = 'https://api.bilibili.com/x/relation/whispers?pn={0}&ps=10'.format(pg)
        else:
            url = 'https://api.bilibili.com/x/relation/followers?vmid={0}&pn={1}&ps=10&order=desc&order_type=attention'.format(self.userid, pg)
        rsp = self._get_sth(url)
        jo = json.loads(rsp.text)
        if jo['code'] != 0:
            return result
        if sort == "特别关注" or sort == "最近访问":
            vodList = jo['data']
        elif sort == "正在直播":
            vodList = jo['data']['rooms']
        else:
            vodList = jo['data']['list']
        if int(pg) == 1:
            self.recently_up_list = []
        follow = []
        for f in vodList:
            remark = ''
            if sort == "最近访问":
                mid = 'up' + str(f['owner']['mid'])
                if mid in self.recently_up_list:
                    continue
                self.recently_up_list.append(mid)
                title = str(f['owner']['name']).strip()
                img = str(f['owner']['face']).strip()
            elif sort == "正在直播":
                mid = str(f['room_id'])
                title = f['title'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;", '"')
                img = f['cover_from_user'].strip()
                remark = f['uname'].strip()
            else:
                mid = 'up' + str(f['mid'])
                title = str(f['uname']).strip()
                img = str(f['face']).strip()
            if 'special' in f and f['special'] == 1:
                remark = '特别关注'
            follow.append({
                "vod_id": mid,
                "vod_name": title,
                "vod_pic": self.format_img(img),
                "vod_remarks": remark
            })
        result['list'] = follow
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 99
        result['total'] = 999999
        return result

    homeVideoContent_result = {}
    def homeVideoContent(self):
        if not self.homeVideoContent_result:
            videos = self.get_found(rid='0', tid='all', pg=1)['list'][0:int(self.userConfig['maxHomeVideoContent'])]
            self.homeVideoContent_result['list'] = videos
        return self.homeVideoContent_result

    def categoryContent(self, tid, pg, filter, extend):
        self.stop_heartbeat_event.set()
        if tid == "推荐":
            if 'tid' in extend:
                tid = extend['tid']
            if tid.isdigit():
                tid = int(tid)
                if tid > 10000:
                    tid -= 10000
                    return self.get_timeline(tid=tid, pg=pg)
                rid = tid
                tid = 'all'
                return self.get_found(tid=tid, rid=rid, pg=pg)
            rid = '0'
            return self.get_found(tid=tid, rid=rid, pg=pg)
        elif tid == "影视":
            tid = '1'
            order = '热门'
            season_status = '-1'
            if 'tid' in extend:
                tid = extend['tid']
            if 'order' in extend:
                order = extend['order']
            if 'season_status' in extend:
                if order == '热门':
                    order = '2'
                season_status = extend['season_status']
            return self.get_bangumi(tid, pg, order, season_status)
        elif tid == "动态":
            mid = '0'
            order = 'pubdate'
            if 'mid' in extend:
                mid = extend['mid']
            if 'order' in extend:
                order = extend['order']
            if mid == '0' and not self.userid or mid == '登录':
                return self.get_Login_qrcode(pg)
            return self.get_dynamic(pg=pg, mid=mid, order=order)
        elif tid == '频道':
            order = 'hot'
            cid = random.choice(self.userConfig['channel_list'])
            cid = cid['v']
            if 'order' in extend:
                order = extend['order']
            if 'cid' in extend:
                cid = extend['cid']
            return self.get_channel(pg=pg, cid=cid, order=order)
        elif tid == '直播':
            tid = "热门"
            area_id = '0'
            if 'tid' in extend:
                tid = extend['tid']
            if '_' in tid:
                tids = tid.split('_')
                tid = tids[0]
                area_id = tids[1]
            return self.get_live(pg=pg, parent_area_id=tid, area_id=area_id)
        elif tid == "UP":
            mid = self.detailContent_args.get('mid', '')
            if 'mid' in extend:
                mid = extend['mid']
            if not mid or mid == '登录':
                return self.get_Login_qrcode(pg)
            up_config = self.config["filter"].get('UP')
            if not mid and up_config:
                for i in up_config:
                    if i['key'] == 'mid':
                        if len(i['value']) > 1:
                            mid = i['value'][1]['v']
                        break
            order = 'pubdate'
            if 'order' in extend:
                order = extend['order']
            return self.get_up_videos(mid=mid, pg=pg, order=order)
        elif tid == "关注":
            sort = "最常访问"
            if 'sort' in extend:
                sort = extend['sort']
            return self.get_follow(pg, sort)
        elif tid == "收藏":
            mlid = str(self.userConfig['favMode'])
            if 'mlid' in extend:
                mlid = extend['mlid']
            fav_config = self.config["filter"].get('收藏')
            if mlid in ['1', '2']:
                return self.get_bangumi(tid=mlid, pg=pg, order='追番剧', season_status='')
            elif mlid == '0' and fav_config:
                for i in fav_config:
                    if i['key'] == 'mlid':
                        if len(i['value']) > 1:
                            mlid = i['value'][2]['v']
                        break
            order = 'mtime'
            if 'order' in extend:
                order = extend['order']
            return self.get_fav_detail(pg=pg, mlid=mlid, order=order)
        elif tid == '历史':
            type = 'all'
            if 'type' in extend:
                type = extend['type']
            if type == 'UP主':
                return self.get_follow(pg=pg, sort='最近访问')
            return self.get_history(type=type, pg=pg)
        elif tid.endswith('_getbangumiseasons'):
            if int(pg) == 1:
                return {'list': self.detailContent_args.get('seasons', [])}
        elif tid.endswith('_getupvideos'):
            mid, order, clicklink = tid.split('_')
            return self.get_up_videos(pg=pg, mid=mid, order=order)
        elif tid.endswith('_clicklink'):
            keyword = tid.replace('_clicklink', '')
            duration_diff = '0'
            if 'duration' in extend:
                duration_diff = extend['duration']
            return self.get_search_content(key=keyword, pg=pg, duration_diff=duration_diff, order='', type='video', ps=self.userConfig['page_size'])
        else:
            duration_diff = '0'
            if 'duration' in extend:
                duration_diff = extend['duration']
            type = 'video'
            if 'type' in extend:
                type = extend['type']
            order = 'totalrank'
            if 'order' in extend:
                order = extend['order']
            keyword = str(self.search_key)
            search_config = self.config["filter"].get('搜索')
            if not keyword and search_config:
                for i in search_config:
                    if i['key'] == 'keyword':
                        if len(i['value']) > 0:
                            keyword = i['value'][0]['v']
                        break
            if 'keyword' in extend:
                keyword = extend['keyword']
            return self.get_search_content(key=keyword, pg=pg, duration_diff=duration_diff, order=order, type=type, ps=self.userConfig['page_size'])

    def get_search_content(self, key, pg, duration_diff, order, type, ps):
        value = None
        if not pg.isdigit():
            value = pg
            pg = 1
        query = self.encrypt_wbi(keyword=key, page=pg, duration=duration_diff, order=order, search_type=type, page_size=ps)
        url = f'https://api.bilibili.com/x/web-interface/wbi/search/type?{query}'
        rsp = self._get_sth(url, 'fake')
        content = rsp.text
        jo = json.loads(content)
        result = {}
        if jo.get('code') == 0 and 'result' in jo['data']:
            videos = []
            vodList = jo['data'].get('result')
            if vodList and type == 'live':
                vodList = vodList.get('live_room')
            if not vodList:
                return result
            for vod in vodList:
                if type != vod['type']:
                    continue
                title = ''
                if type == 'bili_user':
                    aid = 'up' + str(vod['mid']).strip()
                    img = vod['upic'].strip()
                    remark = '👥' + self.zh(vod['fans']) + "  🎬" + self.zh(vod['videos'])
                    title = vod['uname']
                elif type == 'live':
                    aid = str(vod['roomid']).strip()
                    img = vod['cover'].strip()
                    remark = '👁' + self.zh(vod['online'])  + '  🆙' + vod['uname']
                elif 'media' in type:
                    aid = str(vod['season_id']).strip()
                    if self.detailContent_args:
                        seasons = self.detailContent_args.get('seasons')
                        if seasons:
                            bangumi_seasons_id = []
                            for ss in self.detailContent_args['seasons']:
                                bangumi_seasons_id.append(ss['vod_id'])
                            if aid + 'ss' in bangumi_seasons_id:
                                continue
                    aid = 'ss' + aid
                    img = vod['cover'].strip()
                    remark = str(vod['index_show']).strip().replace('更新至', '🆕')
                else:
                    aid = 'av' + str(vod['aid']).strip()
                    img = vod['pic'].strip()
                    remark = str(self.second_to_time(self.str2sec(vod['duration']))).strip() + "  ▶" + self.zh(vod['play'])
                    if value == None:
                        remark += "  💬" + self.zh(vod['danmaku'])
                if not title:
                    title = vod['title'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;",'"').replace('&amp;', '&')
                if value:
                    title = value + title
                videos.append({
                    "vod_id": aid,
                    "vod_name": title,
                    "vod_pic": self.format_img(img),
                    "vod_remarks": remark
                })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 99
            result['total'] = 999999
        return result

    def cleanSpace(self, str):
        return str.replace('\n', '').replace('\t', '').replace('\r', '').replace(' ', '')

    def get_normal_episodes(self, episode):
        ssid = epid = ''
        aid = episode.get('aid', '')
        if not aid:
            aid = self.detailContent_args['aid']
        cid = episode.get('cid', '')
        ep_title = episode.get('title', '')
        if not ep_title:
            ep_title = episode.get('part', '')
        duration = episode.get('duration', '')
        if not duration:
            page = episode.get('page', '')
            if page:
                duration = page['duration']
        badge = long_title = preview = parse = ''
        ssid = self.detailContent_args.get('ssid', '')
        if ssid:
            ssid = '_ss' + ssid
            epid = episode.get('id', '')
            if epid:
                epid = '_ep' + str(epid)
            if duration and str(duration).endswith('000'):
                duration = int(duration / 1000)
            if ep_title.isdigit():
                ep_title = '第' + ep_title + self.detailContent_args['title_type']
            badge = episode.get('badge', '')
            if not self.session_vip.cookies and badge == '会员' and self.userConfig['bangumi_vip_parse'] or badge == '付费' and self.userConfig['bangumi_pay_parse']:
                parse = '_parse'
            if self.session_vip.cookies and self.userConfig['hide_bangumi_vip_badge']:
                badge = badge.replace('会员', '')
            if self.userConfig['hide_bangumi_preview'] and badge == '预告':
                badge = badge.replace('预告', '')
                preview = 1
            if badge:
                badge = '【' + badge + '】'
            long_title = episode.get('long_title', '')
            if not badge and long_title:
                long_title = ' ' + long_title
        title = ep_title + badge + long_title
        title = title.replace("#", "﹟").replace("$", "﹩")
        if duration:
            duration = '_dur' + str(duration)
        url = '{0}${1}_{2}{3}{4}{5}'.format(title, aid, cid, ssid, epid, duration)
        fromep = self.detailContent_args.get('fromep', '')
        if '_' + str(fromep) == epid:
            self.detailContent_args['fromep'] = url
        replyList = self.detailContent_args.get('Reply')
        if '_' + str(fromep) == epid or not fromep and replyList == None:
            self.detailContent_args['Reply'] = ''
            if self.userConfig['show_vod_hot_reply']:
                self.get_vod_hot_reply_event.clear()
                self.pool.submit(self.get_vod_hot_reply, aid)
        if ssid:
            if preview:
                return url, ''
            if parse:
                self.detailContent_args['parse'] = 1
                if long_title:
                    long_title = '【解析】' + long_title
                ep_title += long_title
                parseurl = '{0}${1}_{2}{3}{4}{5}{6}'.format(ep_title, aid, cid, ssid, epid, duration, parse)
                if '_' + str(fromep) == epid:
                    self.detailContent_args['fromep'] += '#' + parseurl
            else:
                parseurl = url
            return url, parseurl
        else:
            return url

    def get_ugc_season(self, section, sections_len):
        if sections_len > 1:
            sec_title = self.detailContent_args['season_title'] + ' ' + section['title']
        else:
            sec_title = self.detailContent_args['season_title']
        sec_title = sec_title.replace("#", "﹟").replace("$", "﹩")
        episodes = section.get('episodes')
        playUrl = '#'.join(map(self.get_normal_episodes, episodes))
        result = (sec_title, playUrl)
        return result

    get_vod_hot_reply_event = threading.Event()

    def get_vod_hot_reply(self, oid):
        query = self.encrypt_wbi(type=1, ps=30, oid=str(oid))
        url = f'http://api.bilibili.com/x/v2/reply/main?{query}'
        rsp = self._get_sth(url, 'fake')
        jRoot = json.loads(rsp.text)
        if jRoot['code'] == 0:
            replies = jRoot['data'].get('replies')
            top_replies = jRoot['data'].get('top_replies')
            if replies and top_replies:
                replies = top_replies + replies
            if replies:
                up_mid = jRoot['data']['upper']['mid']
                ReplyList = []
                Reply_jump = []
                for r in replies:
                    rpid = r['rpid']
                    sex = r['member']['sex']
                    if sex and sex == '女':
                        sex = '👧'
                    else:
                        sex = '👦'
                    name = sex + r['member']['uname'] + '：'
                    mid = r['mid']
                    if mid == up_mid:
                        name = '🆙' + name
                    like = '👍' + self.zh(r['like'])
                    message = r['content']['message']
                    if '/note-app/' in message:
                        continue
                    content = like + ' ' + name + message
                    content = content.replace("#", "﹟").replace("$", "﹩")
                    content += '$' + str(oid) + '_' + str(rpid) + '_notplay_reply'
                    ReplyList.append(content)
                    jump_url = r['content'].get('jump_url',{})
                    for key, value in jump_url.items():
                        if not value.get('app_url_schema') and not value.get('pc_url'):
                            if key.startswith('https://www.bilibili.com/'):
                                key = str(key).split('?')[0].split('/')
                                while key[-1] == '':
                                    key.pop(-1)
                                key = key[-1]
                            if key.startswith('https://b23.tv/') or key.startswith('BV') or key.startswith('ep') or key.startswith('ss'):
                                title = str(value['title']).replace("#", "﹟").replace("$", "﹩")
                                vod = {'vod_id': str(key), 'vod_name': '评论：' + title}
                                if not vod in Reply_jump:
                                    Reply_jump.append(vod)
                                title = '快搜：' + str(key) +' ' + title
                                content = title + '$ '
                                ReplyList.append(content)
                self.detailContent_args['Reply'] = '#'.join(ReplyList)
                self.detailContent_args['Reply_jump'] = Reply_jump
        self.get_vod_hot_reply_event.set()

    detailContent_args = {}
    
    def detailContent(self, array):
        self.stop_heartbeat_event.set()
        aid = array[0]
        if aid.startswith('edgeid'):
            return self.interaction_detailContent(aid)
        elif aid.startswith('list'):
            return self.series_detailContent(aid)
        self.detailContent_args = {}
        if aid.startswith('https://b23.tv/'):
            try:
                r = requests_get(url=aid, headers=self.header, allow_redirects=False)
                url = r.headers['Location'].split('?')[0].split('/')
                while url[-1] == '':
                    url.pop(-1)
                aid = url[-1]
                if not aid.startswith('BV', 0, 2):
                    return {}
            except:
                return {}
        id = mlid = urlargs = ''
        self.get_vod_hot_reply_event.set()
        if aid.startswith('setting'):
            aid = aid.split('_')
            if aid[1] == 'tab&filter':
                return self.setting_tab_filter_detailContent()
            elif aid[1] == 'liveExtra':
                return self.setting_liveExtra_detailContent()
            elif aid[1] == 'login':
                key = aid[2]
                return self.setting_login_detailContent(key)
        elif aid.startswith('av') or aid.startswith('BV'):
            for i in aid.split('_'):
                if i.startswith('av'):
                    id = i.replace('av', '', 1)
                    urlargs = 'aid=' + str(id)
                elif i.startswith('BV'):
                    id = i
                    urlargs = 'bvid=' + id
                elif i.startswith('mlid'):
                    mlid = i.replace('mlid', '', 1)
            #获取热门评论
            if self.userConfig['show_vod_hot_reply']:
                self.detailContent_args['Reply'] = ''
                self.get_vod_hot_reply_event.clear()
                self.pool.submit(self.get_vod_hot_reply, id)
        elif 'up' in aid:
            return self.up_detailContent(array)
        elif 'ss' in aid or 'ep' in aid:
            return self.ysContent(array)
        elif aid.isdigit():
            return self.live_detailContent(array)
        relation = self.pool.submit(self.get_vod_relation, urlargs)
        url = 'https://api.bilibili.com/x/web-interface/view/detail?' + urlargs
        rsp = self._get_sth(url, 'fake')
        jRoot = json.loads(rsp.text)
        if jRoot['code'] != 0:
            return {}
        jo = jRoot['data']['View']
        redirect_url = jo.get('redirect_url', '')
        if 'bangumi' in redirect_url:
            ep_id = self.find_bangumi_id(redirect_url)
            new_array = []
            for i in array:
                new_array.append(i)
            new_array[0] = ep_id
            return self.ysContent(new_array)
        self.detailContent_args['mid'] = up_mid = str(jo['owner']['mid'])
        self.detailContent_args['aid'] = aid = jo.get('aid')
        self.pool.submit(self.get_up_info, mid=up_mid, data=jRoot['data'].get('Card'))
        #相关合集
        ugc_season = jo.get('ugc_season')
        if ugc_season:
            self.detailContent_args['season_title'] = ugc_season['title']
            sections = ugc_season['sections']
            sections_len = len(sections)
            ugc_season_task = []
            for section in sections:
                t = self.pool.submit(self.get_ugc_season, section, sections_len)
                ugc_season_task.append(t)
        #相关推荐
        jo_Related = jRoot['data'].get('Related')
        #正片
        pages = jo['pages']
        title = jo['title'].replace("<em class=\"keyword\">", "").replace("</em>", "")
        pic = jo['pic']
        desc = jo['desc'].strip()
        typeName = jo['tname']
        date = time.strftime("%Y%m%d", time.localtime(jo['pubdate']))  # 投稿时间本地年月日表示
        stat = jo['stat']
        # 演员项展示视频状态，包括以下内容：
        remark = []
        remark.append('▶' + self.zh(stat['view']))
        remark.append('💬' + self.zh(stat['danmaku']))
        remark.append('👍' + self.zh(stat['like']))
        remark.append('💰' + self.zh(stat['coin']))
        remark.append('⭐' + self.zh(stat['favorite']))
        _is_stein_gate = jo['rights'].get('is_stein_gate', 0)
        vod = {
            "vod_id": 'av' + str(aid),
            "vod_name": title, 
            "vod_pic": pic,
            "type_name": typeName,
            "vod_year": date,
            "vod_content": desc
        }
        if self.isFongmi:
            vod['vod_remarks'] = "　".join(remark)
            vod_tags = ', '.join(sorted(map(lambda x: '[a=cr:{"id": "' + x['tag_name'].replace('"', '\\"') + '_clicklink","name":"' + x['tag_name'].replace('"', '\\"') + '"}/]' + x['tag_name'] + '[/a]', jRoot['data'].get('Tags', [])), key=len))
            vod['vod_content'] = vod_tags + ' \n' + desc
            self.userConfig['show_vod_hot_reply'] = False
        else:
            vod['vod_actor'] = "　".join(remark)
            vod['vod_area'] = "bilidanmu"
        secondP = []
        if self.userid:
            #做点什么
            follow = '➕关注$1_notplay_follow'
            unfollow = '➖取关$2_notplay_follow'
            like = '👍点赞$1_notplay_like'
            unlike = '👍🏻取消点赞$2_notplay_like'
            coin1 = '👍💰投币$1_notplay_coin'
            coin2 = '👍💰💰$2_notplay_coin'
            triple = '👍💰⭐三连$notplay_triple'
            secondPList = [follow, triple, like, coin1, coin2, unfollow, unlike]
            if mlid:
                favdel = f"☆取消收藏${mlid}_del_notplay_fav"
                secondPList.append(favdel)
            for fav in self.userConfig.get("fav_list", []):
                folder = fav['n'].replace("#", "﹟").replace("$", "﹩")
                ids = fav['v']
                fav = '⭐{}${}_add_notplay_fav'.format(folder, ids)
                secondPList.append(fav)
            defaultQn = int(self.userConfig['vodDefaultQn'])
            if defaultQn > 116:
                secondPList.append('⚠️限高1080$116_notplay_vodTMPQn')
            secondP = ['#'.join(secondPList)]
        AllPt = []
        AllPu = []
        if pages:
            AllPt = ['B站']
            if _is_stein_gate:
                AllPt = ['互动视频【快搜继续】']
            AllPu = ['#'.join(self.pool.map(self.get_normal_episodes, pages))]
        if secondP:
            AllPt.append('做点什么')
            AllPu.extend(secondP)
        if jo_Related:
            AllPt.append('相关推荐')
            AllPu.append('#'.join(self.pool.map(self.get_normal_episodes, jo_Related)))
        if self.userConfig['show_vod_hot_reply']:
            self.get_vod_hot_reply_event.wait()
            replyList = self.detailContent_args.get('Reply', '')
            if replyList:
                AllPt.append('热门评论')
                AllPu.extend([replyList])
        if ugc_season:
            for t in as_completed(ugc_season_task):
                AllPt.append(t.result()[0])
                AllPu.append(t.result()[1])
        vod['vod_play_from'] = "$$$".join(AllPt)
        vod['vod_play_url'] = "$$$".join(AllPu)
        #视频关系
        vod['vod_director'] = '🆙 ' + self.up_info[up_mid]['crname'] + '　👥 ' + self.up_info[up_mid]['fans'] + '　' + '　'.join(relation.result())
        #互动视频套用
        if _is_stein_gate:
            self.detailContent_args['AllPt'] = AllPt.copy()
            self.detailContent_args['AllPu'] = AllPu.copy()
            self.detailContent_args['vod_list'] = vod.copy()
        result = {
            'list': [
                vod
            ]
        }
        return result

    def series_detailContent(self, array):
        mid, type, sid = array.replace('list_', '').split('_')
        pg = 1
        ps = 99
        vod = {"vod_id": array, "vod_area": "bilidanmu", "vod_play_from": "B站"}
        urlL = []
        while True:
            if type == 'season':
                url = 'https://api.bilibili.com/x/polymer/web-space/seasons_archives_list?mid=%s&season_id=%s&page_num=%s&page_size=%s' % (mid, sid, pg, ps)
            else:
                url = 'https://api.bilibili.com/x/series/archives?mid=%s&series_id=%s&pn=%s&ps=%s' % (mid, sid, pg, ps)
            rsp = self._get_sth(url, 'fake')
            jo = json.loads(rsp.text)
            data = jo.get('data')
            if not vod.get("vod_name"):
                if data.get('meta'):
                    vod["vod_name"] = data['meta']['name']
                    vod["vod_pic"] = data['meta']['cover']
                    vod["vod_content"] = data['meta']['description']
                else:
                    vod["vod_name"] = data['archives'][0]['title']
            playUrl = '#'.join(map(self.get_normal_episodes, data.get('archives')))
            urlL.append(playUrl)
            total = data['page']['total']
            if (ps * pg) >= total:
                break
            pg += 1
        vod['vod_play_url'] = '#'.join(urlL)
        result = {
            'list': [
                vod
            ]
        }
        return result

    def interaction_detailContent(self, array=''):
        array = array.split('_')
        cid = edgeid = 0
        for i in array:
            if i.startswith('edgeid'):
                edgeid = i.replace('edgeid', '')
            elif i.startswith('cid'):
                cid = i.replace('cid', '')
        aid = self.detailContent_args.get('aid')
        graph_version = self.detailContent_args.get('graph_version')
        url = 'https://api.bilibili.com/x/stein/edgeinfo_v2?aid={0}&graph_version={1}&edge_id={2}'.format(aid, graph_version, edgeid)
        rsp = self._get_sth(url, 'fake')
        jo = json.loads(rsp.text)
        data = jo.get('data')
        result = {}
        if data:
            questions = data['edges'].get('questions', [])
            choice_lis = []
            for question in questions:
                q_title = str(question.get('title', ''))
                if q_title:
                    q_title += ' '
                for choice in question.get('choices', []):
                    c_edgeid = str(choice['id'])
                    c_cid = str(choice['cid'])
                    option = str(choice.get('option', ''))
                    choice_lis.append({
                    "vod_id": 'edgeid' + c_edgeid + '_' + 'cid' + c_cid,
                    "vod_name": '互动：' + q_title + option,
                    })
            self.detailContent_args['interaction'] = choice_lis.copy()
            if edgeid:
                AllPt = self.detailContent_args['AllPt'].copy()
                if not choice_lis:
                    AllPt[0] = '互动视频'
                AllPu = self.detailContent_args['AllPu'].copy()
                title = str(data['title']).replace("#", "﹟").replace("$", "﹩")
                url = '{0}${1}_{2}'.format(title, aid, cid)
                AllPu[0] = url
                vod = self.detailContent_args['vod_list'].copy()
                vod['vod_play_from'] = "$$$".join(AllPt)
                vod['vod_play_url'] = "$$$".join(AllPu)
                result['list'] = [vod]
        return result

    def up_detailContent(self, array):
        self.detailContent_args['mid'] = mid = array[0].replace('up', '')
        self.get_up_info_event.clear()
        self.pool.submit(self.get_up_info, mid)
        first = '是否关注$ '
        follow = '关注$1_notplay_follow'
        unfollow = '取消关注$2_notplay_follow'
        qqfollow = '悄悄关注$3_notplay_follow'
        spfollow = '特别关注$-10_notplay_special_follow'
        unspfollow = '取消特别关注$0_notplay_special_follow'
        doWhat = [first, follow, qqfollow, spfollow, unfollow, unspfollow]
        doWhat = '#'.join(doWhat)
        self.get_up_info_event.wait()
        up_info = self.up_info[mid]
        vod = {
            "vod_id": 'up' + str(mid),
            "vod_name": up_info['name'] + "  个人主页",
            "vod_pic": up_info['face'],
            "vod_director": '🆙 ' + up_info['name'] + "　" + up_info['following'] + '　UID：' + str(mid),
            "vod_content": up_info['desc'],
            'vod_play_from': '关注TA$$$视频投稿在动态标签——筛选——上个UP，选择后查看',
            'vod_play_url': doWhat
        }
        remark = "👥 " + up_info['fans'] + "　🎬 " + up_info['vod_count'] + "　👍 " + up_info['like_num']
        if self.isFongmi:
            vod["vod_remarks"] = remark
            tabfilter = self.config['filter'].get('动态')
            if not tabfilter:
                tabfilter = self.config['filter'].get('UP', [])
            vod["vod_actor"] = ' '.join(map(lambda x: '[a=cr:{"id": "' + str(mid) + '_' + x['v'] +'_getupvideos","name": "' + up_info['name'].replace('"', '\\"') + '  ' + x['n'] + '"}/]' + x['n'] + '[/a]', tabfilter[-1]['value']))
        else:
            vod["vod_actor"] = remark
        result = {
            'list': [
                vod
            ]
        }
        return result

    def setting_login_detailContent(self, key):
        cookie_dic_tmp = self.cookie_dic_tmp.get(key, '')
        message = ''
        if not cookie_dic_tmp:
            message = self.get_cookies(key)
        if message:
            message = f"【{message}】通过手机客户端扫码确认登录后点击相应按钮设置账号"
        else:
            message = '【已扫码并确认登录】请点击相应按钮设置当前获取的账号为：'
        vod = {
            "vod_name": "登录与设置",
            "vod_content": '通过手机客户端扫码并确认登录后，点击相应按钮设置cookie，设置后不需要管嗅探结果，直接返回二维码页面刷新，查看是否显示已登录，已登录即可重新打开APP以加载全部标签',
        }
        vod_play_from = ['登录$$$退出登录']
        vod_play_url = []
        first = message + '$ '
        login = '设置为主账号，动态收藏关注等内容源于此$' + str(key) + '_master_login_setting'
        login_vip = '设置为备用的VIP账号，仅用于播放会员番剧$' + str(key) + '_vip_login_setting'
        vod_play_url.append('#'.join([first, login, login_vip]))
        second = '点击相应按钮退出账号>>>$ '
        logout = '退出主账号$master_logout_setting'
        logout_vip = '退出备用的VIP账号$vip_logout_setting'
        vod_play_url.append('#'.join([second, logout, logout_vip]))
        cate_lis = [{
            'f': '主页站点推荐栏',
            'c': 'maxHomeVideoContent',
            'd': {
                '3': '3图',
                '4': '4图',
                '6': '6图',
                '8': '8图',
                '10': '10图',
            }
        },{
            'f': '视频画质',
            'c': 'vodDefaultQn',
            'd': self.vod_qn_id
        },{
            'f': '视频编码',
            'c': 'vodDefaultCodec',
            'd': self.vod_codec_id
        },{
            'f': '音频码率',
            'c': 'vodDefaultAudio',
            'd': self.vod_audio_id
        },{
            'f': '收藏默认显示',
            'c': 'favMode',
            'd': {
                '0': '默认收藏夹',
                '1': '追番',
                '2': '追剧',
            }
        },{
            
            'f': '上传播放进度',
            'c': 'heartbeatInterval',
            'd': {
                '0': '关',
                '15': '开',
            }
        },{
            
            'f': '直播筛选细化',
            'c': 'showLiveFilterTag',
            'd': {
                '0': '关',
                '1': '开',
            }
        }]
        for cate in cate_lis:
            vod_play_from.append(cate['f'])
            defaultConfig = cate['d'][str(int(self.userConfig[cate['c']]))]
            if 'vodDefaultAudio' == cate['c']:
                defaultConfig = str(defaultConfig).replace('000', 'k')
            url = ['当前：' + defaultConfig + '$ ']
            for id, name in cate['d'].items():
                if 'vodDefaultAudio' == cate['c']:
                    name = str(name).replace('000', 'k')
                url.append(name + '$' + str(id) + '_' + cate['c'] + '_setting')
            vod_play_url.append('#'.join(url))
        vod['vod_play_from'] = '$$$'.join(vod_play_from)
        vod['vod_play_url'] = '$$$'.join(vod_play_url)
        result = {
            'list': [
                vod
            ]
        }
        return result

    def setting_tab_filter_detailContent(self):
        vod = {
            "vod_name": "标签与筛选",
            "vod_content": '依次点击各标签，同一标签第一次点击为添加，第二次删除，可以返回到二维码页后重进本页查看预览，最后点击保存，未选择的将追加到末尾，如果未保存就重启app，将丢失未保存的配置',
        }
        vod_play_from = []
        vod_play_url = []
        cate_lis = [
            {'n': 'cateManual', 'v': '标签'},
            {'n': 'tuijianLis', 'v': '推荐[分区]'},
            {'n': 'rankingLis', 'v': '推荐[排行榜]'},
            {'n': 'cateManualLive', 'v': '直播'},
        ]
        for cate in cate_lis:
            _List = cate['n']
            vod_play_from.append(cate['v'])
            List_tmp = self.userConfig.get(str(_List) + '_tmp', [])
            status = ''
            if List_tmp:
                status = '【未保存】'
            else:
                List_tmp = self.userConfig.get(_List, [])
            if not List_tmp:
                List_tmp = self.defaultConfig.get(_List)
            if List_tmp and type(List_tmp[0]) == dict:
                List_tmp = list(map(lambda x:x['n'], List_tmp))
            url = ['当前: ' + ','.join(List_tmp) + '$ ', f"{status}点击这里保存$_{_List}_save_setting", f"点击这里恢复默认并保存$_{_List}_clear_setting"]
            defaultConfig = self.defaultConfig[_List].copy()
            if _List == 'cateManual' and not 'UP' in defaultConfig:
                defaultConfig.append('UP')
            elif _List == 'cateManualLive':
                extra_live_filter = self.userConfig.get('cateManualLiveExtra', [])
                defaultConfig.extend(extra_live_filter.copy())
            for name in defaultConfig:
                value = str(name)
                if type(name) == dict:
                    value = name['n'] + '@@@' + name['v'].replace('_', '@@@')
                    name = name['n']
                url.append(f"{name}${value}_{_List}_setting")
            vod_play_url.append('#'.join(url))
        vod['vod_play_from'] = '$$$'.join(vod_play_from)
        vod['vod_play_url'] = '$$$'.join(vod_play_url)
        result = {
            'list': [
                vod
            ]
        }
        return result

    def setting_liveExtra_detailContent(self):
        vod = {
            "vod_name": "查看直播细化标签",
            "vod_content": '点击想要添加的标签，同一标签第一次点击为添加，第二次删除，完成后在[标签与筛选]页继续操作，以添加到直播筛选分区列中',
        }
        vod_play_from = ['已添加']
        cateManualLiveExtra = self.userConfig.get('cateManualLiveExtra', [])
        vod_play_url = ['点击相应标签(只)可以删除$ #清空$clear_liveFilter_setting']
        for name in cateManualLiveExtra:
            value = name['v']
            name = name['n']
            vod_play_url.append(name + '$' + 'del_' + name + '_' + value + '_liveFilter_setting')
        vod_play_url = ['#'.join(vod_play_url)]
        cateLive = self.userConfig.get('cateLive', {})
        for parent, parent_dic in cateLive.items():
            area_dic = parent_dic['value']['value']
            if len(area_dic) == 1:
                continue
            vod_play_from.append(parent)
            url = []
            for area in area_dic:
                name = str(area['n']).replace('_', '-').replace("#", "﹟").replace("$", "﹩")
                id = str(area['v']).replace('_', '@@@').replace("#", "﹟").replace("$", "﹩")
                url.append(name + '$add_' + name + '_' + id + '_liveFilter_setting')
            vod_play_url.append('#'.join(url))
        vod['vod_play_from'] = '$$$'.join(vod_play_from)
        vod['vod_play_url'] = '$$$'.join(vod_play_url)
        result = {
            'list': [
                vod
            ]
        }
        return result

    def get_all_season(self, season):
        season_id = str(season['season_id'])
        season_title = season['season_title']
        if season_id == self.detailContent_args['ssid']:
            self.detailContent_args['s_title'] = season_title
        pic = season['cover']
        remark = season['new_ep']['index_show']
        result = {
            "vod_id": season_id + 'ss',
            "vod_name": '系列：' + season_title,
            "vod_pic": self.format_img(pic),
            "vod_remarks": remark}
        return result

    def get_bangumi_section(self, section):
        sec_title = section['title'].replace("#", "﹟").replace("$", "﹩")
        sec_type = section['type']
        if sec_type in [1, 2] and len(section['episode_ids']) == 0:
            episodes = section['episodes']
            playUrl = '#'.join(map(lambda x: self.get_normal_episodes(x)[0], episodes))
            return (sec_title, playUrl)

    def ysContent(self, array):
        aid = array[0]
        if 'ep' in aid:
            self.detailContent_args['fromep'] = aid
            aid = 'ep_id=' + aid.replace('ep', '')
        elif 'ss' in aid:
            aid = 'season_id=' + aid.replace('ss', '')
        url = "https://api.bilibili.com/pgc/view/web/season?{0}".format(aid)
        rsp = self._get_sth(url, 'fake')
        jRoot = json.loads(rsp.text)
        jo = jRoot['result']
        self.detailContent_args['ssid'] = str(jo['season_id'])
        title = jo['title']
        self.detailContent_args['s_title'] = jo['season_title']
        self.detailContent_args['title_type'] = '集'
        if jo['type'] in [1, 4]:
            self.detailContent_args['title_type'] = '话'
        #添加系列到搜索
        seasons = jo.get('seasons')
        if len(seasons) == 1:
            self.detailContent_args['s_title'] = seasons[0]['season_title']
            seasons = 0
        else:
            self.detailContent_args['seasons'] = list(self.pool.map(self.get_all_season, seasons))
        #获取正片
        episodes = jo.get('episodes')
        #获取花絮
        section_task = []
        for s in jo.get('section', []):
            if s:
                t = self.pool.submit(self.get_bangumi_section, s)
                section_task.append(t)
        pic = jo['cover']
        typeName = jo['share_sub_title']
        date = jo['publish']['pub_time'][0:4]
        dec = jo['evaluate']
        remark = jo['new_ep']['desc']
        stat = jo['stat']
        # 演员和导演框展示视频状态，包括以下内容：
        status = "▶" + self.zh(stat['views']) + "　❤" + self.zh(stat['favorites'])
        vod = {
            "vod_id": 'ss' + self.detailContent_args['ssid'],
            "vod_name": title,
            "vod_pic": pic,
            "type_name": typeName,
            "vod_year": date,
            "vod_actor": status,
            "vod_content": dec
        }
        if self.isFongmi:
            if seasons:
                remark += '  [a=cr:{"id": "_getbangumiseasons","name": "' + title.replace('"', '\\"') + '"}/]更多系列[/a]'
                seasons = 0
            if 'rating' in jo:
                remark = str(jo['rating']['score']) + '分  ' + remark
            self.userConfig['show_vod_hot_reply'] = False
        else:
            vod["vod_area"] = "bilidanmu"
        vod["vod_remarks"] = remark
        ZhuiPf = []
        ZhuiPu = []
        if self.userid:
            ZhuiPf = ['做点什么']
            ZhuiPu = '是否追番剧$ #❤追番剧$add_notplay_zhui#💔取消追番剧$del_notplay_zhui'
            defaultQn = int(self.userConfig['vodDefaultQn'])
            if defaultQn > 116:
                ZhuiPu += '#⚠️限高1080$116_notplay_vodTMPQn'
            ZhuiPu = [ZhuiPu]
        if seasons:
            ZhuiPf.append('更多系列')
            ZhuiPu.append('更多系列在快速搜索中查看$ #')
        FirstPf = []
        FirstPu = []
        PreviewPf = []
        PreviewPu = []
        ParsePf = []
        ParsePu = []
        if episodes:
            for x, y in self.pool.map(self.get_normal_episodes, episodes):
                if y:
                    FirstPu.append(x)
                    ParsePu.append(y)
                else:
                    PreviewPu.append(x)
            if FirstPu:
                FirstPf = [self.detailContent_args['s_title']]
                FirstPu = ['#'.join(FirstPu)]
            if PreviewPu:
                PreviewPf = ['预告']
                PreviewPu = ['#'.join(PreviewPu)]
            if not self.detailContent_args.get('parse'):
                ParsePu = []
            if ParsePu:
                ParsePf = [str(self.detailContent_args['s_title']) + '【解析】']
                ParsePu = ['#'.join(ParsePu)]
        fromL = ParsePf + FirstPf + PreviewPf
        urlL = ParsePu + FirstPu + PreviewPu
        for t in as_completed(section_task):
            s = t.result()
            if s:
                fromL.append(s[0])
                urlL.append(s[1])
        fromep = self.detailContent_args.get('fromep', '')
        if '_' in fromep:
            fromL = ['B站'] + fromL
            urlL = [fromep] + urlL
        if self.userConfig['show_vod_hot_reply']:
            self.get_vod_hot_reply_event.wait()
            ReplyPu = self.detailContent_args.get('Reply', '')
            if ReplyPu:
                ZhuiPf.append('热门评论')
                ZhuiPu.append(ReplyPu)
        fromL.insert(1, '$$$'.join(ZhuiPf))
        urlL.insert(1, '$$$'.join(ZhuiPu))
        vod['vod_play_from'] = '$$$'.join(fromL)
        vod['vod_play_url'] = '$$$'.join(urlL)
        result = {
            'list': [
                vod
            ]
        }
        return result

    def get_live_api2_playurl(self, room_id):
        playFrom = []
        playUrl = []
        url = 'https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id={0}&no_playurl=0&mask=1&qn=0&platform=web&protocol=0,1&format=0,1,2&codec=0,1&dolby=5&panorama=1'.format(room_id)
        rsp = self._get_sth(url, 'fake')
        jo = json.loads(rsp.text)
        if jo['code'] == 0:
            playurl_info = jo['data'].get('playurl_info', '')
            if playurl_info:
                stream = playurl_info['playurl']['stream']
                liveDic = {
                    'codec': {'avc': '0', 'hevc': '1'},
                    'format': {'flv': '0', 'ts': '1', 'fmp4': '2'},
                }
                liveDic['qn'] = dict(self.pool.map(lambda x:(x['qn'], x['desc']), playurl_info['playurl']['g_qn_desc']))
                vodList = []
                for i in stream:
                    vodList.extend(i['format'])
                api2_playUrl = {}
                for v in vodList:
                    format = str(v.get('format_name'))
                    for c in v['codec']:
                        codec = str(c.get('codec_name'))
                        accept_qn = c.get('accept_qn')
                        for qn in accept_qn:
                            url = format + '_' + codec + '$liveapi2_' + str(qn) + '_' + liveDic['format'][format] + '_' + liveDic['codec'][codec] + '_' + str(room_id)
                            if not api2_playUrl.get(liveDic['qn'][qn]):
                                api2_playUrl[liveDic['qn'][qn]] = []
                            api2_playUrl[liveDic['qn'][qn]].append(url)
                for key, value in api2_playUrl.items():
                    playFrom.append(key)
                    playUrl.append('#'.join(value))
        result = {'From': playFrom, 'url': playUrl}
        return result

    def live_detailContent(self, array):
        room_id = array[0]
        get_live_api2_playurl = self.pool.submit(self.get_live_api2_playurl, room_id)
        url = "https://api.live.bilibili.com/room/v1/Room/get_info?room_id=" + str(room_id)
        rsp = self._get_sth(url, 'fake')
        jRoot = json.loads(rsp.text)
        result = {}
        if jRoot.get('code') == 0:
            jo = jRoot['data']
            self.detailContent_args['mid'] = mid = str(jo["uid"])
            self.get_up_info_event.clear()
            self.pool.submit(self.get_up_info, mid)
            title = jo['title'].replace("<em class=\"keyword\">", "").replace("</em>", "")
            pic = jo.get("user_cover")
            desc = jo.get('description')
            typeName = jo.get('parent_area_name') + '--' + jo.get('area_name')
            live_status = jo.get('live_status', '')
            if live_status:
                live_status = "开播时间：" + jo.get('live_time').replace('-', '.')
            else:
                live_status = "未开播"
            vod = {
                "vod_id": room_id,
                "vod_name": title,
                "vod_pic": pic,
                "type_name": typeName,
                "vod_content": desc,
            }
            remark = "房间号：" + room_id + "　" + live_status
            if self.isFongmi:
                vod["vod_remarks"] = remark
            else:
                vod["vod_actor"] = remark
                vod["vod_area"] = "bililivedanmu"
            secondPFrom = ''
            secondP = ''
            if self.userid:
                secondPFrom = '关注Ta'
                first = '是否关注$ '
                follow = '➕关注$1_notplay_follow'
                unfollow = '➖取关$2_notplay_follow'
                secondPList = [first, follow, unfollow]
                secondP = '#'.join(secondPList)
            playFrom = get_live_api2_playurl.result().get('From', [])
            playUrl = get_live_api2_playurl.result().get('url', [])
            if playFrom:
                api1_playFrom = 'API_1'
                api1_playUrl = 'flv线路原画$platform=web&quality=4_' + room_id + '#flv线路高清$platform=web&quality=3_' + room_id + '#h5线路原画$platform=h5&quality=4_' + room_id + '#h5线路高清$platform=h5&quality=3_' + room_id
                playFrom.append(api1_playFrom)
                playUrl.append(api1_playUrl)
            if secondPFrom:
                playFrom.insert(1, secondPFrom)
                playUrl.insert(1, secondP)
            vod['vod_play_from'] = '$$$'.join(playFrom)
            vod['vod_play_url'] = '$$$'.join(playUrl)
            self.get_up_info_event.wait()
            up_info = self.up_info[mid]
            vod["vod_director"] = '🆙 ' + up_info['crname']  + "　👥 " + self.zh(jo.get('attention')) + '　' + up_info['following']
            result['list'] = [vod]
        return result

    search_key = ''
    
    def searchContent(self, key, quick):
        if not self.session_fake.cookies:
            self.pool.submit(self.getFakeCookie, True)
        for t in self.task_pool:
            t.cancel()
        self.task_pool = []
        self.search_key = key
        mid = self.detailContent_args.get('mid', '')
        if quick and mid:
            get_up_videos = self.pool.submit(self.get_up_videos, mid, 1, 'quicksearch')
        types = {'video': '','media_bangumi': '番剧: ', 'media_ft': '影视: ', 'bili_user': '用户: ', 'live': '直播: '}
        for type, value in types.items():
            t = self.pool.submit(self.get_search_content, key = key, pg = value, duration_diff = 0, order = '', type = type, ps = self.userConfig['page_size'])
            self.task_pool.append(t)
        result = {'list': []}
        for t in as_completed(self.task_pool):
            res = t.result().get('list', [])
            result['list'].extend(res)
            self.task_pool.remove(t)
        if quick:
            if not self.isFongmi:
                if mid:
                    result['list'] = self.detailContent_args.get('interaction', []) + get_up_videos.result().get('list', []) + self.detailContent_args.get('Reply_jump', []) + result['list']
                else:
                    result['list'] = self.detailContent_args.get('seasons', []) + result['list']
        return result

    stop_heartbeat_event = threading.Event()

    def start_heartbeat(self, aid, cid, ids):
        duration = ssid = epid = ''
        for i in ids:
            if 'ss' in i:
                ssid = i.replace('ss', '')
            elif 'ep' in i:
                epid = i.replace('ep', '')
            elif 'dur' in i:
                duration = int(i.replace('dur', ''))
        url = 'https://api.bilibili.com/x/player/v2?aid={0}&cid={1}'.format(aid, cid)
        rsp = self._get_sth(url)
        jo = json.loads(rsp.text)
        data = jo.get('data',{})
        interaction = data.get('interaction', {})
        if interaction.get('graph_version'):
            graph_version = interaction.get('graph_version')
            old = self.detailContent_args.get('graph_version')
            if old != graph_version:
                self.detailContent_args['graph_version'] = graph_version
                self.pool.submit(self.interaction_detailContent)
        heartbeatInterval = int(self.userConfig['heartbeatInterval'])
        if not self.userid or not heartbeatInterval:
            return
        if not duration:
            url = 'https://api.bilibili.com/x/web-interface/view?aid={0}&cid={1}'.format(aid, cid)
            rsp = self._get_sth(url, 'fake')
            jRoot = json.loads(rsp.text)
            duration = jRoot['data']['duration']
        played_time = 0
        if int(data.get('last_play_cid', 0)) == int(cid):
            last_play_time = int(data.get('last_play_time'))
            if last_play_time > 0:
                played_time = int(last_play_time / 1000)
        heartbeat_times = int((duration - played_time) / heartbeatInterval) + 1
        url = 'https://api.bilibili.com/x/click-interface/web/heartbeat'
        data = {'aid': str(aid), 'cid': str(cid), 'csrf': str(self.csrf)}
        if ssid:
            data['sid'] = str(ssid)
            data['epid'] = str(epid)
            data['type'] = '4'
        heartbeat_count = 0
        self.stop_heartbeat_event.clear()
        while True:
            if heartbeat_count == heartbeatInterval or self.stop_heartbeat_event.is_set():
                played_time += heartbeat_count
                heartbeat_count = 0
            if not heartbeat_count:
                heartbeat_times -= 1
                if not heartbeat_times:
                    #播完为-1
                    played_time = -1
                    self.stop_heartbeat_event.set()
                data['played_time'] = str(played_time)
                self.pool.submit(self._post_sth, url=url, data=data)
                if self.stop_heartbeat_event.is_set():
                    break
            time.sleep(1)
            heartbeat_count += 1

    wbi_key = {}
    def get_wbiKey(self, wts):
        r = self.fetch("https://api.bilibili.com/x/web-interface/nav", headers=self.header)
        wbi_img_url = r.json()['data']['wbi_img']['img_url']
        wbi_sub_url = r.json()['data']['wbi_img']['sub_url']
        oe = [46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12,
            38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62,
            11, 36, 20, 34, 44, 52]
        ae = wbi_img_url.split("/")[-1].split(".")[0] + wbi_sub_url.split("/")[-1].split(".")[0]
        le = reduce(lambda s, i: s + ae[i], oe, "")[:32]
        self.wbi_key = {
            "key": le,
            "wts": wts
        }
    
    def encrypt_wbi(self, **params):
        wts = round(time.time())
        if not self.wbi_key or abs(self.wbi_key['wts']) < 120:
            self.get_wbiKey(wts)
        params["wts"] = wts
        params["dm_img_list"] = []
        dm_rand = ['QQ','Qg','Qw','RA','RQ']
        params["dm_img_str"] = random.choice(dm_rand)
        params["dm_cover_img_str"] = random.choice(dm_rand)
        params = dict(sorted(params.items()))
        params = {k : ''.join(filter(lambda chr: chr not in "!'()*", str(v))) for k, v in params.items()}
        Ae = urlencode(params)
        return Ae + "&w_rid=" + hashlib.md5((Ae + self.wbi_key['key']).encode(encoding='utf-8')).hexdigest()

    def _get_sth(self, url, _type='master'):
        if _type == 'vip' and self.session_vip.cookies:
            rsp = self.session_vip.get(url, headers=self.header)
        elif _type == 'fake':
            if not self.session_fake.cookies:
                self.getFakeCookie_event.wait()
            rsp = self.session_fake.get(url, headers=self.header)
        else:
            rsp = self.session_master.get(url, headers=self.header)
        return rsp

    def _post_sth(self, url, data):
        return self.session_master.post(url, headers=self.header, data=data)

    def post_live_history(self, room_id):
        data = {'room_id': str(room_id), 'platform': 'pc', 'csrf': str(self.csrf)}
        url = 'https://api.live.bilibili.com/xlive/web-room/v1/index/roomEntryAction'
        self._post_sth(url=url, data=data)

    def do_notplay(self, ids):
        aid = self.detailContent_args.get('aid')
        mid = self.detailContent_args.get('mid')
        ssid = self.detailContent_args.get('ssid')
        data = {'csrf': str(self.csrf)}
        url = ''
        if 'vodTMPQn' in ids:
            self.detailContent_args['vodTMPQn'] = str(ids[0])
            return
        elif 'follow' in ids:
            if 'special' in ids:
                data.update({'fids': str(mid), 'tagids': str(ids[0])})
                url = 'https://api.bilibili.com/x/relation/tags/addUsers'
            else:
                data.update({'fid': str(mid), 'act': str(ids[0])})
                url = 'https://api.bilibili.com/x/relation/modify'
        elif 'zhui' in ids:
            data.update({'season_id': str(ssid)})
            url = 'https://api.bilibili.com/pgc/web/follow/' + str(ids[0])
        elif 'like' in ids:
            data.update({'aid': str(aid), 'like': str(ids[0])})
            url = 'https://api.bilibili.com/x/web-interface/archive/like'
        elif 'coin' in ids:
            data.update({'aid': str(aid), 'multiply': str(ids[0]), 'select_like': '1'})
            url = 'https://api.bilibili.com/x/web-interface/coin/add'
        elif 'fav' in ids:
            data.update({'rid': str(aid), 'type': '2'})
            data[ids[1] + '_media_ids'] = str(ids[0])
            url = 'https://api.bilibili.com/x/v3/fav/resource/deal'
        elif 'triple' in ids:
            data.update({'aid': str(aid)})
            url = 'https://api.bilibili.com/x/web-interface/archive/like/triple'
        elif 'reply' in ids:
            data.update({'oid': str(ids[0]), 'rpid': str(ids[1]), 'type': '1', 'action': '1'})
            url = 'http://api.bilibili.com/x/v2/reply/action'
        self._post_sth(url=url, data=data)

    def get_cid(self, video):
        url = "https://api.bilibili.com/x/web-interface/view?aid=%s" % str(video['aid'])
        rsp = self._get_sth(url)
        jRoot = json.loads(rsp.text)
        jo = jRoot['data']
        video['cid'] = jo['cid']
        video['duration'] = jo['duration']
        if 'redirect_url' in jo and 'bangumi' in jo['redirect_url']:
            video['ep'] = self.find_bangumi_id(jo['redirect_url'])

    cookie_dic_tmp = {}

    def get_cookies(self, key):
        url = 'https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=' + key
        rsp = self._get_sth(url, 'fake')
        jo = json.loads(rsp.text)
        if jo['code'] == 0:
            message = jo['data']['message']
            if not message:
                self.cookie_dic_tmp[key] = dict(self.session_fake.cookies)
                self.pool.submit(self.getFakeCookie)
            return message
        return '网络错误'

    def set_cookie(self, key, _type):
        cookie_dic_tmp = self.cookie_dic_tmp.get(key, '')
        if not cookie_dic_tmp:
            message = self.get_cookies(key)
            if message:
                return
        users = self.userConfig.get('users', {})
        users[_type] = {'cookies_dic': self.cookie_dic_tmp.get(key, {})}
        self.userConfig.update({'users': users})
        self.getCookie(_type)
        self.dump_config()

    def unset_cookie(self, _type):
        if _type == 'vip':
            self.session_vip.cookies.clear()
        else:
            self.session_master.cookies = self.session_fake.cookies
            self.userid = self.csrf = ''
        if _type in self.userConfig.get('users', {}):
            self.userConfig['users'].pop(_type)
            self.dump_config()

    def set_normal_default(self, id, type):
        self.userConfig[type] = str(id)
        self.dump_config()

    def set_normal_cateManual(self, name, _List, action):
        List_tmp = self.userConfig.get(str(_List) + '_tmp')
        if not List_tmp:
            List_tmp = self.userConfig[str(_List) + '_tmp'] = []
        if action == 'save':
            for _item in self.defaultConfig[_List]:
                if not _item in List_tmp.copy():
                    self.userConfig[str(_List) + '_tmp'].append(_item)
            self.userConfig[_List] = self.userConfig[str(_List) + '_tmp'].copy()
            self.userConfig.pop(_List + '_tmp')
            self.dump_config()
        elif action == 'clear':
            self.userConfig[_List] = self.defaultConfig[_List].copy()
            self.userConfig.pop(str(_List) + '_tmp')
            self.dump_config()
        else:
            if _List == 'cateManualLive':
                name = name.split('@@@')
                if len(name) == 3:
                    name[1] += '_' + str(name[2])
                name = {'n': name[0], 'v': str(name[1])}
            if name in List_tmp:
                self.userConfig[str(_List) + '_tmp'].remove(name)
            else:
                self.userConfig[str(_List) + '_tmp'].append(name)

    def add_cateManualLiveExtra(self, action, name, id):
        _Extra = self.userConfig.get('cateManualLiveExtra', [])
        if not _Extra:
            _Extra = self.userConfig['cateManualLiveExtra'] = []
        if action == 'clear':
            for _ext in _Extra:
                _ext['v'] = _ext['v'].replace('@@@', '_')
                if _ext in self.userConfig.get('cateManualLive', []):
                    self.userConfig['cateManualLive'].remove(_ext)
                if _ext in self.userConfig.get('cateManualLive_tmp', []):
                    self.userConfig['cateManualLive_tmp'].remove(_ext)
            self.userConfig.pop('cateManualLiveExtra')
        elif id in list(map(lambda x:x['v'], self.userConfig.get('cateManualLiveExtra', []))):
            area_dict = {'n': name, 'v': id}
            self.userConfig['cateManualLiveExtra'].remove(area_dict)
            area_dict['v'] = id.replace('@@@', '_')
            if area_dict in self.userConfig.get('cateManualLive', []):
                self.userConfig['cateManualLive'].remove(area_dict)
            if area_dict in self.userConfig.get('cateManualLive_tmp', []):
                self.userConfig['cateManualLive_tmp'].remove(area_dict)
        else:
            area_dict = {'n': name, 'v': id}
            self.userConfig['cateManualLiveExtra'].append(area_dict)
        self.dump_config()

    vod_qn_id = {
        '127': "8K",
        '126': "杜比视界",
        '125': "HDR",
        '120': "4K",
        '116': "1080P60帧",
        '112': "1080P+",
        '80': "1080P",
        '64': "720P",
    }
    vod_codec_id = {
        '7': 'avc',
        '12': 'hevc',
        '13': 'av1',
    }
    vod_audio_id = {
        '30280': '192000',
        '30232': '132000',
        '30216': '64000',
    }

    def get_dash_media(self, video):
        qnid = str(video.get('id'))
        codecid = video.get('codecid')
        media_codecs = video.get('codecs')
        media_bandwidth = video.get('bandwidth')
        media_startWithSAP = video.get('startWithSap')
        media_mimeType = video.get('mimeType')
        media_BaseURL = video.get('baseUrl').replace('&', '&amp;')
        media_SegmentBase_indexRange = video['SegmentBase'].get('indexRange')
        media_SegmentBase_Initialization = video['SegmentBase'].get('Initialization')
        mediaType = media_mimeType.split('/')[0]
        if mediaType == 'video':
            media_frameRate = video.get('frameRate')
            media_sar = video.get('sar')
            media_width = video.get('width')
            media_height = video.get('height')
            media_type_params = f"height='{media_height}' width='{media_width}' frameRate='{media_frameRate}' sar='{media_sar}'"
        elif mediaType == 'audio':
            audioSamplingRate = self.vod_audio_id.get(qnid, '192000')
            media_type_params = f"numChannels='2' sampleRate='{audioSamplingRate}'"
        if codecid:
            qnid += '_' + str(codecid)
        result = f"""
      <Representation id="{qnid}" bandwidth="{media_bandwidth}" codecs="{media_codecs}" mimeType="{media_mimeType}" {media_type_params} startWithSAP="{media_startWithSAP}">
        <BaseURL>{media_BaseURL}</BaseURL>
        <SegmentBase indexRange="{media_SegmentBase_indexRange}">
          <Initialization range="{media_SegmentBase_Initialization}"/>
        </SegmentBase>
      </Representation>"""
        return result

    def get_dash_media_list(self, media_lis):
        if not media_lis:
            return ""
        mediaType = media_lis[0]['mimeType'].split('/')[0]
        defaultQn = defaultCodec = ''
        if mediaType == 'video':
            defaultQn = vodTMPQn = self.detailContent_args.get('vodTMPQn', '')
            if vodTMPQn:
                vodTMPQn = int(vodTMPQn)
            else:
                defaultQn = str(self.userConfig['vodDefaultQn'])
                vodTMPQn = 120
            defaultCodec = str(self.userConfig['vodDefaultCodec'])
        elif mediaType == 'audio':
            defaultQn = str(self.userConfig['vodDefaultAudio'])
            vodTMPQn = int(defaultQn)
            defaultCodec = '0'
        qn_codec = list(map(lambda x: str(x['id']) + '_' + str(x['codecid']), media_lis))
        Qn_available_lis = []
        #按设定的质量和设定的编码找
        if defaultQn + '_' + defaultCodec in qn_codec:
            Qn_available_lis.append(media_lis[qn_codec.index(defaultQn + '_' + defaultCodec)])
        #按设定的质量找推荐的编码
        if not Qn_available_lis and mediaType == 'video':
            for c in self.vod_codec_id.keys():
                if defaultQn + '_' + str(c) in qn_codec:
                    Qn_available_lis.append(media_lis[qn_codec.index(defaultQn + '_' + str(c))])
        #找4K及以下最高可用画质/音质
        if not Qn_available_lis:
            qn_top = ''
            for q in qn_codec:
                q_c = q.split('_')
                if qn_top and int(qn_top) > int(q_c[0]):
                    break
                elif mediaType == 'video' and int(q_c[0]) <= vodTMPQn and not qn_top or mediaType == 'audio' and not qn_top or int(q_c[0]) == qn_top:
                    qn_top = int(q_c[0])
                    #匹配设定的编码，否则全部
                    if mediaType == 'video' and str(q_c[1]) == defaultCodec:
                        Qn_available_lis = [media_lis[qn_codec.index(str(q))]]
                        break
                    Qn_available_lis.append(media_lis[qn_codec.index(str(q))])
        result = f"""
    <AdaptationSet>
      <ContentComponent contentType="{mediaType}"/>{''.join(map(self.get_dash_media, Qn_available_lis))}
    </AdaptationSet>"""
        return result

    get_dash_event = threading.Event()
    def get_dash(self, ja):
        duration = ja.get('duration')
        minBufferTime = ja.get('minBufferTime')
        video_list = self.pool.submit(self.get_dash_media_list, ja.get('video'))
        audio_list = self.pool.submit(self.get_dash_media_list, ja.get('audio'))
        mpd = f"""<MPD xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:mpeg:dash:schema:mpd:2011" xsi:schemaLocation="urn:mpeg:dash:schema:mpd:2011 DASH-MPD.xsd" type="static" mediaPresentationDuration="PT{duration}S" minBufferTime="PT{minBufferTime}S" profiles="urn:mpeg:dash:profile:isoff-on-demand:2011">
  <Period duration="PT{duration}S" start="PT0S">{video_list.result()}{audio_list.result()}
  </Period>
</MPD>"""
        with open(f"{dirname}/playurl.mpd", 'w', encoding="utf-8") as f:
            f.write(mpd)
        self.get_dash_event.set()
        #time.sleep(3)
        #os.remove(f"{dirname}/playurl.mpd")
        
    def get_durl(self, ja):
        maxSize = -1
        position = -1
        for i in range(len(ja)):
            tmpJo = ja[i]
            if maxSize < int(tmpJo['size']):
                maxSize = int(tmpJo['size'])
                position = i
        url = ''
        if len(ja) > 0:
            if position == -1:
                position = 0
            url = ja[position]['url']
        return url

    def miao(self, m):
        m = str(m).partition('.')[2]    #取小数部分
        if len(m)==0:m = '000'          #补齐三位小数
        if len(m)==1:m = m + '00'
        if len(m)==2:m = m + '0'
        return m                           #返回标准三位的毫秒数

    def down_sub(self, url):
        rsp = self._get_sth(url, 'fake')
        data = json.loads(rsp.text)['body']
        srt = ''
        for d in data:
            f = round(d['from'],3)      # 开始时间 （round(n，3)四舍五入为三位小数）
            t = round(d['to'],3)        # 结束时间
            c = d['content']            # 字幕内容
            ff = time.strftime("%H:%M:%S",time.gmtime(f)) + ',' + self.miao(f)   # 开始时间，秒数转 时:分:秒 格式，加逗号、毫秒修正为三位
            tt = time.strftime("%H:%M:%S",time.gmtime(t)) + ',' + self.miao(t)   # 结束时间，处理方式同上
            srt += '\n' + ff + ' ' + '-->' + ' ' + tt + '\n' + c + '\n\n'     # 格式化为Srt字幕
        return srt

    localProxyUrl = 'http://127.0.0.1:UndCover/proxy'

    def get_subs(self, aid, cid):
        result = []
        query = self.encrypt_wbi(aid=aid, cid=cid)
        url = f'https://api.bilibili.com/x/player/wbi/v2?{query}'
        rsp = self._get_sth(url, 'master')
        jRoot = json.loads(rsp.text)
        if jRoot['code'] == 0:
            for sub in jRoot['data']['subtitle'].get('subtitles', []):
                lanDoc = str(sub.get('lan_doc', ''))
                lanUrl = sub.get('subtitle_url')
                if lanUrl.startswith('//'):
                    lanUrl = 'https:' + lanUrl
                lanUrl = base64.b64encode(lanUrl.encode('utf-8')).decode('utf-8')
                result.append(
                    {
                        "url": f"{self.localProxyUrl}&siteType=3&siteKey=py_bilibili&type=subtitle&url={lanUrl}",
                        "name": lanDoc,
                        "format": "application/x-subrip"
                    }
                )
        return result

    def playerContent(self, flag, id, vipFlags):
        self.stop_heartbeat_event.set()
        result = {'playUrl': '', 'url': ''}
        ids = id.split("_")
        if 'web' in id or 'liveapi2' == ids[0]:
            return self.live_playerContent(flag, id, vipFlags)
        if len(ids) < 2:
            return result
        aid = ids[0]
        cid = ids[1]
        if 'setting' in ids:
            if 'liveFilter' in id:
                id = ids[2]
                self.add_cateManualLiveExtra(aid, cid, id)
            elif cid in ['cateManual', 'cateManualLive', 'tuijianLis', 'rankingLis']:
                action = ids[2]
                self.set_normal_cateManual(aid, cid, action)
            elif 'login' in id:
                self.set_cookie(aid, cid)
            elif 'logout' in id:
                self.unset_cookie(aid)
            else:
                self.set_normal_default(aid, cid)
            return result
        elif 'notplay' in ids:
            self.pool.submit(self.do_notplay, ids)
            return result
        elif cid == 'cid' or not cid:
            video = {'aid': str(aid)}
            self.get_cid(video, )
            cid = video['cid']
            ids.append('dur' + str(video['duration']))
            ep = video.get('ep')
            if ep:
                id += '_' + ep
                ids.append(ep)
        query = self.encrypt_wbi(avid=aid, cid=cid, fnval=4048, fnver=0, fourk=1)
        url = f'https://api.bilibili.com/x/player/wbi/playurl?{query}'
        if 'ep' in id:
            if 'parse' in id:
                test = list(x for x in map(lambda x: x if 'ep' in x else None, ids) if x is not None)
                url = 'https://www.bilibili.com/bangumi/play/' + test[0]
                result["url"] = url
                result["flag"] = 'bilibili'
                result["parse"] = '1'
                result['jx'] = '1'
                result["header"] = str({"User-Agent": self.header["User-Agent"]})
                result["danmaku"] = 'https://api.bilibili.com/x/v1/dm/list.so?oid=' + str(cid)
                return result
            url = 'https://api.bilibili.com/pgc/player/web/playurl?aid={}&cid={}&fnval=4048&fnver=0&fourk=1'.format(aid, cid)
        rsp = self._get_sth(url, 'vip')
        jRoot = json.loads(rsp.text)
        if jRoot['code'] == 0:
            if 'data' in jRoot:
                jo = jRoot['data']
            elif 'result' in jRoot:
                jo = jRoot['result']
            else:
                return result
        else:
            return result
        ja = jo.get('dash')
        if ja:
            self.get_dash_event.clear()
            get_dash = self.pool.submit(self.get_dash, ja)
            self.get_dash_event.wait()
            result["url"] = f"{dirname}/playurl.mpd"
        else:
            result["url"] = self.get_durl(jo.get('durl', {}))
        result["parse"] = '0'
        result["contentType"] = ''
        result["header"] = self.header
        result["danmaku"] = 'https://api.bilibili.com/x/v1/dm/list.so?oid=' + str(cid)
        if self.isFongmi:
            result["subs"] = self.get_subs(aid, cid)
        #回传播放记录
        self.pool.submit(self.start_heartbeat, aid, cid, ids)
        return result

    def live_playerContent(self, flag, id, vipFlags):
        result = {'playUrl': '', 'url': ''}
        ids = id.split("_")
        if len(ids) < 2:
            return result
        # 回传观看直播记录
        if self.userid and int(self.userConfig['heartbeatInterval']) > 0:
            self.pool.submit(self.post_live_history, ids[-1])
        if ids[0] == 'liveapi2':
            qn = int(ids[1])
            format = int(ids[2])
            codec = int(ids[3])
            room_id = int(ids[-1])
            url = 'https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id={0}&protocol=0,1&format={1}&codec={2}&qn={3}&ptype=8&platform=web&dolby=5&panorama=1&no_playurl=0&mask=1'.format(room_id, format, codec, qn)
            rsp = self._get_sth(url, 'fake')
            jo = json.loads(rsp.text)
            if jo['code'] == 0:
                try:
                    playurl = jo['data']['playurl_info'].get('playurl')
                    codec = playurl['stream'][0]['format'][0]['codec'][0]
                except:
                    return result
                base_url = str(codec['base_url'])
                host = str(codec['url_info'][0]['host'])
                extra = str(codec['url_info'][0]['extra'])
                playurl = host + base_url + extra
                result["url"] = playurl
                if ".flv" in playurl:
                    result["contentType"] = 'video/x-flv'
                else:
                    result["contentType"] = ''
            else:
                return result
        else:
            url = 'https://api.live.bilibili.com/room/v1/Room/playUrl?cid=%s&%s' % (ids[1], ids[0])
            # raise Exception(url)
            try:
                rsp = self._get_sth(url)
            except:
                return result
            jRoot = json.loads(rsp.text)
            if jRoot['code'] == 0:
                jo = jRoot['data']
                ja = jo['durl']
                if len(ja) > 0:
                    result["url"] = ja[0]['url']
                if "h5" in ids[0]:
                    result["contentType"] = ''
                else:
                    result["contentType"] = 'video/x-flv'
            else:
                return result
        result["parse"] = '0'
        # result['type'] ="m3u8"
        result["header"] = {
            "Referer": "https://live.bilibili.com",
            "User-Agent": self.header["User-Agent"]
        }
        return result

    config = {
        "player": {},
        "filter": {
            "关注": [{"key": "sort", "name": "分类",
                      "value": [{"n": "正在直播", "v": "正在直播"}, {"n": "最常访问", "v": "最常访问"},
                                {"n": "最近关注", "v": "最近关注"}, {"n": "特别关注", "v": "特别关注"},
                                {"n": "悄悄关注", "v": "悄悄关注"}, {"n": "我的粉丝", "v": "我的粉丝"}]}],
            "动态": [{"key": "order", "name": "别人投稿排序",
                    "value": [{"n": "最新发布", "v": "pubdate"}, {"n": "最多播放", "v": "click"},
                              {"n": "最多收藏", "v": "stow"}, {"n": "最早发布", "v": "oldest"}, {"n": "合集和列表", "v": "series"}]}, ],
            "影视": [{"key": "tid", "name": "分类",
                      "value": [{"n": "番剧", "v": "1"}, {"n": "国创", "v": "4"}, {"n": "电影", "v": "2"},
                              {"n": "电视剧", "v": "5"}, {"n": "纪录片", "v": "3"}, {"n": "综艺", "v": "7"}]},
                    {"key": "order", "name": "排序",
                      "value": [{"n": "热门", "v": "热门"}, {"n": "播放数量", "v": "2"}, {"n": "更新时间", "v": "0"},
                                {"n": "最高评分", "v": "4"}, {"n": "弹幕数量", "v": "1"}, {"n": "追看人数", "v": "3"},
                                {"n": "开播时间", "v": "5"}, {"n": "上映时间", "v": "6"}]},
                    {"key": "season_status", "name": "付费",
                      "value": [{"n": "全部", "v": "-1"}, {"n": "免费", "v": "1"},
                                {"n": "付费", "v": "2%2C6"}, {"n": "大会员", "v": "4%2C6"}]}],
            "频道": [{"key": "order", "name": "排序",
                    "value": [{"n": "近期热门", "v": "hot"}, {"n": "月播放量", "v": "view"},
                              {"n": "最新投稿", "v": "new"}, {"n": "频道精选", "v": "featured"}, ]}, ],
            "收藏": [{"key": "order", "name": "排序",
                      "value": [{"n": "收藏时间", "v": "mtime"}, {"n": "播放量", "v": "view"},
                                {"n": "投稿时间", "v": "pubtime"}]}, ],
            "历史": [{"key": "type", "name": "分类",
                          "value": [{"n": "全部", "v": "all"}, {"n": "视频", "v": "archive"}, {"n": "直播", "v": "live"}, {"n": "UP主", "v": "UP主"}, {"n": "稍后再看", "v": "稍后再看"}]}, ],
            "搜索": [{"key": "type", "name": "类型",
                      "value": [{"n": "视频", "v": "video"}, {"n": "番剧", "v": "media_bangumi"}, {"n": "影视", "v": "media_ft"},
                                {"n": "直播", "v": "live"}, {"n": "用户", "v": "bili_user"}]},
                    {"key": "order", "name": "视频排序",
                      "value": [{"n": "综合排序", "v": "totalrank"}, {"n": "最多点击", "v": "click"}, {"n": "最新发布", "v": "pubdate"},
                                {"n": "最多收藏", "v": "stow"}, {"n": "最多弹幕", "v": "dm"}]},
                    {"key": "duration", "name": "视频时长",
                      "value": [{"n": "全部", "v": "0"}, {"n": "60分钟以上", "v": "4"}, {"n": "30~60分钟", "v": "3"},
                                {"n": "5~30分钟", "v": "2"}, {"n": "5分钟以下", "v": "1"}]}],
        }
    }

    header = {
        'Origin': 'https://www.bilibili.com',
        'Referer': 'https://www.bilibili.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15'
    }

    def localProxy(self, param):
        action = {
            'url': '',
            'header': '',
            'param': '',
            'type': 'string',
            'after': ''
        }
        if param['type'] == 'subtitle':
            url = base64.b64decode(param['url']).decode('utf-8')
            content = self.down_sub(url)
            return [200, "application/octet-stream", action, content]
        return [200, "video/MP2T", action, ""]