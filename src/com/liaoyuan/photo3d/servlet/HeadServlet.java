package com.liaoyuan.photo3d.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Timestamp;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.liaoyuan.photo3d.pojo.Image;
import com.liaoyuan.photo3d.pojo.Music;
import com.liaoyuan.photo3d.pojo.Visit;
import com.liaoyuan.photo3d.service.ImageService;
import com.liaoyuan.photo3d.service.MusicService;
import com.liaoyuan.photo3d.service.impl.ImageServiceImpl;
import com.liaoyuan.photo3d.service.impl.MusicServiceImpl;
import com.liaoyuan.photo3d.service.impl.VisitServiceImpl;

@WebServlet("/head")
public class HeadServlet extends HttpServlet{
	public static final long serialVersionUID = 1L;
	
	@Override
	protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		//插入访问记录
		Integer visitCounts = (Integer)req.getServletContext().getAttribute("visitCounts");
		visitCounts++;
		req.getServletContext().setAttribute("visitCounts", visitCounts);
		String userAgent = req.getHeader("user-agent");
		
		VisitServiceImpl visitServiceImpl = new VisitServiceImpl();
		Visit visit = new Visit();
		visit.setUserAgent(userAgent);
		visit.setVisitCounts(visitCounts);
		visit.setVisitDate(new Timestamp(System.currentTimeMillis()));
		
		//获取图片列表
		String userImageId = req.getParameter("userImageId");
		if(userImageId == null || "".equals(userImageId)){
			//默认的userId
			userImageId = "6654cc3a-0bff-4a02-8d5a-fe564fe16f4c";
		}
		JSONArray currentImgList = getImageList(userImageId);
		//当前用户图片列表，传送到jsp页面进行初始化
		req.setAttribute("currentImgList", currentImgList.toString());
		JSONArray defaultImgList = getImageList("6654cc3a-0bff-4a02-8d5a-fe564fe16f4c");
		//默认图片列表，传送到jsp页面进行初始化
		req.setAttribute("defaultImgList", defaultImgList.toString());
		
		
		//获取歌曲列表
		String userMusicId = req.getParameter("userMusicId");
		if(userMusicId == null || "".equals(userMusicId)){
			//默认的userMusicId
			userMusicId = "6654cc3a-0bff-4a02-8d5a-fe564fe16f4c";
		}
		JSONArray currentMusicList = getMusicList(userMusicId);
		//当前用户歌曲列表，传送到jsp页面进行初始化
		req.setAttribute("currentMusicList", currentMusicList.toString());
		JSONArray defaultMusicList = getMusicList("6654cc3a-0bff-4a02-8d5a-fe564fe16f4c");
		//默认歌曲列表，传送到jsp页面进行初始化
		req.setAttribute("defaultMusicList", defaultMusicList.toString());
		
		//记录用户图片id
		visit.setYlzd(userImageId);
		//记录用户音乐id
		visit.setYlzd2(userMusicId);
		//保存访问记录
		visitServiceImpl.addVisit(visit);
		
		//如果是手机浏览器，则跳转到手机适配页面，
		//audio在iOS的微信和Safari不能自动播放，需要特殊处理
		boolean isiOS = userAgent.toLowerCase().contains("iphone") || userAgent.toLowerCase().contains("ipad");
		req.setAttribute("isiOS", isiOS);
		if(userAgent.toLowerCase().contains("android") || isiOS){
			req.getRequestDispatcher("photo3d/photo3d_mobile.jsp").forward(req, resp);
		}else{
			req.getRequestDispatcher("photo3d/photo3d.jsp").forward(req, resp);
		}
		
	}
	
	/**
	 * 获取图片列表
	 * @param userImageId
	 * @return
	 */
	private JSONArray getImageList(String userImageId){
		ImageService imageService = new ImageServiceImpl();
		List<Image> images = imageService.getImages(userImageId);
		JSONArray imageList = new JSONArray();
		for(Image image: images){
			JSONObject jsonObject = new JSONObject();
			//name:url(img/img.png)，用来设置div的background-image
			jsonObject.put("name", image.getImagePath());
			//图片是否单独显示
			jsonObject.put("isSingle", image.isSingle());
			imageList.add(jsonObject);
		}
		return imageList;
	}
	
	/**
	 * 获取歌曲列表
	 * @param userMusicId
	 * @return
	 */
	private JSONArray getMusicList(String userMusicId){
		MusicService musicService = new MusicServiceImpl();
		List<Music> musics = musicService.getMusics(userMusicId);
		JSONArray musicList = new JSONArray();
		for(Music music: musics){
			JSONObject jsonObject = new JSONObject();
			//歌名
			jsonObject.put("musicName", music.getMusicName());
			//歌曲链接
			jsonObject.put("mp3url", music.getMusicPath());
			musicList.add(jsonObject);
		}
		return musicList;
	}
	
	protected void service_test(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		Logger logger = Logger.getLogger(this.getClass());
		Enumeration<String> headerNames = req.getHeaderNames();
		while(headerNames.hasMoreElements()){
			String headerName = headerNames.nextElement();
			logger.info(headerName+":"+req.getHeader(headerName));
		}
		
		//获取session参数为true，如果没有session则创建，
		//而且响应内容也会给浏览器设置cookie JSESSIONID，然后浏览器下一次访问请求头就会传送cookie
		HttpSession session = req.getSession(true);
		logger.info("服务器中的JSESSIONID:"+session.getId());
		
		boolean firstVisit = true;
		Cookie[] cookies = req.getCookies();
		for(int i=0;cookies!= null && i<cookies.length;i++){
			//手机浏览器退出之后cookie并不会失效，
			if(cookies[i].getName().equals("visitCounts")){
				firstVisit = false;
			}
			logger.info(cookies[i].getName() + ":" + cookies[i].getValue() + ":" 
					+ cookies[i].getMaxAge() + ":" + cookies[i].getPath());
		}
		
		if(firstVisit){
			Integer visitCounts = (Integer)req.getServletContext().getAttribute("visitCounts");
			visitCounts++;
			req.getServletContext().setAttribute("visitCounts", visitCounts);
			Cookie visitCookie = new Cookie("visitCounts", visitCounts.toString());
			visitCookie.setMaxAge(-1);
			resp.addCookie(visitCookie);
		}
		//响应内容用UTF-8进行编码
		resp.setCharacterEncoding("UTF-8");
		//会在响应头那里添加Content-Type:text/html;charset=utf-8
		//从而告诉；浏览器如何解析返回的内容
		resp.setContentType("text/html;charset=utf-8");
		PrintWriter writer = resp.getWriter();
		writer.println("<!DOCTYPE html>");
		writer.println("<html>");
		writer.println("<head>");
		writer.println("<meta charset=\"UTF-8\" />");
		writer.println("<meta http-equiv=\"expires\" content=\"0\">");
		writer.println("<title>测试</title>");
		writer.println("</head>");
		writer.println("<body>");
		writer.println("<h1>测试RequestHeader</h1>");
		writer.println("</body>");
		writer.println("</html>");
		writer.close();
	}


	
}
