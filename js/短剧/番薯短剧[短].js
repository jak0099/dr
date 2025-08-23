var rule = {
  类型: '影视',//影视|听书|漫画|小说
  title: '番茄短剧[短]',
  host: 'https://www.shanhuzs.com',
  url: '/fqsansw/fyclass--fyfilter.html',
  searchUrl: '/fqsansc/**----------fypage---.html',
  searchable: 2,
  quickSearch: 0,
  filterable: 1,
  filter: { "5": [{ "key": "剧情", "name": "剧情", "value": [{ "n": "全部", "v": "" }, { "n": "女频恋爱", "v": "女频恋爱" }, { "n": "反转爽", "v": "反转爽" }, { "n": "脑洞悬疑", "v": "脑洞悬疑" }, { "n": "年代穿越", "v": "年代穿越" }, { "n": "古装仙侠", "v": "古装仙侠" }, { "n": "现代都市", "v": "现代都市" }] }, { "key": "地区", "name": "地区", "value": [{ "n": "全部", "v": "" }, { "n": "大陆", "v": "大陆" }] }, { "key": "年份", "name": "年份", "value": [{ "n": "全部", "v": "" }, { "n": "2025", "v": "2025" }, { "n": "2024", "v": "2024" }, { "n": "2023", "v": "2023" }, { "n": "2022", "v": "2022" }] }, { "key": "语言", "name": "语言", "value": [{ "n": "全部", "v": "" }, { "n": "国语", "v": "国语" }] }, { "key": "字母", "name": "字母", "value": [{ "n": "全部", "v": "" }, { "n": "A", "v": "A" }, { "n": "B", "v": "B" }, { "n": "C", "v": "C" }, { "n": "D", "v": "D" }, { "n": "E", "v": "E" }, { "n": "F", "v": "F" }, { "n": "G", "v": "G" }, { "n": "H", "v": "H" }, { "n": "I", "v": "I" }, { "n": "J", "v": "J" }, { "n": "K", "v": "K" }, { "n": "L", "v": "L" }, { "n": "M", "v": "M" }, { "n": "N", "v": "N" }, { "n": "O", "v": "O" }, { "n": "P", "v": "P" }, { "n": "Q", "v": "Q" }, { "n": "R", "v": "R" }, { "n": "S", "v": "S" }, { "n": "T", "v": "T" }, { "n": "U", "v": "U" }, { "n": "V", "v": "V" }, { "n": "W", "v": "W" }, { "n": "X", "v": "X" }, { "n": "Y", "v": "Y" }, { "n": "Z", "v": "Z" }, { "n": "0-9", "v": "0" }] }, { "key": "by", "name": "排序", "value": [{ "n": "时间", "v": "time" }, { "n": "人气", "v": "hits" }, { "n": "评分", "v": "score" }] }] },
  filter_url: '{{fl.排序}}-{{fl.剧情}}-{{fl.语言}}-{{fl.字母}}------{{fl.年份}}',
  filter_def: {},
  headers: {
    'User-Agent': 'MOBILE_UA',
  },
  timeout: 5000,
  class_name: '短剧库',
  class_url: '5',
  play_parse: true,
  lazy: $js.toString(() => {
        let html = request(input);
        let playerData = {};
        try {
            let playerScript = html.match(/var player_aaaa\s*=\s*({.*?});/s);
            if (playerScript) {
                playerData = JSON.parse(playerScript[1]);
            }
        } catch (e) {
            console.log("JSON解析失败:" + e.message);
        }
        
        if (playerData.url && playerData.url.includes('.m3u8')) {
            input = playerData.url;
            return;
        }
        
        let m3u8Match = html.match(/player\.setUrl\("(http[^"]+\.m3u8)"/);
        if (m3u8Match) {
            input = m3u8Match[1];
            return;
        }
        
        let m3u8Url = html.match(/(https?:\/\/[^\s'"]+\.m3u8[^\s'"]*)/);
        if (m3u8Url) {
            input = m3u8Url[0];
            return;
        } 
               
        input = { parse: 1, url: input };
    }),
  double: true,
  推荐: '*',
  一级: '.shoutu-vodlist li.col8;.cover-img&&title;.lazyload&&data-original;p.text&&Text;.cover-img&&href',
  二级: {
    title: 'h1&&Text;div.tag&&Text',
    img: '.lazyload&&data-original',
    desc: '.shoutu-media-bd p:eq(3)&&Text;;;.shoutu-media-bd p:eq(1)&&Text;.shoutu-media-bd p:eq(2)&&Text',
    content: '.shoutu-media-bd p:eq(0)&&Text',
    tabs: '.panel-hd:eq(1)&&h3',
    lists: '.shoutu-playlist:eq(#id)&&a:not(:contains(滈凊))',
    tab_text: 'body&&Text',
    list_text: 'body&&Text',
    list_url: 'a&&href',
    list_url_prefix: '',
  },
  搜索: '*',
}