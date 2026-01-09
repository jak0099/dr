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
  class_name:'*&*&*&*',
  class_url:'*&*&*&*',
  cate_exclude:'',
  play_parse:true,
  double:true,
  推荐:$js.toString(()=>{

  }),
  一级:$js.toString(()=>{

  }),
  二级:$js.toString(()=>{

  }),
  搜索:$js.toString(()=>{

  }),
  lazy:$js.toString(()=>{
    input = {parse:0,url:input,js:''};
  }),
}