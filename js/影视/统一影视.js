var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'统一影视',
  host:'https://www.tyys1.com',
  //url:'/index.php/vod/type/id/fyclass/page/fypage.html',//不带筛选
  searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
  searchable:2,
  quickSearch:0,
  filterable:1,
  url: '/index.php/vod/show/id/fyclassfyfilter.html',//带筛选写法
  filter:'H4sIAAAAAAAAA+1aW08bRxT+K6t9TiWvIZfylvv9fk+VBzey2qiUSkAroQgJYkMNBAwI7BgMMQrGUNnYDhEt69r8mZ3d9b/o2rOZOWewtLsohCidN77vHJ+ZOXvm7PlsXimqpvYoPyivFPWX6JDzp/qiNzIwoJ5Q1L7Ir9EWYVVrZHWqxfwR6f09+sm9r2UjY5vN2Gbb1oKqMnyC2yYKZmyM2VwIPczXRSs1xzxcCD2sRBXGcCFaZWacJD/wVShEMSbLVv0vHoNCFGNy06hneQwKkUf+T7JX4x4UQo/myrz5Ns88XIhOm3hr6BP8tBSinRbm4CouRPtIrtvvQU4pRB7j883MFvegEO1jdNYcSfF9UIg8ShtGI8c9KESrjO6SWJKvQqEyrDx3vdxiivRHI7CWSLZC3uiHqKX1QjMzztejEOV/I2P+U+b5pxDnrmLuNUDu2hDFeLdFlus8BoUoM+m8mS3yzFCInmFjBsZwIfSwp6rQw4VolZ0K9HAh8khVyGSOrKxxJ8agE20VzZW8nd839CV+LkiiDE1XiL7BM0Qh3tki3tmiuDPS+Bt6uBDFiCed50cSvEg5g29lzpzadwzgYn5iULzGDv00PCMiUdSxXaPGq9+FByt3KBrpR5W799Go1YNXbjgU7maWNhCsXdDaJVrD0BoWrRq0aqI1BK0hwap9D6wOEKxnoPWMaD0NradF6yloPSVaT0LrSdEKc6WJudJgrjQxVxrMlSbmSoO50sRcaTBXWqhDPfRG+n6C9WCXS/bmyCE62XLd+SivPwpRB/mwDj1ciG51uk6m09CJM+hmZLabI0t2eYVfC8YIHQkGc6HQGdFyFAqdEXq4UOhqyINCobtgj0XRw2knKHsUduwuKBIk0cnz+1ayZE1k0PkhCb2N/Tj0cyGKN7dmz8bFeJAU+20WJYUzHSowOjgYxT2plDbL08Fr8CyjzyL+HOPPIf48488j/gLjLyD+IuMvIv4S4y8h/jLjLyP+CuOvIP4q468i/hrjryH+OuOvI/4G428g/ibjbyL+FuNvIf42428j/g7j7yD+LuPvIv4e4+8h/j7j7yP+AeMfIP4h4x8i/hHjHyH+MeMfI/4J458g/injnyL+GeOfIT70HX/ZtP4+WNs/DsG6NmfmiZ7sXNdmereZ/sjCDb50PoLuqK6blQVm//nl4AC+oeU4SfBJcuDFb/1Rd0PKc4cNq0clh7xFRirriCTuQWEwOeQtIbzHfx/CLTZpvgbDFoUBRZe3UPEUTN4C0oeU8ZR2zqOyFmrwybUgKqrtCqkv8oZPISrLf3MOy18dFAYTsmbpjZ1YBWdpQ5T10UZziUscF0pZJmXZ1y7LnFnKqqfNFC8VznQc2A5Oa1LmSZn3Tcm8zyLLfErA/7N8k0JLCi0ptL600OpSj0hoWbGSvTbCGyuFwaSHj997SgtOg+Otl0IUY3uX6KDZURhQaHn/VpNbI8ugVVKIPGZXrSIQSRSis/j57cpMpaEUa8GAwtNbrI1OOZIWnLYNj06+eMsGb4HjvNkNHczCFAaTHj4EjveA7ymjvAWO3yHcrwTwFh1yTKeEHNPlmC7HdDmmyzFdjukt9usZ07vVoxrTs++cvVkFMKkzBjfPHWNvFjTPNgw2aNvxKkm+h2tx5ji/HfceQH2MhsWCM1LyGBSiGIf+Dl6OYXIMk2OYHMN65Bgmx7AeOYYd4xj2Of9Nv1s7hqnn25glju8NaFYnUJen0P/bS/Zt2bdl3/6ifVsZ/g+oKI2GYDUAAA==',
  filter_url:'{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
  //https://www.tyys1.com/index.php/vod/show/area/大陆/by/hits/class/动作/id/2/lang/国语/letter/B/page/2/year/2024.html
  filter_def:{
    1: {cateId: '1'},
    2: {cateId: '2'},
    3: {cateId: '3'},
    4: {cateId: '4'},
    41: {cateId: '41'}
  },
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'.head-nav li;a&&Text;a&&href;/(\\d+)\.html',
  cate_exclude:'体育赛事',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'*',
  一级:'.public-list-box;.time-title&&Text;.lazy&&data-src;.public-list-prb&&Text;.time-title&&href',
  二级:{
    title:'h3&&Text;.slide-info-remarks&&Text',
    img:'.detail-pic img&&data-src',
    desc:'.gen-search-form li:eq(6)&&Text;.gen-search-form li:eq(4)&&Text;.gen-search-form li:eq(5)&&Text;.gen-search-form li:eq(2)&&Text;.gen-search-form li:eq(3)&&Text',
    content:'#height_limit&&Text',
    tabs:'.anthology-tab a',
    lists:'ul.anthology-list-play:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'body .box-width .search-box;.thumb-txt&&Text;.lazy&&data-src;.public-list-prb&&Text;.public-list-exp&&href;.thumb-else span:eq(2)&&Text',
}