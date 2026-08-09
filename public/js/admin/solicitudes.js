$(document).ready(function () {
    const acciones = ['ver', 'autorizar'];
    const modulo = 'solicitudes';

    const solicitudesApiUrl = `${apiUrl}/solicitudes`;

    initSolicitudesTable();
    bindEvents();
    validarPermisos(modulo, acciones);

    function initSolicitudesTable() {
        if ($.fn.DataTable.isDataTable('#solicitudesTable')) {
            $('#solicitudesTable').DataTable().destroy();
        }

        $('#solicitudesTable').DataTable({
            ajax: function (data, callback) {
                datatableAjax(solicitudesApiUrl)
                    .then(response => callback({ data: response }))
                    .catch(err => {
                        callback({ data: [] });
                        validarRespuesta(
                            err,
                            'No se pudo cargar el listado de solicitudes'
                        );
                    });
            },
            columns: [
                { data: 'id' },
                {
                    data: 'tipo',
                    className: 'text-center',
                    render: data => `
                        <span class="badge bg-primary text-uppercase">
                            ${data}
                        </span>
                    `
                },
                {
                    data: 'usuario',
                    render: data => `${data.nombre} ${data.apellido}`
                },
                {
                    data: 'estado',
                    className: 'text-center',
                    render: function (data) {
                        let color = 'secondary';
                        let texto = data;

                        if (data === 'pendiente') {
                            color = 'warning';
                            texto = 'Pendiente';
                        }

                        if (data === 'aprobada') {
                            color = 'success';
                            texto = 'Aprobada';
                        }

                        if (data === 'rechazada') {
                            color = 'danger';
                            texto = 'Rechazada';
                        }

                        return `
                            <span class="badge bg-${color}">
                                ${texto}
                            </span>
                        `;
                    }
                },
                { data: 'created_at' },
                {
                    data: null,
                    orderable: false,
                    render: function (data) {
                        return `
                            <div class="d-flex justify-content-center gap-2">
                                <button
                                    class="btnVer btn btn-info btn-sm d-none"
                                    data-id="${data.id}"
                                    title="Ver">
                                    <i data-lucide="eye" class="icono-tabla"></i>
                                </button>
                                <button
                                    class="btnAutorizar btn btn-success btn-sm d-none"
                                    data-id="${data.id}"
                                    title="Autorizar">
                                    <i data-lucide="clipboard-check" class="icono-tabla"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            language: {
                url: dataTablesLangUrl
            },

            drawCallback: function () {
                lucide.createIcons();
            }

        });

        $('#solicitudesTable').on('draw.dt', function () {
            validarPermisos(modulo, acciones);
        });
    }

    function bindEvents() {
        $('#solicitudesTable').on('click', '.btnVer', function () {
            const id = $(this).data('id');
            verSolicitud(id);
        });

        $('#solicitudesTable').on('click', '.btnAutorizar', function () {
            const id = $(this).data('id');
            autorizarSolicitud(id);
        });

        $('#btnGuardarAutorizacion').on('click', guardarAutorizacion);
    }

    function verSolicitud(id) {
        apiRequest({
            url: `${solicitudesApiUrl}/${id}`,
            type: 'GET'
        })
        .then(solicitud => {
            $('#solicitudModalLabel').text(
                solicitud.tipo === 'club'
                    ? 'Solicitud de Club'
                    : 'Solicitud de Deportista'
            );

            let badge = 'secondary';
            if (solicitud.estado === 'pendiente') badge = 'warning';
            if (solicitud.estado === 'aprobada') badge = 'success';
            if (solicitud.estado === 'rechazada') badge = 'danger';

            $('#solicitudEstado').html(`
                <span class="badge bg-${badge} fs-6 px-3 py-2 rounded-pill d-flex align-items-center gap-2">
                    <i data-lucide="clock-3" style="width:16px;height:16px"></i>
                    ${solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                </span>
            `);

            $('#solicitudDetalle').html(
                solicitud.tipo === 'club'
                    ? obtenerDetalleClub(solicitud)
                    : obtenerDetalleDeportista(solicitud)
            );

            lucide.createIcons();
            $('#solicitudModal').modal('show');
        })
        .catch(xhr => {
            validarRespuesta(xhr,'No se pudo cargar la solicitud');
        });
    }

    function obtenerDetalleClub(solicitud) {
        return `
            <div class="row g-4">
                <div class="col-lg-4">
                    ${cardImagen(
                        `${apiUrlBase}/storage/${solicitud.club.imagen_path}`,
                        solicitud.club.nombre
                    )}
                    ${cardDocumento(
                        `${apiUrlBase}/storage/${solicitud.club.documento_path}`
                    )}
                </div>
                <div class="col-lg-8">
                    ${cardInformacion(
                        'user',
                        'Información del Solicitante',
                        [
                            ['Nombre', `${solicitud.usuario.nombre} ${solicitud.usuario.apellido}`],
                            ['Documento', solicitud.usuario.numero_identificacion],
                            ['Correo', solicitud.usuario.email],
                            ['Teléfono', solicitud.usuario.telefono]
                        ]
                    )}
                    ${cardInformacion(
                        'shield',
                        'Información del Club',
                        [
                            ['Nombre', solicitud.club.nombre],
                            ['Dirección', solicitud.club.direccion],
                            ['Descripción', solicitud.club.descripcion]
                        ]
                    )}
                </div>
            </div>
        `;
    }

    function obtenerDetalleDeportista(solicitud) {
        return `
            <div class="row g-4">
                <div class="col-lg-4">
                    ${cardImagen(
                        `${apiUrlBase}/storage/${solicitud.usuario.imagen_path}`,
                        solicitud.usuario.nombre
                    )}

                    ${cardDocumento(
                        `${apiUrlBase}/storage/${solicitud.deportista.documento_path}`
                    )}
                </div>

                <div class="col-lg-8">
                    ${cardInformacion(
                        'user',
                        'Información del Solicitante',
                        [
                            ['Nombre', `${solicitud.usuario.nombre} ${solicitud.usuario.apellido}`],
                            ['Documento', solicitud.usuario.numero_identificacion],
                            ['Correo', solicitud.usuario.email],
                            ['Teléfono', solicitud.usuario.telefono]
                        ]
                    )}

                    ${cardInformacion(
                        'trophy',
                        'Información del Deportista',
                        [
                            ['FIDE ID', solicitud.deportista.fide_id],
                            ['Fecha de Nacimiento', solicitud.deportista.fecha_nacimiento]
                        ]
                    )}
                </div>
            </div>
        `;
    }

    function obtenerDetalleDeportista(solicitud) {
        return `
            <div class="row g-4">
                <div class="col-lg-4">
                    ${cardImagen(
                        `${apiUrlBase}/storage/${solicitud.usuario.imagen_path}`,
                        solicitud.usuario.nombre
                    )}
                    ${cardDocumento(
                        `${apiUrlBase}/storage/${solicitud.deportista.documento_path}`
                    )}
                </div>

                <div class="col-lg-8">
                    ${cardInformacion(
                        'user',
                        'Información del Solicitante',
                        [
                            ['Nombre', `${solicitud.usuario.nombre} ${solicitud.usuario.apellido}`],
                            ['Documento', solicitud.usuario.numero_identificacion],
                            ['Correo', solicitud.usuario.email],
                            ['Teléfono', solicitud.usuario.telefono]
                        ]
                    )}
                    ${cardInformacion(
                        'trophy',
                        'Información del Deportista',
                        [
                            ['FIDE ID', solicitud.deportista.fide_id],
                            ['Fecha de Nacimiento', solicitud.deportista.fecha_nacimiento]
                        ]
                    )}
                </div>
            </div>
        `;
    }

    function cardImagen(src, titulo) {
        return `
            <div class="card shadow-sm border-0 mb-4">
                <img
                    src="${src}"
                    class="card-img-top"
                    style="
                        height:250px;
                        object-fit:cover;
                    ">
                <div class="card-body text-center">
                    <h6 class="fw-bold mb-0">
                        ${titulo}
                    </h6>
                </div>
            </div>
        `;
    }

    function cardDocumento(src) {
        return `
            <div class="card shadow-sm border-0">
                <div class="card-header fw-semibold">
                    <i data-lucide="file-text" class="me-2"></i>
                    Documento
                </div>
                <div class="card-body">
                    <iframe
                        src="${src}#toolbar=0"
                        style="
                            width:100%;
                            height:280px;
                            border-radius:8px;
                            border:1px solid #dee2e6;
                        ">
                    </iframe>
                    <div class="d-grid mt-3">
                        <a
                            href="${src}"
                            target="_blank"
                            class="btn btn-primary">
                            Ver documento completo
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    function cardInformacion(icono, titulo, campos) {
        return `
            <div class="card shadow-sm border-0 mb-4">
                <div class="card-header fw-bold">
                    <i data-lucide="${icono}" class="me-2"></i>
                    ${titulo}
                </div>
                <div class="card-body">
                    <div class="row">
                        ${campos.map(campoDetalle).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    function campoDetalle(campo) {
        return `
            <div class="col-md-6 mb-4">
                <div class="text-secondary small">
                    ${campo[0]}
                </div>
                <div class="fw-semibold fs-6">
                    ${campo[1] ?? '-'}
                </div>
            </div>
        `;
    }

    function autorizarSolicitud(id) {
        limpiarCamposRequeridos('#autorizacionModal');
        $('#comentarioSolicitud').val('');
        $('input[name="estadoSolicitud"]').prop('checked',false);

        apiRequest({
            url:`${solicitudesApiUrl}/${id}`,
            type:'GET'
        }).then(solicitud=>{
            $('#autorizacionSolicitudId').val(solicitud.id);
            $('#autorizacionSolicitudInfo').html(`
                <div><b>Tipo:</b> ${solicitud.tipo.charAt(0).toUpperCase()+solicitud.tipo.slice(1)}</div>
                <div><b>Solicitante:</b> ${solicitud.usuario.nombre} ${solicitud.usuario.apellido}</div>
                <div><b>Estado actual:</b> ${solicitud.estado}</div>
            `);

            $('#autorizacionModal').modal('show');
        }).catch(xhr=>{
            validarRespuesta(xhr,'No se pudo cargar la solicitud');
        });
    }

    function guardarAutorizacion() {
        if(!validarCamposRequeridos('#autorizacionModal')){
            Swal.fire('Advertencia','Completa los campos obligatorios.','warning');
            return;
        }

        const estado=$('input[name="estadoSolicitud"]:checked').val();

        if(!estado){
            Swal.fire('Advertencia','Selecciona una decisión.','warning');
            return;
        }

        const id=$('#autorizacionSolicitudId').val();

        apiRequest({
            url:`${solicitudesApiUrl}/${id}`,
            type:'PUT',
            data:JSON.stringify({
                estado,
                comentario:$('#comentarioSolicitud').val()
            }),
            contentType:'application/json'
        }).then(()=>{
            Swal.fire('Éxito','Solicitud actualizada correctamente.','success');
            $('#autorizacionModal').modal('hide');
            $('#solicitudesTable').DataTable().ajax.reload(null,false);
        }).catch(xhr=>{
            validarRespuesta(xhr,'No se pudo actualizar la solicitud');
        });
    }
});
