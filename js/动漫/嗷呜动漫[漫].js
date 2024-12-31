var rule = {
     title: '嗷呜动漫[漫]',
     host: 'https://www.aowu.tv',
     homeUrl: '/map.html',
     模板:'短视2',
     searchUrl: '/search/**----------fypage---.html',
     url:'/index.php/api/vod#type=fyclass&page=fypage',
     detailUrl:'/play/fyid-1-1.html',
     searchable: 2,//是否启用全局搜索,
     quickSearch: 1,//是否启用快速搜索,
     filterable: 0,//是否启用分类筛选,
     headers: {
       'Cookie': 'ecPopup=1; mac_history=%7Blog%3A%5B%7B%22name%22%3A%22%5B%E7%95%AA%E5%89%A7%5D%E6%80%AA%E5%85%BD8%E5%8F%B7%22%2C%22link%22%3A%22https%3A%2F%2Fwww.aowu.tv%2Fplay%2FUOQCCS-1-1.html%22%2C%22pic%22%3A%22https%3A%2F%2Fp.upyun.com%2Fdemo%2Ftmp%2Fb6xYhncn.webp%22%2C%22mid%22%3A%2201%22%7D%2C%7B%22name%22%3A%22%5B%E7%95%AA%E5%89%A7%5DAIKa%20R-16%3A%E5%A4%84%E5%A5%B3%E4%BB%BB%E5%8A%A1%22%2C%22link%22%3A%22https%3A%2F%2Fwww.aowu.tv%2Fplay%2F1mQCCS-1-1.html%22%2C%22pic%22%3A%22https%3A%2F%2Fp.upyun.com%2Fdemo%2Ftmp%2FgUplVsGU.webp%22%2C%22mid%22%3A%2201%22%7D%2C%7B%22name%22%3A%22%5B%E7%95%AA%E5%89%A7%5D%E5%85%AD%E9%81%93%E7%9A%84%E6%81%B6%E5%A5%B3%E4%BB%AC%22%2C%22link%22%3A%22https%3A%2F%2Fwww.aowu.tv%2Fplay%2FRLQCCS-1-1.html%22%2C%22pic%22%3A%22https%3A%2F%2Fp.upyun.com%2Fdemo%2Ftmp%2FCKeOjkAg.webp%22%2C%22mid%22%3A%2201%E8%AF%9D%22%7D%2C%7B%22name%22%3A%22%5B%E6%96%B0%E7%95%AA%5D%E6%81%8B%E8%AF%AD%E8%BD%BB%E5%94%B1%22%2C%22link%22%3A%22https%3A%2F%2Fwww.aowu.tv%2Fplay%2FVOQCCS-1-1.html%22%2C%22pic%22%3A%22https%3A%2F%2Fp.upyun.com%2Fdemo%2Ftmp%2FW8f8NHOz.webp%22%2C%22mid%22%3A%2201%22%7D%5D%7D; DS_Records=%7Blog%3A%5B%7B%22name%22%3A%22%E4%BD%A0%E5%A5%BD%22%2C%22url%22%3A%22%2Fsearch%2F-------------.html%22%7D%5D%7D; PHPSESSID=co9sgj92dqmmvofj6ch359o8po; user_id=112305; user_name=yuanzl; group_id=2; group_name=Moefun%E6%99%AE%E9%80%9A%E5%B9%B2%E5%91%98; user_check=bcd306f12da447a856ad42ba1cc2f800; user_portrait=%2Fstatic%2Fimages%2Ftouxiang.png',
       'User-Agent': 'MOBILE_UA',
     },
     play_parse: true,
     lazy:`js:
        var html = JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);
        var url = html.url;
        var from = html.from;
        if (html.encrypt == '1') {
            url = unescape(url)
        } else if (html.encrypt == '2') {
            url = unescape(base64Decode(url))
        }
        if (/m3u8|mp4/.test(url)) {
            input = url
        } else {
        }
    `,
     limit: 6,
     tab_rename:{'排序':'LR',},
     class_name:'新番&番剧&剧场版',
     class_url:'32&20&33',
     double: false, // 推荐内容是否双层定位
     推荐: '.public-list-exp;a&&title;img&&data-src;.ft2&&Text;a&&href',
     一级:`js:
        let body = input.split("#")[1];
        let t = Math.round(new Date / 1e3).toString();
        let key = md5("DS" + t + "DCC147D11943AF75");
        let url = input.split("#")[0];
        body = body + "&time=" + t + "&key=" + key;
        print(body);
        fetch_params.body = body;
        let html = post(url, fetch_params);
        let data = JSON.parse(html);
        VODS = data.list.map(function(it) {
            it.vod_pic = it.vod_pic.replace(/mac/, "https");
            return it
        });
     `,
     二级:{
           "title":".slide-info-title&&Text;#qiAnDao_1&&Text",
           "img":".detail-pic&&data-original",
           "desc":".this-text&&Text;.this-text a:eq(0)&&Text",
           "content":".player-content&&Text",
           "tabs":"#zxdaoxu",
           "lists":".anthology-list-play:eq(#id) li"
          },
     搜索: '.public-list-box;.thumb-txt&&Text;.public-list-exp&&img&&data-src;.public-list-prb&&Text;a&&href'
    }
