let eventos = [];
let ranking = [];
let clubes = [];

document.addEventListener('DOMContentLoaded', () => cargarHome());

function cargarHome() {
    Promise.all([
        apiRequest({
            url: `${apiUrl}/home/eventos/home`,
            type: 'GET'
        }),
        apiRequest({
            url: `${apiUrl}/home/deportistas/ranking-elo/home`,
            type: 'GET'
        }),
        apiRequest({
            url: `${apiUrl}/home/clubes/home`,
            type: 'GET'
        })
    ])
    .then(([eventosResp, rankingResp, clubesResp]) => {
        eventos = eventosResp ?? [];
        ranking = rankingResp ?? [];
        clubes = clubesResp.data ?? clubesResp ?? [];

        renderEventos();
        renderRanking();
        renderClubes();
    })
    .catch(xhr => validarRespuesta(xhr,'No fue posible cargar la información de inicio.'));
}

function formatearFecha(fecha){
    return new Date(fecha).toLocaleDateString('es-CO',{
        day:'2-digit',
        month:'short',
        year:'numeric'
    }).replace('.','').toUpperCase();
}

function imagenEvento(evento){
    if(evento.media?.length)
        return `${apiUrlBase}/storage/${evento.media[0].path}`;

    return 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80';
}

function badgeEvento(tipo){
    const nombre=(tipo?.nombre??'Evento').toUpperCase();

    const colores={
        TORNEO:'danger',
        REUNIÓN:'success',
        REUNION:'success',
        CAPACITACIÓN:'info',
        CAPACITACION:'info',
        FESTIVAL:'warning',
        SIMULTÁNEA:'primary',
        SIMULTANEA:'primary'
    };

    return {
        texto:nombre,
        color:colores[nombre]??'secondary'
    };
}

function renderEventos() {
    if (!eventos.length) {
        $('#eventoPrincipal').html(`
            <div class="card h-100 border-0 shadow-sm text-white" style="background:#262421">
                <div class="card-body d-flex justify-content-center align-items-center py-5 text-muted">
                    No hay eventos publicados.
                </div>
            </div>
        `);

        $('#eventosSecundarios').html('');

        return;
    }

    eventos.sort((a,b)=>new Date(b.fecha_inicio)-new Date(a.fecha_inicio));

    const principal=eventos[0];
    const secundarios=eventos.slice(1,4);

    const badge=badgeEvento(principal.tipo_evento);

    $('#eventoPrincipal').html(`
        <div class="card h-100 border-0 shadow-sm card-hover text-white overflow-hidden position-relative"
             style="background:#262421;border:1px solid rgba(255,255,255,.1);cursor:pointer"
             onclick='irEvento(${JSON.stringify(principal)})'>

            <div class="img-wrapper overflow-hidden position-relative">

                <img
                    src="${imagenEvento(principal)}"
                    class="card-img-top w-100"
                    style="height:280px;object-fit:cover">

                <span class="badge bg-${badge.color} position-absolute top-0 start-0 m-3 shadow">
                    ${badge.texto}
                </span>

            </div>

            <div class="card-body p-4">

                <div class="text-chess-green mb-2 text-uppercase fw-bold" style="font-size:.8rem;">
                    <i class="bi bi-calendar-event me-1"></i>
                    ${formatearFecha(principal.fecha_inicio)}
                </div>

                <h3 class="card-title fw-bold mb-2">
                    ${principal.nombre}
                </h3>

                <p class="card-text text-muted mb-3" style="font-size:.95rem;">
                    ${principal.descripcion}
                </p>

                <span class="text-chess-green fw-bold" style="font-size:.9rem;">
                    Leer completa
                    <i class="bi bi-arrow-right ms-1"></i>
                </span>

            </div>

        </div>
    `);

    let html='';

    secundarios.forEach(evento=>{

        const badge=badgeEvento(evento.tipo_evento);

        html+=`
            <div class="card border-0 shadow-sm card-hover text-white overflow-hidden position-relative"
                 style="background:#262421;border:1px solid rgba(255,255,255,.1);cursor:pointer"
                 onclick='irEvento(${JSON.stringify(evento)})'>

                <div class="row g-0 align-items-center">

                    <div class="col-4">

                        <img
                            src="${imagenEvento(evento)}"
                            class="img-fluid h-100 w-100"
                            style="object-fit:cover;min-height:110px;">

                    </div>

                    <div class="col-8">

                        <div class="card-body py-2 px-3">

                            <span class="badge bg-${badge.color} mb-1" style="font-size:.65rem;">
                                ${badge.texto}
                            </span>

                            <h6 class="card-title fw-bold mb-1 text-truncate">
                                ${evento.nombre}
                            </h6>

                            <small class="text-muted d-block mb-2">
                                ${formatearFecha(evento.fecha_inicio)}
                            </small>

                            <span class="text-chess-green fw-bold" style="font-size:.8rem;">
                                Leer más
                                <i class="bi bi-arrow-right"></i>
                            </span>

                        </div>

                    </div>

                </div>

            </div>
        `;
    });

    $('#eventosSecundarios').html(html);
}

function renderRanking() {
    if (!ranking.length) {
        $('#topRanking').html(`
            <div class="text-center text-muted py-5">
                No hay jugadores disponibles.
            </div>
        `);

        return;
    }

    const top = [...ranking]
        .sort((a, b) => b.elo_standard - a.elo_standard)
        .slice(0, 5);

    let html = '';

    top.forEach((jugador, index) => {

        const foto = jugador.foto_perfil
            ? apiUrlBase + jugador.foto_perfil
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(jugador.nombre)}&background=262421&color=ffffff&size=150`;

        const colores = [
            'text-warning',
            'text-secondary',
            'text-danger',
            'text-muted',
            'text-muted'
        ];

        const badge = [
            'bg-success',
            'bg-secondary',
            'bg-secondary',
            'bg-dark border border-secondary text-muted',
            'bg-dark border border-secondary text-muted'
        ];

        html += `
            <a
                href="javascript:void(0)"
                onclick="irPerfil(${jugador.id})"
                class="list-group-item list-group-item-action bg-transparent text-white text-decoration-none d-flex align-items-center py-3 ${index === 4 ? 'border-0' : 'border-secondary'}"
                style="border-color:rgba(255,255,255,.1)!important;">

                <span class="fw-bold ${index < 3 ? 'fs-4' : 'fs-5'} ${colores[index]} me-3 text-center" style="width:25px;">
                    ${index + 1}
                </span>

                <img
                    src="${foto}"
                    class="rounded-circle me-3"
                    width="40"
                    height="40"
                    style="object-fit:cover"
                    onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(jugador.nombre)}&background=262421&color=ffffff&size=150'">

                <div class="flex-grow-1 overflow-hidden">

                    <h6 class="mb-0 fw-bold text-truncate">
                        ${jugador.titulo && jugador.titulo !== 'ST'
                            ? `<span class="player-title">${jugador.titulo}</span>`
                            : ''}
                        ${jugador.nombre}
                    </h6>

                    <small
                        class="text-muted d-block text-truncate"
                        style="color:#bababa!important;">
                        ${jugador.club}
                    </small>

                </div>

                <span class="badge ${badge[index]} fs-6 ms-2">
                    ${jugador.elo_standard}
                </span>

            </a>
        `;
    });

    $('#topRanking').html(html);
}

function renderClubes() {
    if (!clubes.length) {
        $('#clubesHome').html(`
            <div class="col-12 text-center text-muted py-5">
                No hay clubes registrados.
            </div>
        `);
        return;
    }

    let html = '';

    clubes.slice(0, 4).forEach(club => {

        const logo = club.logo
            ? apiUrlBase + club.logo
            : null;

        html += `
            <div class="col-md-6">

                <a
                    href="javascript:void(0)"
                    onclick="irClub(${club.id})"
                    class="text-decoration-none text-white">

                    <div
                        class="p-3 border border-secondary rounded d-flex align-items-center bg-dark-subtle club-card h-100"
                        style="border-color:rgba(255,255,255,.1)!important;background:#1e1e1e!important;">

                        <div
                            class="bg-white rounded-circle p-2 me-3 d-flex justify-content-center align-items-center shadow-sm"
                            style="width:50px;height:50px;overflow:hidden;">

                            ${
                                logo
                                    ? `<img src="${logo}" style="width:100%;height:100%;object-fit:cover;">`
                                    : `<i class="bi bi-shield-fill text-dark fs-4"></i>`
                            }

                        </div>

                        <div class="overflow-hidden">

                            <h6 class="mb-0 fw-bold text-truncate">
                                ${club.nombre}
                            </h6>

                            <small class="text-chess-green text-truncate d-block">
                                ${club.municipio ?? club.ciudad ?? club.descripcion ?? ''}
                            </small>

                        </div>

                    </div>

                </a>

            </div>
        `;
    });

    $('#clubesHome').html(html);
}

window.irEvento = function(evento) {
    const tipo = evento.tipo_evento?.slug ?? 'evento';

    window.location.href = rutaEvento
        .replace('__TIPO__', tipo);
};

window.irPerfil = function(id) {
    window.location.href = `${rutaMiElo}?id=${id}`;
};

window.irClub = function(id) {
    window.location.href = rutaClub.replace('__ID__', id);
};
