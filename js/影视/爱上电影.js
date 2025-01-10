var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'爱上电影',
  host:'https://23dyw.cn',
  url:'/vod/index.html?page=fypage&type_id=fyclass',
  searchUrl:'/search/index.html?keyword=**&page=fypage',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'.head-nav li;a&&Text;a&&href;(\\d+)',
  cate_exclude:'',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'*',
  一级:'.public-list-box;.lazy&&alt;.lazy&&src||data-original;.public-list-prb&&Text;a&&href',
  二级:{
    title:'.this-desc-title&&Text;.this-tag&&Text',
    img:'.this-pic-bj&&style',
    desc:'.bj2&&Text;.this-desc-info span:eq(1)&&Text;.this-desc-info span:eq(2)&&Text;.this-info:eq(1)&&Text;.this-info:eq(0)&&Text',
    content:'.this-desc&&Text',
    tabs:'.title-tab a',
    lists:'.anthology-list-play:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'*',
}