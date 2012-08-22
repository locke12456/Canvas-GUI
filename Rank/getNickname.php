<?php 
	if(!empty($_COOKIE['nickname']))
	echo  $_COOKIE['nickname'];
	else echo "Guest".$_COOKIE['uid'];
?>