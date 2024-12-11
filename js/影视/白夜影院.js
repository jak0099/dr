var rule = {
  title: '白夜影院',
  host: 'https://www.baiyc.com',
  url: '/frim/fyclass-fypage.html[/frim/fyclass.html]',
  searchUrl: '/search.php?page=fypage&searchword=**&searchtype=',
  searchable: 2,
  headers: {
    'User-Agent': 'MOBILE_UA',
  },
  class_parse: '.stui-header__menu li:gt(0):lt(7);a&&Text;a&&href;/\\w+/(\\w+).html',
  play_parse: true,
  lazy: $js.toString(() => {
    let html = JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);
    let url = html.url;
    if (html.encrypt == '1') {
      url = unescape(url)
    } else if (html.encrypt == '2') {
      url = unescape(base64Decode(url))
    }
    if (/\.m3u8|\.mp4/.test(url)) {
      input = {
        jx: 0,
        url: url,
        parse: 0
      }
    } else {
      input
    };
    const video = document.getElementById('myVideo');
    video.addEventListener('canplay', function () {
      video.currentTime = 10;
    });
}),
  limit: 6,
  double: true,
  推荐: '.stui-vodlist;.stui-vodlist__item;a&&title;a&&data-original;.pic-text&&Text;a&&href',
  一级: '.stui-vodlist__item;a&&title;a&&data-original;.pic-text&&Text;a&&href',
  二级: {
    title: 'h1.title--span&&Text;.pic-text&&Text',
    img: '.lazyload&&data-original',
    desc: 'p.data:eq(0) a:eq(0)&&Text;p.data:eq(0) a:eq(2)&&Text;p.data:eq(0) a:eq(1)&&Text;p.data:eq(1)--span&&Text;p.data:eq(2)--span&&Text',
    content: '.stui-content__desc p&&Text',
    tabs: '.dropdown-menu li',
    lists: '.stui-content__playlist:eq(#id) a',
  },
  搜索: '.stui-vodlist__item;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href;.detail&&Text',
}