/**
 * 设置cookie
 * @param {Object} cname 
 * @param {Object} cvalue
 * @param {Object} exdays
 */
function setCookie(cname,cvalue,exdays)
{
	var d = new Date();
	var expires;
	if(exdays) {
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		expires = "expires=" + d.toGMTString();
	}
	var cookieStr = cname + "=" + cvalue;
	if(expires) {
		cookieStr += "; " + expires;
	}
	document.cookie = cookieStr;
}

/**
 * 获取cookie
 * @param {Object} cname
 */
function getCookie(cname)
{
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if(c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return "";
}

/**
 * 检查用户访问是否带有设置的cookie，
 * 没有的话则说明是用浏览器第一次打开，
 * 相当于新的一个访问量，
 * 如果有设置的cookie，则说明已经用浏览器打开了，正在访问其他资源，访问量不加1
 * （cookie默认是关闭浏览器失效）
 */
function checkCookie()
{
	var visitCounts = getCookie("visitCounts");
	if(visitCounts != "") {
		console.log("当前访问总次数为:" + visitCounts);
	} else {
		visitCounts ++;
		var date = new Date();
		console.log("新用户正在访问，访问时间为："+date.toDateString());
		setCookie("visitCounts", visitCounts);
	}
}

/**
 * 只能获取响应头ResponseHeader，好像请求头RequestHeader js获取不了
 */
function getHeader(){
	var req = new XMLHttpRequest();
	//false表示使用同步
	req.open("GET",document.location,false);
	req.send();
	var responseHeader =req.getAllResponseHeaders();
	console.log(responseHeader);
}
