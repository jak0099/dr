var rule = {
    //定义获取图片地址域名变量
    img_host: '',
    author: '小可乐/2509/第二版',
    title: '可可影视',
    类型: '影视',
    host: 'https://www.keke5.app',
    headers: {
        'User-Agent': 'MOBILE_UA',
        'Referer': 'https://www.keke5.app/'
    },
    编码: 'utf-8',
    timeout: 5000,
    homeUrl: '/',
    url: '/show/fyclass-----3-fypage.html',    
    searchUrl: '/search?k=**&page=fypage&t=',
    detailUrl: '',
    limit: 9,
    double: false,
    class_name: '电影&剧集&综艺&动漫&短剧',
    class_url: '1&2&4&3&6',
    预处理: $js.toString(() => {
        const sha1ToUint8ArrayLatin1 = str => {
            if (typeof str !== 'string') {
                return null;
            }
            try {
                let latin1Str = CryptoJS.SHA1(str).toString(CryptoJS.enc.Latin1);
                let u8Array = Uint8Array.from(latin1Str, char => char.charCodeAt(0));
                return u8Array;
            } catch (e) {
                return null;
            }
        }
        //1.原正则：/a0_0x2a54\s*=\s*\['([^']+)'/  2.针对十六进制正则：/a0_0x2a54\s*=\s*\[['"]([A-F0-9]+)['"]/  3.通用性强正则：/a0_0x2a54\s*=\s*\[['"]([^'"]+)['"]/
        let hashPre = request(HOST)?.match(/a0_0x2a54\s*=\s*\[['"]([^'"]+)['"]/)?.[1]?.trim() ?? '';
        if (hashPre != '' && hashPre != getItem('hashpre')) {
            setItem('tgcookie', '');
            setItem('hashpre', '');
            let hashIdx = parseInt('0x' + hashPre[0], 16);
            if (Number.isInteger(hashIdx) && hashIdx >= 0 && hashIdx <= 18) {
                let cookieFound = false;
                let maxLoop = 100000;
                for (let i = 0; i < maxLoop && !cookieFound; i++) {
                    let hashInput = `${hashPre}${i}`;
                    let sha1Arr = sha1ToUint8ArrayLatin1(hashInput);
                    if (sha1Arr && sha1Arr[hashIdx] === 0xb0 && sha1Arr[hashIdx + 1] === 0x0b) {
                        let defendCookie = `cdndefend_js_cookie=${hashInput}`;
                        setItem('hashpre', hashPre);
                        setItem('tgcookie', defendCookie);
                        cookieFound = true;
                    }
                }
            }
        }
        if (getItem('tgcookie')) {
            rule_fetch_params.headers['cookie'] = getItem('tgcookie');
        }
        let khtml = fetch(HOST, {
            headers: rule_fetch_params.headers
        });
        let tValue = khtml.match(/<input[^>]*name="t"[^>]*value="([^"]*)"/i);
        if (tValue && tValue[1]) {
            rule.searchUrl = rule.searchUrl + encodeURIComponent(tValue[1]);
        }
        let scripts = pdfa(khtml, 'script');
        let img_script = scripts.find((it) => pdfh(it, 'script&&src').includes('rdul.js'));
        if (img_script) {
            let img_url = img_script.match(/src="(.*?)"/)[1];
            let img_html = fetch(img_url);
            rule.img_host = img_html.match(/'(.*?)'/)[1];
            rule.图片替换 = HOST + '=>' + rule.img_host;
        }
    }),
    推荐: '*',
    一级: '.module-item;.v-item-title:eq(1)&&Text;img:eq(-1)&&data-original;span:eq(-1)&&Text;a&&href',
    搜索: $js.toString(() => {
        let t = pdfh(fetch(input), 'input:eq(0)&&value');
        input = input.split('?')[0];
        let surl = `${input}?k=${KEY}&page=${MY_PAGE}&t=${t}`;
        let khtml = fetch(surl);
        VODS = [];
        let klists = pdfa(khtml, '.search-result-item');
        klists.forEach((it) => {
            VODS.push({
                vod_name: pdfh(it, 'img&&alt'),
                vod_pic: pd(it, 'img&&data-original', rule.img_host),
                vod_remarks: pdfh(it, '.search-result-item-header&&Text'),
                vod_id: pdfh(it, 'a&&href')
            });
        });
    }),
    二级: {
        title: '.detail-title&&strong:eq(1)&&Text;.detail-tags&&Text',
        img: '.detail-pic&&img&&data-original',
        desc: '.detail-info-row-main:eq(-2)&&Text;.detail-tags-item:eq(0)&&Text;.detail-tags-item:eq(1)&&Text;.detail-info-row-main:eq(1)&&Text;.detail-info-row-main:eq(0)&&Text',
        content: '.detail-desc&&Text',
        tabs: '.source-item',
        tab_text: 'span:eq(-1)&&Text',
        lists: '.episode-list:eq(#id)&&a',
        list_text: 'body&&Text',
        list_url: 'a&&href',
    },
    tab_remove: ['4K(高峰不卡)'],
    play_parse: true,
    lazy: $js.toString(() => {
        let kurl = input;
        let khtml = request(kurl);
        if (/dujia/.test(khtml)) {
            kurl = khtml.split("PPPP = '")[1].split("';")[0];
            const key = CryptoJS.enc.Utf8.parse('Isu7fOAvI6!&IKpAbVdhf&^F');
            const dataObj = {
                ciphertext: CryptoJS.enc.Base64.parse(kurl)
            };
            const decrypted = CryptoJS.AES.decrypt(dataObj, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            kurl = decrypted.toString(CryptoJS.enc.Utf8);
        } else {
            kurl = khtml.split('src: "')[1].split('",')[0];
        }
        input = {
            jx: 0,
            parse: 0,
            url: kurl,
            header: rule.headers
        };
    }),
}