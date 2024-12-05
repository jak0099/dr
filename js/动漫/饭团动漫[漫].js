//永久地址 https://fantuantv.com/
var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'饭团动漫[漫]',
  host:'https://acgfta.com',
  url:'/ft/recent/file/fyclass/page/fypage.html',
  searchUrl:'/search/page/fypage/wd/**.html',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'.navbar-nav li;a&&Text;a&&href;.*/(.*?)\.html',
  cate_exclude:'漫画|永久地址',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'*',
  一级:'body .position-relative;.anime-cover&&alt;.anime-cover&&data-src;p&&Text;.stretched-link&&href',
  二级:{
    title:'h6&&Text;p:eq(1)&&Text',
    img:'.anime-cover&&data-src',
    desc:'.py-3:gt(0):lt(2)&&Text',
    content:'.overflow-auto&&Text',
    tabs:'.nav-pills li',
    lists:'.tab-content:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'*',
}