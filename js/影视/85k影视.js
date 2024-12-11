var rule={
  title: "85k影视",
  模板: "mxpro",
  host: "https://85k.ltd",
  url: "/index.php/vod/show/id/fyfilter",
  searchUrl: "/index.php/vod/search/page/fypage/wd/**/",
  filterable: 1,
  filter: "H4sIAAAAAAAAA+1Z607bMBh9l/xGs52GtvAqEz+6UY1qrCBgbAghMXFruXVM0A6tG5sEtGyUphvXlMLL1En7FkuaxPbnSiusZZum/Mw5J0584nznczKrEGXw8azyPD6jDCpWpUo/rSl9SjL2Ii4eT8dGX8ZbwqQN06Vic6HowPYBUeb6PHi1WK/lrfSKx4Q5k83TdIEzEcZYqYq5sMSZKGcKW/SqypkBxphv3przWc4QzC+ULoDhCL87M/W+bqQFSmVU40SntR1Oqfa1hhzSdYXmdbpucFfY8S9cQYnkcPz1o/GRcTQ9NowmR8ZeocQwIohdtH5Zoh9qdL/Q3F32T4pNxGMIEL66ebhrXpaBzoPY1DO6eXUDFB7EHL3ZtAcGCg9iHv3YkRUexKxaq8gKD2Jj5A7M/DEcw4XYXPaO5DE8iM3l5kJWeBC/U739TnUwxoZOjUM4hguxMRYztss0dQSHYSib88GtlSlZ6V04bYby9f/ZXLu1T4YXZSjTLZ3Xq1kociFx1TXKpUZxnq86dtzVqrMdsgfy5aOx5DPkQkh8xLLEhbjE+r4vS1yIS5q5Gt3IySqGInE1tKlaEBKXlCxxISSu3DZJC0LiomqbegtC4pOhJwtQ0oIQLAhXp/VqTSgI/nFXj0bFar8vnonHJpADAFqTaQ3QIZkOAVqVaRXQRKbhrWGZxiJNBiSaDAA6KtNRQEdkOgLosEyHAS27RoBrRHaNANeI7BoBrhHZNQJcI7JrBLhGZNcIcA3LrmHgGpZdw8A1LLuGgWtYdg0D17DsGgauYdk1rMF3wNx8R40MfwfYMXwHzNx5M3fKSWfEJzNoKmGfxJLQMEx9u00zkpia5EWpvEhTy22ayadjE3Hnvob6FLXLRob3A3ZFrBsFu5fwW4UQrzOXZTtVBUoTC5ldlQSqn591XHCSllO8NTLPLuh+llMqFmqaE2gCRR6qLRHW9D3bko5R3ovGpXNLcZfWplPDcIfWJqvbaU4/foHDMPSvBbzw/P7XgP/z0QzjMYjmIJqDaP7NaA51Gc08f938sarXjbThxyIPbjedIRsSq4xdeCDL49vNaMj2P1TBDgUFu/cFOxQU7KBgBwW7FwVb67JgC7uilXVr5ytdLZrX33xS+DDcwq3tM1qr+LVe+Jrr7sPEc9WwWKac/RZg+Ydlb8sF2OhD7Z+Et+B++6fOOxt3HlDhQn9tt6EF4dX78NKC8ArCKwivnoRXpNv0Ev5P1rasap5/g9OEH5R7JQHX/mlT5n4CarxelegdAAA=",
  filter_url: "{{fl.类型}}{{fl.地区}}{{fl.排序}}{{fl.语言}}/page/fypage{{fl.年份}}",
  filter_def: {
    1: {
      类型: "1"
    },
    2: {
      类型: "2"
    },
    3: {
      类型: "3"
    },
    4: {
      类型: "4"
    },
    47: {
      类型: "47"
    }
  },
  class_parse: ".navbar-items&&li;a&&Text;a&&href;.*/(\\d+)/",
  tab_exclude: "排序",
  搜索: 'body .module-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href;.module-card-item-info--strong&&Text',
}