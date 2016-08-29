package catalog.jdbc.pojo;

import org.springframework.security.core.GrantedAuthority;

public class Authorities implements GrantedAuthority {

	private String username;
	private String authority;
	
	public Authorities() {
		
	}
	
	public Authorities(String username) {
		this.username = username;
	}
	
	public Authorities(String username, String authority) {
		this.username = username;
		this.authority = authority;
	}
	
	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setAuthority(String authority) {
		this.authority = authority;
	}

	public String getAuthority() {
		
		return this.authority;
		
	}
	
	
	
}
