var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'次元方舟[漫]',
  host:'https://www.cyfz.vip',
  url:'/vodshow/fyclass/page/fypage.html',
  searchUrl:'/search/page/fypage/wd/**.html',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'.swiper-wrapper li;a&&Text;a&&href;/(\\d+)\.html',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'.flex .public-list-div;a;*;*;*;*',
  一级:'.public-list-div a;.public-list-exp&&title;.lazy&&data-src;.ft2&&Text;.public-list-exp&&href',
  二级:{
    title:'h3&&Text;.slide-info:eq(1)&&Text',
    img:'.lazy&&data-src',
    desc:'.slide-info:eq(0)&&Text;.slide-info-remarks:eq(0)&&Text;.slide-info-remarks:eq(1)&&Text;.slide-info:eq(3)&&Text;.slide-info:eq(2)&&Text',
    content:'#height_limit&&Text',
    tabs:'.anthology-tab a',
    lists:'.anthology-list-play:eq(#id)&&li',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'.row-right;.thumb-txt&&a&&Text;.lazy&&data-src;.ft2&&Text;.public-list-exp&&href',
}