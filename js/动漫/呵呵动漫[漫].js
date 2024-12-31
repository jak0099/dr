var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'呵呵动漫[漫]',
  host:'https://www.hehe.la/',
  url:'/channel/fyclass-fypage.html',
  searchUrl:'/search/**----------fypage---.html',
  searchable:2,
  quickSearch:0,
  filterable:0,
  //filter:'',
  //filter_url:'',
  //filter_def:{},
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  //class_parse:'.nav&&li;a&&Text;a&&href;.*/(\\d+)\.html',
  class_name: 'TV动画&剧场版',//静态分类名称拼接
  class_url: '1&2',//静态分类标识拼接
  cate_exclude:'',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'.layout-box .col-sm-12&&li;li;a&&title;a&&data-original;.note&&Text;a&&href',
  一级:'.box-video-list .clearfix&&li;a&&title;a&&data-original;.note&&Text;a&&href',
  二级:{
    title:'h1&&Text;.col-md-6:eq(9)&&Text',
    img:'.details-pic&&a&&data-original',
    desc:'.col-md-6&&Text;.col-md-6:eq(7)&&Text;.col-md-6:eq(5)&&Text;.info .col-md-12:eq(2)&&Text;.col-md-6:eq(4)&&Text',
    content:'.details-content-all&&Text',
    tabs:'.mobile-playlist&&div&&i',
    lists:'ul.clearfix:eq(#id)&&li',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'.row .clearfix&&a;a&&title;a&&data-original;.info ..col-md-12&&Text;a&&href',
}