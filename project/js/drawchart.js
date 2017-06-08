// JavaScript Document
var chartpoint;
var chartdata=[];
/*$.ajax({
	type:'GET',
	url:host+'/system/volcano?date='+date+'&hour='+hour+'&group='+group,
	dataType:"json",
	success: function(data){
		  volcano=data.data;
		  for(i=0;i<volcano.length;i++){
		 chartdata.push(volcano[i].inFlow-volcano[i].outFlow);
		 }
		 	});*/
		  chartdata=[-103, -80, -106, -91,123,222,
		              567,345,234,123,456,234,
					  234,345,567,365,256,453,
					  111,-234,-123,-345,-211];
		  var maxdata=[100,100,100,100,100,100,100,100,100,100,100,100,100,100,
		  100,100,100,100,100,100,100,100,100,100];
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
							
							 
				          },
						  {
					
					fillColor : "transparent",
					strokeColor : "grey",
					pointColor : "black", 
					pointStrokeColor : "transparent",
	                pointDotRadius : 2, 	
					data : maxdata,
				}
			            ]
                      }
			function spotchart(){
				  var ctx = document.getElementById("canvas").getContext("2d");
				  window.myLine = new Chart(ctx).Line(lineChartData, {
					  responsive: true});
			  }
		 
