<!DOCTYPE html>
<html lang="es">
<head>
    <title>Slide show</title>
    <link rel="icon" type="image/png" href="./images/slideshow3.png">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <link id="estilos_base" rel="stylesheet" href="./css/style.css">
</head>
<body id="body_show">

<?php

include('functions.php');
include('includes/connect_db.php');

//echo "<hr>";
$conn->close();
?>

<h3 style="display:none;">Slide actual: <span id="sp_id">...</span></h3>

<div id="contenedor_show" class="bg_show">
    <div class="vista_inner">
        
    </div>
</div>

<script src="./js/config_both.js"></script>
<script src="./js/slide_show.js"></script>
<script src="./js/slide_both.js"></script>

</body>
</html>
