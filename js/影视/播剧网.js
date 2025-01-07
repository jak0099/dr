//发布页 https://www.dyxq.cc
var rule = {
    类型: '影视',
    title: '播剧',
    host: 'https://www.dyxq.cc',
    hostJs:'print(HOST);let html=request(HOST,{headers:{"User-Agent":MOBILE_UA}});let src=jsp.pdfh(html,"#url-list a:eq(1)&&href");print(src);HOST=src',
    url: '/vodshow/fyfilter.html',
    searchUrl: '/vodsearch/page/fypage/wd/**.html',
    headers: {
        'User-Agent': 'UC_UA'
    },
    searchable: 1,
    quickSearch: 0,
    filterable: 1,
    double: true,
    play_parse: true,
    limit: 6,
    class_name: '电影&连续剧&综艺&动漫&短剧',
    class_url: 'movie&tvplay&tvshow&dongman&duanju',
    filter_url: '{{fl.cateId}}-{{fl.area}}-{{fl.by}}-{{fl.class}}-----fypage---{{fl.year}}',
    filter_def: {
        'movie': {
            cateId: 'movie'
        },
        'tvplay': {
            cateId: 'tvplay'
        },
        'dongman': {
            cateId: 'dongman'
        },
        'tvshow': {
            cateId: 'tvshow'
        },
        'duanju': {
            cateId: 'duanju'
        }
    },
    filter: 'H4sIAAAAAAAAA+1Z21IaSxT9F57zEMzJ5eQPzjecysNEODAJDFGYKKRS5Q3FSwQtLyGixuPdiEI0BgeRn6Fnhr84PXTv3t1YIVQdHufFcu21+7Z7717dw4dAPPFeDwde/v0h8DacDrwMDGup8F+hwKOAocWpPeBU62RnkeL3WsxkjgY1k+xJe/rEM1MQ+PiIWxdOWo2SMz/HiVDCiGTMxDtdM9Bno0Tmj9FnXH9jKg5OrmpPZ9FB00d0I6K6HK+Q2zq6vA1HTc1QXOzJgj2xIbnQqbxWB6LTUAZ6Yz4YyM59blnz6JKJakYmGu72ml6wp75IHdFuknQ8HOlwTpnviO7NF9tvzLnzFtJjYSOtIzt17mysSAGjTSXasc5IYx1pxMJj4dJpnKHHP3QNpi5vmrNWVzeNTk/wrbsjpzCLfMw0YtLsyktubgfZSHhMjbJ9t0bWqq27L9whrRnDNIp0CGkK+QN3X9qJiJnxAqRGmSzPkvx3aR56MqqrHrOr7eIpesS1xLgOefHK8+I5HtOSSUxxlgf9pngnfbmVAzVzYR8YUPORcxyoZQN9MqCmOvTJgJrA0I4BNXNhPAaAc8tHZOmMcxyoyQLjMaBmCs7TA2qKA8cA5shR6/4rzIUBdc+gHQOi3c4ZnTm0Y6CfeLKKAY4BtVaBY0CsvZ4n2RqsnQHg2tur9udDznGg1i/0yYBY3/2Fs/aDNKqwRIHV5AeaATXngWNA7GKzQPcAdpEBjGrJ3l4RUe0Awc00nW+wEg5EBBorTr2kTFgxyVWkjYY1qYhKFbJk9VtEB8ft4iy3tmplstXgJhHuo6Jdu1Q8uAnDVrFv79U+mElsy+ahXTqHbWFA9L97ShvAdjIggnC/jBwHos+rdeQ4EBuyWEWOA0yDn8hxgH1W5D4rSrtPFWIdQTsGRLuZPI0ayUH1IBYzOmw6+bIzX4RJCYwl/dVebNJmoqoBC4/sTasOhcaBnAbpsDaKaWBv3rQ3r/tMg6HHQ39wW+dfyf4E7U9k+xDah2R7EO1B2f4Y7Y8le/BPYaf/SvYXaH8h25+j/blsf4b2Z7L9KdqfynZcb1BebxDXG5TXG8T1BuX1BnG9QXm9QVwv/VfeptdpaZOWV4mVf7BJuHcUpHTqKq4AlmVX1jgT1VNJzLDLGZKDSk4OJ0bD3qivHgVS79/FtPTALpZbjZZ1jMIbMRPeJeKNKRe7V8bCY1Tv4s+PvVIWfMKMh3WZr13S40MagV4/Upri0alM9KAsnYYkAhVaPGR7D++1uvYu0VVH2HxET2ly7z9+kgOJjmr6GBt+UBeXHjLT67LAtI5M3pDpvCJ/3NTPxYhc3BCrDBwDfV44fnkx6nXh6HUx6iWpvS4Ards9lFQO8FKRtYugVhyI8dZn8RLDgSS3GDMO+j13ffn15Tfgy68vv7+Q32Q0MTZA+SWzWad+h88cKn1GWM8kjIj8qaIjwoofVeGomXggxIpPR4u7u+rosTokk+Rux45wdo3paSf4DUg/2xPzzvEEHFkMyOf/zK50/lMgtuii6VZycAIwINqtlu0FeIpxgLHM2jXQIg7w+Lxq3RbE8dkB0vHZ3oe5cCA464xc7ADHgBhv67v0iGVAtFvbta/FRwgGcKNqdi7fslbxMaqYRByu/6WKCnFgQPRRnXInl6A1A77W+Vrna52vdb/XOu+DdVwzBiZ2neOBHl323TfOhWgzGKXrwSm7dd6c3X783Sf7eU+/B92x96fsxvXugedGpX167hWv7DweT4XiAxO7XoLW64u0M11290AkORB9Lp84Bdg/DgRX2HHOxRdbBkQAe3whdgvb7jI8XDkQfX7dI1vw6OSgn4elXbKkr84MiPF6fHPt9YgmFRomyHcOZO7wSuIoEPE8uMdfTjjAh+wuyW1BOwawir6TMlwQOBB9bi3YRRB6DjAuVdLcFHHpAP9B6ou0L9K+SP9PkTY7n2MHpNHtuU/eM4QelqJQhpNx/MHdOW26Nwv0lG3V94FPGyHklyuUcU8m8DPheCg9Ih0mn9zGuZNr2BviV/NMcgz5wyt7ctGeqLv7k5w3YplhnN/mGTn94hzV6V8IRjQWRX66QWpT7syKfQ3PsVBSmh/7PtuqF/F300hmfNwvNL/Qehfax/8A2XYwCdIjAAA=',
    lazy: `js:
  let html = request(input);
  let hconf = html.match(/r player_.*?=(.*?)</)[1];
  let json = JSON5.parse(hconf);
  let url = json.url;
  if (json.encrypt == '1') {
    url = unescape(url);
  } else if (json.encrypt == '2') {
    url = unescape(base64Decode(url));
  }
  if (/\\.(m3u8|mp4|m4a|mp3)/.test(url)) {
    input = {
      parse: 0,
      jx: 0,
      url: url,
    };
  } else {
    input;
  }`,
    推荐: 'body .public-list-box;.public-list-box;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    一级: 'body a.module-poster-item.module-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    二级: {
        title: 'h1&&Text;.module-info-tag-link:eq(-1)&&Text',
        img: '.lazyload&&data-original||data-src||src',
        desc: '.module-info-item:eq(-2)&&Text;.module-info-tag-link&&Text;.module-info-tag-link:eq(1)&&Text;.module-info-item:eq(2)&&Text;.module-info-item:eq(1)&&Text',
        content: '.module-info-introduction&&Text',
        tabs: '.module-tab-item.tab-item',
        lists: '.module-play-list:eq(#id)&&a',
        tab_text: 'body&&Text',
        list_text: 'body&&Text',
        list_url: 'a&&href',
        list_url_prefix: '',
    },
    搜索: 'body .module-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href;.module-info-item-content&&Text',
}