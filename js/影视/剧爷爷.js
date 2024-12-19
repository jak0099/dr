var rule = {
  模板:'mxpro',
  title: '剧爷爷',
  host: 'https://www.juyeye.cc',
  searchUrl: '/vodsearch/**----------fypage---.html',
  cate_exclude:'今日更新|发布页|热榜',
  // url:'/vodshow/fyclass--------fypage---.html',//不带筛选写法	
  url: '/vodshow/fyclass-fyfilter.html',//带筛选写法
  filter_url:'{{fl.area}}-{{fl.by}}-{{fl.class}}-{{fl.lang}}-{{fl.letter}}---fypage---{{fl.year}}',
  filter:'H4sIAAAAAAAAA+2Y3W4aRxTHXyXaa1/s4nw1rxLlgkZIiZqmkp1GsiJLtjEEiAsYOTgE/NUY4zjGXmzHgaXAy+zMwlt02Dkfg1qvUGOlSuQ7fufMzJ5zhvmf2X1lOdaDh6+sXxIL1gPr8bP4/Lw1Yz2P/5pQKLINmUwpfhl/9nsiHPd8bE4djpKHY7MCa3EGrOWaGg9WAPQFmRYsxIC+W3K5KJfK4ASgRXOHfq+Gi2qgRRvrotPFRTXQPIqcAX0y8873svg8DegbNg/E2hH4AOh5udOghz4AI85go8txjoF89dccJwDF0jzw+7sYiwaaly6NKh9xngaat32kIsd5GsgXUU+5chyU19GngXzJnFx5jz4NlHu3IFJtzF0D+kZbJfmuDj4AWrP8epj1cE0NlF//JNj4LHotTJGYRhT2hx9oFzWQL58WhTP0aaBdHBTVHuAuauCq1uTWOlU1BPKtDoJPmAkAVaC3HnRrEwFPmBYfjUfqYxSfS8SNU1RzxZo37Snab4wqaQxBAxX6oCLbp1hoDVwqV3b6VKoQKPR+XlR7GLQG2qDzt+wDoDK+abEPgOZt1mXtGOdpoDh3PvI8AN70L+wD4FhcMxZ3Yt4frvAOcJ4GmrdaUJUSGTwrzJRJfRAUmkG2gskQ8wHelW8GahqdYWQakbr0u3isAMxNX0jE54xN71z43d6Umx6zY7fBFv407LNsnzXtMbbHTLvDdse022y3DbvzE9nVT8N+n+33Tfs9tt8z7XfZfte032H7HdPO+Tpmvg7n65j5OpyvY+brcL6Oma/D+aqf5jb9vMCbJPMl4RX+sUly83K0eQELvHiqhuLCvudJdwM8T56+mOd/2OmqyOC5nX/821xi/NRHM1bsutprhBZGdTQtyGL5UiQLExoNpmnatzi5FF4TfRqm7IpXdu+orhjVvaN0P6pL+Z091n0A7nwpWUFhBaDnvU1zpwUwegLXDGBaufiaHpFOqfHUwkKYRnv/a/+I0vro3nK1nkf2lrKr5Fds7dG9AflGi79/LSa7zfnaZr4252ub+dqcl23mZXNetpmXzXmpn/9nD5i9ph4wWsoGjSU8wBpMDVvdMTRMAQV2Mhi6GTxsGmheqSlzeOcF4IOfkm3UUwAWmnO/UyShCcEQhdEHjAWAfN6RONlGnwZ6XvXMeFvQQPM2duQFve1poHnttswUfK/Et/4JE9Xh4k/VFbAOGmiN1spweQ1na/gGeq00WKktBR2CobtKwVl3x0C+44YqLPo03Cjgj66AnK9t5vv9KuPta1LGKPWL+k4UJJvDPVRUAFozfxgUMWgA8hW3g2P6jqKBj/vV322Gxa1hHm/qALTm7p6o4i0bYJqbtKx5xrcgDfS8iC8hUW8NwlVlwk0GMH31c8OngOq53/f/wm9IAHxz3xGZKt3cQ+C/zploYjcBoDWrOVnBrgDAdWmJwSbVJYRvcQOv9nyPXpY0THNb/lfVvrnT3ij6j6Loi38DX/yg2lAYAAA=',
  filter_def:{
    1: {cateId: '1'},
    2: {cateId: '2'},
    3: {cateId: '3'},
    4: {cateId: '4'}
  },
  filterable:1,//是否启用分类筛选,  
}