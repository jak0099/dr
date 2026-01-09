/*
title: 'AppV2模板', author: '小可乐/v5.6.1'
说明：
ext参数标准格式:  域名$官源解析$其他解析|站名，
如: "ext": "https://app.4kwo.com$$|稀饭"，支持base64格式，如: 
"ext": "aHR0cHM6Ly9hcHAuNGt3by5jb20kJHznqIDppa0="，
没有解析参数可省略写为: "ext": "https://app.4kwo.com|稀饭"
站名会显示在第一个分类名称上，不想显示，可以不写站名，如: "ext": "https://app.4kwo.com"，或将kparam对象的tnameShow设为0
*/
import { Crypto, _ } from 'assets://js/lib/cat.js';

const MOBILE_UA = "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";
var def_header = {'User-Agent': MOBILE_UA};
var cachedPlayUrls = {};
var HOST;

var kparam = {
    host: '',
    headers: {'User-Agent': 'Dart/2.14 (dart:io)'},
    timeout: 5000,
    pgcount: 0,
    tnameShow: 1
};

function decodeBase64(str) {
    try {
        return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(str));
    } catch (e) {
        return str;
    }
};

function getHome(url) {
    try {
        let rurl = url;
        if (!url) { return ''; };
        try { url = decodeURIComponent(url);} catch (e) {};
        let tmp = url.split('//');
        url = tmp[0] + '//' + tmp[1].split('/')[0];
        return url;
    } catch (e) {
        return rurl;
    }
};

async function request(reqUrl, header, data, method) {
    try {
        let optObj = {
            headers: header || kparam.headers,
            method: method || 'get',
            timeout: kparam.timeout || 5000,
        };    
        if (method === 'post') {
            optObj.data = data || {};
            optObj.postType = 'form';
        }
        let res = await req(reqUrl, optObj);
        return res.content;
    } catch (e) {
        throw new Error();
    }
};

async function getdata(url, data, method) {
    try {
        url = /^http/.test(url) ? url : `${HOST}${url}`;
        let res = await request(url, kparam.headers, data, method);
        return JSON.parse(res);
    } catch (e) {
        return {};
    }
};

async function init(cfg) {
    try {
        if (!cfg.ext) {throw new Error();};
        let extValue = cfg.ext.trim();
        try {extValue = decodeBase64(extValue);} catch (e) {};
        let kname = extValue.split('|')[1] || '';
        kparam.tname = (kname&&kparam.tnameShow) ? `<${kname}>` : '';
        let parts = extValue.split('|')[0].split('$');
        kparam.host = parts[0] || '';
        if (!kparam.host.startsWith('http')) {throw new Error();};
        kparam.host = getHome(kparam.host);
        HOST = kparam.host;
        kparam.gparse = parts[1] || '';
        kparam.parse = parts[2] || '';
    } catch (e) {
        throw new Error();
    }
};

async function home(filter) {
    try {
        let ktypeObj = await getdata('/api.php/app/nav?token=');
        let classes = ktypeObj.list.map((item) => { return {type_name: item.type_name, type_id: item.type_id}; });
        classes[0].type_name = `${classes[0].type_name}${kparam.tname}`;
        let filters = {};
        let nameObj = { class: 'class,剧情', area: 'area,地区', lang: 'lang,语言', year: 'year,年份' };
        let kflsObj = ktypeObj.list;
        for (let [idx, it] of classes.entries()) {
            let nameArr = Object.keys(nameObj);
            let filter_data = [];
            let kflObj = kflsObj[idx].type_extend;
            if (kflObj) {
                filter_data = nameArr.map((jit) => {
                    let [kkey, kname] = nameObj[jit].split(',');
                    let kval = kflObj[jit] ? ("全部,".concat(kflObj[jit])).split(',').filter((ft) => { return ft != ''}) : [];
                    let kvalue = (kval && kval.length) ? kval.map((item) => { let itemV = (item != '全部') ? item : '';return {n: item, v: itemV}; }) : [];
                    return { key: kkey, name: kname, value: kvalue };
                });
            } else {
                filter_data = [];
            }; 
            filters[it.type_id] = filter_data.filter((item) => item.value.length > 0);
        };
        return JSON.stringify({ class: classes, filters: filters });
    } catch (e) {
        return JSON.stringify({ class: [], filters: {} });
    }
};

async function homeVod() {
    try {
        let khomeObj = await getdata('/api.php/app/index_video?token=');
        let VODS = [];
        (khomeObj.list || []).forEach((item) => { 
            if (Array.isArray(item.vlist) && item.vlist.length) { VODS = VODS.concat(item.vlist); };
        });
        return JSON.stringify({ list: VODS });
    } catch (e) {
        return JSON.stringify({ list: [] });
    }
};

async function category(tid, pg, filter, extend) {
    try {
        pg = parseInt(pg, 10);
        if ( pg <= 0 || isNaN(pg) ) { pg = 1 };
        let kcateObj = await getdata(`/api.php/app/video?tid=${tid}&class=${extend?.class || ''}&area=${extend?.area || ''}&lang=${extend?.lang || ''}&year=${extend?.year || ''}&limit=20&pg=${pg}`);
        let VODS = kcateObj.list || [];
        let pagecount = parseInt(kparam.pgcount, 10);
        if ( pagecount <= 0 || isNaN(pagecount) ) { pagecount = 0 };
        pagecount = pagecount || 999;
        return JSON.stringify({
            list: VODS,
            page: pg,
            pagecount: pagecount,
            limit: 30,
            total: 30*pagecount
        });
    } catch (e) {
        return JSON.stringify({
            list: [],
            page: 1,
            pagecount: 1,
            limit: 1,
            total: 1
        });
    }
};

async function search(wd, quick, pg) {
    try {
        pg = parseInt(pg, 10);
        if ( pg <= 0 || isNaN(pg) ) { pg = 1 };
        let ksechObj = await getdata(`/api.php/app/search?text=${wd}&pg=${pg}`);
        let VODS = ksechObj.list || [];
        return JSON.stringify({
            list: VODS,
            page: pg,
            pagecount: 10,
            limit: 10,
            total: 100
        });
    } catch (e) {
        return JSON.stringify({
            list: [],
            page: 1,
            pagecount: 1,
            limit: 1,
            total: 1
        });
    }
};

async function detail(id) {
    try {
        let kdetlObj = await getdata(`/api.php/app/video_detail?id=${id}`);
        let kvod = kdetlObj.data;
        if (!kvod) {throw new Error();};
        let ktabs = kvod.vod_url_with_player.map((it,idx) => { return `👶线${idx+1}-${it.name}`; });
        let kurls = kvod.vod_url_with_player.map((it) => { 
            let kurl = it.url.split('#').map((item) => { return `${item}@${it.code}` });
            return kurl.join('#') 
        });
        let VOD = {
            vod_id: kvod.vod_id,
            vod_name: kvod.vod_name,
            vod_pic: kvod.vod_pic,
            type_name: kvod.vod_class || '未提供',
            vod_remarks: kvod.vod_remarks || '未提供',
            vod_year: kvod.vod_year || '1000',
            vod_area: kvod.vod_area || '未提供',
            vod_lang: kvod.vod_lang || '未提供',
            vod_director: kvod.vod_director || '未提供',
            vod_actor: kvod.vod_actor || '未提供',
            vod_content: kvod.vod_content || '未提供',
            vod_play_from: ktabs.join('$$$'),
            vod_play_url: kurls.join('$$$')
        };
        return JSON.stringify({ list: [VOD] });
    } catch (e) {
        return JSON.stringify({ list: [] });
    }
};

async function play(flag, id, flags) {
    try {
        let res = '', kp = 0, kparse = kparam.parse;
        if (cachedPlayUrls[id]) { return cachedPlayUrls[id];};
        let [kurl, kfrom] = id.split('@');
        if (/\.(m3u8|mp4|mkv)/.test(kurl)) {
            kurl = kurl;
        } else if (/qq|youku|iqiyi|mgtv|bilibili/.test(kurl)) {
            kurl = kparam.gparse + kurl;
            res = await request(kurl, def_header);
            kurl = JSON.parse(res).url;
        } else {
            if (!kparse) {
                kurl = kurl;
                kp = 1;
            } else if (/^http/.test(kparse)) {
                kurl = kparse + kurl;
                res = await request(kurl, def_header);
                kurl = JSON.parse(res).url;
            };
        };
        let playObj = { parse: kp, url: kurl, header: def_header };
        let playJson = JSON.stringify(playObj);
        cachedPlayUrls[id] = playJson;
        return playJson;
    } catch (e) {
        return JSON.stringify({ parse: 0, url: '', header: {} });
    }
};

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        search: search,
        detail: detail,
        play: play
    };
}