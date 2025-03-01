var rule = {
  title: '黑狐影视',
  host: 'https://www.yybzyp.cn',
  desc: '不告诉你',
  class_name: '电影&电视剧&综艺&动漫&动作片&喜剧片&爱情片&科幻片&恐怖片&剧情片&犯罪片&战争片&国产剧&港剧&台湾剧&韩剧&日剧&泰剧&欧美剧&海外剧&国产动漫&日本动漫&欧美动漫&海外动漫&大陆综艺&日韩综艺&港台综艺&欧美综艺',
  class_url: '1&2&3&4&7&8&9&10&11&12&29&13&14&15&16&17&18&31&19&20&25&26&27&28&21&22&23&24',
  searchUrl: '/rss/index.xml?wd=**',
  searchable: 2,
  quickSearch: 0,
  headers: {
    'User-Agent': 'UC_UA',
  },
  url: '/zixun/fyclass-fypage.html',
  play_parse: true,
  lazy: "js:\n  let html = request(input);\n  let hconf = html.match(/r player_.*?=(.*?)</)[1];\n  let json = JSON5.parse(hconf);\n  let url = json.url;\n  if (json.encrypt == '1') {\n    url = unescape(url);\n  } else if (json.encrypt == '2') {\n    url = unescape(base64Decode(url));\n  }\n  if (/\\.(m3u8|mp4|m4a|mp3)/.test(url)) {\n    input = {\n      parse: 0,\n      jx: 0,\n      url: url,\n    };\n  } else {\n    input = url && url.startsWith('http') && tellIsJx(url) ? {parse:0,jx:1,url:url}:input;\n  }",
  limit: 6,
  推荐: '*',
  一级: '.fed-list-info li;.fed-list-title&&Text;a&&data-original;.fed-text-center&&Text;a&&href',
  二级: {
    title: 'h1&&Text',
    img: '.lazy&&data-original',
    desc: '.fed-deta-content&&.fed-part-eone:eq(6)&&Text;.fed-deta-content&&.fed-part-eone:eq(5)&&Text;.fed-deta-content&&.fed-part-eone:eq(4)&&Text;..fed-deta-content&&.fed-part-eone:eq(1)&&Text;.fed-deta-content&&.fed-part-eone:eq(2)&&Text',
    content: 'p&&Text',
    tabs: '.fed-drop-head li',
    tab_text: '',
    lists: '.detail-play-list:eq(#id) li',
  },
  搜索: $js.toString(() => {
    let html = request(input);
    let items = pdfa(html, 'rss&&item'); log(items);
    let d = [];
    items.forEach(it => {
      it = it.replace(/title|link|author|pubdate|description/g, 'p');
      let url = pdfh(it, 'p:eq(1)&&Text');
      d.push({
        title: pdfh(it, 'p&&Text'),
        url: url,
        desc: pdfh(it, 'p:eq(3)&&Text'),
        content: pdfh(it, 'p:eq(2)&&Text'),
        pic_url: 'https://p0.meituan.net/csc/d797e865aaa4334699479c2fef6cab181597933.gif',
      });
    });
    setResult(d);
  }),
}