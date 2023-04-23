package com.liaoyuan.photo3d.pojo;

import java.sql.Timestamp;

public class Music {
	private int id;
	private String userId;
	private String musicName;
	private String musicPath;
	private Timestamp insertDate;
	private int order;
	private String ylzd;
	/**
	 * @return the id
	 */
	public int getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(int id) {
		this.id = id;
	}
	/**
	 * @return the userId
	 */
	public String getUserId() {
		return userId;
	}
	/**
	 * @param userId the userId to set
	 */
	public void setUserId(String userId) {
		this.userId = userId;
	}
	/**
	 * @return the musicName
	 */
	public String getMusicName() {
		return musicName;
	}
	/**
	 * @param musicName the musicName to set
	 */
	public void setMusicName(String musicName) {
		this.musicName = musicName;
	}
	/**
	 * @return the musicPath
	 */
	public String getMusicPath() {
		return musicPath;
	}
	/**
	 * @param musicPath the musicPath to set
	 */
	public void setMusicPath(String musicPath) {
		this.musicPath = musicPath;
	}
	/**
	 * @return the insertDate
	 */
	public Timestamp getInsertDate() {
		return insertDate;
	}
	/**
	 * @param insertDate the insertDate to set
	 */
	public void setInsertDate(Timestamp insertDate) {
		this.insertDate = insertDate;
	}
	/**
	 * @return the order
	 */
	public int getOrder() {
		return order;
	}
	/**
	 * @param order the order to set
	 */
	public void setOrder(int order) {
		this.order = order;
	}
	/**
	 * @return the ylzd
	 */
	public String getYlzd() {
		return ylzd;
	}
	/**
	 * @param ylzd the ylzd to set
	 */
	public void setYlzd(String ylzd) {
		this.ylzd = ylzd;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Music [id=" + id + ", userId=" + userId + ", musicName=" + musicName + ", musicPath=" + musicPath
				+ ", insertDate=" + insertDate + ", order=" + order + ", ylzd=" + ylzd + "]";
	}
}
