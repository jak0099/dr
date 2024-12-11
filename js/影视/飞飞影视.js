var rule = {
            title: '飞飞影视',
            模板:'首图2',
            host: 'https://www.syzj886.com',
            url: "/vsh/fyfilter.html",
            searchUrl: '/do/**----------fypage---.html',
            searchable: 2,//是否启用全局搜索,
            quickSearch: 0,//是否启用快速搜索,
            filterable: 1,
  filter: "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",
  filter_url: "{{fl.按类型}}-{{fl.按地区}}--{{fl.按剧情}}-{{fl.按语言}}-{{fl.按字母}}---fypage---{{fl.按年份}}",
  filter_def: {
    dianying: {
      按类型: "dianying"
    },
    dianshiju: {
      按类型: "dianshiju"
    },
    zongyi: {
      按类型: "zongyi"
    },
    dongman: {
      按类型: "dongman"
    },
    duanju: {
      按类型: "duanju"
    },
    dianyingjieshuo: {
      按类型: "dianyingjieshuo"
    }
  },
            headers: {
                'User-Agent': 'UC_UA', // "Cookie": ""
            },
            class_parse: '.stui-header__menu li:gt(0):lt(7);a&&Text;a&&href;.*/(.*?).html',
            play_parse: true,
            limit: 6,
            double: true, // 推荐内容是否双层定位
            二级: {
                title: '.stui-content__detail .title--span&&Text;.stui-content__detail&&p:eq(-2)&&a&&Text',
                title1: '.stui-content__detail .title&&Text;.stui-content__detail&&p&&Text',
                img: '.stui-content__thumb .lazyload&&data-original',
                desc: '.pic-text.text-right&&Text;.stui-content__detail&&p:eq(-2)&&a:eq(2)&&Text;.stui-content__detail&&p:eq(-2)&&a:eq(1)&&Text;.stui-content__detail p:eq(2)&&Text;.stui-content__detail p:eq(1)&&Text',
                desc1: '.stui-content__detail p:eq(4)&&Text;;;.stui-content__detail p:eq(1)&&Text',
                content: '.stui-pannel-box:eq(-5)&&p&&Text',
                tabs: '.stui-pannel__head h3',
                tabs1: '.stui-vodlist__head h3',
                lists: '.stui-content__playlist:eq(#id) li',
            },
        }