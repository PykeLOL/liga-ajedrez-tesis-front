const acciones = ['ver', 'crear', 'editar', 'eliminar'];
const modulo = 'entrenamientos';
const entrenamientosApiUrl = `${apiUrl}/entrenamientos`;

let deportistasEntrenamiento = [];
let tablaDeportistasModal = null;
let editandoEntrenamiento = false;

const camposRequeridosManual = [
    '#tipo_entrenamiento_id',
    '#club_id',
    '#categoria_id',
    '#genero_id',
    '#entrenador_id',
    '#nombre',
    '#ubicacion'
];

$(document).ready(function () {
    initEntrenamientosTable();
    bindEvents();
    validarPermisos(modulo, acciones);

    function initEntrenamientosTable() {
        if ($.fn.DataTable.isDataTable('#entrenamientosTable')) {
            $('#entrenamientosTable').DataTable().destroy();
        }
        $('#entrenamientosTable').DataTable({
            ajax: function(data, callback, settings) {
                datatableAjax(entrenamientosApiUrl)
                    .then(response => {
                        callback({ data: response });
                    })
                    .catch(err => {
                        callback({ data: [] });
                        let mensaje = 'No se pudo cargar el listado de entrenamientos';
                        validarRespuesta(err, mensaje);
                    });
            },
            columns: [
                { data: 'id', className: 'text-center' },
                { data: 'tipo_entrenamiento', className: 'text-center' },
                { data: 'club', className: 'text-center' },
                { data: 'categoria', className: 'text-center' },
                { data: 'genero', className: 'text-center' },
                { data: 'entrenador', className: 'text-center' },
                { data: 'fecha', className: 'text-center' },
                {
                    data: null,
                    render(row) {
                        return `${row.hora_inicio} - ${row.hora_fin}`;
                    },
                    className: 'text-center'
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
                    data: 'total_deportistas',
                    className: 'text-center',
                    render(total) {
                        return `<span class="badge bg-success">${total}</span>`;
                    }
                },
                {
                    data: null,
                    render: function (data) {
                        return `
                            <div class="d-flex justify-content-center gap-2">
                                <button class="btnAsistencia btn btn-info btn-sm d-none align-items-center gap-1"
                                    data-id="${data.id}"
                                    title="Gestionar asistencia">
                                    <i data-lucide="clipboard-check" class="icono-tabla"></i>
                                </button>
                                <button class="btnEditar btn btn-warning btn-sm d-none d-flex align-items-center gap-1"
                                    data-id="${data.id}"
                                    title="Editar">
                                    <i data-lucide="pencil-line" class="icono-tabla"></i>
                                </button>
                                <button class="btnEliminar btn btn-danger btn-sm d-none d-flex align-items-center gap-1"
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
            }
        });
        $('#entrenamientosTable').on('draw.dt', function () {
            validarPermisos(modulo, acciones);
        });
    }

    function bindEvents() {
        $('.btnNuevo').on('click', function () {
            editandoEntrenamiento = false;
            $('#entrenamientoForm')[0].reset();
            limpiarFormulario();
            loadPlanes();
            loadClubes();
            loadClubesDeportistas();
            loadCategorias();
            loadGeneros();
            loadEntrenadores();
            loadTiposEntrenamiento();
            loadEventos();
            $('#entrenamientoId').val('');
            $('#entrenamientoModalLabel').text('Nuevo Entrenamiento');
            $('#entrenamientoModal').modal('show');
        });

        $('#btnGuardar').on('click', function () {
            guardarEntrenamiento();
        });

        $('#modoManual').on('change', mostrarModoManual);
        $('#modoPlan').on('change', mostrarModoPlan);
        $('#plan_entrenamiento_id').off('change').on('change', async function () {
            await seleccionarPlan($(this).val());
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

        $('#entrenamientosTable').on('click', '.btnEditar', async function () {
            const id = $(this).data('id');
            $('#loadingOverlay').removeClass('d-none');
            try {
                limpiarFormulario();
                await loadClubesDeportistas();
                await editarEntrenamiento(id);
            } catch (error) {
                console.error(error);
            } finally {
                $('#loadingOverlay').addClass('d-none');
            }
        });

        $('#entrenamientosTable').on('click', '.btnEliminar', function () {
            const id = $(this).data('id');
            eliminarEntrenamiento(id);
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

        $('#entrenamientosTable').on('click', '.btnAsistencia', async function () {
            const id = $(this).data('id');
            await abrirModalAsistencias(id);
        });

        $('#btnGuardarAsistencias').on('click', guardarAsistencias);

        $('#tablaAsistencias').on('change', '.check-puntual', function () {
            if (!$(this).is(':checked')) {
                return;
            }

            const fila = $(this).closest('tr');
            fila.find('.estado-asistencia').val(2);
            fila.find('.hora-llegada').val(horaInicioEntrenamiento);
            if (!fila.find('.observaciones').val().trim()) {
                fila.find('.observaciones').val('Llegó puntualmente.');
            }
        });
    }

    function guardarEntrenamiento() {
        if (!validarCamposRequeridos('#entrenamientoForm')) {
            Swal.fire('Advertencia', 'Por favor completa los campos obligatorios.', 'warning');
            return;
        }

        const id = $('#entrenamientoId').val();
        const method = 'POST';

        const url = id
            ? `${apiUrl}/entrenamientos/${id}`
            : `${apiUrl}/entrenamientos`;

        const formData = new FormData();

        if (id) {
            formData.append('_method', 'PUT');
        }

        formData.append('fecha', $('#fecha').val());
        formData.append('hora_inicio', $('#hora_inicio').val());
        formData.append('hora_fin', $('#hora_fin').val());
        formData.append('observaciones', $('#observaciones').val());
        deportistasEntrenamiento.forEach((deportista, index) => {
            formData.append(`deportistas[${index}]`, deportista.id);
        });

        if ($('#modoPlan').is(':checked')) {
            formData.append('plan_entrenamiento_id', $('#plan_entrenamiento_id').val());
        } else {
            formData.append('tipo_entrenamiento_id', $('#tipo_entrenamiento_id').val());
            formData.append('evento_id', $('#evento_id').val());
            formData.append('club_id', $('#club_id').val());
            formData.append('categoria_id', $('#categoria_id').val());
            formData.append('genero_id', $('#genero_id').val());
            formData.append('entrenador_id', $('#entrenador_id').val());

            formData.append('nombre', $('#nombre').val());
            formData.append('descripcion', $('#descripcion').val());
            formData.append('ubicacion', $('#ubicacion').val());
            formData.append('url_mapa', $('#url_mapa').val());
        }

        apiRequest({
            url: url,
            type: method,
            data: formData,
        })
        .then(() => {
            Swal.fire('Éxito', id ? 'Entrenamiento actualizado correctamente' : 'Entrenamiento creado correctamente', 'success');
            $('#entrenamientoModal').modal('hide');
            $('#entrenamientosTable').DataTable().ajax.reload(null, false);
        })
        .catch(err => {
            validarRespuesta(err, 'No se pudo guardar el entrenamiento');
        });
    }

    function eliminarEntrenamiento(id) {
        Swal.fire({
            title: '¿Eliminar entrenamiento?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                apiRequest({ url: `${entrenamientosApiUrl}/${id}`, type: 'DELETE' })
                .then(() => {
                    Swal.fire('Eliminado', 'Entrenamiento eliminado correctamente', 'success');
                    $('#entrenamientosTable').DataTable().ajax.reload(null, false);
                })
                .catch(xhr => {
                    let mensaje = 'No se pudo eliminar el entrenamiento';
                    validarRespuesta(xhr, mensaje);
                });
            }
        });
    }

    function limpiarFormulario() {
        $('#entrenamientoForm')[0].reset();
        $('#entrenamientoId').val('');
        limpiarDeportistasEntrenamiento();

        $('#modoManual').prop('checked', true);
        mostrarModoManual();

        $('#plan_entrenamiento_id').val(null).trigger('change');
        $('#tipo_entrenamiento_id').val(null).trigger('change');
        $('#evento_id').val(null).trigger('change');
        $('#club_id').val(null).trigger('change');
        $('#categoria_id').val(null).trigger('change');
        $('#genero_id').val(null).trigger('change');
        $('#entrenador_id').val(null).trigger('change');

        limpiarResumenPlan();
        limpiarCamposRequeridos('#entrenamientoForm');

        $('input[name="modo_creacion"]').prop('disabled', false);
        $('#plan_entrenamiento_id').prop('disabled', false);
    }

    async function editarEntrenamiento(id) {
        try {
            const entrenamiento = await apiRequest({
                url: `${entrenamientosApiUrl}/${id}`,
                type: 'GET'
            });

            limpiarFormulario();
            editandoEntrenamiento = true;

            deportistasEntrenamiento = entrenamiento.deportistas ?? [];
            renderListaDeportistasEntrenamiento();

            $('#entrenamientoId').val(entrenamiento.id);
            $('input[name="modo_creacion"]').prop('disabled', true);

            $('#fecha').val(entrenamiento.fecha);
            $('#hora_inicio').val(entrenamiento.hora_inicio);
            $('#hora_fin').val(entrenamiento.hora_fin);
            $('#observaciones').val(entrenamiento.observaciones);

            if (entrenamiento.plan_entrenamiento) {
                $('#modoPlan').prop('checked', true);
                mostrarModoPlan();

                $('#plan_entrenamiento_id')
                    .prop('disabled', true)
                    .val(entrenamiento.plan_entrenamiento.id)
                    .trigger('change');
            } else {
                $('#modoManual').prop('checked', true);
                mostrarModoManual();
            }

            $('#tipo_entrenamiento_id').val(entrenamiento.tipo_entrenamiento?.id).trigger('change');
            $('#evento_id').val(entrenamiento.evento?.id).trigger('change');
            $('#club_id').val(entrenamiento.club?.id).trigger('change');
            $('#categoria_id').val(entrenamiento.categoria?.id).trigger('change');
            $('#genero_id').val(entrenamiento.genero?.id).trigger('change');
            $('#entrenador_id').val(entrenamiento.entrenador?.id).trigger('change');

            $('#nombre').val(entrenamiento.nombre);
            $('#descripcion').val(entrenamiento.descripcion);
            $('#ubicacion').val(entrenamiento.ubicacion);
            $('#url_mapa').val(entrenamiento.url_mapa);

            loadPlanes(entrenamiento.plan_entrenamiento?.id);
            loadClubes(entrenamiento.club?.id);
            loadCategorias(entrenamiento.categoria?.id);
            loadGeneros(entrenamiento.genero?.id);
            loadEntrenadores(entrenamiento.entrenador?.id);
            loadTiposEntrenamiento(entrenamiento.tipo_entrenamiento?.id);
            loadEventos(entrenamiento.evento?.id);

            $('#entrenamientoModalLabel').text('Editar Entrenamiento');
            $('#entrenamientoModal').modal('show');
        } catch (err) {
            validarRespuesta(err, 'No se pudo cargar el entrenamiento');
        }
    }

    function mostrarModoManual() {
        $('#contenedorPlan').addClass('d-none');
        $('#contenedorManual').removeClass('d-none');

        camposRequeridosManual.forEach(campo => {
            $(campo).addClass('required');
        });
    }
});
