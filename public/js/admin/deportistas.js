$(document).ready(function () {
    const acciones = ['ver', 'crear', 'editar', 'eliminar'];
    const modulo = "deportistas";
    const deportistasApiUrl = `${apiUrl}/deportistas`;
    let fideSincronizado = false;

    initDeportistasTable();
    bindEvents();
    validarPermisos(modulo, acciones);

    function initDeportistasTable() {
        if ($.fn.DataTable.isDataTable('#deportistasTable')) {
            $('#deportistasTable').DataTable().destroy();
        }
        $('#deportistasTable').DataTable({
            ajax: function(data, callback, settings) {
                datatableAjax(deportistasApiUrl)
                    .then(response => {
                        callback({ data: response });
                    })
                    .catch(err => {
                        callback({ data: [] });
                        let mensaje = 'No se pudo cargar el listado de deportistas';
                        validarRespuesta(err, mensaje);
                    });
            },
            columns: [
                { data: 'id' },
                {
                    data: 'foto_perfil',
                    className: 'text-center',
                    orderable: false,
                    render: function (img) {
                        if (!img) {
                            return `<span class="text-muted small">Sin imagen</span>`;
                        }

                        return `
                            <img src="${apiUrlBase}${img}"
                            class="rounded shadow-sm cursor-pointer imagen-deportista"
                            style="width:60px; height:60px; object-fit:cover;"
                            data-src="${apiUrlBase}${img}">
                        `;
                    }
                },
                { data: 'usuario.nombre' },
                { data: 'usuario.apellido' },
                { data: 'titulo' },
                { data: 'elo_nacional' },
                { data: 'elo_internacional' },
                {
                    data: null,
                    render: function (data) {

                        const contenido = `
                            <div class="d-flex align-items-start gap-2">
                                <i data-lucide="globe"
                                class="text-success mt-1"
                                style="width:16px; height:16px;"></i>
                                <div class="small lh-sm">
                                    <strong class="d-block">FIDE</strong>
                                    ${data.fide_id
                                        ? `<span class="text-muted">${data.fide_id}</span>`
                                        : ''
                                    }
                                </div>
                            </div>
                        `;

                        if (data.fide_id) {
                            return `
                                <a href="${ratingFideUrl}/profile/${data.fide_id}"
                                target="_blank"
                                class="text-decoration-none text-white">
                                    ${contenido}
                                </a>
                            `;
                        }

                        return contenido;
                    }
                },
                {
                    data: 'club.logo',
                    className: 'text-center',
                    orderable: false,
                    render: function (img) {
                        if (!img) {
                            return `<span class="text-muted small">Sin imagen</span>`;
                        }

                        return `
                            <img src="${apiUrlBase}${img}"
                            class="rounded shadow-sm cursor-pointer imagen-deportista"
                            style="width:60px; height:60px; object-fit:cover;"
                            data-src="${apiUrlBase}${img}">
                        `;
                    }
                },
                { data: 'club.nombre'},
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
        $('#deportistasTable').on('draw.dt', function () {
            validarPermisos(modulo, acciones);
        });
    }

    function bindEvents() {
        $('.btnNuevo').on('click', function () {
            $('#deportistaForm')[0].reset();
            limpiarFormulario();
            loadLiga();
            loadClubes();
            loadUsuarios();
            loadNacionalidades();
            loadGeneros();
            loadTitulos();
            $('#usuario_id').prop('disabled', false).trigger('change');
            $('.btnSincronizar').prop('disabled', true);
            $('#deportistaId').val('');
            $('#deportistaModalLabel').text('Nuevo Deportista');
            $('#deportistaModal').modal('show');
        });

        $('#btnGuardar').on('click', function () {
            guardarDeportista();
        });

        $('#deportistasTable').on('click', '.btnEditar', function () {
            const id = $(this).data('id');
            limpiarFormulario();
            editarDeportista(id);
        });

        $('#deportistasTable').on('click', '.btnEliminar', function () {
            const id = $(this).data('id');
            eliminarDeportista(id);
        });

        $('#deportistasTable').on('click', '.imagen-deportista', function () {
            const src = $(this).data('src');
            const img = document.getElementById('imagenDeportistaPreview');
            img.src = src;
            new bootstrap.Modal(
                document.getElementById('modalImagenDeportista')
            ).show();
        });

        $('#fide_id').on('input', function () {
            const value = $(this).val().trim();
            fideSincronizado = false;
            if (value) {
                $('.btnSincronizar').prop('disabled', false);
                $('#elo_internacional').val('');
                $('#titulo_id').val('').trigger('change');
            } else {
                $('.btnSincronizar').prop('disabled', true);
            }
        });

        $('#deportistaModal').on('click', '.btnSincronizar', async function () {
            const fideId = $('#fide_id').val().trim();
            if (!fideId) {
                Swal.fire('Advertencia', 'Ingresa un FIDE ID válido', 'warning');
                return;
            }
            try {
                $(this).prop('disabled', true);
                const response = await apiRequest({
                    url: `${apiUrl}/deportistas/sincronizar-fide/${fideId}`,
                    type: 'GET'
                });
                $('#elo_internacional').val(response.elo_internacional);
                $('#titulo_id').val(response.titulo_id).trigger('change');
                fideSincronizado = true;
                Swal.fire('Éxito', 'Datos FIDE sincronizados correctamente', 'success');
            } catch (err) {
                validarRespuesta(err, 'No se pudo sincronizar con FIDE');
            } finally {
                $(this).prop('disabled', false);
            }
        });

        $('#usuario_id').on('change', async function () {
            const usuarioId = $(this).val();
            if (!usuarioId) {
                limpiarCamposUsuario();
                return;
            }
            try {
                const usuario = await apiRequest({
                    url: `${apiUrl}/usuarios/${usuarioId}`,
                    type: 'GET'
                });
                $('#nombre').val(usuario.nombre || '');
                $('#apellido').val(usuario.apellido || '');
                $('#numero_identificacion').val(usuario.numero_identificacion || '');
                $('#email').val(usuario.email || '');
                $('#telefono').val(usuario.telefono || '');

            } catch (err) {
                validarRespuesta(err, 'No se pudo cargar la información del usuario');
            }
        });
    }

    $(document).on('input change', '.required', function() {
        if ($(this).val()?.trim()) {
            $(this).removeClass('is-invalid');
            $(this).next('.invalid-feedback').remove();
        }
    });

    function loadLiga() {
        apiRequest({
            url: `${apiUrl}/select/ligas`,
            type: 'GET'
        })
        .then(ligas => {
            const $liga = $('#liga_id');
            $liga.empty();

            ligas.forEach(l => {
                $liga.append(new Option(l.nombre, l.id, true, true));
            });

            if ($liga.hasClass('select2-hidden-accessible')) {
                $liga.trigger('change.select2');
            } else {
                $liga.select2({
                    width: 'resolve',
                    dropdownParent: $('#deportistaModal')
                });
            }
        })
        .catch(err => console.error('Error cargando liga', err));
    }

    function loadClubes(selectedId = null) {
        apiRequest({
            url: `${apiUrl}/select/clubes`,
            type: 'GET'
        })
        .then(clubes => {
            const $clubSelect = $('#club_id');
            $clubSelect.empty().append('<option value="">Seleccione un club</option>');
            clubes.forEach(c => {
                $clubSelect.append(new Option(c.nombre, c.id, false, false));
            });
            if ($clubSelect.hasClass('select2-hidden-accessible')) {
                $clubSelect.trigger('change.select2');
            } else {
                $clubSelect.select2({
                    placeholder: 'Seleccione un club',
                    allowClear: true,
                    width: 'resolve',
                    dropdownParent: $('#deportistaModal')
                });
            }
            if (selectedId) {
                $clubSelect.val(selectedId).trigger('change');
            }
        })
        .catch(xhr => console.error('Error cargando clubes:', xhr));
    }

    function loadUsuarios(selectedId = null) {
        apiRequest({
            url: `${apiUrl}/select/usuarios-deportistas`,
            type: 'GET'
        })
        .then(usuarios => {
            const $usuarios = $('#usuario_id');
            $usuarios.empty().append('<option value="">Seleccione un usuario</option>');
            usuarios.forEach(u => {
                $usuarios.append(new Option(u.nombre, u.id, false, false));
            });
            if ($usuarios.hasClass('select2-hidden-accessible')) {
                $usuarios.trigger('change.select2');
            } else {
                $usuarios.select2({
                    placeholder: 'Seleccione un usuario',
                    allowClear: true,
                    width: 'resolve',
                    dropdownParent: $('#deportistaModal')
                });
            }
            if (selectedId) {
                $usuarios.val(selectedId).trigger('change');
            }
        })
        .catch(xhr => console.error('Error cargando usuarios:', xhr));
    }

    function loadNacionalidades(selectedId = null) {
        apiRequest({
            url: `${apiUrl}/select/nacionalidades`,
            type: 'GET'
        })
        .then(nacionalidades => {
            const $nacionalidadSelect = $('#nacionalidad_id');
            $nacionalidadSelect.empty().append('<option value="">Seleccione un nacionalidad</option>');
            nacionalidades.forEach(n => {
                $nacionalidadSelect.append(new Option(n.nombre, n.id, false, false));
            });
            if ($nacionalidadSelect.hasClass('select2-hidden-accessible')) {
                $nacionalidadSelect.trigger('change.select2');
            } else {
                $nacionalidadSelect.select2({
                    placeholder: 'Seleccione un nacionalidad',
                    allowClear: true,
                    width: 'resolve',
                    dropdownParent: $('#deportistaModal')
                });
            }
            if (selectedId) {
                $nacionalidadSelect.val(selectedId).trigger('change');
            }
        })
        .catch(xhr => console.error('Error cargando nacionalidades:', xhr));
    }

    function loadGeneros(selectedId = null) {
        apiRequest({
            url: `${apiUrl}/select/generos-deportista`,
            type: 'GET'
        })
        .then(generos => {
            const $generoSelect = $('#genero_id');
            $generoSelect.empty().append('<option value="">Seleccione un genero</option>');
            generos.forEach(g => {
                $generoSelect.append(new Option(g.nombre, g.id, false, false));
            });
            if ($generoSelect.hasClass('select2-hidden-accessible')) {
                $generoSelect.trigger('change.select2');
            } else {
                $generoSelect.select2({
                    placeholder: 'Seleccione un genero',
                    allowClear: true,
                    width: 'resolve',
                    dropdownParent: $('#deportistaModal')
                });
            }
            if (selectedId) {
                $generoSelect.val(selectedId).trigger('change');
            }
        })
        .catch(xhr => console.error('Error cargando generos:', xhr));
    }

    function loadTitulos(selectedId = null) {
        apiRequest({
            url: `${apiUrl}/select/titulos`,
            type: 'GET'
        })
        .then(titulos => {
            const $tituloSelect = $('#titulo_id');
            $tituloSelect.empty().append('<option value="">Seleccione un titulo</option>');
            titulos.forEach(g => {
                $tituloSelect.append(new Option(g.nombre, g.id, false, false));
            });
            if ($tituloSelect.hasClass('select2-hidden-accessible')) {
                $tituloSelect.trigger('change.select2');
            } else {
                $tituloSelect.select2({
                    placeholder: 'Seleccione un titulo',
                    allowClear: true,
                    width: 'resolve',
                    dropdownParent: $('#deportistaModal')
                });
            }
            if (selectedId) {
                $tituloSelect.val(selectedId).trigger('change');
            }
        })
        .catch(xhr => console.error('Error cargando titulos:', xhr));
    }

    function limpiarCamposUsuario() {
        $('#nombre').val('');
        $('#apellido').val('');
        $('#numero_identificacion').val('');
        $('#email').val('');
        $('#telefono').val('');
    }

    function guardarDeportista() {
        if (!validarCamposRequeridos('#deportistaForm')) {
            Swal.fire('Advertencia', 'Por favor completa los campos obligatorios.', 'warning');
            return;
        }

        if ($('#fide_id').val() && !fideSincronizado) {
            Swal.fire('Advertencia', 'Debes sincronizar el FIDE antes de guardar.', 'warning');
            return;
        }

        const id = $('#deportistaId').val();
        const method = 'POST';
        const url = id
            ? `${apiUrl}/deportistas/${id}`
            : `${apiUrl}/deportistas`;

        const formData = new FormData();

        if (id) {
            formData.append('_method', 'PUT');
        }

        formData.append('liga_id', $('#liga_id').val());
        formData.append('club_id', $('#club_id').val());
        formData.append('usuario_id', $('#usuario_id').val());
        formData.append('nombre', $('#nombre').val());
        formData.append('apellido', $('#apellido').val());
        formData.append('numero_identificacion', $('#numero_identificacion').val());
        formData.append('email', $('#email').val());
        formData.append('telefono', $('#telefono').val());
        formData.append('fecha_nacimiento', $('#fecha_nacimiento').val());
        formData.append('nacionalidad_id', $('#nacionalidad_id').val());
        formData.append('genero_id', $('#genero_id').val());
        formData.append('fide_id', $('#fide_id').val());
        formData.append('elo_nacional', $('#elo_nacional').val());
        formData.append('elo_internacional', $('#elo_internacional').val());
        formData.append('titulo_id', $('#titulo_id').val());

        apiRequest({
            url: url,
            type: method,
            data: formData,
        })
        .then(() => {
            Swal.fire('Éxito', id ? 'Deportista actualizado correctamente' : 'Deportista creado correctamente', 'success');
            $('#deportistaModal').modal('hide');
            $('#deportistasTable').DataTable().ajax.reload(null, false);
        })
        .catch(err => {
            validarRespuesta(err, 'No se pudo guardar el deportista');
        });
    }

    function limpiarFormulario() {
        $('#deportistaForm')[0].reset();
        $('#deportistaId').val('');
        $('#club_id').val('').trigger('change');
        $('#usuario_id').val('').trigger('change');
        $('#nacionalidad_id').val('').trigger('change');
        $('#genero_id').val('').trigger('change');
        $('#titulo_id').val('').trigger('change');
        limpiarCamposRequeridos('#deportistaForm');
        $('#deportistaForm .is-invalid').removeClass('is-invalid');
        $('#deportistaForm .invalid-feedback').remove();
    }

    async function editarDeportista(id) {
        try {
            const deportista = await apiRequest({
                url: `${deportistasApiUrl}/${id}`,
                type: 'GET'
            });

            limpiarFormulario();
            $('#deportistaId').val(deportista.id);
            $('#nombre').val(deportista.usuario.nombre);
            $('#apellido').val(deportista.usuario.apellido);
            $('#numero_identificacion').val(deportista.usuario.numero_identificacion);
            $('#email').val(deportista.usuario.email);
            $('#telefono').val(deportista.usuario.telefono);
            $('#fecha_nacimiento').val(deportista.fecha_nacimiento);
            $('#fide_id').val(deportista.fide_id);
            $('#elo_nacional').val(deportista.elo_nacional);
            $('#elo_internacional').val(deportista.elo_internacional);

            loadLiga();
            loadClubes(deportista.club?.id);
            loadUsuarios(deportista.usuario?.id);
            loadNacionalidades(deportista.nacionalidad?.id);
            loadGeneros(deportista.genero?.id);
            loadTitulos(deportista.titulo?.id);

            $('#usuario_id').prop('disabled', true).trigger('change');
            $('#deportistaModalLabel').text('Editar Deportista');
            $('#deportistaModal').modal('show');
        } catch (err) {
            validarRespuesta(err, 'No se pudo cargar el deportista');
        }
    }

    function eliminarDeportista(id) {
        Swal.fire({
            title: '¿Eliminar deportista?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                apiRequest({ url: `${deportistasApiUrl}/${id}`, type: 'DELETE' })
                .then(() => {
                    Swal.fire('Eliminado', 'Deportista eliminado correctamente', 'success');
                    $('#deportistasTable').DataTable().ajax.reload(null, false);
                })
                .catch(xhr => {
                    let mensaje = 'No se pudo eliminar el deportista';
                    validarRespuesta(xhr, mensaje);
                });
            }
        });
    }
});
