var rule = {
    author: '小可乐/2503/第二版',
    title: '金牌影院',
    类型: '影视',
    host: 'https://www.jiabaide.cn',
    hostJs: '',
    headers: {
        'User-Agent': 'PC_UA'
    },
    编码: 'utf-8',
    timeout: 5000,

    homeUrl: '/',
    url: '/vod/show/id/fyfilter/page/fypage',
    filter_url: '{{fl.cateId}}{{fl.class}}{{fl.area}}{{fl.year}}{{fl.lang}}',
    searchUrl: '/vod/search/**',
    detailUrl: '/detail/fyid',

    limit: 9,
    double: false,
    class_name: '电影&剧集&综艺&动漫',
    class_url: '1&2&3&4',
    filter_def: {
        1: {
            cateId: '1'
        },
        2: {
            cateId: '2'
        },
        3: {
            cateId: '3'
        },
        4: {
            cateId: '4'
        }
    },

    推荐: $js.toString(() => {
        let kdata = fetch(input).split('data\\\":')[3].split(',\\\"newestShort')[0] + '}';
        kdata = kdata.replace(/\\/g, '');
        let kjson = JSON.parse(kdata);
        VODS = [];
        Object.keys(kjson).forEach((key) => {
            kjson[key].list.map((it) => {
                VODS.push({
                    vod_name: it.vodName,
                    vod_pic: it.vodPic,
                    vod_remarks: it.vodRemarks + '_' + it.vodDoubanScore,
                    vod_id: it.vodId
                })
            })
        })
    }),
    一级: $js.toString(() => {
        let kdata = fetch(input).split('list\\\":')[1].split('}}}')[0].replace(/\\/g, '');
        let kjson = JSON.parse(kdata);
        VODS = [];
        kjson.forEach((it) => {
            VODS.push({
                vod_name: it.vodName,
                vod_pic: it.vodPic,
                vod_remarks: it.vodRemarks + '_' + it.vodDoubanScore,
                vod_id: it.vodId
            })
        })
    }),
    搜索: $js.toString(() => {
        let kdata = fetch(input).split('list\\\":')[2].split('}}}')[0].replace(/\\/g, '');
        let kjson = JSON.parse(kdata);
        VODS = [];
        kjson.forEach((it) => {
            VODS.push({
                vod_name: it.vodName,
                vod_pic: it.vodPic,
                vod_remarks: it.vodRemarks + '_' + it.vodDoubanScore,
                vod_id: it.vodId
            })
        })
    }),
    二级: $js.toString(() => {
        let kdata = fetch(input).split('data\\\":')[2].split('},\\\"likeData')[0].replace(/\\/g, '');
        let kjson = JSON.parse(kdata);
        let kid = kjson.vodId;
        let kurls = kjson.episodeList.map((it) => {
            return it.name + "$" + `${HOST}/vod/play/${kid}/sid/${it.nid}`
        }).join('#');
        VOD = {
            vod_id: kid,
            vod_name: kjson.vodName,
            vod_pic: kjson.vodPic,
            type_name: kjson.vodClass,
            vod_remarks: kjson.vodRemarks,
            vod_year: kjson.vodYear,
            vod_area: kjson.vodArea,
            vod_lang: kjson.vodLang,
            vod_director: kjson.vodDirector,
            vod_actor: kjson.vodActor,
            vod_content: '👶' + kjson.vodContent,
            vod_play_from: '金牌线路',
            vod_play_url: kurls
        }
    }),

    play_parse: true,
    lazy: $js.toString(() => {
        let kids = input.split('/');
        let t = new Date().getTime();
        let sign = CryptoJS.SHA1(CryptoJS.MD5(`clientType=1&id=${kids[5]}&nid=${kids[7]}&key=cb808529bae6b6be45ecfab29a4889bc&t=${t}`).toString()).toString();
        let kurl = `${HOST}/api/mw-movie/anonymous/v2/video/episode/url?clientType=1&id=${kids[5]}&nid=${kids[7]}`;
        let khtml = fetch(kurl, {
            headers: {
                'User-Agent': rule.headers,
                'Referer': HOST,
                't': t,
                'sign': sign
            }
        });
        kurl = JSON.parse(khtml).data.list[0].url;
        if (/\.(m3u8|mp4)/.test(kurl)) {
            input = {
                jx: 0,
                parse: 0,
                url: kurl
            }
        } else {
            input = {
                jx: 0,
                parse: 1,
                url: kurl
            }
        }
    }),

    filter: 'H4sIAAAAAAAAA+2Y204aURSG73mMuSaBGY76Bn0G48XEkl7UmkZtE2NsUARFW8Gm0WKxpvEAVhHQxuig+DLM6S26Ye/Zh7UnFYtJjeWGZP7/y9oz/8ystYf5gKIqo2OBeeV1ak4ZVSb02dSLl0pQmdLfpNCx3WyZ39fR8Xt98h0SxuaVKSSb2aqbqXZldKAqC0Eib5XNfMXOr3hOaHbubSqkaYxYq3ZuyzIRoYRd2TSvWxIRCTNitWllsnKNOCWspVN7a1MmEuw8Dlf8VklyRL7it0qEEdZi0UpvyQQ7D3utbt/+lIkYn4f9xedqWR5WZs1a2pGJKCNWv3aMvHy13Cq5z27pWK7B7py92HZ32nIeHFHMOWeGTLAzNbOXnZacRxQR4wtB+ojp0ymdPWBmuWF+NP78gNEVOlc189uteVBxSznihbrlQoIh0u5Rybqq+9DEALULDeu67VcbGzSN9gYSBY5I9K5sH1rlU4Egkke4e8ewBpFoop8apnEkEESiq1w0YA0iiXdFrIEl4a5M6lOv2F1x6jWnmu7zrqDVEO+t0C0UIpJHOOtNSBCJ5nl+AAkicWlBgkhc4pAgkn8W+Ex9sphL6dMsC2v70t3+1WcWWliLevW7ZUI9gXMj0I3wrgZdjXdV6Kq8G4ZumHPVEeAigXOT0E3ybgK6Cd6NQzfOuzHoxngXZqXyWakwK5XPSoVZqXxWKsxK5bNSYVYqn1V45AP6gYinoiclMB4MKNqgY1PjX6COUUEDx3Nw4+TCsE4r3fYiESxM1MpQi5KJOP96dNsLJOIaeD1kIim+HhOT+swM18F7g7LfXlE4cPazXrS9SiGiieNMRIgm7jNAFaxR5OzSNGoAwZo4nUWEaOJ2BVTBmriTAAjWxK0EQLBGkY2cWTgHCNbo6e7V2Gz1Thdrz2++Psb07GNGP4HpaZXO3PSOU98VBxdVn9oMRQFJBJaGU3Y4Ze+dsmR6RgadntxnR2962q0bJ294JhlcLH08Hv2gRJh/+NHr4Auxq8aj2BeSPoX8oOjjDVO7vNcxDLuSBkOByuy9v+hcF0WKaLS9LDfNwr5Ui8nDGfN3M2b4/fUfTwbS7aKDdrso6HZoD2rdnHgm6Swx0Mh8oThoZL5Q4hE3/Pdv1fE/fqCHYY0imZrzA7Y5rIn/cYGFsPaA3bxzV0QK6IFYe8j3yfKdfXIIFsLav2mj97e659LIhk1ouD0dcHsaWPgNc3RDmhYZAAA='
}