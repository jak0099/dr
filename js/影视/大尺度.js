var rule = {
    类型: '影视', //影视|听书|漫画|小说
    title: '大尺度',
    host: 'http://dachidz.com',
    url: '/vodshow/fyclass------fypage.html',
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
    limit:6,
    class_parse: '.dcd-header__menu li;a&&Text;a&&href;/(\\d+)\.html',
    cate_exclude: '',
    play_parse: true,
    lazy: $js.toString(() => {
        input = {
            parse: 1,
            url: input,
            js: ''
        };
    }),
    double: true,
    推荐: 'ul.dcd-vodlist.clearfix;li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href',
    一级: '.dcd-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    二级: {
        title: '.dcd-content__thumb .lazyload&&alt;.dcd-content__detail&&p:eq(-2)&&a&&Text',
        title1: '.dcd-content__detail .title&&Text;.dcd-content__detail&&p&&Text',
        img: '.dcd-content__thumb .lazyload&&data-original',
        desc: '.dcd-content__detail p&&Text;.dcd-content__detail&&p:eq(-2)&&a:eq(2)&&Text;.dcd-content__detail&&p:eq(-2)&&a:eq(1)&&Text;.dcd-content__detail p:eq(2)&&Text;.dcd-content__detail p:eq(1)&&Text',
        desc1: '.dcd-content__detail p:eq(4)&&Text;;;.dcd-content__detail p:eq(1)&&Text',
        content: '.detail&&Text',
        tabs: '.dcd-pannel__head h3',
        tabs1: '.dcd-vodlist__head h3',
        lists: '.dcd-content__playlist:eq(#id) li:gt(0)',
    },
    搜索: 'ul.dcd-vodlist__media,ul.dcd-vodlist,#searchList li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href;.detail&&Text',
}