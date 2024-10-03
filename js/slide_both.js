crear_obj_temaData(url);//url => 'la/ruta/al/file.json'

async function crear_obj_temaData(url) {
    //console.log('=== async function crear_temaData() === ');

    obj_temaData = await make_obj_temaData(url);
    //console.log(obj_lang);

    maxVal = obj_temaData.slides.length;

    if(window.location.pathname === '/slide_nav.php'){
        makeSlides();
        getSlideActual('slides', 'slide_actual');
    }
}

async function make_obj_temaData(url){
    //console.log('=== function make_obj_temaData() ===');
    
    try {
        
        let obj_temaData_f = await fetchDataToJson(url);
        //console.log('obj_temaData_f:');

        return obj_temaData_f;

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('make_obj_temaData. error: ',error);
    }    

}



async function pintSlideActive(slide_number = null){
    //console.log('=== function pintSlideActive() ==='); 
    
    if(slide_number == null) return;

    if(!isNaN(slide_number)) {
        slide_number = slide_number.toString();
    }

    if(Object.keys(obj_temaData).length > 0){
        let slideData = obj_temaData.slides.find(v => v.slide_number === slide_number);
        let slideDataFon = obj_temaData.slides.find(v => v.slide_number === '1');//fon

        if(typeof slideData !== 'undefined'){
            //console.log(slideData);
            let url = `./temas/tema${id_tema}/${slideData.bg}`;
            slideShowElement.style.backgroundImage = `url(${url})`;
            
            if(is_fon_shown){
                let url_fon = `./temas/tema${id_tema}/${slideDataFon.bg}`;
                slideShowElement.style.backgroundImage = `url(${url_fon})`;
                
                //solo para slide_nav.php
                if(slideViewElement){
                    slideViewElement.style.backgroundImage = `url(${url_fon})`;
                }                
            }
            
        }else{
            console.log('contenido no está definido');
        }        
    }
}