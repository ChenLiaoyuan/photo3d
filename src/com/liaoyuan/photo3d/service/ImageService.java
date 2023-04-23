package com.liaoyuan.photo3d.service;

import java.util.List;

import com.liaoyuan.photo3d.pojo.Image;

public interface ImageService {
	List<Image> getImages(String userId);
	int addImage(Image image);
}
