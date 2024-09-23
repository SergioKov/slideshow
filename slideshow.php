<!DOCTYPE html>
<html lang="es">
<head>
    <title>Slide show</title>
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

<h3>Slide actual: <span id="sp_id">...</span></h3>



<script type="text/javascript">

const sp_id = document.getElementById('sp_id');
let delay_fn = 1000;
let slide_shown = sp_id.innerText;

lanzarIntentos('slides', 'slide_actual');

function lanzarIntentos(tabla, campo){
   console.log('lanzo intentos...');
   setTimeout(()=>{
        console.log('setTimeout() --- llamo obtenerDatosDeBD(tabla, campo)...');
        obtenerDatosDeBD(tabla, campo);        
    },delay_fn);
}

async function obtenerDatosDeBD(tabla, campo){
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
            if(data.valorCampo !== slide_shown){//si es distinto, lo pinto
                slide_shown = data.valorCampo;
                sp_id.textContent = data.valorCampo;
            }
            lanzarIntentos('slides', 'slide_actual');
        }else{
            console.log('success is false');
            sp_id.textContent = '---';
        }


    } catch (error) {
        console.error('Error en obtenerDatosDeBD(): error.message: ', error.message);
    }
}


</script>

</body>
</html>
