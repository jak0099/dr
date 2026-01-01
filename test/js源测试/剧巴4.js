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
}