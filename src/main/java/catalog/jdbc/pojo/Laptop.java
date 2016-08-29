package catalog.jdbc.pojo;

import java.util.ArrayList;

public class Laptop {
	
    private int id;
    private String nume;
    private String specificatii;
    private int cantitate;
    private double pret;
    private String inStoc;
    private String tipEcran;
    private String rezolutieEcran;
    private double dimensiuneEcranInch;
    private String formatImagine;
    private String alteCaracteristiciDisplay;
    private String tipProcesor;
    private String producatorProcesor;
    private String modelProcesor;
    private int numarNucleeProcesor;
    private double frecventaProcesorGHz;
    private double frecventaMaximaProcesorGHz;
    private int cacheProcesorMB;
    private String tehnologieProcesor;
    private String procesorGraficIntegrat;
    private int capacitateRAM;
    private String tipMemorieRAM;
    private int frecventaRAMMHz;
    private int memorieMaximaRAM;
    private int sloturiDeMemorie;
    private String slotMemorie1;
    private String slotMemorie2;
    private String slotMemorie3;
    private String slotMemorie4;
    private String tipUnitateStocare;
    private String capacitateStocare;
    private String interfataUnitateStocare;
    private int vitezaDeRotatieUnitateStocareRPM;
    private String procesorPlacaVideo;
    private String tipPlacaVideo;
    private int capacitateMemoriePlacaVideoMB;
    private String tipMemoriePlacaVideo;
    private String difuzoare;
    private String tehnologieAudio;
    private String subwoofer;
    private String microfon;
    private String tipUnitateOptica;
    private String webcam;
    private String ethernet;
    private String wiFi;
    private String bluetooth;
    private int usb31;
    private int usb30;
    private int usb20;
    private String thunderbolt;
    private int rj45;
    private int hdmi;
    private int displayPort;
    private int miniDisplayPort;
    private String iesireAudio;
    private String intrareMicrofon;
    private String cititorDeCarduri;
    private String altele;
    private String magSafe2;
    private String baterie;
    private int capacitateBateriemAh;
    private String numarCeluleBaterie;
    private String autonomieBaterie;
    private String sistemDeOperare;
    private int bitiSistemOperare;
    private String alteSoftware;
    private String tastaturaIluminata;
    private String tastaturaNumerica;
    private String layoutTastatura;
    private String facilitati;
    private String securitate;
    private String accesoriiIncluse;
    private String carcasa;
    private String garantieDeConformitate;
    private String garantieComerciala;
    private String dimensiuniLxAxIcm;
    private String culoare;
    private double greutateKg;
    private String brand;
    
//    private ArrayList<String> brandList;
//	private ArrayList<String> rezolutieEcranList;
//    private ArrayList<Double> dimensiuneEcranInchList;
//	private ArrayList<String> tipProcesorList;
//	private ArrayList<Double> frecventaProcesorGHzList;
//	private ArrayList<Integer> capacitateRAMList;
//	private ArrayList<String> culoareList;
    
    private ArrayList<String> photo;
    
    public Laptop() {
    	
//    	this.brandList = new ArrayList<>();
//    	this.rezolutieEcranList = new ArrayList<>();
//    	this.dimensiuneEcranInchList = new ArrayList<>();
//    	this.tipProcesorList = new ArrayList<>();
//    	this.frecventaProcesorGHzList = new ArrayList<>();
//    	this.capacitateRAMList = new ArrayList<>();
//    	this.culoareList = new ArrayList<>();
    	
    	this.photo = new ArrayList<>();
    	
    }
	
    public Laptop(String nume) {
    	this.nume=nume;
    	this.photo = new ArrayList<>();
//    	this.brandList = new ArrayList<>();
//    	this.rezolutieEcranList = new ArrayList<>();
//    	this.dimensiuneEcranInchList = new ArrayList<>();
//    	this.tipProcesorList = new ArrayList<>();
//    	this.frecventaProcesorGHzList = new ArrayList<>();
//    	this.capacitateRAMList = new ArrayList<>();
//    	this.culoareList = new ArrayList<>();
//    	this.photo = new ArrayList<>();
    	
    }

	public Laptop(int id, String nume, String specificatii, int cantitate, double pret, String inStoc, String tipEcran,
			String rezolutieEcran, double dimensiuneEcranInch, String formatImagine, String alteCaracteristiciDisplay,
			String tipProcesor, String producatorProcesor, String modelProcesor, int numarNucleeProcesor,
			double frecventaProcesorGHz, double frecventaMaximaProcesorGHz, int cacheProcesorMB,
			String tehnologieProcesor, String procesorGraficIntegrat, int capacitateRAM, String tipMemorieRAM,
			int frecventaRAMMHz, int memorieMaximaRAM, int sloturiDeMemorie, String slotMemorie1, String slotMemorie2,
			String slotMemorie3, String slotMemorie4, String tipUnitateStocare, String capacitateStocare,
			String interfataUnitateStocare, int vitezaDeRotatieUnitateStocareRPM, String procesorPlacaVideo,
			String tipPlacaVideo, int capacitateMemoriePlacaVideoMB, String tipMemoriePlacaVideo, String difuzoare,
			String tehnologieAudio, String subwoofer, String microfon, String tipUnitateOptica, String webcam,
			String ethernet, String wiFi, String bluetooth, int usb31, int usb30, int usb20, String thunderbolt,
			int rj45, int hdmi, int displayPort, int miniDisplayPort, String iesireAudio, String intrareMicrofon,
			String cititorDeCarduri, String altele, String magSafe2, String baterie, int capacitateBateriemAh,
			String numarCeluleBaterie, String autonomieBaterie, String sistemDeOperare, int bitiSistemOperare,
			String alteSoftware, String tastaturaIluminata, String tastaturaNumerica, String layoutTastatura,
			String facilitati, String securitate, String accesoriiIncluse, String carcasa,
			String garantieDeConformitate, String garantieComerciala, String dimensiuniLxAxIcm, String culoare,
			double greutateKg, String brand) {
		
		this.id = id;
		this.nume = nume;
		this.specificatii = specificatii;
		this.cantitate = cantitate;
		this.pret = pret;
		this.inStoc=inStoc;
		this.tipEcran = tipEcran;
		this.rezolutieEcran = rezolutieEcran;
		this.dimensiuneEcranInch = dimensiuneEcranInch;
		this.formatImagine = formatImagine;
		this.alteCaracteristiciDisplay = alteCaracteristiciDisplay;
		this.tipProcesor = tipProcesor;
		this.producatorProcesor = producatorProcesor;
		this.modelProcesor = modelProcesor;
		this.numarNucleeProcesor = numarNucleeProcesor;
		this.frecventaProcesorGHz = frecventaProcesorGHz;
		this.frecventaMaximaProcesorGHz = frecventaMaximaProcesorGHz;
		this.cacheProcesorMB = cacheProcesorMB;
		this.tehnologieProcesor = tehnologieProcesor;
		this.procesorGraficIntegrat = procesorGraficIntegrat;
		this.capacitateRAM = capacitateRAM;
		this.tipMemorieRAM = tipMemorieRAM;
		this.frecventaRAMMHz = frecventaRAMMHz;
		this.memorieMaximaRAM = memorieMaximaRAM;
		this.sloturiDeMemorie = sloturiDeMemorie;
		this.slotMemorie1 = slotMemorie1;
		this.slotMemorie2 = slotMemorie2;
		this.slotMemorie3 = slotMemorie3;
		this.slotMemorie4 = slotMemorie4;
		this.tipUnitateStocare = tipUnitateStocare;
		this.capacitateStocare = capacitateStocare;
		this.interfataUnitateStocare = interfataUnitateStocare;
		this.vitezaDeRotatieUnitateStocareRPM = vitezaDeRotatieUnitateStocareRPM;
		this.procesorPlacaVideo = procesorPlacaVideo;
		this.tipPlacaVideo = tipPlacaVideo;
		this.capacitateMemoriePlacaVideoMB = capacitateMemoriePlacaVideoMB;
		this.tipMemoriePlacaVideo = tipMemoriePlacaVideo;
		this.difuzoare = difuzoare;
		this.tehnologieAudio = tehnologieAudio;
		this.subwoofer = subwoofer;
		this.microfon = microfon;
		this.tipUnitateOptica = tipUnitateOptica;
		this.webcam = webcam;
		this.ethernet = ethernet;
		this.wiFi = wiFi;
		this.bluetooth = bluetooth;
		this.usb31 = usb31;
		this.usb30 = usb30;
		this.usb20 = usb20;
		this.thunderbolt = thunderbolt;
		this.rj45 = rj45;
		this.hdmi = hdmi;
		this.displayPort = displayPort;
		this.miniDisplayPort = miniDisplayPort;
		this.iesireAudio = iesireAudio;
		this.intrareMicrofon = intrareMicrofon;
		this.cititorDeCarduri = cititorDeCarduri;
		this.altele = altele;
		this.magSafe2 = magSafe2;
		this.baterie = baterie;
		this.capacitateBateriemAh = capacitateBateriemAh;
		this.numarCeluleBaterie = numarCeluleBaterie;
		this.autonomieBaterie = autonomieBaterie;
		this.sistemDeOperare = sistemDeOperare;
		this.bitiSistemOperare = bitiSistemOperare;
		this.alteSoftware = alteSoftware;
		this.tastaturaIluminata = tastaturaIluminata;
		this.tastaturaNumerica = tastaturaNumerica;
		this.layoutTastatura = layoutTastatura;
		this.facilitati = facilitati;
		this.securitate = securitate;
		this.accesoriiIncluse = accesoriiIncluse;
		this.carcasa = carcasa;
		this.garantieDeConformitate = garantieDeConformitate;
		this.garantieComerciala = garantieComerciala;
		this.dimensiuniLxAxIcm = dimensiuniLxAxIcm;
		this.culoare = culoare;
		this.greutateKg = greutateKg;
		this.brand = brand;
		
//		this.brandList = new ArrayList<>();
//    	this.rezolutieEcranList = new ArrayList<>();
//    	this.dimensiuneEcranInchList = new ArrayList<>();
//    	this.tipProcesorList = new ArrayList<>();
//    	this.frecventaProcesorGHzList = new ArrayList<>();
//    	this.capacitateRAMList = new ArrayList<>();
//    	this.culoareList = new ArrayList<>();
    	
    	this.photo = new ArrayList<>();
	}
	
	public Laptop(String nume, String specificatii, int cantitate, double pret, String inStoc, String tipEcran,
			String rezolutieEcran, double dimensiuneEcranInch, String formatImagine, String alteCaracteristiciDisplay,
			String tipProcesor, String producatorProcesor, String modelProcesor, int numarNucleeProcesor,
			double frecventaProcesorGHz, double frecventaMaximaProcesorGHz, int cacheProcesorMB,
			String tehnologieProcesor, String procesorGraficIntegrat, int capacitateRAM, String tipMemorieRAM,
			int frecventaRAMMHz, int memorieMaximaRAM, int sloturiDeMemorie, String slotMemorie1, String slotMemorie2,
			String slotMemorie3, String slotMemorie4, String tipUnitateStocare, String capacitateStocare,
			String interfataUnitateStocare, int vitezaDeRotatieUnitateStocareRPM, String procesorPlacaVideo,
			String tipPlacaVideo, int capacitateMemoriePlacaVideoMB, String tipMemoriePlacaVideo, String difuzoare,
			String tehnologieAudio, String subwoofer, String microfon, String tipUnitateOptica, String webcam,
			String ethernet, String wiFi, String bluetooth, int usb31, int usb30, int usb20, String thunderbolt,
			int rj45, int hdmi, int displayPort, int miniDisplayPort, String iesireAudio, String intrareMicrofon,
			String cititorDeCarduri, String altele, String magSafe2, String baterie, int capacitateBateriemAh,
			String numarCeluleBaterie, String autonomieBaterie, String sistemDeOperare, int bitiSistemOperare,
			String alteSoftware, String tastaturaIluminata, String tastaturaNumerica, String layoutTastatura,
			String facilitati, String securitate, String accesoriiIncluse, String carcasa,
			String garantieDeConformitate, String garantieComerciala, String dimensiuniLxAxIcm, String culoare,
			double greutateKg, String brand) {
		
		this.nume = nume;
		this.specificatii = specificatii;
		this.cantitate = cantitate;
		this.pret = pret;
		this.inStoc=inStoc;
		this.tipEcran = tipEcran;
		this.rezolutieEcran = rezolutieEcran;
		this.dimensiuneEcranInch = dimensiuneEcranInch;
		this.formatImagine = formatImagine;
		this.alteCaracteristiciDisplay = alteCaracteristiciDisplay;
		this.tipProcesor = tipProcesor;
		this.producatorProcesor = producatorProcesor;
		this.modelProcesor = modelProcesor;
		this.numarNucleeProcesor = numarNucleeProcesor;
		this.frecventaProcesorGHz = frecventaProcesorGHz;
		this.frecventaMaximaProcesorGHz = frecventaMaximaProcesorGHz;
		this.cacheProcesorMB = cacheProcesorMB;
		this.tehnologieProcesor = tehnologieProcesor;
		this.procesorGraficIntegrat = procesorGraficIntegrat;
		this.capacitateRAM = capacitateRAM;
		this.tipMemorieRAM = tipMemorieRAM;
		this.frecventaRAMMHz = frecventaRAMMHz;
		this.memorieMaximaRAM = memorieMaximaRAM;
		this.sloturiDeMemorie = sloturiDeMemorie;
		this.slotMemorie1 = slotMemorie1;
		this.slotMemorie2 = slotMemorie2;
		this.slotMemorie3 = slotMemorie3;
		this.slotMemorie4 = slotMemorie4;
		this.tipUnitateStocare = tipUnitateStocare;
		this.capacitateStocare = capacitateStocare;
		this.interfataUnitateStocare = interfataUnitateStocare;
		this.vitezaDeRotatieUnitateStocareRPM = vitezaDeRotatieUnitateStocareRPM;
		this.procesorPlacaVideo = procesorPlacaVideo;
		this.tipPlacaVideo = tipPlacaVideo;
		this.capacitateMemoriePlacaVideoMB = capacitateMemoriePlacaVideoMB;
		this.tipMemoriePlacaVideo = tipMemoriePlacaVideo;
		this.difuzoare = difuzoare;
		this.tehnologieAudio = tehnologieAudio;
		this.subwoofer = subwoofer;
		this.microfon = microfon;
		this.tipUnitateOptica = tipUnitateOptica;
		this.webcam = webcam;
		this.ethernet = ethernet;
		this.wiFi = wiFi;
		this.bluetooth = bluetooth;
		this.usb31 = usb31;
		this.usb30 = usb30;
		this.usb20 = usb20;
		this.thunderbolt = thunderbolt;
		this.rj45 = rj45;
		this.hdmi = hdmi;
		this.displayPort = displayPort;
		this.miniDisplayPort = miniDisplayPort;
		this.iesireAudio = iesireAudio;
		this.intrareMicrofon = intrareMicrofon;
		this.cititorDeCarduri = cititorDeCarduri;
		this.altele = altele;
		this.magSafe2 = magSafe2;
		this.baterie = baterie;
		this.capacitateBateriemAh = capacitateBateriemAh;
		this.numarCeluleBaterie = numarCeluleBaterie;
		this.autonomieBaterie = autonomieBaterie;
		this.sistemDeOperare = sistemDeOperare;
		this.bitiSistemOperare = bitiSistemOperare;
		this.alteSoftware = alteSoftware;
		this.tastaturaIluminata = tastaturaIluminata;
		this.tastaturaNumerica = tastaturaNumerica;
		this.layoutTastatura = layoutTastatura;
		this.facilitati = facilitati;
		this.securitate = securitate;
		this.accesoriiIncluse = accesoriiIncluse;
		this.carcasa = carcasa;
		this.garantieDeConformitate = garantieDeConformitate;
		this.garantieComerciala = garantieComerciala;
		this.dimensiuniLxAxIcm = dimensiuniLxAxIcm;
		this.culoare = culoare;
		this.greutateKg = greutateKg;
		this.brand = brand;
		
//		this.brandList = new ArrayList<>();
//    	this.rezolutieEcranList = new ArrayList<>();
//    	this.dimensiuneEcranInchList = new ArrayList<>();
//    	this.tipProcesorList = new ArrayList<>();
//    	this.frecventaProcesorGHzList = new ArrayList<>();
//    	this.capacitateRAMList = new ArrayList<>();
//    	this.culoareList = new ArrayList<>();
    	
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
		this.inStoc=inStoc;
	}
	
	public String getTipEcran() {
		return tipEcran;
	}

	public void setTipEcran(String tipEcran) {
		this.tipEcran = tipEcran;
	}

	public String getRezolutieEcran() {
		return rezolutieEcran;
	}

	public void setRezolutieEcran(String rezolutieEcran) {
		this.rezolutieEcran = rezolutieEcran;
	}

	public double getDimensiuneEcranInch() {
		return dimensiuneEcranInch;
	}

	public void setDimensiuneEcranInch(double dimensiuneEcranInch) {
		this.dimensiuneEcranInch = dimensiuneEcranInch;
	}

	public String getFormatImagine() {
		return formatImagine;
	}

	public void setFormatImagine(String formatImagine) {
		this.formatImagine = formatImagine;
	}

	public String getAlteCaracteristiciDisplay() {
		return alteCaracteristiciDisplay;
	}

	public void setAlteCaracteristiciDisplay(String alteCaracteristiciDisplay) {
		this.alteCaracteristiciDisplay = alteCaracteristiciDisplay;
	}

	public String getTipProcesor() {
		return tipProcesor;
	}

	public void setTipProcesor(String tipProcesor) {
		this.tipProcesor = tipProcesor;
	}

	public String getProducatorProcesor() {
		return producatorProcesor;
	}

	public void setProducatorProcesor(String producatorProcesor) {
		this.producatorProcesor = producatorProcesor;
	}

	public String getModelProcesor() {
		return modelProcesor;
	}

	public void setModelProcesor(String modelProcesor) {
		this.modelProcesor = modelProcesor;
	}

	public int getNumarNucleeProcesor() {
		return numarNucleeProcesor;
	}

	public void setNumarNucleeProcesor(int numarNucleeProcesor) {
		this.numarNucleeProcesor = numarNucleeProcesor;
	}

	public double getFrecventaProcesorGHz() {
		return frecventaProcesorGHz;
	}

	public void setFrecventaProcesorGHz(double frecventaProcesorGHz) {
		this.frecventaProcesorGHz = frecventaProcesorGHz;
	}

	public double getFrecventaMaximaProcesorGHz() {
		return frecventaMaximaProcesorGHz;
	}

	public void setFrecventaMaximaProcesorGHz(double frecventaMaximaProcesorGHz) {
		this.frecventaMaximaProcesorGHz = frecventaMaximaProcesorGHz;
	}

	public int getCacheProcesorMB() {
		return cacheProcesorMB;
	}

	public void setCacheProcesorMB(int cacheProcesorMB) {
		this.cacheProcesorMB = cacheProcesorMB;
	}

	public String getTehnologieProcesor() {
		return tehnologieProcesor;
	}

	public void setTehnologieProcesor(String tehnologieProcesor) {
		this.tehnologieProcesor = tehnologieProcesor;
	}

	public String getProcesorGraficIntegrat() {
		return procesorGraficIntegrat;
	}

	public void setProcesorGraficIntegrat(String procesorGraficIntegrat) {
		this.procesorGraficIntegrat = procesorGraficIntegrat;
	}

	public int getCapacitateRAM() {
		return capacitateRAM;
	}

	public void setCapacitateRAM(int capacitateRAM) {
		this.capacitateRAM = capacitateRAM;
	}

	public String getTipMemorieRAM() {
		return tipMemorieRAM;
	}

	public void setTipMemorieRAM(String tipMemorieRAM) {
		this.tipMemorieRAM = tipMemorieRAM;
	}

	public int getFrecventaRAMMHz() {
		return frecventaRAMMHz;
	}

	public void setFrecventaRAMMHz(int frecventaRAMMHz) {
		this.frecventaRAMMHz = frecventaRAMMHz;
	}

	public int getMemorieMaximaRAM() {
		return memorieMaximaRAM;
	}

	public void setMemorieMaximaRAM(int memorieMaximaRAM) {
		this.memorieMaximaRAM = memorieMaximaRAM;
	}

	public int getSloturiDeMemorie() {
		return sloturiDeMemorie;
	}

	public void setSloturiDeMemorie(int sloturiDeMemorie) {
		this.sloturiDeMemorie = sloturiDeMemorie;
	}

	public String getSlotMemorie1() {
		return slotMemorie1;
	}

	public void setSlotMemorie1(String slotMemorie1) {
		this.slotMemorie1 = slotMemorie1;
	}

	public String getSlotMemorie2() {
		return slotMemorie2;
	}

	public void setSlotMemorie2(String slotMemorie2) {
		this.slotMemorie2 = slotMemorie2;
	}

	public String getSlotMemorie3() {
		return slotMemorie3;
	}

	public void setSlotMemorie3(String slotMemorie3) {
		this.slotMemorie3 = slotMemorie3;
	}

	public String getSlotMemorie4() {
		return slotMemorie4;
	}

	public void setSlotMemorie4(String slotMemorie4) {
		this.slotMemorie4 = slotMemorie4;
	}

	public String getTipUnitateStocare() {
		return tipUnitateStocare;
	}

	public void setTipUnitateStocare(String tipUnitateStocare) {
		this.tipUnitateStocare = tipUnitateStocare;
	}

	public String getCapacitateStocare() {
		return capacitateStocare;
	}

	public void setCapacitateStocare(String capacitateStocare) {
		this.capacitateStocare = capacitateStocare;
	}

	public String getInterfataUnitateStocare() {
		return interfataUnitateStocare;
	}

	public void setInterfataUnitateStocare(String interfataUnitateStocare) {
		this.interfataUnitateStocare = interfataUnitateStocare;
	}

	public int getVitezaDeRotatieUnitateStocareRPM() {
		return vitezaDeRotatieUnitateStocareRPM;
	}

	public void setVitezaDeRotatieUnitateStocareRPM(int vitezaDeRotatieUnitateStocareRPM) {
		this.vitezaDeRotatieUnitateStocareRPM = vitezaDeRotatieUnitateStocareRPM;
	}

	public String getProcesorPlacaVideo() {
		return procesorPlacaVideo;
	}

	public void setProcesorPlacaVideo(String procesorPlacaVideo) {
		this.procesorPlacaVideo = procesorPlacaVideo;
	}

	public String getTipPlacaVideo() {
		return tipPlacaVideo;
	}

	public void setTipPlacaVideo(String tipPlacaVideo) {
		this.tipPlacaVideo = tipPlacaVideo;
	}

	public int getCapacitateMemoriePlacaVideoMB() {
		return capacitateMemoriePlacaVideoMB;
	}

	public void setCapacitateMemoriePlacaVideoMB(int capacitateMemoriePlacaVideoMB) {
		this.capacitateMemoriePlacaVideoMB = capacitateMemoriePlacaVideoMB;
	}

	public String getTipMemoriePlacaVideo() {
		return tipMemoriePlacaVideo;
	}

	public void setTipMemoriePlacaVideo(String tipMemoriePlacaVideo) {
		this.tipMemoriePlacaVideo = tipMemoriePlacaVideo;
	}

	public String getDifuzoare() {
		return difuzoare;
	}

	public void setDifuzoare(String difuzoare) {
		this.difuzoare = difuzoare;
	}

	public String getTehnologieAudio() {
		return tehnologieAudio;
	}

	public void setTehnologieAudio(String tehnologieAudio) {
		this.tehnologieAudio = tehnologieAudio;
	}

	public String getSubwoofer() {
		return subwoofer;
	}

	public void setSubwoofer(String subwoofer) {
		this.subwoofer = subwoofer;
	}

	public String getMicrofon() {
		return microfon;
	}

	public void setMicrofon(String microfon) {
		this.microfon = microfon;
	}

	public String getTipUnitateOptica() {
		return tipUnitateOptica;
	}

	public void setTipUnitateOptica(String tipUnitateOptica) {
		this.tipUnitateOptica = tipUnitateOptica;
	}

	public String getWebcam() {
		return webcam;
	}

	public void setWebcam(String webcam) {
		this.webcam = webcam;
	}

	public String getEthernet() {
		return ethernet;
	}

	public void setEthernet(String ethernet) {
		this.ethernet = ethernet;
	}

	public String getWiFi() {
		return wiFi;
	}

	public void setWiFi(String wiFi) {
		this.wiFi = wiFi;
	}

	public String getBluetooth() {
		return bluetooth;
	}

	public void setBluetooth(String bluetooth) {
		this.bluetooth = bluetooth;
	}

	public int getUsb31() {
		return usb31;
	}

	public void setUsb31(int usb31) {
		this.usb31 = usb31;
	}

	public int getUsb30() {
		return usb30;
	}

	public void setUsb30(int usb30) {
		this.usb30 = usb30;
	}

	public int getUsb20() {
		return usb20;
	}

	public void setUsb20(int usb20) {
		this.usb20 = usb20;
	}

	public String getThunderbolt() {
		return thunderbolt;
	}

	public void setThunderbolt(String thunderbolt) {
		this.thunderbolt = thunderbolt;
	}

	public int getRj45() {
		return rj45;
	}

	public void setRj45(int rj45) {
		this.rj45 = rj45;
	}

	public int getHdmi() {
		return hdmi;
	}

	public void setHdmi(int hdmi) {
		this.hdmi = hdmi;
	}

	public int getDisplayPort() {
		return displayPort;
	}

	public void setDisplayPort(int displayPort) {
		this.displayPort = displayPort;
	}

	public int getMiniDisplayPort() {
		return miniDisplayPort;
	}

	public void setMiniDisplayPort(int miniDisplayPort) {
		this.miniDisplayPort = miniDisplayPort;
	}

	public String getIesireAudio() {
		return iesireAudio;
	}

	public void setIesireAudio(String iesireAudio) {
		this.iesireAudio = iesireAudio;
	}

	public String getIntrareMicrofon() {
		return intrareMicrofon;
	}

	public void setIntrareMicrofon(String intrareMicrofon) {
		this.intrareMicrofon = intrareMicrofon;
	}

	public String getCititorDeCarduri() {
		return cititorDeCarduri;
	}

	public void setCititorDeCarduri(String cititorDeCarduri) {
		this.cititorDeCarduri = cititorDeCarduri;
	}

	public String getAltele() {
		return altele;
	}

	public void setAltele(String altele) {
		this.altele = altele;
	}

	public String getMagSafe2() {
		return magSafe2;
	}

	public void setMagSafe2(String magSafe2) {
		this.magSafe2 = magSafe2;
	}

	public String getBaterie() {
		return baterie;
	}

	public void setBaterie(String baterie) {
		this.baterie = baterie;
	}

	public int getCapacitateBateriemAh() {
		return capacitateBateriemAh;
	}

	public void setCapacitateBateriemAh(int capacitateBateriemAh) {
		this.capacitateBateriemAh = capacitateBateriemAh;
	}

	public String getNumarCeluleBaterie() {
		return numarCeluleBaterie;
	}

	public void setNumarCeluleBaterie(String numarCeluleBaterie) {
		this.numarCeluleBaterie = numarCeluleBaterie;
	}

	public String getAutonomieBaterie() {
		return autonomieBaterie;
	}

	public void setAutonomieBaterie(String autonomieBaterie) {
		this.autonomieBaterie = autonomieBaterie;
	}

	public String getSistemDeOperare() {
		return sistemDeOperare;
	}

	public void setSistemDeOperare(String sistemDeOperare) {
		this.sistemDeOperare = sistemDeOperare;
	}

	public int getBitiSistemOperare() {
		return bitiSistemOperare;
	}

	public void setBitiSistemOperare(int bitiSistemOperare) {
		this.bitiSistemOperare = bitiSistemOperare;
	}

	public String getAlteSoftware() {
		return alteSoftware;
	}

	public void setAlteSoftware(String alteSoftware) {
		this.alteSoftware = alteSoftware;
	}

	public String getTastaturaIluminata() {
		return tastaturaIluminata;
	}

	public void setTastaturaIluminata(String tastaturaIluminata) {
		this.tastaturaIluminata = tastaturaIluminata;
	}

	public String getTastaturaNumerica() {
		return tastaturaNumerica;
	}

	public void setTastaturaNumerica(String tastaturaNumerica) {
		this.tastaturaNumerica = tastaturaNumerica;
	}

	public String getLayoutTastatura() {
		return layoutTastatura;
	}

	public void setLayoutTastatura(String layoutTastatura) {
		this.layoutTastatura = layoutTastatura;
	}

	public String getFacilitati() {
		return facilitati;
	}

	public void setFacilitati(String facilitati) {
		this.facilitati = facilitati;
	}

	public String getSecuritate() {
		return securitate;
	}

	public void setSecuritate(String securitate) {
		this.securitate = securitate;
	}

	public String getAccesoriiIncluse() {
		return accesoriiIncluse;
	}

	public void setAccesoriiIncluse(String accesoriiIncluse) {
		this.accesoriiIncluse = accesoriiIncluse;
	}

	public String getCarcasa() {
		return carcasa;
	}

	public void setCarcasa(String carcasa) {
		this.carcasa = carcasa;
	}

	public String getGarantieDeConformitate() {
		return garantieDeConformitate;
	}

	public void setGarantieDeConformitate(String garantieDeConformitate) {
		this.garantieDeConformitate = garantieDeConformitate;
	}

	public String getGarantieComerciala() {
		return garantieComerciala;
	}

	public void setGarantieComerciala(String garantieComerciala) {
		this.garantieComerciala = garantieComerciala;
	}

	public String getDimensiuniLxAxIcm() {
		return dimensiuniLxAxIcm;
	}

	public void setDimensiuniLxAxIcm(String dimensiuniLxAxIcm) {
		this.dimensiuniLxAxIcm = dimensiuniLxAxIcm;
	}

	public String getCuloare() {
		return culoare;
	}

	public void setCuloare(String culoare) {
		this.culoare = culoare;
	}

	public double getGreutateKg() {
		return greutateKg;
	}

	public void setGreutateKg(double greutateKg) {
		this.greutateKg = greutateKg;
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
	
//	public ArrayList<String> getBrandList() {
//		return brandList;
//	}
//
//	public void setBrandList(ArrayList<String> brandList) {
//		this.brandList = brandList;
//	}
//
//	public ArrayList<String> getRezolutieEcranList() {
//		return rezolutieEcranList;
//	}
//
//	public void setRezolutieEcranList(ArrayList<String> rezolutieEcranList) {
//		this.rezolutieEcranList = rezolutieEcranList;
//	}
//
//	public ArrayList<Double> getDimensiuneEcranInchList() {
//		return dimensiuneEcranInchList;
//	}
//
//	public void setDimensiuneEcranInchList(ArrayList<Double> dimensiuneEcranInchList) {
//		this.dimensiuneEcranInchList = dimensiuneEcranInchList;
//	}
//
//	public ArrayList<String> getTipProcesorList() {
//		return tipProcesorList;
//	}
//
//	public void setTipProcesorList(ArrayList<String> tipProcesorList) {
//		this.tipProcesorList = tipProcesorList;
//	}
//
//	public ArrayList<Double> getFrecventaProcesorGHzList() {
//		return frecventaProcesorGHzList;
//	}
//
//	public void setFrecventaProcesorGHzList(ArrayList<Double> frecventaProcesorGHzList) {
//		this.frecventaProcesorGHzList = frecventaProcesorGHzList;
//	}
//
//	public ArrayList<Integer> getCapacitateRAMList() {
//		return capacitateRAMList;
//	}
//
//	public void setCapacitateRAMList(ArrayList<Integer> capacitateRAMList) {
//		this.capacitateRAMList = capacitateRAMList;
//	}
//
//	public ArrayList<String> getCuloareList() {
//		return culoareList;
//	}
//
//	public void setCuloareList(ArrayList<String> culoareList) {
//		this.culoareList = culoareList;
//	}
    	
}
