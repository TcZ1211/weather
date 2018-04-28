
var city = 'beijing';
// 读取数据，第一个参数是指定要读取的key以及设置默认值
chrome.storage.local.get("myCity",function(date){
	if( typeof(date.myCity)!='undefined' ){
		city = date.myCity;
	}
	console.log(city);
	console.log(date);
	GetWeather(city);
})

//获取机构
function GetWeather(local) {
	
	$.ajax({
		url: 'http://iloli.us/api/Weather.php',
		type: 'post',
		async: false,
		//dataType:'jsonp',
		//jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
		data: {'action': 'GetWeather','location': local},
		success: function (res) {
			var obj = JSON.parse(res); //由JSON字符串转换为JSON对象
			//var obj = res; //由JSON字符串转换为JSON对象
			if( obj.status=='ok' ){
				var html = '';
				$.each(obj.daily_forecast,function(i,n){
					html += '<tr>';
					html += '<td>'+n.date+'</td>';//日期
					html += '<td>'+n.tmp_max+' ℃</td>';//最高温度
					html += '<td>'+n.tmp_min+' ℃</td>';//最低温度
					html += '<td><img src="img/cond_icon/'+n.cond_code_d+'.png" width="20">'+n.cond_txt_d+'</td>';//白天天气
					html += '<td><img src="img/cond_icon/'+n.cond_code_n+'.png" width="20">'+n.cond_txt_n+'</td>';//晚间天气
					html += '<td>'+n.wind_dir+'</td>';//风向
					html += '<td>'+n.wind_sc+'</td>';//风力
					html += '</tr>';
				});
				html += '<tr><td colspan="10">最后更新时间：'+obj.update.loc+'</td></tr>'
				$('#Weather').html(html);
				$('#parent_city').html(obj.basic.admin_area);
				$('#location').html(obj.basic.location);
			}else{
				console.log(res);
				console.log(obj);
			}
		},
		error: function (res) {
			console.log(res);
		}
	});
	
	//当前天气
	$.ajax({
		url: 'http://iloli.us/api/Weather.php',
		type: 'post',
		async: false,
		//dataType:'jsonp',
		//jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
		data: {'action': 'GetNowWeather','location': local},
		success: function (res) {
			var obj = JSON.parse(res); //由JSON字符串转换为JSON对象
			//var obj = res; //由JSON字符串转换为JSON对象
			if( obj.status=='ok' ){
				$('#now_tmp').html(obj.now.tmp+'℃');
				$('#now_fl').html(obj.now.fl+'℃');
				$('#now_cond').html('<img src="img/cond_icon/'+obj.now.cond_code+'.png" width="20">'+obj.now.cond_txt);
			}else{
				console.log(res);
				console.log(obj);
			}
		},
		error: function (res) {
			console.log(res);
		}
	});
};

$('.savelocal').click(function(){
	city = $('#inputCity').val();
	// 保存数据
	chrome.storage.local.set({'myCity': city}, function() {
		console.log('保存成功！');
	});
	chrome.storage.local.get("myCity",function(date){
		console.log(date);
	})
});

$('.getweather').click(function(){
	city = $('#inputCity').val();
	if( city!='' ){
		GetWeather(city);
	}
});