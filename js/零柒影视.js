var rule={
    title:'零柒影视',
    host:'https://07vod.fun',
    url:'/index.php/vod/type/id/fyclass/page/fypage.html',
    searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:1,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{
        'User-Agent':'UC_UA',
    },
    class_name:'电影&电视剧&番剧&动漫&国产剧&港台剧&日韩剧&欧美剧',
    class_url:'1&2&20&4&13&14&15&16',

    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'ul.fed-list-info.fed-part-rows;li;a.fed-list-title&&Text;a&&data-original;.fed-list-remarks&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.fed-list-info&&li;a.fed-list-title&&Text;a&&data-original;.fed-list-remarks&&Text;a&&href',
    二级:{"title":"h1&&Text;.fed-mute&&Text","img":".fed-list-info&&a&&data-original","desc":".fed-deta-content&&.fed-part-rows&&li:eq(-1)&&Text;.fed-deta-content&&.fed-part-rows&&li:eq(-2)&&Text;.fed-deta-content&&.fed-part-rows&&li:eq(-3)&&Text;.fed-deta-content&&.fed-part-rows&&li:eq(0)&&Text;.fed-deta-content&&.fed-part-rows&&li:eq(1)&&Text","content":".fed-deta-content&&.fed-part-rows&&li:eq(6)&&Text","tabs":".fed-drop-boxs&&.fed-part-rows li","lists":".fed-play-item:eq(#id)&&.fed-part-rows:eq(1) li"},
    搜索:'.fed-list-deta;h1&&Text;.fed-lazy&&data-original;.fed-list-remarks&&Text;a&&href;.fed-deta-content&&Text',
}