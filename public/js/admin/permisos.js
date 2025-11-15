$(document).ready(function () {
    const acciones = ['ver', 'crear', 'editar', 'eliminar'];
    const modulo = "permisos";

    const tipoAccionApiUrl = `${apiUrl}/tipo-accion`;
    const modulosApiUrl = `${apiUrl}/modulos`;

    initPermisosTable();
    bindEvents();
    validarPermisos(modulo, acciones); 

    if (!token) { 
        window.location.href = loginUrl; 
        return;
    }

    function initPermisosTable() {
        if ($.fn.DataTable.isDataTable('#permisosTable')) {
            $('#permisosTable').DataTable().destroy();
        }
        $('#permisosTable').DataTable({
            ajax: function(data, callback, settings) {
                datatableAjax(`${apiUrl}/permisos`)
                    .then(response => {
                        callback({ data: response });
                    })
                    .catch(err => {
                        callback({ data: [] });
                        let mensaje = 'No se pudo cargar el listado de permisos';
                        validarRespuesta(err, mensaje); 
                    });
            },
            columns: [
                { data: 'id' },
                { data: 'nombre' },
                { data: 'descripcion' },
                {
                    data: null,
                    render: function (data){
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
        $('#permisosTable').on('draw.dt', function () {
            validarPermisos(modulo, acciones);
        });
    }

    function bindEvents() {
        $('.btnNuevo').on('click', function () {
            $('#permisoForm')[0].reset();
            limpiarFormulario(); 
            $('#permisoId').val('');
            $('#permisoModalLabel').text('Nuevo Permiso');
            cargarTipoAcciones();
            cargarModulos();
            
            $('#permisoModal').modal('show');
        });

        $('#permisosTable').on('click', '.btnEditar', async function () {
            const id = $(this).data('id');
            $('#permisoForm')[0].reset();
            limpiarFormulario();
            $('#permisoModalLabel').text('Editar Permiso');

            try {
                const permiso = await apiRequest({ url: `${apiUrl}/permisos/${id}`, type: 'GET' });

                
                $('#permisoId').val(permiso.id);
                $('#descripcion').val(permiso.descripcion);
                $('#nombreGenerado').val(permiso.nombre);
                $('#nombre').val(permiso.nombre);

               
                await cargarTipoAcciones(permiso.tipo_accion_id);
                await cargarModulos(permiso.modulo_id);
                
                
                $('#permisoModal').modal('show');

            } catch (xhr) {
                let mensaje = 'No se pudo cargar el permiso para editar';
                validarRespuesta(xhr, mensaje);
            }
        });
        
        
        $('#btnGuardar').on('click', function () {
            guardarPermiso();
        });
        
        $('#permisosTable').on('click', '.btnEliminar', function () {
            const id = $(this).data('id');
            eliminarPermiso(id);
        });

        $('#logoutBtn').on('click', function () {
            sessionStorage.removeItem('token');
            window.location.href = loginUrl;
        });
        
        
        $('#tipoAccionSelect').off('change').on('change', generarNombrePermiso);
        $('#moduloSelect').off('change').on('change', generarNombrePermiso);
    }

    $(document).on('input change', '.required', function() {
        if ($(this).val()?.trim()) {
            $(this).removeClass('is-invalid');
            $(this).next('.invalid-feedback').remove();
        }
    });

    function guardarPermiso() {
        if (!validarCamposRequeridos('#permisoForm')) { 
            Swal.fire('Advertencia', 'Por favor completa los campos obligatorios.', 'warning');
            return;
        }
        const id = $('#permisoId').val();

        const data = {
            tipo_accion_id: $('#tipoAccionSelect').val(),
            modulo_id: $('#moduloSelect').val(),
            nombre: $('#nombreGenerado').val(), 
            descripcion: $('#descripcion').val(),
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/permisos/${id}` : `${apiUrl}/permisos`;   

        $('#permisoForm .is-invalid').removeClass('is-invalid');
        $('#permisoForm .invalid-feedback').remove();

        apiRequest({ 
            url,
            type: method,
            data: JSON.stringify(data),
            contentType: 'application/json'
        })
        .then(() => {
            Swal.fire('Éxito', 'Permiso guardado correctamente', 'success');
            $('#permisoModal').modal('hide');
            $('#permisosTable').DataTable().ajax.reload(null, false);
        })
        .catch(xhr => {
            let mensaje = 'No se pudo guardar el permiso';
            validarRespuesta(xhr, mensaje);
        });
    }

    function eliminarPermiso(id) {
        Swal.fire({
            title: '¿Eliminar permiso?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                apiRequest({ url: `${apiUrl}/permisos/${id}`, type: 'DELETE' })
                .then(() => {
                    Swal.fire('Eliminado', 'Permiso eliminado correctamente', 'success');
                    $('#permisosTable').DataTable().ajax.reload(null, false);
                })
                .catch(xhr => {
                    let mensaje = 'No se pudo eliminar el permiso';
                    validarRespuesta(xhr, mensaje);
                });
            }
        });
    }

    function limpiarFormulario() {
        $('#permisoId').val('');
        $('#descripcion').val('');
        $('#nombreGenerado').val('');
        $('#nombre').val('');

     
        if ($('#tipoAccionSelect').hasClass('select2-hidden-accessible')) {
            $('#tipoAccionSelect').select2('destroy');
        }
        if ($('#moduloSelect').hasClass('select2-hidden-accessible')) {
            $('#moduloSelect').select2('destroy');
        }
        $('#tipoAccionSelect').html('');
        $('#moduloSelect').html('');
        
        limpiarCamposRequeridos('#permisoForm'); 
    }

     function cargarTipoAcciones(selectedId = null) {
        apiRequest({
            url: `${apiUrl}/tipo-accion/select`,
            type: 'GET'
        })
        .then(tiposAccion => {
            const $tipoAccionSelect = $('#tipoAccionSelect');
            $tipoAccionSelect.empty().append('<option value="">Seleccione un tipo de accion</option>');
            tiposAccion.forEach(r => {
                $tipoAccionSelect.append(new Option(r.nombre, r.id, false, false));
            });
            if ($tipoAccionSelect.hasClass('select2-hidden-accessible')) {
                $tipoAccionSelect.trigger('change.select2');
            } else {
                $tipoAccionSelect.select2({
                    placeholder: 'Seleccione un tipo de accion',
                    allowClear: true,
                    width: 'resolve',
                    dropdownParent: $('#permisoModal')
                });
            }
            if (selectedId) {
                $tipoAccionSelect.val(selectedId).trigger('change');
            }
        })
        .catch(xhr => console.error('Error cargando tipos de accion:', xhr));
    }

    function cargarModulos(selectedId = null) {
        apiRequest({
            url: `${apiUrl}/modulos/select`,
            type: 'GET'
        })
        .then(modulos => {
            const $moduloSelect = $('#moduloSelect');
            $moduloSelect.empty().append('<option value="">Seleccione un modulo</option>');
            modulos.forEach(r => {
                $moduloSelect.append(new Option(r.nombre, r.id, false, false));
            });
            if ($moduloSelect.hasClass('select2-hidden-accessible')) {
                $moduloSelect.trigger('change.select2');
            } else {
                $moduloSelect.select2({
                    placeholder: 'Seleccione un modulo',
                    allowClear: true,
                    width: 'resolve',
                    dropdownParent: $('#permisoModal')
                });
            }
            if (selectedId) {
                $moduloSelect.val(selectedId).trigger('change');
            }
        })
        .catch(xhr => console.error('Error cargando modulos:', xhr));
    }
   
   
    function generarNombrePermiso() {
        const tipoAccionData = $('#tipoAccionSelect').hasClass('select2-hidden-accessible') ? $('#tipoAccionSelect').select2('data') : [];
        const moduloData = $('#moduloSelect').hasClass('select2-hidden-accessible') ? $('#moduloSelect').select2('data') : [];

        const tipoAccionText = (tipoAccionData && tipoAccionData[0]) ? tipoAccionData[0].text : '';
        const moduloText = (moduloData && moduloData[0]) ? moduloData[0].text : '';

        if (tipoAccionText && moduloText) {
            const nombreGenerado = `${tipoAccionText.toLowerCase().replace(/\s/g, '-')}-${moduloText.toLowerCase().replace(/\s/g, '-')}`;
            $('#nombreGenerado').val(nombreGenerado);
            $('#nombre').val(nombreGenerado);
        } else {
            $('#nombreGenerado').val('');
            $('#nombre').val('');
        }
    }
    
    function validarRespuesta(xhr, mensaje) {
        console.error('Error en la solicitud:', xhr);
            let titulo = 'Error';
            let icono = 'error';

            if (xhr.responseJSON) {
                const res = xhr.responseJSON;
                if (res.errors) {
                    titulo = 'Advertencia';
                    icono = 'warning';
                    const errores = Object.values(res.errors).flat();
                    mensaje = errores.join('<br>');
                }
                else if (res.message && xhr.status === 403) {
                    titulo = 'Advertencia';
                    icono = 'warning';
                    mensaje = 'No tienes permiso para realizar esta acción.';
                }
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
});