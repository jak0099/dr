Object.assign(muban.首图.二级,{
    tabs: '.myui-panel_hd li:lt(5)',
   });
var rule = {
  模板:'首图',
  title: '大树网',
  host: 'https://www.dsdj8.com',
  searchUrl: '/vodsearch/**----------fypage---.html',
  // url:'/vodshow/fyclass--------fypage---.html',//不带筛选写法
  url: '/vodshow/fyfilter.html',//带筛选写法
  filter:'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',
  filter_url:'{{fl.cateId}}-{{fl.area}}-{{fl.by}}-{{fl.class}}-{{fl.lang}}-{{fl.letter}}---fypage---{{fl.year}}',
  //https://www.dsdj8.com/vodshow/2-大陆-time-国产-国语-B---2---2023.html
  filter_def:{
    1: {cateId: '1'},
    2: {cateId: '2'},
    3: {cateId: '3'},
    4: {cateId: '4'}
  },
  filterable:1,
}