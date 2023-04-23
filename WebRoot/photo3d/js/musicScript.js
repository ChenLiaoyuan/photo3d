//var defaultMusicList = []; //默认歌曲列表，提到jsp页面进行初始化了
//var defaultMusicNames = []; //默认歌曲名称列表，已弃用
var userMusicList = []; //用户本地歌曲列表
//var currentMusicList; //当前歌曲列表，提到jsp页面进行初始化了
var timeTask; //时间轨的循环进程标识
//是否响应歌曲点击进行加载，避免过快点击导致加载失败
//渣渣服务器需要，Tomcat不需要
var clickDisable = false; 
//可能网络不够快，音乐资源还没加载完成，不能播放,
//便让音乐重新加载,但20次之后还没加载尝试加载下一首进行播放
var reloadTimes = 0; 
// 开始默认为不播放
var playNow = false;
/**
 * 初始化播放器
 */
function initMusicPlayer(){
	//购买的腾讯云服务器宽带不够，改成链接网易云的音乐源
	/*使用后台进行初始化
	defaultMusicNames =[
		{musicName:"我和我的祖国.mp3",mp3url:"http://music.163.com/song/media/outer/url?id=1393224585"},
		{musicName:"病变.mp3",mp3url:"http://music.163.com/song/media/outer/url?id=543607345"},
		{musicName:"芒种.mp3",mp3url:"http://music.163.com/song/media/outer/url?id=1369798757"},
		//{musicName:"Creep.mp3",mp3url:"music/Creep.mp3"},
		{musicName:"渐渐被你吸引.mp3",mp3url:"http://music.163.com/song/media/outer/url?id=474042450"},
		//{musicName:"渐渐被你吸引.mp3",mp3url:"music/渐渐被你吸引.mp3"},
		{musicName:"从别后.mp3",mp3url:"music/从别后.mp3"},
		{musicName:"杀破狼.mp3",mp3url:"http://music.163.com/song/media/outer/url?id=4875307"},
		{musicName:"Nothing In The World.mp3",mp3url:"http://music.163.com/song/media/outer/url?id=22513542"},
		{musicName:"Loves Me Not.mp3",mp3url:"http://music.163.com/song/media/outer/url?id=4331105"}
	];
	*/
	
	//初始化音乐列表
	initMusicList(true,currentMusicList);
	
	//绑定控件点击事件
	$(".player .controls .play").unbind("click").bind("click",playerControls.playorPause);
	$(".player .controls .next").unbind("click").bind("click",playerControls.next);
	$(".player .controls .previous").unbind("click").bind("click",playerControls.pervious);
	
	//绑定时间轨点击事件，播放进度直接跳到鼠标位置
	$(".player .time").unbind("click").bind("click",function(e){
		if(e.target == $(".player .time")[0]){
			playerControls.jump(e.offsetX);
		}
	});
	//时间轨的当前时间文字元素点击处理
	$(".player .time #currentTime").unbind("click").bind("click",function(e){
		playerControls.jump(e.offsetX);
	});
	//时间轨的所有时间文字元素点击处理
	$(".player .time #totalTime").unbind("click").bind("click",function(e){
		var width = $(".player .time")[0].clientWidth - ($(this)[0].clientWidth - e.offsetX);
		playerControls.jump(width);
	});
	
	//当用户选择音乐时进行加载
	$("#musicFiles").change(loadUserMusic);
	
	//绑定快捷键
	hotKey();
}

/**
 * 播放器状态
 */
var playStatus = {
	totalMusics: 0, //歌曲总数
	_musicIndex: 0, //第几首歌
	totalTime: 999999, //歌曲总时长
	//加下划线表示受保护的对象，即protected
	_isPlaying: false //是否正在播放
};

/**
 * 使用definedProperty重新定义playStatus的isPlaying属性，
 * 如果isPlaying属性改变了，则做出相应的处理
 */
Object.defineProperty(playStatus, 'isPlaying', {
	get: function() {
		return this._isPlaying;
	},
	set: function(value) {
		this._isPlaying = value;
		//状态改变，刷新播放状态和播放时间
		playerControls.playMusic();
		playerControls.showPlayTime();
	}
});

/**
 * 使用definedProperty重新定义playStatus的musicIndex属性，
 * 如果歌曲改变了，则刷新歌词名称
 */
Object.defineProperty(playStatus,"musicIndex",{
	get: function(){
		return this._musicIndex;
	},
	set: function(value){
		this._musicIndex = value;
		playerControls.showMusicInfo();
	}
});

/**
 * 初始化播放状态
 * @param {Object} musicIndex 当前歌曲位置
 * @param {Object} isPlaying 是否播放
 */
function initPlayStatus(musicIndex,isPlaying){
	playStatus.totalMusics = currentMusicList.length;
	playStatus.musicIndex = musicIndex;
	//playStatus.totalTime = $("#audio")[0].duration;
	playStatus.isPlaying = isPlaying;

	if(playNow == false){
		// 后面点击上下首时，就会自动播放
		playNow = true;
	}
}

/**
 * 音乐播放控制器
 */
var playerControls = {
	
	/**
	 * 初始化audio元素
	 * @param {Object} index
	 */
	initAudio: function(index){
		//var index = $(".songList ol li").index(this);
		//clickDisable是用于避免用户过快点击音乐列表，导致加载错误
		if(!clickDisable){
			//此时音乐进行加载，阻止点击事件
			clickDisable = true;
			//$("#audio").remove();
			//$(".player").append("<audio id='audio' preload='auto' autoplay> <source src=''></source>"+"</audio>");
			
			//如果是默认音乐，直接赋值src即可
			if(currentMusicList != userMusicList){
				//$("#audio source").attr("src",currentMusicList[index].mp3url+"?foreReload="+new Date().getTime());
				$("#audio source").attr("src",currentMusicList[index].mp3url);
				//加载audio音频
				$("#audio")[0].load();
				//audio加载完成后则初始化播放状态，进行播放
				//$("#audio")[0].onloadedmetadata = function(){};
				setTimeout(function(){
					initPlayStatus(index,playNow);
				},100);
			}else if(currentMusicList == userMusicList){
			//如果是用户音乐，而且已经加载过了，则也直接赋值src	
				if(currentMusicList[index].isLoad){
					$("#audio source").attr("src",currentMusicList[index].mp3url);
					//加载audio音频
					$("#audio")[0].load();
					//audio加载完成后则初始化播放状态，进行播放
					setTimeout(function(){
						initPlayStatus(index,playNow);
					},100);
				}else{
					//还没加载则对音乐文件进行读取
					var fileReader = new FileReader();
					fileReader.onload = function(e){
						var data = e.target.result;
						currentMusicList[index].mp3url = data;
						currentMusicList[index].isLoad = true;
						$("#audio source").attr("src",data);
						//因为fileReader是异步加载的，
						//所以下面音乐加载这部分相同的代码不能提出去，
						//否则音乐还没加载完就播放了，会造成错误
						//加载audio音频
						$("#audio")[0].load();
						//audio加载完成后则初始化播放状态，进行播放
						setTimeout(function(){
							initPlayStatus(index,playNow);
						},100);
					};
					fileReader.readAsDataURL(currentMusicList[index].mp3url);
				}
			}
			
			//指定时间过后开放音乐列表点击事件
			setTimeout(function(){
				clickDisable = false;
			},10);
		}
	},
	
	/**
	 * 显示音乐信息
	 */
	showMusicInfo: function(){
		var songName = currentMusicList[playStatus.musicIndex].musicName;
		//"\w"匹配一个单字字符（字母、数字或者下划线）,等价于 [A-Za-z0-9_]
		var regex = /\.\w+/gi; //去掉.mp3后缀
		songName = songName.replace(regex,"");
		//"."表示匹配所有字符
		//"*"表示匹配前一个表达式 0 次或多次，".*"连起来则表示尽可能地匹配多个任意字符
		//"-"普通字符
		//"\s*"多个空白字符
		regex = /.*-\s*/;
		//把Alan Walker - Faded.mp3前面的歌手去掉
		songName = songName.replace(regex,"");
		//将歌曲后面括号（）的内容去掉
		regex = /[(（].*[)）]/gi;
		songName = songName.replace(regex,"");
		//将数字_ 内容去掉
		regex = /[0-9]*_/gi;
		songName = songName.replace(regex,"");
		//将[msd243...]去掉
		regex = /\[.*\]/gi;
		songName = songName.replace(regex,"");
		$(".player .songInfo font").text(songName);
		
		//如果歌曲数量大于15个，则当前播放的歌名高亮，方便查找
		if(currentMusicList.length > 15){
			$(".player .songList ol li").css("background-color","");
			$(".player .songList ol li").eq(playStatus.musicIndex)
				.css("background-color","rgba(238,238,238,0.5)");
		}
	},
	
	/**
	 * 播放、暂停音乐
	 */
	playMusic: function(){
		if(playStatus.isPlaying == true){
			/*$("#audio")[0].load();*/
			var playPromise = $("#audio")[0].play();
			if(isiOS == true){
				iOSAutoPlay();
			}
			if (playPromise !== undefined) {
			    playPromise.then(function(){
			        //只有audio加载成功后才进行播放和设置时长
			        $("#audio")[0].play();
			        playStatus.totalTime = $("#audio")[0].duration;
			        $("#totalTime").text(timeConvert(playStatus.totalTime));
			   		//加载成功，加载次数恢复为0
			   		reloadTimes = 0;
			   		//播放1分钟后预加载下一首歌
			   		setTimeout(function(){
			   			playerControls.preloadAudio();
			   		},60*1000);
			    }).catch(function(){
			       console.log("加载音乐失败，正在重新加载"+reloadTimes+"......");
			       setTimeout(function(){
			    	   //20次还没加载完成，尝试是否能加载播放下一首
			       		if(reloadTimes >= 20){
			       			$(".player .controls .next").click();
			       			$("#audio")[0].load();
			       			reloadTimes = 0;
			       		}else{
			       			playerControls.playMusic();
			       			reloadTimes++;
			       		}
			       },1000);
			    })
			}
			
		}else{
			if($("#audio")[0].played){
				$("#audio")[0].pause();
			}
		}
		//刷新播放按钮状态
		$('.player .controls .play i').attr('class', 'icon-' + (playStatus.isPlaying ? 'pause' : 'play'));
	},
	
	/**
	 * 下一首
	 */
	next: function(){
		if(playStatus.musicIndex + 1 >= currentMusicList.length){
			playStatus.musicIndex = 0;
		}else{
			playStatus.musicIndex += 1;
		}
		playerControls.initAudio(playStatus.musicIndex);
	},
	
	/**
	 * 上一首
	 */
	pervious: function(){
		if(playStatus.musicIndex - 1 < 0){
			playStatus.musicIndex = currentMusicList.length-1;
		}else{
			playStatus.musicIndex -= 1;
		}
		playerControls.initAudio(playStatus.musicIndex);
	},
	
	/**
	 * 播放或者暂停
	 */
	playorPause: function(){
		playStatus.isPlaying = !playStatus.isPlaying;
	},
	
	/**
	 * 跳歌
	 */
	jump: function(width){
		var clientWidth = $(".player .time")[0].clientWidth;
		var jumpTime = width / clientWidth * playStatus.totalTime;
		$("#audio")[0].currentTime = jumpTime;
	},
	
	/**
	 * 显示时间轨
	 */
	showPlayTime: function(){
		if(playStatus.isPlaying == true){
			timeTask = setInterval(function(){
				var currentTime = $("#audio")[0].currentTime;
				$("#currentTime").text(timeConvert(currentTime));
				$(".player .progress").css("width",currentTime/playStatus.totalTime * 100+"%");
				if(currentTime > playStatus.totalTime - 2){
					playerControls.next();
				}
				//readyState != 4则说明还没加载完成，添加isPlaying的判断查看下面注释
				if($("#audio")[0].readyState != 4 && playStatus.isPlaying == true){
					$(".player .loader").css("display","block");
				}else{
					$(".player .loader").css("display","none");
				}
			},300);
		}else{
			//清楚定时任务是异步的，所以下面加载隐藏的语句会先执行，然后定时任务还在跑，
			//而定时任务还有显示加载的语句，如果音乐还没加载完成，会把加载动画再次显示出来，
			//因此需要加上isPlaying的判断
			clearInterval(timeTask);
			$(".player .loader").css("display","none");
		}
	},
	/**
	 * 播放音乐1分钟后预加载下一首歌
	 */
	preloadAudio: function(){
		var nextMusicIndex = 0;
		if(playStatus.musicIndex + 1 >= currentMusicList.length){
			nextMusicIndex = 0;
		}else{
			nextMusicIndex = playStatus.musicIndex + 1;
		}
		$("#preloadAudio").remove();
		$("body").append("<audio id='preloadAudio' preload='auto'> <source src=''></source>"+"</audio>");
		//会把资源预加载到浏览器中，当播放下一首歌时，
		//因为链接是一样的，浏览器会直接从缓存中获取播放
		//状态码为Status Code:206 Partial Content (from disk cache)
		//Status Code:304 Not Modified
		$("#preloadAudio source").attr("src",currentMusicList[nextMusicIndex].mp3url);
		$("#preloadAudio")[0].load();		
	}
};

/**
 * 初始化音乐列表
 * @param {Object} isDefault 默认音乐列表，还是用户音乐
 * @param {Object} musicData 默认音乐名或者用户音乐数据
 */
function initMusicList(isDefault,musicData){
	$(".songList ol").empty();
	//默认音乐列表
	if(isDefault){
		
		//defaultMusicList = [];
		for(var i=0;i<musicData.length;i++){
			//var musicInfo = new Object();
			//musicInfo.musicName = musicData[i];
			//musicInfo.mp3url = "music/"+musicData[i];
			//defaultMusicList.push(musicInfo);
			//defaultMusicList.push(musicData[i]);
			
			var musicName = musicData[i].musicName.replace(/[0-9]*_/gi,"");
			$(".songList ol").append("<li>"+musicName+"</li>");
		}
		
		//当前音乐列表设为默认音乐列表
		currentMusicList = musicData;
	}else{
		//用户选择的音乐
		for(var i=0;i<musicData.length;i++){
			var musicName = musicData[i].musicName.replace(/[0-9]*_/gi,"");
			$(".songList ol").append("<li>"+musicName+"</li>");
		}
		//当前音乐列表设为用户音乐列表
		currentMusicList = musicData;
	}
	
	//添加列表点击事件
	var lis = $(".songList ol li");
	for(var i = 0; i < lis.length; i++) {
		lis[i].index = i;
		lis[i].onclick = function() {
			playerControls.initAudio(this.index);
		}
	}
	
	//初始化第一首歌并播放（改为手动播放了）
	playerControls.initAudio(0);
	
}

/**
 *  用button触发音乐选择的input
 */
function musicButtonClick(){
	$("#musicFiles").click();
}

/**
 * 加载用户音乐
 */
function loadUserMusic(){
	var musicFiles = document.getElementById("musicFiles");
	var files = musicFiles.files;
	
	var hasMusic = false;
	var hasClear = false;
	for(var i=0;i<files.length;i++){
		if(/audio\/\w+/gi.test(files[i].type)){
			hasMusic = true;
			if(hasMusic && !hasClear){
				//用户选择的文件有音乐，则清空用户音乐列表重新添加
				userMusicList = [];
				
				//记录用户选择的音乐，如果用户要分享则进行上传
				musicUploads = [];
				hasClear = true;
			}
			
			var musicInfo = new Object();
			musicInfo.musicName = files[i].name;
			/* update 2020/05/03 修改为以url链接的方式读取歌曲，不是以二进制的方式 */
			var mp3Url = URL.createObjectURL(files[i]);
			musicInfo.mp3url = mp3Url;
			musicInfo.isLoad = true;
			//musicInfo.mp3url = files[i];
			//musicInfo.isLoad = false; //是否已经将这首歌读取成url模式
			
			userMusicList.push(musicInfo);
			
			//记录用户选择的音乐，如果用户要分享则进行上传
			musicUploads.push(files[i]);
		}
	}
	
	if(hasMusic){
		//初始化音乐列表
		initMusicList(false,userMusicList);
	}
	
}

/**
 * 恢复默认音乐
 */
function defaultMusic(){
	initMusicList(true,defaultMusicList);
}

/**
 * 秒数转换成 分:秒
 * @param {Object} timeStamp
 */
function timeConvert(timeStamp){
	var minutes = Math.floor(timeStamp / 60);
	var second = Math.floor(timeStamp % 60);
	if(second < 10){
		return minutes + ":0"+ second;
	}else{
		return minutes + ":"+ second;
	}
}

/**
 * iOS 新系统 手机上使用微信和 Safari 浏览器访问,都是无法自动播放音频的.
 * 只能用"野生"方法, 借用原来老的 WeixinJSBridge实现自动播放，
 * 解析链接https://gist.github.com/ufologist/7c14837db642a6e916ce
 */
function iOSAutoPlay(){
	//第一种方式
	if(typeof WeixinJSBridge != 'undefined'){
		WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
			$("#audio")[0].play();
		});
	}
	
	//第二种方式，需要引入<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
	//引入前需要先判断是否是微信浏览器(MicroMessenger)，否则其他浏览器会报错	
	//核心原理: 在微信的JS-API 中 play 一下 audio 即可达到自动播放的目的(应该是微信自己做了处理)
	//通过config接口注入权限验证配置后, 在 ready 中 play 一下 audio
    /*
    wx.config({
        // 配置信息, 即使不正确也能使用 wx.ready
        debug: false,
        appId: '',
        timestamp: 1,
        nonceStr: '',
        signature: '',
        jsApiList: []
    });
    wx.ready(function() {
        $("#audio")[0].play();
    });
	*/
}

/**
 * 绑定快捷键
 */
function hotKey(){
	$("html").unbind("keydown").keydown(function(e) {
		//播放快捷键 空格
		//事件会冒泡,只有nodeName为body或者html才出发,否则input框按下空格键也会触发
		if((e.target.nodeName == "BODY" || e.target.nodeName == "HTML") && e.keyCode == 32) {
			$('.player .controls .play').click();
		}
	
		//下一首快捷键 Ctrl + Alt + ->
		if(e.ctrlKey && e.altKey && e.keyCode == 39) {
			$('.player .controls .next').click();
		}
	
		//上一首快捷键,Ctrl + Alt + <-
		if(e.ctrlKey && e.altKey && e.keyCode == 37) {
			$('.player .controls .previous').click();
		}
	});
}


/**
 * 暂时没用
 */
function fetchAudioAndPlay() {
    //手动加载音乐资源
    fetch('music/Creep.mp3').then(
    	function(response){
    		return response.blob();
    	}).then(function(blob){
    		var fileReader = new FileReader();
    		
    		fileReader.onload = function(e){
    			var audioObject = e.target.result;
    			var audio = document.getElementById("audio");
    			audio.src = audioObject;
    			audio.load();
    			setTimeout(function(){
    				audio.play();},1000);
    		}
    		
    		fileReader.readAsDataURL(blob);
    	});
}
