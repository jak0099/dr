globalThis.h_ost = 'http://tipu.xjqxz.top/';
globalThis.playh_ost = 'http://194.147.100.39/m3u8/';
globalThis.vodlist = function(t, pg) {
	let time = Date.now();
	const options = {
		method: 'GET',
		headers: {
			'User-Agent': 'okhttp/3.12.11',
			'user_id': 'XPGBOX',
			'version': 'XPGBOX com.phoenix.tv1.3.3',
			'hash': '37c6',
			'screenx': '2331'
		}
	};
	let html = fetch(h_ost + 'api.php/v2.vod/androidfilter?page=' + pg + '&type=' + t, options);
	return JSON.parse(html);
}

globalThis.vodids = function(ids) {
	const options = {
		method: 'GET',
		headers: {
			'User-Agent': 'okhttp/3.12.11',
			'user_id': 'XPGBOX',
			'version': 'XPGBOX com.phoenix.tv1.3.3',
			'hash': '37c6',
			'screenx': '2331'
		}
	};
	let html = fetch(h_ost + 'api.php/v3.vod/androiddetail2?vod_id=' + ids, options)
	let bata = JSON.parse(html);
	let rdata = bata.data;

	// 创建 data 对象并初始化
	let data = {
		vod_id: ids,
		vod_name: rdata.name,
		vod_remarks: '已更新-'+ rdata.updateInfo,
		vod_actor: rdata.actor,
		vod_director: rdata.director,
		vod_content: rdata.content,
		vod_play_from: 'HD',
		vod_play_url: ''
	};
	//return data; 
	// 遍历 vod_play_list 数组
	rdata.urls.forEach((value) => {
		data.vod_play_url += value.key + "$" + playh_ost + value.url + '~' + rdata.name + '~' +
			value.key + "#";
		//data.vod_play_url += '$$$';
	});
	return data;
}
//console.log(vodids(123120));

globalThis.svodlist = function(wd) {
	const options = {
		method: 'GET',
		headers: {
			'User-Agent': 'okhttp/3.12.11',
			'user_id': 'XPGBOX',
			'version': 'XPGBOX com.phoenix.tv1.3.3',
			'hash': '37c6',
			'screenx': '2331'
		}
	};
	let html = fetch(h_ost + 'api.php/v2.vod/androidsearch10086?page=1&wd=' + wd, options)
	return JSON.parse(html);
}

globalThis.jxx = function(url) {
	if ("741852963" == '741852963') {
		return url;
	} else {
		return 'https://mp4.ziyuan.wang/view.php/3c120366111dde9c318be64962b5684f.mp4';
	}
}

var rule = {
	title: '苹果',
	host: '',
	detailUrl: 'fyid',
	searchUrl: '**',
	url: 'fyclass',
	searchable: 2,
	quickSearch: 1,
	filterable: 0,
	headers: {
		'User-Agent': 'okhttp/3.12.11'
	},
	class_name: '电影&电视剧&综艺&动漫',
	class_url: '1&2&3&4',
	play_parse: 1,
	proxy_rule: $js.toString(() => {
		const options = {
			method: 'GET',
			headers: {
				'User-Agent': 'okhttp/3.12.11',
				'Connection': 'Keep-Alive',
				//'Accept-Encoding': 'br,gzip',
				'Accept-Language': 'zh-CN,zh;q=0.8',
				'user_id': 'XPGBOX',
				'token2': 'XFxIummRrngadHB4TCzeUaleebTX10Vl/ftCvGLPeI5tN2Y/liZ5tY5e4t8=',
				'version': 'XPGBOX com.phoenix.tv1.3.3',
				'hash': '0d51',
				'screenx': '2331',
				'token': 'SH4EsXSBhi1ybXp3XQypB5lsfLfbzSpim+hOlmv7IIZ9Kkwoykkh1Y0r9dAKGx/0Smx2VqjAKdYKQuImbjN/Vuc2GWY/wnqwKk1McYhZES5fuT4fGlR0n2ii1nKqbBk8ketLdT0CXrXr8kcZVTdW77fUVG8S5jaTrSrsN/HnCiT4XT1GEkdnV0pqcr5wQL7NV2HHkG/e',
				'timestamp': '1731848468',
				'screeny': '1121'
			}
		};
		let html = fetch(input.url + '.m3u8', options)
        const parts = input.url.split('m3u8');
		const linesArray = html.split('\n');
		for (let i = 3; i < linesArray.length; i++) {
			try {
				if (linesArray[i].includes('key')) {
					linesArray[i] = linesArray[i].replace("/m3u8key", parts[0]+"m3u8key");
				}
			} catch {}
		}

		//   console.log(html);
		const restoredStr = linesArray.join('\n');
		input = [200, 'application/vnd.apple.mpegurl', restoredStr];

	}),
	lazy: $js.toString(() => {
		console.log(input)
		const parts = input.split('~');
		input = {
			parse: 0,
			url: getProxyUrl() + '&url=' + jxx(parts[0]),
			jx: 0,
			danmaku: 'http://43.242.202.175:9595/nnjsdm.php?key=741852963&id=' + '&jm=' + parts[1] + '&js=' + parts[2] + '&key=741852963'
		};

	}),
	推荐: $js.toString(() => {
		let bdata = vodlist(1, 1);
		console.log(bdata);
		let bata = bdata.data;
		bata.forEach(it => {
			d.push({
				url: it.id,
				title: it.name,
				img: it.pic,
				desc: it.updateInfo
			});
		});
		setResult(d);
	}),
	一级: $js.toString(() => {
		let bdata = vodlist(input, MY_PAGE);
		console.log(bdata);
		let bata = bdata.data;
		bata.forEach(it => {
			d.push({
				url: it.id,
				title: it.name,
				img: it.pic,
				desc: it.updateInfo
			});
		});
		setResult(d);
	}),
	二级: $js.toString(() => {
		console.log("调试信息2" + input);
		let data = vodids(input);
		//console.log(data);
		VOD = data;
	}),
	搜索: $js.toString(() => {
		let ddata = svodlist(input);
		console.log(ddata);
		let bata = ddata.data;
		bata.forEach(it => {
            if(!it.name.includes('金瓶梅')){
			d.push({
				url: it.id,
				title: it.name,
				img: it.pic,
				desc: it.updateInfo
			});}
		});
		setResult(d);
	}),
}