<?php
	require 'Login.php';
	require 'connst.php';
	require 'Ranking.php5';
	$rank = new Ranking();
	$row = $rank->getTop10(1);
echo $row;
?>