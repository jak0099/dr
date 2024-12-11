var rule={
  title: "小猫电影院",
  模板: '首图',
  host: "http://dy.dglocks.com",
  url: "/index.php/vod/show/id/fyclass/fyfilter.html",
  searchUrl: "/index.php/vod/search/page/fypage/wd/**.html",
  filterable: 1,
  filter: 'H4sIAAAAAAAAA+2aa08bRxSG/4s/U5mFXEi+5X6/31PlgxtZbVRCJaCVUBQJMHYMAWwQsePa3BrMrRgbcCmsa/xndnbtf5FlZj17zjGt11Kpkmo+7vO+nJ2ZnRm/s+wbn+Y7++0b34/BAd9ZHxtdMUNhX5uvJ/A6CK9/CXT/HOTGHoTtC9/bNoeGV2uh1QaayNh2h77sDvT1+QXyS4sV3XLLCYtArsUcipuDCWQRyLWwsVWjnME34gjcaGWK7ZfwjTgCVWDXnCocgbZEPxr6KG4LR66lmltm4+vIIhBoy1jeKmOLQKhH1kyJ9shGwJJ9R3skEGhubtk4WMDN5QhUiUzXUmu4Ckegyty63UlchaOWnpE5vGElprCFI2AJjZnDv2ILR2DoSjEW3sNDx5Frqc1Omx+zyCIQuFHiXXVUxzfiCIzLwaY18wcrb+GhqVNgjC1VP5FZwxGwTEZYbBtbOAKzphK3ny+eNRzBJ5UxZ6fIkzpEwDJSsX7HXRcIDGB5yipljugaFGz7i8M/cHaGTIGN62BnqF+TnUFiDzvD0kotFXFooDcY8AsCnuJyytzLQ4cgcOAL5v4BqsEJ6OvBJEuXoUMQMBF2PhCHIODBvN8iDkFAjWTWzGygGpyAvsyvkRqCwNn2J3EIAltaaGhpAdeYKDB9GdXgBNQYidnDzKJrqEwdgj5nK1YsZ42mULfrEG5SC+b7iv3X6KZ1CHzhXaOUQCZOyDTbLxqlMphm9WsyzSRuPs062jtOOMw/EAz0+jkAaidVO6HaQdUOqGpU1aDaTtV2oGpniGoDoHZRtQuqp6l6GqqnqHoKqiepehKqdKw0OFYaHSsNjpVGx0qDY6XRsdLgWGl0rGwAJ0Y1n6uuDroTQ17jieFiD/tPumzb67ftDvR873cQWPfU4SC5u2wvUYeD5LpPltlEkppcCvaHBpNAYI+hDgeBnazBIRDYYxr6LBBYp2wzhB0CoXWaS5r5CbBO69dknUrc/HGck/cM9vcHe/3npHKeKOelcoEoF6RykSgXpXKJKJekcpkol6VyhShXpHKVKFelco0o16RynSjXpXKDKDekcpMoN6Vyiyi3pHKbKLelcocod6Rylyh3pXKPKPekcp8o96XygCgPpPKQKA+l8ogoj6TymCiPpfKEKE+k8pQoT6XyjCjPpPKcKM+l0v7NGaIdErgwzMlppsfchSGv8cJwMVwCZnK3liw69LsBf/+r10H3F9TQdbMw46o/vOrvA7/X+REWjbhq38ufeoP8x/VFm6/jmM94zeOvh0OTCOhsaJeFYsgIBRAomh8s2eYu03PYwlGrx7BmB0sPxzAPB0sPRwQPRx9jf5EeEQSCZ6ywmcrjh8ERaMuHCD3vCYROEfQBCPQ3oc+pclTqO4bDRSRs21Hc5KSVQP5vHD+aHwy8HFCaxX4PB5REwQ7lbHYRlalDFdNVTFcx/b+K6Spiq4gNFBWx/w8Ru/N4I3ZtcNRaqe+YTizmCKe6kfmGVDcyD3qwWakWosgiEKgynTPH8OtjgWCmCZt7OIQKBMPVjrEfx83lCOWe2ifcXIGARV9nm3PYwhFoS3q74S0+R6DKzLxZJP/14QhU2dszozFDn6bv36EAhrH4m5268TByBCpuDVeHxnEtjr6A5GtHWDumoiDICUqt9q8aSa02AY6NFftpIQcnKieqnKhyosqJKieqnKhyoq8xJ5443pzoIQR6+ArGCuWqizhtCgQCwOSqFY/gG3EELPE5a4N87cFRS1+eVOOz1Un85lggcKOFRZbG73kFauklrpnRGz5x4ailLzQ8vOhmBXu0i7gtHGFLdqfBkt0Bz2jpwPgLfygjEHyhPM+iaVyFIziTt1kOB3WBwI3SY2YKR2yB4OhusUqSjO4h+iJeBafLho4/T+CklZe0/xB3j+qfenGqArEKxCoQq0CsArEKxE2+TeiCiVitXbV21dr9WtZuZ7tau2rtqrX79a3dt58BCFQZI/k1AAA=',
  filter_url: "{{fl.地区}}{{fl.排序}}{{fl.剧情}}{{fl.语言}}{{fl.字母}}/page/fypage{{fl.年份}}",
  class_parse: ".myui-header__menu&&li;a&&Text;a&&href;id/(\\d+)",
  cate_exclude: "",
  play_parse: true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  二级: {
    title: "h1&&Text;.myui-content__detail p:eq(1)--span&&a&&Text",
    img: ".lazyload&&data-original",
    desc: ".pic-text.text-right&&Text;.myui-content__detail p:eq(1)--span--span&&a:eq(2)&&Text;.myui-content__detail p:eq(1)--span--span&&a:eq(1)&&Text;.myui-content__detail p:eq(3)--span&&Text;.myui-content__detail p:eq(4)--span&&Text",
   content: ".myui-content__detail p:eq(-1)--span&&Text",
    tabs: ".nav.nav-tabs .item&&li",
    lists: ".myui-content__list:eq(#)&&li",
  },
}