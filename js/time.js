// JavaScript Document
// JavaScript Document
var host ='http://182.254.148.45:8080/soda';
//var host='http://115.159.217.159:8080/soda';
//var host='http://10.129.15.3:8080/soda';
var hour=0;
var date="2016-03-01";
var group=1;
var i;	
var timer;
var stimer;
var result;
var isStart = 1;

function start() {
	isStart =1;
	clearInterval(timer);
	clearInterval(stimer);
	timer = setInterval(timeControl, 2000);
	stimer = setInterval(move, 125);
}

function inStart() {
	clearInterval(timer);
	clearInterval(stimer);
	timer = setInterval(timeControl, 2000);
	stimer = setInterval(move, 125);
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
$.ajax({
	type:'GET',
	url : host + '/system/blackhole?date=' + date + '&hour=' + hour+ '&group=' + group,
	//url:host+'/system/volcano?date='+date+'&hour='+hour+'&group='+group,
	//url:host+'/system volcano?date='+"2016-03-01"+'&hour='+0+'&group='+0,
	
	dataType:"json",
	success: function(data){ 
	//result=data.data[0];
	//time=result.startTime;
     //$("#timediv").html(time+':00');
	 timeControl()
	}
	});

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


	
	