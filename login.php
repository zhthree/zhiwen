<?php
	require 'config.php';

	$query = mysql_query("SELECT user,pass FROM user WHERE user = '{$_POST['login_user']}' AND pass='{$_POST['login_pass']}'") or die ('SQL错误！');

	if(mysql_fetch_array($query,MYSQL_ASSOC)){
		echo 'true';
	}else{
		echo 'false';
	}
	
	mysql_close();
?>