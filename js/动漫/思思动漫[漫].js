var rule = {
  模板:'海螺3',
  title: '思思动漫[漫]',
  host: 'https://www.sisidm.com',
  searchUrl: '/search/**----------fypage---/',
  url: '/show/fyclass--------fypage---/',
  //filterable: 1,//是否启用分类筛选,
  //filter_url: '--{{fl.by}}-{{fl.class}}--{{fl.letter}}------{{fl.year}}/',
  //filter: 'H4sIAAAAAAAAA+2XW1PbRhiG/4uu6czKGBC5y/nQnM9JJxcu45nQUtoJlA6ToWMwUOMY21COBRwocYGCQ4gzDNiA/4wl2f+isvY7zfSGy1zsnd7n1X6rV1qt9L21foj9Euu3Lnz31voxPmxdsHr6YgMDVpvVH/spHkj/oOoW3gV6KNb3azw8Lzjbcie2m8ntFg6ENdIGNPveTa0ABUHe5GxzeQc9LdDzk6XGRgI8EOSlDrzkBHpaoOflC/7eDHggaL581v24i/NpgV5zbdZbKoIHgmqWMo1UAWtqQd5i0T06Qk8L8tY33JUSelrQtYweuskcXosW6DXyGb9cBQ8E1fy83FyZx5pakDf6Lrgb6GlB3mrFSy2hpwVdy3HVS5bxWrSge701ExC811rQuOIf7IGg+QqH/k4F59OCahYLzdIc1tRCeF7iX/ZaAr167aO/+h48EMKrV5fZawmqmR0XGbSgDLXpRgLXEgi+Z7vBE6V7FgqquVNrHKaxphZU82SsfrTgz2ewLGkafZZtbmISEOTtFrw0rXwt6Io2Z/18Eq9ICxq3fObmUzhOC7qi9IFbW8TL0YJW22jGXcUnBYJXW9UbT9FqCwXVHNvzyvikQPAb80/9bJ3emFDQfInTIDHOpwWNG9vzF+jt1YK87Lafn0RPC8qeyQbrD7NrQeOSaW/sLxynBY1L7/untNq0oHxTW7zLgKCaqaV6ZQpraiE8b2GRvZagmh+m61W8ThA0brkixmnBO8mJ8LSgmp9m3PEa1tRCesWy8Ir8Zru5D81NfA4ghNfYnGCvJWinLM15ZdyBQPBuP+nmPtNuHwrenfJeYoF2p1DQmqjl3TR+O0Dw2t2un67S2g0FvyvFxv4avSuhOM+1BDtHvYJrHgR5U8fezDh6WvCOV/YSW24elyhrSlneaK797c/jomJNZ5zs+nNVb+4YzyDNTy3X2P/CZ7AW98RLjAYj+baAplmOjrxUTsxCGs+IfgtWcEDP4c81dwLXNQj+0q0H+yp96UKBXvsV4MHByKsW1X8Ow/HYG/5xcI+/1Kun5/xxiKhIB7DwUPAo86jk7czbJY8wj0huM7clV8yV4HY38eBQcIe5I3kX8y7JO5l3Ss55bZnX5ry2zGtzXlvmtTmvLfPanNeWeW3Oa8u8ivMqmVdxXiXzKs6rZF7FeZXMqzivknkV51Uyr+K8SuZVnFfJvIrzKplXcV7Fee3ubswbHgruMHck72LeJXkn807JO5h3SB5lHpW8nXm75BHmEclt5rbkirnM63BeR+Z1OK8j8zqc15F5Hc7ryLxOx+92t+LJUcsNoi8+OBiXW0Rp0dufPucWcRHARSKXgFwichnIZSK4VV0hchXIVSLXgFwjch3IdSI3gNwgchPITSK3gNwigpsu77m3gdwmcgfIHSJ3gdwlcg/IPSL3gdwn8gDIAyIPgTwk8gjIIyKPgTwm8gTIEyJPgTwl8gzIMyLPgTwn8gLICyIvgbwkor7BVdk6kkvl+2FeJl521q3k/rdMvMyUt5rwFj5BicHe4Gz6foVm0EqC+bp3cECajf1xN4X/lwM9P7+Jt6Z/1Wb1vO7tj5l2WPzcm3ZY32vTDlNN0w6bdhhqmnaYd3vTDpt2mH9hTDs8hIeCm3bYMu2w4KYdNu2waYc1+Qrb4d/iA4OmGxb/9qYb1vfadMNU03TDphuGmqYb5t3edMOmG+Y/GNMND+Gh4KYbtkw3LLjphk03bLphTb66bnjkP1gxlOgtLQAA',
  class_parse: 'body&&.hl-nav li:gt(0);a&&Text;a&&href;.*/(.*?)/',
  cate_exclude: '明星|专题|最新|排行|TG频道',
  推荐: '.hl-vod-list;li;a&&title;.hl-list-item&&a&&style;.remarks&&Text;a&&href',
}