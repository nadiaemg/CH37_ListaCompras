// El código va aquí ->
//Referencias a los elementos del DOM (Formulario HTML)
let btnAgregar = document.getElementById("btnAgregar");
let btnClear = document.getElementById("btnClear");
let txtNombre = document.getElementById("Name");
let txtNumber = document.getElementById("Number");

let alertValidaciones = document.getElementById("alertValidaciones");
let alertValidacionesTexto = document.getElementById("alertValidacionesTexto");

let tablaListaCompras = document.getElementById("tablaListaCompras");
let cuerpoTabla = tablaListaCompras.getElementsByTagName("tbody").item(0);

let contadorProductos = document.getElementById("contadorProductos");
let productosTotal = document.getElementById("productosTotal");
let precioTotal = document.getElementById("precioTotal");

//Variable bandera
let isValid = true;
//Variables
let precio = 0;
let contador = 0;
let costoTotal = 0;
let totalEnProductos = 0;

let datos = new Array();

//Función para validar cantidad ingresada
function validarCantidad(){
    if (txtNumber.value.length == 0){
        return false;
    }//if lenght
    if (isNaN(txtNumber.value)){
        return false;
    }//if isNan
    if (Number(txtNumber.value) <= 0){
        return false;
    }//if positivo

    return true;
}//validar cantidad

//Función para precio aleatorio de producto
function getPrecio(){
    return parseInt((Math.random() * 75) *100) / 100;
}//funcion getPrecio

//Listener para boton Limpiar todo
btnClear.addEventListener("click", function(event){
    //Prevenir acciones predeterminadas del botón
    event.preventDefault();
    //Limpiar campos y alertas
    txtNombre.value = "";
    txtNumber.value = "";
    alertValidacionesTexto.innerHTML="";
    alertValidaciones.style.display="none";
    txtNombre.style.border = "";
    txtNumber.style.border = "";

    //Reestablecimiento de variables
    contador = 0;
    costoTotal = 0;
    totalEnProductos = 0;
    contadorProductos.innerText = contador;
    productosTotal.innerText = totalEnProductos;
    precioTotal.innerText = `$ ${costoTotal.toFixed(2)}`;
    cuerpoTabla.innerText = "";

    //Limpiar datos almacenados en localStorage
    localStorage.setItem("contadorProductos", contador);
    localStorage.setItem("totalEnProductos", totalEnProductos);
    localStorage.setItem("costoTotal", costoTotal);
    localStorage.removeItem("datos");
    datos = new Array();

    //Enfoque al campo Nombre
    txtNombre.focus();
});//btnClear listener

//Listener para boton Agregar
btnAgregar.addEventListener("click", function(event){
    event.preventDefault();
    //Limpiar alertas
    alertValidacionesTexto.innerHTML="";
    alertValidaciones.style.display="none";
    txtNombre.style.border = "";
    txtNumber.style.border = "";
    isValid = true;

    //Quitar espacios al inicio y final de los valores ingresados
    txtNombre.value = txtNombre.value.trim();
    txtNumber.value = txtNumber.value.trim();

    //Validación de Nombre del producto
    if(txtNombre.value.length < 3){
        alertValidacionesTexto.insertAdjacentHTML("beforeend",`
        El <strong>Nombre</strong> del producto no es correcto.
        Inténtelo nuevamente.`);
        alertValidaciones.style.display = "block";
        txtNombre.style.border = "solid #dc3545 thin";
        isValid = false;
    }//if lenght

    //Validación de Cantidad del producto
    if (! validarCantidad()){
        alertValidacionesTexto.insertAdjacentHTML("beforeend",`
        <br>La <strong>Cantidad</strong> no es correcta.
        Inténtelo nuevamente.`);
        alertValidaciones.style.display = "block";
        txtNumber.style.border = "solid #dc3545 thin"
        isValid = false;
    }//if validar cantidad

    //Si los datos son válidos se agregan a Resumen y Tabla
    if(isValid){
        contador++;
        precio = getPrecio();

        //Fila para la tabla
        let row = `<tr>
            <td>${contador}</td>
            <td>${txtNombre.value}</td>
            <td>${txtNumber.value}</td>
            <td>${precio}</td>
        </tr>`;

        cuerpoTabla.insertAdjacentHTML("beforeend", row);

        //Objeto con los datos del producto
        let elemento = `{"id": ${contador},
                         "nombre" : "${txtNombre.value}",
                         "cantidad" : ${txtNumber.value},
                         "precio" : ${precio}
        }`;
        //Se agrega objeto "elemento" a arreglo "datos"
        datos.push(JSON.parse(elemento));
        console.log(datos);
        localStorage.setItem("datos", JSON.stringify(datos));

        //Actualización de datos que se muestran
        contadorProductos.innerText = contador;
        totalEnProductos += parseFloat(txtNumber.value);
        productosTotal.innerText = totalEnProductos;
        costoTotal += precio * parseFloat(txtNumber.value);
        precioTotal.innerText = `$ ${costoTotal.toFixed(2)}`;

        //Guardar datos en localStorage
        localStorage.setItem("contadorProductos", contador);
        localStorage.setItem("totalEnProductos", totalEnProductos);
        localStorage.setItem("costoTotal", costoTotal);

        //Limpiar campos del formulario y enfoque al campo Nombre
        txtNombre.value = "";
        txtNumber.value = "";
        txtNombre.focus();

    }//if isValid
});//btnAgregar listener

//Listener para cargar datos al cargar página
window.addEventListener("load", function(){
    //Si hay datos en sección Resumen, cargarlos en página
    if(this.localStorage.getItem("contadorProductos") != null){
        contador = Number(this.localStorage.getItem("contadorProductos"));
        totalEnProductos = Number(this.localStorage.getItem("totalEnProductos"));
        costoTotal = Number(this.localStorage.getItem("costoTotal"));

        contadorProductos.innerText = contador;
        productosTotal.innerText = totalEnProductos;
        precioTotal.innerText = `$ ${costoTotal.toFixed(2)}`;
    }//if null

    //Si hay datos en sección Tabla, cargarlos en página
    if(this.localStorage.getItem("datos") != null){
        datos = JSON.parse(this.localStorage.getItem("datos"));
        datos.forEach((r) => {
            let row = `<tr>
            <td>${r.id}</td>
            <td>${r.nombre}</td>
            <td>${r.cantidad}</td>
            <td>${r.precio}</td>
            </tr>`;

            cuerpoTabla.insertAdjacentHTML("beforeend", row);
        }); //for each
    }//if datos
});//window listener