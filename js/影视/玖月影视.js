var rule = {
    title: '玖月影视',
    author: '不告诉你',
    logo: 'https://i-blog.csdnimg.cn/blog_migrate/2621e710a94ab40ba66645d47f296aaf.gif',
    host: 'http://www.qz56.com',// 2025yy.com
    url: '/page/fyclass-fypage.html',
    searchUrl: '/rss.xml?wd=**',
    headers: {
        'User-Agent': 'UC_UA'
    },
    homeUrl: '/',
    searchable: 1,
    quickSearch: 1,
    play_parse: true,
    lazy: $js.toString(() => {
        let html1 = request(input);
        let html = JSON.parse(html1.match(/r player_.*?=(.*?)</)[1]);
        let url = html.url;
        let from = html.from;
        if (html.encrypt == "1") {
            url = unescape(url);
        } else if (html.encrypt == "2") {
            url = unescape(base64Decode(url));
        }
        let jx = request(HOST + "/static/player/" + from + ".js").match(/src="(.*?)'/)[1];
        log("jx>>>>>" + jx);
        let jxurl = "http:" + jx + url;
        let videoUrl = request(jxurl).match(/url.*?'(.*?)'/)[1];
        videoUrl = JSON.parse(`"${videoUrl}"`);// 包裹双引号后解析，万能去转义
        log('videoUrl>>>>' + videoUrl)
        input = {url: videoUrl, parse: 0}
    }),
    double: true,
    timeout: 5000,
    class_name: '喜剧片&科幻片&动作片&爱情片&剧情片&战争片&恐怖片&悬疑片&动画片&奇幻片&国产剧&港台剧&日韩剧&欧美剧&国产动漫&日本动漫&欧美动漫&大陆综艺&日韩综艺&',
    class_url: 'xijupian&kehuanpian&dongzuopian&aiqingpian&juqingpian&zhanzhengpian&kongbupian&xuanyipian&donghuapian&qihuanpian&guochanju&gangtaiju&rihanju&oumeiju&guochandongman&ribendongman&oumeidongman&daluzongyi&rihanzongyi&',
    推荐: '*',
    tab_exclude: '榜单|剧情|猜',
    一级: 'ul.gfsd5d li;a&&title;.lazyload&&data-original;span.aecccdfg&&Text;a&&href',
    二级: {
        title: 'h1&&Text',
        img: '.lazyload&&data-original',
        //desc: '主要信息;年代;地区;演员;导演',
        desc: '.dfdgdasdaa&&p:eq(0)&&Text;.dfdgdasdaa&&p:eq(3)&&Text;;.dfdgdasdaa&&p:eq(1)&&Text;.dfdgdasdaa&&p:eq(2)&&Text',
        content: '.dfdgdasdaa&&p.desc&&Text',
        tabs: 'body&&.astdui-padnnel_hd h3',
        lists: 'ul.dfs2_plsdfaylidst:eq(#id)&&li a'
    },
    搜索: $js.toString(() => {
    let html = post(input.split('?')[0], {
        body: input.split('?')[1]
    });
    let items = pdfa(html, 'rss&&item');
    // log(items);
    let d = [];
    items.forEach(it => {
        it = it.replace(/title|link|author|pubdate|description/g, 'p');
        let url = pdfh(it, 'p:eq(1)&&Text');
        d.push({
            title: pdfh(it, 'p&&Text'),
            url: url,
            desc: pdfh(it, 'p:eq(3)&&Text'),
            content: pdfh(it, 'p:eq(2)&&Text'),
            pic_url: "",
        });
    });
    setResult(d);
}),
}
