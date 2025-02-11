var rule = {
  title: `追剧5网`,
  host: 'https://zhuiju4.cc',
  url: '/show/fyclassfyfilter',
  headers: { 'User-Agent': 'IOS_UA', Referer: 'https://zhuiju4.cc' },
  class_name: '电影&电视剧&动漫',
  class_url: 'dianying&dianshiju&dongman',
  searchUrl: '/search/**----------fypage---/',
  searchable: 2,
  filter_url: '-{{fl.area}}-{{fl.by}}--{{fl.lang}}-------{{fl.year}}/',
  // '{{fl.cateId}}-{{fl.area}}-{{fl.by or "time"}}-{{fl.class}}-{{fl.lang}}-{{fl.letter}}---fypage---{{fl.year}}',
  filter: {
    dianying: [
      {
        key: 'area',
        name: '地区',
        value: [
          { n: '全部', v: '' },
          { n: '大陆', v: '中国大陆' },
          { n: '香港', v: '中国香港' },
          { n: '美国', v: '美国' },
          { n: '法国', v: '法国' },
          { n: '英国', v: '英国' },
          { n: '日本', v: '日本' },
          { n: '韩国', v: '韩国' },
          { n: '德国', v: '德国' },
          { n: '泰国', v: '泰国' },
          { n: '印度', v: '印度' },
          { n: '意大利', v: '意大利' },
          { n: '加拿大', v: '加拿大' },
          { n: '其他', v: '其他' },
        ],
      },
      {
        key: 'lang',
        name: '语言',
        value: [
          { n: '全部', v: '' },
          { n: '国语', v: '国语' },
          { n: '英语', v: '英语' },
          { n: '粤语', v: '粤语' },
          { n: '闽南语', v: '闽南语' },
          { n: '韩语', v: '韩语' },
          { n: '日语', v: '日语' },
          { n: '法语', v: '法语' },
          { n: '德语', v: '德语' },
          { n: '其它', v: '其它' },
        ],
      },
      {
        key: 'year',
        name: '年份',
        value: [
          { n: '全部', v: '' },
          { n: '2024', v: '2024' },
          { n: '2023', v: '2023' },
          { n: '2022', v: '2022' },
          { n: '2021', v: '2021' },
          { n: '2020', v: '2020' },
          { n: '2019', v: '2019' },
          { n: '2018', v: '2018' },
          { n: '2017', v: '2017' },
          { n: '2016', v: '2016' },
          { n: '2015', v: '2015' },
          { n: '2014', v: '2014' },
          { n: '2013', v: '2013' },
          { n: '2012', v: '2012' },
          { n: '2011', v: '2011' },
          { n: '2010', v: '2010' },
        ],
      },
      {
        key: 'by',
        name: '排序',
        value: [
          { n: '时间', v: 'time' },
          { n: '人气', v: 'hits' },
          { n: '评分', v: 'score' },
        ],
      },
    ],
    dianshiju: [
      {
        key: 'area',
        name: '地区',
        value: [
          { n: '全部', v: '' },
          { n: '大陆', v: '中国大陆' },
          { n: '香港', v: '中国香港' },
          { n: '美国', v: '美国' },
          { n: '法国', v: '法国' },
          { n: '英国', v: '英国' },
          { n: '日本', v: '日本' },
          { n: '韩国', v: '韩国' },
          { n: '德国', v: '德国' },
          { n: '泰国', v: '泰国' },
          { n: '印度', v: '印度' },
          { n: '意大利', v: '意大利' },
          { n: '加拿大', v: '加拿大' },
          { n: '其他', v: '其他' },
        ],
      },
      {
        key: 'lang',
        name: '语言',
        value: [
          { n: '全部', v: '' },
          { n: '国语', v: '国语' },
          { n: '英语', v: '英语' },
          { n: '粤语', v: '粤语' },
          { n: '闽南语', v: '闽南语' },
          { n: '韩语', v: '韩语' },
          { n: '日语', v: '日语' },
          { n: '法语', v: '法语' },
          { n: '德语', v: '德语' },
          { n: '其它', v: '其它' },
        ],
      },
      {
        key: 'year',
        name: '年份',
        value: [
          { n: '全部', v: '' },
          { n: '2024', v: '2024' },
          { n: '2023', v: '2023' },
          { n: '2022', v: '2022' },
          { n: '2021', v: '2021' },
          { n: '2020', v: '2020' },
          { n: '2019', v: '2019' },
          { n: '2018', v: '2018' },
          { n: '2017', v: '2017' },
          { n: '2016', v: '2016' },
          { n: '2015', v: '2015' },
          { n: '2014', v: '2014' },
          { n: '2013', v: '2013' },
          { n: '2012', v: '2012' },
          { n: '2011', v: '2011' },
          { n: '2010', v: '2010' },
        ],
      },
      {
        key: 'by',
        name: '排序',
        value: [
          { n: '时间', v: 'time' },
          { n: '人气', v: 'hits' },
          { n: '评分', v: 'score' },
        ],
      },
    ],
    dongman: [
      {
        key: 'area',
        name: '地区',
        value: [
          { n: '全部', v: '' },
          { n: '大陆', v: '中国大陆' },
          { n: '香港', v: '中国香港' },
          { n: '美国', v: '美国' },
          { n: '法国', v: '法国' },
          { n: '英国', v: '英国' },
          { n: '日本', v: '日本' },
          { n: '韩国', v: '韩国' },
          { n: '德国', v: '德国' },
          { n: '泰国', v: '泰国' },
          { n: '印度', v: '印度' },
          { n: '意大利', v: '意大利' },
          { n: '加拿大', v: '加拿大' },
          { n: '其他', v: '其他' },
        ],
      },
      {
        key: 'lang',
        name: '语言',
        value: [
          { n: '全部', v: '' },
          { n: '国语', v: '国语' },
          { n: '英语', v: '英语' },
          { n: '粤语', v: '粤语' },
          { n: '闽南语', v: '闽南语' },
          { n: '韩语', v: '韩语' },
          { n: '日语', v: '日语' },
          { n: '法语', v: '法语' },
          { n: '德语', v: '德语' },
          { n: '其它', v: '其它' },
        ],
      },
      {
        key: 'year',
        name: '年份',
        value: [
          { n: '全部', v: '' },
          { n: '2024', v: '2024' },
          { n: '2023', v: '2023' },
          { n: '2022', v: '2022' },
          { n: '2021', v: '2021' },
          { n: '2020', v: '2020' },
          { n: '2019', v: '2019' },
          { n: '2018', v: '2018' },
          { n: '2017', v: '2017' },
          { n: '2016', v: '2016' },
          { n: '2015', v: '2015' },
          { n: '2014', v: '2014' },
          { n: '2013', v: '2013' },
          { n: '2012', v: '2012' },
          { n: '2011', v: '2011' },
          { n: '2010', v: '2010' },
        ],
      },
      {
        key: 'by',
        name: '排序',
        value: [
          { n: '时间', v: 'time' },
          { n: '人气', v: 'hits' },
          { n: '评分', v: 'score' },
        ],
      },
    ],
  },
  图片来源: '',
  // '@Referer=https://v.ikanbot.com/@User-Agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  //图片替换: "//=>http://",
  filter_def: '',
  filter获取方法: '',
  play_parse: true,
  double: true,
  tab_remove: [], //移除某个线路及相关的选集
  tab_order: [], //线路顺序,按里面的顺序优先，没写的依次排后面
  tab_rename: {}, //线路名替换如:lzm3u8替换为量子资源
  预处理: `js:
  // rule.host="fjjfjfjj"
  `,
   推荐: '.fed-col-sx12 li;li;.fed-list-title&&Text;.fed-list-pics&&data-original;.fed-text-center&&Text;a&&href', //这里可以为空，这样点播不会有内容
  //第一个是列表，第二个是标题，第三个是Pic,第四个是描述，第五个是链接，
  一级: `js:
// console.log()
  pdfh = jsp.pdfh
  pdfa = jsp.pdfa
  pd = jq.pd
  var d = []
  var html1 =  request(input)
  var list = pdfa(html1, '.fed-list-info&&li')
  for (var i = 0; i <= list.length - 1; i++) {
    var v = {}
    v.url = pd(list[i], '.fed-list-pics&&href')
    v.title=pdfh(list[i],".fed-list-title&&Text")
    v.desc=pdfh(list[i],".fed-list-remarks&&Text")
    v.img=pd(list[i],".fed-list-pics.fed-lazy&&data-original")
    d.push(v)
    // console.log(JSON.stringify(v))
  }
  // console.log(d)
    setResult(d)
    `, 
  二级: `js:
  // console.log(rule.host)
  //
  pdfh = jsp.pdfh;
  pd = jsp.pd;
  pdfa = jsp.pdfa;
  try {
    VOD={}
    let html1 = request(input);
    VOD.vod_id=input;
    VOD.vod_name=pdfh(html1,".fed-deta-content&&h3&&Text")
    VOD.vod_pic=pd(html1,".fed-list-pics&&data-original")
    VOD.vod_actor=pdfh(html1,".fed-deta-content&&.fed-part-rows&&li&&Text").replace("主演：","").trim()
    VOD.vod_area=pdfh(html1,".fed-deta-content&&.fed-part-rows&&li:eq(4)&&Text").replace("地区：","").trim()
    VOD.vod_year=pdfh(html1,".fed-deta-content&&.fed-part-rows&&li:eq(2)&&a&&Text")
    VOD.vod_remarks=pdfh(html1,".fed-list-remarks&&Text")
    VOD.vod_director=pdfh(html1,".fed-deta-content&&.fed-part-rows&&li:eq(1)&&Text").replace("导��：���","").trim()
    VOD.vod_content=pdfh(html1,".fed-conv-text.fed-padding.fed-text-muted&&Text")
    let play_from=[]
    let pf=pdfa(html1,".fed-tabs-boxs&&.fed-tabs-foot&&li")
    for(let i=0;i<pf.length;i++){
      let t=pdfh(pf[i],"a&&Text")
      play_from.push(t)
    }
    VOD.vod_play_from = play_from.join('$$$');
    let u_list=pdfa(html1,".fed-tabs-btm.fed-padding")
    var play_urls=[]
    for(let i=0;i<u_list.length;i++){
      var source_list=[]
      let us=pdfa(u_list[i],"li")
      for(let j=0;j<us.length;j++){
        let v_n=pdfh(us[j],"a&&Text")
        let v_u=pd(us[j],"a&&href")
        let data=v_n+"$"+v_u
        source_list.push(data)
      }
      play_urls.push(source_list.join("#"))
      // play_from.push(t)
    }
    // console.log(play_urls)
    VOD.vod_play_url=play_urls.join("$$$")   
  } catch (e) {
    log('获取二级详情页发生错误:' + e.message)
  }
  `,
  // 搜索: '.fed-part-layout&&dl;.fed-part-eone&&Text;.fed-list-pics.fed-lazy&&data-original;.fed-deta-images&&Text;.fed-rims-info&&href', //第一个是列表，第二个是标题，第三个是Pic,第四个是描述，第五个是链接，
  搜索: `js:
  // console.log("aaaa")
  pdfh=jsp.pdfh;
  pdfa=jsp.pdfa;
  pd=jsp.pd;
  var d = [];
  var html = request(input);
  var list=pdfa(html,".fed-part-layout&&dl")
  for(var i=0;i<=list.length-1;i++){
    var v={}
    v.url=pd(list[i],".fed-rims-info&&href")
    v.title=pdfh(list[i],".fed-part-eone&&Text")
    v.desc=pdfh(list[i],".fed-deta-images&&Text")
    v.content=pdfh(list[i],".fed-part-eone&&Text")
    v.img=pd(list[i],".fed-list-pics.fed-lazy&&data-original")
    d.push(v)
    // console.log(JSON.stringify(v))
  }
  setResult(d)
  `, //第一个是列表，第二个是标题，第三个是Pic,第四个是描述，第五个是链接，
  lazy: `js:
  var play_u=""
  var html1=request(input)
  // console.log(html1)
  var play_regex = /player_aaaa=(.*?)</
  var m = html1.match(play_regex)
  if (m) {
    var player_aaaa = JSON.parse(m[1])
    play_u=player_aaaa.url
  }
  input={
    parse:0,
    url:play_u,
    jx:0
  }
  // console.log(input)
  `,
  proxy_rule: '',
}