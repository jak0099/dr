预处理: $js.toString(() => {
        rule_fetch_params.headers.Cookie = 'cookie';
        let new_html = request(HOST);
        if (/安全防护系统|本网站目前正遭受CC攻击/.test(new_html)) {
            let new_src = pdfh(new_html, 'script[src*="_waf"]&&src');
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
                let yz_url = HOST + '/_waf/_6dfde0453966df39eb204b4ed05b317a.sjs?type=ad82060c2e67cc7e2cc47552a4fc1242&key=' + key + '&value=' + md5value;
                hhtml = request(yz_url, { withHeaders: true});
                json = JSON.parse(hhtml);
                let setCk = Object.keys(json).find(it => it.toLowerCase() === 'set-cookie');
                let cookie = setCk ? json[setCk].split(';')[0] : '';
                rule_fetch_params.headers.Cookie = cookie;                
                setItem(RULE_CK, cookie);
            }
        }
    }),