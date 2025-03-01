var rule = {
    title: '专享影视',
    host: 'https://zxys.cc',
    url: '/show/id/fyclass/page/fypage.html',
    searchUrl: '/search/page/fypage/wd/**.html',
    headers: {
        'User-Agent': 'UC_UA'
    },
    searchable: 1,
    quickSearch: 0,
    filterable: 0,
    double: true,
    play_parse: true,
    limit: 6,
    class_name: '电影&电视剧&动漫&短剧&综艺',
    class_url: 'dianying&dianshi&dongman&duanju&zongyi',
    play_parse: true,
    lazy: `js:
  let html = request(input);
  let hconf = html.match(/r player_.*?=(.*?)</)[1];
  let json = JSON5.parse(hconf);
  let url = json.url;
  if (json.encrypt == '1') {
    url = unescape(url);
  } else if (json.encrypt == '2') {
    url = unescape(base64Decode(url));
  }
  if (/\\.(m3u8|mp4|m4a|mp3)/.test(url)) {
    input = {
      parse: 0,
      jx: 0,
      url: url,
    };
  } else {
    input = url && url.startsWith('http') && tellIsJx(url) ? {parse:0,jx:1,url:url}:input;
  }`,
    limit: 6,
    推荐: '.module-item;.module-item-cover&&.module-item-pic;a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    double: true, // 推荐内容是否双层定位
    一级: '.module-list&&.module-item;.module-item-pic&&a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    二级: {
        "title": "h1&&Text;.video-info-aux.scroll-content&&Text",
        "img": ".lazyload&&data-src",
        "desc": ".module-info-content&&.module-info-item:eq(-2)&&Text;.module-info-content&&.module-info-item:eq(-2)&&Text;.module-info-content&&.module-info-item:eq(-2)&&Text;.video-info-items:eq(1)&&.video-info-item.video-info-actor&&Text;.video-info-items:eq(0)&&.video-info-item.video-info-actor&&Text",
        "content": ".video-info-item.video-info-content.vod_content&&Text",
        "tabs": ".module-tab-content&&.module-tab-item.tab-item",
        "lists": ".module-blocklist.scroll-box.scroll-box-y:eq(#id)&&.scroll-content a"
    },
    搜索: '.module-search-item;.lazy.lazyload&&alt;img&&data-src;.video-serial&&Text;a.video-serial&&href',
}