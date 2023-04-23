package com.liaoyuan.photo3d.service.impl;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;

import com.liaoyuan.photo3d.mapper.ImageMapper;
import com.liaoyuan.photo3d.pojo.Image;
import com.liaoyuan.photo3d.service.ImageService;
import com.liaoyuan.photo3d.util.SqlSessionFactoryUtil;

public class ImageServiceImpl implements ImageService{

	@Override
	public List<Image> getImages(String userId) {
		SqlSession sqlSession = SqlSessionFactoryUtil.getSqlSession();
		ImageMapper mapper = sqlSession.getMapper(ImageMapper.class);
		List<Image> selectImages = mapper.selectImages(userId);
		sqlSession.commit();
		sqlSession.close();
		
		return selectImages;
	}

	@Override
	public int addImage(Image image) {
		Logger logger = Logger.getLogger(this.getClass());
		SqlSession sqlSession = SqlSessionFactoryUtil.getSqlSession();
		ImageMapper mapper = sqlSession.getMapper(ImageMapper.class);
		
		int count = mapper.insertImage(image);
		if(count == 1){
			logger.info("成功插入图片："+image.getImageName());
		}
		
		sqlSession.commit();
		sqlSession.close();
		return count;
	}

}
