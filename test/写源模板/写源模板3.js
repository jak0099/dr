var rule = {
    类型:'影视',//影视|听书|漫画|小说
    title:'规则标题',
    编码:'utf-8',
    搜索编码:'utf-8',
    host:'网页的域名根',
    hostJs:'print(HOST);let html=request(HOST,{headers:{"User-Agent":PC_UA}});let src = jsp.pdfh(html,"ul&&li&&a&&href");print(src);HOST=src.replace("/index.php","")',
    homeUrl:'/latest/',
    url:'/fyclass/fypage.html[/fyclass/]',
    detailUrl:'https://yanetflix.com/voddetail/fyid.html',
    searchUrl:'',
    searchable:2,
    quickSearch:0,
    filterable:1,
    filter:{},
    filter_def:{
        1:{
        年份:'2024',
        },
    },
    filter_url:'style={{fl.style}}&zone={{fl.zone}}&year={{fl.year}}&fee={{fl.fee}}&order={{fl.order}}',
    headers:{
        'User-Agent':'MOBILE_UA',
        "Cookie": "searchneed=ok"
    },
    timeout:5000,
    class_name:'电影&电视剧&动漫&综艺',
    class_url:'1&2&3&4',
    class_parse:'#side-menu:lt(1) li;a&&Text;a&&href;com/(.*?)/',
    cate_exclude:'',
    tab_exclude:'',
    tab_remove:['tkm3u8'],
    tab_order:['lzm3u8','wjm3u8','1080zyk','zuidam3u8','snm3u8'],
    tab_rename:{'lzm3u8':'量子','1080zyk':'1080看','zuidam3u8':'最大资源','kuaikan':'快看',
    'bfzym3u8':'暴风','ffm3u8':'非凡','snm3u8':'索尼','tpm3u8':'淘片','tkm3u8':'天空',},
    play_parse:true,
    play_json:[{
        re:'*',
        json:{
            jx:1,
            parse:1,
        },
    }],
    pagecount:{"1":1,"2":1,"3":1,"4":1,"5":1,"7":1,"时间表":1},
    lazy:'',
    limit:6,
    double:true,
    图片来源:'@Referer=http://www.jianpianapp.com@User-Agent=jianpian-version350',
    图片替换:'https://www.keke6.app/=>https://vres.a357899.cn/',
    预处理:'rule_fetch_params.headers.Cookie = "xxxx";',
    推荐:'列表;标题;图片;描述;链接;详情',
    一级:'列表;标题;图片;描述;链接;详情',
    二级访问前:'log(MY_URL);let jump=request(MY_URL).match(/href="(.*?)"/)[1];log(jump);MY_URL=urljoin2(MY_URL,jump)',
    二级:{
      title:'vod_name;vod_type',
      img:'图片链接',
      desc:'主要信息;年代;地区;演员;导演',
      content:'简介',
      tabs:'',
      lists:'',
      tab_text:'body&&Text',
      list_text:'body&&Text',
      list_url:'a&&href',
      list_url_prefix: '',
    },
    搜索:'列表;标题;图片;描述;链接;详情',
    proxy_rule:`js:
    log(input);
    input = [200,'text;plain','hello drpy']
    `,
    sniffer:1,
    isVideo:"http((?!http).){26,}\.(m3u8|mp4|flv|avi|mkv|wmv|mpg|mpeg|mov|ts|3gp|rm|rmvb|asf|m4a|mp3|wma)",
    isVideo:`js:
    log(input);
    if(/m3u8/.test(input)){
    input = true
    }else{
    input = false
    }
    `,
}