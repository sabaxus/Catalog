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
<title>List of laptops</title>
<!-- <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> -->
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
div.newlaptop {
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
/* On hover, the dropdown links will turn black */
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

	<nav class="navbar navbar-default navbar-fixed-top">
		<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse"
					data-target="#myNavbar">
					<span class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
				</button>
				<a class="navbar-brand">Catalogue</a>
			</div>
			<div class="collapse navbar-collapse" id="myNavbar">
				<ul class="nav navbar-nav">
					<li><a href="${pageContext.request.contextPath}">Home</a></li>
					<li class="dropdown"><a class="dropdown-toggle"
						data-toggle="dropdown" href="#">Products <span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li class="dropdown-submenu"><a class="test" tabindex="-1"
								href="#">Laptops<span class="caret"></span></a>
								<ul class="dropdown-menu">
									<li><a tabindex="-1"
										href="${pageContext.request.contextPath}/laptops/newlist.htm">Laptops
											list</a></li>
									<li><a tabindex="-1"
										href="${pageContext.request.contextPath}/laptops/charts.htm">Laptops
											charts</a></li>
								</ul>
							<li class="dropdown-submenu"><a class="test" tabindex="-1"
								href="#">Smartphones<span class="caret"></span></a>
								<ul class="dropdown-menu">
									<li><a tabindex="-1"
										href="${pageContext.request.contextPath}/smartphones/newlist.htm">Smartphones
											list</a></li>
									<li><a tabindex="-1"
										href="${pageContext.request.contextPath}/smartphones/charts.htm">Smartphones
											charts</a></li>
								</ul>
							<li class="dropdown-submenu"><a class="test" tabindex="-1"
								href="#">Tvs<span class="caret"></span></a>
								<ul class="dropdown-menu">
									<li><a tabindex="-1"
										href="${pageContext.request.contextPath}/tvs/newlist.htm">Tvs
											list</a></li>
									<li><a tabindex="-1"
										href="${pageContext.request.contextPath}/tvs/charts.htm">Tvs
											charts</a></li>
								</ul>
						</ul></li>
					<li><a href="${pageContext.request.contextPath}#contact">Contact</a></li>
				</ul>
				<ul class="nav navbar-nav navbar-right">
					<sec:authorize access="isAnonymous()">
						<li><a href="${pageContext.request.contextPath}/newuser.htm"><span
								class="glyphicon glyphicon-user"></span> Sign Up</a></li>
						<!-- <li><a href="${pageContext.request.contextPath}/login" id="myBtn"><span
								class="glyphicon glyphicon-log-in"></span> Login</a></li> -->
						<li><span class="glyphicon glyphicon-log-in"><button
									type="button" class="btn btn-default btn-lg" id="myBtn">Login</button></span></li>
					</sec:authorize>
					<sec:authorize access="isAuthenticated()">
						<li><c:out value="${userName}" /></li>
						<!-- <li><div class="user" style="{color: #ff0000;}"><c:out value="${userName}"/></div></li> -->
						<li><a href="<c:url value="/logout"/>"><span
								class="glyphicon glyphicon-user"></span> Logout</a></li>
						<li><a href="<c:url value="/updateuser.htm"/>"><span
								class="glyphicon glyphicon-log-in"></span> Update your profile</a></li>
					</sec:authorize>
					<li><a href="#"><span class="glyphicon glyphicon-search"></span></a></li>
				</ul>
			</div>
		</div>


	</nav>
	<!-- Modal -->
	<div class="modal fade" id="myModal" role="dialog">
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
								<label for="username">Username</label> <input type="text"
									id="username" name="username" />
							</p>
							<p>
								<label for="password">Password</label> <input type="password"
									id="password" name="password" />
							</p>
							<!-- if using RememberMeConfigurer make sure remember-me matches RememberMeConfigurer#rememberMeParameter -->
							<!-- <p>
								<label for="remember-me">Remember Me?</label> <input
									type="checkbox" id="remember-me" name="remember-me" />
							</p> -->
							<input type="hidden" name="${_csrf.parameterName}"
								value="${_csrf.token}" />
							<div>
								<button type="submit" class="btn">Log in</button>
							</div>
						</fieldset>
					</form>

				</div>
				<div class="modal-footer">
					<button type="submit" class="btn btn-danger btn-default pull-left"
						data-dismiss="modal">
						<span class="glyphicon glyphicon-remove"></span> Cancel
					</button>
					<!-- <p>
						Not a member? <a href="#">Sign Up</a>
					</p>
					<p>
						Forgot <a href="#">Password?</a>
					</p> -->
				</div>
			</div>

		</div>
	</div>
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
								<br /> <br />${contorBrand}
								<form:errors path="brandList" class="control-label" />
							</div>
						</div>

						<div class="col-sm-12">
							<label class="control-label">Rezolutie ecran</label>
							<div>
								<form:checkboxes path="rezolutieEcranList"
									items="${rezolutieEcranList}" element="label class='checkbox'" />
								<br /> <br />
								<form:errors path="rezolutieEcranList" class="control-label" />
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
							<label class="control-label">Tip procesor</label>
							<div>
								<form:checkboxes path="tipProcesorList"
									items="${tipProcesorList}" element="label class='checkbox'" />
								<br /> <br />
								<form:errors path="tipProcesorList" class="control-label" />
							</div>
						</div>

						<div class="col-sm-12">
							<label class="control-label">Frecventa procesor (GHz)</label>
							<div>
								<form:checkboxes path="frecventaProcesorGHzList"
									items="${frecventaProcesorGHzList}"
									element="label class='checkbox'" />
								<br /> <br />
								<form:errors path="frecventaProcesorGHzList"
									class="control-label" />
							</div>
						</div>

						<div class="col-sm-12">
							<label class="control-label">Memorie (RAM)</label>
							<div>
								<form:checkboxes path="capacitateRAMList"
									items="${capacitateRAMList}" element="label class='checkbox'" />
								<br /> <br />
								<form:errors path="capacitateRAMList" class="control-label" />
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

						<c:forEach var="l" items="${model.laptopList}" varStatus="theCount">

							<div class="col-sm-3">

								<c:forEach var="p" items="${l.photo}">
									<c:if test="${fn:contains(p, 'fata')}">
										<img class="Produs-photo"
											src="${pageContext.servletContext.contextPath}<c:out value="${p}"/>"
											width="200" height="200" />
									</c:if>
								</c:forEach>


								<div class="price">
									Pret: <span class="Price-int"><c:out value="${l.pret}" /></span>
									<span class="Price-currency">lei</span>
								</div>


								<div class="Status">
									<div class="Status-stoc">
										In stoc:
										<c:out value="${l.inStoc}" />
									</div>

								</div>
							</div>
							<div class="col-sm-9">


								<div class="Produs-listCenterColumn">
									<h3 class="Produs-nameHeading">
										<strong> <c:out value="${l.specificatii}" /></strong>
									</h3>
									<div class="Produs-noRating"></div>
									<dl class="Produs-specifications">
										<p>
											Tip procesor:
											<c:out value="${l.tipProcesor}" />
											<br /> Model procesor:
											<c:out value="${l.modelProcesor}" />
											<br /> Frecventa maxima procesor (GHz):
											<c:out value="${l.frecventaMaximaProcesorGHz}" />
											<br /> Tip ecran:
											<c:out value="${l.tipEcran}" />
											<br /> Diagonala ecran (inch):
											<c:out value="${l.dimensiuneEcranInch}" />
											<br /> Memorie RAM standard (GB):
											<c:out value="${l.capacitateRAM}" />
											<br /> Capacitate stocare (GB):
											<c:out value="${l.capacitateStocare}" />
											<br /> Procesor grafic:
											<c:out value="${l.procesorPlacaVideo}" />
											<br /> Capacitate memorie video (GB):
											<c:out value="${l.capacitateMemoriePlacaVideoMB}" />
											<br /> Sistem de operare:
											<c:out value="${l.sistemDeOperare}" />
											<br />
										</p>
									</dl>

									<sec:authorize access="isAnonymous()">
										<!-- <a
										href='${pageContext.request.contextPath}/laptops/laptop.htm?laptopId=<c:out value="${l.id}"/>'> -->
										<button type="button" class="btn btn-info" id="myBtn${theCount.count}">Details</button>
									</sec:authorize>
									<br /> <br />

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
											href='${pageContext.request.contextPath}/laptops/laptop.htm?laptopId=<c:out value="${l.id}"/>'>
											<button type="button" class="btn btn-info">Details</button>
										</a>
										<br />
										<br />
									</sec:authorize>
									<sec:authorize access="hasRole('ADMIN')">
										<a
											href='${pageContext.request.contextPath}/laptops/edit.htm?laptopId=<c:out value="${l.id}"/>'><button
												type="button" class="btn btn-warning">Edit</button></a>
									</sec:authorize>
									<br /> <br />
									<sec:authorize access="hasRole('ADMIN')">
										<a
											href='${pageContext.request.contextPath}/laptops/sterge/<c:out value="${l.id}"/>'><button
												type="button" class="btn btn-danger">Delete</button></a>
									</sec:authorize>
								</div>
							</div>
						</c:forEach>
					</div>
				</div>
			</div>

			<br /> <br />
		</div>
		<sec:authorize access="hasRole('ADMIN')">
			<div class="newlaptop">
				<a href='${pageContext.request.contextPath}/laptops/new.htm'><button
						type="button" class="btn-success">Add new laptop</button></a>
			</div>
		</sec:authorize>




		<br /> <br />
	</div>
	<script>
		$(document).ready(function() {
			$("#myBtn").click(function() {
				$("#myModal").modal();
			});
			$('.dropdown-submenu a.test').on("click", function(e) {
				$(this).next('ul').toggle();
				e.stopPropagation();
				e.preventDefault();
			});
		});
	</script>
</body>
</html>