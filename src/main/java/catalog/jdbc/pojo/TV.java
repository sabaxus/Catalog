package catalog.jdbc.pojo;

import java.util.ArrayList;

public class TV {
	
	private int id;
	private String nume;
	private String specificatii;
	private int cantitate;
	private double pret;
	private String inStoc;
	private String tipEcran;
	private String tip;
	private String tehnologie;
	private int diagonalacm;
	private int dimensiuneEcranInch;
	private String rezolutieEcranPixeli;
	private String rezolutie;
	private String panou;
	private String ecran;
	private String formatEcranCorectieFormat;
	private String modImagine;
	private int procesareImagineHz;
	private int luminozitateCdM2;
	private int mci;
	private String modPanoramic;
	private String modPanoramicPentruPC;
	private String sceneSelect;
	private String unghiDeVizualizareGrade;
	private String contrastDinamic;
	private String motionflow;
	private int perfectMotionRateHz;
	private String caracteristiciVideo;
	private String facilitati;
	private String caracteristici3D;
	private String sistemAudio;
	private String putereDeIesireSistemAudioW;
	private String sistemDifuzoare;
	private String modSunet;
	private String modSurround;
	private String caracteristiciAudio;
	private String optimizareSunet;
	private String tipTuner;
	private String caracteristiciSpeciale;
	private String intrareAntena;
	private String formatSubtitrari;
	private String formatRedareVideo;
	private String formatRedareAudio;
	private String formatRedareImagini;
	private String caracteristiciMultimedia;
	private String sistemDeOperare;
	private String versiuneSistemDeOperare;
	private String procesor;
	private String facilitatiSmartTV;
	private String operare;
	private String aplicatii;
	private String easyLinkHDMICEC;
	private String mhl;
	private String miracast;
	private String smartInteractionInstalareUsoara;
	private String smartInteractionUpgradeFirmware;
	private String bluetooth;
	private String wifiDirect;
	private String widi;
	private String dlna;
	private String wirelessLAN;
	private String homeNetwork;
	private String allShare;
	private String webBrowser;
	private String skype;
	private String anynet;
	private String timerSleep;
	private String accesorii;
	private String conectori;
	private String standardVESAmm;
	private String putereConsumataInStandbyW;
	private String clasaDeEficientaEnergetica;
	private String dimensiuniFaraStandLxAxIcm;
	private String dimensiuniCuStandLxAxIcm;
	private double greutateFaraStandKg;
	private double greutateCuStandKg;
	private String culoare;
	private String garantieComerciala;
	private String brand;
	
	private ArrayList<String> photo;
	
	public TV(){
		this.photo = new ArrayList<>();
	}
	
	public TV(String nume) {
		this.nume=nume;
		this.photo = new ArrayList<>();
	}

	public TV(int id, String nume, String specificatii, int cantitate, double pret, String inStoc, String tipEcran,
			String tip, String tehnologie, int diagonalacm, int dimensiuneEcranInch, String rezolutieEcranPixeli,
			String rezolutie, String panou, String ecran, String formatEcranCorectieFormat, String modImagine,
			int procesareImagineHz, int luminozitateCdM2, int mci, String modPanoramic, String modPanoramicPentruPC,
			String sceneSelect, String unghiDeVizualizareGrade, String contrastDinamic, String motionflow,
			int perfectMotionRateHz, String caracteristiciVideo, String facilitati, String caracteristici3d,
			String sistemAudio, String putereDeIesireSistemAudioW, String sistemDifuzoare, String modSunet,
			String modSurround, String caracteristiciAudio, String optimizareSunet, String tipTuner,
			String caracteristiciSpeciale, String intrareAntena, String formatSubtitrari, String formatRedareVideo,
			String formatRedareAudio, String formatRedareImagini, String caracteristiciMultimedia,
			String sistemDeOperare, String versiuneSistemDeOperare, String procesor, String facilitatiSmartTV,
			String operare, String aplicatii, String easyLinkHDMICEC, String mhl, String miracast,
			String smartInteractionInstalareUsoara, String smartInteractionUpgradeFirmware, String bluetooth,
			String wifiDirect, String widi, String dlna, String wirelessLAN, String homeNetwork, String allShare,
			String webBrowser, String skype, String anynet, String timerSleep, String accesorii, String conectori,
			String standardVESAmm, String putereConsumataInStandbyW, String clasaDeEficientaEnergetica,
			String dimensiuniFaraStandLxAxIcm, String dimensiuniCuStandLxAxIcm, double greutateFaraStandKg,
			double greutateCuStandKg, String culoare, String garantieComerciala, String brand) {
		
		this.id = id;
		this.nume = nume;
		this.specificatii = specificatii;
		this.cantitate = cantitate;
		this.pret = pret;
		this.inStoc = inStoc;
		this.tipEcran = tipEcran;
		this.tip = tip;
		this.tehnologie = tehnologie;
		this.diagonalacm = diagonalacm;
		this.dimensiuneEcranInch = dimensiuneEcranInch;
		this.rezolutieEcranPixeli = rezolutieEcranPixeli;
		this.rezolutie = rezolutie;
		this.panou = panou;
		this.ecran = ecran;
		this.formatEcranCorectieFormat = formatEcranCorectieFormat;
		this.modImagine = modImagine;
		this.procesareImagineHz = procesareImagineHz;
		this.luminozitateCdM2 = luminozitateCdM2;
		this.mci = mci;
		this.modPanoramic = modPanoramic;
		this.modPanoramicPentruPC = modPanoramicPentruPC;
		this.sceneSelect = sceneSelect;
		this.unghiDeVizualizareGrade = unghiDeVizualizareGrade;
		this.contrastDinamic = contrastDinamic;
		this.motionflow = motionflow;
		this.perfectMotionRateHz = perfectMotionRateHz;
		this.caracteristiciVideo = caracteristiciVideo;
		this.facilitati = facilitati;
		this.caracteristici3D = caracteristici3d;
		this.sistemAudio = sistemAudio;
		this.putereDeIesireSistemAudioW = putereDeIesireSistemAudioW;
		this.sistemDifuzoare = sistemDifuzoare;
		this.modSunet = modSunet;
		this.modSurround = modSurround;
		this.caracteristiciAudio = caracteristiciAudio;
		this.optimizareSunet = optimizareSunet;
		this.tipTuner = tipTuner;
		this.caracteristiciSpeciale = caracteristiciSpeciale;
		this.intrareAntena = intrareAntena;
		this.formatSubtitrari = formatSubtitrari;
		this.formatRedareVideo = formatRedareVideo;
		this.formatRedareAudio = formatRedareAudio;
		this.formatRedareImagini = formatRedareImagini;
		this.caracteristiciMultimedia = caracteristiciMultimedia;
		this.sistemDeOperare = sistemDeOperare;
		this.versiuneSistemDeOperare = versiuneSistemDeOperare;
		this.procesor = procesor;
		this.facilitatiSmartTV = facilitatiSmartTV;
		this.operare = operare;
		this.aplicatii = aplicatii;
		this.easyLinkHDMICEC = easyLinkHDMICEC;
		this.mhl = mhl;
		this.miracast = miracast;
		this.smartInteractionInstalareUsoara = smartInteractionInstalareUsoara;
		this.smartInteractionUpgradeFirmware = smartInteractionUpgradeFirmware;
		this.bluetooth = bluetooth;
		this.wifiDirect = wifiDirect;
		this.widi = widi;
		this.dlna = dlna;
		this.wirelessLAN = wirelessLAN;
		this.homeNetwork = homeNetwork;
		this.allShare = allShare;
		this.webBrowser = webBrowser;
		this.skype = skype;
		this.anynet = anynet;
		this.timerSleep = timerSleep;
		this.accesorii = accesorii;
		this.conectori = conectori;
		this.standardVESAmm = standardVESAmm;
		this.putereConsumataInStandbyW = putereConsumataInStandbyW;
		this.clasaDeEficientaEnergetica = clasaDeEficientaEnergetica;
		this.dimensiuniFaraStandLxAxIcm = dimensiuniFaraStandLxAxIcm;
		this.dimensiuniCuStandLxAxIcm = dimensiuniCuStandLxAxIcm;
		this.greutateFaraStandKg = greutateFaraStandKg;
		this.greutateCuStandKg = greutateCuStandKg;
		this.culoare = culoare;
		this.garantieComerciala = garantieComerciala;
		this.brand = brand;
		
		this.photo = new ArrayList<>();
	}
	
	public TV(String nume, String specificatii, int cantitate, double pret, String inStoc, String tipEcran,
			String tip, String tehnologie, int diagonalacm, int dimensiuneEcranInch, String rezolutieEcranPixeli,
			String rezolutie, String panou, String ecran, String formatEcranCorectieFormat, String modImagine,
			int procesareImagineHz, int luminozitateCdM2, int mci, String modPanoramic, String modPanoramicPentruPC,
			String sceneSelect, String unghiDeVizualizareGrade, String contrastDinamic, String motionflow,
			int perfectMotionRateHz, String caracteristiciVideo, String facilitati, String caracteristici3d,
			String sistemAudio, String putereDeIesireSistemAudioW, String sistemDifuzoare, String modSunet,
			String modSurround, String caracteristiciAudio, String optimizareSunet, String tipTuner,
			String caracteristiciSpeciale, String intrareAntena, String formatSubtitrari, String formatRedareVideo,
			String formatRedareAudio, String formatRedareImagini, String caracteristiciMultimedia,
			String sistemDeOperare, String versiuneSistemDeOperare, String procesor, String facilitatiSmartTV,
			String operare, String aplicatii, String easyLinkHDMICEC, String mhl, String miracast,
			String smartInteractionInstalareUsoara, String smartInteractionUpgradeFirmware, String bluetooth,
			String wifiDirect, String widi, String dlna, String wirelessLAN, String homeNetwork, String allShare,
			String webBrowser, String skype, String anynet, String timerSleep, String accesorii, String conectori,
			String standardVESAmm, String putereConsumataInStandbyW, String clasaDeEficientaEnergetica,
			String dimensiuniFaraStandLxAxIcm, String dimensiuniCuStandLxAxIcm, double greutateFaraStandKg,
			double greutateCuStandKg, String culoare, String garantieComerciala, String brand) {
		
		this.nume = nume;
		this.specificatii = specificatii;
		this.cantitate = cantitate;
		this.pret = pret;
		this.inStoc = inStoc;
		this.tipEcran = tipEcran;
		this.tip = tip;
		this.tehnologie = tehnologie;
		this.diagonalacm = diagonalacm;
		this.dimensiuneEcranInch = dimensiuneEcranInch;
		this.rezolutieEcranPixeli = rezolutieEcranPixeli;
		this.rezolutie = rezolutie;
		this.panou = panou;
		this.ecran = ecran;
		this.formatEcranCorectieFormat = formatEcranCorectieFormat;
		this.modImagine = modImagine;
		this.procesareImagineHz = procesareImagineHz;
		this.luminozitateCdM2 = luminozitateCdM2;
		this.mci = mci;
		this.modPanoramic = modPanoramic;
		this.modPanoramicPentruPC = modPanoramicPentruPC;
		this.sceneSelect = sceneSelect;
		this.unghiDeVizualizareGrade = unghiDeVizualizareGrade;
		this.contrastDinamic = contrastDinamic;
		this.motionflow = motionflow;
		this.perfectMotionRateHz = perfectMotionRateHz;
		this.caracteristiciVideo = caracteristiciVideo;
		this.facilitati = facilitati;
		this.caracteristici3D = caracteristici3d;
		this.sistemAudio = sistemAudio;
		this.putereDeIesireSistemAudioW = putereDeIesireSistemAudioW;
		this.sistemDifuzoare = sistemDifuzoare;
		this.modSunet = modSunet;
		this.modSurround = modSurround;
		this.caracteristiciAudio = caracteristiciAudio;
		this.optimizareSunet = optimizareSunet;
		this.tipTuner = tipTuner;
		this.caracteristiciSpeciale = caracteristiciSpeciale;
		this.intrareAntena = intrareAntena;
		this.formatSubtitrari = formatSubtitrari;
		this.formatRedareVideo = formatRedareVideo;
		this.formatRedareAudio = formatRedareAudio;
		this.formatRedareImagini = formatRedareImagini;
		this.caracteristiciMultimedia = caracteristiciMultimedia;
		this.sistemDeOperare = sistemDeOperare;
		this.versiuneSistemDeOperare = versiuneSistemDeOperare;
		this.procesor = procesor;
		this.facilitatiSmartTV = facilitatiSmartTV;
		this.operare = operare;
		this.aplicatii = aplicatii;
		this.easyLinkHDMICEC = easyLinkHDMICEC;
		this.mhl = mhl;
		this.miracast = miracast;
		this.smartInteractionInstalareUsoara = smartInteractionInstalareUsoara;
		this.smartInteractionUpgradeFirmware = smartInteractionUpgradeFirmware;
		this.bluetooth = bluetooth;
		this.wifiDirect = wifiDirect;
		this.widi = widi;
		this.dlna = dlna;
		this.wirelessLAN = wirelessLAN;
		this.homeNetwork = homeNetwork;
		this.allShare = allShare;
		this.webBrowser = webBrowser;
		this.skype = skype;
		this.anynet = anynet;
		this.timerSleep = timerSleep;
		this.accesorii = accesorii;
		this.conectori = conectori;
		this.standardVESAmm = standardVESAmm;
		this.putereConsumataInStandbyW = putereConsumataInStandbyW;
		this.clasaDeEficientaEnergetica = clasaDeEficientaEnergetica;
		this.dimensiuniFaraStandLxAxIcm = dimensiuniFaraStandLxAxIcm;
		this.dimensiuniCuStandLxAxIcm = dimensiuniCuStandLxAxIcm;
		this.greutateFaraStandKg = greutateFaraStandKg;
		this.greutateCuStandKg = greutateCuStandKg;
		this.culoare = culoare;
		this.garantieComerciala = garantieComerciala;
		this.brand = brand;
		
		this.photo = new ArrayList<>();
		
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getNume() {
		return nume;
	}

	public void setNume(String nume) {
		this.nume = nume;
	}

	public String getSpecificatii() {
		return specificatii;
	}

	public void setSpecificatii(String specificatii) {
		this.specificatii = specificatii;
	}

	public int getCantitate() {
		return cantitate;
	}

	public void setCantitate(int cantitate) {
		this.cantitate = cantitate;
	}

	public double getPret() {
		return pret;
	}

	public void setPret(double pret) {
		this.pret = pret;
	}

	public String getInStoc() {
		return inStoc;
	}

	public void setInStoc(String inStoc) {
		this.inStoc = inStoc;
	}

	public String getTipEcran() {
		return tipEcran;
	}

	public void setTipEcran(String tipEcran) {
		this.tipEcran = tipEcran;
	}

	public String getTip() {
		return tip;
	}

	public void setTip(String tip) {
		this.tip = tip;
	}

	public String getTehnologie() {
		return tehnologie;
	}

	public void setTehnologie(String tehnologie) {
		this.tehnologie = tehnologie;
	}

	public int getDiagonalacm() {
		return diagonalacm;
	}

	public void setDiagonalacm(int diagonalacm) {
		this.diagonalacm = diagonalacm;
	}

	public int getDimensiuneEcranInch() {
		return dimensiuneEcranInch;
	}

	public void setDimensiuneEcranInch(int dimensiuneEcranInch) {
		this.dimensiuneEcranInch = dimensiuneEcranInch;
	}

	public String getRezolutieEcranPixeli() {
		return rezolutieEcranPixeli;
	}

	public void setRezolutieEcranPixeli(String rezolutieEcranPixeli) {
		this.rezolutieEcranPixeli = rezolutieEcranPixeli;
	}

	public String getRezolutie() {
		return rezolutie;
	}

	public void setRezolutie(String rezolutie) {
		this.rezolutie = rezolutie;
	}

	public String getPanou() {
		return panou;
	}

	public void setPanou(String panou) {
		this.panou = panou;
	}

	public String getEcran() {
		return ecran;
	}

	public void setEcran(String ecran) {
		this.ecran = ecran;
	}

	public String getFormatEcranCorectieFormat() {
		return formatEcranCorectieFormat;
	}

	public void setFormatEcranCorectieFormat(String formatEcranCorectieFormat) {
		this.formatEcranCorectieFormat = formatEcranCorectieFormat;
	}

	public String getModImagine() {
		return modImagine;
	}

	public void setModImagine(String modImagine) {
		this.modImagine = modImagine;
	}

	public int getProcesareImagineHz() {
		return procesareImagineHz;
	}

	public void setProcesareImagineHz(int procesareImagineHz) {
		this.procesareImagineHz = procesareImagineHz;
	}

	public int getLuminozitateCdM2() {
		return luminozitateCdM2;
	}

	public void setLuminozitateCdM2(int luminozitateCdM2) {
		this.luminozitateCdM2 = luminozitateCdM2;
	}

	public int getMci() {
		return mci;
	}

	public void setMci(int mci) {
		this.mci = mci;
	}

	public String getModPanoramic() {
		return modPanoramic;
	}

	public void setModPanoramic(String modPanoramic) {
		this.modPanoramic = modPanoramic;
	}

	public String getModPanoramicPentruPC() {
		return modPanoramicPentruPC;
	}

	public void setModPanoramicPentruPC(String modPanoramicPentruPC) {
		this.modPanoramicPentruPC = modPanoramicPentruPC;
	}

	public String getSceneSelect() {
		return sceneSelect;
	}

	public void setSceneSelect(String sceneSelect) {
		this.sceneSelect = sceneSelect;
	}

	public String getUnghiDeVizualizareGrade() {
		return unghiDeVizualizareGrade;
	}

	public void setUnghiDeVizualizareGrade(String unghiDeVizualizareGrade) {
		this.unghiDeVizualizareGrade = unghiDeVizualizareGrade;
	}

	public String getContrastDinamic() {
		return contrastDinamic;
	}

	public void setContrastDinamic(String contrastDinamic) {
		this.contrastDinamic = contrastDinamic;
	}

	public String getMotionflow() {
		return motionflow;
	}

	public void setMotionflow(String motionflow) {
		this.motionflow = motionflow;
	}

	public int getPerfectMotionRateHz() {
		return perfectMotionRateHz;
	}

	public void setPerfectMotionRateHz(int perfectMotionRateHz) {
		this.perfectMotionRateHz = perfectMotionRateHz;
	}

	public String getCaracteristiciVideo() {
		return caracteristiciVideo;
	}

	public void setCaracteristiciVideo(String caracteristiciVideo) {
		this.caracteristiciVideo = caracteristiciVideo;
	}

	public String getFacilitati() {
		return facilitati;
	}

	public void setFacilitati(String facilitati) {
		this.facilitati = facilitati;
	}

	public String getCaracteristici3D() {
		return caracteristici3D;
	}

	public void setCaracteristici3D(String caracteristici3d) {
		caracteristici3D = caracteristici3d;
	}

	public String getSistemAudio() {
		return sistemAudio;
	}

	public void setSistemAudio(String sistemAudio) {
		this.sistemAudio = sistemAudio;
	}

	public String getPutereDeIesireSistemAudioW() {
		return putereDeIesireSistemAudioW;
	}

	public void setPutereDeIesireSistemAudioW(String putereDeIesireSistemAudioW) {
		this.putereDeIesireSistemAudioW = putereDeIesireSistemAudioW;
	}

	public String getSistemDifuzoare() {
		return sistemDifuzoare;
	}

	public void setSistemDifuzoare(String sistemDifuzoare) {
		this.sistemDifuzoare = sistemDifuzoare;
	}

	public String getModSunet() {
		return modSunet;
	}

	public void setModSunet(String modSunet) {
		this.modSunet = modSunet;
	}

	public String getModSurround() {
		return modSurround;
	}

	public void setModSurround(String modSurround) {
		this.modSurround = modSurround;
	}

	public String getCaracteristiciAudio() {
		return caracteristiciAudio;
	}

	public void setCaracteristiciAudio(String caracteristiciAudio) {
		this.caracteristiciAudio = caracteristiciAudio;
	}

	public String getOptimizareSunet() {
		return optimizareSunet;
	}

	public void setOptimizareSunet(String optimizareSunet) {
		this.optimizareSunet = optimizareSunet;
	}

	public String getTipTuner() {
		return tipTuner;
	}

	public void setTipTuner(String tipTuner) {
		this.tipTuner = tipTuner;
	}

	public String getCaracteristiciSpeciale() {
		return caracteristiciSpeciale;
	}

	public void setCaracteristiciSpeciale(String caracteristiciSpeciale) {
		this.caracteristiciSpeciale = caracteristiciSpeciale;
	}

	public String getIntrareAntena() {
		return intrareAntena;
	}

	public void setIntrareAntena(String intrareAntena) {
		this.intrareAntena = intrareAntena;
	}

	public String getFormatSubtitrari() {
		return formatSubtitrari;
	}

	public void setFormatSubtitrari(String formatSubtitrari) {
		this.formatSubtitrari = formatSubtitrari;
	}

	public String getFormatRedareVideo() {
		return formatRedareVideo;
	}

	public void setFormatRedareVideo(String formatRedareVideo) {
		this.formatRedareVideo = formatRedareVideo;
	}

	public String getFormatRedareAudio() {
		return formatRedareAudio;
	}

	public void setFormatRedareAudio(String formatRedareAudio) {
		this.formatRedareAudio = formatRedareAudio;
	}

	public String getFormatRedareImagini() {
		return formatRedareImagini;
	}

	public void setFormatRedareImagini(String formatRedareImagini) {
		this.formatRedareImagini = formatRedareImagini;
	}

	public String getCaracteristiciMultimedia() {
		return caracteristiciMultimedia;
	}

	public void setCaracteristiciMultimedia(String caracteristiciMultimedia) {
		this.caracteristiciMultimedia = caracteristiciMultimedia;
	}

	public String getSistemDeOperare() {
		return sistemDeOperare;
	}

	public void setSistemDeOperare(String sistemDeOperare) {
		this.sistemDeOperare = sistemDeOperare;
	}

	public String getVersiuneSistemDeOperare() {
		return versiuneSistemDeOperare;
	}

	public void setVersiuneSistemDeOperare(String versiuneSistemDeOperare) {
		this.versiuneSistemDeOperare = versiuneSistemDeOperare;
	}

	public String getProcesor() {
		return procesor;
	}

	public void setProcesor(String procesor) {
		this.procesor = procesor;
	}

	public String getFacilitatiSmartTV() {
		return facilitatiSmartTV;
	}

	public void setFacilitatiSmartTV(String facilitatiSmartTV) {
		this.facilitatiSmartTV = facilitatiSmartTV;
	}

	public String getOperare() {
		return operare;
	}

	public void setOperare(String operare) {
		this.operare = operare;
	}

	public String getAplicatii() {
		return aplicatii;
	}

	public void setAplicatii(String aplicatii) {
		this.aplicatii = aplicatii;
	}

	public String getEasyLinkHDMICEC() {
		return easyLinkHDMICEC;
	}

	public void setEasyLinkHDMICEC(String easyLinkHDMICEC) {
		this.easyLinkHDMICEC = easyLinkHDMICEC;
	}

	public String getMhl() {
		return mhl;
	}

	public void setMhl(String mhl) {
		this.mhl = mhl;
	}

	public String getMiracast() {
		return miracast;
	}

	public void setMiracast(String miracast) {
		this.miracast = miracast;
	}

	public String getSmartInteractionInstalareUsoara() {
		return smartInteractionInstalareUsoara;
	}

	public void setSmartInteractionInstalareUsoara(String smartInteractionInstalareUsoara) {
		this.smartInteractionInstalareUsoara = smartInteractionInstalareUsoara;
	}

	public String getSmartInteractionUpgradeFirmware() {
		return smartInteractionUpgradeFirmware;
	}

	public void setSmartInteractionUpgradeFirmware(String smartInteractionUpgradeFirmware) {
		this.smartInteractionUpgradeFirmware = smartInteractionUpgradeFirmware;
	}

	public String getBluetooth() {
		return bluetooth;
	}

	public void setBluetooth(String bluetooth) {
		this.bluetooth = bluetooth;
	}

	public String getWifiDirect() {
		return wifiDirect;
	}

	public void setWifiDirect(String wifiDirect) {
		this.wifiDirect = wifiDirect;
	}

	public String getWidi() {
		return widi;
	}

	public void setWidi(String widi) {
		this.widi = widi;
	}

	public String getDlna() {
		return dlna;
	}

	public void setDlna(String dlna) {
		this.dlna = dlna;
	}

	public String getWirelessLAN() {
		return wirelessLAN;
	}

	public void setWirelessLAN(String wirelessLAN) {
		this.wirelessLAN = wirelessLAN;
	}

	public String getHomeNetwork() {
		return homeNetwork;
	}

	public void setHomeNetwork(String homeNetwork) {
		this.homeNetwork = homeNetwork;
	}

	public String getAllShare() {
		return allShare;
	}

	public void setAllShare(String allShare) {
		this.allShare = allShare;
	}

	public String getWebBrowser() {
		return webBrowser;
	}

	public void setWebBrowser(String webBrowser) {
		this.webBrowser = webBrowser;
	}

	public String getSkype() {
		return skype;
	}

	public void setSkype(String skype) {
		this.skype = skype;
	}

	public String getAnynet() {
		return anynet;
	}

	public void setAnynet(String anynet) {
		this.anynet = anynet;
	}

	public String getTimerSleep() {
		return timerSleep;
	}

	public void setTimerSleep(String timerSleep) {
		this.timerSleep = timerSleep;
	}

	public String getAccesorii() {
		return accesorii;
	}

	public void setAccesorii(String accesorii) {
		this.accesorii = accesorii;
	}

	public String getConectori() {
		return conectori;
	}

	public void setConectori(String conectori) {
		this.conectori = conectori;
	}

	public String getStandardVESAmm() {
		return standardVESAmm;
	}

	public void setStandardVESAmm(String standardVESAmm) {
		this.standardVESAmm = standardVESAmm;
	}

	public String getPutereConsumataInStandbyW() {
		return putereConsumataInStandbyW;
	}

	public void setPutereConsumataInStandbyW(String putereConsumataInStandbyW) {
		this.putereConsumataInStandbyW = putereConsumataInStandbyW;
	}

	public String getClasaDeEficientaEnergetica() {
		return clasaDeEficientaEnergetica;
	}

	public void setClasaDeEficientaEnergetica(String clasaDeEficientaEnergetica) {
		this.clasaDeEficientaEnergetica = clasaDeEficientaEnergetica;
	}

	public String getDimensiuniFaraStandLxAxIcm() {
		return dimensiuniFaraStandLxAxIcm;
	}

	public void setDimensiuniFaraStandLxAxIcm(String dimensiuniFaraDtandLxAxIcm) {
		this.dimensiuniFaraStandLxAxIcm = dimensiuniFaraDtandLxAxIcm;
	}

	public String getDimensiuniCuStandLxAxIcm() {
		return dimensiuniCuStandLxAxIcm;
	}

	public void setDimensiuniCuStandLxAxIcm(String dimensiuniCuStandLxAxIcm) {
		this.dimensiuniCuStandLxAxIcm = dimensiuniCuStandLxAxIcm;
	}

	public double getGreutateFaraStandKg() {
		return greutateFaraStandKg;
	}

	public void setGreutateFaraStandKg(double greutateFaraStandKg) {
		this.greutateFaraStandKg = greutateFaraStandKg;
	}

	public double getGreutateCuStandKg() {
		return greutateCuStandKg;
	}

	public void setGreutateCuStandKg(double greutateCuStandKg) {
		this.greutateCuStandKg = greutateCuStandKg;
	}

	public String getCuloare() {
		return culoare;
	}

	public void setCuloare(String culoare) {
		this.culoare = culoare;
	}

	public String getGarantieComerciala() {
		return garantieComerciala;
	}

	public void setGarantieComerciala(String garantieComerciala) {
		this.garantieComerciala = garantieComerciala;
	}

	public ArrayList<String> getPhoto() {
		return photo;
	}

	public void setPhoto(ArrayList<String> photo) {
		this.photo = photo;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}
	
}
