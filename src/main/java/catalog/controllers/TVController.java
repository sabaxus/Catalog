package catalog.controllers;

import java.security.Principal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

import catalog.jdbc.dao.PhoneListDAO;
import catalog.jdbc.dao.TVDAO;
import catalog.jdbc.dao.TvListDAO;
import catalog.jdbc.pojo.Laptop;
import catalog.jdbc.pojo.TV;
import catalog.jdbc.pojo.TvLists;

@RequestMapping(value = "/tvs")
@Controller
public class TVController {
	
//	private int contorBrand=0;
//	private int contorTip=0;
//  private int contorTipEcran=0;
//	private int contorDimensiuneEcranInch=0;
//	private int contorSistemDeOperare=0;
	
		/**
		 * Method for displaying the list of tvs
		 * 
		 * @return
		 */
		@RequestMapping(value = "", method = RequestMethod.GET)
		public ModelAndView displayList(Model model, HttpServletRequest request) {
			//HashMap<String, Object> model = new HashMap<String, Object>();

			ArrayList<TV> tvList;
			
			if (request.isUserInRole("SUPERUSER")){    
				try {
					tvList = TVDAO.getSuperuserTVs();
					model.addAttribute("tvList", tvList);
				} catch (SQLException e) {
					e.printStackTrace();
				}
	        } else {
	        	try {
	        		tvList = TVDAO.getUserTVs();
					model.addAttribute("tvList", tvList);
	    		} catch (SQLException e) {
	    			e.printStackTrace();
	    		}
	        }
			
			if(!(request.getRemoteUser()==null)) {
				String username=request.getRemoteUser();
		        model.addAttribute("userName", username);
			}
			
			return new ModelAndView("tvs/tvlist", "model", model);
			
		}
		
		@RequestMapping(value = "/newlist.htm", method = RequestMethod.GET)
		public ModelAndView displayFilteredList(Model model, HttpServletRequest request) {
			//HashMap<String, Object> model = new HashMap<String, Object>();
			
			ArrayList<TV> tvList;
			TvLists lists;
			
			if (request.isUserInRole("SUPERUSER")){    
				try {
					tvList = TVDAO.getSuperuserTVs();
					model.addAttribute("tvList", tvList);
					lists = new TvLists();
					model.addAttribute("lists", lists);
				} catch (NumberFormatException e) {
	    			e.printStackTrace();
				} catch (SQLException e) {
					e.printStackTrace();
				}
	        } else {
	        	try {
	    			tvList = TVDAO.getUserTVs();
	    			model.addAttribute("tvList", tvList);
					lists = new TvLists();
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

			return new ModelAndView("tvs/tvlist", "model", model);
			
		}
		
		@RequestMapping(value = "/filteredlist.htm", method = RequestMethod.POST)
		public ModelAndView displayFilteredList(@ModelAttribute("lists") TvLists lists, Model model, BindingResult result, HttpServletRequest request) {
			
			
			ArrayList<TV> tvList = new ArrayList<>();
			ArrayList<TV> resultTvs1= new ArrayList<>();
			ArrayList<TV> resultTvs2= new ArrayList<>();
			ArrayList<TV> resultTvs3= new ArrayList<>();
			ArrayList<TV> resultTvs4= new ArrayList<>();
			ArrayList<TV> resultTvs= new ArrayList<>();
			
			if (request.isUserInRole("SUPERUSER")){    
				try {
					tvList = TVDAO.getSuperuserTVs();
					
					if(!(lists.getBrandList().isEmpty())) {
						for(String brand:lists.getBrandList()) {
							for(TV tv:tvList) {
								if(tv.getBrand().equals(brand)) {
									resultTvs1.add(tv);
								}
							}
						}
					} else {
						for(TV t:tvList) {
							resultTvs1.add(t);
						}
					}
					if(!(lists.getTipList().isEmpty())) {
						for(String tip:lists.getTipList()) {
							for(TV tv:resultTvs1) {
								if(tv.getTip().equals(tip)) {
									resultTvs2.add(tv);
								}
							}
						}
					} else {
						for(TV t:resultTvs1) {
							resultTvs2.add(t);
						}
					}
					if(!(lists.getTipEcranList().isEmpty())) {
						for(String tipEcran:lists.getTipEcranList()) {
							for(TV tv:resultTvs2) {
								if(tv.getTipEcran()==tipEcran) {
									resultTvs3.add(tv);
								}
							}
						}
					} else {
						for(TV t:resultTvs2) {
							resultTvs3.add(t);
						}
					}
					if(!(lists.getDimensiuneEcranInchList().isEmpty())) {
						for(Integer dimensiuneEcranInch:lists.getDimensiuneEcranInchList()) {
							for(TV tv:resultTvs3) {
								if(tv.getDimensiuneEcranInch()==dimensiuneEcranInch) {
									resultTvs4.add(tv);
								}
							}
						}
					} else {
						for(TV t:resultTvs3) {
							resultTvs4.add(t);
						}
					}
					if(!(lists.getSistemDeOperareList().isEmpty())) {
						for(String sistemDeOperare:lists.getSistemDeOperareList()) {
							for(TV tv:resultTvs4) {
								if(tv.getSistemDeOperare().equals(sistemDeOperare)) {
									resultTvs.add(tv);
								}
							}
						}
					} else {
						for(TV t:resultTvs4) {
							resultTvs.add(t);
						}
					}
					
					model.addAttribute("tvList", resultTvs);
					
//					model.addAttribute("contorBrand", contorBrand);
//					model.addAttribute("contorTip", contorTip);
//					model.addAttribute("contorTipEcran", contorTipEcran);
//					model.addAttribute("contorDimensiuneEcranInch", contorDimensiuneEcranInch);
//					model.addAttribute("contorSistemDeOperare", contorSistemDeOperare);					
					
					
				} catch (NumberFormatException e) {
	    			e.printStackTrace();
				} catch (SQLException e) {
					e.printStackTrace();
				}
	        } else {
	        	try {
	        		tvList = TVDAO.getUserTVs();
					
	        		if(!(lists.getBrandList().isEmpty())) {
						for(String brand:lists.getBrandList()) {
							for(TV tv:tvList) {
								if(tv.getBrand().equals(brand)) {
									resultTvs1.add(tv);
								}
							}
						}
					} else {
						for(TV t:tvList) {
							resultTvs1.add(t);
						}
					}
					if(!(lists.getTipList().isEmpty())) {
						for(String tip:lists.getTipList()) {
							for(TV tv:resultTvs1) {
								if(tv.getTip().equals(tip)) {
									resultTvs2.add(tv);
								}
							}
						}
					} else {
						for(TV t:resultTvs1) {
							resultTvs2.add(t);
						}
					}
					if(!(lists.getTipEcranList().isEmpty())) {
						for(String tipEcran:lists.getTipEcranList()) {
							for(TV tv:resultTvs2) {
								if(tv.getTipEcran()==tipEcran) {
									resultTvs3.add(tv);
								}
							}
						}
					} else {
						for(TV t:resultTvs2) {
							resultTvs3.add(t);
						}
					}
					if(!(lists.getDimensiuneEcranInchList().isEmpty())) {
						for(Integer dimensiuneEcranInch:lists.getDimensiuneEcranInchList()) {
							for(TV tv:resultTvs3) {
								if(tv.getDimensiuneEcranInch()==dimensiuneEcranInch) {
									resultTvs4.add(tv);
								}
							}
						}
					} else {
						for(TV t:resultTvs3) {
							resultTvs4.add(t);
						}
					}
					if(!(lists.getSistemDeOperareList().isEmpty())) {
						for(String sistemDeOperare:lists.getSistemDeOperareList()) {
							for(TV tv:resultTvs4) {
								if(tv.getSistemDeOperare().equals(sistemDeOperare)) {
									resultTvs.add(tv);
								}
							}
						}
					} else {
						for(TV t:resultTvs4) {
							resultTvs.add(t);
						}
					}
					
					model.addAttribute("tvList", resultTvs);
					
//					model.addAttribute("contorBrand", contorBrand);
//					model.addAttribute("contorTip", contorTip);
//					model.addAttribute("contorTipEcran", contorTipEcran);
//					model.addAttribute("contorDimensiuneEcranInch", contorDimensiuneEcranInch);
//					model.addAttribute("contorSistemDeOperare", contorSistemDeOperare);					
					
					
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
	        
			return new ModelAndView("/tvs/tvfilteredlist", "model", model);
			
		}

		/**
		 * Method for displaying details of a tv (non-editable details)
		 * 
		 * @param tvId
		 * @return
		 */

		@RequestMapping(value = "/tv.htm", method = RequestMethod.GET)
		public ModelAndView displayTV(@RequestParam("tvId") String tvId, Model model, HttpServletRequest request) {
			//HashMap<String, Object> model = new HashMap<String, Object>();

			TV tv;
			try {
				tv = TVDAO.getTV(Integer.valueOf(tvId));
				model.addAttribute("tv", tv);
			} catch (NumberFormatException e) {
				e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			if(!(request.getRemoteUser()==null)) {
				String username=request.getRemoteUser();
		        model.addAttribute("userName", username);
			}
			
			return new ModelAndView("/tvs/tv", "model", model);
		}

		/**
		 * Method for displaying the details of a tv for editing (filling the form
		 * fields with tv data)
		 * 
		 * @param tvId
		 * @param model
		 * @return
		 */

		@RequestMapping(value = "/edit.htm", method = RequestMethod.GET)
		public ModelAndView editTVView(@RequestParam("tvId") String tvId, Model model, HttpServletRequest request) {

			TV tv;
			try {
				tv = TVDAO.getTV(Integer.valueOf(tvId));
				model.addAttribute("tvForm", tv);
			} catch (NumberFormatException e) {
				e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			if(!(request.getRemoteUser()==null)) {
				String username=request.getRemoteUser();
		        model.addAttribute("userName", username);
			}
			
			return new ModelAndView("/tvs/tvedit", "model", model);
		}
		
		/**
		 * Method used for retrieving the details of a tv after "save" is pressed
		 * in edit mode
		 * 
		 * @param tv
		 * @param model
		 * @param result
		 * @return
		 */

		@RequestMapping(value = "/save.htm", method = RequestMethod.POST)
		public ModelAndView saveTV(@ModelAttribute("tvForm") TV tv,	Model model, BindingResult result, HttpServletRequest request) {

			TV tvObj;
			try {
				tvObj = TVDAO.getTV(Integer.valueOf(tv.getId()));
				
				if (tv.getNume()==null) {
					tvObj.setNume("");
				} else tvObj.setNume(tv.getNume());
				
				if (tv.getSpecificatii()==null) {
					tvObj.setSpecificatii("");
				} else tvObj.setSpecificatii(tv.getSpecificatii());
				
				tvObj.setCantitate(Integer.valueOf(tv.getCantitate()));
				tvObj.setPret(Double.valueOf(tv.getPret()));
				
				if (tv.getInStoc()==null) {
					tvObj.setInStoc("");
				} else tvObj.setInStoc(tv.getInStoc());

				if (tv.getTipEcran()==null) {
					tvObj.setTipEcran("");
				} else tvObj.setTipEcran(tv.getTipEcran());
				
				if (tv.getTip()==null) {
					tvObj.setTip("");
				} else tvObj.setTip(tv.getTip());
				
				if (tv.getTehnologie()==null) {
					tvObj.setTehnologie("");
				} else tvObj.setTehnologie(tv.getTehnologie());
				
				tvObj.setDiagonalacm(Integer.valueOf(tv.getDiagonalacm()));
				tvObj.setDimensiuneEcranInch(Integer.valueOf(tv.getDimensiuneEcranInch()));
				
				if (tv.getRezolutieEcranPixeli()==null) {
					tvObj.setRezolutieEcranPixeli("");
				} else tvObj.setRezolutieEcranPixeli(tv.getRezolutieEcranPixeli());
				
				if (tv.getRezolutie()==null) {
					tvObj.setRezolutie("");
				} else tvObj.setRezolutie(tv.getRezolutie());
				
				if (tv.getPanou()==null) {
					tvObj.setPanou("");
				} else tvObj.setPanou(tv.getPanou());
				
				if (tv.getEcran()==null) {
					tvObj.setEcran("");
				} else tvObj.setEcran(tv.getEcran());
				
				if (tv.getFormatEcranCorectieFormat()==null) {
					tvObj.setFormatEcranCorectieFormat("");
				} else tvObj.setFormatEcranCorectieFormat(tv.getFormatEcranCorectieFormat());
				
				if (tv.getModImagine()==null) {
					tvObj.setModImagine("");
				} else tvObj.setModImagine(tv.getModImagine());
				
				tvObj.setProcesareImagineHz(Integer.valueOf(tv.getProcesareImagineHz()));
				tvObj.setLuminozitateCdM2(Integer.valueOf(tv.getLuminozitateCdM2()));
				tvObj.setMci(Integer.valueOf(tv.getMci()));
				
				if (tv.getModPanoramic()==null) {
					tvObj.setModPanoramic("");
				} else tvObj.setModPanoramic(tv.getModPanoramic());
				
				if (tv.getModPanoramicPentruPC()==null) {
					tvObj.setModPanoramicPentruPC("");
				} else tvObj.setModPanoramicPentruPC(tv.getModPanoramicPentruPC());
				
				if (tv.getSceneSelect()==null) {
					tvObj.setSceneSelect("");
				} else tvObj.setSceneSelect(tv.getSceneSelect());
				
				if (tv.getUnghiDeVizualizareGrade()==null) {
					tvObj.setUnghiDeVizualizareGrade("");
				} else tvObj.setUnghiDeVizualizareGrade(tv.getUnghiDeVizualizareGrade());
				
				if (tv.getContrastDinamic()==null) {
					tvObj.setContrastDinamic("");
				} else tvObj.setContrastDinamic(tv.getContrastDinamic());
				
				if (tv.getMotionflow()==null) {
					tvObj.setMotionflow("");
				} else tvObj.setMotionflow(tv.getMotionflow());

				tvObj.setPerfectMotionRateHz(Integer.valueOf(tv.getPerfectMotionRateHz()));
				
				if (tv.getCaracteristiciVideo()==null) {
					tvObj.setCaracteristiciVideo("");
				} else tvObj.setCaracteristiciVideo(tv.getCaracteristiciVideo());
				
				if (tv.getFacilitati()==null) {
					tvObj.setFacilitati("");
				} else tvObj.setFacilitati(tv.getFacilitati());
							
				if (tv.getCaracteristici3D()==null) {
					tvObj.setCaracteristici3D("");
				} else tvObj.setCaracteristici3D(tv.getCaracteristici3D());
				
				if (tv.getSistemAudio()==null) {
					tvObj.setSistemAudio("");
				} else tvObj.setSistemAudio(tv.getSistemAudio());
				
				if (tv.getPutereDeIesireSistemAudioW()==null) {
					tvObj.setPutereDeIesireSistemAudioW("");
				} else tvObj.setPutereDeIesireSistemAudioW(tv.getPutereDeIesireSistemAudioW());
				
				if (tv.getSistemDifuzoare()==null) {
					tvObj.setSistemDifuzoare("");
				} else tvObj.setSistemDifuzoare(tv.getSistemDifuzoare());
				
				if (tv.getModSunet()==null) {
					tvObj.setModSunet("");
				} else tvObj.setModSunet(tv.getModSunet());
				
				if (tv.getModSurround()==null) {
					tvObj.setModSurround("");
				} else tvObj.setModSurround(tv.getModSurround());
				
				if (tv.getCaracteristiciAudio()==null) {
					tvObj.setCaracteristiciAudio("");
				} else tvObj.setCaracteristiciAudio(tv.getCaracteristiciAudio());
				
				if (tv.getOptimizareSunet()==null) {
					tvObj.setOptimizareSunet("");
				} else tvObj.setOptimizareSunet(tv.getOptimizareSunet());
				
				if (tv.getTipTuner()==null) {
					tvObj.setTipTuner("");
				} else tvObj.setTipTuner(tv.getTipTuner());
				
				if (tv.getCaracteristiciSpeciale()==null) {
					tvObj.setCaracteristiciSpeciale("");
				} else tvObj.setCaracteristiciSpeciale(tv.getCaracteristiciSpeciale());
				
				if (tv.getIntrareAntena()==null) {
					tvObj.setIntrareAntena("");
				} else tvObj.setIntrareAntena(tv.getIntrareAntena());
				
				if (tv.getFormatSubtitrari()==null) {
					tvObj.setFormatSubtitrari("");
				} else tvObj.setFormatSubtitrari(tv.getFormatSubtitrari());
				
				if (tv.getFormatRedareVideo()==null) {
					tvObj.setFormatRedareVideo("");
				} else tvObj.setFormatRedareVideo(tv.getFormatRedareVideo());
				
				if (tv.getFormatRedareAudio()==null) {
					tvObj.setFormatRedareAudio("");
				} else tvObj.setFormatRedareAudio(tv.getFormatRedareAudio());
				
				if (tv.getFormatRedareImagini()==null) {
					tvObj.setFormatRedareImagini("");
				} else tvObj.setFormatRedareImagini(tv.getFormatRedareImagini());
				
				if (tv.getCaracteristiciMultimedia()==null) {
					tvObj.setCaracteristiciMultimedia("");
				} else tvObj.setCaracteristiciMultimedia(tv.getCaracteristiciMultimedia());
				
				if (tv.getSistemDeOperare()==null) {
					tvObj.setSistemDeOperare("");
				} else tvObj.setSistemDeOperare(tv.getSistemDeOperare());
				
				if (tv.getVersiuneSistemDeOperare()==null) {
					tvObj.setVersiuneSistemDeOperare("");
				} else tvObj.setVersiuneSistemDeOperare(tv.getVersiuneSistemDeOperare());
				
				if (tv.getProcesor()==null) {
					tvObj.setProcesor("");
				} else tvObj.setProcesor(tv.getProcesor());
				
				if (tv.getFacilitatiSmartTV()==null) {
					tvObj.setFacilitatiSmartTV("");
				} else tvObj.setFacilitatiSmartTV(tv.getFacilitatiSmartTV());
				
				if (tv.getOperare()==null) {
					tvObj.setOperare("");
				} else tvObj.setOperare(tv.getOperare());
				
				if (tv.getAplicatii()==null) {
					tvObj.setAplicatii("");
				} else tvObj.setAplicatii(tv.getAplicatii());
				
				if (tv.getEasyLinkHDMICEC()==null) {
					tvObj.setEasyLinkHDMICEC("");
				} else tvObj.setEasyLinkHDMICEC(tv.getEasyLinkHDMICEC());
				
				if (tv.getMhl()==null) {
					tvObj.setMhl("");
				} else tvObj.setMhl(tv.getMhl());
				
				if (tv.getMiracast()==null) {
					tvObj.setMiracast("");
				} else tvObj.setMiracast(tv.getMiracast());
				
				if (tv.getSmartInteractionInstalareUsoara()==null) {
					tvObj.setSmartInteractionInstalareUsoara("");
				} else tvObj.setSmartInteractionInstalareUsoara(tv.getSmartInteractionInstalareUsoara());
				
				if (tv.getSmartInteractionUpgradeFirmware()==null) {
					tvObj.setSmartInteractionUpgradeFirmware("");
				} else tvObj.setSmartInteractionUpgradeFirmware(tv.getSmartInteractionUpgradeFirmware());
				
				if (tv.getBluetooth()==null) {
					tvObj.setBluetooth("");
				} else tvObj.setBluetooth(tv.getBluetooth());
				
				if (tv.getWifiDirect()==null) {
					tvObj.setWidi("");
				} else tvObj.setWidi(tv.getWifiDirect());
				
				if (tv.getWidi()==null) {
					tvObj.setWidi("");
				} else tvObj.setWidi(tv.getWidi());
				
				if (tv.getDlna()==null) {
					tvObj.setDlna("");
				} else tvObj.setDlna(tv.getDlna());
							
				if (tv.getWirelessLAN()==null) {
					tvObj.setWirelessLAN("");
				} else tvObj.setWirelessLAN(tv.getWirelessLAN());
				
				if (tv.getHomeNetwork()==null) {
					tvObj.setHomeNetwork("");
				} else tvObj.setHomeNetwork(tv.getHomeNetwork());			
				
				if (tv.getAllShare()==null) {
					tvObj.setAllShare("");
				} else tvObj.setAllShare(tv.getAllShare());
				
				if (tv.getWebBrowser()==null) {
					tvObj.setWebBrowser("");
				} else tvObj.setWebBrowser(tv.getWebBrowser());
				
				if (tv.getSkype()==null) {
					tvObj.setSkype("");
				} else tvObj.setSkype(tv.getSkype());
				
				if (tv.getAnynet()==null) {
					tvObj.setAnynet("");
				} else tvObj.setAnynet(tv.getAnynet());
				
				if (tv.getTimerSleep()==null) {
					tvObj.setTimerSleep("");
				} else tvObj.setTimerSleep(tv.getTimerSleep());
				
				if (tv.getAccesorii()==null) {
					tvObj.setAccesorii("");
				} else tvObj.setAccesorii(tv.getAccesorii());
				
				if (tv.getConectori()==null) {
					tvObj.setConectori("");
				} else tvObj.setConectori(tv.getConectori());
						
				if (tv.getStandardVESAmm()==null) {
					tvObj.setStandardVESAmm("");
				} else tvObj.setStandardVESAmm(tv.getStandardVESAmm());
				
				if (tv.getPutereConsumataInStandbyW()==null) {
					tvObj.setPutereConsumataInStandbyW("");
				} else tvObj.setPutereConsumataInStandbyW(tv.getPutereConsumataInStandbyW());
				
				if (tv.getClasaDeEficientaEnergetica()==null) {
					tvObj.setClasaDeEficientaEnergetica("");
				} else tvObj.setClasaDeEficientaEnergetica(tv.getClasaDeEficientaEnergetica());
				
				if (tv.getDimensiuniFaraStandLxAxIcm()==null) {
					tvObj.setDimensiuniFaraStandLxAxIcm("");
				} else tvObj.setDimensiuniFaraStandLxAxIcm(tv.getDimensiuniFaraStandLxAxIcm());
				
				if (tv.getDimensiuniCuStandLxAxIcm()==null) {
					tvObj.setDimensiuniCuStandLxAxIcm("");
				} else tvObj.setDimensiuniCuStandLxAxIcm(tv.getDimensiuniCuStandLxAxIcm());
				
				tvObj.setGreutateFaraStandKg(Double.valueOf(tv.getGreutateFaraStandKg()));
				tvObj.setGreutateCuStandKg(Double.valueOf(tv.getGreutateCuStandKg()));
				
				if (tv.getCuloare()==null) {
					tvObj.setCuloare("");
				} else tvObj.setCuloare(tv.getCuloare());
				
				if (tv.getGarantieComerciala()==null) {
					tvObj.setGarantieComerciala("");
				} else tvObj.setGarantieComerciala(tv.getGarantieComerciala());
				
				
				TVDAO.updateTV(tvObj);
				model.addAttribute("tvForm", tv);
			} catch (NumberFormatException e) {
				e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			if(!(request.getRemoteUser()==null)) {
				String username=request.getRemoteUser();
		        model.addAttribute("userName", username);
			}

			return new ModelAndView("/tvs/tvedit", "command", tv);
		}
		
		/**
		 * Method for displaying an empty form for creating a tv (filling the form
		 * fields with tv data)
		 * 
		 * 
		 * @param model
		 * @return
		 */

		@RequestMapping(value = "/new.htm", method = RequestMethod.GET)
		public ModelAndView createTVView(Model model, HttpServletRequest request) {

			TV newtv;
			try {
				newtv = new TV();
				model.addAttribute("newtvForm", newtv);
			} catch (NumberFormatException e) {
				e.printStackTrace();
			}
			
			if(!(request.getRemoteUser()==null)) {
				String username=request.getRemoteUser();
		        model.addAttribute("userName", username);
			}
			
			return new ModelAndView("/tvs/createtv", "model", model);
		}
		
		/**
		 * Method used for retrieving the details of a newly created tv after "save" is pressed
		 * in edit mode
		 * 
		 * @param tv
		 * @param model
		 * @param result
		 * @return
		 */

		@RequestMapping(value = "/savenew.htm", method = RequestMethod.POST)
		public ModelAndView createTV(@ModelAttribute("newtvForm") TV newtv, Model model, BindingResult result, HttpServletRequest request) {

			//TV tvObj;
			try {
				
				TVDAO.createTV(newtv);
				model.addAttribute("newtvForm", newtv);
			} catch (NumberFormatException e) {
				e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			if(!(request.getRemoteUser()==null)) {
				String username=request.getRemoteUser();
		        model.addAttribute("userName", username);
			}
			
			return new ModelAndView("/tvs/createtv", "command", newtv);
		}
		
		/**
		 * Method for deleting a tv
		 * 
		 * @param tvId
		 * @param model
		 * @return
		 */

		@RequestMapping(value = "/sterge/{tvId}")
		public ModelAndView stergeTV(@PathVariable String tvId, Model model, HttpServletRequest request) {

			ArrayList<TV> tvList;
			TvLists lists;
			
			try {
				TVDAO.deleteTV(Integer.valueOf(tvId));
			} catch (NumberFormatException e) {
				e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			if (request.isUserInRole("SUPERUSER")){    
				try {
					tvList = TVDAO.getSuperuserTVs();
					model.addAttribute("tvList", tvList);
					lists = new TvLists();
					model.addAttribute("lists", lists);
				} catch (SQLException e) {
					e.printStackTrace();
				}
	        } else {
	        	try {
	        		tvList = TVDAO.getUserTVs();
					model.addAttribute("tvList", tvList);
					lists = new TvLists();
					model.addAttribute("lists", lists);
	    		} catch (SQLException e) {
	    			e.printStackTrace();
	    		}
	        }
			
			if(!(request.getRemoteUser()==null)) {
				String username=request.getRemoteUser();
		        model.addAttribute("userName", username);
			}
			
			return new ModelAndView("/tvs/tvlist", "model", model);
		}
		
		@RequestMapping(value = "/charts", method = RequestMethod.GET)
		public ModelAndView displayCharts(Model model, HttpServletRequest request) {
			
			HashMap<String, Double> brandMap = new HashMap<>();
			try {
				brandMap = TvListDAO.getTvsNumbersByBrand();
				model.addAttribute("brandMap", brandMap);
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			HashMap<String, Double> typeMap = new HashMap<>();
			try {
				typeMap = TvListDAO.getTvsNumbersByType();
				model.addAttribute("typeMap", typeMap);
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			HashMap<String, Double> screenTypeMap = new HashMap<>();
			try {
				screenTypeMap = TvListDAO.getTvsNumbersByScreenType();
				model.addAttribute("screenTypeMap", screenTypeMap);
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			HashMap<Integer, Double> dimEcranMap = new HashMap<>();
			try {
				dimEcranMap = TvListDAO.getTvsNumbersByDimensiuneEcran();
				model.addAttribute("dimEcranMap", dimEcranMap);
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			HashMap<String, Double> opSysMap = new HashMap<>();
			try {
				opSysMap = TvListDAO.getTvsNumbersByOperatingSystem();
				model.addAttribute("opSysMap", opSysMap);
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			if(!(request.getRemoteUser()==null)) {
				String username=request.getRemoteUser();
		        model.addAttribute("userName", username);
			}
			
			return new ModelAndView("/tvs/tvscharts", "model", model);
			
		}
		
		@ModelAttribute("brandList")
		public ArrayList<String> initializeBrandList() {

			ArrayList<String> brandList = new ArrayList<String>();
			brandList.add("SONY");
			brandList.add("LG");
			brandList.add("SAMSUNG");
			brandList.add("PANASONIC");
			brandList.add("PHILIPS");
			return brandList;
		
		}
		
		@ModelAttribute("tipList")
		public ArrayList<String> initializeTipList() {

			ArrayList<String> tipList = new ArrayList<String>();
			tipList.add("LED");
			tipList.add("LCD");
			return tipList;
		
		}
		
		@ModelAttribute("tipEcranList")
		public ArrayList<String> initializeTipEcranList() {

			ArrayList<String> tipEcranList = new ArrayList<String>();
			tipEcranList.add("Plat");
			tipEcranList.add("Curbat");
			return tipEcranList;
		
		}
		
		@ModelAttribute("dimensiuneEcranInchList")
		public ArrayList<Integer> initializeDimensiuneEcranInchList() {

			ArrayList<Integer> dimensiuneEcranInchList = new ArrayList<Integer>();
			dimensiuneEcranInchList.add(49);
			dimensiuneEcranInchList.add(50);
			dimensiuneEcranInchList.add(55);
			dimensiuneEcranInchList.add(65);
			dimensiuneEcranInchList.add(75);
			dimensiuneEcranInchList.add(78);
			dimensiuneEcranInchList.add(85);
			dimensiuneEcranInchList.add(98);
			return dimensiuneEcranInchList;
		
		}
		
		@ModelAttribute("sistemDeOperareList")
		public ArrayList<String> initializeSistemDeOperareList() {

			ArrayList<String> sistemDeOperareList = new ArrayList<String>();
			sistemDeOperareList.add("Standard");
			sistemDeOperareList.add("webOS");
			sistemDeOperareList.add("Tizen");
			sistemDeOperareList.add("Android");
			sistemDeOperareList.add("Firefox");
			return sistemDeOperareList;
		
		}
		
}


