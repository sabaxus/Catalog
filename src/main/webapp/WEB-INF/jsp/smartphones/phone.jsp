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
<title>Smartphone details</title>
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
		<a href="${pageContext.request.contextPath}/smartphones/newlist.htm"><button
				type="button" class="btn btn-info btn-lg">Back to the list</button></a>
	</div>
	<br />

	<div class="ProdusPage-gallery">
		<ul id="js-trigger-product-carousel"
			class="ProdusPage-photo owl-carousel">

			<c:forEach var="p" items="${model.phone.photo}">

				<c:if test="${fn:contains(p, 't1')}">
					<li
						data-dot='<img src="${pageContext.servletContext.contextPath}<c:out value="${p}"/>" width="56"/>'>

						<c:forEach var="newp" items="${model.phone.photo}">
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
						<c:forEach var="newp" items="${model.phone.photo}">
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
						<c:forEach var="newp" items="${model.phone.photo}">
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
						<c:forEach var="newp" items="${model.phone.photo}">
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
		<h1>Smartphone details:</h1>
		<h2>
			<c:out value="${model.phone.nume}" />
		</h2>
	</div>

	<div class="Tabs-content">
		<div class="Specs">
			<div class="Specs-column">
				<h3 class="Specs-title">Caracteristici generale</h3>

				<table class="Specs-table" border="1">
					<!-- <tr class="Specs-row">
						<td class="Specs-cell">Id</td>
						<td class="Specs-cell"><c:out value="${model.phone.id}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Denumire</td>
						<td class="Specs-cell"><c:out value="${model.phone.nume}" /></td>
					</tr> -->
					<tr class="Specs-row">
						<td class="Specs-cell">Brand</td>
						<td class="Specs-cell"><c:out value="${model.phone.brand}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Specificatii</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.specificatii}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Cantitate</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.cantitate}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Pret</td>
						<td class="Specs-cell"><c:out value="${model.phone.pret}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">In stoc</td>
						<td class="Specs-cell"><c:out value="${model.phone.inStoc}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Retea 2G</td>
						<td class="Specs-cell"><c:out value="${model.phone.retea2G}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Retea 3G</td>
						<td class="Specs-cell"><c:out value="${model.phone.retea3G}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Retea 4G</td>
						<td class="Specs-cell"><c:out value="${model.phone.retea4G}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Dual SIM</td>
						<td class="Specs-cell"><c:out value="${model.phone.dualSim}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">SIM</td>
						<td class="Specs-cell"><c:out value="${model.phone.sim}" /></td>
					</tr>
				</table>
				<h3 class="Specs-title">Ecran</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Tip ecran</td>
						<td class="Specs-cell"><c:out value="${model.phone.tipEcran}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Dimensiune ecran (inch)</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.dimensiuneEcranInch}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Rezolutie ecran (pixeli)</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.rezolutieEcranPixeli}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Multitouch</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.multitouch}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Culori</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.culoriEcran}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Protectie ecran</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.protectieEcran}" /></td>
					</tr>
				</table>
				<h3 class="Specs-title">Sunete</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Tip alerta</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.suneteAlerta}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Difuzor</td>
						<td class="Specs-cell"><c:out value="${model.phone.difuzor}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Facilitati</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.facilitatiSunet}" /></td>
					</tr>
				</table>
				<h3 class="Specs-title">Memorie</h3>

				<table class="Specs-table" border="1">

					<tr class="Specs-row">
						<td class="Specs-cell">Nmemorie interna (GB)</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.memorieInternaGB}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Memorie RAM (MB)</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.memorieRAMMB}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Slot card</td>
						<td class="Specs-cell"><c:out value="${model.phone.slotCard}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Capacitate maxima card memorie (GB)</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.capacitateMaximaCardMemorieGB}" /></td>
					</tr>
				</table>
				<h3 class="Specs-title">Data</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">GPRS</td>
						<td class="Specs-cell"><c:out value="${model.phone.gprs}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">EDGE</td>
						<td class="Specs-cell"><c:out value="${model.phone.edge}" /></td>
					</tr>

					<tr class="Specs-row">
						<td class="Specs-cell">Viteza date</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.vitezaDate}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">WLAN</td>
						<td class="Specs-cell"><c:out value="${model.phone.wlan}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Bluetooth</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.bluetooth}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">USB</td>
						<td class="Specs-cell"><c:out value="${model.phone.usb}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">NFC</td>
						<td class="Specs-cell"><c:out value="${model.phone.nfc}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Port infrared</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.portInfrared}" /></td>
					</tr>
				</table>
				<h3 class="Specs-title">Foto Video</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Rezolutie (Mp)</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.rezolutieFotoVideoMp}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Rezolutie fotografie</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.rezolutieFotografie}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Rezolutie video</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.rezolutieVideo}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Senzor imagine</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.senzorImagine}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Blitz</td>
						<td class="Specs-cell"><c:out value="${model.phone.blitz}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Focus</td>
						<td class="Specs-cell">2<c:out value="${model.phone.focus}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Camera secundara</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.cameraSecundara}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Facilitati</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.facilitatiFotoVideo}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Procesor</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Tip procesor</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.tipProcesor}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Model procesor</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.modelProcesor}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Frecventa (GHz)</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.frecventaProcesorGHz}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Procesor grafic</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.procesorGrafic}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Software</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Sistem de operare</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.sistemDeOperare}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Varianta</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.variantaSistemOperare}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Informatii suplimentare</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Senzori</td>
						<td class="Specs-cell"><c:out value="${model.phone.senzori}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Mesagerie</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.mesagerie}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Browser</td>
						<td class="Specs-cell"><c:out value="${model.phone.browser}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Radio</td>
						<td class="Specs-cell"><c:out value="${model.phone.radio}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">GPS</td>
						<td class="Specs-cell"><c:out value="${model.phone.gps}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Aplicatii</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.aplicatii}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Facilitati</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.alteFacilitati}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Baterie</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Tip</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.tipBaterie}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Autonomie convorbire</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.autonomieConvorbire}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Autonomie standby</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.autonomieStandby}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Capacitate baterie (mAh)</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.capacitateBateriemAh}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Altele</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Culoare</td>
						<td class="Specs-cell"><c:out value="${model.phone.culoare}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Dimensiuni</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.dimensiuni}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Greutate (g)</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.greutateg}" /></td>
					</tr>
				</table>
			</div>
			<div class="Specs-column">
				<h3 class="Specs-title">Garantie</h3>

				<table class="Specs-table" border="1">
					<tr class="Specs-row">
						<td class="Specs-cell">Garantie comerciala</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.garantieComerciala}" /></td>
					</tr>
					<tr class="Specs-row">
						<td class="Specs-cell">Garantie de conformitate</td>
						<td class="Specs-cell"><c:out
								value="${model.phone.garantieDeConformitate}" /></td>
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