var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'233动漫[漫]',
  host:'https://www.233dm.cc',
  url:'/vshow/id/fyclass/page/fypage.html',
  searchUrl:'/vs/page/fypage/wd/**.html',
  searchable:2,
  quickSearch:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'.main_nav li;a&&Text;a&&href;/(\\d+)\.html',
  cate_exclude:'回家地址|硬核指南',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'*',
  一级:'.myui-vodbox-content;.card-info&&Text;.card-img img&&src;.tag-box&&Text;.myui-vodbox-content a&&href',
  二级:{
    title:'h1&&Text;.director&&Text',
    img:'.lazyload&&data-original',
    desc:'.director:eq(1)&&Text;.item-top:eq(2)&&Text;.item-top:eq(3)&&Text',
    content:'.intro&&Text',
    tabs:'ul.nav li',
    lists:'.tab-content:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'*',
}