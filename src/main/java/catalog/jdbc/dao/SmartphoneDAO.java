package catalog.jdbc.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;

import catalog.jdbc.helper.DBHelper;
import catalog.jdbc.pojo.Smartphone;

public class SmartphoneDAO {
	
	public static void createSmartphone(Smartphone phone) throws SQLException {
		final String sql = "INSERT INTO catalog.smartphone (Nume, Specificatii, Cantitate, Pret, In_stoc, Retea_2G, Retea_3G, Retea_4G, Dual_Sim, SIM, Tip_ecran, Dimensiune_ecran_inch, Rezolutie_ecran_pixeli, Multitouch, Culori_ecran, Protectie_ecran, Sunete_alerta, Difuzor, Facilitati_sunet, Memorie_interna_GB, Memorie_RAM_MB, Slot_card, Capacitate_maxima_card_memorie_GB, GPRS, EDGE, Viteza_date, WLAN, Bluetooth, USB, NFC, Port_Infrared, Rezolutie_Foto_Video_Mp, Rezolutie_fotografie, Rezolutie_video, Senzor_imagine, Blitz, Focus, Camera_secundara, Facilitati_Foto_Video, Tip_procesor, Model_procesor, Frecventa_procesor_GHz, Procesor_grafic, Sistem_de_operare, Varianta_sistem_operare, Senzori, Mesagerie, Browser, Radio, GPS, Aplicatii, Alte_facilitati, Tip_baterie, Autonomie_convorbire, Autonomie_standby, Capacitate_baterie_mAh, Culoare, Dimensiuni, Greutate_g, Garantie_comerciala, Garantie_de_conformitate, Brand) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
		
		pstmt.setString(1, phone.getNume());
		pstmt.setString(2, phone.getSpecificatii());
		pstmt.setInt(3, phone.getCantitate());
		pstmt.setDouble(4, phone.getPret());
		pstmt.setString(5, phone.getInStoc());
		pstmt.setString(6, phone.getRetea2G());
		pstmt.setString(7, phone.getRetea3G());
		pstmt.setString(8, phone.getRetea4G());
		pstmt.setString(9, phone.getDualSim());
		pstmt.setString(10, phone.getSim());
		pstmt.setString(11, phone.getTipEcran());
		pstmt.setDouble(12, phone.getDimensiuneEcranInch());
		pstmt.setString(13, phone.getRezolutieEcranPixeli());
		pstmt.setString(14, phone.getMultitouch());
		pstmt.setString(15, phone.getCuloriEcran());
		pstmt.setString(16, phone.getProtectieEcran());
		pstmt.setString(17, phone.getSuneteAlerta());
		pstmt.setString(18, phone.getDifuzor());
		pstmt.setString(19, phone.getFacilitatiSunet());
		pstmt.setInt(20, phone.getMemorieInternaGB());
		pstmt.setInt(21, phone.getMemorieRAMMB());
		pstmt.setString(22, phone.getSlotCard());
		pstmt.setInt(23, phone.getCapacitateMaximaCardMemorieGB());
		pstmt.setString(24, phone.getGprs());
		pstmt.setString(25, phone.getEdge());
		pstmt.setString(26, phone.getVitezaDate());
		pstmt.setString(27, phone.getWlan());
		pstmt.setString(28, phone.getBluetooth());
		pstmt.setString(29, phone.getUsb());
		pstmt.setString(30, phone.getNfc());
		pstmt.setString(31, phone.getPortInfrared());
		pstmt.setString(32, phone.getRezolutieFotoVideoMp());
		pstmt.setString(33, phone.getRezolutieFotografie());
		pstmt.setString(34, phone.getRezolutieVideo());
		pstmt.setString(35, phone.getSenzorImagine());
		pstmt.setString(36, phone.getBlitz());
		pstmt.setString(37, phone.getFocus());
		pstmt.setString(38, phone.getCameraSecundara());
		pstmt.setString(39, phone.getFacilitatiFotoVideo());
		pstmt.setString(40, phone.getTipProcesor());
		pstmt.setString(41, phone.getModelProcesor());
		pstmt.setString(42, phone.getFrecventaProcesorGHz());
		pstmt.setString(43, phone.getProcesorGrafic());
		pstmt.setString(44, phone.getSistemDeOperare());
		pstmt.setString(45, phone.getVariantaSistemOperare());
		pstmt.setString(46, phone.getSenzori());
		pstmt.setString(47, phone.getMesagerie());
		pstmt.setString(48, phone.getBrowser());
		pstmt.setString(49, phone.getRadio());
		pstmt.setString(50, phone.getGps());
		pstmt.setString(51, phone.getAplicatii());
		pstmt.setString(52, phone.getAlteFacilitati());
		pstmt.setString(53, phone.getTipBaterie());
		pstmt.setString(54, phone.getAutonomieConvorbire());
		pstmt.setString(55, phone.getAutonomieStandby());
		pstmt.setInt(56, phone.getCapacitateBateriemAh());
		pstmt.setString(57, phone.getCuloare());
		pstmt.setString(58, phone.getDimensiuni());
		pstmt.setInt(59, phone.getGreutateg());
		pstmt.setString(60, phone.getGarantieComerciala());
		pstmt.setString(61, phone.getGarantieDeConformitate());
		pstmt.setString(62, phone.getBrand());
				
		pstmt.executeUpdate();
		ResultSet rs = pstmt.getGeneratedKeys();
		if (rs.next()) {
			phone.setId(rs.getInt(1));
		}
		DBHelper.closeConnection(conn);

	}
	
	public static Smartphone createSmartphone(String nume, String specificatii, int cantitate, double pret, String inStoc, String retea2G, String retea3G, String retea4G, String dualSim, String sim,	String tipEcran, double dimensiuneEcranInch, String rezolutieEcranPixeli, String multitouch, String culoriEcran, String protectieEcran, String suneteAlerta, String difuzor, String facilitatiSunet, int memorieInternaGB, int memorieRAMMB, String slotCard, int capacitateMaximaCardMemorieGB, String gprs, String edge, String vitezaDate, String wlan, String bluetooth, String usb, String nfc, String portInfrared, String rezolutieFotoVideoMp, String rezolutieFotografie, String rezolutieVideo, String senzorImagine, String blitz, String focus, String cameraSecundara, String facilitatiFotoVideo, String tipProcesor, String modelProcesor, String frecventaProcesorGHz, String procesorGrafic, String sistemDeOperare, String variantaSistemOperare, String senzori, String mesagerie, String browser, String radio, String gps, String aplicatii, String alteFacilitati, String tipBaterie, String autonomieConvorbire, String autonomieStandby, int capacitateBateriemAh, String culoare, String dimensiuni, int greutateg, String garantieComerciala, String garantieDeConformitate, String brand) throws SQLException {
		
		final String sql = "INSERT INTO catalog.smartphone (Nume, Specificatii, Cantitate, Pret, In_stoc, Retea_2G, Retea_3G, Retea_4G, Dual_Sim, SIM, Tip_ecran, Dimensiune_ecran_inch, Rezolutie_ecran_pixeli, Multitouch, Culori_ecran, Protectie_ecran, Sunete_alerta, Difuzor, Facilitati_sunet, Memorie_interna_GB, Memorie_RAM_MB, Slot_card, Capacitate_maxima_card_memorie_GB, GPRS, EDGE, Viteza_date, WLAN, Bluetooth, USB, NFC, Port_Infrared, Rezolutie_Foto_Video_Mp, Rezolutie_fotografie, Rezolutie_video, Senzor_imagine, Blitz, Focus, Camera_secundara, Facilitati_Foto_Video, Tip_procesor, Model_procesor, Frecventa_procesor_GHz, Procesor_grafic, Sistem_de_operare, Varianta_sistem_operare, Senzori, Mesagerie, Browser, Radio, GPS, Aplicatii, Alte_facilitati, Tip_baterie, Autonomie_convorbire, Autonomie_standby, Capacitate_baterie_mAh, Culoare, Dimensiuni, Greutate_g, Garantie_comerciala, Garantie_de_conformitate, Brand) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
		
		pstmt.setString(1, nume);
		pstmt.setString(2, specificatii);
		pstmt.setInt(3, cantitate);
		pstmt.setDouble(4, pret);
		pstmt.setString(5, inStoc);
		pstmt.setString(6, retea2G);
		pstmt.setString(7, retea3G);
		pstmt.setString(8, retea4G);
		pstmt.setString(9, dualSim);
		pstmt.setString(10, sim);
		pstmt.setString(11, tipEcran);
		pstmt.setDouble(12, dimensiuneEcranInch);
		pstmt.setString(13, rezolutieEcranPixeli);
		pstmt.setString(14, multitouch);
		pstmt.setString(15, culoriEcran);
		pstmt.setString(16, protectieEcran);
		pstmt.setString(17, suneteAlerta);
		pstmt.setString(18, difuzor);
		pstmt.setString(19, facilitatiSunet);
		pstmt.setInt(20, memorieInternaGB);
		pstmt.setInt(21, memorieRAMMB);
		pstmt.setString(22, slotCard);
		pstmt.setInt(23, capacitateMaximaCardMemorieGB);
		pstmt.setString(24, gprs);
		pstmt.setString(25, edge);
		pstmt.setString(26, vitezaDate);
		pstmt.setString(27, wlan);
		pstmt.setString(28, bluetooth);
		pstmt.setString(29, usb);
		pstmt.setString(30, nfc);
		pstmt.setString(31, portInfrared);
		pstmt.setString(32, rezolutieFotoVideoMp);
		pstmt.setString(33, rezolutieFotografie);
		pstmt.setString(34, rezolutieVideo);
		pstmt.setString(35, senzorImagine);
		pstmt.setString(36, blitz);
		pstmt.setString(37, focus);
		pstmt.setString(38, cameraSecundara);
		pstmt.setString(39, facilitatiFotoVideo);
		pstmt.setString(40, tipProcesor);
		pstmt.setString(41, modelProcesor);
		pstmt.setString(42, frecventaProcesorGHz);
		pstmt.setString(43, procesorGrafic);
		pstmt.setString(44, sistemDeOperare);
		pstmt.setString(45, variantaSistemOperare);
		pstmt.setString(46, senzori);
		pstmt.setString(47, mesagerie);
		pstmt.setString(48, browser);
		pstmt.setString(49, radio);
		pstmt.setString(50, gps);
		pstmt.setString(51, aplicatii);
		pstmt.setString(52, alteFacilitati);
		pstmt.setString(53, tipBaterie);
		pstmt.setString(54, autonomieConvorbire);
		pstmt.setString(55, autonomieStandby);
		pstmt.setInt(56, capacitateBateriemAh);
		pstmt.setString(57, culoare);
		pstmt.setString(58, dimensiuni);
		pstmt.setInt(59, greutateg);
		pstmt.setString(60, garantieComerciala);
		pstmt.setString(61, garantieDeConformitate);
		pstmt.setString(62, brand);
		
		pstmt.executeUpdate();
		
		Smartphone phone=new Smartphone(nume, specificatii, cantitate, pret, inStoc, retea2G, retea3G, retea4G, dualSim, sim, tipEcran, dimensiuneEcranInch, rezolutieEcranPixeli, multitouch, culoriEcran, protectieEcran, suneteAlerta, difuzor, facilitatiSunet, memorieInternaGB, memorieRAMMB, slotCard, capacitateMaximaCardMemorieGB, gprs, edge, vitezaDate, wlan, bluetooth, usb, nfc, portInfrared, rezolutieFotoVideoMp, rezolutieFotografie, rezolutieVideo, senzorImagine, blitz, focus, cameraSecundara, facilitatiFotoVideo, tipProcesor, modelProcesor, frecventaProcesorGHz, procesorGrafic, sistemDeOperare, variantaSistemOperare, senzori, mesagerie, browser, radio, gps, aplicatii, alteFacilitati, tipBaterie, autonomieConvorbire, autonomieStandby, capacitateBateriemAh, culoare, dimensiuni, greutateg, garantieComerciala, garantieDeConformitate, brand);
		
		ResultSet rs = pstmt.getGeneratedKeys();
		if (rs.next()) {
			phone.setId(rs.getInt(1));
		}
		DBHelper.closeConnection(conn);
		
		return phone;

	}
/*
	public static void createSmartphone(String nume) throws SQLException {

		Smartphone phone = new Smartphone(nume);
		SmartphoneDAO.createSmartphone(phone);
	}
*/
	public static Smartphone createSmartphone() throws SQLException {

		Smartphone phone = new Smartphone();
		SmartphoneDAO.createSmartphone(phone);
		return phone;
	}
	
	public static void deleteSmartphone(int id) throws SQLException {
		final String sql = "DELETE FROM catalog.smartphone WHERE id=?;";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql);
		pstmt.setInt(1, id);
		pstmt.executeUpdate();
		
		DBHelper.closeConnection(conn);

	}

	public static void deleteSmartphone(Smartphone phone) throws SQLException {
		SmartphoneDAO.deleteSmartphone(phone.getId());
	}

	public static void updateSmartphone(int id, String nume, String specificatii, int cantitate, double pret) throws SQLException {
		final String sql = "UPDATE catalog.smartphone SET Nume=?, Specificatii=?, Cantitate=?, Pret=? WHERE id=?;";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql);
		
		pstmt.setString(1, nume);
		pstmt.setString(2, specificatii);
		pstmt.setInt(3, cantitate);
		pstmt.setDouble(4, pret);
		pstmt.setInt(5, id);
		
		pstmt.executeUpdate();
		
		DBHelper.closeConnection(conn);
	}
	
	public static void updateSmartphone(int id, String nume, String specificatii, int cantitate, double pret, String inStoc, String retea2G, String retea3G, String retea4G, String dualSim, String sim,	String tipEcran, double dimensiuneEcranInch, String rezolutieEcranPixeli, String multitouch, String culoriEcran, String protectieEcran, String suneteAlerta, String difuzor, String facilitatiSunet, int memorieInternaGB, int memorieRAMMB, String slotCard, int capacitateMaximaCardMemorieGB, String gprs, String edge, String vitezaDate, String wlan, String bluetooth, String usb, String nfc, String portInfrared, String rezolutieFotoVideoMp, String rezolutieFotografie, String rezolutieVideo, String senzorImagine, String blitz, String focus, String cameraSecundara, String facilitatiFotoVideo, String tipProcesor, String modelProcesor, String frecventaProcesorGHz, String procesorGrafic, String sistemDeOperare, String variantaSistemOperare, String senzori, String mesagerie, String browser, String radio, String gps, String aplicatii, String alteFacilitati, String tipBaterie, String autonomieConvorbire, String autonomieStandby, int capacitateBateriemAh, String culoare, String dimensiuni, int greutateg, String garantieComerciala, String garantieDeConformitate, String brand) throws SQLException {
		
		final String sql1 = "UPDATE catalog.smartphone SET Nume=?, Specificatii=?, Cantitate=?, Pret=?, In_stoc=?, Retea_2G=?, Retea_3G=?, Retea_4G=?, Dual_Sim=?, SIM=?, Tip_ecran=?, Dimensiune_ecran_inch=?, Rezolutie_ecran_pixeli=?, Multitouch=?, Culori_ecran=?, Protectie_ecran=?, Sunete_alerta=?, Difuzor=?, Facilitati_sunet=?, Memorie_interna_GB=?, Memorie_RAM_MB=?, Slot_card=?, Capacitate_maxima_card_memorie_GB=?, GPRS=?, EDGE=?, Viteza_date=?, WLAN=?, Bluetooth=?, USB=?, NFC=?, Port_Infrared=?, Rezolutie_Foto_Video_Mp=?, Rezolutie_fotografie=?, Rezolutie_video=?, Senzor_imagine=?, Blitz=?, Focus=?, Camera_secundara=?, Facilitati_Foto_Video=?, Tip_procesor=?, Model_procesor=?, Frecventa_procesor_GHz=?, Procesor_grafic=?, Sistem_de_operare=?, Varianta_sistem_operare=?, Senzori=?, Mesagerie=?, Browser=?, Radio=?, GPS=?, Aplicatii=?, Alte_facilitati=?, Tip_baterie=?, Autonomie_convorbire=?, Autonomie_standby=?, Capacitate_baterie_mAh=?, Culoare=?, Dimensiuni=?, Greutate_g=?, Garantie_comerciala=?, Garantie_de_conformitate=? Brand=? WHERE id=?;";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql1);
		
		pstmt.setString(1, nume);
		pstmt.setString(2, specificatii);
		pstmt.setInt(3, cantitate);
		pstmt.setDouble(4, pret);
		pstmt.setString(5, inStoc);
		pstmt.setString(6, retea2G);
		pstmt.setString(7, retea3G);
		pstmt.setString(8, retea4G);
		pstmt.setString(9, dualSim);
		pstmt.setString(10, sim);
		pstmt.setString(11, tipEcran);
		pstmt.setDouble(12, dimensiuneEcranInch);
		pstmt.setString(13, rezolutieEcranPixeli);
		pstmt.setString(14, multitouch);
		pstmt.setString(15, culoriEcran);
		pstmt.setString(16, protectieEcran);
		pstmt.setString(17, suneteAlerta);
		pstmt.setString(18, difuzor);
		pstmt.setString(19, facilitatiSunet);
		pstmt.setInt(20, memorieInternaGB);
		pstmt.setInt(21, memorieRAMMB);
		pstmt.setString(22, slotCard);
		pstmt.setInt(23, capacitateMaximaCardMemorieGB);
		pstmt.setString(24, gprs);
		pstmt.setString(25, edge);
		pstmt.setString(26, vitezaDate);
		pstmt.setString(27, wlan);
		pstmt.setString(28, bluetooth);
		pstmt.setString(29, usb);
		pstmt.setString(30, nfc);
		pstmt.setString(31, portInfrared);
		pstmt.setString(32, rezolutieFotoVideoMp);
		pstmt.setString(33, rezolutieFotografie);
		pstmt.setString(34, rezolutieVideo);
		pstmt.setString(35, senzorImagine);
		pstmt.setString(36, blitz);
		pstmt.setString(37, focus);
		pstmt.setString(38, cameraSecundara);
		pstmt.setString(39, facilitatiFotoVideo);
		pstmt.setString(40, tipProcesor);
		pstmt.setString(41, modelProcesor);
		pstmt.setString(42, frecventaProcesorGHz);
		pstmt.setString(43, procesorGrafic);
		pstmt.setString(44, sistemDeOperare);
		pstmt.setString(45, variantaSistemOperare);
		pstmt.setString(46, senzori);
		pstmt.setString(47, mesagerie);
		pstmt.setString(48, browser);
		pstmt.setString(49, radio);
		pstmt.setString(50, gps);
		pstmt.setString(51, aplicatii);
		pstmt.setString(52, alteFacilitati);
		pstmt.setString(53, tipBaterie);
		pstmt.setString(54, autonomieConvorbire);
		pstmt.setString(55, autonomieStandby);
		pstmt.setInt(56, capacitateBateriemAh);
		pstmt.setString(57, culoare);
		pstmt.setString(58, dimensiuni);
		pstmt.setInt(59, greutateg);
		pstmt.setString(60, garantieComerciala);
		pstmt.setString(61, garantieDeConformitate);
		pstmt.setString(62, brand);
		pstmt.setInt(63, id);
		
		pstmt.executeUpdate();
		
		DBHelper.closeConnection(conn);
	}

	public static void updateSmartphone(Smartphone phone) throws SQLException {
		
		SmartphoneDAO.updateSmartphone(phone.getId(), phone.getNume(), phone.getSpecificatii(), phone.getCantitate(), phone.getPret(), phone.getInStoc(), phone.getRetea2G(), phone.getRetea3G(), phone.getRetea4G(), phone.getDualSim(), phone.getSim(), phone.getTipEcran(), phone.getDimensiuneEcranInch(), phone.getRezolutieEcranPixeli(), phone.getMultitouch(), phone.getCuloriEcran(), phone.getProtectieEcran(), phone.getSuneteAlerta(), phone.getDifuzor(), phone.getFacilitatiSunet(), phone.getMemorieInternaGB(), phone.getMemorieRAMMB(), phone.getSlotCard(), phone.getCapacitateMaximaCardMemorieGB(), phone.getGprs(), phone.getEdge(), phone.getVitezaDate(), phone.getWlan(), phone.getBluetooth(), phone.getUsb(), phone.getNfc(), phone.getPortInfrared(), phone.getRezolutieFotoVideoMp(), phone.getRezolutieFotografie(), phone.getRezolutieVideo(), phone.getSenzorImagine(), phone.getBlitz(), phone.getFocus(), phone.getCameraSecundara(), phone.getFacilitatiFotoVideo(), phone.getTipProcesor(), phone.getModelProcesor(), phone.getFrecventaProcesorGHz(), phone.getProcesorGrafic(), phone.getSistemDeOperare(), phone.getVariantaSistemOperare(), phone.getSenzori(), phone.getMesagerie(), phone.getBrowser(), phone.getRadio(), phone.getGps(), phone.getAplicatii(), phone.getAlteFacilitati(), phone.getTipBaterie(), phone.getAutonomieConvorbire(), phone.getAutonomieStandby(), phone.getCapacitateBateriemAh(), phone.getCuloare(), phone.getDimensiuni(), phone.getGreutateg(), phone.getGarantieComerciala(), phone.getGarantieDeConformitate(), phone.getBrand());
	
	}
	
	public static Smartphone getSmartphone(int id) throws SQLException {
		final String sql = "SELECT id, Nume, Specificatii, Cantitate, Pret, In_stoc, Retea_2G, Retea_3G, Retea_4G, Dual_Sim, SIM, Tip_ecran, Dimensiune_ecran_inch, Rezolutie_ecran_pixeli, Multitouch, Culori_ecran, Protectie_ecran, Sunete_alerta, Difuzor, Facilitati_sunet, Memorie_interna_GB, Memorie_RAM_MB, Slot_card, Capacitate_maxima_card_memorie_GB, GPRS, EDGE, Viteza_date, WLAN, Bluetooth, USB, NFC, Port_Infrared, Rezolutie_Foto_Video_Mp, Rezolutie_fotografie, Rezolutie_video, Senzor_imagine, Blitz, Focus, Camera_secundara, Facilitati_Foto_Video, Tip_procesor, Model_procesor, Frecventa_procesor_GHz, Procesor_grafic, Sistem_de_operare, Varianta_sistem_operare, Senzori, Mesagerie, Browser, Radio, GPS, Aplicatii, Alte_facilitati, Tip_baterie, Autonomie_convorbire, Autonomie_standby, Capacitate_baterie_mAh, Culoare, Dimensiuni, Greutate_g, Garantie_comerciala, Garantie_de_conformitate, Brand FROM catalog.smartphone WHERE id=?;";
		Connection conn = DBHelper.openConnection();
		Smartphone phone = new Smartphone();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		pstmt.setInt(1, id);
		ResultSet rs = pstmt.executeQuery();
		
		if (rs.next()) {
			phone.setId(rs.getInt("id"));
			
			if (rs.getString("Nume")==null) {
				phone.setNume("");
			} else phone.setNume(rs.getString("Nume"));
			
			if (rs.getString("Specificatii")==null) {
				phone.setSpecificatii("");
			} else phone.setSpecificatii(rs.getString("Specificatii"));
			
			phone.setCantitate(rs.getInt("Cantitate"));
			phone.setPret(rs.getDouble("Pret"));
			
			if (rs.getString("In_stoc")==null) {
				phone.setInStoc("");
			} else phone.setInStoc(rs.getString("In_stoc"));
			
			if (rs.getString("Retea_2G")==null) {
				phone.setRetea2G("");
			} else phone.setRetea2G(rs.getString("Retea_2G"));
			
			if (rs.getString("Retea_3G")==null) {
				phone.setRetea3G("");
			} else phone.setRetea3G(rs.getString("Retea_3G"));
			
			if (rs.getString("Retea_4G")==null) {
				phone.setRetea4G("");
			} else phone.setRetea4G(rs.getString("Retea_4G"));
			
			if (rs.getString("Dual_Sim")==null) {
				phone.setDualSim("");
			} else phone.setDualSim(rs.getString("Dual_Sim"));
			
			if (rs.getString("SIM")==null) {
				phone.setSim("");
			} else phone.setSim(rs.getString("SIM"));
			
			if (rs.getString("Tip_ecran")==null) {
				phone.setTipEcran("");
			} else phone.setTipEcran(rs.getString("Tip_ecran"));
			
			phone.setDimensiuneEcranInch(rs.getDouble("Dimensiune_ecran_inch"));
			
			if (rs.getString("Rezolutie_ecran_pixeli")==null) {
				phone.setRezolutieEcranPixeli("");
			} else phone.setRezolutieEcranPixeli(rs.getString("Rezolutie_ecran_pixeli"));
			
			if (rs.getString("Multitouch")==null) {
				phone.setMultitouch("");
			} else phone.setMultitouch(rs.getString("Multitouch"));
			
			if (rs.getString("Culori_ecran")==null) {
				phone.setCuloriEcran("");
			} else phone.setCuloriEcran(rs.getString("Culori_ecran"));
			
			if (rs.getString("Protectie_ecran")==null) {
				phone.setProtectieEcran("");
			} else	phone.setProtectieEcran(rs.getString("Protectie_ecran"));
			
			if (rs.getString("Sunete_alerta")==null) {
				phone.setSuneteAlerta("");
			} else	phone.setSuneteAlerta(rs.getString("Sunete_alerta"));
			
			if (rs.getString("Difuzor")==null) {
				phone.setDifuzor("");
			} else phone.setDifuzor(rs.getString("Difuzor"));
			
			if (rs.getString("Facilitati_sunet")==null) {
				phone.setFacilitatiSunet("");
			} else	phone.setFacilitatiSunet(rs.getString("Facilitati_sunet"));
			
			phone.setMemorieInternaGB(rs.getInt("Memorie_interna_GB"));
			phone.setMemorieRAMMB(rs.getInt("Memorie_RAM_MB"));
			
			if (rs.getString("Slot_card")==null) {
				phone.setSlotCard("");
			} else	phone.setSlotCard(rs.getString("Slot_card"));
			
			phone.setCapacitateMaximaCardMemorieGB(rs.getInt("Capacitate_maxima_card_memorie_GB"));
			
			if (rs.getString("GPRS")==null) {
				phone.setGprs("");
			} else	phone.setGprs(rs.getString("GPRS"));
			
			if (rs.getString("EDGE")==null) {
				phone.setEdge("");
			} else phone.setEdge(rs.getString("EDGE"));
			
			if (rs.getString("Viteza_date")==null) {
				phone.setVitezaDate("");
			} else phone.setVitezaDate(rs.getString("Viteza_date"));
			
			if (rs.getString("WLAN")==null) {
				phone.setWlan("");
			} else phone.setWlan(rs.getString("WLAN"));
			
			if (rs.getString("Bluetooth")==null) {
				phone.setBluetooth("");
			} else phone.setBluetooth(rs.getString("Bluetooth"));
			
			if (rs.getString("USB")==null) {
				phone.setUsb("");
			} else phone.setUsb(rs.getString("USB"));
			
			if (rs.getString("NFC")==null) {
				phone.setNfc("");
			} else	phone.setNfc(rs.getString("NFC"));
			
			if (rs.getString("Port_Infrared")==null) {
				phone.setPortInfrared("");
			} else phone.setPortInfrared(rs.getString("Port_Infrared"));
			
			if (rs.getString("Rezolutie_Foto_Video_Mp")==null) {
				phone.setRezolutieFotoVideoMp("");
			} else	phone.setRezolutieFotoVideoMp(rs.getString("Rezolutie_Foto_Video_Mp"));
			
			if (rs.getString("Rezolutie_fotografie")==null) {
				phone.setRezolutieFotografie("");
			} else	phone.setRezolutieFotografie(rs.getString("Rezolutie_fotografie"));
			
			if (rs.getString("Rezolutie_video")==null) {
				phone.setRezolutieVideo("");
			} else	phone.setRezolutieVideo(rs.getString("Rezolutie_video"));
			
			if (rs.getString("Senzor_imagine")==null) {
				phone.setSenzorImagine("");
			} else	phone.setSenzorImagine(rs.getString("Senzor_imagine"));
			
			if (rs.getString("Blitz")==null) {
				phone.setBlitz("");
			} else phone.setBlitz(rs.getString("Blitz"));
						
			if (rs.getString("Focus")==null) {
				phone.setFocus("");
			} else	phone.setFocus(rs.getString("Focus"));
			
			if (rs.getString("Camera_secundara")==null) {
				phone.setCameraSecundara("");
			} else phone.setCameraSecundara(rs.getString("Camera_secundara"));
			
			if (rs.getString("Facilitati_Foto_Video")==null) {
				phone.setFacilitatiFotoVideo("");
			} else phone.setFacilitatiFotoVideo(rs.getString("Facilitati_Foto_Video"));
			
			if (rs.getString("Tip_procesor")==null) {
				phone.setTipProcesor("");
			} else	phone.setTipProcesor(rs.getString("Tip_procesor"));
			
			if (rs.getString("Model_procesor")==null) {
				phone.setModelProcesor("");
			} else phone.setModelProcesor(rs.getString("Model_procesor"));
			
			if (rs.getString("Frecventa_procesor_GHz")==null) {
				phone.setFrecventaProcesorGHz("");
			} else	phone.setFrecventaProcesorGHz(rs.getString("Frecventa_procesor_GHz"));
			
			if (rs.getString("Procesor_grafic")==null) {
				phone.setProcesorGrafic("");
			} else phone.setProcesorGrafic(rs.getString("Procesor_grafic"));
			
			if (rs.getString("Sistem_de_operare")==null) {
				phone.setSistemDeOperare("");
			} else	phone.setSistemDeOperare(rs.getString("Sistem_de_operare"));
			
			if (rs.getString("Varianta_sistem_operare")==null) {
				phone.setVariantaSistemOperare("");
			} else	phone.setVariantaSistemOperare(rs.getString("Varianta_sistem_operare"));
			
			if (rs.getString("Senzori")==null) {
				phone.setSenzori("");
			} else	phone.setSenzori(rs.getString("Senzori"));
			
			if (rs.getString("Mesagerie")==null) {
				phone.setMesagerie("");
			} else	phone.setMesagerie(rs.getString("Mesagerie"));
			
			if (rs.getString("Browser")==null) {
				phone.setBrowser("");
			} else	phone.setBrowser(rs.getString("Browser"));
			
			if (rs.getString("Radio")==null) {
				phone.setRadio("");
			} else phone.setRadio(rs.getString("Radio"));
			
			if (rs.getString("GPS")==null) {
				phone.setGps("");
			} else	phone.setGps(rs.getString("GPS"));
			
			if (rs.getString("Aplicatii")==null) {
				phone.setAplicatii("");
			} else	phone.setAplicatii(rs.getString("Aplicatii"));
			
			if (rs.getString("Alte_facilitati")==null) {
				phone.setAlteFacilitati("");
			} else	phone.setAlteFacilitati(rs.getString("Alte_facilitati"));
			
			if (rs.getString("Tip_baterie")==null) {
				phone.setTipBaterie("");
			} else	phone.setTipBaterie(rs.getString("Tip_baterie"));
			
			if (rs.getString("Autonomie_convorbire")==null) {
				phone.setAutonomieConvorbire("");
			} else	phone.setAutonomieConvorbire(rs.getString("Autonomie_convorbire"));
			
			if (rs.getString("Autonomie_standby")==null) {
				phone.setAutonomieStandby("");
			} else phone.setAutonomieStandby(rs.getString("Autonomie_standby"));
			
			phone.setCapacitateBateriemAh(rs.getInt("Capacitate_baterie_mAh"));
			
			if (rs.getString("Culoare")==null) {
				phone.setCuloare("");
			} else phone.setCuloare(rs.getString("Culoare"));
			
			if (rs.getString("Dimensiuni")==null) {
				phone.setDimensiuni("");
			} else phone.setDimensiuni(rs.getString("Dimensiuni"));
			
			phone.setGreutateg(rs.getInt("Greutate_g"));
			
			if (rs.getString("Garantie_comerciala")==null) {
				phone.setGarantieComerciala("");
			} else phone.setGarantieComerciala(rs.getString("Garantie_comerciala"));
			
			if (rs.getString("Garantie_de_conformitate")==null) {
				phone.setGarantieDeConformitate("");
			} else phone.setGarantieDeConformitate(rs.getString("Garantie_de_conformitate"));
			
			if (rs.getString("Brand")==null) {
				phone.setBrand("");
			} else phone.setBrand(rs.getString("Brand"));
									
		}
		
		phone.setPhoto(PhotoDAO.getPhotoAddressesSmartphones(rs.getInt("id")));

		DBHelper.closeConnection(conn);
		return phone;
	}

	public static ArrayList<Smartphone> getUserSmartphones() throws SQLException {
		ArrayList<Smartphone> phoneList = new ArrayList<>();
		final String sql = "SELECT * FROM catalog.smartphone;";
		Connection conn = DBHelper.openConnection();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		ResultSet rs = pstmt.executeQuery();

		while (rs.next()) {
			
			Smartphone phone = new Smartphone();
			
			phone.setId(rs.getInt("id"));
			
			if (rs.getString("Nume")==null) {
				phone.setNume("");
			} else phone.setNume(rs.getString("Nume"));
			
			if (rs.getString("Specificatii")==null) {
				phone.setSpecificatii("");
			} else phone.setSpecificatii(rs.getString("Specificatii"));
			
			phone.setCantitate(rs.getInt("Cantitate"));
			phone.setPret(rs.getDouble("Pret"));
			
			if (rs.getString("In_stoc")==null) {
				phone.setInStoc("");
			} else phone.setInStoc(rs.getString("In_stoc"));
			
			if (rs.getString("Retea_2G")==null) {
				phone.setRetea2G("");
			} else phone.setRetea2G(rs.getString("Retea_2G"));
			
			if (rs.getString("Retea_3G")==null) {
				phone.setRetea3G("");
			} else phone.setRetea3G(rs.getString("Retea_3G"));
			
			if (rs.getString("Retea_4G")==null) {
				phone.setRetea4G("");
			} else phone.setRetea4G(rs.getString("Retea_4G"));
			
			if (rs.getString("Dual_Sim")==null) {
				phone.setDualSim("");
			} else phone.setDualSim(rs.getString("Dual_Sim"));
			
			if (rs.getString("SIM")==null) {
				phone.setSim("");
			} else phone.setSim(rs.getString("SIM"));
			
			if (rs.getString("Tip_ecran")==null) {
				phone.setTipEcran("");
			} else phone.setTipEcran(rs.getString("Tip_ecran"));
			
			phone.setDimensiuneEcranInch(rs.getDouble("Dimensiune_ecran_inch"));
			
			if (rs.getString("Rezolutie_ecran_pixeli")==null) {
				phone.setRezolutieEcranPixeli("");
			} else phone.setRezolutieEcranPixeli(rs.getString("Rezolutie_ecran_pixeli"));
			
			if (rs.getString("Multitouch")==null) {
				phone.setMultitouch("");
			} else phone.setMultitouch(rs.getString("Multitouch"));
			
			if (rs.getString("Culori_ecran")==null) {
				phone.setCuloriEcran("");
			} else phone.setCuloriEcran(rs.getString("Culori_ecran"));
			
			if (rs.getString("Protectie_ecran")==null) {
				phone.setProtectieEcran("");
			} else	phone.setProtectieEcran(rs.getString("Protectie_ecran"));
			
			if (rs.getString("Sunete_alerta")==null) {
				phone.setSuneteAlerta("");
			} else	phone.setSuneteAlerta(rs.getString("Sunete_alerta"));
			
			if (rs.getString("Difuzor")==null) {
				phone.setDifuzor("");
			} else phone.setDifuzor(rs.getString("Difuzor"));
			
			if (rs.getString("Facilitati_sunet")==null) {
				phone.setFacilitatiSunet("");
			} else	phone.setFacilitatiSunet(rs.getString("Facilitati_sunet"));
			
			phone.setMemorieInternaGB(rs.getInt("Memorie_interna_GB"));
			phone.setMemorieRAMMB(rs.getInt("Memorie_RAM_MB"));
			
			if (rs.getString("Slot_card")==null) {
				phone.setSlotCard("");
			} else	phone.setSlotCard(rs.getString("Slot_card"));
			
			phone.setCapacitateMaximaCardMemorieGB(rs.getInt("Capacitate_maxima_card_memorie_GB"));
			
			if (rs.getString("GPRS")==null) {
				phone.setGprs("");
			} else	phone.setGprs(rs.getString("GPRS"));
			
			if (rs.getString("EDGE")==null) {
				phone.setEdge("");
			} else phone.setEdge(rs.getString("EDGE"));
			
			if (rs.getString("Viteza_date")==null) {
				phone.setVitezaDate("");
			} else phone.setVitezaDate(rs.getString("Viteza_date"));
			
			if (rs.getString("WLAN")==null) {
				phone.setWlan("");
			} else phone.setWlan(rs.getString("WLAN"));
			
			if (rs.getString("Bluetooth")==null) {
				phone.setBluetooth("");
			} else phone.setBluetooth(rs.getString("Bluetooth"));
			
			if (rs.getString("USB")==null) {
				phone.setUsb("");
			} else phone.setUsb(rs.getString("USB"));
			
			if (rs.getString("NFC")==null) {
				phone.setNfc("");
			} else	phone.setNfc(rs.getString("NFC"));
			
			if (rs.getString("Port_Infrared")==null) {
				phone.setPortInfrared("");
			} else phone.setPortInfrared(rs.getString("Port_Infrared"));
			
			if (rs.getString("Rezolutie_Foto_Video_Mp")==null) {
				phone.setRezolutieFotoVideoMp("");
			} else	phone.setRezolutieFotoVideoMp(rs.getString("Rezolutie_Foto_Video_Mp"));
			
			if (rs.getString("Rezolutie_fotografie")==null) {
				phone.setRezolutieFotografie("");
			} else	phone.setRezolutieFotografie(rs.getString("Rezolutie_fotografie"));
			
			if (rs.getString("Rezolutie_video")==null) {
				phone.setRezolutieVideo("");
			} else	phone.setRezolutieVideo(rs.getString("Rezolutie_video"));
			
			if (rs.getString("Senzor_imagine")==null) {
				phone.setSenzorImagine("");
			} else	phone.setSenzorImagine(rs.getString("Senzor_imagine"));
			
			if (rs.getString("Blitz")==null) {
				phone.setBlitz("");
			} else phone.setBlitz(rs.getString("Blitz"));
						
			if (rs.getString("Focus")==null) {
				phone.setFocus("");
			} else	phone.setFocus(rs.getString("Focus"));
			
			if (rs.getString("Camera_secundara")==null) {
				phone.setCameraSecundara("");
			} else phone.setCameraSecundara(rs.getString("Camera_secundara"));
			
			if (rs.getString("Facilitati_Foto_Video")==null) {
				phone.setFacilitatiFotoVideo("");
			} else phone.setFacilitatiFotoVideo(rs.getString("Facilitati_Foto_Video"));
			
			if (rs.getString("Tip_procesor")==null) {
				phone.setTipProcesor("");
			} else	phone.setTipProcesor(rs.getString("Tip_procesor"));
			
			if (rs.getString("Model_procesor")==null) {
				phone.setModelProcesor("");
			} else phone.setModelProcesor(rs.getString("Model_procesor"));
			
			if (rs.getString("Frecventa_procesor_GHz")==null) {
				phone.setFrecventaProcesorGHz("");
			} else	phone.setFrecventaProcesorGHz(rs.getString("Frecventa_procesor_GHz"));
			
			if (rs.getString("Procesor_grafic")==null) {
				phone.setProcesorGrafic("");
			} else phone.setProcesorGrafic(rs.getString("Procesor_grafic"));
			
			if (rs.getString("Sistem_de_operare")==null) {
				phone.setSistemDeOperare("");
			} else	phone.setSistemDeOperare(rs.getString("Sistem_de_operare"));
			
			if (rs.getString("Varianta_sistem_operare")==null) {
				phone.setVariantaSistemOperare("");
			} else	phone.setVariantaSistemOperare(rs.getString("Varianta_sistem_operare"));
			
			if (rs.getString("Senzori")==null) {
				phone.setSenzori("");
			} else	phone.setSenzori(rs.getString("Senzori"));
			
			if (rs.getString("Mesagerie")==null) {
				phone.setMesagerie("");
			} else	phone.setMesagerie(rs.getString("Mesagerie"));
			
			if (rs.getString("Browser")==null) {
				phone.setBrowser("");
			} else	phone.setBrowser(rs.getString("Browser"));
			
			if (rs.getString("Radio")==null) {
				phone.setRadio("");
			} else phone.setRadio(rs.getString("Radio"));
			
			if (rs.getString("GPS")==null) {
				phone.setGps("");
			} else	phone.setGps(rs.getString("GPS"));
			
			if (rs.getString("Aplicatii")==null) {
				phone.setAplicatii("");
			} else	phone.setAplicatii(rs.getString("Aplicatii"));
			
			if (rs.getString("Alte_facilitati")==null) {
				phone.setAlteFacilitati("");
			} else	phone.setAlteFacilitati(rs.getString("Alte_facilitati"));
			
			if (rs.getString("Tip_baterie")==null) {
				phone.setTipBaterie("");
			} else	phone.setTipBaterie(rs.getString("Tip_baterie"));
			
			if (rs.getString("Autonomie_convorbire")==null) {
				phone.setAutonomieConvorbire("");
			} else	phone.setAutonomieConvorbire(rs.getString("Autonomie_convorbire"));
			
			if (rs.getString("Autonomie_standby")==null) {
				phone.setAutonomieStandby("");
			} else phone.setAutonomieStandby(rs.getString("Autonomie_standby"));
			
			phone.setCapacitateBateriemAh(rs.getInt("Capacitate_baterie_mAh"));
			
			if (rs.getString("Culoare")==null) {
				phone.setCuloare("");
			} else phone.setCuloare(rs.getString("Culoare"));
			
			if (rs.getString("Dimensiuni")==null) {
				phone.setDimensiuni("");
			} else phone.setDimensiuni(rs.getString("Dimensiuni"));
			
			phone.setGreutateg(rs.getInt("Greutate_g"));
			
			if (rs.getString("Garantie_comerciala")==null) {
				phone.setGarantieComerciala("");
			} else phone.setGarantieComerciala(rs.getString("Garantie_comerciala"));
			
			if (rs.getString("Garantie_de_conformitate")==null) {
				phone.setGarantieDeConformitate("");
			} else phone.setGarantieDeConformitate(rs.getString("Garantie_de_conformitate"));
			
			if (rs.getString("Brand")==null) {
				phone.setBrand("");
			} else phone.setBrand(rs.getString("Brand"));
			
			phone.setPhoto(PhotoDAO.getPhotoAddressesSmartphones(rs.getInt("id")));
			
			if(rs.getDouble("Pret")<3550) {
				phoneList.add(phone);
			}
			
		}
		
		DBHelper.closeConnection(conn);
		return phoneList;

	}
	
	public static ArrayList<Smartphone> getSuperuserSmartphones() throws SQLException {
		ArrayList<Smartphone> phoneList = new ArrayList<>();
		final String sql = "SELECT * FROM catalog.smartphone;";
		Connection conn = DBHelper.openConnection();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		ResultSet rs = pstmt.executeQuery();

		while (rs.next()) {
			
			Smartphone phone = new Smartphone();
			
			phone.setId(rs.getInt("id"));
			
			if (rs.getString("Nume")==null) {
				phone.setNume("");
			} else phone.setNume(rs.getString("Nume"));
			
			if (rs.getString("Specificatii")==null) {
				phone.setSpecificatii("");
			} else phone.setSpecificatii(rs.getString("Specificatii"));
			
			phone.setCantitate(rs.getInt("Cantitate"));
			phone.setPret(rs.getDouble("Pret"));
			
			if (rs.getString("In_stoc")==null) {
				phone.setInStoc("");
			} else phone.setInStoc(rs.getString("In_stoc"));
			
			if (rs.getString("Retea_2G")==null) {
				phone.setRetea2G("");
			} else phone.setRetea2G(rs.getString("Retea_2G"));
			
			if (rs.getString("Retea_3G")==null) {
				phone.setRetea3G("");
			} else phone.setRetea3G(rs.getString("Retea_3G"));
			
			if (rs.getString("Retea_4G")==null) {
				phone.setRetea4G("");
			} else phone.setRetea4G(rs.getString("Retea_4G"));
			
			if (rs.getString("Dual_Sim")==null) {
				phone.setDualSim("");
			} else phone.setDualSim(rs.getString("Dual_Sim"));
			
			if (rs.getString("SIM")==null) {
				phone.setSim("");
			} else phone.setSim(rs.getString("SIM"));
			
			if (rs.getString("Tip_ecran")==null) {
				phone.setTipEcran("");
			} else phone.setTipEcran(rs.getString("Tip_ecran"));
			
			phone.setDimensiuneEcranInch(rs.getDouble("Dimensiune_ecran_inch"));
			
			if (rs.getString("Rezolutie_ecran_pixeli")==null) {
				phone.setRezolutieEcranPixeli("");
			} else phone.setRezolutieEcranPixeli(rs.getString("Rezolutie_ecran_pixeli"));
			
			if (rs.getString("Multitouch")==null) {
				phone.setMultitouch("");
			} else phone.setMultitouch(rs.getString("Multitouch"));
			
			if (rs.getString("Culori_ecran")==null) {
				phone.setCuloriEcran("");
			} else phone.setCuloriEcran(rs.getString("Culori_ecran"));
			
			if (rs.getString("Protectie_ecran")==null) {
				phone.setProtectieEcran("");
			} else	phone.setProtectieEcran(rs.getString("Protectie_ecran"));
			
			if (rs.getString("Sunete_alerta")==null) {
				phone.setSuneteAlerta("");
			} else	phone.setSuneteAlerta(rs.getString("Sunete_alerta"));
			
			if (rs.getString("Difuzor")==null) {
				phone.setDifuzor("");
			} else phone.setDifuzor(rs.getString("Difuzor"));
			
			if (rs.getString("Facilitati_sunet")==null) {
				phone.setFacilitatiSunet("");
			} else	phone.setFacilitatiSunet(rs.getString("Facilitati_sunet"));
			
			phone.setMemorieInternaGB(rs.getInt("Memorie_interna_GB"));
			phone.setMemorieRAMMB(rs.getInt("Memorie_RAM_MB"));
			
			if (rs.getString("Slot_card")==null) {
				phone.setSlotCard("");
			} else	phone.setSlotCard(rs.getString("Slot_card"));
			
			phone.setCapacitateMaximaCardMemorieGB(rs.getInt("Capacitate_maxima_card_memorie_GB"));
			
			if (rs.getString("GPRS")==null) {
				phone.setGprs("");
			} else	phone.setGprs(rs.getString("GPRS"));
			
			if (rs.getString("EDGE")==null) {
				phone.setEdge("");
			} else phone.setEdge(rs.getString("EDGE"));
			
			if (rs.getString("Viteza_date")==null) {
				phone.setVitezaDate("");
			} else phone.setVitezaDate(rs.getString("Viteza_date"));
			
			if (rs.getString("WLAN")==null) {
				phone.setWlan("");
			} else phone.setWlan(rs.getString("WLAN"));
			
			if (rs.getString("Bluetooth")==null) {
				phone.setBluetooth("");
			} else phone.setBluetooth(rs.getString("Bluetooth"));
			
			if (rs.getString("USB")==null) {
				phone.setUsb("");
			} else phone.setUsb(rs.getString("USB"));
			
			if (rs.getString("NFC")==null) {
				phone.setNfc("");
			} else	phone.setNfc(rs.getString("NFC"));
			
			if (rs.getString("Port_Infrared")==null) {
				phone.setPortInfrared("");
			} else phone.setPortInfrared(rs.getString("Port_Infrared"));
			
			if (rs.getString("Rezolutie_Foto_Video_Mp")==null) {
				phone.setRezolutieFotoVideoMp("");
			} else	phone.setRezolutieFotoVideoMp(rs.getString("Rezolutie_Foto_Video_Mp"));
			
			if (rs.getString("Rezolutie_fotografie")==null) {
				phone.setRezolutieFotografie("");
			} else	phone.setRezolutieFotografie(rs.getString("Rezolutie_fotografie"));
			
			if (rs.getString("Rezolutie_video")==null) {
				phone.setRezolutieVideo("");
			} else	phone.setRezolutieVideo(rs.getString("Rezolutie_video"));
			
			if (rs.getString("Senzor_imagine")==null) {
				phone.setSenzorImagine("");
			} else	phone.setSenzorImagine(rs.getString("Senzor_imagine"));
			
			if (rs.getString("Blitz")==null) {
				phone.setBlitz("");
			} else phone.setBlitz(rs.getString("Blitz"));
						
			if (rs.getString("Focus")==null) {
				phone.setFocus("");
			} else	phone.setFocus(rs.getString("Focus"));
			
			if (rs.getString("Camera_secundara")==null) {
				phone.setCameraSecundara("");
			} else phone.setCameraSecundara(rs.getString("Camera_secundara"));
			
			if (rs.getString("Facilitati_Foto_Video")==null) {
				phone.setFacilitatiFotoVideo("");
			} else phone.setFacilitatiFotoVideo(rs.getString("Facilitati_Foto_Video"));
			
			if (rs.getString("Tip_procesor")==null) {
				phone.setTipProcesor("");
			} else	phone.setTipProcesor(rs.getString("Tip_procesor"));
			
			if (rs.getString("Model_procesor")==null) {
				phone.setModelProcesor("");
			} else phone.setModelProcesor(rs.getString("Model_procesor"));
			
			if (rs.getString("Frecventa_procesor_GHz")==null) {
				phone.setFrecventaProcesorGHz("");
			} else	phone.setFrecventaProcesorGHz(rs.getString("Frecventa_procesor_GHz"));
			
			if (rs.getString("Procesor_grafic")==null) {
				phone.setProcesorGrafic("");
			} else phone.setProcesorGrafic(rs.getString("Procesor_grafic"));
			
			if (rs.getString("Sistem_de_operare")==null) {
				phone.setSistemDeOperare("");
			} else	phone.setSistemDeOperare(rs.getString("Sistem_de_operare"));
			
			if (rs.getString("Varianta_sistem_operare")==null) {
				phone.setVariantaSistemOperare("");
			} else	phone.setVariantaSistemOperare(rs.getString("Varianta_sistem_operare"));
			
			if (rs.getString("Senzori")==null) {
				phone.setSenzori("");
			} else	phone.setSenzori(rs.getString("Senzori"));
			
			if (rs.getString("Mesagerie")==null) {
				phone.setMesagerie("");
			} else	phone.setMesagerie(rs.getString("Mesagerie"));
			
			if (rs.getString("Browser")==null) {
				phone.setBrowser("");
			} else	phone.setBrowser(rs.getString("Browser"));
			
			if (rs.getString("Radio")==null) {
				phone.setRadio("");
			} else phone.setRadio(rs.getString("Radio"));
			
			if (rs.getString("GPS")==null) {
				phone.setGps("");
			} else	phone.setGps(rs.getString("GPS"));
			
			if (rs.getString("Aplicatii")==null) {
				phone.setAplicatii("");
			} else	phone.setAplicatii(rs.getString("Aplicatii"));
			
			if (rs.getString("Alte_facilitati")==null) {
				phone.setAlteFacilitati("");
			} else	phone.setAlteFacilitati(rs.getString("Alte_facilitati"));
			
			if (rs.getString("Tip_baterie")==null) {
				phone.setTipBaterie("");
			} else	phone.setTipBaterie(rs.getString("Tip_baterie"));
			
			if (rs.getString("Autonomie_convorbire")==null) {
				phone.setAutonomieConvorbire("");
			} else	phone.setAutonomieConvorbire(rs.getString("Autonomie_convorbire"));
			
			if (rs.getString("Autonomie_standby")==null) {
				phone.setAutonomieStandby("");
			} else phone.setAutonomieStandby(rs.getString("Autonomie_standby"));
			
			phone.setCapacitateBateriemAh(rs.getInt("Capacitate_baterie_mAh"));
			
			if (rs.getString("Culoare")==null) {
				phone.setCuloare("");
			} else phone.setCuloare(rs.getString("Culoare"));
			
			if (rs.getString("Dimensiuni")==null) {
				phone.setDimensiuni("");
			} else phone.setDimensiuni(rs.getString("Dimensiuni"));
			
			phone.setGreutateg(rs.getInt("Greutate_g"));
			
			if (rs.getString("Garantie_comerciala")==null) {
				phone.setGarantieComerciala("");
			} else phone.setGarantieComerciala(rs.getString("Garantie_comerciala"));
			
			if (rs.getString("Garantie_de_conformitate")==null) {
				phone.setGarantieDeConformitate("");
			} else phone.setGarantieDeConformitate(rs.getString("Garantie_de_conformitate"));
			
			if (rs.getString("Brand")==null) {
				phone.setBrand("");
			} else phone.setBrand(rs.getString("Brand"));
			
			phone.setPhoto(PhotoDAO.getPhotoAddressesSmartphones(rs.getInt("id")));
			
			phoneList.add(phone);
			
		}
		
		DBHelper.closeConnection(conn);
		return phoneList;

	}
}
