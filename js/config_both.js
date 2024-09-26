
let url;
//url = './json/tema1.json';
//url = './json/tema2.json';
url = './json/tema3.json';
//url = './json/tema4.json';

let id_tema = new URL(window.location.href).searchParams.get('id_tema');
if(id_tema){
    url = `./json/tema${id_tema}.json`;
}

let obj_temaData = {};
