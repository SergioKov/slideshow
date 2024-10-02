const contenedor_show = document.getElementById('contenedor_show');
const slideShowElement = contenedor_show;//toda la página

let delay_fn = 1000;
let slide_number = 0;//por defecto

let id_tema = '1';//por defecto
let url = `./json/tema${id_tema}.json`;

let obj_temaData = {};


lanzarIntentos('slides', 'slide_actual');

async function lanzarIntentos(tabla, campo){
   console.log('=== function lanzarIntentos() === lanzo intentos...');
   setTimeout(()=>{
        console.log('setTimeout() --- llamo obtenerDatosDeBD(tabla, campo)...');
        aaa();
        async function aaa(){
            await obtenerDatosDeBD(tabla, campo); 
            //console.log('after obtenerDatosDeBD --- id_tema: ', id_tema);       
        }
    },delay_fn);
}

async function fetchDataToJson(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
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
        //const data = await response.text();//test
        //console.log(`Datos de la tabla ${tabla} y campo ${campo}: `);
        console.log('data de bd: ',data); 
        
        id_tema = data.valorIdTema;
        
        if(data.success){
            //console.log('success is true');

            if(data.valorIdTema !== id_tema){
                id_tema = data.valorIdTema;
                url = `./json/tema${data.valorIdTema}.json`;
                
                aaa();
                async function aaa(){
                    console.log('antes');
                    await crear_obj_temaData(url);
                    console.log('despues');

                    if(data.valorCampo !== slide_number){//si es distinto, lo pinto
                        console.log('[if] --- SE HA CAMBIADO SLIDE ---');
                        
                        slide_number = data.valorCampo;
                    }
    
                    pintSlideActive(data.valorCampo);
                }

            }else{

                if(data.valorCampo !== slide_number){//si es distinto, lo pinto
                    console.log('[if] --- SE HA CAMBIADO SLIDE ---');
                    
                    slide_number = data.valorCampo;
                }

                pintSlideActive(data.valorCampo);
            }

            console.log('desde obtenerDatosDeBD() - llamo lanzarIntentos()');
            lanzarIntentos('slides', 'slide_actual'); 

        }else{
            console.log('success is false');
        }

    } catch (error) {
        console.error('Error en obtenerDatosDeBD(): error.message: ', error.message);
    }
}


