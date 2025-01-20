muban.首图2.二级.tabs = '.nav-tabs li';
var rule = {
  模板:'首图2',  
  title: '齐鲁电影',
  host: 'https://m.gdwagc.com',
  url: '/vodshow/fyclass--------fypage---.html',
  searchUrl: '/vodsearch/**----------fypage---.html',
  class_parse: '.stui-header__menu li:gt(0):lt(10);a&&Text;a&&href;.*/(\\d+).html',
  cate_exclude:'脑洞悬疑',
 }