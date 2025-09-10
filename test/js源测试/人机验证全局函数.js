//函数不成功，待完善
function verifyLogin(currentUrl) {
    const encrypt = _str => {
        const staticchars = "PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN";
        let encodechars = "";
        for(let i = 0; i < _str.length; i++) {
            const char = _str[i];
            const index = staticchars.indexOf(char);
            const code = index === -1 ? char : staticchars[(index + 3) % 62];
            const rand1 = staticchars[Math.floor(Math.random() * 62)];
            const rand2 = staticchars[Math.floor(Math.random() * 62)];
            encodechars += rand1 + code + rand2;
        }
        if (typeof btoa !== 'undefined') {
            return btoa(encodechars);
        } else if (typeof base64 !== 'undefined') {
            return base64.encode(encodechars);
        } else {
            throw new Error("No base64 encoder available");
        }
    };

    try {
        const value = encrypt(currentUrl);
        const token = encrypt("MTc1MDU2NTQ5OA=="); 
        const data = `value=${encodeURIComponent(value)}&token=${encodeURIComponent(token)}`;       
        const res = post('/robot.php', {
            body: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': MOBILE_UA
            }
        });
        
        if (res && res.status === 200) {
            log('验证成功，刷新页面');
            location.reload(); // 添加刷新逻辑
            return true;
        }
        
        log(`验证失败，状态码: ${res?.status || '无响应'}`);
        return false;
    } catch (e) {
        log(`验证异常: ${e.message}`);
        return false;
    }
}

globalThis.verifyLogin = verifyLogin;