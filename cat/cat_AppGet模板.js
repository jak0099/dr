/*
title: 'AppGet模板', author: '小可乐/2505/第一版'
*/
import { Crypto, _ } from 'assets://js/lib/cat.js';

const MOBILE_UA = "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";
var def_header = {'User-Agent': MOBILE_UA};
var cachedPlayUrls = {};
var HOST;

var kparam = {
    host: '',
    headers: {'User-Agent': 'okhttp/3.14.9'},
    timeout: 5000,
    pgcount: 0,
    key: '', 
    iv: ''
};

function decodeBase64(str) {
    try {
        return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(str));
    } catch (e) {
        return str;
    }
};

function encryptAes(data, key, iv, typeHex) {
    try {
        typeHex = typeHex || false;
        key = key || kparam.key;
        iv = iv || kparam.iv;
        key = Crypto.enc.Utf8.parse(key);
        iv = Crypto.enc.Utf8.parse(iv);
        const encrypted = Crypto.AES.encrypt( data, key, { 
            iv: iv,
            mode: Crypto.mode.CBC,
            padding: Crypto.pad.Pkcs7 
        });
        let kencrypted = (typeHex) ? encrypted.ciphertext.toString(Crypto.enc.Hex) : encrypted.toString();
        return kencrypted;
    } catch (e) {
        return null;
    }
};

function decryptAes(data, key, iv, typeHex) {
    try {
        typeHex = typeHex || false;
        key = key || kparam.key;
        iv = iv || kparam.iv;
        key = Crypto.enc.Utf8.parse(key);
        iv = Crypto.enc.Utf8.parse(iv);
        let kdata = (typeHex) ? {ciphertext: Crypto.enc.Hex.parse(data)} : data.replace(/^\uFEFF/,'').replace(/[^A-Za-z0-9+/=]/g, '');   
        const decrypted = Crypto.AES.decrypt( kdata, key, {
            iv: iv,
            mode: Crypto.mode.CBC,
            padding: Crypto.pad.Pkcs7 
        });
        return decrypted.toString(Crypto.enc.Utf8);
    } catch (e) {
        return null;
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
        let kres = await request(url, kparam.headers, data, method);
        if (!kres) {throw new Error('获取响应数据失败');};
        let kresObj = JSON.parse(kres);
        let kdata = kresObj.data || '';
        if (!kdata) {throw new Error();};
        let decrypted = decryptAes(kdata, kparam.key, kparam.iv);
        if (!decrypted) {throw new Error('解密失败');};
        return JSON.parse(decrypted);
    } catch (e) {
        return {};
    }
};

async function init(cfg) {
    try {
        if (!cfg.ext) {throw new Error();};
        let extValue = cfg.ext.trim();
        try {extValue = decodeBase64(extValue);} catch (e) {};       
        let parts = extValue.split('$');
        kparam.host = parts[0] || '';
        if (!kparam.host.startsWith('http')) {throw new Error();};
        kparam.host = kparam.host.replace(/\/+$/,'');
        HOST = kparam.host;        
        kparam.key = parts[1] || 'ENonBHeVBoYZhVUV';
        kparam.iv = parts[2] || kparam.key;
    } catch (e) {
        throw new Error('初始化参数失败');
    }
};

async function home(filter) {
    try {
        let ktypeObj = await getdata('/api.php/getappapi.index/initV119');
        let classes = ktypeObj.type_list.map((item) => { return {type_name: item.type_name, type_id: item.type_id}; });
        let filters = {};
        let nameObj = { class: 'class,剧情', area: 'area,地区', lang: 'lang,语言', year: 'year,年份', sort: 'by,排序' };
        for (let [idx, it] of classes.entries()) {   
            let kflArr = ktypeObj.type_list[idx].filter_type_list;
            let filter_data = [];
            if (kflArr && kflArr.length) {
                filter_data = kflArr.map((jit) => {
                    let [kkey, kname] = nameObj[jit.name].split(',');
                    let kval = jit.list;
                    let kvalue = (kval && kval.length) ? kval.map((item) => { return {n: item, v: item}; }) : [];
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
        let khomeObj = await getdata('/api.php/getappapi.index/initV119');
        let VODS = khomeObj.recommend_list || [];
        khomeObj.type_list.forEach((item) => { if (Array.isArray(item.recommend_list) && item.recommend_list.length) { VODS = VODS.concat(item.recommend_list);};});
        return JSON.stringify({ list: VODS });
    } catch (e) {
        return JSON.stringify({ list: [] });
    }
};

async function category(tid, pg, filter, extend) {
    try {
        pg = parseInt(pg, 10);
        if ( pg <= 0 || isNaN(pg) ) { pg = 1 };
        let fbody = {
            type_id: tid,
            class: extend?.class || '全部',
            area: extend?.area || '全部',
            lang: extend?.lang || '全部',
            year: extend?.year || '全部',
            sort: extend?.by || '最新',
            page: pg
        };
        let kcateObj = await getdata(`/api.php/getappapi.index/typeFilterVodList`, fbody, 'post');
        let VODS = kcateObj.recommend_list || [];
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
        let ksechObj = await getdata(`/api.php/getappapi.index/searchList?keywords=${wd}&type_id=0&page=${pg}`);
        let VODS = ksechObj.search_list || [];
        return JSON.stringify({
            list: VODS,
            page: pg,
            pagecount: 10,
            limit: 30,
            total: 300
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
        let kdetlObj = await getdata(`/api.php/getappapi.index/vodDetail?vod_id=${id}`);
        let kvod = kdetlObj.vod;
        if (!kvod) {throw new Error();};
        let ktabs = kdetlObj.vod_play_list.map((it,idx) => { return `👶线${idx+1}-${it.player_info.show}`; });
        let kurls = kdetlObj.vod_play_list.map((item) => {
            let kurl = item.urls.map((it) => { return `${it.name}$${it.from}@${it.url}@${it.token}@${item.player_info.parse}`; });
            return kurl.join('#');
        });
        let VOD = {
            vod_id: kvod.vod_id,
            vod_name: kvod.vod_name,
            vod_pic: kvod.vod_pic,
            type_name: kvod.vod_class || '未提供',
            vod_remarks: kvod.vod_remarks || '未提供',
            vod_year: kvod.vod_year || '20xx',
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

async function getpurl(furl, fparse, ftoken) {
    try {
        furl = encodeURIComponent(encryptAes(furl));
        furl = `${HOST}/api.php/getappapi.index/vodParse?parse_api=${fparse}&url=${furl}&token=${ftoken}`;
        let fres = await request(furl);
        if (!fres) {throw new Error('获取播放响应数据失败');};
        let fresObj = JSON.parse(fres);
        let kdata = fresObj.data || '';
        if (!kdata) {throw new Error();};     
        let decrypted = decryptAes(kdata);
        if (!decrypted) {throw new Error('解密失败');};
        kdata = JSON.parse(decrypted).json;
        return JSON.parse(kdata.replace(/\\/g,'')).url;
    } catch (e) {
        throw new Error()
    }
};

async function play(flag, id, flags) {
    try {
        let res = '', kp = 0;
        if (cachedPlayUrls[id]) {return cachedPlayUrls[id];};
        let [kfrom, kurl, ktoken, kparse] = id.split('@');
        if (/\.(m3u8|mp4|mkv)/.test(kurl)) {
            kurl = kurl;
        } else if (/zhibo|dplayer/.test(kfrom)) {
            kurl = kurl;
        } else if (/PTV/.test(kfrom)) {
            let kids = kurl.split('/');
            kurl = `https://m.jiabaide.cn/api/mw-movie/anonymous/v2/video/episode/url?clientType=3&id=${kids[5]}&nid=${kids[7]}`;
            let t = new Date().getTime();
            let sign = kurl.split('?')[1];
            sign = Crypto.SHA1(Crypto.MD5(`${sign}&key=cb808529bae6b6be45ecfab29a4889bc&t=${t}`).toString()).toString();
            res = await request(kurl, { 
                    'User-Agent': MOBILE_UA,
                    't': t,
                    'sign': sign
            });
            kurl = JSON.parse(res).data.list[0].url;
        // } else if (/qq|youku|iqiyi|mgtv|bilibili/.test(kurl)) {
            // kurl = '填自己官解' + kurl;
            // res = await request(kurl, def_header);
            // kurl = JSON.parse(res).url;
        } else {
            if (!kparse) {
                kurl = kurl;
                kp = 1;
            } else if (/^http/.test(kparse)) {
                kurl = kparse + kurl;
                res = await request(kurl, def_header);
                kurl = JSON.parse(res).url;
            } else {
                kurl = await getpurl(kurl, kparse, ktoken);
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