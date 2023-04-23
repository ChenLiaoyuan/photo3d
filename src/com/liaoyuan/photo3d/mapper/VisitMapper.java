package com.liaoyuan.photo3d.mapper;

import com.liaoyuan.photo3d.pojo.Visit;

public interface VisitMapper {
	public abstract int getVisitCounts();
	
	public abstract Visit getNewestVisit();
	
	public abstract int insertVisit(Visit visit);
}
