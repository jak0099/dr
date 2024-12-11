var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'久久动漫[漫]',
  host:'http://www.995dm.com',
  url:'/type/fyclass-fypage.html',
  searchUrl:'/search-pg-fypage-wd-**.html',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'.nav-pc li b;a&&Text;a&&href;.*/(\\d+)',
  tab_exclude:'线路空',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'*',
  一级:'.index-tj li;p.name&&Text;img&&data-original;.bz&&Text;.li-hv&&href',
  二级:{
    title:'.h2 a:eq(2)&&Text;.info dd:eq(0)&&Text',
    img:'img&&src',
    desc:';.info dd:eq(3)&&Text;.info dd:eq(2)&&Text;.info dd:eq(4)&&Text;.info dd:eq(1)&&Text',
    content:'.des2&&Text',
    tabs:'.pfrom.tab1.clearfix li',
    lists:'.urlli:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'*',
}