var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'魅影视频',
  host:'https://www.hangtong168.com',
  url:'/vodshow/fyclass--------fypage---.html',
  searchUrl:'/search/**----------fypage---.html',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'ul.menu li;a&&Text;a&&href;/(\\d+)\.html',
  cate_exclude:'',
  tab_exclude:'同主演推荐|同年代推荐|同类型推荐',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'*',
  一级:'.shoutu-vodlist li;.cover-img&&title;.lazyload&&data-original||src;p.text&&Text;.cover-img&&href',
  二级:{
    title:'.shoutu-media-bd h1&&Text;.tag&&Text',
    img:'.lazyload&&data-original||src',
    desc:'.shoutu-media-bd p:eq(3)&&Text;.tag a:eq(3)&&Text;.tag a:eq(4)&&Text;.shoutu-media-bd p:eq(1)&&Text;.shoutu-media-bd p:eq(2)&&Text',
    content:'p.desc&&Text',
    tabs:'.page-row .panel-hd',   
    lists:'.shoutu-playlist:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'*',
}