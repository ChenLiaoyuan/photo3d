package com.liaoyuan.photo3d.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.liaoyuan.photo3d.pojo.Music;

public interface MusicMapper {
	List<Music> selectMusics(@Param("userId")String userId);
	int insertMusic(Music music);
}
