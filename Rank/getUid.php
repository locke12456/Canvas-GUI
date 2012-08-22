<?php
$uid = empty($_COOKIE['uid'])?time()%10000000:$_COOKIE['uid'];
if(empty($_COOKIE['uid'])){
	setcookie('uid',$uid,time()+3600000);
}
echo $uid;
?>