package catalog.jdbc.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import catalog.jdbc.helper.DBHelper;
import catalog.jdbc.pojo.Laptop;
import catalog.jdbc.pojo.Photo;

public class PhotoDAO {
	
	public static void createPhoto(Photo photo) throws SQLException {
		final String sql = "INSERT INTO catalog.pictures (name, address) VALUES(?,?);";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql);
		
		pstmt.setString(1, photo.getName());
		pstmt.setString(2, photo.getAddress());
				
		pstmt.executeUpdate();
		
		DBHelper.closeConnection(conn);

	}
	
	public static Photo createPhoto(String name, String address) throws SQLException {
		
		final String sql = "INSERT INTO catalog.pictures (name, address) VALUES(?,?)";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql);
		
		pstmt.setString(1, name);
		pstmt.setString(2, address);
				
		pstmt.executeUpdate();
		
		Photo photo=new Photo(name, address);
		
		DBHelper.closeConnection(conn);
		
		return photo;

	}
	
	public static Photo createPhoto() throws SQLException {

		Photo photo = new Photo();
		PhotoDAO.createPhoto(photo);
		return photo;
	}
	
	public static void updatePhoto(String name, String address) throws SQLException {
		
		final String sql = "UPDATE catalog.pictures SET address=? WHERE name=?;";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql);
		
		pstmt.setString(1, address);
		pstmt.setString(2, name);
				
		pstmt.executeUpdate();
		
		DBHelper.closeConnection(conn);
	}

	public static void updatePhoto(Photo photo) throws SQLException {
		
		PhotoDAO.updatePhoto(photo.getName(), photo.getAddress());
	
	}
	
	public static Photo getPhoto(String name) throws SQLException {
		final String sql = "SELECT name, address FROM catalog.pictures WHERE name=?;";
		Connection conn = DBHelper.openConnection();
		Photo photo = new Photo();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, name);
		ResultSet rs = pstmt.executeQuery();
		
		if (rs.next()) {
						
			if (rs.getString("name")==null) {
				photo.setName("");
			} else photo.setName(rs.getString("name"));
			
			if (rs.getString("address")==null) {
				photo.setAddress("");
			} else photo.setAddress(rs.getString("address"));
			
		}

		DBHelper.closeConnection(conn);
		return photo;
	}
	
	public static String getPhotoAddress(String name) throws SQLException {
		final String sql = "SELECT address FROM catalog.pictures WHERE name=?;";
		Connection conn = DBHelper.openConnection();
		Photo photo = new Photo();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, name);
		ResultSet rs = pstmt.executeQuery();
		
		if (rs.next()) {
						
			if (rs.getString("address")==null) {
				photo.setAddress("");
			} else photo.setAddress(rs.getString("address"));
			
		}
		
		//String s= photo.getAddress().replaceAll("\", "/"");
		
		DBHelper.closeConnection(conn);
		return photo.getAddress();
	}
	
	public static ArrayList<String> getPhotoAddressesLaptops(int id) throws SQLException {
		final String sql = "SELECT address FROM catalog.pictures WHERE laptop_id=?;";
		Connection conn = DBHelper.openConnection();
		ArrayList<String> photoList = new ArrayList<>();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		pstmt.setInt(1, id);
		ResultSet rs = pstmt.executeQuery();
		
		while (rs.next()) {
			
			if (!(rs.getString("address")==null)) {
				photoList.add(rs.getString("address"));
			} 
			
		}

		DBHelper.closeConnection(conn);
		return photoList;
	}
	
	public static ArrayList<String> getPhotoAddressesSmartphones(int id) throws SQLException {
		final String sql = "SELECT address FROM catalog.pictures WHERE smartphone_id=?;";
		Connection conn = DBHelper.openConnection();
		ArrayList<String> photoList = new ArrayList<>();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		pstmt.setInt(1, id);
		ResultSet rs = pstmt.executeQuery();
		
		while (rs.next()) {
			
			if (!(rs.getString("address")==null)) {
				photoList.add(rs.getString("address"));
			} 
			
		}

		DBHelper.closeConnection(conn);
		return photoList;
	}
	
	public static ArrayList<String> getPhotoAddressesTvs(int id) throws SQLException {
		final String sql = "SELECT address FROM catalog.pictures WHERE tv_id=?;";
		Connection conn = DBHelper.openConnection();
		ArrayList<String> photoList = new ArrayList<>();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		pstmt.setInt(1, id);
		ResultSet rs = pstmt.executeQuery();
		
		while (rs.next()) {
			
			if (!(rs.getString("address")==null)) {
				photoList.add(rs.getString("address"));
			} 
			
		}

		DBHelper.closeConnection(conn);
		return photoList;
	}
}
