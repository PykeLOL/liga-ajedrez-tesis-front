let torneoActual=null;
let modalInscripcion=null;

$(document).on('change','#categoriaInscripcion',actualizarInfoCategoria);

$(document).on('change','#checkPagoEvento',function(){

    const pagarEvento=$(this).is(':checked');

    $('#mensajePagoEvento').toggleClass('d-none',!pagarEvento);

    $('#bloqueComprobante').toggleClass('d-none',pagarEvento);

});

$(document).on('click','#btnGuardarInscripcion',guardarInscripcion);

function renderAccionesInscripcion(e){
    torneoActual=e;

    const contenedor=$('#accionesInscripcion');

    if(!requiereAutenticacion()){
        contenedor.html(`
            <button class="btn btn-chess fw-bold w-100" onclick="requiereAutenticacion()">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Iniciar sesión para inscribirse
            </button>
        `);
        return;
    }

    const inscrito=e.inscripcion&&e.inscripcion.estado_id!==4;

    if(!inscrito){
        contenedor.html(`
            <button class="btn btn-chess fw-bold w-100" onclick="abrirModalInscripcion()">
                <i class="bi bi-person-plus-fill me-2"></i>
                Inscribirme
            </button>
        `);
        return;
    }

    contenedor.html(`
        <button class="btn btn-outline-danger fw-bold w-100"
            onclick="cancelarInscripcion(${e.inscripcion.id})">
            <i class="bi bi-person-dash-fill me-2"></i>
            Cancelar inscripción
        </button>

        <div class="small mt-2 text-muted">
            Estado:
            <span class="fw-bold text-chess-green">${e.inscripcion.estado}</span>
        </div>
    `);

}

function abrirModalInscripcion(){
    if(!requiereAutenticacion()) return;

    if(!modalInscripcion){
        modalInscripcion=new bootstrap.Modal('#modalInscripcion');
    }

    const select=$('#categoriaInscripcion');

    select.empty();

    torneoActual.categorias.forEach(c=>{

        select.append(`
            <option value="${c.id}">
                ${c.categoria} · ${c.genero} · ${c.ritmo}
            </option>
        `);

    });

    $('#bloquePago').toggleClass('d-none',!torneoActual.de_pago);
    $('#checkPagoEvento').prop('checked',true);
    $('#mensajePagoEvento').removeClass('d-none');
    $('#bloqueComprobante').addClass('d-none');
    $('#comprobanteInscripcion').val('');

    actualizarInfoCategoria();
    modalInscripcion.show();
}

function cancelarInscripcion(id){
    Swal.fire({
        icon:'warning',
        title:'Cancelar inscripción',
        text:'¿Desea cancelar su inscripción al torneo?',
        showCancelButton:true,
        confirmButtonText:'Sí, cancelar',
        cancelButtonText:'Volver',
        background:'#262421',
        color:'#fff',
        confirmButtonColor:'#c0392b'
    }).then(r=>{

        if(!r.isConfirmed) return;

        apiRequest({
            url:`${apiUrl}/home/eventos/cancelar-inscripcion/${id}`,
            type:'POST'
        }).then(()=>{

            Swal.fire({
                icon:'success',
                title:'Inscripción cancelada',
                text:'La inscripción fue cancelada correctamente.',
                background:'#262421',
                color:'#fff',
                confirmButtonColor:'#81b64c'
            });

            cargarDetalleTorneo();

        }).catch(xhr=>{

            validarRespuesta(xhr,'No fue posible cancelar la inscripción.');

        });
    });
}

function actualizarInfoCategoria(){
    const categoria=torneoActual.categorias.find(c=>c.id==$('#categoriaInscripcion').val());

    if(!categoria) return;
    $('#infoCategoria').html(`
        <div class="d-flex justify-content-between">
            <span>Categoría</span>
            <strong>${categoria.categoria}</strong>
        </div>

        <div class="d-flex justify-content-between">
            <span>Género</span>
            <strong>${categoria.genero}</strong>
        </div>

        <div class="d-flex justify-content-between">
            <span>Ritmo</span>
            <strong>${categoria.ritmo}</strong>
        </div>

        <div class="d-flex justify-content-between">
            <span>Cupos disponibles</span>
            <strong>${categoria.cupos_disponibles ?? 'Sin límite'}</strong>
        </div>

        <div class="d-flex justify-content-between">
            <span>Valor</span>
            <strong>${categoria.costo_inscripcion=='0'?'Gratis':'$'+categoria.costo_inscripcion}</strong>
        </div>
    `);
}

function guardarInscripcion(){
    const btn=$('#btnGuardarInscripcion');
    if(btn.prop('disabled')) return;

    btn.prop('disabled',true);

    const formData=new FormData();
    formData.append('evento_categoria_id',$('#categoriaInscripcion').val());

    if(!$('#checkPagoEvento').is(':checked')){
        const archivo=$('#comprobanteInscripcion')[0].files[0];

        if(archivo){
            formData.append('comprobante',archivo);
        }

    }

    apiRequest({
        url:`${apiUrl}/home/eventos/confirmar-inscripcion/${torneoActual.id}`,
        type:'POST',
        data:formData,
        processData:false,
        contentType:false
    }).then(()=>{

        modalInscripcion.hide();

        Swal.fire({
            icon:'success',
            title:'Inscripción realizada',
            text:'Tu inscripción quedó registrada correctamente.',
            background:'#262421',
            color:'#fff',
            confirmButtonColor:'#81b64c'
        });

        cargarDetalleTorneo();

    }).catch(xhr=>{

        validarRespuesta(xhr,'No fue posible completar la inscripción.');

    }).finally(()=>{

        btn.prop('disabled',false);

    });

}
