<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>

<!DOCTYPE html>
<html lang="en">
<head>
<title>Wellcome to the Catalog</title>
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
body {
	font: 400 15px/1.8 Lato, sans-serif;
	color: #777;
}

h3, h4 {
	margin: 10px 0 30px 0;
	letter-spacing: 10px;
	font-size: 20px;
	color: #111;
}

.container {
	padding: 80px 120px;
}

.carousel-inner img {
	-webkit-filter: grayscale(90%);
	filter: grayscale(90%);
	width: 100%; /* Set width to 100% */
	margin: auto;
}

.carousel-caption h3 {
	color: #fff !important;
}

@media ( max-width : 600px) {
	.carousel-caption {
		display: none;
		/* Hide the carousel text when the screen is less than 600 pixels wide */
	}
}

.bg-1 {
	background: #2d2d30;
	color: #bdbdbd;
}

.bg-1 h3 {
	color: #fff;
}

.bg-1 p {
	font-style: italic;
}

.list-group-item:first-child {
	border-top-right-radius: 0;
	border-top-left-radius: 0;
}

.list-group-item:last-child {
	border-bottom-right-radius: 0;
	border-bottom-left-radius: 0;
}

.thumbnail {
	padding: 0 0 15px 0;
	border: none;
	border-radius: 0;
}

.thumbnail p {
	margin-top: 15px;
	color: #555;
}

.btn {
	padding: 10px 20px;
	background-color: #333;
	color: #f1f1f1;
	border-radius: 0;
	transition: .2s;
}

.btn:hover, .btn:focus {
	border: 1px solid #333;
	background-color: #fff;
	color: #000;
}

.modal-header, h4, .close {
	background-color: #333;
	color: #fff !important;
	text-align: center;
	font-size: 30px;
}

.modal-header, .modal-body {
	padding: 40px 50px;
}

.nav-tabs li a {
	text-align: center;
	color: #777;
}

#googleMap {
	width: 100%;
	height: 400px;
	/*    -webkit-filter: grayscale(100%);
      filter: grayscale(100%); */
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

footer {
	/*background-color: #2d2d30;*/
	background-color: #999;
	color: #f5f5f5;
	padding: 10px 120px;
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
						data-toggle="dropdown" href="#">Products<span class="caret"></span></a>
						<ul class="dropdown-menu">
						
						
							<li class="dropdown-submenu"><a class="test" tabindex="-1" href="#">Laptops<span
									class="caret"></span></a>
							<ul class="dropdown-menu">
									<li><a tabindex="-1"
										href="${pageContext.request.contextPath}/laptops/newlist.htm">Laptops
											list</a></li>
									<li><a tabindex="-1"
										href="${pageContext.request.contextPath}/laptops/charts.htm">Laptops
											charts</a></li>
								</ul>
							<li class="dropdown-submenu"><a class="test" tabindex="-1" href="#">Smartphones<span
									class="caret"></span></a>
							<ul class="dropdown-menu">
									<li><a tabindex="-1"
										href="${pageContext.request.contextPath}/smartphones/newlist.htm">Smartphones
											list</a></li>
									<li><a tabindex="-1"
										href="${pageContext.request.contextPath}/smartphones/charts.htm">Smartphones
											charts</a></li>
								</ul>
							<li class="dropdown-submenu"><a class="test" tabindex="-1" href="#">Tvs<span class="caret"></span></a>
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

	<div id="myCarousel" class="carousel slide" data-ride="carousel">
		<!-- Indicators -->
		<ol class="carousel-indicators">
			<li data-target="#myCarousel" data-slide-to="0" class="active"></li>
			<li data-target="#myCarousel" data-slide-to="1"></li>
			<li data-target="#myCarousel" data-slide-to="2"></li>
		</ol>

		<!-- Wrapper for slides -->
		<div class="carousel-inner" role="listbox">
			<div class="item active">
				<!-- <img src="${pageContext.servletContext.contextPath}/resources/pics/laptop-673715_1920.jpg" alt="laptopPic" width="1200" height="700"> -->
				<img
					src="${pageContext.servletContext.contextPath}<c:out value="${laptopPic}"/>"
					alt="laptopPic" width="1200" height="700">
				<div class="carousel-caption">
					<h1>Laptops</h1>
					<p>Check out our laptops</p>
				</div>
			</div>

			<div class="item">
				<!-- <img src="${pageContext.servletContext.contextPath}/resources/pics/iphone-6-in-black-and-white-edit-picjumbo-com.jpg" alt="phonePic" width="1200" height="700"> -->
				<img
					src="${pageContext.servletContext.contextPath}<c:out value="${phonePic}"/>"
					alt="phonePic" width="1200" height="700">
				<div class="carousel-caption">
					<h1>Smartphones</h1>
					<p>High quality smartphones</p>
				</div>
			</div>

			<div class="item">
				<!-- <img src="${pageContext.servletContext.contextPath}/resources/pics/photo-1467293622093-9f15c96be70f.jpg" alt="tvPic" width="1200" height="700">  -->
				<img
					src="${pageContext.servletContext.contextPath}<c:out value="${tvPic}"/>"
					alt="tvPic" width="1200" height="700">
				<div class="carousel-caption">
					<h1>TVs</h1>
					<p>Top notch TVs</p>
				</div>
			</div>
		</div>

		<!-- Left and right controls -->
		<a class="left carousel-control" href="#myCarousel" role="button"
			data-slide="prev"> <span class="glyphicon glyphicon-chevron-left"
			aria-hidden="true"></span> <span class="sr-only">Previous</span>
		</a> <a class="right carousel-control" href="#myCarousel" role="button"
			data-slide="next"> <span
			class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
			<span class="sr-only">Next</span>
		</a>
	</div>

	<!-- Container (The Band Section) -->
	<div id="band" class="container text-center">
		<h3>THE CATALOGUE</h3>
		<p>
			<em>Welcome to our website</em>
		</p>
		<p>This is a fictional catalogue website. We hope you will like
			it.</p>
		<br>
	</div>

	<!-- Container (Contact Section) -->

	<br>

	<!-- 
	<h3 class="text-center">From The Blog</h3>
	<ul class="nav nav-tabs">
		<li class="active"><a data-toggle="tab" href="#home">Mike</a></li>
		<li><a data-toggle="tab" href="#menu1">Chandler</a></li>
		<li><a data-toggle="tab" href="#menu2">Peter</a></li>
	</ul>

	<div class="tab-content">
		<div id="home" class="tab-pane fade in active">
			<h2>Mike Ross, Manager</h2>
			<p>Man, we've been on the road for some time now. Looking forward
				to lorem ipsum.</p>
		</div>
		<div id="menu1" class="tab-pane fade">
			<h2>Chandler Bing, Guitarist</h2>
			<p>Always a pleasure people! Hope you enjoyed it as much as I
				did. Could I BE.. any more pleased?</p>
		</div>
		<div id="menu2" class="tab-pane fade">
			<h2>Peter Griffin, Bass player</h2>
			<p>I mean, sometimes I enjoy the show, but other times I enjoy
				other things.</p>
		</div>
	</div>
	 -->
	<div id="googleMap"></div>

	<!-- Add Google Maps -->
	<script src="http://maps.googleapis.com/maps/api/js"></script>
	<script>
		var myCenter = new google.maps.LatLng(47.071415, 21.919714);

		function initialize() {
			var mapProp = {
				center : myCenter,
				zoom : 12,
				scrollwheel : false,
				draggable : false,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			};

			var map = new google.maps.Map(document.getElementById("googleMap"),
					mapProp);

			var marker = new google.maps.Marker({
				position : myCenter,
			});

			marker.setMap(map);
		}

		google.maps.event.addDomListener(window, 'load', initialize);
	</script>

	<!-- Footer -->
	<footer class="text-center">
		<a class="up-arrow" href="#myPage" data-toggle="tooltip"
			title="TO TOP"> <span class="glyphicon glyphicon-chevron-up"></span>
		</a>

		<div id="contact">
			<h3 class="text-center">Contact</h3>
			<!-- <p class="text-center"><em>We love our fans!</em></p> -->

			<div class="row">
				<div class="col-md-12">
					<!-- <p>Drop us a note.</p> -->
					<p>
						<span class="glyphicon glyphicon-map-marker"></span>Oradea,
						Romania
					</p>
					<p>
						<span class="glyphicon glyphicon-phone"></span>Phone: 00
						40711111111
					</p>
					<p>
						<span class="glyphicon glyphicon-envelope"></span>Email:
						johnnybravo@yahoo.com
					</p>
				</div>
				<!-- <div class="col-md-7">
					<div class="row">
						<div class="col-sm-6 form-group">
							<input class="form-control" id="name" name="name"
								placeholder="Name" type="text" required>
						</div>
						<div class="col-sm-6 form-group">
							<input class="form-control" id="email" name="email"
								placeholder="Email" type="email" required>
						</div>
						</div>
						<textarea class="form-control" id="comments"
							name="comments" placeholder="Comment" rows="5"></textarea>
					
					</div>
					<div class="col-md-2">
						
							<div>
								<button class="btn pull-right" type="submit">Send</button>
							</div>
					</div> -->

			</div>
		</div>
	</footer>

	<script>
		$(document).ready(
				function() {
					// Initialize Tooltip
					$('[data-toggle="tooltip"]').tooltip();

					// Add smooth scrolling to all links in navbar + footer link
					$(".navbar a, footer a[href='#myPage']").on('click',
							function(event) {

								// Make sure this.hash has a value before overriding default behavior
								if (this.hash !== "") {

									// Prevent default anchor click behavior
									event.preventDefault();

									// Store hash
									var hash = this.hash;

									// Using jQuery's animate() method to add smooth page scroll
									// The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
									$('html, body').animate({
										scrollTop : $(hash).offset().top
									}, 900, function() {

										// Add hash (#) to URL when done scrolling (default click behavior)
										window.location.hash = hash;
									});
								} // End if
							});
				})
	</script>
</body>
</html>

<!-- 
	<br/>
	<a href="./laptops/newlist.htm">Lista laptop</a>
	<br/>
	<a href="./smartphones/newlist.htm">Lista smartphone</a>
	<br/>
	<a href="./tvs/newlist.htm">Lista tv</a>
	<form action="logout" method="post">
		<input type="submit" value="logout" /> <input type="hidden"
			name="${_csrf.parameterName}" value="${_csrf.token}" />
	</form>
	<br/>
	<a href="admin">Go to admin area</a> 
	<br/>
	<br/>
	<c:if test="${param.login != null}"><a href="${pageContext.request.contextPath}/login" >Login</a></c:if><br/>
	<br/>
	<br/>
	<c:if test="${param.logout != null}"><a href="<c:url value="../logout" />">Logout</a></c:if><br/> -->
