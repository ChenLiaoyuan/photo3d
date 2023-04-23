package com.liaoyuan.photo3d.filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

public class MyHttpServletRequestWrapper extends HttpServletRequestWrapper{
	private HttpServletRequest request;
	
	public MyHttpServletRequestWrapper(HttpServletRequest request){
		super(request);
		this.request = request;
	}

	@Override
	public String getRequestURI() {
		String requestURI = request.getRequestURI();
		if(requestURI.contains(".js")){
			System.out.println(requestURI);
			String timeParameter = "?time="+System.currentTimeMillis();
			requestURI += timeParameter;
			return requestURI;
		}else{
			return super.getRequestURI();
		}
	}
	
	
}
