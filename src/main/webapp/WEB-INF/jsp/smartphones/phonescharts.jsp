<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!-- <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> -->
<!DOCTYPE HTML>
<html>
<head>
<title>Laptop charts</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> -->
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
<script type="text/javascript">
  window.onload = function () {
    var chart = new CanvasJS.Chart("chartContainer",
    {
      title:{
        text: "Smartphones Brands percentages",
        fontFamily: "Impact",
        fontWeight: "normal"
      },

      legend:{
        verticalAlign: "bottom",
        horizontalAlign: "center"
      },
      data: [
      {
        //startAngle: 45,
       indexLabelFontSize: 20,
       indexLabelFontFamily: "Garamond",
       indexLabelFontColor: "black",
       indexLabelLineColor: "black",
       indexLabelPlacement: "outside",
       type: "doughnut",
       showInLegend: true,
       dataPoints: [
       /*{  y: 53.37, legendText:"Android 53%", indexLabel: "Android 53%" },
       {  y: 35.0, legendText:"iOS 35%", indexLabel: "Apple iOS 35%" },
       {  y: 7, legendText:"Blackberry 7%", indexLabel: "Blackberry 7%" },
       {  y: 2, legendText:"Windows 2%", indexLabel: "Windows Phone 2%" },
       {  y: 5, legendText:"Others 5%", indexLabel: "Others 5%" },*/             
       <c:forEach var="brand" items="${brandMap}">
       		
       {  y: ${brand.value}, legendText:"${brand.key} ${100*(brand.value)}%", indexLabel: "${brand.key} ${100*(brand.value)}%" },
                    
       </c:forEach>
       ]
     }
     ]
   });

    chart.render();
    
    var chart1 = new CanvasJS.Chart("chartContainer1",
    	    {
    	      title:{
    	        text: "Smartphones Screen Dimensions percentages",
    	    	fontFamily: "Impact",
    	    	fontWeight: "normal"
    	      },

    	      legend:{
    	    	verticalAlign: "bottom",
    	    	horizontalAlign: "center"
    	      },
    	      data: [
    	      {
    	       //startAngle: 45,
    	       indexLabelFontSize: 20,
    	       indexLabelFontFamily: "Garamond",
    	       indexLabelFontColor: "black",
    	       indexLabelLineColor: "black",
    	       indexLabelPlacement: "outside",
    	       type: "doughnut",
    	       showInLegend: true,
    	       dataPoints: [
    	           <c:forEach var="dimEcran" items="${dimEcranMap}">
    	    	   {  y: ${dimEcran.value}, legendText:"${dimEcran.key} ${100*(dimEcran.value)}%", indexLabel: "${dimEcran.key} ${100*(dimEcran.value)}%" },
    	    	   </c:forEach>
    	       ]
    	    	     }
    	    	     ]
    	    	   });

    	    	    chart1.render();
  
	var chart2 = new CanvasJS.Chart("chartContainer2",
	{
	  title:{
	    text: "Smartphones Screen Resolution percentages",
	    fontFamily: "Impact",
	    fontWeight: "normal"
	  },

	  legend:{
	    verticalAlign: "bottom",
	    horizontalAlign: "center"
	  },
	  data: [
	  {
	   //startAngle: 45,
	   indexLabelFontSize: 20,
	   indexLabelFontFamily: "Garamond",
	   indexLabelFontColor: "black",
	   indexLabelLineColor: "black",
	   indexLabelPlacement: "outside",
	   type: "doughnut",
	   showInLegend: true,
	   dataPoints: [
	       <c:forEach var="rezolutie" items="${resScreenMap}">
	       {  y: ${rezolutie.value}, legendText:"${rezolutie.key} ${100*(rezolutie.value)}%", indexLabel: "${rezolutie.key} ${100*(rezolutie.value)}%" },
	       </c:forEach>
	  ]
	 }
	 ]
   });
	
	chart2.render();
	
    		
    		
    		var chart3 = new CanvasJS.Chart("chartContainer3",
    	    		{
    	    		  title:{
    	    		    text: "Smartphones Internal Memory percentages",
    	    		    fontFamily: "Impact",
    	    		    fontWeight: "normal"
    	    		  },

    	    		  legend:{
    	    		    verticalAlign: "bottom",
    	    		    horizontalAlign: "center"
    	    		  },
    	    		  data: [
    	    		  {
    	    		   //startAngle: 45,
    	    		   indexLabelFontSize: 20,
    	    		   indexLabelFontFamily: "Garamond",
    	    		   indexLabelFontColor: "black",
    	    		   indexLabelLineColor: "black",
    	    		   indexLabelPlacement: "outside",
    	    		   type: "doughnut",
    	    		   showInLegend: true,
    	    		   dataPoints: [
    	    		       <c:forEach var="memorieInterna" items="${memorieInternaMap}">
    	    		       {  y: ${memorieInterna.value}, legendText:"${memorieInterna.key} ${100*(memorieInterna.value)}%", indexLabel: "${memorieInterna.key} ${100*(memorieInterna.value)}%" },
    	    		       </c:forEach>
    	    		  ]
    	    		 }
    	    		 ]
    	    	   });
    	    		
    	    		chart3.render();
    	    		
    	    		var chart4 = new CanvasJS.Chart("chartContainer4",
    	    	    		{
    	    	    		  title:{
    	    	    		    text: "Smartphones RAM memory percentages",
    	    	    		    fontFamily: "Impact",
    	    	    		    fontWeight: "normal"
    	    	    		  },

    	    	    		  legend:{
    	    	    		    verticalAlign: "bottom",
    	    	    		    horizontalAlign: "center"
    	    	    		  },
    	    	    		  data: [
    	    	    		  {
    	    	    		   //startAngle: 45,
    	    	    		   indexLabelFontSize: 20,
    	    	    		   indexLabelFontFamily: "Garamond",
    	    	    		   indexLabelFontColor: "black",
    	    	    		   indexLabelLineColor: "black",
    	    	    		   indexLabelPlacement: "outside",
    	    	    		   type: "doughnut",
    	    	    		   showInLegend: true,
    	    	    		   dataPoints: [
    	    	    		       <c:forEach var="memorieRAM" items="${memorieRAMMap}">
    	    	    		       {  y: ${memorieRAM.value}, legendText:"${memorieRAM.key} ${100*(memorieRAM.value)}%", indexLabel: "${memorieRAM.key} ${100*(memorieRAM.value)}%" },
    	    	    		       </c:forEach>
    	    	    		  ]
    	    	    		 }
    	    	    		 ]
    	    	    	   });
    	    	    		
    	    	    		chart4.render();
    	    	    		
    	    	    		var chart5 = new CanvasJS.Chart("chartContainer5",
    	    	    	    		{
    	    	    	    		  title:{
    	    	    	    		    text: "Smartphones Processor Type percentages",
    	    	    	    		    fontFamily: "Impact",
    	    	    	    		    fontWeight: "normal"
    	    	    	    		  },

    	    	    	    		  legend:{
    	    	    	    		    verticalAlign: "bottom",
    	    	    	    		    horizontalAlign: "center"
    	    	    	    		  },
    	    	    	    		  data: [
    	    	    	    		  {
    	    	    	    		   //startAngle: 45,
    	    	    	    		   indexLabelFontSize: 20,
    	    	    	    		   indexLabelFontFamily: "Garamond",
    	    	    	    		   indexLabelFontColor: "black",
    	    	    	    		   indexLabelLineColor: "black",
    	    	    	    		   indexLabelPlacement: "outside",
    	    	    	    		   type: "doughnut",
    	    	    	    		   showInLegend: true,
    	    	    	    		   dataPoints: [
    	    	    	    		       <c:forEach var="tipProcesor" items="${tipProcesorMap}">
    	    	    	    		       {  y: ${tipProcesor.value}, legendText:"${tipProcesor.key} ${100*(tipProcesor.value)}%", indexLabel: "${tipProcesor.key} ${100*(tipProcesor.value)}%" },
    	    	    	    		       </c:forEach>
    	    	    	    		  ]
    	    	    	    		 }
    	    	    	    		 ]
    	    	    	    	   });
    	    	    	    		
    	    	    	    		chart5.render();
    	    	    	    		
    	    	    		var chart6 = new CanvasJS.Chart("chartContainer6",
    	    	    	    		{
    	    	    	    		  title:{
    	    	    	    		    text: "Smartphones Colour percentages",
    	    	    	    		    fontFamily: "Impact",
    	    	    	    		    fontWeight: "normal"
    	    	    	    		  },

    	    	    	    		  legend:{
    	    	    	    		    verticalAlign: "bottom",
    	    	    	    		    horizontalAlign: "center"
    	    	    	    		  },
    	    	    	    		  data: [
    	    	    	    		  {
    	    	    	    		   //startAngle: 45,
    	    	    	    		   indexLabelFontSize: 20,
    	    	    	    		   indexLabelFontFamily: "Garamond",
    	    	    	    		   indexLabelFontColor: "black",
    	    	    	    		   indexLabelLineColor: "black",
    	    	    	    		   indexLabelPlacement: "outside",
    	    	    	    		   type: "doughnut",
    	    	    	    		   showInLegend: true,
    	    	    	    		   dataPoints: [
    	    	    	    		       <c:forEach var="culoare" items="${culoareMap}">
    	    	    	    		       {  y: ${culoare.value}, legendText:"${culoare.key} ${100*(culoare.value)}%", indexLabel: "${culoare.key} ${100*(culoare.value)}%" },
    	    	    	    		       </c:forEach>
    	    	    	    		  ]
    	    	    	    		 }
    	    	    	    		 ]
    	    	    	    	   });
    	    	    	    		
    	    	    	    		chart6.render();

  }
  </script>
<script type="text/javascript"
	src="<c:url value="/resources/core/js/canvasjs.min.js" />"></script>
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
	<div class="row">
    	<div class="col-md-6">
	<div id="chartContainer"
		style="padding: 80px 120px; height: 300px; width: 100%;"></div></div>
		<div class="col-md-6">
	<div id="chartContainer1"
		style="padding: 80px 120px; height: 300px; width: 100%;"></div></div></div>
		<div class="row">
		<div class="col-md-6">
	<div id="chartContainer2"
		style="padding: 80px 120px; height: 300px; width: 100%;"></div></div>
		<div class="col-md-6">
	<div id="chartContainer3"
		style="padding: 80px 120px; height: 300px; width: 100%;"></div></div></div>
		<div class="row">
		<div class="col-md-6">
	<div id="chartContainer4"
		style="padding: 80px 120px; height: 300px; width: 100%;"></div></div>
		<div class="col-md-6">
	<div id="chartContainer5"
		style="padding: 80px 120px; height: 300px; width: 100%;"></div></div></div>
		<div class="row">
		<div class="col-md-12">
	<div id="chartContainer6"
		style="padding: 80px 120px; height: 300px; width: 100%;"></div></div></div>
</body>
</html>
