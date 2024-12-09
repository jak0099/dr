Object.assign(muban.首图.二级,{
    tabs: 'ul.nav li',
    lists: '.myui-content__list:eq(#id)&&li',
});
var rule = {
  模板:'首图',
  title: '泡泡影视',
  host: 'https://www.wxnlm.com',
  url: '/vodtype/fyclass-fypage.html',
  searchUrl: '/vodsearch/**----------fypage---.html',
  class_parse: '.item&&li:gt(0):lt(5);a&&Text;a&&href;.*/(.*?)\.html',
}