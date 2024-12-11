var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'全集网',
  host:'https://www.fschurun.com',
  url:'/vodtype/fyclass-fypage.html',
  searchUrl:'/vodsearch/**----------fypage---.html',
  searchable:0,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'.ewave-header__menu li;a&&Text;a&&href;/(\\d+)\.html',
  cate_exclude:'',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'.tab-content li;li;.lazyload&&title;.lazyload&&data-original;.pic-text&&Text;.thumb-link&&href;.pic-tag&&Text',
  一级:'.ewave-vodlist li;.lazyload&&title;.lazyload&&data-original;.pic-text&&Text;.thumb-link&&href;.pic-tag&&Text',
  二级:{
    title:'h1 span:eq(0)&&Text;p a&&Text',
    img:'.lazyload&&data-original',
    desc:'p a:gt(1):lt(3)&&Text;p a:gt(4):lt(6)&&Text;p a:gt(3):lt(5)&&Text;p a:gt(5):lt(7)&&Text;p a:gt(8):lt(10)&&Text',
    content:'.ewave-pannel_bd p:eq(3)&&Text',
    tabs:'.nav li',
    lists:'.ewave-content__playlist:eq(#id)&&li',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'*',
}