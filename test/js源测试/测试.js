// 添加在rule定义之前
const OCR_RETRY = 3; // 验证码重试次数
const RULE_CK = 'finalCookie'; // cookie存储键名
const SLIDE_CK = 'slidecookie'; // 滑块验证cookie存储键名

/*// 辅助函数
function getHome(url) {
    try {
        return url.match(/https?:\/\/[^\/]+/)[0];
    } catch (e) {
        return 'https://www.555gy.cc';
    }
}

function encodeUrl(url) {
    return encodeURIComponent(url);
}
*/

globalThis.verifyLogin = function verifyLogin(url) {
  let cnt = 0;
  let verifycookie = ''; // 改个名字避免冲突
  let r = Math.random();
  let yzm_url = getHome(url) + '/index.php/verify/index.html';
  log(`验证码链接:${yzm_url}`);
  let submit_url = getHome(url) + '/index.php/ajax/verify_check';
  log(`post登录链接:${submit_url}`);
  
  while (cnt < OCR_RETRY) {
    try {
      // 不使用解构赋值，分别获取变量
      let result = reqCookie(yzm_url + '?r=' + r, { toBase64: true });
      let verifycookie = result.cookie; // 获取返回的cookie
      let html = result.html; // 获取返回的html
      
      let code = OcrApi.classification(html);
      log(`第${cnt + 1}次验证码识别结果:${code}`);
      
      html = post(submit_url, {
        headers: { Cookie: verifycookie },
        body: 'type=show&verify=' + code,
      });
      html = JSON.parse(html);

      if (html.code === 1) {
        log(`第${cnt + 1}次验证码提交成功`);
        log(verifycookie);
        return verifycookie; // 返回正确的cookie
      } else if (html.code !== 1 && cnt + 1 >= OCR_RETRY) {
        verifycookie = ''; // 清空返回cookie
      } 
    } catch (e) {
      log(`第${cnt + 1}次验证码提交失败:${e.message}`);
      if (cnt + 1 >= OCR_RETRY) {
        verifycookie = '';
      }
    }
    cnt += 1;
  }
  return verifycookie;
}

globalThis.verifyLogin = verifyLogin;

// 添加一个通用函数
function yanzheng(url, cookie) {
    let ret = request(url, {
        headers: {
            Referer: encodeUrl(url),
            Cookie: cookie,
        }
    });

    if (/系统安全验证/.test(ret)) {
        cookie = verifyLogin(url);
        if (cookie) {
            log(`本次成功过验证,cookie:${cookie}`);
            setItem(RULE_CK, cookie);
        } else {
            log(`本次验证失败,cookie:${cookie}`);
        }
        ret = request(url, {
            headers: {
                Referer: encodeUrl(url),
                Cookie: cookie,
            }
        });
    }
    return {
        ret,
        cookie
    };
}
globalThis.yanzheng = yanzheng;


var rule = {
    title: '555电影',
    host: 'https://www.555gy.cc',
    url: '/vod/show/id/fyclass/page/fypage.html',
    searchUrl: '/vod/search/page/fypage/wd/**.html',
    detailUrl: '/voddetail/fyid.html',
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    class_parse: '.navbar-items li:gt(0):lt(10);a&&Text;a&&href;/(\\d+)',
    tab_exclude: '排序',
    play_parse: true,
    lazy: `js:
        let html = request(input);
        let hconf = html.match(/r player_.*?=(.*?)</)[1];
        let json = JSON5.parse(hconf);
        let url = json.url;
        if (json.encrypt == '1') {
            url = unescape(url);
        } else if (json.encrypt == '2') {
            url = unescape(base64Decode(url));
        }
        if (/\\.(m3u8|mp4|m4a|mp3)/.test(url)) {
            input = {parse: 0, jx: 0, url: url};
        } else {
            input;
        }`,
    limit: 6,
    double: true,
    预处理: $js.toString(() => {
        try {
            let new_html = request(HOST);
            if (/人机身份验证/.test(new_html)) {
                let new_src = pdfh(new_html, 'script[src*="huadong"]&&src');
                if (new_src) {
                    if (!new_src.startsWith('http')) {
                        new_src = new_src.startsWith('/') ? HOST + new_src : HOST + '/' + new_src;
                    }
                    let hhtml = request(new_src, {
                        withHeaders: true
                    });
                    let json = JSON.parse(hhtml);
                    let scriptHtml = json.body;
                    let key = scriptHtml.split('key="')[1]?.split('"')[0] || '';
                    let value = scriptHtml.split('value="')[1]?.split('"')[0] || '';
                    let val = "";
                    for (let i = 0; i < value.length; i++) {
                        val += (value.charCodeAt(i) + 1).toString();
                    }
                    let md5value = md5(val);
                    let yz_url = HOST + '/a20be899_96a6_40b2_88ba_32f1f75f1552_yanzheng_huadong.php?type=ad82060c2e67cc7e2cc47552a4fc1242&key=' + key + '&value=' + md5value;
                    hhtml = request(yz_url, {
                        withHeaders: true
                    });
                    json = JSON.parse(hhtml);
                    let setCk = Object.keys(json).find(it => it.toLowerCase() === 'set-cookie');
                    let slidecookie = setCk ? json[setCk].split(';')[0] : '';
                    if (slidecookie) {
                        rule_fetch_params.headers.Cookie = slidecookie;
                        setItem(SLIDE_CK, slidecookie);
                    }
                }
            }
        } catch (e) {
            log('滑块验证预处理失败:' + e.message);
        }
    }),
    推荐: '.tab-list.active;a.module-poster-item.module-item;.module-poster-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    一级二: 'body a.module-poster-item.module-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    二级: {
        title: 'h1&&Text;.module-info-tag-link:eq(-1)&&Text',
        img: '.lazyload&&data-original',
        desc: ';;.module-info-tag-link:eq(1)&&Text;.module-info-item:eq(2)&&Text;.module-info-item:eq(1)&&Text',
        content: '.module-info-introduction&&Text',
        tabs: '.module-tab-item',
        lists: '.module-play-list:eq(#id) a',
    },
    搜索二: 'body .module-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href;.module-info-item-content&&Text',
    一级: $js.toString(() => {
        let cookie = getItem(RULE_CK, '');
        let result = yanzheng(MY_URL, cookie);
        let ret = result.ret;
        let d = [];
        let p = rule.一级二.split(';');
        let arr = pdfa(ret, p[0]);
        arr.forEach(it => {
            d.push({
                title: pdfh(it, p[1]),
                pic_url: pdfh(it, p[2]),
                desc: pdfh(it, p[3]),
                url: pdfh(it, p[4]),
            });
        });
        setResult(d);
    }),
    搜索: $js.toString(() => {
        let cookie = getItem(RULE_CK, '');
        let result = yanzheng(MY_URL, cookie);
        let ret = result.ret;
        let d = [];
        let p = rule.搜索二.split(';');
        let arr = pdfa(ret, p[0]);
        arr.forEach(it => {
            d.push({
                title: pdfh(it, p[1]),
                pic_url: pdfh(it, p[2]),
                desc: pdfh(it, p[3]),
                url: pdfh(it, p[4]),
            });
        });
        setResult(d);
    }),
}