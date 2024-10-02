<?php
session_start();//importante para ver al usuario logueado

include('functions.php');
include('includes/config.php');






//si los datos NO VIENEN desde el metodo permitido
if (!in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)){
	// Manejar solicitudes incorrectas
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Solicitud incorrecta.',
        'dic_code' => 'd250'
    ]);
    exit;
}

//si los datos SÍ VIENEN desde desde el metodo permitido
//es lo mismo que => if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'GET'){
if (in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)){
    
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $jsonString = file_get_contents('php://input');//saco datos del cuerpo de la solicitud. 
        //debug($jsonString, 'jsonString');
    } 

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        $jsonString = $_GET['datos'];//saco datos del url.
        //debug($jsonString, 'jsonString');
    } 
    
    
    // Recuperar datos JSON
    $datos = json_decode($jsonString, true);
    //debug($datos, 'datos');
	//echo_json_x($datos, 'datos');


    // Validar si la decodificación fue exitosa
    if (json_last_error() === JSON_ERROR_NONE) {
        // Validar estructura y contenido del JSON
        if (isset($datos['tabla']) && isset($datos['campo']) && isset($datos['arr'])) {
            //echo "JSON es válido y contiene las claves esperadas.";
            //sigo adelante...
        } else {
            //echo "JSON no contiene las claves esperadas.";
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Error al procesar el JSON. El objeto no contiene las claves esperadas.',
                'dic_code' => 'd301'
            ]);
            exit;
        }
    } else {
        //echo "Error al decodificar JSON: " . json_last_error_msg();
        //writeLog("Error al decodificar JSON. Error: [" . json_last_error_msg() . "]", 'ERROR');

        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Error al decodificar JSON.',
            'json_last_error_msg' => json_last_error_msg(),
            'dic_code' => 'd302'
        ]);
        exit;
    }

    // Verificar que se decodificó correctamente
    if ($datos === null) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Error al procesar el JSON.',
            'dic_code' => 'd235'
        ]);
        exit;
    }
    

    //exit('<br>hasta aki');


    // Recuperar los valores
    if(true /*isset($_SESSION['username']) && isset($_SESSION['id_user']) */) {
        //$id_user_logged = $_SESSION['id_user'];
        //$username_logged = $_SESSION['username'];
        $id_user_logged = 1;
        $username_logged = 'demo_user';
        //echo json_encode(['mensaje' => 'sesion username_logged: ' . $username_logged ]);        
    } else {
        $id_user_logged = 5;
        $username_logged = 'user_test_no_borrar';
        //echo json_encode(['mensaje' => $username_logged]);
        
        //writeLog("No existe sessión. Para insertar datos hay que loguearse antes. Solicitud incorrecta.");
        
        // Manejar solicitudes incorrectas
        //http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'No existe sessión. Para insertar datos hay que loguearse antes. Solicitud incorrecta.',
            'dic_code' => 'd245'
        ]);
        die();
    }
	//echo_json_x($id_user_logged, 'id_user_logged');

    include('includes/connect_db.php');

    //debug_x($datos['arr']); 
    
    $id_tema = $conn->real_escape_string($datos['id_tema']);//get parameter
    $is_fon_shown = $conn->real_escape_string($datos['is_fon_shown']);//get parameter
    $tabla = $conn->real_escape_string($datos['tabla']);//vkladki
    $campo = $conn->real_escape_string($datos['campo']);//arrTabs
    $arr = json_encode($datos['arr'], JSON_UNESCAPED_UNICODE);//arrTabs //no usar $conn->real_escape_string($datos['arr']) ya que retorna NULL

    //debug($tabla);
    //debug($campo);
    //debug($arr, 'arr');
    //echo_json_x($arr, 'arr');

    //exit('<br>hasta aki-2');

    // Obtener la fecha y hora actual
    $fechaHoraActual = date("Y-m-d H:i:s");
    

    //busco si hay registro en la tabla a donde insertar array
    $sql_init = "SELECT * 
                FROM $tabla 
                WHERE id_user = '$id_user_logged' 
    ";
    $sql_prep = "SELECT * 
                FROM $tabla 
                WHERE id_user = ? 
    ";
    $arr_params = [$id_user_logged];
    $sql_preparada = prepararQuery($conn, $sql_prep, $arr_params);
	$result = $conn->query($sql_preparada);
    //debug_x($sql_preparada, 'sql_preparada');

    if($result->num_rows > 0){
        $row = $result->fetch_assoc();
		//echo_json_x($row,'row');
		
        $storedId_user = $row["id_user"];//1
        $hay_id_user_en_tabla = true;
    }else{
        $hay_id_user_en_tabla = false;
    }

	//echo_json_x($hay_id_user_en_tabla, 'hay_id_user_en_tabla');

    $sign = '__[(&)]__';//IMPORTANTE! para que ho haya errores con $arr en json
    
    // Realizar la inserción o (update) en la base de datos 
    if($hay_id_user_en_tabla){
        //hago update
        $sql2_up_init = "UPDATE slides SET 
                    slide_actual = '$arr',
                    id_tema = '$id_tema',
                    is_fon_shown = '$is_fon_shown',
                    updated_at = '$fechaHoraActual'
                    WHERE id_user = '$id_user_logged'
        ";
        //$sql2_up_prep = "UPDATE $tabla SET 
        //            $campo = $sign,
        //            updated_at = '$fechaHoraActual' 
        //            WHERE id_user = $sign 
        //";
        ////$arr paso tal cual ya que los datos pueden tener dentro '?' y romper sql
        //$arr_params = [$arr, $id_user_logged];
        //$sql2_up_preparada = prepararQuery($conn, $sql2_up_prep, $arr_params, $sign);
        $result2 = $conn->query($sql2_up_init);
        //debug_x($sql2_up_preparada, 'sql2_up_preparada');
        //echo_json_x($sql2_up_preparada, 'sql2_up_preparada');	
    }else{
        /*
        //hago insert
        $sql2_in_init = "INSERT INTO $tabla (id_user, $campo, created_at) 
                        VALUES ('$id_user_logged', '$arr', '$fechaHoraActual')
        ";
        $sql2_in_prep = "INSERT INTO $tabla (id_user, $campo, created_at) 
                        VALUES ($sign,              $sign, '$fechaHoraActual')
        ";
        //$arr paso tal cual ya que los datos pueden tener dentro '?' y romper sql
        $arr_params = [$id_user_logged, $arr];
        $sql2_in_preparada = prepararQuery($conn, $sql2_in_prep, $arr_params, $sign);
        $result2 = $conn->query($sql2_in_preparada);
        //debug_x($sql2_in_preparada, 'sql2_in_preparada');
        */
    }
	//echo_json_x($result2, 'result2');


    //Update o insert datos en la tabla $tabla
    if($result2 === TRUE) {
        if($hay_id_user_en_tabla){
            $respuesta = [
                'success' => true,
                'mensaje' => 'Datos actualizados correctamente.'
            ];
        }else{
            $respuesta = [
                'success' => true,
                'mensaje' => 'Datos insertados correctamente.'
            ];
        }
    } else {
        if($hay_id_user_en_tabla){
            //writeLog("Error al actualizar datos. Error: [" . $conn->error . "]");

            $respuesta = [
                'success' => false,
                'error' => 'Error al actualizar datos: ',
                'conn_error' => $conn->error
            ];
        }else{
            //writeLog("Error al insertar datos. Error: [" . $conn->error . "]");

            $respuesta = [
                'success' => false,
                'mensaje' => 'Error al insertar datos: ',
                'conn_error' => $conn->error
            ];
        }
    }

    //Cierro conexion con bd
    $conn->close();	

    // Enviar respuesta al cliente en formato JSON
    header('Content-Type: application/json');
    echo json_encode($respuesta);
	
}

?>
