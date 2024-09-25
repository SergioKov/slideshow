const sp_id = document.getElementById('sp_id');
const wr_vista_slides = document.getElementById('wr_vista_slides');
const slideShowElement = wr_vista_slides;// solo un div para la vista

let slide_number = 1;
let minVal = 1;
let maxVal = 12;
let is_started = false;
let is_finished = false;

// makeSlides();
// getSlideActual('slides', 'slide_actual');


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

            if(data.valorCampo.includes('"')){
                data.valorCampo = data.valorCampo.replaceAll('"',''); 
            }

            slide_number = data.valorCampo; 
            sp_id.textContent = slide_number;
            pintBtnActive(slide_number);
            pintSldActive(slide_number);

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
    pintSldActive(slide_number); 
    insertarDatos('slides', 'slide_actual', slide_number);
}

function terminarSlides(){
    slide_number = 'fin';
    pintBtnActive(slide_number); 
    pintSldActive(slide_number); 
    insertarDatos('slides', 'slide_actual', slide_number);
}

function makeSlides(){
    const wr_btns_slides = document.getElementById('wr_btns_slides');
    const wr_lista_slides = document.getElementById('wr_lista_slides');
    const elc_lista_inner = wr_lista_slides.querySelector('.lista_inner');

    let slideData_inicio = obj_temaData.slides.find(v => v.slide_number === 'inicio');
    let slideData_fin = obj_temaData.slides.find(v => v.slide_number === 'fin');

    const btn_inicio = document.createElement('button');
    btn_inicio.id = 'btn_inicio';
    btn_inicio.className = 'btn';
    btn_inicio.dataset.slide_number = 'inicio';
    btn_inicio.textContent = 'Inicio';
    btn_inicio.onclick = (event)=>{
        slide_number = 'inicio';
        sp_id.innerText = slide_number;
        pintBtnActive(slide_number);
        pintSldActive(slide_number);
        insertarDatos('slides', 'slide_actual', slide_number);
    };
    wr_btns_slides.append(btn_inicio);

    const sld_inicio = document.createElement('div');
    sld_inicio.id = 'sld_inicio';
    sld_inicio.className = 'sld';
    sld_inicio.dataset.slide_number = 'inicio';
    sld_inicio.innerHTML = `<div class="sld_inner">${slideData_inicio.content}</div>`;
    sld_inicio.onclick = (event)=>{
        slide_number = 'inicio';
        sp_id.innerText = slide_number;
        pintBtnActive(slide_number);
        pintSldActive(slide_number);
        insertarDatos('slides', 'slide_actual', slide_number);
    };
    elc_lista_inner.append(sld_inicio);

    for (let index = minVal; index <= maxVal; index++) {

        let slideData = obj_temaData.slides.find(v => v.slide_number === index.toString());


        //botón de slide
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.dataset.slide_number = index;
        btn.textContent = index;
        btn.onclick = (event)=>{
            slide_number = index;
            sp_id.innerText = slide_number;
            pintBtnActive(slide_number);
            pintSldActive(slide_number);    
            insertarDatos('slides', 'slide_actual', index);
        };
        wr_btns_slides.append(btn);
        
        //block slide
        const sld = document.createElement('div');
        sld.className = 'sld';
        sld.dataset.slide_number = index;
        sld.innerHTML = `<div class="sld_inner">${slideData.content}</div>`;
        sld.onclick = (event)=>{
            slide_number = index;
            sp_id.innerText = slide_number;
            pintBtnActive(slide_number);
            pintSldActive(slide_number);    
            insertarDatos('slides', 'slide_actual', index);
        };
        elc_lista_inner.append(sld);

    }

    const btn_fin = document.createElement('button');
    btn_fin.id = 'btn_fin';
    btn_fin.className = 'btn';
    btn_fin.dataset.slide_number = 'fin';
    btn_fin.textContent = 'Fin';
    btn_fin.onclick = (event)=>{
        slide_number = 'fin';
        sp_id.innerText = slide_number;
        pintBtnActive(slide_number);
        pintSldActive(slide_number);
        insertarDatos('slides', 'slide_actual', slide_number);
    };
    wr_btns_slides.append(btn_fin); 
    
    const sld_fin = document.createElement('div');
    sld_fin.id = 'sld_fin';
    sld_fin.className = 'sld';
    sld_fin.dataset.slide_number = 'fin';
    sld_fin.innerHTML = `<div class="sld_inner">${slideData_fin.content}</div>`;
    sld_fin.onclick = (event)=>{
        slide_number = 'fin';
        sp_id.innerText = slide_number;
        pintBtnActive(slide_number);
        pintSldActive(slide_number);
        insertarDatos('slides', 'slide_actual', slide_number);
    };
    elc_lista_inner.append(sld_fin);    
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
    pintSldActive(slide_number);

    insertarDatos('slides', 'slide_actual', slide_number);    
    
    console.log(' end === function goToSlide()===');
}
