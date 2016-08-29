package catalog.controllers;

import java.security.Principal;
import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import catalog.jdbc.dao.PhotoDAO;

@Controller
public class IndexController {

	@RequestMapping(value = "", method = RequestMethod.GET)
	public ModelAndView showIndex(Model model, HttpServletRequest request) {
		String laptopPic=null;
		String phonePic=null;
		String tvPic=null;
		try {
			laptopPic = PhotoDAO.getPhotoAddress("laptop-673715_1920.jpg");
			phonePic = PhotoDAO.getPhotoAddress("iphone-6-in-black-and-white-edit-picjumbo-com.jpg");
			tvPic = PhotoDAO.getPhotoAddress("photo-1467293622093-9f15c96be70f.jpg");
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		model.addAttribute("laptopPic", laptopPic);
		model.addAttribute("phonePic", phonePic);
		model.addAttribute("tvPic", tvPic);
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}
		
		return new ModelAndView("index", "model", model);
	}
	
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public ModelAndView loginPage(Model model, HttpServletRequest request) {
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}
		
		return new ModelAndView("old_login", "model", model);
	}
	
	@RequestMapping(value = "/Access_Denied", method = RequestMethod.GET)
    public ModelAndView accessDeniedPage(Model model, Principal principal) {
        String username=principal.getName();
        model.addAttribute("userName", username);
		return new ModelAndView("accessDenied", "model", model);
    }
	
	@RequestMapping(value = "/newfile", method = RequestMethod.GET)
    public String Slider() {
		return "NewFile";
    }
	
	@RequestMapping(value="/logout", method = RequestMethod.GET)
    public ModelAndView logoutPage (Model model, HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null){    
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        
        if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}
        
        return new ModelAndView("redirect:/", "model", model);
    }
	
/*	
	@RequestMapping(value = "/admin", method = RequestMethod.GET)
	public String adminPage() {
		return "admin";
	}
*/
}