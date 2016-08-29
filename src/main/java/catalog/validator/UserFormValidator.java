package catalog.validator;

import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import catalog.jdbc.dao.UsersDAO;
import catalog.jdbc.pojo.Users;


//http://docs.spring.io/spring/docs/current/spring-framework-reference/html/validation.html#validation-mvc-configuring
@Component
public class UserFormValidator implements Validator {

	@Autowired
	@Qualifier("emailValidator")
	EmailValidator emailValidator;
	
	//@Autowired
	//UserService userService;
	
	@Override
	public boolean supports(Class<?> clazz) {
		return Users.class.equals(clazz);
	}

	@Override
	public void validate(Object target, Errors errors) {

		Users user = (Users) target;
		
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username", "NotEmpty.newuserForm.username");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "NotEmpty.newuserForm.password");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "confirmPassword","NotEmpty.newuserForm.confirmPassword");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name", "NotEmpty.newuserForm.name");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "userEmail", "NotEmpty.newuserForm.userEmail");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "sex", "NotEmpty.newuserForm.sex");

		if(!emailValidator.valid(user.getUserEmail())){
			errors.rejectValue("userEmail", "Pattern.newuserForm.userEmail");
		}
		
		if (!user.getPassword().equals(user.getConfirmPassword())) {
			errors.rejectValue("confirmPassword", "Diff.newuserForm.confirmPassword");
		}
		
		try {
			for(String s:UsersDAO.getUsersNames()) {
				if(s.equals(user.getUsername())) {
					errors.rejectValue("username", "ExistingUser.newuserForm.username");
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
/*		
		if(user.getOcupation().equalsIgnoreCase("none")){
			errors.rejectValue("ocupation", "NotEmpty.newuserForm.ocupation");
		}
		
		if (user.getSelectCategory().size()==0) {
			errors.rejectValue("selectCategory", "Required.newuserForm.selectCategory");
		}
*/		
	}

}