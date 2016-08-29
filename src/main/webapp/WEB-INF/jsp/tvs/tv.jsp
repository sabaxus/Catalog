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
<title>Tv details</title>
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
		<a href="${pageContext.request.contextPath}/tvs/newlist.htm"><button
				type="button" class="btn btn-info btn-lg">Back to the list</button></a>
	</div>
	<br />

	<div class="ProdusPage-gallery">
		<ul id="js-trigger-product-carousel"
			class="ProdusPage-photo owl-carousel">

			<c:forEach var="p" items="${model.tv.photo}">

				<c:if test="${fn:contains(p, 't1')}">
					<li
						data-dot='<img src="${pageContext.servletContext.contextPath}<c:out value="${p}"/>" width="56"/>'>

						<c:forEach var="newp" items="${model.tv.photo}">
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
						<c:forEach var="newp" items="${model.tv.photo}">
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
						<c:forEach var="newp" items="${model.tv.photo}">
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
						<c:forEach var="newp" items="${model.tv.photo}">
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
		<h1>Tv details:</h1>
		<br />
		<h2>
			<c:out value="${model.tv.nume}" />
		</h2>
	</div>

	<div class="Tabs-content">
		<div class="Specs">
			<div class="Specs-column">
				<h3 class="Specs-title">Caracteristici generale</h3>

				<table class="Specs-table" border="1">

					<!-- <tr class="Specs-row">
						<td class="Specs-cell">Id</td>
						<td class="Specs-cell"><c:out value="${model.tv.id}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Nume</td>
						<td class="Specs-cell"><c:out value="${model.tv.nume}" /></td>
					</tr> -->
					<tr class="Specs-row">
						<td class="Specs-cell">Brand</td>
						<td class="Specs-cell"><c:out value="${model.tv.brand}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Specificatii</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.specificatii}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Cantitate</td>
						<td class="Specs-cell"><c:out value="${model.tv.cantitate}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Pret</td>
						<td class="Specs-cell"><c:out value="${model.tv.pret}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">In stoc</td>
						<td class="Specs-cell"><c:out value="${model.tv.inStoc}" /></td>
					</tr>
				</table>
				<h3 class="Specs-title">Video</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Tip ecran</td>
						<td class="Specs-cell"><c:out value="${model.tv.tipEcran}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Tip</td>
						<td class="Specs-cell"><c:out value="${model.tv.tip}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Tehnologie</td>
						<td class="Specs-cell"><c:out value="${model.tv.tehnologie}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Diagonala (cm)</td>
						<td class="Specs-cell"><c:out value="${model.tv.diagonalacm}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Dimensiune ecran (inch)</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.dimensiuneEcranInch}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Rezolutie ecran (pixeli)</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.rezolutieEcranPixeli}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Rezolutie</td>
						<td class="Specs-cell"><c:out value="${model.tv.rezolutie}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Panou</td>
						<td class="Specs-cell"><c:out value="${model.tv.panou}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Ecran</td>
						<td class="Specs-cell"><c:out value="${model.tv.ecran}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Corectie format</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.formatEcranCorectieFormat}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Mod imagine</td>
						<td class="Specs-cell"><c:out value="${model.tv.modImagine}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Procesare imagine (Hz)</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.procesareImagineHz}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Luminozitate (cd/m2)</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.luminozitateCdM2}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">MCI</td>
						<td class="Specs-cell"><c:out value="${model.tv.mci}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Mod panoramic</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.modPanoramic}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Mod panoramic pentru PC</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.modPanoramicPentruPC}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Scene select</td>
						<td class="Specs-cell"><c:out value="${model.tv.sceneSelect}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Unghi de vizualizare</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.unghiDeVizualizareGrade}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Contrast dinamic</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.contrastDinamic}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Motionflow</td>
						<td class="Specs-cell"><c:out value="${model.tv.motionflow}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Perfect motion rate (Hz)</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.perfectMotionRateHz}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Caracteristici video</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.caracteristiciVideo}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Facilitati</td>
						<td class="Specs-cell"><c:out value="${model.tv.facilitati}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Caracteristici 3D</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.caracteristici3D}" /></td>
					</tr>
				</table>
				<h3 class="Specs-title">Audio</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Sistem audio</td>
						<td class="Specs-cell">2<c:out
								value="${model.tv.sistemAudio}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Putere de iesire sistem audio (W)</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.putereDeIesireSistemAudioW}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Sistem difuzoare</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.sistemDifuzoare}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Mod sunet</td>
						<td class="Specs-cell"><c:out value="${model.tv.modSunet}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Mod surround</td>
						<td class="Specs-cell"><c:out value="${model.tv.modSurround}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Caracteristici audio</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.caracteristiciAudio}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Optimizare sunet</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.optimizareSunet}" /></td>
					</tr>
				</table>
				<h3 class="Specs-title">Tuner</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Tip tuner</td>
						<td class="Specs-cell"><c:out value="${model.tv.tipTuner}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Caracteristici speciale</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.caracteristiciSpeciale}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Intrare antena</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.intrareAntena}" /></td>
					</tr>
				</table>
				<h3 class="Specs-title">Multimedia</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Format subtitrari</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.formatSubtitrari}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Format redare video</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.formatRedareVideo}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Format redare audio</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.formatRedareAudio}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Format redare imagini</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.formatRedareImagini}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Caracteristici multimedia</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.caracteristiciMultimedia}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Smart TV</h3>

				<table class="Specs-table" border="1">

					<tr class="Specs-row">
						<td class="Specs-cell">Sistem de operare</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.sistemDeOperare}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Versiune sistem de operare</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.versiuneSistemDeOperare}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Procesor</td>
						<td class="Specs-cell"><c:out value="${model.tv.procesor}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Facilitati SmartTV</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.facilitatiSmartTV}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Operare</td>
						<td class="Specs-cell"><c:out value="${model.tv.operare}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Aplicatii</td>
						<td class="Specs-cell"><c:out value="${model.tv.aplicatii}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Easy Link HDMI CEC</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.easyLinkHDMICEC}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">MHL</td>
						<td class="Specs-cell"><c:out value="${model.tv.mhl}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Miracast</td>
						<td class="Specs-cell"><c:out value="${model.tv.miracast}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Smart interaction-instalare usoara</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.smartInteractionInstalareUsoara}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Smart interaction-upgrade firmware</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.smartInteractionUpgradeFirmware}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Bluetooth</td>
						<td class="Specs-cell"><c:out value="${model.tv.bluetooth}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Internet</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Wifi direct</td>
						<td class="Specs-cell"><c:out value="${model.tv.wifiDirect}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">WIDI</td>
						<td class="Specs-cell"><c:out value="${model.tv.widi}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">DLNA</td>
						<td class="Specs-cell"><c:out value="${model.tv.dlna}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Wireless LAN</td>
						<td class="Specs-cell"><c:out value="${model.tv.wirelessLAN}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Home network</td>
						<td class="Specs-cell"><c:out value="${model.tv.homeNetwork}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">All share</td>
						<td class="Specs-cell"><c:out value="${model.tv.allShare}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Web browser</td>
						<td class="Specs-cell"><c:out value="${model.tv.webBrowser}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Skype</td>
						<td class="Specs-cell"><c:out value="${model.tv.skype}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Anynet</td>
						<td class="Specs-cell"><c:out value="${model.tv.anynet}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Caracteristici tehnice</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Timer sleep</td>
						<td class="Specs-cell"><c:out value="${model.tv.timerSleep}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Accesorii</td>
						<td class="Specs-cell"><c:out value="${model.tv.accesorii}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Conectori</td>
						<td class="Specs-cell"><c:out value="${model.tv.conectori}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Standard VESA (mm)</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.standardVESAmm}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Putere consumata in standby (W)</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.putereConsumataInStandbyW}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Clasa de eficienta energetica</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.clasaDeEficientaEnergetica}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Altele</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Dimensiuni fara stand L x A x I (cm)</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.dimensiuniFaraStandLxAxIcm}" /></td>
					</tr>

					<tr class="Specs-row">
						<td class="Specs-cell">Dimensiuni cu stand L x A x I (cm)</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.dimensiuniCuStandLxAxIcm}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Greutate fara stand (Kg)</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.greutateFaraStandKg}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Greutate cu stand (Kg)</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.greutateCuStandKg}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Culoare</td>
						<td class="Specs-cell"><c:out value="${model.tv.culoare}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Garantie</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Garantie comerciala</td>
						<td class="Specs-cell"><c:out
								value="${model.tv.garantieComerciala}" /></td>
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