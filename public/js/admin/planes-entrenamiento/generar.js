let planGeneracionId = null;

async function previewGeneracion(id) {
    $('#loadingOverlay').removeClass('d-none');

    try {
        const response = await apiRequest({
            url: `${planesEntrenamientoApiUrl}/${id}/preview-generacion`,
            type: 'GET'
        });

        planGeneracionId = id;

        renderPreviewGeneracion(response);

        $('#modalGenerarEntrenamientos').modal('show');

    } catch (err) {
        validarRespuesta(err,'No fue posible obtener la información de la generación.');
    } finally {
        $('#loadingOverlay').addClass('d-none');
    }
}

function renderPreviewGeneracion(data) {

    $('#previewTotalEntrenamientos').text(data.total_entrenamientos);
    $('#previewTotalDeportistas').text(data.total_deportistas);

    if (data.ya_generados) {

        $('#previewAdvertencia')
            .removeClass('d-none')
            .html(`
                <i data-lucide="triangle-alert" class="me-2"></i>
                Este plan ya tiene <strong>${data.total_existentes}</strong> entrenamientos generados automáticamente. Si continúa, serán eliminados y creados nuevamente.
            `);

        $('#btnConfirmarGeneracion')
            .html(`
                <i data-lucide="refresh-cw" style="width:16px"></i>
                Regenerar entrenamientos
            `);

    } else {

        $('#previewAdvertencia')
            .addClass('d-none')
            .empty();

        $('#btnConfirmarGeneracion')
            .html(`
                <i data-lucide="calendar-cog" style="width:16px"></i>
                Generar entrenamientos
            `);
    }

    const tbodyEntrenamientos = $('#previewEntrenamientos');
    tbodyEntrenamientos.empty();

    if (!data.entrenamientos.length) {

        tbodyEntrenamientos.html(`
            <tr>
                <td colspan="3" class="text-center text-muted py-4">
                    No se generarán entrenamientos.
                </td>
            </tr>
        `);

    } else {

        data.entrenamientos.forEach(item => {
            tbodyEntrenamientos.append(`
                <tr>
                    <td>${item.fecha}</td>
                    <td>${item.dia}</td>
                    <td>${formatearHora(item.hora_inicio)} - ${formatearHora(item.hora_fin)}</td>
                </tr>
            `);
        });
    }

    const tbodyDeportistas = $('#previewDeportistas');
    tbodyDeportistas.empty();

    if (!data.deportistas.length) {

        tbodyDeportistas.html(`
            <tr>
                <td colspan="2" class="text-center text-muted py-4">
                    No hay deportistas asociados.
                </td>
            </tr>
        `);

    } else {

        data.deportistas.forEach(item => {
            tbodyDeportistas.append(`
                <tr>
                    <td>${item.nombre}</td>
                    <td>${item.numero_identificacion}</td>
                </tr>
            `);
        });
    }

    lucide.createIcons();
}

async function generarEntrenamientos() {
    if (!planGeneracionId) {
        return;
    }

    $('#loadingOverlay').removeClass('d-none');
    try {
        const response = await apiRequest({
            url: `${planesEntrenamientoApiUrl}/${planGeneracionId}/generar-entrenamientos`,
            type: 'POST'
        });

        $('#modalGenerarEntrenamientos').modal('hide');
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            html: `Se generaron correctamente <strong>${response.total_generados}</strong> entrenamientos.`
        });

        $('#planesEntrenamientoTable')
            .DataTable()
            .ajax
            .reload(null,false);
    } catch (err) {
        Swal.fire({
            icon: 'warning',
            title: 'No es posible generar los entrenamientos',
            html: err.responseJSON.message
        });
    } finally {
        $('#loadingOverlay').addClass('d-none');
    }
}

$('#modalGenerarEntrenamientos').on('hidden.bs.modal',function(){
    planGeneracionId = null;
    $('#previewAdvertencia').empty().addClass('d-none');
    $('#previewEntrenamientos').empty();
    $('#previewDeportistas').empty();
    $('#previewTotalEntrenamientos').text('0');
    $('#previewTotalDeportistas').text('0');

    $('#btnConfirmarGeneracion').html(`
        <i data-lucide="calendar-cog" style="width:16px"></i>
        Generar entrenamientos
    `);
});
