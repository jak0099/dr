Object.assign(muban.首图.二级,{
    tabs: 'ul.nav li',
    lists: '.myui-content__list:eq(#id)&&li',
});
var rule = {
  模板:'首图',
  title: '泡泡影视',
  host: 'https://www.wxnlm.com',
  //url: '/vodtype/fyclass-fypage.html',
  searchUrl: '/vodsearch/**----------fypage---.html',
  class_parse: '.item&&li:gt(0):lt(5);a&&Text;a&&href;.*/(.*?)\.html',
  // url:'/vodshow/fyclass--------fypage---.html',//不带筛选写法	
  //url: '/vodshow/fyclassfyfilter.html',//带筛选写法
  url: '/vodshow/fyfilter.html',//带筛选写法
  filter:'H4sIAAAAAAAAA+1Y3U7bMBh9lajXXCTld3uDPcPERaARDT+pVpptLUJigqIWBt0moEN0Y5OAFo2fsDEYKYWXadL2LebEIf78pRMUrWObcsfxOf1sHzs+NjNCJKbKWlrVxiKPhafCjBCZUNLkz8ionFKexCI9QkSTpxSnpXFStT4uOy3P5UldudFrDmdlK635iss5MCLM9jBuqVKvlXwultDGMnqCl2yUrHzZl7xUx3WOb+RO7Pmsz8vqM2fAnKL81rqo+ooJJa7LGqewX72x5zaYggxjhO+FDAH2Mq4HerFz7+tm3ldk4rKWiStIRObbWKty8yWD4STNI8OqrbOe1ElnJMKwp/GWQE4qMlwAq2RYr817LMBOubW56HMehIrW3qb949hXeJCrUTDsiytWg0JuBa5Wra2ar/Ag5963dajwIOfL8glUeJCrUdy1SwesBoXcXLb3YQ0PcnO5OocKD/IjNfiRGoEaK4Zl7rEaFHI1FgrEaSu3z8r4Ldycd68bhcNGfpNN22/ht9Une/maFGCd+i2cLntWr7J97sHg7korcpLbXRen9Wqt890VFaN9PuMCxPZCthezUchGMStBVsKsCFkRsdIjwBKA2CHIDmF2ELKDmB2A7ABm+yHbj1nolYS9kqBXEvZKgl5J2CsJeiVhryTolSS22Q+TMjnHwH5oHh82K3P3OG22auSnbP9RiL5yqPAgd5Z83YEKD3JfebFmrRShiLWg04ATUYhOFKjwIDq3OAWF6ETh5kwh+iqto3n4VTowuAojabgG9uo7yyy0XwO7eNYqnvoVUyr5Ceyxbpq2sebzcTU1za/C8YKVY6kwPZpIKt6AhOEeei+YjjtJ3LWLwVatbpZh8I/piVGSqSj9SRZxIrJRkcI55IGiTYmDshNIQJPQpxR8zSCpBiUpGQvI5oCCZID/fm7tbPBDUV8EyjS2D6Empnvj7doFYDFLfso2H4WdhebvuCLcHt53uUTcFs13uERsGCQ7rQ+fWRm/JYzSMEo7jVLIitArEXslQq9E7JUI3RCxGyJ0Q8RuiNANsS8M+A4C/t8L5wx5VKbV7iWz+0RsVC+beZPFFCnh9YvsJaYjbVJ1nsZtxCTKCwYSO4FOsrad3I1tJHeT2xc/XGbSubB9RWHQGrjzHBicIFNQ+D8mTJghfyhDoFci9uovSpgwRR48RZx/TU7JWvdihD7wlir25Rf8xrvpO3heIr0bJW3V9E3Hq91waKt2j2c8Fpo8bfX0Kcfr6WuOybsWPq5x8ONwYGdPqV9FS/i8CZ83YTSFj59/NLaE2Z+Yh6RwtBwAAA==',
  filter_url:'{{fl.cateId}}-{{fl.area}}-{{fl.by}}--{{fl.lang}}----fypage---{{fl.year}}',
  filter_def:{
    dianying: {cateId: 'dianying'},
    dianshiju: {cateId: 'dianshiju'},
    zongyi: {cateId: 'zongyi'},
    dongman: {cateId: 'dongman'}
  },
  filterable:1,
}