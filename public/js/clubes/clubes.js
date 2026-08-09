let paginaActual = 1;
const porPagina = 10;

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('clubsGrid')) {
        cargarClubes();
    }
});

function cargarClubes() {
    $.ajax({
        url: `${apiUrl}/home/clubes?page=${paginaActual}&per_page=${porPagina}`,
        type: 'GET',
        dataType: 'json',
        success: r => {
            renderClubes(r.data);
            renderPaginacion(r.meta);
        },
        error: err => console.error('Error cargando clubes', err)
    });
}

function renderClubes(clubes) {
    const grid = document.getElementById('clubsGrid');
    grid.innerHTML = '';

    if (!clubes || !clubes.length) {
        grid.innerHTML = `
            <div class="text-center text-muted">
                No hay clubes registrados
            </div>`;
        return;
    }

    clubes.forEach(club => {
        const logo = club.logo
            ? `${apiUrlBase}${club.logo}`
            : 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png';

        const presidente = club.presidente
            ? `${club.presidente.nombre} ${club.presidente.apellido}`
            : 'No registrado';

        grid.innerHTML += `
            <div class="club-card">
                <div class="club-header">
                    <a href="/clubes/${club.id}">
                        <img src="${logo}" class="club-logo">
                    </a>
                </div>

                <div class="club-body">
                    <div class="club-title">
                        <a href="/clubes/${club.id}">
                            ${club.nombre}
                        </a>
                    </div>
                    <div class="club-president">
                        Pres. ${presidente}
                    </div>
                    <div class="club-info-item">
                        <i class="bi bi-geo-alt-fill"></i>
                        ${club.ubicacion ?? 'Sin ubicación'}
                    </div>
                    <div class="club-info-item">
                        <i class="bi bi-envelope-fill"></i>
                        ${club.contacto ?? 'Sin contacto'}
                    </div>
                    <div class="club-info-item">
                        <i class="bi bi-diagram-3-fill"></i>
                        ${club.liga?.nombre ?? '—'}
                    </div>
                </div>

                <div class="club-footer">
                    <button class="btn btn-chess w-100 fw-bold"
                        onclick="abrirModalAfiliacion(${club.id}, '${club.nombre.replace(/'/g, "\\'")}')">
                        Solicitar Afiliación
                    </button>
                </div>
            </div>
        `;
    });
}

function renderPaginacion(meta) {
    const pag = document.getElementById('paginacion');
    pag.innerHTML = '';

    if (!meta || meta.last_page <= 1) return;

    for (let i = 1; i <= meta.last_page; i++) {
        pag.innerHTML += `
            <button class="btn btn-sm mx-1
                ${i === meta.current_page ? 'btn-chess' : 'btn-outline-secondary'}"
                onclick="cambiarPagina(${i})">
                ${i}
            </button>`;
    }
}

function cambiarPagina(pagina) {
    paginaActual = pagina;
    cargarClubes();
}
