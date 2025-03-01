var rule = {
    title: '抖短剧[短]',
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
            input
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
                'X-Access-Token': '4c84bc57cc372c53efd9c02ec03bb340fc3308ba5ed5f54f3f45fa00379518be99e093be1a3951f523090b1c978247280cdca0049388b529521c5596d062c9d800ea994119f6808a44e04de4296cddf20bfa8343ace17fbf8a3fb449be4cba87e24b797b126f339ca145836fef1895f14bebb55e667b6e8282a8074ab5b0684c8820cbbc905a6cd4eb25d6f722482ae188d27a5d1f7163e7b9398396f637c66d42f5ca87d6780059e32b39455e187239f42ebd08b6426ff90f2452c0b798da864a7d4e1c073de8c852f7b3b5daa52ae683c1f388e3ef62bc8f495f8630cad2a5af7773d1237213813bb6fa650baf1766beb845b01789db012e2ec85fd0cf658cac0e167cc819124a36e73eefb27032e25dd4835507eaa110dc9936894c86021c',
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
                'X-Access-Token': '4c84bc57cc372c53efd9c02ec03bb340fc3308ba5ed5f54f3f45fa00379518be99e093be1a3951f523090b1c978247280cdca0049388b529521c5596d062c9d800ea994119f6808a44e04de4296cddf20bfa8343ace17fbf8a3fb449be4cba87e24b797b126f339ca145836fef1895f14bebb55e667b6e8282a8074ab5b0684c8820cbbc905a6cd4eb25d6f722482ae188d27a5d1f7163e7b9398396f637c66d42f5ca87d6780059e32b39455e187239f42ebd08b6426ff90f2452c0b798da864a7d4e1c073de8c852f7b3b5daa52ae683c1f388e3ef62bc8f495f8630cad2a5af7773d1237213813bb6fa650baf1766beb845b01789db012e2ec85fd0cf658cac0e167cc819124a36e73eefb27032e25dd4835507eaa110dc9936894c86021c',
                'X-Signature': signature,
                'User-Agent': 'Mozilla/5.0 (Linux; Android 12; 22021211RC Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/99.0.4844.88 Mobile Safari/537.36 okhttp/3.9.1 djxsdk/1.1.3.0'
            };
            var html = fetch(url, {
                headers: headers,
                body: body1,
                method: 'POST',
                rejectCoding: true
            });
            input = atob(JSON.parse(aesDecryptECB(html, key)).data.list[0].video_model.video_list.video_1.main_url)
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
            'X-Access-Token': '4c84bc57cc372c53efd9c02ec03bb340fc3308ba5ed5f54f3f45fa00379518be99e093be1a3951f523090b1c978247280cdca0049388b529521c5596d062c9d800ea994119f6808a44e04de4296cddf20bfa8343ace17fbf8a3fb449be4cba87e24b797b126f339ca145836fef1895f14bebb55e667b6e8282a8074ab5b0684c8820cbbc905a6cd4eb25d6f722482ae188d27a5d1f7163e7b9398396f637c66d42f5ca87d6780059e32b39455e187239f42ebd08b6426ff90f2452c0b798da864a7d4e1c073de8c852f7b3b5daa52ae683c1f388e3ef62bc8f495f8630cad2a5af7773d1237213813bb6fa650baf1766beb845b01789db012e2ec85fd0cf658cac0e167cc819124a36e73eefb27032e25dd4835507eaa110dc9936894c86021c',
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
            'X-Access-Token': '4c84bc57cc372c53efd9c02ec03bb340fc3308ba5ed5f54f3f45fa00379518be99e093be1a3951f523090b1c978247280cdca0049388b529521c5596d062c9d800ea994119f6808a44e04de4296cddf20bfa8343ace17fbf8a3fb449be4cba87e24b797b126f339ca145836fef1895f14bebb55e667b6e8282a8074ab5b0684c8820cbbc905a6cd4eb25d6f722482ae188d27a5d1f7163e7b9398396f637c66d42f5ca87d6780059e32b39455e187239f42ebd08b6426ff90f2452c0b798da864a7d4e1c073de8c852f7b3b5daa52ae683c1f388e3ef62bc8f495f8630cad2a5af7773d1237213813bb6fa650baf1766beb845b01789db012e2ec85fd0cf658cac0e167cc819124a36e73eefb27032e25dd4835507eaa110dc9936894c86021c',
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
            'X-Access-Token': '4c84bc57cc372c53efd9c02ec03bb340fc3308ba5ed5f54f3f45fa00379518be99e093be1a3951f523090b1c978247280cdca0049388b529521c5596d062c9d800ea994119f6808a44e04de4296cddf20bfa8343ace17fbf8a3fb449be4cba87e24b797b126f339ca145836fef1895f14bebb55e667b6e8282a8074ab5b0684c8820cbbc905a6cd4eb25d6f722482ae188d27a5d1f7163e7b9398396f637c66d42f5ca87d6780059e32b39455e187239f42ebd08b6426ff90f2452c0b798da864a7d4e1c073de8c852f7b3b5daa52ae683c1f388e3ef62bc8f495f8630cad2a5af7773d1237213813bb6fa650baf1766beb845b01789db012e2ec85fd0cf658cac0e167cc819124a36e73eefb27032e25dd4835507eaa110dc9936894c86021c',
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