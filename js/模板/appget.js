var rule = {
    encrypt: function(data) {
        const key = CryptoJS.enc.Utf8.parse(rule.key);
        const iv = CryptoJS.enc.Utf8.parse(rule.iv);
        const encrypted = CryptoJS.AES.encrypt(data, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    },
    
    decrypt: function(data) {
        const text = CryptoJS.enc.Base64.parse(data);
        return CryptoJS.AES.decrypt({
            ciphertext: text
        }, rule.key, {
            iv: rule.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
    },
    
    author: 'wow',
    title: 'Appget[模板]',
    类型: '影视',
    host: '',
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    编码: 'utf-8',
    timeout: 5000,
    play_parse: true,
    double: false,
    limit: 20,
    searchable: 1,
    quickSearch: 0,
    filterable: 1,

    hostJs: `HOST = rule.params.split('$')[0]`,

    预处理: $js.toString(() => {
        try {
            rule.params = ungzip(rule.params);
        } catch (e) {
            console.log(`ungzip解密失败: ${e.message}`);
        }
        
        let paramStr = rule.params;
        let _url = paramStr.split('$')[0];
        let html = fetch(_url);
        let jsonData = JSON.parse(html).Appget;
        rule.params = jsonData[decodeURIComponent(paramStr.split('$')[1])];
        console.log(`传入参数:${JSON.stringify(rule.params)}`);
        
        rule.muban = rule.params.muban;
        rule.key = CryptoJS.enc.Utf8.parse(rule.params.key);
        rule.iv = CryptoJS.enc.Utf8.parse(rule.params.iv);
        rule.username = rule.params.username || '';
        rule.password = rule.params.password || '';
        rule.lazyheader = rule.params.lazyheader || {};
        rule.verify = rule.params.verify === 'true';
        
        if (rule.params.host) {
            HOST = rule.params.host;
        } else {
            let hosturl = rule.params.hosturl;
            let hostdata = fetch(hosturl);
            HOST = hostdata.split('\n')[0].replace(/[\s\r]+/g, '');
        }
        
        if (HOST.endsWith('/')) {
            HOST = HOST.slice(0, -1);
        }
        
        // 登录处理
        if (rule.username && rule.password) {
            try {
                let loginUrl = `${HOST}/${rule.API[rule.muban].appLogin}`;
                let loginBody = `password=${rule.password}&code=&device_id=&user_name=${rule.username}&invite_code=&key=&is_emulator=0`;
                let loginData = fetch(loginUrl, {
                    headers: rule.headers,
                    method: 'POST',
                    body: loginBody
                });
                
                let userInfo = JSON.parse(rule.decrypt(JSON.parse(loginData).data)).user;
                rule.headers['app-user-token'] = userInfo.auth_token;
                console.log('token已更新：' + userInfo.auth_token);
            } catch (e) {
                console.log('登录失败：' + e.message);
            }
        }
    }),

    API: {
        "AppGet": {
            "appLogin": "api.php/getappapi.index/appLogin",
            "initV": "api.php/getappapi.index/initV119",
            "typeFilterVodList": "api.php/getappapi.index/typeFilterVodList",
            "vodDetail": "api.php/getappapi.index/vodDetail",
            "searchList": "api.php/getappapi.index/searchList",
            "vodParse": "api.php/getappapi.index/vodParse",
            "mineInfo": "api.php/getappapi.index/mineInfo",
            "verify": "api.php/getappapi.verify/create?key="
        },
        "AppQiji": {
            "appLogin": "api.php/qijiappapi.index/appLogin",
            "initV": "api.php/qijiappapi.index/initV120",
            "typeFilterVodList": "api.php/qijiappapi.index/typeFilterVodList",
            "vodDetail": "api.php/qijiappapi.index/vodDetail2",
            "searchList": "api.php/qijiappapi.index/searchList",
            "vodParse": "api.php/qijiappapi.index/vodParse",
            "mineInfo": "api.php/qijiappapi.index/mineInfo",
            "verify": "api.php/qijiappapi.verify/create?key="
        }
    },

    class_parse: $js.toString(() => {
        let classes = [];
        let filterObj = {};
        
        let data = fetch(`${HOST}/${rule.API[rule.muban].initV}`, {
            method: 'POST'
        });
        let type_list = JSON.parse(rule.decrypt(JSON.parse(data).data)).type_list;
        
        type_list.forEach(item => {
            if (item.type_id != 0) {
                filterObj[item.type_id] = [];
                classes.push({
                    type_name: item.type_name,
                    type_id: item.type_id
                });
                
                item.filter_type_list.forEach((it, i) => {
                    let value = it.list.map(it1 => {
                        return {
                            n: it1,
                            v: it1
                        }
                    });
                    filterObj[item.type_id][i] = {
                        key: it.name,
                        name: it.name,
                        value: value
                    }
                })
            }
        });
        
        rule.classes = classes;
        rule.filter = filterObj;
    }),

    推荐: $js.toString(() => {
        let data = fetch(`${HOST}/${rule.API[rule.muban].initV}`, {
            method: 'POST'
        });
        let json = JSON.parse(rule.decrypt(JSON.parse(data).data));
        VODS = json.recommend_list;
    }),

    一级: $js.toString(() => {
        let area = MY_FL.area || '全部';
        let year = MY_FL.year || '全部';
        let sort = MY_FL.sort || '最新';
        let lang = MY_FL.lang || '全部';
        let vod_class = MY_FL.class || '全部';
        
        let body = `area=${area}&year=${year}&type_id=${MY_CATE}&page=${MY_PAGE}&sort=${sort}&lang=${lang}&class=${vod_class}`;
        
        let data = fetch(`${HOST}/${rule.API[rule.muban].typeFilterVodList}`, {
            headers: rule.headers,
            method: 'POST',
            body: body
        });
        
        let list = JSON.parse(rule.decrypt(JSON.parse(data).data)).recommend_list;
        VODS = list;
    }),

    二级: $js.toString(() => {
        // VIP会员处理
        if (!rule.会员时长 && rule.params['会员时长']) {
            eval('rule.会员时长 = ' + ungzip(rule.params['会员时长']));
            console.log(`传入会员时长函数:${rule.会员时长}`);
        }
        
        if (rule.username && rule.password) {
            // 获取用户信息
            let mineInfo = fetch(`${HOST}/${rule.API[rule.muban].mineInfo}`, {
                headers: rule.headers
            });
            mineInfo = JSON.parse(rule.decrypt(JSON.parse(mineInfo).data));
            
            if (!mineInfo.user) {
                // 重新登录
                fetch(`${HOST}/${rule.API[rule.muban].appLogin}`, {
                    headers: rule.headers,
                    method: 'POST',
                    body: `password=${rule.password}&code=&device_id=&user_name=${rule.username}&invite_code=&key=&is_emulator=0`
                });
                // 重新获取用户信息
                mineInfo = fetch(`${HOST}/${rule.API[rule.muban].mineInfo}`, {
                    headers: rule.headers
                });
                mineInfo = JSON.parse(rule.decrypt(JSON.parse(mineInfo).data));
            }
            
            if (mineInfo.user.is_vip) {
                let user_end_time = new Date(mineInfo.user.user_end_time * 1000).toLocaleString();
                console.log('会员到期时间:' + user_end_time);
            } else {
                if (rule.会员时长) {
                    rule.会员时长(mineInfo);
                    // 重新获取token
                    fetch(`${HOST}/${rule.API[rule.muban].appLogin}`, {
                        headers: rule.headers,
                        method: 'POST',
                        body: `password=${rule.password}&code=&device_id=&user_name=${rule.username}&invite_code=&key=&is_emulator=0`
                    });
                }
            }
        }
        
        // 获取详情
        let data = fetch(`${HOST}/${rule.API[rule.muban].vodDetail}`, {
            headers: rule.headers,
            method: 'POST',
            body: `vod_id=${input}`
        });
        
        let json = JSON.parse(rule.decrypt(JSON.parse(data).data));
        let vod = json.vod;
        
        try {
            let playform = [];
            let playurls = [];
            let playlist = json.vod_play_list;
            
            playlist.forEach(item => {
                playform.push(item.player_info.show);
                playurls.push(item.urls.map((it, i) => {
                    return `${it.name}$${JSON.stringify(it)}`;
                }).join("#"));
            });
            
            vod.vod_play_from = playform.join("$$$");
            vod.vod_play_url = playurls.join("$$$");
        } catch (e) {
            vod.vod_play_from = '暂无资源';
            vod.vod_play_url = '暂无资源$0';
        }
        
        VOD = vod;
    }),

    搜索: $js.toString(() => {
        let body = `keywords=${KEY}&type_id=0&page=${MY_PAGE}`;
        
        if (rule.verify) {
            VODS = rule.verifySearch(body);
        } else {
            let data = fetch(`${HOST}/${rule.API[rule.muban].searchList}`, {
                headers: rule.headers,
                method: 'POST',
                body: body
            });
            
            let json = JSON.parse(data);
            if (json.code == 0) {
                console.log(json.msg);
            }
            
            VODS = JSON.parse(rule.decrypt(json.data)).search_list;
        }
    }),
    
    verifySearch: function(body, maxAttempts = 3) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const key = this.generateUUID();
                const baseImg = fetch(`${HOST}/${rule.API[rule.muban].verify}${key}`, {
                    buffer: 2
                });
                
                const resp = fetch(OCR_API, {
                    method: 'POST',
                    headers: {"Content-Type": "text/plain;charset=UTF-8"},
                    body: baseImg
                });
                
                let newBody = `${body}&code=${resp}&key=${key}`;
                let data = fetch(`${HOST}/${rule.API[rule.muban].searchList}`, {
                    headers: rule.headers,
                    method: 'POST',
                    body: newBody
                });
                
                let json = JSON.parse(data);
                if (json.code !== 1) {
                    console.log(`验证失败（${attempt}/${maxAttempts}）: ${json.msg}`);
                    continue;
                }
                
                console.log(`验证成功（${attempt}/${maxAttempts}）: ${json.msg}`);
                return JSON.parse(rule.decrypt(json.data)).search_list;
            } catch (error) {
                console.log(`请求异常（${attempt}/${maxAttempts}）: ${error.message}`);
            }
        }
        return [];
    },
    
    generateUUID: function() {
        const randomBytes = CryptoJS.lib.WordArray.random(16);
        const hexString = randomBytes.toString(CryptoJS.enc.Hex);
        return (
            hexString.substr(0, 8) + "-" +
            hexString.substr(8, 4) + "-" +
            "4" + hexString.substr(12, 3) + "-" +
            (parseInt(hexString.substr(16, 1), 16) & 0x3 | 0x8).toString(16) +
            hexString.substr(17, 3) + "-" +
            hexString.substr(20, 12)
        );
    },

    lazy: $js.toString(() => {
        function isofficial(url) {
            let flag = new RegExp('qq\.com|iqiyi\.com|youku\.com|mgtv\.com|bilibili\.com|sohu\.com|ixigua\.com|pptv\.com|miguvideo\.com|le\.com|1905\.com|fun\.tv');
            return flag.test(url) && !/url=/.test(url);
        }
        
        let json = JSON.parse(input);
        let url = json.url;
        let headers = Object.assign({}, rule.lazyheader, {
            'User-Agent': MOBILE_UA,
            'Referer': HOST
        });
        let parse_api_url = json.parse_api_url;
        
        if (/url=/.test(parse_api_url) && parse_api_url.startsWith('http')) {
            try {
                let parsedata = fetch(parse_api_url, {
                    headers: headers,
                    timeout: 10000
                });
                
                if (parsedata) {
                    try {
                        parsedata = JSON.parse(parsedata);
                        if (parsedata.url) {
                            let parseurl = parsedata.url;
                            if (!/m3u8|mp4|mkv/.test(parseurl)) {
                                parseurl = parseurl + '&type=m3u8';
                            }
                            input = {
                                parse: 0,
                                url: parseurl,
                                header: headers
                            };
                            return;
                        } else {
                            console.log(parsedata.msg + '尝试播放(嗅探)原链接');
                        }
                    } catch (e) {
                        input = {
                            parse: 1,
                            url: parse_api_url
                        };
                        return;
                    }
                } else {
                    console.log('解析失效，尝试播放(嗅探)原链接');
                }
            } catch (e) {
                console.log('解析失败：' + e.message);
            }
        } else {
            parse_api_url = parse_api_url.replace(url, "");
            let token = json.token;
            try {
                let data = fetch(`${HOST}/${rule.API[rule.muban].vodParse}`, {
                    headers: rule.headers,
                    method: 'POST',
                    timeout: 10000,
                    body: `parse_api=${parse_api_url}&url=${encodeURIComponent(rule.encrypt(url))}&token=${token}`
                });
                
                let parsejson = JSON.parse(JSON.parse(rule.decrypt(JSON.parse(data).data)).json;
                let play = parsejson.url;
                
                if (play) {
                    if (!/m3u8|mp4|mkv/.test(play)) {
                        play = play + '&type=m3u8';
                    }
                    input = {
                        parse: 0,
                        url: play,
                        header: headers
                    };
                    return;
                } else {
                    console.log(parsejson.msg + '，尝试嗅探播放');
                }
            } catch (e) {
                console.log(e.message + '，尝试嗅探播放');
            }
        }
        
        if (/m3u8|mp4|mkv/.test(url)) {
            input = {
                parse: 0,
                url: url,
                header: headers
            };
            return;
        }
        
        input = {
            parse: 1,
            jx: isofficial(url) ? 1 : 0,
            url: url
        };
    }),

    filter: {}
}