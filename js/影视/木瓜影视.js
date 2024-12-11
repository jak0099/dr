Object.assign(muban.首图2.二级, {
    title: ';.stui-content__detail&&p--span&&a&&Text',
    desc: '.pic-text&&Text;.stui-content__detail&&p&&a:eq(2)&&Text;.stui-content__detail&&p&&a:eq(1)&&Text;.stui-content__detail p:eq(2)--span&&Text;.stui-content__detail p:eq(1)--span&&Text',
    tabs: '.nav.nav-tabs li',
});
var rule = {
    title: "木瓜影视",
    模板: "首图2",
    host: "https://www.kaifd.com",
    url: "/vodshow/fyfilter.html",
    searchUrl: "/vodsearch/**----------fypage---.html",
    filterable: 1,
    filter: "H4sIAAAAAAAAA+2ZSVMbRxiG/4vOpGpGmM037/u+O+WDD5yS+JZUpVyuAoRAYpOgWKxIbDEgjBFIQAiMLOnPqHtG/yKj6W/poYqpcUw5qWRuPO+rnunvG/X0q+ZtzIyd//5t7If+X2PnY3IibVeqYmk81hF78/qn/hPSL69//Lnf+/gb1xHJzVZisy27YMbedYA8ttmsFez0KDhd5Nipikwk2elmpzgtjqvs9JAjB7NyYJ6dXnZS75tWmp0+nsF8QaSL7JiGPjn5+ZM9+4eoVdDVpp4u+iZoxnmG1paozbHV6Y561TapcWqwr3EkBTTuxKxBBfB3DjwAf4fAA/A/C7ymAn/P8ZoK/I3AcQr8fcf7KUDPKW2IiS3wAOh+Y7t2DT0AbZ72bJXn2Qby1kd5ngA0l9JGs76Cc1FA40ZmWrmPOE4BjVvacmeO4xSE6acc2rbnp9FTQF5iTA79hp4Cqr2aEckjrF0Beq3FGfl+HTwAuub8qJO28JoKqL76ju97zEyfyKw5H+gpKiBvakRk9tBTQE+xkXWfAT5FBdzVglycpq56QN5ww/6ElQBQB2rTdrXgm7BPOrmYCmUxYfkXE0qhFtNasZUbwakooIZv5OTRLjZcAbesLI/r1DIPqIT6lMjXcPIK6EHtz7EHQO0cr7AHQOMW1mVhG8cpoHkuf+RxAPzw/2QPgOdS1udS9o2bLAtrA8cpoHHDGbdTIoVrhpkqWW/YmZKdzmExxLyQV+R4wx1GaxmZPpE8bFZxeQGcfPjHB81qzf/wUQrz8ONGPA6a96emm6ybum6wbmi62Ue62afrvaz36noP6z263s16t653sd6l6+dYP6frnax36jrXa+r1mlyvqddrcr3tzdHffme35GwO+NpPUqi1l6+5n8cnrEBbC+wB0PraW2MPgNbCQk1MLrDNrK0WzVagrTL2ALSVq3kKtFWmVaJA+x6LnQR/j9tw8ntcWpC7k/7vMUphGnkBhAukXATlIimXQLlEymVQLpNyBZQrpFwF5Sop10C5Rsp1UK6TcgOUG6TcBOUmKbdAuUXKbVBuk3IHlDuk3AXlLin3QLlHyn1Q7pPyAJQHpDwE5SEpj0B5RMpjUB6T8gSUJ6Q8BeUpKc9AeUbKc1Cek/IClBekvATlJSnGd/hK8dbdq45Y/EzyN696d8U1rSJHSe1FoTY7zeJ3i9wutrc0tvh1pLYezeI3mNqx2IprIdzbPNnq5Peq2pM0K37mWTog+QTlVxW/xOChSGR8iQykMFld7BwKi14aCkJm4FOzelAGDsrqQSkvKJM2j1c55QFwzk3KHMYnALrf3AjnagAtAXLPAL4kFHxtIhxJup+n4OpBmKT1d9NiULILTpKnp7fAJDlfdsOWWFylXwvIUfL69yYv0g2u19DrNbheQ6/X4LoMvS6D6zL0ugyuy/3zf534ouQWi5LbWSS3c/7k9rWhpb2XDi9rG6sLtFICDuvsRMlZHUBPAV1zatPO4jkIAHnZJXubDrMU8G55+uGZk110pjBAAdA1V1ZFntadgjABRxYs7UBOAd0v4DgqKMyJstumA7yfAt1b39c8F6ifa/XmZzzIA+BAtSxSeQpUHlBosvZEKYuhSQFdMz8mc3iQB8B9qYjGAvXFg28ZjLzfC/zybkOYEKN+MaCnIIoa/8WowfUaer1RBIkiSBRB/uHDo96zzSCtgbRdxCwBECafODsNp5zCJaaAxs2U5Bj+WwiAF0lSHuEhBAAvrv3mMe6nALRs61OtDzgXAPKsLbGzhJ4Cul9+T/uHmgIaN7ssDyhjKaBxR0cylWlaM5xEfBL14eB3u4pHRwB0jcqQMziBoxV8w0OO9slfpkyT90B7V7lvL35XtSFwn4/28mgvj/byaC+P9vKz2svf/QW6yegpiiUAAA==",
    filter_url: "{{fl.按类型}}-{{fl.按地区}}--{{fl.按剧情}}-{{fl.按语言}}-{{fl.按字母}}---fypage---{{fl.按年份}}",
    filter_def: {
        1: {
            按类型: "1"
        },
        2: {
            按类型: "2"
        },
        4: {
            按类型: "4"
        },
        28: {
            按类型: "28"
        }
    },
    class_parse: ".stui-header__menu li;a&&Text;a&&href;.*/index(.*?).html",
    cate_exclude: "排行榜",
}