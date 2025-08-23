var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'逐月[短]',
  host:'https://m.lhphsp.cn',
  url:'/dkefe/fyclass_fypage/',
  searchUrl:'',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_name:'最新短剧&现代言情剧&都市剧&都市日常剧&农村剧&女性成长剧&古代言情剧',
  class_url:'470&469&472&557&522&550&471',
  play_parse:true,
  lazy: $js.toString(() => {
        let iframe = dom("iframe");
        if (iframe.length) {
            return {
                parse: 1,
                url: iframe.attr('src'),
                js: ''
            };
        }        
        let playBtn = dom("a[modal='1'][id='j_read']");
        if (playBtn.length) {
            let playUrl = playBtn.attr('href');
            if (playUrl) {
                return {
                    parse: 0,
                    url: playUrl,
                    js: ''
                };
            }
        }        
        let scripts = dom("script");
        for (let i = 0; i < scripts.length; i++) {
            let scriptContent = scripts.eq(i).text();
            let match = scriptContent.match(/videoUrl\s*=\s*['"]([^'"]+)['"]/);
            if (match && match[1]) {
                return {
                    parse: 0,
                    url: match[1],
                    js: ''
                };
            }
        }        
        let meta = dom("meta[property='og:video']") || dom("meta[property='og:video:url']");
        if (meta.length) {
            return {
                parse: 0,
                url: meta.attr('content'),
                js: ''
            };
        }        
        return {
            parse: 1,
            url: input,
            js: ''
        };
  }),
  double:true,
  推荐:'.g_row li;li;a&&title;.g_thumb img&&_src||src;.g_col_2 span&&Text;a&&href;p.fs16&&Text',
  一级:'.pop-list li;.c_strong&&title;.g_thumb img&&_src||src;p.mb5 span:eq(1)&&Text;.c_strong&&href;.is-truncated&&Text',
  二级:{
    title:'h1.mb15&&Text;p.mb15 span:eq(1)&&Text',
    img:'.book-cover-blur&&src',
    desc:'p.mb15 span:eq(2)&&Text;年代;地区;p.mb15 span:eq(0)&&Text;导演',
    content:'.recomm&&Text',
    tabs:'#Contents h3.det-h2',
    lists:'#chapterList:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
}