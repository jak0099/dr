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

var rule = {
    title: '光影',
    host: 'https://www.gyf.lol',
    url: '/index.php/vod/show/id/fyclass/page/fypage.html',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    searchable: 2,//是否启用全局搜索,
    quickSearch: 0,//是否启用快速搜索,
    filterable: 0,//是否启用分类筛选,
    headers: {
                'User-Agent':'MOBILE_UA', // "Cookie":"searchneed=ok"
            },
    编码: 'utf-8',
    timeout: 5000,
    class_name:'电影&剧集&动漫&综艺&短剧&少儿',
    class_url:'1&2&3&4&21&22',
    tab_exclude: '硬核指南|看电视|看个球|vip解析|排行榜|留言板',
    play_parse: true,
    lazy: `js:	
		var html = JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);
        var url = html.url;
        var from = html.from;
        if (html.encrypt == '1') {
            url = decodeURI(url)
        } else if (html.encrypt == '2') {
            url = decodeURI(base64Decode(url))
        }
        if (/\.m3u8|\.mp4/.test(url)) {
            input = url
        } else {
            var currentDate = new Date();
            var year = currentDate.getFullYear();
            var month = String(currentDate.getMonth() + 1).padStart(2, '0');
            var day = String(currentDate.getDate()).padStart(2, '0');
            const urlTime = year + month + day;
            var MacPlayerConfig = {};
            eval(fetch(HOST + '/static/js/playerconfig.js?t=' + urlTime).replace('var Mac', 'Mac'));
            var parseUrl = MacPlayerConfig.player_list[from].parse;
            if (parseUrl && parseUrl != "") {
				let $playUrl = "";
				if(parseUrl.startsWith("http")){
					$playUrl = parseUrl;
				}else{
					$playUrl = HOST + parseUrl;
				}
                input = {
                    url: url,
                    playUrl: $playUrl,
                    parse: 1,
                    header: JSON.stringify({
                        'user-agent': 'Mozilla/5.0',
                        'Origin': input
                    })
                }
            } else {
                input       
            }
        }
	`,
    limit: 6,
    double: true,
    推荐: '*',
    一级二:'.public-list-box.search-box;.a:eq(2)&&Text;.img&&data-src;.public-prt&&Text;a&&href',
    一级: $js.toString(() => {
        let d = [];
        let html = request(input);
        let list = pdfa(html, '.public-list-box.public-pic-b'); 
        list.forEach(item => {
            var title = pdfh(item, 'a&&title');
            var pic = pdfh(item, 'img&&data-src');
            var desc = pdfh(item, '.public-prt&&Text');
            var content = pdfh(item, 'span:eq(6)&&Text');
            var url = pdfh(item, 'a&&href', MY_URL); 
            
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
    二级: {
        "title": ".slide-info-title.hide&&Text",
        "img": "img&&data-src",
        "desc": ".slide-info.hide:eq(0)&&Text;.slide-info.hide:eq(1)&&Text;..slide-info.hide:eq(2)&&Text;.slide-info.hide:eq(3)&&Text;.slide-info.hide:eq(4)&&Text",
        "content": ".text.cor3&&Text",
        //tabs:'js:TABS = ["4k","蓝光",]',
        "tabs":".anthology-tab.nav-swiper.b-b.br&&a--span",
        lists: ".anthology-list&&ul:eq(#id)&&li",
        tab_text: 'body&&Text',
        list_text: 'a&&Text',
        list_url: 'a&&href'
            },
    
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
        let list = pdfa(html, '.public-list-box.search-box');
        list.forEach(item => {
            var title = pdfh(item, '.thumb-txt.cor4.hide&&a&&Text');
            var pic = pdfh(item, '.gen-movie-img&&data-src');
            var desc = pdfh(item, 'span:eq(2)&&Text');
            var content = pdfh(item, 'span:eq(6)&&Text');
            var url = pdfh(item, '.public-list-exp&&a&&href');  
                 
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
    }