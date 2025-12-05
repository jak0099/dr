globalThis.yanzheng = function(HOST, rule) {
    const firstRes = request(HOST, {
        headers: rule.headers,
        withHeaders: true,
        redirect: false,
        method: 'GET'
    });
    
    const firstResJson = typeof firstRes === 'string' ? JSON.parse(firstRes) : firstRes;
    const firstHtml = firstResJson.body || firstResJson;
    
    if (!firstHtml.includes('人机验证') && !firstHtml.includes('防火墙正在检查您的访问')) {
        return firstHtml;
    }
    
    const setCookie = firstResJson['set-cookie'] || '';
    let phpsessid = '';
    
    if (Array.isArray(setCookie)) {
        for (let c of setCookie) {
            if (c.includes('PHPSESSID')) {
                phpsessid = c.split(';')[0].trim();
                break;
            }
        }
    } else if (setCookie && setCookie.includes('PHPSESSID')) {
        phpsessid = setCookie.split(';')[0].trim();
    }
    
    if (phpsessid) {
        rule.headers["cookie"] = phpsessid;
        rule_fetch_params.headers = Object.assign({}, rule.headers);
    }
    
    const tokenMatch = firstHtml.match(/var token = encrypt\("([^"]+)"\)/);
    if (!tokenMatch) {
        return firstHtml;
    }
    
    const tokenToEncrypt = tokenMatch[1];
    
    function encrypt(_str) {
        const staticchars = "PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN";
        let encodechars = "";
        
        for(let i = 0; i < _str.length; i++) {
            const num0 = staticchars.indexOf(_str[i]);
            let code;
            if(num0 === -1) {
                code = _str[i];
            } else {
                code = staticchars[(num0 + 3) % 62];
            }
            const num1 = Math.floor(Math.random() * 62);
            const num2 = Math.floor(Math.random() * 62);
            encodechars += staticchars[num1] + code + staticchars[num2];
        }
        
        try {
            return btoa(encodechars);
        } catch (e) {
            if (typeof Buffer !== 'undefined') {
                return Buffer.from(encodechars).toString('base64');
            }
            return encodechars;
        }
    }
    
    const value = encrypt(HOST);
    const token = encrypt(tokenToEncrypt);
    
    const postData = `value=${value}&token=${token}`;
    const robotUrl = rule.host + '/robot.php';
    
    const verifyRes = request(robotUrl, {
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
    
    const verifyResJson = typeof verifyRes === 'string' ? JSON.parse(verifyRes) : verifyRes;
    
    let verifyBody;
    if (typeof verifyResJson.body === 'string') {
        try {
            verifyBody = JSON.parse(verifyResJson.body);
        } catch (e) {
            verifyBody = {msg: 'error'};
        }
    } else {
        verifyBody = verifyResJson.body || verifyResJson;
    }
    
    if (verifyBody.msg === 'ok') {
        let start = Date.now();
        while (Date.now() - start < 1500) {}
        
        const finalRes = request(HOST, {
            headers: rule.headers,
            withHeaders: true,
            redirect: false,
            method: 'GET'
        });
        
        const finalResJson = typeof finalRes === 'string' ? JSON.parse(finalRes) : finalRes;
        if (finalResJson.body) {
            return finalResJson.body;
        }
        return finalRes;
    } else {
        return firstHtml;
    }
};

var rule = {
    类型: '影视',
    title: '剧巴巴',
    host: 'https://www.jubaba.cc',
    headers: {'User-Agent': 'MOBILE_UA'},
    编码: 'utf-8',
    timeout: 5000,
    homeUrl: '/',
    url: '/vodshow/fyclass--------fypage---.html',
    detailUrl: '',
    searchUrl: '/vodsearch/**----------fypage---.html',
    searchable: 1,
    quickSearch: 1,
    filterable: 1,
    class_name: '电影&剧集&综艺&动漫',
    class_url: '1&2&3&4',
    play_parse: true,
    lazy: $js.toString(() => {
        let pclick = 'document.querySelector("#playleft iframe").contentWindow.document.querySelector("#start").click()';
        input = {
            parse: 1,
            url: input,
            js: pclick,
            click: pclick
        }
    }),
    limit: 9,
    double: false,
    推荐: '.lazyload;.lazyload&&title;.lazyload&&data-original;.text-right&&Text;a&&href',
    一级: $js.toString(() => {
        const url = MY_URL || input;
        const isVodshowPage = url.includes('/vodshow/');
        
        if (isVodshowPage) {
            const result = globalThis.yanzheng(url, rule);
            let list = pdfa(result, '.ewave-vodlist li');
            let videos = [];
            list.forEach(item => {
                let title = pdfh(item, '.title&&Text');
                let href = pdfh(item, 'a.thumb-link&&href');
                let pic = pdfh(item, '.ewave-vodlist__thumb&&data-original');
                let remark = pdfh(item, '.pic-text&&Text') || '';
                let score = pdfh(item, '.pic-tag-h&&Text') || '';
                let actor = pdfh(item, '.text-actor&&Text') || '';
                
                if (href) {
                    let fullUrl = href;
                    if (href.startsWith('/')) {
                        fullUrl = rule.host + href;
                    } else if (!href.startsWith('http')) {
                        fullUrl = rule.host + '/' + href;
                    }
                    
                    videos.push({
                        vod_id: fullUrl,
                        vod_name: title,
                        vod_pic: pic,
                        vod_remarks: remark,
                        vod_score: score,
                        vod_actor: actor,
                    });
                }
            });
            VODS = videos;
        }
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
}