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

@Controller
public class UserController {
	
	private final Logger logger = LoggerFactory.getLogger(UserController.class);
	
	@Autowired
	UserFormValidator userFormValidator;
	
	//Set a form validator
	@InitBinder
	protected void initBinder(WebDataBinder binder) {
		binder.setValidator(userFormValidator);
	}
	
	@RequestMapping(value = "/newuser.htm", method = RequestMethod.GET)
	public ModelAndView signUpUserView(Model model) {

		logger.debug("signUpUserView()");
		
		Users newuser;
		try {
			newuser = new Users();
			
			// set default value
			//newuser.setSiteLover(true);
			//newuser.setSex("M");
			//newuser.setSelectCategory(new ArrayList<String>(Arrays.asList("laptops", "smartphones")));
			//newuser.setOcupation("angajat");
			
			model.addAttribute("newuserForm", newuser);
			
			
			
		} catch (NumberFormatException e) {
			e.printStackTrace();
		}
				
		return new ModelAndView("/signupuser", "model" , model);
	}
	
	@RequestMapping(value = "/savenewuser.htm", method = RequestMethod.POST)
	public ModelAndView signUpUser(@ModelAttribute("newuserForm") @Validated Users newuser, BindingResult result, Model model) {
		
		logger.debug("signUpUser() : {}", newuser);
		
		if (result.hasErrors()) {
			
			return new ModelAndView("/signupuser");
		} else {

			try {
				UsersDAO.createUser(newuser);
				UsersDAO.modifyPassword(newuser);
				model.addAttribute("newuserForm", newuser);
				model.addAttribute("success", "Dear "+ newuser.getName()+", you have signed up successfully!");
			} catch (NumberFormatException e) {
				e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			return new ModelAndView("/signupsuccess", "command", newuser);
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
