globalThis.h_ost = 'https://api.jkyai.top';

var rule = {
    title: '百度短剧[短]',
    host: h_ost,
    detailUrl: '/API/bddjss.php?id=fyid',
    searchUrl: '/API/bddjss.php?name=**&page=fypage',
    url: '/API/bddjss.php?name=fyclass&page=fypage',
    headers: {
        'User-Agent': 'okhttp/3.12.11',
    },
    timeout: 5000,
    filterable: 1,
    limit: 20,
    multi: 1,
    searchable: 2,
    play_parse: true,
    search_match: true, 
    class_parse: $js.toString(() => {
    let classes = [
    { type_id: '逆袭', type_name: '🎬逆袭' },
    { type_id: '霸总', type_name: '🎬霸总' },
    { type_id: '豪门恩怨', type_name: '🎬豪门恩怨' },
    { type_id: '神豪', type_name: '🎬神豪' },
    { type_id: '马甲', type_name: '🎬马甲' },
    { type_id: '战神归来', type_name: '🎬战神归来' },
    { type_id: '大女主', type_name: '🎬大女主' },
    { type_id: '穿越', type_name: '🎬穿越' },
    { type_id: '都市修仙', type_name: '🎬都市修仙' },
    { type_id: '亲情', type_name: '🎬亲情' },
    { type_id: '重生', type_name: '🎬重生' },
    { type_id: '闪婚', type_name: '🎬闪婚' },
    { type_id: '虐恋', type_name: '🎬虐恋' },
    { type_id: '追妻', type_name: '🎬追妻' },
    { type_id: '萌宝', type_name: '🎬萌宝' },
    { type_id: '职场', type_name: '🎬职场' },
    { type_id: '异能', type_name: '🎬异能' },
    { type_id: '无敌神医', type_name: '🎬无敌神医' },
    { type_id: '古风言情', type_name: '🎬古风言情' },
    { type_id: '传承觉醒', type_name: '🎬传承觉醒' },
    { type_id: '现言甜宠', type_name: '🎬现言甜宠' },
    { type_id: '奇幻爱情', type_name: '🎬奇幻爱情' },
    { type_id: '乡村', type_name: '🎬乡村' },
    { type_id: '历史古代', type_name: '🎬历史古代' },
    { type_id: '王妃', type_name: '🎬王妃' },
    { type_id: '高手下山', type_name: '🎬高手下山' },
    { type_id: '娱乐圈', type_name: '🎬娱乐圈' },
    { type_id: '强强联合', type_name: '🎬强强联合' },
    { type_id: '破镜重圆', type_name: '🎬破镜重圆' },
    { type_id: '暗恋成真', type_name: '🎬暗恋成真' },
    { type_id: '民国', type_name: '🎬民国' },
    { type_id: '欢喜冤家', type_name: '🎬欢喜冤家' },
    { type_id: '系统', type_name: '🎬系统' },
    { type_id: '真假千金', type_name: '🎬真假千金' },
    { type_id: '龙王', type_name: '🎬龙王' },
    { type_id: '校园', type_name: '🎬校园' },
    { type_id: '穿书', type_name: '🎬穿书' },
    { type_id: '女帝', type_name: '🎬女帝' },
    { type_id: '团宠', type_name: '🎬团宠' },
    { type_id: '年代爱情', type_name: '🎬年代爱情' },
    { type_id: '玄幻仙侠', type_name: '🎬玄幻仙侠' },
    { type_id: '青梅竹马', type_name: '🎬青梅竹马' },
    { type_id: '悬疑推理', type_name: '🎬悬疑推理' },
    { type_id: '皇后', type_name: '🎬皇后' },
    { type_id: '替身', type_name: '🎬替身' },
    { type_id: '大叔', type_name: '🎬大叔' },
    { type_id: '喜剧', type_name: '🎬喜剧' },
    { type_id: '剧情', type_name: '🎬剧情' }
        ];
    input = classes;
    }),
    
    lazy: $js.toString(() => {
        let item = JSON.parse(request(`https://api.jkyai.top/API/bddjss.php?video_id=${input}`));
        let qualities = item.data.qualities;
        let urls = [];
        
        console.log(`✅qualities的结果: ${JSON.stringify(qualities, null, 4)}`);
        
        // 按清晰度优先级从高到低添加链接
        const qualityOrder = ["1080p", "sc", "sd"];
        const qualityNames = {
            "1080p": "蓝光",
            "sc": "超清",
            "sd": "标清"
        };
        
        qualityOrder.forEach(qualityKey => {
            let quality = qualities.find(q => q.quality === qualityKey);
            if (quality) {
                urls.push(qualityNames[qualityKey], quality.download_url);
            }
        });
        
        input = {
            parse: 0,
            url: urls
        };
    }),
    一级: $js.toString(() => {
        let d = [];
        let html =  request(input);
        let data = JSON.parse(html).data;
        data.forEach((it) => {
            d.push({
                title: it.title,
                img: it.cover,
                desc: '更新至' + it.totalChapterNum + '集',
                url: it.id
            });
        });
        setResult(d);
    }),
    二级: $js.toString(() => {
        let item = JSON.parse( request(input));
         VOD = {
            vod_name: item.title,
            vod_pic: item.data[0].cover,
            vod_year: '更新至:' + item.total + '集',
        };
        let playUrls = item.data.map(item => `${item.title}$${item.video_id}`);
        VOD.vod_play_from = '百度短剧';
        VOD.vod_play_url = playUrls.join("#");
        }),
    搜索: $js.toString(() => {
        let d = [];
        let html =  request(input);
        let data = JSON.parse(html).data;
        if (rule.search_match) {
            data = data.filter(item =>
                item.title &&
                new RegExp(KEY, "i").test(item.title)
            );
        }
        data.forEach((it) => {
            d.push({
                title: it.title,
                img: it.cover,
                desc: '更新至' + it.totalChapterNum + '集',
                url: it.id
            });
        });
        setResult(d);
    }),
}
