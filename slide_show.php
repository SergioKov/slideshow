<!DOCTYPE html>
<html lang="es">
<head>
    <title>Slide show</title>
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

<h3>Slide actual: <span id="sp_id">...</span></h3>

<div id="contenedor">...</div>



<script type="text/javascript">

const sp_id = document.getElementById('sp_id');
const eid_contenedor = document.getElementById('contenedor');

let delay_fn = 1000;
let slide_shown = sp_id.innerText;
let temaData = {};


let old_temaData = {
    "titulo": "de_bd_un_tema",
    "slides": [
        {
            "slide_number": "1",
            "content": "1) <b>dfsdfgh</b>es <h1>sdsdfhdh</h1> contenido de slide aki.. djdfjd fjdfghj dfgj j111111111111111111111"
        },
        {
            "slide_number": "2",
            "content": "2) es contenido de slide aki.. dfjfgjdfgj dfgj 2222222222222222222222"
        },
        {
            "slide_number": "3",
            "content": "3) es contenido de slide aki.. dfgj dfgjdfgj  333333333333333333"
        },
        {
            "slide_number": "4",
            "content": "4) es contenido de slide aki.. dfgj dfgjdfgj 444444444444444"
        },
        {
            "slide_number": "5",
            "content": "5) es contenido de slide aki.. dfgj dfgjdfgj 555555555555555"
        },
    ]
}

lanzarIntentos('slides', 'slide_actual');

async function lanzarIntentos(tabla, campo){
   console.log('=== function lanzarIntentos() === lanzo intentos...');
   setTimeout(()=>{
        console.log('setTimeout() --- llamo obtenerDatosDeBD(tabla, campo)...');
        aaa();
        async function aaa(){
            await obtenerDatosDeBD(tabla, campo);        
        }
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
        console.log('data de bd: ',data);  
        
        if(data.success){
            console.log('success is true');

            switch (tabla) {
                case 'slides':
                    console.log('tabla es: SLIDES');
                    if(data.valorCampo !== slide_shown){//si es distinto, lo pinto
                        console.log('[if] --- SE HA CAMBIADO SLIDE ---');
                        
                        slide_shown = data.valorCampo;
                        sp_id.textContent = data.valorCampo;

                        //saco objeto temaData de bd
                        bbb()
                        async function bbb(){
                            console.log('start [bbb()]');
                            
                            // await obtenerSlideFromTema('temas', 'contenido');
                            await obtenerDatosDeBD('temas', 'contenido');
                            console.log('end [bbb()]');
                        }
                    }
                    console.log('desde obtenerDatosDeBD() - llamo lanzarIntentos()');
                    lanzarIntentos('slides', 'slide_actual');                    
                    break;
            
                case 'temas':
                    console.log('tabla es: --- TEMAS ---');
                    if(!['','[]'].includes(data.valorCampo)){//si es distinto, lo pinto
                        console.log(' --- TEMAS ---');
                        
                        temaData = JSON.parse(data.valorCampo);
                        console.log('temaData abajo:');
                        console.log(temaData);

                        if(temaData){
                            let contenido = temaData.slides.find(v => v.slide_number === slide_shown);

                            if(Object.keys(contenido).length !== 0){
                                console.log(contenido.content);
                                
                                eid_contenedor.innerHTML = `
                                    <h1>TEMA: ${temaData.titulo}</h1>
                                    ${contenido.content}
                                `;
                            }else{
                                console.log('contenido no está definido');
                            }
                            
                        }

                    }
                    console.log('desde obtenerDatosDeBD() - llamo lanzarIntentos()');
                    lanzarIntentos('slides', 'slide_actual');                    
                    break;
            
                default:
                    break;
            }




        }else{
            console.log('success is false');
            sp_id.textContent = '---';
        }

    } catch (error) {
        console.error('Error en obtenerDatosDeBD(): error.message: ', error.message);
    }
}



async function old_obtenerSlideFromTema(tabla, campo){
    console.log('=== function obtenerSlideFromTema(tabla, campo) ===');

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
        
        if(data){
            console.log('hay data');

            temaData = JSON.parse(data.valorCampo);
            console.log('temaData abajo:');
            console.log(temaData);

            if(temaData){
                let contenido = temaData.slides.find(v => v.slide_number === slide_shown);

                if(Object.keys(contenido).length !== 0){
                    console.log(contenido.content);
                    
                    eid_contenedor.innerHTML = `
                        <h1>TEMA: ${temaData.titulo}</h1>
                        ${contenido.content}
                    `;
                }else{
                    console.log('contenido no está definido');
                }
                
            }
            
        }else{
            console.log('success is false');
            sp_id.textContent = '---';
        }

    } catch (error) {
        console.error('Error en obtenerSlideFromTema(): error.message: ', error.message);
    }
}


</script>

</body>
</html>
