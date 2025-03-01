var rule = {
    类型: '影视',
    title: '番薯动漫[漫]',
    host: 'https://www.fsdm02.com',
    url: '/vodshow/fyclass--------fypage---.html',
    searchUrl: '/vodsearch/**----------fypage---.html',
    filterable: 1,
    headers: {
        'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/${(537+Math.random()*2).toFixed(2)} (KHTML, like Gecko) Chrome/${Math.floor(90+Math.random()*40)}.0.0.0 Safari/537.36`,
        'X-Forwarded-For': `116.25.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        'Referer': 'https://www.fsdm02.com/'
    },
    class_parse: `js:
        let html = request(HOST);
        let $ = jsp.createParser(html);
        let classes = [];
        $('.nav-menu li:not(:contains("首页")) a').each(function(){
            let name = $(this).text().trim();
            let href = $(this).attr('href');
            let typeId = href.match(/vodshow\\/(\\d+)/)[1];
            classes.push(name + '$' + typeId);
        });
        CLASS = classes.join('#');
    `,
    推荐: `js:
        let d = [];
        let html = request(HOST);
        let $ = jsp.createParser(html);
        $('.module-item').each(function(){
            let it = $(this);
            d.push({
                title: it.find('.title').text() || it.find('img').attr('alt'),
                img: it.find('img').attr('data-original') || it.find('img').attr('src'),
                desc: it.find('.remarks').text(),
                url: it.find('a').attr('href')
            });
        });
        setResult(d);
    `,
    一级: {
        title: '.vod-item .title&&Text',
        img: 'img&&data-original',
        desc: '.remarks&&Text',
        url: 'a&&href'
    },
    二级: {
        title: 'h1&&Text; .tag&&Text',
        img: '.detail-img&&data-original',
        desc: `js:
            let info = [];
            $('.info-item').each(function(){
                let text = $(this).text().replace(/\\s+/g,'');
                if(text) info.push(text);
            });
            info.join(' · ');
        `,
        content: '.desc&&Text',
        tabs: '.play-source-tab&&a',
        lists: `.episode-list:eq(#id) a`,
        prepend: `js:
            let playFrom = [];
            $('.play-source-tab a').each(function(){
                playFrom.push($(this).text().trim());
            });
            setPlayFrom(playFrom);
        `
    },
    搜索: `js:
        let d = [];
        let html = request(input);
        let $ = jsp.createParser(html);
        $('.search-item').each(function(){
            let it = $(this);
            d.push({
                title: it.find('.title').text(),
                img: it.find('img').attr('data-src'),
                desc: it.find('.info').text(),
                url: it.find('a').attr('href')
            });
        });
        setResult(d);
    `,
    lazy: `js:
        let html = request(input);
        let encryptedData = html.match(/var player_data\\s*=\\s*'(.*?)'/)[1];
        
        // AES解密核心
        let decrypt = (data) => {
            let key = CryptoJS.MD5('fsdm@2024').toString();
            let iv = CryptoJS.enc.Utf8.parse(key.substr(16,16));
            let bytes = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {iv});
            return bytes.toString(CryptoJS.enc.Utf8);
        };
        
        let playUrl = decrypt(encryptedData);
        input = { parse:0, url: playUrl };
    `,
    proxy_rule: `js:
        if(/(m3u8|mp4)/.test(input.url)){
            input.url = buildProxyUrl(input.url, {
                headers: {
                    'X-Real-IP': '118.25.'+(Math.random()*255|0)+'.'+(Math.random()*255|0)
                }
            });
        }
    `,
    antiBot: `js:
        // 过5秒盾验证
        if(html.includes('安全检查')){
            let challenge = html.match(/id="challenge-form" action="(.*?)"/)[1];
            let params = {
                jschl_vc: html.match(/name="jschl_vc" value="(.*?)"/)[1],
                pass: html.match(/name="pass" value="(.*?)"/)[1],
                jschl_answer: calculateAnswer(html)
            };
            await sleep(5000);
            let verifyHtml = post(HOST + challenge, {body: params});
            rule.headers.Cookie = verifyHtml.headers['Set-Cookie'];
        }
    `
}