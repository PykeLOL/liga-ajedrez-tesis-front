let tipoActual = 'proximos';
let paginaActual = 1;
const porPagina = 10;

document.addEventListener('DOMContentLoaded', () => {
    iniciarBotones();
    cargarEventos();
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
    apiRequest({
        url: `${apiUrl}/home/eventos/tipo/${tipoEventoId}?tipo=${tipoActual}&page=${paginaActual}&per_page=${porPagina}`,
        type: 'GET'
    }).then(r => {
        renderEventos(r.data);
        renderPaginacion(r.meta);
    }).catch(xhr => {

        console.error('Error cargando eventos', xhr);

    });
}

function renderEventos(eventos) {
    const contenedor = document.querySelector(`.eventos-container[data-tipo="${tipoActual}"]`);
    contenedor.innerHTML = '';

    if (!eventos?.length) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">No hay eventos para mostrar.</div>
            </div>`;
        return;
    }
    eventos.forEach(e => {
        contenedor.innerHTML += `
        <div class="col-12 col-xl-6">
            <div class="card card-meeting h-100 shadow-sm ${e.tipo_clase}">
                <div class="card-body p-4 d-flex flex-column">

                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge ${e.tipo_badge}">
                                <i class="bi ${e.tipo_icono}"></i> ${e.tipo_label}
                            </span>
                            <span class="text-muted small">
                                <i class="bi bi-calendar3 ms-2"></i> ${e.fecha_inicio_formateada}
                            </span>
                        </div>

                        <div class="attendance-badge text-muted border border-secondary">
                            <i class="bi bi-people-fill text-chess-green"></i>
                            <span class="asistentes">${e.asistentes} ${e.asistentes === 1 ? 'asistente' : 'asistentes'}</span>
                        </div>
                    </div>

                    <h4 class="fw-bold text-white mb-1">${e.nombre}</h4>

                    <p class="text-chess-green mb-3 small fw-semibold">
                        Convocado por: ${e.organizador_nombre || 'Por definir'}
                    </p>

                    <div class="meeting-details-box mb-4 flex-grow-1">
                        <div class="row g-2 mb-3">
                            <div class="col-md-6 small">
                                <i class="bi bi-clock me-1"></i>
                                <strong>Hora:</strong> ${e.hora_inicio || 'Por definir'}
                            </div>
                            <div class="col-md-6 small">
                                <i class="bi bi-geo-alt me-1"></i>
                                <strong>Lugar:</strong> ${e.lugar}
                            </div>
                        </div>

                        <hr class="my-2">

                        <div class="small mt-2">
                            <strong class="d-block mb-1 text-uppercase opacity-75" style="font-size:.7rem;">Motivo:</strong>
                            ${e.descripcion || '—'}
                        </div>
                    </div>

                    <div class="d-flex gap-2 mt-auto">
                        <button class="btn ${e.confirmo_asistencia ? 'btn-chess' : 'btn-chess-secondary'} flex-grow-1 fw-bold btn-asistencia"
                            data-id="${e.id}">
                            <i class="bi ${e.confirmo_asistencia ? 'bi-person-check-fill' : 'bi-check2-circle'} me-2"></i>
                            ${e.confirmo_asistencia ? 'Asistencia confirmada' : 'Confirmar asistencia'}
                        </button>

                        ${e.documento
                            ? `
                                <button class="btn btn-outline-secondary"
                                    onclick="window.open('${apiUrlBase}/storage/${e.documento.path}','_blank')">
                                    <i class="bi bi-file-earmark-pdf"></i>
                                </button>`
                            : `
                                <button class="btn btn-outline-secondary" disabled style="opacity:.45;">
                                    <i class="bi bi-file-earmark-pdf"></i>
                                </button>`
                        }
                    </div>

                </div>
            </div>
        </div>`;
    });

    document.querySelectorAll('.btn-asistencia').forEach(btn =>
        btn.addEventListener('click', confirmarAsistencia)
    );
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

function confirmarAsistencia(e) {
    if (!requiereAutenticacion()) return;

    const btn = e.currentTarget;
    if (btn.disabled) return;

    btn.disabled = true;

    apiRequest({
        url: `${apiUrl}/home/eventos/confirmar-asistencia/${btn.dataset.id}`,
        type: 'POST'
    }).then(r => {

        btn.classList.toggle('btn-chess', r.asistira);
        btn.classList.toggle('btn-chess-secondary', !r.asistira);

        btn.innerHTML = `
            <i class="bi ${r.asistira ? 'bi-person-check-fill' : 'bi-check2-circle'} me-2"></i>
            ${r.asistira ? 'Asistencia confirmada' : 'Confirmar asistencia'}`;

        btn.closest('.card-body')
            .querySelector('.asistentes')
            .textContent = `${r.total_asistentes} ${r.total_asistentes === 1 ? 'asistente' : 'asistentes'}`;

    }).catch(xhr => {

        validarRespuesta(xhr, 'No fue posible actualizar la asistencia.');

    }).finally(() => {

        btn.disabled = false;

    });
}
