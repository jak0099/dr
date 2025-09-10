muban.首图2.二级.lists = '.stui-content__playlist:eq(#id) li:not(:contains(滈凊))';
var rule = {
  模板: '首图2',
  title: '花生短剧[短]',
  host: 'https://www.gsfangkeji.com',
  url: '/hssw/fyclass-fyfilter.html',
  searchUrl: '/hssc/**----------fypage---.html',
  推荐: 'ul.stui-vodlist.clearfix;li;a&&title;a&&style;.pic-text&&Text;a&&href',
  一级: '.stui-vodlist li;a&&title;a&&style;.pic-text&&Text;a&&href',
  filterable: 1,
  filter: { "5": [ { "key": "剧情", "name": "按剧情", "value": [ { "n": "全部", "v": "" }, { "n": "女频恋爱", "v": "女频恋爱" }, { "n": "反转爽", "v": "反转爽" }, { "n": "脑洞悬疑", "v": "脑洞悬疑" }, { "n": "年代穿越", "v": "年代穿越" }, { "n": "古装仙侠", "v": "古装仙侠" }, { "n": "现代都市", "v": "现代都市" } ] }, { "key": "地区", "name": "按地区", "value": [ { "n": "全部", "v": "" }, { "n": "大陆", "v": "大陆" } ] }, { "key": "年份", "name": "按年份", "value": [ { "n": "全部", "v": "" }, { "n": "2025", "v": "2025" }, { "n": "2024", "v": "2024" }, { "n": "2023", "v": "2023" }, { "n": "2022", "v": "2022" } ] }, { "key": "语言", "name": "按语言", "value": [ { "n": "全部", "v": "" }, { "n": "国语", "v": "国语" } ] }, { "key": "字母", "name": "按字母", "value": [ { "n": "全部", "v": "" }, { "n": "A", "v": "A" }, { "n": "B", "v": "B" }, { "n": "C", "v": "C" }, { "n": "D", "v": "D" }, { "n": "E", "v": "E" }, { "n": "F", "v": "F" }, { "n": "G", "v": "G" }, { "n": "H", "v": "H" }, { "n": "I", "v": "I" }, { "n": "J", "v": "J" }, { "n": "K", "v": "K" }, { "n": "L", "v": "L" }, { "n": "M", "v": "M" }, { "n": "N", "v": "N" }, { "n": "O", "v": "O" }, { "n": "P", "v": "P" }, { "n": "Q", "v": "Q" }, { "n": "R", "v": "R" }, { "n": "S", "v": "S" }, { "n": "T", "v": "T" }, { "n": "U", "v": "U" }, { "n": "V", "v": "V" }, { "n": "W", "v": "W" }, { "n": "X", "v": "X" }, { "n": "Y", "v": "Y" }, { "n": "Z", "v": "Z" }, { "n": "0-9", "v": "0" } ] },{"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]} ] },
  filter_url: '{{fl.地区}}-{{fl.排序}}-{{fl.剧情}}-{{fl.语言}}-{{fl.字母}}---fypage---{{fl.年份}}',
}