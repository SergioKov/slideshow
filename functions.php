<?php
//=====================================================================================//
// FUNCTIONS - START
//=====================================================================================//

function debug($variable, $name_var = null){
    if($name_var != null) echo"<h3>$name_var: </h3>";
    echo"<pre>";
    var_dump($variable);
    echo"</pre>";
}


function debug_x($variable, $name_var = null){
    if($name_var != null) echo"<h3>$name_var: </h3>";
    echo"<pre>";
    var_dump($variable);
    echo"</pre>";
    exit;
}

function debug_r($variable, $name_var = null){
    if($name_var != null) echo"<h3>$name_var: </h3>";
    echo"<pre>";
    print_r($variable);
    echo"</pre>";
}

function debug_r_x($variable, $name_var = null){
    if($name_var != null) echo"<h3>$name_var: </h3>";
    echo"<pre>";
    print_r($variable);
    echo"</pre>";
    exit;
}

function echo_json($variable, $name_var = null){
    if($name_var != null){
        echo json_encode([
            $name_var => $variable
        ]);    
    }else{
        echo json_encode([
            'variable' => $variable
        ]);
    }    
    exit;
}

function echo_json_x($variable, $name_var = null){//con exit;
    if($name_var != null){
        echo json_encode([
            $name_var => $variable,
            'hago_exit' => true
        ], JSON_UNESCAPED_UNICODE);    
    }else{
        echo json_encode([
            'variable' => $variable,
            'hago_exit' => true
        ], JSON_UNESCAPED_UNICODE);
    }    
    exit;
}

function interpolateQuery($query, $params) {//$params es un array
    // Dividir la consulta en partes utilizando '?' como delimitador
    $parts = explode('?', $query);
    $final_query = '';
    
    // Iterar sobre las partes y los parámetros
    for ($i = 0; $i < count($parts); $i++) {
        $final_query .= $parts[$i];
        
        // Añadir el valor del parámetro si existe
        if (isset($params[$i])) {
            $value = $params[$i];
            
            // Determinar el tipo de dato y formatear adecuadamente
            if (is_int($value) || is_float($value)) {
                $final_query .= $value;
            } elseif (is_null($value)) {
                $final_query .= 'NULL';
            } else {
                // Escapar caracteres especiales para cadenas
                $escaped = addslashes($value);
                $final_query .= "'" . $escaped . "'";
            }
        }
    }
    
    return $final_query;
}

function prepararQuery($conn, $query, $arr_params, $sign = '?') {
    //echo "<hr><p> START --- function: prepararQuery() </p><hr>";
    //$conn => es necesario para $conn->real_escape_string($value)
    //$query => es la consulta sql 
    //$arr_params => es un array de parámetros
    //$sign => por defecto es '?' pero al introducir json pongo signo especial. Ej.: '__[(&)]__' //no usar '<' ni '>'
    //si en arr_params algun valor es null, meterlo directamente sin usar '?'
    //si la consulta $query no tiene '?' pasar $arr_params vacio => [] o no USAR ESTA FUNCION YA QUE NO HACE NADA

    // Dividir la consulta en partes utilizando '?' como delimitador
    $arr_parts = explode($sign, $query);
    $final_query = '';
    
    //debug($sign, 'sign');
    //debug($query, 'query');
    //debug($arr_params, 'arr_params');
    //debug($arr_parts, 'arr_parts');
    //debug(count($arr_parts), 'count(arr_parts)');
    //echo "<hr><p> START --- FOR </p><hr>";

    if(count($arr_parts) > 1){//SI AL MENOS HAY UN '?' AL DIVIDIR STRING RETORNA 2 VALORES EN arr_parts

        // Iterar sobre las partes y los parámetros
        for ($i = 0; $i < count($arr_parts); $i++) {        
            $final_query .= $arr_parts[$i];

            //debug($arr_parts[$i],"$ arr_parts[$i]");
            //debug($final_query, "$ final_query [$i] antes");
            
            // Añadir el valor del parámetro si existe
            if (isset($arr_params[$i]) ) {
                $value = $arr_params[$i];

                //debug($arr_params[$i], "$ arr_params[$i]");
                //debug($value, 'value');
                
                // Determinar el tipo de dato y formatear adecuadamente
                if (is_int($value) || is_float($value)) {
                    $final_query .= $value;
                    //echo " $ value es INT o FLOAT";
                } elseif (is_bool($value)) {
                    $final_query .= ($value) ? 1 : 0 ;
                    //echo " $ value es BOOL";
                } elseif (is_null($value)) {
                    //aki no entra nunca ya que si $arr_params[$i] = NULL la comprobación isset(NULL) retorna false y no entra aki. 
                    //pero lo dejo aki con esta explicación
                    $final_query .= 'NULL';
                    //echo " $ value [$value] es NULL";
                } else {
                    // Escapar caracteres especiales para cadenas
                    $value_escaped = $conn->real_escape_string($value);
                    $final_query .= "'" . $value_escaped . "'";
                    //echo " $ value [$value] es STRING";
                }
            }

            //debug($final_query, "$ final_query [$i] después ");
            //echo "<hr>";
        }
        //echo "<hr><p> END --- FOR </p><hr>";
        //echo "<hr><p> END --- function: prepararQuery() </p><hr>";

        return $final_query;

    }else{

        //echo "<hr><h3> NO HAY '?' EN LA CONSULTA. LA RETORNO TAL CUAL</h3>";
        return $query;
    }    
}









//=====================================================================================//
// FUNCTIONS - END
//=====================================================================================//
?>