var data_info = [[121.477362,31.235564,"<p style='font-size:15px;color:#000;line-height:25px'>"+"实际流量：123"+"</p>"
                                      +"<p style='font-size:15px;color:#000;line-height:25px'>"+"拥堵情况：一般"+"</p>"]
					];
				
	var opts = {
				width : 50,     // 信息窗口宽度
				height: 80,     // 信息窗口高度
				// 信息窗口标
				title : "<p style='font-size:30px;color:#000;margin-bottom: 5px'>"+"黑洞"+"</p>",
				enableMessage:true//设置允许信息窗发送短息
			   };
	for(var i=0;i<data_info.length;i++){
		var marker = new BMap.Marker(new BMap.Point(data_info[i][0],data_info[i][1]));  // 创建标注
		var content = data_info[i][2];
		map.addOverlay(marker);               // 将标注添加到地图中
		addClickHandler(content,marker);
	}
	function addClickHandler(content,marker){
		marker.addEventListener("click",function(e){
			openInfo(content,e);
			day();}
		);
	}
	function openInfo(content,e){
		var p = e.target;
		var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
		var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
		map.openInfoWindow(infoWindow,point); //开启信息窗口
	}
