const slideViewElement = null;//solo está en slide_nav.php

const contenedor_show = document.getElementById('contenedor_show');
const slideShowElement = contenedor_show;//toda la página


let delay_fn = 1000;
let slide_number = 1;//por defecto
let is_fon_shown = 0;//por defecto

let id_tema = 1;//por defecto
let url = `./json/tema${id_tema}.json`;

let obj_temaData = {};


lanzarIntentos('slides', 'slide_actual');

async function lanzarIntentos(tabla, campo){
   //console.log('=== function lanzarIntentos() === lanzo intentos...');
   setTimeout(()=>{
        //console.log('setTimeout() --- llamo obtenerDatosDeBD(tabla, campo)...');
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
        //console.log('data de bd: ',data); 
                
        if(data.success){
            //console.log('success is true');

            if(data.valorIdTema !== id_tema){
                //console.log('[if] --- SE HA CAMBIADO id_tema ---');
                
                id_tema = data.valorIdTema;
                url = `./json/tema${id_tema}.json`;
                
                aaa();
                async function aaa(){
                    
                    //console.log('antes await make_obj_temaData(url)');
                    obj_temaData = await make_obj_temaData(url);                    
                    //console.log('despues await make_obj_temaData(url)');

                    if(data.valorCampo !== slide_number){//si es distinto, lo pinto
                        //console.log('[if] --- SE HA CAMBIADO SLIDE ---');                        
                        slide_number = data.valorCampo;
                    }else{
                        //console.log('1. slide_number es el mismo. no hago nada...');
                    }
                    pintSlideActive(slide_number);
                }

            }else{
                //console.log('[else] --- NO SE HA CAMBIADO id_tema ---');

                if(data.valorCampo !== slide_number){//si es distinto, lo pinto
                    //console.log('[if] --- SE HA CAMBIADO SLIDE ---');                    
                    slide_number = data.valorCampo;
                }else{
                    //console.log('2. slide_number es el mismo. no hago nada...');
                }
                pintSlideActive(slide_number);
            }

            //if(data.valorIsFonShown == '1'){
            //    is_fon_shown = 1;
            //}else{
            //    is_fon_shown = 0;
            //}

            is_fon_shown = Number(data.valorIsFonShown);

            //console.log('desde obtenerDatosDeBD() - llamo lanzarIntentos()');
            lanzarIntentos('slides', 'slide_actual'); 

        }else{
            console.log('success is false');
        }

    } catch (error) {
        console.error('Error en obtenerDatosDeBD(): error.message: ', error.message);
    }
}


function openFullscreen() {
    const element = document.body;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { // Safari
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    }
}

function isBodyInFullscreen() {
    if (document.fullscreenElement === document.body) {
        console.log("El body está en pantalla completa.");
        return true;
    } else {
        console.log("El body no está en pantalla completa.");
        return false;
    }
}



function toggleFullscreen_show() {
    const element = document.body;
    const eid_btn_fullscreen_show = document.getElementById('btn_fullscreen_show');

    if (!document.fullscreenElement) {
        // Entrar en pantalla completa
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { // Safari
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
            element.msRequestFullscreen();
        }
        eid_btn_fullscreen_show.querySelector('img').src = './images/fullscreen_adentro.png';

    } else {
        // Salir del modo pantalla completa
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
        eid_btn_fullscreen_show.querySelector('img').src = './images/fullscreen.png';

    }
}
