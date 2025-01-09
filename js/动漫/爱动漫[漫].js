//发布页https://girigirilove.top/
Object.assign(muban.短视2.二级,{
	img:'.detail-pic img&&data-src||src',
});
var rule = {
  模板:'短视2',
  title: '爱动漫[漫]',
  host: "https://m3u8.girigirilove.com",
  class_name: "日番&劇場版",
  class_url: "2&21",
  url: '/show/fyclass--------fypage---/',
  searchUrl: '/search/**----------fypage---/',
  推荐: '.public-list-box .public-list-bj;a&&title;.lazy&&data-src||src;.public-list-prb&&Text;a&&href',
  一级: $js.toString(() => {
        let html = fetch(input);
        let list = pdfa(html, ".public-list-box");
        VODS = list.map(x => {
            return {
                vod_name: pdfh(x, "a&&title"),
                vod_pic: pdfh(x, ".lazy&&data-src||src"),
                vod_remarks: pdfh(x, ".public-list-prb&&Text"),
                vod_content: pdfh(x, ""),
                vod_id: pdfh(x, "a&&href")
            }
        });
    }),
  搜索: $js.toString(() => {
        let html = fetch(input);
        let list = pdfa(html, ".public-list-box");
        VODS = list.map(x => {
            return {
                vod_name: pdfh(x, ".thumb-txt&&Text"),
                vod_pic: pdfh(x, ".lazy&&data-src"),
                vod_remarks: pdfh(x, ".public-list-prb&&Text"),
                vod_content: pdfh(x, ".thumb-blurb&&Text"),
                vod_id: pdfh(x, "a&&href")
            }
        });
    }),
}