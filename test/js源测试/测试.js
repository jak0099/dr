var rule = {
  title: '金牌影院',
  host: 'https://m.sunnafh.com',
  url: '/api/mw-movie/anonymous/video/list?pageNum=fypage&pageSize=30&sort=1&sortBy=1&type1=fyclass&fyfilter',
  searchUrl: '/api/mw-movie/anonymous/video/searchByWordPageable?keyword=**&pageNum=fypage&pageSize=12&type=false',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  },
  searchable: 2,
  quickSearch: 0,
  filterable: 1,
  filter: {
    "类型": {
      "key": "type2",
      "value": [
        {"n": "全部", "v": ""},
        {"n": "剧情", "v": "1"},
        {"n": "动作", "v": "2"},
        {"n": "喜剧", "v": "3"},
        {"n": "爱情", "v": "4"}
      ]
    },
    "地区": {
      "key": "area",
      "value": [
        {"n": "全部", "v": ""},
        {"n": "大陆", "v": "1"},
        {"n": "香港", "v": "2"},
        {"n": "台湾", "v": "3"},
        {"n": "美国", "v": "4"}
      ]
    },
    "年份": {
      "key": "year",
      "value": [
        {"n": "全部", "v": ""},
        {"n": "2024", "v": "2024"},
        {"n": "2023", "v": "2023"},
        {"n": "2022", "v": "2022"},
        {"n": "2021", "v": "2021"}
      ]
    }
  },
  filter_url: 'type2={{fl.类型}}&area={{fl.地区}}&year={{fl.年份}}',
  class_name: '电影&电视剧&综艺&动漫',
  class_url: '1&2&3&4',
  limit: 6,
  double: false,
  play_parse:true,
  lazy:`js:
     let pid = input.split('/')[5];
     let nid = input.split('/')[7];
     const t = new Date().getTime();
     eval(getCryptoJS);
     let signkey = 'clientType=1&id='+pid+'&nid='+nid+'&key=cb808529bae6b6be45ecfab29a4889bc&t='+t;
     const key = CryptoJS.SHA1(CryptoJS.MD5(signkey).toString()).toString();
     let json_data = JSON.parse(request('https://m.sunnafh.com/api/mw-movie/anonymous/v2/video/episode/url?clientType=1&id='+pid+'&nid='+nid,{headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'deviceid': '63ffad23-a598-4f96-85d7-7bf5f3e4a0a2',
    'sign': key,
    't': t
    }}));
     let link = json_data.data.list[0].url;
     if(/\\.(m3u8|mp4)/.test(link)){input={jx:0,parse:0,url:link}}else{input={jx:0,parse:1,url:link}}
  `,
  一级: `js:
        let d = [];
        let t = new Date().getTime();
        eval(getCryptoJS);
        // 动态获取所有请求参数
        let queryString = input.split('?')[1] || '';
        let params = new URLSearchParams(queryString);
        let paramObj = {};
        for (let [key, value] of params) {
          paramObj[key] = value;
        }
        // 生成排序后的参数串
        let sortedParams = Object.keys(paramObj).sort().map(key => \`\${key}=\${paramObj[key]}\`).join('&');
        let signkey = \`\${sortedParams}&key=cb808529bae6b6be45ecfab29a4889bc&t=\${t}\`;
        let key = CryptoJS.SHA1(CryptoJS.MD5(signkey).toString()).toString();
        let list = JSON.parse(request(input,{headers:{
           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'deviceId': '63ffad23-a598-4f96-85d7-7bf5f3e4a0a2',
            'sign': key,
            't': t 
        }})).data.list;
        list.forEach((it)=>{
            d.push({
              title: it.vodName,
              desc:it.vodRemarks,
              img:it.vodPic,
              url:'http'+it.vodId
            })
        });
        setResult(d);
  `,
  二级: `js:
    let kid=input.split('http')[1];
    let t = new Date().getTime();
    eval(getCryptoJS);
    let signkey = 'id='+kid+'&key=cb808529bae6b6be45ecfab29a4889bc&t='+t;
    let key = CryptoJS.SHA1(CryptoJS.MD5(signkey).toString()).toString();
    let kjson = JSON.parse(request('https://m.sunnafh.com/api/mw-movie/anonymous/video/detail?id='+kid,{headers:{
       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'deviceId': '63ffad23-a598-4f96-85d7-7bf5f3e4a0a2',
        'sign': key,
        't': t 
    }})).data;
    let kurls = kjson.episodeList.map(function(it) {
      return it.name + "$" + "https://m.sunnafh.com/vod/play/"+kid+"/sid/"+it.nid
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
      vod_content: kjson.vodContent,
      vod_play_from: '金牌线路',
      vod_play_url: kurls
    }`,
  搜索: `js:
    let t = new Date().getTime();
     eval(getCryptoJS);
     let pg = MY_PAGE;
     let signkey = 'keyword='+KEY+'&pageNum='+pg+'&pageSize=12&type=false&key=cb808529bae6b6be45ecfab29a4889bc&t='+t;
     let key = CryptoJS.SHA1(CryptoJS.MD5(signkey).toString()).toString();
     let html = JSON.parse(request(input,{headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'deviceid': '63ffad23-a598-4f96-85d7-7bf5f3e4a0a2',
    'sign': key,
    't': t
    }}));
      let data = html.data.list;
      let d = [];
      data.forEach(it=>{
        d.push({
          title: it.vodName,
          desc:it.vodVersion,
          img:it.vodPic,
          url:'http'+it.vodId
        })
      });
    setResult(d)
  `,
}