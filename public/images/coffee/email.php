<?php 
$ToEmail = 'wattenberger@gmail.com'; 
$EmailSubject = 'Coffee Order'; 
$input = $_POST['name'];
mail($ToEmail, $EmailSubject, $input) or die ("Failure"); 

header("Location: coffeesubmit.html");
?>