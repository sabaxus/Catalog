<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!-- <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> -->
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>AccessDenied page</title>
</head>
<body>
	Dear
	<strong><c:out value="${model.userName}"/></strong>, You are not authorized to access this page
	<br/><br/>
	<a href="${pageContext.request.contextPath}/logout" >Logout</a><br/>
<!-- <br/>
	 <a href="${pageContext.request.contextPath}/laptops"> Inapoi la lista </a> -->
</body>
</html>