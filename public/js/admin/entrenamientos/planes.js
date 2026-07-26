function mostrarModoPlan() {
    $('#contenedorManual').addClass('d-none');
    $('#contenedorPlan').removeClass('d-none');

    camposRequeridosManual.forEach(campo => {
        $(campo).removeClass('required');
    });
}

async function limpiarResumenPlan() {
    deportistasEntrenamiento= [];

    $('#planResumen').addClass('d-none');

    $('#planNombre').text('');
    $('#planTipo').text('');
    $('#planClub').text('');
    $('#planCategoria').text('');
    $('#planGenero').text('');
    $('#planEntrenador').text('');
    $('#planEvento').text('');
    $('#planFechaInicio').text('');
    $('#planFechaFin').text('');
    $('#planUbicacion').text('');

    $('#cantidadHorarios').text(0);
    $('#listaHorarios').empty();

    $('#contenedorMapa').addClass('d-none');
    $('#btnVerEvento').addClass('d-none').attr('href', '#');
}

async function cargarResumenPlan(planId) {
    try {
        const plan = await apiRequest({
            url: `${apiUrl}/planes-entrenamiento/${planId}/resumen`,
            type: 'GET'
        });

        if (!editandoEntrenamiento) {
            deportistasEntrenamiento = [...(plan.deportistas ?? [])];
            renderListaDeportistasEntrenamiento();
        }

        $('#planResumen').removeClass('d-none');

        $('#planNombre').text(plan.nombre ?? '-');
        $('#planTipo').text(plan.tipo?.nombre ?? '-');
        $('#planClub').text(plan.club?.nombre ?? '-');
        $('#planCategoria').text(plan.categoria?.nombre ?? '-');
        $('#planGenero').text(plan.genero?.nombre ?? '-');
        $('#planEntrenador').text(plan.entrenador?.nombre ?? '-');

        $('#planEvento').text(plan.evento?.nombre ?? '-');

        if (plan.evento?.id && plan.evento?.tipo_evento) {
            $('#btnVerEvento')
                .attr('href', `/eventos/${plan.evento.tipo_evento}/${plan.evento.id}`)
                .removeClass('d-none');

            lucide.createIcons();
        } else {
            $('#btnVerEvento').attr('href', '#').addClass('d-none');
        }

        $('#planFechaInicio').text(plan.fecha_inicio ?? '-');
        $('#planFechaFin').text(plan.fecha_fin ?? '-');
        $('#planUbicacion').text(plan.ubicacion ?? '-');

        if (plan.url_mapa) {
            $('#planMapa').attr('href', plan.url_mapa);
            $('#contenedorMapa').removeClass('d-none');
        } else {
            $('#contenedorMapa').addClass('d-none');
        }

        renderHorarios(plan.horarios ?? []);
    } catch (xhr) {
        console.error('No fue posible cargar el plan:', xhr);
    }
}

function renderHorarios(horarios) {
    $('#cantidadHorarios').text(horarios.length);
    const contenedor = $('#listaHorarios');
    contenedor.empty();
    if (!horarios.length) {
        contenedor.html(`
            <div class="text-muted text-center py-3">
                No hay horarios registrados.
            </div>
        `);
        return;
    }

    horarios.forEach(horario => {
        contenedor.append(`
            <div class="d-flex justify-content-between align-items-center border rounded px-3 py-2 mb-2">
                <div>
                    <strong>${horario.dia_semana}</strong>
                </div>
                <div>
                    ${horario.hora_inicio} - ${horario.hora_fin}
                </div>
            </div>
        `);
    });
}

async function seleccionarPlan(planId) {
    $('#plan_entrenamiento_id').val(planId);

    if (planId) {
        await cargarResumenPlan(planId);
    } else {
        limpiarResumenPlan();
    }
}
