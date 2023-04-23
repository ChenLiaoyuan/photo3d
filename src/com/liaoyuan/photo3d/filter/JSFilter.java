package com.liaoyuan.photo3d.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//@WebFilter("*.js")
public class JSFilter implements Filter{

	@Override
	public void destroy() {
		
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain filterChain)
			throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest)req;
		HttpServletResponse response = (HttpServletResponse)resp;
		String requestURI = request.getRequestURI();
		System.out.println(requestURI);
		String time = request.getParameter("time");
		System.out.println(time);
		if(time == null){
			String timeParameter = "?time="+System.currentTimeMillis();
			requestURI += timeParameter;
			response.sendRedirect(requestURI);
		}else{
			filterChain.doFilter(req, resp);
		}
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		
	}
	
}
