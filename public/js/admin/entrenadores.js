$(document).ready(function () {
    const acciones = ['ver', 'crear', 'editar', 'eliminar'];
    const modulo = 'entrenadores';
    const entrenadoresApiUrl = `${apiUrl}/entrenadores`;

    initEntrenadoresTable();
    bindEvents();
    cargarSelects();
    validarPermisos(modulo, acciones);

    function initEntrenadoresTable() {
        if ($.fn.DataTable.isDataTable('#entrenadoresTable')) $('#entrenadoresTable').DataTable().destroy();

        $('#entrenadoresTable').DataTable({
            ajax: function (data, callback) {
                datatableAjax(entrenadoresApiUrl).then(response => callback({ data: response })).catch(xhr => {
                    callback({ data: [] });
                    validarRespuesta(xhr, 'No se pudo cargar el listado de entrenadores');
                });
            },
            columns: [
                { data: 'id', className: 'text-center' },
                {
                    data: 'usuario',
                    render: data => data ? `${data.nombre} ${data.apellido}` : '-'
                },
                {
                    data: null,
                    render: data => data.tipo_identificacion && data.numero_identificacion ? `${data.tipo_identificacion} ${data.numero_identificacion}` : data.numero_identificacion ?? '-'
                },
                {
                    data: 'fide_id',
                    className: 'text-center',
                    render: function (fideId) {
                        if (!fideId) return '<span class="text-muted">—</span>';
                        const id = encodeURIComponent(fideId);
                        return `<a href="https://ratings.fide.com/profile/${id}" target="_blank" rel="noopener noreferrer" class="text-decoration-none fw-semibold">${fideId}</a>`;
                    }
                },
                {
                    data: 'club',
                    render: data => data?.nombre ?? 'Sin club'
                },
                {
                    data: 'genero',
                    className: 'text-center',
                    defaultContent: '-'
                },
                {
                    data: 'categorias',
                    className: 'text-center',
                    render: data => `<span class="badge bg-primary">${Array.isArray(data) ? data.length : 0}</span>`
                },
                {
                    data: 'certificaciones',
                    className: 'text-center',
                    render: data => `<span class="badge bg-info">${Array.isArray(data) ? data.length : 0}</span>`
                },
                {
                    data: 'estado',
                    className: 'text-center',
                    render: data => data ? '<span class="badge bg-success">Activo</span>' : '<span class="badge bg-secondary">Inactivo</span>'
                },
                {
                    data: null,
                    orderable: false,
                    className: 'text-center',
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

        $('#entrenadoresTable').on('draw.dt', function () {
            validarPermisos(modulo, acciones);
        });
    }

    function bindEvents() {
        $('.btnNuevo').on('click', function () {
            $('#entrenadorForm')[0].reset();
            limpiarFormulario();
            $('#entrenadorId').val('');
            $('#entrenadorModalLabel').text('Nuevo Entrenador');
            $('#usuario_id').prop('disabled', false);
            $('#entrenadorModal').modal('show');
        });

        $('#entrenadorForm').on('submit', function (e) {
            e.preventDefault();
            guardarEntrenador();
        });

        $('#entrenadoresTable').on('click', '.btnEditar', function () {
            const id = $(this).data('id');
            limpiarFormulario();
            editarEntrenador(id);
        });

        $('#entrenadoresTable').on('click', '.btnEliminar', function () {
            const id = $(this).data('id');
            eliminarEntrenador(id);
        });

        $('#btnAgregarCertificacion').on('click', function () {
            agregarCertificacion();
        });

        $('#certificacionesContainer').on('click', '.btnEliminarCertificacion', function () {
            $(this).closest('.certificacion-item').remove();
        });
    }

    $(document).on('input change', '.required', function () {
        if ($(this).val()?.toString().trim()) {
            $(this).removeClass('is-invalid');
            $(this).next('.invalid-feedback').remove();
        }
    });

    function cargarSelects() {
        Promise.all([
            cargarSelect('usuario_id', `${apiUrl}/select/usuarios`, 'Seleccione un usuario'),
            cargarSelect('club_id', `${apiUrl}/select/clubes`, 'Seleccione un club'),
            cargarSelect('genero_id', `${apiUrl}/select/generos`, 'Seleccione un género'),
            cargarSelect('nacionalidad_id', `${apiUrl}/select/nacionalidades`, 'Seleccione una nacionalidad'),
            cargarSelect('titulo_id', `${apiUrl}/select/titulos`, 'Seleccione un título'),
            cargarSelect('categorias', `${apiUrl}/select/categorias`, 'Seleccione categorías', true)
        ]).catch(xhr => validarRespuesta(xhr, 'No se pudieron cargar los datos de los formularios'));
    }

    function cargarSelect(id, url, placeholder, multiple = false, selected = null) {
        return apiRequest({ url, type: 'GET' }).then(response => {
            const $select = $(`#${id}`);
            $select.empty();

            if (!multiple) $select.append(new Option(placeholder, '', false, false));

            (Array.isArray(response) ? response : []).forEach(item => {
                $select.append(new Option(item.nombre ?? item.descripcion ?? item.codigo ?? `Registro ${item.id}`, item.id, false, false));
            });

            if ($select.hasClass('select2-hidden-accessible')) $select.select2('destroy');

            $select.select2({
                placeholder,
                allowClear: !multiple,
                width: '100%',
                dropdownParent: $('#entrenadorModal'),
                closeOnSelect: !multiple
            });

            if (selected !== null) $select.val(selected).trigger('change');
        });
    }

    function guardarEntrenador() {
        if (!validarCamposRequeridos('#entrenadorForm')) {
            Swal.fire('Advertencia', 'Por favor completa los campos obligatorios.', 'warning');
            return;
        }

        const id = $('#entrenadorId').val();
        const formData = new FormData();

        if (id) formData.append('_method', 'PUT');

        formData.append('usuario_id', $('#usuario_id').val());
        formData.append('club_id', $('#club_id').val() || '');
        formData.append('fecha_nacimiento', $('#fecha_nacimiento').val());
        formData.append('genero_id', $('#genero_id').val());
        formData.append('nacionalidad_id', $('#nacionalidad_id').val());
        formData.append('experiencia_anios', $('#experiencia_anios').val() || '0');
        formData.append('especialidad', $('#especialidad').val() || '');
        formData.append('fide_id', $('#fide_id').val() || '');
        formData.append('titulo_id', $('#titulo_id').val() || '');
        formData.append('estado', $('#estado').val());

        const categorias = $('#categorias').val() || [];
        categorias.forEach((categoriaId, index) => {
            formData.append(`categorias[${index}][categoria_id]`, categoriaId);
        });

        $('#certificacionesContainer .certificacion-item').each(function (index) {
            const nombre = $(this).find('.certificacion-nombre').val()?.trim() || '';
            const entidadId = $(this).find('.certificacion-entidad').val()?.trim() || '';
            const descripcion = $(this).find('.certificacion-descripcion').val()?.trim() || '';

            if (!nombre && !entidadId && !descripcion) return;

            formData.append(`certificaciones[${index}][nombre]`, nombre);
            formData.append(`certificaciones[${index}][entidad_id]`, entidadId);
            formData.append(`certificaciones[${index}][descripcion]`, descripcion);
        });

        const url = id ? `${entrenadoresApiUrl}/${id}` : entrenadoresApiUrl;

        $('#entrenadorForm .is-invalid').removeClass('is-invalid');
        $('#entrenadorForm .invalid-feedback').remove();

        apiRequest({
            url,
            type: 'POST',
            data: formData
        }).then(() => {
            Swal.fire('Éxito', id ? 'Entrenador actualizado correctamente' : 'Entrenador creado correctamente', 'success');
            $('#entrenadorModal').modal('hide');
            $('#entrenadoresTable').DataTable().ajax.reload(null, false);
        }).catch(xhr => {
            validarRespuesta(xhr, 'No se pudo guardar el entrenador');
        });
    }

    function editarEntrenador(id) {
        apiRequest({ url: `${entrenadoresApiUrl}/${id}`, type: 'GET' }).then(entrenador => {
            $('#entrenadorModalLabel').text('Editar Entrenador');
            $('#entrenadorId').val(entrenador.id);
            $('#usuario_id').val(entrenador.usuario_id).trigger('change').prop('disabled', true);
            $('#club_id').val(entrenador.club_id ?? '').trigger('change');
            $('#fecha_nacimiento').val(entrenador.fecha_nacimiento ?? '');
            $('#genero_id').val(entrenador.genero_id ?? '').trigger('change');
            $('#nacionalidad_id').val(entrenador.nacionalidad_id ?? '').trigger('change');
            $('#fide_id').val(entrenador.fide_id ?? '');
            $('#titulo_id').val(entrenador.titulo_id ?? '').trigger('change');
            $('#experiencia_anios').val(entrenador.experiencia_anios ?? '');
            $('#especialidad').val(entrenador.especialidad ?? '');
            $('#estado').val(entrenador.estado ? '1' : '0');

            cargarCategorias((entrenador.categorias || []).map(categoria => categoria.id));

            (entrenador.certificaciones || []).forEach(certificacion => agregarCertificacion(certificacion));

            $('#entrenadorModal').modal('show');
        }).catch(xhr => {
            validarRespuesta(xhr, 'No se pudo cargar el entrenador');
        });
    }

    function eliminarEntrenador(id) {
        Swal.fire({
            title: '¿Eliminar entrenador?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (!result.isConfirmed) return;

            apiRequest({ url: `${entrenadoresApiUrl}/${id}`, type: 'DELETE' }).then(() => {
                Swal.fire('Eliminado', 'Entrenador eliminado correctamente', 'success');
                $('#entrenadoresTable').DataTable().ajax.reload(null, false);
            }).catch(xhr => {
                validarRespuesta(xhr, 'No se pudo eliminar el entrenador');
            });
        });
    }

    function agregarCertificacion(data = null) {
        const index = $('#certificacionesContainer .certificacion-item').length + 1;

        $('#certificacionesContainer').append(`
            <div class="certificacion-item card border mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <strong>Certificación ${index}</strong>
                        <button type="button" class="btn btn-danger btn-sm btnEliminarCertificacion" title="Eliminar">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-5">
                            <label class="form-label">Nombre</label>
                            <input type="text" class="form-control certificacion-nombre" maxlength="100" value="${escapeHtml(data?.nombre ?? '')}">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Entidad</label>
                            <select class="form-select certificacion-entidad"></select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Descripción</label>
                            <input type="text" class="form-control certificacion-descripcion" maxlength="255" value="${escapeHtml(data?.descripcion ?? '')}">
                        </div>
                    </div>
                </div>
            </div>
        `);

        const $select = $('#certificacionesContainer .certificacion-item:last .certificacion-entidad');

        cargarEntidadesCertificacion($select, data?.entidad_id ?? data?.entidad?.id ?? null);
        lucide.createIcons();
    }

    function cargarEntidadesCertificacion($select, selected = null) {
        apiRequest({
            url: `${apiUrl}/select/entidades-certificacion`,
            type: 'GET'
        }).then(response => {
            $select.empty().append(new Option('Seleccione una entidad', '', false, false));

            (Array.isArray(response) ? response : []).forEach(entidad => {
                $select.append(new Option(entidad.nombre, entidad.id, false, false));
            });

            if ($select.hasClass('select2-hidden-accessible')) {
                $select.select2('destroy');
            }

            $select.select2({
                placeholder: 'Seleccione una entidad',
                allowClear: true,
                width: '100%',
                dropdownParent: $('#entrenadorModal .modal-content'),
                dropdownCssClass: 'entrenador-select2-dropdown'
            });

            if (selected !== null && selected !== '') {
                $select.val(String(selected)).trigger('change');
            }
        }).catch(xhr => {
            validarRespuesta(xhr, 'No se pudieron cargar las entidades de certificación');
        });
    }

    function cargarCategorias(selected = []) {
        return apiRequest({
            url: `${apiUrl}/select/categorias`,
            type: 'GET'
        }).then(response => {
            const $select = $('#categorias');
            const seleccionadas = selected.map(String);

            if ($select.hasClass('select2-hidden-accessible')) $select.select2('destroy');

            $select.empty();

            (Array.isArray(response) ? response : []).forEach(categoria => {
                $select.append(new Option(categoria.nombre, categoria.id, false, seleccionadas.includes(String(categoria.id))));
            });

            $select.select2({
                placeholder: 'Seleccione categorías',
                allowClear: true,
                width: '100%',
                multiple: true,
                closeOnSelect: false,
                dropdownParent: $('#entrenadorModal .modal-content'),
                templateResult: function (data) {
                    if (!data.id) return data.text;

                    const valores = $select.val() || [];

                    if (valores.includes(String(data.id))) return null;

                    return data.text;
                }
            });
        });
    }

    function actualizarCategoriasDisponibles() {
        const $select = $('#categorias');
        const seleccionadas = ($select.val() || []).map(String);

        $select.find('option').each(function () {
            const id = String($(this).val());
            $(this).prop('disabled', seleccionadas.includes(id));
        });

        $select.trigger('change.select2');
    }

    function limpiarFormulario() {
        $('#entrenadorForm')[0].reset();
        $('#entrenadorId').val('');
        $('#certificacionesContainer').empty();
        $('#usuario_id,#club_id,#genero_id,#nacionalidad_id,#titulo_id,#categorias').val(null).trigger('change');
        $('#estado').val('1');
        $('#usuario_id').prop('disabled', false);
        limpiarCamposRequeridos('#entrenadorForm');
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
});
