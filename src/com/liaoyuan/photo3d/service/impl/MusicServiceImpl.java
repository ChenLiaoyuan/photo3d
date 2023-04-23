package com.liaoyuan.photo3d.service.impl;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;

import com.liaoyuan.photo3d.mapper.MusicMapper;
import com.liaoyuan.photo3d.pojo.Music;
import com.liaoyuan.photo3d.service.MusicService;
import com.liaoyuan.photo3d.util.SqlSessionFactoryUtil;

public class MusicServiceImpl implements MusicService{

	@Override
	public List<Music> getMusics(String userId) {
		SqlSession sqlSession = SqlSessionFactoryUtil.getSqlSession();
		MusicMapper mapper = sqlSession.getMapper(MusicMapper.class);
		List<Music> selectMusics = mapper.selectMusics(userId);
		sqlSession.commit();
		sqlSession.close();
		return selectMusics;
	}

	@Override
	public int addMusic(Music music) {
		Logger logger = Logger.getLogger(this.getClass());
		
		SqlSession sqlSession = SqlSessionFactoryUtil.getSqlSession();
		MusicMapper mapper = sqlSession.getMapper(MusicMapper.class);
		
		int count = mapper.insertMusic(music);
		if(count == 1){
			logger.info("成功插入音乐："+music.getMusicName());
		}
		
		sqlSession.commit();
		sqlSession.close();
		return count;
	}

}
