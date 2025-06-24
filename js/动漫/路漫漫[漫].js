var rule = {
    title: "路漫漫",
    host: "https://www.lmm88.com",
    url: "/vod/show/id/fyclassfyfilter.html",
    searchUrl: "https://m.lmm52.com/vod/search/page/fypage/wd/**.html",
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    filter: "H4sIAAAAAAAAAO2Su04CURCG32XqNXu/wKsYitVsAlHRcEs2hISoECuJxqhRYqMFxkIKKFgLXoY9Lm/hHtB1mPqUU87//Tt7kvm6YEN5vwtHUQxlSBez1dcraFAPTyI8d8LjdrQp1mU8mKwvJjLOB+hp29QyLOc30+MobOibAFGbUhtTi1ILU5NSE1ODUgNRs0RoHiAaUBpg6lPqY+pR6mHqUuoWVDzPxMM75c6eWQryp1dkbXsRcX2bJqP/ixTz7kXEuJ8tb+TW++nf1oNYb9Xyj4p/jvvrj8dVkojpHepUa60m6WSfl+nVEHWah6eNnUXp29P3+SKbv6BS+0y+vKKBw0axUUqNctkoNkqpUR4bxUYpNcpno9gopUYFbBQbpdCo3g8SNsur7Q0AAA==",
    filter_url: "{{fl.排序}}{{fl.年代}}/page/fypage",
    filter_def: "",
    headers: {
        "User-Agent": "MOBILE_UA"
    },
    timeout: 5000,
    class_name: "日本动漫&国产动漫&欧美动漫&日本动画电影&国产动画电影&欧美动画电影",
    class_url: "6&7&8&3&4&5",
    class_parse: "",
    cate_exclude: "",
    play_parse: true,
    /*
    lazy: $js.toString(() => {
        input = {parse: 1, url: input, js: ''};
    }),*/
    lazy: $js.toString(() => {
        url = input;
        let true_url = '';
        var surl = url;
        var host = HOST;
        var html = request(url);
        var play = {};
        try {
            play = JSON.parse(html.match(/r player_.*?=(.*?)</)[1]);
        } catch (e) {}
        //log(play)
        var path = host + '/static/player/' + play.from + '.js';
        var parse = fetch(path);
        var match = /src = (.*?);/.exec(parse);
        if (match) {
            parse = match[1];
        } else {
            parse = /src=(.*?)\+'/g.exec(parse)[1].replace(/^"/, "'");
        }
        
        var window = {
            location: {
                href: surl
            }
        }
        var MacPlayer = {
            Parse: '',
            PlayUrl: play.url,
        }
        if(/mp4|m3u8/.test(play.url)){
            input = { parse: 0, url: play.url.replace(/&t=hls&ct=1|&t=hls/,"")  }
        }

        let trul = '';
        eval('turl=' + parse);
        let phtml = '';
        var json = JSON.parse(fetch(turl, {
            headers: {
                Referer: surl,
            },
            onlyHeaders: true
        }))
        if (turl != json.url) {
            phtml = fetch(json.url, {
                headers: {
                    Referer: turl,
                },
            });
            turl = json.url;
        } else {
            phtml = json.body;
        }      

        try {
            eval(phtml.match(/var vid = [\s\S]*?play.*;/g)[0]);
        } catch {}
        
        try {
            eval(phtml.match(/var weParse[\s\S]*?(?=function)/g)[0]);
        } catch {}
        
        
        eval(getCryptoJS());

        function getc(_0xdab24c) {
            var _0x32508f = gett('BlILGwo2OBoAATIXE1NXCwQALg0KE1xS');
            var _0x32508f = decode3(_0x32508f);
            var _0x145ef1 = '1348987635684651';
            var _0x4e339a = getDAesString(_0xdab24c, _0x32508f, _0x145ef1);
            return _0x4e339a;
        }

        function getDAesString(_0x4894f5, _0x94982e, _0x1a5246) {
            var _0x94982e = CryptoJS.enc.Utf8.parse(_0x94982e);
            var _0x1a5246 = CryptoJS.enc.Utf8.parse(_0x1a5246);
            var _0x5e248d = CryptoJS.AES.decrypt(_0x4894f5, _0x94982e, {
                'iv': _0x1a5246,
                'mode': CryptoJS.mode.CBC,
                'padding': CryptoJS.pad.Pkcs7
            });
            return _0x5e248d.toString(CryptoJS.enc.Utf8);
        }

        function base64decode2(_0x6288a9) {
            var _0x129e5e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var _0x135129, _0x2e0a45, _0x4ce1d8, _0xff4692, _0x2b9846, _0x596dac, _0x1e1130, _0x137328, _0x52e869 = 0,
                _0x5997e8 = 0,
                _0x51fd8d = '',
                _0x408cf1 = [];
            if (!_0x6288a9) {
                return _0x6288a9;
            }
            _0x6288a9 += '';
            do {
                _0xff4692 = _0x129e5e.indexOf(_0x6288a9.charAt(_0x52e869++));
                _0x2b9846 = _0x129e5e.indexOf(_0x6288a9.charAt(_0x52e869++));
                _0x596dac = _0x129e5e.indexOf(_0x6288a9.charAt(_0x52e869++));
                _0x1e1130 = _0x129e5e.indexOf(_0x6288a9.charAt(_0x52e869++));
                _0x137328 = _0xff4692 << 0x12 | _0x2b9846 << 0xc | _0x596dac << 0x6 | _0x1e1130;
                _0x135129 = _0x137328 >> 0x10 & 0xff;
                _0x2e0a45 = _0x137328 >> 0x8 & 0xff;
                _0x4ce1d8 = _0x137328 & 0xff;
                if (_0x596dac == 64) {
                    _0x408cf1[_0x5997e8++] = String.fromCharCode(_0x135129);
                } else if (_0x1e1130 == 64) {
                    _0x408cf1[_0x5997e8++] = String.fromCharCode(_0x135129, _0x2e0a45);
                } else {
                    _0x408cf1[_0x5997e8++] = String.fromCharCode(_0x135129, _0x2e0a45, _0x4ce1d8);
                }
            } while (_0x52e869 < _0x6288a9.length);
            _0x51fd8d = _0x408cf1.join('');
            return _0x51fd8d;
        }

        function gett(_0x55e7f2) {
            key = 'daolianlaopowanrenlun';
            _0x55e7f2 = base64decode2(_0x55e7f2);
            len = key.length;
            code = '';
            for (i = 0; i < _0x55e7f2.length; i++) {
                k = i % len;
                code += String.fromCharCode(_0x55e7f2.charCodeAt(i) ^ key.charCodeAt(k));
                ttcode = base64decode2(code);
            }
            return ttcode;
        }

        function decode3(input) {
            var sortedString = input.split('').sort((char1, char2) => {
                return char1.localeCompare(char2, 'zh-CN');
            }).join('');
            return sortedString;
        }

        var [_, u, body] = /\$\.post\("(.*?)",.?({.*?})/g.exec(phtml);

        eval('body=' + body);
        var php = "<a href='" + u + "'>";
        var p = pd(php, 'a&&href', turl);
        
        var tbody = Object.keys(body).map(it=>{
          return it+"="+body[it]
        }).join("&")
        log(tbody)
        
        var json = request(p, {
            body: tbody,
            method: "POST",
            headers: {
                Referer: turl,
            }
        })
        try {
            true_url = JSON.parse(json).url;
            true_url = decodeURIComponent(true_url);
        } catch {}
        input = {parse:0,url: true_url}
    }),
    double: false,
    推荐: "*",
    一级: ".video-img-box;h6.title&&Text;.lazyload&&data-src;.label&&Text;a&&href",
    二级: {
        title: ".page-title&&Text;.tag-link&&Text",
        img: ".module-item-pic&&.lazyload&&src",
        desc: ".video-info-items:eq(3)&&Text;.video-info-items:eq(2)&&Text;;.video-info-items:eq(1)&&Text;.video-info-items:eq(0)&&Text",
        content: ".video-info-content&&Text",
        tabs: ".module-tab-item.tab-item",
        lists: ".module-player-list:eq(#id) a",
        tab_text: "body&&Text",
        list_text: "body&&Text",
        list_url: "a&&href"
    },
    detailUrl: "",
    搜索: "*"
}