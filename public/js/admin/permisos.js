$(document).ready(function () {
    const acciones = ['ver', 'crear', 'editar', 'eliminar'];
    const modulo = "permisos";

    initPermisosTable();
    bindEvents();
    validarPermisos(modulo, acciones);

    if (!token) {
        window.location.href = loginUrl;
        return;
    }

    function initPermisosTable() {
        if ($.fn.DataTable.isDataTable('#permisosTable')) {
            $('#permisosTable').DataTable().destroy();
        }
        $('#permisosTable').DataTable({
            ajax: function(data, callback, settings) {
                datatableAjax(`${apiUrl}/permisos`)
                    .then(response => {
                        callback({ data: response });
                    })
                    .catch(err => {
                        callback({ data: [] });
                        let mensaje = 'No se pudo cargar el listado de permisos';
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
        $('#permisosTable').on('draw.dt', function () {
            validarPermisos(modulo, acciones);
        });
    }

    function bindEvents() {
        $('.btnNuevo').on('click', function () {
            $('#permisoForm')[0].reset();
            limpiarFormulario();
            $('#permisoId').val('');
            $('#permisoModalLabel').text('Nuevo Permiso');
            $('#permisoModal').modal('show');
        });

        $('#btnGuardar').on('click', function () {
            guardarPermiso();
        });

        $('#permisosTable').on('click', '.btnEditar', function () {
            const id = $(this).data('id');
            limpiarFormulario();
            editarPermiso(id);
        });

        $('#permisosTable').on('click', '.btnEliminar', function () {
            const id = $(this).data('id');
            eliminarPermiso(id);
        });
    }

    $(document).on('input change', '.required', function() {
        if ($(this).val()?.trim()) {
            $(this).removeClass('is-invalid');
            $(this).next('.invalid-feedback').remove();
        }
    });

    function guardarPermiso() {
        if (!validarCamposRequeridos('#permisoForm')) {
            Swal.fire('Advertencia', 'Por favor completa los campos obligatorios.', 'warning');
            return;
        }
        const id = $('#permisoId').val();
        const data = {
            nombre: $('#nombre').val(),
            descripcion: $('#descripcion').val(),
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/permisos/${id}` : `${apiUrl}/permisos`;

        $('#permisoForm .is-invalid').removeClass('is-invalid');
        $('#permisoForm .invalid-feedback').remove();

        apiRequest({
            url,
            type: method,
            data: JSON.stringify(data),
            contentType: 'application/json'
        })
        .then(() => {
            Swal.fire('Éxito', 'Permiso guardado correctamente', 'success');
            $('#permisoModal').modal('hide');
            $('#permisosTable').DataTable().ajax.reload(null, false);
        })
        .catch(xhr => {
            let mensaje = 'No se pudo guardar el permiso';
            validarRespuesta(xhr, mensaje);
        });
    }

    function validarRespuesta(xhr, mensaje) {
        console.error('Error en la solicitud:', xhr);
            let titulo = 'Error';
            let icono = 'error';

            if (xhr.responseJSON) {
                const res = xhr.responseJSON;
                if (res.errors) {
                    titulo = 'Advertencia';
                    icono = 'warning';
                    const errores = Object.values(res.errors).flat();
                    mensaje = errores.join('<br>');
                }
                else if (res.message && xhr.status === 403) {
                    titulo = 'Advertencia';
                    icono = 'warning';
                    mensaje = 'No tienes permiso para realizar esta acción.';
                }
                else if (res.message) {
                    mensaje = res.message;
                }
            }
            Swal.fire({
                title: titulo,
                html: mensaje,
                icon: icono
            });
    }

    function editarPermiso(id) {
        apiRequest({ url: `${apiUrl}/permisos/${id}`, type: 'GET' })
        .then(permiso => {
            $('#permisoModalLabel').text('Editar Permiso');
            $('#permisoId').val(permiso.id);
            $('#nombre').val(permiso.nombre);
            $('#descripcion').val(permiso.descripcion);
            $('#permisoModal').modal('show');
        })
        .catch(xhr => {
            let mensaje = 'No se pudo editar el permiso';
            validarRespuesta(xhr, mensaje);
        });
    }

    function eliminarPermiso(id) {
        Swal.fire({
            title: '¿Eliminar permiso?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                apiRequest({ url: `${apiUrl}/permisos/${id}`, type: 'DELETE' })
                .then(() => {
                    Swal.fire('Eliminado', 'Permiso eliminado correctamente', 'success');
                    $('#permisosTable').DataTable().ajax.reload(null, false);
                })
                .catch(xhr => {
                    let mensaje = 'No se pudo eliminar el permiso';
                    validarRespuesta(xhr, mensaje);
                });
            }
        });
    }

    function limpiarFormulario() {
        $('#permisoId').val('');
        $('#nombre, #descripcion').val('');
        limpiarCamposRequeridos('#permisoForm');
    }
});
