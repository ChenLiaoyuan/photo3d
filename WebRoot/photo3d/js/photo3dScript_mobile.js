//var currentImgList; //当前图片列表，提到jsp页面进行初始化了
//var defaultImgList = []; //默认图片列表，提到jsp页面进行初始化了
var userImgList = []; //用户图片列表
//用户的图片是否已经全部加载完（每次最多加载6张，已经加载的直接显示）
var userImgLoadSuccess = false; 
//用于记录播放到第几张图片了，到了最后一张则重复第一张
var imgIndex = 0;
//记录用户鼠标位置，当鼠标在立方体上则不自动收回
var mouseX,mouseY;

/*初始化*/
$(function(){
	//初始化当前用户的图片
	initCurrentImage();
	
	//每20秒轮换一次图片
	setInterval(changeImg,20000);
	
	//给立方体添加hover事件，用于自动展开图片
	cubeHover();
	
	//立方体的绝对坐标
	var cubeX = getElementLeft($(".wrap .cube")[0]);
	var cubeY = getElementTop($(".wrap .cube")[0]);
	//监听鼠标事件，用于判断鼠标是否在立方体中
	window.addEventListener("mousemove",function(){
		mouseX = window.event.pageX;
		mouseY = window.event.pageY;
	},false);
	//循环展开立方体，10次一次，每次展开6秒
	setInterval(function(){
		//手动触发立方体鼠标经过事件
		$(".wrap .cube").mouseover();
		//延迟6秒才收回立方体
		setTimeout(function(){
			//如果鼠标在立方体上则不收回
			if(!mouseInElement(cubeX,cubeY,$(".wrap .cube")[0].clientWidth,$(".wrap .cube")[0].clientHeight)){
				$(".wrap .cube").mouseout();
			}
		},6000);
	},10000);
	
	//当用户选择图片时进行显示
	$("#imgPath").change(userImageChange);
	
	//初始化播放器
	initMusicPlayer();
	
	//画星星
	drawStars();
	
	//设置cookie用于统计访问次数
	//checkCookie();
	
	//设置3D立方体居中
	//document.body.clientHeight为网页可见区域高度
	//window.innerHeight为浏览器内部高度，不包括标签，
	//如果网页还没加载完成，iOS设备的window.innerHeight不是整个浏览器的高度
    $(".wrap").css("margin-top",(document.body.clientHeight-58)/2-300+"px");
});

/**
 * 初始化当前用户的图片
 */
function initCurrentImage(){
	/*
	 * 改成在后台初始化了
	for(var i=1;i<=9;i++){
		var image = new Object();
		if(i>=1 && i<=6){
			//第1到第6张一起显示
			image.isSingle = false;
		}else{
			//其他的单独显示
			image.isSingle = true;
		}
		var name = "url(img/img"+i+".png)";
		image.name = name;
		defaultImgList.push(image);
	}
	
	//一开始就加载的图片放最后，循环新的一轮播放
	var image = new Object();
	image.isSingle = true;
	image.name = "url(img/img.png)";
	defaultImgList.push(image);
	*/
	
	//当前图片列表设置为默认列表
	//currentImgList = defaultImgList;
	//显示图片
	changeImg();
}

/**
 * 用户选择图片后进行更换显示
 */
function changeImg(){
	if(currentImgList != userImgList){
		var isSingle = false;
		$(".wrap .cube div").each(function(index,domEle){
			if(imgIndex >= currentImgList.length){
				imgIndex = 0;
			}
			//如果图片是单独显示的，则6个面都显示同一张
			if(currentImgList[imgIndex].isSingle){
				isSingle = true;
				$(this).css("background-image",currentImgList[imgIndex].name);
				//imageIndex不加1
				$(".wrap .cube i").eq(index).css("background-image",currentImgList[imgIndex].name);
			}else{
				//否则6张图片一起显示
				$(this).css("background-image",currentImgList[imgIndex].name);
				//imageIndex加1
				$(".wrap .cube i").eq(index).css("background-image",currentImgList[imgIndex++].name);
			}
		});
		
		//如果图片是单独显示的，添加完图片后需要加1，指向下张图片
		if(isSingle){
			imgIndex++;
		}
	}else if(currentImgList == userImgList){
		//如果所有照片还没有读取完成，则进行读取
		if(!userImgLoadSuccess){
			//以imgIndex位置开始读取，每次最多读取6张图
			var loadIndex = 0; //一个图片读取完成，就加载一个
			for(var i=imgIndex,j=imgIndex;i<6+imgIndex && i<userImgList.length;i++){
				//一张图片一个FileReader线程读取
				var fileReader = new FileReader();
				fileReader.onload = function(e){
					var data = e.target.result;
					//存储读取后的结果
					userImgList[j++] = data;
					
					//读完之后便立刻设置图片
					$(".wrap .cube div").eq(loadIndex).css("background-image","url("+userImgList[imgIndex]+")");
					$(".wrap .cube i").eq(loadIndex++).css("background-image","url("+userImgList[imgIndex++]+")");
					
					//如果j等于userImgList.length则说明所有图片都已经读取完成了
					if(j >= userImgList.length){
						userImgLoadSuccess =  true;
						//不过有可能6面的图片还没有设置完成，则需要设置
						for(;loadIndex < 6;loadIndex++){
							if(imgIndex >= userImgList.length){
								imgIndex = 0;
							}
							$(".wrap .cube div").eq(loadIndex).css("background-image","url("+userImgList[imgIndex]+")");
							$(".wrap .cube i").eq(loadIndex).css("background-image","url("+userImgList[imgIndex++]+")");
						}	
					}
				}
				//读取完成后，会调用上面的onload方法，
				//需要注意的是onload是异步的，它不会等待读完这个图片才执行下一步代码
				fileReader.readAsDataURL(userImgList[i]);
			}
			
		}else{
			//如果所有图片都已经加载完成了，直接设置即可
			$(".wrap .cube div").each(function(index,domEle){
				if(imgIndex >= currentImgList.length){
					imgIndex = 0;
				}
				$(this).css("background-image","url("+currentImgList[imgIndex]+")");
			
				$(".wrap .cube i").eq(index).css("background-image","url("+currentImgList[imgIndex++]+")");
			});	
		}
		
	}
}

/**
 * 立方体绑定鼠标移入、移出事件，用于自动展开图片
 */
function cubeHover(){
	$(".wrap .cube").mouseover(function(){
		$(".wrap .cube div").css("opacity","0.9");
		$(".wrap .cube .front").css("transform","translateZ(300px)");
		$(".wrap .cube .back").css("transform","rotateY(180deg) translateZ(300px)");
		$(".wrap .cube .left").css("transform","rotateY(-90deg) translateZ(300px)");
		$(".wrap .cube .right").css("transform","rotateY(90deg) translateZ(300px)");
		$(".wrap .cube .up").css("transform","rotateX(90deg) translateZ(300px)");
		$(".wrap .cube .bottom").css("transform","rotateX(-90deg) translateZ(300px)");
	});
	$(".wrap .cube").mouseout(function(){
		$(".wrap .cube div").css("opacity","0.2");
		$(".wrap .cube .front").css("transform","translateZ(150px)");
		$(".wrap .cube .back").css("transform","rotateY(180deg) translateZ(150px)");
		$(".wrap .cube .left").css("transform","rotateY(-90deg) translateZ(150px)");
		$(".wrap .cube .right").css("transform","rotateY(90deg) translateZ(150px)");
		$(".wrap .cube .up").css("transform","rotateX(90deg) translateZ(150px)");
		$(".wrap .cube .bottom").css("transform","rotateX(-90deg) translateZ(150px)");
	});
}

/**
 * 获取该元素相对于html文档的绝对横坐标
 * @param {Object} element
 */
function getElementLeft(element){
	//offsetLeft是相对于父元素的左距离，
	//因此想要获得绝对横坐标就把所有父元素的offsetLeft加起来即可
	var left = element.offsetLeft;
	var parent = element.parentElement;
	
	while(parent != null){
		left += parent.offsetLeft;
		parent = parent.parentElement;
	}
	return left;
}

/**
 * 获取该元素相对于html文档的绝对纵坐标
 * @param {Object} element
 */
function getElementTop(element){
	var top = element.offsetTop;
	var parent = element.parentElement;
	
	while(parent != null){
		top += parent.offsetTop;
		parent = parent.parentElement;
	}
	return top;
}

/**
 * 鼠标是否在元素中
 * @param {Object} elementX
 * @param {Object} elementY
 * @param {Object} elementWidth
 * @param {Object} elementHeight
 */
function mouseInElement(elementX,elementY,elementWidth,elementHeight){
	if(mouseX >= elementX && mouseX <= elementX + elementWidth+100){
		if(mouseY >= elementY && mouseY <= elementY + elementHeight+100){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
}

/**
 * 用button触发图片选择的input
 */
function choseUserImages(){
	$("#imgPath").click();
}

/**
 * 恢复默认图片
 */
function defaultImages(){
	//第一张图片放在了最后
	//imgIndex = defaultImgList.length -1;
	imgIndex = 0;
	currentImgList = defaultImgList;
	changeImg();
}

/**
 * 用户选择图片，进行识别保存
 */
function userImageChange(){
	var imgFiles = document.getElementById("imgPath");
	var files = imgFiles.files;
	
	var hasImg = false; //是否有照片
	var cleared = false; //是否已经清空
	for(var i=0;i< files.length;i++){
		//文件是图片才进行添加
		if(/image\/\w+/g.test(files[i].type)){
			hasImg = true;
			if(hasImg && !cleared){
				userImgList = [];
				//记录用户选择的图片，如果用户要分享则进行上传
				imageUploads = [];
				cleared = true;
			}
			/* update 2020/05/03 使用url链接的方式读取图片，不使用二进制文件的方式 */
			var imageUrl = URL.createObjectURL(files[i]);
			userImgList.push(imageUrl);
			
			//记录用户选择的图片，如果用户要分享则进行上传
			imageUploads.push(files[i]);
			//userImgList.push(files[i]);
		}
	}
	
	//调用修改图片的方法进行显示
	if(hasImg){
		imgIndex = 0;
		currentImgList = userImgList;
		/* update 2020/05/03 使用url链接的方式读取图片，不使用二进制文件的方式 */
		userImgLoadSuccess = true;
		changeImg();
	}
}

