var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'搜漫网[漫]',
  host:'https://www.socomic.com',
  url:'/donghua/fyclass/',
  searchUrl:'/search/',
  searchable:0,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'.nav li;a&&Text;a&&href;.*/(.*?)/',
  cate_exclude:'排行榜|最新',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'li.col-md-2;li;*;*;.note&&Text;.loading&&href',
  一级:'#content li;h5&&Text;.video-pic&&data-original;.note&&Text;.loading&&href',
  二级:{
    title:'.video-pic&&title;em&&Text',
    img:'.video-pic&&style',
    desc:'.col-md-6:eq(6)&&Text;.col-xs-12:eq(2)&&Text;.col-md-6:eq(2)&&Text;.text a&&Text;.col-md-6 a&&Text',
    content:'.details-content-default&&Text',
    tabs:'.dropdown-menu li',
    lists:'.playlist:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'*',
}