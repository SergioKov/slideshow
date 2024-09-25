const sp_id = document.getElementById('sp_id');
const body_contenedor = document.getElementById('body_contenedor');
const slideShowElement = body_contenedor;//toda la página

let delay_fn = 1000;
let slide_shown = sp_id.innerText;


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

            if(data.valorCampo.includes('"')){
                data.valorCampo = data.valorCampo.replaceAll('"',''); 
            }

            if(data.valorCampo !== slide_shown){//si es distinto, lo pinto
                console.log('[if] --- SE HA CAMBIADO SLIDE ---');
                
                slide_shown = data.valorCampo;
                sp_id.textContent = data.valorCampo;

                pintSlide(data.valorCampo);
            }

            console.log('desde obtenerDatosDeBD() - llamo lanzarIntentos()');
            lanzarIntentos('slides', 'slide_actual'); 

        }else{
            console.log('success is false');
            sp_id.textContent = '---';
        }

    } catch (error) {
        console.error('Error en obtenerDatosDeBD(): error.message: ', error.message);
    }
}


