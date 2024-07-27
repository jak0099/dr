var rule = {
    title: '剧巴巴',
    host: 'http://jubaba.me',
    url: '/vodshow/fyclass--------fypage---.html',
    searchUrl: '/vodsearch/**----------fypage---.html',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    filter: '',
    filter_url: '',
    filter_def: {},
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    timeout: 5000,
    class_parse: '.swiper-wrapper&&li;a&&Text;a&&href;(\\d+)',
    cate_exclude: '',
    play_parse: true,
    lazy: $js.toString(() => {
        input = {
            parse: 1,
            url: input,
            js: 'document.querySelector("#playleft iframe").contentWindow.document.querySelector("#start").click()',
        }
    }),
    double: true,
    推荐: '*',
    一级: 'body&&.ewave-vodlist__box;.lazyload&&title;.lazyload&&data-original;.text-right&&Text;a&&href;.text-muted&&Text',
    二级: {
        title: 'h1&&Text;.ewave-content__detail&&p&&Text',
        img: 'img&&data-original',
        desc: '.text-right&&Text;.ewave-content__detail&&p&&Text;.ewave-content__detail&&p&&Text;.ewave-content__detail&&p:eq(2)&&Text;.ewave-content__detail&&p:eq(3)&&Text',
        content: '.desc.hidden-xs&&Text',
        tabs: '.nav-tabs&&a',
        lists: '.ewave-content__playlist:eq(#id)&&a'
    },
    搜索: '.ewave-vodlist__media&&li;*;*;*;*;*',
}