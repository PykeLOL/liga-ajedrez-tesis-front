let clubesConfirmados = false;
let clubesDisponibles = [];
let clubesSeleccionados = [];
let clubesSeleccionadosTemp = [];

function cargarClubes() {
    apiRequest({
        url: `${apiUrl}/select/clubes`,
        type: 'GET'
    }).then(data => {
        clubesDisponibles = data;
        renderClubesModal();
        renderClubesSeleccionados();
    });
}

function renderClubesModal() {
    const $lista = $('#listaClubes');
    $lista.empty();
    clubesDisponibles.forEach(club => {
        const checked = clubesSeleccionados.includes(club.id) ? 'checked' : '';
        $lista.append(`
            <div class="col-md-6">
                <label class="form-check d-flex align-items-center gap-2">
                    <input type="checkbox"
                        class="form-check-input club-check"
                        value="${club.id}"
                        ${checked}>
                    <span>${club.nombre}</span>
                </label>
            </div>
        `);
    });
}

$('#btnSeleccionarClubes').on('click', function () {
    clubesSeleccionadosTemp = [...clubesSeleccionados];

    if (!clubesDisponibles.length) {
        cargarClubes();
    } else {
        renderClubesModal();
    }

    $('#modalClubes').modal('show');
});

$('#guardarClubes').on('click', function () {
    clubesSeleccionados = [];

    $('.club-check:checked').each(function () {
        clubesSeleccionados.push(parseInt($(this).val()));
    });

    clubesConfirmados = true;
    renderClubesSeleccionados();
    $('#modalClubes').modal('hide');
});

function cargarOrganizadoresEdit(organizadores) {
    clubesSeleccionados = [];
    organizadores.forEach(o => {
        clubesSeleccionados.push(o.club_id);
    });

    renderClubesSeleccionados();
}

function renderClubesSeleccionados() {
    const $container = $('#clubesSeleccionados');
    $container.empty();

    if (!clubesSeleccionados.length) {
        $container.append(
            '<span class="text-muted small">No hay clubes seleccionados</span>'
        );
        return;
    }

    clubesSeleccionados.forEach(id => {
        const club = clubesDisponibles.find(c => c.id === id);
        if (!club) return;
        $container.append(`
            <span class="badge bg-success text-dark d-flex align-items-center gap-1">
                ${club.nombre}
                <button type="button"
                        class="btn-close btn-close-white btn-sm quitar-club"
                        data-id="${id}"></button>
            </span>
        `);
    });
}

function removerClub(id) {
    clubesSeleccionados = clubesSeleccionados.filter(c => c !== id);
    renderClubesSeleccionados();
}
