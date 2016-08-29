package catalog.jdbc.pojo;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class Users implements UserDetails {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -4067219669758579995L;
	
	//@NotEmpty
	private String username;
	
	//@NotEmpty
	private String password;
	
	//@NotEmpty
	private String name;
	
	
	private String userAddress;
	private String userPhone;
	
	//@NotEmpty
	private String userEmail;
	private int enabled;
	private boolean siteLover;
	
	//@NotEmpty
	private ArrayList<String> selectCategory;
	
	//@NotEmpty
	private String sex;
	
	//@NotEmpty
	private String ocupation;
	
	//@NotEmpty
	private String confirmPassword;
	private Set<Authorities> authorities;
	
	public Users() {
		this.selectCategory = new ArrayList<>();
	}
	
	public Users(String username) {
		this.username = username;
		this.selectCategory = new ArrayList<>();
	}
	
	public Users(String username, String password) {
		this.username = username;
		this.password = password;
		this.selectCategory = new ArrayList<>();
	}
	
	public Users(String username, String password, String name, String userAddress, String userPhone,
			String userEmail, int enabled, boolean siteLover, ArrayList<String> selectCategory, String sex, String ocupation,
			Set<Authorities> authorities) {
		this.username = username;
		this.password = password;
		this.name = name;
		this.userAddress = userAddress;
		this.userPhone = userPhone;
		this.userEmail = userEmail;
		this.enabled = enabled;
		this.siteLover = siteLover;
		this.selectCategory = new ArrayList<>();
		this.selectCategory = selectCategory;
		this.sex = sex;
		this.ocupation = ocupation;
		this.authorities = authorities;
	}

	public Users(String username, String password, String name, String userAddress, String userPhone,
			String userEmail, int enabled, boolean siteLover, ArrayList<String> selectCategory, String sex, String ocupation) {
		this.username = username;
		this.password = password;
		this.name = name;
		this.userAddress = userAddress;
		this.userPhone = userPhone;
		this.userEmail = userEmail;
		this.enabled = enabled;
		this.siteLover = siteLover;
		this.selectCategory = new ArrayList<>();
		this.selectCategory = selectCategory;
		this.sex = sex;
		this.ocupation = ocupation;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUserAddress() {
		return userAddress;
	}

	public void setUserAddress(String userAddress) {
		this.userAddress = userAddress;
	}

	public String getUserPhone() {
		return userPhone;
	}

	public void setUserPhone(String userPhone) {
		this.userPhone = userPhone;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public int getEnabled() {
		return enabled;
	}

	public void setEnabled(int enabled) {
		this.enabled = enabled;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getConfirmPassword() {
		return confirmPassword;
	}

	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}

	public void setAuthorities(Set<Authorities> authorities) {
		this.authorities = authorities;
	}

	public Collection<? extends GrantedAuthority> getAuthorities() {
		return this.authorities;
	}
	
	public boolean isSiteLover() {
		return siteLover;
	}

	public void setSiteLover(boolean siteLover) {
		this.siteLover = siteLover;
	}

	public ArrayList<String> getSelectCategory() {
		return selectCategory;
	}

	public void setSelectCategory(ArrayList<String> selectCategory) {
		this.selectCategory = selectCategory;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getOcupation() {
		return ocupation;
	}

	public void setOcupation(String ocupation) {
		this.ocupation = ocupation;
	}

	public String getPassword() {
		
		return this.password;
	}

	
	public String getUsername() {
		
		return this.username;
	}

	
	public boolean isAccountNonExpired() {
		
		return true;
	}

	public boolean isAccountNonLocked() {
		
		return true;
	}

	
	public boolean isCredentialsNonExpired() {
		
		return true;
	}

	
	public boolean isEnabled() {
		
		return true;
	}
	
	
	
}
