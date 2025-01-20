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
  类型:'影视',//影视|听书|漫画|小说
  title:'面包网',
  host:'https://v.aiwule.com',
  url:'/vodshow/fyclass--------fypage---.html',
  searchUrl:'/vodsearch/**----------fypage---.html',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse:'.nav a;a&&Text;a&&href;/(\\d+)\.html',
  cate_exclude:'',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'*',
  一级:'.vod-list li;.pic a&&title;.lazyload&&data-original||data-background;.text-overflow&&Text;.pic a&&href',
  二级:{
    title:'h1&&Text;.info a:eq(2)&&Text',
    img:'.lazyload&&data-original||src',
    desc:'.info span:eq(5)&&Text;.info a:eq(6)&&Text;.info a:eq(5)&&Text;.text-row-2:eq(0)&&Text;.text-overflow:eq(3)&&Text',
    content:'.text&&Text',
    tabs:'.playlist-tab li',
    lists:'.ewave-playlist-content:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  //搜索:'*',
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
        let list = pdfa(html, 'ul.row&&li');
        list.forEach(item => {
            var title = pdfh(item, '.pic&&a&&title');
            var pic = pdfh(item, '.lazyload&&data-original||data-background');
            var desc = pdfh(item, '.text-overflow&&Text');
            var content = pdfh(item, 'span:eq(6)&&Text');
            var url = pdfh(item, '.pic&&a&&href');  
                 
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