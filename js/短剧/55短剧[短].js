var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'55短剧[短]',
  host:'https://www.duanju55.com',
  url:'/index.php/vod/type/id/fyclass/page/fypage.html',
  searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'PC_UA',
  },
  timeout:5000,
  class_name:'短剧',
  class_url:'1',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  tab_exclude:'猜你喜欢',
  double:false,
  推荐:'.SecondList_secondListItem;.SecondList_bookName&&Text;.image_imageDark&&src;.SecondList_totalChapterNum&&Text;.SecondList_bookName&&href',
  一级:'.BrowseList_itemBox;.BrowseList_bookName span&&Text;.image_imageItem&&src;.BrowseList_totalChapterNum&&Text;.BrowseList_bookName&&href',
  二级:{
    title:'h1&&Text;.breadcrumb_crumbItem:eq(1)&&Text',
    img:'.DramaDetail_bookCover&&src',
    desc:'.DramaDetail_tagsBox&&Text',
    content:'.DramaDetail_tagsBox&&Text',
    tabs:'.pcDrama_titleText',
    lists:'.pcDrama_catalog:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
  },
  搜索:'.TagBookList_tagItem;.TagBookList_bookName&&Text;.image_imageItem&&src;.TagBookList_totalChapterNum&&Text;.TagBookList_bookName&&href',
}