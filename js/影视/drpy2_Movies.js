var rule = {
    author: '小可乐/240601/第一版',
    title: 'Movies',
    类型: '影视',
    host: 'https://citytv.cc',
    hostJs: '',
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    编码: 'utf-8',
    timeout: 5000,

    homeUrl: '/',
    url: '/tvs/fyfilter.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    detailUrl: '',
    searchUrl: '/wd/**/page/fypage/',
    searchable: 1,
    quickSearch: 1,
    filterable: 1,

    class_name: '电影&剧集&综艺&动漫&短剧',
    class_url: 'dianying&dianshiju&zongyi&dongman&duanju',
    filter_def: {
        dianying: {
            cateId: 'dianying'
        },
        dianshiju: {
            cateId: 'dianshiju'
        },
        zongyi: {
            cateId: 'zongyi'
        },
        dongman: {
            cateId: 'dongman'
        },
        duanju: {
            cateId: 'duanju'
        }
    },

    tab_order: ['奇异云播', '神马云播', '百度云播'],
    play_parse: true,
    parse_url: '',
    lazy: `js:
var kcode = JSON.parse(request(input).match(/var player_.*?=(.*?)</)[1]);
var kurl = kcode.url;
if (/m3u8|mp4/.test(kurl)) {
input = { jx: 0, parse: 0, url: kurl }
} else {
input = { jx: 0, parse: 1, url: kurl }
}`,

    limit: 9,
    double: false,
    推荐: '*;*;*;*;*',
    一级: '.lazyload;a&&title;a&&data-original;.text-right:eq(-1)&&Text;a&&href',
    二级: {
        //名称;类型
        title: 'h1&&Text;.data:eq(0)&&Text',
        //图片
        img: '.pic&&img&&data-original',
        //主要描述;年份;地区;演员;导演
        desc: '.data:eq(1)&&Text;.data:eq(4)&&Text;.data:eq(2)&&Text;.data:eq(-1)&&Text;.data:eq(-2)&&Text',
        //简介
        content: '.detail-sketch&&Text',
        //线路数组
        tabs: '.nav-tabs a',
        //线路标题
        tab_text: 'body&&Text',
        //播放数组 选集列表
        lists: '.stui-content__playlist:eq(#id)&&a:not([rel])',
        //选集标题
        list_text: 'body&&Text',
        //选集链接
        list_url: 'a&&href',
        //链接处理
        list_url_prefix: ''
    },
    搜索: '*',

    filter: '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'
}