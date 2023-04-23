package com.liaoyuan.photo3d.service;

import java.util.List;

import com.liaoyuan.photo3d.pojo.Music;

public interface MusicService {
	List<Music> getMusics(String userId);
	int addMusic(Music music);
}
