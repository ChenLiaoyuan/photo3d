package com.liaoyuan.photo3d.listener;

import javax.servlet.ServletContextAttributeEvent;
import javax.servlet.ServletContextAttributeListener;
import javax.servlet.annotation.WebListener;

import org.apache.log4j.Logger;

@WebListener
public class MyServletContextAttributeListener implements ServletContextAttributeListener{

	/* (non-Javadoc)
	 * @see javax.servlet.ServletContextAttributeListener#attributeAdded(javax.servlet.ServletContextAttributeEvent)
	 */
	@Override
	public void attributeAdded(ServletContextAttributeEvent e) {
		// TODO Auto-generated method stub
		if(e.getName().equals("visitCounts")){
			Logger logger = Logger.getLogger(this.getClass());
			logger.info("ServletContext增加了属性："+e.getName()+"="+e.getValue());
		}
	}

	/* (non-Javadoc)
	 * @see javax.servlet.ServletContextAttributeListener#attributeRemoved(javax.servlet.ServletContextAttributeEvent)
	 */
	@Override
	public void attributeRemoved(ServletContextAttributeEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	/* (non-Javadoc)
	 * @see javax.servlet.ServletContextAttributeListener#attributeReplaced(javax.servlet.ServletContextAttributeEvent)
	 */
	@Override
	public void attributeReplaced(ServletContextAttributeEvent e) {
		Logger logger = Logger.getLogger(this.getClass());
		//好像值还没改变就触发这个方法，
		//应该是属性改变之前触发
		Integer visitCounts = (Integer)e.getValue();
		visitCounts++;
		logger.info("ServletContext属性改变了："+e.getName()+"="+visitCounts);
	}
	

}
