var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'麦田影院',
  host:'https://www.mtyy1.com',
  url:'/vodtype/fyclass-fypage.html',
  searchUrl:'/vodsearch/**----------fypage---.html',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'.head-nav li;a&&Text;a&&href;/(\\d+)\.html',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'.box-width .public-list-box;body;.public-list-div a&&title;.public-list-div img&&data-src;.public-list-div .public-list-prb&&Text;.public-list-div a&&href',
  一级:'.flex.wrap.border-box.public-r .public-list-box;.public-list-button a.time-title&&Text;.public-list-bj img&&data-src;.public-list-bj .public-list-prb&&Text;.public-list-button a.time-title&&href',
  二级:{
    title:'.slide-desc-box .this-desc-title&&Text;.gen-search-form li:eq(6)&&Text',
    img:'.this-pic-bj&&style',
    desc:'.gen-search-form li:eq(1)&&Text;.gen-search-form li:eq(4)&&Text;.gen-search-form li:eq(5)&&Text;.gen-search-form li:eq(2)&&Text;.gen-search-form li:eq(3)&&Text',
    content:'.gen-search-form li:eq(11)&&Text',
    tabs:'.anthology-tab a',
    lists:'.anthology-list-play:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'*',
}