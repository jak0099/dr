// ===================== 全局验证函数 =====================
function verifyLogin(url, siteToken) {
    // 固定加密算法
    function encrypt(_str) {
        const staticchars = "PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN";
        let encodechars = "";
        for(let i = 0; i < _str.length; i++) {
            const num0 = staticchars.indexOf(_str[i]);
            const code = num0 === -1 ? _str[i] : staticchars[(num0 + 3) % 62];
            const num1 = Math.floor(Math.random() * 62);
            const num2 = Math.floor(Math.random() * 62);
            encodechars += staticchars[num1] + code + staticchars[num2];
        }
        return base64(encodechars);
    }

    // 生成参数 - 使用当前页面URL
    const value = encrypt(url);
    const token = encrypt(siteToken);
    
    // 正确构建POST数据
    const data = `value=${encodeURIComponent(value)}&token=${encodeURIComponent(token)}`;
    
    // 获取网站根路径
    const siteRoot = new URL(url).origin;
    
    // 发送验证请求
    const verifyUrl = `${siteRoot}/robot.php`;
    try {
        const res = post(verifyUrl, {
            body: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': MOBILE_UA
            },
            timeout: 5000
        });
        
        // 返回验证结果
        return res && (res.includes('success') || res.includes('验证通过') || res.includes('status'));
    } catch (e) {
        log(`验证请求失败: ${e.message}`);
        return false;
    }
}

// ===================== 网站Token配置 =====================
const siteTokens = {
    "kankanwu.vip": "MTc1MTAwNjA1NA==",
    "movie123.com": "QUJUREVGMTIzNA==",
    "film456.net": "Nzg5MDEyMzQ1Ng==",
    "example.org": "QkNERUZHSElKS0w="
};

// ===================== 自动验证函数 =====================
function autoVerifyPage() {
    // 获取当前页面完整URL
    let currentUrl = HOST + request.path;
    
    // 修复URL格式问题
    currentUrl = currentUrl.replace(/([^:])\/\//g, '$1/').replace(':/', '://');
    
    // 获取主机名
    const hostname = new URL(currentUrl).hostname;
    
    // 查找匹配的Token
    for (const [site, token] of Object.entries(siteTokens)) {
        if (hostname.includes(site)) {
            log(`找到匹配Token: ${site} - ${token}`);
            return verifyLogin(currentUrl, token);
        }
    }
    
    // 默认Token（如果未找到匹配）
    log(`未找到匹配Token，使用默认Token`);
    return verifyLogin(currentUrl, "DEFAULT_TOKEN");
}

// ===================== 全局注册函数 =====================
globalThis.verifyLogin = verifyLogin;
globalThis.autoVerifyPage = autoVerifyPage;
globalThis.siteTokens = siteTokens;

// ===================== DRPY规则主体 =====================
var rule = {
    title: '',
    host: '',
    
    // 主页验证处理
    hostJs: `
        log('正在访问主页...');
        let html = request(HOST);
        
        // 检测人机验证
        if (html.includes('人机验证') || html.includes('防火墙检查')) {
            log('检测到主页人机验证，开始处理...');
            
            // 自动验证当前主页
            if (autoVerifyPage()) {
                log('主页验证成功，重新加载页面');
                html = request(HOST);
            } else {
                log('主页验证失败');
                throw '主页验证失败';
            }
        }
        
        // 继续解析真实host
        let src = jsp.pdfh(html, "ul&&li a:eq(1)&&href");
        if (src) {
            log('获取到真实HOST: ' + src);
            HOST = src;
        } else {
            log('未找到真实HOST，使用原HOST');
        }
    `,
    
    url: '/vodshow/fyfilter.html',
    searchUrl: '/vodsearch/**----------fypage---.html',
    searchable: 2,
    
    // 搜索页验证处理
    searchJs: `
        log('正在搜索: ' + KEY);
        let html = request(SEARCH_URL);
        
        // 检测搜索页人机验证
        if (html.includes('人机验证')) {
            log('检测到搜索页人机验证，开始处理...');
            
            // 使用当前搜索页URL进行验证
            if (verifyLogin(SEARCH_URL, siteTokens["kankanwu.vip"])) {
                log('搜索页验证成功，重新加载');
                html = request(SEARCH_URL);
            } else {
                log('搜索页验证失败');
                throw '搜索页验证失败';
            }
        }
        
        // 解析搜索结果
        log('开始解析搜索结果...');
        let result = [];
        // ...搜索解析逻辑...
    `,
    
    class_name: '电影&电视剧&动漫&综艺',
    class_url: '1&2&4&3',
    filter_url: '{{fl.类型}}-{{fl.area}}-{{fl.by}}-{{fl.class}}-----fypage---{{fl.year}}',
    filter_def: {
        '1': {类型: '1'},
        '2': {类型: '2'},
        '3': {类型: '3'},
        '4': {类型: '4'},
    },
    
    // 详情页验证处理
    二级: {
        title: '.stui-content__detail .title&&Text;.stui-content__detail&&p:eq(-2)&&a&&Text',
        title1: '.stui-content__detail .title&&Text;.stui-content__detail&&p&&Text',
        img: '.stui-content__thumb .lazyload&&data-original',
        desc: '.stui-content__detail p&&Text;.data.visible-xs:eq(2)&&Text;.data.visible-xs:eq(0)&&Text;.stui-content__detail p:eq(2)&&Text;.stui-content__detail p:eq(1)&&Text',
        desc1: '.stui-content__detail p:eq(4)&&Text;;;.stui-content__detail p:eq(1)&&Text',
        content: '.detail&&Text',
        tabs: '.stui-vodlist__head h3',
        lists: '.stui-content__playlist:eq(#id) li',
        
        // 详情页前置验证
        before: `js:
            log('正在访问详情页: ' + input);
            let html = request(input);
            
            // 检测详情页人机验证
            if (html.includes('人机验证')) {
                log('检测到详情页人机验证，开始处理...');
                
                // 使用当前详情页URL进行验证
                if (autoVerifyPage()) {
                    log('详情页验证成功，重新加载');
                    html = request(input);
                } else {
                    log('详情页验证失败');
                    throw '详情页验证失败';
                }
            }
            
            // 继续解析详情页内容
            log('开始解析详情页...');
        `
    },
    
    play_parse: true,
    lazy: `js:
        log('正在解析播放地址: ' + input);
        let html = request(input);
        
        // 检测播放页人机验证
        if (html.includes('人机验证')) {
            log('检测到播放页人机验证，开始处理...');
            
            // 播放页验证
            if (universalKKWVerify(input, siteTokens["kankanwu.vip"])) {
                log('播放页验证成功，重新加载');
                html = request(input);
            } else {
                log('播放页验证失败');
                throw '播放页验证失败';
            }
        }
        
        // 解析播放地址
        log('开始解析播放地址...');
        let pclick = 'document.querySelector("#playleft iframe").contentWindow.document.querySelector("#start").click()';
        input = { parse: 1, url: input, js: pclick, click: pclick };
    `,
    
    // 推荐和一级列表
    推荐: '*',
    一级: `js:
    // 构造分类页URL
    let classUrl = HOST + rule.url.replace('fyfilter', MY_CLASS).replace('fypage', MY_PAGE);
    log('分类页URL: ' + classUrl);
    let html = request(classUrl);
    
    // 检测分类页人机验证
    if (html.includes('人机验证') || html.includes('防火墙检查')) {
        log('检测到分类页人机验证，开始处理...');
        
        // 使用当前分类页URL进行验证
        if (autoVerifyPage(classUrl)) {
            log('分类页验证成功，重新加载');
            html = request(classUrl);
        } else {
            log('分类页验证失败');
            throw '分类页验证失败';
        }
    }
    
    // 解析分类页内容
    log('开始解析分类页...');
    let list = jsp.pdfa(html, '.stui-vodlist&&li');
    let result = [];
    list.forEach(item => {
        result.push({
            title: jsp.pdfh(item, 'a&&title'),
            img: jsp.pdfh(item, '.lazyload&&data-original'),
            desc: jsp.pdfh(item, '.pic-text&&Text'),
            url: HOST + jsp.pdfh(item, 'a&&href')
        });
    });
    result;
    `,
    // 搜索功能
    搜索: '*',
    
    // 过滤配置
    filter: {},
    
    // 其他配置
    double: false,
    timeout: 10000,
    filterable: 1,
    invalid: true
};