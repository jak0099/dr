var rule = {
  类型:'影视',//影视|听书|漫画|小说
  title:'MM短剧网[短]',
  host:'https://www.kkyqb.com',
  url:'/vodtype/fyfilter-fypage.html',
  searchUrl:'/vodsearch/**----------fypage---.html',
  searchable:2,
  quickSearch:0,
  filterable:1,
  //filter:'H4sIAAAAAAAAA5WWy27aQBiF9zwFYp1Ntn2DPkOVBWpZ9bJqK1VRJMBcyiUBKgikEIoSEDihFCKCggnlZTz28BY1zITY0iE63SAzn+bozH+bOQ6Fw5HDyKvwG+8jHD7e/npL72PfvMXI2+jn2Ot3kYOn5U/Rj7HNukgP1sbgef1r9MOX2E7Fr6S2gT1q3wYcRnZLJwcvCKyNpXhIAgENOBV53xDmCqhowKk43xturw1UNOBURKlrL67lIO4YaaAVwJyiezZ+STGASY9nGVG6Q+4UIKOeqjhTFC8N2NOlxHwBz7UFpEr1XvYzMp90myOk5cdkNZTb7rCCqkEB0teyInJ95EgBMl/nLayiAZmvclGMLlG+FCBP1GvLyQ06kQKkl+xU/CkiLwqQcellvRLZW4cBTPqapaWxRL4UIH09WjKeFs22WP5AvvyYre+WGHVgZW8B6Ss/Eas6cqQAGaPJzbo+cBKmE0ejP4BJX91Te5FFvhQg75Layq3+QneJAnR9iyKcRwqQXsyhW0UTVgNOxbbu8MzXgIzuuGRblpszUYB37H86bm+vsbO13nFqqPs1oO9FMUJ9rwGZqezpnqpRgFSp3wjzJ1JRgOysRFG0LFHLeC8O1Fl+TMbIXMlZHsVIATLr86n3xEBZV4DM+qUhxwWUdQXISN82nFzBfiiIyQTF249JX8mhew5vegXIGI1morn0unLPJPNjshouyk4CxUsD0lepK6/3vEQ3gO3YmWta9rzg1JFWALPdu3ne2YsL+y+81/yY9Di82ryHMl0v1sijH5Pz97Hj5Fayn1tn0D0ewKRHI+2k0LTRgOyBeEZe/UbVrwBfsRZS0eBZRX8dhZ7+HYVO/gEnUutNZg4AAA==',
  filter:{"1":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"1"},{"n":"都市","v":"都市"},{"n":"赘婿","v":"赘婿"},{"n":"战神","v":"战神"},{"n":"古代言情","v":"古代言情"},{"n":"现代言情","v":"现代言情"},{"n":"历史","v":"历史"},{"n":"脑洞","v":"脑洞"},{"n":"玄幻","v":"玄幻"},{"n":"电视节目","v":"电视节目"},{"n":"搞笑","v":"搞笑"},{"n":"网剧","v":"网剧"},{"n":"喜剧","v":"喜剧"},{"n":"萌宝","v":"萌宝"},{"n":"神豪","v":"神豪"},{"n":"致富","v":"致富"},{"n":"奇幻脑洞","v":"奇幻脑洞"},{"n":"超能","v":"超能"},{"n":"强者回归","v":"强者回归"},{"n":"甜宠","v":"甜宠"},{"n":"励志","v":"励志"},{"n":"豪门恩怨","v":"豪门恩怨"},{"n":"复仇","v":"复仇"},{"n":"长生","v":"长生"},{"n":"神医","v":"神医"},{"n":"马甲","v":"马甲"},{"n":"亲情","v":"亲情"},{"n":"小人物","v":"小人物"},{"n":"奇幻","v":"奇幻"},{"n":"无敌","v":"无敌"},{"n":"现实","v":"现实"},{"n":"重生","v":"重生"},{"n":"闪婚","v":"闪婚"},{"n":"职场商战","v":"职场商战"},{"n":"穿越","v":"穿越"},{"n":"年代","v":"年代"},{"n":"权谋","v":"权谋"},{"n":"高手下山","v":"高手下山"},{"n":"悬疑","v":"悬疑"},{"n":"家国情仇","v":"家国情仇"},{"n":"虐恋","v":"虐恋"},{"n":"古装","v":"古装"},{"n":"时空之旅","v":"时空之旅"},{"n":"玄幻仙侠","v":"玄幻仙侠"},{"n":"欢喜冤家","v":"欢喜冤家"},{"n":"传承觉醒","v":"传承觉醒"},{"n":"情感","v":"情感"},{"n":"逆袭","v":"逆袭"},{"n":"家庭","v":"家庭"}]}]},
  filter_url:'{{fl.cateId}}',
  //https://www.kkyqb.com/vodshow/1---都市--------.html
  filter_def:{1:{cateId:'1'}},
  headers:{
      'User-Agent':'PC_UA',
  },
  timeout:5000,
  class_name:'电影',
  class_url:'1',
  play_parse:true,
  lazy:$js.toString(()=>{
    input = {parse:1,url:input,js:''};
  }),
  double:true,
  推荐:'.SecondList_secondListBox;.SecondList_secondListBox;.SecondList_bookName&&Text;.image_imageDark&&src;.SecondList_totalChapterNum&&Text;.image_imageScaleBox&&href',
  一级:'.BrowseList_itemBox;.BrowseList_bookName span&&Text;.image_imageItem&&src;.BrowseList_totalChapterNum&&Text;.image_imageScaleBox&&href',
  二级:{
    title:'h1&&Text;.DramaDetail_tagsBox&&Text',
    img:'.DramaDetail_bookCover&&src',
    //desc:'主要信息;年代;地区;演员;导演',
    content:'.adm-ellipsis&&Text',
    tabs:'.pcDrama_contentBox h3',
    lists:'.pcDrama_catalog:eq(#id)&&a',
    tab_text:'body&&Text',
    list_text:'body&&Text',
    list_url:'a&&href',
    list_url_prefix: '',
  },
  搜索:'.TagBookList_tagItem;.TagBookList_bookName&&Text;.image_imageItem&&src;.TagBookList_totalChapterNum&&Text;.image_imageScaleBox&&href',
}