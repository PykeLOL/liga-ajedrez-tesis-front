let mediaGaleria = [];
let mediaIndexActual = 0;
let modalMediaInstance = null;

document.addEventListener('DOMContentLoaded', function () {
    if (typeof window.clubId !== 'undefined') {
        cargarDetalleClub(window.clubId);
    }
});

function cargarDetalleClub(id) {
    $.ajax({
        url: `${apiUrl}/home/clubes/${id}`,
        type: 'GET',
        dataType: 'json',
        success: function (e) {
            renderDetalleClub(e);
            renderMediaClub(e.media);
        },
        error: () => Swal.fire('Error', 'No se pudo cargar el club', 'error')
    });
}

function renderDetalleClub(club) {
    $('#clubNombre').text(club.nombre);
    $('#clubUbicacion').text(club.ubicacion);
    $('#clubContacto').text(club.contacto ?? '—');
    $('#clubLiga').text(club.liga?.nombre ?? '—');

    if (club.logo) {
        $('#clubLogo').attr('src', `${apiUrlBase}${club.logo}`);
    }

    if (club.presidente) {
        $('#clubPresidente').text(
            `${club.presidente.nombre} ${club.presidente.apellido}`
        );

        if (club.presidente.foto_perfil) {
            $('#presidenteFoto').attr(
                'src',
                `${apiUrlBase}${club.presidente.foto_perfil}`
            );
        }
    } else {
        $('#clubPresidente').text('No registrado');
    }

    if (club.direccion) {
        $('#clubDireccion').html(`
            <a href="${club.url_mapa ?? '#'}"
               target="_blank"
               class="text-decoration-none text-white">
                ${club.direccion}
            </a>
        `);

        const query = encodeURIComponent(
            `${club.direccion}, ${club.ubicacion}`
        );

        $('#clubMapa').attr(
            'src',
            `https://www.google.com/maps?q=${query}&output=embed`
        );
    }

    const cont = $('#clubDeportistas');
    cont.empty();

    if (!club.deportistas?.length) {
        cont.append('<div class="text-muted">No hay deportistas afiliados</div>');
        return;
    }

    club.deportistas.forEach(d => {
        const foto = d.foto_perfil
            ? `${apiUrlBase}${d.foto_perfil}`
            : 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

        const botonDetalle = `
            <button class="btn btn-sm btn-outline-success mt-2"
                onclick="verDetallesDeportista(${d.id})">
                Ver Detalles
            </button>
        `;

        cont.append(`
            <div class="col">
                <div class="card h-100">
                    <img src="${foto}">
                    <h6 class="text-white">
                        ${d.nombre} ${d.apellido}
                    </h6>

                    <div class="elo">
                        ELO Nacional: ${d.elo_nacional}<br>
                        ELO Internacional: ${d.elo_internacional}
                    </div>

                    <div class="fide">${botonDetalle}</div>
                </div>
            </div>
        `);
    });
}

function renderMediaClub(media) {
    const visibles = media.slice(0, 5);
    mediaGaleria = media;
    const galeria = $('#galeriaClub');
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

function youtubeEmbedUrl(url) {
    const id = url.split('v=')[1]?.split('&')[0]
        || url.split('youtu.be/')[1];

    return `https://www.youtube.com/embed/${id}`;
}

function youtubeId(url) {
    return url.split('v=')[1]?.split('&')[0]
        || url.split('youtu.be/')[1];
}

let radarChart = null;

function verDetallesDeportista(id) {
    Swal.showLoading();
    $.ajax({
        url: `${apiUrl}/home/deportistas/${id}`,
        type: 'GET',
        success: function (deportista) {
            cargarInfoBase(deportista);
            if (deportista.fide_id) {
                cargarInfoFide(deportista.fide_id);
            } else {
                renderRadar(0,0,0);
                Swal.close();
            }
            const modal = new bootstrap.Modal(document.getElementById('modalDeportista'));
            modal.show();
        },
        error: function () {
            Swal.fire('Error', 'No se pudo cargar el deportista', 'error');
        }
    });
}

function cargarInfoBase(d) {
    $('#cardFoto').attr('src', `${apiUrlBase}${d.foto_perfil}`);
    $('#cardNombre').text(`${d.nombre} ${d.apellido}`);
    $('#cardTitulo').text(d.titulo);
    $('#cardCategoria').text(d.categoria);

    $('#statNacional').text(d.elo_nacional ?? 0);
    $('#statInter').text(d.elo_internacional ?? 0);

    $('#cardNacionalidad').text(d.nacionalidad);
    $('#cardLiga').text(d.liga?.nombre ?? '—');

    const edad = calcularEdad(d.fecha_nacimiento);
    $('#cardEdad').text(edad);
}

function cargarInfoFide(fideId) {
    $.ajax({
        url: `${apiUrl}/home/chesstools/${fideId}`,
        type: 'GET',
        success: function (res) {
            const eloActual = res.elo_actual ?? {};
            renderRadar(
                eloActual.standard ?? 0,
                eloActual.rapid ?? 0,
                eloActual.blitz ?? 0
            );
            Swal.close();
        }
    });
}

function renderRadar(classical, rapid, blitz) {
    const ctx = document.getElementById('eloRadar');
    if (radarChart) radarChart.destroy();
    const dataValues = [classical, rapid, blitz];
    const eloLabelsPlugin = {
        id: 'eloLabels',
        afterDatasetsDraw(chart) {
            const { ctx } = chart;
            ctx.save();
            const meta = chart.getDatasetMeta(0);
            meta.data.forEach((point, index) => {
                const value = dataValues[index];
                const position = point.tooltipPosition();
                ctx.fillStyle = '#00ff88';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(value, position.x, position.y - 15);
            });
            ctx.restore();
        }
    };

    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Classical', 'Rapid', 'Blitz'],
            datasets: [{
                data: dataValues,
                backgroundColor: 'rgba(0,255,136,0.35)',
                borderColor: '#00ff88',
                borderWidth: 2,
                pointBackgroundColor: '#00ff88',
                pointRadius: 6,
                pointHoverRadius: 9
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + ' ELO';
                        }
                    }
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 3000,
                    ticks: { display: false },
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    angleLines: { color: 'rgba(255,255,255,0.2)' },
                    pointLabels: {
                        color: '#fff',
                        font: { size: 14 }
                    }
                }
            }
        },
        plugins: [eloLabelsPlugin]
    });
}

function calcularEdad(fecha) {
    const birth = new Date(fecha);
    const diff = Date.now() - birth.getTime();
    const age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
}

