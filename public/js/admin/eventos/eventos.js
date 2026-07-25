$(document).ready(function () {
    const acciones = ['ver', 'crear', 'editar', 'eliminar'];
    const modulo = "eventos";
    const eventosApiUrl = `${apiUrl}/eventos`;
    const hoy = new Date();
    const hoyLocal = hoy.toLocaleDateString('en-CA');

    initEventosTable();
    loadFiltroTiposEvento();
    bindEvents();
    validarPermisos(modulo, acciones);

    function loadFiltroTiposEvento() {
        apiRequest({
            url: `${apiUrl}/select/tipos-evento`,
            type: 'GET'
        })
        .then(tiposEvento => {
            const $select = $('#filtroTipoEvento');
            $select.empty().append('<option value="">Todos</option>');
            tiposEvento.forEach(tipo => {
                if (tipo.nombre === 'Torneo') return;
                $select.append(new Option(tipo.nombre, tipo.id));
            });

            if ($select.hasClass('select2-hidden-accessible')) {
                $select.select2('destroy');
            }

            $select.select2({
                width: '100%'
            });
        });
    }

    function initEventosTable() {
        if ($.fn.DataTable.isDataTable('#eventosTable')) {
            $('#eventosTable').DataTable().destroy();
        }
        $('#eventosTable').DataTable({
            ajax: function(data, callback, settings) {
                datatableAjax(eventosApiUrl)
                    .then(response => {
                        callback({ data: response });
                    })
                    .catch(err => {
                        callback({ data: [] });
                        let mensaje = 'No se pudo cargar el listado de eventos';
                        validarRespuesta(err, mensaje);
                    });
            },
            columns: [
                { data: 'id' },
                { data: 'tipo_evento_id', visible: false, searchable: true },
                {
                    data: 'imagen_principal',
                    className: 'text-center',
                    orderable: false,
                    render: function (img) {
                        if (!img) {
                            return `<span class="text-muted small">Sin imagen</span>`;
                        }

                        return `
                            <img src="${apiUrlBase}${img}"
                            class="rounded shadow-sm cursor-pointer imagen-evento"
                            style="width:60px; height:60px; object-fit:cover;"
                            data-src="${apiUrlBase}${img}">
                        `;
                    }
                },
                { data: 'nombre' },
                { data: 'descripcion' },
                {
                    data: null,
                    render: function (data) {

                        const contenido = `
                            <div class="d-flex align-items-start gap-2">
                                <i data-lucide="map-pin"
                                class="text-success mt-1"
                                style="width:16px; height:16px;"></i>

                                <div class="small lh-sm">
                                    <strong class="d-block">${data.lugar}</strong>
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
                { data: 'fecha_inicio', className: 'text-center' },
                { data: 'fecha_fin', className: 'text-center' },
                {
                    data: null,
                    render: function (data) {
                        const contenido = `
                            <div class="d-flex align-items-start gap-2">
                                <i data-lucide="user"
                                class="text-info mt-1"
                                style="width:16px; height:16px;"></i>
                                <div class="small lh-sm">
                                    <strong class="d-block">${data.organizador_nombre ?? '—'}</strong>
                                    ${data.organizador_contacto
                                        ? `
                                            <span class="text-muted d-flex align-items-center gap-1">
                                                <i data-lucide="phone"
                                                style="width:12px; height:12px;"></i>
                                                ${data.organizador_contacto}
                                            </span>
                                        `
                                        : ''
                                    }
                                </div>
                            </div>
                        `;

                        if (data.organizador_contacto) {
                            const tel = data.organizador_contacto.replace(/\D/g, '');
                            return `
                                <a href="https://wa.me/${tel}"
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
                    className: 'text-center',
                    render: function (data) {
                        const inscritos = data.inscritos;
                        const max = data.max_participantes ?? 0;
                        let color = 'success';

                        if (max > 0) {
                            const porcentaje = (inscritos / max) * 100;

                            if (porcentaje >= 90) color = 'danger';
                            else if (porcentaje >= 70) color = 'warning';
                        }

                        return `
                            <span class="badge bg-${color}">
                                ${inscritos} / ${max}
                            </span>
                        `;
                    }
                },
                {
                    data: 'estado_evento',
                    className: 'text-center',
                    render: function (estado) {
                        const estadosConfig = {
                            'Borrador': { color: 'secondary', icon: 'file-text' },
                            'Publicado': { color: 'success', icon: 'check-circle' },
                            'En Curso': { color: 'primary', icon: 'play-circle' },
                            'Finalizado': { color: 'danger', icon: 'flag' },
                            'Cancelado': { color: 'dark', icon: 'x-circle' }
                        };

                        const cfg = estadosConfig[estado] || { color: 'secondary', icon: 'help-circle' };

                        return `
                            <span class="badge bg-${cfg.color} d-inline-flex align-items-center gap-1">
                                <i data-lucide="${cfg.icon}" style="width:14px"></i>
                                ${estado}
                            </span>
                        `;
                    }
                },
                {
                    data: 'publico',
                    className: 'text-center',
                    render: function (val) {
                        return val
                            ? `<span class="badge bg-primary">Publico</span>`
                            : `<span class="badge bg-secondary">Oculto</span>`;
                    }
                },
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
        $('#eventosTable').on('draw.dt', function () {
            validarPermisos(modulo, acciones);
        });
    }

    function bindEvents() {
        $('.btnNuevo').on('click', function () {
            $('#eventoForm')[0].reset();
            limpiarFormulario();
            loadLiga();
            loadTiposEvento();
            actualizarEstadoFechas();
            $('#eventoId').val('');
            $('#eventoModalLabel').text('Nuevo Evento');
            $('#eventoModal').modal('show');
        });

        $('#btnGuardarBorrador').on('click', function () {
            guardarEvento(false);
        });

        $('#btnPublicar').on('click', function () {
            guardarEvento(true);
        });

        $('#eventosTable').on('click', '.btnEditar', function () {
            const id = $(this).data('id');
            limpiarFormulario();
            editarEvento(id);
        });

        $('#eventosTable').on('click', '.btnEliminar', function () {
            const id = $(this).data('id');
            eliminarEvento(id);
        });

        $('#eventosTable').on('click', '.imagen-evento', function () {
            const src = $(this).data('src');
            const img = document.getElementById('imagenEventoPreview');
            img.src = src;
            new bootstrap.Modal(
                document.getElementById('modalImagenEvento')
            ).show();
        });

        $('#max_participantes, .cupo-maximo').on('input', function () {
            $(this).removeClass('is-invalid');
        });

        $('#fecha_inicio').on('change', function () {
            actualizarEstadoFechas();
        });

        $('#filtroTipoEvento').on('change', function () {
            const valor = $(this).val();
            const tabla = $('#eventosTable').DataTable();
            tabla.column(1).search(valor).draw();
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
                    dropdownParent: $('#eventoModal')
                });
            }
        })
        .catch(err => console.error('Error cargando liga', err));
    }

    function loadTiposEvento(selectedId = null) {
        apiRequest({
            url: `${apiUrl}/select/tipos-evento`,
            type: 'GET'
        })
        .then(tiposEvento => {
            const $tipoEventoSelect = $('#tipo_evento_id');
            $tipoEventoSelect
                .empty()
                .append('<option value="">Seleccione un tipo evento</option>');

            let eventoId = null;
            tiposEvento.forEach(r => {
                if (r.nombre === 'Torneo') return;
                $tipoEventoSelect.append(new Option(r.nombre, r.id, false, false));
                if (r.nombre === 'Evento') {
                    eventoId = r.id;
                }
            });

            if ($tipoEventoSelect.hasClass('select2-hidden-accessible')) {
                $tipoEventoSelect.trigger('change.select2');
            } else {
                $tipoEventoSelect.select2({
                    placeholder: 'Seleccione un tipo evento',
                    allowClear: true,
                    width: 'resolve',
                    dropdownParent: $('#eventoModal')
                });
            }
            if (selectedId) {
                $tipoEventoSelect.val(selectedId).trigger('change');
            } else if (eventoId) {
                $tipoEventoSelect.val(eventoId).trigger('change');
            }
        })
        .catch(xhr => console.error('Error cargando tipos evento:', xhr));
    }

    $('#de_pago').on('change', function () {
        const esDePago = $(this).is(':checked');

        $('.costo-inscripcion')
            .prop('disabled', !esDePago)
            .val(esDePago ? '' : 0)
            .removeClass('is-invalid');

        if (!esDePago) {
            $('#valor_min, #valor_max')
                .val('')
                .prop('disabled', true)
                .removeClass('is-invalid');
        } else {
            $('#valor_min, #valor_max')
                .prop('disabled', false);
        }
    });

    $('#valor_rango').on('focus', function () {
        if (!this.value) {
            this.placeholder = '$20.000 - $30.000';
        }
    });

    function guardarEvento(publicar = false) {
        if (!validarCamposRequeridos('#eventoForm')) {
            Swal.fire('Advertencia', 'Por favor completa los campos obligatorios.', 'warning');
            return;
        }

        if (!validarImagenPrincipal()) {
            return;
        }

        const fechaInicio = $('#fecha_inicio').val();
        const fechaFin = $('#fecha_fin').val();
        const hoy = new Date();
        const hoyLocal = hoy.toLocaleDateString('en-CA');

        if (fechaInicio < hoyLocal) {
            Swal.fire(
                'Advertencia',
                'La fecha de inicio no puede ser anterior a la fecha actual',
                'warning'
            );
            $('#fecha_inicio').addClass('is-invalid');
            return;
        }

        if (fechaFin && fechaInicio > fechaFin) {
            Swal.fire(
                'Advertencia',
                'La fecha de inicio no puede ser posterior a la fecha de fin',
                'warning'
            );
            $('#fecha_inicio, #fecha_fin').addClass('is-invalid');
            return;
        }

        const esDePago = $('#de_pago').is(':checked');
        const min = $('#valor_min').val();
        const max = $('#valor_max').val();

        if (esDePago) {
            if (!min && !max) {
                Swal.fire(
                    'Advertencia',
                    'Debe indicar al menos un valor de inscripción',
                    'warning'
                );
                $('#valor_min, #valor_max').addClass('is-invalid');
                return;
            }

            if (min && max && parseInt(min) > parseInt(max)) {
                Swal.fire(
                    'Advertencia',
                    'El valor mínimo no puede ser mayor al valor máximo',
                    'warning'
                );
                $('#valor_min, #valor_max').addClass('is-invalid');
                return;
            }
        }

        $('#eventoForm .is-invalid').removeClass('is-invalid');
        $('#eventoForm .invalid-feedback').remove();

        const id = $('#eventoId').val();
        const method = id ? 'POST' : 'POST';
        const url = id ? `${apiUrl}/eventos/${id}` : `${apiUrl}/eventos`;

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
        formData.append('tipo_evento_id', $('#tipo_evento_id').val());
        formData.append('nombre', $('#nombre').val());
        formData.append('descripcion', $('#descripcion').val());
        formData.append('lugar', $('#lugar').val());
        formData.append('direccion', $('#direccion').val());
        formData.append('url_mapa', $('#url_mapa').val());
        formData.append('fecha_inicio', $('#fecha_inicio').val());
        formData.append('hora_inicio', $('#hora_inicio').val());
        formData.append('fecha_fin', $('#fecha_fin').val());
        formData.append('organizador_nombre', $('#organizador_nombre').val());
        formData.append('organizador_contacto', $('#organizador_contacto').val());
        formData.append('de_pago', esDePago ? 1 : 0);

        clubesSeleccionados.forEach((id, i) => {
            formData.append(`organizadores[${i}]`, id);
        });

        if (esDePago) {
            let rango = '';
            if (min && max) rango = `${min}-${max}`;
            else if (min) rango = `${min}`;
            else if (max) rango = `${max}`;

            formData.append('valor_rango', rango);
        }

        formData.append('publicado', publicar ? 1 : 0);
        formData.append('max_participantes', $('#max_participantes').val());

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

        $('.documento-item').each(function (i) {
            const $item = $(this);
            const fileInput = $item.find('.documento-archivo')[0];
            const descripcion = $item.find('.documento-descripcion').val();
            const docId = $item.data('id');
            const hasFile = fileInput && fileInput.files && fileInput.files.length > 0;

            if (docId) {
                formData.append(`documentos[${i}][id]`, docId);
                if (hasFile) {
                    formData.append(`documentos[${i}][documento]`, fileInput.files[0]);
                }
            }
            else {
                if (!hasFile) {
                    return;
                }
                formData.append(`documentos[${i}][documento]`, fileInput.files[0]);
            }
            formData.append(`documentos[${i}][orden]`, i + 1);
            formData.append(`documentos[${i}][descripcion]`, descripcion || '');
        });

        documentosEliminados.forEach((id, i) => {
            formData.append(`documentos_eliminados[${i}]`, id);
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
            Swal.fire('Éxito', 'Evento creado correctamente', 'success');
            $('#eventoModal').modal('hide');
            $('#eventosTable').DataTable().ajax.reload(null, false);
        })
        .catch(err => {
            validarRespuesta(err, 'No se pudo crear el evento');
        });
    }

    function limpiarFormulario() {
        $('#eventoId').val('');
        $('#nombre').val('');
        $('#descripcion').val('');
        $('#lugar').val('');
        $('#direccion').val('');
        $('#url_mapa').val('');
        $('#fecha_inicio').val('');
        $('#hora_inicio').val('');
        $('#fecha_fin').val('');

        $('#organizador_nombre').val('');
        $('#organizador_contacto').val('');
        $('#max_participantes').val('');

        $('#de_pago').prop('checked', false).trigger('change');
        $('#publicado').prop('checked', false);

        $('#tipo_evento_id').val('').trigger('change');

        $('#mediaContainer').empty();
        mediaIndex = 0;
        mediaEliminados = [];

        $('#documentosContainer').empty();
        documentoIndex = 0;
        documentosEliminados = [];

        clubesSeleccionados = [];
        $('#clubesSeleccionados').empty();

        $('#redesSocialesContainer').empty();
        redSocialIndex = 0;
        redesSocialesEliminadas = [];

        limpiarCamposRequeridos('#eventoForm');
        $('#eventoForm .is-invalid').removeClass('is-invalid');
        $('#eventoForm .invalid-feedback').remove();
    }

    async function editarEvento(id) {
        try {
            const evento = await apiRequest({
                url: `${eventosApiUrl}/${id}`,
                type: 'GET'
            });

            limpiarFormulario();

            $('#eventoId').val(evento.id);
            $('#nombre').val(evento.nombre);
            $('#descripcion').val(evento.descripcion);
            $('#lugar').val(evento.lugar);
            $('#direccion').val(evento.direccion);
            $('#url_mapa').val(evento.url_mapa);
            $('#hora_inicio').val(evento.hora_inicio);
            $('#max_participantes').val(evento.max_participantes);
            $('#organizador_nombre').val(evento.organizador_nombre);
            $('#organizador_contacto').val(evento.organizador_contacto);

            $('#fecha_inicio').val(isoToDate(evento.fecha_inicio));
            $('#fecha_fin').val(isoToDate(evento.fecha_fin));

            loadLiga();
            loadTiposEvento(evento.tipo_evento_id);
            actualizarEstadoFechas();

            $('#de_pago').prop('checked', evento.de_pago).trigger('change');
            if (evento.de_pago && evento.valor_rango) {
                const rango = evento.valor_rango.toString();
                const [min, max] = rango.includes('-')
                    ? rango.split('-')
                    : [rango, ''];

                $('#valor_min').val(min);
                $('#valor_max').val(max);
            } else {
                $('#valor_min').val('');
                $('#valor_max').val('');
            }

            cargarClubes();
            cargarOrganizadoresEdit(evento.organizadores);
            cargarMediaEdit(evento.media);
            cargarDocumentosEdit(evento.documentos);

            await precargarSelectsRedesSociales();
            await cargarRedesSocialesEdit(evento.redes_sociales);

            $('#eventoModalLabel').text('Editar Evento');
            $('#eventoModal').modal('show');

        } catch (err) {
            validarRespuesta(err, 'No se pudo cargar el evento');
        }
    }

    function actualizarEstadoFechas() {
        const hoy = new Date();
        const hoyLocal = hoy.toLocaleDateString('en-CA');
        const $fechaInicio = $('#fecha_inicio');
        const $fechaFin = $('#fecha_fin');

        $fechaInicio.attr('min', hoyLocal);
        const fechaInicio = $fechaInicio.val();
        if (fechaInicio) {
            $fechaFin
                .prop('disabled', false)
                .attr('min', fechaInicio);

            if ($fechaFin.val() && $fechaFin.val() < fechaInicio) {
                $fechaFin.val('');
            }
        } else {
            $fechaFin
                .prop('disabled', true)
                .val('')
                .removeAttr('min');
        }
    }

    function eliminarEvento(id) {
        Swal.fire({
            title: '¿Eliminar evento?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                apiRequest({ url: `${eventosApiUrl}/${id}`, type: 'DELETE' })
                .then(() => {
                    Swal.fire('Eliminado', 'Evento eliminado correctamente', 'success');
                    $('#eventosTable').DataTable().ajax.reload(null, false);
                })
                .catch(xhr => {
                    let mensaje = 'No se pudo eliminar el evento';
                    validarRespuesta(xhr, mensaje);
                });
            }
        });
    }

    function isoToDate(iso) {
        if (!iso) return '';
        return iso.split('T')[0];
    }
});
