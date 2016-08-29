<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

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
						data-toggle="dropdown" href="#">Products <span class="caret"></span></a>
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