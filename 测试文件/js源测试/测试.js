var rule = {
    title: '可可影视[优]',
    host:`https://www.${Math.random() < 0.5 ? 'keke8' : 'keke5'}.app`,
    url: '/show/fyclass-fyfilter-fypage.html',
    filter_url: '{{fl.类型}}-{{fl.地区}}-{{fl.语言}}-{{fl.年份}}-{{fl.排序}}',
    searchUrl: '/search?k=**&page=fypage',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    headers: {
        'User-Agent': 'UC_UA',
        'Referer': rule.host + '/',
        'X-Forwarded-For': `119.${Math.random()*255|0}.${Math.random()*255|0}.${Math.random()*255|0}`
    },
    class_parse: '#nav-swiper&&.nav-swiper-slide;a&&Text;a&&href;/(\\w+).html',
    cate_exclude: 'Netflix|今日更新|专题列表|排行榜',
    tab_exclude: '可可影视提供',
    tab_order: ['超清', '蓝光', '极速蓝光'],
    tab_remove: ['4K(高峰不卡)'],
    play_parse: true,
    lazy: `js:
        let html = request(input);
        let m3u8 = pdfh(html, 'script:contains(m3u8)').match(/http[^'"]+?m3u8/)?.[0];
        if (m3u8) {
            // 过滤广告片段
            let m3u8Content = request(m3u8, {headers: {'Referer': rule.host}});
            m3u8Content = m3u8Content.replace(/[#]EXTINF.*\\n(http[^\\n]+ad[^\\n]+\\n?)/gi, '');
            input = {parse:0, url: m3u8, header: {'Referer': rule.host}};
        }
    `,
    limit: 20,
    推荐: '.section-box:eq(2)&&.module-box-inner&&.module-item;*;*;*;*',
    double: false,
    一级: '.module-box-inner&&.module-item;.v-item-title:eq(1)&&Text;img:last-of-type&&data-original;.v-item-bottom&&span&&Text;a&&href',
    二级: {
        title: '.detail-pic&&img&&alt;.detail-tags&&a&&Text',
        img: '.detail-pic&&img&&data-original',
        desc: ';;;.detail-info-row-main:eq(1)&&Text;.detail-info-row-main&&Text', // 精简描述信息
        content: '.detail-desc&&Text',
        tabs: 'body&&.source-item-label:not(:contains("广告"))', // 排除广告标签
        lists: '.episode-list:eq(#id) a:not([href*="ad"])', // 过滤广告链接
    },
    搜索: '.search-result-list&&a;h3&&Text;.lazyload&&data-original;.info:eq(0)&&Text;a&&href;.info:eq(1)&&Text',
    预处理: `js:
        let html = request(rule.host);
        let img_script = pdfa(html, 'script').find(it => pdfh(it, 'script&&src').includes('rdul.js'));
        if (img_script) {
            let img_url = img_script.match(/src="(.*?)"/)[1];
            let img_html = request(img_url);
            let img_host = img_html.match(/'([^']+)'/)[1];
            rule.图片替换 = rule.host + '=>' + img_host;
        }
    `,
    filter: 'H4sIAAAAAAAAA+2Zz08bRxTH/xefOdgGtTi3HlqpUpVLe6hURREHV4qa0kN/qFWEZLANxhBsEDFx7AIpGEyCf0CQY9bY/md2Ztf/RWf95r0ZR+3LtqGRqviC+LzvzOzs7Nt539k/isQid755FPku+VvkTsS76In9jchMZHHh+6TNvyw8/Dk5briowiJbH6XrQVhBZGkGoveTP3378MGvOnz3068+++Lzr0kV66cyndWiBtJKVRVBDYC0fN3tV1EDQM3LXZgxNaAml4syVdKaBtLSebnyDDUAGjPf8vovcEwA0k63xXUPNQAac+XcK23jmAB0D7U1008Daas7o/IZagA0Zu6p66zjmADUb2tVFC6xHwBphWP/iNYagLRmRzgN1ABQc28O/WZbaxpoLo0Td3CIcwEw2qaf2ydtDLRmBw1vfQ3XDMB6tt5uzzzbAEjLDL2XNdQAUPOXN0XV0ZqGpXuBCmksqm2x6Zg0Jg6TxuL4dFRexUXoNkSlr0PYYnRSlt3WRAsdMg+gLa8Hk2NAiJZlsKWCuCwAtJx7NVk9x+UEoGsfnJl+GmhZNi6MpoHGfPXEaBpotoPXRtNA2uO2cE5QAzBjtu0x23Y/t3s9on4a6N6390W2i/cOQNd7feXXhng9AJMuh3JjqB4GZQwyXXWY8fp7skQPh5jmnCmoDiKHb5xhatHaVSj3OtiC2Np2RHtXZPFNMUxPojb0CirVy/gwiOkqg1dwXdehjcgO0T1nO24PtzENdqr7rYZfT5lUJw6V6pW+ao+DA9BNXh4bTYOVaEbTYCWv0TRYyWs0DVaCWv0Awi6CuL5ye33rfUcOswjxaHxOx8b/WvFZE5+143ETj9vxmInH7HjUxKMUj0XH0zwiLRa9r/4kqEH0zQbRoEHUNEhMNoglEtH76o9pMP9mg/mgwbxpICtXcg9fhUD7ODGxsHJrRzgFs7DEkwvr9W5EMYdXMaNXU7KEL0ncDntpfNJmXf1WRuRw350LpnFvRvX6b8yJpjDmhDMZnHHhjARrFrjizZghrrBzhoczJ0FhovvTEMYMceaEMzVBQaPraQhjQNSWZ56RhjBGkDNfo3RfdFdwLgC3bUAoHLllA8LZhH9rPTgLwVkP1l681ShxJoMzJ9PCOS2cH3DhnH1PhTNfl6llefNy4hxnQqFO/9wpkPsywGzebKHkCh5X1JgTqSzue+dU0AFCGQimaHMnZ5UH/vMUagCkVfKyjFVFQxjj4fUK1rEMgPodPhcV2mQAUPtk8YFKK5Dgf8rMYVGtPW53AHRUcy5Fo4g7PwBtd7/vyKe40hpMOd9Qa0jlfAxhLMJfWqDb+mbAlc23l/N3+1rwbmZg+s1g+s1gan1snlqf/7n1mbst6+M5L0T/CaYzAGnVA9dxvFOqwcQ0t2bb9NZAWuZCFI5Mb8OhDBP36Z8xTNznfa/SFUe0OQHQbPMrXqWJUwUwJffvP/1zBo2zBl8mF358YVFrGmie3M8zjGHiDJosP3NvaEcFmP6cMC0j0zLyIZeRj/55GTFh+ymPUqv+H5R6AJTqu1XRxBOLBppVuajON5jqANTvbOh38tgPgK639tjbPcDrAYQpK+yv28zJij3fMudw9tdt7myf7Yhm2rySAbz3zFEpsvQnK+G0IDwhAAA=',
    一级f: `js:(()=>{
        const urls = ['1','2','3','4','6'].map(c=>\`\${rule.host}/show/\${c}-----1-1.html\`);
        let filters = {};
        for(const url of urls){
            const fclass = url.match(/show\\/(\\d+)-/)[1];
            const html = request(url);
            const data = pdfa(html, '.filter-row').map(tab => {
                const title = pdfh(tab, 'strong&&Text').replace(':','');
                const value = pdfa(tab, 'a').map(li => {
                    const n = pdfh(li, 'a&&Text').trim();
                    let v = n;
                    if(/全部|地区|类型/.test(n)) v = '';
                    else if(/综合/.test(n)) v = '1';
                    else {
                        const href = pdfh(li,'a&&href');
                        v = href.match(/(?:\\d+-)([\\w-]+?)(?:-\\d+\\.html)/)[1].replace(/-/g,'');
                    }
                    return {n, v: decodeURIComponent(v)};
                });
                return {key: title, name: title, value};
            });
            filters[fclass] = data;
        }
        return JSON.stringify(filters);
    })()`,
    proxy_rule: `js:
        if (/(m3u8|mp4)/i.test(input.url)) {
            let m3u8 = input.url;
            // 过滤广告域名
            m3u8 = m3u8.replace(/https?:\\/\\/(ads?|adcdn)\\.\\w+\\//gi,'');
            // 二次请求过滤广告片段
            let content = request(m3u8, {headers: {Referer: rule.host}});
            content = content.replace(/(#EXTINF.*\\n.*ad.*\\n)/gi, '');
            input = {parse:0, url: m3u8, header: {Referer: rule.host}, content};
        }
    `,
}