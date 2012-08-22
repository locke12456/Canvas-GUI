<?php
	mysql_connect("127.0.0.1", "root", "1234");
	mysql_select_db("coach");
	mysql_query("SET NAMES 'utf8'");
	setcookie("Login",true);
?>