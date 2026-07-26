const acciones = ['ver', 'crear', 'editar', 'eliminar', 'generar'];
const modulo = 'planes-entrenamiento';
const planesEntrenamientoApiUrl = `${apiUrl}/planes-entrenamiento`;

let tablaDeportistasModal = null;
let deportistasEntrenamiento = [];

$(document).ready(function () {
    initPlanesEntrenamientoTable();
    bindEvents();
    validarPermisos(modulo, acciones);

    function initPlanesEntrenamientoTable() {
        if ($.fn.DataTable.isDataTable('#planesEntrenamientoTable')) {
            $('#planesEntrenamientoTable').DataTable().destroy();
        }
        $('#planesEntrenamientoTable').DataTable({
            ajax: function(data, callback, settings) {
                datatableAjax(planesEntrenamientoApiUrl)
                    .then(response => {
                        callback({ data: response });
                    })
                    .catch(err => {
                        callback({ data: [] });
                        let mensaje = 'No se pudo cargar el listado de planes de entrenamiento';
                        validarRespuesta(err, mensaje);
                    });
            },
            columns: [
                { data: 'id', className: 'text-center' },
                { data: 'nombre', className: 'text-center' },
                { data: 'tipo_entrenamiento', className: 'text-center' },
                { data: 'club', className: 'text-center' },
                { data: 'categoria', className: 'text-center' },
                { data: 'genero', className: 'text-center' },
                { data: 'entrenador', className: 'text-center' },
                {
                    data: null,
                    className: 'text-center text-nowrap',
                    render(row) {
                        return `
                            <div class="small">
                                <div><strong>${row.fecha_inicio}</strong></div>
                                <div class="text-success fw-bold">↓</div>
                                <div><strong>${row.fecha_fin}</strong></div>
                            </div>
                        `;
                    }
                },
                {
                    data: 'horarios',
                    className: 'text-center',
                    render(horarios) {

                        if (!horarios.length) {
                            return '<span class="text-muted">Sin horarios</span>';
                        }

                        const contenido = horarios.map(h => `
                            <div class="mb-1">
                                <strong>${h.dia}</strong><br>
                                ${formatearHora(h.hora_inicio)} - ${formatearHora(h.hora_fin)}
                            </div>
                        `).join('');

                        return `
                            <button
                                class="btn btn-outline-success btn-sm btnHorarios"
                                data-bs-toggle="popover"
                                data-bs-trigger="focus"
                                data-bs-placement="left"
                                data-bs-html="true"
                                data-bs-content="${contenido.replace(/"/g, '&quot;')}">
                                Ver horarios (${horarios.length})
                            </button>
                        `;
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
                    data: 'deportistas',
                    className: 'text-center',
                    render(deportistas) {

                        if (!deportistas.length) {
                            return '<span class="badge bg-secondary">0</span>';
                        }

                        const contenido = deportistas.map(d => `
                            <div class="mb-2">
                                <strong>${d.nombre}</strong><br>
                                <small>${d.documento}</small>
                            </div>
                        `).join('');

                        return `
                            <button
                                class="btn btn-outline-primary btn-sm btnDeportistas"
                                data-bs-toggle="popover"
                                data-bs-trigger="focus"
                                data-bs-placement="left"
                                data-bs-html="true"
                                data-bs-content="${contenido.replace(/"/g, '&quot;')}">
                                Ver deportistas (${deportistas.length})
                            </button>
                        `;
                    }
                },
                { data: 'estado', className: 'text-center' },
                {
                    data: null,
                    render: function (data) {
                        return `
                            <div class="d-flex justify-content-center gap-2">

                                <button
                                    class="btnGenerar btn btn-info btn-sm d-none d-flex align-items-center gap-1"
                                    data-id="${data.id}"
                                    title="Generar entrenamientos">
                                    <i data-lucide="calendar-plus" class="icono-tabla"></i>
                                </button>

                                <button
                                    class="btnEditar btn btn-warning btn-sm d-none d-flex align-items-center gap-1"
                                    data-id="${data.id}"
                                    title="Editar">
                                    <i data-lucide="pencil-line" class="icono-tabla"></i>
                                </button>

                                <button
                                    class="btnEliminar btn btn-danger btn-sm d-none d-flex align-items-center gap-1"
                                    data-id="${data.id}"
                                    title="Eliminar">
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
                document.querySelectorAll('[data-bs-toggle="popover"]')
                    .forEach(el => {
                        bootstrap.Popover.getInstance(el)?.dispose();
                        new bootstrap.Popover(el);
                    });
            }
        });
        $('#planesEntrenamientoTable').on('draw.dt', function () {
            validarPermisos(modulo, acciones);
        });
    }

    function bindEvents() {
        $('.btnNuevo').on('click', function () {
            $('#planEntrenamientoForm')[0].reset();
            limpiarFormulario();
            loadClubes();
            loadClubesDeportistas();
            loadCategorias();
            loadGeneros();
            loadEntrenadores();
            loadTiposEntrenamiento();
            loadEventos();
            $('#planEntrenamientoId').val('');
            $('#planEntrenamientoModalLabel').text('Nuevo Entrenamiento');
            $('#planEntrenamientoModal').modal('show');
        });

        $('#btnGuardar').on('click', function () {
            guardarPlanEntrenamiento();
        });

        $('#btnAgregarDeportistas').on('click', abrirModalDeportistas);

        $('#btnEliminarDeportistas').on('click', eliminarDeportistasSeleccionados);

        $('#listaDeportistasEntrenamiento').on('change', '.deportista-check', function () {
            $('#btnEliminarDeportistas').prop(
                'disabled',
                $('.deportista-check:checked').length === 0
            );
        });

        $('#clubFiltroDeportistas').on('change', function () {
            initTablaDeportistas($(this).val());
        });

        $('#btnConfirmarAgregarDeportistas').on('click', agregarDeportistasSeleccionados);

        $('#planesEntrenamientoTable').on('click', '.btnEditar', async function () {
            const id = $(this).data('id');
            $('#loadingOverlay').removeClass('d-none');
            try {
                limpiarFormulario();
                await loadClubesDeportistas();
                await editarPlanEntrenamiento(id);
            } catch (error) {
                console.error(error);
            } finally {
                $('#loadingOverlay').addClass('d-none');
            }
        });

        $('#planesEntrenamientoTable').on('click', '.btnEliminar', function () {
            const id = $(this).data('id');
            eliminarPlanEntrenamiento(id);
        });

        $('#modalDeportistas').on('hidden.bs.modal', function () {
            if (tablaDeportistasModal) {
                tablaDeportistasModal.destroy();
                tablaDeportistasModal = null;
            }

            $('#checkTodosDeportistas').prop('checked', false);
            $('#deportistasModalTable tbody').empty();
        });

        $('#checkTodosDeportistas').on('change', function () {
            const checked = $(this).is(':checked');

            $('#deportistasModalTable tbody .deportista-modal-check').prop('checked', checked);
        });

        $('#deportistasModalTable').on('change', '.deportista-modal-check', function () {
            const total = $('#deportistasModalTable tbody .deportista-modal-check').length;
            const seleccionados = $('#deportistasModalTable tbody .deportista-modal-check:checked').length;

            $('#checkTodosDeportistas').prop(
                'checked',
                total > 0 && total === seleccionados
            );
        });

        $('#planesEntrenamientoTable').on('click', '.btnGenerar', function () {
            previewGeneracion($(this).data('id'));
        });

        $('#btnConfirmarGeneracion').on('click', generarEntrenamientos);
    }

    function guardarPlanEntrenamiento() {
        if (!validarCamposRequeridos('#planEntrenamientoForm')) {
            Swal.fire('Advertencia', 'Por favor completa los campos obligatorios.', 'warning');
            return;
        }

        const id = $('#planEntrenamientoId').val();
        const method = 'POST';

        const url = id
            ? `${planesEntrenamientoApiUrl}/${id}`
            : `${planesEntrenamientoApiUrl}`;

        const formData = new FormData();

        if (id) {
            formData.append('_method', 'PUT');
        }

        formData.append('nombre', $('#nombre').val());
        formData.append('descripcion', $('#descripcion').val());

        formData.append('fecha_inicio', $('#fecha_inicio').val());
        formData.append('fecha_fin', $('#fecha_fin').val());

        formData.append('tipo_entrenamiento_id', $('#tipo_entrenamiento_id').val());
        formData.append('evento_id', $('#evento_id').val());
        formData.append('club_id', $('#club_id').val());
        formData.append('categoria_id', $('#categoria_id').val());
        formData.append('genero_id', $('#genero_id').val());
        formData.append('entrenador_id', $('#entrenador_id').val());

        formData.append('ubicacion', $('#ubicacion').val());
        formData.append('url_mapa', $('#url_mapa').val());

        obtenerHorarios().forEach((horario, index) => {
            formData.append(`horarios[${index}][dia_semana_id]`, horario.dia_semana_id);
            formData.append(`horarios[${index}][hora_inicio]`, horario.hora_inicio);
            formData.append(`horarios[${index}][hora_fin]`, horario.hora_fin);
        });

        deportistasEntrenamiento.forEach((deportista, index) => {
            formData.append(`deportistas[${index}]`, deportista.id);
        });

        apiRequest({
            url,
            type: method,
            data: formData,
        })
        .then(() => {
            Swal.fire('Éxito', id ? 'Plan de Entrenamiento actualizado correctamente' : 'Plan de Entrenamiento creado correctamente', 'success');
            $('#planEntrenamientoModal').modal('hide');
            $('#planesEntrenamientoTable').DataTable().ajax.reload(null, false);
        })
        .catch(err => {
            validarRespuesta(err, 'No se pudo guardar el plan de entrenamiento');
        });
    }

    function eliminarPlanEntrenamiento(id) {
        Swal.fire({
            title: '¿Eliminar plan de entrenamiento?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                apiRequest({ url: `${planesEntrenamientoApiUrl}/${id}`, type: 'DELETE' })
                .then(() => {
                    Swal.fire('Eliminado', 'Entrenamiento eliminado correctamente', 'success');
                    $('#planesEntrenamientoTable').DataTable().ajax.reload(null, false);
                })
                .catch(xhr => {
                    let mensaje = 'No se pudo eliminar el entrenamiento';
                    validarRespuesta(xhr, mensaje);
                });
            }
        });
    }

    function limpiarFormulario() {
        $('#planEntrenamientoForm')[0].reset();
        $('#planEntrenamientoId').val('');

        limpiarHorarios();
        limpiarDeportistasEntrenamiento();

        $('#tipo_entrenamiento_id').val(null).trigger('change');
        $('#evento_id').val(null).trigger('change');
        $('#club_id').val(null).trigger('change');
        $('#categoria_id').val(null).trigger('change');
        $('#genero_id').val(null).trigger('change');
        $('#entrenador_id').val(null).trigger('change');

        limpiarCamposRequeridos('#planEntrenamientoForm');
    }

    async function editarPlanEntrenamiento(id) {
        try {
            const plan = await apiRequest({
                url: `${planesEntrenamientoApiUrl}/${id}`,
                type: 'GET'
            });

            limpiarFormulario();
            await cargarHorarios(plan.horarios ?? []);

            deportistasEntrenamiento = plan.deportistas ?? [];
            renderListaDeportistasEntrenamiento();

            $('#planEntrenamientoId').val(plan.id);

            $('#fecha_inicio').val(plan.fecha_inicio);
            $('#fecha_fin').val(plan.fecha_fin);

            $('#nombre').val(plan.nombre);
            $('#descripcion').val(plan.descripcion);
            $('#ubicacion').val(plan.ubicacion);
            $('#url_mapa').val(plan.url_mapa);

            loadClubes(plan.club?.id);
            loadCategorias(plan.categoria?.id);
            loadGeneros(plan.genero?.id);
            loadEntrenadores(plan.entrenador?.id);
            loadTiposEntrenamiento(plan.tipo?.id);
            loadEventos(plan.evento?.id);

            $('#planEntrenamientoModalLabel').text('Editar Plan de Entrenamiento');
            $('#planEntrenamientoModal').modal('show');

        } catch (err) {
            validarRespuesta(err, 'No se pudo cargar el plan de entrenamiento');
        }
    }
});
