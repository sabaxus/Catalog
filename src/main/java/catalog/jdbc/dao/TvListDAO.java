package catalog.jdbc.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;

import catalog.jdbc.helper.DBHelper;
import catalog.jdbc.pojo.TV;

public class TvListDAO {

	public static HashMap<String, Double> getTvsNumbersByBrand() throws SQLException {

		HashMap<String, Double> brandMap = new HashMap<>();
		ArrayList<TV> tvList = TVDAO.getSuperuserTVs();
		int itemCount = tvList.size();
		ArrayList<String> brandL = new ArrayList<>();

		for (TV tv: tvList) {
			if (!(brandL.contains(tv.getBrand()))) {
				brandL.add(tv.getBrand());
			}
		}

		for (String s : brandL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.tv WHERE Brand=?;";
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

	public static HashMap<String, Double> getTvsNumbersByType() throws SQLException {

		HashMap<String, Double> typeMap = new HashMap<>();
		ArrayList<TV> tvList = TVDAO.getSuperuserTVs();
		int itemCount = tvList.size();
		ArrayList<String> typeL = new ArrayList<>();

		for (TV tv : tvList) {
			if (!(typeL.contains(tv.getTip()))) {
				typeL.add(tv.getTip());
			}
		}

		for (String s : typeL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.tv WHERE Tip=?;";
			Connection conn = DBHelper.openConnection();

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, s);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next()) {
				int a = rs.getInt("COUNT(DISTINCT id)");
				Double f = (double) a / itemCount;

				typeMap.put(s, f);
			}

			DBHelper.closeConnection(conn);
		}

		return typeMap;

	}

	public static HashMap<String, Double> getTvsNumbersByScreenType() throws SQLException {

		HashMap<String, Double> screenTypeMap = new HashMap<>();
		ArrayList<TV> tvList = TVDAO.getSuperuserTVs();
		int itemCount = tvList.size();
		ArrayList<String> screenTypeL = new ArrayList<>();

		for (TV tv : tvList) {
			if (!(screenTypeL.contains(tv.getTipEcran()))) {
				screenTypeL.add(tv.getTipEcran());
			}
		}

		for (String s : screenTypeL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.tv WHERE Tip_ecran=?;";
			Connection conn = DBHelper.openConnection();

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, s);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next()) {
				int a = rs.getInt("COUNT(DISTINCT id)");
				Double f = (double) a / itemCount;

				screenTypeMap.put(s, f);
			}

			DBHelper.closeConnection(conn);
		}

		return screenTypeMap;

	}
	
	public static HashMap<Integer, Double> getTvsNumbersByDimensiuneEcran() throws SQLException {

		HashMap<Integer, Double> dimEcranMap = new HashMap<>();
		ArrayList<TV> tvList = TVDAO.getSuperuserTVs();
		int itemCount = tvList.size();
		ArrayList<Integer> dimEcranL = new ArrayList<>();

		for (TV tv : tvList) {
			if (!(dimEcranL.contains(tv.getDimensiuneEcranInch()))) {
				dimEcranL.add(tv.getDimensiuneEcranInch());
			}
		}

		for (Integer i : dimEcranL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.tv WHERE Dimensiune_ecran_inch=?;";
			Connection conn = DBHelper.openConnection();

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, i);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next()) {
				int a = rs.getInt("COUNT(DISTINCT id)");
				Double f = (double) a / itemCount;

				dimEcranMap.put(i, f);
			}

			DBHelper.closeConnection(conn);
		}

		return dimEcranMap;

	}
	
	public static HashMap<String, Double> getTvsNumbersByOperatingSystem() throws SQLException {

		HashMap<String, Double> opSysMap = new HashMap<>();
		ArrayList<TV> tvList = TVDAO.getSuperuserTVs();
		int itemCount = tvList.size();
		ArrayList<String> opSysL = new ArrayList<>();

		for (TV tv : tvList) {
			if (!(opSysL.contains(tv.getSistemDeOperare()))) {
				opSysL.add(tv.getSistemDeOperare());
			}
		}

		for (String s : opSysL) {
			final String sql = "SELECT COUNT(DISTINCT id) from  catalog.tv WHERE Sistem_de_operare=?;";
			Connection conn = DBHelper.openConnection();

			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, s);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next()) {
				int a = rs.getInt("COUNT(DISTINCT id)");
				Double f = (double) a / itemCount;

				opSysMap.put(s, f);
			}

			DBHelper.closeConnection(conn);
		}

		return opSysMap;

	}
	
}
