<!DOCTYPE html>
<html lang="es">
<head>
    <title>Slide Nav</title>
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

<h3>Slide to insert en bd: <span id="sp_id">...</span></h3>

<div id="wr_init">
    <button id="btn_iniciar" class="btn" onclick="resetSlideActual()">Iniciar</button>
    <button id="btn_terminar" class="btn" onclick="finishSlideShow()">Finalizar</button> 
</div>

<div id="wr_nav">
    <button id="goPrev" class="btn" onclick="goToSlide('prev')">Prev</button>
    <button id="goNext" class="btn" onclick="goToSlide('next')">Next</button>  
</div>

<div id="wr_slides">
    
</div>


<script type="text/javascript">

const sp_id = document.getElementById('sp_id');

let slide_number = 1;
let minVal = 1;
let maxVal = 5;
let is_started = false;
let is_finished = false;

makeSlides();

function makeSlides(){
    const wr_slides = document.getElementById('wr_slides');

    for (let index = minVal; index <= maxVal; index++) {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.dataset.slide_number = index;
        btn.textContent = index;
        btn.onclick = (event)=>{
            slide_number = index;
            sp_id.innerText = slide_number;
            insertarDatos('slides', 'slide_actual', index);
            console.log(event);
            let este_btn = event.currentTarget;
            resetBtnActive();
            este_btn.classList.add('btn_active');
        };
        wr_slides.append(btn);

    }
}

function resetBtnActive(){
    const btnsAll = document.querySelectorAll('#wr_slides .btn');
    btnsAll.forEach(el=>{
        el.classList.remove('btn_active');
    });
}

getSlideActual('slides', 'slide_actual');

function resetSlideActual(){
    slide_number = minVal;
    sp_id.innerText = slide_number;
    insertarDatos('slides', 'slide_actual', slide_number);    
}

async function getSlideActual(tabla, campo){
    //console.log('=== function obtenerDatosDeBD(tabla, campo) ===');

    let slide_actual = sp_id;

    try {
               
        const response = await fetch('./obtener_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                tabla: tabla,
                campo: campo
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        // const data = await response.text();//test
        //console.log(`Datos de la tabla ${tabla} y campo ${campo}: `);
        console.log(data);  
        
        if(data.success){
            console.log('success is true');
            slide_number = data.valorCampo; 
            sp_id.textContent = slide_number;
            document.querySelector(`button[data-slide_number="${slide_number}"]`).classList.add('btn_active');
        }else{
            console.log('success is false');
            sp_id.textContent = '---';
        }

    } catch (error) {
        console.error('Error en obtenerDatosDeBD(): error.message: ', error.message);
    }
}

function goToSlide(dir = null){
    console.log(' === function goToSlide()===');
    
    if(dir == null) return;    

    if(dir == 'prev'){
        slide_number--;
        console.log('prev. slide_number', slide_number);        
    }
    
    if(dir == 'next'){
        slide_number++;
        console.log('next. slide_number', slide_number);
    }

    slide_number = (slide_number < minVal) ? minVal : slide_number ;
    slide_number = (slide_number > maxVal) ? maxVal : slide_number ;  

    sp_id.innerText = slide_number;
    resetBtnActive();
    document.querySelector(`button[data-slide_number="${slide_number}"]`).classList.add('btn_active');

    insertarDatos('slides', 'slide_actual', slide_number);    
    
    console.log(' end === function goToSlide()===');
}



async function insertarDatos(tabla, campo, arr) {
    //console.log('=== function insertarDatos(tabla, campo, arr) ===');

    try {

        if(tabla == '' || campo == '' || typeof arr === 'undefined'){
            alert(obj_lang.d251);//'No hay todos los parametros necesarios.'
            return;
        }

        const datos = {
            tabla: tabla,
            campo: campo,
            arr: arr
        };
        //console.log(datos);

        const response = await fetch('./insertar_datos.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //console.log(data);

        let debuguear;
        debuguear = true;//poner 'true' para debuguear //'false' o comentar en prod

        if(debuguear){
            if(data.success){
                let text_show = data.mensaje;
                console.log(text_show + ` tabla: ${tabla}`);
            }else{
                let text_show = data.mensaje;
                console.error(text_show + ` tabla: ${tabla}`);
                if(data.conn_error){
                    let text_show2 = `${obj_lang[data.dic_code]} ${data.conn_error}`;
                    console.error(text_show2);
                }
            }    
        }        

    } catch (error) {
        console.error('Error en la función insertarDatos: ', error);
    }
}



</script>

</body>
</html>
