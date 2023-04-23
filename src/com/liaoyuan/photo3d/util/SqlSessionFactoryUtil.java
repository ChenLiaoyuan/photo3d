package com.liaoyuan.photo3d.util;

import java.io.IOException;
import java.io.InputStream;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

/**
 * 用于获取Mybatis的数据库连接，
 * 一个项目只需要初始化一个SqlSessionFactory，
 * 因此获取数据库连接都应该通过该类获取，工具类也不能实例化
 * @author CLY
 * @date 2019/12/14
 */
public final class SqlSessionFactoryUtil {
	private static volatile SqlSessionFactory sqlSessionFactory;
	
	private SqlSessionFactoryUtil(){}
	
	public static SqlSessionFactory getSessionFactory(){
		//检查是否为空
		if (sqlSessionFactory == null) {
			//进行锁定，防止初始化的时候被别的线程获取
			synchronized (SqlSessionFactoryUtil.class) {
				//再次检查是否为空，避免等待琐时已经被别的线程初始化了
				if (sqlSessionFactory == null) {
					 InputStream resourceAsStream;
					try {
						resourceAsStream = Resources.getResourceAsStream("mybatis-config.xml");
						sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
					} catch (IOException e) {
						e.printStackTrace();
						return null;
					}
				}
			}
		}
		
		return sqlSessionFactory;
	}
	
	
	public static SqlSession getSqlSession(boolean autoCommit){
		if (sqlSessionFactory == null) {
			getSessionFactory();
		}
		return sqlSessionFactory.openSession(autoCommit);
	}
	
	/**
	 * 默认为关闭自动提交
	 * @return
	 */
	public static SqlSession getSqlSession(){
		return getSqlSession(false);
	}
	
}
