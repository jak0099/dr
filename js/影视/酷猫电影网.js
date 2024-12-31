var rule = {
  模板:'首图2',
  类型:'影视',//影视|听书|漫画|小说
  title:'酷猫电影网',
  host:'http://www.szguyun.com',
  url:'/vodshow/fyclass--------fypage---.html',
  searchUrl:'/vodsearch/**----------fypage---.html',
  searchable:2,
  quickSearch:0,
  filterable:1,
  filter:'',
  filter_url:'',
  filter_def:{},
  推荐: 'ul.stui-vodlist.clearfixn;li;a&&title;img&&src;.pic-text&&Text;a&&href',
  一级: 'body .stui-vodlist li;a&&title;img&&src;.pic-text&&Text;a&&href',            
  }