//搜索有验证，套用过验证代码不成功
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
  类型:'影视',//影视|听书|漫画|小说
  title:'吉吉短剧[短]',
  host:'https://www.jjduanju.com',
  url:'/sort/fyclass/page/fypage.html',
  searchUrl:'/search**/page/fypage.html',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  //class_parse:'.myui-header__list li;a&&Text;a&&href;/(\\d+)\.html',
  class_name:'短剧&电视剧',
  class_url:'1&2',
  tab_exclude:'排序|猜你喜欢',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'*',
  一级:'.myui-vodlist li;.lazyload&&title;.lazyload&&data-original;.text-right&&Text;.lazyload&&href',  
  二级:{
    title:'h1&&Text;.other-data span:eq(0)&&Text',
    title1:'h1&&Text;.desc span:eq(2)&&Text',
    img:'.lazyload&&data-original',
    desc:'.desc span:eq(0)&&Text;.desc a:eq(1)&&Text;.other-data span:eq(6)&&Text;.desc p:eq(1)&&Text;.desc p:eq(2)&&Text',
    desc1:'.desc span:eq(2)&&Text;.desc a:eq(1)&&Text;.desc p:eq(1)&&Text;.desc p:eq(2)&&Text;.desc p:eq(3)&&Text',
    content:'p.content&&Text',
    content1:'p.content&&Text',
    tabs:'.myui-panel_hd a',
    //tabs1:'.myui-panel_hd li',
    lists:'.myui-content__list:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
    搜索: $js.toString(() => {
        let cookie = getItem(RULE_CK, '');
        log('储存的cookie:' + cookie);
        let ret = request(MY_URL, {
            headers: {
                Cookie: cookie,
            }
        });
        if (/系统安全验证/.test(ret)) {
            let login = verifyLogin(KEY);
            cookie = login.cookie;
            if (cookie) {
                log(`本次成功过验证,cookie:${cookie}`);
                setItem(RULE_CK, cookie);
            } else {
                log(`本次自动过搜索验证失败,cookie:${cookie}`);
            }
            ret = login.html;
        }

        let d = [];
        let p = rule.一级.split(';');
        let arr = pdfa(ret, p[0]);
        arr.forEach(it => {
            d.push({
                title: pdfh(it, p[1]),
                pic_url: pdfh(it, p[2]),
                desc: pdfh(it, p[3]),

                url: pdfh(it, p[4]),
                content: '',
            });

        });
        setResult(d);
    }),
}