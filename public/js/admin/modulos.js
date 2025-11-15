$(document).ready(function () {
    const acciones = ['ver', 'crear', 'editar', 'eliminar'];
    const modulo = "modulos"; 

    const modulosApiUrl = `${apiUrl}/modulos`;

    initModulosTable();
    bindEvents();
    validarPermisos(modulo, acciones); 

    if (!token) { 
        window.location.href = loginUrl; 
        return;
    }

    function initModulosTable() {
        if ($.fn.DataTable.isDataTable('#modulosTable')) {
            $('#modulosTable').DataTable().destroy();
        }
        $('#modulosTable').DataTable({
            ajax: function(data, callback, settings) {
                datatableAjax(modulosApiUrl) 
                    .then(response => {
                        callback({ data: response });
                    })
                    .catch(err => {
                        callback({ data: [] });
                        let mensaje = 'No se pudo cargar el listado de módulos';
                        validarRespuesta(err, mensaje); 
                    });
            },
            columns: [
                { data: 'id' },
                { data: 'nombre' },
                { data: 'descripcion' },
                {
                    data: null,
                    render: function (data) {
                        return `
                            <div class="d-flex justify-content-center gap-2">
                                <button class="btnEditar btn btn-warning btn-sm d-none d-flex align-items-center gap-1" data-id="${data.id}" title="Editar">
                                    <i data-lucide="pencil-line" class="icono-tabla"></i>
                                </button>
                                <button class="btnEliminar btn btn-danger btn-sm d-none d-flex align-items-center gap-1" data-id="${data.id}" title="Eliminar">
                                    <i data-lucide="trash-2" class="icono-tabla"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            language: { url: dataTablesLangUrl },
            drawCallback: function () {
                lucide.createIcons(); 
            }
        });
        $('#modulosTable').on('draw.dt', function () {
            validarPermisos(modulo, acciones);
        });
    }

    function bindEvents() {
        $('.btnNuevo').on('click', function () {
            $('#moduloForm')[0].reset();
            limpiarFormulario();
            $('#moduloId').val('');
            $('#moduloModalLabel').text('Nuevo Módulo');
            $('#moduloModal').modal('show');
        });

        
        $('#btnGuardar').on('click', function () {
            guardarModulo();
        });

        
        $('#modulosTable').on('click', '.btnEditar', function () {
            const id = $(this).data('id');
            limpiarFormulario();
            editarModulo(id);
        });

        
        $('#modulosTable').on('click', '.btnEliminar', function () {
            const id = $(this).data('id');
            eliminarModulo(id);
        });

        
        $('#logoutBtn').on('click', function () {
            sessionStorage.removeItem('token');
            window.location.href = loginUrl;
        });
    }

    
    $(document).on('input change', '.required', function() {
        if ($(this).val()?.trim()) {
            $(this).removeClass('is-invalid');
            $(this).next('.invalid-feedback').remove();
        }
    });

    function guardarModulo() {
        if (!validarCamposRequeridos('#moduloForm')) { 
            Swal.fire('Advertencia', 'Por favor completa los campos obligatorios.', 'warning');
            return;
        }
        const id = $('#moduloId').val();
        const data = {
            nombre: $('#nombre').val(),
            descripcion: $('#descripcion').val(),
        };

        
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${modulosApiUrl}/${id}` : modulosApiUrl; 
        $('#moduloForm .is-invalid').removeClass('is-invalid');
        $('#moduloForm .invalid-feedback').remove();

        apiRequest({ 
            url,
            type: method,
            data: JSON.stringify(data),
            contentType: 'application/json'
        })
        .then(() => {
            Swal.fire('Éxito', 'Módulo guardado correctamente', 'success');
            $('#moduloModal').modal('hide');
            $('#modulosTable').DataTable().ajax.reload(null, false);
        })
        .catch(xhr => {
            let mensaje = 'No se pudo guardar el módulo';
            validarRespuesta(xhr, mensaje); 
        });
    }

    function editarModulo(id) {
        apiRequest({ url: `${modulosApiUrl}/${id}`, type: 'GET' })
        .then(modulo => {
            $('#moduloModalLabel').text('Editar Módulo');
            $('#moduloId').val(modulo.id);
            $('#nombre').val(modulo.nombre);
            $('#descripcion').val(modulo.descripcion);
            $('#moduloModal').modal('show');
        })
        .catch(xhr => {
            let mensaje = 'No se pudo cargar el módulo';
            validarRespuesta(xhr, mensaje);
        });
    }

    function eliminarModulo(id) {
        Swal.fire({
            title: '¿Eliminar módulo?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                apiRequest({ url: `${modulosApiUrl}/${id}`, type: 'DELETE' })
                .then(() => {
                    Swal.fire('Eliminado', 'Módulo eliminado correctamente', 'success');
                    $('#modulosTable').DataTable().ajax.reload(null, false);
                })
                .catch(xhr => {
                    let mensaje = 'No se pudo eliminar el módulo';
                    validarRespuesta(xhr, mensaje);
                });
            }
        });
    }

    function limpiarFormulario() {
        $('#moduloId').val('');
        $('#nombre, #descripcion').val('');
        limpiarCamposRequeridos('#moduloForm'); 
    }
});