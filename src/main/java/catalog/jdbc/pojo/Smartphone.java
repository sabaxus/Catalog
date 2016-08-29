package catalog.jdbc.pojo;

import java.util.ArrayList;

public class Smartphone {
	
	private int id;
	private String nume;
	private String specificatii;
	private int cantitate;
	private double pret;
	private String inStoc;
	private String retea2G;
	private String retea3G;
	private String retea4G;
	private String dualSim;
	private String sim;
	private String tipEcran;
	private double dimensiuneEcranInch;
	private String rezolutieEcranPixeli;
	private String multitouch;
	private String culoriEcran;
	private String protectieEcran;
	private String suneteAlerta;
	private String difuzor;
	private String facilitatiSunet;
	private int memorieInternaGB;
	private int memorieRAMMB;
	private String slotCard;
	private int capacitateMaximaCardMemorieGB;
	private String gprs;
	private String edge;
	private String vitezaDate;
	private String wlan;
	private String bluetooth;
	private String usb;
	private String nfc;
	private String portInfrared;
	private String rezolutieFotoVideoMp;
	private String rezolutieFotografie;
	private String rezolutieVideo;
	private String senzorImagine;
	private String blitz;
	private String focus;
	private String cameraSecundara;
	private String facilitatiFotoVideo;
	private String tipProcesor;
	private String modelProcesor;
	private String frecventaProcesorGHz;
	private String procesorGrafic;
	private String sistemDeOperare;
	private String variantaSistemOperare;
	private String senzori;
	private String mesagerie;
	private String browser;
	private String radio;
	private String gps;
	private String aplicatii;
	private String alteFacilitati;
	private String tipBaterie;
	private String autonomieConvorbire;
	private String autonomieStandby;
	private int capacitateBateriemAh;
	private String culoare;
	private String dimensiuni;
	private int greutateg;
	private String garantieComerciala;
	private String garantieDeConformitate;
	private String brand;
	
	private ArrayList<String> photo;
	
	public Smartphone(){
		this.photo = new ArrayList<>();
	}
	
	public Smartphone(String nume){
		this.nume=nume;
		this.photo = new ArrayList<>();
	}

	public Smartphone(int id, String nume, String specificatii, int cantitate, double pret, String inStoc,
			String retea2g, String retea3g, String retea4g, String dualSim, String sim, String tipEcran,
			double dimensiuneEcranInch, String rezolutieEcranPixeli, String multitouch, String culoriEcran,
			String protectieEcran, String suneteAlerta, String difuzor, String facilitatiSunet, int memorieInternaGB,
			int memorieRAMMB, String slotCard, int capacitateMaximaCardMemorieGB, String gprs, String edge,
			String vitezaDate, String wlan, String bluetooth, String usb, String nfc, String portInfrared,
			String rezolutieFotoVideoMp, String rezolutieFotografie, String rezolutieVideo, String senzorImagine,
			String blitz, String focus, String cameraSecundara, String facilitatiFotoVideo, String tipProcesor,
			String modelProcesor, String frecventaProcesorGHz, String procesorGrafic, String sistemDeOperare,
			String variantaSistemOperare, String senzori, String mesagerie, String browser, String radio, String gps,
			String aplicatii, String alteFacilitati, String tipBaterie, String autonomieConvorbire,
			String autonomieStandby, int capacitateBateriemAh, String culoare, String dimensiuni, int greutateg,
			String garantieComerciala, String garantieDeConformitate, String brand) {
		
		this.id = id;
		this.nume = nume;
		this.specificatii = specificatii;
		this.cantitate = cantitate;
		this.pret = pret;
		this.inStoc = inStoc;
		this.retea2G = retea2g;
		this.retea3G = retea3g;
		this.retea4G = retea4g;
		this.dualSim = dualSim;
		this.sim = sim;
		this.tipEcran = tipEcran;
		this.dimensiuneEcranInch = dimensiuneEcranInch;
		this.rezolutieEcranPixeli = rezolutieEcranPixeli;
		this.multitouch = multitouch;
		this.culoriEcran = culoriEcran;
		this.protectieEcran = protectieEcran;
		this.suneteAlerta = suneteAlerta;
		this.difuzor = difuzor;
		this.facilitatiSunet = facilitatiSunet;
		this.memorieInternaGB = memorieInternaGB;
		this.memorieRAMMB = memorieRAMMB;
		this.slotCard = slotCard;
		this.capacitateMaximaCardMemorieGB = capacitateMaximaCardMemorieGB;
		this.gprs = gprs;
		this.edge = edge;
		this.vitezaDate = vitezaDate;
		this.wlan = wlan;
		this.bluetooth = bluetooth;
		this.usb = usb;
		this.nfc = nfc;
		this.portInfrared = portInfrared;
		this.rezolutieFotoVideoMp = rezolutieFotoVideoMp;
		this.rezolutieFotografie = rezolutieFotografie;
		this.rezolutieVideo = rezolutieVideo;
		this.senzorImagine = senzorImagine;
		this.blitz = blitz;
		this.focus = focus;
		this.cameraSecundara = cameraSecundara;
		this.facilitatiFotoVideo = facilitatiFotoVideo;
		this.tipProcesor = tipProcesor;
		this.modelProcesor = modelProcesor;
		this.frecventaProcesorGHz = frecventaProcesorGHz;
		this.procesorGrafic = procesorGrafic;
		this.sistemDeOperare = sistemDeOperare;
		this.variantaSistemOperare = variantaSistemOperare;
		this.senzori = senzori;
		this.mesagerie = mesagerie;
		this.browser = browser;
		this.radio = radio;
		this.gps = gps;
		this.aplicatii = aplicatii;
		this.alteFacilitati = alteFacilitati;
		this.tipBaterie = tipBaterie;
		this.autonomieConvorbire = autonomieConvorbire;
		this.autonomieStandby = autonomieStandby;
		this.capacitateBateriemAh = capacitateBateriemAh;
		this.culoare = culoare;
		this.dimensiuni = dimensiuni;
		this.greutateg = greutateg;
		this.garantieComerciala = garantieComerciala;
		this.garantieDeConformitate = garantieDeConformitate;
		this.brand = brand;
		
		this.photo = new ArrayList<>();
	}
	
	public Smartphone(String nume, String specificatii, int cantitate, double pret, String inStoc,
			String retea2g, String retea3g, String retea4g, String dualSim, String sim, String tipEcran,
			double dimensiuneEcranInch, String rezolutieEcranPixeli, String multitouch, String culoriEcran,
			String protectieEcran, String suneteAlerta, String difuzor, String facilitatiSunet, int memorieInternaGB,
			int memorieRAMMB, String slotCard, int capacitateMaximaCardMemorieGB, String gprs, String edge,
			String vitezaDate, String wlan, String bluetooth, String usb, String nfc, String portInfrared,
			String rezolutieFotoVideoMp, String rezolutieFotografie, String rezolutieVideo, String senzorImagine,
			String blitz, String focus, String cameraSecundara, String facilitatiFotoVideo, String tipProcesor,
			String modelProcesor, String frecventaProcesorGHz, String procesorGrafic, String sistemDeOperare,
			String variantaSistemOperare, String senzori, String mesagerie, String browser, String radio, String gps,
			String aplicatii, String alteFacilitati, String tipBaterie, String autonomieConvorbire,
			String autonomieStandby, int capacitateBateriemAh, String culoare, String dimensiuni, int greutateg,
			String garantieComerciala, String garantieDeConformitate, String brand) {
		
		this.nume = nume;
		this.specificatii = specificatii;
		this.cantitate = cantitate;
		this.pret = pret;
		this.inStoc = inStoc;
		this.retea2G = retea2g;
		this.retea3G = retea3g;
		this.retea4G = retea4g;
		this.dualSim = dualSim;
		this.sim = sim;
		this.tipEcran = tipEcran;
		this.dimensiuneEcranInch = dimensiuneEcranInch;
		this.rezolutieEcranPixeli = rezolutieEcranPixeli;
		this.multitouch = multitouch;
		this.culoriEcran = culoriEcran;
		this.protectieEcran = protectieEcran;
		this.suneteAlerta = suneteAlerta;
		this.difuzor = difuzor;
		this.facilitatiSunet = facilitatiSunet;
		this.memorieInternaGB = memorieInternaGB;
		this.memorieRAMMB = memorieRAMMB;
		this.slotCard = slotCard;
		this.capacitateMaximaCardMemorieGB = capacitateMaximaCardMemorieGB;
		this.gprs = gprs;
		this.edge = edge;
		this.vitezaDate = vitezaDate;
		this.wlan = wlan;
		this.bluetooth = bluetooth;
		this.usb = usb;
		this.nfc = nfc;
		this.portInfrared = portInfrared;
		this.rezolutieFotoVideoMp = rezolutieFotoVideoMp;
		this.rezolutieFotografie = rezolutieFotografie;
		this.rezolutieVideo = rezolutieVideo;
		this.senzorImagine = senzorImagine;
		this.blitz = blitz;
		this.focus = focus;
		this.cameraSecundara = cameraSecundara;
		this.facilitatiFotoVideo = facilitatiFotoVideo;
		this.tipProcesor = tipProcesor;
		this.modelProcesor = modelProcesor;
		this.frecventaProcesorGHz = frecventaProcesorGHz;
		this.procesorGrafic = procesorGrafic;
		this.sistemDeOperare = sistemDeOperare;
		this.variantaSistemOperare = variantaSistemOperare;
		this.senzori = senzori;
		this.mesagerie = mesagerie;
		this.browser = browser;
		this.radio = radio;
		this.gps = gps;
		this.aplicatii = aplicatii;
		this.alteFacilitati = alteFacilitati;
		this.tipBaterie = tipBaterie;
		this.autonomieConvorbire = autonomieConvorbire;
		this.autonomieStandby = autonomieStandby;
		this.capacitateBateriemAh = capacitateBateriemAh;
		this.culoare = culoare;
		this.dimensiuni = dimensiuni;
		this.greutateg = greutateg;
		this.garantieComerciala = garantieComerciala;
		this.garantieDeConformitate = garantieDeConformitate;
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

	public String getRetea2G() {
		return retea2G;
	}

	public void setRetea2G(String retea2g) {
		retea2G = retea2g;
	}

	public String getRetea3G() {
		return retea3G;
	}

	public void setRetea3G(String retea3g) {
		retea3G = retea3g;
	}

	public String getRetea4G() {
		return retea4G;
	}

	public void setRetea4G(String retea4g) {
		retea4G = retea4g;
	}

	public String getDualSim() {
		return dualSim;
	}

	public void setDualSim(String dualSim) {
		this.dualSim = dualSim;
	}

	public String getSim() {
		return sim;
	}

	public void setSim(String sim) {
		this.sim = sim;
	}

	public String getTipEcran() {
		return tipEcran;
	}

	public void setTipEcran(String tipEcran) {
		this.tipEcran = tipEcran;
	}

	public double getDimensiuneEcranInch() {
		return dimensiuneEcranInch;
	}

	public void setDimensiuneEcranInch(double dimensiuneEcranInch) {
		this.dimensiuneEcranInch = dimensiuneEcranInch;
	}

	public String getRezolutieEcranPixeli() {
		return rezolutieEcranPixeli;
	}

	public void setRezolutieEcranPixeli(String rezolutieEcranPixeli) {
		this.rezolutieEcranPixeli = rezolutieEcranPixeli;
	}

	public String getMultitouch() {
		return multitouch;
	}

	public void setMultitouch(String multitouch) {
		this.multitouch = multitouch;
	}

	public String getCuloriEcran() {
		return culoriEcran;
	}

	public void setCuloriEcran(String culoriEcran) {
		this.culoriEcran = culoriEcran;
	}

	public String getProtectieEcran() {
		return protectieEcran;
	}

	public void setProtectieEcran(String protectieEcran) {
		this.protectieEcran = protectieEcran;
	}

	public String getSuneteAlerta() {
		return suneteAlerta;
	}

	public void setSuneteAlerta(String suneteAlerta) {
		this.suneteAlerta = suneteAlerta;
	}

	public String getDifuzor() {
		return difuzor;
	}

	public void setDifuzor(String difuzor) {
		this.difuzor = difuzor;
	}

	public String getFacilitatiSunet() {
		return facilitatiSunet;
	}

	public void setFacilitatiSunet(String facilitatiSunet) {
		this.facilitatiSunet = facilitatiSunet;
	}

	public int getMemorieInternaGB() {
		return memorieInternaGB;
	}

	public void setMemorieInternaGB(int memorieInternaGB) {
		this.memorieInternaGB = memorieInternaGB;
	}

	public int getMemorieRAMMB() {
		return memorieRAMMB;
	}

	public void setMemorieRAMMB(int memorieRAMMB) {
		this.memorieRAMMB = memorieRAMMB;
	}

	public String getSlotCard() {
		return slotCard;
	}

	public void setSlotCard(String slotCard) {
		this.slotCard = slotCard;
	}

	public int getCapacitateMaximaCardMemorieGB() {
		return capacitateMaximaCardMemorieGB;
	}

	public void setCapacitateMaximaCardMemorieGB(int capacitateMaximaCardMemorieGB) {
		this.capacitateMaximaCardMemorieGB = capacitateMaximaCardMemorieGB;
	}

	public String getGprs() {
		return gprs;
	}

	public void setGprs(String gprs) {
		this.gprs = gprs;
	}

	public String getEdge() {
		return edge;
	}

	public void setEdge(String edge) {
		this.edge = edge;
	}

	public String getVitezaDate() {
		return vitezaDate;
	}

	public void setVitezaDate(String vitezaDate) {
		this.vitezaDate = vitezaDate;
	}

	public String getWlan() {
		return wlan;
	}

	public void setWlan(String wlan) {
		this.wlan = wlan;
	}

	public String getBluetooth() {
		return bluetooth;
	}

	public void setBluetooth(String bluetooth) {
		this.bluetooth = bluetooth;
	}

	public String getUsb() {
		return usb;
	}

	public void setUsb(String usb) {
		this.usb = usb;
	}

	public String getNfc() {
		return nfc;
	}

	public void setNfc(String nfc) {
		this.nfc = nfc;
	}

	public String getPortInfrared() {
		return portInfrared;
	}

	public void setPortInfrared(String portInfrared) {
		this.portInfrared = portInfrared;
	}

	public String getRezolutieFotoVideoMp() {
		return rezolutieFotoVideoMp;
	}

	public void setRezolutieFotoVideoMp(String rezolutieFotoVideoMp) {
		this.rezolutieFotoVideoMp = rezolutieFotoVideoMp;
	}

	public String getRezolutieFotografie() {
		return rezolutieFotografie;
	}

	public void setRezolutieFotografie(String rezolutieFotografie) {
		this.rezolutieFotografie = rezolutieFotografie;
	}

	public String getRezolutieVideo() {
		return rezolutieVideo;
	}

	public void setRezolutieVideo(String rezolutieVideo) {
		this.rezolutieVideo = rezolutieVideo;
	}

	public String getSenzorImagine() {
		return senzorImagine;
	}

	public void setSenzorImagine(String senzorImagine) {
		this.senzorImagine = senzorImagine;
	}

	public String getBlitz() {
		return blitz;
	}

	public void setBlitz(String blitz) {
		this.blitz = blitz;
	}

	public String getFocus() {
		return focus;
	}

	public void setFocus(String focus) {
		this.focus = focus;
	}

	public String getCameraSecundara() {
		return cameraSecundara;
	}

	public void setCameraSecundara(String cameraSecundara) {
		this.cameraSecundara = cameraSecundara;
	}

	public String getFacilitatiFotoVideo() {
		return facilitatiFotoVideo;
	}

	public void setFacilitatiFotoVideo(String facilitatiFotoVideo) {
		this.facilitatiFotoVideo = facilitatiFotoVideo;
	}

	public String getTipProcesor() {
		return tipProcesor;
	}

	public void setTipProcesor(String tipProcesor) {
		this.tipProcesor = tipProcesor;
	}

	public String getModelProcesor() {
		return modelProcesor;
	}

	public void setModelProcesor(String modelProcesor) {
		this.modelProcesor = modelProcesor;
	}

	public String getFrecventaProcesorGHz() {
		return frecventaProcesorGHz;
	}

	public void setFrecventaProcesorGHz(String frecventaProcesorGHz) {
		this.frecventaProcesorGHz = frecventaProcesorGHz;
	}

	public String getProcesorGrafic() {
		return procesorGrafic;
	}

	public void setProcesorGrafic(String procesorGrafic) {
		this.procesorGrafic = procesorGrafic;
	}

	public String getSistemDeOperare() {
		return sistemDeOperare;
	}

	public void setSistemDeOperare(String sistemDeOperare) {
		this.sistemDeOperare = sistemDeOperare;
	}

	public String getVariantaSistemOperare() {
		return variantaSistemOperare;
	}

	public void setVariantaSistemOperare(String variantaSistemOperare) {
		this.variantaSistemOperare = variantaSistemOperare;
	}

	public String getSenzori() {
		return senzori;
	}

	public void setSenzori(String senzori) {
		this.senzori = senzori;
	}

	public String getMesagerie() {
		return mesagerie;
	}

	public void setMesagerie(String mesagerie) {
		this.mesagerie = mesagerie;
	}

	public String getBrowser() {
		return browser;
	}

	public void setBrowser(String browser) {
		this.browser = browser;
	}

	public String getRadio() {
		return radio;
	}

	public void setRadio(String radio) {
		this.radio = radio;
	}

	public String getGps() {
		return gps;
	}

	public void setGps(String gps) {
		this.gps = gps;
	}

	public String getAplicatii() {
		return aplicatii;
	}

	public void setAplicatii(String aplicatii) {
		this.aplicatii = aplicatii;
	}

	public String getAlteFacilitati() {
		return alteFacilitati;
	}

	public void setAlteFacilitati(String alteFacilitati) {
		this.alteFacilitati = alteFacilitati;
	}

	public String getTipBaterie() {
		return tipBaterie;
	}

	public void setTipBaterie(String tipBaterie) {
		this.tipBaterie = tipBaterie;
	}

	public String getAutonomieConvorbire() {
		return autonomieConvorbire;
	}

	public void setAutonomieConvorbire(String autonomieConvorbire) {
		this.autonomieConvorbire = autonomieConvorbire;
	}

	public String getAutonomieStandby() {
		return autonomieStandby;
	}

	public void setAutonomieStandby(String autonomieStandby) {
		this.autonomieStandby = autonomieStandby;
	}

	public int getCapacitateBateriemAh() {
		return capacitateBateriemAh;
	}

	public void setCapacitateBateriemAh(int capacitateBateriemAh) {
		this.capacitateBateriemAh = capacitateBateriemAh;
	}

	public String getCuloare() {
		return culoare;
	}

	public void setCuloare(String culoare) {
		this.culoare = culoare;
	}

	public String getDimensiuni() {
		return dimensiuni;
	}

	public void setDimensiuni(String dimensiuni) {
		this.dimensiuni = dimensiuni;
	}

	public int getGreutateg() {
		return greutateg;
	}

	public void setGreutateg(int greutateg) {
		this.greutateg = greutateg;
	}

	public String getGarantieComerciala() {
		return garantieComerciala;
	}

	public void setGarantieComerciala(String garantieComerciala) {
		this.garantieComerciala = garantieComerciala;
	}

	public String getGarantieDeConformitate() {
		return garantieDeConformitate;
	}

	public void setGarantieDeConformitate(String garantieDeConformitate) {
		this.garantieDeConformitate = garantieDeConformitate;
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
