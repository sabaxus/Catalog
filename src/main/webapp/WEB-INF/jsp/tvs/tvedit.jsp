age language="java" contentType="text/html; charset=ISO-8859-1"
pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<!DOCTYPE html>
<html lang="en">
<head>
<!-- <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> -->
<title>Edit tv data</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!--<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">-->
<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
	integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7"
	crossorigin="anonymous">
<!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">-->
<link href="http://fonts.googleapis.com/css?family=Lato"
	rel="stylesheet" type="text/css">
<link href="http://fonts.googleapis.com/css?family=Montserrat"
	rel="stylesheet" type="text/css">
<link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">
<script
	src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<!--<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>-->
<script
	src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"
	integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS"
	crossorigin="anonymous"></script>
<link rel="stylesheet" type="text/css"
	href="<c:url value="/resources/core/css/laptop.css" />" global
	media="all" />
<style>
.Tabs-content {
	padding: 80px 120px;
}

h1 {
	text-align: center;
	font-size: 35px;
	/*color: #777;*/
}

h2 {
	text-align: center;
	font-size: 30px;
	color: red;
}

.link {
	color: #f1f1f1;
	text-align: center;
	font-size: 25px;
	padding: 100px;
}
/* Add a dark background color with a little bit see-through */
.navbar {
	font-family: Montserrat, sans-serif;
	margin-bottom: 0;
	background-color: #2d2d30;
	border: 0;
	font-size: 15px !important;
	letter-spacing: 4px;
	opacity: 0.9;
}
/* Add a gray color to all navbar links */
.navbar li a, .navbar .navbar-brand {
	color: #d5d5d5 !important;
}
/* On hover, the links will turn white */
.navbar-nav li a:hover {
	color: #fff !important;
}

.navbar-nav li {
	color: #fff;
	text-align: center;
}
/* The active link */
.navbar-nav li.active a {
	color: #fff !important;
	background-color: #29292c !important;
}
/* Remove border color from the collapsible button */
.navbar-default .navbar-toggle {
	border-color: transparent;
}
/* Dropdown */
.open .dropdown-toggle {
	color: #fff;
	background-color: #555 !important;
}
/* Dropdown links */
.dropdown-menu li a {
	color: #000 !important;
}
/* On hover, the dropdown links will turn red */
.dropdown-menu li a:hover {
	background-color: black !important;
}

.modal-header, h4, .close {
	background-color: #5cb85c;
	color: white !important;
	text-align: center;
	font-size: 30px;
}

.modal-footer {
	background-color: #f9f9f9;
}
.dropdown-submenu {
	position: relative;
}

.dropdown-submenu .dropdown-menu {
	top: 0;
	left: 100%;
	margin-top: -1px;
}
</style>
</head>
<body id="myPage" data-spy="scroll" data-target=".navbar"
	data-offset="50">

	<jsp:include page="/WEB-INF/fragments/header.jsp" />

	Dear
	<strong><c:out value="${model.userName}" /></strong>. Welcome to this
	ADMIN restricted page!
	<br />
	<br />

	<div class="link">
		<a href="${pageContext.request.contextPath}/tvs/newlist.htm"><button
				type="button" class="btn btn-info btn-lg">Back to the list</button></a>
	</div>
	<br />

	<div class="title" align="center">
		<h2>Edit tv data</h2>
	</div>

	<form:form action="save.htm" method="post" commandName="tvForm">

		<form:hidden path="id" />

		<div class="Tabs-content">
			<div class="Specs">

				<div class="Specs-column">
					<h3 class="Specs-title">Caracteristici generale</h3>

					<table class="Specs-table" border="1">

						<tr class="Specs-row">
							<td class="Specs-cell">Nume:</td>
							<td class="Specs-cell"><form:input path="nume" /></td>
							<td class="Specs-cell"><form:errors path="nume"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Brand:</td>
							<td class="Specs-cell"><form:input path="brand" /></td>
							<td class="Specs-cell"><form:errors path="brand"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Specificatii:</td>
							<td class="Specs-cell"><form:input path="specificatii" /></td>
							<td class="Specs-cell"><form:errors path="specificatii"
									cssStyle="color: #ff0000;" /></td>
						</tr>

						<tr class="Specs-row">
							<td class="Specs-cell">Cantitate:</td>
							<td class="Specs-cell"><form:input path="cantitate" /></td>
							<td class="Specs-cell"><form:errors path="cantitate"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Pret:</td>
							<td class="Specs-cell"><form:input path="pret" /></td>
							<td class="Specs-cell"><form:errors path="pret"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">In stoc:</td>
							<td class="Specs-cell"><form:input path="inStoc" /></td>
							<td class="Specs-cell"><form:errors path="inStoc"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
					<h3 class="Specs-title">Video</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Tip ecran:</td>
							<td class="Specs-cell"><form:input path="tipEcran" /></td>
							<td class="Specs-cell"><form:errors path="tipEcran"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Tip:</td>
							<td class="Specs-cell"><form:input path="tip" /></td>
							<td class="Specs-cell"><form:errors path="tip"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Tehnologie:</td>
							<td class="Specs-cell"><form:input path="tehnologie" /></td>
							<td class="Specs-cell"><form:errors path="tehnologie"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Diagonala (cm):</td>
							<td class="Specs-cell"><form:input path="diagonalacm" /></td>
							<td class="Specs-cell"><form:errors path="diagonalacm"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Dimensiune ecran (inch):</td>
							<td class="Specs-cell"><form:input
									path="dimensiuneEcranInch" /></td>
							<td class="Specs-cell"><form:errors
									path="dimensiuneEcranInch" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Rezolutie ecran (pixeli):</td>
							<td class="Specs-cell"><form:input
									path="rezolutieEcranPixeli" /></td>
							<td class="Specs-cell"><form:errors
									path="rezolutieEcranPixeli" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Rezolutie:</td>
							<td class="Specs-cell"><form:input path="rezolutie" /></td>
							<td class="Specs-cell"><form:errors path="rezolutie"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Panou:</td>
							<td class="Specs-cell"><form:input path="panou" /></td>
							<td class="Specs-cell"><form:errors path="panou"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Ecran:</td>
							<td class="Specs-cell"><form:input path="ecran" /></td>
							<td class="Specs-cell"><form:errors path="ecran"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Format corectie:</td>
							<td class="Specs-cell"><form:input
									path="formatEcranCorectieFormat" /></td>
							<td class="Specs-cell"><form:errors
									path="formatEcranCorectieFormat" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Mod imagine:</td>
							<td class="Specs-cell"><form:input path="modImagine" /></td>
							<td class="Specs-cell"><form:errors path="modImagine"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Procesare imagine (Hz):</td>
							<td class="Specs-cell"><form:input path="procesareImagineHz" /></td>
							<td class="Specs-cell"><form:errors
									path="procesareImagineHz" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Luminozitate (Cd/m2):</td>
							<td class="Specs-cell"><form:input path="luminozitateCdM2" /></td>
							<td class="Specs-cell"><form:errors path="luminozitateCdM2"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">MCI:</td>
							<td class="Specs-cell"><form:input path="mci" /></td>
							<td class="Specs-cell"><form:errors path="mci"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Mod panoramic:</td>
							<td class="Specs-cell"><form:input path="modPanoramic" /></td>
							<td class="Specs-cell"><form:errors path="modPanoramic"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Mod panoramic pentru PC:</td>
							<td class="Specs-cell"><form:input
									path="modPanoramicPentruPC" /></td>
							<td class="Specs-cell"><form:errors
									path="modPanoramicPentruPC" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Scene select:</td>
							<td class="Specs-cell"><form:input path="sceneSelect" /></td>
							<td class="Specs-cell"><form:errors path="sceneSelect"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Unghi de vizualizare (grade):</td>
							<td class="Specs-cell"><form:input
									path="unghiDeVizualizareGrade" /></td>
							<td class="Specs-cell"><form:errors
									path="unghiDeVizualizareGrade" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Contrast dinamic:</td>
							<td class="Specs-cell"><form:input path="contrastDinamic" /></td>
							<td class="Specs-cell"><form:errors path="contrastDinamic"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Motionflow:</td>
							<td class="Specs-cell"><form:input path="motionflow" /></td>
							<td class="Specs-cell"><form:errors path="motionflow"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Perfect motion rate (Hz):</td>
							<td class="Specs-cell"><form:input
									path="perfectMotionRateHz" /></td>
							<td class="Specs-cell"><form:errors
									path="perfectMotionRateHz" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Caracteristici video:</td>
							<td class="Specs-cell"><form:input
									path="caracteristiciVideo" /></td>
							<td class="Specs-cell"><form:errors
									path="caracteristiciVideo" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Facilitati:</td>
							<td class="Specs-cell"><form:input path="facilitati" /></td>
							<td class="Specs-cell"><form:errors path="facilitati"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Caracteristici 3D:</td>
							<td class="Specs-cell"><form:input path="caracteristici3D" /></td>
							<td class="Specs-cell"><form:errors path="caracteristici3D"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
					<h3 class="Specs-title">Audio</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Sistem audio:</td>
							<td class="Specs-cell"><form:input path="sistemAudio" /></td>
							<td class="Specs-cell"><form:errors path="sistemAudio"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Putere de iesire sistem audio (W):</td>
							<td class="Specs-cell"><form:input
									path="putereDeIesireSistemAudioW" /></td>
							<td class="Specs-cell"><form:errors
									path="putereDeIesireSistemAudioW" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Sistem difuzoare:</td>
							<td class="Specs-cell"><form:input path="sistemDifuzoare" /></td>
							<td class="Specs-cell"><form:errors path="sistemDifuzoare"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Mod sunet:</td>
							<td class="Specs-cell"><form:input path="modSunet" /></td>
							<td class="Specs-cell"><form:errors path="modSunet"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Mod surround:</td>
							<td class="Specs-cell"><form:input path="modSurround" /></td>
							<td class="Specs-cell"><form:errors path="modSurround"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Caracteristici audio:</td>
							<td class="Specs-cell"><form:input
									path="caracteristiciAudio" /></td>
							<td class="Specs-cell"><form:errors
									path="caracteristiciAudio" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Optimizare sunet:</td>
							<td class="Specs-cell"><form:input path="optimizareSunet" /></td>
							<td class="Specs-cell"><form:errors path="optimizareSunet"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
					<h3 class="Specs-title">Tuner</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Tip tuner:</td>
							<td class="Specs-cell"><form:input path="tipTuner" /></td>
							<td class="Specs-cell"><form:errors path="tipTuner"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Caracteristici speciale:</td>
							<td class="Specs-cell"><form:input
									path="caracteristiciSpeciale" /></td>
							<td class="Specs-cell"><form:errors
									path="caracteristiciSpeciale" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Intrare antena:</td>
							<td class="Specs-cell"><form:input path="intrareAntena" /></td>
							<td class="Specs-cell"><form:errors path="intrareAntena"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
					<h3 class="Specs-title">Multimedia</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Format subtitrari:</td>
							<td class="Specs-cell"><form:input path="formatSubtitrari" /></td>
							<td class="Specs-cell"><form:errors path="formatSubtitrari"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Format redare video:</td>
							<td class="Specs-cell"><form:input path="formatRedareVideo" /></td>
							<td class="Specs-cell"><form:errors path="formatRedareVideo"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Format redare audio:</td>
							<td class="Specs-cell"><form:input path="formatRedareAudio" /></td>
							<td class="Specs-cell"><form:errors path="formatRedareAudio"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Format redare imagini:</td>
							<td class="Specs-cell"><form:input
									path="formatRedareImagini" /></td>
							<td class="Specs-cell"><form:errors
									path="formatRedareImagini" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Caracteristici multimedia:</td>
							<td class="Specs-cell"><form:input
									path="caracteristiciMultimedia" /></td>
							<td class="Specs-cell"><form:errors
									path="caracteristiciMultimedia" cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Smart TV</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Sistem de operare:</td>
							<td class="Specs-cell"><form:input path="sistemDeOperare" /></td>
							<td class="Specs-cell"><form:errors path="sistemDeOperare"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Versiune sistem de operare:</td>
							<td class="Specs-cell"><form:input
									path="versiuneSistemDeOperare" /></td>
							<td class="Specs-cell"><form:errors
									path="versiuneSistemDeOperare" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Procesor:</td>
							<td class="Specs-cell"><form:input path="procesor" /></td>
							<td class="Specs-cell"><form:errors path="procesor"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Facilitati Smart TV:</td>
							<td class="Specs-cell"><form:input path="facilitatiSmartTV" /></td>
							<td class="Specs-cell"><form:errors path="facilitatiSmartTV"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Operare:</td>
							<td class="Specs-cell"><form:input path="operare" /></td>
							<td class="Specs-cell"><form:errors path="operare"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Aplicatii:</td>
							<td class="Specs-cell"><form:input path="aplicatii" /></td>
							<td class="Specs-cell"><form:errors path="aplicatii"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Easy Link HDMI CEC:</td>
							<td class="Specs-cell"><form:input path="easyLinkHDMICEC" /></td>
							<td class="Specs-cell"><form:errors path="easyLinkHDMICEC"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">MHL:</td>
							<td class="Specs-cell"><form:input path="mhl" /></td>
							<td class="Specs-cell"><form:errors path="mhl"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Miracast:</td>
							<td class="Specs-cell"><form:input path="miracast" /></td>
							<td class="Specs-cell"><form:errors path="miracast"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Smart interaction-instalare usoara:</td>
							<td class="Specs-cell"><form:input
									path="smartInteractionInstalareUsoara" /></td>
							<td class="Specs-cell"><form:errors
									path="smartInteractionInstalareUsoara"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Smart interaction-upgrade firmware:</td>
							<td class="Specs-cell"><form:input
									path="smartInteractionUpgradeFirmware" /></td>
							<td class="Specs-cell"><form:errors
									path="smartInteractionUpgradeFirmware"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Bluetooth:</td>
							<td class="Specs-cell"><form:input path="bluetooth" /></td>
							<td class="Specs-cell"><form:errors path="bluetooth"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Internet</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Wi-fi:</td>
							<td class="Specs-cell"><form:input path="wifiDirect" /></td>
							<td class="Specs-cell"><form:errors path="wifiDirect"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">WIDI:</td>
							<td class="Specs-cell"><form:input path="widi" /></td>
							<td class="Specs-cell"><form:errors path="widi"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">DLNA:</td>
							<td class="Specs-cell"><form:input path="dlna" /></td>
							<td class="Specs-cell"><form:errors path="dlna"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Wireless LAN:</td>
							<td class="Specs-cell"><form:input path="wirelessLAN" /></td>
							<td class="Specs-cell"><form:errors path="wirelessLAN"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Home network:</td>
							<td class="Specs-cell"><form:input path="homeNetwork" /></td>
							<td class="Specs-cell"><form:errors path="homeNetwork"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">All share:</td>
							<td class="Specs-cell"><form:input path="allShare" /></td>
							<td class="Specs-cell"><form:errors path="allShare"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Web browser:</td>
							<td class="Specs-cell"><form:input path="webBrowser" /></td>
							<td class="Specs-cell"><form:errors path="webBrowser"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Skype:</td>
							<td class="Specs-cell"><form:input path="skype" /></td>
							<td class="Specs-cell"><form:errors path="skype"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Anynet:</td>
							<td class="Specs-cell"><form:input path="anynet" /></td>
							<td class="Specs-cell"><form:errors path="anynet"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Caracteristici tehnice</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Timer sleep:</td>
							<td class="Specs-cell"><form:input path="timerSleep" /></td>
							<td class="Specs-cell"><form:errors path="timerSleep"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Accesorii:</td>
							<td class="Specs-cell"><form:input path="accesorii" /></td>
							<td class="Specs-cell"><form:errors path="accesorii"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Conectori:</td>
							<td class="Specs-cell"><form:input path="conectori" /></td>
							<td class="Specs-cell"><form:errors path="conectori"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Standard VESA (mm):</td>
							<td class="Specs-cell"><form:input path="standardVESAmm" /></td>
							<td class="Specs-cell"><form:errors path="standardVESAmm"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Putere consumata in standby (W):</td>
							<td class="Specs-cell"><form:input
									path="putereConsumataInStandbyW" /></td>
							<td class="Specs-cell"><form:errors
									path="putereConsumataInStandbyW" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Clasa de eficienta energetica:</td>
							<td class="Specs-cell"><form:input
									path="clasaDeEficientaEnergetica" /></td>
							<td class="Specs-cell"><form:errors
									path="clasaDeEficientaEnergetica" cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Altele</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Dimensiuni fara stand LxAxI (cm):</td>
							<td class="Specs-cell"><form:input
									path="dimensiuniFaraStandLxAxIcm" /></td>
							<td class="Specs-cell"><form:errors
									path="dimensiuniFaraStandLxAxIcm" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Dimensiuni cu stand LxAxI (cm):</td>
							<td class="Specs-cell"><form:input
									path="dimensiuniCuStandLxAxIcm" /></td>
							<td class="Specs-cell"><form:errors
									path="dimensiuniCuStandLxAxIcm" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Greutate fara stand (Kg):</td>
							<td class="Specs-cell"><form:input
									path="greutateFaraStandKg" /></td>
							<td class="Specs-cell"><form:errors
									path="greutateFaraStandKg" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Greutate cu stand (Kg):</td>
							<td class="Specs-cell"><form:input path="greutateCuStandKg" /></td>
							<td class="Specs-cell"><form:errors path="greutateCuStandKg"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Culoare:</td>
							<td class="Specs-cell"><form:input path="culoare" /></td>
							<td class="Specs-cell"><form:errors path="culoare"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Garantie</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Garantie comerciala:</td>
							<td class="Specs-cell"><form:input path="garantieComerciala" /></td>
							<td class="Specs-cell"><form:errors
									path="garantieComerciala" cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
			</div>
			<div class="u-marginBottom--10"></div>
		</div>

		<br />
		<br />

		<div class="container" align="center">
			<input type="submit" class="btn btn-info btn-lg" value="Save">
		</div>

	</form:form>



</body>
</html>