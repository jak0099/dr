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
                body: 'type=search&verify=' + code,
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

muban.首图2.二级.tabs = '.nav-tabs li';
var rule = {
  类型:'影视',//影视|听书|漫画|小说
  模板:'首图2',
  title:'可可影视3',
  host:'https://www.kmxibanyayu.com',
  url:'/list/fyclass-fypage.html',
  searchUrl:'/vso/**----------fypage---.html',
  cate_exclude:'电影解说', 
  搜索: $js.toString(() => {
         let cookie = getItem(RULE_CK, '');
        //log('储存的cookie:' + cookie);
        
        let ret = request(MY_URL, {
            headers: {
                Referer: encodeUrl(MY_URL),
                Cookie: cookie,
            }
        });
        if (/请输入验证码/.test(ret)) {
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
        let html = ret;
        let list = pdfa(html, '.stui-vodlist.clearfix&&li');
        list.forEach(item => {
            var title = pdfh(item, '.lazyload&&title');
            var pic = pdfh(item, '.lazyload&&data-original');
            var desc = pdfh(item, '.text-right:eq(1)&&Text');
            var content = pdfh(item, '.stui-vodlist__detail&&p&&Text');
            var url = pdfh(item, '.lazyload&&href');                   
            if (title) {
                d.push({
                    title: title,
                    img: pic,
                    desc: desc,
                    content: content,
                    url: url
                });
            }
        });
        setResult(d);
    }),
  搜索验证标识:'系统安全验证',
}