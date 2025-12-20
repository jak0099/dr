var rule = {
    title: '牛牛短剧',
    host: 'https://new.tianjinzhitongdaohe.com',
    homeUrl: '/api/v1/app/screen/screenType',
    searchUrl: '/api/v1/app/search/searchMovie',
    url: '/api/v1/app/screen/screenMovie?classify=fyclass&page=fypage',
    headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json;charset=UTF-8",
        "User-Agent": "okhttp/4.12.0"
    },
    timeout: 5000,
    filterable: 1,
    limit: 40,
    multi: 1,
    searchable: 2,
    play_parse: true,
    search_match: true,

    class_parse: async function () {
        const url = `${rule.host}/api/v1/app/screen/screenType`;
        try {
            const response = await request(url, {
                method: 'POST',
                headers: rule.headers
            });
            const data = JSON.parse(response);
            const classes = [];

            if (data.data && data.data[0]?.children?.[0]?.children) {
                data.data[0].children[0].children.forEach(vod => {
                    classes.push({
                        type_name: `${vod.name}`,
                        type_id: vod.name
                    });
                });
            }

            return {
                class: classes,
                filters: {}
            };
        } catch (e) {
            console.error("分类解析错误:", e);
            return {class: []};
        }
    },

    一级: async function () {
        const {input, MY_PAGE} = this;
        const cid = input.split('classify=')[1].split('&')[0];
        const page = MY_PAGE || 1;
        const payload = JSON.stringify({
            condition: {
                classify: cid,
                typeId: "S1"
            },
            pageNum: String(page),
            pageSize: rule.limit
        });

        try {
            const url = `${rule.host}/api/v1/app/screen/screenMovie`;
            const response = await request(url, {
                method: 'POST',
                headers: rule.headers,
                body: payload
            });
            const data = JSON.parse(response);
            const videos = [];
            if (data.data?.records) {
                data.data.records.forEach(vod => {
                    videos.push({
                        title: vod.name,
                        img: vod.cover,
                        desc: `${vod.totalEpisode}集`,
                        url: vod.id
                    });
                });
            }

            return setResult(videos);
        } catch (e) {
            console.error("一级列表错误:", e);
            return [];
        }
    },

    二级: async function () {
        const { orId } = this;
        let did = orId;
        let bofang = '';
        let xianlu = '';
        let content = '';

        try {
            // 获取剧集列表
            const detailPayload = JSON.stringify({
                id: did,
                source: 0,
                typeId: "S1",
                userId: "223664"
            });

            const detailUrl = `${rule.host}/api/v1/app/play/movieDetails`;
            const detailResponse = await request(detailUrl, {
                method: 'POST',
                headers: rule.headers,
                body: detailPayload
            });

            const detailData = JSON.parse(detailResponse).data || {};
            if (detailData.episodeList && detailData.episodeList.length > 0) {
                const episodes = detailData.episodeList.map(ep => {
                    return `${ep.episode}$${did}@${ep.id}`;
                });
                bofang = episodes.join('#');
                xianlu = '牛牛短句';
                content = detailData.introduce || '暂无剧情介绍';
            }

            return {
                vod_name: detailData.name || '未知名称',
                vod_pic: detailData.cover || '',
                vod_content: content,
                vod_play_from: xianlu || '暂无资源',
                vod_play_url: bofang || '暂无播放地址$0'
            };
        } catch (e) {
            console.error("详情解析错误:", e);
            return {
                vod_name: '加载失败',
                vod_pic: '',
                vod_content: '详情加载失败，请稍后重试',
                vod_play_from: '暂无资源',
                vod_play_url: '暂无播放地址$0'
            };
        }
    },

    搜索: async function () {
        const {KEY, MY_PAGE} = this;
        const page = MY_PAGE || 1;
        const payload = JSON.stringify({
            condition: {
                typeId: "S1",
                value: KEY
            },
            pageNum: String(page),
            pageSize: rule.limit
        });

        try {
            const url = `${rule.host}/api/v1/app/search/searchMovie`;
            const response = await request(url, {
                method: 'POST',
                headers: rule.headers,
                body: payload
            });
            const data = JSON.parse(response);
            const videos = [];

            if (data.data?.records) {
                data.data.records.forEach(vod => {
                    if (rule.search_match && !vod.name.includes(KEY)) return;

                    videos.push({
                        title: vod.name,
                        img: vod.cover,
                        desc: `更新时间${vod.year || '未知'}`,
                        url: vod.id
                    });
                });
            }
            return setResult(videos);
        } catch (e) {
            console.error("搜索错误:", e);
            return [];
        }
    },

    lazy: async function () {
        const {input} = this;
        const [videoId, episodeId] = input.split('@');
        const payload = JSON.stringify({
            episodeId,
            id: videoId,
            source: 0,
            typeId: "S1",
            userId: "223664"
        });

        try {
            const url = `${rule.host}/api/v1/app/play/movieDetails`;
            const response = await request(url, {
                method: 'POST',
                headers: rule.headers,
                body: payload
            });
            const data = JSON.parse(response);

            return {
                parse: 0,
                url: data.data?.url || '',
                header: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36'
                }
            };
        } catch (e) {
            console.error("播放地址获取错误:", e);
            return {
                parse: 0,
                url: '',
                header: {}
            };
        }
    }
};
