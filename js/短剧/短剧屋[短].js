var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'短剧屋[短]',
  host:'http://www.metaysw.com',
  url:'/type/fyclass-fypage.html',
  searchUrl: '/rss.xml?wd=**',
  searchable:2,
  quickSearch:0,
  filterable:0,
  filter:'',
  filter_url:'',
  filter_def:{},
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,  
  class_parse:'.vod-header__menu li;a&&Text;a&&href;.*/(.*?)\.html',
  cate_exclude:'',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'*',
  一级:'.vod-vodlist li;.vod-vodlist__title&&Text;.lazyload&&data-original;.pic-text&&Text;.vod-vodlist__thumb&&href',
  二级:{
    title:'h2&&title;vod_type',
    img:'.lazyload&&data-original||src',
    desc:'.vod-content__detail&&p:eq(1)&&Text;.vod-content__detail&&p:eq(2)&&Text;;.vod-content__detail&&p:eq(3)&&Text;',
    content:'.text-center&&Text',
    tabs:'ul.dropdown-menu li',
    lists:'.vod-content__playlist:eq(#id)&&li',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索: $js.toString(() => {
    let html = post(input.split('?')[0], { body: input.split('?')[1] });
    let items = pdfa(html, 'rss&&item');
    // log(items);
    let d = [];
    items.forEach(it => {
      it = it.replace(/title|link|author|pubdate|description/g, 'p');
      let url = pdfh(it, 'p:eq(1)&&Text');
      url = url.replace(/cc/g, 'me');
      d.push({
        title: pdfh(it, 'p&&Text'),
        url: url,
        desc: pdfh(it, 'p:eq(3)&&Text'),
        content: pdfh(it, 'p:eq(2)&&Text'),
        pic_url: "",
      });
    });
    setResult(d);
  }),
}