$(document).ready(function () {
    tienePermiso('crear-usuarios').then(puedeCrear => {
        if (puedeCrear) $('#btnNuevo').removeClass('d-none');
    });

    initUsuariosTable();
    bindEvents();

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
                            <button class="editBtn btn btn-warning btn-sm" data-id="${data.id}">Editar</button>
                            <button class="deleteBtn btn btn-danger btn-sm" data-id="${data.id}">Eliminar</button>
                            <button class="permBtn btn btn-info btn-sm" data-id="${data.id}" data-nombre="${data.nombre} ${data.apellido}">Permisos</button>
                        `;
                    }
                }
            ],
            language: { url: dataTablesLangUrl }
        });
    }

    function bindEvents() {
        $('#btnNuevo').on('click', function () {
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

        $('#usuariosTable').on('click', '.editBtn', function () {
            const id = $(this).data('id');
            limpiarFormulario();
            editarUsuario(id);
        });

        $('#usuariosTable').on('click', '.deleteBtn', function () {
            const id = $(this).data('id');
            eliminarUsuario(id);
        });

        $('#logoutBtn').on('click', function () {
            sessionStorage.removeItem('token');
            window.location.href = loginUrl;
        });

        $('#usuariosTable').on('click', '.permBtn', function () {
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
            // Título del rol
            $('#tituloRol').text(`Permisos por Rol: ${data.nombre_rol}`);

            // Limpiar tablas
            $('#tablaPermisosUsuario tbody').empty();
            $('#tablaPermisosRol tbody').empty();
            let usuarioId = data.usuario_id;

            // Llenar permisos por usuario
            if (data.permisos_usuario.length > 0) {
                data.permisos_usuario.forEach(p => {
                    $('#tablaPermisosUsuario tbody').append(`
                        <tr>
                            <td>${p.nombre}</td>
                            <td>${p.descripcion || ''}</td>
                            <td>
                                <button class="btn btn-danger btn-sm btnQuitarPermiso" data-permiso="${p.id}" data-usuario="${usuarioId}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `);
                });
            } else {
                $('#tablaPermisosUsuario tbody').append(`
                    <tr><td colspan="2" class="text-center text-muted">Sin permisos asignados directamente</td></tr>
                `);
            }

            // Llenar permisos por rol
            if (data.permisos_rol.length > 0) {
                data.permisos_rol.forEach(p => {
                    $('#tablaPermisosRol tbody').append(`
                        <tr>
                            <td>${p.nombre}</td>
                            <td>${p.descripcion || ''}</td>
                        </tr>
                    `);
                });
            } else {
                $('#tablaPermisosRol tbody').append(`
                    <tr><td colspan="2" class="text-center text-muted">El rol no tiene permisos asignados</td></tr>
                `);
            }

            // Mostrar modal
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

            if (data.length > 0) {
                data.forEach(p => {
                    tbody.append(`
                        <tr>
                            <td>${p.nombre}</td>
                            <td>${p.descripcion || ''}</td>
                            <td class="text-center">
                                <button class="btn btn-success btn-sm btnAsignarPermiso"
                                        data-permiso="${p.id}" data-usuario="${usuarioId}">
                                    <i class="bi bi-check-circle"></i>
                                </button>
                            </td>
                        </tr>
                    `);
                });
            } else {
                tbody.html(`
                    <tr><td colspan="3" class="text-center text-muted">No hay permisos disponibles para asignar</td></tr>
                `);
            }

            // Mostrar modal sin cerrar el anterior
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
