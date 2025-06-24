var rule = {
  类型: '影视',//影视|听书|漫画|小说
  title: '短剧巴士[短]',
  host: 'https://duanju84.com',
  url: '/show/fyclass---fyfilter.html',
  searchUrl: '/search/**----------fypage---.html',
  searchable: 2,
  quickSearch: 0,
  filterable: 1,
  filter: { "27": [{ "key": "分类", "name": "分类", "value": [{ "n": "全部 ", "v": "" }, { "n": "重生 ", "v": "重生" }, { "n": "民国 ", "v": "民国" }, { "n": "穿越 ", "v": "穿越" }, { "n": "年代 ", "v": "年代" }, { "n": "现代 ", "v": "现代" }, { "n": "言情 ", "v": "言情" }, { "n": "反转 ", "v": "反转" }, { "n": "爽文 ", "v": "爽文" }, { "n": "女恋 ", "v": "女恋" }, { "n": "总裁 ", "v": "总裁" }, { "n": "闪婚 ", "v": "闪婚" }, { "n": "离婚 ", "v": "离婚" }, { "n": "都市 ", "v": "都市" }, { "n": "脑洞 ", "v": "脑洞" }, { "n": "古装 ", "v": "古装" }, { "n": "仙侠 ", "v": "仙侠+" }] }] },
  filter_url: '{{fl.分类}}-----fypage---',
  headers: {
    'User-Agent': 'MOBILE_UA',
  },
  timeout: 5000,
  class_name:'短剧',
  class_url:'27',
  play_parse: true,
  lazy: $js.toString(() => {
    input = { parse: 1, url: input, js: '' };
  }),
  double: true,
  推荐: '*',
  一级: '.img-list li;a&&title;.lazyload&&data-original;;a&&href',
  二级: {
    title: 'h1&&Text;.info.fn-clear dl:eq(1)&&Text',
    img: '.lazyload&&data-original',
    desc: '.info.fn-clear dl:eq(2)&&Text;年代;地区;.info.fn-clear dl:eq(0)&&Text;导演',
    content: '.content-info&&Text',
    tabs: '.play-btn a',
    lists: '#play_tab_box:eq(#id)&&a',
    tab_text: 'body&&Text',
    list_text: 'body&&Text',
    list_url: 'a&&href',
    list_url_prefix: '',
  },
  搜索: '*',
}