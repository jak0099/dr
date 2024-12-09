var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'MM短剧网[短]',
  host:'https://www.kkyqb.com',
  url:'/vodtype/fyfilter-fypage.html',
  searchUrl:'/vodsearch/**----------fypage---.html',
  searchable:2,
  quickSearch:0,
  filterable:1,
  filter:'H4sIAAAAAAAAA5WWy27aQBSG9zwFYp1Nt32DPkOVBWpZ9bJqK1VRJMBgyiUBKgikEIoSEJhSiiOCgonLy/iMh7eoYSbESIfo7waZ+TS//jm3mZNINBp7EXsZfR18RKMn299g6V3ia7AYexP/lHj1Nnb0uPwx/iGxWfftJXWKT+tf4u8/J3YqYSW1bbOHssO1MdztUftCYLd+evSMytpw6T7NqGiAqci7JlkrRkUDTEV8a/r9DqOiAaZC5Z63vJHDpDCyXHTCGFP0z6fPKe5h0OO5SeVbzp0CYNQzVTHj4qUBeroMLZbsubYAVKndyYEpC2m/NeG0whishkrHH1e5alAA9OVWKT/gHCkA5uuizatoAOarUqLJFZcvBcAT9TvSHnEnUgD0kpvRnxLnRQEwLv1cUCIH63APg77mWWm4nC8FQF8PjkxmqdUh9zvnK4zR+m7TpMtW9haAvgo2rRqcIwXAGNmjdWMoUpZIcvN/D4O+emfeMsf5UgC8S+orv/aTu0sUgOubSuw8UgD0Yo39GjdhNcBUPOeWn/kagNGdlj3H8fMWF+Ad+5+OO9hr6GxtdEWd634N4HuRJlzfawBmKnd2oGoUAFUaI7J+cCoKgJ2VKlHboboZvDi4zgpjMEbWSs4LXIwUALO+mAVPDC7rCoBZvzLktMhlXQEw0r+aIl/07otk21y8wxj0lR77F+xNrwAYo8mcWm7QlQcmWRiD1XBZESkuXhqAvso9eXPgJboBaMfOfcvxFkXR4LT2MNq9m+edt7z0/rL3WhiDHsfXm/eQ2QtizXkMY3D+PnRFfiUH+bXJ3eN7GPRoZEWGmzYagD2QNOX1b676FcAr1uFUNHhS0V/Hkcd/x5HTf7SNbadrDgAA',
  filter_url:'{{fl.cateId}}',
  filter_def:{1:{cateId:'1'}},
  headers:{
      'User-Agent':'PC_UA',
  },
  timeout:5000,
  class_name:'电影',
  class_url:'1',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'.SecondList_secondListBox;.SecondList_secondListBox;.SecondList_bookName&&Text;.image_imageDark&&src;.SecondList_totalChapterNum&&Text;.image_imageScaleBox&&href',
  一级:'.BrowseList_itemBox;.BrowseList_bookName span&&Text;.image_imageItem&&src;.BrowseList_totalChapterNum&&Text;.image_imageScaleBox&&href',
  二级:{
    title:'h1&&Text;.DramaDetail_tagsBox&&Text',
    img:'.DramaDetail_bookCover&&src',
    //desc:'主要信息;年代;地区;演员;导演',
    content:'.adm-ellipsis&&Text',
    tabs:'.pcDrama_contentBox h3',
    lists:'.pcDrama_catalog:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'.TagBookList_tagItem;.TagBookList_bookName&&Text;.image_imageItem&&src;.TagBookList_totalChapterNum&&Text;.image_imageScaleBox&&href',
}