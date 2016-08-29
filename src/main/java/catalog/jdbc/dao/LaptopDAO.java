package catalog.jdbc.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import org.springframework.util.StringUtils;

import catalog.jdbc.helper.DBHelper;
import catalog.jdbc.pojo.Laptop;
import catalog.jdbc.pojo.LaptopLists;

public class LaptopDAO {
	
	public static void createLaptop(Laptop laptop) throws SQLException {
		final String sql = "INSERT INTO catalog.laptop (Denumire, Specificatii, Cantitate, Pret, In_stoc, Tip_ecran, Rezolutie_ecran, Dimensiune_ecran_inch, Format_imagine, Alte_caracteristici_display, Tip_procesor, Producator_procesor, Model_procesor, Numar_nuclee_procesor, frecventa_procesor_GHz, Frecventa_maxima_procesor_GHz, Cache_Procesor_MB, Tehnologie_procesor, Procesor_grafic_integrat, Capacitate_RAM_GB, Tip_memorie_RAM, Frecventa_RAM_MHz, Memorie_maxima_RAM_GB, Sloturi_de_memorie, slot_memorie_1, slot_memorie_2, slot_memorie_3, slot_memorie_4, Tip_unitate_stocare, Capacitate_stocare_GB, Interfata_unitate_stocare, Viteza_de_rotatie_unitate_stocare_RPM, Procesor_placa_video, Tip_placa_video, Capacitate_memorie_placa_video_MB, Tip_memorie_placa_video, Difuzoare, Tehnologie_audio, Subwoofer, Microfon, Tip_unitate_optica, Webcam, Ethernet, Wi_Fi, Bluetooth, USB_3_1, USB_3_0, USB_2_0, Thunderbolt, RJ_45, HDMI, DisplayPort, mini_DisplayPort, Iesire_audio, Intrare_microfon, Cititor_de_carduri, Altele, MagSafe_2, Baterie, Capacitate_baterie_mAh, Numar_celule_baterie, Autonomie_baterie_ore, Sistem_de_operare, Biti_Sistem_operare, Alte_software, Tastatura_iluminata, Tastatura_numerica, Layout_tastatura, Facilitati, Securitate, Accesorii_incluse, Carcasa, Garantie_de_conformitate, Garantie_comerciala, Dimensiuni_LxAxI_cm, Culoare, Greutate_kg, Brand) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
		
		pstmt.setString(1, laptop.getNume());
		pstmt.setString(2, laptop.getSpecificatii());
		pstmt.setInt(3, laptop.getCantitate());
		pstmt.setDouble(4, laptop.getPret());
		pstmt.setString(5, laptop.getInStoc());
		pstmt.setString(6, laptop.getTipEcran());
		pstmt.setString(7, laptop.getRezolutieEcran());
		pstmt.setDouble(8, laptop.getDimensiuneEcranInch());
		pstmt.setString(9, laptop.getFormatImagine());
		pstmt.setString(10, laptop.getAlteCaracteristiciDisplay());
		pstmt.setString(11, laptop.getTipProcesor());
		pstmt.setString(12, laptop.getProducatorProcesor());
		pstmt.setString(13, laptop.getModelProcesor());
		pstmt.setInt(14, laptop.getNumarNucleeProcesor());
		pstmt.setDouble(15, laptop.getFrecventaProcesorGHz());
		pstmt.setDouble(16, laptop.getFrecventaMaximaProcesorGHz());
		pstmt.setInt(17, laptop.getCacheProcesorMB());
		pstmt.setString(18, laptop.getTehnologieProcesor());
		pstmt.setString(19, laptop.getProcesorGraficIntegrat());
		pstmt.setInt(20, laptop.getCapacitateRAM());
		pstmt.setString(21, laptop.getTipMemorieRAM());
		pstmt.setInt(22, laptop.getFrecventaRAMMHz());
		pstmt.setInt(23,laptop.getMemorieMaximaRAM());
		pstmt.setInt(24, laptop.getSloturiDeMemorie());
		pstmt.setString(25, laptop.getSlotMemorie1());
		pstmt.setString(26, laptop.getSlotMemorie2());
		pstmt.setString(27, laptop.getSlotMemorie3());
		pstmt.setString(28, laptop.getSlotMemorie4());
		pstmt.setString(29, laptop.getTipUnitateStocare());
		pstmt.setString(30, laptop.getCapacitateStocare());
		pstmt.setString(31, laptop.getInterfataUnitateStocare());
		pstmt.setInt(32, laptop.getVitezaDeRotatieUnitateStocareRPM());
		pstmt.setString(33, laptop.getProcesorPlacaVideo());
		pstmt.setString(34, laptop.getTipPlacaVideo());
		pstmt.setInt(35, laptop.getCapacitateMemoriePlacaVideoMB());
		pstmt.setString(36, laptop.getTipMemoriePlacaVideo());
		pstmt.setString(37, laptop.getDifuzoare());
		pstmt.setString(38, laptop.getTehnologieAudio());
		pstmt.setString(39, laptop.getSubwoofer());
		pstmt.setString(40, laptop.getMicrofon());
		pstmt.setString(41, laptop.getTipUnitateOptica());
		pstmt.setString(42, laptop.getWebcam());
		pstmt.setString(43, laptop.getEthernet());
		pstmt.setString(44, laptop.getWiFi());
		pstmt.setString(45, laptop.getBluetooth());
		pstmt.setInt(46, laptop.getUsb31());
		pstmt.setInt(47, laptop.getUsb30());
		pstmt.setInt(48, laptop.getUsb20());
		pstmt.setString(49, laptop.getThunderbolt());
		pstmt.setInt(50, laptop.getRj45());
		pstmt.setInt(51, laptop.getHdmi());
		pstmt.setInt(52, laptop.getDisplayPort());
		pstmt.setInt(53, laptop.getMiniDisplayPort());
		pstmt.setString(54, laptop.getIesireAudio());
		pstmt.setString(55, laptop.getIntrareMicrofon());
		pstmt.setString(56, laptop.getCititorDeCarduri());
		pstmt.setString(57, laptop.getAltele());
		pstmt.setString(58, laptop.getMagSafe2());
		pstmt.setString(59, laptop.getBaterie());
		pstmt.setInt(60, laptop.getCapacitateBateriemAh());
		pstmt.setString(61, laptop.getNumarCeluleBaterie());
		pstmt.setString(62, laptop.getAutonomieBaterie());
		pstmt.setString(63, laptop.getSistemDeOperare());
		pstmt.setInt(64, laptop.getBitiSistemOperare());
		pstmt.setString(65, laptop.getAlteSoftware());
		pstmt.setString(66, laptop.getTastaturaIluminata());
		pstmt.setString(67, laptop.getTastaturaNumerica());
		pstmt.setString(68, laptop.getLayoutTastatura());
		pstmt.setString(69, laptop.getFacilitati());
		pstmt.setString(70, laptop.getSecuritate());
		pstmt.setString(71, laptop.getAccesoriiIncluse());
		pstmt.setString(72, laptop.getCarcasa());
		pstmt.setString(73, laptop.getGarantieDeConformitate());
		pstmt.setString(74, laptop.getGarantieComerciala());
		pstmt.setString(75, laptop.getDimensiuniLxAxIcm());
		pstmt.setString(76, laptop.getCuloare());
		pstmt.setDouble(77, laptop.getGreutateKg());
		pstmt.setString(78, laptop.getBrand());
				
		pstmt.executeUpdate();
		ResultSet rs = pstmt.getGeneratedKeys();
		if (rs.next()) {
			laptop.setId(rs.getInt(1));
		}
		DBHelper.closeConnection(conn);

	}
	
	public static Laptop createLaptop(String nume, String specificatii, int cantitate, double pret, String inStoc, String tipEcran,
			String rezolutieEcran, double dimensiuneEcranInch, String formatImagine, String alteCaracteristiciDisplay, String tipProcesor, String producatorProcesor,
			String modelProcesor, int numarNucleeProcesor, double frecventaProcesorGHz, double frecventaMaximaProcesorGHz, int cacheProcesorMB, String tehnologieProcesor, String procesorGraficIntegrat,
			int capacitateRAM, String tipMemorieRAM, int frecventaRAMMHz, int memorieMaximaRAM, int sloturiDeMemorie, String slotMemorie1, String slotMemorie2,
			String slotMemorie3, String slotMemorie4, String tipUnitateStocare, String capacitateStocare, String interfataUnitateStocare, int vitezaDeRotatieUnitateStocareRPM,
			String procesorPlacaVideo, String tipPlacaVideo, int capacitateMemoriePlacaVideoMB, String tipMemoriePlacaVideo, String difuzoare, String tehnologieAudio,
			String subwoofer, String microfon, String tipUnitateOptica, String webcam, String ethernet, String wiFi, String bluetooth, int usb31, int usb30, int usb20,
			String thunderbolt, int rj45, int hdmi, int displayPort, int miniDisplayPort, String iesireAudio, String intrareMicrofon, String cititorDeCarduri,
			String altele, String magSafe2, String baterie, int capacitateBateriemAh, String numarCeluleBaterie, String autonomieBaterie, String sistemDeOperare,
			int bitiSistemOperare, String alteSoftware, String tastaturaIluminata, String tastaturaNumerica, String layoutTastatura, String facilitati, String securitate,
			String accesoriiIncluse, String carcasa, String garantieDeConformitate, String garantieComerciala, String dimensiuniLxAxIcm, String culoare, double greutateKg, String brand) throws SQLException {
		
		final String sql = "INSERT INTO catalog.laptop (Denumire, Specificatii, Cantitate, Pret, In_stoc, Tip_ecran, Rezolutie_ecran, Dimensiune_ecran_inch, Format_imagine, Alte_caracteristici_display, Tip_procesor, Producator_procesor, Model_procesor, Numar_nuclee_procesor, frecventa_procesor_GHz, Frecventa_maxima_procesor_GHz, Cache_Procesor_MB, Tehnologie_procesor, Procesor_grafic_integrat, Capacitate_RAM_GB, Tip_memorie_RAM, Frecventa_RAM_MHz, Memorie_maxima_RAM_GB, Sloturi_de_memorie, slot_memorie_1, slot_memorie_2, slot_memorie_3, slot_memorie_4, Tip_unitate_stocare, Capacitate_stocare_GB, Interfata_unitate_stocare, Viteza_de_rotatie_unitate_stocare_RPM, Procesor_placa_video, Tip_placa_video, Capacitate_memorie_placa_video_MB, Tip_memorie_placa_video, Difuzoare, Tehnologie_audio, Subwoofer, Microfon, Tip_unitate_optica, Webcam, Ethernet, Wi_Fi, Bluetooth, USB_3_1, USB_3_0, USB_2_0, Thunderbolt, RJ_45, HDMI, DisplayPort, mini_DisplayPort, Iesire_audio, Intrare_microfon, Cititor_de_carduri, Altele, MagSafe_2, Baterie, Capacitate_baterie_mAh, Numar_celule_baterie, Autonomie_baterie_ore, Sistem_de_operare, Biti_Sistem_operare, Alte_software, Tastatura_iluminata, Tastatura_numerica, Layout_tastatura, Facilitati, Securitate, Accesorii_incluse, Carcasa, Garantie_de_conformitate, Garantie_comerciala, Dimensiuni_LxAxI_cm, Culoare, Greutate_kg, Brand) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
		
		pstmt.setString(1, nume);
		pstmt.setString(2, specificatii);
		pstmt.setInt(3, cantitate);
		pstmt.setDouble(4, pret);
		pstmt.setString(5, inStoc);
		pstmt.setString(6, tipEcran);
		pstmt.setString(7, rezolutieEcran);
		pstmt.setDouble(8, dimensiuneEcranInch);
		pstmt.setString(9, formatImagine);
		pstmt.setString(10, alteCaracteristiciDisplay);
		pstmt.setString(11, tipProcesor);
		pstmt.setString(12, producatorProcesor);
		pstmt.setString(13, modelProcesor);
		pstmt.setInt(14, numarNucleeProcesor);
		pstmt.setDouble(15, frecventaProcesorGHz);
		pstmt.setDouble(16, frecventaMaximaProcesorGHz);
		pstmt.setInt(17, cacheProcesorMB);
		pstmt.setString(18, tehnologieProcesor);
		pstmt.setString(19, procesorGraficIntegrat);
		pstmt.setInt(20, capacitateRAM);
		pstmt.setString(21, tipMemorieRAM);
		pstmt.setInt(22, frecventaRAMMHz);
		pstmt.setInt(23,memorieMaximaRAM);
		pstmt.setInt(24, sloturiDeMemorie);
		pstmt.setString(25, slotMemorie1);
		pstmt.setString(26, slotMemorie2);
		pstmt.setString(27, slotMemorie3);
		pstmt.setString(28, slotMemorie4);
		pstmt.setString(29, tipUnitateStocare);
		pstmt.setString(30, capacitateStocare);
		pstmt.setString(31, interfataUnitateStocare);
		pstmt.setInt(32, vitezaDeRotatieUnitateStocareRPM);
		pstmt.setString(33, procesorPlacaVideo);
		pstmt.setString(34, tipPlacaVideo);
		pstmt.setInt(35, capacitateMemoriePlacaVideoMB);
		pstmt.setString(36, tipMemoriePlacaVideo);
		pstmt.setString(37, difuzoare);
		pstmt.setString(38, tehnologieAudio);
		pstmt.setString(39, subwoofer);
		pstmt.setString(40, microfon);
		pstmt.setString(41, tipUnitateOptica);
		pstmt.setString(42, webcam);
		pstmt.setString(43, ethernet);
		pstmt.setString(44, wiFi);
		pstmt.setString(45, bluetooth);
		pstmt.setInt(46, usb31);
		pstmt.setInt(47, usb30);
		pstmt.setInt(48, usb20);
		pstmt.setString(49, thunderbolt);
		pstmt.setInt(50, rj45);
		pstmt.setInt(51, hdmi);
		pstmt.setInt(52, displayPort);
		pstmt.setInt(53, miniDisplayPort);
		pstmt.setString(54, iesireAudio);
		pstmt.setString(55, intrareMicrofon);
		pstmt.setString(56, cititorDeCarduri);
		pstmt.setString(57, altele);
		pstmt.setString(58, magSafe2);
		pstmt.setString(59, baterie);
		pstmt.setInt(60, capacitateBateriemAh);
		pstmt.setString(61, numarCeluleBaterie);
		pstmt.setString(62, autonomieBaterie);
		pstmt.setString(63, sistemDeOperare);
		pstmt.setInt(64, bitiSistemOperare);
		pstmt.setString(65, alteSoftware);
		pstmt.setString(66, tastaturaIluminata);
		pstmt.setString(67, tastaturaNumerica);
		pstmt.setString(68, layoutTastatura);
		pstmt.setString(69, facilitati);
		pstmt.setString(70, securitate);
		pstmt.setString(71, accesoriiIncluse);
		pstmt.setString(72, carcasa);
		pstmt.setString(73, garantieDeConformitate);
		pstmt.setString(74, garantieComerciala);
		pstmt.setString(75, dimensiuniLxAxIcm);
		pstmt.setString(76, culoare);
		pstmt.setDouble(77, greutateKg);
		pstmt.setString(78, brand);
		
		pstmt.executeUpdate();
		
		Laptop laptop=new Laptop(nume, specificatii, cantitate, pret, inStoc, tipEcran,	rezolutieEcran, dimensiuneEcranInch, formatImagine, alteCaracteristiciDisplay, tipProcesor, producatorProcesor, modelProcesor, numarNucleeProcesor, frecventaProcesorGHz, frecventaMaximaProcesorGHz, cacheProcesorMB, tehnologieProcesor, procesorGraficIntegrat, capacitateRAM, tipMemorieRAM, frecventaRAMMHz, memorieMaximaRAM, sloturiDeMemorie, slotMemorie1, slotMemorie2, slotMemorie3, slotMemorie4, tipUnitateStocare, capacitateStocare, interfataUnitateStocare, vitezaDeRotatieUnitateStocareRPM, procesorPlacaVideo, tipPlacaVideo, capacitateMemoriePlacaVideoMB, tipMemoriePlacaVideo, difuzoare, tehnologieAudio, subwoofer, microfon, tipUnitateOptica, webcam, ethernet, wiFi, bluetooth, usb31, usb30, usb20, thunderbolt, rj45, hdmi, displayPort, miniDisplayPort, iesireAudio, intrareMicrofon, cititorDeCarduri, altele, magSafe2, baterie, capacitateBateriemAh, numarCeluleBaterie, autonomieBaterie, sistemDeOperare, bitiSistemOperare, alteSoftware, tastaturaIluminata, tastaturaNumerica, layoutTastatura, facilitati, securitate, accesoriiIncluse, carcasa, garantieDeConformitate, garantieComerciala, dimensiuniLxAxIcm, culoare, greutateKg, brand);
		
		ResultSet rs = pstmt.getGeneratedKeys();
		if (rs.next()) {
			laptop.setId(rs.getInt(1));
		}
		DBHelper.closeConnection(conn);
		
		return laptop;

	}

	public static Laptop createLaptop() throws SQLException {

		Laptop laptop = new Laptop();
		LaptopDAO.createLaptop(laptop);
		return laptop;
	}

	public static void deleteLaptop(int id) throws SQLException {
		final String sql = "DELETE FROM catalog.laptop WHERE id=?;";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql);
		pstmt.setInt(1, id);
		pstmt.executeUpdate();
		
		DBHelper.closeConnection(conn);

	}

	public static void deleteLaptop(Laptop laptop) throws SQLException {
		LaptopDAO.deleteLaptop(laptop.getId());
	}

	public static void updateLaptop(int id, String nume, String specificatii, int cantitate, double pret) throws SQLException {
		final String sql = "UPDATE catalog.laptop SET Denumire=?, Specificatii=?, Cantitate=?, Pret=? WHERE id=?;";
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
	
	public static void updateLaptop(int id, String nume, String specificatii, int cantitate, double pret, String inStoc, String tipEcran, String rezolutieEcran, double dimensiuneEcranInch, String formatImagine, String alteCaracteristiciDisplay, String tipProcesor, String producatorProcesor, String modelProcesor, int numarNucleeProcesor, double frecventaProcesorGHz, double frecventaMaximaProcesorGHz, int cacheProcesorMB, String tehnologieProcesor, String procesorGraficIntegrat, int capacitateRAM, String tipMemorieRAM, int frecventaRAMMHz, int memorieMaximaRAM, int sloturiDeMemorie, String slotMemorie1, String slotMemorie2, String slotMemorie3, String slotMemorie4, String tipUnitateStocare, String capacitateStocare, String interfataUnitateStocare, int vitezaDeRotatieUnitateStocareRPM, String procesorPlacaVideo, String tipPlacaVideo, int capacitateMemoriePlacaVideoMB, String tipMemoriePlacaVideo, String difuzoare, String tehnologieAudio, String subwoofer, String microfon, String tipUnitateOptica, String webcam, String ethernet, String wiFi, String bluetooth, int usb31, int usb30, int usb20, String thunderbolt, int rj45, int hdmi, int displayPort, int miniDisplayPort, String iesireAudio, String intrareMicrofon, String cititorDeCarduri, String altele, String magSafe2, String baterie, int capacitateBateriemAh, String numarCeluleBaterie, String autonomieBaterie, String sistemDeOperare, int bitiSistemOperare, String alteSoftware, String tastaturaIluminata, String tastaturaNumerica, String layoutTastatura, String facilitati, String securitate, String accesoriiIncluse, String carcasa, String garantieDeConformitate, String garantieComerciala, String dimensiuniLxAxIcm, String culoare, double greutateKg, String brand) throws SQLException {
		
		final String sql1 = "UPDATE catalog.laptop SET Denumire=?, Specificatii=?, Cantitate=?, Pret=?, In_stoc=?, Tip_ecran=?, Rezolutie_ecran=?, Dimensiune_ecran_inch=?, Format_imagine=?, Alte_caracteristici_display=?, Tip_procesor=?, Producator_procesor=?, Model_procesor=?, Numar_nuclee_procesor=?, Frecventa_procesor_GHz=?, Frecventa_maxima_procesor_GHz=?, Cache_Procesor_MB=?, Tehnologie_procesor=?, Procesor_grafic_integrat=?, Capacitate_RAM_GB=?, Tip_memorie_RAM=?, Frecventa_RAM_MHz=?, Memorie_maxima_RAM_GB=?, Sloturi_de_memorie=?, slot_memorie_1=?, slot_memorie_2=?, slot_memorie_3=?, slot_memorie_4=?, Tip_unitate_stocare=?, Capacitate_stocare_GB=?, Interfata_unitate_stocare=?, Viteza_de_rotatie_unitate_stocare_RPM=?, Procesor_placa_video=?, Tip_placa_video=?, Capacitate_memorie_placa_video_MB=?, Tip_memorie_placa_video=?, Difuzoare=?, Tehnologie_audio=?, Subwoofer=?, Microfon=?, Tip_unitate_optica=?, Webcam=?, Ethernet=?, Wi_Fi=?, Bluetooth=?, USB_3_1=?, USB_3_0=?, USB_2_0=?, Thunderbolt=?, RJ_45=?, HDMI=?, DisplayPort=?, mini_DisplayPort=?, Iesire_audio=?, Intrare_microfon=?, Cititor_de_carduri=?, Altele=?, MagSafe_2=?, Baterie=?, Capacitate_baterie_mAh=?, Numar_celule_baterie=?, Autonomie_baterie_ore=?, Sistem_de_operare=?, Biti_Sistem_operare=?, Alte_software=?, Tastatura_iluminata=?, Tastatura_numerica=?, Layout_tastatura=?, Facilitati=?, Securitate=?, Accesorii_incluse=?, Carcasa=?, Garantie_de_conformitate=?, Garantie_comerciala=?, Dimensiuni_LxAxI_cm=?, Culoare=?, Greutate_kg=?, Brand=? WHERE id=?;";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql1);
		
		pstmt.setString(1, nume);
		pstmt.setString(2, specificatii);
		pstmt.setInt(3, cantitate);
		pstmt.setDouble(4, pret);
		pstmt.setString(5, inStoc);
		pstmt.setString(6, tipEcran);
		pstmt.setString(7, rezolutieEcran);
		pstmt.setDouble(8, dimensiuneEcranInch);
		pstmt.setString(9, formatImagine);
		pstmt.setString(10, alteCaracteristiciDisplay);
		pstmt.setString(11, tipProcesor);
		pstmt.setString(12, producatorProcesor);
		pstmt.setString(13, modelProcesor);
		pstmt.setInt(14, numarNucleeProcesor);
		pstmt.setDouble(15, frecventaProcesorGHz);
		pstmt.setDouble(16, frecventaMaximaProcesorGHz);
		pstmt.setInt(17, cacheProcesorMB);
		pstmt.setString(18, tehnologieProcesor);
		pstmt.setString(19, procesorGraficIntegrat);
		pstmt.setInt(20, capacitateRAM);
		pstmt.setString(21, tipMemorieRAM);
		pstmt.setInt(22, frecventaRAMMHz);
		pstmt.setInt(23, memorieMaximaRAM);
		pstmt.setInt(24, sloturiDeMemorie);
		pstmt.setString(25, slotMemorie1);
		pstmt.setString(26, slotMemorie2);
		pstmt.setString(27, slotMemorie3);
		pstmt.setString(28, slotMemorie4);
		pstmt.setString(29, tipUnitateStocare);
		pstmt.setString(30, capacitateStocare);
		pstmt.setString(31, interfataUnitateStocare);
		pstmt.setInt(32, vitezaDeRotatieUnitateStocareRPM);
		pstmt.setString(33, procesorPlacaVideo);
		pstmt.setString(34, tipPlacaVideo);
		pstmt.setInt(35, capacitateMemoriePlacaVideoMB);
		pstmt.setString(36, tipMemoriePlacaVideo);
		pstmt.setString(37, difuzoare);
		pstmt.setString(38, tehnologieAudio);
		pstmt.setString(39, subwoofer);
		pstmt.setString(40, microfon);
		pstmt.setString(41, tipUnitateOptica);
		pstmt.setString(42, webcam);
		pstmt.setString(43, ethernet);
		pstmt.setString(44, wiFi);
		pstmt.setString(45, bluetooth);
		pstmt.setInt(46, usb31);
		pstmt.setInt(47, usb30);
		pstmt.setInt(48, usb20);
		pstmt.setString(49, thunderbolt);
		pstmt.setInt(50, rj45);
		pstmt.setInt(51, hdmi);
		pstmt.setInt(52, displayPort);
		pstmt.setInt(53, miniDisplayPort);
		pstmt.setString(54, iesireAudio);
		pstmt.setString(55, intrareMicrofon);
		pstmt.setString(56, cititorDeCarduri);
		pstmt.setString(57, altele);
		pstmt.setString(58, magSafe2);
		pstmt.setString(59, baterie);
		pstmt.setInt(60, capacitateBateriemAh);
		pstmt.setString(61, numarCeluleBaterie);
		pstmt.setString(62, autonomieBaterie);
		pstmt.setString(63, sistemDeOperare);
		pstmt.setInt(64, bitiSistemOperare);
		pstmt.setString(65, alteSoftware);
		pstmt.setString(66, tastaturaIluminata);
		pstmt.setString(67, tastaturaNumerica);
		pstmt.setString(68, layoutTastatura);
		pstmt.setString(69, facilitati);
		pstmt.setString(70, securitate);
		pstmt.setString(71, accesoriiIncluse);
		pstmt.setString(72, carcasa);
		pstmt.setString(73, garantieDeConformitate);
		pstmt.setString(74, garantieComerciala);
		pstmt.setString(75, dimensiuniLxAxIcm);
		pstmt.setString(76, culoare);
		pstmt.setDouble(77, greutateKg);
		pstmt.setString(78, brand);
		pstmt.setInt(79, id);
		
		pstmt.executeUpdate();
		
		DBHelper.closeConnection(conn);
	}

	public static void updateLaptop(Laptop laptop) throws SQLException {
		
		LaptopDAO.updateLaptop(laptop.getId(), laptop.getNume(), laptop.getSpecificatii(), laptop.getCantitate(), laptop.getPret(), laptop.getInStoc(), laptop.getTipEcran(), laptop.getRezolutieEcran(), laptop.getDimensiuneEcranInch(), laptop.getFormatImagine(), laptop.getAlteCaracteristiciDisplay(), laptop.getTipProcesor(), laptop.getProducatorProcesor(), laptop.getModelProcesor(), laptop.getNumarNucleeProcesor(), laptop.getFrecventaProcesorGHz(), laptop.getFrecventaMaximaProcesorGHz(), laptop.getCacheProcesorMB(), laptop.getTehnologieProcesor(), laptop.getProcesorGraficIntegrat(), laptop.getCapacitateRAM(), laptop.getTipMemorieRAM(), laptop.getFrecventaRAMMHz(), laptop.getMemorieMaximaRAM(), laptop.getSloturiDeMemorie(), laptop.getSlotMemorie1(), laptop.getSlotMemorie2(),	laptop.getSlotMemorie3(), laptop.getSlotMemorie4(), laptop.getTipUnitateStocare(), laptop.getCapacitateStocare(), laptop.getInterfataUnitateStocare(), laptop.getVitezaDeRotatieUnitateStocareRPM(), laptop.getProcesorPlacaVideo(), laptop.getTipPlacaVideo(), laptop.getCapacitateMemoriePlacaVideoMB(), laptop.getTipMemoriePlacaVideo(), laptop.getDifuzoare(),	laptop.getTehnologieAudio(), laptop.getSubwoofer(), laptop.getMicrofon(), laptop.getTipUnitateOptica(), laptop.getWebcam(),	laptop.getEthernet(), laptop.getWiFi(), laptop.getBluetooth(), laptop.getUsb31(), laptop.getUsb30(), laptop.getUsb20(), laptop.getThunderbolt(), laptop.getRj45(), laptop.getHdmi(), laptop.getDisplayPort(), laptop.getMiniDisplayPort(), laptop.getIesireAudio(), laptop.getIntrareMicrofon(), laptop.getCititorDeCarduri(), laptop.getAltele(), laptop.getMagSafe2(), laptop.getBaterie(), laptop.getCapacitateBateriemAh(),	laptop.getNumarCeluleBaterie(), laptop.getAutonomieBaterie(), laptop.getSistemDeOperare(), laptop.getBitiSistemOperare(), laptop.getAlteSoftware(), laptop.getTastaturaIluminata(), laptop.getTastaturaNumerica(), laptop.getLayoutTastatura(),	laptop.getFacilitati(), laptop.getSecuritate(), laptop.getAccesoriiIncluse(), laptop.getCarcasa(), laptop.getGarantieDeConformitate(), laptop.getGarantieComerciala(), laptop.getDimensiuniLxAxIcm(), laptop.getCuloare(), laptop.getGreutateKg(), laptop.getBrand());
	
	}
	
	public static Laptop getLaptop(int id) throws SQLException {
		final String sql = "SELECT id, Denumire, Specificatii, Cantitate, Pret, In_stoc, Tip_ecran, Rezolutie_ecran, Dimensiune_ecran_inch, Format_imagine, Alte_caracteristici_display, Tip_procesor, Producator_procesor, Model_procesor, Numar_nuclee_procesor, frecventa_procesor_GHz, Frecventa_maxima_procesor_GHz, Cache_Procesor_MB, Tehnologie_procesor, Procesor_grafic_integrat, Capacitate_RAM_GB, Tip_memorie_RAM, Frecventa_RAM_MHz, Memorie_maxima_RAM_GB, Sloturi_de_memorie, slot_memorie_1, slot_memorie_2, slot_memorie_3, slot_memorie_4, Tip_unitate_stocare, Capacitate_stocare_GB, Interfata_unitate_stocare, Viteza_de_rotatie_unitate_stocare_RPM, Procesor_placa_video, Tip_placa_video, Capacitate_memorie_placa_video_MB, Tip_memorie_placa_video, Difuzoare, Tehnologie_audio, Subwoofer, Microfon, Tip_unitate_optica, Webcam, Ethernet, Wi_Fi, Bluetooth, USB_3_1, USB_3_0, USB_2_0, Thunderbolt, RJ_45, HDMI, DisplayPort, mini_DisplayPort, Iesire_audio, Intrare_microfon, Cititor_de_carduri, Altele, MagSafe_2, Baterie, Capacitate_baterie_mAh, Numar_celule_baterie, Autonomie_baterie_ore, Sistem_de_operare, Biti_Sistem_operare, Alte_software, Tastatura_iluminata, Tastatura_numerica, Layout_tastatura, Facilitati, Securitate, Accesorii_incluse, Carcasa, Garantie_de_conformitate, Garantie_comerciala, Dimensiuni_LxAxI_cm, Culoare, Greutate_kg, Brand FROM catalog.laptop WHERE id=?;";
		Connection conn = DBHelper.openConnection();
		Laptop laptop = new Laptop();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		pstmt.setInt(1, id);
		ResultSet rs = pstmt.executeQuery();
		
		if (rs.next()) {
			laptop.setId(rs.getInt("id"));
			
			if (rs.getString("Denumire")==null) {
				laptop.setNume("");
			} else laptop.setNume(rs.getString("Denumire"));
			
			if (rs.getString("Specificatii")==null) {
				laptop.setSpecificatii("");
			} else laptop.setSpecificatii(rs.getString("Specificatii"));
			
			laptop.setCantitate(rs.getInt("Cantitate"));
			laptop.setPret(rs.getDouble("Pret"));
			
			if (rs.getString("In_stoc")==null) {
				laptop.setInStoc("");
			} else laptop.setInStoc(rs.getString("In_stoc"));
			
			if (rs.getString("Tip_ecran")==null) {
				laptop.setTipEcran("");
			} else laptop.setTipEcran(rs.getString("Tip_ecran"));
			
			if (rs.getString("Rezolutie_ecran")==null) {
				laptop.setRezolutieEcran("");
			} else laptop.setRezolutieEcran(rs.getString("Rezolutie_ecran"));
			
			laptop.setDimensiuneEcranInch(rs.getDouble("Dimensiune_ecran_inch"));
			
			if (rs.getString("Format_imagine")==null) {
				laptop.setFormatImagine("");
			} else laptop.setFormatImagine(rs.getString("Format_imagine"));
			
			if (rs.getString("Alte_caracteristici_display")==null) {
				laptop.setAlteCaracteristiciDisplay("");
			} else laptop.setAlteCaracteristiciDisplay(rs.getString("Alte_caracteristici_display"));
			
			if (rs.getString("Tip_procesor")==null) {
				laptop.setTipProcesor("");
			} else laptop.setTipProcesor(rs.getString("Tip_procesor"));
			
		    if (rs.getString("Producator_procesor")==null) {
		    	laptop.setProducatorProcesor("");
		    } else laptop.setProducatorProcesor(rs.getString("Producator_procesor"));
			
			if (rs.getString("Model_procesor")==null) {
				laptop.setModelProcesor("");
			} else laptop.setModelProcesor(rs.getString("Model_procesor"));
			
			laptop.setNumarNucleeProcesor(rs.getInt("Numar_nuclee_procesor"));
			laptop.setFrecventaProcesorGHz(rs.getDouble("frecventa_procesor_GHz"));
			laptop.setFrecventaMaximaProcesorGHz(rs.getDouble("Frecventa_maxima_procesor_GHz"));
			laptop.setCacheProcesorMB(rs.getInt("Cache_Procesor_MB"));
			
			if (rs.getString("Tehnologie_procesor")==null) {
				laptop.setTehnologieProcesor("");
			} else laptop.setTehnologieProcesor(rs.getString("Tehnologie_procesor"));
			
			if (rs.getString("Procesor_grafic_integrat")==null) {
				laptop.setProcesorGraficIntegrat("");
			} else laptop.setProcesorGraficIntegrat(rs.getString("Procesor_grafic_integrat"));
			
			laptop.setCapacitateRAM(rs.getInt("Capacitate_RAM_GB"));
			
			if (rs.getString("Tip_memorie_RAM")==null) {
				laptop.setTipMemorieRAM("");
			} else laptop.setTipMemorieRAM(rs.getString("Tip_memorie_RAM"));
			
			laptop.setFrecventaRAMMHz(rs.getInt("Frecventa_RAM_MHz"));
			laptop.setMemorieMaximaRAM(rs.getInt("Memorie_maxima_RAM_GB"));
			
			laptop.setSloturiDeMemorie(rs.getInt("Sloturi_de_memorie"));
			
			if (rs.getString("slot_memorie_1")==null) {
				laptop.setSlotMemorie1("");
			} else laptop.setSlotMemorie1(rs.getString("slot_memorie_1"));
			
			if (rs.getString("slot_memorie_2")==null) {
				laptop.setSlotMemorie2("");
			} else laptop.setSlotMemorie2(rs.getString("slot_memorie_2"));
			
			if (rs.getString("slot_memorie_3")==null) {
				laptop.setSlotMemorie3("");
			} else laptop.setSlotMemorie3(rs.getString("slot_memorie_3"));
			
			if (rs.getString("slot_memorie_4")==null) {
				laptop.setSlotMemorie4("");
			} else laptop.setSlotMemorie4(rs.getString("slot_memorie_4"));
			
			if (rs.getString("Tip_unitate_stocare")==null) {
				laptop.setTipUnitateStocare("");
			} else laptop.setTipUnitateStocare(rs.getString("Tip_unitate_stocare"));
			
			if (rs.getString("Capacitate_stocare_GB")==null) {
				laptop.setCapacitateStocare("");
			} else laptop.setCapacitateStocare(rs.getString("Capacitate_stocare_GB"));
			
			if (rs.getString("Interfata_unitate_stocare")==null) {
				laptop.setInterfataUnitateStocare("");
			} else laptop.setInterfataUnitateStocare(rs.getString("Interfata_unitate_stocare"));
			
			laptop.setVitezaDeRotatieUnitateStocareRPM(rs.getInt("Viteza_de_rotatie_unitate_stocare_RPM"));
			
			if (rs.getString("Procesor_placa_video")==null) {
				laptop.setProcesorPlacaVideo("");
			} else laptop.setProcesorPlacaVideo(rs.getString("Procesor_placa_video"));
			
			if (rs.getString("Tip_placa_video")==null) {
				laptop.setTipPlacaVideo("");
			} else laptop.setTipPlacaVideo(rs.getString("Tip_placa_video"));
			
			laptop.setCapacitateMemoriePlacaVideoMB(rs.getInt("Capacitate_memorie_placa_video_MB"));
			
			if (rs.getString("Tip_memorie_placa_video")==null) {
				laptop.setTipMemoriePlacaVideo("");
			} else laptop.setTipMemoriePlacaVideo(rs.getString("Tip_memorie_placa_video"));
			
			if (rs.getString("Difuzoare")==null) {
				laptop.setDifuzoare("");
			} else laptop.setDifuzoare(rs.getString("Difuzoare"));
			
			if (rs.getString("Tehnologie_audio")==null) {
				laptop.setTehnologieAudio("");
			} else laptop.setTehnologieAudio(rs.getString("Tehnologie_audio"));
			
			if (rs.getString("Subwoofer")==null) {
				laptop.setSubwoofer("");
			} else laptop.setSubwoofer(rs.getString("Subwoofer"));
			
			if (rs.getString("Microfon")==null) {
				laptop.setMicrofon("");
			} else laptop.setMicrofon(rs.getString("Microfon"));
			
			if (rs.getString("Tip_unitate_optica")==null) {
				laptop.setTipUnitateOptica("");
			} else laptop.setTipUnitateOptica(rs.getString("Tip_unitate_optica"));
			
			if (rs.getString("Webcam")==null) {
				laptop.setWebcam("");
			} else laptop.setWebcam(rs.getString("Webcam"));
			
			if (rs.getString("Ethernet")==null) {
				laptop.setEthernet("");
			} else laptop.setEthernet(rs.getString("Ethernet"));
			
			if (rs.getString("Wi_Fi")==null) {
				laptop.setWiFi("");
			} else laptop.setWiFi(rs.getString("Wi_Fi"));
			
			if (rs.getString("Bluetooth")==null) {
				laptop.setBluetooth("");
			} else laptop.setBluetooth(rs.getString("Bluetooth"));
			
			laptop.setUsb31(rs.getInt("USB_3_1"));
			laptop.setUsb30(rs.getInt("USB_3_0"));
			laptop.setUsb20(rs.getInt("USB_2_0"));
			
			if (rs.getString("Thunderbolt")==null) {
				laptop.setThunderbolt("");
			} else laptop.setThunderbolt(rs.getString("Thunderbolt"));
			
			laptop.setRj45(rs.getInt("RJ_45"));
			laptop.setHdmi(rs.getInt("HDMI"));
			laptop.setDisplayPort(rs.getInt("DisplayPort"));
			laptop.setMiniDisplayPort(rs.getInt("mini_DisplayPort"));
			
			if (rs.getString("Iesire_audio")==null) {
				laptop.setIesireAudio("");
			} else laptop.setIesireAudio(rs.getString("Iesire_audio"));
			
			if (rs.getString("Intrare_microfon")==null) {
				laptop.setIntrareMicrofon("");
			} else laptop.setIntrareMicrofon(rs.getString("Intrare_microfon"));
			
			if (rs.getString("Cititor_de_carduri")==null) {
				laptop.setCititorDeCarduri("");
			} else laptop.setCititorDeCarduri(rs.getString("Cititor_de_carduri"));
			
			if (rs.getString("Altele")==null) {
				laptop.setAltele("");
			} else laptop.setAltele(rs.getString("Altele"));
			
			if (rs.getString("MagSafe_2")==null) {
				laptop.setMagSafe2("");
			} else laptop.setMagSafe2(rs.getString("MagSafe_2"));
			
			if (rs.getString("Baterie")==null) {
				laptop.setBaterie("");
			} else laptop.setBaterie(rs.getString("Baterie"));
			
			laptop.setCapacitateBateriemAh(rs.getInt("Capacitate_baterie_mAh"));
			
			if (rs.getString("Numar_celule_baterie")==null) {
				laptop.setNumarCeluleBaterie("");
			} else laptop.setNumarCeluleBaterie(rs.getString("Numar_celule_baterie"));
			
			if (rs.getString("Autonomie_baterie_ore")==null) {
				laptop.setAutonomieBaterie("");
			} else laptop.setAutonomieBaterie(rs.getString("Autonomie_baterie_ore"));			
			
			if (rs.getString("Sistem_de_operare")==null) {
				laptop.setSistemDeOperare("");
			} else laptop.setSistemDeOperare(rs.getString("Sistem_de_operare"));
			
			laptop.setBitiSistemOperare(rs.getInt("Biti_Sistem_operare"));
			
			if (rs.getString("Alte_software")==null) {
				laptop.setAlteSoftware("");
			} else laptop.setAlteSoftware(rs.getString("Alte_software"));
			
			if (rs.getString("Tastatura_iluminata")==null) {
				laptop.setTastaturaIluminata("");
			} else laptop.setTastaturaIluminata(rs.getString("Tastatura_iluminata"));
			
			if (rs.getString("Tastatura_numerica")==null) {
				laptop.setTastaturaNumerica("");
			} else laptop.setTastaturaNumerica(rs.getString("Tastatura_numerica"));
			
			if (rs.getString("Layout_tastatura")==null) {
				laptop.setLayoutTastatura("");
			} else laptop.setLayoutTastatura(rs.getString("Layout_tastatura"));
			
			if (rs.getString("Facilitati")==null) {
				laptop.setFacilitati("");
			} else laptop.setFacilitati(rs.getString("Facilitati"));
					
			if (rs.getString("Securitate")==null) {
				laptop.setSecuritate("");
			} else laptop.setSecuritate(rs.getString("Securitate"));
			
			if (rs.getString("Accesorii_incluse")==null) {
				laptop.setAccesoriiIncluse("");
			} else laptop.setAccesoriiIncluse(rs.getString("Accesorii_incluse"));
			
			if (rs.getString("Carcasa")==null) {
				laptop.setCarcasa("");
			} else laptop.setCarcasa(rs.getString("Carcasa"));
			
			if (rs.getString("Garantie_de_conformitate")==null) {
				laptop.setGarantieDeConformitate("");
			} else laptop.setGarantieDeConformitate(rs.getString("Garantie_de_conformitate"));
			
			if (rs.getString("Garantie_comerciala")==null) {
				laptop.setGarantieComerciala("");
			} else laptop.setGarantieComerciala(rs.getString("Garantie_comerciala"));
			
			if (rs.getString("Dimensiuni_LxAxI_cm")==null) {
				laptop.setDimensiuniLxAxIcm("");
			} else laptop.setDimensiuniLxAxIcm(rs.getString("Dimensiuni_LxAxI_cm"));
			
			if (rs.getString("Culoare")==null) {
				laptop.setCuloare("");
			} else laptop.setCuloare(rs.getString("Culoare"));
			
			laptop.setGreutateKg(rs.getDouble("Greutate_kg"));
			
			if (rs.getString("Brand")==null) {
				laptop.setBrand("");
			} else laptop.setBrand(rs.getString("Brand"));
			
			laptop.setPhoto(PhotoDAO.getPhotoAddressesLaptops(rs.getInt("id")));
		}

		DBHelper.closeConnection(conn);
		return laptop;
	}

	public static ArrayList<Laptop> getUserLaptops() throws SQLException {
		ArrayList<Laptop> laptopList = new ArrayList<>();
		final String sql = "SELECT * FROM catalog.laptop;";
		Connection conn = DBHelper.openConnection();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		ResultSet rs = pstmt.executeQuery();

		while (rs.next()) {
			
			Laptop laptop = new Laptop();
			
			laptop.setId(rs.getInt("id"));
			
			if (rs.getString("Denumire")==null) {
				laptop.setNume("");
			} else laptop.setNume(rs.getString("Denumire"));
			
			if (rs.getString("Specificatii")==null) {
				laptop.setSpecificatii("");
			} else laptop.setSpecificatii(rs.getString("Specificatii"));
			
			laptop.setCantitate(rs.getInt("Cantitate"));
			laptop.setPret(rs.getDouble("Pret"));
			
			if (rs.getString("In_stoc")==null) {
				laptop.setInStoc("");
			} else laptop.setInStoc(rs.getString("In_stoc"));
			
			if (rs.getString("Tip_ecran")==null) {
				laptop.setTipEcran("");
			} else laptop.setTipEcran(rs.getString("Tip_ecran"));
			
			if (rs.getString("Rezolutie_ecran")==null) {
				laptop.setRezolutieEcran("");
			} else laptop.setRezolutieEcran(rs.getString("Rezolutie_ecran"));
			
			laptop.setDimensiuneEcranInch(rs.getDouble("Dimensiune_ecran_inch"));
			
			if (rs.getString("Format_imagine")==null) {
				laptop.setFormatImagine("");
			} else laptop.setFormatImagine(rs.getString("Format_imagine"));
			
			if (rs.getString("Alte_caracteristici_display")==null) {
				laptop.setAlteCaracteristiciDisplay("");
			} else laptop.setAlteCaracteristiciDisplay(rs.getString("Alte_caracteristici_display"));
			
			if (rs.getString("Tip_procesor")==null) {
				laptop.setTipProcesor("");
			} else laptop.setTipProcesor(rs.getString("Tip_procesor"));
			
		    if (rs.getString("Producator_procesor")==null) {
		    	laptop.setProducatorProcesor("");
		    } else laptop.setProducatorProcesor(rs.getString("Producator_procesor"));
			
			if (rs.getString("Model_procesor")==null) {
				laptop.setModelProcesor("");
			} else laptop.setModelProcesor(rs.getString("Model_procesor"));
			
			laptop.setNumarNucleeProcesor(rs.getInt("Numar_nuclee_procesor"));
			laptop.setFrecventaProcesorGHz(rs.getDouble("frecventa_procesor_GHz"));
			laptop.setFrecventaMaximaProcesorGHz(rs.getDouble("Frecventa_maxima_procesor_GHz"));
			laptop.setCacheProcesorMB(rs.getInt("Cache_Procesor_MB"));
			
			if (rs.getString("Tehnologie_procesor")==null) {
				laptop.setTehnologieProcesor("");
			} else laptop.setTehnologieProcesor(rs.getString("Tehnologie_procesor"));
			
			if (rs.getString("Procesor_grafic_integrat")==null) {
				laptop.setProcesorGraficIntegrat("");
			} else laptop.setProcesorGraficIntegrat(rs.getString("Procesor_grafic_integrat"));
			
			laptop.setCapacitateRAM(rs.getInt("Capacitate_RAM_GB"));
			
			if (rs.getString("Tip_memorie_RAM")==null) {
				laptop.setTipMemorieRAM("");
			} else laptop.setTipMemorieRAM(rs.getString("Tip_memorie_RAM"));
			
			laptop.setFrecventaRAMMHz(rs.getInt("Frecventa_RAM_MHz"));
			laptop.setMemorieMaximaRAM(rs.getInt("Memorie_maxima_RAM_GB"));
			laptop.setSloturiDeMemorie(rs.getInt("Sloturi_de_memorie"));
			
			if (rs.getString("slot_memorie_1")==null) {
				laptop.setSlotMemorie1("");
			} else laptop.setSlotMemorie1(rs.getString("slot_memorie_1"));
			
			if (rs.getString("slot_memorie_2")==null) {
				laptop.setSlotMemorie2("");
			} else laptop.setSlotMemorie2(rs.getString("slot_memorie_2"));
			
			if (rs.getString("slot_memorie_3")==null) {
				laptop.setSlotMemorie3("");
			} else laptop.setSlotMemorie3(rs.getString("slot_memorie_3"));
			
			if (rs.getString("slot_memorie_4")==null) {
				laptop.setSlotMemorie4("");
			} else laptop.setSlotMemorie4(rs.getString("slot_memorie_4"));
			
			if (rs.getString("Tip_unitate_stocare")==null) {
				laptop.setTipUnitateStocare("");
			} else laptop.setTipUnitateStocare(rs.getString("Tip_unitate_stocare"));
			
			if (rs.getString("Capacitate_stocare_GB")==null) {
				laptop.setCapacitateStocare("");
			} else laptop.setCapacitateStocare(rs.getString("Capacitate_stocare_GB"));
			
			if (rs.getString("Interfata_unitate_stocare")==null) {
				laptop.setInterfataUnitateStocare("");
			} else laptop.setInterfataUnitateStocare(rs.getString("Interfata_unitate_stocare"));
			
			laptop.setVitezaDeRotatieUnitateStocareRPM(rs.getInt("Viteza_de_rotatie_unitate_stocare_RPM"));
			
			if (rs.getString("Procesor_placa_video")==null) {
				laptop.setProcesorPlacaVideo("");
			} else laptop.setProcesorPlacaVideo(rs.getString("Procesor_placa_video"));
			
			if (rs.getString("Tip_placa_video")==null) {
				laptop.setTipPlacaVideo("");
			} else laptop.setTipPlacaVideo(rs.getString("Tip_placa_video"));
			
			laptop.setCapacitateMemoriePlacaVideoMB(rs.getInt("Capacitate_memorie_placa_video_MB"));
			
			if (rs.getString("Tip_memorie_placa_video")==null) {
				laptop.setTipMemoriePlacaVideo("");
			} else laptop.setTipMemoriePlacaVideo(rs.getString("Tip_memorie_placa_video"));
			
			if (rs.getString("Difuzoare")==null) {
				laptop.setDifuzoare("");
			} else laptop.setDifuzoare(rs.getString("Difuzoare"));
			
			if (rs.getString("Tehnologie_audio")==null) {
				laptop.setTehnologieAudio("");
			} else laptop.setTehnologieAudio(rs.getString("Tehnologie_audio"));
			
			if (rs.getString("Subwoofer")==null) {
				laptop.setSubwoofer("");
			} else laptop.setSubwoofer(rs.getString("Subwoofer"));
			
			if (rs.getString("Microfon")==null) {
				laptop.setMicrofon("");
			} else laptop.setMicrofon(rs.getString("Microfon"));
			
			if (rs.getString("Tip_unitate_optica")==null) {
				laptop.setTipUnitateOptica("");
			} else laptop.setTipUnitateOptica(rs.getString("Tip_unitate_optica"));
			
			if (rs.getString("Webcam")==null) {
				laptop.setWebcam("");
			} else laptop.setWebcam(rs.getString("Webcam"));
			
			if (rs.getString("Ethernet")==null) {
				laptop.setEthernet("");
			} else laptop.setEthernet(rs.getString("Ethernet"));
			
			if (rs.getString("Wi_Fi")==null) {
				laptop.setWiFi("");
			} else laptop.setWiFi(rs.getString("Wi_Fi"));
			
			if (rs.getString("Bluetooth")==null) {
				laptop.setBluetooth("");
			} else laptop.setBluetooth(rs.getString("Bluetooth"));
			
			laptop.setUsb31(rs.getInt("USB_3_1"));
			laptop.setUsb30(rs.getInt("USB_3_0"));
			laptop.setUsb20(rs.getInt("USB_2_0"));
			
			if (rs.getString("Thunderbolt")==null) {
				laptop.setThunderbolt("");
			} else laptop.setThunderbolt(rs.getString("Thunderbolt"));
			
			laptop.setRj45(rs.getInt("RJ_45"));
			laptop.setHdmi(rs.getInt("HDMI"));
			laptop.setDisplayPort(rs.getInt("DisplayPort"));
			laptop.setMiniDisplayPort(rs.getInt("mini_DisplayPort"));
			
			if (rs.getString("Iesire_audio")==null) {
				laptop.setIesireAudio("");
			} else laptop.setIesireAudio(rs.getString("Iesire_audio"));
			
			if (rs.getString("Intrare_microfon")==null) {
				laptop.setIntrareMicrofon("");
			} else laptop.setIntrareMicrofon(rs.getString("Intrare_microfon"));
			
			if (rs.getString("Cititor_de_carduri")==null) {
				laptop.setCititorDeCarduri("");
			} else laptop.setCititorDeCarduri(rs.getString("Cititor_de_carduri"));
			
			if (rs.getString("Altele")==null) {
				laptop.setAltele("");
			} else laptop.setAltele(rs.getString("Altele"));
			
			if (rs.getString("MagSafe_2")==null) {
				laptop.setMagSafe2("");
			} else laptop.setMagSafe2(rs.getString("MagSafe_2"));
			
			if (rs.getString("Baterie")==null) {
				laptop.setBaterie("");
			} else laptop.setBaterie(rs.getString("Baterie"));
			
			laptop.setCapacitateBateriemAh(rs.getInt("Capacitate_baterie_mAh"));
			
			if (rs.getString("Numar_celule_baterie")==null) {
				laptop.setNumarCeluleBaterie("");
			} else laptop.setNumarCeluleBaterie(rs.getString("Numar_celule_baterie"));
			
			if (rs.getString("Autonomie_baterie_ore")==null) {
				laptop.setAutonomieBaterie("");
			} else laptop.setAutonomieBaterie(rs.getString("Autonomie_baterie_ore"));			
			
			if (rs.getString("Sistem_de_operare")==null) {
				laptop.setSistemDeOperare("");
			} else laptop.setSistemDeOperare(rs.getString("Sistem_de_operare"));
			
			laptop.setBitiSistemOperare(rs.getInt("Biti_Sistem_operare"));
			
			if (rs.getString("Alte_software")==null) {
				laptop.setAlteSoftware("");
			} else laptop.setAlteSoftware(rs.getString("Alte_software"));
			
			if (rs.getString("Tastatura_iluminata")==null) {
				laptop.setTastaturaIluminata("");
			} else laptop.setTastaturaIluminata(rs.getString("Tastatura_iluminata"));
			
			if (rs.getString("Tastatura_numerica")==null) {
				laptop.setTastaturaNumerica("");
			} else laptop.setTastaturaNumerica(rs.getString("Tastatura_numerica"));
			
			if (rs.getString("Layout_tastatura")==null) {
				laptop.setLayoutTastatura("");
			} else laptop.setLayoutTastatura(rs.getString("Layout_tastatura"));
			
			if (rs.getString("Facilitati")==null) {
				laptop.setFacilitati("");
			} else laptop.setFacilitati(rs.getString("Facilitati"));
					
			if (rs.getString("Securitate")==null) {
				laptop.setSecuritate("");
			} else laptop.setSecuritate(rs.getString("Securitate"));
			
			if (rs.getString("Accesorii_incluse")==null) {
				laptop.setAccesoriiIncluse("");
			} else laptop.setAccesoriiIncluse(rs.getString("Accesorii_incluse"));
			
			if (rs.getString("Carcasa")==null) {
				laptop.setCarcasa("");
			} else laptop.setCarcasa(rs.getString("Carcasa"));
			
			if (rs.getString("Garantie_de_conformitate")==null) {
				laptop.setGarantieDeConformitate("");
			} else laptop.setGarantieDeConformitate(rs.getString("Garantie_de_conformitate"));
			
			if (rs.getString("Garantie_comerciala")==null) {
				laptop.setGarantieComerciala("");
			} else laptop.setGarantieComerciala(rs.getString("Garantie_comerciala"));
			
			if (rs.getString("Dimensiuni_LxAxI_cm")==null) {
				laptop.setDimensiuniLxAxIcm("");
			} else laptop.setDimensiuniLxAxIcm(rs.getString("Dimensiuni_LxAxI_cm"));
			
			if (rs.getString("Culoare")==null) {
				laptop.setCuloare("");
			} else laptop.setCuloare(rs.getString("Culoare"));
			
			laptop.setGreutateKg(rs.getDouble("Greutate_kg"));
			
			if (rs.getString("Brand")==null) {
				laptop.setBrand("");
			} else laptop.setBrand(rs.getString("Brand"));
			
//			String p;
//			p = laptop.getNume().replaceAll(" ", "%20");
//	    	p=p+"%20fata.jpg";
//	    	p="file:///C:/Users/sabax/workspace/ProjectCatalog/WebContent/WEB-INF/jsp/pics/"+p;
//			laptop.setPhoto(p);
			/*
			int p;
			p = rs.getInt("id");
			
			final String sql1 = "SELECT address FROM catalog.pictures WHERE laptop_id=?;";
			PreparedStatement pstmt1 = conn.prepareStatement(sql1);
			ResultSet rs1 = pstmt1.executeQuery();
			pstmt1.setInt(1, p);
			
			if (rs1.getString("address")==null) {
				laptop.setPhoto("");
			} else laptop.setPhoto(rs1.getString("address"));
			*/
			
			//Laptop laptop = new Laptop(rs.getInt("id"), rs.getString("Denumire"), rs.getString("Specificatii"), rs.getInt("Cantitate"), rs.getDouble("Pret"), rs.getString("In_stoc"), rs.getString("Tip_ecran"), rs.getString("Rezolutie_ecran"), rs.getDouble("Dimensiune_ecran_inch"), rs.getString("Format_imagine"), rs.getString("Alte_caracteristici_display"), rs.getString("Tip_procesor"), rs.getString("Producator_procesor"), rs.getString("Model_procesor"), rs.getInt("Numar_nuclee_procesor"), rs.getDouble("frecventa_procesor_GHz"), rs.getDouble("Frecventa_maxima_procesor_GHz"), rs.getInt("Cache_Procesor_MB"), rs.getString("Tehnologie_procesor"), rs.getString("Procesor_grafic_integrat"), rs.getInt("Capacitate_RAM_GB"), rs.getString("Tip_memorie_RAM"), rs.getInt("Frecventa_RAM_MHz"), rs.getInt("Memorie_maxima_RAM_GB"), rs.getInt("Sloturi_de_memorie"), rs.getString("slot_memorie_1"), rs.getString("slot_memorie_2"), rs.getString("slot_memorie_3"), rs.getString("slot_memorie_4"), rs.getString("Tip_unitate_stocare"), rs.getString("Capacitate_stocare_GB"), rs.getString("Interfata_unitate_stocare"), rs.getInt("Viteza_de_rotatie_unitate_stocare_RPM"), rs.getString("Procesor_placa_video"), rs.getString("Tip_placa_video"), rs.getInt("Capacitate_memorie_placa_video_MB"), rs.getString("Tip_memorie_placa_video"), rs.getString("Difuzoare"), rs.getString("Tehnologie_audio"), rs.getString("Subwoofer"), rs.getString("Microfon"), rs.getString("Tip_unitate_optica"), rs.getString("Webcam"), rs.getString("Ethernet"), rs.getString("Wi_Fi"), rs.getString("Bluetooth"), rs.getInt("USB_3_1"), rs.getInt("USB_3_0"), rs.getInt("USB_2_0"), rs.getString("Thunderbolt"), rs.getInt("RJ_45"), rs.getInt("HDMI"), rs.getInt("DisplayPort"), rs.getInt("mini_DisplayPort"), rs.getString("Iesire_audio"), rs.getString("Intrare_microfon"), rs.getString("Cititor_de_carduri"), rs.getString("Altele"), rs.getString("MagSafe_2"), rs.getString("Baterie"), rs.getInt("Capacitate_baterie_mAh"), rs.getString("Numar_celule_baterie"), rs.getString("Autonomie_baterie_ore"), rs.getString("Sistem_de_operare"), rs.getInt("Biti_Sistem_operare"), rs.getString("Alte_software"), rs.getString("Tastatura_iluminata"), rs.getString("Tastatura_numerica"), rs.getString("Layout_tastatura"), rs.getString("Facilitati"), rs.getString("Securitate"), rs.getString("Accesorii_incluse"), rs.getString("Carcasa"), rs.getString("Garantie_de_conformitate"), rs.getString("Garantie_comerciala"), rs.getString("Dimensiuni_LxAxI_cm"), rs.getString("Culoare"), rs.getDouble("Greutate_kg"));
			
			laptop.setPhoto(PhotoDAO.getPhotoAddressesLaptops(rs.getInt("id")));
			
			if(rs.getDouble("Pret")<10000) {
				laptopList.add(laptop);
			}
		}
		
		DBHelper.closeConnection(conn);
		return laptopList;

	}
	
	public static ArrayList<Laptop> getSuperuserLaptops() throws SQLException {
		ArrayList<Laptop> laptopList = new ArrayList<>();
		final String sql = "SELECT * FROM catalog.laptop;";
		Connection conn = DBHelper.openConnection();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		ResultSet rs = pstmt.executeQuery();

		while (rs.next()) {
			
			Laptop laptop = new Laptop();
			
			laptop.setId(rs.getInt("id"));
			
			if (rs.getString("Denumire")==null) {
				laptop.setNume("");
			} else laptop.setNume(rs.getString("Denumire"));
			
			if (rs.getString("Specificatii")==null) {
				laptop.setSpecificatii("");
			} else laptop.setSpecificatii(rs.getString("Specificatii"));
			
			laptop.setCantitate(rs.getInt("Cantitate"));
			laptop.setPret(rs.getDouble("Pret"));
			
			if (rs.getString("In_stoc")==null) {
				laptop.setInStoc("");
			} else laptop.setInStoc(rs.getString("In_stoc"));
			
			if (rs.getString("Tip_ecran")==null) {
				laptop.setTipEcran("");
			} else laptop.setTipEcran(rs.getString("Tip_ecran"));
			
			if (rs.getString("Rezolutie_ecran")==null) {
				laptop.setRezolutieEcran("");
			} else laptop.setRezolutieEcran(rs.getString("Rezolutie_ecran"));
			
			laptop.setDimensiuneEcranInch(rs.getDouble("Dimensiune_ecran_inch"));
			
			if (rs.getString("Format_imagine")==null) {
				laptop.setFormatImagine("");
			} else laptop.setFormatImagine(rs.getString("Format_imagine"));
			
			if (rs.getString("Alte_caracteristici_display")==null) {
				laptop.setAlteCaracteristiciDisplay("");
			} else laptop.setAlteCaracteristiciDisplay(rs.getString("Alte_caracteristici_display"));
			
			if (rs.getString("Tip_procesor")==null) {
				laptop.setTipProcesor("");
			} else laptop.setTipProcesor(rs.getString("Tip_procesor"));
			
		    if (rs.getString("Producator_procesor")==null) {
		    	laptop.setProducatorProcesor("");
		    } else laptop.setProducatorProcesor(rs.getString("Producator_procesor"));
			
			if (rs.getString("Model_procesor")==null) {
				laptop.setModelProcesor("");
			} else laptop.setModelProcesor(rs.getString("Model_procesor"));
			
			laptop.setNumarNucleeProcesor(rs.getInt("Numar_nuclee_procesor"));
			laptop.setFrecventaProcesorGHz(rs.getDouble("frecventa_procesor_GHz"));
			laptop.setFrecventaMaximaProcesorGHz(rs.getDouble("Frecventa_maxima_procesor_GHz"));
			laptop.setCacheProcesorMB(rs.getInt("Cache_Procesor_MB"));
			
			if (rs.getString("Tehnologie_procesor")==null) {
				laptop.setTehnologieProcesor("");
			} else laptop.setTehnologieProcesor(rs.getString("Tehnologie_procesor"));
			
			if (rs.getString("Procesor_grafic_integrat")==null) {
				laptop.setProcesorGraficIntegrat("");
			} else laptop.setProcesorGraficIntegrat(rs.getString("Procesor_grafic_integrat"));
			
			laptop.setCapacitateRAM(rs.getInt("Capacitate_RAM_GB"));
			
			if (rs.getString("Tip_memorie_RAM")==null) {
				laptop.setTipMemorieRAM("");
			} else laptop.setTipMemorieRAM(rs.getString("Tip_memorie_RAM"));
			
			laptop.setFrecventaRAMMHz(rs.getInt("Frecventa_RAM_MHz"));
			laptop.setMemorieMaximaRAM(rs.getInt("Memorie_maxima_RAM_GB"));
			laptop.setSloturiDeMemorie(rs.getInt("Sloturi_de_memorie"));
			
			if (rs.getString("slot_memorie_1")==null) {
				laptop.setSlotMemorie1("");
			} else laptop.setSlotMemorie1(rs.getString("slot_memorie_1"));
			
			if (rs.getString("slot_memorie_2")==null) {
				laptop.setSlotMemorie2("");
			} else laptop.setSlotMemorie2(rs.getString("slot_memorie_2"));
			
			if (rs.getString("slot_memorie_3")==null) {
				laptop.setSlotMemorie3("");
			} else laptop.setSlotMemorie3(rs.getString("slot_memorie_3"));
			
			if (rs.getString("slot_memorie_4")==null) {
				laptop.setSlotMemorie4("");
			} else laptop.setSlotMemorie4(rs.getString("slot_memorie_4"));
			
			if (rs.getString("Tip_unitate_stocare")==null) {
				laptop.setTipUnitateStocare("");
			} else laptop.setTipUnitateStocare(rs.getString("Tip_unitate_stocare"));
			
			if (rs.getString("Capacitate_stocare_GB")==null) {
				laptop.setCapacitateStocare("");
			} else laptop.setCapacitateStocare(rs.getString("Capacitate_stocare_GB"));
			
			if (rs.getString("Interfata_unitate_stocare")==null) {
				laptop.setInterfataUnitateStocare("");
			} else laptop.setInterfataUnitateStocare(rs.getString("Interfata_unitate_stocare"));
			
			laptop.setVitezaDeRotatieUnitateStocareRPM(rs.getInt("Viteza_de_rotatie_unitate_stocare_RPM"));
			
			if (rs.getString("Procesor_placa_video")==null) {
				laptop.setProcesorPlacaVideo("");
			} else laptop.setProcesorPlacaVideo(rs.getString("Procesor_placa_video"));
			
			if (rs.getString("Tip_placa_video")==null) {
				laptop.setTipPlacaVideo("");
			} else laptop.setTipPlacaVideo(rs.getString("Tip_placa_video"));
			
			laptop.setCapacitateMemoriePlacaVideoMB(rs.getInt("Capacitate_memorie_placa_video_MB"));
			
			if (rs.getString("Tip_memorie_placa_video")==null) {
				laptop.setTipMemoriePlacaVideo("");
			} else laptop.setTipMemoriePlacaVideo(rs.getString("Tip_memorie_placa_video"));
			
			if (rs.getString("Difuzoare")==null) {
				laptop.setDifuzoare("");
			} else laptop.setDifuzoare(rs.getString("Difuzoare"));
			
			if (rs.getString("Tehnologie_audio")==null) {
				laptop.setTehnologieAudio("");
			} else laptop.setTehnologieAudio(rs.getString("Tehnologie_audio"));
			
			if (rs.getString("Subwoofer")==null) {
				laptop.setSubwoofer("");
			} else laptop.setSubwoofer(rs.getString("Subwoofer"));
			
			if (rs.getString("Microfon")==null) {
				laptop.setMicrofon("");
			} else laptop.setMicrofon(rs.getString("Microfon"));
			
			if (rs.getString("Tip_unitate_optica")==null) {
				laptop.setTipUnitateOptica("");
			} else laptop.setTipUnitateOptica(rs.getString("Tip_unitate_optica"));
			
			if (rs.getString("Webcam")==null) {
				laptop.setWebcam("");
			} else laptop.setWebcam(rs.getString("Webcam"));
			
			if (rs.getString("Ethernet")==null) {
				laptop.setEthernet("");
			} else laptop.setEthernet(rs.getString("Ethernet"));
			
			if (rs.getString("Wi_Fi")==null) {
				laptop.setWiFi("");
			} else laptop.setWiFi(rs.getString("Wi_Fi"));
			
			if (rs.getString("Bluetooth")==null) {
				laptop.setBluetooth("");
			} else laptop.setBluetooth(rs.getString("Bluetooth"));
			
			laptop.setUsb31(rs.getInt("USB_3_1"));
			laptop.setUsb30(rs.getInt("USB_3_0"));
			laptop.setUsb20(rs.getInt("USB_2_0"));
			
			if (rs.getString("Thunderbolt")==null) {
				laptop.setThunderbolt("");
			} else laptop.setThunderbolt(rs.getString("Thunderbolt"));
			
			laptop.setRj45(rs.getInt("RJ_45"));
			laptop.setHdmi(rs.getInt("HDMI"));
			laptop.setDisplayPort(rs.getInt("DisplayPort"));
			laptop.setMiniDisplayPort(rs.getInt("mini_DisplayPort"));
			
			if (rs.getString("Iesire_audio")==null) {
				laptop.setIesireAudio("");
			} else laptop.setIesireAudio(rs.getString("Iesire_audio"));
			
			if (rs.getString("Intrare_microfon")==null) {
				laptop.setIntrareMicrofon("");
			} else laptop.setIntrareMicrofon(rs.getString("Intrare_microfon"));
			
			if (rs.getString("Cititor_de_carduri")==null) {
				laptop.setCititorDeCarduri("");
			} else laptop.setCititorDeCarduri(rs.getString("Cititor_de_carduri"));
			
			if (rs.getString("Altele")==null) {
				laptop.setAltele("");
			} else laptop.setAltele(rs.getString("Altele"));
			
			if (rs.getString("MagSafe_2")==null) {
				laptop.setMagSafe2("");
			} else laptop.setMagSafe2(rs.getString("MagSafe_2"));
			
			if (rs.getString("Baterie")==null) {
				laptop.setBaterie("");
			} else laptop.setBaterie(rs.getString("Baterie"));
			
			laptop.setCapacitateBateriemAh(rs.getInt("Capacitate_baterie_mAh"));
			
			if (rs.getString("Numar_celule_baterie")==null) {
				laptop.setNumarCeluleBaterie("");
			} else laptop.setNumarCeluleBaterie(rs.getString("Numar_celule_baterie"));
			
			if (rs.getString("Autonomie_baterie_ore")==null) {
				laptop.setAutonomieBaterie("");
			} else laptop.setAutonomieBaterie(rs.getString("Autonomie_baterie_ore"));			
			
			if (rs.getString("Sistem_de_operare")==null) {
				laptop.setSistemDeOperare("");
			} else laptop.setSistemDeOperare(rs.getString("Sistem_de_operare"));
			
			laptop.setBitiSistemOperare(rs.getInt("Biti_Sistem_operare"));
			
			if (rs.getString("Alte_software")==null) {
				laptop.setAlteSoftware("");
			} else laptop.setAlteSoftware(rs.getString("Alte_software"));
			
			if (rs.getString("Tastatura_iluminata")==null) {
				laptop.setTastaturaIluminata("");
			} else laptop.setTastaturaIluminata(rs.getString("Tastatura_iluminata"));
			
			if (rs.getString("Tastatura_numerica")==null) {
				laptop.setTastaturaNumerica("");
			} else laptop.setTastaturaNumerica(rs.getString("Tastatura_numerica"));
			
			if (rs.getString("Layout_tastatura")==null) {
				laptop.setLayoutTastatura("");
			} else laptop.setLayoutTastatura(rs.getString("Layout_tastatura"));
			
			if (rs.getString("Facilitati")==null) {
				laptop.setFacilitati("");
			} else laptop.setFacilitati(rs.getString("Facilitati"));
					
			if (rs.getString("Securitate")==null) {
				laptop.setSecuritate("");
			} else laptop.setSecuritate(rs.getString("Securitate"));
			
			if (rs.getString("Accesorii_incluse")==null) {
				laptop.setAccesoriiIncluse("");
			} else laptop.setAccesoriiIncluse(rs.getString("Accesorii_incluse"));
			
			if (rs.getString("Carcasa")==null) {
				laptop.setCarcasa("");
			} else laptop.setCarcasa(rs.getString("Carcasa"));
			
			if (rs.getString("Garantie_de_conformitate")==null) {
				laptop.setGarantieDeConformitate("");
			} else laptop.setGarantieDeConformitate(rs.getString("Garantie_de_conformitate"));
			
			if (rs.getString("Garantie_comerciala")==null) {
				laptop.setGarantieComerciala("");
			} else laptop.setGarantieComerciala(rs.getString("Garantie_comerciala"));
			
			if (rs.getString("Dimensiuni_LxAxI_cm")==null) {
				laptop.setDimensiuniLxAxIcm("");
			} else laptop.setDimensiuniLxAxIcm(rs.getString("Dimensiuni_LxAxI_cm"));
			
			if (rs.getString("Culoare")==null) {
				laptop.setCuloare("");
			} else laptop.setCuloare(rs.getString("Culoare"));
			
			laptop.setGreutateKg(rs.getDouble("Greutate_kg"));
			
			if (rs.getString("Brand")==null) {
				laptop.setBrand("");
			} else laptop.setBrand(rs.getString("Brand"));
			
//			String p;
//			p = laptop.getNume().replaceAll(" ", "%20");
//	    	p=p+"%20fata.jpg";
//	    	p="file:///C:/Users/sabax/workspace/ProjectCatalog/WebContent/WEB-INF/jsp/pics/"+p;
//			laptop.setPhoto(p);
			/*
			int p;
			p = rs.getInt("id");
			
			final String sql1 = "SELECT address FROM catalog.pictures WHERE laptop_id=?;";
			PreparedStatement pstmt1 = conn.prepareStatement(sql1);
			ResultSet rs1 = pstmt1.executeQuery();
			pstmt1.setInt(1, p);
			
			if (rs1.getString("address")==null) {
				laptop.setPhoto("");
			} else laptop.setPhoto(rs1.getString("address"));
			*/
			
			laptop.setPhoto(PhotoDAO.getPhotoAddressesLaptops(rs.getInt("id")));
			
			//Laptop laptop = new Laptop(rs.getInt("id"), rs.getString("Denumire"), rs.getString("Specificatii"), rs.getInt("Cantitate"), rs.getDouble("Pret"), rs.getString("In_stoc"), rs.getString("Tip_ecran"), rs.getString("Rezolutie_ecran"), rs.getDouble("Dimensiune_ecran_inch"), rs.getString("Format_imagine"), rs.getString("Alte_caracteristici_display"), rs.getString("Tip_procesor"), rs.getString("Producator_procesor"), rs.getString("Model_procesor"), rs.getInt("Numar_nuclee_procesor"), rs.getDouble("frecventa_procesor_GHz"), rs.getDouble("Frecventa_maxima_procesor_GHz"), rs.getInt("Cache_Procesor_MB"), rs.getString("Tehnologie_procesor"), rs.getString("Procesor_grafic_integrat"), rs.getInt("Capacitate_RAM_GB"), rs.getString("Tip_memorie_RAM"), rs.getInt("Frecventa_RAM_MHz"), rs.getInt("Memorie_maxima_RAM_GB"), rs.getInt("Sloturi_de_memorie"), rs.getString("slot_memorie_1"), rs.getString("slot_memorie_2"), rs.getString("slot_memorie_3"), rs.getString("slot_memorie_4"), rs.getString("Tip_unitate_stocare"), rs.getString("Capacitate_stocare_GB"), rs.getString("Interfata_unitate_stocare"), rs.getInt("Viteza_de_rotatie_unitate_stocare_RPM"), rs.getString("Procesor_placa_video"), rs.getString("Tip_placa_video"), rs.getInt("Capacitate_memorie_placa_video_MB"), rs.getString("Tip_memorie_placa_video"), rs.getString("Difuzoare"), rs.getString("Tehnologie_audio"), rs.getString("Subwoofer"), rs.getString("Microfon"), rs.getString("Tip_unitate_optica"), rs.getString("Webcam"), rs.getString("Ethernet"), rs.getString("Wi_Fi"), rs.getString("Bluetooth"), rs.getInt("USB_3_1"), rs.getInt("USB_3_0"), rs.getInt("USB_2_0"), rs.getString("Thunderbolt"), rs.getInt("RJ_45"), rs.getInt("HDMI"), rs.getInt("DisplayPort"), rs.getInt("mini_DisplayPort"), rs.getString("Iesire_audio"), rs.getString("Intrare_microfon"), rs.getString("Cititor_de_carduri"), rs.getString("Altele"), rs.getString("MagSafe_2"), rs.getString("Baterie"), rs.getInt("Capacitate_baterie_mAh"), rs.getString("Numar_celule_baterie"), rs.getString("Autonomie_baterie_ore"), rs.getString("Sistem_de_operare"), rs.getInt("Biti_Sistem_operare"), rs.getString("Alte_software"), rs.getString("Tastatura_iluminata"), rs.getString("Tastatura_numerica"), rs.getString("Layout_tastatura"), rs.getString("Facilitati"), rs.getString("Securitate"), rs.getString("Accesorii_incluse"), rs.getString("Carcasa"), rs.getString("Garantie_de_conformitate"), rs.getString("Garantie_comerciala"), rs.getString("Dimensiuni_LxAxI_cm"), rs.getString("Culoare"), rs.getDouble("Greutate_kg"));
			
			laptopList.add(laptop);
			
		}
		
		DBHelper.closeConnection(conn);
		return laptopList;

	}
	
	public static String convertListToDelimitedString(ArrayList<String> list) {

		String result = "";
		if (list != null) {
			result = StringUtils.arrayToCommaDelimitedString(list.toArray());
		}
		return result;

	}
	
}
