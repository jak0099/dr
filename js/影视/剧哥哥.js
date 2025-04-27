//筛选有验证,暂无能为力，放弃
// 强化版验证码处理函数
function verifyLogin(url) {
    const MAX_RETRY = 3;
    let cookie = '';
    const home = getHome(url);
    const captchaUrl = `${home}/index.php/verify/index.html`;
    const submitUrl = `${home}/index.php/ajax/verify_check`;

    for (let i = 1; i <= MAX_RETRY; i++) {
        try {
            // [1] 获取验证码并预处理
            const { cookie: newCookie, html: imgBase64 } = reqCookie(
                `${captchaUrl}?r=${Math.random()}`, 
                { toBase64: true, preprocessing: true } // 启用图像预处理
            );
            cookie = mergeCookies(cookie, newCookie);

            // [2] 多引擎OCR识别
            let code = OcrApi.classification(imgBase64);
            log(`第${i}次识别原始结果: ${code}`);
            
            // 结果清洗：去除空格/特殊字符
            code = code.replace(/[^a-zA-Z0-9]/g, '').slice(0,4);
            if (!/^\d{4}$/.test(code)) {
                log('识别结果格式异常，启用备用OCR');
                code = BackupOcrApi.classification(imgBase64);
                code = code.replace(/[^0-9]/g, '').slice(0,4);
            }

            // [3] 提交验证码
            const response = post(submitUrl, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': cookie,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: `type=show&verify=${encodeURIComponent(code)}`
            });
            
            // [4] 处理响应
            const result = safeParse(response);
            cookie = mergeCookies(cookie, response.cookie); // 合并最新cookie
            
            if (result?.code === 1) {
                log(`✅验证成功，获得cookie: ${cookie}`);
                return cookie;
            } else {
                log(`❌验证失败，响应码: ${result?.code || '无'}`);
            }
        } catch (e) {
            log(`⚠️第${i}次请求异常: ${e.message}`);
        }
    }
    return '';
}

// 辅助函数：安全解析JSON
function safeParse(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        log(`JSON解析失败: ${str.slice(0,50)}...`);
        return null;
    }
}

// OCR测试函数增强版
function ocr_demo_test() {
    const imgBase64 = `iVBORw0KGgoAAAANSUhEUgAAAIAAAAAoBAMAAADEX+97AAAAG1BMVEXz+/4thQTa7N6QwIFFkyNeokKozqDB3b93sWHFR+MEAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABN0lEQVRIie2TQU+DQBCFt9tSLkePUuwR00o8SmKixw5p7FXsH0CNd7CXHmti4t922KW6pMkuqUd5l4Hd+WbfzoAQvXo5dX8qKHMVvItTC2RLFcppu+zDpiPvY69ighafoV53KsGtNoLCWH0BsOxoQIMT1IWEfltfdXNQWY2qB69leYSiDKIOOGdSoB7LqWl58hHT2s3PaTMIE939zxTn5h4hdfLvwOUuyvT8k4JCY28IzBy4vONG50JAczuRmYS/cgUYc/fAh8vGeRK0EhAeQ4bmhBlVfR/jrF4q9TiU4uIaTzaep/7oK5PDJnFQXUhrgRXsU1ywf1Ko14zfOyAlbz9bbxB/cQq+RfXJ/J7rHzyP2KCVZ22Jh8jxpnkF0th9e3Xx3DxQ7syyyKdUurNskpGv/F69/rF+cCAjWSQWQQAAAABJRU5ErkJggg==`;
    
    // 多引擎测试
    const apis = [
        { name: '主引擎', api: OcrApi },
        { name: '备用引擎', api: BackupOcrApi }
    ];
    
    apis.forEach(({name, api}) => {
        let code = api.classification(imgBase64);
        code = code.replace(/[^0-9]/g, '').slice(0,4);
        log(`${name}识别结果: ${code.padEnd(4, ' ')} | 正确性: ${code === '4113' ? '✅' : '❌'}`);
    });
}

globalThis.verifyLogin = verifyLogin;

Object.assign(muban.mxpro.二级, {
    tab_text: 'div--small&&Text',
});
var rule = {
    模板: 'mxpro',
    title: '剧哥哥',//https://jugege.com/
    host: 'https://www.jugege.top',
    class_parse: '.navbar-items li:gt(0):lt(8);a&&Text;a&&href;/(\\d+).html',
    url: '/vodshow/fyclass--------fypage---.html',
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
    搜索验证标识:'系统安全验证|输入验证码',
}