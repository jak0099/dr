var rule = {
author: '集多/240714/第一版',
title: '暮薇短剧[短]',
类型: '影视',
host: 'https://muweimv.com',
hostJs: '',
headers: {'User-Agent': 'MOBILE_UA'},
编码: 'utf-8',
timeout: 5000,

homeUrl: '/t/短剧',
url: '/t/fyclass?page=fypage',
filter_url: '',
detailUrl: '',
searchUrl: '/search?q=**&page=fypage',
searchable: 1, 
quickSearch: 1, 
filterable: 1, 

class_name: '短剧',
class_url: '短剧',
filter_def: {},

play_parse: true,
parse_url: '',
lazy: `js:
let khtml=request(input, {headers:{"User-Agent":MOBILE_UA}});
let kurl = khtml.match(/<source src="(.*?)"/)[1];
if (/m3u8|mp4/.test(kurl)) {
input = { jx: 0, parse: 0, url: kurl };
} else {
input = { jx: 0, parse: 1, url: kurl };
}
`,

limit: 9,
double: false,
推荐: '*',
一级: `js:
let klist=pdfa(request(input),'.col-span-4:has(.text-sm)');
let k=[];
klist.forEach(it=>{
    k.push({
        title: pdfh(it,'.text-sm&&Text'),
        pic_url: HOST+pdfh(it,'img&&src'),
        desc: '✨集多推荐✨',
        url: pdfh(it,'a&&href')
    })
});
setResult(k)
`,
二级: `js:
let html = request(input);
VOD = {};
VOD.vod_id = input;
VOD.vod_name = pdfh(html, 'h2&&Text');
VOD.type_name = html.match(/类型.*?<a.*?>(.*?)<\\/a/)[1];
VOD.vod_pic = HOST + pdfh(html, 'img:eq(0)&&src');
VOD.vod_remarks = html.match(/时间.*?>(.*?)<\\/span/)[1];
VOD.vod_year = html.match(/时间.*?>(.*?)\\./)[1];
VOD.vod_area = pdfh(html, '.text-base:eq(2)&&span&&Text');
VOD.vod_director = pdfh(html, '.text-base:eq(4)&&span&&Text');
VOD.vod_actor = pdfh(html, '.text-base:eq(5)&&span&&Text');
VOD.vod_content = pdfh(html, '.break-words&&Text');

let v_tabs = pdfa(html, '.gap-x-4:eq(0)&&a');
let v_tab = v_tabs.map(it => pdfh(it, 'a&&Text'));
VOD.vod_play_from = v_tab.join('$$$');

let lists = [];
let v_tab_urls = v_tabs.map(it => pd(it, 'a&&href', input));
let htmls=v_tab_urls.map((it) =>{return request(it, {headers:{"User-Agent":MOBILE_UA}})});   
htmls.forEach((ht) => {
    if (ht) {
        let list0 = pdfa(ht, '.gap-x-4:eq(1)&&a').map(it => pdfh(it, 'a&&Text') + '$' + pd(it, 'a&&href', input));
        lists.push(list0);
    } else {
        lists.push([]);
    }
});
let playUrls = lists.map(it => it.join('#'));
VOD.vod_play_url = playUrls.join('$$$')
`,
搜索: '*',

filter: {}
}