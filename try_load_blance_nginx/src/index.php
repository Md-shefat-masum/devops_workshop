<?php
$hostname = gethostname();
$ip = $_SERVER['SERVER_ADDR'];
echo "<h1>Server Info</h1>";
echo "<p>Hostname: $hostname</p>";
echo "<p>IP Address: $ip</p>";
?>
