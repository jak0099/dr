var rule = {
  title: '',
  host: '',
  url: '/channel/fyclass-fypage.html',
  searchUrl: '/search.html?wd=**',
  searchable: 2,
  quickSearch: 0,
  filterable: 0,
  headers: {
    'User-Agent': 'MOBILE_UA',
  },
  class_parse: '.menu_bottom ul li;a&&Text;a&&href;.*/(.*?).html',
  cate_exclude: '解析|动态',
  play_parse: true,
  lazy: "js:\n  let html = request(input);\n  let hconf = html.match(/r player_.*?=(.*?)</)[1];\n  let json = JSON5.parse(hconf);\n  let url = json.url;\n  if (json.encrypt == '1') {\n    url = unescape(url);\n  } else if (json.encrypt == '2') {\n    url = unescape(base64Decode(url));\n  }\n  if (/\\.(m3u8|mp4|m4a|mp3)/.test(url)) {\n    input = {\n      parse: 0,\n      jx: 0,\n      url: url,\n    };\n  } else {\n    input;\n  }",
  limit: 6,
  double: true,
  推荐: '.indexShowBox;ul&&li;a&&title;img&&data-src;.s1&&Text;a&&href',
  一级: '.pic-list&&li;a&&title;img&&data-src;.s1&&Text;a&&href',
  二级: {
    title: 'h1&&Text;.content-rt&&p:eq(0)&&Text',
    img: '.img&&img&&data-src',
    desc: '.content-rt&&p:eq(1)&&Text;.content-rt&&p:eq(2)&&Text;.content-rt&&p:eq(3)&&Text;.content-rt&&p:eq(4)&&Text;.content-rt&&p:eq(5)&&Text',
    content: '.zkjj_a&&Text',
    tabs: '.py-tabs&&option',
    lists: '.player:eq(#id) li',
  },
  搜索: '.sr_lists&&ul&&li;h3&&Text;img&&data-src;.int&&p:eq(0)&&Text;a&&href',
}