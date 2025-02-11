Object.assign(muban.首图.二级, {
    desc: '.myui-content__detail p.data:eq(0)&&Text;.year&&Text;.myui-content__detail p.data:eq(1)&&Text;.myui-content__detail p.data:eq(2)&&Text;.myui-content__detail p.data:eq(3)&&Text',                
    content:'.myui-content__detail p.data:eq(4)&&Text',
    tabs: '.myui-panel__head li',
});
var rule = {
    模板: '首图',
    title: 'CGwall',
    host: 'http://www.cgwall.cn',
    url: '/zixun/fyclass-fypage.html',
    searchUrl: '/search/**----------fypage---.html',
    class_parse: '.myui-header__menu li.visible-inline-lg:gt(0):lt(7);a&&Text;a&&href;/(\\d+).html',
    cate_exclude: '伦理剧|微视频',
}