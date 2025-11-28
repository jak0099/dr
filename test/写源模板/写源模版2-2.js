var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'',
  host:'',
  url:'',
  searchUrl:'',
  searchable:2,
  quickSearch:0,
  filterable:1,
  filter:'',
  filter_url:'',
  headers:{
      'User-Agent':'MOBILE_UA',
  },
  timeout:5000,
  class_parse: $js.toString(() => {
    let classes = [
    { type_id: *, type_name: '*' },
    { type_id: *, type_name: '*' },
    { type_id: *, type_name: '*' },
    { type_id: *, type_name: '*' },
    { type_id: *, type_name: '*' },
    { type_id: *, type_name: '*' },
    { type_id: *, type_name: '*' }
        ];
    input = classes;
    }),
  cate_exclude:'',
  play_parse:true,
  double:true,
  推荐:$js.toString(()=>{
    let html=request(input);
    let data=pdfa(html,'');
    VODS = [];
  }),
  一级:$js.toString(()=>{
    let html=request(input);
    let data=pdfa(html,'');
    VODS = [];
  }),
  二级:$js.toString(()=>{
    let html=request(input);
    let vod_name=pdfh(html,'.title&&Text');
    VOD = {vod_name:vod_name};
  }),
  搜索:$js.toString(()=>{
    let html=request(input);
    let data=pdfa(html,'');
    VODS = [];
  }),
  lazy:$js.toString(()=>{
    input = {parse:0,url:input,js:''};
  }),
}