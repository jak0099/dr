globalThis.h_ost = 'https://mov.cenguigui.cn';

var rule = {
    title: '甜圈短剧[短]',
    host: h_ost,
    url: '/duanju/api.php?classname=fyclass&offset=fypage',
    searchUrl: '/duanju/api.php?name=**&page=fypage',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.5249.126 Mobile Safari/537.36',
        'Referer': h_ost
    },
    timeout: 5000,
    limit: 20,
    multi: 1,
    searchable: 2,
    play_parse: true,
    lazy: '',
    class_parse: `js:
    let cls = [];
    const types = {
        '🔥 推荐榜': '推荐榜',
        '🎬 新剧': '新剧',
        '🎬 逆袭': '逆袭',
        '🎬 霸总': '霸总',
        '🎬 现代言情': '现代言情',
        '🎬 打脸虐渣': '打脸虐渣',
        '🎬 豪门恩怨': '豪门恩怨',
        '🎬 神豪': '神豪',
        '🎬 马甲': '马甲',
        '🎬 都市日常': '都市日常',
        '🎬 战神归来': '战神归来',
        '🎬 小人物': '小人物',
        '🎬 女性成长': '女性成长',
        '🎬 大女主': '大女主',
        '🎬 穿越': '穿越',
        '🎬 都市修仙': '都市修仙',
        '🎬 强者回归': '强者回归',
        '🎬 亲情': '亲情',
        '🎬 古装': '古装',
        '🎬 重生': '重生',
        '🎬 闪婚': '闪婚',
        '🎬 赘婿逆袭': '赘婿逆袭',
        '🎬 虐恋': '虐恋',
        '🎬 追妻': '追妻',
        '🎬 天下无敌': '天下无敌',
        '🎬 家庭伦理': '家庭伦理',
        '🎬 萌宝': '萌宝',
        '🎬 古风权谋': '古风权谋',
        '🎬 职场': '职场',
        '🎬 奇幻脑洞': '奇幻脑洞',
        '🎬 异能': '异能',
        '🎬 无敌神医': '无敌神医',
        '🎬 古风言情': '古风言情',
        '🎬 传承觉醒': '传承觉醒',
        '🎬 现言甜宠': '现言甜宠',
        '🎬 奇幻爱情': '奇幻爱情',
        '🎬 乡村': '乡村',
        '🎬 历史古代': '历史古代',
        '🎬 王妃': '王妃',
        '🎬 高手下山': '高手下山',
        '🎬 娱乐圈': '娱乐圈',
        '🎬 强强联合': '强强联合',
        '🎬 破镜重圆': '破镜重圆',
        '🎬 暗恋成真': '暗恋成真',
        '🎬 民国': '民国',
        '🎬 欢喜冤家': '欢喜冤家',
        '🎬 系统': '系统',
        '🎬 真假千金': '真假千金',
        '🎬 龙王': '龙王',
        '🎬 校园': '校园',
        '🎬 穿书': '穿书',
        '🎬 女帝': '女帝',
        '🎬 团宠': '团宠',
        '🎬 年代爱情': '年代爱情',
        '🎬 玄幻仙侠': '玄幻仙侠',
        '🎬 青梅竹马': '青梅竹马',
        '🎬 悬疑推理': '悬疑推理',
        '🎬 皇后': '皇后',
        '🎬 替身': '替身',
        '🎬 大叔': '大叔',
        '🎬 喜剧': '喜剧',
        '🎬 剧情': '剧情'
    };
    for (let key in types) {
        cls.push({type_name: key, type_id: types[key]});
    }
    setResult(cls);
    `,
    一级: `js:
    let data = JSON.parse(request(input)).data;
    let videos = [];
    data.forEach(function(item) {
        videos.push({
            vod_id: item.book_id,
            vod_name: item.title,
            vod_pic: item.cover,
            vod_remarks: item.sub_title,
            vod_content: item.copyright
        });
    });
    setResult(videos);
    `,
    二级: `js:
    let api_url = rule.host + '/duanju/api.php?book_id=' + input;
    let res = JSON.parse(request(api_url));
    let vod = {
        vod_id: input,
        vod_name: res.book_name,
        vod_pic: res.book_pic,
        vod_content: res.desc,
        vod_remarks: res.duration,
        vod_year: res.time,
        vod_actor: res.author
    };
    let playList = [];
    res.data.forEach(function(ep) {
        playList.push(ep.title + '$' + ep.video_id);
    });
    vod.vod_play_from = '甜圈短剧';
    vod.vod_play_url = playList.join('#');
    setResult(vod);
    `,
    搜索: `js:
    let data = JSON.parse(request(input)).data;
    let videos = [];
    data.forEach(function(item) {
        videos.push({
            vod_id: item.book_id,
            vod_name: item.title,
            vod_pic: item.cover,
            vod_remarks: item.type,
            vod_content: item.author
        });
    });
    setResult(videos);
    `,
    lazy: `js:
    let playUrl = rule.host + '/duanju/api.php?video_id=' + input + '&type=mp4';
    setResult([{parse: 0, url: playUrl}]);
    `
};