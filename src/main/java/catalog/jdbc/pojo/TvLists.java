package catalog.jdbc.pojo;

import java.util.ArrayList;

public class TvLists {
	
	private ArrayList<String> brandList;
	private ArrayList<String> tipList;
    private ArrayList<String> tipEcranList;
	private ArrayList<Integer> dimensiuneEcranInchList;
	private ArrayList<String> sistemDeOperareList;
    
	public TvLists() {
		
		this.brandList = new ArrayList<>();
    	this.tipList = new ArrayList<>();
    	this.tipEcranList = new ArrayList<>();
    	this.dimensiuneEcranInchList = new ArrayList<>();
    	this.sistemDeOperareList = new ArrayList<>();
		
	}

	public TvLists(ArrayList<String> brandList, ArrayList<String> tipList, ArrayList<String> tipEcranList, ArrayList<Integer> dimensiuneEcranInchList, ArrayList<String> sistemDeOperareList) {
		
		this.brandList = new ArrayList<>();
    	this.tipList = new ArrayList<>();
    	this.tipEcranList = new ArrayList<>();
    	this.dimensiuneEcranInchList = new ArrayList<>();
    	this.sistemDeOperareList = new ArrayList<>();
		
		this.brandList = brandList;
		this.tipList = tipList;
		this.tipEcranList = tipEcranList;
		this.dimensiuneEcranInchList = dimensiuneEcranInchList;
		this.sistemDeOperareList = sistemDeOperareList;
		
	}

	public ArrayList<String> getBrandList() {
		return brandList;
	}

	public void setBrandList(ArrayList<String> brandList) {
		this.brandList = brandList;
	}

	public ArrayList<String> getTipList() {
		return tipList;
	}

	public void setTipList(ArrayList<String> tipList) {
		this.tipList = tipList;
	}

	public ArrayList<String> getTipEcranList() {
		return tipEcranList;
	}

	public void setTipEcranList(ArrayList<String> tipEcranList) {
		this.tipEcranList = tipEcranList;
	}

	public ArrayList<Integer> getDimensiuneEcranInchList() {
		return dimensiuneEcranInchList;
	}

	public void setDimensiuneEcranInchList(ArrayList<Integer> dimensiuneEcranInchList) {
		this.dimensiuneEcranInchList = dimensiuneEcranInchList;
	}

	public ArrayList<String> getSistemDeOperareList() {
		return sistemDeOperareList;
	}

	public void setSistemDeOperareList(ArrayList<String> sistemDeOperareList) {
		this.sistemDeOperareList = sistemDeOperareList;
	}

	
	
}
