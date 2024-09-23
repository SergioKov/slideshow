<?php

// Conectar a la base de datos
$conn = new mysqli("localhost", "root", "", "db_slideshow");

// Comprobar la conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}else{
    //echo "<p>Conectado a db de test correctamente.</p><hr>";
}


?>