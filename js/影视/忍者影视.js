globalThis.RSAdata=function (data,pub) {
let publickey='-----BEGIN PUBLIC KEY-----MIGdMA0GCSqGSIb3DQEBAQUAA4GLADCBhwKBgQCAliLnnNy2iPebSiwsfSlc1dV2gyQZjBVVAACMLmFa4svzF2XsM26dQ2AqXjDIMurDn8EfrevDMuq5TGqIFCaawEYdzWQFE3IMmnxEkxieEK7Lr0o0BjSZ5NLcaTnoWL0/+To837i5XPhzaZWHy4d9G+AaJ9MJDA3FBR5CQ7vi1wIBAw==-----END PUBLIC KEY-----';
if (pub){
	return RSA.encode(data, publickey);
}else{
	return NODERSA.decryptRSAWithPublicKey(data, publickey, {
		// PublicFormat: "pkcs1-private",
		// outEncoding: "hex"
		options: {environment: "browser", encryptionScheme: 'pkcs1_oaep'},
	});
}
}


var rule = {
	title: '忍者影视',
	host: '',
	hostJs: `
	let html=request("http://212.64.23.171:5566/api.php/App/getRzysBaseURList")
	html=JSON.parse(html).data;
	HOST=RSAdata(html,false).split(',')[0];
	console.log(HOST);
	let sign='rzys996'+Math.round(new Date().getTime()/1000).toString()+'150';
	sign=encodeURIComponent(RSAdata(sign,true));
	html=request(HOST+"/x1/v1/macTypes/types?sign="+sign+"&os=2");
	let jo=JSON.parse(html).data.list;
	let filters = {};
	let cb={"class":"类型","area":"地区","lang":"语言","year":"年份","star":"演员","director":"导演","state":"状态","version":"版本"};
	let class1=[];
	jo.forEach(function(tp) {
		rule.class_name=rule.class_name +"&"+tp['type_name'];
		//log(rule.class_name)
		rule.class_url=rule.class_url +"&"+tp['type_id'];
		//log(tp['type_id'])
		let ep=tp['type_extend'];
		let classes = [];
		
		for (let key in ep){
			let value=ep[key];
			if (value.length>1){
				class1.append(key);
				//写成{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"}]}这种格式
				let dd=value.toString().split(',');
				var s=[];
				dd.forEach(function(i){
					s.append({'n':i,'v':i});
					});//这里的;去掉，蜜蜂里面会报错。
				let ss={"key":key,"name":cb[key],"value":s};
				//选择特定的分类
				log("特定的分类："+key);
				if ((' type_class year area').indexOf(key)>0)
					classes.append(ss);
				}
			}
		filters[tp['type_id']]=classes;
	});
	class1=Array.from(new Set(class1)).sort();
	let s=""
	class1.forEach(function(tp) {
		//这里过滤掉一些不要的分类
		log("分类："+s) ;
		s=s+"&" + tp +"={{fl."+tp+"}}";
	})
	s='classtype={{fl.type_class}}&area={{fl.area}}&year={{fl.year}}'
	rule.filter_url=s;
	rule.filter=filters;
	rule.class_name=rule.class_name.slice(1);
	rule.class_url=rule.class_url.slice(1);
	log(rule.class_name);
	log(rule.class_url);
`,
	class_name: '',
	class_url: '',
	searchUrl: '/x1/v1/Search/search?data=**&page=fypage&limit=12&',
	searchable: 2,
	quickSearch: 0,
	headers: {
	'User-Agent': 'okhttp/4.9.3',
	},
	url: '/x1/v1/macTypes/detail?&typeid=fyclass&fyfilter&page=fypage&limit=30&',
	homeUrl:'/x1/v1/macTypes/detail?classtype=&area=&year=&typeid=1&page=1&limit=30&',
	filterable: 0,
	filter_url: '',
	filter: {},
	filter_def: {},
	cate_exclude: '体育',
	detailUrl: '/x1/v1/vod/details2?vodidstr=fyid&',
	play_parse: true,
	lazy: `js:
		input=RSAdata(input,false);
	`,
	limit: 6,
	预处理: `js: let xrequest = request;
(function() {
	request = function(url, obj) {
		let sign='rzys996'+Math.round(new Date().getTime()/1000).toString()+'150';
		log(sign);
		sign=encodeURIComponent(RSAdata(sign,true));
		if (url.indexOf('ils2')>0)
			sign=sign+'&uuid=36e3ec45-ea44-35df-ae36-664858bc6953';
		url=url+"sign="+sign+"&os=2";
		return xrequest(url)
		}
})()`,
	推荐: '*',
	一级: 'json:data.list;vod_name;vod_pic;vod_remarks;vod_id;vod_actor',
	二级: `js:
		VOD = {};
		let html = request(input);
		let json = JSON.parse(html).data;
		VOD.vod_name = json.vod_name;
		VOD.vod_id = input;
		VOD.vod_pic = json.vod_pic;
		VOD.vod_year = json.vod_year;
		VOD.vod_area = json.vod_area;
		VOD.vod_remarks = json.vod_remarks;
		VOD.vod_content = json.vod_content;
		VOD.vod_actor = json.vod_actor;
		VOD.vod_play_from = json.vod_play_list.map(it => it.from).join('$$$');
		let playUrls = [];
		json.vod_play_list.forEach((it) => {
			let plist = it.urls.map(it => it.name + '$' + it.url).join('#');
			playUrls.push(plist);
		});
		VOD.vod_play_url = playUrls.join('$$$');
	`,
	搜索: '*',
}