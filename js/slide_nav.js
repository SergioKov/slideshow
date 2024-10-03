const wr_vista_next = document.getElementById('wr_vista_next');
const slideViewElement = wr_vista_next;// solo un div para la vista

const wr_vista_actual = document.getElementById('wr_vista_actual');
const slideShowElement = wr_vista_actual;// solo un div para la vista

const eid_header = document.getElementById('header'); 
const eid_sel_tema = document.getElementById('sel_tema');

const eid_btn_section = document.getElementById('btn_section'); 
const eid_sidebar = document.getElementById('sidebar'); 
const eid_nextslide = document.getElementById('nextslide');
const eid_main = document.getElementById('main'); 
const eid_main_inner = document.getElementById('main_inner');
const eid_section1 = document.getElementById('section1');
const eid_wr_vista_next = document.getElementById('wr_vista_next');
const eid_section2 = document.getElementById('section2');
const eid_footer = document.getElementById('footer');

const eid_btn_iniciar = document.getElementById('btn_iniciar');
const eid_btn_finalizar = document.getElementById('btn_finalizar');
const eid_btn_fon = document.getElementById('btn_fon');

let slide_number = 1;
let is_fon_shown = 0;//por defecto

let minVal = 1;
let maxVal = 13;
let is_started = false;
let is_finished = false;

let obj_temaData = {};


let id_tema_get = new URL(window.location.href).searchParams.get('id_tema');
//localStorage.setItem('id_tema',id_tema);

if(id_tema_get){
    if(arr_temas.find(v => v.id_tema == id_tema_get)){
        id_tema = id_tema_get;
    }else{
        id_tema = 1;
        alert(`id_tema [${id_tema_get}] no existe en arr_temas. \nPor defecto se muestra el tema 1. \nPuedes seleccionar temas desde la lista.`);
    }
}else{
    id_tema = 1;
}

let url = `./json/tema${id_tema}.json`;

make_options_to_sel_tema();
aaa();

async function aaa(){
    await insertarDatos('slides', 'slide_actual', slide_number, id_tema, is_fon_shown);
    checkTema(id_tema);
    changeTema(id_tema);
    iniciarSlides();
}



//=====================================================================================//
// F U N C T I O N S
//=====================================================================================//

function mySizeWindow(){
    
    //let window_w = window.innerWidth;
    let window_h = window.innerHeight;
    let header_h = eid_header.offsetHeight;
    let footer_h = eid_footer.offsetHeight;

    let ecl_bl_head = eid_sidebar.querySelector('.bl_head');
    let ecl_side_body = eid_sidebar.querySelector('.side_body');
    let ecl_next_body = eid_nextslide.querySelector('.next_body');
    
    let ecl_actual_head = eid_section2.querySelector('.actual_head');
    let ecl_actual_body = eid_section2.querySelector('.actual_body');

    let bl_head_h = ecl_bl_head.offsetHeight;
    let actual_head_h = ecl_actual_head.offsetHeight;
    let wr_vista_next_w = wr_vista_next.offsetWidth;
    let wr_vista_actual_h = wr_vista_actual.offsetHeight;

    let section2_w = eid_section2.offsetWidth;

    let main_inner_padding = 5;//px
    
    let main_h = 
      window_h //960
    - header_h //42
    - footer_h //46
    ;
    eid_main.style.top = header_h + 'px';
    eid_main.style.height = main_h + 'px'; 
    
    let section1_h = main_h - (main_inner_padding * 2);
    eid_section1.style.height = section1_h + 'px'; 

    let section2_h = main_h - (main_inner_padding * 2);
    eid_section2.style.height = section2_h + 'px'; 
    
    let sidebar_h = section1_h;
    eid_sidebar.style.height = sidebar_h + 'px'; 
    eid_nextslide.style.height = sidebar_h + 'px'; 
    
    let side_body_h = 
      sidebar_h
    - bl_head_h
    ;    
    ecl_side_body.style.height = side_body_h + 'px';
    
    let next_body_h = side_body_h;
    ecl_next_body.style.height = next_body_h + 'px';

    let vista_slide_next_h = wr_vista_next_w * 0.5625;//alto de NextSlide
    wr_vista_next.style.height = vista_slide_next_h + 'px';

    //console.log(' section2_h: ', section2_h);
    //console.log(' section2_w: ', section2_w);
    
    let actual_body_h = 
      section2_h 
    - actual_head_h
    ;
    let vista_actual_max_h = actual_body_h;
    //console.log(' vista_actual_max_h: ', vista_actual_max_h);

    let vista_slide_actual_w = actual_body_h / 0.5625;//ancho de Actual Slide
    let vista_slide_actual_h = vista_actual_max_h;
    wr_vista_actual.style.width = vista_slide_actual_w + 'px';
    wr_vista_actual.style.height = vista_slide_actual_h + 'px';

    //console.log(' fin ---: ');
} 

window.addEventListener('load',()=>{
    //console.log('resize - window.innerWidth: '+window.innerWidth);
    mySizeWindow();    
});
window.addEventListener('resize',()=>{
    //console.log('resize - window.innerWidth: '+window.innerWidth);
    mySizeWindow();
});

eid_btn_iniciar.addEventListener('click',()=>{
    iniciarSlides();
});

eid_btn_finalizar.addEventListener('click',()=>{
    finalizarSlides();
});

function make_options_to_sel_tema(){
    eid_sel_tema.innerHTML = ''; 
    
    arr_temas.forEach(el => {
        //console.log(el);

        const opt = document.createElement('option');
        opt.value = el.id_tema;
        opt.innerHTML = `${el.id_tema}. &nbsp; ${el.titulo}`;
        eid_sel_tema.append(opt);
    });
}

function toggleSections(){
    // Verificar si la primera sección está visible
    if (eid_section1.style.display !== 'none') {
        eid_section1.style.display = 'none';  // Ocultar la primera sección
        eid_section2.style.display = 'block'; // Mostrar la segunda sección
        eid_btn_section.textContent = 'Show Section 1';//next action
    } else {
        eid_section1.style.display = 'block'; // Mostrar la primera sección
        eid_section2.style.display = 'none';  // Ocultar la segunda sección
        eid_btn_section.textContent = 'Show Section 2';//next action
    }
    pintBtnActive(slide_number);
    pintSldActive(slide_number);
    mySizeWindow();
}

async function fetchDataToJson(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function insertarDatos(tabla, campo, arr, id_tema = null, is_fon_shown = null) {
    //console.log('=== function insertarDatos(tabla, campo, arr) ===');

    if(id_tema == null) id_tema = 1;
    //console.log('id_tema: ', id_tema);

    if(is_fon_shown == null) is_fon_shown = 0;
    //console.log('is_fon_shown: ', is_fon_shown);

    try {

        if(tabla == '' || campo == '' || typeof arr === 'undefined'){
            alert(obj_lang.d251);//'No hay todos los parametros necesarios.'
            return;
        }

        const datos = {
            id_tema: id_tema,
            is_fon_shown: is_fon_shown,
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
        //const data = await response.text();//test...
        //console.log(data);

        if(data.success){
            let text_show = data.mensaje;
            //console.log(text_show + ` tabla: ${tabla}`);

            if(obj_temaData.id_tema !== id_tema){
                aaa();
                async function aaa(){
                    let url = `./json/tema${id_tema}.json`;
                    
                    //console.log('antes await make_obj_temaData(url)');
                    obj_temaData = await make_obj_temaData(url);
                    //console.log('despues await make_obj_temaData(url)');

                    if(Object.keys(obj_temaData).length > 0){
                        pintSlideNext(arr);
                        pintSlideActive(arr);
                    }
                }
            }else{
                if(Object.keys(obj_temaData).length > 0){
                    pintSlideNext(arr);
                    pintSlideActive(arr);
                }
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
    //console.log('=== function getSlideActual(tabla, campo) ===');

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
        //console.log(data);  
        
        if(data.success){
            //console.log('success is true');

            slide_number = data.valorCampo; 
            is_fon_shown = Number(data.valorIsFonShown);

            pintBtnActive(slide_number);
            pintSldActive(slide_number);

            setTimeout(()=>{
                if(Object.keys(obj_temaData).length > 0){
                    pintSlideNext(data.valorCampo);
                    pintSlideActive(data.valorCampo);
                }
            },2000);

        }else{
            //console.log('success is false');
        }

    } catch (error) {
        console.error('Error en getSlideActual(): error.message: ', error.message);
    }
}

async function iniciarSlides(){
    slide_number = minVal;
    pintBtnActive(slide_number); 
    pintSldActive(slide_number); 
    pintSlideNext(slide_number); 
    pintSlideActive(slide_number); 
    
    is_fon_shown = 0;//ya que estoy pasando al inicio slide quito fon
    checkBtnFon();
    await insertarDatos('slides', 'slide_actual', slide_number, id_tema, is_fon_shown);
}

async function finalizarSlides(){
    slide_number = maxVal;
    pintBtnActive(slide_number); 
    pintSldActive(slide_number);
    pintSlideNext(slide_number); 
    pintSlideActive(slide_number);

    is_fon_shown = 0;//ya que estoy pasando al final slide quito fon
    checkBtnFon();

    await insertarDatos('slides', 'slide_actual', slide_number, id_tema, is_fon_shown);
}

function makeSlides(){
    const wr_btns_slides = document.getElementById('wr_btns_slides');
    const wr_lista_slides = document.getElementById('wr_lista_slides');
    const ecl_side_body = document.querySelector('.side_body');
    const ecl_lista_inner = document.querySelector('.lista_inner');

    wr_btns_slides.innerHTML = '';//reset
    ecl_lista_inner.innerHTML = '';//reset

    for (let index = minVal; index <= maxVal; index++) {

        let slideData = obj_temaData.slides.find(v => v.slide_number === index.toString());

        //botón de slide
        const btn = document.createElement('button');
        btn.className = 'btn btn_round';
        btn.textContent = index;
        btn.dataset.slide_number = index;
        btn.onclick = (event)=>{
            slide_number = index;
            pintBtnActive(slide_number);
            pintSldActive(slide_number);
            pintSlideNext(slide_number);    
            pintSlideActive(slide_number);

            is_fon_shown = 0;//ya que estoy pasando al next/prev slide quito fon
            checkBtnFon();
           
            insertarDatos('slides', 'slide_actual', index, id_tema, is_fon_shown);
        };
        wr_btns_slides.append(btn);
        
        //block slide
        const sld = document.createElement('div');
        sld.className = 'sld';
        sld.dataset.slide_number = index;
        let url = `./temas/tema${id_tema}/${slideData.bg}`;
        sld.style.backgroundImage = `url(${url})`;
        sld.style.backgroundSize = 'contain';    
        //sld.innerHTML = `<div class="sld_inner">${slideData.content}</div>`;
        sld.onclick = (event)=>{
            slide_number = index;
            pintBtnActive(slide_number);
            pintSldActive(slide_number);
            pintSlideNext(slide_number);
            pintSlideActive(slide_number); 

            is_fon_shown = 0;//ya que estoy pasando al next/prev slide quito fon
            checkBtnFon();

            insertarDatos('slides', 'slide_actual', index, id_tema, is_fon_shown);
        };
        ecl_lista_inner.append(sld);
    }
}

function resetBtnActive(){
    const btnsAll = document.querySelectorAll('#wr_btns_slides .btn');
    btnsAll.forEach(el=>{
        el.classList.remove('btn_active');
    });
}

function resetSldActive(){
    const btnsAll = document.querySelectorAll('.sld');
    btnsAll.forEach(el=>{
        el.classList.remove('sld_active');
    });
}

function resetSlideActual(){
    slide_number = minVal;
    insertarDatos('slides', 'slide_actual', slide_number, id_tema);    
}

function pintBtnActive(slide_number){
    resetBtnActive();
    const btn_active = document.querySelector('button[data-slide_number="' + slide_number + '"]');
    if(btn_active !== null){
        btn_active.classList.add('btn_active');
        setTimeout(()=>{
            btn_active.scrollIntoView({
                behavior: "smooth",  // Animación suave al desplazar
                block: "center",     // Alinear el elemento en el centro verticalmente
                inline: "center"     // Alinear el elemento en el centro horizontalmente
            });
        },1000);
    }
}

function pintSldActive(slide_number){
    resetSldActive();
    const sld_active = document.querySelector('div.sld[data-slide_number="' + slide_number + '"]');

    if(sld_active !== null){
        sld_active.classList.add('sld_active');
        setTimeout(()=>{
            sld_active.scrollIntoView({
                behavior: "smooth",  // Animación suave al desplazar
                block: "center",     // Alinear el elemento en el centro verticalmente
                inline: "center"     // Alinear el elemento en el centro horizontalmente
            });
        },100);
    }
}

function pintSlideNext(slide_number = null){
    //console.log('=== function pintSlideNext() ===');

    if(!slide_number) return;

    if(!isNaN(slide_number)) {
        slide_number = slide_number.toString();
    }

    //si existe este slide_number
    if(slide_number >= minVal && slide_number <= maxVal){
        if(Object.keys(obj_temaData).length > 0){
            let slideData = obj_temaData.slides.find(v => v.slide_number === slide_number);
    
            if(typeof slideData !== 'undefined'){
                //console.log(slideData);
                let url = `./temas/tema${id_tema}/${slideData.bg}`;    
                wr_vista_next.style.backgroundImage = `url(${url})`;
    
            }else{
                //console.log('contenido no está definido');
            }        
        }
    }else{
        //no existe este slide_number. Muestro bg negro
        wr_vista_next.style.background = 'black';
        wr_vista_next.innerHTML = '';
        //console.log('no existe este slide_number. Muestro bg negro');
    }
}

async function goToSlide(dir = null){
    //console.log(' === function goToSlide()===');
    
    if(dir == null) return;    

    if(dir == 'prev'){       
        slide_number--;
        //console.log('prev. slide_number', slide_number);        
    }
    
    if(dir == 'next'){
        slide_number++;
        //console.log('next. slide_number', slide_number);
    }

    slide_number = (slide_number < minVal) ? minVal : slide_number ;
    slide_number = (slide_number > maxVal) ? maxVal : slide_number ;  

    pintBtnActive(slide_number);
    pintSldActive(slide_number);
    pintSlideNext(slide_number);
    pintSlideActive(slide_number);

    is_fon_shown = 0;//ya que estoy pasando al next/prev slide quito fon
    checkBtnFon();
    await insertarDatos('slides', 'slide_actual', slide_number, id_tema, is_fon_shown);
    
    //console.log(' end === function goToSlide()===');
}


function checkTema(id_tema){
    const eid_sel_tema = document.getElementById('sel_tema');
    eid_sel_tema.querySelectorAll('option').forEach(opt=>{
        opt.removeAttribute('selected');
    });
    eid_sel_tema.querySelector(`option[value="${id_tema}"]`).selected = true;
    eid_sel_tema.querySelector(`option[value="${id_tema}"]`).setAttribute('selected',true);
}



async function changeTema(id_tema_param) {
    //console.log('=== function changeTema(id_tema) ==='); 
    //console.log('id_tema_param: ',id_tema_param);

    id_tema = id_tema_param;
    //console.log('id_tema: ',id_tema);

    if(arr_temas.find(v => v.id_tema == id_tema)){//si uso '==' no hace falta Number(id_tema)

        aaa();
        async function aaa(){

            let url = `./json/tema${id_tema}.json`;
            obj_temaData = await fetchDataToJson(url);
    
            let url_href = new URL(window.location.href);
            url_href.searchParams.set('id_tema',id_tema);
            let params_new = '?';
            url_href.searchParams.forEach((value,key)=>{ 
                //console.log(`${key}: ${value}`);
                params_new += `&${key}=${value}`;
            });
            //window.location.origin => 'https://bibleqt.es'
            //window.location.pathname => '/'
            let new_url_ref = window.location.origin + window.location.pathname + params_new;
            //console.log("[changeLang()] - URL nueva completa con ref. new_url_ref: ", new_url_ref);
    
            window.history.pushState(null, "Título de la página", new_url_ref);

            maxVal = obj_temaData.slides.length;
            //console.log('maxVal: ',maxVal);
            
            checkTema(id_tema);
            makeSlides();
            iniciarSlides();
            setTimeout(()=>{
                mySizeWindow();
            },100);

        }

        
    }else{
        console.error(`No existe este id_tema '${id_tema}'`);
        changeTema(arr_temas[0].id_tema);//'1' por defecto
    }
   
    //if(hay_sesion && obj_ajustes_is_loaded){
    //    guardarEnBd('ajustes','obj_ajustes',obj_ajustes);
    //}
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

function toggleFullscreen() {
    const element = document.body;
    const eid_btn_fullscreen = document.getElementById('btn_fullscreen');

    if (!document.fullscreenElement) {
        // Entrar en pantalla completa
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { // Safari
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
            element.msRequestFullscreen();
        }
        eid_btn_fullscreen.querySelector('img').src = './images/fullscreen_adentro.png';

    } else {
        // Salir del modo pantalla completa
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
        eid_btn_fullscreen.querySelector('img').src = './images/fullscreen.png';

    }
}

// Detectar la tecla de flecha izquierda
document.addEventListener('keydown', (event)=> {
    if (event.key === "ArrowLeft") {  // Verifica si la tecla presionada es 'ArrowLeft'
        goToSlide('prev');
    }
    if (event.key === "ArrowRight") {  // Verifica si la tecla presionada es 'ArrowRight'
        goToSlide('next');
    }

    if (event.key === "ArrowUp") {  // Verifica si la tecla presionada es 'ArrowUp'
        iniciarSlides();
    }
    if (event.key === "ArrowDown") {  // Verifica si la tecla presionada es 'ArrowDown'
        finalizarSlides();
    }
});

async function toggleFon(){
    //console.log('=== function toggleFon() ===');
    //console.log('antes is_fon_shown: ',is_fon_shown);    
    
    if(is_fon_shown == 0){
        is_fon_shown = 1;
    }else{
        is_fon_shown = 0;
    }
    checkBtnFon();
    //console.log('new is_fon_shown: ',is_fon_shown);

    await insertarDatos('slides', 'slide_actual', slide_number, id_tema, is_fon_shown);

}

function checkBtnFon(){
    if(is_fon_shown == 0){
        eid_btn_fon.textContent = 'Show Fon';//futura acción
        eid_btn_fon.classList.add('fon_purple');
        eid_btn_fon.classList.remove('fon_red');
    }else{
        eid_btn_fon.textContent = 'Show Slide';//futura acción
        eid_btn_fon.classList.add('fon_red');
        eid_btn_fon.classList.remove('fon_purple');
    }
}