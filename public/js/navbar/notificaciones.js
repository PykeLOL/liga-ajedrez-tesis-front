const notificacionesApiUrl = `${apiUrl}/home/notificaciones`;

$(document).ready(function () {
    cargarCantidadNotificaciones();

    $('#notificacionesDropdown').on('show.bs.dropdown', function () {
        cargarNotificaciones();
    });

    $('#contenidoNotificaciones').on('click', '.notificacion-item', function () {
        abrirNotificacion($(this).data('id'), $(this).data('url'));
    });
});

async function cargarCantidadNotificaciones() {
    try {
        const resp = await apiRequest({
            url: `${notificacionesApiUrl}/no-leidas`,
            type: 'GET'
        });

        if (resp.cantidad > 0) {
            $('#contadorNotificaciones')
                .text(resp.cantidad)
                .removeClass('d-none');
        } else {
            $('#contadorNotificaciones')
                .addClass('d-none');
        }
    } catch (err) {
        console.error(err);
    }
}

async function cargarNotificaciones() {
    try {
        const notificaciones = await apiRequest({
            url: notificacionesApiUrl,
            type: 'GET'
        });

        pintarNotificaciones(notificaciones.data ?? notificaciones);
    } catch (err) {
        validarRespuesta(err, 'No se pudieron cargar las notificaciones');
    }
}

function pintarNotificaciones(notificaciones) {
    if (!notificaciones.length) {
        $('#contenidoNotificaciones').html(`
            <div class="text-center text-secondary py-4">
                No tienes notificaciones.
            </div>
        `);
        return;
    }

    let html = '';

    notificaciones.forEach(n => {
        html += `
            <div class="notificacion-item d-flex gap-3 p-3 border-bottom border-secondary ${!n.leida ? 'bg-dark' : ''}"
                 data-id="${n.id}"
                 data-url="${n.url ?? ''}"
                 style="cursor:pointer;">
                <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style="width:40px;height:40px;background:rgba(25,135,84,.15);">
                    <i data-lucide="${n.tipo.icono}"
                    style="width:20px;height:20px;color:#198754;"></i>
                </div>
                <div class="flex-grow-1">
                    <div class="fw-semibold text-white">
                        ${n.titulo}
                    </div>
                    <div class="small text-secondary">
                        ${n.descripcion}
                    </div>
                    <div class="small text-warning mt-1">
                        ${n.modulo?.nombre ?? ''}
                    </div>
                </div>
                ${!n.leida ? '<span class="badge rounded-pill bg-primary align-self-start">&nbsp;</span>' : ''}
            </div>
        `;
    });

    $('#contenidoNotificaciones').html(html);

    lucide.createIcons();
}

async function abrirNotificacion(id, url) {
    try {
        await apiRequest({
            url: `${notificacionesApiUrl}/${id}/leer`,
            type: 'PATCH'
        });

        cargarCantidadNotificaciones();

        if (!url) {
            cargarNotificaciones();
            return;
        }

        if (url.startsWith('http://') || url.startsWith('https://')) {
            window.location.href = url;
        } else {
            window.location.href = `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
        }
    } catch (err) {
        validarRespuesta(err, 'No se pudo abrir la notificación');
    }
}
