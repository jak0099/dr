var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'子夜动漫[漫]',
  host:'https://www.ziyedm.com',
  url:'/list/fyclass-fypage/',
  searchUrl:'/search/**----------fypage---/',
  searchable:2,
  quickSearch:0,
  filterable:0,
  headers:{
	  'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  //class_parse:'nav.absolute a;a&&Text;a&&href;/(.*?)/',
  class_name:'动漫',
  class_url:'anime',
  play_parse:true,
  lazy:$js.toString(()=>{
	input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'.swiper-wrapper.animate-in.fade-in;body;.h42 a&&title;.object-cover&&src;.ml1&&Text;.h42 a&&href;.text-xs&&Text',
  一级:'.mt4 li;.px1 a&&title;.object-cover&&src;.ml1&&Text;.px1 a&&href',
  二级:{
	title:'.mr2 img&&alt;.bg-tips&&Text',
	img:'.mr2 img&&src',
	desc:'.line-clamp-1:eq(1)&&Text;.text-sm div:eq(8)&&Text;.text-sm div:eq(6)&&Text;.line-clamp-1:eq(0)&&Text;.text-sm div:eq(3)&&Text',
	content:'.text-sm p&&Text',
	tabs:'#playtype option',
	lists:'.player:eq(#id)&&a',
	tab_text:'body&&Text',
	list_text:'body&&Text',
	list_url:'a&&href',
	list_url_prefix: '',
  },
  搜索:'*',
}