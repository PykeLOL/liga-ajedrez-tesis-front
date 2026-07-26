function loadPlanes(selectedId = null) {
    apiRequest({
        url: `${apiUrl}/select/planes-entrenamiento`,
        type: 'GET'
    })
    .then(planesEntrenamiento => {
        const $planEntrenamientoSelect = $('#plan_entrenamiento_id');
        $planEntrenamientoSelect.empty().append('<option value="">Seleccione un plan entrenamiento</option>');
        planesEntrenamiento.forEach(c => {
            $planEntrenamientoSelect.append(new Option(c.nombre, c.id, false, false));
        });
        if ($planEntrenamientoSelect.hasClass('select2-hidden-accessible')) {
            $planEntrenamientoSelect.trigger('change.select2');
        } else {
            $planEntrenamientoSelect.select2({
                placeholder: 'Seleccione un plan entrenamiento',
                allowClear: true,
                width: 'resolve',
                dropdownParent: $('#planEntrenamientoModal')
            });
        }
        if (selectedId) {
            $planEntrenamientoSelect.val(selectedId).trigger('change');
        }
    })
    .catch(xhr => console.error('Error cargando planes entrenamiento:', xhr));
}

function loadClubes(selectedId = null) {
    apiRequest({
        url: `${apiUrl}/select/clubes`,
        type: 'GET'
    })
    .then(clubes => {
        const $clubSelect = $('#club_id');
        $clubSelect.empty().append('<option value="">Seleccione un club</option>');
        clubes.forEach(c => {
            $clubSelect.append(new Option(c.nombre, c.id, false, false));
        });
        if ($clubSelect.hasClass('select2-hidden-accessible')) {
            $clubSelect.trigger('change.select2');
        } else {
            $clubSelect.select2({
                placeholder: 'Seleccione un club',
                allowClear: true,
                width: 'resolve',
                dropdownParent: $('#planEntrenamientoModal')
            });
        }
        if (selectedId) {
            $clubSelect.val(selectedId).trigger('change');
        }
    })
    .catch(xhr => console.error('Error cargando clubes:', xhr));
}

function loadCategorias(selectedId = null) {
    apiRequest({
        url: `${apiUrl}/select/categorias`,
        type: 'GET'
    })
    .then(categorias => {
        const $categoriaSelect = $('#categoria_id');
        $categoriaSelect.empty().append('<option value="">Seleccione un categoria</option>');
        categorias.forEach(c => {
            $categoriaSelect.append(new Option(c.nombre, c.id, false, false));
        });
        if ($categoriaSelect.hasClass('select2-hidden-accessible')) {
            $categoriaSelect.trigger('change.select2');
        } else {
            $categoriaSelect.select2({
                placeholder: 'Seleccione un categoria',
                allowClear: true,
                width: 'resolve',
                dropdownParent: $('#planEntrenamientoModal')
            });
        }
        if (selectedId) {
            $categoriaSelect.val(selectedId).trigger('change');
        }
    })
    .catch(xhr => console.error('Error cargando categorias:', xhr));
}

function loadGeneros(selectedId = null) {
    apiRequest({
        url: `${apiUrl}/select/generos`,
        type: 'GET'
    })
    .then(generos => {
        const $generoSelect = $('#genero_id');
        $generoSelect.empty().append('<option value="">Seleccione un genero</option>');
        generos.forEach(c => {
            $generoSelect.append(new Option(c.nombre, c.id, false, false));
        });
        if ($generoSelect.hasClass('select2-hidden-accessible')) {
            $generoSelect.trigger('change.select2');
        } else {
            $generoSelect.select2({
                placeholder: 'Seleccione un genero',
                allowClear: true,
                width: 'resolve',
                dropdownParent: $('#planEntrenamientoModal')
            });
        }
        if (selectedId) {
            $generoSelect.val(selectedId).trigger('change');
        }
    })
    .catch(xhr => console.error('Error cargando generos:', xhr));
}

function loadEntrenadores(selectedId = null) {
    apiRequest({
        url: `${apiUrl}/select/entrenadores`,
        type: 'GET'
    })
    .then(entrenadores => {
        const $entrenadorSelect = $('#entrenador_id');
        $entrenadorSelect.empty().append('<option value="">Seleccione un entrenador</option>');
        entrenadores.forEach(c => {
            $entrenadorSelect.append(new Option(c.nombre, c.id, false, false));
        });
        if ($entrenadorSelect.hasClass('select2-hidden-accessible')) {
            $entrenadorSelect.trigger('change.select2');
        } else {
            $entrenadorSelect.select2({
                placeholder: 'Seleccione un entrenador',
                allowClear: true,
                width: 'resolve',
                dropdownParent: $('#planEntrenamientoModal')
            });
        }
        if (selectedId) {
            $entrenadorSelect.val(selectedId).trigger('change');
        }
    })
    .catch(xhr => console.error('Error cargando entrenadores:', xhr));
}

function loadTiposEntrenamiento(selectedId = null) {
    apiRequest({
        url: `${apiUrl}/select/tipos-entrenamiento`,
        type: 'GET'
    })
    .then(tiposEntrenamiento => {
        const $tipoEntrenamientoSelect = $('#tipo_entrenamiento_id');
        $tipoEntrenamientoSelect.empty().append('<option value="">Seleccione un tipo entrenamiento</option>');
        tiposEntrenamiento.forEach(c => {
            $tipoEntrenamientoSelect.append(new Option(c.nombre, c.id, false, false));
        });
        if ($tipoEntrenamientoSelect.hasClass('select2-hidden-accessible')) {
            $tipoEntrenamientoSelect.trigger('change.select2');
        } else {
            $tipoEntrenamientoSelect.select2({
                placeholder: 'Seleccione un tipo entrenamiento',
                allowClear: true,
                width: 'resolve',
                dropdownParent: $('#planEntrenamientoModal')
            });
        }
        if (selectedId) {
            $tipoEntrenamientoSelect.val(selectedId).trigger('change');
        }
    })
    .catch(xhr => console.error('Error cargando tipos entrenamiento:', xhr));
}

function loadEventos(selectedId = null) {
    apiRequest({
        url: `${apiUrl}/select/eventos`,
        type: 'GET'
    })
    .then(eventos => {
        const $eventoSelect = $('#evento_id');
        $eventoSelect.empty().append('<option value="">Seleccione un evento</option>');
        eventos.forEach(c => {
            $eventoSelect.append(new Option(c.nombre, c.id, false, false));
        });
        if ($eventoSelect.hasClass('select2-hidden-accessible')) {
            $eventoSelect.trigger('change.select2');
        } else {
            $eventoSelect.select2({
                placeholder: 'Seleccione un evento',
                allowClear: true,
                width: 'resolve',
                dropdownParent: $('#planEntrenamientoModal')
            });
        }
        if (selectedId) {
            $eventoSelect.val(selectedId).trigger('change');
        }
    })
    .catch(xhr => console.error('Error cargando eventos:', xhr));
}

function loadClubesDeportistas(selectedId = null) {
    apiRequest({
        url: `${apiUrl}/select/clubes`,
        type: 'GET'
    })
    .then(clubes => {
        const $select = $('#clubFiltroDeportistas');
        $select.empty().append('<option value="">Seleccione un club</option>');

        clubes.forEach(c => {
            $select.append(new Option(c.nombre, c.id));
        });

        if ($select.hasClass('select2-hidden-accessible')) {
            $select.trigger('change.select2');
        } else {
            $select.select2({
                placeholder: 'Seleccione un club',
                allowClear: true,
                width: '100%',
                dropdownParent: $('#modalDeportistas')
            });
        }

        if (selectedId) {
            $select.val(selectedId).trigger('change');
        }
    });
}

function loadDiasSemana(selectedId = null) {
    apiRequest({
        url: `${apiUrl}/select/dias-semana`,
        type: 'GET'
    })
    .then(diasSemana => {
        const $diaSemanaSelect = $('#dia_semana_id');
        $diaSemanaSelect.empty().append('<option value="">Seleccione un dia semana</option>');
        diasSemana.forEach(c => {
            $diaSemanaSelect.append(new Option(c.nombre, c.id, false, false));
        });
        if ($diaSemanaSelect.hasClass('select2-hidden-accessible')) {
            $diaSemanaSelect.trigger('change.select2');
        } else {
            $diaSemanaSelect.select2({
                placeholder: 'Seleccione un dia semana',
                allowClear: true,
                width: 'resolve',
                dropdownParent: $('#planEntrenamientoModal')
            });
        }
        if (selectedId) {
            $diaSemanaSelect.val(selectedId).trigger('change');
        }
    })
    .catch(xhr => console.error('Error cargando dias semana:', xhr));
}
