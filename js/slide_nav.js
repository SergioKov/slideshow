const sp_id = document.getElementById('sp_id');
const wr_vista_next = document.getElementById('wr_vista_next');
const wr_vista_slides = document.getElementById('wr_vista_slides');
const slideShowElement = wr_vista_slides;// solo un div para la vista

let slide_number = 1;
let minVal = 0;
let maxVal = 13;
let is_started = false;
let is_finished = false;


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
    slide_number = minVal;
    pintBtnActive(slide_number); 
    pintSldActive(slide_number); 
    pintSlideNext((Number(slide_number) + 1).toString()); 
    insertarDatos('slides', 'slide_actual', slide_number);
}

function finalizarSlides(){
    slide_number = maxVal;
    pintBtnActive(slide_number); 
    pintSldActive(slide_number);
    pintSlideNext((Number(slide_number) + 1).toString()); 
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
    const btnsAll = document.querySelectorAll('#wr_lista_slides .lista_inner .sld');
    btnsAll.forEach(el=>{
        el.classList.remove('sld_active');
    });
}

function resetSlideActual(){
    slide_number = minVal;
    sp_id.innerText = slide_number;
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
    
                wr_vista_next.querySelector('.vista_inner').innerHTML = `                
                    ${slideData.content}
                `;
            }else{
                console.log('contenido no está definido');
            }        
        }
    }else{
        //no existe este slide_number. Muestro bg negro
        wr_vista_next.style.background = 'black';
        wr_vista_next.querySelector('.vista_inner').innerHTML = '';
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


