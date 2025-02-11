var rule = {
  模板:'mxone5',
  title: '稀饭影视',
  host: 'https://xifanys.xyz',
  url: '/index.php/vod/show/id/fyclass/fyfilter.html',
  searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
  searchable: 2,
  quickSearch: 0,
  filterable: 1,
  filter:'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',
  filter_url:'{{fl.地区}}{{fl.排序}}{{fl.剧情}}{{fl.分类}}{{fl.语言}}{{fl.字母}}/page/fypage{{fl.年代}}',
  //实例：/index.php/vod/show/area/大陆/by/hits/class/古装/id/2/lang/国语/letter/A/page/2/year/2018.html
  filter_def: {
    1:{cateId:'1'},
    2:{cateId:'2'},
    3:{cateId:'3'},
    4:{cateId:'4'},
    20:{cateId:'20'}
  },
}