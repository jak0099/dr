globalThis.verifyBox = function(HOST, rule) {
    const firstRes = request(HOST, {
        headers: rule.headers,
        withHeaders: true,
        redirect: false,
        method: 'GET'
    });    
    const res = typeof firstRes === 'string' ? JSON.parse(firstRes) : firstRes;
    const html = res.body || firstRes;    
    if (!html.includes('人机验证') && !html.includes('防火墙正在检查您的访问')) {
        return html;
    }    
    const setCookie = res['set-cookie'] || '';
    let phpsessid = '';    
    if (Array.isArray(setCookie)) {
        for (const c of setCookie) {
            if (c.includes('PHPSESSID')) {
                phpsessid = c.split(';')[0].trim();
                break;
            }
        }
    } else if (setCookie.includes('PHPSESSID')) {
        phpsessid = setCookie.split(';')[0].trim();
    }    
    if (phpsessid) {
        rule.headers.cookie = phpsessid;
        if (typeof rule_fetch_params !== 'undefined') {
            rule_fetch_params.headers = {...rule.headers};
        }
    }    
    const tokenMatch = html.match(/var token = encrypt\("([^"]+)"\)/);
    if (!tokenMatch) return html;    
    const encrypt = (str) => {
        const staticchars = "PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN";
        let encodechars = "";        
        for (let i = 0; i < str.length; i++) {
            const idx = staticchars.indexOf(str[i]);
            const code = idx === -1 ? str[i] : staticchars[(idx + 3) % 62];
            encodechars += staticchars[Math.floor(Math.random() * 62)] + 
                          code + 
                          staticchars[Math.floor(Math.random() * 62)];
        }        
        try {
            return btoa(encodechars);
        } catch (e) {
            if (typeof Buffer !== 'undefined') {
                return Buffer.from(encodechars).toString('base64');
            }
            return encodechars;
        }
    };    
    const value = encrypt(HOST);
    const token = encrypt(tokenMatch[1]);
    const postData = `value=${value}&token=${token}`;    
    const verifyRes = request(`${rule.host}/robot.php`, {
        headers: {
            ...rule.headers,
            'content-type': 'application/x-www-form-urlencoded',
            'origin': rule.host,
            'referer': HOST
        },
        withHeaders: true,
        method: 'POST',
        body: postData
    });    
    const verifyJson = typeof verifyRes === 'string' ? JSON.parse(verifyRes) : verifyRes;
    let verifyBody;    
    if (typeof verifyJson.body === 'string') {
        try {
            verifyBody = JSON.parse(verifyJson.body);
        } catch {
            verifyBody = {msg: 'error'};
        }
    } else {
        verifyBody = verifyJson.body || verifyJson;
    }    
    if (verifyBody.msg === 'ok') {
        const start = Date.now();
        while (Date.now() - start < 1500) {}        
        const finalRes = request(HOST, {
            headers: rule.headers,
            withHeaders: false,
            redirect: false,
            method: 'GET'
        });        
        return typeof finalRes === 'string' ? finalRes : (finalRes.body || finalRes);
    }    
    return html;
};

var rule = {
    类型: '影视',
    title: '剧巴巴',
    //host: 'https://www.jubaba.vip',
    host: 'https://www.jubaba.cc',
    //hostJs: 'let html=request(HOST,{headers:{"User-Agent":MOBILE_UA}}); let src= jsp.pdfh(html,".content-top&&a:eq(0)&&href");HOST=src',
    headers: {'User-Agent': 'MOBILE_UA'},
    编码: 'utf-8',
    timeout: 5000,
    homeUrl: '/',
    url: '/vodshow/fyclass-fyfilter.html',
    filter_url: '{{fl.area}}-{{fl.by}}-{{fl.class}}-{{fl.lang}}-{{fl.letter}}---fypage---{{fl.year}}',
    detailUrl: '',
    searchUrl: '/vodsearch/**----------fypage---.html',
    searchable: 2,
    quickSearch: 1,
    filterable: 1,
    class_name: '电影&剧集&综艺&动漫',
    class_url: '1&2&3&4',
    filter_def: {},
    play_parse: true,
    /*lazy: $js.toString(() => {
        let pclick = 'document.querySelector("#playleft iframe").contentWindow.document.querySelector("#start").click()';
        input = {
            parse: 1,
            url: input,
            js: pclick,
            click: pclick
        }
    }),*/
    lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",    
    limit: 9,
    double: false,
    推荐: '.lazyload;.lazyload&&title;.lazyload&&data-original;.text-right&&Text;a&&href',
    一级: $js.toString(() => {
        let html = globalThis.verifyBox(input, rule);
        let d = [];
        let list = pdfa(html, '.ewave-vodlist li');
        list.forEach(it => {
            let title = pdfh(it, '.title&&Text');
            let href = pdfh(it, 'a.thumb-link&&href');
            let pic = pdfh(it, '.ewave-vodlist__thumb&&data-original');
            let remark = pdfh(it, '.pic-text&&Text') || '';
            let score = pdfh(it, '.pic-tag-h&&Text') || '';            
            d.push({
                title: title,
                img: pic,
                desc: remark + ' ' + score,
                url: href
            });
        });
        setResult(d);
    }),
    二级: {
        title: 'h1&&span:eq(0)&&Text;.data--span:eq(0)&&Text',
        img: 'img.lazyload&&data-original',
        desc: '.v-thumb&&span&&Text;.data:eq(0)&&a:eq(-1)&&Text;.data:eq(0)&&a:eq(-2)&&Text;.data--span:eq(1)&&Text;.data--span:eq(2)&&Text',
        content: 'meta[name^=description]&&content',
        tabs: '.nav-tabs&&a',
        tab_text: 'body&&Text',
        lists: '.ewave-content__playlist:eq(#id)&&a',
        list_text: 'body&&Text',
        list_url: 'a&&href',
    },
    搜索: '*',
    filter: 'H4sIAAAAAAAAA+2ZW08bRxTH3/kYfqbSGnJr3nK/3++J8uBGVhs1pVKglRBCAoyJIYkNiOBQGwgNt1AMhqQUTI2/jGfX/hYde875n3FbVlabVkq7b/v7n53ZOWd2dv6a7WkJhUNHH7T0hL6OdoeOhh49iXR2hlpDHZFvohrV8JIbi2v+PvLkOy086Al11OT4cjW2XJM1hHpbSZ3M6vtJJeCYl9igjgQ45vaPun2TFCNAnyPL5WKW+zSAPpfG1M4u92kA7TBwATwv8bpcGObnGeBYJbeoXqxQjADPG1n3ihwjsMbpTezKOGuA2MIzGScBxpJbLO+94bEYQLuh8erUO25nAO1mVvTIuZ0BxAZWvckxjhlALDbiDvzAMQPIbzel4tucnwGOVafH3dcLFCNAn5PPKsMF7tMActhb8yZ+VsUNTgOMO1LzlbeYKQOIJYdUapNjBjBTpVFdZ54pA1K5rDs9hsrVAbHBkvcTZ0KAChTHvN1sw4AbpN6Hva1YKpGn0Yi1UrJ59aLQ7EqZX6pODfEYDKDSi1Pu9jpX2oDUKu/u7KFWdcDY95IqU+RRG8AMvX8lMQLU8fmGxAjQLr3gZle5nQGMc/adtCOQWf9FYgQylrw9lnxDu5d5VVjkdgbQbjClK6USvCCEkclCyUvlvOEpTgYsq/SN+7ykm2GhMuOO+FZ5l79FBA2z/iTS8aXMemU9V1nua3bWM0V9P/dtwJoFiRFgZjfnJUaAWUgX1cu0hIWtebLCBqz5lRiB9c5YMQPW/FqZGLAqqNZiUsEaNFSwOxp5KhV001vV9IcmK9jmtB0grX5p6e2it9t6m+htth4WPWzrjuiOpYc/h64vLf2I6Eds/bDoh239kOiHbP2g6AdtXfIN2/mGJd+wnW9Y8g3b+YYl37Cdb1jy1ZeNb3q0qytqzZTKpd31l03O1DESjkE5TspxKCdIOQHlJCknoZwi5RSU06SchnKGlDNQzpJyFso5Us5BOU/KeSgXSLkA5SIpF6FcIuUSlMukXIZyhZQrUK6SchXKNVKuQblOynUoN0i5AeUmKTeh3CLlFpTbpNyGcoeUO1DuknIXyj1S7kG5T8p9KM5nvAhqVw3vyhfd1opOjqtC6g/viSx0DV2P9a3cb7lQcPMTFPnqcVenfBXXB1WC98nOR98+jdYe2/KwtSXU9tFcq4//8HOKxgSp/i0VSzX4IpKaccVqbUsV8B010KTb3NcV+7lNP1fs57X8nGF5Z068FoG4zbg7xV6GAM97NSQOlsDyYVIzgqZ36L/jy4bi+n74xjo043f+qmfz81f+fm5/D+Xr5ybz2vKo6TmYdebA//ze/wQ+5hP2MdAdydex83UkX8fO15F8HTtfR/J17Hwdydex83UkX30Z+KrAV30ivqr9Y/mqat+wt9TH310Dti8YnLV8gQaMba1UySd4JzCAduM5d4TPbgjkWx53t9mjEMge8L68M4o9oA7WPlt9y2MhQKywotZmOGYAz8tsWqdeBtBuYtb9gJNJA2i3ve0mUuXCuJxeNUiow4cftdPiOhhAHxsDlf4X3NrAv+GBtK/RDgajroO1l+rdVfbSGiC2uqQryzEDgasIXEXgKgJXEbiK/4GrOPCxXIWfc/D7H+jFcpU5diME6DO57I3yuAkQG53xVvEvzYDslPv/n6uMTleSfHJEgD7fzKkM9gcD6NPnZMfNFqx/fgbwPJ+/YX6nWCqvy8TzTGDHFt5bMQ2o5/xe+Vf+j0iAdslZlchwOwPy9myqHDsxAvSZGXGn2FERSF02VCmNutTB2lP/uROhTLFcwOmdAWuf3/f0xtcp/ZkbajaXwCkFTilwSoFTCpzSf9AptfT+BgWl0kCQJQAA'
}