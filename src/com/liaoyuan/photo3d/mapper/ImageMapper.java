package com.liaoyuan.photo3d.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.liaoyuan.photo3d.pojo.Image;

public interface ImageMapper {
	List<Image> selectImages(@Param("userId")String userId);
	int insertImage(Image image);
}
