<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
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
<title>Edit laptop data</title>
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
		<a href="${pageContext.request.contextPath}/laptops/newlist.htm"><button
				type="button" class="btn btn-info btn-lg">Back to the list</button></a>
	</div>
	<br />

	<div class="title" align="center">
		<h2>Edit laptop data</h2>
	</div>


	<form:form action="save.htm" method="post" commandName="laptopForm">

		<form:hidden path="id" />

		<div class="Tabs-content">
			<div class="Specs">

				<div class="Specs-column">
					<h3 class="Specs-title">Caracteristici generale</h3>

					<table class="Specs-table" border="1">
						<!-- <table border="0"> -->


						<tr class="Specs-row">
							<td class="Specs-cell">Denumire:</td>
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
					<h3 class="Specs-title">Ecran</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Tip ecran:</td>
							<td class="Specs-cell"><form:input path="tipEcran" /></td>
							<td class="Specs-cell"><form:errors path="tipEcran"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Rezolutie:</td>
							<td class="Specs-cell"><form:input path="rezolutieEcran" /></td>
							<td class="Specs-cell"><form:errors path="rezolutieEcran"
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
							<td class="Specs-cell">Format:</td>
							<td class="Specs-cell"><form:input path="formatImagine" /></td>
							<td class="Specs-cell"><form:errors path="formatImagine"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Alte caracteristici display:</td>
							<td class="Specs-cell"><form:input
									path="alteCaracteristiciDisplay" /></td>
							<td class="Specs-cell"><form:errors
									path="alteCaracteristiciDisplay" cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
					<h3 class="Specs-title">Procesor</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Tip procesor:</td>
							<td class="Specs-cell"><form:input path="tipProcesor" /></td>
							<td class="Specs-cell"><form:errors path="tipProcesor"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Producator procesor:</td>
							<td class="Specs-cell"><form:input path="producatorProcesor" /></td>
							<td class="Specs-cell"><form:errors
									path="producatorProcesor" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Model procesor:</td>
							<td class="Specs-cell"><form:input path="modelProcesor" /></td>
							<td class="Specs-cell"><form:errors path="modelProcesor"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Numar nuclee:</td>
							<td class="Specs-cell"><form:input
									path="numarNucleeProcesor" /></td>
							<td class="Specs-cell"><form:errors
									path="numarNucleeProcesor" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Frecventa procesor (GHz):</td>
							<td class="Specs-cell"><form:input
									path="frecventaProcesorGHz" /></td>
							<td class="Specs-cell"><form:errors
									path="frecventaProcesorGHz" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Frecventa maxima (GHz):</td>
							<td class="Specs-cell"><form:input
									path="frecventaMaximaProcesorGHz" /></td>
							<td class="Specs-cell"><form:errors
									path="frecventaMaximaProcesorGHz" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Cache (MB):</td>
							<td class="Specs-cell"><form:input path="cacheProcesorMB" /></td>
							<td class="Specs-cell"><form:errors path="cacheProcesorMB"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Tehnologie:</td>
							<td class="Specs-cell"><form:input path="tehnologieProcesor" /></td>
							<td class="Specs-cell"><form:errors
									path="tehnologieProcesor" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Procesor grafic integrat:</td>
							<td class="Specs-cell"><form:input
									path="procesorGraficIntegrat" /></td>
							<td class="Specs-cell"><form:errors
									path="procesorGraficIntegrat" cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
					<h3 class="Specs-title">Memorie RAM</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Capacitate RAM (GB):</td>
							<td class="Specs-cell"><form:input path="capacitateRAM" /></td>
							<td class="Specs-cell"><form:errors path="capacitateRAM"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Tip memorie:</td>
							<td class="Specs-cell"><form:input path="tipMemorieRAM" /></td>
							<td class="Specs-cell"><form:errors path="tipMemorieRAM"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Frecventa (MHz):</td>
							<td class="Specs-cell"><form:input path="frecventaRAMMHz" /></td>
							<td class="Specs-cell"><form:errors path="frecventaRAMMHz"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Memorie maxima (GB):</td>
							<td class="Specs-cell"><form:input path="memorieMaximaRAM" /></td>
							<td class="Specs-cell"><form:errors path="memorieMaximaRAM"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Sloturi de memorie:</td>
							<td class="Specs-cell"><form:input path="sloturiDeMemorie" /></td>
							<td class="Specs-cell"><form:errors path="sloturiDeMemorie"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Slot 1:</td>
							<td class="Specs-cell"><form:input path="slotMemorie1" /></td>
							<td class="Specs-cell"><form:errors path="slotMemorie1"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Slot 2:</td>
							<td class="Specs-cell"><form:input path="slotMemorie2" /></td>
							<td class="Specs-cell"><form:errors path="slotMemorie2"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Slot 3:</td>
							<td class="Specs-cell"><form:input path="slotMemorie3" /></td>
							<td class="Specs-cell"><form:errors path="slotMemorie3"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Slot 4:</td>
							<td class="Specs-cell"><form:input path="slotMemorie4" /></td>
							<td class="Specs-cell"><form:errors path="slotMemorie4"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
					<h3 class="Specs-title">Unitate stocare</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Tip unitate stocare:</td>
							<td class="Specs-cell"><form:input path="tipUnitateStocare" /></td>
							<td class="Specs-cell"><form:errors path="tipUnitateStocare"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Capacitate stocare (GB):</td>
							<td class="Specs-cell"><form:input path="capacitateStocare" /></td>
							<td class="Specs-cell"><form:errors path="capacitateStocare"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Interfata:</td>
							<td class="Specs-cell"><form:input
									path="interfataUnitateStocare" /></td>
							<td class="Specs-cell"><form:errors
									path="interfataUnitateStocare" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Viteza de rotatie (RPM):</td>
							<td class="Specs-cell"><form:input
									path="vitezaDeRotatieUnitateStocareRPM" /></td>
							<td class="Specs-cell"><form:errors
									path="vitezaDeRotatieUnitateStocareRPM"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
					<h3 class="Specs-title">Placa video</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Procesor placa video:</td>
							<td class="Specs-cell"><form:input path="procesorPlacaVideo" /></td>
							<td class="Specs-cell"><form:errors
									path="procesorPlacaVideo" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Tip placa video:</td>
							<td class="Specs-cell"><form:input path="tipPlacaVideo" /></td>
							<td class="Specs-cell"><form:errors path="tipPlacaVideo"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Capacitate memorie (MB):</td>
							<td class="Specs-cell"><form:input
									path="capacitateMemoriePlacaVideoMB" /></td>
							<td class="Specs-cell"><form:errors
									path="capacitateMemoriePlacaVideoMB" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Tip memorie:</td>
							<td class="Specs-cell"><form:input
									path="tipMemoriePlacaVideo" /></td>
							<td class="Specs-cell"><form:errors
									path="tipMemoriePlacaVideo" cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
					<h3 class="Specs-title">Multimedia</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Difuzoare:</td>
							<td class="Specs-cell"><form:input path="difuzoare" /></td>
							<td class="Specs-cell"><form:errors path="difuzoare"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Tehnologie audio:</td>
							<td class="Specs-cell"><form:input path="tehnologieAudio" /></td>
							<td class="Specs-cell"><form:errors path="tehnologieAudio"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Subwoofer:</td>
							<td class="Specs-cell"><form:input path="subwoofer" /></td>
							<td class="Specs-cell"><form:errors path="subwoofer"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Microfon:</td>
							<td class="Specs-cell"><form:input path="microfon" /></td>
							<td class="Specs-cell"><form:errors path="microfon"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Tip unitate optica:</td>
							<td class="Specs-cell"><form:input path="tipUnitateOptica" /></td>
							<td class="Specs-cell"><form:errors path="tipUnitateOptica"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Webcam:</td>
							<td class="Specs-cell"><form:input path="webcam" /></td>
							<td class="Specs-cell"><form:errors path="webcam"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Comunicatii</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Ethernet:</td>
							<td class="Specs-cell"><form:input path="ethernet" /></td>
							<td class="Specs-cell"><form:errors path="ethernet"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Wi-Fi:</td>
							<td class="Specs-cell"><form:input path="wiFi" /></td>
							<td class="Specs-cell"><form:errors path="wiFi"
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
					<h3 class="Specs-title">Porturi</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">USB 3.1:</td>
							<td class="Specs-cell"><form:input path="usb31" /></td>
							<td class="Specs-cell"><form:errors path="usb31"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">USB 3.0:</td>
							<td class="Specs-cell"><form:input path="usb30" /></td>
							<td class="Specs-cell"><form:errors path="usb30"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">USB 2.0:</td>
							<td class="Specs-cell"><form:input path="usb20" /></td>
							<td class="Specs-cell"><form:errors path="usb20"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Thunderbolt:</td>
							<td class="Specs-cell"><form:input path="thunderbolt" /></td>
							<td class="Specs-cell"><form:errors path="thunderbolt"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">RJ-45:</td>
							<td class="Specs-cell"><form:input path="rj45" /></td>
							<td class="Specs-cell"><form:errors path="rj45"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">HDMI:</td>
							<td class="Specs-cell"><form:input path="hdmi" /></td>
							<td class="Specs-cell"><form:errors path="hdmi"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">DisplayPort:</td>
							<td class="Specs-cell"><form:input path="displayPort" /></td>
							<td class="Specs-cell"><form:errors path="displayPort"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">mini DisplayPort:</td>
							<td class="Specs-cell"><form:input path="miniDisplayPort" /></td>
							<td class="Specs-cell"><form:errors path="miniDisplayPort"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Iesire audio:</td>
							<td class="Specs-cell"><form:input path="iesireAudio" /></td>
							<td class="Specs-cell"><form:errors path="iesireAudio"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Intrare microfon:</td>
							<td class="Specs-cell"><form:input path="intrareMicrofon" /></td>
							<td class="Specs-cell"><form:errors path="intrareMicrofon"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Cititor de carduri:</td>
							<td class="Specs-cell"><form:input path="cititorDeCarduri" /></td>
							<td class="Specs-cell"><form:errors path="cititorDeCarduri"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Altele:</td>
							<td class="Specs-cell"><form:input path="altele" /></td>
							<td class="Specs-cell"><form:errors path="altele"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">MagSafe 2:</td>
							<td class="Specs-cell"><form:input path="magSafe2" /></td>
							<td class="Specs-cell"><form:errors path="magSafe2"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Alimentare</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Baterie:</td>
							<td class="Specs-cell"><form:input path="baterie" /></td>
							<td class="Specs-cell"><form:errors path="baterie"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Capacitate (mAh):</td>
							<td class="Specs-cell"><form:input
									path="capacitateBateriemAh" /></td>
							<td class="Specs-cell"><form:errors
									path="capacitateBateriemAh" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Numar celule:</td>
							<td class="Specs-cell"><form:input path="numarCeluleBaterie" /></td>
							<td class="Specs-cell"><form:errors
									path="numarCeluleBaterie" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Autonomie (ore):</td>
							<td class="Specs-cell"><form:input path="autonomieBaterie" /></td>
							<td class="Specs-cell"><form:errors path="autonomieBaterie"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Software</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Sistem de operare:</td>
							<td class="Specs-cell"><form:input path="sistemDeOperare" /></td>
							<td class="Specs-cell"><form:errors path="sistemDeOperare"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Biti:</td>
							<td class="Specs-cell"><form:input path="bitiSistemOperare" /></td>
							<td class="Specs-cell"><form:errors path="bitiSistemOperare"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Altele:</td>
							<td class="Specs-cell"><form:input path="alteSoftware" /></td>
							<td class="Specs-cell"><form:errors path="alteSoftware"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Informatii suplimentare</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Tastatura iluminata:</td>
							<td class="Specs-cell"><form:input path="tastaturaIluminata" /></td>
							<td class="Specs-cell"><form:errors
									path="tastaturaIluminata" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Tastatura numerica:</td>
							<td class="Specs-cell"><form:input path="tastaturaNumerica" /></td>
							<td class="Specs-cell"><form:errors path="tastaturaNumerica"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Layout tastatura:</td>
							<td class="Specs-cell"><form:input path="layoutTastatura" /></td>
							<td class="Specs-cell"><form:errors path="layoutTastatura"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Facilitati:</td>
							<td class="Specs-cell"><form:input path="facilitati" /></td>
							<td class="Specs-cell"><form:errors path="facilitati"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Securitate:</td>
							<td class="Specs-cell"><form:input path="securitate" /></td>
							<td class="Specs-cell"><form:errors path="securitate"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Accesorii incluse:</td>
							<td class="Specs-cell"><form:input path="accesoriiIncluse" /></td>
							<td class="Specs-cell"><form:errors path="accesoriiIncluse"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Carcasa:</td>
							<td class="Specs-cell"><form:input path="carcasa" /></td>
							<td class="Specs-cell"><form:errors path="carcasa"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Garantie</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Garantie de conformitate:</td>
							<td class="Specs-cell"><form:input
									path="garantieDeConformitate" /></td>
							<td class="Specs-cell"><form:errors
									path="garantieDeConformitate" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Garantie comerciala:</td>
							<td class="Specs-cell"><form:input path="garantieComerciala" /></td>
							<td class="Specs-cell"><form:errors
									path="garantieComerciala" cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Altele</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Dimensiuni (L x A x I cm):</td>
							<td class="Specs-cell"><form:input path="dimensiuniLxAxIcm" /></td>
							<td class="Specs-cell"><form:errors path="dimensiuniLxAxIcm"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Culoare:</td>
							<td class="Specs-cell"><form:input path="culoare" /></td>
							<td class="Specs-cell"><form:errors path="culoare"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Greutate (kg):</td>
							<td class="Specs-cell"><form:input path="greutateKg" /></td>
							<td class="Specs-cell"><form:errors path="greutateKg"
									cssStyle="color: #ff0000;" /></td>
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