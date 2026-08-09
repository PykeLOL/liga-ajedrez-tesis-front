let torneoInscripciones = null;
let tablaActivas = null;
let tablaCanceladas = null;
let inscripcionActual = null;
let estadosInscripcion=[];

async function abrirInscripciones(id){
    torneoInscripciones=id;
    $('#modalInscripciones').modal('show');
    cargarTablasInscripciones(id);
}

function cargarTablasInscripciones(id) {
    if($.fn.DataTable.isDataTable('#tablaInscripcionesActivas')){
        $('#tablaInscripcionesActivas').DataTable().destroy();
    }

    if($.fn.DataTable.isDataTable('#tablaInscripcionesCanceladas')){
        $('#tablaInscripcionesCanceladas').DataTable().destroy();
    }

    apiRequest({
        url:`${apiUrl}/torneos/inscripciones/${id}`,
        type:'GET'
    })
    .then(r=>{

        $('#tabActivasBtn').text(`Activas (${r.activas.length})`);
        $('#tabCanceladasBtn').text(`Canceladas (${r.canceladas.length})`);

        tablaActivas = $('#tablaInscripcionesActivas').DataTable({
            autoWidth:false,
            responsive:true,
            data:r.activas,
            language:{url:dataTablesLangUrl},
            columns:[
                {
                    data:null,
                    render:i=>`
                        <div class="fw-semibold">${i.deportista}</div>
                        <small class="text-muted">${i.club??''}</small>
                    `
                },
                {
                    data:null,
                    render:i=>`
                        <div>${i.categoria}</div>
                        <small class="text-muted">${i.genero} · ${i.ritmo}</small>
                    `
                },
                {
                    data:'fecha_inscripcion',
                    width:'130px'
                },
                {
                    data:'estado',
                    className:'text-center',
                    width:'95px',
                    render:(estado,t,row)=>{
                        let color='secondary';
                        if(row.estado_id==1) color='warning';
                        if(row.estado_id==2) color='success';
                        if(row.estado_id==3) color='danger';

                        return `<span class="badge bg-${color}">${estado}</span>`;
                    }
                },
                {
                    data:'pago',
                    className:'text-center',
                    width:'70px',
                    render:v=>v
                        ?'<span class="badge bg-success">Sí</span>'
                        :'<span class="badge bg-secondary">No</span>'
                },
                {
                    data:'valor_categoria',
                    className:'text-end',
                    width:'95px',
                    render:v=>'$'+Number(v).toLocaleString('es-CO')
                },
                {
                    data:'comprobante',
                    className:'text-center',
                    width:'90px',
                    orderable:false,
                    render:url=>url
                        ?`<a href="${apiUrlBase}${url}" target="_blank" class="btn btn-sm btn-outline-primary">Ver</a>`
                        :'—'
                },
                {
                    data:null,
                    width:'60px',
                    orderable:false,
                    searchable:false,
                    className:'text-center',
                    render:i=>`
                        <button
                            class="btn btn-warning btn-sm btnEditarInscripcion"
                            data-id="${i.id}">
                            <i data-lucide="pencil"></i>
                        </button>
                    `
                }
            ],
            language:{url:dataTablesLangUrl},
            drawCallback(){
                lucide.createIcons();
            }
        });

        tablaCanceladas = $('#tablaInscripcionesCanceladas').DataTable({
            autoWidth:false,
            responsive:true,
            data:r.canceladas,
            language:{url:dataTablesLangUrl},
            columns:[
                {
                    data:null,
                    render:i=>`
                        <div class="fw-semibold">${i.deportista}</div>
                        <small class="text-muted">${i.club??''}</small>
                    `
                },
                {
                    data:null,
                    render:i=>`
                        <div>${i.categoria}</div>
                        <small class="text-muted">${i.genero} · ${i.ritmo}</small>
                    `
                },
                {
                    data:'fecha_inscripcion',
                    width:'130px'
                },
                {
                    data:'observacion',
                    defaultContent:'—'
                },
                {
                    data:'comprobante',
                    className:'text-center',
                    width:'90px',
                    orderable:false,
                    render:url=>url
                        ?`<a href="${apiUrlBase}${url}" target="_blank" class="btn btn-sm btn-outline-primary">Ver</a>`
                        :'—'
                }
            ],
            language:{url:dataTablesLangUrl},
            drawCallback(){
                lucide.createIcons();
            }
        });

        $('button[data-bs-toggle="tab"]').off('shown.bs.tab').on('shown.bs.tab',function(){
            $.fn.dataTable.tables({visible:true,api:true}).columns.adjust();
        });

    })
    .catch(()=>{
        if($.fn.DataTable.isDataTable('#tablaInscripcionesActivas')){
            $('#tablaInscripcionesActivas').DataTable().clear().draw();
        }

        if($.fn.DataTable.isDataTable('#tablaInscripcionesCanceladas')){
            $('#tablaInscripcionesCanceladas').DataTable().clear().draw();
        }
    });
}

function editarInscripcion(id){
    limpiarFormularioInscripcion();

    inscripcionActual=tablaActivas.rows().data().toArray().find(i=>i.id==id);
    if(!inscripcionActual)return;

    $('#inscripcionId').val(inscripcionActual.id);
    $('#infoDeportista').text(inscripcionActual.deportista);
    $('#infoCategoria').text(`${inscripcionActual.categoria} · ${inscripcionActual.genero} · ${inscripcionActual.ritmo}`);
    $('#infoValorCategoria').text('$'+Number(inscripcionActual.valor_categoria).toLocaleString('es-CO'));
    $('#pagoInscripcion').prop('checked',inscripcionActual.pago);
    $('#pagoCompleto').prop('checked',Number(inscripcionActual.valor_pagado)==Number(inscripcionActual.valor_categoria));
    $('#valorPagado').val(inscripcionActual.valor_pagado??'');
    $('#referenciaPago').val(inscripcionActual.referencia_pago??'');
    $('#observacionInscripcion').val(inscripcionActual.observacion??'');

    cargarEstadosInscripcion(inscripcionActual.estado_id);
    $('#modalEditarInscripcion').modal('show');
}

function guardarInscripcion(){
    const id=$('#inscripcionId').val();
    const formData=new FormData();

    formData.append('_method','PATCH');
    formData.append('estado_inscripcion_id',$('#estadoInscripcion').val());
    formData.append('pago',$('#pagoInscripcion').is(':checked')?1:0);
    formData.append('valor_pagado',$('#valorPagado').val());
    formData.append('referencia_pago',$('#referenciaPago').val());
    formData.append('observacion',$('#observacionInscripcion').val());

    apiRequest({
        url:`${apiUrl}/torneos/actualizar-inscripcion/${id}`,
        type:'POST',
        data:formData
    })
    .then(()=>{
        Swal.fire(
            'Éxito',
            'Inscripción actualizada.',
            'success'
        );

        $('#modalEditarInscripcion').modal('hide');
        cargarTablasInscripciones(torneoInscripciones);
    })
    .catch(e=>validarRespuesta(e,'No fue posible actualizar la inscripción'));
}

function limpiarFormularioInscripcion(){
    inscripcionActual=null;
    $('#inscripcionId').val('');
    $('#infoDeportista,#infoCategoria,#infoValorCategoria').text('');
    $('#estadoInscripcion').empty();
    $('#pagoInscripcion,#pagoCompleto').prop('checked',false);
    $('#valorPagado,#referenciaPago,#observacionInscripcion').val('');
}

function cargarEstadosInscripcion(selected=null){
    apiRequest({
        url:`${apiUrl}/select/estados-inscripcion`,
        type:'GET'
    })
    .then(estados=>{
        const select=$('#estadoInscripcion');
        select.empty();
        estados.forEach(e=>{
            select.append(
                new Option(
                    e.nombre,
                    e.id,
                    e.id==selected,
                    e.id==selected
                )
            );
        });
    })
    .catch(err=>{
        validarRespuesta(err,'No fue posible cargar los estados.');
    });

}
