//搜索有图片识别验证
var rule = {
  模板:'mxpro',
  title: '大米星球',
  host: 'https://damjpz.wiki',
  // url:'/vodshow/fyclass--------fypage---.html',//不带筛选写法
  url: '/vodshow/fyclass-fyfilter.html',//带筛选写法
  cate_exclude:'今日更新|福利',
  filterable:1,
  filter:'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',
  filter_url:'{{fl.地区}}-{{fl.排序}}-{{fl.剧情}}-{{fl.语言}}----fypage---{{fl.年份}}',
  //https://www.damitop.site/vodshow/21-大陆-hits-短剧-国语----2---2024.html
  filter_def:{
    20: {cateId: '20'},
    21: {cateId: '21'},
    22: {cateId: '22'},
    23: {cateId: '23'}
  },
}