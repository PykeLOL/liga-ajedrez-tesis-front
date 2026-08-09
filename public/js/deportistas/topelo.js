let jugadores = [];
let jugadoresFiltrados = [];
let modalidad = 'standard';
const porPagina = 10;
let paginaActual = 1;

document.addEventListener('DOMContentLoaded', () => {
    cargarRanking();

    $('#buscadorJugador').on('input', filtrarJugadores);

    $('#std').on('change', () => cambiarModalidad('standard'));
    $('#rpd').on('change', () => cambiarModalidad('rapid'));
    $('#blz').on('change', () => cambiarModalidad('blitz'));
});

function cargarRanking() {
    apiRequest({
        url: `${apiUrl}/home/deportistas/ranking-elo`,
        type: 'GET'
    })
    .then(response => {
        jugadores = response;
        ordenarJugadores();
        filtrarJugadores();
    })
    .catch(xhr => validarRespuesta(xhr, 'No fue posible cargar el ranking.'));
}

function cambiarModalidad(tipo) {
    modalidad = tipo;
    ordenarJugadores();
    filtrarJugadores();
}

function ordenarJugadores() {
    const campo = `elo_${modalidad}`;

    jugadores.sort((a, b) => {
        if (b[campo] !== a[campo])
            return b[campo] - a[campo];

        return a.posicion - b.posicion;
    });

    jugadores.forEach((j, i) => j.posicion = i + 1);
}

function filtrarJugadores() {
    const texto = $('#buscadorJugador').val().toLowerCase().trim();

    jugadoresFiltrados = jugadores.filter(j =>
        j.nombre.toLowerCase().includes(texto) ||
        j.club.toLowerCase().includes(texto)
    );

    paginaActual = 1;

    renderTabla();
    renderPaginacion();
}

function renderTabla() {
    const inicio = (paginaActual - 1) * porPagina;
    const fin = inicio + porPagina;

    const lista = jugadoresFiltrados.slice(inicio, fin);

    if (!lista.length) {
        $('#tablaJugadores').html(`
            <tr>
                <td colspan="6" class="text-center text-muted py-5">
                    No se encontraron jugadores.
                </td>
            </tr>
        `);

        $('#cantidadJugadores').text('Mostrando 0 jugadores');
        return;
    }

    let html = '';

    lista.forEach(jugador => {
        const foto = jugador.foto_perfil
            ? apiUrlBase + jugador.foto_perfil
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(jugador.nombre)}&background=262421&color=ffffff&size=150`;

        html += `
            <tr class="ranking-row rank-${jugador.posicion}" onclick="irAPerfil(${jugador.id})">

                <td class="rank-pos">
                    ${jugador.posicion}
                </td>

                <td>
                    <div class="player-cell">

                        <img
                            src="${foto}"
                            class="player-avatar"
                            onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(jugador.nombre)}&background=262421&color=ffffff&size=150'">

                        <div class="player-info">

                            <span class="player-name">

                                ${jugador.titulo && jugador.titulo !== 'ST'
                                    ? `<span class="player-title">${jugador.titulo}</span>`
                                    : ''}

                                ${jugador.nombre}

                            </span>

                            <small class="text-muted d-md-none">
                                ${jugador.club}
                            </small>

                        </div>

                    </div>
                </td>

                <td class="text-center elo-main">
                    ${jugador.elo_standard}
                </td>

                <td class="text-center text-muted d-none d-md-table-cell">
                    ${jugador.elo_rapid}
                </td>

                <td class="text-center text-muted d-none d-md-table-cell">
                    ${jugador.elo_blitz}
                </td>

                <td class="d-none d-md-table-cell">

                    <span
                        class="player-club"
                        onclick="event.stopPropagation();irAClub(${jugador.club_id})">

                        <i class="bi bi-shield-fill me-1"></i>
                        ${jugador.club}

                    </span>

                </td>

            </tr>
        `;
    });

    $('#tablaJugadores').html(html);

    const desde = jugadoresFiltrados.length ? inicio + 1 : 0;
    const hasta = Math.min(fin, jugadoresFiltrados.length);

    $('#cantidadJugadores').text(
        `Mostrando ${desde} a ${hasta} de ${jugadoresFiltrados.length} jugador${jugadoresFiltrados.length === 1 ? '' : 'es'}`
    );
}

function renderPaginacion() {
    const totalPaginas = Math.max(1, Math.ceil(jugadoresFiltrados.length / porPagina));

    let html = `
        <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="cambiarPagina(${paginaActual - 1});return false;">
                Anterior
            </a>
        </li>
    `;

    for (let i = 1; i <= totalPaginas; i++) {
        html += `
            <li class="page-item ${i === paginaActual ? 'active' : ''}">
                <a class="page-link" href="#" onclick="cambiarPagina(${i});return false;">
                    ${i}
                </a>
            </li>
        `;
    }

    html += `
        <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="cambiarPagina(${paginaActual + 1});return false;">
                Siguiente
            </a>
        </li>
    `;

    $('#paginacionRanking').html(html);
}

window.cambiarPagina = function(pagina) {
    const totalPaginas = Math.ceil(jugadoresFiltrados.length / porPagina);

    if (pagina < 1 || pagina > totalPaginas)
        return;

    paginaActual = pagina;

    renderTabla();
    renderPaginacion();

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

window.irAPerfil = function(id) {
    window.location.href = `${rutaPerfil}?id=${id}`;
};

window.irAClub = function(id) {
    window.location.href = rutaClub.replace('__ID__', id);
};
