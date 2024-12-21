var rule = {
  模板:'mxpro',
  title: '囧次元动漫[漫]',
  host: 'https://www.9ciyuan.com',
  //url: '/index.php/vod/show/id/fyclass/page/fypage.html',//不带筛选写法
  searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
  url: '/index.php/vod/show/id/fyclass/fyfilter/page/fypage.html',//带筛选写法
  filter:'H4sIAAAAAAAAA+3Xy0pCURQG4FfZnHHB2sfMaqZ2M817dsOBxYEkMzALRJxFNKkgAp8ibCBBRm+jUm/ROWWrtVZOm62Zfv8u5WeffmobxwVnyeybtnGOvZb/0ml5lYYzY5x65cQL3o9e+sPXt0AuKrVz7+d0PchccOe+EnxjOjM0DdE0JFOXpq5MLU2tTIGmIFK7SFL/jUgXaLog0whNIzKdp+m8TMM0DcuUdmVlV5Z2ZWVXlnZlZVeWdmVlV5Z2ZWVXQLsC2RXQrkB2BbQrkF0B7QpkV0C7AtkV0K4g6MqUJycm97TmNZsev6mP3XHvZvpNjeKvi7JPiqHHmMfR48yX0ZeZr6CvMF9FX2W+hr7GfB19nXkCPcF8A32DeRI9yTyFnmK+ib7JPI2eZp5BzzDPomeZ59BzzPPoeeYF9ALzInqR+Rb6FvMSeon5Nvo28x30Hea76LvM99D3mMPs72MVvP57fw9a9O6Ob+9Hg7vpd3fcff7o9smJAJtV/wfpJw4Hg/HTgzh1VG2esVPvvcvR9ZU4dXZ42vAmX9GUfZ3TTdBN0E3QTdBN0E2YbIL/51ZHQUdBR0FHQUdBR+F7FEK6CboJugm6CboJugk//yi4YhT0YdOHTR+2f3jYTOcTUcYHvcEbAAA=',
  filter_url:'/by/{{fl.by}}/letter/{{fl.letter}}/year/{{fl.year}}',
  //https://www.9ciyuan.com/index.php/vod/show/by/hits/id/4/letter/D/page/2/year/2024.html
  filter_def:{
    3: {cateId: '3'},
    4: {cateId: '4'},
    20: {cateId: '20'},
    21: {cateId: '21'},
    22: {cateId: '22'}
  },
  filterable:1,
}