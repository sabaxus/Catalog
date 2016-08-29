<%@ page session="false"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!DOCTYPE html>
<html lang="en">
<head>
<title>Update user profile</title>
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
      color:white !important;
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
<body id="myPage" data-spy="scroll" data-target=".navbar"
	data-offset="50">

<jsp:include page="/WEB-INF/fragments/header.jsp" />

<div class="container">

	<!--<spring:url value="/" var="userActionUrl" /> -->

	<form:form class="form-horizontal" method="post" commandName="updateuserForm" action="saveuserupdate.htm">

			<form:hidden path="username" />
			
<!-- 		<div class="form-group ${status.error ? 'has-error' : ''}">
				<label class="col-sm-2 control-label">Username</label><span style="color:#FF0000">*</span>
				<div class="col-sm-10">
					<form:input path="username" type="text" class="form-control " id="username" placeholder="username" />
					<form:errors path="username" class="control-label" />
				</div>
			</div>
-->		

		
			<div class="form-group ${status.error ? 'has-error' : ''}">
				<label class="col-sm-2 control-label">Password</label><span style="color:#FF0000">*</span>
				<div class="col-sm-10">
					<form:password path="password" class="form-control" id="password" />
					<form:errors path="password" class="control-label" />
				</div>
			</div>
		

		
			<div class="form-group ${status.error ? 'has-error' : ''}">
				<label class="col-sm-2 control-label">confirm Password</label><span style="color:#FF0000">*</span>
				<div class="col-sm-10">
					<form:password path="confirmPassword" class="form-control" id="password" />
					<form:errors path="confirmPassword" class="control-label" />
				</div>
			</div>
		
		
		
			<div class="form-group ${status.error ? 'has-error' : ''}">
				<label class="col-sm-2 control-label">Name</label><span style="color:#FF0000">*</span>
				<div class="col-sm-10">
					<form:input path="name" type="text" class="form-control " id="name" />
					<form:errors path="name" class="control-label" />
				</div>
			</div>
		

		
			<div class="form-group ${status.error ? 'has-error' : ''}">
				<label class="col-sm-2 control-label">Address</label>
				<div class="col-sm-10">
					<form:textarea path="userAddress" rows="5" class="form-control" id="userAddress" />
					<form:errors path="userAddress" class="control-label" />
				</div>
			</div>
		
		
		
			<div class="form-group ${status.error ? 'has-error' : ''}">
				<label class="col-sm-2 control-label">Phone</label>
				<div class="col-sm-10">
					<form:input path="userPhone" class="form-control" id="userPhone" />
					<form:errors path="userPhone" class="control-label" />
				</div>
			</div>
		
		
		
			<div class="form-group ${status.error ? 'has-error' : ''}">
				<label class="col-sm-2 control-label">Email</label><span style="color:#FF0000">*</span>
				<div class="col-sm-10">
					<form:input path="userEmail" class="form-control" id="userEmail" />
					<form:errors path="userEmail" class="control-label" />
				</div>
			</div>
		

		
			<div class="form-group ${status.error ? 'has-error' : ''}">
				<label class="col-sm-2 control-label">Do you like our website?</label>
				<div class="col-sm-10">
					<div class="checkbox">
						<label> <form:checkbox path="siteLover" id="siteLover" />
						</label>
						<form:errors path="siteLover" class="control-label" />
					</div>
				</div>
			</div>
		

		
			<div class="form-group ${status.error ? 'has-error' : ''}">
				<label class="col-sm-2 control-label">Please select our products categories that you like</label>
				<div class="col-sm-10">
					<form:checkboxes path="selectCategory" items="${categoryList}" element="label class='checkbox-inline'" />
					<br />
					<form:errors path="selectCategory" class="control-label" />
				</div>
			</div>
		

		
			<div class="form-group ${status.error ? 'has-error' : ''}">
				<label class="col-sm-2 control-label">Sex</label><span style="color:#FF0000">*</span>
				<div class="col-sm-10">
					<label class="radio-inline"> <form:radiobutton path="sex" value="M" /> Male</label>
					<label class="radio-inline"> <form:radiobutton path="sex" value="F" /> Female</label><br />
					<form:errors path="sex" class="control-label" />
				</div>
			</div>
		

		
			<div class="form-group ${status.error ? 'has-error' : ''}">
				<label class="col-sm-2 control-label">Ocupation</label>
				<div class="col-sm-5">
					<form:select path="ocupation" class="form-control">
						<form:option value="NONE" label="--- Select ---" />
						<form:options items="${ocupation}" />
					</form:select>
					<form:errors path="ocupation" class="control-label" />
				</div>
				<div class="col-sm-5"></div>
			</div>
			<br/>
			<div class="col-sm-5">
					<p><span style="color:#FF0000">* Mandatory fields!</span> </p>
			</div>
			<br/>

		<div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<button type="submit" class="btn-lg btn-primary pull-right" value="Admit form" >Admit form</button>
			</div>
		</div>
	</form:form>

</div>

</body>
</html>