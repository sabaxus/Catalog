package catalog.jdbc.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import catalog.jdbc.helper.DBHelper;
import catalog.jdbc.pojo.Authorities;
import catalog.jdbc.pojo.Laptop;
import catalog.jdbc.pojo.Users;
import catalog.security.BcryptTest;

@Repository
public class UsersDAO {

	@Autowired
	private DataSource dataSource;
	private JdbcTemplate temp;
	
	/*
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		String sql="SELECT * FROM catalog.users WHERE username = ?";
		Users user = null;
		List<Users> query =getJdbcTemplate().query(sql, new Object[] {username}, new RowMapper<Users>() {
			
			public Users mapRow(ResultSet rs, int rowNum) throws SQLException {
				Users user = new Users();
				if (user.getUsername()==null)
					user.setUsername(rs.getString("username"));
				if (user.getPassword()==null)
					user.setPassword(rs.getString("password"));
				return user;
			}
		});
		if (query.size()==0) throw new UsernameNotFoundException("No user found with that username");
		else user=query.get(0);
			
		sql = "SELECT authority FROM catalog.authorities WHERE username=?";
		
		List<String> authorities = getJdbcTemplate().queryForList(sql, new Object[] {username}, String.class);
		
		Set<Authorities> userAuthorities = new HashSet<Authorities>();
		for (String authority : authorities) {
			userAuthorities.add(new Authorities(username, authority));
		}
		
		user.setAuthorities(userAuthorities);
		return user;
	}
	
	private JdbcTemplate getJdbcTemplate() {
		if (temp==null) {
			return new JdbcTemplate(dataSource);
		} else return this.temp;
		
	}*/
	
	public static void createUser(Users user) throws SQLException {
		final String sql = "INSERT INTO catalog.users (username, password, user_name, user_address, user_phone, user_email, enabled, site_lover, category_select, sex, ocupation) VALUES(?,?,?,?,?,?,?,?,?,?,?);";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql);
		
		pstmt.setString(1, user.getUsername());
		pstmt.setString(2, user.getPassword());
		pstmt.setString(3, user.getName());
		pstmt.setString(4, user.getUserAddress());
		pstmt.setString(5, user.getUserPhone());
		pstmt.setString(6, user.getUserEmail());
		pstmt.setInt(7, 1);
		
		if(user.isSiteLover()){
			pstmt.setInt(8, 1);
		} else pstmt.setInt(8, 2);
		
		pstmt.setString(9, convertListToDelimitedString(user.getSelectCategory()));
		pstmt.setString(10, user.getSex());
		pstmt.setString(11, user.getOcupation());
		
		pstmt.executeUpdate();
		
		final String sql1 = "INSERT INTO catalog.authorities (username, authority) VALUES (?,?);";
		
		PreparedStatement pstmt1 = conn.prepareStatement(sql1);
		
		pstmt1.setString(1, user.getUsername());
		pstmt1.setString(2, "ROLE_USER");
		
		pstmt1.executeUpdate();
		
		DBHelper.closeConnection(conn);

	}
	
	public static Users createUser(String username,	String password, String name, String userAddress, String userPhone, String userEmail, boolean siteLover, ArrayList<String> selectCategory, String sex, String ocupation) throws SQLException {
		
		final String sql = "INSERT INTO catalog.users (username, password, user_name, user_address, user_phone, user_email, enabled, site_lover, category_select, sex, ocupation) VALUES(?,?,?,?,?,?,?,?,?,?,?);";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql);
		
		pstmt.setString(1, username);
		pstmt.setString(2, password);
		pstmt.setString(3, name);
		pstmt.setString(4, userAddress);
		pstmt.setString(5, userPhone);
		pstmt.setString(6, userEmail);
		pstmt.setInt(7, 1);
		
		if(siteLover) {
			pstmt.setInt(8, 1);
		} else pstmt.setInt(8, 2);
		
		pstmt.setString(9, convertListToDelimitedString(selectCategory));
		
		pstmt.setString(10, sex);
		pstmt.setString(11, ocupation);
		
		pstmt.executeUpdate();
		
		final String sql1 = "INSERT INTO catalog.authorities (username, authority) VALUES (?,?);";
		
		PreparedStatement pstmt1 = conn.prepareStatement(sql1);
		
		pstmt1.setString(1, username);
		pstmt1.setString(2, "ROLE_USER");
		
		pstmt1.executeUpdate();
		
		Users user=new Users(username, password, name, userAddress, userPhone, userEmail, 1, siteLover, selectCategory, sex, ocupation);
		
		DBHelper.closeConnection(conn);
		
		return user;

	}
	
	public static Users createUser() throws SQLException {

		Users user = new Users();
		UsersDAO.createUser(user);
		return user;
	}
	
	public static ArrayList<String> getUsersNames() throws SQLException {
		ArrayList<String> usersNames = new ArrayList<>();
		final String sql = "SELECT username FROM catalog.users;";
		Connection conn = DBHelper.openConnection();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		ResultSet rs = pstmt.executeQuery();
		
		while (rs.next()) {
			
			String userName = new String();
			
			if (!(rs.getString("username")==null)) {
				userName = rs.getString("username");
			}
			
			usersNames.add(userName);
		}
		
		DBHelper.closeConnection(conn);
		return usersNames;
		
	}
	
	public static String encryptPassword(String password) {
		
		return BcryptTest.bcryptTest(password);
		
	}
	
	public static void modifyPassword(Users user) throws SQLException {
		final String sql = "UPDATE catalog.users SET password=? WHERE username=?;";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql);
		
		pstmt.setString(1, UsersDAO.encryptPassword(user.getPassword()));
		pstmt.setString(2, user.getUsername());
		
		pstmt.executeUpdate();
		
		DBHelper.closeConnection(conn);
	}
	
	
	public static void updateUser(String username, String password, String name, String userAddress, String userPhone,
		String userEmail, boolean siteLover, ArrayList<String> selectCategory, String sex, String ocupation) throws SQLException {
		
		final String sql = "UPDATE catalog.users SET password=?, user_name=?, user_address=?, user_phone=?, user_email=?, site_lover=?, category_select=?, sex=?, ocupation=? WHERE username=?;";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql);
		
		pstmt.setString(1, password);
		pstmt.setString(2, name);
		pstmt.setString(3, userAddress);
		pstmt.setString(4, userPhone);
		pstmt.setString(5, userEmail);
				
		if(siteLover) {
			pstmt.setInt(6, 1);
		} else pstmt.setInt(6, 2);
		
		pstmt.setString(7, convertListToDelimitedString(selectCategory));
		pstmt.setString(8, sex);
		pstmt.setString(9, ocupation);
		pstmt.setString(10, username);
		
		pstmt.executeUpdate();
		
		DBHelper.closeConnection(conn);
	}

	public static void updateUser(Users user) throws SQLException {
		
		UsersDAO.updateUser(user.getUsername(), user.getPassword(), user.getName(), user.getUserAddress(), user.getUserPhone(), user.getUserEmail(), user.isSiteLover(), user.getSelectCategory(), user.getSex(), user.getOcupation());
	
	}
	
	public static Users getUser(String username) throws SQLException {
		final String sql = "SELECT username, password, user_name, user_address, user_phone, user_email, site_lover, category_select, sex, ocupation FROM catalog.users WHERE username=?;";
		Connection conn = DBHelper.openConnection();
		Users user = new Users();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, username);
		ResultSet rs = pstmt.executeQuery();
		
		if (rs.next()) {
			if (rs.getString("username")==null) {
				user.setUsername("");
			} else user.setUsername(rs.getString("username"));
			
			if (rs.getString("password")==null) {
				user.setPassword("");
			} else user.setPassword(rs.getString("password"));
			
			if (rs.getString("user_name")==null) {
				user.setName("");
			} else user.setName(rs.getString("user_name"));
			
			if (rs.getString("user_address")==null) {
				user.setUserAddress("");
			} else user.setUserAddress(rs.getString("user_address"));
			
			if (rs.getString("user_phone")==null) {
				user.setUserPhone("");
			} else user.setUserPhone(rs.getString("user_phone"));
			
			if (rs.getString("user_email")==null) {
				user.setUserEmail("");
			} else user.setUserEmail(rs.getString("user_email"));
			
			user.setEnabled(1);
			
			if(rs.getInt("site_lover")==1){
				user.setSiteLover(true);
			} else user.setSiteLover(false);
			
			if (rs.getString("category_select")==null) {
				user.getSelectCategory().isEmpty();
			} else user.setSelectCategory(convertDelimitedStringToList(rs.getString("category_select")));
			
			if (rs.getString("sex")==null) {
				user.setSex("");
			} else user.setSex(rs.getString("sex"));
			
			if (rs.getString("ocupation")==null) {
				user.setOcupation("");
			} else user.setOcupation(rs.getString("ocupation"));
			
		}

		DBHelper.closeConnection(conn);
		return user;
		
	}
	
	public static void deleteUser(String username) throws SQLException {
		final String sql = "DELETE FROM catalog.authorities WHERE username=?;";
		final String sql1 = "DELETE FROM catalog.users WHERE username=?;";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql);
		PreparedStatement pstmt1 = conn.prepareStatement(sql1);
		
		pstmt.setString(1, username);
		pstmt.executeUpdate();
		
		pstmt1.setString(1, username);
		pstmt1.executeUpdate();
		
		DBHelper.closeConnection(conn);

	}

	public static void deleteUser(Users user) throws SQLException {
		UsersDAO.deleteUser(user.getUsername());
	}
	
	public static String convertListToDelimitedString(ArrayList<String> list) {

		String result = "";
		if (list != null) {
			result = StringUtils.arrayToCommaDelimitedString(list.toArray());
		}
		return result;

	}
	
	private static ArrayList<String> convertDelimitedStringToList(String delimitedString) {

		ArrayList<String> result=new ArrayList<>();

		if (!StringUtils.isEmpty(delimitedString)) {
			result = new ArrayList<String>(Arrays.asList(delimitedString.split("\\s*,\\s*")));
		}
		return result;

	}
}
