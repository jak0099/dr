globalThis.h_ost = 'https://api.jinlidj.com/';

var rule = {
    title: '锦鲤短剧',
    host: h_ost,
    url: '/api/search',
    homeUrl: 'api/search',
    detailUrl: '/api/detail/fyid',
    searchUrl: '/api/search',
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
    headers: {
        'User-Agent': 'okhttp/3.12.11',
        'referer': 'https://www.jinlidj.com/'
    },
    play_parse: true,
    search_match: true,
    class_parse: $js.toString(() => {
    let classes = [
    { type_id: 1, type_name: '情感关系' },
    { type_id: 2, type_name: '成长逆袭' },
    { type_id: 3, type_name: '奇幻异能' },
    { type_id: 4, type_name: '战斗热血' },
    { type_id: 5, type_name: '伦理现实' },
    { type_id: 6, type_name: '时空穿越' },
    { type_id: 7, type_name: '权谋身份' }
        ];
    input = classes;
    }),
    推荐: $js.toString(() => {
        let d = [];
        const formDatas = JSON.stringify({
            "page": 1,
            "limit": 24,
            "type_id": '',
            "year": '',
            "keyword": ''
        });
        let options = {
            method: 'POST',
            body: formDatas
        };
        let html = request(input, options);
        log(`✅html的结果: ${html}`);
        let data = JSON.parse(html).data.list;
        data.forEach(item => {
            let title = item.vod_name || '';
            if (!/名称|排除/.test(title)) {
                d.push({
                    title: title,
                    year: item.vod_year,
                    desc: item.vod_total + '集',
                    content: item.vod_tag,
                    img: item.vod_pic,
                    url: item.vod_id,
                });
            }
        });
        setResult(d);
    }),
    一级: $js.toString(() => {
        let d = [];
        const formDatas = JSON.stringify({
            "page": MY_PAGE,
            "limit": 24,
            "type_id": MY_CATE,
            "year": "",
            "keyword": ""
        });
        let options = {
            method: 'POST',
            body: formDatas
        };
        let html = request(input, options);
        let data = JSON.parse(html).data.list;
        data.forEach(item => {
            let title = item.vod_name || '';
            if (!/名称|排除/.test(title)) {
                d.push({
                    title: title,
                    year: item.vod_year,
                    desc: item.vod_total + '集',
                    content: item.vod_tag,
                    img: item.vod_pic,
                    url: item.vod_id,
                });
            }
        });
        setResult(d);
    }),
    二级: $js.toString(() => {
        let html = request(input);
        let list = JSON.parse(html).data;
        VOD = {
            vod_id: list['vod_id'] || '暂无id',
            vod_name: list['vod_name'] || '暂无名称',
            type_name: list['vod_class'] || '暂无类型',
            vod_pic: list['vod_pic'] || '暂无图片',
            vod_remarks: list['vod_remarks'] || '暂无备注',
            vod_year: list['vod_year'] || '暂无年份',
            vod_area: list['vod_area'] || '暂无地区',
            vod_actor: list['vod_actor'] || '暂无演员信息',
            vod_director: list['vod_director'] || '暂无导演',
            vod_content: list['vod_blurb'] || '暂无剧情介绍'
        };
        let playlist = list['player'];
        let playForm = [];
        let playUrls = [];
        Object.keys(playlist).forEach(key => {
            playUrls.push(key + '$' + playlist[key]);
        });
        VOD.vod_play_from = '锦鲤短剧';
        VOD.vod_play_url = playUrls.join('#');
    }),
    搜索: $js.toString(() => {
        let d = [];
        let formDatas = JSON.stringify({
            "page": MY_PAGE,
            "limit": 24,
            "type_id": "",
            "keyword": KEY
        });
        let options = {
            method: 'POST',
            body: formDatas
        };
        let html = request(input, options);
        let data = JSON.parse(html).data.list;
        if (rule.search_match) {
                    data = data.filter(item =>
                        item.vod_name &&
                        new RegExp(KEY, "i").test(item.vod_name)
                    );
                }
        data.forEach(item => {
            let title = item.vod_name;
            if (!/名称|排除/.test(title)) {
                d.push({
                    title: title,
                    year: item.vod_year,
                    desc: item.vod_total,
                    content: item.vod_tag,
                    img: item.vod_pic,
                    url: item.vod_id,
                });
            }
        });
        setResult(d);
    }),

    lazy: $js.toString(() => {
        let html = request(input);
        let match = html.match(/let data\s*=\s*({[^;]*});/);
        let url = JSON.parse(match[1]).url;
        input = {
            parse: 0,
            url: url
        };
    }),
}
