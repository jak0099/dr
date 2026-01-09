/*
title: 'AppShark模板', author: '小可乐/2505/第一版'
*/
import { Crypto, _ } from 'assets://js/lib/cat.js';

const MOBILE_UA = "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";
var def_header = {'User-Agent': MOBILE_UA};
var cachedPlayUrls = {};
var HOST;

var kparam = {
    host: '',
    headers: {'User-Agent': 'Dalvik/1.5.0 (Linux; Android 11; Pixel 5)'},
    timeout: 5000,
    pgcount: 0,
    keys: [], 
    hukey: '',
    playerinfos: []
};

function decodeBase64(str) {
    try {
        return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(str));
    } catch (e) {
        return str;
    }
};

function decryptAes(data, key, typeHex) {
    try {
        typeHex = typeHex || false;
        key = key || kparam.keys[0];
        key = Crypto.enc.Utf8.parse(key);
        let kdata = (typeHex) ? {ciphertext: Crypto.enc.Hex.parse(data)} : data.replace(/^\uFEFF/,'').replace(/[^A-Za-z0-9+/=]/g, '');   
        const decrypted = Crypto.AES.decrypt( kdata, key, { 
            mode: Crypto.mode.ECB,
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
        let res = await request(url, kparam.headers, data, method);
        let decrypted = decryptAes(res, kparam.keys[0]) || decryptAes(res, kparam.keys[1]);
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
        kparam.keys[0] = parts[1] || '1e765e9b09b4dbba';
        kparam.keys[1] = parts[2] || 'aassddwwxxllsx1x';
        let kconfRes = await request(`${HOST}/shark/api.php?action=configs`);
        let decrypted = decryptAes(kconfRes, kparam.keys[1]) || decryptAes(kconfRes, kparam.keys[0]);
        if (!decrypted) {throw new Error('解密失败');};
        let kconfObj = JSON.parse(decrypted);
        let uaValue = kconfObj.ua || kconfObj.config?.ua || '';
        let uaPart1 = Crypto.MD5(uaValue).toString();
        let uaPart2 = '0000000000000000';
        let uaPart3 = Crypto.MD5('a.' + Math.floor(new Date().getTime())).toString();
        kparam.headers.ua = uaPart1 + uaPart2 + uaPart3;
        kparam.headers.version = kconfObj.config.versionName;
        kparam.hukey = kconfObj.config.hulue.split('&')[0];
        kparam.playerinfos = kconfObj.playerinfos;
    } catch (e) {
        throw new Error();
    }
};

async function home(filter) {
    try {
        let ktypeObj = await getdata('/api.php/v1.home/types');
        let classes = ktypeObj.data.types.slice(1).map((item) => { return {type_name: item.type_name, type_id: item.type_id}; });
        let filters = {};
        let nameObj = { type_list: 'class,剧情', area_list: 'area,地区', lang_list: 'lang,语言', year_list: 'year,年份', rank_list: 'by,排序' };
        for (let it of classes) {
            let kflObj = await getdata(`/api.php/v1.classify/types?type_id=${it.type_id}`);
            let kflArr = Object.keys(kflObj.data);
            let filter_data = [];
            if (kflArr && kflArr.length) {
                filter_data = kflArr.map((jit) => {
                    let [kkey, kname] = nameObj[jit].split(',');
                    let kval = kflObj.data[jit];
                    let kvalue = (kval && kval.length) ? kval.map((item) => { return {n: item.type_name, v: item.type_name}; }) : [];
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
        let ktypeObj = await getdata('/api.php/v1.home/types');
        let hoVid = ktypeObj.data.types[0].type_id;
        let khomeObj = await getdata(`/api.php/v1.home/data?type_id=${hoVid}`);
        let VODS = khomeObj.data?.banners || [];
        (khomeObj.data?.verLandList || []).forEach((item) => { if (Array.isArray(item.vertical_lands) && item.vertical_lands.length) { VODS = VODS.concat(item.vertical_lands);};});
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
            type: extend?.class || '全部类型',
            area: extend?.area || '全部地区',
            lang: extend?.lang || '全部语言',
            year: extend?.year || '全部年代',
            rank: extend?.by || '最新',
            page: pg
        };
        let kcateObj = await getdata(`/api.php/v1.classify/content`, fbody, 'post');
        let VODS = kcateObj.data?.video_list || [];
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
        let ksechObj = await getdata(`/api.php/v1.search/data?wd=${wd}&type_id=0&page=${pg}`);
        let VODS = ksechObj.data?.search_data || [];
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
        let kdetlObj = await getdata(`/api.php/v1.player/details?vod_id=${id}`);
        let kvod = kdetlObj.data?.detail;
        if (!kvod) {throw new Error();};
        let ktabs = kvod.play_url_list.map((it,idx) => { return `👶线${idx+1}-${it.show}`; });
        let kurls = kvod.play_url_list.map((item) => {
            let kurl = item.urls.map((it) => { return `${it.name}$${item.from}@${it.url}`; });
            return kurl.join('#');
        });
        let VOD = {
            vod_id: kvod.vod_id,
            vod_name: kvod.vod_name,
            vod_pic: kvod.vod_pic,
            type_name: kvod.vod_class || '未提供',
            vod_remarks: kvod.vod_remarks || '未提供',
            vod_year: kvod.vod_year || '20xx',
            vod_area: kvod.vod_area || `评分_${kvod.vod_score}`,
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
        let res = '', kp = 0;
        if (cachedPlayUrls[id]) {return cachedPlayUrls[id];};
        let [kfrom, kurl] = id.split('@');
        if (/\.(m3u8|mp4|mkv)/.test(kurl)) {
            kurl = kurl;
        } else if (/zhibo|lunbo|dplayer/.test(kfrom)) {
            kurl = kurl;
        } else if (/jplink/.test(kfrom)) {
            let kids = kurl.split('-');
            kurl = `https://m.jiabaide.cn/api/mw-movie/anonymous/v2/video/episode/url?clientType=3&id=${kids[1]}&nid=${kids[2]}`;
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
            let kit = kparam.playerinfos.find((it) => it.playername === kfrom);
            let kparse = decryptAes(kit.playerjiekou, kparam.hukey);
            if (!kparse) {
                kurl = kurl;
                kp = 1;
            } else if (/^http/.test(kparse)) {
                kurl = kparse + kurl;
                res = await request(kurl, def_header);
                kurl = JSON.parse(res).url;
            } else {
                let furl = `${HOST}/shark/api.php?action=parsevod`;
                let fbody = { 
                    parse: kparse,
                    url: kurl,
                    matching: '' 
                };
                res = await request(furl, { ...kparam.headers, 'Content-Type': 'application/x-www-form-urlencoded' }, fbody, 'post');
                let decrypted = decryptAes(res, kparam.keys[0]) || decryptAes(res, kparam.keys[1]);
                if (!decrypted) {throw new Error('解密失败');};
                kurl = JSON.parse(decrypted).url;
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