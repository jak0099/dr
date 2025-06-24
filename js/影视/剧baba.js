globalThis.deStr=function (_0x45b349) {
function indexOfVal(_0x12fb7d, _0x30da08) {
  for (var _0x2ef4b5 = 0; _0x2ef4b5 < _0x12fb7d.length; _0x2ef4b5++) {
    if (_0x30da08 === _0x12fb7d[_0x2ef4b5]) {
      return true;
    }
  }
  return false;
}

function customStrDecode(_0x4bdf28) {
  //var _0x48ae7f = new Base64();
  let key = md5("test");
  _0x4bdf28 = base64Decode(_0x4bdf28);
  let len = key.length;
  let code = "";
  for (let i = 0; i < _0x4bdf28.length; i++) {
    let k = i % len;
    code += String.fromCharCode(_0x4bdf28.charCodeAt(i) ^ key.charCodeAt(k));
  }
  return base64Decode(code);
}
function deString(_0x3c11ed, _0x460f72, _0x4ede53) {
  var _0x19fee9 = "",
    _0x966eba = _0x3c11ed,
    _0x42aad4 = _0x460f72,
    _0x2e003 = _0x4ede53.split("");
  for (var _0x358fec = 0; _0x358fec < _0x2e003.length; _0x358fec++) {
    var _0x1abc67 = _0x2e003[_0x358fec],
      _0x535eed = /^[a-zA-Z]+$/.test(_0x1abc67);
    _0x535eed && indexOfVal(_0x42aad4, _0x1abc67) ? _0x19fee9 += _0x42aad4[_0x966eba.indexOf(_0x1abc67)] : _0x19fee9 += _0x1abc67;
  }
  return _0x19fee9;
}
  var _0x45b349 = customStrDecode(_0x45b349);
  var _0x630ca2 = _0x45b349.split("/");
  var _0x24b93c = "";
  for (var _0x49d061 = 0; _0x49d061 < _0x630ca2.length; _0x49d061++) {
    var _0x6c126a = _0x49d061 + 1 == _0x630ca2.length ? "" : "/";
    if (_0x49d061 == 0 || _0x49d061 == 1) {} else _0x24b93c += _0x630ca2[_0x49d061] + _0x6c126a;
  }
  var _0x3728b4 = deString(JSON.parse(base64Decode(_0x630ca2[1])), JSON.parse(base64Decode(_0x630ca2[0])), base64Decode(_0x24b93c));
  return _0x3728b4;
}

var rule = {
            title: '剧baba',
            host: 'http://www.jubaba.cc',
            url: '/vodshow/fyclass--------fypage---.html',
            searchUrl: '/vodsearch/**----------fypage---.html',
            searchable: 2,
            quickSearch: 0,
            filterable: 1,
            filter: '',
            filter_url: '',
            filter_def: {},
            headers: {
                'User-Agent': 'MOBILE_UA',
            },
            timeout: 5000,
            class_parse: '.swiper-wrapper&&li;a&&Text;a&&href;(\\d+)',
            cate_exclude: '',
            play_parse: true,
	lazy:`js:
      input = {
      parse:1,
      url:input,
      js:'document.querySelector("#playleft iframe").contentWindow.document.querySelector("#start").click()',
      }
      `,
      lazy:`js:
      let html =  JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);
	let link = html.url;
	let pd='vid='+link;
	let jo1 = JSON.parse(post(HOST+'/bbplayer/api.php',{body:pd}));
	input=deStr(jo1.data.url)
	log(input);
      input = {
      parse:0,
      jx:0,
      url:input,
      }
      `,
            double: true,
            推荐: '*',
            一级: 'body&&.ewave-vodlist__box;.lazyload&&title;.lazyload&&data-original;.text-right&&Text;a&&href;.text-muted&&Text',
            二级: {
                title: 'h1&&Text;.ewave-content__detail&&p&&Text',
                img: 'img&&data-original',
                desc: '.text-right&&Text;.ewave-content__detail&&p&&Text;.ewave-content__detail&&p&&Text;.ewave-content__detail&&p:eq(2)&&Text;.ewave-content__detail&&p:eq(3)&&Text',
                content: '.desc.hidden-xs&&Text',
                tabs: '.nav-tabs&&a',
                lists: '.ewave-content__playlist:eq(#id)&&a'
            },
            搜索: '.ewave-vodlist__media&&li;*;*;*;*;*',
            }