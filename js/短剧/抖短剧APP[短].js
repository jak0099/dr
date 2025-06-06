var rule = {
    title: '抖短剧',
    host: 'https://csj-sp.csjdeveloper.com',
    url: '/csj_sp/api/v1/shortplay/list?siteid=5437174',
    searchUrl: '**',
    searchable: 2,
    quickSearch: 1,
    filterable: 1,
    headers: { 'User-Agent': MOBILE_UA },
    timeout: 5000,
    class_name: '现言&古言&都市&热血&玄幻&历史',
    class_url: '现言&古言&都市&热血&玄幻&历史',
    play_parse: true,
    lazy: $js.toString(() => {
        if (!input.includes("https://www.toolhelper.cn/")) {
            input={
                parse: 0,
                jx: 0,
                url:input
            }
        } else {
            input = input.replace("https://www.toolhelper.cn/", "")
            function aesDecryptECB(encryptedData, key) {
                const keyCrypto = CryptoJS.enc.Utf8.parse(key);
                const encryptedCrypto = CryptoJS.enc.Base64.parse(encryptedData);
                const decrypted = CryptoJS.AES.decrypt({
                    ciphertext: encryptedCrypto
                }, keyCrypto, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                if (decrypted) {
                    return decrypted.toString(CryptoJS.enc.Utf8);
                }
            }

            function aesEncryptECB(decrypteddata, key) {
                const keyCrypto = CryptoJS.enc.Utf8.parse(key);
                const dataCrypto = CryptoJS.enc.Utf8.parse(decrypteddata);
                const encrypted = CryptoJS.AES.encrypt(dataCrypto, keyCrypto, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                if (encrypted) {
                    return encrypted.toString();
                }
            }
            function hmacSHA256(message, secretKey) {
                const hash = CryptoJS.HmacSHA256(message, secretKey);
                return hash.toString(CryptoJS.enc.Hex);
            }
            let t10 = Math.floor(Date.now() / 1000).toString();
            var key = '7e215d55721ec029';
            var key1 = 'c11b42e542c84ac2c5ed7210183fc0b1';
            var bodyad = 'ac=mobile&os=Android&vod_version=1.10.21.6-tob&os_version=12&lock_ad=20&lock_free=20&type=1&clientVersion=5.5.2&uuid=LN6SS47SESZEUSI7CBVGJRJ5QX6KGSVVEEYC7VPOFTTQGM36SDIA01&resolution=1080*2276&openudid=6fc50bed8200dea8&shortplay_id=' + input.split('?')[1] + '&dt=22021211RC&sha1=A03F3CE220A3848E65415AB72EC23326ED168A70&lock_index=' + input.split('?')[0] + '&os_api=31&install_id=957035142195658&device_brand=Redmi&sdk_version=1.1.3.0&package_name=cn.jufeng66.ddju&siteid=5437174&dev_log_aid=545036&oaid=abec0dfff623201b&timestamp=' + t10;
            var bodyad1 = aesEncryptECB(bodyad, key);
            var bodyad2 = t10 + 'LfvqAfa24hCqNRZn' + bodyad;
            var signaturead = hmacSHA256(bodyad2, key1);
            var url = 'https://csj-sp.csjdeveloper.com/csj_sp/api/v1/pay/ad_unlock?siteid=5437174';
            var headers = {
                'X-Salt': '2555D2C5F23',
                'X-Nonce': 'LfvqAfa24hCqNRZn',
                'X-Timestamp': t10,
                'X-Access-Token': '9211d7c498cabc2db409e3fafb31e74ce4fa4657078a11cc3e51bf055f771591aca67dd0c7396a4f2713dbeb9511206977b9e11bb49207ba4fb2fd7688f686f0ae728ae3499f6789ab423e2a052b8a3daf2211cb38e6c7a4d1acd1d4cb550f17d624ccc45ef742af049df8298f617cd0826aed26ede0b88bcecbf973a5ea33a67eefd0ae39e560385d6be20b44095b33a1e05cd823e9a6d6c014faeafbff4e23ef954ed2df70cd42d2c755a99ee8f3a73b31388c9affe77e462683459043b01d697ef4b505d59d7bdeb7f4345ff19f5d9b09aae080bd8542d6c89efdd41fbc3d066697627a039c73d777a5c9bb5147763b68dff8923cbb360a737be5b471c89b9c441d91bf0364b73db7a90fe1d47a98c0e4f2ab34259863cb42274f8fcc72dd',
                'X-Signature': signaturead,
                'User-Agent': 'Mozilla/5.0 (Linux; Android 12; 22021211RC Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/99.0.4844.88 Mobile Safari/537.36 okhttp/3.9.1 djxsdk/1.1.3.0'
            };
            var htmlad = fetch(url, {
                headers: headers,
                body: bodyad1,
                method: 'POST',
                rejectCoding: true
            });
            var htmlad1 = aesDecryptECB(htmlad, key);
            console.log("ihdb==" + htmlad1)
            var body = `not_include=0&lock_free=${input.split('?')[0]}&type=1&clientVersion=5.5.2&uuid=LN6SS47SESZEUSI7CBVGJRJ5QX6KGSVVEEYC7VPOFTTQGM36SDIA01&resolution=1080*2276&openudid=6fc50bed8200dea8&dt=22021211RC&os_api=31&install_id=957035142195658&sdk_version=1.1.3.0&siteid=5437174&dev_log_aid=545036&oaid=abec0dfff623201b&timestamp=${t10}&direction=0&ac=mobile&os=Android&vod_version=1.10.21.6-tob&os_version=12&count=20&index=${input.split('?')[0]}&shortplay_id=${input.split('?')[1]}&sha1=A03F3CE220A3848E65415AB72EC23326ED168A70&device_brand=Redmi&package_name=cn.jufeng66.ddju`;
            var body1 = aesEncryptECB(body, key);
            var body2 = t10 + 'LfvqAfa24hCqNRZn' + body;
            var signature = hmacSHA256(body2, key1);
            var url = 'https://csj-sp.csjdeveloper.com/csj_sp/api/v1/shortplay/detail?siteid=5437174';
            var headers = {
                'X-Salt': '2555D2C5F23',
                'X-Nonce': 'LfvqAfa24hCqNRZn',
                'X-Timestamp': t10,
                'X-Access-Token': '9211d7c498cabc2db409e3fafb31e74ce4fa4657078a11cc3e51bf055f771591aca67dd0c7396a4f2713dbeb9511206977b9e11bb49207ba4fb2fd7688f686f0ae728ae3499f6789ab423e2a052b8a3daf2211cb38e6c7a4d1acd1d4cb550f17d624ccc45ef742af049df8298f617cd0826aed26ede0b88bcecbf973a5ea33a67eefd0ae39e560385d6be20b44095b33a1e05cd823e9a6d6c014faeafbff4e23ef954ed2df70cd42d2c755a99ee8f3a73b31388c9affe77e462683459043b01d697ef4b505d59d7bdeb7f4345ff19f5d9b09aae080bd8542d6c89efdd41fbc3d066697627a039c73d777a5c9bb5147763b68dff8923cbb360a737be5b471c89b9c441d91bf0364b73db7a90fe1d47a98c0e4f2ab34259863cb42274f8fcc72dd',
                'X-Signature': signature,
                'User-Agent': 'Mozilla/5.0 (Linux; Android 12; 22021211RC Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/99.0.4844.88 Mobile Safari/537.36 okhttp/3.9.1 djxsdk/1.1.3.0'
            };
            var html = fetch(url, {
                headers: headers,
                body: body1,
                method: 'POST',
                rejectCoding: true
            });
            input = {
                parse:0,
                jx:0,
                url:atob(JSON.parse(aesDecryptECB(html, key)).data.list[0].video_model.video_list.video_1.main_url)
            }
        }
    }),
    一级: $js.toString(() => {
        let d = []
        let t10 = Math.floor(Date.now() / 1000).toString();
        var key = '7e215d55721ec029';
        var key1 = 'c11b42e542c84ac2c5ed7210183fc0b1';
        var body = 'ac=mobile&os=Android&vod_version=1.10.21.6-tob&os_version=12&num=20&type=2&clientVersion=5.5.2&uuid=LN6SS47SESZEUSI7CBVGJRJ5QX6KGSVVEEYC7VPOFTTQGM36SDIA01&resolution=1080*2276&openudid=6fc50bed8200dea8&dt=22021211RC&sha1=A03F3CE220A3848E65415AB72EC23326ED168A70&os_api=31&install_id=957035142195658&device_brand=Redmi&sdk_version=1.1.3.0&package_name=cn.jufeng66.ddju&siteid=5437174&dev_log_aid=545036&page=' + MY_PAGE + '&category=' + MY_CATE + '&oaid=abec0dfff623201b&timestamp=' + t10;
        function aesEncryptECB(decrypteddata, key) {
            const keyCrypto = CryptoJS.enc.Utf8.parse(key);
            const dataCrypto = CryptoJS.enc.Utf8.parse(decrypteddata);
            const encrypted = CryptoJS.AES.encrypt(dataCrypto, keyCrypto, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            if (encrypted) {
                return encrypted.toString();
            }
        }
        var body1 = aesEncryptECB(body, key);

        var body2 = t10 + 'LfvqAfa24hCqNRZn' + body;
        function hmacSHA256(message, secretKey) {
            const hash = CryptoJS.HmacSHA256(message, secretKey);
            return hash.toString(CryptoJS.enc.Hex);
        }
        var signature = hmacSHA256(body2, key1);
        var url = 'https://csj-sp.csjdeveloper.com/csj_sp/api/v1/shortplay/list?siteid=5437174';
        var headers = {
            'X-Salt': '2555D2C5F23',
            'X-Nonce': 'LfvqAfa24hCqNRZn',
            'X-Timestamp': t10,
            'X-Access-Token': '9211d7c498cabc2db409e3fafb31e74ce4fa4657078a11cc3e51bf055f771591aca67dd0c7396a4f2713dbeb9511206977b9e11bb49207ba4fb2fd7688f686f0ae728ae3499f6789ab423e2a052b8a3daf2211cb38e6c7a4d1acd1d4cb550f17d624ccc45ef742af049df8298f617cd0826aed26ede0b88bcecbf973a5ea33a67eefd0ae39e560385d6be20b44095b33a1e05cd823e9a6d6c014faeafbff4e23ef954ed2df70cd42d2c755a99ee8f3a73b31388c9affe77e462683459043b01d697ef4b505d59d7bdeb7f4345ff19f5d9b09aae080bd8542d6c89efdd41fbc3d066697627a039c73d777a5c9bb5147763b68dff8923cbb360a737be5b471c89b9c441d91bf0364b73db7a90fe1d47a98c0e4f2ab34259863cb42274f8fcc72dd',
            'X-Signature': signature,
            'User-Agent': 'Mozilla/5.0 (Linux; Android 12; 22021211RC Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/99.0.4844.88 Mobile Safari/537.36 okhttp/3.9.1 djxsdk/1.1.3.0'
        };
        var html = fetch(url, {
            headers: headers,
            body: body1,
            method: 'POST',
            rejectCoding: true
        });
        function aesDecryptECB(encryptedData, key) {
            const keyCrypto = CryptoJS.enc.Utf8.parse(key);
            const encryptedCrypto = CryptoJS.enc.Base64.parse(encryptedData);
            const decrypted = CryptoJS.AES.decrypt({
                ciphertext: encryptedCrypto
            }, keyCrypto, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            if (decrypted) {
                return decrypted.toString(CryptoJS.enc.Utf8);
            }
        }
        var html1 = aesDecryptECB(html, key);
        var list = JSON.parse(html1).data.list;
        list.forEach(data => {
            d.push({
                title: data.title,
                desc: data.total + "集",
                img: data.cover_image,
                url: data.shortplay_id + "#" + data.total
            })
        })
        setResult(d)
    }),
    二级: $js.toString(() => {
        function aesDecryptECB(encryptedData, key) {
            const keyCrypto = CryptoJS.enc.Utf8.parse(key);
            const encryptedCrypto = CryptoJS.enc.Base64.parse(encryptedData);
            const decrypted = CryptoJS.AES.decrypt({
                ciphertext: encryptedCrypto
            }, keyCrypto, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            if (decrypted) {
                return decrypted.toString(CryptoJS.enc.Utf8);
            }
        }

        function aesEncryptECB(decrypteddata, key) {
            const keyCrypto = CryptoJS.enc.Utf8.parse(key);
            const dataCrypto = CryptoJS.enc.Utf8.parse(decrypteddata);
            const encrypted = CryptoJS.AES.encrypt(dataCrypto, keyCrypto, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            if (encrypted) {
                return encrypted.toString();
            }
        }
        function hmacSHA256(message, secretKey) {
            const hash = CryptoJS.HmacSHA256(message, secretKey);
            return hash.toString(CryptoJS.enc.Hex);
        }
        let t10 = Math.floor(Date.now() / 1000).toString();
        var key = '7e215d55721ec029';
        var key1 = 'c11b42e542c84ac2c5ed7210183fc0b1';
        var body = `not_include=0&lock_free=10000&type=1&clientVersion=5.5.2&uuid=LN6SS47SESZEUSI7CBVGJRJ5QX6KGSVVEEYC7VPOFTTQGM36SDIA01&resolution=1080*2276&openudid=6fc50bed8200dea8&dt=22021211RC&os_api=31&install_id=957035142195658&sdk_version=1.1.3.0&siteid=5437174&dev_log_aid=545036&oaid=abec0dfff623201b&timestamp=${t10}&direction=0&ac=mobile&os=Android&vod_version=1.10.21.6-tob&os_version=12&count=${vod_id.split('#')[1]}&index=1&shortplay_id=${vod_id.split('#')[0]}&sha1=A03F3CE220A3848E65415AB72EC23326ED168A70&device_brand=Redmi&package_name=cn.jufeng66.ddju`;
        var body1 = aesEncryptECB(body, key);
        var body2 = t10 + 'LfvqAfa24hCqNRZn' + body;
        var signature = hmacSHA256(body2, key1);
        var url = 'https://csj-sp.csjdeveloper.com/csj_sp/api/v1/shortplay/detail?siteid=5437174';
        var headers = {
            'X-Salt': '2555D2C5F23',
            'X-Nonce': 'LfvqAfa24hCqNRZn',
            'X-Timestamp': t10,
            'X-Access-Token': '9211d7c498cabc2db409e3fafb31e74ce4fa4657078a11cc3e51bf055f771591aca67dd0c7396a4f2713dbeb9511206977b9e11bb49207ba4fb2fd7688f686f0ae728ae3499f6789ab423e2a052b8a3daf2211cb38e6c7a4d1acd1d4cb550f17d624ccc45ef742af049df8298f617cd0826aed26ede0b88bcecbf973a5ea33a67eefd0ae39e560385d6be20b44095b33a1e05cd823e9a6d6c014faeafbff4e23ef954ed2df70cd42d2c755a99ee8f3a73b31388c9affe77e462683459043b01d697ef4b505d59d7bdeb7f4345ff19f5d9b09aae080bd8542d6c89efdd41fbc3d066697627a039c73d777a5c9bb5147763b68dff8923cbb360a737be5b471c89b9c441d91bf0364b73db7a90fe1d47a98c0e4f2ab34259863cb42274f8fcc72dd',
            'X-Signature': signature,
            'User-Agent': 'Mozilla/5.0 (Linux; Android 12; 22021211RC Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/99.0.4844.88 Mobile Safari/537.36 okhttp/3.9.1 djxsdk/1.1.3.0'
        };
        var html = fetch(url, {
            headers: headers,
            body: body1,
            method: 'POST',
            rejectCoding: true
        });
        var data = JSON.parse(aesDecryptECB(html, key)).data.list
        let x = []
        data.forEach(it => {
            try { x.push(it.index + "$" + atob(it.video_model.video_list.video_1.main_url)) }
            catch { x.push(it.index + "$" + "https://www.toolhelper.cn/" + it.index + "?" + vod_id.split('#')[0]) }
        })
        VOD = {
            vod_name: data[0].title,
            vod_remarks: data[0].category_name,
            vod_content: data[0].desc,
            vod_play_from: 'XT短剧',
            vod_play_url: x.join('#')
        }
    }),
    搜索: $js.toString(() => {
        let d = []
        function aesDecryptECB(encryptedData, key) {
            const keyCrypto = CryptoJS.enc.Utf8.parse(key);
            const encryptedCrypto = CryptoJS.enc.Base64.parse(encryptedData);
            const decrypted = CryptoJS.AES.decrypt({
                ciphertext: encryptedCrypto
            }, keyCrypto, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            if (decrypted) {
                return decrypted.toString(CryptoJS.enc.Utf8);
            }
        }

        function aesEncryptECB(decrypteddata, key) {
            const keyCrypto = CryptoJS.enc.Utf8.parse(key);
            const dataCrypto = CryptoJS.enc.Utf8.parse(decrypteddata);
            const encrypted = CryptoJS.AES.encrypt(dataCrypto, keyCrypto, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            if (encrypted) {
                return encrypted.toString();
            }
        }
        function hmacSHA256(message, secretKey) {
            const hash = CryptoJS.HmacSHA256(message, secretKey);
            return hash.toString(CryptoJS.enc.Hex);
        }
        let t10 = Math.floor(Date.now() / 1000).toString();
        var key = '7e215d55721ec029';
        var key1 = 'c11b42e542c84ac2c5ed7210183fc0b1';
        var body = 'ac=mobile&os=Android&vod_version=1.10.21.6-tob&os_version=12&query=' + KEY + '&num=20&type=1&clientVersion=5.5.2&uuid=LN6SS47SESZEUSI7CBVGJRJ5QX6KGSVVEEYC7VPOFTTQGM36SDIA01&resolution=1080*2276&is_fuzzy=1&openudid=6fc50bed8200dea8&dt=22021211RC&sha1=A03F3CE220A3848E65415AB72EC23326ED168A70&os_api=31&install_id=957035142195658&device_brand=Redmi&sdk_version=1.1.3.0&package_name=cn.jufeng66.ddju&siteid=5437174&dev_log_aid=545036&page=' + MY_PAGE + '&oaid=abec0dfff623201b&timestamp=' + t10;
        var body1 = aesEncryptECB(body, key);
        var body2 = t10 + 'LfvqAfa24hCqNRZn' + body;
        var signature = hmacSHA256(body2, key1);
        var url = 'https://csj-sp.csjdeveloper.com/csj_sp/api/v1/shortplay/search?siteid=5437174';
        var headers = {
            'X-Salt': '2555D2C5F23',
            'X-Nonce': 'LfvqAfa24hCqNRZn',
            'X-Timestamp': t10,
            'X-Access-Token': '9211d7c498cabc2db409e3fafb31e74ce4fa4657078a11cc3e51bf055f771591aca67dd0c7396a4f2713dbeb9511206977b9e11bb49207ba4fb2fd7688f686f0ae728ae3499f6789ab423e2a052b8a3daf2211cb38e6c7a4d1acd1d4cb550f17d624ccc45ef742af049df8298f617cd0826aed26ede0b88bcecbf973a5ea33a67eefd0ae39e560385d6be20b44095b33a1e05cd823e9a6d6c014faeafbff4e23ef954ed2df70cd42d2c755a99ee8f3a73b31388c9affe77e462683459043b01d697ef4b505d59d7bdeb7f4345ff19f5d9b09aae080bd8542d6c89efdd41fbc3d066697627a039c73d777a5c9bb5147763b68dff8923cbb360a737be5b471c89b9c441d91bf0364b73db7a90fe1d47a98c0e4f2ab34259863cb42274f8fcc72dd',
            'X-Signature': signature,
            'User-Agent': 'Mozilla/5.0 (Linux; Android 12; 22021211RC Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/99.0.4844.88 Mobile Safari/537.36 okhttp/3.9.1 djxsdk/1.1.3.0'
        };
        var html = fetch(url, {
            headers: headers,
            body: body1,
            method: 'POST',
            rejectCoding: true
        });
        var html1 = aesDecryptECB(html, key);
        var list = JSON.parse(html1).data.list;
        list.forEach(data => {
            d.push({
                title: data.title,
                desc: data.total + "集",
                img: data.cover_image,
                url: data.shortplay_id + "#" + data.total
            })
        })
        setResult(d)
    }),
}