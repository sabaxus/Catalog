package catalog.jdbc.pojo;

import java.util.ArrayList;

public class LaptopLists {
	
	private ArrayList<String> brandList;
	private ArrayList<String> rezolutieEcranList;
    private ArrayList<Double> dimensiuneEcranInchList;
	private ArrayList<String> tipProcesorList;
	private ArrayList<Double> frecventaProcesorGHzList;
	private ArrayList<Integer> capacitateRAMList;
	private ArrayList<String> culoareList;
    
	public LaptopLists() {
		
		this.brandList = new ArrayList<>();
    	this.rezolutieEcranList = new ArrayList<>();
    	this.dimensiuneEcranInchList = new ArrayList<>();
    	this.tipProcesorList = new ArrayList<>();
    	this.frecventaProcesorGHzList = new ArrayList<>();
    	this.capacitateRAMList = new ArrayList<>();
    	this.culoareList = new ArrayList<>();
		
	}

	public LaptopLists(ArrayList<String> brandList, ArrayList<String> rezolutieEcranList,
			ArrayList<Double> dimensiuneEcranInchList, ArrayList<String> tipProcesorList,
			ArrayList<Double> frecventaProcesorGHzList, ArrayList<Integer> capacitateRAMList,
			ArrayList<String> culoareList) {
		
		this.brandList = new ArrayList<>();
    	this.rezolutieEcranList = new ArrayList<>();
    	this.dimensiuneEcranInchList = new ArrayList<>();
    	this.tipProcesorList = new ArrayList<>();
    	this.frecventaProcesorGHzList = new ArrayList<>();
    	this.capacitateRAMList = new ArrayList<>();
    	this.culoareList = new ArrayList<>();
		
		this.brandList = brandList;
		this.rezolutieEcranList = rezolutieEcranList;
		this.dimensiuneEcranInchList = dimensiuneEcranInchList;
		this.tipProcesorList = tipProcesorList;
		this.frecventaProcesorGHzList = frecventaProcesorGHzList;
		this.capacitateRAMList = capacitateRAMList;
		this.culoareList = culoareList;
	}

	public ArrayList<String> getBrandList() {
		return brandList;
	}

	public void setBrandList(ArrayList<String> brandList) {
		this.brandList = brandList;
	}

	public ArrayList<String> getRezolutieEcranList() {
		return rezolutieEcranList;
	}

	public void setRezolutieEcranList(ArrayList<String> rezolutieEcranList) {
		this.rezolutieEcranList = rezolutieEcranList;
	}

	public ArrayList<Double> getDimensiuneEcranInchList() {
		return dimensiuneEcranInchList;
	}

	public void setDimensiuneEcranInchList(ArrayList<Double> dimensiuneEcranInchList) {
		this.dimensiuneEcranInchList = dimensiuneEcranInchList;
	}

	public ArrayList<String> getTipProcesorList() {
		return tipProcesorList;
	}

	public void setTipProcesorList(ArrayList<String> tipProcesorList) {
		this.tipProcesorList = tipProcesorList;
	}

	public ArrayList<Double> getFrecventaProcesorGHzList() {
		return frecventaProcesorGHzList;
	}

	public void setFrecventaProcesorGHzList(ArrayList<Double> frecventaProcesorGHzList) {
		this.frecventaProcesorGHzList = frecventaProcesorGHzList;
	}

	public ArrayList<Integer> getCapacitateRAMList() {
		return capacitateRAMList;
	}

	public void setCapacitateRAMList(ArrayList<Integer> capacitateRAMList) {
		this.capacitateRAMList = capacitateRAMList;
	}

	public ArrayList<String> getCuloareList() {
		return culoareList;
	}

	public void setCuloareList(ArrayList<String> culoareList) {
		this.culoareList = culoareList;
	}
	
}
