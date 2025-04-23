//筛选&搜索有验证，无能力做静态筛选了
Object.assign(muban.首图2.二级,{
    tabs: '.stui-pannel__head li',
});
var rule = {
    模板:'首图2',
    title: '短剧网',
    host: 'https://www.hbtdhd.com',
    url: '/fenlei-fyclass-fypage/',
    searchUrl: '/vodsearch/**----------fypage---/',
    class_parse: '.stui-header__menu li:gt(0):lt(7);a&&Text;a&&href;(\\d+)/',           
    搜索验证标识:'系统安全验证',
}