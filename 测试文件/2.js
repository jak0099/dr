var rule = {
    title: '可可影视[优]',
    // 动态切换域名(已修复数组越界问题)
    host: `https://www.${Math.random() < 0.5 ? 'keke5' : ['keke1','keke2','keke3','keke4','keke6','keke7','keke8'][Math.floor(Math.random()*7)]}.app`,
    url: '/show/fyclass-fyfilter-fypage.html',
    filter_url: '{{fl.类型}}-{{fl.地区}}-{{fl.语言}}-{{fl.年份}}-{{fl.排序}}',
    searchUrl: '/search?k=**&page=fypage',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    headers: {
        'User-Agent': 'UC_UA',
        'Referer': rule.host + '/',
        'X-Forwarded-For': `119.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`
    },
    class_parse: '#nav-swiper&&.nav-swiper-slide;a&&Text;a&&href;/(\\w+).html',
    cate_exclude: 'Netflix|今日更新|专题列表|排行榜',
    tab_exclude: '可可影视提供',
    tab_order: ['超清', '蓝光', '极速蓝光'],
    tab_remove: ['4K(高峰不卡)'],
    play_parse: true,
    // 广告处理函数直接写在这里
    lazy: $js.toString(() => {
        function fixAdM3u8Ai(m3u8_url, headers) {
            /* 原函数代码完整粘贴在此(需保持缩进和引号转义) */
            let ts = (new Date).getTime();
            let option = headers ? { headers } : {};
            // ... 原函数所有代码 ...
            return m3u8
        }
        
        let video = document.querySelector("#my-video video");
        if (video) {
            video.click(); // 触发播放
            let m3u8_url = video.querySelector('source').src; // 获取原始地址
            input = {
                parse: 1,
                url: input,
                header: rule.headers,
                // 传入处理后的m3u8内容
                jx: fixAdM3u8Ai(m3u8_url, rule.headers)
            }
        } else {
            input = '未找到视频元素';
        }
    }),
    // 其他原有配置保持相同...
    // ...原有预处理、一级、二级等配置均保持不变...

    // 新增urljoin工具函数（如环境没有则需要）
    urljoin: function(base, path) {
        return new URL(path, base).href;
    }
}
