var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'策驰影院',
  host:'https://www.ccy1.com',
  url:'/vod/list/fypage/fyclass/0/0/0/0/0/0',
  searchUrl:'/search/index.html?keyword=**&page=fypage',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'.head-nav li;a&&Text;a&&href;/./(\\d+)/',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'*',
  一级:'.public-list-box;.lazy&&alt;img.lazy&&src||data-src;.public-list-prb&&Text;.public-list-div a&&href;.public-list-subtitle&&Text',
  二级:{
    title:'h3&&Text;.slide-info:eq(-2)&&Text',
    img:'.detail-pic img&&src||data-src',
    desc:'.slide-info:eq(-1)&&Text;.slide-info:eq(0)&&Text;.deployment span:eq(2)&&Text;.slide-info:eq(2)&&Text;.slide-info:eq(1)&&Text',
    content:'.text.cor3&&Text',
    tabs:'.anthology-tab a',
    lists:'.anthology-list-play:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'.public-list-box;.vod-title&&title;img.lazy&&src||data-src;.vod-sub-text&&Text;.public-list-bj a&&href;.cor5.thumb-blurb.hide2&&Text',
}