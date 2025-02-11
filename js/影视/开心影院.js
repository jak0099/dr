muban.首图.二级.tabs = '.nav-tabs li';
var rule = {
    模板: '首图',
    title: '开心影院',
    host: 'https://www.szhsjsj.com',
    url: '/zixun/fyclass-fypage.html',
    searchUrl: '/search/**----------fypage---.html',
    class_parse: '.myui-header__menu li.visible-inline-lg:gt(0):lt(5);a&&Text;a&&href;/(\\d+).html',
}