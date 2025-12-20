globalThis.yanzheng = function(HOST, rule) {
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

//发布页 https://www.jddzx.vip
var rule = {
    title: '剧多多',
    host: 'https://www.jddzx.cc',
    url: '/vodshow/id/fyclass/page/fypage.html',
    detailUrl: '/vod/fyid.html',
    searchUrl: '/vodsearch.html?wd=**',
    searchable: 2,
    quickSearch: 1,
    filterable: 1,
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    class_name: '电影&剧集&动漫&综艺&短剧',
    class_url: 'dianying&juji&dongman&zongyi&duanju',
    lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",        
    limit: 9,
    double: false,
    推荐: 'a.module-poster-item.module-item;a&&title;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href',
    一级二: 'a.module-poster-item.module-item;a&&title;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href',
    一级: $js.toString(() => {
        let html = globalThis.yanzheng(input, rule);            
        let d = [];
        let p = rule.一级二.split(';');
        let arr = pdfa(html, p[0]);//列表
        arr.forEach(it => {
            d.push({
                title: pdfh(it, p[1]),//标题
                pic_url: pdfh(it, p[2]),//图片
                desc: pdfh(it, p[3]),//描述
                url: pdfh(it, p[4]),//链接                
            });
        });            
        setResult(d);
    }),    
    二级: {
        title: 'h1&&Text;.module-info-tag-link:eq(2)&&Text',
        img: 'img.lazyload&&data-original||src',
        desc: '.module-info-item:eq(4)&&Text;.module-info-item:eq(3)&&Text;.module-info-tag-link:eq(1)&&Text;.module-info-item:eq(2)&&Text;.module-info-item:eq(1)&&Text',
        content: 'meta[name^=description]&&content',
        tabs: '.module-tab-items-box span',
        tab_text: 'body&&Text',
        lists: '.module-play-list-content:eq(#id)&&a',
        list_text: 'body&&Text',
        list_url: 'a&&href',
    },    
    搜索: $js.toString(() => {    
        let html = globalThis.yanzheng(MY_URL, rule);
        let d = [];
        let list = pdfa(html, '.module-card-item');
        list.forEach(it => {
            let title = pdfh(it, '.module-card-item-title&&Text');            
            let pic = pdfh(it, '.lazyload&&data-original');
            let remark = pdfh(it, '.module-item-note&&Text') || '';
            let href = pdfh(it, 'a&&href');
            let score = pdfh(it, '.module-info-item&&Text') || '';                        
            d.push({
                title: title,
                img: pic,
                desc: remark + ' ' + score,
                url: href
            });
        });
        setResult(d);
    }), 
}