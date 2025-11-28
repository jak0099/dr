var rule = {
    title: '星之阁[短]',
    host: 'https://api.xingzhige.com',
    url: '/API/playlet/?keyword=fyclass&page=fypage',
    searchUrl: '/API/playlet/?keyword=**&page=1',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    timeout: 5000,
    class_parse: $js.toString(() => {
        let classes = [
            { type_id: '推荐榜', type_name: '推荐榜' },
            { type_id: '新剧', type_name: '新剧' },
            { type_id: '逆袭', type_name: '逆袭' },
            { type_id: '霸总', type_name: '霸总' },
            { type_id: '现代言情', type_name: '现代言情' },
            { type_id: '打脸虐渣', type_name: '打脸虐渣' },
            { type_id: '豪门恩怨', type_name: '豪门恩怨' },
            { type_id: '神豪', type_name: '神豪' },
            { type_id: '马甲', type_name: '马甲' },
            { type_id: '都市日常', type_name: '都市日常' },
            { type_id: '战神归来', type_name: '战神归来' },
            { type_id: '小人物', type_name: '小人物' },
            { type_id: '女性成长', type_name: '女性成长' },
            { type_id: '大女主', type_name: '大女主' },
            { type_id: '穿越', type_name: '穿越' },
            { type_id: '都市修仙', type_name: '都市修仙' },
            { type_id: '强者回归', type_name: '强者回归' },
            { type_id: '亲情', type_name: '亲情' },
            { type_id: '古装', type_name: '古装' },
            { type_id: '重生', type_name: '重生' },
            { type_id: '闪婚', type_name: '闪婚' },
            { type_id: '赘婿逆袭', type_name: '赘婿逆袭' },
            { type_id: '虐恋', type_name: '虐恋' },
            { type_id: '追妻', type_name: '追妻' },
            { type_id: '天下无敌', type_name: '天下无敌' },
            { type_id: '家庭伦理', type_name: '家庭伦理' },
            { type_id: '萌宝', type_name: '萌宝' },
            { type_id: '古风权谋', type_name: '古风权谋' },
            { type_id: '职场', type_name: '职场' },
            { type_id: '奇幻脑洞', type_name: '奇幻脑洞' },
            { type_id: '异能', type_name: '异能' },
            { type_id: '无敌神医', type_name: '无敌神医' },
            { type_id: '古风言情', type_name: '古风言情' },
            { type_id: '传承觉醒', type_name: '传承觉醒' },
            { type_id: '现言甜宠', type_name: '现言甜宠' },
            { type_id: '奇幻爱情', type_name: '奇幻爱情' },
            { type_id: '乡村', type_name: '乡村' },
            { type_id: '历史古代', type_name: '历史古代' },
            { type_id: '王妃', type_name: '王妃' },
            { type_id: '高手下山', type_name: '高手下山' },
            { type_id: '娱乐圈', type_name: '娱乐圈' },
            { type_id: '强强联合', type_name: '强强联合' },
            { type_id: '破镜重圆', type_name: '破镜重圆' },
            { type_id: '暗恋成真', type_name: '暗恋成真' },
            { type_id: '民国', type_name: '民国' },
            { type_id: '欢喜冤家', type_name: '欢喜冤家' },
            { type_id: '系统', type_name: '系统' },
            { type_id: '真假千金', type_name: '真假千金' },
            { type_id: '龙王', type_name: '龙王' },
            { type_id: '校园', type_name: '校园' },
            { type_id: '穿书', type_name: '穿书' },
            { type_id: '女帝', type_name: '女帝' },
            { type_id: '团宠', type_name: '团宠' },
            { type_id: '年代爱情', type_name: '年代爱情' },
            { type_id: '玄幻仙侠', type_name: '玄幻仙侠' },
            { type_id: '青梅竹马', type_name: '青梅竹马' },
            { type_id: '悬疑推理', type_name: '悬疑推理' },
            { type_id: '皇后', type_name: '皇后' },
            { type_id: '替身', type_name: '替身' },
            { type_id: '大叔', type_name: '大叔' },
            { type_id: '喜剧', type_name: '喜剧' },
            { type_id: '剧情', type_name: '剧情' }
        ];
        input = classes;
    }),
    play_parse: true,
    double: true,
    推荐: $js.toString(() => {
        let html = request('https://api.xingzhige.com/API/playlet/?keyword=推荐榜');
        let data = JSON.parse(html).data;
        VODS = data.map(item => ({
            vod_id: 'https://api.cenguigui.cn/api/duanju/api.php?book_id=' + item.book_id,
            vod_name: item.title,
            vod_pic: item.cover,
            vod_remarks: item.type
        }));
    }),
    一级: $js.toString(() => {
        let html = request(input);
        let data = JSON.parse(html).data;
        VODS = data.map(item => ({
            vod_id: 'https://api.cenguigui.cn/api/duanju/api.php?book_id=' + item.book_id,
            vod_name: item.title,
            vod_pic: item.cover,
            vod_remarks: item.type
        }));
    }),
    二级: $js.toString(() => {
        let html = request(input);
        let data = JSON.parse(html);
        let vod_name = data.title || '';
        let vod_pic = data.cover || '';
        let vod_remarks = data.duration || '';
        let vod_actor = data.author || '';
        let vod_content = data.desc ? data.desc : '';
        let vod_play_from = '默认线路';
        let vod_play_url = '';
        
        if (data.data && data.data.length > 0) {
            vod_play_url = data.data.map((item, index) => 
                '第' + (index + 1) + '集$' + 'https://api.cenguigui.cn/api/duanju/api.php?video_id=' + item.video_id + '&quality=1080p'
            ).join('#');
        }
        
        VOD = {
            vod_name: vod_name,
            vod_pic: vod_pic,
            vod_remarks: vod_remarks,
            vod_actor: vod_actor,
            vod_content: vod_content,
            vod_play_from: vod_play_from,
            vod_play_url: vod_play_url
        };
    }),
    搜索: $js.toString(() => {
        let html = request(input);
        let data = JSON.parse(html).data;
        VODS = data.map(item => ({
            vod_id: 'https://api.cenguigui.cn/api/duanju/api.php?book_id=' + item.book_id,
            vod_name: item.title,
            vod_pic: item.cover,
            vod_remarks: item.type
        }));
    }),
    lazy: $js.toString(() => {
        let html = request(input);
        let data = JSON.parse(html);
        if (data && data.code === 200 && data.data && data.data.url) {
            input = data.data.url;
        } else {
            input = input;
        }
    })
}