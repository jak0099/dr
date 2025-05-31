Object.assign(muban.mxpro.二级, {
    tab_text: 'div--small&&Text',
});

function verifyLogin(url) {
    let cnt = 0;
    let cookie = '';
    let r = Math.random();
    let yzm_url = getHome(url) + '/index.php/verify/index.html';
    log(`验证码链接:${yzm_url}`);
    let submit_url = getHome(url) + '/index.php/ajax/verify_check';
    log(`post登录链接:${submit_url}`);
    while (cnt < OCR_RETRY) {
        try {
            let {cookie, html} = reqCookie(yzm_url + '?r=' + r, {toBase64: true});
            let code = OcrApi.classification(html);
            log(`第${cnt + 1}次验证码识别结果:${code}`);
            html = post(submit_url, {
                headers: {Cookie: cookie},
                body: 'type=show&verify=' + code,
            });
            html = JSON.parse(html);
            
            if (html.code === 1) {
                log(`第${cnt + 1}次验证码提交成功`);
                log(cookie);
                return cookie // 需要返回cookie
            } else if (html.code !== 1 && cnt + 1 >= OCR_RETRY) {
                cookie = ''; // 需要清空返回cookie
            }
        } catch (e) {
            log(`第${cnt + 1}次验证码提交失败:${e.message}`);
            if (cnt + 1 >= OCR_RETRY) {
                cookie = '';
            }
        }
        cnt += 1
    }
    return cookie
}

globalThis.verifyLogin = verifyLogin;

var rule = {
    模板: 'mxpro',
    title: '剧哥哥',//https://jugege.com/
    host: 'https://www.jugege.vip',//发布页
    hostJs:'print(HOST);let html=request(HOST,{headers:{"User-Agent":PC_UA}});let src=jsp.pdfh(html,"a:eq(0)&&href");print(src);HOST=src',
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'PC_UA',
    },
    class_parse: '.navbar-items li:gt(0):lt(8);a&&Text;a&&href;/(\\d+).html',
    url: '/vodshow/fyfilter.html',
    filter_url: '{{fl.cateId}}-{{fl.area}}-{{fl.by}}-{{fl.class}}-----fypage---{{fl.year}}',
    searchUrl: '/rss/index.xml?wd=**',
    搜索: $js.toString(() => {
        let html = request(input);
        let items = pdfa(html, 'rss&&item');
        // log(items);
        let d = [];
        items.forEach(it => {
            it = it.replace(/title|link|author|pubdate|description/g, 'p');
            let url = pdfh(it, 'p:eq(1)&&Text');
            d.push({
                title: pdfh(it, 'p&&Text'),
                url: url,
                desc: pdfh(it, 'p:eq(3)&&Text'),
                content: pdfh(it, 'p:eq(2)&&Text'),
                pic_url: "",
            });
        });
        setResult(d);
    }),
    filter_def: {
        1: {cateId: '1'}, 2: {cateId: '2'}, 4: {cateId: '4'}, 3: {cateId: '3'}
    },
    filter: 'H4sIAAAAAAAAA+2W308aQRDH/5d79sEDf9V/pfGBGpKaWpuAbUIMSSuCoFaEIEpFa1P5oRWB1lo5cvDP3O7Jf9GF3ZlZWnshbR/v7T7f2dmd2dnduQ3DNBafbhgvwjFj0VheDUWjxpSxFnoZFsgyNZ5ICn4TWn0dHo1bG8rJ+iBRH8oCjPiUUotlMV6pCsDmpttqIgKw8XcH/G1R2RTgnDt1xy7DnBJwzlqOdbowpwT0w8AJcL30sWNlYD0JYHtoVNnelbIpwPV2mq4NNgVanG6hS3EOAW2VbYpTAcbSqDq9c4hFAvql8oPSJfhJQL+zKxE5+EmYZD/55rVbzIFNAtoSO3zzA9gkYO7dLEveQ+4SwDY4zfPjirIpwDmL2w8ZC+aUgPn1btzCd2a3IUVkHJG9ePiMVZSAtv0Uy34FmwSsYv9A1ACqKIF2tcxPc7irI0DbVt/9ApkowB2wc263PBbwmBRfGo6UtygUCYe0S1RusT1r0kt0URuUUhCCBNzoaonfN2GjJdBWtXinh1s1Agy9t89ObAhaAhbo2yHZFOA27rbJpgD9jiq8fA1+EjDOj5fkp4CK/oNsCiiWlh5La8zvfYtZVfCTgH5bWbFTLA13hRgzqfTdbMPNlCAZZLrA53y3L9zwDgPjiOSd04VrpUAveiwcimhF79w6XXvCogemAzNKG31qepD0oK4HSA/oukm6qevTpE9ruvkEdfGp6QukL+j6POnzuj5H+pyuz5I+q+uUr6nna1K+pp6vSfmaer4m5Wvq+ZqUr/jUy/QsRkXi+3lmZX8rEj+6GxzdqgnWV8RQmNixLN4qKMvzlfUonbDmFkvDvY0uv4qEh6suTRmB/9VdPd5Cr47m1ZXZzR2zGmCTMGG3+2NX9up2Xl3Z6z336j5iDl6CR1EBlqvzid56BbjeYYo6qIJJ/lY8/zoe69h+X/D7gt8X/L7wS18Ian3BPyL+EXnkiMxoR+RfWseJ7Vj4fkmY5Lnm1zXRFMAmwX/0/BP91yc6/hNlKCPlbBIAAA==',
	
    一级二: 'body a.module-poster-item.module-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    一级: $js.toString(() => {
         let cookie = getItem(RULE_CK, '');
        //log('储存的cookie:' + cookie);
        let ret = request(MY_URL, {
            headers: {
                Referer: encodeUrl(MY_URL),
                Cookie: cookie,
            }
        });
        if (/系统安全验证/.test(ret)) {
            //log(ret);
            cookie = verifyLogin(MY_URL);
            if (cookie) {
                log(`本次成功过验证,cookie:${cookie}`);
                setItem(RULE_CK, cookie);
            } else {
                log(`本次验证失败,cookie:${cookie}`);
            }
            ret = request(MY_URL, {
                headers: {
                    Referer: encodeUrl(MY_URL),
                    Cookie: cookie,
                }
            });
        }
//log(ret);
        let d = [];
        let p = rule.一级二.split(';');
        let arr = pdfa(ret, p[0]);//列表
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
        lazy: $js.toString(() => {
        let js = 'try{function requestApix(callback){$.post(\"api.php\",{vid:getQueryString(\"vid\")},function(result){callback(result.data.url);},\"json\");}requestApix(function(data){location.href=sign(data);})}catch(e){}location.href=document.querySelector(\"#playleft iframe\").src;';
        input = {
            parse: 1,
            url: input,
            click: js,
            js: js
        };
    }),
}