package catalog.jdbc.pojo;

import java.util.ArrayList;

public class SmartphoneLists {
	
	private ArrayList<String> brandList;
	private ArrayList<Double> dimensiuneEcranInchList;
	private ArrayList<String> rezolutieEcranPixeliList;
	private ArrayList<Integer> memorieInternaGBList;
	private ArrayList<Integer> memorieRAMMBList;
	private ArrayList<String> tipProcesorList;
	private ArrayList<String> culoareList;
    
	public SmartphoneLists() {
		
		this.brandList = new ArrayList<>();
    	this.dimensiuneEcranInchList = new ArrayList<>();
    	this.rezolutieEcranPixeliList = new ArrayList<>();
    	this.memorieInternaGBList = new ArrayList<>();
    	this.memorieRAMMBList = new ArrayList<>();
    	this.tipProcesorList = new ArrayList<>();
    	this.culoareList = new ArrayList<>();
		
	}

	public SmartphoneLists(ArrayList<String> brandList,	ArrayList<Double> dimensiuneEcranInchList, ArrayList<String> rezolutieEcranPixeliList, ArrayList<Integer> memorieInternaGBList, ArrayList<Integer> memorieRAMMBList, ArrayList<String> tipProcesorList, ArrayList<String> culoareList) {
		
		this.brandList = new ArrayList<>();
    	this.dimensiuneEcranInchList = new ArrayList<>();
    	this.rezolutieEcranPixeliList = new ArrayList<>();
    	this.memorieInternaGBList = new ArrayList<>();
    	this.memorieRAMMBList = new ArrayList<>();
    	this.tipProcesorList = new ArrayList<>();
    	this.culoareList = new ArrayList<>();
		
		this.brandList = brandList;
		this.dimensiuneEcranInchList = dimensiuneEcranInchList;
		this.rezolutieEcranPixeliList = rezolutieEcranPixeliList;
		this.memorieInternaGBList = memorieInternaGBList;
		this.memorieRAMMBList = memorieRAMMBList;
		this.tipProcesorList = tipProcesorList;
		this.culoareList = culoareList;
	}

	public ArrayList<String> getBrandList() {
		return brandList;
	}

	public void setBrandList(ArrayList<String> brandList) {
		this.brandList = brandList;
	}

	public ArrayList<Double> getDimensiuneEcranInchList() {
		return dimensiuneEcranInchList;
	}

	public void setDimensiuneEcranInchList(ArrayList<Double> dimensiuneEcranInchList) {
		this.dimensiuneEcranInchList = dimensiuneEcranInchList;
	}

	public ArrayList<String> getRezolutieEcranPixeliList() {
		return rezolutieEcranPixeliList;
	}

	public void setRezolutieEcranPixeliList(ArrayList<String> rezolutieEcranPixeliList) {
		this.rezolutieEcranPixeliList = rezolutieEcranPixeliList;
	}

	public ArrayList<Integer> getMemorieInternaGBList() {
		return memorieInternaGBList;
	}

	public void setMemorieInternaGBList(ArrayList<Integer> memorieInternaGBList) {
		this.memorieInternaGBList = memorieInternaGBList;
	}

	public ArrayList<Integer> getMemorieRAMMBList() {
		return memorieRAMMBList;
	}

	public void setMemorieRAMMBList(ArrayList<Integer> memorieRAMMBList) {
		this.memorieRAMMBList = memorieRAMMBList;
	}

	public ArrayList<String> getTipProcesorList() {
		return tipProcesorList;
	}

	public void setTipProcesorList(ArrayList<String> tipProcesorList) {
		this.tipProcesorList = tipProcesorList;
	}

	public ArrayList<String> getCuloareList() {
		return culoareList;
	}

	public void setCuloareList(ArrayList<String> culoareList) {
		this.culoareList = culoareList;
	}
	
}
