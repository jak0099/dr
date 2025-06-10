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