var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'统一影视',
  host:'https://www.tyys1.com',
  url:'/index.php/vod/type/id/fyclass/page/fypage.html',
  searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'.head-nav li;a&&Text;a&&href;/(\\d+)\.html',
  cate_exclude:'体育赛事',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'*',
  一级:'.public-list-box;.time-title&&Text;.lazy&&data-src;.public-list-prb&&Text;.time-title&&href',
  二级:{
    title:'h3&&Text;.slide-info-remarks&&Text',
    img:'.detail-pic img&&data-src',
    desc:'.gen-search-form li:eq(6)&&Text;.gen-search-form li:eq(4)&&Text;.gen-search-form li:eq(5)&&Text;.gen-search-form li:eq(2)&&Text;.gen-search-form li:eq(3)&&Text',
    content:'#height_limit&&Text',
    tabs:'.anthology-tab a',
    lists:'ul.anthology-list-play:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'body .box-width .search-box;.thumb-txt&&Text;.lazy&&data-src;.public-list-prb&&Text;.public-list-exp&&href;.thumb-else span:eq(2)&&Text',
}