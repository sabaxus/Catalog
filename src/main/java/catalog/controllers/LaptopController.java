package catalog.controllers;

import java.security.Principal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
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

import catalog.jdbc.dao.LaptopDAO;
import catalog.jdbc.dao.LaptopListDAO;
import catalog.jdbc.pojo.Laptop;
import catalog.jdbc.pojo.LaptopLists;


@RequestMapping(value = "/laptops")
@Controller
public class LaptopController {
	
	private int contorBrand=0;
//	private int contorRezolutieEcran=0;
//	private int contorDimensiuneEcranInch=0;
//	private int contorTipProcesor=0;
//	private int contorFrecventaProcesorGHz=0;
//	private int contorCapacitateRAM=0;
//	private int contorCuloare=0;
	
	/**
	 * Method for displaying the list of laptops
	 * 
	 * @return
	 */
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public ModelAndView displayList(Model model, HttpServletRequest request) {
		//HashMap<String, Object> model = new HashMap<String, Object>();
		
		ArrayList<Laptop> laptopList;
		
		if (request.isUserInRole("SUPERUSER")){    
			try {
				laptopList = LaptopDAO.getSuperuserLaptops();
				model.addAttribute("laptopList", laptopList);
			} catch (SQLException e) {
				e.printStackTrace();
			}
        } else {
        	try {
    			laptopList = LaptopDAO.getUserLaptops();
    			model.addAttribute("laptopList", laptopList);
    		} catch (SQLException e) {
    			e.printStackTrace();
    		}
        }
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}

		return new ModelAndView("laptops/laptoplist", "model", model);
		
	}
	
	@RequestMapping(value = "/newlist.htm", method = RequestMethod.GET)
	public ModelAndView displayFilteredList(Model model, HttpServletRequest request) {
		//HashMap<String, Object> model = new HashMap<String, Object>();
		
		ArrayList<Laptop> laptopList;
		LaptopLists lists;
		
		if (request.isUserInRole("SUPERUSER")){    
			try {
				laptopList = LaptopDAO.getSuperuserLaptops();
				model.addAttribute("laptopList", laptopList);
				lists = new LaptopLists();
				model.addAttribute("lists", lists);
			} catch (NumberFormatException e) {
    			e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
			}
        } else {
        	try {
    			laptopList = LaptopDAO.getUserLaptops();
    			model.addAttribute("laptopList", laptopList);
				lists = new LaptopLists();
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
		
		return new ModelAndView("laptops/laptoplist", "model", model);
		
	}
	
	@RequestMapping(value = "/filteredlist.htm", method = RequestMethod.POST)
	public ModelAndView displayFilteredList(@ModelAttribute("lists") LaptopLists lists, Model model, BindingResult result, HttpServletRequest request) {
		
		
		ArrayList<Laptop> laptopList = new ArrayList<>();
		ArrayList<Laptop> resultLaptops1= new ArrayList<>();
		ArrayList<Laptop> resultLaptops2= new ArrayList<>();
		ArrayList<Laptop> resultLaptops3= new ArrayList<>();
		ArrayList<Laptop> resultLaptops4= new ArrayList<>();
		ArrayList<Laptop> resultLaptops5= new ArrayList<>();
		ArrayList<Laptop> resultLaptops6= new ArrayList<>();
		ArrayList<Laptop> resultLaptops= new ArrayList<>();
		
		if (request.isUserInRole("SUPERUSER")){    
			try {
				laptopList = LaptopDAO.getSuperuserLaptops();
				
				if(!(lists.getBrandList().isEmpty())) {
					for(String brand:lists.getBrandList()) {
						for(Laptop laptop:laptopList) {
							if(laptop.getBrand().equals(brand)) {
								resultLaptops1.add(laptop);
								contorBrand++;
							}
						}
					}
				} else {
					for(Laptop l:laptopList) {
						resultLaptops1.add(l);
					}
				}
				if(!(lists.getRezolutieEcranList().isEmpty())) {
					for(String rezolutieEcran:lists.getRezolutieEcranList()) {
						for(Laptop laptop:resultLaptops1) {
							if(laptop.getRezolutieEcran().equals(rezolutieEcran)) {
								resultLaptops2.add(laptop);
							}
						} 
					}
				} else {
					for(Laptop l:resultLaptops1) {
						resultLaptops2.add(l);
					}
				}
				if(!(lists.getDimensiuneEcranInchList().isEmpty())) {
					for(Double dimensiuneEcranInch:lists.getDimensiuneEcranInchList()) {
						for(Laptop laptop:resultLaptops2) {
							if(laptop.getDimensiuneEcranInch()==dimensiuneEcranInch) {
								resultLaptops3.add(laptop);
							}
						}
					}
				} else {
					for(Laptop l:resultLaptops2) {
						resultLaptops3.add(l);
					}
				}
				if(!(lists.getTipProcesorList().isEmpty())) {
					for(String tipProcesor:lists.getTipProcesorList()) {
						for(Laptop laptop:resultLaptops3) {
							if(laptop.getTipProcesor().equals(tipProcesor)) {
								resultLaptops4.add(laptop);
							}
						}
					}
				} else {
					for(Laptop l:resultLaptops3) {
						resultLaptops4.add(l);
					}
				}
				if(!(lists.getFrecventaProcesorGHzList().isEmpty())) {
					for(Double frecventaProcesorGHz:lists.getFrecventaProcesorGHzList()) {
						for(Laptop laptop:resultLaptops4) {
							if(laptop.getFrecventaProcesorGHz()==frecventaProcesorGHz) {
								resultLaptops5.add(laptop);
							} 
						}
					}
				} else {
					for(Laptop l:resultLaptops4) {
						resultLaptops5.add(l);
					}
				}
				if(!(lists.getCapacitateRAMList().isEmpty())) {
					for(Integer capacitateRAM:lists.getCapacitateRAMList()) {
						for(Laptop laptop:resultLaptops5) {
							if(laptop.getCapacitateRAM()==capacitateRAM) {
								resultLaptops6.add(laptop);
							}
						}
					}
				} else {
					for(Laptop l:resultLaptops5) {
						resultLaptops6.add(l);
					}
				}
				if(!(lists.getCuloareList().isEmpty())) {
					for(String culoare:lists.getCuloareList()) {
						for(Laptop laptop:resultLaptops6) {
							if(laptop.getCuloare().equals(culoare)) {
								resultLaptops.add(laptop);
							}
						}	
					}
				} else {
					for(Laptop l:resultLaptops6) {
						resultLaptops.add(l);
					}
				}
				
				model.addAttribute("laptopList", resultLaptops);
								
				model.addAttribute("contorBrand", contorBrand);
//				model.addAttribute("contorRezolutieEcran", contorRezolutieEcran);
//				model.addAttribute("contorDimensiuneEcranInch", contorDimensiuneEcranInch);
//				model.addAttribute("contorTipProcesor", contorTipProcesor);
//				model.addAttribute("contorFrecventaProcesorGHz", contorFrecventaProcesorGHz);
//				model.addAttribute("contorCapacitateRAM", contorCapacitateRAM);
//				model.addAttribute("contorCuloare", contorCuloare);
				
				
			} catch (NumberFormatException e) {
    			e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
			}
        } else {
        	try {
        		laptopList = LaptopDAO.getUserLaptops();
				
        		if(!(lists.getBrandList().isEmpty())) {
					for(String brand:lists.getBrandList()) {
						for(Laptop laptop:laptopList) {
							if(laptop.getBrand().equals(brand)) {
								resultLaptops1.add(laptop);
								contorBrand++;
							}
						}
					}
				} else {
					for(Laptop l:laptopList) {
						resultLaptops1.add(l);
					}
				}
				if(!(lists.getRezolutieEcranList().isEmpty())) {
					for(String rezolutieEcran:lists.getRezolutieEcranList()) {
						for(Laptop laptop:resultLaptops1) {
							if(laptop.getRezolutieEcran().equals(rezolutieEcran)) {
								resultLaptops2.add(laptop);
							}
						} 
					}
				} else {
					for(Laptop l:resultLaptops1) {
						resultLaptops2.add(l);
					}
				}
				if(!(lists.getDimensiuneEcranInchList().isEmpty())) {
					for(Double dimensiuneEcranInch:lists.getDimensiuneEcranInchList()) {
						for(Laptop laptop:resultLaptops2) {
							if(laptop.getDimensiuneEcranInch()==dimensiuneEcranInch) {
								resultLaptops3.add(laptop);
							}
						}
					}
				} else {
					for(Laptop l:resultLaptops2) {
						resultLaptops3.add(l);
					}
				}
				if(!(lists.getTipProcesorList().isEmpty())) {
					for(String tipProcesor:lists.getTipProcesorList()) {
						for(Laptop laptop:resultLaptops3) {
							if(laptop.getTipProcesor().equals(tipProcesor)) {
								resultLaptops4.add(laptop);
							}
						}
					}
				} else {
					for(Laptop l:resultLaptops3) {
						resultLaptops4.add(l);
					}
				}
				if(!(lists.getFrecventaProcesorGHzList().isEmpty())) {
					for(Double frecventaProcesorGHz:lists.getFrecventaProcesorGHzList()) {
						for(Laptop laptop:resultLaptops4) {
							if(laptop.getFrecventaProcesorGHz()==frecventaProcesorGHz) {
								resultLaptops5.add(laptop);
							} 
						}
					}
				} else {
					for(Laptop l:resultLaptops4) {
						resultLaptops5.add(l);
					}
				}
				if(!(lists.getCapacitateRAMList().isEmpty())) {
					for(Integer capacitateRAM:lists.getCapacitateRAMList()) {
						for(Laptop laptop:resultLaptops5) {
							if(laptop.getCapacitateRAM()==capacitateRAM) {
								resultLaptops6.add(laptop);
							}
						}
					}
				} else {
					for(Laptop l:resultLaptops5) {
						resultLaptops6.add(l);
					}
				}
				if(!(lists.getCuloareList().isEmpty())) {
					for(String culoare:lists.getCuloareList()) {
						for(Laptop laptop:resultLaptops6) {
							if(laptop.getCuloare().equals(culoare)) {
								resultLaptops.add(laptop);
							}
						}	
					}
				} else {
					for(Laptop l:resultLaptops6) {
						resultLaptops.add(l);
					}
				}
				
				model.addAttribute("laptopList", resultLaptops);
								
				model.addAttribute("contorBrand", contorBrand);
//				model.addAttribute("contorRezolutieEcran", contorRezolutieEcran);
//				model.addAttribute("contorDimensiuneEcranInch", contorDimensiuneEcranInch);
//				model.addAttribute("contorTipProcesor", contorTipProcesor);
//				model.addAttribute("contorFrecventaProcesorGHz", contorFrecventaProcesorGHz);
//				model.addAttribute("contorCapacitateRAM", contorCapacitateRAM);
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
        
		return new ModelAndView("/laptops/laptopfilteredlist", "model", model);
		
	}

	/**
	 * Method for displaying details of a laptop (non-editable details)
	 * 
	 * @param laptopId
	 * @return
	 */

	@RequestMapping(value = "/laptop.htm", method = RequestMethod.GET)
	public ModelAndView displayLaptop(@RequestParam("laptopId") String laptopId, Model model, HttpServletRequest request) {
		//HashMap<String, Object> model = new HashMap<String, Object>();

		Laptop laptop;
		try {
			laptop = LaptopDAO.getLaptop(Integer.valueOf(laptopId));
			model.addAttribute("laptop", laptop);
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}
		
		return new ModelAndView("/laptops/laptop", "model", model);
	}

	/**
	 * Method for displaying the details of a laptop for editing (filling the form
	 * fields with laptop data)
	 * 
	 * @param laptopId
	 * @param model
	 * @return
	 */
	
	@RequestMapping(value = "/edit.htm", method = RequestMethod.GET)
	public ModelAndView editLaptopView(@RequestParam("laptopId") String laptopId, Model model, HttpServletRequest request) {

		Laptop laptop;
		try {
			laptop = LaptopDAO.getLaptop(Integer.valueOf(laptopId));
			model.addAttribute("laptopForm", laptop);
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}
		
		return new ModelAndView("/laptops/laptopedit", "model", model);
	}
	
	/**
	 * Method used for retrieving the details of a laptop after "save" is pressed
	 * in edit mode
	 * 
	 * @param laptop
	 * @param model
	 * @param result
	 * @return
	 */

	@RequestMapping(value = "/save.htm", method = RequestMethod.POST)
	public ModelAndView saveLaptop(@ModelAttribute("laptopForm") Laptop laptop,	Model model, BindingResult result, HttpServletRequest request) {

		Laptop laptopObj;
		try {
			laptopObj = LaptopDAO.getLaptop(Integer.valueOf(laptop.getId()));
			
			if (laptop.getNume()==null) {
				laptopObj.setNume("");
			} else laptopObj.setNume(laptop.getNume());
			
			if (laptop.getSpecificatii()==null) {
				laptopObj.setSpecificatii("");
			} else laptopObj.setSpecificatii(laptop.getSpecificatii());
			
			laptopObj.setCantitate(Integer.valueOf(laptop.getCantitate()));
			laptopObj.setPret(Double.valueOf(laptop.getPret()));
			
			if (laptop.getInStoc()==null) {
				laptopObj.setInStoc("");
			} else laptopObj.setInStoc(laptop.getInStoc());
			
			if (laptop.getTipEcran()==null) {
				laptopObj.setTipEcran("");
			} else laptopObj.setTipEcran(laptop.getTipEcran());
			
			if (laptop.getRezolutieEcran()==null) {
				laptopObj.setRezolutieEcran("");
			} else laptopObj.setRezolutieEcran(laptop.getRezolutieEcran());
			
			laptopObj.setDimensiuneEcranInch(Double.valueOf(laptop.getDimensiuneEcranInch()));
			
			if (laptop.getFormatImagine()==null) {
				laptopObj.setFormatImagine("");
			} else laptopObj.setFormatImagine(laptop.getFormatImagine());
			
			if (laptop.getAlteCaracteristiciDisplay()==null) {
				laptopObj.setAlteCaracteristiciDisplay("");
			} else laptopObj.setAlteCaracteristiciDisplay(laptop.getAlteCaracteristiciDisplay());
			
			if (laptop.getTipProcesor()==null) {
				laptopObj.setTipProcesor("");
			} else laptopObj.setTipProcesor(laptop.getTipProcesor());
			
			if (laptop.getProducatorProcesor()==null) {
				laptopObj.setProducatorProcesor("");
			} else laptopObj.setProducatorProcesor(laptop.getProducatorProcesor());
			
			if (laptop.getModelProcesor()==null) {
				laptopObj.setModelProcesor("");
			} else laptopObj.setModelProcesor(laptop.getModelProcesor());
			
			laptopObj.setNumarNucleeProcesor(Integer.valueOf(laptop.getNumarNucleeProcesor()));
			laptopObj.setFrecventaProcesorGHz(Double.valueOf(laptop.getFrecventaProcesorGHz()));
			laptopObj.setFrecventaMaximaProcesorGHz(Double.valueOf(laptop.getFrecventaMaximaProcesorGHz()));
			laptopObj.setCacheProcesorMB(Integer.valueOf(laptop.getCacheProcesorMB()));
			
			if (laptop.getTehnologieProcesor()==null) {
				laptopObj.setTehnologieProcesor("");
			} else laptopObj.setTehnologieProcesor(laptop.getTehnologieProcesor());
			
			if (laptop.getProcesorGraficIntegrat()==null) {
				laptopObj.setProcesorGraficIntegrat("");
			} else laptopObj.setProcesorGraficIntegrat(laptop.getProcesorGraficIntegrat());
			
			laptopObj.setCapacitateRAM(Integer.valueOf(laptop.getCapacitateRAM()));
			
			if (laptop.getTipMemorieRAM()==null) {
				laptopObj.setTipMemorieRAM("");
			} else laptopObj.setTipMemorieRAM(laptop.getTipMemorieRAM());
			
			laptopObj.setFrecventaRAMMHz(Integer.valueOf(laptop.getFrecventaRAMMHz()));
			laptopObj.setMemorieMaximaRAM(Integer.valueOf(laptop.getMemorieMaximaRAM()));
			laptopObj.setSloturiDeMemorie(Integer.valueOf(laptop.getSloturiDeMemorie()));
			
			if (laptop.getSlotMemorie1()==null) {
				laptopObj.setSlotMemorie1("");
			} else laptopObj.setSlotMemorie1(laptop.getSlotMemorie1());
			
			if (laptop.getSlotMemorie2()==null) {
				laptopObj.setSlotMemorie2("");
			} else laptopObj.setSlotMemorie2(laptop.getSlotMemorie2());
			
			if (laptop.getSlotMemorie3()==null) {
				laptopObj.setSlotMemorie3("");
			} else laptopObj.setSlotMemorie3(laptop.getSlotMemorie3());
			
			if (laptop.getSlotMemorie4()==null) {
				laptopObj.setSlotMemorie4("");
			} else laptopObj.setSlotMemorie4(laptop.getSlotMemorie4());
			
			if (laptop.getTipUnitateStocare()==null) {
				laptopObj.setTipUnitateStocare("");
			} else laptopObj.setTipUnitateStocare(laptop.getTipUnitateStocare());
			
			if (laptop.getCapacitateStocare()==null) {
				laptopObj.setCapacitateStocare("");
			} else laptopObj.setCapacitateStocare(laptop.getCapacitateStocare());
			
			if (laptop.getInterfataUnitateStocare()==null) {
				laptopObj.setInterfataUnitateStocare("");
			} else laptopObj.setInterfataUnitateStocare(laptop.getInterfataUnitateStocare());
			
			laptopObj.setVitezaDeRotatieUnitateStocareRPM(Integer.valueOf(laptop.getVitezaDeRotatieUnitateStocareRPM()));
			
			if (laptop.getProcesorPlacaVideo()==null) {
				laptopObj.setProcesorPlacaVideo("");
			} else laptopObj.setProcesorPlacaVideo(laptop.getProcesorPlacaVideo());
			
			if (laptop.getTipPlacaVideo()==null) {
				laptopObj.setTipPlacaVideo("");
			} else laptopObj.setTipPlacaVideo(laptop.getTipPlacaVideo());
			
			laptopObj.setCapacitateMemoriePlacaVideoMB(Integer.valueOf(laptop.getCapacitateMemoriePlacaVideoMB()));
			
			if (laptop.getTipMemoriePlacaVideo()==null) {
				laptopObj.setTipMemoriePlacaVideo("");
			} else laptopObj.setTipMemoriePlacaVideo(laptop.getTipMemoriePlacaVideo());
			
			if (laptop.getDifuzoare()==null) {
				laptopObj.setDifuzoare("");
			} else laptopObj.setDifuzoare(laptop.getDifuzoare());
			
			if (laptop.getTehnologieAudio()==null) {
				laptopObj.setTehnologieAudio("");
			} else laptopObj.setTehnologieAudio(laptop.getTehnologieAudio());
			
			if (laptop.getSubwoofer()==null) {
				laptopObj.setSubwoofer("");
			} else laptopObj.setSubwoofer(laptop.getSubwoofer());
			
			if (laptop.getMicrofon()==null) {
				laptopObj.setMicrofon("");
			} else laptopObj.setMicrofon(laptop.getMicrofon());
			
			if (laptop.getTipUnitateOptica()==null) {
				laptopObj.setTipUnitateOptica("");
			} else laptopObj.setTipUnitateOptica(laptop.getTipUnitateOptica());
			
			if (laptop.getWebcam()==null) {
				laptopObj.setWebcam("");
			} else laptopObj.setWebcam(laptop.getWebcam());
			
			if (laptop.getEthernet()==null) {
				laptopObj.setEthernet("");
			} else laptopObj.setEthernet(laptop.getEthernet());
			
			if (laptop.getWiFi()==null) {
				laptopObj.setWiFi("");
			} else laptopObj.setWiFi(laptop.getWiFi());
			
			if (laptop.getBluetooth()==null) {
				laptopObj.setBluetooth("");
			} else laptopObj.setBluetooth(laptop.getBluetooth());
			
			laptopObj.setUsb31(Integer.valueOf(laptop.getUsb31()));
			laptopObj.setUsb30(Integer.valueOf(laptop.getUsb30()));
			laptopObj.setUsb20(Integer.valueOf(laptop.getUsb20()));
			
			if (laptop.getThunderbolt()==null) {
				laptopObj.setThunderbolt("");
			} else laptopObj.setThunderbolt(laptop.getThunderbolt());
			
			laptopObj.setRj45(Integer.valueOf(laptop.getRj45()));
			laptopObj.setHdmi(Integer.valueOf(laptop.getHdmi()));
			laptopObj.setDisplayPort(Integer.valueOf(laptop.getDisplayPort()));
			laptopObj.setMiniDisplayPort(Integer.valueOf(laptop.getMiniDisplayPort()));
			
			if (laptop.getIesireAudio()==null) {
				laptopObj.setIesireAudio("");
			} else laptopObj.setIesireAudio(laptop.getIesireAudio());
			
			if (laptop.getIntrareMicrofon()==null) {
				laptopObj.setIntrareMicrofon("");
			} else laptopObj.setIntrareMicrofon(laptop.getIntrareMicrofon());
			
			if (laptop.getCititorDeCarduri()==null) {
				laptopObj.setCititorDeCarduri("");
			} else laptopObj.setCititorDeCarduri(laptop.getCititorDeCarduri());
			
			if (laptop.getAltele()==null) {
				laptopObj.setAltele("");
			} else laptopObj.setAltele(laptop.getAltele());
			
			if (laptop.getMagSafe2()==null) {
				laptopObj.setMagSafe2("");
			} else laptopObj.setMagSafe2(laptop.getMagSafe2());
			
			if (laptop.getBaterie()==null) {
				laptopObj.setBaterie("");
			} else laptopObj.setBaterie(laptop.getBaterie());
			
			laptopObj.setCapacitateBateriemAh(Integer.valueOf(laptop.getCapacitateBateriemAh()));
			
			if (laptop.getNumarCeluleBaterie()==null) {
				laptopObj.setNumarCeluleBaterie("");
			} else laptopObj.setNumarCeluleBaterie(laptop.getNumarCeluleBaterie());
			
			if (laptop.getAutonomieBaterie()==null) {
				laptopObj.setAutonomieBaterie("");
			} else laptopObj.setAutonomieBaterie(laptop.getAutonomieBaterie());			
			
			if (laptop.getSistemDeOperare()==null) {
				laptopObj.setSistemDeOperare("");
			} else laptopObj.setSistemDeOperare(laptop.getSistemDeOperare());
			
			laptopObj.setBitiSistemOperare(Integer.valueOf(laptop.getBitiSistemOperare()));
			
			if (laptop.getAlteSoftware()==null) {
				laptopObj.setAlteSoftware("");
			} else laptopObj.setAlteSoftware(laptop.getAlteSoftware());
			
			if (laptop.getTastaturaIluminata()==null) {
				laptopObj.setTastaturaIluminata("");
			} else laptopObj.setTastaturaIluminata(laptop.getTastaturaIluminata());
			
			if (laptop.getTastaturaNumerica()==null) {
				laptopObj.setTastaturaNumerica("");
			} else laptopObj.setTastaturaNumerica(laptop.getTastaturaNumerica());
			
			if (laptop.getLayoutTastatura()==null) {
				laptopObj.setLayoutTastatura("");
			} else laptopObj.setLayoutTastatura(laptop.getLayoutTastatura());
			
			if (laptop.getFacilitati()==null) {
				laptopObj.setFacilitati("");
			} else laptopObj.setFacilitati(laptop.getFacilitati());
					
			if (laptop.getSecuritate()==null) {
				laptopObj.setSecuritate("");
			} else laptopObj.setSecuritate(laptop.getSecuritate());
			
			if (laptop.getAccesoriiIncluse()==null) {
				laptopObj.setAccesoriiIncluse("");
			} else laptopObj.setAccesoriiIncluse(laptop.getAccesoriiIncluse());
			
			if (laptop.getCarcasa()==null) {
				laptopObj.setCarcasa("");
			} else laptopObj.setCarcasa(laptop.getCarcasa());
			
			if (laptop.getGarantieDeConformitate()==null) {
				laptopObj.setGarantieDeConformitate("");
			} else laptopObj.setGarantieDeConformitate(laptop.getGarantieDeConformitate());
			
			if (laptop.getGarantieComerciala()==null) {
				laptopObj.setGarantieComerciala("");
			} else laptopObj.setGarantieComerciala(laptop.getGarantieComerciala());
			
			if (laptop.getDimensiuniLxAxIcm()==null) {
				laptopObj.setDimensiuniLxAxIcm("");
			} else laptopObj.setDimensiuniLxAxIcm(laptop.getDimensiuniLxAxIcm());
			
			if (laptop.getCuloare()==null) {
				laptopObj.setCuloare("");
			} else laptopObj.setCuloare(laptop.getCuloare());
			
			laptopObj.setGreutateKg(Double.valueOf(laptop.getGreutateKg()));
			
			if (laptop.getBrand()==null) {
				laptopObj.setBrand("");
			} else laptopObj.setBrand(laptop.getBrand());
			
			LaptopDAO.updateLaptop(laptopObj);
			model.addAttribute("laptopForm", laptop);
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}

		return new ModelAndView("/laptops/laptopedit", "command", laptop);
	}
	/**
	 * Method for displaying and empty form for creating a laptop (filling the form
	 * fields with laptop data)
	 * 
	 * 
	 * @param model
	 * @return
	 */

	@RequestMapping(value = "/new.htm", method = RequestMethod.GET)
	public ModelAndView createLaptopView(Model model, HttpServletRequest request) {

		Laptop newlaptop;
		try {
			newlaptop = new Laptop();
			model.addAttribute("newlaptopForm", newlaptop);
		} catch (NumberFormatException e) {
			e.printStackTrace();
		}
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}
		
		return new ModelAndView("/laptops/createlaptop", "model" , model);
	}
	
	/**
	 * Method used for retrieving the details of a newly created laptop after "save" is pressed
	 * in edit mode
	 * 
	 * @param laptop
	 * @param model
	 * @param result
	 * @return
	 */
	
	@RequestMapping(value = "/savenew.htm", method = RequestMethod.POST)
	public ModelAndView createLaptop(@ModelAttribute("newlaptopForm") Laptop newlaptop, Model model, BindingResult result, HttpServletRequest request) {
		
		//Laptop laptopObj;
		try {
			
			LaptopDAO.createLaptop(newlaptop);
			model.addAttribute("newlaptopForm", newlaptop);
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}
		
		return new ModelAndView("/laptops/createlaptop", "command", newlaptop);
		
	}
	
	/**
	 * Method for deleting a laptop
	 * 
	 * @param laptopId
	 * @param model
	 * @return
	 */
	
	@RequestMapping(value = "/sterge/{laptopId}")
	public ModelAndView stergeLaptop(@PathVariable String laptopId, Model model, HttpServletRequest request) {

		ArrayList<Laptop> laptopList;
		LaptopLists lists;
		
		try {
			LaptopDAO.deleteLaptop(Integer.valueOf(laptopId));
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}	
			
		if (request.isUserInRole("SUPERUSER")){    
			try {
				laptopList = LaptopDAO.getSuperuserLaptops();
				model.addAttribute("laptopList", laptopList);
				lists = new LaptopLists();
				model.addAttribute("lists", lists);
			} catch (SQLException e) {
				e.printStackTrace();
			}
        } else {
        	try {
    			laptopList = LaptopDAO.getUserLaptops();
    			model.addAttribute("laptopList", laptopList);
    			lists = new LaptopLists();
				model.addAttribute("lists", lists);
    		} catch (SQLException e) {
    			e.printStackTrace();
    		}
        }
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}

		return new ModelAndView("/laptops/laptoplist", "model", model);
	}
	
	@RequestMapping(value = "/charts", method = RequestMethod.GET)
	public ModelAndView displayCharts(Model model, HttpServletRequest request) {
		
		HashMap<String, Double> brandMap = new HashMap<>();
		try {
			brandMap = LaptopListDAO.getLaptopsNumbersByBrand();
			model.addAttribute("brandMap", brandMap);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		HashMap<String, Double> resScreenMap = new HashMap<>();
		try {
			resScreenMap = LaptopListDAO.getLaptopsNumbersByRezolutieEcran();
			model.addAttribute("resScreenMap", resScreenMap);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		HashMap<Double, Double> dimEcranMap = new HashMap<>();
		try {
			dimEcranMap = LaptopListDAO.getLaptopsNumbersByDimensiuneEcran();
			model.addAttribute("dimEcranMap", dimEcranMap);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		HashMap<String, Double> tipProcesorMap = new HashMap<>();
		try {
			tipProcesorMap = LaptopListDAO.getLaptopsNumbersByTipProcesor();
			model.addAttribute("tipProcesorMap", tipProcesorMap);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		HashMap<Double, Double> frecventaProcesorMap = new HashMap<>();
		try {
			frecventaProcesorMap = LaptopListDAO.getLaptopsNumbersByFrecventaProcesor();
			model.addAttribute("frecventaProcesorMap", frecventaProcesorMap);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		HashMap<Integer, Double> capacitateRAMMap = new HashMap<>();
		try {
			capacitateRAMMap = LaptopListDAO.getLaptopsNumbersByCapacitateRAM();
			model.addAttribute("capacitateRAMMap", capacitateRAMMap);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		HashMap<String, Double> culoareMap = new HashMap<>();
		try {
			culoareMap = LaptopListDAO.getLaptopsNumbersByCuloare();
			model.addAttribute("culoareMap", culoareMap);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if(!(request.getRemoteUser()==null)) {
			String username=request.getRemoteUser();
	        model.addAttribute("userName", username);
		}
		
		return new ModelAndView("/laptops/laptopscharts", "model", model);
		
	}
	/*
	private String getPrincipal(){
        String userName = null;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
 
        if (principal instanceof UserDetails) {
            userName = ((UserDetails)principal).getUsername();
        } else {
            userName = principal.toString();
        }
        return userName;
    }
	*/
	@ModelAttribute("brandList")
	public ArrayList<String> initializeBrandList() {

		ArrayList<String> brandList = new ArrayList<String>();
		brandList.add("ACER");
		brandList.add("ASUS");
		brandList.add("ALIENWARE");
		brandList.add("APPLE");
		brandList.add("DELL");
		brandList.add("LENOVO");
		return brandList;
	
	}
	
	@ModelAttribute("rezolutieEcranList")
	public ArrayList<String> initializeRezolutieEcranList() {

		ArrayList<String> rezolutieEcranList = new ArrayList<String>();
		rezolutieEcranList.add("1920 x 1080");
		rezolutieEcranList.add("4096 x 2160");
		rezolutieEcranList.add("3840 x 2160");
		rezolutieEcranList.add("2880 x 1800");
		rezolutieEcranList.add("3200 x 1800");
		rezolutieEcranList.add("2304 x 1440");
		return rezolutieEcranList;
	
	}
	
	@ModelAttribute("dimensiuneEcranInchList")
	public ArrayList<Double> initializeDimensiuneEcranInchList() {

		ArrayList<Double> dimensiuneEcranInchList = new ArrayList<Double>();
		dimensiuneEcranInchList.add(12.0);
		dimensiuneEcranInchList.add(13.3);
		dimensiuneEcranInchList.add(15.4);
		dimensiuneEcranInchList.add(15.6);
		dimensiuneEcranInchList.add(17.3);
		return dimensiuneEcranInchList;
	
	}
	
	@ModelAttribute("tipProcesorList")
	public ArrayList<String> initializeTipProcesorList() {

		ArrayList<String> tipProcesorList = new ArrayList<String>();
		tipProcesorList.add("Intel® Core m");
		tipProcesorList.add("Intel® Core i5");
		tipProcesorList.add("Intel® Core i7");
		return tipProcesorList;
	
	}
	
	@ModelAttribute("frecventaProcesorGHzList")
	public ArrayList<Double> initializeFrecventaProcesorGHzList() {

		ArrayList<Double> frecventaProcesorGHzList = new ArrayList<Double>();
		frecventaProcesorGHzList.add(1.2);
		frecventaProcesorGHzList.add(2.3);
		frecventaProcesorGHzList.add(2.5);
		frecventaProcesorGHzList.add(2.6);
		frecventaProcesorGHzList.add(2.7);
		return frecventaProcesorGHzList;
	
	}
	
	@ModelAttribute("capacitateRAMList")
	public ArrayList<Integer> initializeCapacitateRAMList() {

		ArrayList<Integer> capacitateRAMList = new ArrayList<Integer>();
		capacitateRAMList.add(8);
		capacitateRAMList.add(16);
		capacitateRAMList.add(32);
		capacitateRAMList.add(64);
		return capacitateRAMList;
	
	}
	
	@ModelAttribute("culoareList")
	public ArrayList<String> initializeCuloareList() {

		ArrayList<String> culoareList = new ArrayList<String>();
		culoareList.add("Argintiu");
		culoareList.add("Gri");
		culoareList.add("Space Gray");
		culoareList.add(" Negru");
		return culoareList;
	
	}
	
}
