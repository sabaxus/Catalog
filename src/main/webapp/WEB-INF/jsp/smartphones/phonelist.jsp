<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<!-- <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> -->
<!DOCTYPE html>
<html lang="en">
<head>
<!-- <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> -->
<title>Smartphones list</title>
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
<style>
ul.pagination {
	display: inline-block;
	padding: 0;
	margin: 0;
}

ul.pagination li {
	display: inline;
}

ul.pagination li a {
	color: black;
	float: left;
	padding: 8px 16px;
	text-decoration: none;
	transition: background-color .3s;
	border: 1px solid #ddd;
}

ul.pagination li a.active {
	background-color: #4CAF50;
	color: white;
	border: 1px solid #4CAF50;
}

ul.pagination li a:hover:not (.active ) {
	background-color: #ddd;
}

div.centeredPagination {
	text-align: center;
}
/*
  body {
	font-size: 25px;
	text-align: center;
	font-family: "prime"
  }

  div.container {
	width: 100%;
	border: 1px solid gray;
  }

  div.filter {
	float: left;
	max-width: 160px;
	margin: 0;
	padding: 1em;
  }

  div.filter ul a {
	text-decoration: none;
  }
  */
div.price {
	font-size: 25px;
	padding: 0px 25px;
}

div.Status-stoc {
	font-size: 20px;
	padding: 2px 25px;
}

div.main {
	overflow: hidden;
	padding: 80px 40px;
}

div.main ul {
	list-style-type: none;
	text-align: center;
	padding: 0;
}
/*  
  div.main li {
	padding: 2px;
	border: 1px solid gray;
  }
*/
div.newPhone {
	font-size: 20px;
	padding: 0px 160px;
	color: #000;
}

.button.btn-success {
	font-size: 25px;
}

.container {
	padding: 80px 40px;
}

.container2 {
	padding: 80px 40px;
}

.filter {
	padding: 80px 80px;
	border: 1px solid gray;
}

.nav-tabs li a {
	text-align: center;
	color: #777;
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

.form-control {
	border-radius: 0;
}

textarea {
	resize: none;
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

	<div class="container2">
		<div class="row-fluid">

			<div class="col-sm-3">
				<div class="filter">

					<form:form action="filteredlist.htm" method="post"
						commandName="lists">

						<!-- <ul class="Filtre">
					<li class="Filtru">
						<h3 class="Filtru-heading">Pret</h3>

						<div class="Filtru-range" id="js-trigger-slider"></div>
						<div class="Filtru-range-values">
							<span class="Filtru-range-value-min" id="price-range-from">0</span>
							<span class="Filtru-range-value-max" id="price-range-to">18000</span>
							<span class="u-hide" id="price-min-from">0</span> <span
								class="u-hide" id="price-max-to">18000</span>
						</div>
					</li> -->

						<div class="col-sm-12">
							<label class="control-label">Brand</label>
							<div>
								<form:checkboxes path="brandList" items="${brandList}"
									element="label class='checkbox'" />
								<br /> <br />
								<form:errors path="brandList" class="control-label" />
							</div>
						</div>

						<div class="col-sm-12">
							<label class="control-label">Dimensiune ecran (inch)</label>
							<div>
								<form:checkboxes path="dimensiuneEcranInchList"
									items="${dimensiuneEcranInchList}"
									element="label class='checkbox'" />
								<br /> <br />
								<form:errors path="dimensiuneEcranInchList"
									class="control-label" />
							</div>
						</div>

						<div class="col-sm-12">
							<label class="control-label">Rezolutie ecran (pixeli)</label>
							<div>
								<form:checkboxes path="rezolutieEcranPixeliList"
									items="${rezolutieEcranPixeliList}"
									element="label class='checkbox'" />
								<br /> <br />
								<form:errors path="rezolutieEcranPixeliList"
									class="control-label" />
							</div>
						</div>

						<div class="col-sm-12">
							<label class="control-label">Memorie interna (GB)</label>
							<div>
								<form:checkboxes path="memorieInternaGBList"
									items="${memorieInternaGBList}"
									element="label class='checkbox'" />
								<br /> <br />
								<form:errors path="memorieInternaGBList" class="control-label" />
							</div>
						</div>

						<div class="col-sm-12">
							<label class="control-label">Memorie RAM (MB)</label>
							<div>
								<form:checkboxes path="memorieRAMMBList"
									items="${memorieRAMMBList}" element="label class='checkbox'" />
								<br /> <br />
								<form:errors path="memorieRAMMBList" class="control-label" />
							</div>
						</div>

						<div class="col-sm-12">
							<label class="control-label">Tip procesor</label>
							<div>
								<form:checkboxes path="tipProcesorList"
									items="${tipProcesorList}" element="label class='checkbox'" />
								<br /> <br />
								<form:errors path="tipProcesorList" class="control-label" />
							</div>
						</div>

						<div class="col-sm-12">
							<label class="control-label">Culoare</label>
							<div>
								<form:checkboxes path="culoareList" items="${culoareList}"
									element="label class='checkbox'" />
								<br /> <br />
								<form:errors path="culoareList" class="control-label" />
							</div>
						</div>

						<div>
							<button type="submit" class="btn-sm btn-primary"
								value="Admit form">Admit form</button>
						</div>

					</form:form>

				</div>
			</div>
			<div class="col-sm-9">
				<div class="row">
					<div class="main">
						<c:set var="count" value="0" scope="page" />
						<c:forEach var="phone" items="${model.phoneList}"
							varStatus="theCount">

							<div class="col-sm-3">

								<c:forEach var="p" items="${phone.photo}">
									<c:if test="${fn:contains(p, 'fata')}">
										<img class="Produs-photo"
											src="${pageContext.servletContext.contextPath}<c:out value="${p}"/>"
											width="150" height="150" />
									</c:if>
								</c:forEach>

								<div class="price">
									Pret:<span class="Price-int"><c:out
											value="${phone.pret}" /></span> <span class="Price-currency">lei</span>
								</div>


								<div class="Status">
									<div class="Status-stoc">
										In stoc:
										<c:out value="${phone.inStoc}" />
									</div>
								</div>
							</div>
							<div class="col-sm-9">


								<div class="Produs-listCenterColumn">
									<h3 class="Produs-nameHeading">
										<strong><c:out value="${phone.specificatii}" /></strong>
									</h3>
									<div class="Produs-noRating"></div>
									<dl class="Produs-specifications">
										<p>
											Tip procesor:
											<c:out value="${phone.tipProcesor}" />
											<br /> Model procesor:
											<c:out value="${phone.modelProcesor}" />
											<br /> Frecventa procesor (GHz):
											<c:out value="${phone.frecventaProcesorGHz}" />
											<br /> Tip ecran:
											<c:out value="${phone.tipEcran}" />
											<br /> Diagonala ecran (inch):
											<c:out value="${phone.dimensiuneEcranInch}" />
											<br /> Rezolutie ecran (pixeli):
											<c:out value="${phone.rezolutieEcranPixeli}" />
											<br /> Memorie interna (GB):
											<c:out value="${phone.memorieInternaGB}" />
											<br /> Memorie RAM (MB):
											<c:out value="${phone.memorieRAMMB}" />
											<br /> Capacitate maxima card memorie (GB):
											<c:out value="${phone.capacitateMaximaCardMemorieGB}" />
											<br /> Procesor grafic:
											<c:out value="${phone.procesorGrafic}" />
											<br /> Sistem de operare:
											<c:out value="${phone.sistemDeOperare}" />
											<br />
										</p>
									</dl>

									<sec:authorize access="isAnonymous()">

										<button type="button" class="btn btn-info"
											id="myBtn${theCount.count}">Details</button>
										<br />
										<br />
									</sec:authorize>

									<!-- Modal -->
									<div class="modal fade" id="myModal${theCount.count}" role="dialog">
										<div class="modal-dialog">

											<!-- Modal content-->
											<div class="modal-content">
												<div class="modal-header" style="padding: 35px 50px;">
													<button type="button" class="close" data-dismiss="modal">&times;</button>
													<h4>
														<span class="glyphicon glyphicon-lock"></span> Login
													</h4>
												</div>
												<div class="modal-body" style="padding: 40px 50px;">

													<c:url value="/login" var="loginProcessingUrl" />
													<form action="${loginProcessingUrl}" method="post">
														<fieldset>
															<legend>Please Login</legend>
															<!-- use param.error assuming FormLoginConfigurer#failureUrl contains the query parameter error -->
															<c:if test="${param.error != null}">
																<div>
																	Failed to login.
																	<c:if test="${SPRING_SECURITY_LAST_EXCEPTION != null}">
                  													Reason: <c:out
																			value="${SPRING_SECURITY_LAST_EXCEPTION.message}" />
																	</c:if>
																</div>
															</c:if>
															<!-- the configured LogoutConfigurer#logoutSuccessUrl is /login?logout and contains the query param logout -->
															<c:if test="${param.logout != null}">
																<div>You have been logged out.</div>
															</c:if>
															<p>
																<label for="username">Username</label> <input
																	type="text" id="username" name="username" />
															</p>
															<p>
																<label for="password">Password</label> <input
																	type="password" id="password" name="password" />
															</p>
															<!-- if using RememberMeConfigurer make sure remember-me matches RememberMeConfigurer#rememberMeParameter -->
															<p>
																<label for="remember-me">Remember Me?</label> <input
																	type="checkbox" id="remember-me" name="remember-me" />
															</p>
															<input type="hidden" name="${_csrf.parameterName}"
																value="${_csrf.token}" />
															<div>
																<button type="submit" class="btn">Log in</button>
															</div>
														</fieldset>
													</form>

												</div>
												<div class="modal-footer">
													<button type="submit"
														class="btn btn-danger btn-default pull-left"
														data-dismiss="modal">
														<span class="glyphicon glyphicon-remove"></span> Cancel
													</button>
													<p>
														Not a member? <a href="#">Sign Up</a>
													</p>
													<p>
														Forgot <a href="#">Password?</a>
													</p>
												</div>
											</div>

										</div>
									</div>
									
									<script>
										$(document).ready(function() {
											$("#myBtn${theCount.count}").click(function() {
												$("#myModal${theCount.count}").modal();
											});
										});
									</script>

									<sec:authorize access="hasRole('USER')">
										<a
											href='${pageContext.request.contextPath}/smartphones/phone.htm?phoneId=<c:out value="${phone.id}"/>'>
											<button type="button" class="btn btn-info">Details</button>
										</a>
										<br />
										<br />
									</sec:authorize>
									<sec:authorize access="hasRole('ADMIN')">
										<a
											href='${pageContext.request.contextPath}/smartphones/edit.htm?phoneId=<c:out value="${phone.id}"/>'>
											<button type="button" class="btn btn-warning">Edit</button>
										</a>
									</sec:authorize>
									<br /> <br />
									<sec:authorize access="hasRole('ADMIN')">
										<a
											href='${pageContext.request.contextPath}/smartphones/sterge/<c:out value="${phone.id}"/>'>
											<button type="button" class="btn btn-danger">Delete</button>
										</a>
									</sec:authorize>
								</div>
								<br /> <br />
							</div>
							<c:set var="count" value="${count + 1}" scope="page" />

						</c:forEach>

					</div>
				</div>

				<sec:authorize access="hasRole('ADMIN')">
					<div class="newPhone">
						<a href='${pageContext.request.contextPath}/smartphones/new.htm'><button
								type="button" class="btn-success">Add new smartphone</button></a>
					</div>
				</sec:authorize>
				<br />
				<br />

			</div>
		</div>

	</div>
	

	


</body>
</html>