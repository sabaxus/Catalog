package catalog.controllers;

import java.security.Principal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import catalog.jdbc.dao.UsersDAO;
import catalog.jdbc.pojo.Users;
import catalog.validator.UserFormValidator;
import catalog.validator.UserUpdateFormValidator;

@Controller
public class UserUpdateController {
	
	private final Logger logger = LoggerFactory.getLogger(UserUpdateController.class);
	
	@Autowired
	UserUpdateFormValidator userUpdateFormValidator;
	
	//Set a form validator
	@InitBinder
	protected void initBinder(WebDataBinder binder) {
		binder.setValidator(userUpdateFormValidator);
	}
	
	@RequestMapping(value = "/updateuser.htm", method = RequestMethod.GET)
	public ModelAndView updateUserView(Model model, HttpServletRequest request) {

		logger.debug("updateUserView()");
		
		Users user;
		try {
			user = UsersDAO.getUser(request.getRemoteUser());
			model.addAttribute("updateuserForm", user);			
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		String username=request.getRemoteUser();
        model.addAttribute("userName", username);
		
		return new ModelAndView("/updateuser", "model" , model);
	}
	
	@RequestMapping(value = "/saveuserupdate.htm", method = RequestMethod.POST)
	public ModelAndView updateUser(@ModelAttribute("updateuserForm") @Validated Users user, BindingResult result, Model model) {
		
		logger.debug("updateUser() : {}", user);
		
		if (result.hasErrors()) {
			return new ModelAndView("/updateuser");
		} else {
			
			Users userObj;
			try {
				userObj = UsersDAO.getUser(user.getUsername());
				
				userObj.setUsername(user.getUsername());
				userObj.setPassword(user.getPassword());
				userObj.setName(user.getName());
				
				if (user.getUserAddress()==null) {
					userObj.setUserAddress("");
				} else userObj.setUserAddress(user.getUserAddress());
				
				if (user.getUserPhone()==null) {
					userObj.setUserPhone("");
				} else userObj.setUserPhone(user.getUserPhone());
				
				userObj.setUserEmail(user.getUserEmail());
				userObj.setEnabled(1);
				
				if(user.isSiteLover()) {
					userObj.setSiteLover(true);
				} else userObj.setSiteLover(false);
				
				userObj.setSelectCategory(user.getSelectCategory());
				
				userObj.setSex(user.getSex());
				
				if (user.getOcupation()==null) {
					userObj.setOcupation("");
				} else userObj.setOcupation(user.getOcupation());
				
				UsersDAO.updateUser(userObj);
				UsersDAO.modifyPassword(userObj);
				model.addAttribute("updateuserForm", user);
				
				model.addAttribute("updateusersuccess", "Dear "+ user.getName()+", you have saved your changes successfully");
			} catch (NumberFormatException e) {
				e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			return new ModelAndView("/updateusersuccess", "command", user);
		}
		
	}
	
	@ModelAttribute("categoryList")
	public ArrayList<String> initializeCategoryList() {

		ArrayList<String> categoryList = new ArrayList<String>();
		categoryList.add("laptops");
		categoryList.add("smartphones");
		categoryList.add("tvs");
		return categoryList;
	
	}
	
	@ModelAttribute("ocupation")
	public HashMap<String, String> initializeOcupation() {

		HashMap<String, String> ocupation = new HashMap<String, String>();
		ocupation.put("elev", "elev");
		ocupation.put("student", "student");
		ocupation.put("somer", "somer");
		ocupation.put("angajat", "angajat");
		ocupation.put("freelancer", "freelancer");
		ocupation.put("pensionar", "pensionar");
		ocupation.put("alta", "alta");
		return ocupation;
		
	}
	
/*	
	@ExceptionHandler(EmptyResultDataAccessException.class)
	public ModelAndView handleEmptyData(HttpServletRequest req, Exception ex) {

		logger.debug("handleEmptyData()");
		logger.error("Request: {}, error ", req.getRequestURL(), ex);

		ModelAndView model = new ModelAndView();
		model.setViewName("user/show");
		model.addObject("msg", "user not found");

		return model;

	}
*/
	
}
