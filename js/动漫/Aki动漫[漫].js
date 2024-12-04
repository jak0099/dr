var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'Aki动漫[漫]',
  host:'https://www.imandaow.com',
  url:'/list/fyclass.html',
  searchUrl:'/search.php?page=fypage&searchword=a&searchtype=',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'.nav-down-pc li;a&&Text;a&&href;.*/(.*?)\.html',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'*;li;*;*;*;*',
  一级:'.index-tj li;.li-hv&&title;img&&data-original;.bz&&Text;.li-hv&&href',
  二级:{
    title:'.comicnrr&&a&&Text;.info span&&Text',
    img:'img&&src',
    desc:'dd:gt(0):lt(2)&&Text;dd:gt(1):lt(3)&&Text;;dd:gt(2):lt(4)&&Text;dd:gt(4):lt(6)&&Text',
    content:'#quanjq&&Text',
    tabs:'#tab11',
    lists:'ul.urlli:eq(#id)&&li',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'*;*;*;*;*',
}