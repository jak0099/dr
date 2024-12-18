//过验证失败
function verifyLogin(url) {
    let cnt = 0;
    let cookie = '';
    let r = Math.random();
    let yzm_url = getHome(url) + '/index.php/verify/index.html';
    log(`验证码链接:${yzm_url}`);
    let submit_url = getHome(url) + '/index.php/ajax/verify_check';
    log(`post登录链接:${submit_url}`);
    while (cnt < OCR_RETRY) {
        try {
            let {cookie, html} = reqCookie(yzm_url + '?r=' + r, {toBase64: true});
            let code = OcrApi.classification(html);
            log(`第${cnt + 1}次验证码识别结果:${code}`);
            html = post(submit_url, {
                headers: {Cookie: cookie},
                body: 'type=show&verify=' + code,
            });
            html = JSON.parse(html);
            
            if (html.code === 1) {
                log(`第${cnt + 1}次验证码提交成功`);
                log(cookie);
                return cookie // 需要返回cookie
            } else if (html.code !== 1 && cnt + 1 >= OCR_RETRY) {
                cookie = ''; // 需要清空返回cookie
            }
        } catch (e) {
            log(`第${cnt + 1}次验证码提交失败:${e.message}`);
            if (cnt + 1 >= OCR_RETRY) {
                cookie = '';
            }
        }
        cnt += 1
    }
    return cookie
}

globalThis.verifyLogin = verifyLogin;

Object.assign(muban.mxpro.二级,{
    tabs: '.tab-item',
});
var rule = {
  模板:'mxpro',
  title: '耐看点播',
  host: 'https://www.nkdvd.com',
  //url: '/vodshow/fyfilter.html',
  url: '/vodshow/id/fyclass/page/fypage.html',
  //https://www.nkdvd.com/vodshow/area/美国/by/hits/class/剧情/id/31/page/2/year/2023.html
  searchUrl: '/vodsearch/**----------fypage---.html',
  cate_exclude:'今日更新|发布页|热榜||热搜榜|深夜福利|美女成人直播',
  filter:'H4sIAAAAAAAAA+1a3U4bRxh9ldVeczHrxfa4D9EXqHKRCyJVTXPVVq2iSID5M1BsEJiQmkAFxkD4sZOUwlprv4xn136Lrplh5/u+jbS2BIVEc8f5ztHM7Jnx+HxeXlt2htnfWT9Yry37p6k/oj/tsNUW71fsCct+9fznKVz57fnLX6fu9K+GnJg/HhSPb7khjEaz3kxodvm459fC0qIW5LCgWhOlBhLkkSBcagXFeSTgWNBYFzdtJCggQTBTCaarUOCSRZYaZArXwSMsve15JSTI0McMN9EaXDcSWM8ikTZWzgON1ZVUY9F830/98uLlj7/H5B1OOhtLFExaGysUTFoXKxRMbrCeRcLk/uhZJEz6r8eQMLkBeh0SolmWL0P/VM8iYXKP4EqHECnqi3ClCqJ1nB/1Ovt6HRKiMRY2BjsnegwJ0RjvT6P16zEkHM/1YPYsrK5rhYRIUVwOZt9phYRopeXD/gFwXUKkWFsQ5Y9aISFSXFwJ71wrJESKymowDU6hhFDR71aivYgVCqIx5rrhh7oeQ0K0++2ymL/Wuy8hVAx2N4K3egwFkWPVxX7J045JiNbRuQg3/xF+Sy8lrqDVeKfC34K3ga4gnb8etmtkSFRUVwi4nEWtKVY9dIfElfHukLCzJv7y9bwSIs/2TqBCQeTZdj2onWnPJESKT004hoJQ0bs+j0qDo53g+jLWoWJSLcrN4KZD1KqI97QplvfF7t9gW+8q6ElPzoLder/e7Xn6M4OK6Bz82RTekT4EEqIzvdKCT60g9mUL+7JFFaLzL1QoiG+0/WClKw7BxyuuoNXUu2H5PCzt6AXFFeRtdy70t4Mq2Ia4guadv+q19f2k4BfO6s3nXttHZzWujHdWMywzCSJGBAjrQtalbAayGco6kHUoyyDLCOsUAOsUKMshyymbh2yesjnI5iibhWyWstArh3rlQK8c6pUDvXKoVw70yqFeOdArh3rFoFeMesWgV4x6xaBXjHrFoFeMesWgV4x6xaBXjHrFoFeMesWgV4x6xaBXjHrFoFcMe+UUCtqrW0BYDllO2Txk85TNQTZH2Sxks5SdhOwkZV3IupTNQDZDWQeyDmUZZKlXHHrFqVccesWpVxx6xalXHHrFqVccesWpVxx6xalXHHrFqVccesWpVxx6xalXHHrF2Rdu5WBtQ3hleCvrSvJWDravBtufgSJRRN8gnhc0N4kaFdH30uWcWFogalSUq7eeTdjRxXyfXSq2Lfpi7XkN2C25eMeiFBKlCyTAGx4ln2E8ggJ8XoKzxjBhQQE+bjIZIQF/7BYyvUHsH09DhYIoWhV9cT2rQ5WE4zUR6e1ferOb3u6M0NzNXImiPqoKjtcypbduIzTM6U1mavuX3jCnN2Yj/DyQ2tqnN90jt1MzncE73RQoOMqPFQ/XZKnO5LAx2Fmg7YosmpbMtGS4Yloy05KZlsy0ZKpgWjLTktlPsiXL2Lgl+5/fb6UGx3t5N5XeWKSGcVFZExcftELC8RqtEd741Dz0XknCMduoUWPEIwXk9HB7HxH6IePvvcRQEzJNyDQh04RMEzJNyPzWQ6ZrP2bIDGt70WOEjWmdKOIKDhWfejcVECpu4XhBsj/XEuUDOJeuoIBQXRSr4FdXCUkIGhzswRA0hF//P5M8ZDAzvyCacCcLJtyZcGfCnSqYcGfC3cOFu0nbhLunH+6e4ktsEwVNFDRR0ERBEwVNFDRR8BuIglkbR8Gv8TGsN/8Bquf/w1A7AAA=',
  //filter_url:'{{fl.地区}}-{{fl.排序}}-{{fl.剧情}}-{{fl.语言}}-{{fl.字母}}---fypage---{{fl.年份}}',
  filter_url:'area/{{fl.地区}}/by/{{fl.排序}}/class/{{fl.剧情}}/id/{{fl.类型}}/page/fypage/year/{{fl.年份}}',
  filter_def:{
    20: {cateId: '20'},
    21: {cateId: '21'},
    22: {cateId: '22'},
    23: {cateId: '23'},
    24: {cateId: '24'},
    25: {cateId: '25'}
  },
  filterable:1,
  一级:'.module-items&&a;.module-poster-item-title&&Text;.lazy&&data-original;.module-item-note&&Text;a&&href',
	/*一级: $js.toString(() => {
         let cookie = getItem(RULE_CK, '');
        //log('储存的cookie:' + cookie);
        
        let ret = request(MY_URL, {
            headers: {
                Referer: encodeUrl(MY_URL),
                Cookie: cookie,
            }
        });
        if (/系统安全验证/.test(ret)) {
            //log(ret);
            cookie = verifyLogin(MY_URL);
            if (cookie) {
                log(`本次成功过验证,cookie:${cookie}`);
                setItem(RULE_CK, cookie);
            } else {
                log(`本次验证失败,cookie:${cookie}`);
            }
            ret = request(MY_URL, {
                headers: {
                    Referer: encodeUrl(MY_URL),
                    Cookie: cookie,
                }
            });
        }
//log(ret);
        let d = [];
        let p = rule.一级二.split(';');
        let arr = pdfa(ret, p[0]);//列表
        arr.forEach(it => {
            d.push({
                title: pdfh(it, p[1]),//标题
                pic_url: pdfh(it, p[2]),//图片
                desc: pdfh(it, p[3]),//描述
                url: pdfh(it, p[4]),//链接
                
            });

        });
        setResult(d);
    }),*/
    搜索验证标识:'系统安全验证',
}