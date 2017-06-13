var map = new BMap.Map("map"); // 创建地图实例
var point = new BMap.Point(121.481387, 31.218024);
map.centerAndZoom(point, 12); // 初始化地图，设置中心点坐标和地图级别
map.enableScrollWheelZoom(); // 允许滚轮缩放
var date = "2016-03-01";
var hour = 0;
var group = 1;
var blResult = [];
var voResult = [];
var host ='http://182.254.148.45:8080/soda';
//var host = 'http://115.159.217.159:8080/soda';
//var host = 'http://localhost:8080/soda';
var blackhole;
var volcano;
var timer;
var stimer;
var heatmapOverlayBl;
var heatmapOverlayVo;
var voDataState = 0;
var blDataState = 0;
var line=[];
var isStart = 1;

function start() {
	isStart =1;
	clearInterval(timer);
	clearInterval(stimer);
	timer = setInterval(request, 2000);
	stimer = setInterval(move,125);
	
}

function inStart() {
	clearInterval(timer);
	clearInterval(stimer);
	timer = setInterval(request, 2000);
	stimer = setInterval(move,125);
}

function inPause() {
	clearInterval(timer);
	clearInterval(stimer);
}

function pause() {
	isStart = 0;
	clearInterval(timer);
	clearInterval(stimer);
	
}

function request(){
	inPause();
	voDataState =0;
	blDataState =0;
	$.ajax({
		type : 'GET',
		url : host + '/system/blackhole?date=' + date + '&hour=' + hour+ '&group=' + group,
		dataType : "json",
		success : function(data) {
			blackhole = data.data;
			blDataState =1;
			if((blDataState&&voDataState)==1){
				procData();
			}
			
		}
	});

	$.ajax({
			  type : 'GET',
			  url : host + '/system/volcano?date=' + date + '&hour=' + hour+ '&group=' + group,
			  dataType : "json",
			  success : function(data) {
				  volcano = data.data;
				  voDataState =1;
				  if((blDataState&&voDataState)==1){
					  procData();
				  }
		}
	});
}

function procData(){
	map.clearOverlays();
	//blResult = [];
	voResult = [];
	procBlackhole();
	console.log("bl Finished");
	procVolcano();
	console.log("vo Finished");
	//drawBl(blResult);
	//console.log("bl Finished");
	//drawVo(voResult);
	//console.log("vo Finished");
	timeControl();
	inStart();
	
}

function timeControl() {
	//时间控制
	var minute;
	var newHour;
	if (group == 1) {
		minute = ':00';
	} else {
		minute = ':30';
	}
	if (hour < 10) {
		newHour = '0' + hour;
	} else {
		newHour = hour;
	}
	$("#timediv").html(newHour + minute);

	group++;
	if (group == 3) {
		group = 1;
		hour++;
	}
	if (hour == 24) {
		hour = 0;
	}
}

var a=0; 
function move(){
       var box=document.querySelector("#drag");//获取要移动的div
	   box.style.position="absolute";
	   a=a+1;
	   box.style.left=a<780?a+"px":0+"px";
	   //setInterval(moveRight, 125);//每次向右移动50px
     }


function procVolcano() {
	for (i = 0; i < volcano.length; i++) {
		var flow = volcano[i].inFlow-volcano[i].outFlow;
		
		var point = new BMap.Point(volcano[i].longitude, volcano[i].latitude);
		var circle = new BMap.Circle(point, 1000, {
			fillColor : "green",
			strokeWeight : 0.4,
			fillOpacity : 0.4,
			strokeOpacity : 0.4
		});// 设置覆盖物的参数，中心坐标，半径，
		map.addOverlay(circle);
		
		//扩散指数计算
		var grade=flow*flow*volcano[i].itemNum;
		content = "扩散指数：" + grade + "<br />";
		if(grade>10000000)content = content+"重度火山";
		else if(grade>1000000)content = content+"中度火山";
		else content = content+"轻度火山";
		
		//扩散方向计算
		var itemForward = [];
		
		itemForward =volcano[i].itemForward;
//		var curves=[];
//		for(j=0;j<itemForward.length;j++){
//			var pointForward = new BMap.Point(itemForward[j].longitude, itemForward[j].latitude);
//			var points = [point,pointForward];
//			var curve = new BMapLib.CurveLine(points, {strokeColor:"red", strokeWeight:3, strokeOpacity:1});
//			//curves.push(curve);
//			//map.addOverlay(curve);
//		}
		
		
		var singleItem = volcano[i].items;
		var items =[];
		
		for(j=0;j<singleItem.length-1;j++){
			var it = {
					lng1 : singleItem[j][1],
					lat1 : singleItem[j][0],
					lng2 : singleItem[j+1][1],
					lat2 : singleItem[j+1][0],
			}
			items.push(it);
		}
		

		addVoInfoHandler(content,circle,point,items);

		
		
		
//		//处理热力图数据
//		var mapItem = volcano[i].heatMap;
//		for(j=0;j<mapItem.length;j++){
//			var it = {
//					lng : mapItem[j].longitude,
//					lat : mapItem[j].latitude,
//					count : mapItem[j].itemNum
//				};
//			voResult.push(it);
//		}
		
		
		
	}

}

function procBlackhole() {
	for (var i = 0; i < blackhole.length; i++) {
		//绘制黑洞
		var flow = blackhole[i].inFlow-blackhole[i].outFlow;
		var point = new BMap.Point(blackhole[i].longitude,
				blackhole[i].latitude);
		var circle = new BMap.Circle(point, 1000, {
			fillColor : "red",
			strokeWeight : 0.4,
			fillOpacity : 0.4,
			strokeOpacity : 0.4
		});// 设置覆盖物的参数，中心坐标，半径，
		
		map.addOverlay(circle);
		//"聚集指数：" + flow*flow*blackhole[i].itemNum
		var grade=flow*flow*blackhole[i].itemNum;
		content = "聚集指数：" + grade + "<br />";
		if(grade>10000000)content = content+"重度黑洞";
		else if(grade>1000000)content = content+"中度黑洞";
		else content = content+"轻度黑洞";
		
//		//聚集来源计算
		var itemFrom = [];
		itemFrom =blackhole[i].itemFrom;
		//var curves=[];
		
//		var lines=[];
//		for(j=0;j<itemFrom.length;j++){
//			var pointFrom = new BMap.Point(itemFrom[j].longitude, itemFrom[j].latitude);
//			var points = [point,pointFrom];
//			var polyline = new BMap.Polyline(points, {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
//			lines.push[polyline];
//		}
//		
		
		//for(j=0;j<itemFrom.length;j++){
			//var pointFrom = new BMap.Point(itemFrom[j].longitude, itemFrom[j].latitude);
			//var points = [point,pointFrom];
			//var curve = new BMapLib.CurveLine(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:1});
			//curves.push(curve);
			//map.addOverlay(curve);
		//}
		var pointFrom = new BMap.Point(itemFrom[0].longitude, itemFrom[0].latitude);
		
		
		var items =[];
		var singleItem = blackhole[i].items;
		
		
		for(j=0;j<singleItem.length-1;j++){
			var it = {
					lng1 : singleItem[j][1],
					lat1 : singleItem[j][0],
					lng2 : singleItem[j+1][1],
					lat2 : singleItem[j+1][0],
			}
			items.push(it);
		}
		
		addBlInfoHandler(content,circle,point,items);
		
		
		
//		//处理热力图数据
//		var mapItem = blackhole[i].heatMap;
//		for(j=0;j<mapItem.length;j++){
//			var it = {
//					lng : mapItem[j].longitude,
//					lat : mapItem[j].latitude,
//					count : mapItem[j].itemNum
//				};
//			voResult.push(it);
//		}
		
	}
}

var optsBl = {
		width : 30, // 信息窗口宽度
		height : 50, // 信息窗口高度
		title : "<p style='font-size:20px;color:rgba(1,16,1,0.95);line-height: 5pt'>"+"黑洞"+"</p>",// 信息窗口标题
}

var optsVo = {
		width : 30, // 信息窗口宽度
		height : 50, // 信息窗口高度
		title : "<p style='font-size:20px;color:#000;line-height: 5pt'>"
				+ "火山" + "</p>",// 信息窗口标题
}

function addBlInfoHandler(content,circle,point,items){
	circle.addEventListener('mouseover', function(e) {
		inPause();
		var p = e.target;
		var infoWindow = new BMap.InfoWindow(content,optsBl);  // 创建信息窗口对象 
		map.openInfoWindow(infoWindow,point); //开启信息窗口
//		for(var i=0;i<lines.length;i++){
//			map.addOverlay(lines[i]);
//		}
		//var angle = getAngle(point, pointFrom);
		//console.log(angle);
		//drawMarker(point,angle);
		
		drawRoute(items);
		dailyChange();
	});
	
	circle.addEventListener('mouseout', function(e) {
		for(var i=0;i<lines.length;i++){
			map.removeOverlay(lines[i]);
		}
		if(isStart==1){
			inStart();
		}
	});

}


function addVoInfoHandler(content,circle,point,items){
	circle.addEventListener('mouseover', function(e) {
		inPause();
		var p = e.target;
		var infoWindow = new BMap.InfoWindow(content,optsVo);  // 创建信息窗口对象 
		map.openInfoWindow(infoWindow,point); //开启信息窗口
		
		
//		for(var i=0;i<curves.length;i++){
//			map.addOverlay(curves[i]);
//		}
		drawRoute(items);
		dailyChange();
	});
	
	circle.addEventListener('mouseout', function(e) {
		if(isStart==1){
			inStart();
		}
	});
	
}

function drawMarker(point, angle) {  
    var iconImg = createIcon(angle);  
    var marker = new BMap.Marker(point, {  
        icon : iconImg  
    });  
    console.log(iconImg);
    map.addOverlay(marker);  
}  

function getAngle(pt1, pt2){  
    return Math.atan2(pt2.lat - pt1.lat, pt2.lng - pt1.lng);  
}  

function createIcon(angle) {  
    //从负Y轴方向开始顺时针查找角度  
    var adjAngles = [180,202,225,247,270,292,315,337,0,22,45,67,90,112,135,157];  
    adjAngle = angle;  
  
    var adjIndex = 0;  
    for (var i = 0; i < 16; i++){  
        if (adjAngle < (- 15 / 16  + i / 8 ) *Math.PI) {  
            adjIndex = i;  
            break;  
        }  
    }  
      
    icon = new BMap.Icon("img/arrow/arrow_" + adjAngles[adjIndex] + ".png", new BMap.Size(50,50));  
    return icon;  
} 





function drawRoute(items){
    var linePoints = [];
    for (var i = 0, pointsLen = items.length; i < pointsLen; i++) {
        (function (a) {
            var p1 = new BMap.Point(items[a].lng1, items[a].lat1);
            var p2 = new BMap.Point(items[a].lng2, items[a].lat2);
            var driving = new BMap.DrivingRoute(map);
            driving.search(p1, p2); //搜索
            driving.setSearchCompleteCallback(function () {
                var linePoints = driving.getResults().getPlan(0).getRoute(0).getPath();
                var polyline = new BMap.Polyline(linePoints, {strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.6});   //创建折线
                map.addOverlay(polyline);//增加折线
            });
        })(i)
    }
}




function dailyChange() {
	var dailyData = bstate;
	var lineChartDataall = {
		labels : [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
				"11", "12", "13", "14", "15", "Pre", "--", "--", "--", "--",
				"--", "--", "--" ],
		datasets : [ {
			label : "My first dataset",
			fillColor : "#3f51b5",
			strokeColor : "rgba(255,120,0,1)",
			pointColor : "rgba(255,120,0,1)",
			pointStrokeColor : "rgba(255,120,0,1)",
			pointHighlightFill : "rgba(255,120,0,1)",
			pointHighlightStroke : "rgba(255,120,0,1)",
			scaleLineWidth : 10,
			datasetStrokeWidth : 4,
			pointDotRadius : 4,
			data : dailyData
		} ]

	}


}

function weekChange() {
	var weekData = [ 1234, 234, 112, 1111, 244, 1111, 344 ];
	var lineChartDataall = {
		labels : [ "Mon", "Tue", "Wed", "Thurs", "Fri", "Pre", "--" ],
		datasets : [ {
			label : "My first dataset",
			fillColor : "rgba(0,0,0,0)",
			strokeColor : "rgba(255,120,0,1)",
			pointColor : "rgba(255,120,0,1)",
			pointStrokeColor : "rgba(255,120,0,1)",
			pointHighlightFill : "rgba(255,120,0,1)",
			pointHighlightStroke : "rgba(255,120,0,1)",
			scaleLineWidth : 10,
			datasetStrokeWidth : 4,
			pointDotRadius : 4,
			data : weekData
		} ]

	}

}
