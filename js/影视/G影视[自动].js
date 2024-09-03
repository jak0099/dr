var rule = {
    模板: 'mxpro',
    title: 'G影视[自动]',
    host: 'https://yigeg.pro',
    url: '/vodshow/fyclass--------fypage---.html',
    二级: {
        title: 'h1&&Text;.module-info-tag-link:eq(-1)&&Text',
        img: '.lazyload&&data-original||data-src||src',
        desc: '.module-info-item:eq(-2)&&Text;.module-info-tag-link&&Text;.module-info-tag-link:eq(1)&&Text;.module-info-item:eq(2)&&Text;.module-info-item:eq(1)&&Text',
        content: '.module-info-introduction&&Text',
        tabs: '.module-tab-items-box&&.tab-item',
        lists: '.module-play-list:eq(#id) a',
        tab_text: 'div--small&&Text',
    },
    searchUrl: '/vodsearch/**----------fypage---.html',
    搜索: '*'
}