// JavaScript Document

//var p1 火山
//var p2 黑洞

	var p1=new BMap.Point(121.481387,31.218024),
		p2=new BMap.Point(121.581387,31.318024);
		
	var points = [p1,p2];
	var curve = new BMapLib.CurveLine(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建弧线对象
	map.addOverlay(curve); //添加到地图中
	curve.disableMassClear();//禁止覆盖物在map.clearOverlays方法中被清除