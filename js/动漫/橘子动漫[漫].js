var rule = {
    title: '橘子动漫[漫]',
    host: "https://www.mgnacg.com",
    class_name: "动漫&剧场版&迷之花园",
    class_url: "1&2&3",
    //class_parse: '.head-nav li;a&&Text;a&&href;/(\\d+)\.html',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    searchable: 2,
    quickSearch: 0,
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    url: '/index.php/api/vod#type=fyclassfyfilter&page=fypage',
    filterable: 1,
    filter:'H4sIAAAAAAAAA+2Y204bVxSG38XXVJoxpyR3Scj5nDTNocqFS602KoUKEyQURQJMwAbHGAImEQZyonGIzSEmyNiAHyaeg98iY++1/rVNpcqXVTWSL/z9y2vv/e9Zs2a8nwbMwKmfnwb+CI8ETgV6Q0PhS78G2gL9oT/DHluxSWen7PFwqO9JuPHD/rr8PFuLZuuyB2bgWZuSu+1MzE5vO4sbFAqeRMw8HutCqON4qFOyjOOx9iCCZ3qs6ax98JkiHQhY8Y9WpuTEY7yMwLNH9Rh57AtFImLR82etzvy7RYzsplbcZJxUAswa/WptFylGwDG78La28k5cCCP7733vw9kKEHu/XT14xTEFWNF0wU5POR+OeFFgZG+Vrc0VzlaAda1u2DEemYBjtZV5+9U6xQg41jsQ+asvNEJBJsz4/NAdLfCMCjDqRtb5OMejKsBq1t7YGzlejQKOVYv5ailBMQLZ3YL7/jm2tgHYn2jUWVrmzVHAMae05cR2KEbAsdOXSPe+YJ7Mhr3CO0IAzwejVmmJPSvAPJ8q7t40z6MAedNZJ/6J8xRg7Yc5Z2GN164AeamEtcOeCbDOmbhXXbxOBdj/zBc3hauqAHlLb6qVTc5TgNjBZ2ehbC9wiQrLFcrY6X1coQZIReSqxTIqogHisuy8PrJSMRhlxprzC9Y+ZxMgeyzh3eucqgCzju1Z0VmeVQGuyVGy9p73lgBjTu3WomM8pgKMOZ6zC3wbE2DMD0fWMu87AfYvmXVSk7x5CuBvrVDdT7E/BVhLJeVVBa9FAeZbX/V2g+dTIHf2nvOJ94UAHpKT1uwX9qCguVM1tSmt+yWcAl8HAuQVi3ZsVqsPMGbdnnW3duUXwlqNNRVYU3ZyzYotY80NQN7rkp3me48AsfGck+Z+Q6DVlV1YlLqqA/Y2mnffjvLeKpA+UNK6pgJxOWeto/cpQF4+4T2aOE8BYl/K9gTfAgTNe9u0seJh/mVt54A9KMBaXqTdcX5aEUj/SFqb/OgkQCydkXUSSI9Yt4r8lCPQeln1MCO9rA7Yz49zcg8TYMyJNTuK/q0AeQtr9i7yFCBvbEb6NwFisVdaTSjAOvcr1hz3YwLxsGNV0McVYMzUqpNDLSmQ+VK1xQrmawA6Yyn3bfzdt+gMN0cwst+8tZbznK0AO6A3x2Od0UkkrfUpjimQJ9J4tZh2FvmhKYxfrE/JNSFAbHK+9hrPJQX6W1RoMBzS3hMz21ai1OJLlFc1diYnJVQHfeiRcGhQG3p/t1o+bHHooBHs4Je++ldNbxe9XdeDogd13RTd1HVDdEPTzZPQzZO6fkL0E7reLXq3rneJ3qXrnaJ36rr4NXW/pvg1db+m+DV1v6b4NXW/pvg1db+G+DV0v4b4NXS/hvg1dL+G+DV0v4b4NXS/hvg1dL+G+DV0v4b4NXS/hvg1dL+G+PW+6mXZF+r/TcrS3cq72dHWK977vVR8HfShh8ODkccD/dqfkniMbpFW/pRUVt3DQ++dGG8JzHhIvJuQhkeAG30z4ZRf8o2uQF/bYDgy8GSwN6xZ/zphl1ItLu5MT9NbJZDjP/5EEe9Lq9vVFx4aCustIr9kb71ocUGn+b1elshrg3KWlLNQekjpgXKOlHNQzpNyHsoFUi5AuUjKRSj8P0P+Zlwm5TKUK6RcgXKVlKtQrpFyDcp1Uq5DuUHKDSg3SbkJ5RYpt6DcJuU2lDuk3JHLyFcRyl1S7kLhKy0X+h4p96DcJ+U+lAekPIDykJSHUIwfuBvVv+ml8suIlIm9tFdb2v1HmdiJuJ0ZtdPbNMTQY+/XKMVG0Hv/o+Dvj4cietDdmrBi/Fof6R0YDNenf9QWCPqnKv6pyrAAWrF/qjIc8E9VOOafqqgx/VMV7n7+qcqwgLj0T1W4l/mnKtQZ/VOVgH+q4p+qsO6fqvinKhz3T1VI8U9V6sr/5lSlXTtV8evVr9f/dr0++w5tTrV8XSUAAA==',
    filter_url: "&cateId={{fl.cateId}}&class={{fl.class}}&area={{fl.area}}&year={{fl.year}}&lang={{fl.lang}}&by={{fl.version}}&by={{fl.resource}}&by={{fl.by}}",
    filter_def: "",
    filter_def: {},
    detailUrl: '/index.php/vod/detail/id/fyid.html',
    play_parse: true,
    sniffer: 1,
    is_video: 'obj/tos|bd.xhscdn|/ugc/',
    lazy: $js.toString(() => {
        input = {
            parse: 1,
            url: input,
            //js:'try{let urls=Array.from(document.querySelectorAll("iframe")).filter(x=>x.src.includes("?url="));if(urls){location.href=urls[0].src}}catch{}document.querySelector("button").click()',
            js: 'try{location.href=document.querySelector("#playleft iframe").src}catch{}document.querySelector("button.swal-button--confirm").click()',
            parse_extra: '&is_pc=1&custom_regex=' + rule.is_video,
        }
    }),
    limit: 6,
    推荐: '.border-box.public-r .public-list-box:gt(4);a&&title;img&&data-src;.public-list-prb&&Text;a&&href',
    一级: $js.toString(() => {
        let body = input.split("#")[1];
        let t = Math.round(new Date / 1e3).toString();
        let key = md5("DS" + t + "DCC147D11943AF75");
        let url = input.split("#")[0];
        body = body + "&time=" + t + "&key=" + key;
        print(body);
        fetch_params.body = body;
        let html = post(url, fetch_params);
        let data = JSON.parse(html);
        VODS = data.list.map(function (it) {
            it.vod_pic = urljoin2(input.split("/i")[0], it.vod_pic);
            return it
        });
    }),
    二级: {
        title: '.slide-info-title&&Text;.slide-info:eq(3)--strong&&Text',
        img: '.lazy&&data-src',
        desc: '.fraction&&Text;.slide-info-remarks:eq(1)&&Text;.slide-info-remarks:eq(2)&&Text;.slide-info:eq(2)--strong&&Text;.slide-info:eq(1)--strong&&Text',
        content: '#height_limit&&Text',
        tabs: '.anthology.wow.fadeInUp.animated&&.swiper-wrapper&&a',
        tab_text: '.swiper-slide&&Text',
        lists: '.anthology-list-box:eq(#id) li',
    },
    //搜索: 'json:list;name;pic;;id',
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
    图片替换: '&amp;=>&'
}