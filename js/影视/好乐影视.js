var rule = {
  模板:'海螺3',  
  title: '好乐影视',
  host: 'https://www.haolev.com',
  url: '/haoshow/fyfilter.html',
  searchUrl: '/lesearch/**----------fypage---.html',
  headers: {
    'User-Agent': 'MOBILE_UA',
  },
  filter: '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',
  filter_url: '{{fl.area}}-{{fl.by}}-{{fl.class}}-{{fl.lang}}-{{fl.letter}}---fypage---{{fl.year}}',
  //实例 https://www.haolev.com/haoshow/1-大陆-hits-动作-国语-A---2---2024.html
  filter_def: { 1: {cateId: '1'}, 2: {cateId: '2'}, 3: {cateId: '3'}, 4: {cateId: '4'}},
  filterable: 1,
  //class_parse: 'body&&.hl-nav&&li:gt(0):lt(7);a&&Text;a&&href;(\\d+)',
  class_name:'',
  class_url:'',
}