var rule = {
  类型:'影视',//影视|听书|漫画|小说
  模板:'海螺3',
  title:'雪糕TV',
  host:'https://www.xgitv.com',
  //url:'/vshow/fyclass--------fypage---.html',//不带筛选
  searchUrl:'/vsearch/**----------fypage---.html',
  searchable:2,
  quickSearch:0,
  filterable:1,
  url:'/vshow/fyfilter---fypage---.html',//带筛选
  filter:'H4sIAAAAAAAAA+3WW08TQRQH8O+yzzUBxAu8cafc79fwsNINHSyL0i2kkCaYUu2CgJKwmNjoi2arkRQeQGlTP01nVr4F0/LPmWZJfPJBkn3r/P7TM9vJOZtuaRGmm0lmLmmt81vacyOptWqLumWEI1pIM/UVQ6698xL/tCfX63osYdQ2mpJ5Jn+dzldZLqhMKoR0N18p5zz7DTZsspjBGlXs5Ljt+uImir3suUhnfPFDFbvv+VXJFzdTLF69E9uOL36kzrbdu8Ufq29nP1SKti9+os4ufuflYxUvs1jihfz1qnzmslJykL5klq6lFqrZ7eXGDMsy1tTl8tMTUdj/++VS6TZAG0k7pJ2kA9JB0gnpJOmCdJF0Q7pJeiA9JL2QXpIwJEzSB+kj6Yf0kwxABkgGIYMkQ5AhkmHIMMkIZIRkFDJKMgYZIxmHjJNMQCZIJiGTJFOQKZJpyDTJDGSGZBYySzIHmSNpeNACq36qb5VnSdUm4uCIFw/vtIl4a4vctnDOUMJicjc1ci300qcIo8yK14d/Cjs8+xphfHF1zagevxCqDXM8ypYT/+ClcFuHZuNjuVJ05QDWz9ZT9VC/CvzwzBe3qPjk6/Xnb764sUHlP1zv94E/Vy8dcfGTf3FUHtXZhl57vGBAgwG9RwO6uWouJVnddAZNGzTt/960Edm0K/J/UtC1Qdfel65N3QB+spcVIQ0AAA==',
  filter_url:'{{fl.cateId}}--{{fl.by}}---{{fl.letter}}',
  //实例 https://www.xgitv.com/vshow/zilei8--hits---A---2---.html
  filter_def:{
   dianying: {cateId: 'dianying'},
   dianshiju: {cateId: 'dianshiju'},
   zongyi: {cateId: 'zongyi'},
   dongman: {cateId: 'dongman'}
  },
  }