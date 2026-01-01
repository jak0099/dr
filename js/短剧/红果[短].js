var rule = {
author: '小可乐/v5.9.1',
title: '红果短剧',
类型: '影视',
host: 'https://api.cenguigui.cn',
hostJs: '',
headers: {'User-Agent': MOBILE_UA},
编码: 'utf-8',
timeout: 5000,

homeUrl: '/api/duanju/api.php?name=新剧',
url: '/api/duanju/api.php?name=fyclass&page=fypage',
filter_url: '',
searchUrl: '/api/duanju/api.php?name=**&page=fypage',
detailUrl: '/api/duanju/api.php?book_id=fyid',

limit: 9,
double: false,
class_name: '系统&重生&复仇&志怪&抗战&下乡&古代&穿越&战神&仙侠&逆袭&女帝&神医&总裁&萌宝&都市',
class_url: '系统&重生&复仇&志怪&抗战&下乡&古代&穿越&战神&仙侠&逆袭&女帝&神医&总裁&萌宝&都市',
filter_def: {},

推荐: '*',
一级: $js.toString(() => {
    let kvods = JSON.parse(fetch(input)).data;
    VODS = [];
    kvods.forEach((it) => {
        VODS.push({
            vod_name: it.title,
            vod_pic: it.cover,
            vod_remarks: it.type,
            vod_id: `${it.book_id}@${it.author}`
        })
    })
}),
搜索: '*',
二级: $js.toString(() => {
    let [kid, kactor] = input.split('@');
    let kdetail = JSON.parse(fetch(kid));
    let kvod = kdetail.data;
    let kurls = kvod.map((it) => { return `${it.title}$${it.video_id}` }).join('#');
    VOD = {
        vod_id: kid,
        vod_name: kdetail.book_name,
        vod_pic: kdetail.book_pic,
        type_name: kdetail.category,
        vod_remarks: `共${kdetail.total}集-${kdetail.duration}`,
        vod_year: kdetail.time,
        vod_area: '中国',
        vod_lang: '国语',
        vod_director: kdetail.author,
        vod_actor: kactor,
        vod_content: kdetail.desc,
        vod_play_from: '红果专线',
        vod_play_url: kurls
    }
}),

play_parse: true,
lazy: $js.toString(() => {
    let kurl = `${HOST}/api/duanju/api.php?video_id=${input}`;
    kurl = JSON.parse(fetch(kurl)).data.url;
    input = { parse: 0, url: kurl, header: rule.headers }
}),

filter: {}
}