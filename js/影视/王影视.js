var rule = {
    title: '王某某影视',
    host: 'https://wmmys.wmmys.cn',
    homeTid: '',
    homeUrl: '/api.php/provide/vod/?ac=detail&t={{rule.homeTid}}',
    detailUrl: '/api.php/provide/vod/?ac=detail&ids=fyid',
    searchUrl: '/api.php/provide/vod/?wd=**&pg=fypage',
    url: '/api.php/provide/vod/?ac=detail&pg=fypage&t=fyclass',
    headers: {
        'User-Agent': 'WMMYSMAX',
    },
    class_parse: 'json:class;',
    timeout: 5000, // 超时时间
    filterable: 1,
    limit: 20,
    multi: 1,
    searchable: 2,
    play_parse: true,
    tab_order: ['qq', 'mgtv', 'qiyi', 'youku', 'blilblil', '1080zyk'], // 播放线路优先顺序
    lazy: $js.toString(() => {
        // 默认解析逻辑
        input = {
            parse: 1, // 启用解析
            url: input, // 解析后的 URL
            jx: 1, // 启用解析
        };
    }),
    推荐: 'json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from',
    一级: $js.toString(() => {
        // 优化数据处理逻辑
        let bata = JSON.parse(request(input)).list || [];
        setResult(bata.map(it => ({
            url: it.vod_id,
            title: it.vod_name,
            img: it.vod_pic,
            desc: it.vod_remarks,
        })));
    }),
    二级: $js.toString(() => {
        // 减少解析步骤
        let data = JSON.parse(request(input)).list || [];
        VOD = data.length > 0 ? data[0] : null;
    }),
    搜索: 'json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from',
};
