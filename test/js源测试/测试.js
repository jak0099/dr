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

globalThis.fixAdM3u8Ai = fixAdM3u8Ai;

var rule = {
    title: '可可影视[优]',
    //动态切换域名
    host: `https://www.${(r=>r<0.5?'keke5':['keke1','keke2','keke3','keke4','keke6','keke7','keke8'][(r-0.5)*14|0])(Math.random())}.app`,
    //host: `https://www.${Math.random() < 0.5 ? 'keke8' : 'keke5'}.app`,
    //host: 'https://www.keke5.app',
    //host: 'https://www.keke8.app',
    //host: 'https://www.kkys01.com',
    url: '/show/fyclass-fyfilter-fypage.html',
    filter_url: '{{fl.类型}}-{{fl.地区}}-{{fl.语言}}-{{fl.年份}}-{{fl.排序}}',
    searchUrl: '/search?k=**&page=fypage',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    //headers: {'User-Agent': 'MOBILE_UA'},
    headers: {
        'User-Agent': 'UC_UA',
        'Referer': rule.host + '/',
        'X-Forwarded-For': `119.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`
    },
    class_parse: '#nav-swiper&&.nav-swiper-slide;a&&Text;a&&href;/(\\w+).html',
    cate_exclude: 'Netflix|今日更新|专题列表|排行榜',
    tab_exclude: '可可影视提供',
    tab_order: ['超清', '蓝光', '极速蓝光'],
    tab_remove: ['4K(高峰不卡)'],
    play_parse: true,
    limit: 20,
    推荐: '.section-box:eq(2)&&.module-box-inner&&.module-item;*;*;*;*',
    double: false,
    //一级: '.module-box-inner&&.module-item;.v-item-title:eq(1)&&Text;img:last-of-type&&data-original;.v-item-bottom&&span:eq(1)&&Text;a&&href',
    一级: '.module-box-inner&&.module-item;.v-item-title:eq(1)&&Text;img:last-of-type&&data-original;.v-item-bottom&&span&&Text;a&&href',
    二级: {
        title: '.detail-pic&&img&&alt;.detail-tags&&a&&Text',
        img: '.detail-pic&&img&&data-original',
        desc: '.detail-info-row-main:eq(-2)&&Text;.detail-tags&&a&&Text;.detail-tags&&a:eq(1)&&Text;.detail-info-row-main:eq(1)&&Text;.detail-info-row-main&&Text',
        content: '.detail-desc&&Text',
        //tabs: '.source-item-label:nth-of-type(2)',
        //tabs: 'body&&.source-item-label[id]',
        tabs: 'body&&.source-item-label',
        lists: '.episode-list:eq(#id) a',
    },
    //搜索: '.search-result-list&&a;.title:eq(1)&&Text;*;.search-result-item-header&&Text;a&&href;.desc&&Text',
    搜索: '.search-result-list&&a;h3&&Text;.lazyload&&data-original;.info:eq(0)&&Text;a&&href;.info:eq(1)&&Text',
    // 图片替换:$js.toString(()=>{
    //     log(input);
    //    input = input.replace(rule.host,'https://vres.a357899.cn');
    // }),
    //图片替换: 'https://keke5.app=>https://vres.a357899.cn',
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
    filter: 'H4sIAAAAAAAAA+2Zz08bRxTH/xefOdgGtTi3HlqpUpVLe6hURREHV4qa0kN/qFWEZLANxhBsEDFx7AIpGEyCf0CQY9bY/md2Ztf/RWf95r0ZR+3LtqGRqviC+LzvzOzs7Nt531k/isQid755FPku+VvkTsS76In9jchMZHHh+6TNvyw8/Dk5briowiJbH6XrQVhBZGkGoneTP3378MGvOnz3068+++Lzr0kV66cyndWiBtJKVRVBDYC0fN3tV1EDQM3LXZgxNaAml4syVdKaBtLSebnyDDUAGjPf8vovcEwA0k63xXUPNQAac+XcK23jmAB0D7U1008Daas7o/IZagA0Zu6p66zjmADUb2tVFC6xHwBphWP/iNYagLRmRzgN1ABQc28O/WZbaxpoLo0Td3CIcwEw2qaf2ydtDLRmBw1vfQ3XDMB6tt5uzzzbAEjLDL2XNdQAUPOXN0XV0ZqGpXuBCmksqm2x6Zg0Jg6TxuL4dFRexUXoNkSlr0PYYnRSlt3WRAsdMg+gLa8Hk2NAiJZlsKWCuCwAtJx7NVk9x+UEoGsfnJl+GmhZNi6MpoHGfPXEaBpotoPXRtNA2uO2cE5QAzBjtu0x23Y/t3s9on4a6N6390W2i/cOQNd7feXXhng9AJMuh3JjqB4GZQwyXXWY8fp7skQPh5jmnCmoDiKHb5xhatHaVSj3OtiC2Np2RHtXZPFNMUxPojb0CirVy/gwiOkqg1dwXdehjcgO0T1nO24PtzENdqr7rYZfT5lUJw6V6pW+ao+DA9BNXh4bTYOVaEbTYCWv0TRYyWs0DVaCWv0Awi6CuL5ye33rfUcOswjxaHxOx8b/WvFZE5+143ETj9vxmInH7HjUxKMUj0XH0zwiLRa9r/4kqEH0zQbRoEHUNEhMNoglEtH76o9pMP9mg/mgwbxpICtXcg9fhUD7ODGxsHJrRzgFs7DEkwvr9W5EMYdXMaNXU7KEL0ncDntpfNJmXf1WRuRw350LpnFvRvX6b8yJpjDmhDMZnHHhjARrFrjizZghrrBzhoczJ0FhovvTEMYMceaEMzVBQaPraQhjQNSWZ56RhjBGkDNfo3RfdFdwLgC3bUAoHLllA8LZhH9rPTgLwVkP1l681ShxJoMzJ9PCOS2cH3DhnH1PhTNfl6llefNy4hxnQqFO/9wpkPsywGzebKHkCh5X1JgTqSzue+dU0AFCGQimaHMnZ5UH/vMUagCkVfKyjFVFQxjj4fUK1rEMgPodPhcV2mQAUPtk8YFKK5Dgf8rMYVGtPW53AHRUcy5Fo4g7PwBtd7/vyKe40hpMOd9Qa0jlfAxhLMJfWqDb+mbAlc23l/N3+1rwbmZg+s1g+s1gan1snlqf/7n1mbst6+M5L0T/CaYzAGnVA9dxvFOqwcQ0t2bb9NZAWuZCFI5Mb8OhDBP36Z8xTNznfa/SFUe0OQHQbPMrXqWJUwUwJffvP/1zBo2zBl8mF378YVFrGmie3M8zjGHiDJosP3NvaEcFmP6cMC0j0zLyIZeRj/55GTFh+ymPUqv+H5R6AJTqu1XRxBOLBppVuajON5jqANTvbOh38tgPgK639tjbPcDrAYQpK+yv28zJij3fMudw9tdt7myf7Yhm2rySAbz3zFEpsvQnK+G0IDwhAAA=',
    一级f: `js:
    let urls = [
    'https://keke5.app/show/1-----1-1.html',
    'https://keke5.app/show/2-----1-1.html',
    'https://keke5.app/show/3-----1-1.html',
    'https://keke5.app/show/4-----1-1.html',
    'https://keke5.app/show/6-----1-1.html',
    ];
    let filters = {};
    pdfa = jsp.pdfa;
    pdfh = jsp.pdfh;
    for(let url of urls){
    let fclass = url.match(/show\\/(\\d+)-/)[1];
    console.log(fclass);
    let html = request(url);
    let tabs = pdfa(html, '.filter-row');
    let data = [];
    for (let tab of tabs) {
        let title = pdfh(tab, 'strong&&Text').replace(':','');
        let lis = pdfa(tab, 'a');
        let _map = {key: title, name: title};
        let value = [];
        for (let li of lis) {
            let n = pdfh(li, 'a&&Text').trim();
            let v=n;
            if(/全部|地区|类型/.test(n)){
                v = '';
            }else if(/综合/.test(n)){
                v = '1';
            }else{
                v = pdfh(li,'a&&href');
                try {
                    v = v.match(/-(.*?)1-1\.html/)[1].replace(/-/g,'');
                }catch (e) {
                    v = v.match(/-(.*?)-1\.html/)[1].replace(/-/g,'');
                }
                v = decodeURIComponent(v);
            }
            value.push({
                'n': n, 'v': v
            });
        }
        _map['value'] = value;
        data.push(_map);
    }
    filters[fclass] = data;
    }
    VODS = [filters];
    console.log(gzip(JSON.stringify(filters)));
    `,       
     
}