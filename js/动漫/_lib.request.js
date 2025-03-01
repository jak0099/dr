const iconv = require('iconv-lite');

async function requestHtml(url, options) {
    try {
        let html = (await req(url, options)).content;
        // log(html);
        return html
    } catch (e) {
        log(`requestHtml error:${e.message}`);
        return ''
    }

}

async function requestJson(url, options) {
    try {
        let html = (await req(url, options)).content;
        return JSON.parse(html)
    } catch (e) {
        log(`requestJson error:${e.message}`);
        return {}
    }
}

async function getPublicIp() {
    let ip_obj = await requestJson('http://httpbin.org/ip');
    // log('ip_obj:',ip_obj);
    return ip_obj.origin
}

async function getHtml(config) {
    try {
        return await axios.request(typeof config === "string" ? config : {
            url: config.url,
            method: config.method || 'GET',
            headers: config.headers || {
                'User-Agent': PC_UA
            },
            data: config.data || '',
            responseType: config.responseType || '',//'arraybuffer'
        })
    } catch (e) {
        return e.response
    }

}

async function req_(reqUrl, mt, headers, data) {
    let config = {
        method: mt || 'Get',
        url: reqUrl,
        headers: headers || {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1931 Build/PQ3A.190605.05081124; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36 QSTAPP/1.6.9 Html5Plus/1.0',
        },
        data: data || '',
    };
    let res = await axios.request(config);
    return res.data;
}

async function req_encoding(reqUrl, mt, headers, encoding, data) {
    let config = {
        method: mt || 'Get',
        url: reqUrl,
        headers: headers || {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1931 Build/PQ3A.190605.05081124; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36 QSTAPP/1.6.9 Html5Plus/1.0',
        },
        data: data || '',
        responseType: 'arraybuffer'
    };
    let res = await axios.request(config);
    if (encoding) {
        res.data = iconv.decode(res.data, encoding);
    }
    return res.data;
}

async function req_proxy(reqUrl, mt, headers, data) {
    let config = {
        method: mt || 'Get',
        url: reqUrl,
        headers: headers || {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1931 Build/PQ3A.190605.05081124; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36 QSTAPP/1.6.9 Html5Plus/1.0',
        },
        proxy: {
            protocol: 'http',
            host: '127.0.0.1',
            port: "7890"
        }
    };
    if (data) {
        config.data = data;
    }
    let res = await axios.request(config);
    return res.data;
}

$.exports = {
    requestHtml,
    requestJson,
    getPublicIp,
    getHtml,
    req_,
    req_encoding,
    req_proxy,
    // axios // 没法import系统库
}
