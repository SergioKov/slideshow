<!DOCTYPE html>
<html lang="es">
<head>
    <title>Slide show</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <link id="estilos_base" rel="stylesheet" href="./css/style.css">
</head>
<body>
<?php

include('functions.php');
include('includes/connect_db.php');



if(isset($_GET) && !empty($_GET) ){
    echo"<h3>HAY parametros $ _GET</h3>";

    foreach ($_GET as $key => $value) {
        echo"<p>$key => $value</p>";
    }

    foreach ($_GET as $nombre_var => $valor_var) {
        $$nombre_var = $_GET[$nombre_var];
    }
    //echo"<p>$ lang: $lang</p>";

}else{
    //echo"<h3>No hay parametros $ _GET</h3>";
}

$host_name = php_uname('n');
// echo "El nombre del host es: " . $host_name;//el nombre del equipo en el que está corriendo el servidor.

//echo "<hr>";
$conn->close();
?>

<h3 style="display:none;">Slide actual: <span id="sp_id">...</span></h3>

<div id="contenedor"></div>


<script src="./js/slide_show.js"></script>

</body>
</html>
