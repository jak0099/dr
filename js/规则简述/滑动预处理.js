预处理: $js.toString(() => {
        const SLIDE_CK = 'slide_cookie';
        let huadong_Cookie = getItem(SLIDE_CK);
        if (huadong_Cookie) {
            rule_fetch_params.headers.Cookie = huadong_Cookie;
        }
        let new_html = request(HOST);
        if (/人机身份验证/.test(new_html)) {
            let new_src = pdfh(new_html, 'script[src*="huadong"]&&src');
            if (new_src) {
                if (!new_src.startsWith('http')) {
                    new_src = new_src.startsWith('/') ? HOST + new_src : HOST + '/' + new_src;
                }
                let hhtml = request(new_src, {
                    withHeaders: true
                });
                let json = JSON.parse(hhtml);
                let scriptHtml = json.body;
                let key = scriptHtml.split('key="')[1]?.split('"')[0] || '';
                let value = scriptHtml.split('value="')[1]?.split('"')[0] || '';
                let val = "";
                for (let i = 0; i < value.length; i++) {
                    val += (value.charCodeAt(i) + 1).toString();
                }
                let md5value = md5(val);
                let yz_url = HOST + '/a20be899_96a6_40b2_88ba_32f1f75f1552_yanzheng_huadong.php?type=ad82060c2e67cc7e2cc47552a4fc1242&key=' + key + '&value=' + md5value;
                hhtml = request(yz_url, { withHeaders: true});
                json = JSON.parse(hhtml);
                let setCk = Object.keys(json).find(it => it.toLowerCase() === 'set-cookie');
                let huadong_cookie = setCk ? json[setCk].split(';')[0] : '';
                rule_fetch_params.headers.Cookie = huadong_cookie;
                setItem(SLIDE_CK, huadong_cookie);
            }
        }
    }),