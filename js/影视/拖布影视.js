var rule = {
author: '小可乐/2503/第一版',
title: '拖布影视',
类型: '影视',
host: 'https://www.rainvi.com',
hostJs: '',
headers: {'User-Agent': MOBILE_UA},
编码: 'utf-8',
timeout: 5000,

homeUrl: '/',
url: '/index.php/vod/show/id/fyclassfyfilter.html',
filter_url: '{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
searchUrl: '/index.php/ajax/suggest?mid=1&wd=**&page=fypage&limit=30',
detailUrl: 'index.php/vod/detail/id/fyid.html',

limit: 9,
double: false,
class_name: '电影&剧集&综艺&动画',
class_url: '1&2&3&4',
filter_def: {},
图片来源: '@Referer=https://www.rainvi.com@User-Agent=Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',

推荐: '*',
一级: $js.toString(() => {
let klists = pdfa(fetch(input), '.vod-list-item');
VODS = [];
klists.forEach((it) => {
    VODS.push({
        vod_name: pdfh(it, 'a&&title'),
        vod_pic: pd(it, 'img&&data-src', 'https://cdn.yansk.cn'),
        vod_remarks: pdfh(it, 'span:eq(1)&&Text'),
        vod_year: pdfh(it, 'span:eq(0)&&Text'),
        vod_id: pdfh(it, 'a&&href')
    })
})
}),
搜索: 'json:list;name;pic;en;id',
二级: $js.toString(() => {
let khtml = fetch(input);
let ktabs = pdfa(khtml, '.tab-head&&a').map((it) => { return '👶' + pdfh(it, 'body&&Text') });
let kurls = pdfa(khtml, '.tab-body-item').map((item) => {
    let kurl = pdfa(item, 'a').map((it) => { return pdfh(it, 'body&&Text') + '$' + pd(it, 'a&&href', input).split('#')[0] });
    return kurl.join('#')
});
VOD = {
    vod_id: input,
    vod_name: pdfh(khtml, '.title&&Text'),
    vod_pic: pd(khtml, '.image&&img&&src', 'https://cdn.yansk.cn'),
    type_name: pdfh(khtml, '.tags&&a:eq(0)&&Text'),
    vod_remarks: pdfh(khtml, '.subtitle:eq(0)&&Text'),
    vod_year: pdfh(khtml, '.tags&&a:eq(1)&&Text'),
    vod_area: pdfh(khtml, '.tags&&a:eq(2)&&Text'),
    vod_lang: pdfh(khtml, '.tags&&a:eq(-1)&&Text'),
    vod_director: pdfh(khtml, '.subtitle:eq(1)&&Text'),
    vod_actor: pdfh(khtml, '.subtitle:eq(2)&&Text'),
    vod_content: pdfh(khtml, '.subtitle:eq(3)&&Text'),
    vod_play_from: ktabs.join('$$$'),
    vod_play_url: kurls.join('$$$')
}
}),

play_parse: true,
lazy: $js.toString(() => {
let kcode = JSON.parse(fetch(input).split('aaaa=')[1].split('<')[0]);
let kurl = decodeURIComponent(base64Decode(kcode.url));
if (/\.(m3u8|mp4)/.test(kurl)) {
    input = { jx: 0, parse: 0, url: kurl, header: rule.headers }
} else {
    input = { jx: 0, parse: 1, url: input }
}
}),

filter: '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'
}