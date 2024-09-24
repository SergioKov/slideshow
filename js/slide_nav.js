const sp_id = document.getElementById('sp_id');
const wr_vista_slides = document.getElementById('wr_vista_slides');

let slide_number = 1;
let minVal = 1;
let maxVal = 12;
let is_started = false;
let is_finished = false;
let obj_temaData = {};

// let url = './json/tema1.json';
let url = './json/tema2.json';

crear_obj_temaData(url);//url => 'la/ruta/al/file.json'
makeSlides();
getSlideActual('slides', 'slide_actual');

async function crear_obj_temaData(url){
   console.log('=== async function crear_temaData() === ');

   obj_temaData = await make_obj_temaData(url);
    //console.log(obj_lang);

    wr_vista_slides.classList.add('body_bg');
    wr_vista_slides.style.backgroundImage = `url(${obj_temaData.tema_bg})`;
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

async function insertarDatos(tabla, campo, arr) {
    console.log('=== function insertarDatos(tabla, campo, arr) ===');

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

        if(data.success){
            let text_show = data.mensaje;
            console.log(text_show + ` tabla: ${tabla}`);

            if(Object.keys(obj_temaData).length > 0){
                pintSlide(arr);
            }

        }else{
            let text_show = data.mensaje;
            console.error(text_show + ` tabla: ${tabla}`);
        }

    } catch (error) {
        console.error('Error en la función insertarDatos: ', error);
    }
}

async function getSlideActual(tabla, campo){
    console.log('=== function getSlideActual(tabla, campo) ===');

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
            if(data.valorCampo.includes('"')){
                data.valorCampo = data.valorCampo.replaceAll('"',''); 
            }
            slide_number = data.valorCampo; 
            sp_id.textContent = slide_number;
            pintBtnActive(slide_number);

            setTimeout(()=>{
                if(Object.keys(obj_temaData).length > 0){
                    pintSlide(data.valorCampo);
                }
            },2000);

        }else{
            console.log('success is false');
            sp_id.textContent = '---';
        }

    } catch (error) {
        console.error('Error en getSlideActual(): error.message: ', error.message);
    }
}

function iniciarSlides(){
    slide_number = 'inicio';
    pintBtnActive(slide_number); 
    insertarDatos('slides', 'slide_actual', slide_number);
}

function terminarSlides(){
    slide_number = 'fin';
    pintBtnActive(slide_number); 
    insertarDatos('slides', 'slide_actual', slide_number);
}

function makeSlides(){
    const wr_slides = document.getElementById('wr_slides');

    const btn_inicio = document.createElement('button');
    btn_inicio.id = 'btn_inicio';
    btn_inicio.className = 'btn';
    btn_inicio.dataset.slide_number = 'inicio';
    btn_inicio.textContent = 'Inicio';
    btn_inicio.onclick = (event)=>{
        slide_number = 'inicio';
        sp_id.innerText = slide_number;
        insertarDatos('slides', 'slide_actual', slide_number);
        console.log(event);
        let este_btn = event.currentTarget;
        resetBtnActive();
        este_btn.classList.add('btn_active');
    };
    wr_slides.append(btn_inicio);

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

    const btn_fin = document.createElement('button');
    btn_fin.id = 'btn_fin';
    btn_fin.className = 'btn';
    btn_fin.dataset.slide_number = 'fin';
    btn_fin.textContent = 'Fin';
    btn_fin.onclick = (event)=>{
        slide_number = 'fin';
        sp_id.innerText = slide_number;
        insertarDatos('slides', 'slide_actual', slide_number);
        console.log(event);
        let este_btn = event.currentTarget;
        resetBtnActive();
        este_btn.classList.add('btn_active');
    };
    wr_slides.append(btn_fin);    
}

function resetBtnActive(){
    const btnsAll = document.querySelectorAll('#wr_slides .btn');
    btnsAll.forEach(el=>{
        el.classList.remove('btn_active');
    });
}

function resetSlideActual(){
    slide_number = minVal;
    sp_id.innerText = slide_number;
    insertarDatos('slides', 'slide_actual', slide_number);    
}

function pintSlide(slide_number = null){
    console.log('=== function pintSlide() ===');
    
    if(!slide_number) return;

    slide_number = (!['"inicio"','"fin"'].includes(slide_number)) ? slide_number.toString() : slide_number ; 

    if(obj_temaData){
        let slideData = obj_temaData.slides.find(v => v.slide_number === slide_number);

        if(Object.keys(slideData).length !== 0){
            console.log(slideData);

            wr_vista_slides.style.backgroundImage = `url(${slideData.bg})`;
            
            //wr_vista_slides.querySelector('.vs_inner').innerHTML = `
            //    ${obj_temaData.titulo}
            //    ${slideData.content}
            //`;
        }else{
            console.log('contenido no está definido');
        }        
    }
}

function pintBtnActive(slide_number){
    resetBtnActive();
     if(true /*slide_number >= minVal && slide_number <= maxVal*/){
        document.querySelector('button[data-slide_number="' + slide_number + '"]').classList.add('btn_active');
    }
}

function goToSlide(dir = null){
    console.log(' === function goToSlide()===');
    
    if(dir == null) return;    

    if(dir == 'prev'){
        switch (slide_number) {
            case 'inicio':
                slide_number = 'inicio';
                break;

            case minVal:
                slide_number = 'inicio';
                break;

            case 'fin':
                slide_number = maxVal;
                break;
        
            default:
                slide_number--;
                break;
        }        
        console.log('prev. slide_number', slide_number);        
    }
    
    if(dir == 'next'){
        switch (slide_number) {       
            case 'inicio':
                slide_number = 1;
                break;

            case maxVal:
                slide_number = 'fin';
                break;

            case 'fin':
                slide_number = 'fin';
                break;
        
            default:
                slide_number++;
                break;
        }
        console.log('next. slide_number', slide_number);
    }

    slide_number = (slide_number < minVal) ? minVal : slide_number ;
    slide_number = (slide_number > maxVal) ? maxVal : slide_number ;  

    sp_id.innerText = slide_number;
    pintBtnActive(slide_number);

    insertarDatos('slides', 'slide_actual', slide_number);    
    
    console.log(' end === function goToSlide()===');
}
