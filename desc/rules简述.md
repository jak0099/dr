#白盒tvbox
新增简化去广告rules写法:
{"name":"非凡","hosts":["vip.ffzy","hd.ffzy"],"regex":["6.666667","6.566667","2.966667","2.433333","-2.266667"]},
 (正数代表移除第一次出现的切片组,负数代表最后一次出现的切片组)
 
 #原始正则(系列通用)
 {"name":"量子非凡广告","hosts":["lz","vip.lz","vip1.lz","v.cdnlz","hd.lz","ffzy","vip.ffzy","ffzy-play2","hd.ffzy"],"regex":["#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:2\\.966667,[\\s\\S]*?#EXT-X-DISCONTINUITY","#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:6.666667,[\\s\\S]*?#EXT-X-DISCONTINUITY","#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:6\\.667,[\\s\\S]*?#EXT-X-DISCONTINUITY","#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:6.600000,[\\s\\S]*?#EXT-X-DISCONTINUITY"]},