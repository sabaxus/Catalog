package catalog.jdbc.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;

import catalog.jdbc.helper.DBHelper;
import catalog.jdbc.pojo.Smartphone;

public class PhoneListDAO {

	public static HashMap<String, Double> getPhonesNumbersByBrand() throws SQLException {

		HashMap<String, Double> brandMap = new HashMap<>();
		ArrayList<Smartphone> pList = SmartphoneDAO.getSuperuserSmartphones();
		int itemCount = pList.size();
		ArrayList<String> brandL = new ArrayList<>();

		for (Smartphone phone : pList) {
			if (!(brandL.contains(phone.getBrand()))) {
				brandL.add(phone.getBrand());
			}
		}

		for (String s : brandL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.smartphone WHERE Brand=?;";
			Connection conn = DBHelper.openConnection();

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, s);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next()) {
				int a = rs.getInt("COUNT(DISTINCT id)");
				Double f = (double) a / itemCount;

				brandMap.put(s, f);
			}

			DBHelper.closeConnection(conn);
		}

		return brandMap;

	}

	public static HashMap<Double, Double> getPhonesNumbersByDimensiuneEcran() throws SQLException {

		HashMap<Double, Double> dimEcranMap = new HashMap<>();
		ArrayList<Smartphone> pList = SmartphoneDAO.getSuperuserSmartphones();
		int itemCount = pList.size();
		ArrayList<Double> dimEcranL = new ArrayList<>();

		for (Smartphone phone : pList) {
			if (!(dimEcranL.contains(phone.getDimensiuneEcranInch()))) {
				dimEcranL.add(phone.getDimensiuneEcranInch());
			}
		}

		for (Double d : dimEcranL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.smartphone WHERE Dimensiune_ecran_inch=?;";
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

	public static HashMap<String, Double> getPhonesNumbersByRezolutieEcran() throws SQLException {

		HashMap<String, Double> resScreenMap = new HashMap<>();
		ArrayList<Smartphone> pList = SmartphoneDAO.getSuperuserSmartphones();
		int itemCount = pList.size();
		ArrayList<String> resScreenL = new ArrayList<>();

		for (Smartphone phone : pList) {
			if (!(resScreenL.contains(phone.getRezolutieEcranPixeli()))) {
				resScreenL.add(phone.getRezolutieEcranPixeli());
			}
		}

		for (String s : resScreenL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.smartphone WHERE Rezolutie_ecran_pixeli=?;";
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

	public static HashMap<Integer, Double> getPhonesNumbersByMemorieInterna() throws SQLException {

		HashMap<Integer, Double> memorieInternaMap = new HashMap<>();
		ArrayList<Smartphone> pList = SmartphoneDAO.getSuperuserSmartphones();
		int itemCount = pList.size();
		ArrayList<Integer> memorieInternaL = new ArrayList<>();

		for (Smartphone phone : pList) {
			if (!(memorieInternaL.contains(phone.getMemorieInternaGB()))) {
				memorieInternaL.add(phone.getMemorieInternaGB());
			}
		}

		for (Integer i : memorieInternaL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.smartphone WHERE Memorie_interna_GB=?;";
			Connection conn = DBHelper.openConnection();

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, i);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next()) {
				int a = rs.getInt("COUNT(DISTINCT id)");
				Double d = (double) a / itemCount;

				memorieInternaMap.put(i, d);
			}

			DBHelper.closeConnection(conn);
		}

		return memorieInternaMap;

	}

	public static HashMap<Integer, Double> getPhonesNumbersByMemorieRAM() throws SQLException {

		HashMap<Integer, Double> memorieRAMMap = new HashMap<>();
		ArrayList<Smartphone> pList = SmartphoneDAO.getSuperuserSmartphones();
		int itemCount = pList.size();
		ArrayList<Integer> memorieRAML = new ArrayList<>();

		for (Smartphone phone : pList) {
			if (!(memorieRAML.contains(phone.getMemorieRAMMB()))) {
				memorieRAML.add(phone.getMemorieRAMMB());
			}
		}

		for (Integer i : memorieRAML) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.smartphone WHERE Memorie_RAM_MB=?;";
			Connection conn = DBHelper.openConnection();

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, i);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next()) {
				int a = rs.getInt("COUNT(DISTINCT id)");
				Double d = (double) a / itemCount;

				memorieRAMMap.put(i, d);
			}

			DBHelper.closeConnection(conn);
		}

		return memorieRAMMap;

	}

	public static HashMap<String, Double> getPhonesNumbersByTipProcesor() throws SQLException {

		HashMap<String, Double> tipProcesorMap = new HashMap<>();
		ArrayList<Smartphone> pList = SmartphoneDAO.getSuperuserSmartphones();
		int itemCount = pList.size();
		ArrayList<String> tipProcesorL = new ArrayList<>();

		for (Smartphone phone : pList) {
			if (!(tipProcesorL.contains(phone.getTipProcesor()))) {
				tipProcesorL.add(phone.getTipProcesor());
			}
		}

		for (String s : tipProcesorL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.smartphone WHERE Tip_procesor=?;";
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

	public static HashMap<String, Double> getPhonesNumbersByCuloare() throws SQLException {

		HashMap<String, Double> culoareMap = new HashMap<>();
		ArrayList<Smartphone> pList = SmartphoneDAO.getSuperuserSmartphones();
		int itemCount = pList.size();
		ArrayList<String> culoareL = new ArrayList<>();

		for (Smartphone phone : pList) {
			if (!(culoareL.contains(phone.getCuloare()))) {
				culoareL.add(phone.getCuloare());
			}
		}

		for (String s : culoareL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.smartphone WHERE Culoare=?;";
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
