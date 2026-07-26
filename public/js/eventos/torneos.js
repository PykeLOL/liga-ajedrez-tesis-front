let tipoActual = 'proximos';
let paginaActual = 1;
const porPagina = 10;
let mediaGaleria = [];
let mediaIndexActual = 0;
let modalMediaInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.eventos-container')) {
        iniciarBotones();
        cargarEventos();
    }

    if (typeof eventoId !== 'undefined') {
        cargarDetalleTorneo();
    }
});

function iniciarBotones() {
    const botones = document.querySelectorAll('.btn-group button');
    const contenedores = document.querySelectorAll('.eventos-container');

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            botones.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tipoActual = btn.dataset.tipo;
            paginaActual = 1;

            contenedores.forEach(c => {
                c.classList.toggle('d-none', c.dataset.tipo !== tipoActual);
            });

            cargarEventos();
        });
    });
}

function cargarEventos() {
    const url = `${apiUrl}/home/eventos/tipo/${tipoEventoId}?tipo=${tipoActual}&page=${paginaActual}&per_page=${porPagina}`;
    $.ajax({
        url: url,
        type: 'GET',
        data: { page: paginaActual },
        dataType: 'json',
        success: function (r) {
            renderEventos(r.data);
            renderPaginacion(r.meta);
        },
        error: function (xhr) {
            console.error('Error cargando eventos', xhr);
        }
    });
}

function renderEventos(eventos) {
    const contenedor = document.querySelector(`.eventos-container[data-tipo="${tipoActual}"]`);
    contenedor.innerHTML = '';

    if (!eventos || eventos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    No hay torneos para mostrar.
                </div>
            </div>
        `;
        return;
    }

    eventos.forEach(evento => {
        let badges = '';
        if (evento.categorias_ritmos && evento.categorias_ritmos.length) {
            evento.categorias_ritmos.forEach(cr => {
                badges += `
                    <span class="badge bg-secondary text-light small">
                        ${cr.categoria} · ${cr.ritmo}
                    </span>
                `;
            });
        }

        contenedor.innerHTML += `
            <div class="col-12 col-xl-6 fade-in">
                <div class="card card-tournament h-100 shadow-sm">
                    <div class="card-tournament-inner">

                        <div class="ticket-date">
                            <span class="text-chess-green fw-bold text-uppercase small">
                                ${formatearMes(evento.fecha_inicio)}
                            </span>
                            <span class="text-white fw-bold display-5 lh-1">
                                ${formatearDia(evento.fecha_inicio)}
                            </span>
                            <small class="text-muted">
                                ${formatearAnio(evento.fecha_inicio)}
                            </small>
                        </div>

                        <div class="tournament-img-wrapper">
                            <img src="${apiUrlBase}${evento.imagen_principal}" alt="${evento.nombre}">
                        </div>

                        <div class="tournament-body">

                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div class="d-flex flex-wrap gap-1 mb-2">
                                    ${badges}
                                </div>
                                <span class="${evento.estado_label_class}">
                                    ${evento.estado_label}
                                </span>
                            </div>

                            <h5 class="fw-bold text-white mb-1 text-limit-1">
                                ${evento.nombre}
                            </h5>

                            <div class="text-muted small mb-3 text-limit-1">
                                <i class="bi bi-geo-alt-fill me-1 text-chess-green"></i>
                                ${evento.lugar}
                                <span class="mx-1">•</span>
                                <i class="bi bi-clock me-1"></i>
                                ${evento.hora_inicio || 'Por definir'}
                            </div>

                            <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-10">
                                <small class="text-muted">
                                    <i class="bi bi-people-fill me-1"></i>
                                    ${evento.inscritos} / ${evento.max_participantes}
                                </small>

                                <button class="btn btn-sm btn-chess px-3"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalTorneo"
                                    onclick='cargarInfoTorneo(${JSON.stringify(evento)})'>
                                    Ver Detalles
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function renderPaginacion(meta) {
    const paginacion = document.getElementById('paginacion');
    paginacion.innerHTML = '';

    if (!meta || meta.last_page <= 1) return;

    for (let i = 1; i <= meta.last_page; i++) {
        paginacion.innerHTML += `
            <button class="btn btn-sm mx-1
                ${i === meta.current_page ? 'btn-chess' : 'btn-outline-secondary'}"
                onclick="cambiarPagina(${i})">
                ${i}
            </button>
        `;
    }
}

function cambiarPagina(pagina) {
    paginaActual = pagina;
    cargarEventos();
}

function scrollSuave() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function formatearMes(fecha) {
    return new Date(fecha).toLocaleDateString('es-CO', { month: 'short' });
}

function formatearDia(fecha) {
    return new Date(fecha).getDate();
}

function formatearAnio(fecha) {
    return new Date(fecha).getFullYear();
}

function cargarInfoTorneo(torneo) {
    document.getElementById('modalTitulo').textContent = torneo.nombre;
    document.getElementById('modalLugar').textContent = torneo.lugar;
    document.getElementById('modalFecha').textContent = formatearFechaRango(torneo.fecha_inicio, torneo.fecha_fin);
    document.getElementById('modalHora').textContent = torneo.hora_inicio || 'Por definir';
    document.getElementById('modalDescripcion').textContent = torneo.descripcion || '';
    document.getElementById('modalCupos').textContent = `${torneo.inscritos} / ${torneo.max_participantes}`;
    document.getElementById('modalImagen').src = apiUrlBase + torneo.imagen_principal;

    const badges = document.getElementById('modalBadges');
    badges.innerHTML = '';
    torneo.categorias_ritmos.forEach(cr => {
        badges.innerHTML += `<span class="badge bg-dark border border-secondary">${cr.categoria} · ${cr.ritmo}</span>`;
    });

    document.getElementById('inputTorneoId').value = torneo.id;
    document.getElementById('btnDetalle').href = `/eventos/${tipoEventoSlug}/${torneo.id}`;
}

function formatearFecha(fecha) {
    const d = new Date(fecha);
    const dia = d.getDate();
    const mes = d.getMonth() + 1;
    const anio = d.getFullYear();

    return `${dia}-${mes}-${anio}`;
}

function formatearFechaRango(i, f) {
    const inicio = formatearFecha(i);
    const fin = f ? formatearFecha(f) : null;

    return fin ? `Desde: ${inicio} hasta ${fin}` : `Desde: ${inicio}`;
}

function cargarDetalleTorneo() {
    $.ajax({
        url: `${apiUrl}/home/eventos/${eventoId}`,
        type: 'GET',
        dataType: 'json',
        success: function (e) {
            pintarDetalleTorneo(e);
            renderMediaTorneo(e.media);
        },
        error: function () {
            console.error('Error cargando detalle del torneo');
        }
    });
}

function renderMediaTorneo(media) {
    mediaGaleria = media;
    const galeria = $('#galeriaTorneo');
    galeria.empty();

    if (!media || !media.length) {
        galeria.append(`
            <div class="col-12 text-muted small">
                No hay contenido multimedia.
            </div>
        `);
        return;
    }

    media.forEach((m, index) => {
        let preview = '';
        let icon = '';

        if (m.tipo === 'imagen') {
            preview = `<img src="${apiUrlBase}${m.url}">`;
            icon = 'bi-image';
        }

        if (m.tipo === 'video') {
            preview = `<video muted><source src="${apiUrlBase}${m.url}"></video>`;
            icon = 'bi-camera-video';
        }

        if (m.tipo === 'url') {
            preview = `
                <div class="youtube-thumb">
                    <iframe
                        src="${youtubeEmbedUrl(m.url)}?controls=0&rel=0&modestbranding=1"
                        frameborder="0"
                        allow="encrypted-media">
                    </iframe>

                    <div class="youtube-overlay">
                        <i class="bi bi-play-circle-fill"></i>
                    </div>
                </div>
            `;
            icon = null;
        }

        galeria.append(`
            <div class="col-md-4">
                <div class="media-thumb" onclick="abrirMedia(${index})">
                    ${preview}
                    <span class="media-type">
                        <i class="bi ${icon}"></i>
                    </span>
                </div>
            </div>
        `);
    });
}

function abrirMedia(index) {
    mediaIndexActual = index;
    pintarMediaActual();

    const modalEl = document.getElementById('modalMedia');
    modalMediaInstance = new bootstrap.Modal(modalEl);
    modalMediaInstance.show();
}

const modalMediaEl = document.getElementById('modalMedia');

if (modalMediaEl) {
    modalMediaEl.addEventListener('hidden.bs.modal', () => {
        limpiarMediaActiva();
    });
}

function limpiarMediaActiva() {
    const viewer = document.getElementById('mediaViewer');

    const videos = viewer.querySelectorAll('video');
    videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
    });

    const iframes = viewer.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        iframe.src = iframe.src;
    });

    viewer.innerHTML = '';
    document.getElementById('mediaDescripcion').textContent = '';
}


function cambiarMedia(direccion) {
    limpiarMediaActiva();

    mediaIndexActual += direccion;

    if (mediaIndexActual < 0) {
        mediaIndexActual = mediaGaleria.length - 1;
    }

    if (mediaIndexActual >= mediaGaleria.length) {
        mediaIndexActual = 0;
    }

    pintarMediaActual();
}

function pintarMediaActual() {
    const m = mediaGaleria[mediaIndexActual];
    const viewer = $('#mediaViewer');
    const desc = $('#mediaDescripcion');

    viewer.empty();
    desc.text(m.descripcion || '');

    if (m.tipo === 'imagen') {
        viewer.html(`<img src="${apiUrlBase}${m.url}">`);
    }

    if (m.tipo === 'video') {
        viewer.html(`
            <video controls autoplay>
                <source src="${apiUrlBase}${m.url}">
            </video>
        `);
    }

    if (m.tipo === 'url') {
        viewer.html(`
            <div class="ratio ratio-16x9">
                <iframe src="${youtubeEmbedUrl(m.url)}"
                        allowfullscreen></iframe>
            </div>
        `);
    }
}

function pintarDetalleTorneo(e) {

    $('#tituloTorneo').text(e.nombre);
    $('#descripcionTorneo').text(e.descripcion);
    $('#estadoTorneo').text(e.estado_evento);

    $('#fechaTorneo').text(
        `${e.fecha_inicio_format} al ${e.fecha_fin_format}`
    );

    $('#horaTorneo').text(e.hora_inicio || 'Por definir');
    $('#lugarTorneo').text(e.lugar);
    $('#mapaTorneo').attr('href', e.url_mapa);

    $('#cuposTorneo').text(
        `${e.total_inscritos} / ${e.max_participantes} inscritos`
    );

    const tbody = $('#tablaCategorias');
    tbody.empty();
    e.categorias.forEach(c => {
        tbody.append(`
            <tr>
                <td>${c.categoria}</td>
                <td>${c.inscritos}</td>
                <td>${c.cupos_disponibles ?? '—'}</td>
                <td>${c.costo_inscripcion == 0 ? 'Gratis' : '$' + c.costo_inscripcion}</td>
            </tr>
        `);
    });

    const docs = $('#documentosTorneo');
    docs.empty();

    if (!e.documentos.length) {
        docs.html('<small class="text-muted">No hay documentos</small>');
    } else {
        e.documentos.forEach(d => {
            const icono = getIconoDocumento(d.tipo);
            docs.append(`
                <a href="${apiUrlBase}${d.url}"
                target="_blank"
                class="d-block mb-2 text-decoration-none text-white">
                    <i class="bi ${icono} me-2"></i>
                    ${d.nombre}
                </a>
            `);
        });
    }

    const orgs = $('#organizadoresTorneo');
    orgs.empty();

    e.organizadores.forEach(o => {
        orgs.append(`
            <span class="badge bg-secondary">
                ${o.club}
            </span>
        `);
    });
}

function youtubeEmbedUrl(url) {
    const id = url.split('v=')[1]?.split('&')[0]
        || url.split('youtu.be/')[1];

    return `https://www.youtube.com/embed/${id}`;
}

function youtubeId(url) {
    return url.split('v=')[1]?.split('&')[0]
        || url.split('youtu.be/')[1];
}

function getIconoDocumento(tipo) {
    const icons = {
        pdf:  'bi-file-earmark-pdf text-danger',
        doc:  'bi-file-earmark-word text-primary',
        docx: 'bi-file-earmark-word text-primary',
        xls:  'bi-file-earmark-excel text-success',
        xlsx: 'bi-file-earmark-excel text-success',
        ppt:  'bi-file-earmark-ppt text-warning',
        pptx: 'bi-file-earmark-ppt text-warning',
        txt:  'bi-file-earmark-text text-muted',
        zip:  'bi-file-earmark-zip text-secondary',
        rar:  'bi-file-earmark-zip text-secondary',
        default: 'bi-file-earmark text-muted'
    };

    return icons[tipo?.toLowerCase()] || icons.default;
}
