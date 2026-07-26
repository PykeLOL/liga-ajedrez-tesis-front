let diasSemana = [];
let horarioIndex = 0;

$(document).ready(function () {
    $('#btnAgregarHorario').on('click', agregarHorario);

    $('#contenedorHorarios').on('click', '.btnEliminarHorario', function () {
        $(this).closest('.horario-item').remove();
        actualizarTitulos();
    });

});

async function agregarHorario(horario = null) {
    if (!diasSemana.length) {
        diasSemana = await apiRequest({
            url: `${apiUrl}/select/dias-semana`,
            type: 'GET'
        });
    }

    horarioIndex++;

    $('#contenedorHorarios').append(`
        <div class="horario-item card border mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="m-0 tituloHorario">Horario ${horarioIndex}</h6>
                    <button type="button" class="btn btn-outline-danger btnEliminarHorario">
                        <i data-lucide="trash-2" style="width:16px"></i>
                    </button>
                </div>

                <div class="row">

                    <div class="col-md-4 mb-3">
                        <label class="form-label">Día *</label>
                        <select class="form-control horario-dia"></select>
                    </div>

                    <div class="col-md-4 mb-3">
                        <label class="form-label">Hora inicio *</label>
                        <input type="time" class="form-control horario-inicio">
                    </div>

                    <div class="col-md-4 mb-3">
                        <label class="form-label">Hora fin *</label>
                        <input type="time" class="form-control horario-fin">
                    </div>

                </div>
            </div>
        </div>
    `);

    const $item = $('#contenedorHorarios .horario-item').last();

    const $dia = $item.find('.horario-dia');

    $dia.append('<option value="">Seleccione un día</option>');

    diasSemana.forEach(dia => {
        $dia.append(new Option(dia.nombre, dia.id));
    });

    $dia.select2({
        placeholder: 'Seleccione un día',
        allowClear: true,
        width: '100%',
        dropdownParent: $('#planEntrenamientoModal')
    });

    if (horario) {
        $dia.val(horario.dia_semana_id).trigger('change');
        $item.find('.horario-inicio').val(horario.hora_inicio);
        $item.find('.horario-fin').val(horario.hora_fin);
    }

    lucide.createIcons();
}

function obtenerHorarios() {
    const horarios = [];

    $('#contenedorHorarios .horario-item').each(function () {

        const dia = $(this).find('.horario-dia').val();
        const inicio = $(this).find('.horario-inicio').val();
        const fin = $(this).find('.horario-fin').val();

        if (!dia || !inicio || !fin) {
            return;
        }

        horarios.push({
            dia_semana_id: parseInt(dia),
            hora_inicio: inicio,
            hora_fin: fin
        });

    });

    return horarios;
}

async function cargarHorarios(horarios) {
    limpiarHorarios();

    for (const horario of horarios) {
        await agregarHorario(horario);
    }
}

function limpiarHorarios() {
    horarioIndex = 0;
    $('#contenedorHorarios').empty();
}

function actualizarTitulos() {
    horarioIndex = 0;

    $('#contenedorHorarios .horario-item').each(function () {
        horarioIndex++;
        $(this).find('.tituloHorario').text(`Horario ${horarioIndex}`);
    });
}

function formatearHora(hora) {
    return new Date(`1970-01-01T${hora}`)
        .toLocaleTimeString('es-CO', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
        .replace(/\s*a\.\s*m\./i, ' a.m.')
        .replace(/\s*p\.\s*m\./i, ' p.m.');
}
