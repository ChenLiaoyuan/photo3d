package com.liaoyuan.photo3d.pojo;

import java.sql.Timestamp;

public class Image {
	private int id;
	private String userId;
	private String imageName;
	private String imagePath;
	private boolean single;
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
	 * @return the imageName
	 */
	public String getImageName() {
		return imageName;
	}
	/**
	 * @param imageName the imageName to set
	 */
	public void setImageName(String imageName) {
		this.imageName = imageName;
	}
	/**
	 * @return the imagePath
	 */
	public String getImagePath() {
		return imagePath;
	}
	/**
	 * @param imagePath the imagePath to set
	 */
	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}
	/**
	 * @return the single
	 */
	public boolean isSingle() {
		return single;
	}
	/**
	 * @param single the single to set
	 */
	public void setSingle(boolean single) {
		this.single = single;
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
		return "Image [id=" + id + ", userId=" + userId + ", imageName=" + imageName + ", imagePath=" + imagePath
				+ ", single=" + single + ", insertDate=" + insertDate + ", order=" + order + ", ylzd=" + ylzd + "]";
	}
	
}
