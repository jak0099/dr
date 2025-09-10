var rule = {
  类型: '影视',
  title:'爱你短剧[短]',
  host: 'https://loveyoudj.com',
  //host:'https://ainidj.com', 
  headers: { 'User-Agent': 'MOBILE_UA' },
  编码: 'utf-8',
  timeout: 5000,
  url: '/vodshwo/fyclass-fyfilter.html',
  filter_url: '{{fl.地区}}-{{fl.排序}}-{{fl.剧情}}-{{fl.语言}}-{{fl.字母}}---fypage---{{fl.年份}}',
  detailUrl: '',
  searchUrl: '/vodsearch/**----------fypage---.html',
  searchable: 2,
  quickSearch: 1,
  filterable: 1,
  class_parse: '.navbar-items li:gt(0):lt(10);a&&Text;a&&href;.*/(.*?)\.html',
  filter_def: {
    chuanyue: { cateId: 'chuanyue' },
    zhanshen: { cateId: 'zhanshen' },
    zhongsheng: { cateId: 'zhongsheng' },
    aiqing: { cateId: 'aiqing' },
    mengwa: { cateId: 'mengwa' },
    shenyi: { cateId: 'shenyi' },
    gudai: { cateId: 'gudai' },
    xuanhuan: { cateId: 'xuanhuan' },
    yanqing: { cateId: 'yanqing' }
  },
  play_parse: true,
  lazy: `js:
      if (/quark/.test(input)) {
      let confirm="";
      input = getProxyUrl().replace('js','quark')+'&type=push'+confirm+'&url='+encodeURIComponent(input)
      } else {
      let kcode = JSON.parse(request(input).match(/var player_.*?=(.*?)</)[1]);
      let kurl = kcode.url;
      if (/\\.(m3u8|mp4)/.test(kurl)) {
      input = { jx: 0, parse: 0, url: kurl };
      } else {
      input = { jx: 0, parse: 1, url: kurl };
  }}`,
  limit: 9,
  double: false,
  推荐: '*',
  一级: 'body a.module-poster-item.module-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
  二级: `js:
      let khtml = request(input);
      VOD = {};
      VOD.vod_id = input;
      VOD.vod_name = pdfh(khtml, 'h1&&Text');
      VOD.vod_pic = pdfh(khtml, '.video-cover&&img&&data-src');
      VOD.type_name = pdfh(khtml, '.tag-link:eq(0)&&Text') + pdfh(khtml, '.tag-link:eq(1)&&Text');
      VOD.vod_remarks = pdfh(khtml, '.video-info-items:eq(-3)&&Text');
      VOD.vod_year = pdfh(khtml, '.tag-link:eq(-2)&&Text');
      VOD.vod_area = pdfh(khtml, '.tag-link:eq(-1)&&Text');
      VOD.vod_director = pdfh(khtml, '.video-info-actor:eq(0)&&Text');
      VOD.vod_actor = pdfh(khtml, '.video-info-actor:eq(1)&&Text');
      VOD.vod_content = pdfh(khtml, '.vod_content&&span&&Text');

      let ktabs = [];
      if ( pdfh(khtml,'.tab-item span&&Text') !== 0 ) { ktabs.push("爱你专线") };
      if ( pdfh(khtml,'.video-info-items:has([href^=https://pan.quark])') !== 0 ) { ktabs.push("夸克网盘") };
      VOD.vod_play_from = ktabs.join('$$$');

      let klists = [];
      ktabs.forEach((tab) => {
      if (/夸克网盘/.test(tab)) {
      let qk_plist = '夸克_合集' + '$' + pdfh(khtml,'.video-info-items:eq(0)&&a&&href') ;
      klists.push(qk_plist)
      } else  {
      let zx_plist = pdfa(khtml, '.module-play-list-content&&a').map((it) => { return pdfh(it, 'a&&Text') + '$' + pd(it, 'a&&href', input) });
      zx_plist = zx_plist.join('#');
      klists.push(zx_plist)
  }});
      VOD.vod_play_url = klists.join('$$$')
  `,
  搜索: '.module-search-item;.video-serial&&title;*;.video-serial&&Text;.video-serial&&href',
  filter: {"chuanyue":[{"key":"剧情","name":"剧情","value":[{"n":"全部","v":""},{"n":"短剧推荐","v":"短剧推荐"},{"n":"2025最新短剧","v":"2025最新短剧"},{"n":"免费完整版","v":"免费完整版"}]},{"key":"地区","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"}]},{"key":"语言","name":"语言","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"}]},{"key":"年份","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"}]},{"key":"字母","name":"字母","value":[{"n":"字母","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"}]},{"key":"排序","name":"排序","value":[{"n":"时间排序","v":"time"},{"n":"人气排序","v":"hits"},{"n":"评分排序","v":"score"}]}],"zhanshen":[{"key":"剧情","name":"剧情","value":[{"n":"全部","v":""},{"n":"短剧推荐","v":"短剧推荐"},{"n":"2025最新短剧","v":"2025最新短剧"},{"n":"免费完整版","v":"免费完整版"}]},{"key":"地区","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"}]},{"key":"语言","name":"语言","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"}]},{"key":"年份","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"}]},{"key":"字母","name":"字母","value":[{"n":"字母","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"}]},{"key":"排序","name":"排序","value":[{"n":"时间排序","v":"time"},{"n":"人气排序","v":"hits"},{"n":"评分排序","v":"score"}]}],"zhongsheng":[{"key":"剧情","name":"剧情","value":[{"n":"全部","v":""},{"n":"短剧推荐","v":"短剧推荐"},{"n":"2025最新短剧","v":"2025最新短剧"},{"n":"免费完整版","v":"免费完整版"}]},{"key":"地区","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"}]},{"key":"语言","name":"语言","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"}]},{"key":"年份","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"}]},{"key":"字母","name":"字母","value":[{"n":"字母","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"}]},{"key":"排序","name":"排序","value":[{"n":"时间排序","v":"time"},{"n":"人气排序","v":"hits"},{"n":"评分排序","v":"score"}]}],"aiqing":[{"key":"剧情","name":"剧情","value":[{"n":"全部","v":""},{"n":"短剧推荐","v":"短剧推荐"},{"n":"2025最新短剧","v":"2025最新短剧"},{"n":"免费完整版","v":"免费完整版"}]},{"key":"地区","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"}]},{"key":"语言","name":"语言","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"}]},{"key":"年份","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"}]},{"key":"字母","name":"字母","value":[{"n":"字母","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"}]},{"key":"排序","name":"排序","value":[{"n":"时间排序","v":"time"},{"n":"人气排序","v":"hits"},{"n":"评分排序","v":"score"}]}],"mengwa":[{"key":"剧情","name":"剧情","value":[{"n":"全部","v":""},{"n":"短剧推荐","v":"短剧推荐"},{"n":"2025最新短剧","v":"2025最新短剧"},{"n":"免费完整版","v":"免费完整版"}]},{"key":"地区","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"}]},{"key":"语言","name":"语言","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"}]},{"key":"年份","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"}]},{"key":"字母","name":"字母","value":[{"n":"字母","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"}]},{"key":"排序","name":"排序","value":[{"n":"时间排序","v":"time"},{"n":"人气排序","v":"hits"},{"n":"评分排序","v":"score"}]}],"shenyi":[{"key":"剧情","name":"剧情","value":[{"n":"全部","v":""},{"n":"短剧推荐","v":"短剧推荐"},{"n":"2025最新短剧","v":"2025最新短剧"},{"n":"免费完整版","v":"免费完整版"}]},{"key":"地区","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"}]},{"key":"语言","name":"语言","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"}]},{"key":"年份","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"}]},{"key":"字母","name":"字母","value":[{"n":"字母","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"}]},{"key":"排序","name":"排序","value":[{"n":"时间排序","v":"time"},{"n":"人气排序","v":"hits"},{"n":"评分排序","v":"score"}]}],"gudai":[{"key":"剧情","name":"剧情","value":[{"n":"全部","v":""},{"n":"短剧推荐","v":"短剧推荐"},{"n":"2025最新短剧","v":"2025最新短剧"},{"n":"免费完整版","v":"免费完整版"}]},{"key":"地区","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"}]},{"key":"语言","name":"语言","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"}]},{"key":"年份","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"}]},{"key":"字母","name":"字母","value":[{"n":"字母","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"}]},{"key":"排序","name":"排序","value":[{"n":"时间排序","v":"time"},{"n":"人气排序","v":"hits"},{"n":"评分排序","v":"score"}]}],"xuanhuan":[{"key":"剧情","name":"剧情","value":[{"n":"全部","v":""},{"n":"短剧推荐","v":"短剧推荐"},{"n":"2025最新短剧","v":"2025最新短剧"},{"n":"免费完整版","v":"免费完整版"}]},{"key":"地区","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"}]},{"key":"语言","name":"语言","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"}]},{"key":"年份","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"}]},{"key":"字母","name":"字母","value":[{"n":"字母","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"}]},{"key":"排序","name":"排序","value":[{"n":"时间排序","v":"time"},{"n":"人气排序","v":"hits"},{"n":"评分排序","v":"score"}]}],"yanqing":[{"key":"剧情","name":"剧情","value":[{"n":"全部","v":""},{"n":"短剧推荐","v":"短剧推荐"},{"n":"2025最新短剧","v":"2025最新短剧"},{"n":"免费完整版","v":"免费完整版"}]},{"key":"地区","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"}]},{"key":"语言","name":"语言","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"}]},{"key":"年份","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"}]},{"key":"字母","name":"字母","value":[{"n":"字母","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"}]},{"key":"排序","name":"排序","value":[{"n":"时间排序","v":"time"},{"n":"人气排序","v":"hits"},{"n":"评分排序","v":"score"}]}]},
}