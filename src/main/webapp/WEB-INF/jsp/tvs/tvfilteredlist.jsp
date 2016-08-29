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
<title>List of tvs</title>
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
div.newtv {
	font-size: 20px;
	padding: 0px 160px;
	color: #000;
	text-align: center;
}

.container {
	padding: 80px 40px;
}

.container2 {
	padding: 80px 40px;
}

/* 
.filter {
	padding: 80px 80px;
	border: 1px solid gray;
}
*/
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

footer {
	/*background-color: #2d2d30;*/
	background-color: #999;
	color: #f5f5f5;
	padding: 32px;
}

footer a {
	color: #f5f5f5;
}

footer a:hover {
	color: #777;
	text-decoration: none;
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

	<div class="container-fluid">

		<div class="main">

			<c:forEach var="t" items="${model.tvList}" varStatus="theCount">

				<!-- <ul id="js-viewGrid-target"
				class="ProductGrid-list  ProductGrid-4to2 ">
				<li class="ProductGrid-item"> -->

				<div class="col-sm-3">
					<c:forEach var="p" items="${t.photo}">
						<c:if test="${fn:contains(p, 'fata')}">
							<img class="Produs-photo"
								src="${pageContext.servletContext.contextPath}<c:out value="${p}"/>"
								width="150" height="150" />
						</c:if>
					</c:forEach>

					<!-- <img class="Produs-photo" src="<c:out value="${l.photo}"/>" width="150" height="150" /> -->

					<div class="price">
						Pret: <span class="Price-int"><c:out value="${t.pret}" /></span>
						<span class="Price-currency">lei</span>
					</div>


					<div class="Status">
						<div class="Status-stoc">
							In stoc:
							<c:out value="${t.inStoc}" />
						</div>
					</div>
				</div>
				<div class="col-sm-9">

					<div class="Produs-listCenterColumn">
						<h3 class="Produs-nameHeading">
							<c:out value="${t.specificatii}" />
						</h3>
						<div class="Produs-noRating"></div>
						<dl class="Produs-specifications">
							<p>
								Tip ecran:
								<c:out value="${t.tipEcran}" />
								<br /> Tip:
								<c:out value="${t.tip}" />
								<br /> Tehnologie:
								<c:out value="${t.tehnologie}" />
								<br /> Diagonala (cm):
								<c:out value="${t.diagonalacm}" />
								<br /> Dimensiune ecran (inch):
								<c:out value="${t.dimensiuneEcranInch}" />
								<br /> Rezolutie ecran (pixeli):
								<c:out value="${t.rezolutieEcranPixeli}" />
								<br /> Rezolutie:
								<c:out value="${t.rezolutie}" />
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
													<label for="username">Username</label> <input type="text"
														id="username" name="username" />
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
								href='${pageContext.request.contextPath}/tvs/tv.htm?tvId=<c:out value="${t.id}"/>'>
								<button type="button" class="btn btn-info">Details</button>
							</a>
							<br />
							<br />
						</sec:authorize>
						<br />
						<sec:authorize access="hasRole('ADMIN')">
							<a
								href='${pageContext.request.contextPath}/tvs/edit.htm?tvId=<c:out value="${t.id}"/>'><button
									type="button" class="btn btn-warning">Edit</button></a>
						</sec:authorize>
						<br /> <br />
						<sec:authorize access="hasRole('ADMIN')">
							<a
								href='${pageContext.request.contextPath}/tvs/sterge/<c:out value="${t.id}"/>'><button
									type="button" class="btn btn-danger">Delete</button></a>
						</sec:authorize>
					</div>
					<br /> <br />

				</div>

			</c:forEach>
			<br /> <br /> <a
				href='${pageContext.request.contextPath}/tvs/newlist.htm'><button
					type="button" class="btn-info">Filter again the tv list</button></a><br />
			<br />
			<sec:authorize access="hasRole('ADMIN')">
				<div class="newtv">
					<a href='${pageContext.request.contextPath}/tvs/new.htm'><button
							type="button" class="btn-success">Add new tv</button></a>
				</div>
			</sec:authorize>


		</div>
	</div>



</body>
</html>