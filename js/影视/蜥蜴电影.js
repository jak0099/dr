var rule = {
  模板:'首图',
  title: '蜥蜴电影',
  host: 'http://www.bo-cp.com',
  url: '/vodshow/fyfilter.html',
  searchUrl: '/vodsearch/**----------fypage---.html',
  filter:'H4sIAAAAAAAAA+2ZbU8iVxTHvwuvfTHD+rjfoJ+h2Rd0S9pNrU3UNjEbE1dFAV1AY0EKPnVFXCsKarc4FPgy3DvwLTrDueeBdkMmq9nYDe/4nf+cmXvOvfecO8PrkB16/vXr0A/RpdDz0MvIYvSrb0NjobnIj1GP3VpDHW55/Etk9udo/8I5z6xi5721c9/sgR1aHjPm5HmnWXQTm0aZZCVbVIkyK1OkuPGaXouxMs1KeUfdN1iZIUW/yeiVLCu2xQ9KlAduZ/PodHy/4ySEFA4tv/BFCD0yH41w4KpYVdvO8MD5oaflXn7DWA2g1jvL6/q10QyQX7qq71voB0DRt1Kq0DSaAYrk9lfWDKDW3aqxZoD8ciVdvEQ/ABrn0Xv2M0DjbP3FmgEeS1WOpTrg97aqnDP0AyC/9bSXKRV/j67EFEmp7aYrbiKPwRDzejvWW23PDR9BTFfEPnQaWZQB5KQvRSPzYtLv7zqNZsBJD1vhZ8bW/ynsYbaHpd1muy3tFtstYbdnyG7PSPs026elfYrtU9I+yfZJaZ9g+4S0j7N9XNo5XlvGa3O8tozX5nhtGa/N8fo7V0zHbGTuO56O7nWle74SdA8Wmt71ONMAYk+wZoD22c0pawZoT+Sa6m2OZWaxa4QMIHYbawbEDhYagNhtIhIAsZ7V1RqvZx9kAr9Z4vTp1K5y0v9Jn8596OXuzC0WX3mX4s07jqOre0b5/tXiAifwel3FscAtvPxpPuo/9cVYKPzA3sHLBcqmV76xOvMKg6opJF6UfmFk+8TH972/6B+p0G/EvOsx/QBBCuinNoFhBftTG8Swgj20eWSrXn1VByfoSjwqtqNi+5SL7VMrms9k0ZyNLCyITdE/vgachd5Kwi2vYD4AKB9rMb1+hPkAoIFdtbvVOM4QAPntVnSyhH4AnOOYrtcpx33gubnt3GdobvogKlXvHY7FAGnOhbo6RA2Anle46SYcfB4A+e0d6bsG+gGQX72u4+mOs+u9j6C3NFEe7n53G2nMAwDdo7bafbON3gCfoYn4fS5dpUH3QSxxb9HzEvchUBO5LHtJRz+ARyvLX1h5JLvF7cCS7cDieC0Zr8XxWjJei+O1ZLwWx2vJeC2O1/s5KtdPoFyPP1K5HlaS4VsHZhqAtLVK9wTLvAG6Z+rczeCgDZCWOXQvd1AD4Bq028tjLTFAicgcdFMJXBEAdM/jE1WgeQPgt3H/6w/eE4D8io6O76MfAD2vneFCbYD8+t9s0A+Anlf10oSTbEBqpVuheUD5PG11/v4N8wlAfqkjFS+gHwAvnRtVwRZngO5ZSOo8tioDnJeaaucoL30IemR+SJspNDsOfRkBCPJe8dF28TlO+KNWMmolX3grmXzg55J/1dr/6Zf2hzRRCA9nFGAwQFxjAIOB4CoBCNK4hjVmHjhDkMbVrZyp7QvcJwD0vOS120TNgBinu9fgcfpAWmmTx2mAxlI567SOcSwAQQ4C+vBCNG2AIPnUq5dulg4eAHwISupVbL4GKPZGWsXw/dIAVYCDXb2P76UG6J7ZTfGeCEDxta7cvT9Vs4YhEvOr02n3Hc0iAB8HNlT6ho4DfQhybFEbRX2wQ1ntA2nrbfcPjMQAZaC54zaKAwMeMI3+r5ItYfR/1egT6ugT6uj/qsAHsOV/AMYQoFLtIAAA',
  filter_url:'{{fl.cateId}}-{{fl.area}}-{{fl.by}}-{{fl.class}}-{{fl.lang}}----fypage---{{fl.year}}',
  //http://www.bo-cp.com/vodshow/4-日本-hits-搞笑-日语----2---2018.html
  filter_def:{
    1: {cateId: '1'},
    2: {cateId: '2'},
    3: {cateId: '3'},
    4: {cateId: '4'},
    6: {cateId: '6'}
  },
  filterable:1,
}