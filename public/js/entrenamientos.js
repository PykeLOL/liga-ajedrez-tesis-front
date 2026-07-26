$(document).ready(function () {
    initEntrenamientosTable();

    function initEntrenamientosTable() {
        if ($.fn.DataTable.isDataTable('#entrenamientosTable')) {
            $('#entrenamientosTable').DataTable().destroy();
        }

        $('#entrenamientosTable').DataTable({
            ajax: function (data, callback) {
                datatableAjaxNoLogin(`${apiUrl}/home/entrenamientos/mis-entrenamientos`)
                    .then(response => callback({ data: response }))
                    .catch(() => callback({ data: [] }));
            },
            columns: [
                { data: 'tipo_entrenamiento', title: 'Tipo' },
                { data: 'club', title: 'Club' },
                { data: 'entrenador', title: 'Entrenador' },
                { data: 'fecha', title: 'Fecha' },
                {
                    data: null,
                    title: 'Horario',
                    render: row => `${row.hora_inicio} - ${row.hora_fin}`
                },
                {
                    data: null,
                    render: function(data) {
                        if (!data.url_mapa) {
                            return data.ubicacion;
                        }

                        return `
                            <a href="${data.url_mapa}" target="_blank" class="text-decoration-none text-white">
                                <i data-lucide="map-pin" class="text-success me-1" style="width:16px;height:16px;"></i>
                                ${data.ubicacion}
                            </a>
                        `;
                    },
                    title: 'Ubicación'
                },
                {
                    data: 'id',
                    title: 'Acciones',
                    render: id => `
                        <button class="btn btn-sm btn-success sync-google" data-id="${id}">
                            Enviar a Google
                        </button>
                    `
                }
            ],
            language: { url: dataTablesLangUrl }
        });
    }

    $('#entrenamientosTable').on('click', '.sync-google', function () {
        const trainingId = $(this).data('id');

        $.ajax({
            url: `${apiUrl}/home/entrenamientos/${trainingId}/google`,
            type: 'POST',
            xhrFields: { withCredentials: true },
            success: resp => {
                Swal.fire('Sincronizado', resp.message, 'success');
            },
            error: err => {
                Swal.fire(
                    'Error',
                    err.responseJSON?.error || 'No se pudo sincronizar',
                    'error'
                );
            }
        });
    });

    const params = new URLSearchParams(window.location.search);

    if (params.get('google') === 'ok') {
        refreshUserData().then(loadGoogleCalendar);
        Swal.fire('Éxito', 'Google Calendar conectado', 'success');
    }

    if (params.get('google') === 'error') {
        Swal.fire('Error', 'No se pudo conectar Google Calendar', 'error');
    }

    loadGoogleCalendar();

    function loadGoogleCalendar() {
        const userData = localStorage.getItem('user_data');
        if (!userData) return;

        const user = JSON.parse(userData);

        if (!user.google_id) {
            $('#googleCalendarContainer').addClass('d-none');
            return;
        }

        const email = encodeURIComponent(user.google_id);
        const calendarUrl =
            `https://calendar.google.com/calendar/embed?src=${email}&ctz=America/Bogota`;

        $('#googleCalendarFrame').attr('src', calendarUrl);
        $('#googleCalendarContainer').removeClass('d-none');
    }

    function refreshUserData() {
        return $.ajax({
            url: `${apiUrl}/me`,
            method: 'GET',
            xhrFields: { withCredentials: true },
            success: resp => {
                if (resp?.user) {
                    localStorage.setItem('user_data', JSON.stringify(resp.user));
                }
            }
        });
    }
});
