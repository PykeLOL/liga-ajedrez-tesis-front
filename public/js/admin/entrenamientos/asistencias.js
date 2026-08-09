let entrenamientoAsistenciaId = null;
let horaInicioEntrenamiento = null;

const estadosAsistencia = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'Asistió' },
    { id: 3, nombre: 'No Asistió' },
    { id: 4, nombre: 'Excusado' }
];

async function abrirModalAsistencias(id) {
    entrenamientoAsistenciaId = id;

    $('#loadingOverlay').removeClass('d-none');

    try {
        const entrenamiento = await apiRequest({
            url: `${entrenamientosApiUrl}/asistencias/${id}`,
            type: 'GET'
        });

        horaInicioEntrenamiento = entrenamiento.hora_inicio;
        pintarResumenAsistencia(entrenamiento);
        pintarTablaAsistencia(entrenamiento.deportistas);

        $('#modalAsistencias').modal('show');
    } catch (error) {
        validarRespuesta(error, 'No fue posible cargar la asistencia.');
    } finally {
        $('#loadingOverlay').addClass('d-none');
    }
}

function pintarResumenAsistencia(entrenamiento) {
    $('#infoEntrenamiento').html(`
        <div class="row mb-3">
            <div class="col-md-3">
                <strong>Estado</strong><br>
                <span class="badge bg-success">
                    ${entrenamiento.estado.nombre}
                </span>
            </div>
            <div class="col-md-3">
                <strong>Fecha</strong><br>
                ${entrenamiento.fecha}
            </div>
            <div class="col-md-3">
                <strong>Hora inicio</strong><br>
                ${entrenamiento.hora_inicio}
            </div>
            <div class="col-md-3">
                <strong>Hora fin</strong><br>
                ${entrenamiento.hora_fin}
            </div>
        </div>
    `);
}

function pintarTablaAsistencia(deportistas) {
    const tbody = $('#tablaAsistencias');
    tbody.empty();
    deportistas.forEach(deportista => {
        const opciones = estadosAsistencia.map(estado => `
            <option value="${estado.id}"
                ${estado.id === deportista.estado_asistencia.id ? 'selected' : ''}>
                ${estado.nombre}
            </option>
        `).join('');

        tbody.append(`
            <tr data-id="${deportista.id}">
                <td>${deportista.nombre}</td>
                <td>${deportista.numero_identificacion}</td>
                <td>
                    <select class="form-select estado-asistencia">
                        ${opciones}
                    </select>
                </td>
                <td class="text-center">
                    <div class="form-check d-flex justify-content-center">
                        <input
                            class="form-check-input check-puntual"
                            type="checkbox"
                            title="Marcar como llegada puntual">
                    </div>
                </td>
                <td>
                    <input
                        type="time"
                        class="form-control hora-llegada"
                        value="${deportista.hora_llegada ?? ''}">
                </td>
                <td>
                    <textarea
                        rows="2"
                        class="form-control observaciones">${deportista.observaciones ?? ''}</textarea>
                </td>
            </tr>
        `);
    });
}

async function guardarAsistencias() {
    const formData = new FormData();
    $('#tablaAsistencias tr').each(function (index) {
        formData.append(`deportistas[${index}][id]`, $(this).data('id'));
        formData.append( `deportistas[${index}][estado_asistencia_id]`, $(this).find('.estado-asistencia').val());
        formData.append(`deportistas[${index}][hora_llegada]`, $(this).find('.hora-llegada').val());
        formData.append(`deportistas[${index}][observaciones]`, $(this).find('.observaciones').val());
    });

    try {
        await apiRequest({
            url: `${entrenamientosApiUrl}/asistencias/${entrenamientoAsistenciaId}`,
            type: 'POST',
            data: formData
        });

        Swal.fire(
            'Éxito',
            'Las asistencias fueron registradas correctamente.',
            'success'
        );

        $('#modalAsistencias').modal('hide');
        $('#entrenamientosTable').DataTable().ajax.reload(null, false);
    } catch (error) {
        validarRespuesta(
            error,
            'No fue posible registrar las asistencias.'
        );
    }
}
