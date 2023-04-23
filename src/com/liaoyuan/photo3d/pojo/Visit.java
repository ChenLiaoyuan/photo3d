package com.liaoyuan.photo3d.pojo;

import java.sql.Timestamp;

public class Visit {
	private int id;
	private int visitCounts;
	private Timestamp visitDate;
	private String userAgent;
	private String ylzd;
	private String ylzd2;
	
	
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
	 * @return the visitCounts
	 */
	public int getVisitCounts() {
		return visitCounts;
	}
	/**
	 * @param visitCounts the visitCounts to set
	 */
	public void setVisitCounts(int visitCounts) {
		this.visitCounts = visitCounts;
	}
	/**
	 * @return the visitDate
	 */
	public Timestamp getVisitDate() {
		return visitDate;
	}
	/**
	 * @param visitDate the visitDate to set
	 */
	public void setVisitDate(Timestamp visitDate) {
		this.visitDate = visitDate;
	}
	/**
	 * @return the userAgent
	 */
	public String getUserAgent() {
		return userAgent;
	}
	/**
	 * @param userAgent the userAgent to set
	 */
	public void setUserAgent(String userAgent) {
		this.userAgent = userAgent;
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
	/**
	 * @return the ylzd2
	 */
	public String getYlzd2() {
		return ylzd2;
	}
	/**
	 * @param ylzd2 the ylzd2 to set
	 */
	public void setYlzd2(String ylzd2) {
		this.ylzd2 = ylzd2;
	}
	
	
}
