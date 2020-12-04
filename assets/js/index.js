$(document).ready(function(){

    let id=0;
    //Agregar línea con los datos introducidos
    $('#agregarLinea').click(agregarLinea);
    $('#agregarLinea').click(datosTotales);

    //Calcular el total de la línea al sacar el cursor del input
    $('#cantidad').mouseout(calcularTotal);
    $('#precio-unitario').mouseout(calcularTotal);
    $('#descuento').mouseout(calcularTotal);

    /* Borra la línea indicada.
    Se hace de esta manera porque el botón se ha 
    creado dinámicamente */
    $(document).on('click','.borrar',function(){
        let identificador = this.id;
        $('#t'+identificador[1]).html("");
    });
    $(document).on('click','.borrar',datosTotales);
    
    //Aplicar descuento a todas las líneas
    $('#aplicarDescuento').click(aplicarDescuento);
    $('#aplicarDescuento').click(datosTotales);

    /* Eliminar los popover cuando pasamos el cursor por encima */
    $('#producto').hover(function(){$('#producto').popover("hide")});
    $('#cantidad').hover(function(){$('#cantidad').popover("hide")});
    $('#precio-unitario').hover(function(){$('#precio-unitario').popover("hide")});
    $('#descuento').hover(function(){$('#descuento').popover("hide")});
    $('#descuento-lineas').hover(function(){$('#descuento-lineas').popover("hide")});


   /* 
    *   Funciones
    */

    //Función para agregar línea en la tabla con el producto
    function agregarLinea(){

        /* Obtenemos los valores de los input */
        let producto = $('#producto').val();
        let cantidad = $('#cantidad').val();
        let precioUnidad = $('#precio-unitario').val();
        let descuento = $('#descuento').val();
        /*Se agrega el precio total para que aparezca en la nueva fila siempre
        (Por si no hemos pasado el cursor por los input)*/
        calcularTotal();
        let total = $('#total').val();

        let esDecimal=false;

        /* Realizamos validaciones */
        if(producto==""||producto[0]==" "){
            $('#producto').attr('data-toggle','popover')
            if(producto==""){
                $('#producto').attr('data-content','Debes introducir algo')
            }
            else{
                $('#producto').attr('data-content','No se puede empezar con espacio')
            }
            $('#producto').attr('data-placement','bottom')
            $('#producto').popover("show")
            return false
        }
            //Comprueba si tiene punto para saber si es decimal
            for(let i=0;i<cantidad.length;i++){
                if(cantidad[i]=="."){
                    esDecimal=true;
                }
            }
        if(cantidad==""||cantidad<1||esDecimal==true){
            $('#cantidad').attr('data-toggle','popover')
            if(cantidad=="")
            {
                $('#cantidad').attr('data-content','Debes introducir una cantidad')
            }
            else if(esDecimal==true){
                $('#cantidad').attr('data-content','No valen decimales')
            }
            else{
                $('#cantidad').attr('data-content','Debe ser número positivo')
            }
            $('#cantidad').attr('data-placement','bottom')
            $('#cantidad').popover("show")
            return false
        }
            precioUnidad = precioUnidad.replace(",",".")
        if(precioUnidad==""||isNaN(precioUnidad)||precioUnidad<=0){
            $('#precio-unitario').attr('data-toggle','popover')
            if(precioUnidad==""){
                $('#precio-unitario').attr('data-content','Debes introducir un precio')
            }
            else if(precioUnidad<=0){
                $('#precio-unitario').attr('data-content','Debe ser número positivo')
            }
            else{
                $('#precio-unitario').attr('data-content','Solo valen números')
            }
            $('#precio-unitario').attr('data-placement','bottom')
            $('#precio-unitario').popover("show")
            return false
        }
        descuento = descuento.replace(/ /g,"")
        if(descuento!=""&&(isNaN(descuento)||descuento<0||descuento>100))
        {
            $('#descuento').attr('data-toggle','popover')
            if(isNaN(descuento)){
                $('#descuento').attr('data-content','Debe ser un número')
            }
            else if((descuento<0||descuento>100)){
                $('#descuento').attr('data-content','Debe ser entre 0-100')
            }
            $('#descuento').attr('data-placement','bottom')
            $('#descuento').popover("show")
            return false
        }
        if(descuento==""){
            descuento=0;
        }

        /* Si todo está bien creamos la nueva fila */
        $('tbody').append(
            $('<tr>').attr('id','t'+id).append(
                $('<td>').attr('class','text-right').text(producto),
                $('<td>').attr('id','c'+id).attr('class','text-right').text(cantidad),
                $('<td>').attr('class','text-right').append(
                    $('<span>').attr('id','p'+id).text(precioUnidad)
                ).append("€"),
                $('<td>').attr('class','text-right').append(
                    $('<span>').attr('class','descuentoAplicado').text(descuento)
                ).append("%"),
                $('<td>').attr('class','text-right').append(
                    $('<span>').attr('id','ttal'+id).attr('class','totalAplicado').text(total)
                ).append("€"),
                $('<td>').append(
                    $('<button>').attr('id','b'+id).attr('class','btn btn-danger borrar').text('Borrar')
                )
            )
        );
        darFecha();
        id+=1;
        /* return false para que no se recargue la página */
        return false;
    }

    //Función para calcular el precio total de la línea
    function calcularTotal (){
        let cantidad = $('#cantidad').val();
        let precioUnidad = $('#precio-unitario').val();
        let descuento = $('#descuento').val();

        let precio;
        //Si hay descuento
        if(cantidad!=""&&precioUnidad!=""&&descuento!=""){
            let descuentoDecimal = (descuento/100);
            let porcentaje = (cantidad*precioUnidad)*descuentoDecimal;
            precio = (cantidad*precioUnidad)-porcentaje;
            precio = redondear(precio,-2)
            if(isNaN(precio)){
                precio = "Inválido";
            }
        }
        //Si no hay descuento
        else if(cantidad!=""&&precioUnidad!=""){
            precio = (cantidad*precioUnidad);
            precio = redondear(precio,-2)
            if(isNaN(precio)){
                precio = "Inválido";
            }
        }

        $('#total').val(precio)
    }

    /* Dos funciones para redondear con decimales */
    function redondear (valor, exp) {
        return ajusteDecimal('round', valor, exp);
    };
    function ajusteDecimal(type, value, exp) {
        // Si el exp no está definido o es cero...
        if (typeof exp === 'undefined' || +exp === 0) {
          return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // Si el valor no es un número o el exp no es un entero...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
          return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }
    //Aplicar descuento a todas las líneas
    function aplicarDescuento (){
        let descTotal = $('#descuento-lineas').val();
        descTotal = descTotal.replace(/ /g,"")
        if(descTotal==""){
            descTotal = 0;
        }
        if(isNaN(descTotal)||descTotal<0||descTotal>100){
            $('#descuento-lineas').attr('data-toggle','popover')
            $('#descuento-lineas').attr('data-content','Debe ser un número entre 0 y 100')
            $('#descuento-lineas').attr('data-placement','bottom')
            $('#descuento-lineas').popover("show")
            return false
        }
        $('.descuentoAplicado').text(descTotal);

        for(let i=0;i<id;i++){
            let cant = $('#c'+i).text()
            let prec = $('#p'+i).text()
            
            let porcent = (cant*prec)*(descTotal/100);
            let precioTtal = (cant*prec)-porcent;
            precioTtal = redondear(precioTtal,-2)

            $('#ttal'+i).text(precioTtal)
        }
        return false
    }
    //Actualizar los datos Totales
    function datosTotales(){
        let baseImponible = 0;

        for(let i=0;i<id;i++){
            let totalLinea = $('#ttal'+i).text();
            if(totalLinea==""){
                totalLinea=0;
            }
            baseImponible+=parseFloat(totalLinea);
        };
        baseImponible = redondear(baseImponible,-2)
        $('#base-imponible').text(baseImponible);

        let iva21 = baseImponible*0.21;
        iva21 = redondear(iva21,-2)
        $('#iva').text(iva21);

        let totalFactura = (baseImponible + iva21);
        $('#totalFactura').text(totalFactura);
    }
    //Dar fecha de la última actualización
    function darFecha (){
        let fecha = new Date();
        let anio = fecha.getFullYear();
        let mes = fecha.getMonth();
        let dia = fecha.getDate();
        let hora = fecha.getHours();
        let minutos = fecha.getMinutes();
        
            $('#filaFecha').html(
                $('<th>').attr('colspan','2').html(
                    "Último producto añadido: "+dia+"/"+(mes+1)+"/"+anio+" "+hora+":"+minutos
                )
            )
        return false
    }
});