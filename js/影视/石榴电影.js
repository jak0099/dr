var rule = {
  title: '石榴电影',
  host: 'https://hei19.com',
  url: '/catalog?column=fyclass&sort=1&per_page=&page=fypage[/catalog?column=fyclass]',
  searchUrl: '/search?type=1&keywords=**&page=fypage',
  searchable: 2,
  quickSearch: 0,
  headers: {
    'User-Agent': 'MOBILE_UA',
    // "Cookie": "searchneed=ok"
  },
  class_name: '电影&剧集&动漫&综艺',
  class_url: '1&2&4&3',
  play_parse: true,
  lazy: $js.toString(() => {
    let ep = 1;
    let match = input.match(/ep=(.*?)$/);
    if (match) {
      ep = match[1];
    }
    //log(ep)
    let html = request(input);
    let jsonA = jsp.pdfh(html, "#__NEXT_DATA__&&Html");
    let data = JSON.parse(jsonA).props.pageProps.videoDetail.videoepisode.data;
    //log(data)

    let item = data.find(function(it) {
      return it.episode == ep;
    });

    let realUrl = item ? item.url : (data.length > 0 ? data[0].url : undefined);

    //log(realUrl)
    input = {
      url: realUrl,
      parse: 0
    };
  }),
  推荐: $js.toString(() => {
    let html = fetch(input);
    let j = pdfh(html, "#__NEXT_DATA__&&Html");
    let json = JSON.parse(j);
    let list = json.props.pageProps;
    //let list = json.props.pageProps.recommendSectionData.list;
    list = JP.JSONPath("$.['columnSectionData'][*]['popular_list']['video_info'][*]", list);
    //log(JSON.stringify(list,null,2));
    //log(list)
    VODS = list.map(function(it) {
      it.vod_pic = it.cover;
      it.vod_remarks = it.tag;
      it.vod_name = it.name;
      it.vod_id = HOST + "/detail/" + it.id;
      return it
    });
  }),
  一级: $js.toString(() => {
    let html = fetch(input);
    let j = pdfh(html, "#__NEXT_DATA__&&Html");
    let json = JSON.parse(j);
    let list = json.props.pageProps.mediaData.data;
    //log(list)
    VODS = list.map(function(it) {
      it.vod_pic = it.cover;
      it.vod_remarks = it.tag;
      it.vod_name = it.name;
      it.vod_id = HOST + "/detail/" + it.id;
      return it
    });
  }),
  二级: {
    "title": "h1&&Text",
    "img": "img&&src",
    "desc": "video-desc-item&&Text;.video-desc-type-mb&&Text",
    "content": ".video-introduce&&p&&Text",
    "tabs": ".btn-play",
    lists: $js.toString(() => {
      LISTS = [];
      let j = pdfh(html, "#__NEXT_DATA__&&Html");
      let list = pdfa(html, ".play-list&&a");
      if (list.length == 0) {
        LISTS.push(["1$" + MY_URL.replace("detail", "player")])
      } else {
        list = list.map(it => pdfh(it, 'Text') + "$" + HOST + pdfh(it, 'a&&href'));
        LISTS.push(list)
      }
      //log(LISTS)
    }),
  },
  搜索: $js.toString(() => {
    let html = fetch(input);
    let j = pdfh(html, "#__NEXT_DATA__&&Html");
    let json = JSON.parse(j);
    let list = json.props.pageProps.searchMovieList.data;
    //log(list)
    VODS = list.map(function(it) {
      it.vod_pic = it.pic;
      it.vod_remarks = it.resolution;
      it.vod_name = it.name;
      it.vod_id = HOST + "/detail/" + it.id;
      return it
    });
  }),
}