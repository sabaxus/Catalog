<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<!DOCTYPE html>
<html lang="en">
<head>
<!-- <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> -->
<title>Laptop details</title>
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
<link rel="stylesheet" type="text/css"
	href="<c:url value="/resources/core/css/produs.css" />" global
	media="all" />
<style>
.Tabs-content {
	padding: 120px 120px;
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

	<div class="link">
		<a href="${pageContext.request.contextPath}/laptops/newlist.htm"><button
				type="button" class="btn btn-info btn-lg">Back to the list</button></a>
	</div>
	<br />

	<div class="ProdusPage-gallery">
		<ul id="js-trigger-product-carousel"
			class="ProdusPage-photo owl-carousel">

			<c:forEach var="p" items="${model.laptop.photo}">

				<c:if test="${fn:contains(p, 't1')}">
					<li
						data-dot='<img src="${pageContext.servletContext.contextPath}<c:out value="${p}"/>" width="56"/>'>

						<c:forEach var="newp" items="${model.laptop.photo}">
							<c:if test="${fn:contains(newp, 'mare1')}">
								<a
									href="${pageContext.servletContext.contextPath}<c:out value="${newp}"/>">
									<img
									src="${pageContext.servletContext.contextPath}<c:out value="${newp}"/>"
									width="400" max-height="400" />
								</a>
							</c:if>
						</c:forEach>
					</li>
				</c:if>

				<c:if test="${fn:contains(p, 't2')}">
					<li
						data-dot='<img src="${pageContext.servletContext.contextPath}<c:out value="${p}"/>" width="56"/>'>
						<c:forEach var="newp" items="${model.laptop.photo}">
							<c:if test="${fn:contains(newp, 'mare2')}">
								<a
									href="${pageContext.servletContext.contextPath}<c:out value="${newp}"/>"
									class="owl-lazy-parent"> <img
									data-src="${pageContext.servletContext.contextPath}<c:out value="${newp}"/>"
									class="owl-lazy" width="400" max-height="400" />
								</a>
							</c:if>
						</c:forEach>
					</li>
				</c:if>

				<c:if test="${fn:contains(p, 't3')}">
					<li
						data-dot='<img src="${pageContext.servletContext.contextPath}<c:out value="${p}"/>" width="56"/>'>
						<c:forEach var="newp" items="${model.laptop.photo}">
							<c:if test="${fn:contains(newp, 'mare3')}">
								<a
									href="${pageContext.servletContext.contextPath}<c:out value="${newp}"/>"
									class="owl-lazy-parent"> <img
									data-src="${pageContext.servletContext.contextPath}<c:out value="${newp}"/>"
									class="owl-lazy" width="400" max-height="400" />
								</a>
							</c:if>
						</c:forEach>
					</li>
				</c:if>

				<c:if test="${fn:contains(p, 't4')}">
					<li
						data-dot='<img src="${pageContext.servletContext.contextPath}<c:out value="${p}"/>" width="56"/>'>
						<c:forEach var="newp" items="${model.laptop.photo}">
							<c:if test="${fn:contains(newp, 'mare4')}">
								<a
									href="${pageContext.servletContext.contextPath}<c:out value="${newp}"/>"
									class="owl-lazy-parent"> <img
									data-src="${pageContext.servletContext.contextPath}<c:out value="${newp}"/>"
									class="owl-lazy" width="400" max-height="400" />
								</a>
							</c:if>
						</c:forEach>
					</li>
				</c:if>


			</c:forEach>
		</ul>
	</div>
	<br />

	<div>
		<h1>Laptop details:</h1>
		<br />
		<h2>
			<c:out value="${model.laptop.nume}" />
		</h2>
	</div>

	<div class="Tabs-content">
		<div class="Specs">
			<div class="Specs-column">
				<h3 class="Specs-title">Caracteristici generale</h3>

				<table class="Specs-table" border="1">
					<!-- 
					<tr class="Specs-row">
						<td class="Specs-cell">Id</td>
						<td class="Specs-cell"><c:out value="${model.laptop.id}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Denumire</td>
						<td class="Specs-cell"><c:out value="${model.laptop.nume}" /></td>
					</tr>
					-->
					<tr class="Specs-row">
						<td class="Specs-cell">Brand</td>
						<td class="Specs-cell"><c:out value="${model.laptop.brand}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Specificatii</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.specificatii}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Cantitate</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.cantitate}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Pret</td>
						<td class="Specs-cell"><c:out value="${model.laptop.pret}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">In stoc</td>
						<td class="Specs-cell"><c:out value="${model.laptop.inStoc}" /></td>
					</tr>
				</table>
				<h3 class="Specs-title">Ecran</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Tip ecran</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.tipEcran}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Rezolutie</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.rezolutieEcran}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Dimensiune ecran (inch)</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.dimensiuneEcranInch}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Format</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.formatImagine}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Alte caracteristici display</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.alteCaracteristiciDisplay}" /></td>
					</tr>
				</table>
				<h3 class="Specs-title">Procesor</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Tip procesor</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.tipProcesor}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Producator procesor</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.producatorProcesor}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Model procesor</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.modelProcesor}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Numar nuclee</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.numarNucleeProcesor}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Frecventa procesor (GHz)</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.frecventaProcesorGHz}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Frecventa maxima (GHz)</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.frecventaMaximaProcesorGHz}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Cache (MB)</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.cacheProcesorMB}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Tehnologie</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.tehnologieProcesor}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Procesor grafic integrat</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.procesorGraficIntegrat}" /></td>
					</tr>
				</table>
				<h3 class="Specs-title">Memorie RAM</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Capacitate RAM (GB)</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.capacitateRAM}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Tip memorie</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.tipMemorieRAM}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Frecventa (MHz)</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.frecventaRAMMHz}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Memorie maxima (GB)</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.memorieMaximaRAM}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Sloturi de memorie</td>
						<td class="Specs-cell"><c:if
								test="${model.laptop.sloturiDeMemorie!=0}">
								<c:out value="${model.laptop.sloturiDeMemorie}" />
							</c:if></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Slot 1</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.slotMemorie1}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Slot 2</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.slotMemorie2}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Slot 3</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.slotMemorie3}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Slot 4</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.slotMemorie4}" /></td>
					</tr>
				</table>
				<h3 class="Specs-title">Unitate stocare</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Tip unitate stocare</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.tipUnitateStocare}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Capacitate stocare (GB)</td>
						<td class="Specs-cell">2<c:out
								value="${model.laptop.capacitateStocare}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Interfata</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.interfataUnitateStocare}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Viteza de rotatie (RPM)</td>
						<td class="Specs-cell"><c:if
								test="${model.laptop.vitezaDeRotatieUnitateStocareRPM!=0}">
								<c:out value="${model.laptop.vitezaDeRotatieUnitateStocareRPM}" />
							</c:if></td>
					</tr>
				</table>
				<h3 class="Specs-title">Placa video</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Procesor placa video</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.procesorPlacaVideo}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Tip placa video</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.tipPlacaVideo}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Capacitate memorie (MB)</td>
						<td class="Specs-cell"><c:if
								test="${model.laptop.capacitateMemoriePlacaVideoMB!=0}">
								<c:out value="${model.laptop.capacitateMemoriePlacaVideoMB}" />
							</c:if></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Tip memorie</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.tipMemoriePlacaVideo}" /></td>
					</tr>
				</table>
				<h3 class="Specs-title">Multimedia</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Difuzoare</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.difuzoare}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Tehnologie audio</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.tehnologieAudio}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Subwoofer</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.subwoofer}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Microfon</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.microfon}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Tip unitate optica</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.tipUnitateOptica}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Webcam</td>
						<td class="Specs-cell"><c:out value="${model.laptop.webcam}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Comunicatii</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Ethernet</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.ethernet}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Wi-Fi</td>
						<td class="Specs-cell"><c:out value="${model.laptop.wiFi}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Bluetooth</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.bluetooth}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Porturi</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">USB 3.1</td>
						<td class="Specs-cell"><c:if test="${model.laptop.usb31!=0}">
								<c:out value="${model.laptop.usb31}" />
							</c:if></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">USB 3.0</td>
						<td class="Specs-cell"><c:if test="${model.laptop.usb30!=0}">
								<c:out value="${model.laptop.usb30}" />
							</c:if></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">USB 2.0</td>
						<td class="Specs-cell"><c:if test="${model.laptop.usb20!=0}">
								<c:out value="${model.laptop.usb20}" />
							</c:if></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Thunderbolt</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.thunderbolt}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">RJ-45</td>
						<td class="Specs-cell"><c:if test="${model.laptop.rj45!=0}">
								<c:out value="${model.laptop.rj45}" />
							</c:if></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">HDMI</td>
						<td class="Specs-cell"><c:if test="${model.laptop.hdmi!=0}">
								<c:out value="${model.laptop.hdmi}" />
							</c:if></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">DisplayPort</td>
						<td class="Specs-cell"><c:if
								test="${model.laptop.displayPort!=0}">
								<c:out value="${model.laptop.displayPort}" />
							</c:if></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">mini DisplayPort</td>
						<td class="Specs-cell"><c:if
								test="${model.laptop.miniDisplayPort!=0}">
								<c:out value="${model.laptop.miniDisplayPort}" />
							</c:if></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Iesire audio</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.iesireAudio}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Intrare microfon</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.intrareMicrofon}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Cititor de carduri</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.cititorDeCarduri}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">MagSafe 2</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.magSafe2}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Altele</td>
						<td class="Specs-cell"><c:out value="${model.laptop.altele}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Alimentare</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Baterie</td>
						<td class="Specs-cell"><c:out value="${model.laptop.baterie}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Capacitate (mAh)</td>
						<td class="Specs-cell"><c:if
								test="${model.laptop.capacitateBateriemAh!=0}">
								<c:out value="${model.laptop.capacitateBateriemAh}" />
							</c:if></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Numar celule</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.numarCeluleBaterie}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Autonomie (ore)</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.autonomieBaterie}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Software</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Sistem de operare</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.sistemDeOperare}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Biti</td>
						<td class="Specs-cell"><c:if
								test="${model.laptop.bitiSistemOperare!=0}">
								<c:out value="${model.laptop.bitiSistemOperare}" />
							</c:if></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Altele</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.alteSoftware}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Informatii suplimentare</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Tastatura iluminata</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.tastaturaIluminata}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Tastatura numerica</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.tastaturaNumerica}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Layout tastatura</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.layoutTastatura}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Facilitati</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.facilitati}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Securitate</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.securitate}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Accesorii incluse</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.accesoriiIncluse}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Carcasa</td>
						<td class="Specs-cell"><c:out value="${model.laptop.carcasa}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Garantie</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Garantie de conformitate</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.garantieDeConformitate}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Garantie comerciala</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.garantieComerciala}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Altele</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Dimensiuni (L x A x I cm)</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.dimensiuniLxAxIcm}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Culoare</td>
						<td class="Specs-cell"><c:out value="${model.laptop.culoare}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Greutate (kg)</td>
						<td class="Specs-cell"><c:out
								value="${model.laptop.greutateKg}" /></td>
					</tr>
				</table>
			</div>
		</div>
		<div class="u-marginBottom--10"></div>
	</div>

	<br />

	<script type="text/javascript">
		var loadModules = {
			"carousel" : {
				"multiple" : "true",
				"items" : "picture",
				"picture" : {
					"_placeholder" : "#js-trigger-product-carousel",
					"autoplay" : "false",
					"dots" : "true",
					"dotsData" : "true",
					"dotData" : "true",
					"loop" : "true",
					"lazyLoad" : "true"
				},
				"thumbnail" : {
					"_placeholder" : "#js-trigger-product-thumbnail",
					"items" : "6",
					"singleItem" : "false",
					"autoPlay" : "false",
					"navigation" : "false",
					"itemsCustom" : " [[0, 4], [600, 5], [700, 6]] ",
					"afterInit" : " GLOBAL.dispatch('EVENT_PRODUS_THUMBS_AFTER_INIT'); "
				},
				"accesorii" : {
					"_placeholder" : "#js-viewGrid-target",
					"items" : "5",
					"singleItem" : "false",
					"autoPlay" : "false",
					"paginationSpeed" : "200"
				}
			}
		};
	</script>
	<script type="text/javascript"
		src="<c:url value="/resources/core/js/product.js" />"></script>

</body>
</html>