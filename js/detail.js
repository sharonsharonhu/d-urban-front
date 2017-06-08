// JavaScript Document
//查看黑洞火山流量的功能
//获取定点监测的火山、黑洞位置

//circle.disableMassClear();//禁止覆盖物在map.clearOverlays方法中被清除
//获得黑洞信息




function finishCircle() {
    clearInterval(a);
  }






//获得火山信息
//var flow=volcano[i].outflow-volcano[i].inflow
//var day=[];
//var week=[];
var day=[];
var week=[];

//var day=[-103, -80, -106, -91,123,222,567,345,234,123,456,234,234,345,567,365,256,453,111,-234,-123,-345,-211];
//var week=[-103, -80, -106, -91,123,222,234];
//var flow=123;
var opts = {
			
	  width : 30,     // 信息窗口宽度
	  height: 40,     // 信息窗口高度
	  title : "<p style='font-size:30px;color:#000;margin-bottom: 5px'>"+"火山"+"</p>",// 信息窗口标题
	  enableMessage:true,//设置允许信息窗发送短息
	}
	var infoWindow = new BMap.InfoWindow("流量："+flow, opts);  // 创建信息窗口对象
	circle.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow,target); //开启信息窗口
		daychart(day);
		weekchart(week);
	}); 






var dayFlow=[];
var weekFlow=[];

function dayChart(){
$.ajax({
	type:'GET',
		url:host+'/system/dayState?date='+date+'&latitude='+latitude+'&longitude='+longitude+'&level='+level,
		dataType:"json",
		success: function(data){
			dayState=data.data;
		    day=dayState.clockState;
		   for(var i=0;i<day.length;i++){
				dayFlow.push(day[i].blackholeNum);
				daychart(dayFlow);
			}
			
		}
});
}

function weekChart(){
$.ajax({
	type:'GET',
		url:host+'/system/dayState?date='+date+'&latitude='+latitude+'&longitude='+longitude+'&level='+level,
		dataType:"json",
		success: function(data){
			dayState=data.data;
		    day=dayState.clockState;
		   for(var i=0;i<day.length;i++){
				weekFlow.push(day[i].blackholeNum);
				weekchart(weekFlow);
			}
			
		}
});
}

	
function daychart(day){
var chartdata=[];
chartdata=day;
          var lineChartData = {
			  labels : ["00:00","01:00","02:00","03:00","04:00","05:00","06:00",
			            "07:00","08:00","09:00","10:00","11:00","12:00","13:00",
					    "14:00","15:00","16:00","17:00","18:00","19:00","20:00",
					    "21:00","22:00","23:00"  ],
			 datasets : [
				         {
							//label: "My Second dataset",
							fillColor :  "transparent",
							strokeColor : "rgba(255,120,0,1)",
							pointColor : "rgba(255,120,0,1)",
							pointStrokeColor : "#fc0",
							pointHighlightFill : "#fc0",
							pointHighlightStroke : "rgba(255,153,0,1)",
							data :chartdata,
						 }
			            ]
                      }
			vo
				  var ctx = document.getElementById("canvas").getContext("2d");
				  window.myLine = new Chart(ctx).Line(lineChartData, {
					  responsive: true});
			  
}	
	
function weekchart(week){
var chartdata=[];
chartdata=week;
          var lineChartData = {
			  labels : ["Mon","Tue","Wen","Thurs","Fri","Sat","Sun"],
			 datasets : [
				         {
							//label: "My Second dataset",
							fillColor :  "transparent",
							strokeColor : "rgba(255,120,0,1)",
							pointColor : "rgba(255,120,0,1)",
							pointStrokeColor : "#fc0",
							pointHighlightFill : "#fc0",
							pointHighlightStroke : "rgba(255,153,0,1)",
							data :chartdata,
						 }
			            ]
                      }

				  var ctx = document.getElementById("canvas").getContext("2d");
				  window.myLine = new Chart(ctx).Line(lineChartData, {
					  responsive: true});
			  
}	

