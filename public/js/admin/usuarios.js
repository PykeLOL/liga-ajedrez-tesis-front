$(document).ready(function () {
    const acciones = ['ver', 'crear', 'editar', 'eliminar', 'permisos'];
    const modulo = "usuarios";

    initUsuariosTable();
    bindEvents();
    validarPermisos(modulo, acciones);

    let usuarioActualId = null;
    let usuarioActualNombre = null;

    if (!token) {
        window.location.href = loginUrl;
        return;
    }

    function initUsuariosTable() {
        if ($.fn.DataTable.isDataTable('#usuariosTable')) {
            $('#usuariosTable').DataTable().destroy();
        }
        $('#usuariosTable').DataTable({
            ajax: function(data, callback, settings) {
                datatableAjax(`${apiUrl}/usuarios`)
                    .then(response => {
                        callback({ data: response });
                    })
                    .catch(err => {
                        callback({ data: [] });
                        let mensaje = 'No se pudo cargar el listado de usuarios';
                        validarRespuesta(err, mensaje);
                    });
            },
            columns: [
                { data: 'id' },
                {
                    data: 'imagen_path',
                    render: function (path) {
                        const baseUrl = apiUrl.replace('/api', '');
                        if (path)
                            return `<img src="${baseUrl}/storage/${path}" class="rounded-circle" width="40" height="40">`;
                        else
                            return `<img src="${baseUrl}/storage/usuarios/default-user.png" class="rounded-circle" width="40" height="40">`;
                    }
                },
                { data: 'nombre' },
                { data: 'apellido' },
                { data: 'email' },
                { data: 'documento' },
                { data: 'telefono' },
                { data: 'rol' },
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
        $('#usuariosTable').on('draw.dt', function () {
            validarPermisos(modulo, acciones);
        });
    }

    function bindEvents() {
        $('.btnNuevo').on('click', function () {
            $('#usuarioForm')[0].reset();
            limpiarFormulario();
            loadRoles();
            $('#userId').val('');
            $('#usuarioModalLabel').text('Nuevo Usuario');
            $('#previewImagen').attr('src', '').addClass('d-none');
            $('#usuarioModal').modal('show');
        });

        $('#btnGuardar').on('click', function () {
            guardarUsuario();
        });

        $('#usuariosTable').on('click', '.btnEditar', function () {
            const id = $(this).data('id');
            limpiarFormulario();
            editarUsuario(id);
        });

        $('#usuariosTable').on('click', '.btnEliminar', function () {
            const id = $(this).data('id');
            eliminarUsuario(id);
        });

        $('#usuariosTable').on('click', '.btnPermisos', function () {
            const id = $(this).data('id');
            const nombre = $(this).data('nombre');
            mostrarPermisosUsuario(id, nombre);
        });

        $('#tablaPermisosUsuario').on('click', '.btnQuitarPermiso', function () {
            const permiso = $(this).data('permiso');
            const usuario = $(this).data('usuario');
            quitarPermisoUsuario(permiso, usuario);
        });

        $('#btnAgregarPermiso').on('click', function () {
            if (!usuarioActualId) return;
            cargarPermisosDisponibles(usuarioActualId);
        });
    }

    function loadRoles(selectedId = null) {
        apiRequest({
            url: `${apiUrl}/roles`,
            type: 'GET'
        })
        .then(roles => {
            const $rolSelect = $('#rol_id');
            $rolSelect.empty().append('<option value="">Seleccione un rol</option>');
            roles.forEach(r => {
                $rolSelect.append(new Option(r.nombre, r.id, false, false));
            });
            if ($rolSelect.hasClass('select2-hidden-accessible')) {
                $rolSelect.trigger('change.select2');
            } else {
                $rolSelect.select2({
                    placeholder: 'Seleccione un rol',
                    allowClear: true,
                    width: 'resolve',
                    dropdownParent: $('#usuarioModal')
                });
            }
            if (selectedId) {
                $rolSelect.val(selectedId).trigger('change');
            }
        })
        .catch(xhr => console.error('Error cargando roles:', xhr));
    }

    $(document).on('input change', '.required', function() {
        if ($(this).val()?.trim()) {
            $(this).removeClass('is-invalid');
            $(this).next('.invalid-feedback').remove();
        }
    });

    function guardarUsuario() {
        if (!validarCamposRequeridos('#usuarioForm')) {
            Swal.fire('Advertencia', 'Por favor completa los campos obligatorios.', 'warning');
            return;
        }
        const id = $('#userId').val();
        const data = {
            nombre: $('#nombre').val(),
            apellido: $('#apellido').val(),
            email: $('#email').val(),
            documento: $('#documento').val(),
            telefono: $('#telefono').val(),
            rol_id: $('#rol_id').val(),
            imagen_base64: imagenBase64,
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/usuarios/${id}` : `${apiUrl}/usuarios/admin`;

        $('#usuarioForm .is-invalid').removeClass('is-invalid');
        $('#usuarioForm .invalid-feedback').remove();

        apiRequest({
            url,
            type: method,
            data: JSON.stringify(data),
            contentType: 'application/json'
        })
        .then(() => {
            Swal.fire('Éxito', 'Usuario guardado correctamente', 'success');
            $('#usuarioModal').modal('hide');
            $('#usuariosTable').DataTable().ajax.reload(null, false);
        })
        .catch(xhr => {
            let mensaje = 'No se pudo guardar el usuario';
            validarRespuesta(xhr, mensaje);
        });
    }

    function editarUsuario(id) {
        apiRequest({ url: `${apiUrl}/usuarios/${id}`, type: 'GET' })
        .then(user => {
            $('#usuarioModalLabel').text('Editar Usuario');
            $('#userId').val(user.id);
            $('#nombre').val(user.nombre);
            $('#apellido').val(user.apellido);
            $('#email').val(user.email);
            $('#documento').val(user.documento);
            $('#telefono').val(user.telefono);
            loadRoles(user.rol_id);

            const baseUrl = apiUrl.replace('/api', '');
            const imageUrl = user.imagen_path
                ? `${baseUrl}/storage/${user.imagen_path}`
                : `${baseUrl}/storage/usuarios/default-user.png`;
            $('#previewImagen').attr('src', imageUrl).removeClass('d-none');
            setTimeout(() => { $('#rol_id').val(user.rol_id); }, 300);
            $('#usuarioModal').modal('show');
        })
        .catch(xhr => {
            let mensaje = 'No se pudo editar el usuario';
            validarRespuesta(xhr, mensaje);
        });
    }

    function eliminarUsuario(id) {
        Swal.fire({
            title: '¿Eliminar usuario?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                apiRequest({ url: `${apiUrl}/usuarios/${id}`, type: 'DELETE' })
                .then(() => {
                    Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
                    $('#usuariosTable').DataTable().ajax.reload(null, false);
                })
                .catch(xhr => {
                    let mensaje = 'No se pudo eliminar el usuario';
                    validarRespuesta(xhr, mensaje);
                });
            }
        });
    }

    function limpiarFormulario() {
        $('#userId').val('');
        $('#nombre, #apellido, #email, #documento, #telefono, #password, #imagen').val('');
        $('#rol_id').empty();
        imagenBase64 = null;
        limpiarCamposRequeridos('#usuarioForm');
    }

    let imagenBase64 = null;

    $('#imagen').on('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagenBase64 = e.target.result;
                $('#previewImagen').attr('src', imagenBase64).show();
            };
            reader.readAsDataURL(file);
        }
    });

    function mostrarPermisosUsuario(usuarioId, nombre) {
        usuarioActualId = usuarioId;
        usuarioActualNombre = nombre;
        apiRequest({
            url: `${apiUrl}/usuarios/${usuarioId}/permisos`,
            type: 'GET'
        }).then(data => {
            $('#permisosTitulo').text('Permisos del Usuario: ' + nombre);
            $('#tituloRol').text(`Permisos por Rol: ${data.nombre_rol}`);

            if ($.fn.DataTable.isDataTable('#tablaPermisosUsuario')) {
                $('#tablaPermisosUsuario').DataTable().destroy();
            }

            $('#tablaPermisosUsuario').DataTable({
                data: data.permisos_usuario,
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
                                        data-usuario="${data.usuario_id}">
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

            // --- Inicializar tabla permisos por rol ---
            if ($.fn.DataTable.isDataTable('#tablaPermisosRol')) {
                $('#tablaPermisosRol').DataTable().destroy();
            }

            $('#tablaPermisosRol').DataTable({
                data: data.permisos_rol,
                columns: [
                    { data: 'nombre', title: 'Nombre' },
                    { data: 'descripcion', title: 'Descripción', defaultContent: '' }
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
            alert('No se pudieron cargar los permisos del usuario.');
        });
    }

    function quitarPermisoUsuario(permiso, usuario) {
        Swal.fire({
            title: '¿Eliminar Permiso del Usuario?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const data = {
                    id: usuario,
                    permiso: permiso,
                    tipo: "usuario"
                };
                apiRequest({
                    url: `${apiUrl}/permisos/quitar/permiso`,
                    type: 'DELETE',
                    data: JSON.stringify(data),
                }).then(data => {
                    Swal.fire('Éxito', 'Permiso Eliminado del Usuario', 'success');
                    mostrarPermisosUsuario(usuario, usuarioActualNombre);
                }).catch(xhr => {
                    console.error('Error cargando permisos:', xhr);
                    alert('No se pudieron cargar los permisos del usuario.');
                });
            }
        });
    }

    function cargarPermisosDisponibles(usuarioId) {
        $('#permisosDisponiblesTitulo').text('Asignar Permiso al Usuario: ' + usuarioActualNombre);
        $('#tablaPermisosDisponibles tbody').html(`
            <tr><td colspan="3" class="text-center text-muted">Cargando permisos...</td></tr>
        `);

        apiRequest({
            url: `${apiUrl}/usuarios/${usuarioId}/permisos-disponibles`,
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
                                            data-usuario="${usuarioId}">
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
        const usuario = $(this).data('usuario');

        Swal.fire({
            title: '¿Asignar este permiso?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, asignar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const data = {
                    id: usuario,
                    permiso: permiso,
                    tipo: "usuario"
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
                    mostrarPermisosUsuario(usuarioActualId, usuarioActualNombre);
                    cargarPermisosDisponibles(usuarioActualId);
                }).catch(xhr => {
                    console.error('Error asignando permiso:', xhr);
                    Swal.fire('Error', 'No se pudo asignar el permiso.', 'error');
                });
            }
        });
    });
});
