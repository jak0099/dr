var rule = {
    title: '喵物次元',
    host: 'https://www.mwcy.net',
    模板: '短视2',
    searchUrl: '/catsearch/page/fypage/wd/**.html',
    url: '/catshow/fyclass/page/fypage.html',
    //searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    //url: '/index.php/api/vod#type=fyclassfyfilter&page=fypage',
    searchable: 2, //是否启用全局搜索,
    quickSearch: 1, //是否启用快速搜索,
    filterable: 0, //是否启用分类筛选,
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    play_parse: true,
    /*lazy: `js: var html = JSON.parse(request(input)
        .match(/r player_.*?=(.*?)</)[1]);
    var url = html.url;
    var from = html.from;
    var MacPlayerConfig = {};
    if (html.encrypt == '1') {
        url = unescape(url)
    } else if (html.encrypt == '2') {
        url = unescape(base64Decode(url))
    }
    if (/.m3u8|.mp4/.test(url)) {
        input = url
    } else {
        eval(fetch(HOST + "/static/js/playerconfig.js")
            .replace('var Mac', 'Mac'));
        var list = MacPlayerConfig.player_list[from].parse;
        input = {
            jx: 0,
            url: list + url,
            parse: 1,
            header: JSON.stringify({
                'referer': HOST
            })
        }
    }`,*/
    limit: 6,
    /*tab_rename: {
        '喵物次元': 'LR',
    },*/
    class_name: '日本动画&国产动漫&动漫电影&欧美动漫&4K专区',
    class_url: '1&24&2&25&26',
    double: false, // 推荐内容是否双层定位
    推荐: '*',
    一级: '.public-list-exp;a&&title;img&&data-src;.ft2&&Text;a&&href',
    搜索: '.public-list-box;.thumb-txt&&Text;.public-list-exp&&img&&data-src;.public-list-prb&&Text;a&&href'
}