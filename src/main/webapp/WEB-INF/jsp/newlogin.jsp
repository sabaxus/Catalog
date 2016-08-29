<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!-- <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> -->
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Please login</title>
</head>
<body>
	
	  <!-- Modal -->
  <div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog">

      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header" style="padding:35px 50px;">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4><span class="glyphicon glyphicon-lock"></span> Login</h4>
        </div>
        <div class="modal-body" style="padding:40px 50px;">
	
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
			<p>
				<label for="remember-me">Remember Me?</label> <input type="checkbox"
					id="remember-me" name="remember-me" />
			</p>
			<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
			<div>
				<button type="submit" class="btn">Log in</button>
			</div>
		</fieldset>
	</form>
	
	  </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-danger btn-default pull-left" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span> Cancel</button>
          <p>Not a member? <a href="#">Sign Up</a></p>
          <p>Forgot <a href="#">Password?</a></p>
        </div>
      </div>

    </div>
  </div>
	
	
</body>
</html>