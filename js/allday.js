// JavaScript Document
//需要获取data11--火山数量，data22--黑洞数量
var dayState;
var weekState;
var latitude = 0.0;
var longitude = 0.0;
var level = 2;
var bstate=[];
var vstate=[];
var pbstate=[];
var pvstate=[];

var data33=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var dateStart;
var dateEnd;
$.ajax({
	type:'GET',
		url:host+'/system/dayCurve?date='+date+'&latitude='+latitude+'&longitude='+longitude+'&level='+level,
		dataType:"json",
		success: function(data){
			dayState=data.data;
		    day=dayState.clockState;
		   for(var i=0;i<day.length;i++){
				bstate.push(day[i].blackholeNum);
				vstate.push(-day[i].volcanoNum);	
			}
			console.log(bstate);        
	        allDay();
		}
	});
function allDay(){
		 var lineChartDataall = {
			labels : ["00:00","01:00","02:00","03:00","04:00","05:00","06:00",
			            "07:00","08:00","09:00","10:00","11:00","12:00","13:00",
					    "14:00","15:00","16:00","17:00","18:00","19:00","20:00",
					    "21:00","22:00","23:00"],
			datasets : [
				{
					label: "My first dataset",
					fillColor:"rgba(0,0,0,1)",
					strokeColor : "#F00",
					pointColor : "#F00",
					pointStrokeColor : "#f30",
					pointHighlightFill : "#f30",
					pointHighlightStroke : "#f30",
					scaleLineWidth :10,	
					datasetStrokeWidth : 4,
					pointDotRadius : 4,
					data :bstate
				},
				{
					label: "My Second dataset",
					fillColor : "rgba(0,0,0,1)",
					strokeColor : "green",
					pointColor : "green",
					pointStrokeColor : "#060",
					pointHighlightFill : "#060",
					pointHighlightStroke : "060",
					scaleLineWidth :10,	
					data : vstate
				},{
					
					fillColor : "transparent",
					strokeColor : "grey",
					pointColor : "black", 
					pointStrokeColor : "transparent",
	                pointDotRadius : 2, 	
					data : data33,
				}
			]

		}	
		var ctx1 = document.getElementById("canvas").getContext("2d");
		window.myLine = new Chart(ctx1).Line(lineChartDataall, {
			responsive: true
		});
	}
	
$.ajax({
	    type:'GET',
		url:host+'/system/periodCurve?dateStart='+dateStart+'&dateEnd='+dateEnd+
		   '&latitude='+latitude+'&longitude='+longitude+'&level='+level,
		dataType:"json",
		success: function(data){
			weekState=data.data;
		    week=weekState.dayState;
		   for(var i=0;i<week.length;i++){
				pbstate.push(week[i].blackholeNum);
				pvstate.push(-week[i].volcanoNum);	
			}
			console.log(bstate);        
	        weekChange();
		}
	});
	
function weekChange() {
	 var lineChartDataall = {
			labels : [ "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun" ],
			datasets : [
				{
					label: "My first dataset",
					fillColor:"rgba(0,0,0,1)",
					strokeColor : "#F00",
					pointColor : "#F00",
					pointStrokeColor : "#f30",
					pointHighlightFill : "#f30",
					pointHighlightStroke : "#f30",
					scaleLineWidth :10,	
					datasetStrokeWidth : 4,
					pointDotRadius : 4,
					data :pbstate
				},
				{
					label: "My Second dataset",
					fillColor : "rgba(0,0,0,1)",
					strokeColor : "green",
					pointColor : "green",
					pointStrokeColor : "#060",
					pointHighlightFill : "#060",
					pointHighlightStroke : "060",
					scaleLineWidth :10,	
					data : pvstate
				},{
					
					fillColor : "transparent",
					strokeColor : "grey",
					pointColor : "black", 
					pointStrokeColor : "transparent",
	                pointDotRadius : 2, 	
					data : data33,
				}
			]
	 }
			 var ctx1 = document.getElementById("canvas").getContext("2d");
		window.myLine = new Chart(ctx1).Line(lineChartDataall, {
			responsive: true
		});
	
}

	