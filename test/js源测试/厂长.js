var rule = {
    title: '厂长资源',
    host:'https://www.cz4k.com',
    url: '/fyclass/page/fypage',
    searchUrl: '/boss1O1?q=**&f=_all&p=fypage',    
    searchable: 2,
    filterable: 0,
    headers: {
        'User-Agent': 'PC_UA',
    },
    class_name: '全部&高分影视&最新电影&电影&电视剧&动画&国产剧&日剧&韩剧&美剧&海外剧&俄罗斯电影&加拿大电影&华语电影&印度电影&日本电影&欧美电影&韩国电影',
    class_url: 'movie_bt&gaofenyingshi&zuixindianying&/movie_bt_series/dyy&/movie_bt_series/dianshiju&/movie_bt_series/dohua&/movie_bt_series/guochanju&/movie_bt_series/rj&/movie_bt_series/hj&/movie_bt_series/mj&/movie_bt_series/hwj&/movie_bt_series/eluosidianying&/movie_bt_series/jianadadianying&/movie_bt_series/huayudianying&/movie_bt_series/yindudianying&/movie_bt_series/ribendianying&/movie_bt_series/meiguodianying&/movie_bt_series/hanguodianying',
    play_parse: true,

    // lazy代码:源于海阔香雅情大佬 / 小程序：香情影视 https://pastebin.com/L4tHdvFn
    lazy: `js:
        pdfh = jsp.pdfh;
        var html = request(input);
        var ohtml = pdfh(html, '.videoplay&&Html');
        var url = pdfh(ohtml, "body&&iframe&&src");
        if (url) {
            var _obj={};
            eval(pdfh(request(url),'body&&script&&Html')+'\\n_obj.player=player;_obj.rand=rand');
            function js_decrypt(str, tokenkey, tokeniv) {
                eval(getCryptoJS());
                var key = CryptoJS.enc.Utf8.parse(tokenkey);
                var iv = CryptoJS.enc.Utf8.parse(tokeniv);
                return CryptoJS.AES.decrypt(str, key, {iv: iv,padding: CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);
            };
            let config = JSON.parse(js_decrypt(_obj.player,'VFBTzdujpR9FWBhe', _obj.rand));
            input = {
                 jx: 0,
                 url: config.url,
                 parse: 0
            };
        }else if (/decrypted/.test(ohtml)) {
            var phtml = pdfh(ohtml, "body&&script:not([src])&&Html");
            eval(getCryptoJS());
            var script = phtml.match(/var.*?\\)\\);/g)[0];
            var data = [];
            eval(script.replace(/md5/g, 'CryptoJS').replace('eval', 'data = '));
            input = {
                jx: 0,
                url: data.match(/url:.*?['"](.*?)['"]/)[1],
                parse: 0
            }


        } 
    `,
    推荐: '.bt_img;ul&&li;*;*;*;*',
    double: true,
    一级: '.bt_img&&ul&&li;h3.dytit&&Text;img.lazy&&data-original;.jidi&&Text;a&&href',
    二级: {
        "title": "h1&&Text;.moviedteail_list li&&a&&Text",
        "img": "div.dyimg img&&src",
        "desc": ".moviedteail_list li:eq(3) a&&Text;.moviedteail_list li:eq(2) a&&Text;.moviedteail_list li:eq(1) a&&Text;.moviedteail_list li:eq(7)&&Text;.moviedteail_list li:eq(5)&&Text",
        "content": ".yp_context&&Text",
        "tabs": ".mi_paly_box span",
        "lists": ".paly_list_btn:eq(#id) a"
    },
    搜索: `.search_list li;img&&alt;img&&src;;a&&href`,
}
