Object.assign(muban.mxpro.二级,{
    tabs: '.tab-item',
});
var rule = {
  模板:'mxpro',
  title: '天天影院',
  host: 'https://ttyy8.me',
  searchUrl: '/vodsearch/**----------fypage---.html',
  cate_exclude:'今日更新|发布页|热搜榜',
  // url:'/vodshow/fyclass--------fypage---.html',//不带筛选写法	
  url: '/vodshow/fyclass-fyfilter.html',//带筛选写法
  filter:'H4sIAAAAAAAAA+2a3VIaSRTHX4XiOhc9GpPsvspWLnLh1e7mbrdqK2WVinxqACmBsOBnRNEVBGUNDgFeZrpneIttpxvOOa1V42R1c7Fzx6/PoT/+Pd3zp5sPsbgV/zH2U+xDLP7z8h/yY5xnT0UiGX8Ri79/9+syLfn93S+/Lc/y3/uxZGuaaPmxO4zHVl5ArNKQX53HNOIMN9Ob1YwQZ4i1olitzDM0klZyLWfUgFYUklZOt/ntEFpRSOqAESIk/ch8cuws9EMhzvDaJ3zrfJ6hkfQjd+mOIEOjMRZ3Z4jHcocko5nGY9FIeto+ccYH0FOFpI5UaVo7gzoUkjr2zuUIoQ6F4eZFrF+4lW3IUEgyEjmx/idkKCSKDQs8OQDFFOKM6W5JfGrOMzSSVippL2tDKwqJHuOOu/M3H/VAknkJySsce5/RU6KQZORTvHAFGQrJUzIpylmFp0QhnZ2G2N1Gs+MjydiYuH/BmDUS3Ubb7rBhDIoUxlZib/U3Zuu+0eVbNln385KQ6/74dFpLQf8Uklk7qYnBJcyaQqp1V9yOkdY+kjGO87w+gtEpJDN/cSpLYeYVkoxqUzQuIEMh6en+GW5FI6njuoszNJKxJG+cIawVjfdnwLtse61VPANQEnIG6iP5VWhRIXkON3s4QyPR9+oYZ2gk2lRH/GMVJ0GJoSFJUmjMA87QSFUukwyFdBV/IWNWaMwD7yTwPNzhAyvhtu8MR2QlzEvCzcMCW3g5j/hgRBdxdNGMLuDoghm1cNQyowxHmRG1fkBRCUb0DY6+MaOvcfS1GX2Fo6/M6BKOLplRrJVlamVhrSxTKwtrZZlaWVgry9TKwlpZplYMa8VMrRjWiplaMawVM7ViWCtmasWwVszUimGtmKkVw1oxUyuGtWKmVgxrxUytGNaKsQdWj8iXuF3AqwdK7q8eUb2ZVvso414hbt+xbdHdMbJJIdnjLjd4JmVkk0LV+9hbGVyIP5sNDrQNweYy2ObwtRuegGFqDGfHeeeG22gLVRjawgbY8WALG2zHg41WsHV0bg+x0dJIDWpS1MCmaCT9KKewUdZoWDGsusZvsQdPaNBSSflVZDF9DGd7nsLCBduvR5i8QPslvQ3O0Eh/InR57oDvHqJfCbOSyMg9rZGLTFhkwiITFpmwB03YYvy5TNh0NeuersLWpdB82W/sk5e9RDKUzsTrZmAQCkkdpbbIgU3TSDfIpBgMkMg+0k322rktok3WR+OlOP0MPdVIMuxz3tmDDIWkH/UrciqmkNSxsy/66NRUIaljMBCZgmOX8IkWKSTq9Y+kCQP1FJL6euve2hbUpPD7GiFpaqRxQaPz0XjlyRchfuXd4WPOoSLbENmGyDZEtiGyDf/SNrx8NtsQfHXoJtreIRgLjWRzy7fcIlyHaCQZxT33Al2VKaQvqqArO6+46+XhDEkjaeXgkNfRJqsw3NmNaNjkYlAh6UfgBVfwaRfvSpn70A+FZkbzmmRIJPNyPHa+wuWiRnqGtM8zdahDIX1kr3i7iB5WH0kr9ZyogY3SSDXt8UkVaepjOOP5HU6I6iPHRmeFCsOd3QRfv0XnKZExioxRZIwiY/RMxmgp/myXWoEXMI+4xAm+Ksq13OwZzrhD86RjVIbNWCGR9+uB14Ff8BrNCaikifQSw52FyBctNnkayVZeSfMt9I8pheHOhniq7tibyAb6SB6P9Lm7cQMPhsJwxkjkj9z+ETKsPpq2uH1CbLHEx5xR/Q/+dXRdphdS5W+4kHqC/yXx8RecoZH2NPCfSx+73IZ51kjq2ChIpXkGHYDNS8iYmxO30HazNRj2vISu+AOxOZEVoEU/K6GrKbqyiyzmDCKLGVnMyGL+9xYztvIPlFZ12kEwAAA=',
  filter_url:'{{fl.地区}}-{{fl.排序}}-{{fl.剧情}}-{{fl.语言}}----fypage---{{fl.年份}}',
  filter_def:{
    1: {cateId: '1'},
    2: {cateId: '2'},
    3: {cateId: '3'},
    4: {cateId: '4'},
    5: {cateId: '5'}
  },
  filterable:1,
}