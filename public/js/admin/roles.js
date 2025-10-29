$(document).ready(function () {
    const acciones = ['ver', 'crear', 'editar', 'eliminar', 'permisos'];
    const modulo = "roles";

    initRolesTable();
    bindEvents();
    validarPermisos(modulo, acciones);

    let rolActualId = null;
    let rolActualNombre = null;

    if (!token) {
        window.location.href = loginUrl;
        return;
    }

    function initRolesTable() {
        if ($.fn.DataTable.isDataTable('#rolesTable')) {
            $('#rolesTable').DataTable().destroy();
        }
        $('#rolesTable').DataTable({
            ajax: function(data, callback, settings) {
                datatableAjax(`${apiUrl}/roles`)
                    .then(response => {
                        callback({ data: response });
                    })
                    .catch(err => {
                        callback({ data: [] });
                        let mensaje = 'No se pudo cargar el listado de roles';
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
                                <button class="btnPermisos btn btn-info btn-sm d-flex align-items-center gap-1" data-id="${data.id}" data-nombre="${data.nombre} ${data.apellido}" title="Permisos">
                                    <i data-lucide="shield-check" class="icono-tabla"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            language: { url: dataTablesLangUrl },
            drawCallback: function () {
                lucide.createIcons(); // <- Esto vuelve a renderizar los iconos al redibujar
            }
        });
        $('#rolesTable').on('draw.dt', function () {
            validarPermisos(modulo, acciones);
        });
    }

    function bindEvents() {
        $('.btnNuevo').on('click', function () {
            $('#rolForm')[0].reset();
            limpiarFormulario();
            $('#rolId').val('');
            $('#rolModalLabel').text('Nuevo Rol');
            $('#previewImagen').attr('src', '').addClass('d-none');
            $('#rolModal').modal('show');
        });

        $('#btnGuardar').on('click', function () {
            guardarRol();
        });

        $('#rolesTable').on('click', '.btnEditar', function () {
            const id = $(this).data('id');
            limpiarFormulario();
            editarRol(id);
        });

        $('#rolesTable').on('click', '.btnEliminar', function () {
            const id = $(this).data('id');
            eliminarRol(id);
        });

        $('#logoutBtn').on('click', function () {
            sessionStorage.removeItem('token');
            window.location.href = loginUrl;
        });

        $('#rolesTable').on('click', '.btnPermisos', function () {
            const id = $(this).data('id');
            const nombre = $(this).data('nombre');
            mostrarPermisosRol(id, nombre);
        });

        $('#tablaPermisosRol').on('click', '.btnQuitarPermiso', function () {
            const permiso = $(this).data('permiso');
            const rol = $(this).data('rol');
            quitarPermisoRol(permiso, rol);
        });

        $('#btnAgregarPermiso').on('click', function () {
            if (!rolActualId) return;
            cargarPermisosDisponibles(rolActualId);
        });
    }

    $(document).on('input change', '.required', function() {
        if ($(this).val()?.trim()) {
            $(this).removeClass('is-invalid');
            $(this).next('.invalid-feedback').remove();
        }
    });

    function guardarRol() {
        if (!validarCamposRequeridos('#rolForm')) {
            Swal.fire('Advertencia', 'Por favor completa los campos obligatorios.', 'warning');
            return;
        }
        const id = $('#rolId').val();
        const data = {
            nombre: $('#nombre').val(),
            descripcion: $('#descripcion').val(),
        };

        console.log("id: " + id);
        console.log("data: " + data);

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/roles/${id}` : `${apiUrl}/roles`;   

        $('#rolForm .is-invalid').removeClass('is-invalid');
        $('#rolForm .invalid-feedback').remove();

        apiRequest({
            url,
            type: method,
            data: JSON.stringify(data),
            contentType: 'application/json'
        })
        .then(() => {
            Swal.fire('Éxito', 'Rol guardado correctamente', 'success');
            $('#rolModal').modal('hide');
            $('#rolesTable').DataTable().ajax.reload(null, false);
        })
        .catch(xhr => {
            let mensaje = 'No se pudo guardar el rol';
            validarRespuesta(xhr, mensaje);
        });
    }

    function validarRespuesta(xhr, mensaje) {
        console.error('Error en la solicitud:', xhr);
            let titulo = 'Error';
            let icono = 'error';

            if (xhr.responseJSON) {
                const res = xhr.responseJSON;
                // Error de validación (422)
                if (res.errors) {
                    titulo = 'Advertencia';
                    icono = 'warning';
                    const errores = Object.values(res.errors).flat();
                    mensaje = errores.join('<br>');
                }
                // Error de permisos (403)
                else if (res.message && xhr.status === 403) {
                    titulo = 'Advertencia';
                    icono = 'warning';
                    mensaje = 'No tienes permiso para realizar esta acción.';
                }
                // Mensaje genérico del backend
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

    function editarRol(id) {
        apiRequest({ url: `${apiUrl}/roles/${id}`, type: 'GET' })
        .then(rol => {
            $('#rolModalLabel').text('Editar Rol');
            $('#rolId').val(rol.id);
            $('#nombre').val(rol.nombre);
            $('#descripcion').val(rol.descripcion);
            $('#rolModal').modal('show');
        })
        .catch(xhr => {
            let mensaje = 'No se pudo editar el rol';
            validarRespuesta(xhr, mensaje);
        });
    }

    function eliminarRol(id) {
        Swal.fire({
            title: '¿Eliminar rol?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                apiRequest({ url: `${apiUrl}/roles/${id}`, type: 'DELETE' })
                .then(() => {
                    Swal.fire('Eliminado', 'Rol eliminado correctamente', 'success');
                    $('#rolesTable').DataTable().ajax.reload(null, false);
                })
                .catch(xhr => {
                    let mensaje = 'No se pudo eliminar el rol';
                    validarRespuesta(xhr, mensaje);
                });
            }
        });
    }

    function limpiarFormulario() {
        $('#rolId').val('');
        $('#nombre, #descripcion').val('');
        limpiarCamposRequeridos('#rolForm');
    }

    function mostrarPermisosRol(rolId, nombre) {
        rolActualId = rolId;
        rolActualNombre = nombre;
        apiRequest({
            url: `${apiUrl}/roles/${rolId}/permisos`,
            type: 'GET'
        }).then(data => {
            $('#permisosTitulo').text('Permisos del Rol: ' + nombre);
            $('#tituloRol').text(`Permisos por Rol: ${data.nombre_rol}`);

            if ($.fn.DataTable.isDataTable('#tablaPermisosRol')) {
                $('#tablaPermisosRol').DataTable().destroy();
            }

            $('#tablaPermisosRol').DataTable({
                data: data.permisos_rol,
                columns: [
                    { data: 'nombre', title: 'Nombre' },
                    { data: 'descripcion', title: 'Descripción', defaultContent: '' },
                    {
                        data: null,
                        title: 'Acciones',
                        orderable: false,
                        render: function (permiso) {
                            return `
                                <button class="btn btn-danger btn-sm btnQuitarPermiso"
                                        data-permiso="${permiso.id}"
                                        data-rol="${data.rol_id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            `;
                        }
                    }
                ],
                columnDefs: [
                    {
                        targets: 2,
                        className: 'text-center align-middle'
                    }
                ],
                language: { url: dataTablesLangUrl },
                paging: true,
                searching: true,
                info: false
            });

            // Mostrar el modal
            $('#modalPermisos').modal('show');

        }).catch(xhr => {
            console.error('Error cargando permisos:', xhr);
            alert('No se pudieron cargar los permisos del rol.');
        });
    }

    function quitarPermisoRol(permiso, rol) {
        Swal.fire({
            title: '¿Eliminar Permiso del Rol?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const data = {
                    id: rol,
                    permiso: permiso,
                    tipo: "rol"
                };
                apiRequest({
                    url: `${apiUrl}/permisos/quitar/permiso`,
                    type: 'DELETE',
                    data: JSON.stringify(data),
                }).then(data => {
                    Swal.fire('Éxito', 'Permiso Eliminado del Rol', 'success');
                    mostrarPermisosRol(rol, rolActualNombre);
                }).catch(xhr => {
                    console.error('Error cargando permisos:', xhr);
                    alert('No se pudieron cargar los permisos del rol.');
                });
            }
        });
    }

    function cargarPermisosDisponibles(rolId) {
        $('#permisosDisponiblesTitulo').text('Asignar Permiso al Rol: ' + rolActualNombre);
        $('#tablaPermisosDisponibles tbody').html(`
            <tr><td colspan="3" class="text-center text-muted">Cargando permisos...</td></tr>
        `);

        apiRequest({
            url: `${apiUrl}/roles/${rolId}/permisos-disponibles`,
            type: 'GET'
        }).then(data => {
            const tbody = $('#tablaPermisosDisponibles tbody');
            tbody.empty();

            if ($.fn.DataTable.isDataTable('#tablaPermisosDisponibles')) {
                $('#tablaPermisosDisponibles').DataTable().destroy(); // evita duplicados
            }

            if (data.length > 0) {
                $('#tablaPermisosDisponibles').DataTable({
                    data: data,
                    columns: [
                        { data: 'nombre', title: 'Nombre' },
                        { data: 'descripcion', title: 'Descripción', defaultContent: '' },
                        {
                            data: null,
                            title: 'Acción',
                            orderable: false,
                            render: function (p) {
                                return `
                                    <button class="btn btn-success btn-sm btnAsignarPermiso"
                                            data-permiso="${p.id}"
                                            data-rol="${rolId}">
                                        <i class="bi bi-check-circle"></i>
                                    </button>
                                `;
                            }
                        }
                    ],
                    columnDefs: [
                        {
                            targets: 2, // columna Acción
                            className: 'text-center align-middle'
                        }
                    ],
                    language: { url: dataTablesLangUrl },
                    paging: true,
                    searching: true,
                    info: false
                });
            } else {
                tbody.html(`
                    <tr><td colspan="3" class="text-center text-muted">
                        No hay permisos disponibles para asignar
                    </td></tr>
                `);
            }

            $('#modalAgregarPermiso').modal('show');
        }).catch(xhr => {
            console.error('Error cargando permisos disponibles:', xhr);
            Swal.fire('Error', 'No se pudieron cargar los permisos disponibles.', 'error');
        });
    }

    $('#tablaPermisosDisponibles').on('click', '.btnAsignarPermiso', function () {
        const permiso = $(this).data('permiso');
        const rol = $(this).data('rol');

        Swal.fire({
            title: '¿Asignar este permiso?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, asignar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const data = {
                    id: rol,
                    permiso: permiso,
                    tipo: "rol"
                };
                apiRequest({
                    url: `${apiUrl}/permisos/asignar`,
                    type: 'POST',
                    data: JSON.stringify(data)
                }).then(res => {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Permiso asignado correctamente',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    mostrarPermisosRol(rolActualId, rolActualNombre);
                    cargarPermisosDisponibles(rolActualId);
                }).catch(xhr => {
                    console.error('Error asignando permiso:', xhr);
                    Swal.fire('Error', 'No se pudo asignar el permiso.', 'error');
                });
            }
        });
    });
});
