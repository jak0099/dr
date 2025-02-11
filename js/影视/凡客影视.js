var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'凡客影视',
  host:'https://fktv.me',
  url:'/channel?page=fypage&cat_id=fyclass&order=new&page_size=32',
  searchUrl:'/channel?page=fypage&keywords=**&page_size=32&order=new',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_name: '电影&电视剧&动漫&综艺&短剧&纪录片&解说&音乐',
  class_url: '1&2&4&3&8&6&7&5',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'*',
  一级:'.video-wrap .list-wrap .item-wrap;.meta-wrap a&&Text;.normal-wrap .bg-cover&&data-src;.meta-wrap .category&&Text;.meta-wrap a&&href',
  二级:{
    title:'.tab-body h1.title&&Text;.tag-list a:eq(1)&&Text',
    img:'.info-more .meta-wrap .thumb&&data-src',
    desc:'.flex-1 .mb-2:eq(2)&&Text;.tag-list a:eq(2)&&Text;.tag-list a:eq(0)&&Text;.actor-wrap div:gt(0)&&Text;.content-wrap div:eq(6)&&Text',
    content:'.info-more .desc&&Text',
    tabs:'.line-header div',
    lists:'.line-list .anthology-list .inner-wrap .item-wrap',
    tab_text:'body&&Text',
    list_text:'span.number&&Text',
    list_url:'div&&data-id',
    list_url_prefix: '',
  },
  搜索:'*',
}