<!DOCTYPE html>
<html lang="es">
<head>
    <title>Slide Nav</title>
    <link rel="icon" type="image/png" href="./images/slideshow3.png">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <link id="estilos_base" rel="stylesheet" href="./css/style.css">
</head>
<body>
<?php

include('functions.php');
include('includes/connect_db.php');

if(isset($_GET) && !empty($_GET) ){
    //echo"<h3>HAY parametros $ _GET</h3>";

    foreach ($_GET as $key => $value) {
        //echo"<p>$key => $value</p>";
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

<header id="header">
    <div class="header_inner">
        <h3 style="display:none;">Slide to insert en bd: <span id="sp_id">...</span></h3>
        <div id="wr_nav">
            <button id="goPrev" class="btn" onclick="goToSlide('prev')">Prev</button>

            <button id="btn_iniciar" class="btn btn_ini_fin" onclick="iniciarSlides()">Iniciar</button>
            <button id="btn_section" class="btn btn_long" onclick="toggleSections()">Show Section 2</button>
            <button id="btn_finalizar" class="btn btn_ini_fin" onclick="finalizarSlides()">Finalizar</button> 

            <button id="goNext" class="btn" onclick="goToSlide('next')">Next</button>  
        </div>
    </div><!--/header_inner-->
</header>

<main id="main">
    <div id="main_inner">
    
        <section id="section1" style="display:;">
            <div class="section_inner">

                <div id="sidebar">
                    <div class="sidebar_inner">
                        
                        <div class="bl_head">Slide List</div>
                        <div class="side_body">
                            <div class="lista_inner"></div>
                        </div>

                    </div>
                </div>

                <div id="nextslide">
                    <div class="nextslide_inner">

                        <div class="bl_head">Next Slide</div>
                        <div class="next_body">
                            <div class="vista_inner">
                                <div id="wr_vista_next" class="bg_show" onclick="goToSlide('next')">
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                
            </div><!--/section1_inner-->
        </section><!--/section1-->




        <section id="section2" style="display: none;">
            <div class="section_inner">
                
                <div id="actualslide">
                    <div class="actualslide_inner">

                        <div class="actual_head">Actual Slide</div>
                        <div class="actual_body">
                            <div class="vista_inner">
                                <div id="wr_vista_actual" class="bg_show">
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                
            </div><!--/section2_inner-->
        </section><!--/section2-->

    </div><!--/main_inner-->
</main>

<footer id="footer">
    <div id="footer_inner">
        <div id="wr_btns_slides"></div>
    </div><!--/footer_inner-->
</footer>





<script>


</script>

<script src="./js/config_both.js"></script>
<script src="./js/slide_nav.js"></script>
<script src="./js/slide_both.js"></script>

</body>
</html>
