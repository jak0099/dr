var rule = {
    类型: '影视',
    title: '土剧',
    host: 'https://m.tuju.app',
    url: '/sorts/0,S,,0,,fyclass,fypage.html',
    searchUrl: '/search/**/fypage.html',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    filter: '',
    filter_url: '',
    filter_def: {},
    headers: {
        'User-Agent': 'MOBILE_UA',
        'Referer': 'https://m.tuju.app/'
    },
    timeout: 5000,
    class_name: '男频&女频',
    class_url: 'male&female',
    cate_exclude: '',
    play_parse: true,
    lazy: $js.toString(() => {
        let html = request(input, {
            headers: rule.headers,
            timeout: 10000
        });
        
        let m3u8 = '';
        try {
            let playerDataMatch = html.match(/var playerData\s*=\s*({[\s\S]*?});/);
            if(playerDataMatch && playerDataMatch[1]) {
                let jsonData = JSON.parse(playerDataMatch[1]);
                m3u8 = jsonData.url;
            }
        } catch(e) {}
        
        if(!m3u8) {
            let sourcesMatch = html.match(/sources:\s*\[\s*{\s*file:\s*"([^"]+)"/);
            if(sourcesMatch) m3u8 = sourcesMatch[1];
        }
        
        if(!m3u8) {
            let iframeMatch = html.match(/<iframe[^>]+src="([^"]+)"/);
            if(iframeMatch) {
                let iframeUrl = iframeMatch[1];
                if(!iframeUrl.startsWith('http')) {
                    iframeUrl = new URL(iframeUrl, input).href;
                }
                let iframeHtml = request(iframeUrl, {
                    headers: rule.headers,
                    timeout: 10000
                });
                m3u8 = iframeHtml.match(/(https?:\/\/[^\s]+\.m3u8)/)?.[0];
            }
        }
        
        return [{
            parse: 0,
            url: m3u8,
            header: JSON.stringify(rule.headers)
        }];
    }),
    double: true,
    推荐: '*',
    一级: '.inline-flex;.object-cover&&title;.object-cover&&data-lazy||src;.flex.gap-1:eq(2)&&Text;a&&href;.capitalize.opacity-50&&Text',
    二级: {
        title: '.font-bold&&Text;vod_type',
        img: '.object-cover&&data-lazy||src',
        desc: '.flex.items-center:eq(2)&&Text;.flex.items-center:eq(1)&&Text;;.flex.items-center:eq(6)&&Text;.flex.items-center:eq(4)&&Text',
        content: '.flex.leading-6:eq(1)&&Text',
        // 重定向到播放页
        重定向: $js.toString(() => {
            let playLinks = pdfa(html, '.plays+a');
            if(playLinks.length > 0) {
                let href = playLinks.eq(0).attr('href');
                let playIdMatch = href.match(/\/play\/([^\/?]+)/);
                if(playIdMatch && playIdMatch[1]) {
                    let playId = playIdMatch[1];
                    MY_URL = rule.host + '/play/' + playId + '/';
                    html = request(MY_URL, {
                        headers: rule.headers,
                        timeout: 10000
                    });
                }
            }
        }),
        tabs: $js.toString(() => {
            return ['线路1', '线路2'];
        }),
        lists: $js.toString(() => {
            // 提取播放ID
            let playId = MY_URL.match(/\/play\/([^\/?]+)/)?.[1];
            if(!playId) return [];
            
            // 提取所有剧集
            let episodes = [];
            let episodeLinks = pdfa(html, '.episode-link');
            for(let i = 0; i < episodeLinks.length; i++) {
                let a = episodeLinks.eq(i);
                let href = a.attr('href');
                let epNum = href.match(/\/view\/\d+\/(\d+)\.html/)?.[1];
                if(epNum) {
                    let epName = a.find('span').text().trim();
                    let epUrl = rule.host + '/play/' + playId + '/' + epNum;
                    episodes.push({
                        name: epName,
                        url: epUrl
                    });
                }
            }
            
            // 构建两个线路的剧集列表
            let list1 = episodes.map(e => e.name + '$' + e.url + '?source=1');
            let list2 = episodes.map(e => e.name + '$' + e.url + '?source=2');
            
            return [list1, list2];
        })
    },
    搜索: '*',
};