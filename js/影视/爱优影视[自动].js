var rule = {
    模板: '自动',
    title: '爱优影视[自动]',//规则标题
    host: 'https://iuys.cc',//网页的域名根,包含http头如 https://www,baidu.com
    url: '/vodtype/fyclass-fypage.html',//网站的分类页面链接
    class_parse: '.myui-header__menu li.hidden-sm:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',//动态分类获取 列表;标题;链接;正则提取 不需要正则的时候后面别加分号
    searchUrl: '/vodsearch/**----------fypage---.html',//搜索链接 可以是完整路径或者相对路径,用于分类获取和推荐获取 **代表搜索词 fypage代表页数

}