Object.assign(muban.短视2.二级,{
    img: '.lazy&&data-src',
});
var rule = {
  模板:'短视2',
  title: '喵物次元[漫]',
  host: 'https://www.mwcy.net',
  class_parse:'.head-nav li:gt(0):lt(6);a&&Text;a&&href;/(\\d+)\.html',
  推荐: '#week-module-1 .public-list-box;a&&title;.lazy&&data-src||src;.public-list-subtitle&&Text;a&&href',
}