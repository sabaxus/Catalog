package catalog.controllers;

import java.security.Principal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import catalog.jdbc.dao.LaptopListDAO;
import catalog.jdbc.dao.PhoneListDAO;
import catalog.jdbc.dao.SmartphoneDAO;
import catalog.jdbc.pojo.Smartphone;
import catalog.jdbc.pojo.SmartphoneLists;

@RequestMapping(value = "/smartphones")
@Controller
public class SmartphoneController {
	
//	private int contorBrand=0;
//	private int contorDimensiuneEcranInch=0;
//	private int contorRezolutieEcranPixeli=0;
//	private int contorMemorieInternaGB=0;
//	private int contorMemorieRAMMB=0;
//	private int contorTipProcesor=0;
//	private int contorCuloare=0;

	/**
	 * Method for displaying the list of phones
	 * 
	 * @return
	 */
	@RequestMapping(value = "", method = RequestMethod.GET)
	public ModelAndView displayList(Model model, HttpServletRequest request) {
		//HashMap<String, Object> model = new HashMap<String, Object>();

		ArrayList<Smartphone> phoneList;

		if (request.isUserInRole("SUPERUSER")){    
			try {
				phoneList = SmartphoneDAO.getSuperuserSmartphones();
				model.addAttribute("phoneList", phoneList);
			} catch (SQLException e) {
				e.printStackTrace();
			}
        } else {
        	try {
    			phoneList = SmartphoneDAO.getUserSmartphones();
    			model.addAttribute("phoneList", phoneList);
    		} catch (SQLException e) {
    			e.printStackTrace();
    		}
        }
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}
				
		return new ModelAndView("smartphones/phonelist", "model", model);
		
	}
	
	@RequestMapping(value = "/newlist.htm", method = RequestMethod.GET)
	public ModelAndView displayFilteredList(Model model, HttpServletRequest request) {
		//HashMap<String, Object> model = new HashMap<String, Object>();
		
		ArrayList<Smartphone> phoneList;
		SmartphoneLists lists;
		
		if (request.isUserInRole("SUPERUSER")){    
			try {
				phoneList = SmartphoneDAO.getSuperuserSmartphones();
				model.addAttribute("phoneList", phoneList);
				lists = new SmartphoneLists();
				model.addAttribute("lists", lists);
			} catch (NumberFormatException e) {
    			e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
			}
        } else {
        	try {
    			phoneList = SmartphoneDAO.getUserSmartphones();
    			model.addAttribute("phoneList", phoneList);
				lists = new SmartphoneLists();
    			model.addAttribute("lists", lists);
        	} catch (NumberFormatException e) {
    			e.printStackTrace();
    		} catch (SQLException e) {
    			e.printStackTrace();
    		}
        }
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}

		return new ModelAndView("smartphones/phonelist", "model", model);
		
	}
	
	@RequestMapping(value = "/filteredlist.htm", method = RequestMethod.POST)
	public ModelAndView displayFilteredList(@ModelAttribute("lists") SmartphoneLists lists, Model model, BindingResult result, HttpServletRequest request) {
				
		ArrayList<Smartphone> phoneList = new ArrayList<>();
		ArrayList<Smartphone> resultSmartphones1= new ArrayList<>();
		ArrayList<Smartphone> resultSmartphones2= new ArrayList<>();
		ArrayList<Smartphone> resultSmartphones3= new ArrayList<>();
		ArrayList<Smartphone> resultSmartphones4= new ArrayList<>();
		ArrayList<Smartphone> resultSmartphones5= new ArrayList<>();
		ArrayList<Smartphone> resultSmartphones6= new ArrayList<>();
		ArrayList<Smartphone> resultSmartphones= new ArrayList<>();
		
		if (request.isUserInRole("SUPERUSER")){    
			try {
				phoneList = SmartphoneDAO.getSuperuserSmartphones();
				
				if(!(lists.getBrandList().isEmpty())) {
					for(String brand:lists.getBrandList()) {
						for(Smartphone phone:phoneList) {
							if(phone.getBrand().equals(brand)) {
								resultSmartphones1.add(phone);
							}
						}
					}
				} else {
					for(Smartphone p:phoneList) {
						resultSmartphones1.add(p);
					}
				}
				if(!(lists.getDimensiuneEcranInchList().isEmpty())) {
					for(Double dimensiuneEcranInch:lists.getDimensiuneEcranInchList()) {
						for(Smartphone phone:resultSmartphones1) {
							if(phone.getDimensiuneEcranInch()==dimensiuneEcranInch) {
								resultSmartphones2.add(phone);
							}
						}
					}
				} else {
					for(Smartphone p:resultSmartphones1) {
						resultSmartphones2.add(p);
					}
				}
				if(!(lists.getRezolutieEcranPixeliList().isEmpty())) {
					for(String rezolutieEcranPixeli:lists.getRezolutieEcranPixeliList()) {
						for(Smartphone phone:resultSmartphones2) {
							if(phone.getRezolutieEcranPixeli().equals(rezolutieEcranPixeli)) {
								resultSmartphones3.add(phone);
							}
						}
					}
				} else {
					for(Smartphone p:resultSmartphones2) {
						resultSmartphones3.add(p);
					}
				}
				if(!(lists.getMemorieInternaGBList().isEmpty())) {
					for(Integer memorieInternaGB:lists.getMemorieInternaGBList()) {
						for(Smartphone phone:resultSmartphones3) {
							if(phone.getMemorieInternaGB()==memorieInternaGB) {
								resultSmartphones4.add(phone);
							}
						}
					}
				} else {
					for(Smartphone p:resultSmartphones3) {
						resultSmartphones4.add(p);
					}
				}
				if(!(lists.getMemorieRAMMBList().isEmpty())) {
					for(Integer memorieRAMMB:lists.getMemorieRAMMBList()) {
						for(Smartphone phone:resultSmartphones4) {
							if(phone.getMemorieRAMMB()==memorieRAMMB) {
								resultSmartphones5.add(phone);
							}
						}
					}
				} else {
					for(Smartphone p:resultSmartphones4) {
						resultSmartphones5.add(p);
					}
				}
				if(!(lists.getTipProcesorList().isEmpty())) {
					for(String tipProcesor:lists.getTipProcesorList()) {
						for(Smartphone phone:resultSmartphones5) {
							if(phone.getTipProcesor().equals(tipProcesor)) {
								resultSmartphones6.add(phone);
							}
						}
					}
				} else {
					for(Smartphone p:resultSmartphones5) {
						resultSmartphones6.add(p);
					}
				}
				if(!(lists.getCuloareList().isEmpty())) {
					for(String culoare:lists.getCuloareList()) {
						for(Smartphone phone:resultSmartphones6) {
							if(phone.getCuloare().equals(culoare)) {
								resultSmartphones.add(phone);
							}
						}
					}
				} else {
					for(Smartphone p:resultSmartphones6) {
						resultSmartphones.add(p);
					}
				}
				
				model.addAttribute("phoneList", resultSmartphones);
				
//				model.addAttribute("contorBrand", contorBrand);
//				model.addAttribute("contorDimensiuneEcranInch", contorDimensiuneEcranInch);
//				model.addAttribute("contorRezolutieEcranPixeli", contorRezolutieEcranPixeli);
//				model.addAttribute("contorMemorieInternaGB", contorMemorieInternaGB);
//				model.addAttribute("contorMemorieRAMMB", contorMemorieRAMMB);
//				model.addAttribute("contorTipProcesor", contorTipProcesor);
//				model.addAttribute("contorCuloare", contorCuloare);
				
				
			} catch (NumberFormatException e) {
    			e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
			}
        } else {
        	try {
        		phoneList = SmartphoneDAO.getUserSmartphones();
				
        		if(!(lists.getBrandList().isEmpty())) {
					for(String brand:lists.getBrandList()) {
						for(Smartphone phone:phoneList) {
							if(phone.getBrand().equals(brand)) {
								resultSmartphones1.add(phone);
							}
						}
					}
				} else {
					for(Smartphone p:phoneList) {
						resultSmartphones1.add(p);
					}
				}
				if(!(lists.getDimensiuneEcranInchList().isEmpty())) {
					for(Double dimensiuneEcranInch:lists.getDimensiuneEcranInchList()) {
						for(Smartphone phone:resultSmartphones1) {
							if(phone.getDimensiuneEcranInch()==dimensiuneEcranInch) {
								resultSmartphones2.add(phone);
							}
						}
					}
				} else {
					for(Smartphone p:resultSmartphones1) {
						resultSmartphones2.add(p);
					}
				}
				if(!(lists.getRezolutieEcranPixeliList().isEmpty())) {
					for(String rezolutieEcranPixeli:lists.getRezolutieEcranPixeliList()) {
						for(Smartphone phone:resultSmartphones2) {
							if(phone.getRezolutieEcranPixeli().equals(rezolutieEcranPixeli)) {
								resultSmartphones3.add(phone);
							}
						}
					}
				} else {
					for(Smartphone p:resultSmartphones2) {
						resultSmartphones3.add(p);
					}
				}
				if(!(lists.getMemorieInternaGBList().isEmpty())) {
					for(Integer memorieInternaGB:lists.getMemorieInternaGBList()) {
						for(Smartphone phone:resultSmartphones3) {
							if(phone.getMemorieInternaGB()==memorieInternaGB) {
								resultSmartphones4.add(phone);
							}
						}
					}
				} else {
					for(Smartphone p:resultSmartphones3) {
						resultSmartphones4.add(p);
					}
				}
				if(!(lists.getMemorieRAMMBList().isEmpty())) {
					for(Integer memorieRAMMB:lists.getMemorieRAMMBList()) {
						for(Smartphone phone:resultSmartphones4) {
							if(phone.getMemorieRAMMB()==memorieRAMMB) {
								resultSmartphones5.add(phone);
							}
						}
					}
				} else {
					for(Smartphone p:resultSmartphones4) {
						resultSmartphones5.add(p);
					}
				}
				if(!(lists.getTipProcesorList().isEmpty())) {
					for(String tipProcesor:lists.getTipProcesorList()) {
						for(Smartphone phone:resultSmartphones5) {
							if(phone.getTipProcesor().equals(tipProcesor)) {
								resultSmartphones6.add(phone);
							}
						}
					}
				} else {
					for(Smartphone p:resultSmartphones5) {
						resultSmartphones6.add(p);
					}
				}
				if(!(lists.getCuloareList().isEmpty())) {
					for(String culoare:lists.getCuloareList()) {
						for(Smartphone phone:resultSmartphones6) {
							if(phone.getCuloare().equals(culoare)) {
								resultSmartphones.add(phone);
							}
						}
					}
				} else {
					for(Smartphone p:resultSmartphones6) {
						resultSmartphones.add(p);
					}
				}
				
				model.addAttribute("phoneList", resultSmartphones);
				
//				model.addAttribute("contorBrand", contorBrand);
//				model.addAttribute("contorDimensiuneEcranInch", contorDimensiuneEcranInch);
//				model.addAttribute("contorRezolutieEcranPixeli", contorRezolutieEcranPixeli);
//				model.addAttribute("contorMemorieInternaGB", contorMemorieInternaGB);
//				model.addAttribute("contorMemorieRAMMB", contorMemorieRAMMB);
//				model.addAttribute("contorTipProcesor", contorTipProcesor);
//				model.addAttribute("contorCuloare", contorCuloare);
				
				
			} catch (NumberFormatException e) {
    			e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
    		}
        }
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}
        
		return new ModelAndView("/smartphones/phonefilteredlist", "model", model);
		
	}

	/**
	 * Method for displaying details of a phone (non-editable details)
	 * 
	 * @param phoneId
	 * @return
	 */

	@RequestMapping(value = "/phone.htm", method = RequestMethod.GET)
	public ModelAndView displayPhone(@RequestParam("phoneId") String phoneId, Model model, HttpServletRequest request) {
		//HashMap<String, Object> model = new HashMap<String, Object>();

		Smartphone phone;
		try {
			phone = SmartphoneDAO.getSmartphone(Integer.valueOf(phoneId));
			model.addAttribute("phone", phone);
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}
		
		return new ModelAndView("/smartphones/phone", "model", model);
	}

	/**
	 * Method for displaying the details of a phone for editing (filling the form
	 * fields with phone data)
	 * 
	 * @param phoneId
	 * @param model
	 * @return
	 */
	
	@RequestMapping(value = "/edit.htm", method = RequestMethod.GET)
	public ModelAndView editPhoneView(@RequestParam("phoneId") String phoneId, Model model, HttpServletRequest request) {

		Smartphone phone;
		try {
			phone = SmartphoneDAO.getSmartphone(Integer.valueOf(phoneId));
			model.addAttribute("phoneForm", phone);
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}
		
		return new ModelAndView("/smartphones/phoneedit", "model", model);
	}
	
	/**
	 * Method used for retrieving the details of a phone after "save" is pressed
	 * in edit mode
	 * 
	 * @param phone
	 * @param model
	 * @param result
	 * @return
	 */

	@RequestMapping(value = "/save.htm", method = RequestMethod.POST)
	public ModelAndView savePhone(@ModelAttribute("phoneForm") Smartphone phone, Model model, BindingResult result, HttpServletRequest request) {

		Smartphone phoneObj;
		try {
			phoneObj = SmartphoneDAO.getSmartphone(Integer.valueOf(phone.getId()));
			
			if (phone.getNume()==null) {
				phoneObj.setNume("");
			} else phoneObj.setNume(phone.getNume());
			
			if (phone.getSpecificatii()==null) {
				phoneObj.setSpecificatii("");
			} else phoneObj.setSpecificatii(phone.getSpecificatii());
			
			phoneObj.setCantitate(Integer.valueOf(phone.getCantitate()));
			phoneObj.setPret(Double.valueOf(phone.getPret()));
			
			if (phone.getInStoc()==null) {
				phoneObj.setInStoc("");
			} else phoneObj.setInStoc(phone.getInStoc());
			
			if (phone.getRetea2G()==null) {
				phoneObj.setRetea2G("");
			} else phoneObj.setRetea2G(phone.getRetea2G());
			
			if (phone.getRetea3G()==null) {
				phoneObj.setRetea3G("");
			} else phoneObj.setRetea3G(phone.getRetea3G());
			
			if (phone.getRetea4G()==null) {
				phoneObj.setRetea4G("");
			} else phoneObj.setRetea4G(phone.getRetea4G());
			
			if (phone.getDualSim()==null) {
				phoneObj.setDualSim("");
			} else phoneObj.setDualSim(phone.getDualSim());
			
			if (phone.getSim()==null) {
				phoneObj.setSim("");
			} else phoneObj.setSim(phone.getSim());
			
			if (phone.getTipEcran()==null) {
				phoneObj.setTipEcran("");
			} else phoneObj.setTipEcran(phone.getTipEcran());
			
			phoneObj.setDimensiuneEcranInch(Double.valueOf(phone.getDimensiuneEcranInch()));
			
			if (phone.getRezolutieEcranPixeli()==null) {
				phoneObj.setRezolutieEcranPixeli("");
			} else phoneObj.setRezolutieEcranPixeli(phone.getRezolutieEcranPixeli());
			
			if (phone.getMultitouch()==null) {
				phoneObj.setMultitouch("");
			} else phoneObj.setMultitouch(phone.getMultitouch());
			
			if (phone.getCuloriEcran()==null) {
				phoneObj.setCuloriEcran("");
			} else phoneObj.setCuloriEcran(phone.getCuloriEcran());
			
			if (phone.getProtectieEcran()==null) {
				phoneObj.setProtectieEcran("");
			} else	phoneObj.setProtectieEcran(phone.getProtectieEcran());
			
			if (phone.getSuneteAlerta()==null) {
				phoneObj.setSuneteAlerta("");
			} else	phoneObj.setSuneteAlerta(phone.getSuneteAlerta());
			
			if (phone.getDifuzor()==null) {
				phoneObj.setDifuzor("");
			} else phoneObj.setDifuzor(phone.getDifuzor());
			
			if (phone.getFacilitatiSunet()==null) {
				phoneObj.setFacilitatiSunet("");
			} else	phoneObj.setFacilitatiSunet(phone.getFacilitatiSunet());
			
			phoneObj.setMemorieInternaGB(Integer.valueOf(phone.getMemorieInternaGB()));
			phoneObj.setMemorieRAMMB(Integer.valueOf(phone.getMemorieRAMMB()));
			
			if (phone.getSlotCard()==null) {
				phoneObj.setSlotCard("");
			} else	phoneObj.setSlotCard(phone.getSlotCard());
			
			phoneObj.setCapacitateMaximaCardMemorieGB(Integer.valueOf(phone.getCapacitateMaximaCardMemorieGB()));
			
			if (phone.getGprs()==null) {
				phoneObj.setGprs("");
			} else	phoneObj.setGprs(phone.getGprs());
			
			if (phone.getEdge()==null) {
				phoneObj.setEdge("");
			} else phoneObj.setEdge(phone.getEdge());
			
			if (phone.getVitezaDate()==null) {
				phoneObj.setVitezaDate("");
			} else phoneObj.setVitezaDate(phone.getVitezaDate());
			
			if (phone.getWlan()==null) {
				phoneObj.setWlan("");
			} else phoneObj.setWlan(phone.getWlan());
			
			if (phone.getBluetooth()==null) {
				phoneObj.setBluetooth("");
			} else phoneObj.setBluetooth(phone.getBluetooth());
			
			if (phone.getUsb()==null) {
				phoneObj.setUsb("");
			} else phoneObj.setUsb(phone.getUsb());
			
			if (phone.getNfc()==null) {
				phoneObj.setNfc("");
			} else	phoneObj.setNfc(phone.getNfc());
			
			if (phone.getPortInfrared()==null) {
				phoneObj.setPortInfrared("");
			} else phoneObj.setPortInfrared(phone.getPortInfrared());
			
			if (phone.getRezolutieFotoVideoMp()==null) {
				phoneObj.setRezolutieFotoVideoMp("");
			} else	phoneObj.setRezolutieFotoVideoMp(phone.getRezolutieFotoVideoMp());
			
			if (phone.getRezolutieFotografie()==null) {
				phoneObj.setRezolutieFotografie("");
			} else	phoneObj.setRezolutieFotografie(phone.getRezolutieFotografie());
			
			if (phone.getRezolutieVideo()==null) {
				phoneObj.setRezolutieVideo("");
			} else	phoneObj.setRezolutieVideo(phone.getRezolutieVideo());
			
			if (phone.getSenzorImagine()==null) {
				phoneObj.setSenzorImagine("");
			} else	phoneObj.setSenzorImagine(phone.getSenzorImagine());
			
			if (phone.getBlitz()==null) {
				phoneObj.setBlitz("");
			} else phoneObj.setBlitz(phone.getBlitz());
						
			if (phone.getFocus()==null) {
				phoneObj.setFocus("");
			} else	phoneObj.setFocus(phone.getFocus());
			
			if (phone.getCameraSecundara()==null) {
				phoneObj.setCameraSecundara("");
			} else phoneObj.setCameraSecundara(phone.getCameraSecundara());
			
			if (phone.getFacilitatiFotoVideo()==null) {
				phoneObj.setFacilitatiFotoVideo("");
			} else phoneObj.setFacilitatiFotoVideo(phone.getFacilitatiFotoVideo());
			
			if (phone.getTipProcesor()==null) {
				phoneObj.setTipProcesor("");
			} else	phoneObj.setTipProcesor(phone.getTipProcesor());
			
			if (phone.getModelProcesor()==null) {
				phoneObj.setModelProcesor("");
			} else phoneObj.setModelProcesor(phone.getModelProcesor());
			
			if (phone.getFrecventaProcesorGHz()==null) {
				phoneObj.setFrecventaProcesorGHz("");
			} else	phoneObj.setFrecventaProcesorGHz(phone.getFrecventaProcesorGHz());
			
			if (phone.getProcesorGrafic()==null) {
				phoneObj.setProcesorGrafic("");
			} else phoneObj.setProcesorGrafic(phone.getProcesorGrafic());
			
			if (phone.getSistemDeOperare()==null) {
				phoneObj.setSistemDeOperare("");
			} else	phoneObj.setSistemDeOperare(phone.getSistemDeOperare());
			
			if (phone.getVariantaSistemOperare()==null) {
				phoneObj.setVariantaSistemOperare("");
			} else	phoneObj.setVariantaSistemOperare(phone.getVariantaSistemOperare());
			
			if (phone.getSenzori()==null) {
				phoneObj.setSenzori("");
			} else	phoneObj.setSenzori(phone.getSenzori());
			
			if (phone.getMesagerie()==null) {
				phoneObj.setMesagerie("");
			} else	phoneObj.setMesagerie(phone.getMesagerie());
			
			if (phone.getBrowser()==null) {
				phoneObj.setBrowser("");
			} else	phoneObj.setBrowser(phone.getBrowser());
			
			if (phone.getRadio()==null) {
				phoneObj.setRadio("");
			} else phoneObj.setRadio(phone.getRadio());
			
			if (phone.getGps()==null) {
				phoneObj.setGps("");
			} else	phoneObj.setGps(phone.getGps());
			
			if (phone.getAplicatii()==null) {
				phoneObj.setAplicatii("");
			} else	phoneObj.setAplicatii(phone.getAplicatii());
			
			if (phone.getAlteFacilitati()==null) {
				phoneObj.setAlteFacilitati("");
			} else	phoneObj.setAlteFacilitati(phone.getAlteFacilitati());
			
			if (phone.getTipBaterie()==null) {
				phoneObj.setTipBaterie("");
			} else	phoneObj.setTipBaterie(phone.getTipBaterie());
			
			if (phone.getAutonomieConvorbire()==null) {
				phoneObj.setAutonomieConvorbire("");
			} else	phoneObj.setAutonomieConvorbire(phone.getAutonomieConvorbire());
			
			if (phone.getAutonomieStandby()==null) {
				phoneObj.setAutonomieStandby("");
			} else phoneObj.setAutonomieStandby(phone.getAutonomieStandby());
			
			phoneObj.setCapacitateBateriemAh(Integer.valueOf(phone.getCapacitateBateriemAh()));
			
			if (phone.getCuloare()==null) {
				phoneObj.setCuloare("");
			} else phoneObj.setCuloare(phone.getCuloare());
			
			if (phone.getDimensiuni()==null) {
				phoneObj.setDimensiuni("");
			} else phoneObj.setDimensiuni(phone.getDimensiuni());
			
			phoneObj.setGreutateg(Integer.valueOf(phone.getGreutateg()));
			
			if (phone.getGarantieComerciala()==null) {
				phoneObj.setGarantieComerciala("");
			} else phoneObj.setGarantieComerciala(phone.getGarantieComerciala());
			
			if (phone.getGarantieDeConformitate()==null) {
				phoneObj.setGarantieDeConformitate("");
			} else phoneObj.setGarantieDeConformitate(phone.getGarantieDeConformitate());
			
			SmartphoneDAO.updateSmartphone(phoneObj);
			model.addAttribute("phoneForm", phone);
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}


		return new ModelAndView("/smartphones/phoneedit", "command", phone);
	}
	
	/**
	 * Method for displaying an empty form for creating a phone (filling the form
	 * fields with phone data)
	 * 
	 * 
	 * @param model
	 * @return
	 */
	
	@RequestMapping(value = "/new.htm", method = RequestMethod.GET)
	public ModelAndView createPhoneView(Model model, HttpServletRequest request) {

		Smartphone newphone;
		try {
			newphone = new Smartphone();
			model.addAttribute("newphoneForm", newphone);
		} catch (NumberFormatException e) {
			e.printStackTrace();
		}
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}


		return new ModelAndView("/smartphones/createphone", "model", model);
	}
	
	/**
	 * Method used for retrieving the details of a newly created phone after "save" is pressed
	 * in edit mode
	 * 
	 * @param phone
	 * @param model
	 * @param result
	 * @return
	 */

	@RequestMapping(value = "/savenew.htm", method = RequestMethod.POST)
	public ModelAndView createPhone(@ModelAttribute("newphoneForm") Smartphone newphone, Model model, BindingResult result, HttpServletRequest request) {

		//Smartphone phoneObj;
		try {
			
			SmartphoneDAO.createSmartphone(newphone);
			model.addAttribute("newphoneForm", newphone);
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}


		return new ModelAndView("/smartphones/createphone", "command", newphone);
	}
	
	/**
	 * Method for deleting a phone
	 * 
	 * @param phoneId
	 * @param model
	 * @return
	 */
	
	@RequestMapping(value = "/sterge/{phoneId}")
	public ModelAndView stergePhone(@PathVariable String phoneId, Model model, HttpServletRequest request) {

		ArrayList<Smartphone> phoneList;
		SmartphoneLists lists;
		try {
			SmartphoneDAO.deleteSmartphone(Integer.valueOf(phoneId));
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if (request.isUserInRole("SUPERUSER")){    
			try {
				phoneList = SmartphoneDAO.getSuperuserSmartphones();
				model.addAttribute("phoneList", phoneList);
				lists = new SmartphoneLists();
				model.addAttribute("lists", lists);
			} catch (SQLException e) {
				e.printStackTrace();
			}
        } else {
        	try {
    			phoneList = SmartphoneDAO.getUserSmartphones();
    			model.addAttribute("phoneList", phoneList);
    			lists = new SmartphoneLists();
				model.addAttribute("lists", lists);
    		} catch (SQLException e) {
    			e.printStackTrace();
    		}
        }
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}


		return new ModelAndView("/smartphones/phonelist", "model", model);
	}
	
	@RequestMapping(value = "/charts", method = RequestMethod.GET)
	public ModelAndView displayCharts(Model model, HttpServletRequest request) {
		
		HashMap<String, Double> brandMap = new HashMap<>();
		try {
			brandMap = PhoneListDAO.getPhonesNumbersByBrand();
			model.addAttribute("brandMap", brandMap);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		HashMap<Double, Double> dimEcranMap = new HashMap<>();
		try {
			dimEcranMap = PhoneListDAO.getPhonesNumbersByDimensiuneEcran();
			model.addAttribute("dimEcranMap", dimEcranMap);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		HashMap<String, Double> resScreenMap = new HashMap<>();
		try {
			resScreenMap = PhoneListDAO.getPhonesNumbersByRezolutieEcran();
			model.addAttribute("resScreenMap", resScreenMap);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		HashMap<Integer, Double> memorieInternaMap = new HashMap<>();
		try {
			memorieInternaMap = PhoneListDAO.getPhonesNumbersByMemorieInterna();
			model.addAttribute("memorieInternaMap", memorieInternaMap);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		HashMap<Integer, Double> memorieRAMMap = new HashMap<>();
		try {
			memorieRAMMap = PhoneListDAO.getPhonesNumbersByMemorieRAM();
			model.addAttribute("memorieRAMMap", memorieRAMMap);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		HashMap<String, Double> tipProcesorMap = new HashMap<>();
		try {
			tipProcesorMap = PhoneListDAO.getPhonesNumbersByTipProcesor();
			model.addAttribute("tipProcesorMap", tipProcesorMap);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		HashMap<String, Double> culoareMap = new HashMap<>();
		try {
			culoareMap = PhoneListDAO.getPhonesNumbersByCuloare();
			model.addAttribute("culoareMap", culoareMap);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}
		
		return new ModelAndView("/smartphones/phonescharts", "model", model);
		
	}
	
	@ModelAttribute("brandList")
	public ArrayList<String> initializeBrandList() {

		ArrayList<String> brandList = new ArrayList<String>();
		brandList.add("APPLE");
		brandList.add("SONY");
		brandList.add("SAMSUNG");
		brandList.add("HTC");
		brandList.add("HUAWEI");
		brandList.add("MICROSOFT");
		brandList.add("LG");
		return brandList;
	
	}
	
	@ModelAttribute("dimensiuneEcranInchList")
	public ArrayList<Double> initializeDimensiuneEcranInchList() {

		ArrayList<Double> dimensiuneEcranInchList = new ArrayList<Double>();
		dimensiuneEcranInchList.add(5.2);
		dimensiuneEcranInchList.add(5.5);
		dimensiuneEcranInchList.add(5.7);
		return dimensiuneEcranInchList;
	
	}

	@ModelAttribute("rezolutieEcranPixeliList")
	public ArrayList<String> initializeRezolutieEcranPixeliList() {

		ArrayList<String> rezolutieEcranPixeliList = new ArrayList<String>();
		rezolutieEcranPixeliList.add("1080 x 1920");
		rezolutieEcranPixeliList.add("1440 x 2560");
		rezolutieEcranPixeliList.add("2160 x 3840");
		return rezolutieEcranPixeliList;
	
	}
	
	@ModelAttribute("memorieInternaGBList")
	public ArrayList<Integer> initializeMemorieInternaGBList() {

		ArrayList<Integer> memorieInternaGBList = new ArrayList<Integer>();
		memorieInternaGBList.add(16);
		memorieInternaGBList.add(32);
		memorieInternaGBList.add(64);
		memorieInternaGBList.add(128);
		return memorieInternaGBList;
	
	}
	
	@ModelAttribute("memorieRAMMBList")
	public ArrayList<Integer> initializeMemorieRAMMBList() {

		ArrayList<Integer> memorieRAMMBList = new ArrayList<Integer>();
		memorieRAMMBList.add(1024);
		memorieRAMMBList.add(2048);
		memorieRAMMBList.add(3072);
		memorieRAMMBList.add(4096);
		return memorieRAMMBList;
	
	}
	
	@ModelAttribute("tipProcesorList")
	public ArrayList<String> initializeTipProcesorList() {

		ArrayList<String> tipProcesorList = new ArrayList<String>();
		tipProcesorList.add("Dual Core");
		tipProcesorList.add("Quad core");
		tipProcesorList.add("Hexa Core");
		tipProcesorList.add("Octa Core");
		return tipProcesorList;
	
	}
	
	@ModelAttribute("culoareList")
	public ArrayList<String> initializeCuloareList() {

		ArrayList<String> culoareList = new ArrayList<String>();
		culoareList.add("Argintiu");
		culoareList.add("Gri");
		culoareList.add("Auriu");
		culoareList.add("Roz");
		culoareList.add("Rosu");
		culoareList.add(" Negru");
		return culoareList;
	
	}
	
}
