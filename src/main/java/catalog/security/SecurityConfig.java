package catalog.security;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import catalog.jdbc.dao.UsersDAO;

@Configuration
@EnableWebSecurity
//@EnableGlobalMethodSecurity(securedEnabled=true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Autowired
	private DataSource dataSource;
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		
		return new BCryptPasswordEncoder();
		
	} 
	
	@Autowired
	private UsersDAO usersDao;
	
	@Autowired
	public void configureGlobalSecurity (AuthenticationManagerBuilder auth) throws Exception {
		
		auth
			//.userDetailsService(usersDao)
			.jdbcAuthentication()
			.dataSource(dataSource)
			.passwordEncoder(passwordEncoder());
		
	}
	
	protected void configure(HttpSecurity http) throws Exception {
		
		http
		.authorizeRequests()
			.antMatchers("/resources/**", "/", "/laptops", "/smartphones", "/tvs", "/newuser.htm", "/savenewuser.htm", "/laptops/newlist.htm", "/laptops/filteredlist.htm", "/smartphones/newlist.htm", "/smartphones/filteredlist.htm", "/tvs/newlist.htm", "/tvs/filteredlist.htm", "/laptops/charts").permitAll()
			//.antMatchers("/laptops/laptop.htm", "/smartphones/phone.htm", "/tvs/tv.htm").hasRole("USER")
			.antMatchers("/laptops/laptop.htm", "/smartphones/phone.htm", "/tvs/tv.htm", "/updateuser.htm", "/saveuserupdate.htm").authenticated()
			.antMatchers("/laptops/edit.htm", "/laptops/save.htm", "/laptops/new.htm", "/laptops/savenew.htm", "/laptops/sterge/{laptopId}").hasRole("ADMIN")
			.antMatchers("/smartphones/edit.htm", "/smartphones/save.htm", "/smartphones/new.htm", "/smartphones/savenew.htm", "/smartphones/sterge/{phoneId}").hasRole("ADMIN")
			.antMatchers("/tvs/edit.htm", "/tvs/save.htm", "/tvs/new.htm", "/tvs/savenew.htm", "/tvs/sterge/{tvId}").hasRole("ADMIN")
			.and()
		.formLogin()
			.loginPage("/login")
			.and().exceptionHandling().accessDeniedPage("/Access_Denied");
	}
	
}
