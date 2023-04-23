package com.liaoyuan.photo3d.service.impl;

import java.sql.Timestamp;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;

import com.liaoyuan.photo3d.mapper.VisitMapper;
import com.liaoyuan.photo3d.pojo.Visit;
import com.liaoyuan.photo3d.service.VisitService;
import com.liaoyuan.photo3d.util.SqlSessionFactoryUtil;

public class VisitServiceImpl implements VisitService {
	public void addVisit(int visitCounts,String userAgent){
		Visit visit = new Visit();
		visit.setVisitCounts(visitCounts);
		
		visit.setVisitDate(new Timestamp(System.currentTimeMillis()));
		
		visit.setUserAgent(userAgent);
		
		addVisit(visit);
	}
	
	public int addVisit(Visit visit){
		Logger logger = Logger.getLogger(this.getClass());
		
		SqlSession sqlSession = SqlSessionFactoryUtil.getSqlSession();
		VisitMapper mapper = sqlSession.getMapper(VisitMapper.class);
		int insertVisit = mapper.insertVisit(visit);
		if (insertVisit == 1) {
			logger.info("成功插入访问记录\n");
		}
		sqlSession.commit();
		sqlSession.close();
		return insertVisit;
	}
}
