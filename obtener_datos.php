<?php
session_start();//importante para ver al usuario logueado

include('functions.php');
include('includes/config.php');

/*
//HACER PRUEBAS...
echo json_encode([
    'HACIENDO_PRUEBAS' => 'DESCOMENTAR EN PROD',
    'success' => false,
    'valorCampo' => 'no_tiene_datos',
    'error' => 'No hay todos los parametros necesarios.',
    'dic_code' => 'd251'
]);
exit;
*/





//si los datos SÍ VIENEN desde el metodo permitido
//es lo mismo que => if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'GET'){
if (in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)){
    
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        // Obtener datos del cuerpo de la solicitud (en formato JSON)
        $inputJSON = file_get_contents('php://input');
        $datos = json_decode($inputJSON, true);
        //debug($inputJSON, 'inputJSON');
        //echo json_encode(['$datos' => $datos]);
        // Verificar que se decodificó correctamente

        if ($datos === null) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'valorCampo' => 'no_tiene_datos',
                'error' => 'No hay todos los parametros necesarios.',
                'dic_code' => 'd251'
            ]);
            exit;
        }
    } 

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        // Obtener usuario y contraseña del cuerpo de la solicitud
        $id_tema = isset($_GET['id_tema']) ? $_GET['id_tema'] : null ;
        $tabla = isset($_GET['tabla']) ? $_GET['tabla'] : null ;
        $campo = isset($_GET['campo']) ? $_GET['campo'] : null ;

        if ($tabla === null || $campo === null ) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'valorCampo' => 'no_tiene_datos',
                'error' => 'No hay todos los parametros necesarios.',
                'dic_code' => 'd251'
            ]);
            exit;
        }
        
        //para que los datos sean iguales como en POST
        $datos['id_tema'] = $id_tema;
        $datos['tabla'] = $tabla;
        $datos['campo'] = $campo;
    }
}


// Recuperar los valores
if( true /*isset($_SESSION['id_user'])*/ ){
    //$id_user_logged = $_SESSION['id_user'];
    $id_user_logged = 1;//test
    //echo_json_x($id_user_logged);        
} else {
    $id_user_logged = 5;//0
    //en prod no muestro nada
    echo json_encode([
        'success' => false,
        'valorCampo' => 'no_tiene_datos',
        'error' => 'No se puede obtener datos del usuario que no ha iniciado la sesión.',
        'dic_code' => 'd280'
    ]);
    exit;
}
//die();

include('includes/connect_db.php');

//$id_tema = $conn->real_escape_string($datos['id_tema']);//vkladki
$tabla = $conn->real_escape_string($datos['tabla']);//vkladki
$campo = $conn->real_escape_string($datos['campo']);//arrTabs
//echo_json_x($datos, 'datos');


//busco si hay registro
// Preparar y ejecutar la consulta
$sql_init = "SELECT slide_actual, id_tema, is_fon_shown  
            FROM slides 
            WHERE id_user = '$id_user_logged'
";
//-- AND id_tema = '$id_tema'
//$sql_prep = "SELECT $campo 
//            FROM $tabla 
//            WHERE id_user = '$id_user_logged' 
//";
//$arr_params = [$campo, $tabla, $id_user_logged];
//$sql_preparada = prepararQuery($conn, $sql_prep, $arr_params);
$result = $conn->query($sql_init);
//echo_json_x($sql_init, 'sql');

if($result->num_rows > 0){   
    $row = $result->fetch_assoc();
    //echo_json_x($row, 'row']);
    
    $hay_id_user_en_tabla = true;
    $valorCampo = $row[$campo];
    $valorIdTema = $row['id_tema'];
    $valorIsFonShown = $row['is_fon_shown'];
    $data = [
        'success' => true,
        'valorCampo' => $valorCampo,
        'valorIdTema' => $valorIdTema,
        'valorIsFonShown' => $valorIsFonShown
    ];

}else{
    
    $hay_id_user_en_tabla = false;
    $data = [
        'success' => true,//AUNQUE NO TIENE DATOS , PONGO TRUE PARA QUE ENTRE EN EL BLOQUE
        'valorCampo' => 'no_tiene_datos'
    ];

}

//Cierro conexion con bd
$conn->close();

// Enviar respuesta al cliente en formato JSON
header('Content-Type: application/json');
echo json_encode($data);

?>