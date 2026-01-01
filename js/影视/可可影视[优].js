var rule = {
    title: '可可影视[优]',
    host: 'https://www.kkys01.com',
    //host: 'https://www.kkys01.com',
    url: '/show/fyclass-fyfilter-fypage.html',
    filter_url: '{{fl.class}}-{{fl.area}}-{{fl.lang}}-{{fl.year}}-{{fl.by}}',
    searchUrl: '/search?k=**&page=fypage&t=',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    headers: {
        'User-Agent': 'MOBILE_UA',
        'Referer': HOST + '/',
        'X-Forwarded-For': `119.${Math.floor(Math.random()*254)+1}.${Math.floor(Math.random()*254)+1}.${Math.floor(Math.random()*254)+1}`
    
    },
    class_parse: '#nav-swiper&&.nav-swiper-slide;a&&Text;a&&href;/(\\w+).html',
    cate_exclude: 'Netflix|今日更新|专题列表|排行榜',
    tab_exclude: '可可影视提供',
    tab_remove: ['4K(高峰不卡)'],
    play_parse: true,
    limit: 9,
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
    预处理: $js.toString(() => {
        let hash = request(rule.host,{headers: rule.headers})?.match(/a0_0x2a54\s*=\s*\['([^']+)'/)?.[1]?.trim() ?? '';
        if (hash && hash !== getItem('myhash')) {
            setItem('mycookie', '');
            setItem('myhash', '');
            let idx = parseInt('0x' + hash[0], 16);
            for (let i = 0; i < 1000000; i++) {
                let input = hash + i;
                let sha1 = CryptoJS.SHA1(input).toString(CryptoJS.enc.Latin1);
                if (sha1.charCodeAt(idx) === 0xb0 && sha1.charCodeAt(idx + 1) === 0x0b) {
                    let cookie = `cdndefend_js_cookie=${input}`;
                    setItem('myhash', hash);
                    setItem('mycookie', cookie);
                    rule.headers['cookie'] = cookie;
                    break;
                }
            }
        } else if (getItem('mycookie')) {
            rule.headers['cookie'] = getItem('mycookie');
        }
        let khtml = fetch(rule.host, {headers: rule.headers});
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
            rule.图片替换 = rule.host + '=>' + rule.img_host;
        }
    }),
    推荐: '*',
    一级: '.module-item;.v-item-title:eq(1)&&Text;img:eq(-1)&&data-original;span:eq(-1)&&Text;a&&href',
    搜索:'.search-result-item;img&&alt;img&&data-original;.search-result-item-header&&Text;a&&href',    
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
    filter: 'H4sIAAAAAAAAA+2Z308bRxDH3/1XVH7mwQba4rz1oZUqVXlpHypFUeRWbhWVulJoqyKEZLANxhBskGPi2AVSMJgE/4Agx5yx/c/c3p3/i66ZndlzUk1OCYmU6l4Qn/nur9ud3ZldLwSC4eCtT+4EFoK/xOaDt4I/zkbn5oITwXj015hE+6wrdtcl/xmd/UMa7iwE49Is0rVhsjYySwguToD1duz3n2bv/6XMt7/87qtvvv6eVLF2bCXTSlRAWrEiLagBkJatmb0KagCo2Zkz3aYC1KylvJUoKk0BacmstfwENQBqM9u0e8+wTQDSjrfEZRc1AGpz+dQubmGbAPQN1VVdTwFpK9vD0glqANRm5rFprGGbAFRvc0XkzrEeAGm5Q+eA5hqAtEZbGHXUAFAzr/adRktpCmgs9SOzv49jAdDahpPZJe0aaM726vbaKs4ZgGtt7UJXr+0ISEsN7OdV1ABQc5Y2RMVQmoLFu4sT5MbRB7Go9mJRaYkNw6MXi8PjYWkF56BTF+WeMmGJ4VHJ6jTHSiiTnv+WddkfbwNMNCv9TWnEWQGg2dypWpVTnE0A6nvvRNdTQLOyfqY1BdTmi0daU0Cj7b/UmgLSHraEcYQagG6z5W6z5a5ndi6HVE8BffvWrkh38NsBqL+XF051gP0BaG/Zt9YHcjHIYZCp10HK7u1YRVocYhpzKicriAxuOM1UolmQaO20sQSx69QRrYJI40bRTCtRHdg56eklXAxi6qX/Avo1DTqH3Cb65nTb7OIppmDM02ej8Z+1pzvNulNLePX0ck+Wx7YB6BvPD7WmwOVnWlPg8l2tKXD5rtYUuPzTVQ/A8xzMx6IPXLv98sLs9jzOwWRo8lNlu/7XZZ/W9mm3fUrbp9z2SW2fdNvD2h5220PaHiJ7OHQ9/APSwqF78k+ECoReLRAaFQjpApHxAuFIJHRP/tEFZl4tMDMqMKMLWOULawc3yEj7PDI+3z/M69m2NreFkXtttu3ulchnsAvddCVhFXHfTLrNdhJXX0+q00yJDB7F06MxBO5OBGS995SxKPKSsXCZB5fNcNkFm0FwEZ3JkLhoz2VBXMYyClf0fQq8ZEhcxsJlOqMwR/0p8JKVyJNQr5ECL9khl5ENkz3RWcaxANxwVkLm4A1nJVzu8Lb5CJdXcPkIm3O8MXviMg8uY/GjqR9N/Wg6Hk2nbyya2sYz0XuEXg5AWmXPNAz7OIEyMQ2v0dK1FZCWOhO5A11bs6fXBe6mzMRq7jZslzvigC4AADTa7LJdbuBQAbzclLm44wzyMrJjmwCofRuLzv0WV5oCT68ZzM3cyu/ap5SLAJBWemJeUd4A4N++/djixxY/tozHlqkPdVPL1qzEknX1fOw1UZs8RQnuLZJ7n2ZObfZmxt2wuFsU8y7KndrsjZW5JXJRQrqC85RCOoCOkFmrhPcYBV5uunY353odBKB6+09Fmc4eANS+iN+XbgUS/O8ldprGuajnMVYA0Cn497b1GGdagb4/rss5xJEAeLmT/ued+4ZiJxe53hxX3y1qvtvt03+59l+u/XzIz4f+7/nQZ2+RD2mze/WHiRXnH/JIANoBhYpoYPxRQAMr5WW0wh0AQPVOBk47i/UAqL/Vh3ZhD/sD8JJVsb+YM3GSzVaYrIr9xZzL1NJt0UjqnTqCj3anflCPH7l2YPFflpCCHEkiAAA='
}