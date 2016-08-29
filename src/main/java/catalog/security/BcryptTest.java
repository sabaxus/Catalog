package catalog.security;

import org.junit.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BcryptTest {
	
	@Test
	public void bcryptTest() {
		
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String encodedPassword1 = encoder.encode("1");
		System.out.println(encodedPassword1);
				
	}
	
	public static String bcryptTest(String s) {
		
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String encodedPassword = encoder.encode(s);
		
		return encodedPassword;
	}
	
}
