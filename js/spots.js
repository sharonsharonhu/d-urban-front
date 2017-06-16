/**
 * Created by xue on 2017/6/15 0015.
 */
<!--map-->
var map = new BMap.Map("map"); // 创建地图实例
var point = new BMap.Point(121.481387, 31.218024);
map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
map.enableScrollWheelZoom(); // 允许滚轮缩放


<!--fixed camera-->

<!--hosipital-->
var i=1;
function hospital() {

    var mPoint = new BMap.Point(121.481387, 31.218024);
    var circle = new BMap.Circle(mPoint, 1000, {
        fillColor: "blue",
        strokeWeight: 1,
        fillOpacity: 0.3,
        strokeOpacity: 0.3
    });
    if (i==1){
        map.addOverlay(circle);
        var local = new BMap.LocalSearch(map, {renderOptions: {map: map, autoViewport: false}});
        local.searchNearby('医院', mPoint, 1000);
        i=0;
    }

     else {
        map.clearOverlays();
        i=1;
    }
}