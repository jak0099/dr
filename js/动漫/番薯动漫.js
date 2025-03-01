const { getHtml } = $.require('./_lib.request.js');

const UA = randomUa.generateUa(1, {
    device: ['pc'],
    pcOs: ['windows'],
    windowsApp: ['edge']
});

var rule = {
    类型: '影视',
    title: '番薯动漫',
    模板: 'mxpro',
    host: 'https://www.fsdm02.com',
    url: '/vodshow/${fyclass}-${fl.area}-${fl.order}------${fypage}---${fl.year}.html',
    searchUrl: '/vodsearch/**/page/${fypage}.html',
    filterable: 1,
    headers: {
        'User-Agent': UA,
        'Referer': 'https://www.fsdm02.com',
        'cookie': ''
    },

    class_parse: $js.toString(() => {
        return {
            class: [
                { type_id: "1", type_name: "TV番剧" },
                { type_id: "3", type_name: "剧场版" },
                { type_id: "20", type_name: "4k分区" },
                { type_id: "21", type_name: "欧美动漫" }
            ],
            filters: {
                "1": [
                    {
                        name: "年份", key: "year",
                        value: Array.from({length:25},(_,i)=>({n:2000+i,v:2000+i})).reverse()
                    },
                    {
                        name: "排序", key: "order",
                        value: [
                            {n:"时间排序",v:"time"},
                            {n:"人气排序",v:"hits"},
                            {n:"评分排序",v:"score"}
                        ]
                    }
                ],
                "3": [
                    {
                        name: "地区", key: "area",
                        value: [{n:"全部",v:""},{n:"日本",v:"%E6%97%A5%E6%9C%AC"}]
                    },
                    {
                        name: "年份", key: "year",
                        value: Array.from({length:25},(_,i)=>({n:2000+i,v:2000+i})).reverse()
                    },
                    {
                        name: "排序", key: "order",
                        value: [
                            {n:"时间排序",v:"time"},
                            {n:"人气排序",v:"hits"},
                            {n:"评分排序",v:"score"}
                        ]
                    }
                ]
            }
        }
    }),

    一级: $js.toString(() => {
        const url = MY_URL
            .replace('${fyclass}', MY_CATE)
            .replace('${fypage}', MY_PAGE)
            .replace('${fl.area}', MY_FL.area || "")
            .replace('${fl.order}', MY_FL.order || "")
            .replace('${fl.year}', MY_FL.year || "");
        
        const html = request(urljoin(HOST, url));
        const $ = parseDom(html);
        VODS = $('.module>a').map(item => ({
            vod_id: pd(item, 'a&&href'),
            vod_name: pd(item, 'img&&alt'),
            vod_pic: pd(item, 'img&&data-original'),
            vod_remarks: pd(item, '.module-item-note&&Text') || pd(item, 'div.hdinfo&&Text')
        }));
    }),

    二级: $js.toString(() => {
        const html = request(urljoin(HOST, MY_URL));
        const $ = parseDom(html);
        
        VOD = {
            vod_name: $('.module-info-heading>h1').text(),
            vod_pic: $('.lazyload:first').data('original'),
            vod_remarks: $('.module-info-item-title:contains(更新)+p').text(),
            vod_content: $('.show-desc').text().trim(),
            vod_play_from: $('#y-playList span').map(i => $(i).text()).join('$$$'),
            vod_play_url: $('.module-play-list-content').map(i => 
                $(i).find('a').map(j => 
                    $(j).text().replace(/\(.*/, "") + "$" + $(j).attr('href')
                ).join('#')
            ).get().join('$$$')
        };
    }),

    搜索: $js.toString(() => {
        let cookie = getCookie();
        const html = post(urljoin(HOST, '/vodsearch/-------------/'), {
            headers: { Cookie: cookie },
            body: `wd=${encodeURI(MY_WD)}`
        });
        
        VODS = parseDom(html)('.module-items>div').map(item => ({
            vod_id: pd(item, 'a&&href').replace(/.*?\/movie\/(.*?)\.html/, '$1'),
            vod_name: pd(item, 'img&&alt'),
            vod_pic: pd(item, 'img&&data-original'),
            vod_remarks: pd(item, '.module-info-item-content&&Text')
        }));
    }),

    lazy: $js.toString(() => {
        const html = request(urljoin(HOST, MY_URL));
        const config = eval(html.match(/config\s*=[\s\S]*?(?=<\/script>)/)[0]);
        
        const decrypt = (encrypted) => {
            const key = CryptoJS.MD5($('meta[name="viewport"]').attr('id') + "3G7Fh9Dp6R2QsE8w")
                .toString()
                .substring(0, 16);
            return CryptoJS.AES.decrypt(encrypted, key, { 
                iv: key,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }).toString(CryptoJS.enc.Utf8);
        };
        
        input = decrypt(config.url).match(/\.m3u8|\.mp4/) ? 
            { parse: 0, url: decrypt(config.url) } : 
            input;
    }),

    预处理: $js.toString(() => {
        if (!rule.headers.cookie || Date.now() - lastCookieUpdate > 300000) {
            rule.headers.cookie = "sl-challenge-jwt=" + getJwt();
            lastCookieUpdate = Date.now();
        }
    })
};

/* 工具函数 */
const parseDom = (html) => {
    const $ = cheerio.load(html);
    return {
        find: (selector) => $(selector),
        map: (selector, fn) => $(selector).map((i, el) => fn($(el))).get()
    };
};

const getCookie = () => {
    try {
        return request(HOST, { withHeaders: true }).headers['set-cookie'];
    } catch (e) {
        return '';
    }
};

const getJwt = () => {
    const wasm = request("https://challenge.rivers.chaitin.cn/challenge/v2/calc.wasm", {
        responseType: 'arraybuffer'
    });
    
    const clientId = request(HOST).match(/SafeLineChallenge\("(.*?)"/)[1];
    const issue = JSON.parse(post("https://challenge.rivers.chaitin.cn/challenge/v2/api/issue", {
        body: JSON.stringify({ client_id: clientId, level: 2 })
    }));
    
    return post("https://challenge.rivers.chaitin.cn/challenge/v2/api/verify", {
        body: JSON.stringify({
            issue_id: issue.data.issue_id,
            result: computeWasmResult(wasm, issue.data.data),
            serials: []
        })
    }).match(/"jwt":"(.*?)"/)[1];
};

let lastCookieUpdate = 0;