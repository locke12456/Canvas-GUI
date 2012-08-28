<?php
	require 'Login.php';
	require 'connst.php';
	require 'Ranking.php5';
	$rank = new Ranking();
	$row = $rank->getRank(1,null,"Guest9795006");
echo $row;
?>