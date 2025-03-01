var rule = {
  模板:'mxpro',
  title: '爱看影视',
  host: 'https://ilookys.com',
  //url: '/index.php/vod/type/id/fyclass.html',
  url: '/index.php/vod/show/fyfilter',
  searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
  searchable: 2,
  quickSearch: 0,
  filterable: 1,
  filter:'H4sIAAAAAAAAA+2a708aSRjH/5UNr3sB0Uva+1cufUGu5NKc54s2d0nTmIAgAlaRC2JBTvQsClYq1J5Xd1n8Z5iZ5b+4dWfcnWeeaUMITYPuG9N+ns8O8+PZ9ZvF10YkHov8ZPxsvDYivyVfuf+MkMIpzaxHHhmRlcTvSUj+TCz/kbzzV7zaenucaXu12/9Gnz+LuiMaq48CI7jaM35ZTrx8GRUUiMX2yG4gkVMgVhvu5UjkVBZZvq/5aEGBeFom1xYSOZVFmt6hqaoqCgrETJGu1ZHIKRDzb0dmAYmcglV/uCJmF62aUyCW3jnHeMM5BeJ2jpQ+IpFTMMe1c1YtozlyCvaxeMHsM7SPnAIxPRzXh0jkFIjNLitsIJFTpXtYxdK4QQGMa54Re1c3tF8Ao69fjSx07oIaq8ZTId/dQ40eeWOCe8gnU91D707HtVxgJF4kE1EBZW98UqOfLxRPQNgiPXo9VMfjEOzScJvs24onIGiQvRZtnCuegGB+zQ4eT0Aw3mUPewKCdWz1iHmiroND2XM2+3g8AeHn7uo+dxd97vA/7AkIm/KQbt64B6WqPgezbN2wktvYNXWiPgdzzZbcAUi+o07X58AeXnI6MuvqBXLpa03Pp/6lnncuuk47Jfd8QKbq+X3bHSAwlhMrv0YFVM4WewIqPYo9AZUexZ6ASo9qxuNQ6Smdt6t6bvto1suhtks0q5ZL2l7RzEQufe30+Xy++MS7/jSybPDE88k0px+PxX8M6q+SiRdRDynOEnaWVGcRO4uqE8dOXHUWsLOgOjHsqOtaePKD+wOLdxzasVsaw/Ydl+0nMW/PjxXZx7L7WO8+1rlqJ3gm6ATjqVt0d2PWSRLu71wkyUkT0MSZauI4N/tsOnEsJq0NjSgoEHN/jWsdJHIKnsIZm3xeU0VBv0XgUlotDFxh4Lr3gUvp+TBwPajAhcJLGLjmLHDFZx644BmwRnNkmuw0hSKAXwA3cqqgcQUF49plZg3QoJyCWy/bJ6VjzaBBAdx1OwfsHGcqTsEE3h/QIl4VpzAqrdNsE0clj4KZfrhxenk0TU7BiIMKqfRHA5y//ALQa3Wdy+l3fUMFWyUMTGFguv+BSen5MDA9qMCEAkoYmOYsMC3OPDDBc2KZrnOEcwWnoN0PB7S6h36tcwrEhknzb5HIKdiCXpm0LtHvf06nyj4Tv/0ZdysaUVD4Fi2nyWeCglVvt9lODq2a06neJ9H0Jsv38csxj8KTOSL76GtWQYH40aJZlPgEhY/Xo/Hf/yCRU7A9nRvnqoi2h1Mgpv8lA/RyTFDwJE7ZbhZCqZRT5dUqaZisgNYTFL5r2IS3WRg2w7B5/8Om0vNh2HxQYRMFwDBszlnYXIrMOmzCsxxvbLFKk7oJT372ivAl13DGUBcrJw3Nitl2z0Xuw0v3Hahcg79Utxz7nOVtWsV/kyXXwEWtSzeT0ZTlHKfRRXINbMTeGenU2Ynl/kQbIdfARd5XiU62TD8doIvkGlzT7beuI6s2Gh7iNUm1b5GB4OmHGSjMQPc/Ayk9H2agB5WBUHYJM9AcZSBj9X97b3o9XzAAAA==',
  ///index.php/vod/show/area/大陆/class/剧情/id/21/lang/国语/page/2/year/2023.html
  filter_url:'{{fl.地区}}{{fl.剧情}}/id/fyclass{{fl.语言}}/page/fypage{{fl.年份}}.html',
  filter_def:{20:{类型:"20"},21:{类型:"21"},22:{类型:"22"},23:{类型:"23"},24:{类型:"24"}},
}