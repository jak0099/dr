var rule={
title: '茶杯狐',
host: 'https://www.5jcd.com',
url: '/show_fyfilter.html',
searchUrl: '/sou/page/fypage/wd/**.html',
searchable: 2,quickSearch: 0,filterable: 1,
headers: {'User-Agent': 'MOBILE_UA'},
filter_url: '{{fl.area}}{{fl.by}}{{fl.class}}{{fl.cateId}}/page/fypage{{fl.year}}',
filter_def: {
'/id/1': {cateId: '/id/1'},'/id/2': {cateId: '/id/2'},'/id/3': {cateId: '/id/3'},'/id/4': {cateId: '/id/4'}},
class_name: '电影&剧集&综艺&动漫',
class_url: '/id/1&/id/2&/id/3&/id/4',
lazy: '',
推荐: '*',double: true,
一级: '.myui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
二级: {
title: '.myui-content__detail .title&&Text;.myui-content__detail p:eq(-2)&&Text',
img: '.myui-content__thumb .lazyload&&data-original',
desc: '.myui-content__detail p:eq(0)&&Text;.myui-content__detail p:eq(1)&&Text;.myui-content__detail p:eq(2)&&Text',
content: '.content&&Text',
tabs:'.myui-panel-box.clearfix h3:not(:contains(热播))',
lists: '.myui-content__list:eq(#id) a'},
搜索: '#searchList li;a&&title;.lazyload&&data-original;.text-muted&&Text;a&&href;.detail&&p:eq(2)&&Text',
filter:'H4sIAAAAAAAAA+1Z3U4bORS+72PkGime/PDTN9hnWFWrdBupqC0rFXZXqKrULU1IQpcQBKFZAgG1IcASOiksC5OGvEzsSd5iZ8aOfXyMmqkU9aKbS77zcWx/x/b5nHkRic4/ilqR+z++iDxJL0fuR35OLaV/eBSZiiyknqW9v91Wm+6veX//lnr6azogLmiw90fk5ZRAnVPa2XbzqyLgJ09YMkwLx71O1d36h3ZagBEHjHKV5hsmI66GyLXYSsZkJBSjUaI3bZORlAz2xwZ7VTYZ05LRbx7Rt6cmY0blyL3rOXmTMavWkm/cOdM5leP1mVsuGYwEUTnqq3etJenN9IHPETV7mlpcVCXjAxslUzAsGVd8mDvIFBWYLrlOEZiuqE4RmF58NBDH9MqhgTimi4qycEyvDJoLx/Ty6hSBybkUProdRBEYWJG71TZW5GN6/RCFY3K6zaPe7QGaLsdkluzmoHKCsnBMZtk/9daIsnBM322IwjFJWSmw138hCsekLu0izVwjXTg2pAz2Ntm7uk4RmByovNrPO2ggjslFFz/03+NKc0xS1rO0+AlROCYr3d3wSoIqzTGlbpXtlbC6AQYPWep5OgXOWNWmbx3zjElYO2MfGoNKdjiCnygqICnZUYVdf9QYAlJy2OzmVs/BIVmZ23W629EYApKqX2xjhoCkXGstzBCQzLFTZ9UzPQeH5FpqJziHgORabv/FDAGpmdrmTG0tx582dY70HBySOd4UPZVp7kRPI1G55nrXLTbdfEVftkTVcT9ga13vn/VBJQo3y3I69RxslpvLXrtjbhYJw80SI7HEcAQ/TTQAQDSOo3EYjeFoDEYtHLVglOAoAVFrDkWtORidxdFZGJ3B0RkYncbRaRhN4mgSRrFWFtTKwlpZUCsLa2VBrSyslQW1srBWFtSKYK0I1IpgrQjUimCtCNSKYK0I1IpgrQjUimCtCNSKYK0I1IpgrQjUimCtCNSKYK08AB6Wh8vqqLD1TeoUjaOiYHhU2M7VYOdymPzhcnRp3ksiz2vpuOc4zN4ChMfzS4s//Z5OP1E5qrm7Wc9+WVh67M/zwdS9wHTFxuWSvWus5zSA6/JdoZLTvyy1WELF/Atdj6kied0CxRJAqTqKqY3htREUU1vKv3T12Mz4nOfoBh/CyoUwGyEsLj2/ok4TUTj2dYZwlMUNYQhDWNwQxieET/uS8RlStrOGrRSYHKhTMtQVmMySueq10etAYONyWNmMF9AbM4fCu5JxeLDR7iiMSxvlfUK4tLLtGRO6d6inkejdleErMgszcTMTNzNxM9+Xm4mPzc0EL1m3/Rk86P2fqGJgYXXvqjUZunUp2iYDGJizhndNmozk2OzIoHbRu9lARoJj6ueRDHtTQ3aEY/JqPu/27ZxOEZjMstlkBeRYBKYUy7Br1LwFBvrI4D2ai8AkxTml5/uIwjFJ2aqxS/yLG8e+WWfmxdcbFYf0DYS7qg/p20NncGjSxyZ9bNLHvt8+lhjzq7xwzD7/DR+8s/Aa8py8yZhD15DBSIIPOoG7NhnW2PpYiI8o7kqzf/gKUTgmV7Kx757hjwUcUzf76K8SB4d0Fz2rBfYVb2ZWdcxvGxyTbXf0z/whfkugdonWL9BcOKZe3jWa20UUjg0pPecTbSIjITBZgN0Cq6DPHwJTurRodwfrEmDj6szBhtc7M4fCv2a/0HcnL8xJZ5505v9jZ7738j/yYp1LVyIAAA=='
}