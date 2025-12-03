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
                { data: 'identificacion' },
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
            loadTiposIdentificacion();
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

        $('#tablaPermisosUsuario').on('change', '.checkQuitarPermiso', function () {
            const id = parseInt($(this).val());

            if (this.checked) {
                permisosSeleccionadosQuitar.push(id);
            } else {
                permisosSeleccionadosQuitar = permisosSeleccionadosQuitar.filter(p => p !== id);
            }

            $('#btnQuitarSeleccionados').html(`
                <i class="bi bi-trash"></i> Quitar Permisos (${permisosSeleccionadosQuitar.length})
            `);
        });

        $('#checkTodosQuitar').on('change', function () {
            const checked = $(this).is(':checked');
            $('.checkQuitarPermiso').prop('checked', checked).trigger('change');
        });

        $('#btnQuitarSeleccionados').on('click', function () {
            if (permisosSeleccionadosQuitar.length === 0) {
                return Swal.fire('Aviso', 'Seleccione al menos un permiso.', 'warning');
            }

            Swal.fire({
                title: `¿Eliminar ${permisosSeleccionadosQuitar.length} permisos?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then(result => {
                if (!result.isConfirmed) return;

                apiRequest({
                    url: `${apiUrl}/permisos/quitar/permiso`,
                    type: 'DELETE',
                    data: JSON.stringify({
                        id: usuarioActualId,
                        permisos: permisosSeleccionadosQuitar,
                        tipo: "usuario"
                    })
                }).then(() => {
                    Swal.fire('Éxito', 'Permisos eliminados correctamente', 'success');

                    permisosSeleccionadosQuitar = [];
                    $('#btnQuitarSeleccionados').html(`<i class="bi bi-trash"></i> Quitar Permisos (0)`);

                    mostrarPermisosUsuario(usuarioActualId, usuarioActualNombre);
                });
            });
        });

        $('#btnAgregarPermiso').on('click', function () {
            if (!usuarioActualId) return;
            cargarPermisosDisponibles(usuarioActualId);
        });
    }

    function loadRoles(selectedId = null) {
        apiRequest({
            url: `${apiUrl}/roles/select`,
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

    function loadTiposIdentificacion(selectedId = null) {
        apiRequest({
            url: `${apiUrl}/usuarios/tipos-identificacion/select`,
            type: 'GET'
        })
        .then(tiposIdentificacion => {
            const $tipoIdentificacionSelect = $('#tipo_identificacion_id');
            $tipoIdentificacionSelect.empty().append('<option value="">Seleccione un tipo de identificacion</option>');
            tiposIdentificacion.forEach(t => {
                $tipoIdentificacionSelect.append(new Option(t.nombre, t.id, false, false));
            });
            if ($tipoIdentificacionSelect.hasClass('select2-hidden-accessible')) {
                $tipoIdentificacionSelect.trigger('change.select2');
            } else {
                $tipoIdentificacionSelect.select2({
                    placeholder: 'Seleccione un rol',
                    allowClear: true,
                    width: 'resolve',
                    dropdownParent: $('#usuarioModal')
                });
            }
            if (selectedId) {
                $tipoIdentificacionSelect.val(selectedId).trigger('change');
            }
        })
        .catch(xhr => console.error('Error cargando tipos de identificacion:', xhr));
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
            tipo_identificacion_id: $('#tipo_identificacion_id').val(),
            numero_identificacion: $('#numero_identificacion').val(),
            telefono: $('#telefono').val(),
            rol_id: $('#rol_id').val(),
            imagen_base64: imagenBase64,
            eliminar_imagen: eliminarImagen
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
            $('#tipo_identificacion').val(user.tipo_identificacion_id);
            $('#numero_identificacion').val(user.numero_identificacion);
            $('#telefono').val(user.telefono);
            loadRoles(user.rol_id);
            loadTiposIdentificacion(user.tipo_identificacion_id);

            const baseUrl = apiUrl.replace('/api', '');
            const imageUrl = user.imagen_path
                ? `${baseUrl}/storage/${user.imagen_path}`
                : `${baseUrl}/storage/usuarios/default-user.png`;
            $('#previewImagen').attr('src', imageUrl).removeClass('d-none');
            $('#btnQuitarFoto').removeClass('d-none');
            eliminarImagen = false;
            imagenBase64 = null;
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
        $('#nombre, #apellido, #email, #numero_identificacion, #tipo_identificacion_id, #telefono, #password, #imagen').val('');
        $('#rol_id').empty();
        imagenBase64 = null;
        limpiarCamposRequeridos('#usuarioForm');
    }

    let imagenBase64 = null;
    let eliminarImagen = false;

    $('#imagen').on('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                imagenBase64 = e.target.result;
                $('#previewImagen').attr('src', imagenBase64).removeClass('d-none');
                $('#btnQuitarFoto').removeClass('d-none');
                eliminarImagen = false; // si selecciona nueva, no se elimina
            };
            reader.readAsDataURL(file);
        }
    });

    $('#btnQuitarFoto').on('click', function () {
        $('#previewImagen').attr('src', '').addClass('d-none');
        $('#imagen').val('');
        $(this).addClass('d-none');
        imagenBase64 = null;
        eliminarImagen = true;
    });

    let permisosSeleccionadosQuitar = [];

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
                    {
                        data: null,
                        render: p => `
                            <input type="checkbox" class="checkQuitarPermiso" value="${p.id}">
                        `,
                        className: "text-center"
                    },
                    { data: 'nombre' },
                    { data: 'descripcion' }
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

    function cargarPermisosDisponibles(usuarioId) {
        $('#permisosDisponiblesTitulo').text('Asignar Permisos al Usuario: ' + usuarioActualNombre);
        $('#btnAsignarSeleccionados').text('Asignar Permisos (0)');
        permisosSeleccionados = [];

        apiRequest({
            url: `${apiUrl}/usuarios/${usuarioId}/permisos-disponibles`,
            type: 'GET'
        }).then(data => {

            if ($.fn.DataTable.isDataTable('#tablaPermisosDisponibles')) {
                $('#tablaPermisosDisponibles').DataTable().destroy();
            }

            $('#tablaPermisosDisponibles').DataTable({
                data: data,
                columns: [
                    {
                        data: null,
                        className: "text-center",
                        render: p => `
                            <input type="checkbox" class="checkPermiso" value="${p.id}">
                        `
                    },
                    { data: 'nombre' },
                    { data: 'descripcion', defaultContent: '' }
                ],
                language: { url: dataTablesLangUrl },
                paging: true,
                searching: true,
                info: false
            });

            $('#modalAgregarPermiso').modal('show');

        }).catch(err => {
            Swal.fire('Error', 'No se pudieron cargar los permisos.', 'error');
        });
    }

    let permisosSeleccionados = [];

    $('#tablaPermisosDisponibles').on('change', '.checkPermiso', function () {
        const valor = parseInt($(this).val());

        if (this.checked) {
            permisosSeleccionados.push(valor);
        } else {
            permisosSeleccionados = permisosSeleccionados.filter(id => id !== valor);
        }

        $('#btnAsignarSeleccionados').text(`Asignar Permisos (${permisosSeleccionados.length})`);
    });

    $('#checkTodos').on('change', function () {
        const estado = $(this).is(':checked');
        $('.checkPermiso').prop('checked', estado).trigger('change');
    });

    $('#btnAsignarSeleccionados').on('click', function () {
        if (permisosSeleccionados.length === 0) {
            return Swal.fire('Aviso', 'Debe seleccionar al menos un permiso.', 'warning');
        }

        Swal.fire({
            title: `¿Asignar ${permisosSeleccionados.length} permisos?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, asignar',
        }).then(result => {
            if (!result.isConfirmed) return;

            const data = {
                id: usuarioActualId,
                permisos: permisosSeleccionados,
                tipo: "usuario"
            };

            apiRequest({
                url: `${apiUrl}/permisos/asignar`,
                type: 'POST',
                data: JSON.stringify(data)
            }).then(res => {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Permisos asignados correctamente.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });

                mostrarPermisosUsuario(usuarioActualId, usuarioActualNombre);
                cargarPermisosDisponibles(usuarioActualId);

            }).catch(err => {
                Swal.fire('Error', 'No se pudieron asignar los permisos.', 'error');
            });
        });
    });
});
