var rule={
  title: "青龙",
  host: "https://www.minggejiaoyu.xyz",
  url: "/vodshow/fyfilter.html",
  searchUrl: '/vodsearch/**----------fypage---.html',
  searchable: 2,
  quickSearch: 0,
  filterable: 1,
  filter: "H4sIAAAAAAAAA+2YXU8TQRSG/8tec9HttkC9A1H8AlQQRMOFMU00fiWiJsaYqIC0IFYMtKL1m1pUSFsFlS0Lf6Yzu/0XTrtnzjnbxOiFGBP28jzvznTmnJ13zvaOYRr7zt4xLiVvG/sMt1IVr2aNNuPquStJHt86d/lmsvng1QBWgXG3zadiaqU+sQLUJDyzUnPybnoalA5SsnmRLpLSiYqbqsiJKVISpBTnxWaVFDOCkrz/RN7LMomtIV0MzGdGaVTqWc1OkxSlCV37k3AWmUTLkNly6xqtCN+y3PrsLmwIp6JVC9X6u0kxP0MDY+0kPdiQ5UxgYIyyoqBXfOgV33uldVDj6kfHGrpfP5Evi0c21Q/jYP0I/7J+RJeL9aWHQCHA5X5Ykj9KoEGA4zJlubmtx/kBJnb7sXjhgAYBzvn6I2kQYNZzBZlfBQ0C1L6WaRwErFpi5o14+VbLGOOvflyVLwteYadmP9e/zRHuaq4s7A96V36gNW+2QiuAgFa3yFe3yDW1FDm7o1Krp8UYn9j+TqMhCJR9c71WdVjZddxSdsS/L3s0ErXwREQtzqPEo5ybxE3OI8QjjJsJ5GaC807inZx3EO/gvJ14O+dx4nHOY8RjnNN+Tb5fk/Zr8v2atN+G07ByeKU1b+UelQPjYDkI/8EpfOGox/Ub4AfsvSMNAnaaSIOAnSbSIMAT+mWZNAhwzpwj5nJsWozZ285m9gN2TrlW5pp6tdku/UBrtZ1J0iDAOScz6riIFNtrAGGmCjtuZs1NL7F8ccRPeZ4tk+LAqVvLydIcO3U6bjl1iH9f5i4AXUi6gXQj2Q9kP5IeID1IDgA5gOQgkINIeoH0IjkE5BCSw0AOIzkC5AiSo0COIjkG5BiSPiB9SPqB9CMZADKA5DiQ40hOADmB5CSQk0gGgQwiGQIyhOQUkFNIhoEMIxkBMoLkNJDTSEaBjCI5A+QMkkhrkbVvMJPUToJEexEZkXYtsiztb2Ru2gnJBrVnkmFqdyVr1T6cCLzd8vFTYWfo7cY4+HYT5luUuW/1nO5RblxUE+Axtm1ZXgDlwsUb43Q4S5MipRuN8fPXricb6xlrU1nZjQaVcq3stGYXVYuo60JJVw2Nal2YFGNbLDBONWi0M8RZa6daGeQW1b7RqhBnfenGd7GcZRJN5aYcmZ12X6+RGjfDhuD/bQjCmyK8KcKbYvdvCmtXbgrKrP/561a3vLT+eo5STv3LIqi2s40W1BUQUC3KtVwtqosjqFLe5daCWKjUtvSnacwK3T50+9DtQ7ffy24f2xW3pzzCd0Hzv1xdCNa3N/9+DKqse2/6eVBl98jUt1o1G1TZl4X/0cHVWNjeh4YfGn5o+MaeNvwEc/zQA/++B4aeFnpa6Gn/0NPu/gQh+Hk2fyEAAA==",
  filter_url: "{{fl.类型}}-{{fl.地区}}-{{fl.排序}}--{{fl.语言}}-{{fl.字母}}---fypage---{{fl.年份}}",
  filter_def: {
    1: {
      类型: "1"
    },
    2: {
      类型: "2"
    },
    3: {
      类型: "3"
    },
    4: {
      类型: "4"
    },
    49: {
      类型: "49"
    }
  },
  headers: {
    "User-Agent": "MOBILE_UA"
  },
  timeout: 5000,
  class_parse: ".nav-menu&&li.dropdown-hover;a&&Text;a&&href;(\\d+)",
  cate_exclude: "",
  play_parse: true,
  lazy:muban.mx.lazy,
  double: true,
  tab_exclude:'同类型',
  图片来源:'@Referer=https://pic.ssxmovie.shop/',
  推荐: '.minggejiaoyuui-vodlist;.minggejiaoyu-minlg-6;.lazyload&&title;.lazyload&&data-original;.pic-text&&Text;a&&href;详情',
  一级: '.minggejiaoyu-minlg-6;.lazyload&&title;.lazyload&&data-original;.pic-text&&Text;a&&href;详情',
  二级: {
    title: 'h1.title&&Text;p.data:eq(0) a:eq(0)--span&&Text',
    img: '.lazyload&&data-original',
    desc: 'p.data:eq(1)--.text-muted&&Text;p.data:eq(0) a:eq(2)--span&&Text;p.data:eq(0) a:eq(1)--span&&Text;p.data:eq(2)--span&&Text;p.data:eq(3)--span&&Text',
    content: '.sketch&&Text',
    tabs: '.nav-tabs li',
    lists: '.minggejiaoyuui-content__list:eq(#id)&&a',
    tab_text: 'body&&Text',
    list_text: 'body&&Text',
    list_url: 'a&&href',
  },
  搜索: '#searchList li;.lazyload&&title;.lazyload&&data-original;.pic-text&&Text;a&&href;.detail--h4&&Text',
}