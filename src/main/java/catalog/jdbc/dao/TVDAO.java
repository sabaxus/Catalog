package catalog.jdbc.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import catalog.jdbc.helper.DBHelper;
import catalog.jdbc.pojo.TV;

public class TVDAO {
	
	public static void createTV(TV tv) throws SQLException {
		final String sql = "INSERT INTO catalog.tv (Nume, Specificatii, Cantitate, Pret, In_stoc, Tip_ecran, Tip, Tehnologie, Diagonala_cm, Dimensiune_ecran_inch, Rezolutie_ecran_pixeli, Rezolutie, Panou, Ecran, Format_ecran_Corectie_format, Mod_imagine, Procesare_imagine_Hz, Luminozitate_cd_m2, MCI, Mod_panoramic, Mod_panoramic_pentru_PC, Scene_select, Unghi_de_vizualizare_grade, Contrast_dinamic, Motionflow, Perfect_Motion_Rate_Hz, Caracteristici_video, Facilitati, Caracteristici_3D, Sistem_audio, Putere_de_iesire_sistem_audio_W, Sistem_difuzoare, Mod_sunet, Mod_surround, Caracteristici_audio, Optimizare_sunet, Tip_tuner, Caracteristici_speciale, Intrare_antena, Format_subtitrari, Format_redare_video, Format_redare_audio, Format_redare_imagini, Caracteristici_multimedia, Sistem_de_operare, Versiune_sistem_de_operare, Procesor, Facilitati_Smart_TV, Operare, Aplicatii, EasyLink_HDMI_CEC, MHL, Miracast, Smart_Interaction_Instalare_usoara, Smart_Interaction_Upgrade_firmware, Bluetooth, Wi_Fi_Direct, WiDi, DLNA, Wireless_LAN, Home_Network, AllShare, Web_Browser, Skype, Anynet, Timer_Sleep, Accesorii, Conectori, Standard_VESA_mm, Putere_consumata_in_standby_W, Clasa_de_eficienta_energetica, Dimensiuni_fara_stand_L_x_A_x_I_cm , Dimensiuni_cu_stand_L_x_A_x_I_cm, Greutate_fara_stand_Kg, Greutate_cu_stand_Kg , Culoare, Garantie_comerciala, Brand) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
		
		pstmt.setString(1, tv.getNume());
		pstmt.setString(2, tv.getSpecificatii());
		pstmt.setInt(3, tv.getCantitate());
		pstmt.setDouble(4, tv.getPret());
		pstmt.setString(5, tv.getInStoc());
		pstmt.setString(6, tv.getTipEcran());
		pstmt.setString(7, tv.getTip());
		pstmt.setString(8, tv.getTehnologie());
		pstmt.setInt(9, tv.getDiagonalacm());
		pstmt.setInt(10, tv.getDimensiuneEcranInch());
		pstmt.setString(11, tv.getRezolutieEcranPixeli());
		pstmt.setString(12, tv.getRezolutie());
		pstmt.setString(13, tv.getPanou());
		pstmt.setString(14, tv.getEcran());
		pstmt.setString(15, tv.getFormatEcranCorectieFormat());
		pstmt.setString(16, tv.getModImagine());
		pstmt.setInt(17, tv.getProcesareImagineHz());
		pstmt.setInt(18, tv.getLuminozitateCdM2());
		pstmt.setInt(19, tv.getMci());
		pstmt.setString(20, tv.getModPanoramic());
		pstmt.setString(21, tv.getModPanoramicPentruPC());
		pstmt.setString(22, tv.getSceneSelect());
		pstmt.setString(23,tv.getUnghiDeVizualizareGrade());
		pstmt.setString(24, tv.getContrastDinamic());
		pstmt.setString(25, tv.getMotionflow());
		pstmt.setInt(26, tv.getPerfectMotionRateHz());
		pstmt.setString(27, tv.getCaracteristiciVideo());
		pstmt.setString(28, tv.getFacilitati());
		pstmt.setString(29, tv.getCaracteristici3D());
		pstmt.setString(30, tv.getSistemAudio());
		pstmt.setString(31, tv.getPutereDeIesireSistemAudioW());
		pstmt.setString(32, tv.getSistemDifuzoare());
		pstmt.setString(33, tv.getModSunet());
		pstmt.setString(34, tv.getModSurround());
		pstmt.setString(35, tv.getCaracteristiciAudio());
		pstmt.setString(36, tv.getOptimizareSunet());
		pstmt.setString(37, tv.getTipTuner());
		pstmt.setString(38, tv.getCaracteristiciSpeciale());
		pstmt.setString(39, tv.getIntrareAntena());
		pstmt.setString(40, tv.getFormatSubtitrari());
		pstmt.setString(41, tv.getFormatRedareVideo());
		pstmt.setString(42, tv.getFormatRedareAudio());
		pstmt.setString(43, tv.getFormatRedareImagini());
		pstmt.setString(44, tv.getCaracteristiciMultimedia());
		pstmt.setString(45, tv.getSistemDeOperare());
		pstmt.setString(46, tv.getVersiuneSistemDeOperare());
		pstmt.setString(47, tv.getProcesor());
		pstmt.setString(48, tv.getFacilitatiSmartTV());
		pstmt.setString(49, tv.getOperare());
		pstmt.setString(50, tv.getAplicatii());
		pstmt.setString(51, tv.getEasyLinkHDMICEC());
		pstmt.setString(52, tv.getMhl());
		pstmt.setString(53, tv.getMiracast());
		pstmt.setString(54, tv.getSmartInteractionInstalareUsoara());
		pstmt.setString(55, tv.getSmartInteractionUpgradeFirmware());
		pstmt.setString(56, tv.getBluetooth());
		pstmt.setString(57, tv.getWifiDirect());
		pstmt.setString(58, tv.getWidi());
		pstmt.setString(59, tv.getDlna());
		pstmt.setString(60, tv.getWirelessLAN());
		pstmt.setString(61, tv.getHomeNetwork());
		pstmt.setString(62, tv.getAllShare());
		pstmt.setString(63, tv.getWebBrowser());
		pstmt.setString(64, tv.getSkype());
		pstmt.setString(65, tv.getAnynet());
		pstmt.setString(66, tv.getTimerSleep());
		pstmt.setString(67, tv.getAccesorii());
		pstmt.setString(68, tv.getConectori());
		pstmt.setString(69, tv.getStandardVESAmm());
		pstmt.setString(70, tv.getPutereConsumataInStandbyW());
		pstmt.setString(71, tv.getClasaDeEficientaEnergetica());
		pstmt.setString(72, tv.getDimensiuniFaraStandLxAxIcm());
		pstmt.setString(73, tv.getDimensiuniCuStandLxAxIcm());
		pstmt.setDouble(74, tv.getGreutateFaraStandKg());
		pstmt.setDouble(75, tv.getGreutateCuStandKg());
		pstmt.setString(76, tv.getCuloare());
		pstmt.setString(77, tv.getGarantieComerciala());
		pstmt.setString(78, tv.getBrand());
		
		pstmt.executeUpdate();
		ResultSet rs = pstmt.getGeneratedKeys();
		if (rs.next()) {
			tv.setId(rs.getInt(1));
		}
		DBHelper.closeConnection(conn);

	}
	
	public static TV createTV(String nume, String specificatii, int cantitate, double pret, String inStoc, String tipEcran, String tip, String tehnologie, int diagonalacm, int dimensiuneEcranInch, String rezolutieEcranPixeli, String rezolutie, String panou, String ecran, String formatEcranCorectieFormat, String modImagine, int procesareImagineHz, int luminozitateCdM2, int mci, String modPanoramic, String modPanoramicPentruPC, String sceneSelect, String unghiDeVizualizareGrade, String contrastDinamic, String motionflow, int perfectMotionRateHz, String caracteristiciVideo, String facilitati, String caracteristici3D, String sistemAudio, String putereDeIesireSistemAudioW, String sistemDifuzoare, String modSunet, String modSurround, String caracteristiciAudio, String optimizareSunet, String tipTuner, String caracteristiciSpeciale, String intrareAntena, String formatSubtitrari, String formatRedareVideo, String formatRedareAudio, String formatRedareImagini, String caracteristiciMultimedia, String sistemDeOperare, String versiuneSistemDeOperare, String procesor, String facilitatiSmartTV, String operare, String aplicatii, String easyLinkHDMICEC, String mhl, String miracast, String smartInteractionInstalareUsoara, String smartInteractionUpgradeFirmware, String bluetooth, String wifiDirect, String widi, String dlna, String wirelessLAN, String homeNetwork, String allShare, String webBrowser, String skype, String anynet, String timerSleep, String accesorii, String conectori, String standardVESAmm, String putereConsumataInStandbyW, String clasaDeEficientaEnergetica, String dimensiuniFaraStandLxAxIcm, String dimensiuniCuStandLxAxIcm, double greutateFaraStandKg, double greutateCuStandKg, String culoare, String garantieComerciala, String brand) throws SQLException {
		
		final String sql = "INSERT INTO catalog.tv (Nume, Specificatii, Cantitate, Pret, In_stoc, Tip_ecran, Tip, Tehnologie, Diagonala_cm, Dimensiune_ecran_inch, Rezolutie_ecran_pixeli, Rezolutie, Panou, Ecran, Format_ecran_Corectie_format, Mod_imagine, Procesare_imagine_Hz, Luminozitate_cd_m2, MCI, Mod_panoramic, Mod_panoramic_pentru_PC, Scene_select, Unghi_de_vizualizare_grade, Contrast_dinamic, Motionflow, Perfect_Motion_Rate_Hz, Caracteristici_video, Facilitati, Caracteristici_3D, Sistem_audio, Putere_de_iesire_sistem_audio_W, Sistem_difuzoare, Mod_sunet, Mod_surround, Caracteristici_audio, Optimizare_sunet, Tip_tuner, Caracteristici_speciale, Intrare_antena, Format_subtitrari, Format_redare_video, Format_redare_audio, Format_redare_imagini, Caracteristici_multimedia, Sistem_de_operare, Versiune_sistem_de_operare, Procesor, Facilitati_Smart_TV, Operare, Aplicatii, EasyLink_HDMI_CEC, MHL, Miracast, Smart_Interaction_Instalare_usoara, Smart_Interaction_Upgrade_firmware, Bluetooth, Wi_Fi_Direct, WiDi, DLNA, Wireless_LAN, Home_Network, AllShare, Web_Browser, Skype, Anynet, Timer_Sleep, Accesorii, Conectori, Standard_VESA_mm, Putere_consumata_in_standby_W, Clasa_de_eficienta_energetica, Dimensiuni_fara_stand_L_x_A_x_I_cm , Dimensiuni_cu_stand_L_x_A_x_I_cm, Greutate_fara_stand_Kg, Greutate_cu_stand_Kg , Culoare, Garantie_comerciala, Brand) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
		
		pstmt.setString(1, nume);
		pstmt.setString(2, specificatii);
		pstmt.setInt(3, cantitate);
		pstmt.setDouble(4, pret);
		pstmt.setString(5, inStoc);
		pstmt.setString(6, tipEcran);
		pstmt.setString(7, tip);
		pstmt.setString(8, tehnologie);
		pstmt.setInt(9, diagonalacm);
		pstmt.setInt(10, dimensiuneEcranInch);
		pstmt.setString(11, rezolutieEcranPixeli);
		pstmt.setString(12, rezolutie);
		pstmt.setString(13, panou);
		pstmt.setString(14, ecran);
		pstmt.setString(15, formatEcranCorectieFormat);
		pstmt.setString(16, modImagine);
		pstmt.setInt(17, procesareImagineHz);
		pstmt.setInt(18, luminozitateCdM2);
		pstmt.setInt(19, mci);
		pstmt.setString(20, modPanoramic);
		pstmt.setString(21, modPanoramicPentruPC);
		pstmt.setString(22, sceneSelect);
		pstmt.setString(23, unghiDeVizualizareGrade);
		pstmt.setString(24, contrastDinamic);
		pstmt.setString(25, motionflow);
		pstmt.setInt(26, perfectMotionRateHz);
		pstmt.setString(27, caracteristiciVideo);
		pstmt.setString(28, facilitati);
		pstmt.setString(29, caracteristici3D);
		pstmt.setString(30, sistemAudio);
		pstmt.setString(31, putereDeIesireSistemAudioW);
		pstmt.setString(32, sistemDifuzoare);
		pstmt.setString(33, modSunet);
		pstmt.setString(34, modSurround);
		pstmt.setString(35, caracteristiciAudio);
		pstmt.setString(36, optimizareSunet);
		pstmt.setString(37, tipTuner);
		pstmt.setString(38, caracteristiciSpeciale);
		pstmt.setString(39, intrareAntena);
		pstmt.setString(40, formatSubtitrari);
		pstmt.setString(41, formatRedareVideo);
		pstmt.setString(42, formatRedareAudio);
		pstmt.setString(43, formatRedareImagini);
		pstmt.setString(44, caracteristiciMultimedia);
		pstmt.setString(45, sistemDeOperare);
		pstmt.setString(46, versiuneSistemDeOperare);
		pstmt.setString(47, procesor);
		pstmt.setString(48, facilitatiSmartTV);
		pstmt.setString(49, operare);
		pstmt.setString(50, aplicatii);
		pstmt.setString(51, easyLinkHDMICEC);
		pstmt.setString(52, mhl);
		pstmt.setString(53, miracast);
		pstmt.setString(54, smartInteractionInstalareUsoara);
		pstmt.setString(55, smartInteractionUpgradeFirmware);
		pstmt.setString(56, bluetooth);
		pstmt.setString(57, wifiDirect);
		pstmt.setString(58, widi);
		pstmt.setString(59, dlna);
		pstmt.setString(60, wirelessLAN);
		pstmt.setString(61, homeNetwork);
		pstmt.setString(62, allShare);
		pstmt.setString(63, webBrowser);
		pstmt.setString(64, skype);
		pstmt.setString(65, anynet);
		pstmt.setString(66, timerSleep);
		pstmt.setString(67, accesorii);
		pstmt.setString(68, conectori);
		pstmt.setString(69, standardVESAmm);
		pstmt.setString(70, putereConsumataInStandbyW);
		pstmt.setString(71, clasaDeEficientaEnergetica);
		pstmt.setString(72, dimensiuniFaraStandLxAxIcm);
		pstmt.setString(73, dimensiuniCuStandLxAxIcm);
		pstmt.setDouble(74, greutateFaraStandKg);
		pstmt.setDouble(75, greutateCuStandKg);
		pstmt.setString(76, culoare);
		pstmt.setString(77, garantieComerciala);
		pstmt.setString(78, brand);
		
		pstmt.executeUpdate();
		
		TV tv=new TV(nume, specificatii, cantitate, pret, inStoc, tipEcran, tip, tehnologie, diagonalacm, dimensiuneEcranInch, rezolutieEcranPixeli, rezolutie, panou, ecran, formatEcranCorectieFormat, modImagine, procesareImagineHz, luminozitateCdM2, mci, modPanoramic, modPanoramicPentruPC, sceneSelect, unghiDeVizualizareGrade, contrastDinamic, motionflow, perfectMotionRateHz, caracteristiciVideo, facilitati, caracteristici3D, sistemAudio, putereDeIesireSistemAudioW, sistemDifuzoare, modSunet, modSurround, caracteristiciAudio, optimizareSunet, tipTuner, caracteristiciSpeciale, intrareAntena, formatSubtitrari, formatRedareVideo, formatRedareAudio, formatRedareImagini, caracteristiciMultimedia, sistemDeOperare, versiuneSistemDeOperare, procesor, facilitatiSmartTV, operare, aplicatii, easyLinkHDMICEC, mhl, miracast, smartInteractionInstalareUsoara, smartInteractionUpgradeFirmware, bluetooth, wifiDirect, widi, dlna, wirelessLAN, homeNetwork, allShare, webBrowser, skype, anynet, timerSleep, accesorii, conectori, standardVESAmm, putereConsumataInStandbyW, clasaDeEficientaEnergetica, dimensiuniFaraStandLxAxIcm, dimensiuniCuStandLxAxIcm, greutateFaraStandKg, greutateCuStandKg, culoare, garantieComerciala, brand);
		
		ResultSet rs = pstmt.getGeneratedKeys();
		if (rs.next()) {
			tv.setId(rs.getInt(1));
		}
		DBHelper.closeConnection(conn);
		
		return tv;

	}
	
	public static TV createTV() throws SQLException {

		TV tv = new TV();
		TVDAO.createTV(tv);
		return tv;
	}
	
	public static void deleteTV(int id) throws SQLException {
		final String sql = "DELETE FROM catalog.tv WHERE id=?;";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql);
		pstmt.setInt(1, id);
		pstmt.executeUpdate();
		
		DBHelper.closeConnection(conn);

	}

	public static void deleteTV(TV tv) throws SQLException {
		TVDAO.deleteTV(tv.getId());
	}

	public static void updateTV(int id, String nume, String specificatii, int cantitate, double pret) throws SQLException {
		final String sql = "UPDATE catalog.tv SET Denumire=?, Specificatii=?, Cantitate=?, Pret=? WHERE id=?;";
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
	
	public static void updateTV(int id, String nume, String specificatii, int cantitate, double pret, String inStoc, String tipEcran, String tip, String tehnologie, int diagonalacm, int dimensiuneEcranInch, String rezolutieEcranPixeli, String rezolutie, String panou, String ecran, String formatEcranCorectieFormat, String modImagine, int procesareImagineHz, int luminozitateCdM2, int mci, String modPanoramic, String modPanoramicPentruPC, String sceneSelect, String unghiDeVizualizareGrade, String contrastDinamic, String motionflow, int perfectMotionRateHz, String caracteristiciVideo, String facilitati, String caracteristici3D, String sistemAudio, String putereDeIesireSistemAudioW, String sistemDifuzoare, String modSunet, String modSurround, String caracteristiciAudio, String optimizareSunet, String tipTuner, String caracteristiciSpeciale, String intrareAntena, String formatSubtitrari, String formatRedareVideo, String formatRedareAudio, String formatRedareImagini, String caracteristiciMultimedia, String sistemDeOperare, String versiuneSistemDeOperare, String procesor, String facilitatiSmartTV, String operare, String aplicatii, String easyLinkHDMICEC, String mhl, String miracast, String smartInteractionInstalareUsoara, String smartInteractionUpgradeFirmware, String bluetooth, String wifiDirect, String widi, String dlna, String wirelessLAN, String homeNetwork, String allShare, String webBrowser, String skype, String anynet, String timerSleep, String accesorii, String conectori, String standardVESAmm, String putereConsumataInStandbyW, String clasaDeEficientaEnergetica, String dimensiuniFaraStandLxAxIcm, String dimensiuniCuStandLxAxIcm, double greutateFaraStandKg, double greutateCuStandKg, String culoare, String garantieComerciala, String brand) throws SQLException {
		
		final String sql1 = "UPDATE catalog.tv SET Nume=?, Specificatii=?, Cantitate=?, Pret=?, In_stoc=?, Tip_ecran=?, Tip=?, Tehnologie=?, Diagonala_cm=?, Dimensiune_ecran_inch=?, Rezolutie_ecran_pixeli=?, Rezolutie=?, Panou=?, Ecran=?, Format_ecran_Corectie_format=?, Mod_imagine=?, Procesare_imagine_Hz=?, Luminozitate_cd_m2=?, MCI=?, Mod_panoramic=?, Mod_panoramic_pentru_PC=?, Scene_select=?, Unghi_de_vizualizare_grade=?, Contrast_dinamic=?, Motionflow=?, Perfect_Motion_Rate_Hz=?, Caracteristici_video=?, Facilitati=?, Caracteristici_3D=?, Sistem_audio=?, Putere_de_iesire_sistem_audio_W=?, Sistem_difuzoare=?, Mod_sunet=?, Mod_surround=?, Caracteristici_audio=?, Optimizare_sunet=?, Tip_tuner=?, Caracteristici_speciale=?, Intrare_antena=?, Format_subtitrari=?, Format_redare_video=?, Format_redare_audio=?, Format_redare_imagini=?, Caracteristici_multimedia=?, Sistem_de_operare=?, Versiune_sistem_de_operare=?, Procesor=?, Facilitati_Smart_TV=?, Operare=?, Aplicatii=?, EasyLink_HDMI_CEC=?, MHL=?, Miracast=?, Smart_Interaction_Instalare_usoara=?, Smart_Interaction_Upgrade_firmware=?, Bluetooth=?, Wi_Fi_Direct=?, WiDi=?, DLNA=?, Wireless_LAN=?, Home_Network=?, AllShare=?, Web_Browser=?, Skype=?, Anynet=?, Timer_Sleep=?, Accesorii=?, Conectori=?, Standard_VESA_mm=?, Putere_consumata_in_standby_W=?, Clasa_de_eficienta_energetica=?, Dimensiuni_fara_stand_L_x_A_x_I_cm=?, Dimensiuni_cu_stand_L_x_A_x_I_cm=?, Greutate_fara_stand_Kg=?, Greutate_cu_stand_Kg=?, Culoare=?, Garantie_comerciala=? Brand=? WHERE id=?;";
		Connection conn = DBHelper.openConnection();

		PreparedStatement pstmt = conn.prepareStatement(sql1);
		
		pstmt.setString(1, nume);
		pstmt.setString(2, specificatii);
		pstmt.setInt(3, cantitate);
		pstmt.setDouble(4, pret);
		pstmt.setString(5, inStoc);
		pstmt.setString(6, tipEcran);
		pstmt.setString(7, tip);
		pstmt.setString(8, tehnologie);
		pstmt.setInt(9, diagonalacm);
		pstmt.setInt(10, dimensiuneEcranInch);
		pstmt.setString(11, rezolutieEcranPixeli);
		pstmt.setString(12, rezolutie);
		pstmt.setString(13, panou);
		pstmt.setString(14, ecran);
		pstmt.setString(15, formatEcranCorectieFormat);
		pstmt.setString(16, modImagine);
		pstmt.setInt(17, procesareImagineHz);
		pstmt.setInt(18, luminozitateCdM2);
		pstmt.setInt(19, mci);
		pstmt.setString(20, modPanoramic);
		pstmt.setString(21, modPanoramicPentruPC);
		pstmt.setString(22, sceneSelect);
		pstmt.setString(23, unghiDeVizualizareGrade);
		pstmt.setString(24, contrastDinamic);
		pstmt.setString(25, motionflow);
		pstmt.setInt(26, perfectMotionRateHz);
		pstmt.setString(27, caracteristiciVideo);
		pstmt.setString(28, facilitati);
		pstmt.setString(29, caracteristici3D);
		pstmt.setString(30, sistemAudio);
		pstmt.setString(31, putereDeIesireSistemAudioW);
		pstmt.setString(32, sistemDifuzoare);
		pstmt.setString(33, modSunet);
		pstmt.setString(34, modSurround);
		pstmt.setString(35, caracteristiciAudio);
		pstmt.setString(36, optimizareSunet);
		pstmt.setString(37, tipTuner);
		pstmt.setString(38, caracteristiciSpeciale);
		pstmt.setString(39, intrareAntena);
		pstmt.setString(40, formatSubtitrari);
		pstmt.setString(41, formatRedareVideo);
		pstmt.setString(42, formatRedareAudio);
		pstmt.setString(43, formatRedareImagini);
		pstmt.setString(44, caracteristiciMultimedia);
		pstmt.setString(45, sistemDeOperare);
		pstmt.setString(46, versiuneSistemDeOperare);
		pstmt.setString(47, procesor);
		pstmt.setString(48, facilitatiSmartTV);
		pstmt.setString(49, operare);
		pstmt.setString(50, aplicatii);
		pstmt.setString(51, easyLinkHDMICEC);
		pstmt.setString(52, mhl);
		pstmt.setString(53, miracast);
		pstmt.setString(54, smartInteractionInstalareUsoara);
		pstmt.setString(55, smartInteractionUpgradeFirmware);
		pstmt.setString(56, bluetooth);
		pstmt.setString(57, wifiDirect);
		pstmt.setString(58, widi);
		pstmt.setString(59, dlna);
		pstmt.setString(60, wirelessLAN);
		pstmt.setString(61, homeNetwork);
		pstmt.setString(62, allShare);
		pstmt.setString(63, webBrowser);
		pstmt.setString(64, skype);
		pstmt.setString(65, anynet);
		pstmt.setString(66, timerSleep);
		pstmt.setString(67, accesorii);
		pstmt.setString(68, conectori);
		pstmt.setString(69, standardVESAmm);
		pstmt.setString(70, putereConsumataInStandbyW);
		pstmt.setString(71, clasaDeEficientaEnergetica);
		pstmt.setString(72, dimensiuniFaraStandLxAxIcm);
		pstmt.setString(73, dimensiuniCuStandLxAxIcm);
		pstmt.setDouble(74, greutateFaraStandKg);
		pstmt.setDouble(75, greutateCuStandKg);
		pstmt.setString(76, culoare);
		pstmt.setString(77, garantieComerciala);
		pstmt.setString(78, brand);
		pstmt.setInt(79, id);
		
		pstmt.executeUpdate();
		
		DBHelper.closeConnection(conn);
	}

	public static void updateTV(TV tv) throws SQLException {
		
		TVDAO.updateTV(tv.getId(), tv.getNume(), tv.getSpecificatii(), tv.getCantitate(), tv.getPret(), tv.getInStoc(), tv.getTipEcran(), tv.getTip(), tv.getTehnologie(), tv.getDiagonalacm(), tv.getDimensiuneEcranInch(), tv.getRezolutieEcranPixeli(), tv.getRezolutie(), tv.getPanou(), tv.getEcran(), tv.getFormatEcranCorectieFormat(), tv.getModImagine(), tv.getProcesareImagineHz(), tv.getLuminozitateCdM2(), tv.getMci(), tv.getModPanoramic(), tv.getModPanoramicPentruPC(), tv.getSceneSelect(), tv.getUnghiDeVizualizareGrade(), tv.getContrastDinamic(), tv.getMotionflow(), tv.getPerfectMotionRateHz(), tv.getCaracteristiciVideo(), tv.getFacilitati(), tv.getCaracteristici3D(), tv.getSistemAudio(), tv.getPutereDeIesireSistemAudioW(), tv.getSistemDifuzoare(), tv.getModSunet(), tv.getModSurround(), tv.getCaracteristiciAudio(), tv.getOptimizareSunet(), tv.getTipTuner(), tv.getCaracteristiciSpeciale(), tv.getIntrareAntena(), tv.getFormatSubtitrari(), tv.getFormatRedareVideo(), tv.getFormatRedareAudio(), tv.getFormatRedareImagini(), tv.getCaracteristiciMultimedia(), tv.getSistemDeOperare(), tv.getVersiuneSistemDeOperare(), tv.getProcesor(), tv.getFacilitatiSmartTV(), tv.getOperare(), tv.getAplicatii(), tv.getEasyLinkHDMICEC(), tv.getMhl(), tv.getMiracast(), tv.getSmartInteractionInstalareUsoara(), tv.getSmartInteractionUpgradeFirmware(), tv.getBluetooth(), tv.getWifiDirect(), tv.getWidi(), tv.getDlna(), tv.getWirelessLAN(), tv.getHomeNetwork(), tv.getAllShare(), tv.getWebBrowser(), tv.getSkype(), tv.getAnynet(), tv.getTimerSleep(), tv.getAccesorii(), tv.getConectori(), tv.getStandardVESAmm(), tv.getPutereConsumataInStandbyW(), tv.getClasaDeEficientaEnergetica(), tv.getDimensiuniFaraStandLxAxIcm(), tv.getDimensiuniCuStandLxAxIcm(), tv.getGreutateFaraStandKg(), tv.getGreutateCuStandKg(), tv.getCuloare(), tv.getGarantieComerciala(), tv.getBrand());
	
	}
	
	public static TV getTV(int id) throws SQLException {
		final String sql = "SELECT id, Nume, Specificatii, Cantitate, Pret, In_stoc, Tip_ecran, Tip, Tehnologie, Diagonala_cm, Dimensiune_ecran_inch, Rezolutie_ecran_pixeli, Rezolutie, Panou, Ecran, Format_ecran_Corectie_format, Mod_imagine, Procesare_imagine_Hz, Luminozitate_cd_m2, MCI, Mod_panoramic, Mod_panoramic_pentru_PC, Scene_select, Unghi_de_vizualizare_grade, Contrast_dinamic, Motionflow, Perfect_Motion_Rate_Hz, Caracteristici_video, Facilitati, Caracteristici_3D, Sistem_audio, Putere_de_iesire_sistem_audio_W, Sistem_difuzoare, Mod_sunet, Mod_surround, Caracteristici_audio, Optimizare_sunet, Tip_tuner, Caracteristici_speciale, Intrare_antena, Format_subtitrari, Format_redare_video, Format_redare_audio, Format_redare_imagini, Caracteristici_multimedia, Sistem_de_operare, Versiune_sistem_de_operare, Procesor, Facilitati_Smart_TV, Operare, Aplicatii, EasyLink_HDMI_CEC, MHL, Miracast, Smart_Interaction_Instalare_usoara, Smart_Interaction_Upgrade_firmware, Bluetooth, Wi_Fi_Direct, WiDi, DLNA, Wireless_LAN, Home_Network, AllShare, Web_Browser, Skype, Anynet, Timer_Sleep, Accesorii, Conectori, Standard_VESA_mm, Putere_consumata_in_standby_W, Clasa_de_eficienta_energetica, Dimensiuni_fara_stand_L_x_A_x_I_cm , Dimensiuni_cu_stand_L_x_A_x_I_cm, Greutate_fara_stand_Kg, Greutate_cu_stand_Kg , Culoare, Garantie_comerciala, Brand FROM catalog.tv WHERE id=?;";
		Connection conn = DBHelper.openConnection();
		TV tv = new TV();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		pstmt.setInt(1, id);
		ResultSet rs = pstmt.executeQuery();
		
		if (rs.next()) {
			tv.setId(rs.getInt("id"));
			
			if (rs.getString("Nume")==null) {
				tv.setNume("");
			} else tv.setNume(rs.getString("Nume"));
			
			if (rs.getString("Specificatii")==null) {
				tv.setSpecificatii("");
			} else tv.setSpecificatii(rs.getString("Specificatii"));
			
			tv.setCantitate(rs.getInt("Cantitate"));
			tv.setPret(rs.getDouble("Pret"));
			
			if (rs.getString("In_stoc")==null) {
				tv.setInStoc("");
			} else tv.setInStoc(rs.getString("In_stoc"));

			if (rs.getString("Tip_ecran")==null) {
				tv.setTipEcran("");
			} else tv.setTipEcran(rs.getString("Tip_ecran"));
			
			if (rs.getString("Tip")==null) {
				tv.setTip("");
			} else tv.setTip(rs.getString("Tip"));
			
			if (rs.getString("Tehnologie")==null) {
				tv.setTehnologie("");
			} else tv.setTehnologie(rs.getString("Tehnologie"));
			
			tv.setDiagonalacm(rs.getInt("Diagonala_cm"));
			tv.setDimensiuneEcranInch(rs.getInt("Dimensiune_ecran_inch"));
			
			if (rs.getString("Rezolutie_ecran_pixeli")==null) {
				tv.setRezolutieEcranPixeli("");
			} else tv.setRezolutieEcranPixeli(rs.getString("Rezolutie_ecran_pixeli"));
			
			if (rs.getString("Rezolutie")==null) {
				tv.setRezolutie("");
			} else tv.setRezolutie(rs.getString("Rezolutie"));
			
			if (rs.getString("Panou")==null) {
				tv.setPanou("");
			} else tv.setPanou(rs.getString("Panou"));
			
			if (rs.getString("Ecran")==null) {
				tv.setEcran("");
			} else tv.setEcran(rs.getString("Ecran"));
			
			if (rs.getString("Format_ecran_Corectie_format")==null) {
				tv.setFormatEcranCorectieFormat("");
			} else tv.setFormatEcranCorectieFormat(rs.getString("Format_ecran_Corectie_format"));
			
			if (rs.getString("Mod_imagine")==null) {
				tv.setModImagine("");
			} else tv.setModImagine(rs.getString("Mod_imagine"));
			
			tv.setProcesareImagineHz(rs.getInt("Procesare_imagine_Hz"));
			tv.setLuminozitateCdM2(rs.getInt("Luminozitate_cd_m2"));
			tv.setMci(rs.getInt("MCI"));
			
			if (rs.getString("Mod_panoramic")==null) {
				tv.setModPanoramic("");
			} else tv.setModPanoramic(rs.getString("Mod_panoramic"));
			
			if (rs.getString("Mod_panoramic_pentru_PC")==null) {
				tv.setModPanoramicPentruPC("");
			} else tv.setModPanoramicPentruPC(rs.getString("Mod_panoramic_pentru_PC"));
			
			if (rs.getString("Scene_select")==null) {
				tv.setSceneSelect("");
			} else tv.setSceneSelect(rs.getString("Scene_select"));
			
			if (rs.getString("Unghi_de_vizualizare_grade")==null) {
				tv.setUnghiDeVizualizareGrade("");
			} else tv.setUnghiDeVizualizareGrade(rs.getString("Unghi_de_vizualizare_grade"));
			
			if (rs.getString("Contrast_dinamic")==null) {
				tv.setContrastDinamic("");
			} else tv.setContrastDinamic(rs.getString("Contrast_dinamic"));
			
			if (rs.getString("Motionflow")==null) {
				tv.setMotionflow("");
			} else tv.setMotionflow(rs.getString("Motionflow"));

			tv.setPerfectMotionRateHz(rs.getInt("Perfect_Motion_Rate_Hz"));
			
			if (rs.getString("Caracteristici_video")==null) {
				tv.setCaracteristiciVideo("");
			} else tv.setCaracteristiciVideo(rs.getString("Caracteristici_video"));
			
			if (rs.getString("Facilitati")==null) {
				tv.setFacilitati("");
			} else tv.setFacilitati(rs.getString("Facilitati"));
						
			if (rs.getString("Caracteristici_3D")==null) {
				tv.setCaracteristici3D("");
			} else tv.setCaracteristici3D(rs.getString("Caracteristici_3D"));
			
			if (rs.getString("Sistem_audio")==null) {
				tv.setSistemAudio("");
			} else tv.setSistemAudio(rs.getString("Sistem_audio"));
			
			if (rs.getString("Putere_de_iesire_sistem_audio_W")==null) {
				tv.setPutereDeIesireSistemAudioW("");
			} else tv.setPutereDeIesireSistemAudioW(rs.getString("Putere_de_iesire_sistem_audio_W"));
			
			if (rs.getString("Sistem_difuzoare")==null) {
				tv.setSistemDifuzoare("");
			} else tv.setSistemDifuzoare(rs.getString("Sistem_difuzoare"));
			
			if (rs.getString("Mod_sunet")==null) {
				tv.setModSunet("");
			} else tv.setModSunet(rs.getString("Mod_sunet"));
			
			if (rs.getString("Mod_surround")==null) {
				tv.setModSurround("");
			} else tv.setModSurround(rs.getString("Mod_surround"));
			
			if (rs.getString("Caracteristici_audio")==null) {
				tv.setCaracteristiciAudio("");
			} else tv.setCaracteristiciAudio(rs.getString("Caracteristici_audio"));
			
			if (rs.getString("Optimizare_sunet")==null) {
				tv.setOptimizareSunet("");
			} else tv.setOptimizareSunet(rs.getString("Optimizare_sunet"));
			
			if (rs.getString("Tip_tuner")==null) {
				tv.setTipTuner("");
			} else tv.setTipTuner(rs.getString("Tip_tuner"));
			
			if (rs.getString("Caracteristici_speciale")==null) {
				tv.setCaracteristiciSpeciale("");
			} else tv.setCaracteristiciSpeciale(rs.getString("Caracteristici_speciale"));
			
			if (rs.getString("Intrare_antena")==null) {
				tv.setIntrareAntena("");
			} else tv.setIntrareAntena(rs.getString("Intrare_antena"));
			
			if (rs.getString("Format_subtitrari")==null) {
				tv.setFormatSubtitrari("");
			} else tv.setFormatSubtitrari(rs.getString("Format_subtitrari"));
			
			if (rs.getString("Format_redare_video")==null) {
				tv.setFormatRedareVideo("");
			} else tv.setFormatRedareVideo(rs.getString("Format_redare_video"));
			
			if (rs.getString("Format_redare_audio")==null) {
				tv.setFormatRedareAudio("");
			} else tv.setFormatRedareAudio(rs.getString("Format_redare_audio"));
			
			if (rs.getString("Format_redare_imagini")==null) {
				tv.setFormatRedareImagini("");
			} else tv.setFormatRedareImagini(rs.getString("Format_redare_imagini"));
			
			if (rs.getString("Caracteristici_multimedia")==null) {
				tv.setCaracteristiciMultimedia("");
			} else tv.setCaracteristiciMultimedia(rs.getString("Caracteristici_multimedia"));
			
			if (rs.getString("Sistem_de_operare")==null) {
				tv.setSistemDeOperare("");
			} else tv.setSistemDeOperare(rs.getString("Sistem_de_operare"));
			
			if (rs.getString("Versiune_sistem_de_operare")==null) {
				tv.setVersiuneSistemDeOperare("");
			} else tv.setVersiuneSistemDeOperare(rs.getString("Versiune_sistem_de_operare"));
			
			if (rs.getString("Procesor")==null) {
				tv.setProcesor("");
			} else tv.setProcesor(rs.getString("Procesor"));
			
			if (rs.getString("Facilitati_Smart_TV")==null) {
				tv.setFacilitatiSmartTV("");
			} else tv.setFacilitatiSmartTV(rs.getString("Facilitati_Smart_TV"));
			
			if (rs.getString("Operare")==null) {
				tv.setOperare("");
			} else tv.setOperare(rs.getString("Operare"));
			
			if (rs.getString("Aplicatii")==null) {
				tv.setAplicatii("");
			} else tv.setAplicatii(rs.getString("Aplicatii"));
			
			if (rs.getString("EasyLink_HDMI_CEC")==null) {
				tv.setEasyLinkHDMICEC("");
			} else tv.setEasyLinkHDMICEC(rs.getString("EasyLink_HDMI_CEC"));
			
			if (rs.getString("MHL")==null) {
				tv.setMhl("");
			} else tv.setMhl(rs.getString("MHL"));
			
			if (rs.getString("Miracast")==null) {
				tv.setMiracast("");
			} else tv.setMiracast(rs.getString("Miracast"));
			
			if (rs.getString("Smart_Interaction_Instalare_usoara")==null) {
				tv.setSmartInteractionInstalareUsoara("");
			} else tv.setSmartInteractionInstalareUsoara(rs.getString("Smart_Interaction_Instalare_usoara"));
			
			if (rs.getString("Smart_Interaction_Upgrade_firmware")==null) {
				tv.setSmartInteractionUpgradeFirmware("");
			} else tv.setSmartInteractionUpgradeFirmware(rs.getString("Smart_Interaction_Upgrade_firmware"));
			
			if (rs.getString("Bluetooth")==null) {
				tv.setBluetooth("");
			} else tv.setBluetooth(rs.getString("Bluetooth"));
			
			if (rs.getString("Wi_Fi_Direct")==null) {
				tv.setWifiDirect("");
			} else tv.setWifiDirect(rs.getString("Wi_Fi_Direct"));
			
			if (rs.getString("WiDi")==null) {
				tv.setWidi("");
			} else tv.setWidi(rs.getString("WiDi"));
			
			if (rs.getString("DLNA")==null) {
				tv.setDlna("");
			} else tv.setDlna(rs.getString("DLNA"));
						
			if (rs.getString("Wireless_LAN")==null) {
				tv.setWirelessLAN("");
			} else tv.setWirelessLAN(rs.getString("Wireless_LAN"));
			
			if (rs.getString("Home_Network")==null) {
				tv.setHomeNetwork("");
			} else tv.setHomeNetwork(rs.getString("Home_Network"));			
			
			if (rs.getString("AllShare")==null) {
				tv.setAllShare("");
			} else tv.setAllShare(rs.getString("AllShare"));
			
			if (rs.getString("Web_Browser")==null) {
				tv.setWebBrowser("");
			} else tv.setWebBrowser(rs.getString("Web_Browser"));
			
			if (rs.getString("Skype")==null) {
				tv.setSkype("");
			} else tv.setSkype(rs.getString("Skype"));
			
			if (rs.getString("Anynet")==null) {
				tv.setAnynet("");
			} else tv.setAnynet(rs.getString("Anynet"));
			
			if (rs.getString("Timer_Sleep")==null) {
				tv.setTimerSleep("");
			} else tv.setTimerSleep(rs.getString("Timer_Sleep"));
			
			if (rs.getString("Accesorii")==null) {
				tv.setAccesorii("");
			} else tv.setAccesorii(rs.getString("Accesorii"));
			
			if (rs.getString("Conectori")==null) {
				tv.setConectori("");
			} else tv.setConectori(rs.getString("Conectori"));
					
			if (rs.getString("Standard_VESA_mm")==null) {
				tv.setStandardVESAmm("");
			} else tv.setStandardVESAmm(rs.getString("Standard_VESA_mm"));
			
			if (rs.getString("Putere_consumata_in_standby_W")==null) {
				tv.setPutereConsumataInStandbyW("");
			} else tv.setPutereConsumataInStandbyW(rs.getString("Putere_consumata_in_standby_W"));
			
			if (rs.getString("Clasa_de_eficienta_energetica")==null) {
				tv.setClasaDeEficientaEnergetica("");
			} else tv.setClasaDeEficientaEnergetica(rs.getString("Clasa_de_eficienta_energetica"));
			
			if (rs.getString("Dimensiuni_fara_stand_L_x_A_x_I_cm")==null) {
				tv.setDimensiuniFaraStandLxAxIcm("");
			} else tv.setDimensiuniFaraStandLxAxIcm(rs.getString("Dimensiuni_fara_stand_L_x_A_x_I_cm"));
			
			if (rs.getString("Dimensiuni_cu_stand_L_x_A_x_I_cm")==null) {
				tv.setDimensiuniCuStandLxAxIcm("");
			} else tv.setDimensiuniCuStandLxAxIcm(rs.getString("Dimensiuni_cu_stand_L_x_A_x_I_cm"));
			
			tv.setGreutateFaraStandKg(rs.getDouble("Greutate_fara_stand_Kg"));
			tv.setGreutateCuStandKg(rs.getDouble("Greutate_cu_stand_Kg"));
			
			if (rs.getString("Culoare")==null) {
				tv.setCuloare("");
			} else tv.setCuloare(rs.getString("Culoare"));
			
			if (rs.getString("Garantie_comerciala")==null) {
				tv.setGarantieComerciala("");
			} else tv.setGarantieComerciala(rs.getString("Garantie_comerciala"));
			
			if (rs.getString("Brand")==null) {
				tv.setBrand("");
			} else tv.setBrand(rs.getString("Brand"));			
			
			tv.setPhoto(PhotoDAO.getPhotoAddressesTvs(rs.getInt("id")));
			
		}

		DBHelper.closeConnection(conn);
		return tv;
	}

	public static ArrayList<TV> getUserTVs() throws SQLException {
		ArrayList<TV> tvList = new ArrayList<>();
		final String sql = "SELECT * FROM catalog.tv;";
		Connection conn = DBHelper.openConnection();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		ResultSet rs = pstmt.executeQuery();

		while (rs.next()) {
			
			TV tv = new TV();
			
			tv.setId(rs.getInt("id"));
			
			if (rs.getString("Nume")==null) {
				tv.setNume("");
			} else tv.setNume(rs.getString("Nume"));
			
			if (rs.getString("Specificatii")==null) {
				tv.setSpecificatii("");
			} else tv.setSpecificatii(rs.getString("Specificatii"));
			
			tv.setCantitate(rs.getInt("Cantitate"));
			tv.setPret(rs.getDouble("Pret"));
			
			if (rs.getString("In_stoc")==null) {
				tv.setInStoc("");
			} else tv.setInStoc(rs.getString("In_stoc"));

			if (rs.getString("Tip_ecran")==null) {
				tv.setTipEcran("");
			} else tv.setTipEcran(rs.getString("Tip_ecran"));
			
			if (rs.getString("Tip")==null) {
				tv.setTip("");
			} else tv.setTip(rs.getString("Tip"));
			
			if (rs.getString("Tehnologie")==null) {
				tv.setTehnologie("");
			} else tv.setTehnologie(rs.getString("Tehnologie"));
			
			tv.setDiagonalacm(rs.getInt("Diagonala_cm"));
			tv.setDimensiuneEcranInch(rs.getInt("Dimensiune_ecran_inch"));
			
			if (rs.getString("Rezolutie_ecran_pixeli")==null) {
				tv.setRezolutieEcranPixeli("");
			} else tv.setRezolutieEcranPixeli(rs.getString("Rezolutie_ecran_pixeli"));
			
			if (rs.getString("Rezolutie")==null) {
				tv.setRezolutie("");
			} else tv.setRezolutie(rs.getString("Rezolutie"));
			
			if (rs.getString("Panou")==null) {
				tv.setPanou("");
			} else tv.setPanou(rs.getString("Panou"));
			
			if (rs.getString("Ecran")==null) {
				tv.setEcran("");
			} else tv.setEcran(rs.getString("Ecran"));
			
			if (rs.getString("Format_ecran_Corectie_format")==null) {
				tv.setFormatEcranCorectieFormat("");
			} else tv.setFormatEcranCorectieFormat(rs.getString("Format_ecran_Corectie_format"));
			
			if (rs.getString("Mod_imagine")==null) {
				tv.setModImagine("");
			} else tv.setModImagine(rs.getString("Mod_imagine"));
			
			tv.setProcesareImagineHz(rs.getInt("Procesare_imagine_Hz"));
			tv.setLuminozitateCdM2(rs.getInt("Luminozitate_cd_m2"));
			tv.setMci(rs.getInt("MCI"));
			
			if (rs.getString("Mod_panoramic")==null) {
				tv.setModPanoramic("");
			} else tv.setModPanoramic(rs.getString("Mod_panoramic"));
			
			if (rs.getString("Mod_panoramic_pentru_PC")==null) {
				tv.setModPanoramicPentruPC("");
			} else tv.setModPanoramicPentruPC(rs.getString("Mod_panoramic_pentru_PC"));
			
			if (rs.getString("Scene_select")==null) {
				tv.setSceneSelect("");
			} else tv.setSceneSelect(rs.getString("Scene_select"));
			
			if (rs.getString("Unghi_de_vizualizare_grade")==null) {
				tv.setUnghiDeVizualizareGrade("");
			} else tv.setUnghiDeVizualizareGrade(rs.getString("Unghi_de_vizualizare_grade"));
			
			if (rs.getString("Contrast_dinamic")==null) {
				tv.setContrastDinamic("");
			} else tv.setContrastDinamic(rs.getString("Contrast_dinamic"));
			
			if (rs.getString("Motionflow")==null) {
				tv.setMotionflow("");
			} else tv.setMotionflow(rs.getString("Motionflow"));

			tv.setPerfectMotionRateHz(rs.getInt("Perfect_Motion_Rate_Hz"));
			
			if (rs.getString("Caracteristici_video")==null) {
				tv.setCaracteristiciVideo("");
			} else tv.setCaracteristiciVideo(rs.getString("Caracteristici_video"));
			
			if (rs.getString("Facilitati")==null) {
				tv.setFacilitati("");
			} else tv.setFacilitati(rs.getString("Facilitati"));
						
			if (rs.getString("Caracteristici_3D")==null) {
				tv.setCaracteristici3D("");
			} else tv.setCaracteristici3D(rs.getString("Caracteristici_3D"));
			
			if (rs.getString("Sistem_audio")==null) {
				tv.setSistemAudio("");
			} else tv.setSistemAudio(rs.getString("Sistem_audio"));
			
			if (rs.getString("Putere_de_iesire_sistem_audio_W")==null) {
				tv.setPutereDeIesireSistemAudioW("");
			} else tv.setPutereDeIesireSistemAudioW(rs.getString("Putere_de_iesire_sistem_audio_W"));
			
			if (rs.getString("Sistem_difuzoare")==null) {
				tv.setSistemDifuzoare("");
			} else tv.setSistemDifuzoare(rs.getString("Sistem_difuzoare"));
			
			if (rs.getString("Mod_sunet")==null) {
				tv.setModSunet("");
			} else tv.setModSunet(rs.getString("Mod_sunet"));
			
			if (rs.getString("Mod_surround")==null) {
				tv.setModSurround("");
			} else tv.setModSurround(rs.getString("Mod_surround"));
			
			if (rs.getString("Caracteristici_audio")==null) {
				tv.setCaracteristiciAudio("");
			} else tv.setCaracteristiciAudio(rs.getString("Caracteristici_audio"));
			
			if (rs.getString("Optimizare_sunet")==null) {
				tv.setOptimizareSunet("");
			} else tv.setOptimizareSunet(rs.getString("Optimizare_sunet"));
			
			if (rs.getString("Tip_tuner")==null) {
				tv.setTipTuner("");
			} else tv.setTipTuner(rs.getString("Tip_tuner"));
			
			if (rs.getString("Caracteristici_speciale")==null) {
				tv.setCaracteristiciSpeciale("");
			} else tv.setCaracteristiciSpeciale(rs.getString("Caracteristici_speciale"));
			
			if (rs.getString("Intrare_antena")==null) {
				tv.setIntrareAntena("");
			} else tv.setIntrareAntena(rs.getString("Intrare_antena"));
			
			if (rs.getString("Format_subtitrari")==null) {
				tv.setFormatSubtitrari("");
			} else tv.setFormatSubtitrari(rs.getString("Format_subtitrari"));
			
			if (rs.getString("Format_redare_video")==null) {
				tv.setFormatRedareVideo("");
			} else tv.setFormatRedareVideo(rs.getString("Format_redare_video"));
			
			if (rs.getString("Format_redare_audio")==null) {
				tv.setFormatRedareAudio("");
			} else tv.setFormatRedareAudio(rs.getString("Format_redare_audio"));
			
			if (rs.getString("Format_redare_imagini")==null) {
				tv.setFormatRedareImagini("");
			} else tv.setFormatRedareImagini(rs.getString("Format_redare_imagini"));
			
			if (rs.getString("Caracteristici_multimedia")==null) {
				tv.setCaracteristiciMultimedia("");
			} else tv.setCaracteristiciMultimedia(rs.getString("Caracteristici_multimedia"));
			
			if (rs.getString("Sistem_de_operare")==null) {
				tv.setSistemDeOperare("");
			} else tv.setSistemDeOperare(rs.getString("Sistem_de_operare"));
			
			if (rs.getString("Versiune_sistem_de_operare")==null) {
				tv.setVersiuneSistemDeOperare("");
			} else tv.setVersiuneSistemDeOperare(rs.getString("Versiune_sistem_de_operare"));
			
			if (rs.getString("Procesor")==null) {
				tv.setProcesor("");
			} else tv.setProcesor(rs.getString("Procesor"));
			
			if (rs.getString("Facilitati_Smart_TV")==null) {
				tv.setFacilitatiSmartTV("");
			} else tv.setFacilitatiSmartTV(rs.getString("Facilitati_Smart_TV"));
			
			if (rs.getString("Operare")==null) {
				tv.setOperare("");
			} else tv.setOperare(rs.getString("Operare"));
			
			if (rs.getString("Aplicatii")==null) {
				tv.setAplicatii("");
			} else tv.setAplicatii(rs.getString("Aplicatii"));
			
			if (rs.getString("EasyLink_HDMI_CEC")==null) {
				tv.setEasyLinkHDMICEC("");
			} else tv.setEasyLinkHDMICEC(rs.getString("EasyLink_HDMI_CEC"));
			
			if (rs.getString("MHL")==null) {
				tv.setMhl("");
			} else tv.setMhl(rs.getString("MHL"));
			
			if (rs.getString("Miracast")==null) {
				tv.setMiracast("");
			} else tv.setMiracast(rs.getString("Miracast"));
			
			if (rs.getString("Smart_Interaction_Instalare_usoara")==null) {
				tv.setSmartInteractionInstalareUsoara("");
			} else tv.setSmartInteractionInstalareUsoara(rs.getString("Smart_Interaction_Instalare_usoara"));
			
			if (rs.getString("Smart_Interaction_Upgrade_firmware")==null) {
				tv.setSmartInteractionUpgradeFirmware("");
			} else tv.setSmartInteractionUpgradeFirmware(rs.getString("Smart_Interaction_Upgrade_firmware"));
			
			if (rs.getString("Bluetooth")==null) {
				tv.setBluetooth("");
			} else tv.setBluetooth(rs.getString("Bluetooth"));
			
			if (rs.getString("Wi_Fi_Direct")==null) {
				tv.setWifiDirect("");
			} else tv.setWifiDirect(rs.getString("Wi_Fi_Direct"));
			
			if (rs.getString("WiDi")==null) {
				tv.setWidi("");
			} else tv.setWidi(rs.getString("WiDi"));
			
			if (rs.getString("DLNA")==null) {
				tv.setDlna("");
			} else tv.setDlna(rs.getString("DLNA"));
						
			if (rs.getString("Wireless_LAN")==null) {
				tv.setWirelessLAN("");
			} else tv.setWirelessLAN(rs.getString("Wireless_LAN"));
			
			if (rs.getString("Home_Network")==null) {
				tv.setHomeNetwork("");
			} else tv.setHomeNetwork(rs.getString("Home_Network"));			
			
			if (rs.getString("AllShare")==null) {
				tv.setAllShare("");
			} else tv.setAllShare(rs.getString("AllShare"));
			
			if (rs.getString("Web_Browser")==null) {
				tv.setWebBrowser("");
			} else tv.setWebBrowser(rs.getString("Web_Browser"));
			
			if (rs.getString("Skype")==null) {
				tv.setSkype("");
			} else tv.setSkype(rs.getString("Skype"));
			
			if (rs.getString("Anynet")==null) {
				tv.setAnynet("");
			} else tv.setAnynet(rs.getString("Anynet"));
			
			if (rs.getString("Timer_Sleep")==null) {
				tv.setTimerSleep("");
			} else tv.setTimerSleep(rs.getString("Timer_Sleep"));
			
			if (rs.getString("Accesorii")==null) {
				tv.setAccesorii("");
			} else tv.setAccesorii(rs.getString("Accesorii"));
			
			if (rs.getString("Conectori")==null) {
				tv.setConectori("");
			} else tv.setConectori(rs.getString("Conectori"));
					
			if (rs.getString("Standard_VESA_mm")==null) {
				tv.setStandardVESAmm("");
			} else tv.setStandardVESAmm(rs.getString("Standard_VESA_mm"));
			
			if (rs.getString("Putere_consumata_in_standby_W")==null) {
				tv.setPutereConsumataInStandbyW("");
			} else tv.setPutereConsumataInStandbyW(rs.getString("Putere_consumata_in_standby_W"));
			
			if (rs.getString("Clasa_de_eficienta_energetica")==null) {
				tv.setClasaDeEficientaEnergetica("");
			} else tv.setClasaDeEficientaEnergetica(rs.getString("Clasa_de_eficienta_energetica"));
			
			if (rs.getString("Dimensiuni_fara_stand_L_x_A_x_I_cm")==null) {
				tv.setDimensiuniFaraStandLxAxIcm("");
			} else tv.setDimensiuniFaraStandLxAxIcm(rs.getString("Dimensiuni_fara_stand_L_x_A_x_I_cm"));
			
			if (rs.getString("Dimensiuni_cu_stand_L_x_A_x_I_cm")==null) {
				tv.setDimensiuniCuStandLxAxIcm("");
			} else tv.setDimensiuniCuStandLxAxIcm(rs.getString("Dimensiuni_cu_stand_L_x_A_x_I_cm"));
			
			tv.setGreutateFaraStandKg(rs.getDouble("Greutate_fara_stand_Kg"));
			tv.setGreutateCuStandKg(rs.getDouble("Greutate_cu_stand_Kg"));
			
			if (rs.getString("Culoare")==null) {
				tv.setCuloare("");
			} else tv.setCuloare(rs.getString("Culoare"));
			
			if (rs.getString("Garantie_comerciala")==null) {
				tv.setGarantieComerciala("");
			} else tv.setGarantieComerciala(rs.getString("Garantie_comerciala"));
			
			if (rs.getString("Brand")==null) {
				tv.setBrand("");
			} else tv.setBrand(rs.getString("Brand"));
			
			tv.setPhoto(PhotoDAO.getPhotoAddressesTvs(rs.getInt("id")));
			
			if(rs.getDouble("Pret")<15000) {
				tvList.add(tv);
			}
			
		}
		
		DBHelper.closeConnection(conn);
		return tvList;

	}
	
	public static ArrayList<TV> getSuperuserTVs() throws SQLException {
		ArrayList<TV> tvList = new ArrayList<>();
		final String sql = "SELECT * FROM catalog.tv;";
		Connection conn = DBHelper.openConnection();
		PreparedStatement pstmt = conn.prepareStatement(sql);
		ResultSet rs = pstmt.executeQuery();

		while (rs.next()) {
			
			TV tv = new TV();
			
			tv.setId(rs.getInt("id"));
			
			if (rs.getString("Nume")==null) {
				tv.setNume("");
			} else tv.setNume(rs.getString("Nume"));
			
			if (rs.getString("Specificatii")==null) {
				tv.setSpecificatii("");
			} else tv.setSpecificatii(rs.getString("Specificatii"));
			
			tv.setCantitate(rs.getInt("Cantitate"));
			tv.setPret(rs.getDouble("Pret"));
			
			if (rs.getString("In_stoc")==null) {
				tv.setInStoc("");
			} else tv.setInStoc(rs.getString("In_stoc"));

			if (rs.getString("Tip_ecran")==null) {
				tv.setTipEcran("");
			} else tv.setTipEcran(rs.getString("Tip_ecran"));
			
			if (rs.getString("Tip")==null) {
				tv.setTip("");
			} else tv.setTip(rs.getString("Tip"));
			
			if (rs.getString("Tehnologie")==null) {
				tv.setTehnologie("");
			} else tv.setTehnologie(rs.getString("Tehnologie"));
			
			tv.setDiagonalacm(rs.getInt("Diagonala_cm"));
			tv.setDimensiuneEcranInch(rs.getInt("Dimensiune_ecran_inch"));
			
			if (rs.getString("Rezolutie_ecran_pixeli")==null) {
				tv.setRezolutieEcranPixeli("");
			} else tv.setRezolutieEcranPixeli(rs.getString("Rezolutie_ecran_pixeli"));
			
			if (rs.getString("Rezolutie")==null) {
				tv.setRezolutie("");
			} else tv.setRezolutie(rs.getString("Rezolutie"));
			
			if (rs.getString("Panou")==null) {
				tv.setPanou("");
			} else tv.setPanou(rs.getString("Panou"));
			
			if (rs.getString("Ecran")==null) {
				tv.setEcran("");
			} else tv.setEcran(rs.getString("Ecran"));
			
			if (rs.getString("Format_ecran_Corectie_format")==null) {
				tv.setFormatEcranCorectieFormat("");
			} else tv.setFormatEcranCorectieFormat(rs.getString("Format_ecran_Corectie_format"));
			
			if (rs.getString("Mod_imagine")==null) {
				tv.setModImagine("");
			} else tv.setModImagine(rs.getString("Mod_imagine"));
			
			tv.setProcesareImagineHz(rs.getInt("Procesare_imagine_Hz"));
			tv.setLuminozitateCdM2(rs.getInt("Luminozitate_cd_m2"));
			tv.setMci(rs.getInt("MCI"));
			
			if (rs.getString("Mod_panoramic")==null) {
				tv.setModPanoramic("");
			} else tv.setModPanoramic(rs.getString("Mod_panoramic"));
			
			if (rs.getString("Mod_panoramic_pentru_PC")==null) {
				tv.setModPanoramicPentruPC("");
			} else tv.setModPanoramicPentruPC(rs.getString("Mod_panoramic_pentru_PC"));
			
			if (rs.getString("Scene_select")==null) {
				tv.setSceneSelect("");
			} else tv.setSceneSelect(rs.getString("Scene_select"));
			
			if (rs.getString("Unghi_de_vizualizare_grade")==null) {
				tv.setUnghiDeVizualizareGrade("");
			} else tv.setUnghiDeVizualizareGrade(rs.getString("Unghi_de_vizualizare_grade"));
			
			if (rs.getString("Contrast_dinamic")==null) {
				tv.setContrastDinamic("");
			} else tv.setContrastDinamic(rs.getString("Contrast_dinamic"));
			
			if (rs.getString("Motionflow")==null) {
				tv.setMotionflow("");
			} else tv.setMotionflow(rs.getString("Motionflow"));

			tv.setPerfectMotionRateHz(rs.getInt("Perfect_Motion_Rate_Hz"));
			
			if (rs.getString("Caracteristici_video")==null) {
				tv.setCaracteristiciVideo("");
			} else tv.setCaracteristiciVideo(rs.getString("Caracteristici_video"));
			
			if (rs.getString("Facilitati")==null) {
				tv.setFacilitati("");
			} else tv.setFacilitati(rs.getString("Facilitati"));
						
			if (rs.getString("Caracteristici_3D")==null) {
				tv.setCaracteristici3D("");
			} else tv.setCaracteristici3D(rs.getString("Caracteristici_3D"));
			
			if (rs.getString("Sistem_audio")==null) {
				tv.setSistemAudio("");
			} else tv.setSistemAudio(rs.getString("Sistem_audio"));
			
			if (rs.getString("Putere_de_iesire_sistem_audio_W")==null) {
				tv.setPutereDeIesireSistemAudioW("");
			} else tv.setPutereDeIesireSistemAudioW(rs.getString("Putere_de_iesire_sistem_audio_W"));
			
			if (rs.getString("Sistem_difuzoare")==null) {
				tv.setSistemDifuzoare("");
			} else tv.setSistemDifuzoare(rs.getString("Sistem_difuzoare"));
			
			if (rs.getString("Mod_sunet")==null) {
				tv.setModSunet("");
			} else tv.setModSunet(rs.getString("Mod_sunet"));
			
			if (rs.getString("Mod_surround")==null) {
				tv.setModSurround("");
			} else tv.setModSurround(rs.getString("Mod_surround"));
			
			if (rs.getString("Caracteristici_audio")==null) {
				tv.setCaracteristiciAudio("");
			} else tv.setCaracteristiciAudio(rs.getString("Caracteristici_audio"));
			
			if (rs.getString("Optimizare_sunet")==null) {
				tv.setOptimizareSunet("");
			} else tv.setOptimizareSunet(rs.getString("Optimizare_sunet"));
			
			if (rs.getString("Tip_tuner")==null) {
				tv.setTipTuner("");
			} else tv.setTipTuner(rs.getString("Tip_tuner"));
			
			if (rs.getString("Caracteristici_speciale")==null) {
				tv.setCaracteristiciSpeciale("");
			} else tv.setCaracteristiciSpeciale(rs.getString("Caracteristici_speciale"));
			
			if (rs.getString("Intrare_antena")==null) {
				tv.setIntrareAntena("");
			} else tv.setIntrareAntena(rs.getString("Intrare_antena"));
			
			if (rs.getString("Format_subtitrari")==null) {
				tv.setFormatSubtitrari("");
			} else tv.setFormatSubtitrari(rs.getString("Format_subtitrari"));
			
			if (rs.getString("Format_redare_video")==null) {
				tv.setFormatRedareVideo("");
			} else tv.setFormatRedareVideo(rs.getString("Format_redare_video"));
			
			if (rs.getString("Format_redare_audio")==null) {
				tv.setFormatRedareAudio("");
			} else tv.setFormatRedareAudio(rs.getString("Format_redare_audio"));
			
			if (rs.getString("Format_redare_imagini")==null) {
				tv.setFormatRedareImagini("");
			} else tv.setFormatRedareImagini(rs.getString("Format_redare_imagini"));
			
			if (rs.getString("Caracteristici_multimedia")==null) {
				tv.setCaracteristiciMultimedia("");
			} else tv.setCaracteristiciMultimedia(rs.getString("Caracteristici_multimedia"));
			
			if (rs.getString("Sistem_de_operare")==null) {
				tv.setSistemDeOperare("");
			} else tv.setSistemDeOperare(rs.getString("Sistem_de_operare"));
			
			if (rs.getString("Versiune_sistem_de_operare")==null) {
				tv.setVersiuneSistemDeOperare("");
			} else tv.setVersiuneSistemDeOperare(rs.getString("Versiune_sistem_de_operare"));
			
			if (rs.getString("Procesor")==null) {
				tv.setProcesor("");
			} else tv.setProcesor(rs.getString("Procesor"));
			
			if (rs.getString("Facilitati_Smart_TV")==null) {
				tv.setFacilitatiSmartTV("");
			} else tv.setFacilitatiSmartTV(rs.getString("Facilitati_Smart_TV"));
			
			if (rs.getString("Operare")==null) {
				tv.setOperare("");
			} else tv.setOperare(rs.getString("Operare"));
			
			if (rs.getString("Aplicatii")==null) {
				tv.setAplicatii("");
			} else tv.setAplicatii(rs.getString("Aplicatii"));
			
			if (rs.getString("EasyLink_HDMI_CEC")==null) {
				tv.setEasyLinkHDMICEC("");
			} else tv.setEasyLinkHDMICEC(rs.getString("EasyLink_HDMI_CEC"));
			
			if (rs.getString("MHL")==null) {
				tv.setMhl("");
			} else tv.setMhl(rs.getString("MHL"));
			
			if (rs.getString("Miracast")==null) {
				tv.setMiracast("");
			} else tv.setMiracast(rs.getString("Miracast"));
			
			if (rs.getString("Smart_Interaction_Instalare_usoara")==null) {
				tv.setSmartInteractionInstalareUsoara("");
			} else tv.setSmartInteractionInstalareUsoara(rs.getString("Smart_Interaction_Instalare_usoara"));
			
			if (rs.getString("Smart_Interaction_Upgrade_firmware")==null) {
				tv.setSmartInteractionUpgradeFirmware("");
			} else tv.setSmartInteractionUpgradeFirmware(rs.getString("Smart_Interaction_Upgrade_firmware"));
			
			if (rs.getString("Bluetooth")==null) {
				tv.setBluetooth("");
			} else tv.setBluetooth(rs.getString("Bluetooth"));
			
			if (rs.getString("Wi_Fi_Direct")==null) {
				tv.setWifiDirect("");
			} else tv.setWifiDirect(rs.getString("Wi_Fi_Direct"));
			
			if (rs.getString("WiDi")==null) {
				tv.setWidi("");
			} else tv.setWidi(rs.getString("WiDi"));
			
			if (rs.getString("DLNA")==null) {
				tv.setDlna("");
			} else tv.setDlna(rs.getString("DLNA"));
						
			if (rs.getString("Wireless_LAN")==null) {
				tv.setWirelessLAN("");
			} else tv.setWirelessLAN(rs.getString("Wireless_LAN"));
			
			if (rs.getString("Home_Network")==null) {
				tv.setHomeNetwork("");
			} else tv.setHomeNetwork(rs.getString("Home_Network"));			
			
			if (rs.getString("AllShare")==null) {
				tv.setAllShare("");
			} else tv.setAllShare(rs.getString("AllShare"));
			
			if (rs.getString("Web_Browser")==null) {
				tv.setWebBrowser("");
			} else tv.setWebBrowser(rs.getString("Web_Browser"));
			
			if (rs.getString("Skype")==null) {
				tv.setSkype("");
			} else tv.setSkype(rs.getString("Skype"));
			
			if (rs.getString("Anynet")==null) {
				tv.setAnynet("");
			} else tv.setAnynet(rs.getString("Anynet"));
			
			if (rs.getString("Timer_Sleep")==null) {
				tv.setTimerSleep("");
			} else tv.setTimerSleep(rs.getString("Timer_Sleep"));
			
			if (rs.getString("Accesorii")==null) {
				tv.setAccesorii("");
			} else tv.setAccesorii(rs.getString("Accesorii"));
			
			if (rs.getString("Conectori")==null) {
				tv.setConectori("");
			} else tv.setConectori(rs.getString("Conectori"));
					
			if (rs.getString("Standard_VESA_mm")==null) {
				tv.setStandardVESAmm("");
			} else tv.setStandardVESAmm(rs.getString("Standard_VESA_mm"));
			
			if (rs.getString("Putere_consumata_in_standby_W")==null) {
				tv.setPutereConsumataInStandbyW("");
			} else tv.setPutereConsumataInStandbyW(rs.getString("Putere_consumata_in_standby_W"));
			
			if (rs.getString("Clasa_de_eficienta_energetica")==null) {
				tv.setClasaDeEficientaEnergetica("");
			} else tv.setClasaDeEficientaEnergetica(rs.getString("Clasa_de_eficienta_energetica"));
			
			if (rs.getString("Dimensiuni_fara_stand_L_x_A_x_I_cm")==null) {
				tv.setDimensiuniFaraStandLxAxIcm("");
			} else tv.setDimensiuniFaraStandLxAxIcm(rs.getString("Dimensiuni_fara_stand_L_x_A_x_I_cm"));
			
			if (rs.getString("Dimensiuni_cu_stand_L_x_A_x_I_cm")==null) {
				tv.setDimensiuniCuStandLxAxIcm("");
			} else tv.setDimensiuniCuStandLxAxIcm(rs.getString("Dimensiuni_cu_stand_L_x_A_x_I_cm"));
			
			tv.setGreutateFaraStandKg(rs.getDouble("Greutate_fara_stand_Kg"));
			tv.setGreutateCuStandKg(rs.getDouble("Greutate_cu_stand_Kg"));
			
			if (rs.getString("Culoare")==null) {
				tv.setCuloare("");
			} else tv.setCuloare(rs.getString("Culoare"));
			
			if (rs.getString("Garantie_comerciala")==null) {
				tv.setGarantieComerciala("");
			} else tv.setGarantieComerciala(rs.getString("Garantie_comerciala"));
			
			if (rs.getString("Brand")==null) {
				tv.setBrand("");
			} else tv.setBrand(rs.getString("Brand"));
			
			tv.setPhoto(PhotoDAO.getPhotoAddressesTvs(rs.getInt("id")));
			
			tvList.add(tv);
			
		}
		
		DBHelper.closeConnection(conn);
		return tvList;

	}
}
