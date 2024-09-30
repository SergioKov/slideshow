let id_tema = new URL(window.location.href).searchParams.get('id_tema');
//localStorage.setItem('id_tema',id_tema);

if(id_tema){
    url = `./json/tema${id_tema}.json`;
    //actualizarIdTema();
    insertarDatos('slides', 'slide_actual', 0);
}

const sp_id = document.getElementById('sp_id');
const wr_vista_actual = document.getElementById('wr_vista_actual');
const slideShowElement = wr_vista_actual;// solo un div para la vista

let slide_number = 0;
let minVal = 0;
let maxVal = 13;
let is_started = false;
let is_finished = false;





const eid_header = document.getElementById('header'); 
const eid_btn_section = document.getElementById('btn_section'); 
const eid_sidebar = document.getElementById('sidebar'); 
const eid_nextslide = document.getElementById('nextslide'); 

const eid_main = document.getElementById('main'); 
const eid_main_inner = document.getElementById('main_inner'); 

const eid_section1 = document.getElementById('section1'); 

const eid_wr_vista_next = document.getElementById('wr_vista_next'); 

const eid_section2 = document.getElementById('section2'); 

const eid_footer = document.getElementById('footer');

    
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

    console.log(' section2_h: ', section2_h);
    console.log(' section2_w: ', section2_w);
    
    let actual_body_h = 
      section2_h 
    - actual_head_h
    ;
    let vista_actual_max_h = actual_body_h;
    console.log(' vista_actual_max_h: ', vista_actual_max_h);

    let vista_slide_actual_w = actual_body_h / 0.5625;//ancho de Actual Slide
    let vista_slide_actual_h = vista_actual_max_h;
    wr_vista_actual.style.width = vista_slide_actual_w + 'px';
    wr_vista_actual.style.height = vista_slide_actual_h + 'px';

    console.log(' fin ---: ');
} 

window.addEventListener('load',()=>{
    //console.log('resize - window.innerWidth: '+window.innerWidth);
    mySizeWindow();    
    //insertarDatos('slides', 'slide_actual', slide_number);    
});
window.addEventListener('resize',()=>{
    //console.log('resize - window.innerWidth: '+window.innerWidth);
    mySizeWindow();
});



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
    mySizeWindow();
}


async function insertarDatos(tabla, campo, arr) {
    console.log('=== function insertarDatos(tabla, campo, arr) ===');

    if(id_tema == null) id_tema = 1;
    console.log('id_tema: ', id_tema);

    try {

        if(tabla == '' || campo == '' || typeof arr === 'undefined'){
            alert(obj_lang.d251);//'No hay todos los parametros necesarios.'
            return;
        }

        const datos = {
            id_tema: id_tema,
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
            console.log(text_show + ` tabla: ${tabla}`);

            if(Object.keys(obj_temaData).length > 0){
                pintSlideActive(arr);
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
            //sp_id.textContent = slide_number;
            pintBtnActive(slide_number);
            pintSldActive(slide_number);
            pintSlideNext((Number(slide_number) + 1).toString());

            setTimeout(()=>{
                if(Object.keys(obj_temaData).length > 0){
                    pintSlideActive(data.valorCampo);
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
    slide_number = minVal;
    pintBtnActive(slide_number); 
    pintSldActive(slide_number); 
    pintSlideNext((Number(slide_number) + 1).toString()); 
    pintSlideActive(slide_number); 
    insertarDatos('slides', 'slide_actual', slide_number);
}

function finalizarSlides(){
    slide_number = maxVal;
    pintBtnActive(slide_number); 
    pintSldActive(slide_number);
    pintSlideNext((Number(slide_number) + 1).toString()); 
    pintSlideActive(slide_number);
    insertarDatos('slides', 'slide_actual', slide_number);
}

function makeSlides(){
    const wr_btns_slides = document.getElementById('wr_btns_slides');
    const wr_lista_slides = document.getElementById('wr_lista_slides');
    const ecl_side_body = document.querySelector('.side_body');
    const ecl_lista_inner = document.querySelector('.lista_inner');

    for (let index = minVal; index <= maxVal; index++) {

        let slideData = obj_temaData.slides.find(v => v.slide_number === index.toString());

        //botón de slide
        const btn = document.createElement('button');
        if(index == minVal){
            btn.id = 'btn_inicio';
            btn.className = 'btn btn_ini_fin_sm';
            btn.textContent = 'Inicio';
        }else if(index == maxVal){
            btn.id = 'btn_fin';
            btn.className = 'btn btn_ini_fin_sm';
            btn.textContent = 'Fin';
        }else{
            btn.className = 'btn btn_round';
            btn.textContent = index;
        }
        btn.dataset.slide_number = index;
        btn.onclick = (event)=>{
            slide_number = index;
            sp_id.innerText = slide_number;
            pintBtnActive(slide_number);
            pintSldActive(slide_number);
            pintSlideNext((Number(slide_number) + 1).toString());    
            insertarDatos('slides', 'slide_actual', index);
        };
        wr_btns_slides.append(btn);
        
        //block slide
        const sld = document.createElement('div');
        sld.className = 'sld';
        sld.dataset.slide_number = index;
        sld.style.backgroundImage = `url(${slideData.bg})`;
        sld.style.backgroundSize = 'contain';    
        sld.innerHTML = `<div class="sld_inner">${slideData.content}</div>`;
        sld.onclick = (event)=>{
            slide_number = index;
            sp_id.innerText = slide_number;
            pintBtnActive(slide_number);
            pintSldActive(slide_number);
            pintSlideNext((Number(slide_number) + 1).toString());    
            insertarDatos('slides', 'slide_actual', index);
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
    //sp_id.innerText = slide_number;
    insertarDatos('slides', 'slide_actual', slide_number);    
}

function pintBtnActive(slide_number){
    resetBtnActive();
    let btn_active = document.querySelector('button[data-slide_number="' + slide_number + '"]');
    btn_active.classList.add('btn_active');
}

function pintSldActive(slide_number){
    resetSldActive();
    let sld_active = document.querySelector('div.sld[data-slide_number="' + slide_number + '"]');
    sld_active.classList.add('sld_active');
    sld_active.scrollIntoView({
        behavior: "smooth",  // Animación suave al desplazar
        block: "center",     // Alinear el elemento en el centro verticalmente
        inline: "center"     // Alinear el elemento en el centro horizontalmente
    });
}

function pintSlideNext(slide_number = null){
    console.log('=== function pintSlideNext() ===');

    if(!slide_number) return;

    //si existe este slide_number
    if(slide_number >= minVal && slide_number <= maxVal){
        if(obj_temaData){
            let slideData = obj_temaData.slides.find(v => v.slide_number === slide_number);
    
            if(Object.keys(slideData).length !== 0){
                console.log(slideData);
    
                wr_vista_next.style.backgroundImage = `url(${slideData.bg})`;
                //${obj_temaData.titulo}
    
                wr_vista_next.innerHTML = `                
                    ${slideData.content}
                `;
            }else{
                console.log('contenido no está definido');
            }        
        }
    }else{
        //no existe este slide_number. Muestro bg negro
        wr_vista_next.style.background = 'black';
        wr_vista_next.innerHTML = '';
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
    pintBtnActive(slide_number);
    pintSldActive(slide_number);
    pintSlideNext((Number(slide_number) + 1).toString());

    insertarDatos('slides', 'slide_actual', slide_number);    
    
    console.log(' end === function goToSlide()===');
}


