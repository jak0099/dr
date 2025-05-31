globalThis.YanZheng = function (url, sbody,yzm_url, submit_url) {
    let cnt = 0;
    let host = getHome(url);
    let cookie = '';
    yzm_url = yzm_url || `${host}/index.php/verify/index.html`;
    submit_url = submit_url || `${host}/index.php/ajax/verify_check`;
    sbody = sbody || 'type=search&verify=';
    while (cnt < 3) {
        try {        
            let yhtml = request(yzm_url, {
                withHeaders: true,
                toBase64: true
            }, true);
            let yjson = JSON.parse(yhtml);
            if (!cookie) {
                let setCk = Object.keys(yjson).find(it => it.toLowerCase() === 'set-cookie');
                cookie = setCk ? yjson[setCk].split(';')[0] : ''
            }
            let code = OcrApi.classification(yjson.body);           
            let shtml = request(submit_url, {
                headers: {Cookie: cookie},
                method: 'POST',
                body: sbody + code,
            });
            sjson = JSON.parse(shtml);
            if (sjson.msg === 'ok') {
                return cookie
            } else if (sjson.msg !== 'ok' && cnt + 1 >= 3) {
                cookie = ''
            }
        } catch (e) {
            console.log(`第${cnt+1}次验证码提交失败:${e.message}`);
            if (cnt + 1 >= 3) { cookie = '' }
        };
        cnt += 1
    }
    return cookie
}
var rule = {
author: '小可乐/2503/第二版',
title: '剧爷爷',
类型: '影视',
host: 'https://www.juyeye.cc',
hostJs: '',
headers: {'User-Agent': 'MOBILE_UA'},
编码: 'utf-8',
timeout: 5000,

homeUrl: '/',
url: '/vodshow/fyclass-fyfilter.html',
filter_url: '{{fl.area}}-{{fl.by}}-{{fl.class}}-{{fl.lang}}-{{fl.letter}}---fypage---{{fl.year}}',
detailUrl: '',
searchUrl: '/vodsearch/**----------fypage---.html',
searchable: 1, 
quickSearch: 1, 
filterable: 1, 

limit: 9,
double: false,
class_name: '电影&剧集&综艺&动漫&更新',
class_url: '1&2&3&4&new',
filter_def: {},

play_parse: true,
lazy: $js.toString(() => {
let js = `
try {
    function requestApix(callback) {
        $.post(\"api.php\", {vid: getQueryString(\"vid\")}, function(result){callback(result.data.url)}, \"json\")
    }; 
    requestApix( function(data) { location.href=sign(data) } )
} catch(e) {};
location.href = document.querySelector(\"#playleft iframe\").src`;
input = { parse: 1, url: input, click: js, js: js }
}),

推荐: '.module-item;img&&alt;img&&data-original;.module-item-note&&Text;a&&href',
一级: `js:
let khtml = request(input);
if (/需要输入验证码/.test(khtml)) {
    let sbody = 'type=show&verify=';
    let cookie = YanZheng(input, sbody);
    khtml = request(input, {headers: {Cookie: cookie} })
};
VODS = [];
let klist = pdfa(khtml, '.module-item');
klist.map((it) => {
    VODS.push({
        vod_name: pdfh(it, 'img&&alt'),
        vod_pic: pdfh(it, 'img&&data-original'),
        vod_remarks: pdfh(it, '.module-item-note&&Text'),
        vod_id: pdfh(it, 'a&&href')
    })
})
`,
二级: {
title: 'h1&&Text;.module-info-tag-link:eq(-1)&&Text',
img: '.ls-is-cached&&data-original',
desc: '.module-info-item-content:eq(-1)&&Text;.module-info-tag-link:eq(0)&&Text;.module-info-tag-link:eq(1)&&Text;.module-info-item-content:eq(2)&&Text;.module-info-item-content:eq(0)&&Text',
content: '.module-info-introduction-content&&Text',
tabs: '.tab-item',
tab_text: 'span&&Text',
lists: '.module-play-list:eq(#id)&&a',
list_text: 'body&&Text',
list_url: 'a&&href'
},
搜索: `js:
let khtml = request(input);
if (/需要输入验证码/.test(khtml)) {
    let cookie = YanZheng(input);
    khtml = request(input, {headers: {Cookie: cookie} })
};
VODS = [];
let klist = pdfa(khtml, '.module-item');
klist.map((it) => {
    VODS.push({
        vod_name: pdfh(it, 'img&&alt'),
        vod_pic: pdfh(it, 'img&&data-original'),
        vod_remarks: pdfh(it, '.module-item-note&&Text'),
        vod_id: pdfh(it, 'a&&href')
    })
})
`,

filter: 'H4sIAAAAAAAAA+2ZW08bRxTH3/kYfqbSLtAkzVvu9/s9UR7cyGqjUioBbYUQEmBMDAm2QQTHtbk13EIxmEspmBp/Gc+u/S069pyb27KyWtoX9s2//9mZnXNmd+bv2d6mgB04+6KpN/BNqCdwNvCqPdjVFWgOdAS/DWlUI8tOOKL5h2D791p40RvoqMqRlUp4pSprCPQ1gzqV0deDCoAxN7oJHTFgzBlIOP1TEAOgPkdXSoUM9mmA+lweV/sH2KcBakcDZ6D7RT+U8iN4PwMYK2eX1LtViAHQ/UY33ALGAMQ43ckDHmcVKLb4hscJQGPJLpUO53AsBqjd8EQl9QnbGaB2M6t65NjOAMUG19ypcYwZoFh41Bn8CWMGKL+DuIrsYX4GMFaZnnA+LEIMgPqcelMeyWOfBiiHw3V38ldV2MQ0iOmK+EL5I82UAYrFhlV8C2MGaKaKCV1nnCkDXLmMMz1OlasBxYaK7i+YCQBVoDDuHmTqBlwn9b3sa6ZXJdgZCoo3JZNT7/KNvikLy5XUMI7BAFV6KeXsbWClDXCtcs7+IdWqBjT2w5hKF3DUBmiGtt9zDIDq+HaTYwDULrnoZNawnQEa5+wnbgfAs/4bxwB4LDk5llxdu7Gcyi9hOwPUbiiuK6Wi+EIwUyaLRTeedUdSmAwxv6VzztuibkYvKjJdEdktHeBaBFA36+3Bjq941ssb2fJKf6Ozni7o67FvA2IWOAZAM7u1wDEAmoVkQY0lOcws5kmEDYj55RiAeGZEzICYX5GJAVFBtR7mClahroI9oWAnV9BJ7laSOw1WsMVq+Ry02k+ht7HeJvVW1lul3sJ6i9Rt1m2pW6xbQre/IF3/FPoZ1s9I/TTrp6V+ivVTUud8bZmvzfnaMl+b87Vlvjbna8t8bc7XlvnanK8t87U4X0vma3G+lszX4nwtma/F+VoyX4vztWS+Fuerf9a/kaHu7pB4olQ26WyMNfhEnQPhHCnnQTlPygVQLpByEZSLpFwC5RIpl0G5TMoVUK6QchWUq6RcA+UaKddBuU7KDVBukHITlJuk3ALlFim3QblNyh1Q7pByF5S7pNwD5R4p90G5T8oDUB6Q8hCUh6Q8AuURKY9BeUzKE1CekPIUlKekPAPlGSnPQXlOivUZPqTVX3XPypc9YuWJTah8/C/PCS9IGrpf60ux31I+7+QmIfL16+4uXr03hlQU9/OuV991hqq3bXrZ3BRoOTZ37eGTvBytMWtqYFeF43X+DaRG3Lta31V5Wu8NNOiKj3TvXq7Yy717eUIvB1van2dPCMCuOOKk0HMB0P3eD7PTBhB+kWsG0LCT+Df+cTiiryd/W4NGfNk/9ZZePtDbdx7t9Tx951ROWzM1PU9/KpB9n/Znn+b7Ld9v+X7L91u+36r5rdbj8luV/hF3uR/XYwPSLwzNCr+ggca2XiznorhDGKB2E1lnFM+eAHiNjzh76F0AeG/YLu0naG+ogdh/Kx9xLAAUy6+q9RmMGaD7pbfEqZ0Bajc56+zQyaoBare350TjpfwEn77VSVSHnZ+1A8M6GKA+NgfLA++wtYH/wxtpv6OdDY26BmKP1bsu77FVoNjasq4sxgz4bsN3G77b8N2G7zZOsNtoOy634eUovL5zuuFseR5dCgD1GVtxEzhuAIolZtw1+kZogHfQo787lhPT5RieNAFQn3PzKk37hgHq0+MkyMnkxbdMA3Q/j698XqdeKqfLhPMMIGOL2yKmgeq5cFj6Hb+PAlC72KyKprGdAX56tlQWHRoA9ZkedVLotAC4LpuqmKS61EDstf/dCVK6UMrTaZ8Bsf8fedrzt06o0fH6Lsl3Sb5L8l1SwHdJJ8oldYR+lD7JX/z8xc9f/PzF7wQsfk19fwDpInn2YSsAAA=='
}