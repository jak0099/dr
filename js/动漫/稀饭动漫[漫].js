Object.assign(muban.短视2.二级,{
    img: '.lazy&&data-src||src',
});
var rule = {
  模板:'短视2',
  title: '稀饭动漫[漫]',
  host: 'https://dm1.xfdm.pro',
  class_parse:'.head-nav li:gt(0):lt(5);a&&Text;a&&href;/(\\d+)\.html',
  推荐: '#week-module-1 .public-list-box;a&&title;.lazy&&data-src||src;.public-list-prb&&Text;a&&href',
}