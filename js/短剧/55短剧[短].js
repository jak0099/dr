var rule = {
  类型: '影视',//影视|听书|漫画|小说
  title: '55短剧[短]',
  host: 'https://www.duanju55.com',
  url: '/index.php/vod/show/id/fyclassfyfilter.html',
  searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
  searchable: 2,
  quickSearch: 0,
  filterable: 1,
  filter: { "1": [{ "key": "剧情", "name": "剧情", "value": [{ "n": "全部", "v": "" }, { "n": "都市", "v": "/class/都市" }, { "n": "赘婿", "v": "/class/赘婿" }, { "n": "战神", "v": "/class/战神" }, { "n": "古代言情", "v": "/class/古代言情" }, { "n": "现代言情", "v": "/class/现代言情" }, { "n": "历史", "v": "/class/历史" }, { "n": "脑洞", "v": "/class/脑洞" }, { "n": "玄幻", "v": "/class/玄幻" }, { "n": "电视节目", "v": "/class/电视节目" }, { "n": "搞笑", "v": "/class/搞笑" }, { "n": "网剧", "v": "/class/网剧" }, { "n": "喜剧", "v": "/class/喜剧" }, { "n": "萌宝", "v": "/class/萌宝" }, { "n": "神豪", "v": "/class/神豪" }, { "n": "致富", "v": "/class/致富" }, { "n": "奇幻脑洞", "v": "/class/奇幻脑洞" }, { "n": "超能", "v": "/class/超能" }, { "n": "强者回归", "v": "/class/强者回归" }, { "n": "甜宠", "v": "/class/甜宠" }, { "n": "励志", "v": "/class/励志" }, { "n": "豪门恩怨", "v": "/class/豪门恩怨" }, { "n": "复仇", "v": "/class/复仇" }, { "n": "长生", "v": "/class/长生" }, { "n": "神医", "v": "/class/神医" }, { "n": "马甲", "v": "/class/马甲" }, { "n": "亲情", "v": "/class/亲情" }, { "n": "小人物", "v": "/class/小人物" }, { "n": "奇幻", "v": "/class/奇幻" }, { "n": "无敌", "v": "/class/无敌" }, { "n": "现实", "v": "/class/现实" }, { "n": "重生", "v": "/class/重生" }, { "n": "闪婚", "v": "/class/闪婚" }, { "n": "职场商战", "v": "/class/职场商战" }, { "n": "穿越", "v": "/class/穿越" }, { "n": "年代", "v": "/class/年代" }, { "n": "权谋", "v": "/class/权谋" }, { "n": "高手下山", "v": "/class/高手下山" }, { "n": "悬疑", "v": "/class/悬疑" }, { "n": "家国情仇", "v": "/class/家国情仇" }, { "n": "虐恋", "v": "/class/虐恋" }, { "n": "古装", "v": "/class/古装" }, { "n": "时空之旅", "v": "/class/时空之旅" }, { "n": "玄幻仙侠", "v": "/class/玄幻仙侠" }, { "n": "欢喜冤家", "v": "/class/欢喜冤家" }, { "n": "传承觉醒", "v": "/class/传承觉醒" }, { "n": "情感", "v": "/class/情感" }, { "n": "逆袭", "v": "/class/逆袭" }, { "n": "家庭", "v": "/class/家庭" }, { "n": "女频恋爱", "v": "/class/女频恋爱" }, { "n": "反转爽剧", "v": "/class/反转爽剧" }, { "n": "古装仙侠", "v": "/class/古装仙侠" }, { "n": "年代穿越", "v": "/class/年代穿越" }, { "n": "脑洞悬疑", "v": "/class/脑洞悬疑" }, { "n": "现代都市", "v": "/class/现代都市" }] }] },
  filter_url: '{{fl.剧情}}/page/fypage',
  headers: {
    'User-Agent': 'PC_UA',
  },
  timeout: 5000,
  class_name: '短剧',
  class_url: '1',
  play_parse: true,
  lazy: $js.toString(() => {
    input = { parse: 1, url: input, js: '' };
  }),
  tab_exclude: '猜你喜欢',
  double: false,
  推荐: '.SecondList_secondListItem;.SecondList_bookName&&Text;.image_imageDark&&src;.SecondList_totalChapterNum&&Text;.SecondList_bookName&&href',
  一级: '.BrowseList_itemBox;.BrowseList_bookName span&&Text;.image_imageItem&&src;.BrowseList_totalChapterNum&&Text;.BrowseList_bookName&&href',
  二级: {
    title: 'h1&&Text;.breadcrumb_crumbItem:eq(1)&&Text',
    img: '.DramaDetail_bookCover&&src',
    desc: '.DramaDetail_tagsBox&&Text',
    content: '.DramaDetail_tagsBox&&Text',
    tabs: '.pcDrama_titleText',
    lists: '.pcDrama_catalog:eq(#id)&&a',
    tab_text: 'body&&Text',
    list_text: 'body&&Text',
    list_url: 'a&&href',
  },
  搜索: '.TagBookList_tagItem;.TagBookList_bookName&&Text;.image_imageItem&&src;.TagBookList_totalChapterNum&&Text;.TagBookList_bookName&&href',
}