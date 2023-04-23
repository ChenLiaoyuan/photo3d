<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<%
String path = request.getContextPath();
String shareUrlPath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String basePath = shareUrlPath+"photo3d/";
%>

<script>
	 //针对iOS进行适配
	 var isiOS = ${isiOS};
	 
	 //当前用户的图片，后台进行初始化，EL会自动转化为JSON
	 var currentImgList = ${currentImgList};
	 //默认图片
	 var defaultImgList = ${defaultImgList};
	
	 //用户歌曲
	 var currentMusicList = ${currentMusicList};
	 //默认歌曲
	 var defaultMusicList = ${defaultMusicList};
	 
	 //网站的url，用于拼接分享链接
	 var shareUrlPath = '<%=shareUrlPath%>';
</script>

<!DOCTYPE html>
<html>
	<head>
		<base href="<%=basePath%>">
		<meta charset="UTF-8">
		<!--缓存一个月-->
		<meta http-equiv="Cache-Control" content="max-age=2592000" />
		<title>Photo3D</title>
		<link rel="stylesheet" type="text/css" href="css/fonts.css"/>
		<link type="text/css" rel="stylesheet" href="css/fonts2.css"/>
		<link rel="stylesheet" type="text/css" href="css/loader.css"/>
		<link type="text/css" rel="stylesheet" href="css/photo3d.css"/>
		<script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
		<script type="text/javascript" src="js/cookieScript.js"></script>
		<script type="text/javascript" src="js/uploadShareScript.js"></script>
		<script type="text/javascript" src="js/starsScript.js"></script>
		<script type="text/javascript" src="js/musicScript.js"></script>
		<script type="text/javascript" src="js/photo3dScript.js"></script>
	</head>
	<body>
		<!--星空-->
		<div class="canvaszz"> </div>
  		<canvas id="canvas" class="canvas"></canvas> 
		<!--按钮，用户选择图片-->
		<div class="buttonWrap">
			<button class="button" onclick="choseUserImages()">我的照片</button>
			<button class="button" style="right: 200px;" onclick="defaultImages()">默认照片</button>
			<button class="button" style="right: 0px;color: #1d9d74;" onclick="uploadShare()">
				分享好友<i style="font-size: 15px;" class="icon-share-square"></i>
			</button>
			<input id="imgPath" type="file" accept="image/*" multiple/>
		</div>
		<div class="wrap">
			<div class="cube">
				<!--外面的立方体-->
				<div id="front" class="front"></div>
				<div class="back"></div>
				<div class="left"></div>
				<div class="right"></div>
				<div class="up"></div>
				<div class="bottom"></div>
				<!--里面的立方体-->
				<i class="i-front"></i>
				<i class="i-back"></i>
				<i class="i-left"></i>
				<i class="i-right"></i>
				<i class="i-up"></i>
				<i class="i-bottom"></i>
			</div>
		</div>
		<!--音乐界面-->
		<div class="player">
			<button class="button" onclick="musicButtonClick()">我的音乐</button>
			<button class="button" style="right: 0px;" onclick="defaultMusic()">默认音乐</button>
			<input id="musicFiles" type="file" accept="audio/*" multiple/>
			<!--歌曲列表-->
			<div class="songList">
				<ol></ol>
			</div>
			<!--歌曲信息-->
			<div class="songInfo">
				<font>Creep</font>
			</div>	
			<!--控制按钮-->
			<div class="controls">
				<div class="play">
					<i class="icon-play"></i>
				</div>
				<div class="previous">
					<i class="icon-previous"></i>
				</div>
				<div class="next">
					<i class="icon-next"></i>
				</div>
			</div>
			<!--时间轨-->
			<div class="time">
				<div id="currentTime"></div>
				<div id="totalTime"></div>
			</div>
			<div class="progress"></div>
			<div class="loader"></div>
			<!--音乐控件-->
			<audio preload="auto" id="audio" autoplay>
				<source src="" />
			</audio>
		</div>
		
		<!-- 文件上传进度 -->
		<div class="progressWrap">
			<div>
				<p class="progress-font">文件正在上传中，请稍等：</p>
				<progress id="progress" class="progress" value="0" max="100"></progress>
			</div>
		</div>
		
		<!-- 显示分享链接 -->
		<div class="shareLinkWrap">
			<div class="shareDiv">
				<div class="shareLink-font">复制下面链接，<br/>发送给好友即可分享。</div>
				<textarea id="textArea" class="share-textarea" readonly></textarea>
				<div>
					<a class="copyButton" onclick="copyShareLink()">复制</a> 
					<span class="icon-checkmark share-check" onclick="hideShareDiv()"></span>
				</div>
			</div>
		</div>
	</body>
</html>
