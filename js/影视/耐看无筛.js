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
                headers: {Cookie: cookie}, body: 'type=search&verify=' + code,
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
    title: '耐看',
    host: 'https://nkvod.me/',
    url: '/show/fyclass--------fypage---.html',
    searchUrl: '/nk/-------------.html?wd=**',
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    filter: '',
    filter_url: '',
    filter_def: {},
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    timeout: 5000, //class_parse: '.flex.around&&li;a&&Text;a&&href;.*/(.*?).html',
    class_name: '电影&连续剧&综艺&动漫',
    class_url: '1&2&3&4',
    cate_exclude: '明星|我的|排行榜|留言板',
    play_parse: true,
    lazy: "js:\n  input = { parse: 1, url: input, js: '' };",
    double: true,
    推荐: '*',
    一级: '.public-list-box;a&&title;img&&data-src;.public-list-subtitle&&Text;a&&href',
    二级: {
        title: 'h3&&Text;.hl-ma0&&Text',
        img: '.mask-1&&data-src',
        desc: '.detail-info .slide-info:eq(1)--strong&&Text;.deployment.none.cor5&&span&&Text;.deployment.none.cor5&&span:eq(2)&&Text;.detail-info .slide-info:eq(3)--strong&&Text;.detail-info .slide-info:eq(2)--strong&&Text',
        content: '#height_limit&&Text',
        tabs: '.anthology-tab a',
        lists: '.anthology-list-play:eq(#id)&&li',
        tab_text: 'body&&Text',
        list_text: 'body&&Text',
        list_url: 'a&&href',
    },
    预处理: $js.toString(() => {
        let html = request(rule.host);
        let scripts = pdfa(html, 'script');
        let img_script = scripts.find(it => pdfh(it, 'script&&src').includes('rdul.js'));
        if (img_script) {
            let img_url = img_script.match(/src="(.*?)"/)[1];
            //console.log(img_url);
            let img_html = request(img_url);
            let img_host = img_html.match(/'(.*?)'/)[1];
            log(img_host);
            rule.图片替换 = rule.host + '=>' + img_host;
        }
    }),
    搜索: '.public-list-box;.thumb-txt.cor4.hide&&Text;img:eq(-1)&&data-src;a&&Text;a&&href',
}