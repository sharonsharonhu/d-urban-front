// JavaScript Document
// JavaScript Document

/*var host='http://115.159.217.159:8080/soda';
//var host='http://10.129.15.3:8080/soda';
var hour=1;
var date="2016-03-01";
var group=1;
var i;	
var time;
var result;
*/
function time(){
	$.ajax({
	type:'GET',
	url:host+'/system/volcano?date='+date+'&hour='+hour+'&group='+group,
	dataType:"json",
	success: function(data){ 
	result=data.data[0];
	time=result.startTime;
     $("#timediv").html(time+':00');
	 
	}
	});

	group=group+1;
	if(group==3){
		group=1;
		hour=hour+1;	
	} 
	 if(hour==23) hour=1;
	 }
 setInterval(time,1000);



	
	