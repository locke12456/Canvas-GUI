<?php
	require 'Login.php';
	require 'connst.php';
	require 'Ranking.php5';
	
	$gid = !empty($_POST['gid'])?$_POST['gid']:null;
	$uid = !empty($_POST['uid'])?$_POST['uid']:null;//time()%100000;
	$nickname = !empty($_POST['nickname'])?$_POST['nickname']:null;//'Guest'.(time()%100000);
	$total = !empty($_POST['total'])?$_POST['total']:null;
	$score = !empty($_POST['score'])?$_POST['score']:null;
	/*
	$gid = !empty($_GET['gid'])?$_GET['gid']:null;
	$uid = !empty($_GET['uid'])?$_GET['uid']:time()%100000;
	$nickname = !empty($_GET['nickname'])?$_GET['nickname']:'Guest'.(time()%10000);
	$total = !empty($_GET['total'])?$_GET['total']:null;
	$score = !empty($_GET['score'])?$_GET['score']:null;*/
	$rank = new Ranking();
	//print_r($_GET);
	echo $uid;
	$rank->UpdateScore($gid, $uid, $nickname, $total, $score);
?>