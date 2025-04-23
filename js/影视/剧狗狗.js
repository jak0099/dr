function verifyCode(url) {
    let cnt = 0;
    let host = getHome(url);
    let cookie = '';
    while (cnt < OCR_RETRY) {
        try {
            // let obj = {headers:headers,timeout:timeout};
            let yzm_url = `${host}/index.php/verify/index.html`;
            console.log(`验证码链接:${yzm_url}`);
            let hhtml = request(yzm_url, {withHeaders: true, toBase64: true}, true);
            let json = JSON.parse(hhtml);
            if (!cookie) {
                // print(json);
                let setCk = Object.keys(json).find(it => it.toLowerCase() === 'set-cookie');
                // cookie = json['set-cookie']?json['set-cookie'].split(';')[0]:'';
                cookie = setCk ? json[setCk].split(';')[0] : '';
            }
            // console.log(hhtml);
            console.log('cookie:' + cookie);
            let img = json.body;
            // console.log(img);
            let code = OcrApi.classification(img);
            console.log(`第${cnt + 1}次验证码识别结果:${code}`);
            let submit_url = `${host}/index.php/ajax/verify_check?type=search&verify=${code}`;
            console.log(submit_url);
            let html = request(submit_url, {headers: {Cookie: cookie}, 'method': 'POST'});
            // console.log(html);
            html = JSON.parse(html);
            if (html.msg === 'ok') {
                console.log(`第${cnt + 1}次验证码提交成功`);
                return cookie // 需要返回cookie
            } else if (html.msg !== 'ok' && cnt + 1 >= OCR_RETRY) {
                cookie = ''; // 需要清空返回cookie
            }
        } catch (e) {
            console.log(`第${cnt + 1}次验证码提交失败:${e.message}`);
            if (cnt + 1 >= OCR_RETRY) {
                cookie = '';
            }
        }
        cnt += 1
    }
    return cookie
}

globalThis.verifyCode = verifyCode;
var rule={
  title: "剧狗狗",
  host: "https://www.jugougou.me",
  url: "/vodtype/fyclass-fypage.html",
  searchUrl: "/vodsearch/**----------fypage---.html",
  searchable: 2,
  quickSearch: 0,
  filterable: 1,
  filter: "",
  filter_url: "",
  filter_def: "",
  headers: {
    "User-Agent": "MOBILE_UA"
  },
  timeout: 5000,
  class_parse: ".foornav li;a&&Text;a&&href;/(\\d+)\\.html",
  cate_exclude: "Netflix|今日更新|专题列表|排行榜",
  play_parse: true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:'document.querySelector("#playleft iframe").contentWindow.document.querySelector("#start").click();'};
  }),
  double: false,
  推荐: "*",
  一级: ".ewave-vodlist__item;a&&title;a&&data-original;.pic-text&&Text;a&&href",
  二级: {
    title: ".ewave-content__detail&&.title&&Text;.data:eq(0)&&Text",
    img: ".pic&&img&&data-original",
    desc: ".data:eq(5)&&Text;.data:eq(3)&&Text;.data:eq(2)&&Text;;",
    content: ".art-content&&Text",
    tabs: ".ewave-pannel:has(.ewave-content__playlist)",
    lists: ".ewave-content__playlist:eq(#id)&&li",
    tab_text: "h3&&Text",
    list_text: "body&&Text",
    list_url: "a&&href"
  },
  detailUrl: "",
  搜索: "*"
}