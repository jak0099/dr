globalThis.getSignStr = function (params) {
    // d3dGiJc651gSQ8w1
    const sign_key = "d3dGiJc651gSQ8w1";
    let keys = Object.keys(params)
        .sort();
    let sign_str = keys.reduce((pre, n) => pre + n + "=" + params[n], "") + sign_key;
    return md5(sign_str);
}

function novelContentDecrypt(data, iv) {
    let key = CryptoJS.enc.Hex.parse("32343263636238323330643730396531");
    iv = CryptoJS.enc.Hex.parse(iv);
    let HexStr = CryptoJS.enc.Hex.parse(data);
    let Base64Str = CryptoJS.enc.Base64.stringify(HexStr);
    let decrypted = CryptoJS.AES.decrypt(Base64Str, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

globalThis.decodeContent = function (response) {
    let txt = CryptoJS.enc.Base64.parse(response)
        .toString();
    let iv = txt.slice(0, 32);
    let _content = novelContentDecrypt(txt.slice(32), iv)
        .trim();
    return _content;
}

var rule = {
    类型: '小说', //影视|听书|漫画|小说
    title: '7猫小说[书]',
    host: 'https://www.qimao.com/',
    url: '/shuku/fyclass-fyfilter-fypage/',
    class_name: '全部&女生原创&男生原创&出版图书',
    //detailUrl:'https://api-bc.wtzw.com/api/v1/reader/detail?id=1747899',
    listUrl: 'https://api-ks.wtzw.com/api/v1/chapter/chapter-list',
    listUrl2: 'https://www.qimao.com/api/book/chapter-list',
    contentUrl: 'https://api-ks.wtzw.com/api/v1/chapter/content',
    class_url: 'a&1&0&2',
    searchUrl: 'https://api-bc.wtzw.com/search/v1/words#fypage',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    filter: "H4sIAAAAAAAAAO1W3U4aQRR+l72GZF1EGh+iL9AYs1GaEBUbKzSNIaEgLFDKlqJujURLCohpEaTErrtFXmZ+lrfoALszO3BRbrig2ZtN9vvOzPmZ+c6ZE0EUNl+dCHvh98KmAAZVWPkAc1n8YAo+ISofhOfRuLwfC08WRQkJM61RujWGyY8sJHw2XMpCtWfDwQ2GZ6+A8dHGN0SK49syfDIdfJ3iSNdRTrXxUJDZl06JPWwobJUkSpQepQdQTwHDwGc3lA6wKBrKSDPhnxSLRRJdTttN8PwNmJfkS2nmGwwqVqpHCZbcS/SzBjNpyoSExNaY44rb1tB5d664DrpQcQMi0BVgNoDuRL/Gc/7g+OvEQbkJ6l8TXSSryRT2S26WlWQKT3wWnFPlskNXfXTRRdrjSOuz7GbQxbKD9TuYzcxlFuJwyZUxRwT4sL524OcmvC9is+IKi0cXu9G/e2wBF5g1vLYGA6C3bUbkIyh9gYbq8u38815RMY9TT1AxR4pz3Xf2Izt77FIW8yhpsotCoHeHR7tvt6OxA2ZUTVrD8rTqtlHsza58HN4+jhDv7r3OHi1NZXu9luOHRxFiGIuPw9/ykQSX0RhwqQvM71YridLzRwzV+izJzpkoHaV/ceRsn8A/rlEhSfXH2otV+0Q6Ab9xyJOnJ8/Vlae0FHmiCwW2m1beQNWOc5TrTEdkohILXH8m85rSrNTYVPF9DRYe4FCjtOSmYUafuqC0ayorBs7nYFe1On2HDoYY3S3D0yE6v3QN3+ALT8OehldWw/IqjdhlP+n/McJX5cW/uo3Ueyt5ffZ/7LOJv/U9eHXlEAAA",
    filter_url: "{{fl.作品分类 or 'a'}}-a-{{fl.作品字数 or 'a'}}-{{fl.更新时间 or 'a'}}-a-{{fl.是否完结 or 'a'}}-{{fl.排序 or 'click'}}",
    filter_def: {},
    headers: {
        'User-Agent': 'PC_UA',
    },
    sign_headers: {
        "app-version": "51110",
        "platform": "android",
        "reg": "0",
        "AUTHORIZATION": "",
        "application-id": "com.****.reader",
        "net-env": "1",
        "channel": "unknown",
        "qm-params": "",
        "sign": "fc697243ab534ebaf51d2fa80f251cb4"
    },
    timeout: 5000,
    play_parse: true,
    lazy: $js.toString(() => {
        let params = {
            id: input.split('@@')[0],
            chapterId: input.split('@@')[1],
        };
        params['sign'] = getSignStr(params);
        let contentUrl = buildUrl(rule.contentUrl, params);
        //log(contentUrl);
        let title = input.split('@@')[2];
        let content = '';
        let html = request(contentUrl, {
            headers: rule.sign_headers
        });
        //log(html);
        let json = JSON.parse(html);
        //log(json);
        let result = json.data.content;
        content = decodeContent(result);
        let ret = JSON.stringify({
            title,
            content
        });
        input = {
            parse: 0,
            url: 'novel://' + ret,
            js: ''
        };
    }),
    double: true,
    推荐: '',
    一级: 'ul.qm-pic-txt&&li;a:eq(-1)&&Text;img&&src;.s-name&&Text;a&&href;.s-des&&Text',
    二级: {
        title: 'span.txt&&Text;.qm-tag:eq(-1)&&Text',
        img: '.wrap-pic&&img&&src',
        desc: '.qm-tag&&Text;;;.sub-title&&span:eq(1)&&Text;.sub-title&&span&&a&&Text',
        content: '.book-introduction-item&&.qm-with-title-tb&&Text',
        tabs: '.qm-sheader&&img',
        lists: $js.toString(() => {
            let book_id = input.match(/shuku\/(\d+)/)[1];
            //log(book_id);
            // let params = {
            //     'chapter_ver': '0',
            //     'id': book_id,
            // };
            // log(params);
            // params['sign'] = getSignStr(params);
            // let listUrl = buildUrl( rule.listUrl,params);
            let listUrl = buildUrl(rule.listUrl2, {
                book_id: book_id
            });
            //log(listUrl);
            let html = request(listUrl);
            let json = JSON.parse(html);
            let chapters = json.data.chapters;
            LISTS = [chapters.map(it => it.title + '$' + book_id + '@@' + it.id + '@@' + it.title)];
        }),
        tab_text: 'img&&alt',
        list_text: 'body&&Text',
        list_url: 'a&&href',
        list_url_prefix: '',
    },
    搜索: $js.toString(() => {
        let params = {
            'extend': '',
            'tab': '0',
            'gender': '0',
            'refresh_state': '8',
            'page': MY_PAGE,
            'wd': KEY,
            'is_short_story_user': '0'
        };
        params['sign'] = getSignStr(params);
        let _url = buildUrl(rule.searchUrl.split('#')[0], params);
        //log(_url);
        let html = request(_url, {
            headers: rule.sign_headers
        });
        let json = JSON.parse(html);
        //log(json);
        let d = [];
        json.data.books.forEach(it => {
            if (it.show_type === '0') {
                d.push({
                    title: it.original_title,
                    desc: it.author,
                    img: it.image_link,
                    url: `https://www.qimao.com/shuku/${it.id}/`,
                });
            }
        });
        setResult(d);
    }),
}