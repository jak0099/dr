globalThis.siteUrl = 'https://api-store.qmplaylet.com';
globalThis.key = 'd3dGiJc651gSQ8w1';
globalThis.apiPrefix = '/api/v1/playlet';
globalThis.detailApi = 'https://api-read.qmplaylet.com/player/api/v1/playlet/info';

globalThis.classMap = {
    //  '推荐': '0',
    '新剧': '-1',
    '都市情感': '1273',
    '古装': '1272',
    '都市': '571',
    '玄幻仙侠': '1286',
    '青春校园': '1288',
    '年代': '572',
    '武侠': '371',
    '乡村': '590',
    '科幻': '594',
    '民国': '573',
    '奇幻': '570',
    '末世': '556',
    '二次元': '1289',
    '逆袭': '400',
    '复仇': '795',
    '重生': '784',
    '穿越': '373',
    '女性成长': '1294',
    '家庭': '670',
    '闪婚': '480',
    '强者回归': '402',
    '打脸虐渣': '716',
    '追妻火葬场': '715',
    '马甲': '558',
    '职场': '724',
    '高手下山': '1299',
    '穿书': '338',
    '系统': '787',
    '娱乐明星': '1295',
    '异能': '727',
    '致富': '492',
    '种田经商': '1291',
    '伦理': '1293',
    '社会话题': '1290',
    '脑洞': '526',
    '豪门总裁': '624',
    '萌宝': '356',
    '真假千金': '812',
    '战神': '527',
    '赘婿': '36',
    '神豪': '37',
    '小人物': '1296',
    '神医': '1269',
    '权谋': '790',
    '女帝': '617',
    '团宠': '545',
    '欢喜冤家': '464',
    '替身': '712',
    '银发': '1297',
    '兵王': '28',
    '虐恋': '16',
    '甜宠': '21',
    '搞笑': '793',
    '宅斗': '342',
    '宫斗': '343',
    '悬疑': '27',
    '商战': '723',
    '灵异': '1287'
};

globalThis.getQmParams = function () {
    let data = {
        "static_score": "0.8",
        "uuid": "00000000-7fc7-08dc-0000-000000000000",
        "device-id": "20250220125449b9b8cac84c2dd3d035c9052a2572f7dd0122edde3cc42a70",
        "mac": "",
        "sourceuid": "aa7de295aad621a6",
        "refresh-type": "0",
        "model": "22021211RC",
        "wlb-imei": "",
        "client-id": "aa7de295aad621a6",
        "brand": "Redmi",
        "oaid": "",
        "oaid-no-cache": "",
        "sys-ver": "12",
        "trusted-id": "",
        "phone-level": "H",
        "imei": "",
        "wlb-uid": "aa7de295aad621a6",
        "session-id": String(Math.floor(new Date().getTime())),
    };
    let str = base64Encode(JSON.stringify(data));
    return str.split('').map(c => replaceChar(c)).join('');
};

globalThis.replaceChar = function (c) {
    const charMap = {
        '+': 'P', '/': 'X', '0': 'M', '1': 'U', '2': 'l', '3': 'E', '4': 'r',
        '5': 'Y', '6': 'W', '7': 'b', '8': 'd', '9': 'J', 'A': '9', 'B': 's',
        'C': 'a', 'D': 'I', 'E': '0', 'F': 'o', 'G': 'y', 'H': '_', 'I': 'H',
        'J': 'G', 'K': 'i', 'L': 't', 'M': 'g', 'N': 'N', 'O': 'A', 'P': '8',
        'Q': 'F', 'R': 'k', 'S': '3', 'T': 'h', 'U': 'f', 'V': 'R', 'W': 'q',
        'X': 'C', 'Y': '4', 'Z': 'p', 'a': 'm', 'b': 'B', 'c': 'O', 'd': 'u',
        'e': 'c', 'f': '6', 'g': 'K', 'h': 'x', 'i': '5', 'j': 'T', 'k': '-',
        'l': '2', 'm': 'z', 'n': 'S', 'o': 'Z', 'p': '1', 'q': 'V', 'r': 'v',
        's': 'j', 't': 'Q', 'u': '7', 'v': 'D', 'w': 'w', 'x': 'n', 'y': 'L',
        'z': 'e'
    };
    return charMap[c] || c;
};

globalThis.md5 = function (text) {
    return Crypto.MD5(text).toString();
};

globalThis.vodlist = function (t, pg) {
    let cleanTagId = t.replace(/^https?:\/\/[^\/]+\/?/, '').replace(/\/$/, '');
    let sign = pg == 1
        ? md5(`operation=1playlet_privacy=1tag_id=${cleanTagId}${globalThis.key}`)
        : md5(`next_id=${pg}operation=1playlet_privacy=1tag_id=${cleanTagId}${globalThis.key}`);
    let url = pg == 1
        ? `${globalThis.siteUrl}${globalThis.apiPrefix}/index?tag_id=${cleanTagId}&playlet_privacy=1&operation=1&sign=${sign}`
        : `${globalThis.siteUrl}${globalThis.apiPrefix}/index?tag_id=${cleanTagId}&next_id=${pg}&playlet_privacy=1&operation=1&sign=${sign}`;
    let qm_params = globalThis.getQmParams();
    let sign1 = md5(`AUTHORIZATION=app-version=10001application-id=com.duoduo.readchannel=unknownis-white=net-env=5platform=androidqm-params=${qm_params}reg=${globalThis.key}`);
    const options = {
        method: 'GET',
        headers: {
            'net-env': '5',
            'reg': '',
            'channel': 'unknown',
            'is-white': '',
            'platform': 'android',
            'application-id': 'com.duoduo.read',
            'authorization': '',
            'app-version': '10001',
            'user-agent': 'webviewversion/0',
            'qm-params': qm_params,
            'sign': sign1
        }
    };
    let html = fetch(url, options);
    try {
        return JSON.parse(html);
    } catch (e) {
        return { data: { list: [] } };
    }
};

globalThis.vodids = function (ids) {
    let cleanId = ids.replace(/^https?:\/\/[^\/]+\/?/, '').replace(/\/$/, '');
    let sign = md5(`playlet_id=${cleanId}${globalThis.key}`);
    let url = `${globalThis.detailApi}?playlet_id=${cleanId}&sign=${sign}`;
    let qm_params = globalThis.getQmParams();
    let sign1 = md5(`AUTHORIZATION=app-version=10001application-id=com.duoduo.readchannel=unknownis-white=net-env=5platform=androidqm-params=${qm_params}reg=${globalThis.key}`);
    const options = {
        method: 'GET',
        headers: {
            'net-env': '5',
            'reg': '',
            'channel': 'unknown',
            'is-white': '',
            'platform': 'android',
            'application-id': 'com.duoduo.read',
            'authorization': '',
            'app-version': '10001',
            'user-agent': 'webviewversion/0',
            'qm-params': qm_params,
            'sign': sign1
        }
    };
    let html = fetch(url, options);
    try {
        let bata = JSON.parse(html);
        if (!bata.data) {
            return {
                vod_id: cleanId,
                vod_name: '未知',
                vod_remarks: '',
                vod_actor: '',
                vod_director: '',
                vod_content: '',
                vod_play_from: '默认',
                vod_play_url: ''
            };
        }
        let rdata = bata.data;
        let data = {
            vod_id: cleanId,
            vod_name: rdata.title || '未知',
            vod_remarks: rdata.tags || '',
            vod_actor: rdata.total_episode_num ? `${rdata.total_episode_num}集` : '',
            vod_director: rdata.own_record_number || '',
            vod_content: rdata.intro || '',
            vod_play_from: '七猫短剧',
            vod_play_url: rdata.play_list && Array.isArray(rdata.play_list)
                ? rdata.play_list.map(item => `${item.sort || '未知'}$${item.video_url || ''}`).join('#')
                : ''
        };
        return data;
    } catch (e) {
        return {
            vod_id: cleanId,
            vod_name: '未知',
            vod_remarks: '',
            vod_actor: '',
            vod_director: '',
            vod_content: '',
            vod_play_from: '默认',
            vod_play_url: ''
        };
    }
};

globalThis.svodlist = function (wd) {
    let cleanWd = wd.replace(/^https?:\/\/[^\/]+\/?/, '').replace(/\/$/, '');
    let pg = 1;
    let sign = md5(`extend=page=${pg}read_preference=0track_id=aa7de295aad621a61743523855800wd=${cleanWd}${globalThis.key}`);
    let url = `${globalThis.siteUrl}${globalThis.apiPrefix}/search?extend=&page=${pg}&wd=${cleanWd}&read_preference=0&track_id=aa7de295aad621a61743523855800&sign=${sign}`;
    let qm_params = globalThis.getQmParams();
    let sign1 = md5(`AUTHORIZATION=app-version=10001application-id=com.duoduo.readchannel=unknownis-white=net-env=5platform=androidqm-params=${qm_params}reg=${globalThis.key}`);
    const options = {
        method: 'GET',
        headers: {
            'net-env': '5',
            'reg': '',
            'channel': 'unknown',
            'is-white': '',
            'platform': 'android',
            'application-id': 'com.duoduo.read',
            'authorization': '',
            'app-version': '10001',
            'user-agent': 'webviewversion/0',
            'qm-params': qm_params,
            'sign': sign1
        }
    };
    let html = fetch(url, options);
    try {
        return JSON.parse(html);
    } catch (e) {
        return { data: { list: [] } };
    }
};

globalThis.jxx = function (id, nid) {
    if (nid.includes('m3u8') || nid.includes('mp4') || nid.includes('mkv')) {
        return { parse: 0, url: nid, js: '' };
    }
    return { parse: 1, url: nid, js: '' };
};

var rule = {
    title: '七猫短剧',
    host: 'https://api-store.qmplaylet.com',
    detailUrl: 'fyid',
    searchUrl: '**',
    url: 'fyclass',
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
    class_name: Object.keys(globalThis.classMap).join('&'),
    class_url: Object.values(globalThis.classMap).join('&'),
    play_parse: true,
    lazy: $js.toString(() => {
        const parts = input.split('$');
        const id = parts[0];
        const playUrl = parts[1];
        const parsedUrl = jxx(id, playUrl);
        input = {
            parse: typeof parsedUrl === 'string' ? 0 : parsedUrl.parse,
            url: typeof parsedUrl === 'string' ? parsedUrl : parsedUrl.url,
            js: typeof parsedUrl === 'string' ? '' : parsedUrl.js || '',
            jx: 0
        };
    }),
    推荐: $js.toString(() => {
        let bdata = vodlist('0', 1);
        let bata = bdata.data && bdata.data.list ? bdata.data.list : [];
        let d = [];
        bata.forEach(it => {
            let creator = it.creator ? it.creator.replace(/^来源：百家号"/, '').replace(/"$/, '') : '';
            let sortTag = it.sort_tag && Array.isArray(it.sort_tag) && it.sort_tag.length > 0 ? it.sort_tag[0] : '';
            let year = creator && sortTag ? `${creator} ${sortTag}` : creator || sortTag || '';
            d.push({
                url: it.playlet_id || '',
                title: it.title || '未知',
                year: year,
                img: it.image_link || '',
                desc: it.hot_value || ''
            });
        });
        setResult(d);
    }),
    一级: $js.toString(() => {
        let cleanInput = input.replace(/^https?:\/\/[^\/]+\/?/, '').replace(/\/$/, '');
        let bdata = vodlist(cleanInput, MY_PAGE);
        let bata = bdata.data && bdata.data.list ? bdata.data.list : [];
        let d = [];
        bata.forEach(it => {
            let creator = it.creator ? it.creator.replace(/^来源：百家号"/, '').replace(/"$/, '') : '';
            let sortTag = it.sort_tag && Array.isArray(it.sort_tag) && it.sort_tag.length > 0 ? it.sort_tag[0] : '';
            let year = creator && sortTag ? `${creator} ${sortTag}` : creator || sortTag || '';
            d.push({
                url: it.playlet_id || '',
                title: it.title || '未知',
                year: year,
                img: it.image_link || '',
                desc: it.hot_value || ''
            });
        });
        setResult(d);
    }),
    二级: $js.toString(() => {
        let data = vodids(input);
        VOD = data;
    }),
    搜索: $js.toString(() => {
        let ddata = svodlist(input);
        let bata = ddata.data && ddata.data.list ? ddata.data.list : [];
        let d = [];
        bata.forEach(it => {
            let cleanTitle = it.title ? it.title.replace(/<[^>]+>/g, '') : '未知';
            let desc = it.sub_title && it.total_num ? `${it.sub_title} ${it.total_num}` : it.sub_title || it.total_num || '';
            d.push({
                url: it.id || '',
                title: cleanTitle,
                year: it.sub_title || '',
                img: it.image_link || '',
                desc: desc
            });
        });
        setResult(d);
    }),
};