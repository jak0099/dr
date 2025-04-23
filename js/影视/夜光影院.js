var rule = {
    类型: '影视',
    title: '夜光影院',
    //host: 'https://mengdm.vip',
    host: `https://${Math.random() < 0.5 ? 'mengdm.vip' : 'www.ygpvp.com'}`,
    url: '/index.php/vod/show/fyfilter.html',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    headers: {'User-Agent': 'MOBILE_UA'},
    searchable:1,quickSearch:1,double:true,timeout:10000,play_parse:true,filterable:1,invalid:true,
    class_name: '电影&电视剧&动漫&综艺',
    class_url: '/id/1&/id/2&/id/4&/id/3',
    filter_url: '{{fl.area}}{{fl.by}}{{fl.class}}{{fl.类型}}/page/fypage{{fl.year}}',
    filter_def: {'/id/1': {类型: '/id/1'},'/id/2': {类型: '/id/2'},'/id/3': {类型: '/id/3'},'/id/4': {类型: '/id/4'},'/id/5': {类型: '/id/5'}},   
    推荐:'.myui-vodbox-content;body;img&&alt;img&&src;.tag-box&&Text;a&&href',
    一级:'.movie-ul .myui-vodbox-content;img&&alt;img&&src;.tag-box&&Text;a&&href',
    二级: {
		title: '.detail-box&&h1&&Text;.tags.text-overflow&&Text',
		img: 'img&&src',
		desc: '.detail-box&&.item:eq(2)&&Text;;;.detail-box&&.director:eq(1)&&Text;.detail-box&&.director:eq(0)&&Text',
		content: '.vod-content&&Text',
		tabs: '.swiper-container&&li',
		lists: '.tab-content:eq(#id)&&a',
		tab_text: 'body&&Text',
		list_text: 'body&&Text',
		list_url: 'a&&href',
	},   
    搜索:'.myui-vodbox-content;img&&alt;img&&src;.tag-box&&Text;a&&href',
    lazy: `js:
  let html = request(input);
  let hconf = html.match(/r player_.*?=(.*?)</)[1];
  let json = JSON5.parse(hconf);
  let url = json.url;
  if (json.encrypt == '1') {
    url = unescape(url);
  } else if (json.encrypt == '2') {
    url = unescape(base64Decode(url));
  }
  if (/\\.(m3u8|mp4|m4a|mp3)/.test(url)) {
    input = {
      parse: 0,
      jx: 0,
      url: url,
    };
  } else {
    input = url && url.startsWith('http') && tellIsJx(url) ? {parse:0,jx:1,url:url}:input;
  }`,
    filter:{
    "/id/1":[{"key":"类型","name":"类型","value":[{"n":"全部","v":"/id/1"},{"n":"动作片","v":"/id/101"},{"n":"喜剧片","v":"/id/102"},{"n":"爱情片","v":"/id/103"},{"n":"科幻片","v":"/id/104"},{"n":"剧情片","v":"/id/105"},{"n":"悬疑片","v":"/id/106"},{"n":"惊悚片","v":"/id/107"},{"n":"恐怖片","v":"/id/108"},{"n":"犯罪片","v":"/id/109"},{"n":"谍战片","v":"/id/110"},{"n":"冒险片","v":"/id/111"},{"n":"奇幻片","v":"/id/112"},{"n":"灾难片","v":"/id/113"},{"n":"战争片","v":"/id/114"},{"n":"动画片","v":"/id/115"},{"n":"歌舞片","v":"/id/116"},{"n":"历史片","v":"/id/117"},{"n":"传记片","v":"/id/118"},{"n":"其他片","v":"/id/119"},{"n":"记录片","v":"/id/120"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"/area/中国大陆"},{"n":"香港","v":"/area/中国香港"},{"n":"台湾","v":"/area/中国台湾"},{"n":"美国","v":"/area/美国"},{"n":"法国","v":"/area/法国"},{"n":"英国","v":"/area/英国"},{"n":"日本","v":"/area/日本"},{"n":"韩国","v":"/area/韩国"},{"n":"德国","v":"/area/德国"},{"n":"泰国","v":"/area/泰国"},{"n":"印度","v":"/area/印度"},{"n":"意大利","v":"/area/意大利"},{"n":"西班牙","v":"/area/西班牙"},{"n":"加拿大","v":"/area/加拿大"},{"n":"其他","v":"/area/其他"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"/year/2025"},{"n":"2024","v":"/year/2024"},{"n":"2023","v":"/year/2023"},{"n":"2022","v":"/year/2022"},{"n":"2020","v":"/year/2020"},{"n":"2019","v":"/year/2019"},{"n":"2018","v":"/year/2018"},{"n":"2017","v":"/year/2017"},{"n":"2016","v":"/year/2016"},{"n":"2015","v":"/year/2015"},{"n":"2014","v":"/year/2014"},{"n":"2013","v":"/year/2013"},{"n":"2012","v":"/year/2012"},{"n":"2011","v":"/year/2011"},{"n":"2010","v":"/year/2010"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]}],
    "/id/2":[{"key":"类型","name":"类型","value":[{"n":"全部","v":"/id/2"},{"n":"国产剧","v":"/id/201"},{"n":"港台剧","v":"/id/202"},{"n":"日韩剧","v":"/id/203"},{"n":"欧美剧","v":"/id/204"},{"n":"海外剧","v":"/id/205"},{"n":"其他剧","v":"/id/206"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"中国大陆","v":"/area/中国大陆"},{"n":"中国香港","v":"/area/中国香港"},{"n":"中国台湾","v":"/area/中国台湾"},{"n":"美国","v":"/area/美国"},{"n":"韩国","v":"/area/韩国"},{"n":"日本","v":"/area/日本"},{"n":"法国","v":"/area/法国"},{"n":"英国","v":"/area/英国"},{"n":"德国","v":"/area/德国"},{"n":"泰国","v":"/area/泰国"},{"n":"印度","v":"/area/印度"},{"n":"其他","v":"/area/其他"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"/year/2025"},{"n":"2024","v":"/year/2024"},{"n":"2023","v":"/year/2023"},{"n":"2022","v":"/year/2022"},{"n":"2020","v":"/year/2020"},{"n":"2019","v":"/year/2019"},{"n":"2018","v":"/year/2018"},{"n":"2017","v":"/year/2017"},{"n":"2016","v":"/year/2016"},{"n":"2015","v":"/year/2015"},{"n":"2014","v":"/year/2014"},{"n":"2013","v":"/year/2013"},{"n":"2012","v":"/year/2012"},{"n":"2011","v":"/year/2011"},{"n":"2010","v":"/year/2010"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]}],
    "/id/3":[{"key":"类型","name":"类型","value":[{"n":"全部","v":"/id/3"},{"n":"国产","v":"/id/301"},{"n":"港台","v":"/id/303"},{"n":"日韩","v":"/id/302"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"中国大陆","v":"/area/中国大陆"},{"n":"中国香港","v":"/area/中国香港"},{"n":"中国台湾","v":"/area/中国台湾"},{"n":"美国","v":"/area/美国"},{"n":"韩国","v":"/area/韩国"},{"n":"日本","v":"/area/日本"},{"n":"法国","v":"/area/法国"},{"n":"英国","v":"/area/英国"},{"n":"德国","v":"/area/德国"},{"n":"泰国","v":"/area/泰国"},{"n":"印度","v":"/area/印度"},{"n":"其他","v":"/area/其他"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"/year/2025"},{"n":"2024","v":"/year/2024"},{"n":"2023","v":"/year/2023"},{"n":"2022","v":"/year/2022"},{"n":"2020","v":"/year/2020"},{"n":"2019","v":"/year/2019"},{"n":"2018","v":"/year/2018"},{"n":"2017","v":"/year/2017"},{"n":"2016","v":"/year/2016"},{"n":"2015","v":"/year/2015"},{"n":"2014","v":"/year/2014"},{"n":"2013","v":"/year/2013"},{"n":"2012","v":"/year/2012"},{"n":"2011","v":"/year/2011"},{"n":"2010","v":"/year/2010"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]}],
    "/id/4":[{"key":"类型","name":"类型","value":[{"n":"全部","v":"/id/4"},{"n":"国产剧","v":"/id/401"},{"n":"日韩剧","v":"/id/402"},{"n":"欧美剧","v":"/id/403"},{"n":"其他剧","v":"/id/404"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"/year/2025"},{"n":"2024","v":"/year/2024"},{"n":"2023","v":"/year/2023"},{"n":"2022","v":"/year/2022"},{"n":"2020","v":"/year/2020"},{"n":"2019","v":"/year/2019"},{"n":"2018","v":"/year/2018"},{"n":"2017","v":"/year/2017"},{"n":"2016","v":"/year/2016"},{"n":"2015","v":"/year/2015"},{"n":"2014","v":"/year/2014"},{"n":"2013","v":"/year/2013"},{"n":"2012","v":"/year/2012"},{"n":"2011","v":"/year/2011"},{"n":"2010","v":"/year/2010"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]}]    
    }
}

