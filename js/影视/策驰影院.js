var rule = {
    类型: '影视',//影视|听书|漫画|小说
    title: '策驰影院',
    host: 'https://www.ccy1.com',
    url: '/category/fypage/fyclass/fyfilter',
    searchUrl: '/search/index.html?keyword=**&page=fypage',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    filter: {
        '77': [{ key: '分类', name: '分类', value: [{ n: '全部 ', v: '0', }, { n: '动作片 ', v: '85', }, { n: '喜剧片 ', v: '86', }, { n: '爱情片 ', v: '87', }, { n: '恐怖片 ', v: '88', }, { n: '剧情片 ', v: '89', }, { n: '科幻片 ', v: '90', }, { n: '惊悚片 ', v: '91', }, { n: '奇幻片 ', v: '92', }, { n: '动画片 ', v: '93', }, { n: '悬疑片 ', v: '94', }, { n: '冒险片 ', v: '95', }, { n: '纪录片 ', v: '96', }, { n: '战争片 ', v: '97', }, { n: '影视解说 ', v: '162', },], }, { key: '年份', name: '年份', value: [{ n: '全部', v: '0', }, { n: '80年代', v: '42', }, { n: '90年代', v: '43', }, { n: '00年代', v: '44', }, { n: '10年代', v: '45', }, { n: '20年代', v: '46', },], },],
        '78': [{ key: '分类', name: '分类', value: [{ n: '全部 ', v: '0', }, { n: '国产剧 ', v: '98', }, { n: '香港剧 ', v: '99', }, { n: '台湾剧 ', v: '100', }, { n: '欧美剧 ', v: '101', }, { n: '日本剧 ', v: '102', }, { n: '韩国剧 ', v: '103', }, { n: '泰国剧 ', v: '104', }, { n: '海外剧 ', v: '105', },], }, { key: '年份', name: '年份', value: [{ n: '全部', v: '0', }, { n: '80年代', v: '42', }, { n: '90年代', v: '43', }, { n: '00年代', v: '44', }, { n: '10年代', v: '45', }, { n: '20年代', v: '46', },], },],
        '79': [{ key: '分类', name: '分类', value: [{ n: '全部 ', v: '0', }, { n: '大陆综艺 ', v: '106', }, { n: '港台综艺 ', v: '107', }, { n: '日韩综艺 ', v: '108', }, { n: '欧美综艺 ', v: '109', }, { n: '海外综艺 ', v: '110', },], }, { key: '年份', name: '年份', value: [{ n: '全部', v: '0', }, { n: '80年代', v: '42', }, { n: '90年代', v: '43', }, { n: '00年代', v: '44', }, { n: '10年代', v: '45', }, { n: '20年代', v: '46', },], },],
        '80': [{ key: '分类', name: '分类', value: [{ n: '全部 ', v: '0', }, { n: '国产动漫 ', v: '111', }, { n: '日本动漫 ', v: '112', }, { n: '欧美动漫 ', v: '113', }, { n: '海外动漫 ', v: '114', },], }, { key: '年份', name: '年份', value: [{ n: '全部', v: '0', }, { n: '80年代', v: '42', }, { n: '90年代', v: '43', }, { n: '00年代', v: '44', }, { n: '10年代', v: '45', }, { n: '20年代', v: '46', },], },],
    },
    filter_url: '{{fl.分类}}/{{fl.年份}}',
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    timeout: 5000,
    class_parse: '.head-nav li;a&&Text;a&&href;/./(\\d+)/',
    play_parse: true,
    lazy: $js.toString(() => {
        input = { parse: 1, url: input, js: '' };
    }),
    double: true,
    推荐: '*',
    一级: '.public-list-box;.lazy&&alt;img.lazy&&src||data-src;.public-list-prb&&Text;.public-list-div a&&href;.public-list-subtitle&&Text',
    二级: {
        title: 'h3&&Text;.slide-info:eq(-2)&&Text',
        img: '.detail-pic img&&src||data-src',
        desc: '.slide-info:eq(-1)&&Text;.slide-info:eq(0)&&Text;.deployment span:eq(2)&&Text;.slide-info:eq(2)&&Text;.slide-info:eq(1)&&Text',
        content: '.text.cor3&&Text',
        tabs: '.anthology-tab a',
        lists: '.anthology-list-play:eq(#id)&&a',
        tab_text: 'body&&Text',
        list_text: 'body&&Text',
        list_url: 'a&&href',
        list_url_prefix: '',
    },
    搜索: '.public-list-box;.vod-title&&title;img.lazy&&src||data-src;.vod-sub-text&&Text;.public-list-bj a&&href;.cor5.thumb-blurb.hide2&&Text',
}