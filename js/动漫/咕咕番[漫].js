//咕咕番发布页：gugu01.cc
var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'咕咕番[漫]',
  host:'https://www.gugu3.com',
  url:'/index.php/vod/show/id/fyclass.html',
  searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'PC_UA',
  },
  timeout:5000,
  class_parse:'.head-nav li;a&&Text;a&&href;/(\\d+)\.html',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'.public-list-div a:gt(4);a;.public-list-exp&&title;.lazy&&data-src;.public-list-prb&&Text;a&&href',
  一级:'.public-list-div a:gt(4);.public-list-exp&&title;.lazy&&data-src;.public-list-prb&&Text;a&&href',
  二级:{
    title:'h3&&Text;.gen-search-form span:eq(1)&&Text',
    img:'.lazy&&data-src',
    desc:'.slide-info:eq(3)&&Text;.slide-info a&&Text;.slide-info-remarks:eq(2)&&Text;.slide-info:eq(2)&&Text;.slide-info:eq(1)&&Text',
    content:'.top26&&Text',
    tabs:'.anthology-tab a',
    lists:'.anthology-list-play:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'.public-list-box;.thumb-txt&&Text;.lazy&&data-src;.public-list-prb&&Text;a&&href',
}