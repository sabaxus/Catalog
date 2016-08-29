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
<title>Edit smartphone data</title>
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
	href="<c:url value="/resources/core/css/phone.css" />" global
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
		<a href="${pageContext.request.contextPath}/smartphones/newlist.htm"><button
				type="button" class="btn btn-info btn-lg">Back to the list</button></a>
	</div>
	<br />

	<div class="title" align="center">
		<h2>Edit smartphone data</h2>
	</div>

	<form:form action="save.htm" method="post" commandName="phoneForm">

		<form:hidden path="id" />

		<div class="Tabs-content">
			<div class="Specs">

				<div class="Specs-column">
					<h3 class="Specs-title">Caracteristici generale</h3>


					<table class="Specs-table" border="1">
						<!-- <table border="0"> -->


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
						<tr class="Specs-row">
							<td class="Specs-cell">Retea 2G</td>
							<td class="Specs-cell"><form:input path="retea2G" /></td>
							<td class="Specs-cell"><form:errors path="retea2G"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Retea 3G:</td>
							<td class="Specs-cell"><form:input path="retea3G" /></td>
							<td class="Specs-cell"><form:errors path="retea3G"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Retea 4G:</td>
							<td class="Specs-cell"><form:input path="retea4G" /></td>
							<td class="Specs-cell"><form:errors path="retea4G"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Dual SIM:</td>
							<td class="Specs-cell"><form:input path="dualSim" /></td>
							<td class="Specs-cell"><form:errors path="dualSim"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">SIM:</td>
							<td class="Specs-cell"><form:input path="sim" /></td>
							<td class="Specs-cell"><form:errors path="sim"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
					<h3 class="Specs-title">Ecran</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Tip Ecran:</td>
							<td class="Specs-cell"><form:input path="tipEcran" /></td>
							<td class="Specs-cell"><form:errors path="tipEcran"
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
							<td class="Specs-cell">Multitouch:</td>
							<td class="Specs-cell"><form:input path="multitouch" /></td>
							<td class="Specs-cell"><form:errors path="multitouch"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Culori ecran:</td>
							<td class="Specs-cell"><form:input path="culoriEcran" /></td>
							<td class="Specs-cell"><form:errors path="culoriEcran"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Protectie ecran:</td>
							<td class="Specs-cell"><form:input path="protectieEcran" /></td>
							<td class="Specs-cell"><form:errors path="protectieEcran"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
					<h3 class="Specs-title">Sunete</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Sunete alerta:</td>
							<td class="Specs-cell"><form:input path="suneteAlerta" /></td>
							<td class="Specs-cell"><form:errors path="suneteAlerta"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Difuzor:</td>
							<td class="Specs-cell"><form:input path="difuzor" /></td>
							<td class="Specs-cell"><form:errors path="difuzor"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Facilitati:</td>
							<td class="Specs-cell"><form:input path="facilitatiSunet" /></td>
							<td class="Specs-cell"><form:errors path="facilitatiSunet"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
					<h3 class="Specs-title">Memorie</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Memorie interna (GB):</td>
							<td class="Specs-cell"><form:input path="memorieInternaGB" /></td>
							<td class="Specs-cell"><form:errors path="memorieInternaGB"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Memorie RAM (MB):</td>
							<td class="Specs-cell"><form:input path="memorieRAMMB" /></td>
							<td class="Specs-cell"><form:errors path="memorieRAMMB"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Slot card:</td>
							<td class="Specs-cell"><form:input path="slotCard" /></td>
							<td class="Specs-cell"><form:errors path="slotCard"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Capacitate maxima card memorie (GB):</td>
							<td class="Specs-cell"><form:input
									path="capacitateMaximaCardMemorieGB" /></td>
							<td class="Specs-cell"><form:errors
									path="capacitateMaximaCardMemorieGB" cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
					<h3 class="Specs-title">Data</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">GPRS:</td>
							<td class="Specs-cell"><form:input path="gprs" /></td>
							<td class="Specs-cell"><form:errors path="gprs"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">EDGE:</td>
							<td class="Specs-cell"><form:input path="edge" /></td>
							<td class="Specs-cell"><form:errors path="edge"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Viteza date:</td>
							<td class="Specs-cell"><form:input path="vitezaDate" /></td>
							<td class="Specs-cell"><form:errors path="vitezaDate"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">WLAN:</td>
							<td class="Specs-cell"><form:input path="wlan" /></td>
							<td class="Specs-cell"><form:errors path="wlan"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Bluetooth:</td>
							<td class="Specs-cell"><form:input path="bluetooth" /></td>
							<td class="Specs-cell"><form:errors path="bluetooth"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">USB:</td>
							<td class="Specs-cell"><form:input path="usb" /></td>
							<td class="Specs-cell"><form:errors path="usb"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">NFC:</td>
							<td class="Specs-cell"><form:input path="nfc" /></td>
							<td class="Specs-cell"><form:errors path="nfc"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Port infrared:</td>
							<td class="Specs-cell"><form:input path="portInfrared" /></td>
							<td class="Specs-cell"><form:errors path="portInfrared"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
					<h3 class="Specs-title">Foto Video</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Rezolutie foto-video (Mp):</td>
							<td class="Specs-cell"><form:input
									path="rezolutieFotoVideoMp" /></td>
							<td class="Specs-cell"><form:errors
									path="rezolutieFotoVideoMp" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Rezolutie fotografie:</td>
							<td class="Specs-cell"><form:input
									path="rezolutieFotografie" /></td>
							<td class="Specs-cell"><form:errors
									path="rezolutieFotografie" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Rezolutie video:</td>
							<td class="Specs-cell"><form:input path="rezolutieVideo" /></td>
							<td class="Specs-cell"><form:errors path="rezolutieVideo"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Senzor imagine:</td>
							<td class="Specs-cell"><form:input path="senzorImagine" /></td>
							<td class="Specs-cell"><form:errors path="senzorImagine"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Blitz:</td>
							<td class="Specs-cell"><form:input path="blitz" /></td>
							<td class="Specs-cell"><form:errors path="blitz"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Focus:</td>
							<td class="Specs-cell"><form:input path="focus" /></td>
							<td class="Specs-cell"><form:errors path="focus"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Camera secundara:</td>
							<td class="Specs-cell"><form:input path="cameraSecundara" /></td>
							<td class="Specs-cell"><form:errors path="cameraSecundara"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Facilitati foto-video:</td>
							<td class="Specs-cell"><form:input
									path="facilitatiFotoVideo" /></td>
							<td class="Specs-cell"><form:errors
									path="facilitatiFotoVideo" cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Procesor</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Tip procesor:</td>
							<td class="Specs-cell"><form:input path="tipProcesor" /></td>
							<td class="Specs-cell"><form:errors path="tipProcesor"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Model procesor</td>
							<td class="Specs-cell"><form:input path="modelProcesor" /></td>
							<td class="Specs-cell"><form:errors path="modelProcesor"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Frecventa procesor (GHz):</td>
							<td class="Specs-cell"><form:input
									path="frecventaProcesorGHz" /></td>
							<td class="Specs-cell"><form:errors
									path="frecventaProcesorGHz" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Procesor grafic:</td>
							<td class="Specs-cell"><form:input path="procesorGrafic" /></td>
							<td class="Specs-cell"><form:errors path="procesorGrafic"
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
							<td class="Specs-cell">Varianta sistem operare:</td>
							<td class="Specs-cell"><form:input
									path="variantaSistemOperare" /></td>
							<td class="Specs-cell"><form:errors
									path="variantaSistemOperare" cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Informatii suplimentare</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Senzori:</td>
							<td class="Specs-cell"><form:input path="senzori" /></td>
							<td class="Specs-cell"><form:errors path="senzori"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Mesagerie:</td>
							<td class="Specs-cell"><form:input path="mesagerie" /></td>
							<td class="Specs-cell"><form:errors path="mesagerie"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Browser:</td>
							<td class="Specs-cell"><form:input path="browser" /></td>
							<td class="Specs-cell"><form:errors path="browser"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Radio:</td>
							<td class="Specs-cell"><form:input path="radio" /></td>
							<td class="Specs-cell"><form:errors path="radio"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">GPS:</td>
							<td class="Specs-cell"><form:input path="gps" /></td>
							<td class="Specs-cell"><form:errors path="gps"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Aplicatii:</td>
							<td class="Specs-cell"><form:input path="aplicatii" /></td>
							<td class="Specs-cell"><form:errors path="aplicatii"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Alte facilitati:</td>
							<td class="Specs-cell"><form:input path="alteFacilitati" /></td>
							<td class="Specs-cell"><form:errors path="alteFacilitati"
									cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Baterie</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Tip baterie:</td>
							<td class="Specs-cell"><form:input path="tipBaterie" /></td>
							<td class="Specs-cell"><form:errors path="tipBaterie"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Autonomie convorbire:</td>
							<td class="Specs-cell"><form:input
									path="autonomieConvorbire" /></td>
							<td class="Specs-cell"><form:errors
									path="autonomieConvorbire" cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Autonomie standby:</td>
							<td class="Specs-cell"><form:input path="autonomieStandby" /></td>
							<td class="Specs-cell"><form:errors path="autonomieStandby"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Capacitate baterie (mAh):</td>
							<td class="Specs-cell"><form:input
									path="capacitateBateriemAh" /></td>
							<td class="Specs-cell"><form:errors
									path="capacitateBateriemAh" cssStyle="color: #ff0000;" /></td>
						</tr>
					</table>
				</div>
				<div class="Specs-column">
					<h3 class="Specs-title">Altele</h3>

					<table class="Specs-table" border="1">
						<tr class="Specs-row">
							<td class="Specs-cell">Culoare:</td>
							<td class="Specs-cell"><form:input path="culoare" /></td>
							<td class="Specs-cell"><form:errors path="culoare"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Dimensiuni:</td>
							<td class="Specs-cell"><form:input path="dimensiuni" /></td>
							<td class="Specs-cell"><form:errors path="dimensiuni"
									cssStyle="color: #ff0000;" /></td>
						</tr>
						<tr class="Specs-row">
							<td class="Specs-cell">Greutate (g):</td>
							<td class="Specs-cell"><form:input path="greutateg" /></td>
							<td class="Specs-cell"><form:errors path="greutateg"
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
						<tr class="Specs-row">
							<td class="Specs-cell">Garantie de conformitate:</td>
							<td class="Specs-cell"><form:input
									path="garantieDeConformitate" /></td>
							<td class="Specs-cell"><form:errors
									path="garantieDeConformitate" cssStyle="color: #ff0000;" /></td>
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