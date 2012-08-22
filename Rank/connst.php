<?php
	require_once("JSON.php");
	function mysql2json4($sql) {
		if(is_string($sql)) {
			$query = mysql_query($query) or die(mysql_error());
		} else {
			$query = $sql;
		}
				   
		$ar = array();
		if($total = mysql_num_rows($query)) {
			while($row = mysql_fetch_assoc($query)) {
				$obj = array();
				foreach($row as $key => $value) {
$obj[ $key ] = $value;
}
array_push($ar, $obj);
}
mysql_data_seek($query, 0);
}

$json = new Services_JSON();
return $json->encode($ar);
}
?>