//网址发布页：hldmdh.top
var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'火狼动漫[漫]',
  host:'https://huolang.vip',
  url:'/iCategoryId/fyclass-fypage.html',
  searchUrl:'/search/**/fypage.html',
  searchable:2,
  quickSearch:0,
  filterable:1,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'.nav li;a&&Text;a&&href;/(\\d+)/',
  cate_exclude:'',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'.tab-pane ul li;li;*;*;.col-sm-2 p&&Text;.image a&&href',
  一级:'.vod-item-img li;h3&&Text;.img-responsive&&data-original;.col-md-2&&p&&Text;.col-md-2 a&&href',
  二级:{
    title:'h1&&Text;.media-body&&li:eq(1)&&Text',
    img:'.media-object&&src',
    desc:'.media-body&&li:eq(0)&&Text;.media-body&&li:eq(4)&&Text;.media-body&&li:eq(5)&&Text;.media-body&&li:eq(3)&&Text;.media-body&&li:eq(2)&&Text',
    content:'.vod-content&&Text',
    tabs:'.ff-playurl-tab&&li',
    lists:'ul.list-unstyled:eq(#id)&&li',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'.vod-item-img&&li;h3&&Text;.img-responsive&&data-original;.col-md-2&&p&&Text;.col-md-2 a&&href',
}