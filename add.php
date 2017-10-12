<?php
	sleep(1);
	require 'config.php';

	$query = "INSERT INTO user (user, pass, email, sex, birth, date) VALUES('{$_POST['user']}','{$_POST['pass']}','{$_POST['email']}','{$_POST['sex']}','{$_POST['birth']}',NOW())";

	mysql_query($query) or die('新增失败！'.mysql_error());

	echo mysql_affected_rows();

	mysql_close();
?>