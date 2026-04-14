$(document).ready(function () {
    const acciones = ['ver', 'crear', 'editar', 'eliminar'];
    const modulo = "clubes";
    const clubesApiUrl = `${apiUrl}/clubes`;

    initClubesTable();
    bindEvents();
    validarPermisos(modulo, acciones);

    function initClubesTable() {
        if ($.fn.DataTable.isDataTable('#clubesTable')) {
            $('#clubesTable').DataTable().destroy();
        }
        $('#clubesTable').DataTable({
            ajax: function(data, callback, settings) {
                datatableAjax(clubesApiUrl)
                    .then(response => {
                        callback({ data: response });
                    })
                    .catch(err => {
                        callback({ data: [] });
                        let mensaje = 'No se pudo cargar el listado de clubes';
                        validarRespuesta(err, mensaje);
                    });
            },
            columns: [
                { data: 'id' },
                {
                    data: 'logo',
                    className: 'text-center',
                    orderable: false,
                    render: function (img) {
                        if (!img) {
                            return `<span class="text-muted small">Sin imagen</span>`;
                        }

                        return `
                            <img src="${apiUrlBase}${img}"
                            class="rounded shadow-sm cursor-pointer imagen-club"
                            style="width:60px; height:60px; object-fit:cover;"
                            data-src="${apiUrlBase}${img}">
                        `;
                    }
                },
                { data: 'nombre' },
                {
                    data: 'descripcion',
                    className: 'descripcion-col',
                    width: '300px',
                    render: function (data) {
                        if (!data) return '-';
                        return `<div class="descripcion-wrap">${data}</div>`;
                    }
                },
                {
                    data: null,
                    render: function (data) {

                        const contenido = `
                            <div class="d-flex align-items-start gap-2">
                                <i data-lucide="map-pin"
                                class="text-success mt-1"
                                style="width:16px; height:16px;"></i>

                                <div class="small lh-sm">
                                    <strong class="d-block">${data.ubicacion}</strong>
                                    ${data.direccion
                                        ? `<span class="text-muted">${data.direccion}</span>`
                                        : ''
                                    }
                                </div>
                            </div>
                        `;

                        if (data.url_mapa) {
                            return `
                                <a href="${data.url_mapa}"
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
                    data: null,
                    render: function (data) {
                        const contenido = `
                            <div class="d-flex align-items-start gap-2">
                                <i data-lucide="hat-glasses"
                                class="text-success mt-1"
                                style="width:16px; height:16px;"></i>
                                <div class="small lh-sm">
                                    ${data.presidente
                                        ? `
                                            <span class="text-success d-flex align-items-center gap-1">
                                                ${data.presidente}
                                            </span>
                                        `
                                        : ''
                                    }
                                </div>
                            </div>
                        `;
                        return contenido;
                    }
                },
                { data: 'contacto'},
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
        $('#clubesTable').on('draw.dt', function () {
            validarPermisos(modulo, acciones);
        });
    }

    function bindEvents() {
        $('.btnNuevo').on('click', function () {
            $('#clubForm')[0].reset();
            limpiarFormulario();
            loadLiga();
            loadPresidentes();
            $('#clubId').val('');
            $('#clubModalLabel').text('Nuevo Club');
            $('#clubModal').modal('show');
        });


        $('#btnPublicar').on('click', function () {
            guardarClub();
        });

        $('#clubesTable').on('click', '.btnEditar', function () {
            const id = $(this).data('id');
            limpiarFormulario();
            editarClub(id);
        });

        $('#clubesTable').on('click', '.btnEliminar', function () {
            const id = $(this).data('id');
            eliminarClub(id);
        });

        $('#clubesTable').on('click', '.imagen-club', function () {
            const src = $(this).data('src');
            const img = document.getElementById('imagenClubPreview');
            img.src = src;
            new bootstrap.Modal(
                document.getElementById('modalImagenClub')
            ).show();
        });
    }

    $(document).on('input change', '.required', function() {
            if ($(this).val()?.trim()) {
                $(this).removeClass('is-invalid');
                $(this).next('.invalid-feedback').remove();
            }
        });

    $(document).on('change', '#logo', function () {
        const file = this.files[0];
        const $preview = $('.logo-preview');

        if (!file) {
            $preview.html('<span class="text-muted small">Sin logo</span>');
            return;
        }

        const url = URL.createObjectURL(file);

        $preview.html(`
            <img src="${url}"
                class="img-fluid rounded"
                style="max-height:100%;max-width:100%;object-fit:contain">
        `);
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
                    dropdownParent: $('#clubModal')
                });
            }
        })
        .catch(err => console.error('Error cargando liga', err));
    }

    function guardarClub() {
        if (!validarCamposRequeridos('#clubForm')) {
            Swal.fire('Advertencia', 'Por favor completa los campos obligatorios.', 'warning');
            return;
        }

        if (!validarImagenPrincipal()) {
            return;
        }

        $('#clubForm .is-invalid').removeClass('is-invalid');
        $('#clubForm .invalid-feedback').remove();

        const id = $('#clubId').val();
        const method = id ? 'POST' : 'POST';
        const url = id ? `${apiUrl}/clubes/${id}` : `${apiUrl}/clubes`;

        let mediaValida = true;

        $('.media-item.media-nueva').each(function () {
            const tipo = $(this).find('.media-tipo').val();
            const file = $(this).find('.media-archivo')[0]?.files[0];
            const url  = $(this).find('.media-url').val();

            if ((tipo === 'imagen' || tipo === 'video') && !file) {
                Swal.fire(
                    'Media incompleta',
                    'Debe seleccionar un archivo para las medias nuevas',
                    'warning'
                );
                mediaValida = false;
                return false;
            }

            if (tipo === 'url' && !url) {
                Swal.fire(
                    'Media incompleta',
                    'Debe ingresar la URL del video',
                    'warning'
                );
                mediaValida = false;
                return false;
            }
        });

        if (!mediaValida) return;

        const formData = new FormData();

        $('.media-item').each(function (i) {
            const $item = $(this);
            const tipo = $item.find('.media-tipo').val();
            const descripcion = $item.find('.media-descripcion').val();
            const mediaId = $item.data('id');
            const esNueva = $item.hasClass('media-nueva');
            formData.append(`media[${i}][tipo]`, tipo);
            formData.append(`media[${i}][orden]`, i + 1);
            formData.append(`media[${i}][descripcion]`, descripcion);

            if (mediaId) {
                formData.append(`media[${i}][id]`, mediaId);
            }

            if (tipo === 'url') {
                const url = $item.find('.media-url').val();
                if (url) {
                    formData.append(`media[${i}][url]`, url);
                }
            } else {
                const fileInput = $item.find('.media-archivo')[0];
                if (esNueva && fileInput && fileInput.files.length) {
                    formData.append(`media[${i}][archivo]`, fileInput.files[0]);
                }
            }
        });

        if (id) {
            formData.append('_method', 'PUT');
        }
        formData.append('liga_id', $('#liga_id').val());
        formData.append('nombre', $('#nombre').val());
        formData.append('descripcion', $('#descripcion').val());
        formData.append('ubicacion', $('#ubicacion').val());
        formData.append('direccion', $('#direccion').val());
        formData.append('url_mapa', $('#url_mapa').val());
        formData.append('presidente_id', $('#presidente_id').val());
        formData.append('contacto', $('#contacto').val());

        const logoInput = document.getElementById('logo');

        if (logoInput && logoInput.files.length) {
            formData.append('logo', logoInput.files[0]);
        }

        $('.media-item').each(function (i) {
            const tipo = $(this).find('.media-tipo').val();
            const descripcion = $(this).find('.media-descripcion').val();
            const mediaId = $(this).data('id');

            if (mediaId) {
                formData.append(`media[${i}][id]`, mediaId);
            }

            formData.append(`media[${i}][tipo]`, tipo);
            formData.append(`media[${i}][orden]`, i + 1);
            formData.append(`media[${i}][descripcion]`, descripcion);

            if (tipo === 'url') {
                formData.append(
                    `media[${i}][url]`,
                    $(this).find('.media-url').val()
                );
            } else {
                const file = $(this).find('.media-archivo')[0].files[0];
                if (file) {
                    formData.append(`media[${i}][archivo]`, file);
                }
            }
        });

        mediaEliminados.forEach((id, i) => {
            formData.append(`media_eliminados[${i}]`, id);
        });

        if (!validarRedesSocialesUnicas()) {
            return;
        }

        $('.red-social-item').each(function (i) {
            const redSocialId = $(this).data('id');
            if (redSocialId) {
                formData.append(`redes_sociales[${i}][id]`, redSocialId);
            }

            formData.append(`redes_sociales[${i}][red_social_id]`,
                $(this).find('.red-social-select').val());

            formData.append(`redes_sociales[${i}][url]`,
                $(this).find('.url-red-social').val() || 0);

            formData.append(`redes_sociales[${i}][orden]`, i + 1);
        });

        redesSocialesEliminadas.forEach((id, i) => {
            formData.append(`redes_sociales_eliminadas[${i}]`, id);
        });

        apiRequest({
            url: url,
            type: method,
            data: formData,
        })
        .then(() => {
            Swal.fire('Éxito', 'Club creado correctamente', 'success');
            $('#clubModal').modal('hide');
            $('#clubesTable').DataTable().ajax.reload(null, false);
        })
        .catch(err => {
            validarRespuesta(err, 'No se pudo crear el club');
        });
    }

    function limpiarFormulario() {
        $('#clubId').val('');
        $('#nombre').val('');
        $('#descripcion').val('');
        $('#ubicacion').val('');
        $('#direccion').val('');
        $('#url_mapa').val('');
        $('#contacto').val('');
        $('#presidente_id').val('').trigger('change');
        $('#logo').val('');
        $('.logo-preview').html('<span class="text-muted small">Sin logo</span>');

        $('#mediaContainer').empty();
        mediaIndex = 0;
        mediaEliminados = [];

        $('#redesSocialesContainer').empty();
        redSocialIndex = 0;
        redesSocialesEliminadas = [];

        limpiarCamposRequeridos('#clubForm');
        $('#clubForm .is-invalid').removeClass('is-invalid');
        $('#clubForm .invalid-feedback').remove();
    }

    async function editarClub(id) {
        try {
            const club = await apiRequest({
                url: `${clubesApiUrl}/${id}`,
                type: 'GET'
            });

            limpiarFormulario();

            $('#clubId').val(club.id);
            $('#nombre').val(club.nombre);
            $('#descripcion').val(club.descripcion);
            $('#ubicacion').val(club.ubicacion);
            $('#direccion').val(club.direccion);
            $('#url_mapa').val(club.url_mapa);
            $('#contacto').val(club.contacto);

            loadLiga();
            loadPresidentes(club.presidente_id);

            if (club.logo) {
                $('.logo-preview').html(`
                    <img src="${apiUrlBase}/storage/${club.logo}"
                        class="img-fluid rounded"
                        style="max-height:100%;max-width:100%;object-fit:contain">
                `);
            } else {
                $('.logo-preview').html('<span class="text-muted small">Sin logo</span>');
            }

            cargarMediaEdit(club.media);

            await precargarSelectsRedesSociales();
            await cargarRedesSocialesEdit(club.redes_sociales);

            $('#clubModalLabel').text('Editar Club');
            $('#clubModal').modal('show');

        } catch (err) {
            validarRespuesta(err, 'No se pudo cargar el club');
        }
    }

    function eliminarClub(id) {
        Swal.fire({
            title: '¿Eliminar club?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                apiRequest({ url: `${clubesApiUrl}/${id}`, type: 'DELETE' })
                .then(() => {
                    Swal.fire('Eliminado', 'Club eliminado correctamente', 'success');
                    $('#clubesTable').DataTable().ajax.reload(null, false);
                })
                .catch(xhr => {
                    let mensaje = 'No se pudo eliminar el club';
                    validarRespuesta(xhr, mensaje);
                });
            }
        });
    }

    function loadPresidentes(selectedId = null) {
        apiRequest({
            url: `${apiUrl}/select/usuarios`,
            type: 'GET'
        })
        .then(usuarios => {
            const $presidenteSelect = $('#presidente_id');
            $presidenteSelect
                .empty()
                .append('<option value="">Seleccione un presidente</option>');

            usuarios.forEach(r => {
                $presidenteSelect.append(new Option(r.nombre, r.id, false, false));
            });

            if ($presidenteSelect.hasClass('select2-hidden-accessible')) {
                $presidenteSelect.trigger('change.select2');
            } else {
                $presidenteSelect.select2({
                    placeholder: 'Seleccione un presidente',
                    allowClear: true,
                    width: 'resolve',
                    dropdownParent: $('#clubModal')
                });
            }
            if (selectedId) {
                $presidenteSelect.val(selectedId).trigger('change');
            }
        })
        .catch(xhr => console.error('Error cargando usuarios:', xhr));
    }
});
