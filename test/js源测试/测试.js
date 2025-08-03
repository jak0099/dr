var rule = {
    类型: '影视',
    title: '奇猫短剧',
    host: 'https://api-store.qmplaylet.com',
    url: '/api/v1/playlet/index?tag_id=fyclass&playlet_privacy=1&operation=1',
    searchUrl: '',
    searchable: 0,
    quickSearch: 0,
    filterable: 1,
    headers: {
        'User-Agent': 'MOBILE_UA',
        'app-version': '10001',
        'platform': 'android',
        'reg': '0',
        'AUTHORIZATION': '',
        'application-id': 'com.****.reader',
        'net-env': '1',
        'channel': 'unknown'
    },
    class_name: '推荐&新剧&都市情感&虐恋&逆袭&复仇&豪门总裁&都市&甜宠&家庭&古装&女性成长&重生&穿越&萌宝&打脸虐渣&真假千金&赘婿&强者回归&闪婚&战神&玄幻仙侠&小人物&追妻火葬场&职场&搞笑&神医&乡村&马甲&娱乐明星&商战&悬疑&奇幻&神豪&权谋&高手下山&异能&年代&欢喜冤家&伦理&青春校园&民国&宅斗&系统&穿书&替身&社会话题&团宠&宫斗&婚姻&武侠&银发&女强&种田经商&致富&女帝&先婚后爱&科幻&灵异&脑洞&偷听心声&兵王&破镜重圆&女总裁&暗恋&末世&金手指&现代言情&修仙&扮猪吃虎&替嫁&古代言情&正能量&鉴宝&古代&契约婚姻&王妃&婚恋&皇后&二次元&玄学&大女主&青梅竹马&双重生&带球跑&历史&校园&玄幻&皇帝&直播&读心术',
    class_url: '0&-1&1273&16&400&795&624&571&21&670&1272&1294&784&373&356&716&812&36&402&480&527&1286&1296&715&724&793&1269&590&558&1295&723&27&570&37&790&1299&727&572&464&1293&1288&573&342&787&338&712&1290&545&343&718&371&1297&708&1291&492&617&524&594&1287&526&1258&28&467&89&719&556&726&776&671&799&476&777&1298&47&576&355&107&1246&106&1289&900&972&465&828&722&583&575&566&62&419&814',
    play_parse: true,
    double: true,

    推荐: $js.toString(() => {
        let params = {
            tag_id: 0,
            playlet_privacy: 1,
            operation: 1
        };
        params.sign = getSignStr(params);
        let html = request(rule.host + '/api/v1/playlet/index?' + new URLSearchParams(params).toString(), {
            headers: rule.headers
        });
        let data = JSON.parse(html).data;
        VODS = data.list.map(item => ({
            vod_id: item.playlet_id,
            vod_name: item.title,
            vod_pic: item.image_link,
            vod_remarks: item.hot_value + (item.is_over === '1' ? ' 已完结' : '')
        }));
    }),

    一级: $js.toString(() => {
        let tag_id = input.split('?')[1].split('&').find(p => p.startsWith('tag_id')).split('=')[1];
        let params = {
            tag_id: tag_id,
            playlet_privacy: 1,
            operation: 1
        };
        params.sign = getSignStr(params);
        let html = request(rule.host + '/api/v1/playlet/index?' + new URLSearchParams(params).toString(), {
            headers: rule.headers
        });
        let data = JSON.parse(html).data;
        VODS = data.list.map(item => ({
            vod_id: item.playlet_id,
            vod_name: item.title,
            vod_pic: item.image_link,
            vod_remarks: item.hot_value + (item.is_over === '1' ? ' 已完结' : '')
        }));
    }),

    二级: $js.toString(() => {
        let playlet_id = input.split('?')[1].split('&').find(p => p.startsWith('playlet_id')).split('=')[1];
        let params = {
            playlet_id: playlet_id
        };
        params.sign = getSignStr(params);
        // 使用完整URL覆盖host限制
        let html = request('https://api-read.qmplaylet.com/player/api/v1/playlet/info?' + new URLSearchParams(params).toString(), {
            headers: rule.headers
        });
        let data = JSON.parse(html).data;
        let playList = data.play_list.sort((a, b) => a.sort - b.sort)
            .map(item => `第${item.sort}集$${item.video_url}`)
            .join('#');
        
        VOD = {
            vod_id: playlet_id,
            vod_name: data.title,
            vod_pic: data.image_link,
            vod_content: data.intro,
            vod_play_from: '奇猫短剧',
            vod_play_url: playList
        };
    }),

    lazy: $js.toString(() => {
        input = {
            parse: 0,
            url: input,
            js: ''
        };
    })
};

globalThis.getSignStr = function (params) {
    const sign_key = "d3dGiJc651gSQ8w1";
    let keys = Object.keys(params).sort();
    let sign_str = keys.reduce((pre, n) => pre + n + "=" + params[n], "") + sign_key;
    return md5(sign_str);
}

// 以下解密函数保留，但本规则中可能不需要
function novelContentDecrypt(data, iv) {
    let key = CryptoJS.enc.Hex.parse("32343263636238323330643730396531");
    iv = CryptoJS.enc.Hex.parse(iv);
    let HexStr = CryptoJS.enc.Hex.parse(data);
    let Base64Str = CryptoJS.enc.Base64.stringify(HexStr);
    let decrypted = CryptoJS.AES.decrypt(Base64Str, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

globalThis.decodeContent = function (response) {
    let txt = CryptoJS.enc.Base64.parse(response).toString();
    let iv = txt.slice(0, 32);
    let _content = novelContentDecrypt(txt.slice(32), iv).trim();
    return _content;
}