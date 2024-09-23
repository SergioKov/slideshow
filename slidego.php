<!DOCTYPE html>
<html lang="es">
<head>
    <title>Slide Go</title>
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
    echo"<h3>No hay parametros $ _GET</h3>";
}























echo "<hr>";
$conn->close();
?>

<h3>Slide to insert en bd: <span id="sp_id">...</span></h3>

<div style="display:flex;justify-content:space-between;">

    <button id="goPrev" onclick="goToSlide('prev')">Prev</button>
    <button id="goNext" onclick="goToSlide('next')">Next</button>
    
</div>


<script type="text/javascript">

const sp_id = document.getElementById('sp_id');
let slide_number = 0;
let minVal = 1;
let maxVal = 100;

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
