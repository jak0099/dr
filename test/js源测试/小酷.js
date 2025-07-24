var rule = {
    title: '酷短剧',
    host: 'http://wapi.kuwo.cn',
    url: '/openapi/v1/shortplay/moduleMore?currentPage=fypage&moduleId=fyclass&rn=12',    
    detailUrl: '/openapi/v1/shortplay/videoList?albumId=fyid',
    searchUrl: '',
    searchable: 0,
    quickSearch: 0,
    filterable: 0,
    headers: {
        'User-Agent': 'MOBILE_UA',
        'Referer': 'http://www.kuwo.cn/',
        'Origin': 'http://www.kuwo.cn'
    },
    timeout: 15000,
    class_name: '猜你想看&土味爱情&更多精彩&霸道总裁的人生&赘婿当道&漫漫追妻路&家庭情感&热门短剧',
    class_url: '10&11&12&13&14&15&16&5',
    play_parse: true,
    double: true,    
    推荐: $js.toString(() => {
        let url = 'http://wapi.kuwo.cn/openapi/v1/shortplay/moduleMore?currentPage=1&moduleId=5&rn=12';
        let res = request(url, {headers: rule.headers});
        let json = JSON.parse(res);
        if (json.code === 200 && json.data && json.data.list) {
            VODS = json.data.list.map(item => ({
                vod_id: item.id,
                vod_name: item.title,
                vod_pic: item.img,
                vod_remarks: item.currrentDesc || ''
            }));
        } else {
            VODS = [];
        }
    }),    
    一级: $js.toString(() => {        
        let res = request(url, {headers: rule.headers});
        let json = JSON.parse(res);        
        if (json.code === 200 && json.data && json.data.list) {
            VODS = json.data.list.map(item => ({
                vod_id: item.id,
                vod_name: item.title,
                vod_pic: item.img,
                vod_remarks: item.currrentDesc || ''
            }));
        } else {
            VODS = [];
        }
    }),
    
    二级:$js.toString(()=>{
    
  }),  
  lazy:$js.toString(()=>{
    
  }),
}