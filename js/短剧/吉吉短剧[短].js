var rule = {
  模板:'首图',
  title: '吉吉短剧[短]',
  host: 'https://www.jjduanju.com',
  url: '/sort/fyclass/page/fypage.html',
  searchUrl: '/searcha/page/fypage.html',
  class_parse: '.myui-header__list li;a&&Text;a&&href;.*/(\\d+).html',
  搜索验证标识:'系统安全验证|请输入验证码',
}