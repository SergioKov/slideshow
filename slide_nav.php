<!DOCTYPE html>
<html lang="es">
<head>
    <title>Slide Nav</title>
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


//echo "<hr>";
$conn->close();
?>

<h3 style="display:none;">Slide to insert en bd: <span id="sp_id">...</span></h3>

<div id="wr_init" style="display:none;">
</div>

<div id="wr_nav">
    <button id="goPrev" class="btn" onclick="goToSlide('prev')">Prev</button>

    <button id="btn_iniciar" class="btn" onclick="iniciarSlides()">Iniciar</button>
    <button id="btn_finalizar" class="btn" onclick="finalizarSlides()">Finalizar</button> 

    <button id="goNext" class="btn" onclick="goToSlide('next')">Next</button>  
</div>

<div id="wr_btns_slides"></div>

<div id="wr_both">

    <div id="wr_lista_slides"> 
        <div class="lista_inner">
        </div>       
    </div>

    <div id="wr_vista_slides" class="body_bg">
        <div class="vista_inner">
        </div>
    </div>

</div>





<script src="./js/config_both.js"></script>
<script src="./js/slide_nav.js"></script>
<script src="./js/slide_both.js"></script>

</body>
</html>
