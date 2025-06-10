var rule = {
author: '小可乐/240701/第一版',
title: '辣椒短剧[短]',
类型: '影视',
host: 'https://www.wllajiaojiang.com',
hostJs: '',
headers: {'User-Agent': 'MOBILE_UA'},
编码: 'utf-8',
timeout: 5000,

homeUrl: '/',
url: '/index.php/vod/show/id/fyclass/fyfilter.html',
filter_url: '{{fl.by}}{{fl.letter}}/page/fypage{{fl.year}}',
detailUrl: '',
searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
searchable: 1, 
quickSearch: 1, 
filterable: 1, 

class_name: '抖音短剧&有声动漫&女频恋爱&反转爽剧&古装仙侠&年代穿越&脑洞悬疑&现代都市',
class_url: '5&33&34&35&36&37&38&39',
filter_def: {},

tab_rename: {'snm3u8': '索尼'},
play_parse: true,
parse_url: '',
lazy: `js:
var kcode = JSON.parse(request(input).match(/var player_.*?=(.*?)</)[1]);
var kurl = kcode.url;
if (/m3u8|mp4/.test(kurl)) {
input = { jx: 0, parse: 0, url: kurl }
} else {
input = { jx: 0, parse: 1, url: rule.parse_url+kurl }
}`,

limit: 9,
double: false,
推荐: `js:
let klist=pdfa(request(input),'.c2_cont:eq(4)&&.show_play');
let k=[];
klist.forEach(it=>{
    k.push({
        title: pdfh(it,'a&&title'),
        pic_url: pdfh(it,'.lazyload&&data-original'),
        desc: '✨集多推荐✨'+pdfh(it,'p&&Text'),
        url: pdfh(it,'a&&href'),    
        content: '',    
    })
});
setResult(k)
`,
一级: `js:
let klist=pdfa(request(input),'body&&.show_play');
let k=[];
klist.forEach(it=>{
    k.push({
        title: pdfh(it,'a&&title'),
        pic_url: pdfh(it,'.lazyload&&data-original'),
        desc: '✨集多推荐✨'+pdfh(it,'p&&Text'),
        url: pdfh(it,'a&&href'),    
        content: '',    
    })
});
setResult(k)
`,
二级: {
title: 'h1&&a&&Text;.yplx_c1&&span:eq(0)&&Text',
img: '.leftimg&&.lazyload&&data-original',
desc: '.yplx_c1&&span:eq(2)&&Text;.yplx_c1&&span:eq(4)&&Text;.yplx_c1&&span:eq(5)&&Text;.zy--em&&Text;.yplx_c1&&span:eq(1)&&Text',
content: '#content&&Text',
tabs: '.tab-switch',
tab_text: 'body&&Text',
lists: '.con_c2_list:eq(#id)&&a',
list_text: 'body&&Text',
list_url: 'a&&href'
},
搜索: '.result_list;a:eq(1)&&Text;*;li:eq(-2)&&span&&Text;a:eq(1)&&href',

filter: 'H4sIAAAAAAAAA+3XO0vDUBTA8T0f486RtEl9tFvf7/e7pUMrAYu1QhuFUAKF4qiCg11chS5FB3EQ/DiJ9Ft4Y+3h9rgIWc94zy/c3CH3D5lJ7JCFutKMnesmCzFT70+YzMb9C52vnOX7ZvnG19f90RUfdGdszMf2zWqzWLljvmCWvJ2qPjXwO1PcbZSfgaAaVk1UFasqqh+rn1k9S4Zzj3TD0IWT2+ul83L7z5OHd5tvd1HCIBEkEZAokihIDEkMJI4kDpJAkgBJIkmCpJCkQNJI0iAZJBmQLJIsSA5JDiSPJA9SQFIAKSIpgpSQlEDKSMogFSQVkCqSKkgNSQ2kjqQO0kDSAGkiaYK0kLRA2kjaIB0kHRDfQRCZO9m7AwNTuLl3D/bH/Z/v33maO4+vu40GpmIM+eO7d3C1nz8FnZ5eTvb4a7EW+GxoTN0jSD1ZYppGHaGOUEeoIx47EqCOUEeoI9QRjx2h/xrqCHWEOuK1I0fUEeoIdYQ64rEjx9QR6gh1hDrisSMn1BHqCHWEOuKxI0HqCHWEOkId8dARyfoGEyyHsEEiAAA='
}