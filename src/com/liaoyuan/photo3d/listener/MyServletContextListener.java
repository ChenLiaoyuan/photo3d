package com.liaoyuan.photo3d.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;

import com.liaoyuan.photo3d.mapper.VisitMapper;
import com.liaoyuan.photo3d.util.SqlSessionFactoryUtil;

@WebListener
public class MyServletContextListener implements ServletContextListener{

	/* 项目启动，加载数据库中的总访问次数
	 * @see javax.servlet.ServletContextListener#contextInitialized(javax.servlet.ServletContextEvent)
	 */
	@Override
	public void contextInitialized(ServletContextEvent e) {
		Logger logger = Logger.getLogger(this.getClass());
		logger.info("项目启动，ServletContext初始化，获取数据库最大访问次数");
		SqlSession sqlSession = SqlSessionFactoryUtil.getSqlSession();
		VisitMapper mapper = sqlSession.getMapper(VisitMapper.class);
		int visitCounts = mapper.getVisitCounts();
		e.getServletContext().setAttribute("visitCounts", visitCounts);
		sqlSession.commit();
		sqlSession.close();
	}
	
	/* 项目销毁
	 * @see javax.servlet.ServletContextListener#contextDestroyed(javax.servlet.ServletContextEvent)
	 */
	@Override
	public void contextDestroyed(ServletContextEvent e) {
		Logger logger = Logger.getLogger(this.getClass());
		logger.info("ServletContext销毁了");
	}

	

	
}
