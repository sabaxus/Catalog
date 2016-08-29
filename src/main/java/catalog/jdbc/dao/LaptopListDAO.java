package catalog.jdbc.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;

import catalog.jdbc.helper.DBHelper;
import catalog.jdbc.pojo.Laptop;

public class LaptopListDAO {

	public static HashMap<String, Double> getLaptopsNumbersByBrand() throws SQLException {

		HashMap<String, Double> brandMap = new HashMap<>();
		ArrayList<Laptop> lapList = LaptopDAO.getSuperuserLaptops();
		int itemCount = lapList.size();
		ArrayList<String> brandL = new ArrayList<>();

		for (Laptop laptop : lapList) {
			if (!(brandL.contains(laptop.getBrand()))) {
				brandL.add(laptop.getBrand());
			}
		}

		for (String s : brandL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.laptop WHERE Brand=?;";
			Connection conn = DBHelper.openConnection();

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, s);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next()) {
				int a = rs.getInt("COUNT(DISTINCT id)");
				// DecimalFormat df = new DecimalFormat("##.##");
				// String d = df.format(a/itemCount);
				// Double f = Double.parseDouble(d);
				Double f = (double) a / itemCount;

				brandMap.put(s, f);
			}

			DBHelper.closeConnection(conn);
		}

		return brandMap;

	}

	public static HashMap<String, Double> getLaptopsNumbersByRezolutieEcran() throws SQLException {

		HashMap<String, Double> resScreenMap = new HashMap<>();
		ArrayList<Laptop> lapList = LaptopDAO.getSuperuserLaptops();
		int itemCount = lapList.size();
		ArrayList<String> resScreenL = new ArrayList<>();

		for (Laptop laptop : lapList) {
			if (!(resScreenL.contains(laptop.getRezolutieEcran()))) {
				resScreenL.add(laptop.getRezolutieEcran());
			}
		}

		for (String s : resScreenL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.laptop WHERE Rezolutie_ecran=?;";
			Connection conn = DBHelper.openConnection();

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, s);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next()) {
				int a = rs.getInt("COUNT(DISTINCT id)");
				Double f = (double) a / itemCount;

				resScreenMap.put(s, f);
			}

			DBHelper.closeConnection(conn);
		}

		return resScreenMap;

	}
	
	public static HashMap<Double, Double> getLaptopsNumbersByDimensiuneEcran() throws SQLException {

		HashMap<Double, Double> dimEcranMap = new HashMap<>();
		ArrayList<Laptop> lapList = LaptopDAO.getSuperuserLaptops();
		int itemCount = lapList.size();
		ArrayList<Double> dimEcranL = new ArrayList<>();

		for (Laptop laptop : lapList) {
			if (!(dimEcranL.contains(laptop.getDimensiuneEcranInch()))) {
				dimEcranL.add(laptop.getDimensiuneEcranInch());
			}
		}

		for (Double d : dimEcranL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.laptop WHERE Dimensiune_ecran_inch=?;";
			Connection conn = DBHelper.openConnection();

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setDouble(1, d);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next()) {
				int a = rs.getInt("COUNT(DISTINCT id)");
				Double f = (double) a / itemCount;

				dimEcranMap.put(d, f);
			}

			DBHelper.closeConnection(conn);
		}

		return dimEcranMap;

	}
	
	public static HashMap<String, Double> getLaptopsNumbersByTipProcesor() throws SQLException {

		HashMap<String, Double> tipProcesorMap = new HashMap<>();
		ArrayList<Laptop> lapList = LaptopDAO.getSuperuserLaptops();
		int itemCount = lapList.size();
		ArrayList<String> tipProcesorL = new ArrayList<>();

		for (Laptop laptop : lapList) {
			if (!(tipProcesorL.contains(laptop.getTipProcesor()))) {
				tipProcesorL.add(laptop.getTipProcesor());
			}
		}

		for (String s : tipProcesorL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.laptop WHERE Tip_procesor=?;";
			Connection conn = DBHelper.openConnection();

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, s);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next()) {
				int a = rs.getInt("COUNT(DISTINCT id)");
				Double f = (double) a / itemCount;

				tipProcesorMap.put(s, f);
			}

			DBHelper.closeConnection(conn);
		}

		return tipProcesorMap;

	}
	
	public static HashMap<Double, Double> getLaptopsNumbersByFrecventaProcesor() throws SQLException {

		HashMap<Double, Double> frecventaProcesorMap = new HashMap<>();
		ArrayList<Laptop> lapList = LaptopDAO.getSuperuserLaptops();
		int itemCount = lapList.size();
		ArrayList<Double> frecventaProcesorL = new ArrayList<>();

		for (Laptop laptop : lapList) {
			if (!(frecventaProcesorL.contains(laptop.getFrecventaProcesorGHz()))) {
				frecventaProcesorL.add(laptop.getFrecventaProcesorGHz());
			}
		}

		for (Double f : frecventaProcesorL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.laptop WHERE Frecventa_procesor_GHz=?;";
			Connection conn = DBHelper.openConnection();

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setDouble(1, f);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next()) {
				int a = rs.getInt("COUNT(DISTINCT id)");
				Double d = (double) a / itemCount;

				frecventaProcesorMap.put(f, d);
			}

			DBHelper.closeConnection(conn);
		}

		return frecventaProcesorMap;

	}
	
	public static HashMap<Integer, Double> getLaptopsNumbersByCapacitateRAM() throws SQLException {

		HashMap<Integer, Double> capacitateRAMMap = new HashMap<>();
		ArrayList<Laptop> lapList = LaptopDAO.getSuperuserLaptops();
		int itemCount = lapList.size();
		ArrayList<Integer> capacitateRAML = new ArrayList<>();

		for (Laptop laptop : lapList) {
			if (!(capacitateRAML.contains(laptop.getCapacitateRAM()))) {
				capacitateRAML.add(laptop.getCapacitateRAM());
			}
		}

		for (Integer i : capacitateRAML) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.laptop WHERE Capacitate_RAM_GB=?;";
			Connection conn = DBHelper.openConnection();

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, i);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next()) {
				int a = rs.getInt("COUNT(DISTINCT id)");
				Double d = (double) a / itemCount;

				capacitateRAMMap.put(i, d);
			}

			DBHelper.closeConnection(conn);
		}

		return capacitateRAMMap;

	}
	
	public static HashMap<String, Double> getLaptopsNumbersByCuloare() throws SQLException {

		HashMap<String, Double> culoareMap = new HashMap<>();
		ArrayList<Laptop> lapList = LaptopDAO.getSuperuserLaptops();
		int itemCount = lapList.size();
		ArrayList<String> culoareL = new ArrayList<>();

		for (Laptop laptop : lapList) {
			if (!(culoareL.contains(laptop.getCuloare()))) {
				culoareL.add(laptop.getCuloare());
			}
		}

		for (String s : culoareL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.laptop WHERE Culoare=?;";
			Connection conn = DBHelper.openConnection();

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, s);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next()) {
				int a = rs.getInt("COUNT(DISTINCT id)");
				Double f = (double) a / itemCount;

				culoareMap.put(s, f);
			}

			DBHelper.closeConnection(conn);
		}

		return culoareMap;

	}

}


