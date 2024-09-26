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

<header id="header">
    <div class="header_inner">
        <h3 style="display:none;">Slide to insert en bd: <span id="sp_id">...</span></h3>
        <div id="wr_nav">
            <button id="goPrev" class="btn" onclick="goToSlide('prev')">Prev</button>

            <button id="btn_iniciar" class="btn btn_ini_fin" onclick="iniciarSlides()">Iniciar</button>
            <button id="btn_finalizar" class="btn btn_ini_fin" onclick="finalizarSlides()">Finalizar</button> 

            <button id="goNext" class="btn" onclick="goToSlide('next')">Next</button>  
        </div>
    </div><!--/header_inner-->
</header>

<main id="main">
    <div id="main_inner">
    
        <section id="section1" style="display: block;">
            <div id="section1_inner">

                <sidebar id="sidebar">
                    <div id="sidebar_inner">
                        
                        <div class="bl_head">Slide List</div>
                        <div class="side_body">
                            <div class="lista_inner"></div>
                        </div>

                    </div>
                </sidebar>

                <sidebar id="nextpart">
                    <div id="nextpart_inner">

                        <div class="bl_head">Next Slide</div>
                        <div class="next_body">
                            <div class="vista_inner"></div>
                        </div>


                    </div>
                </sidebar>
                
                                        <div id="wr_both" style="display: none;">

                                            <div id="wr_lista_slides">
                                                <div class="shapka">Slide List</div> 
                                                <div class="lista_inner---"></div>
                                            </div>

                                            <div id="wr_vista_next" class="bg_show" onclick="goToSlide('next')">
                                                <div class="shapka">Next Slide</div>
                                                <div class="vista_inner"></div>
                                            </div>

                                        </div>
                
            </div><!--/section1_inner-->
        </section><!--/section1-->

        <section id="section2" style="display: none;">
            <div id="section2_inner">
                
                <div id="wr_vista_slides" class="bg_show">
                    <div id="shapka_vista" class="shapka">
                        <button class="btn" onclick="goToSlide('prev')">Prev</button>
                        <span>Actual Slide</span>
                        <button class="btn" onclick="goToSlide('next')">Next</button>
                    </div>
                    <div class="vista_inner"></div>
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

const eid_header = document.getElementById('header'); 
const eid_sidebar = document.getElementById('sidebar'); 
const eid_main = document.getElementById('main'); 
const eid_section1 = document.getElementById('section1'); 
const eid_section2 = document.getElementById('section2'); 
const eid_footer = document.getElementById('footer');

mySizeWindow();
    
function mySizeWindow(){
    
    let window_w = window.innerWidth;
    let window_h = window.innerHeight;
    let header_h = eid_header.offsetHeight;
    let footer_h = eid_footer.offsetHeight;

    let ecl_bl_head = eid_sidebar.querySelector('.bl_head');
    let ecl_side_body = eid_sidebar.querySelector('.side_body');
    let bl_head_h = ecl_bl_head.offsetHeight;
    
    let main_h = 
      window_h //960
    - header_h //42
    - footer_h //46
    ;
    eid_main.style.top = header_h + 'px';
    eid_main.style.height = main_h + 'px';

    
    
    let side_body_h = 
      main_h
    - bl_head_h
    ;    
    ecl_side_body.style.height = side_body_h + 'px';
    //eid_container.style.height = container_h + 'px';
    

} 

window.addEventListener('resize',()=>{
    //console.log('resize - window.innerWidth: '+window.innerWidth);
    mySizeWindow();    
});

</script>

<script src="./js/config_both.js"></script>
<script src="./js/slide_nav.js"></script>
<script src="./js/slide_both.js"></script>

</body>
</html>
