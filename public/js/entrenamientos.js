$(document).ready(function() {
    const table = $('#trainingsTable').DataTable({
        ajax: {
            url: `${apiUrl}/trainings`, // ruta API que devuelve tus entrenamientos
            type: 'GET',
            xhrFields: { withCredentials: true },
            dataSrc: 'data'
        },
        columns: [
            { data: 'name' },
            { data: 'description' },
            { data: 'start_time', render: data => new Date(data).toLocaleString() },
            { data: 'end_time', render: data => new Date(data).toLocaleString() },
            {
                data: 'id',
                render: function(id, type, row) {
                    return `<button class="btn btn-sm btn-success sync-google" data-id="${id}">Enviar a Google Calendar</button>`;
                }
            }
        ],
        language: {
            url: dataTablesLangUrl
        }
    });

    // Manejar click en botón de sincronización
    $('#trainingsTable').on('click', '.sync-google', function() {
        const trainingId = $(this).data('id');
        $.ajax({
            url: `${apiUrl}/trainings/${trainingId}/google`,
            type: 'POST',
            xhrFields: { withCredentials: true },
            success: function(resp) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sincronizado',
                    text: resp.message
                });
            },
            error: function(err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.responseJSON?.error || 'No se pudo sincronizar'
                });
            }
        });
    });
});
