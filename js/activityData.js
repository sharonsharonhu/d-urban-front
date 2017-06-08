// JavaScript Document
var map = new BMap.Map("container"); // 创建地图实例
var point = new BMap.Point(121.481387, 31.218024);
map.centerAndZoom(point, 12); // 初始化地图，设置中心点坐标和地图级别
map.enableScrollWheelZoom(); // 允许滚轮缩放

var date = "2016-03-01";
var hour = 0;
var group = 1;
var result = [];
// ar host='http://127.0.0.1:8080/soda';
var host = 'http://115.159.217.159:8080/soda';
//var host = 'http://localhost:8080/soda';
var blackhole;
var volcano;
var timer;
var heatmapOverlay;
var voDataState = 0;
var blDataState = 0;
var line=[];

function start() {
	timer = setInterval(request, 2000);
}

function pause() {
	clearInterval(timer);
}

function request(){
	pause();
	voDataState =0;
	blDataState =0;
	$.ajax({
		type : 'GET',
		url : host + '/system/blackhole?date=' + date + '&hour=' + hour
				+ '&group=' + group,
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
		url : host + '/system/volcano?date=' + date + '&hour=' + hour
				+ '&group=' + group,
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
	result = [];
	procBlackhole();
	procVolcano();
	drawBl(result);
	timeControl();
	start();
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

function procVolcano() {
	for (i = 0; i < volcano.length; i++) {
		var flow = volcano[i].inFlow-volcano[i].outFlow;
		
		var point = new BMap.Point(volcano[i].longitude, volcano[i].latitude);
		var circle = new BMap.Circle(point, 1000, {
			fillColor : "green",
			strokeWeight : 0.01,
			fillOpacity : 0.01,
			strokeOpacity : 0.01
		});// 设置覆盖物的参数，中心坐标，半径，
		map.addOverlay(circle);
		
		//扩散指数计算
		var grade=flow*flow*volcano[i].itemNum;
		content = "扩散指数：" + grade + "<br />";
		if(grade>10000000)content = content+"严重扩散";
		else if(grade>1000000)content = content+"中度扩散";
		else content = content+"轻度扩散";
		
		//扩散方向计算
		var itemForward = [];
		
		itemForward =volcano[i].itemForward;
		var curves=[];
		for(j=0;j<itemForward.length;j++){
			var pointForward = new BMap.Point(itemForward[j].longitude, itemForward[j].latitude);
			var points = [point,pointForward];
			var curve = new BMapLib.CurveLine(points, {strokeColor:"red", strokeWeight:3, strokeOpacity:1});
			curves.push(curve);
			//map.addOverlay(curve);
		}
		
		
		addVoInfoHandler(content,circle,point,curves);
		
		//处理热力图数据
		var it = {
			lng : volcano[i].longitude,
			lat : volcano[i].latitude,
			count : volcano[i].itemNum
		};
		result.push(it);
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
			strokeWeight : 0.01,
			fillOpacity : 0.01,
			strokeOpacity : 0.01
		});// 设置覆盖物的参数，中心坐标，半径，
		
		map.addOverlay(circle);
		//"聚集指数：" + flow*flow*blackhole[i].itemNum
		var grade=flow*flow*blackhole[i].itemNum;
		content = "聚集指数：" + grade + "<br />";
		if(grade>10000000)content = content+"严重聚集";
		else if(grade>1000000)content = content+"中度聚集";
		else content = content+"轻度聚集";
		
//		//聚集来源计算
		var itemFrom = [];
		itemFrom =blackhole[i].itemFrom;
		var curves=[];
		for(j=0;j<itemFrom.length;j++){
			var pointFrom = new BMap.Point(itemFrom[j].longitude, itemFrom[j].latitude);
			var points = [point,pointFrom];
			var curve = new BMapLib.CurveLine(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:1});
			curves.push(curve);
			//map.addOverlay(curve);
		}
		
		
		
		addBlInfoHandler(content,circle,point,curves);
		//处理热力图数据
		var it = {
			lng : blackhole[i].longitude,
			lat : blackhole[i].latitude,
			count : blackhole[i].itemNum
		};
		result.push(it);
	}
}

var optsBl = {
		width : 30, // 信息窗口宽度
		height : 40, // 信息窗口高度
		title : "<p style='font-size:30px;color:#000;margin-bottom: 5px'>"
				+ "黑洞" + "</p>",// 信息窗口标题
}

var optsVo = {
		width : 30, // 信息窗口宽度
		height : 40, // 信息窗口高度
		title : "<p style='font-size:30px;color:#000;margin-bottom: 5px'>"
				+ "火山" + "</p>",// 信息窗口标题
}

function addBlInfoHandler(content,circle,point,curves){
	circle.addEventListener('mouseover', function(e) {
		var p = e.target;
		var infoWindow = new BMap.InfoWindow(content,optsBl);  // 创建信息窗口对象 
		map.openInfoWindow(infoWindow,point); //开启信息窗口
		for(var i=0;i<curves.length;i++){
			console.log(curves.length);
			map.addOverlay(curves[i]);
		}
	});
	
	
	
	
//	circle.addEventListener('mouseout', function(e) {
//		map.re
//	});
}

function addVoInfoHandler(content,circle,point,curves){
	circle.addEventListener('mouseover', function(e) {
		var p = e.target;
		var infoWindow = new BMap.InfoWindow(content,optsVo);  // 创建信息窗口对象 
		map.openInfoWindow(infoWindow,point); //开启信息窗口
		for(var i=0;i<curves.length;i++){
			console.log(curves.length);
			map.addOverlay(curves[i]);
		}
	});
}



function drawBl(points) {
	heatmapOverlay = new BMapLib.HeatmapOverlay({
		"radius" : 50,
		"opacity" : 0,
	// "gradient":{
	// .2:'rgb(0, 255, 255)',
	// .5:'rgb(0, 110, 255)',
	// .8:'rgb(100, 0, 255)'}
	});

	map.addOverlay(heatmapOverlay);
	heatmapOverlay.setDataSet({
		data : points,
		max : 100
	});
	function setGradient() {
		var gradient = {};
		var colors = document.querySelectorAll("input[type='color']");
		colors = [].slice.call(colors, 0);
		colors.forEach(function(ele) {
			gradient[ele.getAttribute("data-key")] = ele.value;
		});
		heatmapOverlay.setOptions({
			"gradient" : gradient
		});
	}
}
