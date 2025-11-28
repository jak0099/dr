globalThis.kheaders = {
    'User-Agent': 'com.stub.StubApp/1.5.7 (Linux;Android 13) ExoPlayerLib/2.14.2',
    'version': 'XPGBOX com.phoenix.tv1.5.7',
    'hash': 'a83d',
    'timestamp': '1743935777',
    'token2': 'aTpRnDenrzgvf3JQSjSiW9dTO/X+yVZsq8w9x1f4J+0+OF9nrQNR281G0N8=',
    'token': 'UVEytHCuvR4MRnBcRiS+BIYjPvjnzytSh8xdoXvrdYNmOHRjiEhVovlfi99EUFS+BiIyBffFa4MPMJkOZQJqe/ApC3U9wm2iCmpyQttbMRt/4CFAMGUytgPniSLrL3ddk4UxFz5zSbfs7EEbUDY08LKYMmtD/GCQrSjzML2JMx/eYUp5TV5xU0sgLbB5XKw='
};
var rule = {
    author: '小可乐/2503/第二版',
    title: '小苹果',
    类型: '影视',
    host: 'http://item.xpgcom.com', //http://c.xpgtv.net  http://item.xpgtv.xyz
    hostJs: '',
    headers: {
        'User-Agent': MOBILE_UA
    },
    编码: 'utf-8',
    timeout: 5000,

    homeUrl: '/api.php/v2.main/androidhome',
    url: '/api.php/v2.vod/androidfilter10086?page=fypage&type=fyclass&fyfilter',
    filter_url: '{{fl.area}}&{{fl.year}}&{{fl.by}}&{{fl.class}}',
    searchUrl: '/api.php/v2.vod/androidsearch10086?page=1&wd=**',
    detailUrl: '/api.php/v3.vod/androiddetail2?vod_id=fyid',

    limit: 9,
    double: false,
    class_name: '电影&剧集&综艺&动漫',
    class_url: '1&2&3&4',

    推荐: $js.toString(() => {
        let kjson = JSON.parse(fetch(input));
        VODS = [];
        let klists = kjson.data.list;
        klists.forEach((item) => {
            item.list.forEach((it) => {
                VODS.push({
                    vod_name: it.name,
                    vod_pic: it.pic,
                    vod_remarks: it.updateInfo + '|' + it.className,
                    vod_id: it.id,
                    vod_content: it.content
                })
            })
        })
    }),
    一级: $js.toString(() => {
        input = input.replace(/&{2,}/g, "&");
        let kjson = JSON.parse(fetch(input));
        VODS = [];
        let klists = kjson.data;
        klists.forEach((it) => {
            VODS.push({
                vod_name: it.name,
                vod_pic: it.pic,
                vod_remarks: it.updateInfo + '|' + it.className,
                vod_id: it.id,
                vod_content: it.content
            })
        })
    }),
    搜索: '*',
    二级: $js.toString(() => {
        let kdata = JSON.parse(fetch(input)).data;
        let kurl = kdata.urls.map((it) => {
            return `${it.key}$http://c.xpgtv.net/m3u8/${it.url}.m3u8`
        }).join('#');
        VOD = {
            vod_id: input,
            vod_name: kdata.name,
            vod_pic: kdata.pic,
            type_name: kdata.className,
            vod_remarks: kdata.updateInfo,
            vod_year: kdata.year,
            vod_area: kdata.area,
            vod_director: kdata.director,
            vod_actor: kdata.actor,
            vod_content: kdata.content,
            vod_play_from: '👶小苹果专线',
            vod_play_url: kurl
        }
    }),

    play_parse: true,
    lazy: $js.toString(() => {
        let kurl = getProxyUrl() + '&url=' + input;
        input = {
            parse: 0,
            url: kurl,
            header: kheaders
        }
    }),
    proxy_rule: $js.toString(() => {
        let data = fetch(input.url, {
            headers: kheaders
        });
        let m3u8 = data.replace('URI="', `URI="${HOST}`);
        input = [200, 'application/vnd.apple.mpegurl', m3u8]
    }),

    filter: 'H4sIAAAAAAAAA+2X304aQRTG73mMvfZiFq1aE57EeIGWpKZWG8EmxJCACAI1/DEKpVKpUQOoKP6totSXYXbhLboww9k5By+48Mrs5fzO59kz37jzsesuTddmZl3r2hdfUJvRFpa8fr82pi17v/qsJU9WjGjMWn/3Lq1ZYHZdW+7hWLUbrfawtdBCY5Kmqu1WyUxuyUK/l8emoMuXrL5DOqADnZm4sh5OdTYFXSXHH5+GdEAHOiOSNcJ5qrMp9Etdmq3ToX5AoV/iZ7uZHOoHVPHFeD57xRdJQdc3e0gHFOZrnvLW3tB8QENzoTE4UO+qz6ucZ6nBt5ujnudxpVuMS9rr45EEDHi45JmGKpAEBIWTbrmGBIKA4Lxi/ksjgSAguPvLj/NIIAjaZNDnXbU3aRTuu4XbETfpZu4PkvW6ePprpThBihNqcZwUx9WimxTdalEnRV0tMlJkSlH/iIvWWilOk+K0WpwixSm1OEmKk2qROKSrDunEIV11SCcO6apDOnFIVx3SiUO66pBOHNJVhxhxiKkOMeIQUx1ixCGmOsSIQ0x1iBGHmOoQIw4x1SFGHGKqQ4w4xFSHGHGIqQ4x4hCzHTL2b41CTS1Lgl6p+aDyQqV3eDMz9ELZ75m18K+sBuaDnrVvn7wBX2DR+rvB89rNptHYxbLPiwE/CDqXmzwRxwL/wsqqrzeRa27MpbnfLKIyx52jGL5fBQLFxT1v1rFCIFCk4zxzjRUCgcPRmLFZxqkgECg2zs18DisEgku+lbN2hm94gWCOyD2PZvAcAkGPpwyPPeAeAsHZPB4av/EcEql7KV4O7cVCMMde3Mo8PIdAdo+UsfGL9Ogj+BeohuUhgkIiHMqvJLI9x8mWFfh4DoHgKS9ZK3XxUwSCHvGdbrGGewg0UHTLN+3HLFJI5MSuE7tO7Dqx+35id/ytYtcsla1xzEoY399AYaTNK545ojqbwiUcTlKRROB28Vf7mUSOQCNc5CPHeOfipdNI4GEFgh717U7iAPcQCLw5OzBSxBiBoEf2wDwnPxYEciLHiRwncpzIeT+RM/FmkROtdw7JtSoQXHqNHD+5wb/1BYKIqO/SLwqJ4CmJOL2aJRr9i8KI/DATV/h6FwgUfw75Pv4mlQgU10/GJg4iiWDSyB1/3sCTCgQ9Sk36HSeRPcezkS+QOfoIDjjcsm95GYgCQY901czGcQ+BYNLaS+c+hScVyIk7J+6cuHPi7p3EnSv0H0MElMd+GwAA'
}