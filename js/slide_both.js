crear_obj_temaData(url);//url => 'la/ruta/al/file.json'

async function crear_obj_temaData(url) {
    console.log('=== async function crear_temaData() === ');

    obj_temaData = await make_obj_temaData(url);
    //console.log(obj_lang);

    slideShowElement.style.backgroundImage = `url(${obj_temaData.tema_bg})`;

    if(window.location.pathname === '/slide_nav.php'){
        makeSlides();
        getSlideActual('slides', 'slide_actual');
    }
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

function pintSlideActive(slide_number = null){
    console.log('=== function pintSlideActive() ===');
    
    if(slide_number == null) return;
    if(!isNaN(slide_number)) {
        slide_number = slide_number.toString();
    }

    if(obj_temaData){
        let slideData = obj_temaData.slides.find(v => v.slide_number === slide_number);

        if(Object.keys(slideData).length !== 0){
            console.log(slideData);

            slideShowElement.style.backgroundImage = `url(${slideData.bg})`;
            //${obj_temaData.titulo}

            slideShowElement.innerHTML = `                
                ${slideData.content}
            `;

            if(slideData.style){
                const st = document.createElement('style');
                st.innerHTML = slideData.style;
                document.head.append(st);
            }
        }else{
            console.log('contenido no está definido');
        }        
    }
}