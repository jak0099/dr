/**
 *  智能对比去除广告。支持嵌套m3u8。只需要传入播放地址
 * @param m3u8_url m3u8播放地址
 * @param headers 自定义访问m3u8的请求头,可以不传
 * @returns {string}
 */
function fixAdM3u8Ai(m3u8_url, headers) {
    let ts = (new Date).getTime();
    let option = headers ? {
        headers: headers
    } : {};
    function b(s1, s2) {
        let i = 0;
        while (i < s1.length) {
            if (s1[i] !== s2[i]) {
                break
            }
            i++
        }
        return i
    }
    function reverseString(str) {
        return str.split("").reverse().join("")
    }
    let m3u8 = request(m3u8_url, option);
    m3u8 = m3u8.trim().split("\n").map(it => it.startsWith("#") ? it : urljoin(m3u8_url, it)).join("\n");
    m3u8 = m3u8.replace(/\n\n/gi, "\n");
    let last_url = m3u8.split("\n").slice(-1)[0];
    if (last_url.length < 5) {
        last_url = m3u8.split("\n").slice(-2)[0]
    }
    if (last_url.includes(".m3u8") && last_url !== m3u8_url) {
        m3u8_url = urljoin2(m3u8_url, last_url);
        log("嵌套的m3u8_url:" + m3u8_url);
        m3u8 = request(m3u8_url, option)
    }
    let s = m3u8.trim().split("\n").filter(it => it.trim()).join("\n");
    let ss = s.split("\n");
    if (m3u8_url.indexOf("ffzy") > 0) {
        let j = 0
          , k1 = 0
          , m = 0
          , n = 0
          , t = 0;
        let s2 = "";
        for (let i = 0; i < ss.length; i++) {
            let s = ss[i];
            let s1 = "";
            if (s.startsWith("#EXTINF")) {
                s1 = s.slice(8);
                n++;
                if (n == 1)
                    k1 = i;
                if (s2.indexOf(s1) == -1) {
                    s2 = s2 + s1;
                    m++;
                }
                t = t + parseFloat(s1);
                i++;
                s = ss[i];
            }
            if (s.startsWith("#EXT-X-DISCONTINUITY")) {
                if (n == 5) {
                    log("n:" + n);
                    log("m:" + m);
                    for (let j = k1; j < k1 + n * 2; j++) {
                        log(ss[j]);
                    }
                    log("广告位置：" + k1);
                    log("数据条数:" + n);
                    log("数据种类:" + m);
                    log("广告时间：" + t.toFixed(5));
                    ss.splice(k1, 2 * n + 1);
                    i = i - 2 * n + 1;
                }
                t = 0;
                m = 0;
                n = 0;
                s2 = "";
            }
        }
    }
    let firststr = "";
    let maxl = 0;
    let kk = 0;
    let kkk1 = 1;
    let kkk2 = 0;
    let secondstr = "";
    for (let i = 0; i < ss.length; i++) {
        let s = ss[i];
        if (!s.startsWith("#")) {
            if (kk == 0)
                firststr = s;
            if (kk > 0) {
                if (maxl > b(firststr, s) + 1) {
                    if (secondstr.length < 5)
                        secondstr = s;
                    kkk2++
                } else {
                    maxl = b(firststr, s);
                    kkk1++
                }
            }
            kk++;
            if (kk >= 30)
                break
        }
    }
    if (kkk2 > kkk1)
        firststr = secondstr;
    let firststrlen = firststr.length;
    let ml = Math.round(ss.length / 2).toString().length;
    let maxc = 0;
    let laststr = ss.toReversed().find(x => {
        if (!x.startsWith("#")) {
            let k = b(reverseString(firststr), reverseString(x));
            maxl = b(firststr, x);
            maxc++;
            if (firststrlen - maxl <= ml + k || maxc > 10) {
                return true
            }
        }
        return false
    }
    );
    log("最后一条切片：" + laststr);
    let ad_urls = [];
    for (let i = 0; i < ss.length; i++) {
        let s = ss[i];
        if (!s.startsWith("#")) {
            if (b(firststr, s) < maxl) {
                ad_urls.push(s);
                ss.splice(i - 1, 2);
                i = i - 2
            } else {
                ss[i] = urljoin(m3u8_url, s)
            }
        } else {
            ss[i] = s.replace(/URI=\"(.*)\"/, 'URI="' + urljoin(m3u8_url, "$1") + '"')
        }
    }
    log("处理的m3u8地址:" + m3u8_url);
    log("----广告地址----");
    log(ad_urls);
    m3u8 = ss.join("\n");
    log("处理耗时：" + ((new Date).getTime() - ts).toString());
    log(m3u8);
    return m3u8
}

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
      let { cookie, html } = reqCookie(yzm_url + '?r=' + r, { toBase64: true });
      let code = OcrApi.classification(html);
      log(`第${cnt + 1}次验证码识别结果:${code}`);
      html = post(submit_url, {
        headers: { Cookie: cookie },
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

globalThis.fixAdM3u8Ai = fixAdM3u8Ai;

globalThis.verifyLogin = verifyLogin;

var rule = {
  模板: 'mxone5',
  title: '樱之空影院',
  host: 'https://www.eien.cc',
  url: '/vodshow/fyclass-fyfilter/',
  searchUrl: '/vodsearch/**----------fypage---/',
  searchable: 2,
  quickSearch: 0,
  filterable: 0,
  detailUrl: '/voddetail/fyid/',
  class_parse: '.nav-menu-items&&li;a&&Text;a&&href;.*/(\\d+)/',
  //cate_exclude: '桜空',
  filter: {
    "1": [{ "key": "剧情", "name": "全部剧情", "value": [{ "n": "全部剧情", "v": "" }, { "n": "喜剧", "v": "喜剧" }, { "n": "爱情", "v": "爱情" }, { "n": "恐怖", "v": "恐怖" }, { "n": "动作", "v": "动作" }, { "n": "科幻", "v": "科幻" }, { "n": "剧情", "v": "剧情" }, { "n": "战争", "v": "战争" }, { "n": "警匪", "v": "警匪" }, { "n": "犯罪", "v": "犯罪" }, { "n": "动画", "v": "动画" }, { "n": "奇幻", "v": "奇幻" }, { "n": "武侠", "v": "武侠" }, { "n": "冒险", "v": "冒险" }, { "n": "枪战", "v": "枪战" }, { "n": "恐怖", "v": "恐怖" }, { "n": "悬疑", "v": "悬疑" }, { "n": "惊悚", "v": "惊悚" }, { "n": "经典", "v": "经典" }, { "n": "青春", "v": "青春" }, { "n": "文艺", "v": "文艺" }, { "n": "微电影", "v": "微电影" }, { "n": "古装", "v": "古装" }, { "n": "历史", "v": "历史" }, { "n": "运动", "v": "运动" }, { "n": "农村", "v": "农村" }, { "n": "儿童", "v": "儿童" }, { "n": "网络电影", "v": "网络电影" }] }, { "key": "地区", "name": "全部地区", "value": [{ "n": "全部地区", "v": "" }, { "n": "大陆", "v": "大陆" }, { "n": "香港", "v": "香港" }, { "n": "台湾", "v": "台湾" }, { "n": "美国", "v": "美国" }, { "n": "法国", "v": "法国" }, { "n": "英国", "v": "英国" }, { "n": "日本", "v": "日本" }, { "n": "韩国", "v": "韩国" }, { "n": "德国", "v": "德国" }, { "n": "泰国", "v": "泰国" }, { "n": "印度", "v": "印度" }, { "n": "意大利", "v": "意大利" }, { "n": "西班牙", "v": "西班牙" }, { "n": "加拿大", "v": "加拿大" }, { "n": "其他", "v": "其他" }] }, { "key": "语言", "name": "全部语言", "value": [{ "n": "全部语言", "v": "" }, { "n": "国语", "v": "国语" }, { "n": "英语", "v": "英语" }, { "n": "粤语", "v": "粤语" }, { "n": "闽南语", "v": "闽南语" }, { "n": "韩语", "v": "韩语" }, { "n": "日语", "v": "日语" }, { "n": "法语", "v": "法语" }, { "n": "德语", "v": "德语" }, { "n": "其它", "v": "其它" }] }, { "key": "时间", "name": "全部时间", "value": [{ "n": "全部时间", "v": "" }, { "n": "2022", "v": "2022" }, { "n": "2021", "v": "2021" }, { "n": "2020", "v": "2020" }, { "n": "2019", "v": "2019" }, { "n": "2018", "v": "2018" }, { "n": "2017", "v": "2017" }, { "n": "2016", "v": "2016" }, { "n": "2015", "v": "2015" }, { "n": "2014", "v": "2014" }, { "n": "2013", "v": "2013" }, { "n": "2012", "v": "2012" }, { "n": "2011", "v": "2011" }, { "n": "2010", "v": "2010" }] }, { "key": "字母", "name": "字母查找", "value": [{ "n": "字母查找", "v": "" }, { "n": "A", "v": "A" }, { "n": "B", "v": "B" }, { "n": "C", "v": "C" }, { "n": "D", "v": "D" }, { "n": "E", "v": "E" }, { "n": "F", "v": "F" }, { "n": "G", "v": "G" }, { "n": "H", "v": "H" }, { "n": "I", "v": "I" }, { "n": "J", "v": "J" }, { "n": "K", "v": "K" }, { "n": "L", "v": "L" }, { "n": "M", "v": "M" }, { "n": "N", "v": "N" }, { "n": "O", "v": "O" }, { "n": "P", "v": "P" }, { "n": "Q", "v": "Q" }, { "n": "R", "v": "R" }, { "n": "S", "v": "S" }, { "n": "T", "v": "T" }, { "n": "U", "v": "U" }, { "n": "V", "v": "V" }, { "n": "W", "v": "W" }, { "n": "X", "v": "X" }, { "n": "Y", "v": "Y" }, { "n": "Z", "v": "Z" }, { "n": "0-9", "v": "0" }] }, { "key": "排序", "name": "时间排序", "value": [{ "n": "时间排序", "v": "time" }, { "n": "人气排序", "v": "hits" }, { "n": "评分排序", "v": "score" }] }], "2": [{ "key": "剧情", "name": "全部剧情", "value": [{ "n": "全部剧情", "v": "" }, { "n": "古装", "v": "古装" }, { "n": "战争", "v": "战争" }, { "n": "青春", "v": "青春" }, { "n": "偶像", "v": "偶像" }, { "n": "喜剧", "v": "喜剧" }, { "n": "家庭", "v": "家庭" }, { "n": "犯罪", "v": "犯罪" }, { "n": "动作", "v": "动作" }, { "n": "奇幻", "v": "奇幻" }, { "n": "剧情", "v": "剧情" }, { "n": "历史", "v": "历史" }, { "n": "经典", "v": "经典" }, { "n": "乡村", "v": "乡村" }, { "n": "情景", "v": "情景" }, { "n": "商战", "v": "商战" }, { "n": "网剧", "v": "网剧" }, { "n": "其他", "v": "其他" }] }, { "key": "地区", "name": "全部地区", "value": [{ "n": "全部地区", "v": "" }, { "n": "内地", "v": "内地" }, { "n": "韩国", "v": "韩国" }, { "n": "香港", "v": "香港" }, { "n": "台湾", "v": "台湾" }, { "n": "日本", "v": "日本" }, { "n": "美国", "v": "美国" }, { "n": "泰国", "v": "泰国" }, { "n": "英国", "v": "英国" }, { "n": "新加坡", "v": "新加坡" }, { "n": "其他", "v": "其他" }] }, { "key": "语言", "name": "全部语言", "value": [{ "n": "全部语言", "v": "" }, { "n": "国语", "v": "国语" }, { "n": "英语", "v": "英语" }, { "n": "粤语", "v": "粤语" }, { "n": "闽南语", "v": "闽南语" }, { "n": "韩语", "v": "韩语" }, { "n": "日语", "v": "日语" }, { "n": "其它", "v": "其它" }] }, { "key": "时间", "name": "全部时间", "value": [{ "n": "全部时间", "v": "" }, { "n": "2022", "v": "2022" }, { "n": "2021", "v": "2021" }, { "n": "2020", "v": "2020" }, { "n": "2019", "v": "2019" }, { "n": "2018", "v": "2018" }, { "n": "2017", "v": "2017" }, { "n": "2016", "v": "2016" }, { "n": "2015", "v": "2015" }, { "n": "2014", "v": "2014" }, { "n": "2013", "v": "2013" }, { "n": "2012", "v": "2012" }, { "n": "2011", "v": "2011" }, { "n": "2010", "v": "2010" }, { "n": "2009", "v": "2009" }, { "n": "2008", "v": "2008" }, { "n": "2006", "v": "2006" }, { "n": "2005", "v": "2005" }, { "n": "2004", "v": "2004" }] }, { "key": "字母", "name": "字母查找", "value": [{ "n": "字母查找", "v": "" }, { "n": "A", "v": "A" }, { "n": "B", "v": "B" }, { "n": "C", "v": "C" }, { "n": "D", "v": "D" }, { "n": "E", "v": "E" }, { "n": "F", "v": "F" }, { "n": "G", "v": "G" }, { "n": "H", "v": "H" }, { "n": "I", "v": "I" }, { "n": "J", "v": "J" }, { "n": "K", "v": "K" }, { "n": "L", "v": "L" }, { "n": "M", "v": "M" }, { "n": "N", "v": "N" }, { "n": "O", "v": "O" }, { "n": "P", "v": "P" }, { "n": "Q", "v": "Q" }, { "n": "R", "v": "R" }, { "n": "S", "v": "S" }, { "n": "T", "v": "T" }, { "n": "U", "v": "U" }, { "n": "V", "v": "V" }, { "n": "W", "v": "W" }, { "n": "X", "v": "X" }, { "n": "Y", "v": "Y" }, { "n": "Z", "v": "Z" }, { "n": "0-9", "v": "0" }] }, { "key": "排序", "name": "时间排序", "value": [{ "n": "时间排序", "v": "time" }, { "n": "人气排序", "v": "hits" }, { "n": "评分排序", "v": "score" }] }],
    "3": [{ "key": "剧情", "name": "全部剧情", "value": [{ "n": "全部剧情", "v": "" }, { "n": "选秀", "v": "选秀" }, { "n": "情感", "v": "情感" }, { "n": "访谈", "v": "访谈" }, { "n": "播报", "v": "播报" }, { "n": "旅游", "v": "旅游" }, { "n": "音乐", "v": "音乐" }, { "n": "美食", "v": "美食" }, { "n": "纪实", "v": "纪实" }, { "n": "曲艺", "v": "曲艺" }, { "n": "生活", "v": "生活" }, { "n": "游戏互动", "v": "游戏互动" }, { "n": "财经", "v": "财经" }, { "n": "求职", "v": "求职" }] }, { "key": "地区", "name": "全部地区", "value": [{ "n": "全部地区", "v": "" }, { "n": "内地", "v": "内地" }, { "n": "港台", "v": "港台" }, { "n": "日韩", "v": "日韩" }, { "n": "欧美", "v": "欧美" }] }, { "key": "语言", "name": "全部语言", "value": [{ "n": "全部语言", "v": "" }, { "n": "国语", "v": "国语" }, { "n": "英语", "v": "英语" }, { "n": "粤语", "v": "粤语" }, { "n": "闽南语", "v": "闽南语" }, { "n": "韩语", "v": "韩语" }, { "n": "日语", "v": "日语" }, { "n": "其它", "v": "其它" }] }, { "key": "时间", "name": "全部时间", "value": [{ "n": "全部时间", "v": "" }, { "n": "2022", "v": "2022" }, { "n": "2021", "v": "2021" }, { "n": "2020", "v": "2020" }, { "n": "2019", "v": "2019" }, { "n": "2018", "v": "2018" }, { "n": "2017", "v": "2017" }, { "n": "2016", "v": "2016" }, { "n": "2015", "v": "2015" }, { "n": "2014", "v": "2014" }, { "n": "2013", "v": "2013" }, { "n": "2012", "v": "2012" }, { "n": "2011", "v": "2011" }, { "n": "2010", "v": "2010" }, { "n": "2009", "v": "2009" }, { "n": "2008", "v": "2008" }, { "n": "2007", "v": "2007" }, { "n": "2006", "v": "2006" }, { "n": "2005", "v": "2005" }, { "n": "2004", "v": "2004" }] }, { "key": "字母", "name": "字母查找", "value": [{ "n": "字母查找", "v": "" }, { "n": "A", "v": "A" }, { "n": "B", "v": "B" }, { "n": "C", "v": "C" }, { "n": "D", "v": "D" }, { "n": "E", "v": "E" }, { "n": "F", "v": "F" }, { "n": "G", "v": "G" }, { "n": "H", "v": "H" }, { "n": "I", "v": "I" }, { "n": "J", "v": "J" }, { "n": "K", "v": "K" }, { "n": "L", "v": "L" }, { "n": "M", "v": "M" }, { "n": "N", "v": "N" }, { "n": "O", "v": "O" }, { "n": "P", "v": "P" }, { "n": "Q", "v": "Q" }, { "n": "R", "v": "R" }, { "n": "S", "v": "S" }, { "n": "T", "v": "T" }, { "n": "U", "v": "U" }, { "n": "V", "v": "V" }, { "n": "W", "v": "W" }, { "n": "X", "v": "X" }, { "n": "Y", "v": "Y" }, { "n": "Z", "v": "Z" }, { "n": "0-9", "v": "0" }] }, { "key": "排序", "name": "时间排序", "value": [{ "n": "时间排序", "v": "time" }, { "n": "人气排序", "v": "hits" }, { "n": "评分排序", "v": "score" }] }],
    "4": [{ "key": "剧情", "name": "全部剧情", "value": [{ "n": "全部剧情", "v": "" }, { "n": "科幻", "v": "科幻" }, { "n": "热血", "v": "热血" }, { "n": "推理", "v": "推理" }, { "n": "搞笑", "v": "搞笑" }, { "n": "冒险", "v": "冒险" }, { "n": "萝莉", "v": "萝莉" }, { "n": "校园", "v": "校园" }, { "n": "动作", "v": "动作" }, { "n": "机战", "v": "机战" }, { "n": "运动", "v": "运动" }, { "n": "战争", "v": "战争" }, { "n": "少年", "v": "少年" }, { "n": "少女", "v": "少女" }, { "n": "社会", "v": "社会" }, { "n": "原创", "v": "原创" }, { "n": "亲子", "v": "亲子" }, { "n": "益智", "v": "益智" }, { "n": "励志", "v": "励志" }, { "n": "情感", "v": "情感" }, { "n": "其他", "v": "其他" }] }, { "key": "地区", "name": "全部地区", "value": [{ "n": "全部地区", "v": "" }, { "n": "国产", "v": "国产" }, { "n": "日本", "v": "日本" }, { "n": "欧美", "v": "欧美" }, { "n": "其他", "v": "其他" }] }, { "key": "语言", "name": "全部语言", "value": [{ "n": "全部语言", "v": "" }, { "n": "国语", "v": "国语" }, { "n": "英语", "v": "英语" }, { "n": "粤语", "v": "粤语" }, { "n": "闽南语", "v": "闽南语" }, { "n": "韩语", "v": "韩语" }, { "n": "日语", "v": "日语" }, { "n": "其它", "v": "其它" }] }, { "key": "时间", "name": "全部时间", "value": [{ "n": "全部时间", "v": "" }, { "n": "2022", "v": "2022" }, { "n": "2021", "v": "2021" }, { "n": "2020", "v": "2020" }, { "n": "2019", "v": "2019" }, { "n": "2018", "v": "2018" }, { "n": "2017", "v": "2017" }, { "n": "2016", "v": "2016" }, { "n": "2015", "v": "2015" }, { "n": "2014", "v": "2014" }, { "n": "2013", "v": "2013" }, { "n": "2012", "v": "2012" }, { "n": "2011", "v": "2011" }, { "n": "2010", "v": "2010" }, { "n": "2009", "v": "2009" }, { "n": "2008", "v": "2008" }, { "n": "2007", "v": "2007" }, { "n": "2006", "v": "2006" }, { "n": "2005", "v": "2005" }, { "n": "2004", "v": "2004" }] }, { "key": "字母", "name": "字母查找", "value": [{ "n": "字母查找", "v": "" }, { "n": "A", "v": "A" }, { "n": "B", "v": "B" }, { "n": "C", "v": "C" }, { "n": "D", "v": "D" }, { "n": "E", "v": "E" }, { "n": "F", "v": "F" }, { "n": "G", "v": "G" }, { "n": "H", "v": "H" }, { "n": "I", "v": "I" }, { "n": "J", "v": "J" }, { "n": "K", "v": "K" }, { "n": "L", "v": "L" }, { "n": "M", "v": "M" }, { "n": "N", "v": "N" }, { "n": "O", "v": "O" }, { "n": "P", "v": "P" }, { "n": "Q", "v": "Q" }, { "n": "R", "v": "R" }, { "n": "S", "v": "S" }, { "n": "T", "v": "T" }, { "n": "U", "v": "U" }, { "n": "V", "v": "V" }, { "n": "W", "v": "W" }, { "n": "X", "v": "X" }, { "n": "Y", "v": "Y" }, { "n": "Z", "v": "Z" }, { "n": "0-9", "v": "0" }] }, { "key": "排序", "name": "时间排序", "value": [{ "n": "时间排序", "v": "time" }, { "n": "人气排序", "v": "hits" }, { "n": "评分排序", "v": "score" }] }],
    "25": [{ "key": "字母", "name": "字母查找", "value": [{ "n": "字母查找", "v": "" }, { "n": "A", "v": "A" }, { "n": "B", "v": "B" }, { "n": "C", "v": "C" }, { "n": "D", "v": "D" }, { "n": "E", "v": "E" }, { "n": "F", "v": "F" }, { "n": "G", "v": "G" }, { "n": "H", "v": "H" }, { "n": "I", "v": "I" }, { "n": "J", "v": "J" }, { "n": "K", "v": "K" }, { "n": "L", "v": "L" }, { "n": "M", "v": "M" }, { "n": "N", "v": "N" }, { "n": "O", "v": "O" }, { "n": "P", "v": "P" }, { "n": "Q", "v": "Q" }, { "n": "R", "v": "R" }, { "n": "S", "v": "S" }, { "n": "T", "v": "T" }, { "n": "U", "v": "U" }, { "n": "V", "v": "V" }, { "n": "W", "v": "W" }, { "n": "X", "v": "X" }, { "n": "Y", "v": "Y" }, { "n": "Z", "v": "Z" }, { "n": "0-9", "v": "0" }] }, { "key": "排序", "name": "时间排序", "value": [{ "n": "时间排序", "v": "time" }, { "n": "人气排序", "v": "hits" }, { "n": "评分排序", "v": "score" }] }]
  },
  filter_url: '{{fl.地区}}-{{fl.排序}}-{{fl.剧情}}-{{fl.语言}}-{{fl.字母}}---fypage---{{fl.时间}}',
  搜索二: muban.mxone5.搜索,
  搜索: $js.toString(() => {
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
    let p = rule.搜索二.split(';');
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
  搜索验证标识: '系统安全验证',
  //proxy_rule:'',//去广告代理
  proxy_rule: function(params) {
  try {
    return fixAdM3u8Ai(params.url, params.headers);
  } catch (e) {
    log('去广告处理异常: ' + e.message);
    return params.url;
  }
},
}