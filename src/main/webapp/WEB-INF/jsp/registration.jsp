<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ page session="false"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!DOCTYPE html>
<html lang="en">
<head>
<title>Register-form</title>
<!--<link href="css/style.css" rel='stylesheet' type='text/css' /> -->
<!-- <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" type="text/css"
	href="<c:url value="/resources/core/css/style.css" />" global
	media="all" />
<script type="application/x-javascript">
	 addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false); function hideURLbar(){ window.scrollTo(0,1); } 
</script>
<!--webfonts-->
<link
	href="http://fonts.googleapis.com/css?family=Lobster|Pacifico:400,700,300|Roboto:400,100,100italic,300,300italic,400italic,500italic,500"
	rel="stylesheet" type="text/css">
<link
	href="http://fonts.googleapis.com/css?family=Raleway:400,100,500,600,700,300"
	rel="stylesheet" type="text/css">
<!--webfonts-->
<style>
/* checkbox */
.checkbox {
	width: 20px;
	margin: 20px auto;
	position: relative;
}

.checkbox label {
	cursor: pointer;
	position: absolute;
	width: 20px;
	height: 20px;
	top: 0;
	border-radius: 4px;

	-webkit-box-shadow: inset 0px 1px 1px white, 0px 1px 3px rgba(0,0,0,0.5);
	-moz-box-shadow: inset 0px 1px 1px white, 0px 1px 3px rgba(0,0,0,0.5);
	box-shadow: inset 0px 1px 1px white, 0px 1px 3px rgba(0,0,0,0.5);
	background: #fcfff4;

	background: -webkit-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
	background: -moz-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
	background: -o-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
	background: -ms-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
	background: linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fcfff4', endColorstr='#b3bead',GradientType=0 );
}

.checkbox label:after {
	-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
	filter: alpha(opacity=0);
	opacity: 0;
	content: '';
	position: absolute;
	width: 9px;
	height: 5px;
	background: transparent;
	top: 4px;
	left: 4px;
	border: 3px solid #333;
	border-top: none;
	border-right: none;

	-webkit-transform: rotate(-45deg);
	-moz-transform: rotate(-45deg);
	-o-transform: rotate(-45deg);
	-ms-transform: rotate(-45deg);
	transform: rotate(-45deg);
}

.checkbox label:hover::after {
	-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=30)";
	filter: alpha(opacity=30);
	opacity: 0.5;
}

.checkbox input[type=checkbox]:checked + label:after {
	-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
	filter: alpha(opacity=100);
	opacity: 1;
}


</style>
</head>
<body>

	<div class="main">
		<div class="wrap">
			<div class="Registration">
				<div class="Registration-head">
					<h2 style="color: #FFF">
						<span></span>Register
					</h2>
				</div>


				<div class="container">

					<!--<spring:url value="/" var="userActionUrl" /> -->

					<form:form class="form-horizontal" method="post"
						modelAttribute="newuserForm" action="savenewuser.htm">


						<div class="form-group ${status.error ? 'has-error' : ''}">
							<label class="col-sm-2 control-label" style="color: #FFF">Username</label><span
								style="color: #FF0000">*</span>
							<div class="col-sm-10">
								<form:input path="username" type="text" class="form-control "
									id="username" placeholder="username" />
								<form:errors path="username" class="control-label" />
							</div>
						</div>



						<div class="form-group ${status.error ? 'has-error' : ''}">
							<label class="col-sm-2 control-label" style="color: #FFF">Password</label><span
								style="color: #FF0000">*</span>
							<div class="col-sm-10">
								<form:password path="password" class="form-control"
									id="password" placeholder="password" />
								<form:errors path="password" class="control-label" />
							</div>
						</div>



						<div class="form-group ${status.error ? 'has-error' : ''}">
							<label class="col-sm-2 control-label" style="color: #FFF">confirm Password</label><span
								style="color: #FF0000">*</span>
							<div class="col-sm-10">
								<form:password path="confirmPassword" class="form-control"
									id="password" placeholder="password" />
								<form:errors path="confirmPassword" class="control-label" />
							</div>
						</div>



						<div class="form-group ${status.error ? 'has-error' : ''}">
							<label class="col-sm-2 control-label" style="color: #FFF">Name</label><span
								style="color: #FF0000">*</span>
							<div class="col-sm-10">
								<form:input path="name" type="text" class="form-control "
									id="name" placeholder="name" />
								<form:errors path="name" class="control-label" />
							</div>
						</div>



						<div class="form-group ${status.error ? 'has-error' : ''}">
							<label class="col-sm-2 control-label" style="color: #FFF">Address</label>
							<div class="col-sm-10">
								<form:textarea path="userAddress" rows="5" class="form-control"
									id="userAddress" placeholder="address" />
								<form:errors path="userAddress" class="control-label" />
							</div>
						</div>



						<div class="form-group ${status.error ? 'has-error' : ''}">
							<label class="col-sm-2 control-label" style="color: #FFF">Phone</label>
							<div class="col-sm-10">
								<form:input path="userPhone" class="form-control" id="userPhone"
									placeholder="phone" />
								<form:errors path="userPhone" class="control-label" />
							</div>
						</div>



						<div class="form-group ${status.error ? 'has-error' : ''}">
							<label class="col-sm-2 control-label" style="color: #FFF">Email</label><span
								style="color: #FF0000">*</span>
							<div class="col-sm-10">
								<form:input path="userEmail" class="form-control" id="userEmail"
									placeholder="email" />
								<form:errors path="userEmail" class="control-label" />
							</div>
						</div>



						<div class="form-group ${status.error ? 'has-error' : ''}">
							<label class="col-sm-2 control-label" style="color: #FFF">Do you like our
								website?</label><br />
							<div class="col-sm-10">
								<div class="checkbox">
									<label> <form:checkbox path="siteLover" id="siteLover" />
									</label>
									<form:errors path="siteLover" class="control-label" />
								</div>
							</div>
						</div>


						<br />
						<br />
						<div class="form-group ${status.error ? 'has-error' : ''}">
							<label class="col-sm-2 control-label" style="color: #FFF">Please select our
								products categories that you like</label> <br />
							<div class="col-sm-10">
								<form:checkboxes path="selectCategory" items="${categoryList}"
									element="label class='checkbox-inline'" style="color: #FFF"/>
								<br />
								<form:errors path="selectCategory" class="control-label" />
							</div>
						</div>
						<br />


						<div class="form-group ${status.error ? 'has-error' : ''}">
							<label class="col-sm-2 control-label" style="color: #FFF">Sex</label><span
								style="color: #FF0000">*</span><br />
							<div class="col-sm-10">
								<label class="radio-inline"> <form:radiobutton
										path="sex" value="M" style="color: #FFF"/> Male
								</label> <label class="radio-inline"> <form:radiobutton
										path="sex" value="F" style="color: #FFF"/> Female
								</label><br />
								<form:errors path="sex" class="control-label" />
							</div>
						</div>
						<br />
						<br />


						<div class="form-group ${status.error ? 'has-error' : ''}">
							<label class="col-sm-2 control-label" style="color: #FFF">Ocupation</label><br />
							<div class="col-sm-5">
								<form:select path="ocupation" class="form-control">
									<form:option value="NONE" label="--- Select ---" />
									<form:options items="${ocupation}"/>
								</form:select>
								<form:errors path="ocupation" class="control-label" />
							</div>
							<div class="col-sm-5"></div>
						</div>
						<br />
						<div class="col-sm-5">
							<p>
								<span style="color: #FF0000">* Mandatory fields!</span>
							</p>
						</div>
						<br />
						<br />

						<div class="form-group">
							<!-- 
							<div class="col-sm-offset-2 col-sm-10">
								<button type="submit" class="btn-lg btn-primary pull-right"
									value="Admit form">Admit form</button>
							</div>
							 -->
							 <div class="submit">
							<input type="submit" onclick="myFunction()" value="Sign Me Up >">
						</div>
						</div>
					</form:form>

				</div>
				<!--
				<form>
					 <input type="text" value="First Name" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'First Name';}" >
						  		<input type="text" value="Last Name" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'Last Name';}" >
						  		<input type="text" value="Email Address" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'Email Address';}" >
						  		<input type="text" value="User Name" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'User Name';}" >
								<input type="password" value="Password" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'Password';}" >
								<input type="password" value=" Confirm Password" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = ' Confirm Password';}" >
					<div class="Remember-me">
						<div class="p-container">
							<label class="checkbox"><input type="checkbox"
								name="checkbox" checked><i></i>I agree to the Terms and
								Conditions</label>
							<div class="clear"></div>
						</div>

						<div class="submit">
							<input type="submit" onclick="myFunction()" value="Sign Me Up >">
						</div>
						<div class="clear"></div>
					</div>
					 
				</form>
				-->
			</div>



		</div>
	</div>

</body>
</html>
