{
  proxy_rule: `
    (function() {
      const rules = [{
        url: /\\.m3u8(\\?.*)?$/i,
        target: "m3u8-proxy",
        handler: function(response, headers, request) {
          const fixAdM3u8Ai = ${fixAdM3u8Ai.toString()}
          
          // 执行智能去广告
          const newBody = fixAdM3u8Ai(
            request.url,
            headers,
            response.body.toString()
          );
          
          return { body: newBody };
        }
      }];
      
      /* 动态注册规则 */
      if (typeof registerProxyRules === 'function') {
        registerProxyRules(rules);
      }
      return rules;
    })()
  `
}

{
  proxy_rule: `js:
  (function(){
    const b = (s1, s2) => {
      let i = 0;
      while (i < s1.length && s1[i] === s2[i]) i++;
      return i;
    };

    const reverseString = str => [...str].reverse().join('');

    // 增强版同步请求（带超时处理）
    const syncRequest = url => {
      try {
        if (typeof $http !== 'undefined') {
          const res = $http.get(url, {timeout:5000});
          return res.status === 200 ? res.body : '';
        }
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.timeout = 5000;
        xhr.send();
        return xhr.status === 200 ? xhr.responseText : '';
      } catch(e) {
        console.error('请求失败:', e);
        return '';
      }
    };

    // 增强版路径处理（支持多重../解析）
    const urljoin = (base, path) => {
      try {
        // 处理base路径
        const baseParts = base.split('/').filter(p => p);
        const isAbsolute = base.startsWith('http') || base.startsWith('//');
        
        // 处理相对路径
        path.split('/').forEach(p => {
          if (p === '..') {
            if (baseParts.length > (isAbsolute ? 3 : 1)) baseParts.pop();
          } else if (p !== '.' && p) {
            baseParts.push(p);
          }
        });

        // 重构URL
        if (isAbsolute) {
          const protocol = baseParts[0] || 'http:';
          const host = baseParts[1] || '';
          return protocol + '//' + baseParts.slice(2).join('/');
        }
        return baseParts.join('/');
      } catch(e) {
        console.warn('路径解析失败:', base, path);
        return base + '/' + path;
      }
    };

    return [{
      url: /\\.m3u8(\\?.*)?$/i,
      handler: function({ body }) {
        try {
          // 预处理内容
          let ss = body.split(/\\r?\\n/)
            .map(line => line.trim())
            .filter(line => line)
            .map(line => {
              if (line.startsWith('#') || line === '') return line;
              // 增强路径处理
              const processed = urljoin(this.request.url, line);
              console.log('路径转换:', line, '=>', processed);
              return processed;
            });

          // FFZY专用处理
          if (/ffzy|feifan/.test(this.request.url)) {
            let adIndex = ss.findIndex((_,i,a) => 
              a[i] === '#EXT-X-DISCONTINUITY' && 
              a[i+5] === '#EXT-X-DISCONTINUITY'
            );
            if (adIndex > -1) {
              console.log('检测到FFZY广告序列');
              ss.splice(adIndex, 5*2+1);
            }
          }

          // 智能阈值计算
          const validLines = ss.filter(l => !l.startsWith('#') && l.length > 10);
          if (validLines.length < 2) return body; // 安全保护
          
          const firstPart = validLines[0];
          const lastPart = validLines[validLines.length-1];
          const threshold = Math.min(
            b(firstPart, lastPart),
            firstPart.split('/').pop().length - 3 // 允许3字符差异
          );

          // 广告过滤
          const result = ss.filter((line, index) => {
            if (!line.startsWith('#')) {
              if (b(firstPart, line) < threshold) {
                console.log('移除广告片段:', line);
                // 同步移除对应的EXTINF标记
                if (ss[index-1]?.startsWith('#EXTINF')) {
                  ss.splice(index-1, 1);
                  return false;
                }
                return false;
              }
            }
            return true;
          });

          return result.join('\\n');
        } catch(e) {
          console.error('M3U8处理异常:', e.message);
          return body; // 异常时返回原始内容
        }
      }
    }];
  })()`
}