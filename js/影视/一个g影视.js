var rule={
  title: "一个g影视",
  模板: "mxpro",
  tab_exclude: "排序",
  host: "https://yigeg.pro",
  url: "/vodshow/fyclassfyfilter.html",
  //searchUrl: "",
  filterable: 1,
  filter: "H4sIAAAAAAAAA+2Za08bRxSG/4s/U2mXhCTNt9zv93uqfIgqpEZtU6lJK1UREmDsGAK2QQTHtbk13EIxmEsprGv8Zzy79r/o2nPOe8ZtWVktVEq73/Z5z87snDM7O69mX0XsyMnPXkW+7P4hcjKiBhfdaCzSEXn+9Otuk79/+tV33c0bnzfk2FI9utSQfYj0dJA6kffvJ5WAY15inToS4Jjbl3Z7JyhGgD6HlqrlPPepAX0ujqrdEvepAe0wcAE8L/Gu6gzy8zRwrFZYUMPLFCPA84bWvDLHCIxxeuMlGWcDEJt/LeMkwFgKC9W9GR6LBrSLj9WzH7idBrSbWvZHzu00tFNPt3/FmxjlmAbEokNu/48c04DcSykV2+HcNXCsPjnmvpunGAH6nHhdG3S4Tw3Ib2/VG/9Fldc5RTDuSM3V3mMWNSCWjKvUBsc0YBYraX8OeBY1SFXz7uQoqtoExAYq3s+cCQEqUB71SvmWAbdIPU8ad9IyyhfVsGMsI+a2ltHcYj0b50FoQKkXsu7OGpdagxSr6O7uoVhNwOD3kipX5mFrwBRtvpUYAQr5Zl1iBGiXmXfzK9xOA8Y5/UHaEci0/yoxAhlL0RxLsaXdSFE5C9xOA9oNpPxKqQSvFmFkMl/xUgVvMMvJgGUJz7hvKn4zrGJm3BHbrpZ4YRGY015bK9SWemXawW1Ne67s38+dazCmQWIEmNqNOYkRYBoyZTWSkbCwMVFGWIMxwRIjMF4aI6bBmGAjEw1GCdVqVErYgJaVs7tVLZWNlcPcTgk7rc6jpDUvDf2I6EdMvVP0TlO3RbdN3RLdMnT7U+j+paGfEP2EqR8X/bipHxP9mKl3id5l6pKvbeZrS762ma8t+dpmvrbka5v52pKvf9kyUYWMuzZiTBTzHyYKsjlRp0g4BeU0KaehnCHlDJSzpJyFco6Uc1DOk3IeygVSLkC5SMpFKJdIuQTlMimXoVwh5QqUq6RchXKNlGtQrpNyHcoNUm5AuUnKTSi3SLkF5TYpt6HcIeUOlLuk3IVyj5R7UO6Tch/KA1IeQHlIykMoj0h5BOUxKY+hWJ/wGmh9UdzkmHJS8qKAW18UN7Ndz2xJ0JdePvMbcPdVx3GL4y3xL569fCGfyLUBlYi3xF98/s233Y2xPOmIdB6YyQ2wJEHGUvsi1betojy+FqkdE61Wt5WDD6uGNs3pviY6yJwGmegg+xVkFqu7s2K/CMSAxtwsuxsCPO9tXAwvgWHNpGYE7e7Z/8yqxWP+/fCSTWjHAv1dGxdkuYIt3v62KtDiTRR9F6QmZ2HgmUNL9CdLdMjW5j9mJaBbYp0s0zpZkq9l5mtJXpaZlyV5WWZeluTlX4YWJhJamI/Twhw5KAtT7x30Fnv5A6fB3IIHpo0t2AeMb7VSKyb4k6sB7cYK7hCfnBDIRzPm7rAdIJCP7WZ1N42PbROMHa3+nsdCgJizrFanOKYBz8ttGGdOGtBufNrdwpmhBrTb2XETqaozJmdHLRLqsPWTb2q4DhrQx3p/rW+YW2v4V+yGbyF8s4BhN8HYtfx9THatBiC2suiXlmMawg083MAjh7eBS76WmW+4sUfCjf3/uLEfPaiNPWjzDvpZ5kULtVk2BAToM7nkpflvBAFi6SlvBT+TNMhetf/Pq1p6spbkcxIC9Dkzq3L4QGtAnwHnGG7eMX6IacDzAn4HBZ3ZqKJfpi1+ngYzNr9pxHxAPef2qr/xjzQCtEtOq0SO22mQ92hDFdgMEaDP3JCbZVNDIHVZV5UM6tIEY1M7xPOPXLnq4LBKg7HT7ntW8Zemo80Bh4YkNCShIQkNSWhIDs2QdJmGJHx1w1f3Y3l1e34H82Q1Jc4mAAA=",
  filter_url: "-{{fl.地区}}-{{fl.排序}}-{{fl.剧情}}-{{fl.语言}}-{{fl.字母}}---fypage---{{fl.年份}}",
  filter_def: "",
  headers: {
    "User-Agent": "MOBILE_UA"
  },
  timeout: 5000,
  class_parse: ".navbar-items li;a&&Text;a&&href;(\\d+)",
  二级: {
                title: 'h1&&Text;.module-info-tag-link:eq(-1)&&Text',
                img: '.lazyload&&data-original||data-src||src',
                desc: '.module-info-item:eq(-1)--span&&Text;.module-info-tag-link&&Text;.module-info-tag-link:eq(1)&&Text;.module-info-item:eq(3)--span&&Text;.module-info-item:eq(1)--span&&Text',
                content: '.module-info-introduction&&Text',
                tabs: '.module-tab-item',
                lists: '.module-play-list:eq(#id) a',
                tab_text: 'div--small&&Text',
            },
            搜索: 'body .module-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href;.module-card-item-info&&Text',
        }