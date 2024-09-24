const sp_id = document.getElementById('sp_id');
const eid_contenedor = document.getElementById('contenedor');

let delay_fn = 1000;
let slide_shown = sp_id.innerText;
let obj_temaData = {};

// let url = './json/tema1.json';
let url = './json/tema2.json';
//let url = './json/tema4.json';

crear_obj_temaData(url);//url => 'la/ruta/al/file.json'
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

async function crear_obj_temaData(url){
   console.log('=== async function crear_temaData() === ');

   obj_temaData = await make_obj_temaData(url);
    //console.log(obj_lang);

    document.body.classList.add('body_bg');
    document.body.style.backgroundImage = `url(${obj_temaData.tema_bg})`;
}

async function make_obj_temaData(url){
    console.log('=== function make_obj_temaData() ===');
    
    try {          
        
        let obj_temaData_f = await fetchDataToJson(url);
        console.log('obj_temaData_f:');

        return obj_temaData_f;

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('make_obj_temaData. error: ',error);
    }    
}

async function fetchDataToJson(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
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

function pintSlide(slide_number = null){
    console.log('=== function pintSlide() ===');
    
    if(!slide_number) return;

    slide_number = (!['"inicio"','"fin"'].includes(slide_number)) ? slide_number.toString() : slide_number ; 

    if(obj_temaData){
        let slideData = obj_temaData.slides.find(v => v.slide_number === slide_number);

        if(Object.keys(slideData).length !== 0){
            console.log(slideData);

            document.body.style.backgroundImage = `url(${slideData.bg})`;
            
            //eid_contenedor.innerHTML = `
            //    ${obj_temaData.titulo}
            //    ${slideData.content}
            //`;

        }else{
            console.log('contenido no está definido');
        }        
    }
}
