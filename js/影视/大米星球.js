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