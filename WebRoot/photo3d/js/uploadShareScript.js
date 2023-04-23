var imageUploads = [];
var musicUploads = [];
var shareUrl = "";

function uploadShare(){
	//如果是80端口，则把80端口去掉
	shareUrlPath = shareUrlPath.replace(/:80\//gi,"/");
	shareUrl = shareUrlPath+ "?";
	
	if(imageUploads.length > 0){
		var needUploadMusic = false;
		if(musicUploads.length > 0){
			needUploadMusic = true;
		}
		upload(imageUploads,"uploadImageServlet","userImageId",needUploadMusic);
	}
	
	if(musicUploads.length > 0){
		var needUploadMusic = false;
		upload(musicUploads,"uploadMusicServlet","userMusicId",needUploadMusic);
	}
	
	//如果用户没有上传，则显示默认的链接
	if(imageUploads.length <= 0 && musicUploads.length <= 0){
		console.log(shareUrl);
    	$("#textArea").val(shareUrl);
    	$(".shareLinkWrap").css("display","flex");
	}
	
}

/**
 * 上传文件
 * @param {Object} files 主要上传的文件
 * @param {Object} action 处理文件的action
 * @param {Object} paramId 参数名，用于拼接分享链接
 * @param {Object} needUploadMusic 是否需要上传音乐文件，用于判断分享链接是否已经拼接完整
 */
function upload(files,action,paramId,needUploadMusic){

    var formData = new FormData();
    for(var i=0;i<files.length;i++){
        //添加的是一个数组
        formData.append('files[]',files[i]);
    }

    var xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.onreadystatechange = function(){
        if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200){
        	//进度条消失
        	$(".progressWrap").fadeOut(200);
        	
        	console.log("文件上传成功");
            //后台服务返回uuid
            shareUrl += "&"+paramId+"=" + xmlHttpRequest.responseText;
            if(!needUploadMusic){
            	console.log(shareUrl);
            	$("#textArea").val(shareUrl);
            	$(".shareLinkWrap").css("display","flex");
            }
        }
    }

    xmlHttpRequest.onerror = function(){
    	alert("抱歉，文件上传分享失败。您可以告知开发者进行完善，感谢：1240773369@qq.com");
        console.log("文件上传分享失败:"+xmlHttpRequest.statusText);
        //进度条消失
        $(".progressWrap").fadeOut(200);
    }

	//进度条，使用同步的方式不会进入进度条
    xmlHttpRequest.upload.onprogress = function (ev) {
    	if (ev.lengthComputable){
        	
        	if($(".progressWrap").css("display") == "none"){
        		$(".progressWrap").css("display","flex");
        	}
            var percentComplete = ev.loaded /ev.total * 100;
            $("#progress").val(percentComplete);
            
            /*
            if( ev.loaded >= ev.total){
            	$(".progressWrap").css("display","none");
            }
            */
        }
    }

    //使用异步进行上传
    xmlHttpRequest.open("post",action,true);
    xmlHttpRequest.send(formData);
}

/**
 * 把textarea的分享链接文字，复制到用户设备的剪切板中
 */
function copyShareLink(){
	$("#textArea").focus();
	$("#textArea").select();
	document.execCommand("copy");
	$("#textArea").blur();
}

function hideShareDiv(){
	$(".shareLinkWrap").fadeOut(200);
	copyShareLink();
}
