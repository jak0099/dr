/*
@header({
  searchable: 2,
  filterable: 1,
  quickSearch: 0,
  title: '蓝莓短剧[短]',
  lang: 'ds'
})
*/

var rule = {
    类型: '影视',
    title: '蓝莓短剧[短]',
    host: 'https://new.tianjinzhitongdaohe.com',
    url: '/api/v1/app/screen/screenMovie?classify=fyclass&page=fypage',
    searchUrl: '/api/v1/app/search/searchMovie',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json;charset=UTF-8",
        "User-Agent": "okhttp/4.12.0"
    },
    timeout: 5000,
    play_parse: true,
    
    class_parse: $js.toString(() => {
        const url = 'https://new.tianjinzhitongdaohe.com/api/v1/app/screen/screenType';
        const headers = {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json;charset=UTF-8",
            "User-Agent": "okhttp/4.12.0"
        };
        
        try {
            const response = request(url, {method: 'POST', headers: headers});
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
            
            return JSON.stringify({
                class: classes,
                filters: {}
            });
        } catch (e) {
            console.error("分类解析错误:", e);
            return JSON.stringify({class: []});
        }
    }),
    
    一级: $js.toString(() => {
        const input = typeof INPUT !== 'undefined' ? INPUT : '';
        const page = typeof MY_PAGE !== 'undefined' ? MY_PAGE : 1;
        const cid = input.includes('classify=') ? input.split('classify=')[1].split('&')[0] : '';
        const headers = {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json;charset=UTF-8",
            "User-Agent": "okhttp/4.12.0"
        };
        
        const payload = JSON.stringify({
            condition: {
                classify: cid,
                typeId: "S1"
            },
            pageNum: String(page),
            pageSize: 40
        });
        
        try {
            const url = 'https://new.tianjinzhitongdaohe.com/api/v1/app/screen/screenMovie';
            const response = request(url, {
                method: 'POST',
                headers: headers,
                body: payload
            });
            const data = JSON.parse(response);
            VODS = [];
            
            if (data.data && data.data.records) {
                data.data.records.forEach(vod => {
                    VODS.push({
                        vod_id: vod.id,
                        vod_name: vod.name,
                        vod_pic: vod.cover,
                        vod_remarks: `${vod.totalEpisode || 0}集`
                    });
                });
            }
        } catch (e) {
            console.error("一级列表错误:", e);
            VODS = [];
        }
    }),
    
    二级: $js.toString(() => {
        const orId = typeof OR_ID !== 'undefined' ? OR_ID : '';
        const did = orId;
        const headers = {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json;charset=UTF-8",
            "User-Agent": "okhttp/4.12.0"
        };
        
        try {
            const detailPayload = JSON.stringify({
                id: did,
                source: 0,
                typeId: "S1",
                userId: "223664"
            });
            
            const detailUrl = 'https://new.tianjinzhitongdaohe.com/api/v1/app/play/movieDetails';
            const detailResponse = request(detailUrl, {
                method: 'POST',
                headers: headers,
                body: detailPayload
            });
            
            const detailData = JSON.parse(detailResponse).data || {};
            let playList = '';
            let playFrom = '蓝莓短剧';
            let content = detailData.introduce || '暂无剧情介绍';
            
            if (detailData.episodeList && detailData.episodeList.length > 0) {
                const episodes = detailData.episodeList.map(ep => {
                    return `${ep.episode}$${did}@${ep.id}`;
                });
                playList = episodes.join('#');
            }
            
            VOD = {
                vod_id: did,
                vod_name: detailData.name || '未知名称',
                vod_pic: detailData.cover || '',
                vod_content: content,
                vod_play_from: playFrom,
                vod_play_url: playList || '暂无播放地址$0'
            };
        } catch (e) {
            console.error("详情解析错误:", e);
            VOD = {
                vod_name: '加载失败',
                vod_content: '详情加载失败，请稍后重试',
                vod_play_from: '暂无资源',
                vod_play_url: '暂无播放地址$0'
            };
        }
    }),
    
    搜索: $js.toString(() => {
        const key = typeof KEY !== 'undefined' ? KEY : '';
        const page = typeof MY_PAGE !== 'undefined' ? MY_PAGE : 1;
        const headers = {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json;charset=UTF-8",
            "User-Agent": "okhttp/4.12.0"
        };
        
        const payload = JSON.stringify({
            condition: {
                typeId: "S1",
                value: key
            },
            pageNum: String(page),
            pageSize: 40
        });
        
        try {
            const url = 'https://new.tianjinzhitongdaohe.com/api/v1/app/search/searchMovie';
            const response = request(url, {
                method: 'POST',
                headers: headers,
                body: payload
            });
            const data = JSON.parse(response);
            VODS = [];
            
            if (data.data && data.data.records) {
                data.data.records.forEach(vod => {
                    VODS.push({
                        vod_id: vod.id,
                        vod_name: vod.name,
                        vod_pic: vod.cover,
                        vod_remarks: `更新时间${vod.year || '未知'}`
                    });
                });
            }
        } catch (e) {
            console.error("搜索错误:", e);
            VODS = [];
        }
    }),
    
    lazy: $js.toString(() => {
        const input = typeof INPUT !== 'undefined' ? INPUT : '';
        const [videoId, episodeId] = input.split('@');
        const headers = {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json;charset=UTF-8",
            "User-Agent": "okhttp/4.12.0"
        };
        
        try {
            const payload = JSON.stringify({
                episodeId: episodeId,
                id: videoId,
                source: 0,
                typeId: "S1",
                userId: "223664"
            });
            
            const url = 'https://new.tianjinzhitongdaohe.com/api/v1/app/play/movieDetails';
            const response = request(url, {
                method: 'POST',
                headers: headers,
                body: payload
            });
            const data = JSON.parse(response);
            
            INPUT = {
                parse: 0,
                url: data.data && data.data.url ? data.data.url : '',
                header: JSON.stringify({
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36'
                })
            };
        } catch (e) {
            console.error("播放地址获取错误:", e);
            INPUT = {
                parse: 0,
                url: '',
                header: JSON.stringify({})
            };
        }
    })
};