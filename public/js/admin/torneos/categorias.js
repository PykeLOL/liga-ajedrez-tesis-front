let categoriaIndex = 0;
let categoriasCache = [];
let ritmosCache = [];
let generosCache = [];
let selectsCategoriasCargados = false;

async function precargarSelectsCategorias() {
    if (selectsCategoriasCargados) return;

    const [categorias, ritmos, generos] = await Promise.all([
        apiRequest({ url: `${apiUrl}/select/categorias-evento`, type: 'GET' }),
        apiRequest({ url: `${apiUrl}/select/ritmos-evento`, type: 'GET' }),
        apiRequest({ url: `${apiUrl}/select/generos`, type: 'GET' }),
    ]);

    categoriasCache = categorias;
    ritmosCache = ritmos;
    generosCache = generos;
    selectsCategoriasCargados = true;
}

$('#addCategoriaTorneo').on('click', async function () {
    await precargarSelectsCategorias();
    agregarCategoriaTorneo();
});

function agregarCategoriaTorneo() {
    $('#categoriasTorneoContainer').append(`
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 categoria-torneo-item">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <strong class="small">Categoría</strong>
                        <div class="btn-group btn-group-sm">
                            <button type="button" class="btn btn-outline-light cat-arriba">↑</button>
                            <button type="button" class="btn btn-outline-light cat-abajo">↓</button>
                            <button type="button" class="btn btn-outline-danger remove-categoria">✕</button>
                        </div>
                    </div>
                    <div class="mb-2">
                        <label class="small">Categoría *</label>
                        <select class="form-control form-control-sm categoria-select required"></select>
                    </div>
                    <div class="mb-2">
                        <label class="small">Ritmo *</label>
                        <select class="form-control form-control-sm ritmo-select required"></select>
                    </div>
                    <div class="mb-2">
                        <label class="small">Género *</label>
                        <select class="form-control form-control-sm genero-select required"></select>
                    </div>
                    <div class="mb-2">
                        <label class="small">Cupo máximo *</label>
                        <input type="number"
                            class="form-control form-control-sm cupo-maximo required"
                            min="1">
                    </div>
                    <div>
                        <label class="small">Costo inscripción (COP)</label>
                        <input type="number"
                            class="form-control form-control-sm costo-inscripcion"
                            min="0"
                            value="0"
                            disabled>
                    </div>
                </div>
            </div>
        </div>
    `);
    const $item = $('#categoriasTorneoContainer .categoria-torneo-item').last();

    const $cat = $item.find('.categoria-select');
    $cat.append('<option value="">Seleccione</option>');
    categoriasCache.forEach(c =>
        $cat.append(new Option(c.nombre, c.id))
    );

    const $ritmo = $item.find('.ritmo-select');
    $ritmo.append('<option value="">Seleccione</option>');
    ritmosCache.forEach(r =>
        $ritmo.append(new Option(r.nombre, r.id))
    );

    const $gen = $item.find('.genero-select');
    $gen.append('<option value="">Seleccione</option>');
    generosCache.forEach(g =>
        $gen.append(new Option(g.nombre, g.id))
    );

    if ($('#de_pago').is(':checked')) {
        $item.find('.costo-inscripcion').prop('disabled', false);
    }

    const valorFijo = obtenerValorFijoInscripcion();
    if (valorFijo !== null) {
        $item.find('.costo-inscripcion')
            .val(valorFijo)
            .prop('disabled', true);
    } else if ($('#de_pago').is(':checked')) {
        $item.find('.costo-inscripcion')
            .prop('disabled', false);
    }

    categoriaIndex++;
    actualizarBotonesCategorias();
    return $item;
}

$(document).on('click', '.cat-arriba', function () {
    const col = $(this).closest('.col-12');
    col.prev('.col-12').before(col);
    actualizarBotonesCategorias();
});

$(document).on('click', '.cat-abajo', function () {
    const col = $(this).closest('.col-12');
    col.next('.col-12').after(col);
    actualizarBotonesCategorias();
});

$(document).on('click', '.remove-categoria', function () {
    const $item = $(this).closest('.categoria-torneo-item');
    const categoriaId = $item.data('id');

    if (categoriaId) {
        categoriasEliminadas.push(categoriaId);
    }

    $item.closest('.col-12').remove();
    actualizarBotonesCategorias();
});

function actualizarBotonesCategorias() {
    const columnas = $('#categoriasTorneoContainer > div.col-12');
    columnas.each(function (i) {
        $(this).find('.cat-arriba').prop('disabled', i === 0);
        $(this).find('.cat-abajo').prop('disabled', i === columnas.length - 1);
    });
}

function validarCategoriasUnicas() {
    const items = $('.categoria-torneo-item');
    if (!items.length) {
        Swal.fire(
            'Categorías requeridas',
            'Debe agregar al menos una categoría al torneo.',
            'warning'
        );
        return false;
    }

    const combinaciones = [];
    let valido = true;

    items.each(function () {
        const cat = $(this).find('.categoria-select').val();
        const ritmo = $(this).find('.ritmo-select').val();
        const genero = $(this).find('.genero-select').val();

        if (!cat || !ritmo || !genero) return;
        const key = `${cat}-${ritmo}-${genero}`;

        if (combinaciones.includes(key)) {
            Swal.fire(
                'Configuración duplicada',
                'No puede repetir la misma categoría, ritmo y género.',
                'warning'
            );
            valido = false;
            return false;
        }
        combinaciones.push(key);
    });
    return valido;
}

async function cargarCategoriasEdit(categorias) {
    $('#categoriasTorneoContainer').empty();
    categoriaIndex = 0;
    categoriasEliminadas = [];

    for (const cat of categorias) {
        const $item = await agregarCategoriaTorneo();
        $item.attr('data-id', cat.id);
        $item.find('.categoria-select').val(cat.categoria_id);
        $item.find('.ritmo-select').val(cat.ritmo_id || '');
        $item.find('.genero-select').val(cat.genero_id);
        $item.find('.cupo-maximo').val(cat.cupo_maximo);
        $item.find('.costo-inscripcion').val(cat.costo_inscripcion);
        categoriaIndex++;
    }
    actualizarBotonesCategorias();
}

function validarCuposVsMaxParticipantes() {
    const maxParticipantes = parseInt($('#max_participantes').val());

    if (!maxParticipantes || isNaN(maxParticipantes)) {
        return true;
    }

    const items = $('.categoria-torneo-item');

    let total = 0;
    let incompletos = false;

    items.each(function () {
        const val = $(this).find('.cupo-maximo').val();

        if (!val) {
            incompletos = true;
            return false;
        }

        total += parseInt(val);
    });

    if (incompletos) {
        return true;
    }

    if (total !== maxParticipantes) {
        $('#max_participantes').addClass('is-invalid');
        $('.cupo-maximo').addClass('is-invalid');
        Swal.fire(
            'Cupos no coinciden',
            `La suma de cupos por categoría (${total}) debe ser igual
             al máximo de participantes (${maxParticipantes}).`,
            'warning'
        );
        return false;
    }

    $('#max_participantes').removeClass('is-invalid');
    $('.cupo-maximo').removeClass('is-invalid');

    return true;
}

function obtenerTotalCuposCategorias() {
    let total = 0;
    $('.categoria-torneo-item').each(function () {
        const val = parseInt(
            $(this).find('.cupo-maximo').val()
        );

        if (!isNaN(val)) {
            total += val;
        }
    });
    return total;
}

function obtenerRangoInscripcionTorneo() {
    const min = parseInt($('#valor_min').val());
    const max = parseInt($('#valor_max').val());

    if (isNaN(min) || isNaN(max)) {
        return null;
    }

    return { min, max };
}

function obtenerRangoCategorias() {
    const valores = [];

    $('.categoria-torneo-item').each(function () {
        const val = parseInt(
            $(this).find('.costo-inscripcion').val()
        );

        if (!isNaN(val)) {
            valores.push(val);
        }
    });

    if (!valores.length) return null;

    return {
        min: Math.min(...valores),
        max: Math.max(...valores)
    };
}

function validarRangoInscripcionCategorias() {
    const esDePago = $('#de_pago').is(':checked');
    if (!esDePago) return true;

    const rangoTorneo = obtenerRangoInscripcionTorneo();
    if (!rangoTorneo) return true;

    const rangoCategorias = obtenerRangoCategorias();
    if (!rangoCategorias) return true;

    let incompletos = false;
    $('.categoria-torneo-item').each(function () {
        if (!$(this).find('.costo-inscripcion').val()) {
            incompletos = true;
            return false;
        }
    });

    if (incompletos) return true;

    if (
        rangoCategorias.min !== rangoTorneo.min ||
        rangoCategorias.max !== rangoTorneo.max
    ) {
        $('.costo-inscripcion').addClass('is-invalid');
        $('#valor_min, #valor_max').addClass('is-invalid');

        Swal.fire(
            'Rango de inscripción inconsistente',
            `Los costos de las categorías deben cubrir completamente
             el rango de inscripción del torneo (${rangoTorneo.min} - ${rangoTorneo.max}).`,
            'warning'
        );

        return false;
    }

    $('.costo-inscripcion').removeClass('is-invalid');
    $('#valor_min, #valor_max').removeClass('is-invalid');

    return true;
}

function validarCostoCategoriasGratis() {
    const esDePago = $('#de_pago').is(':checked');
    if (esDePago) return true;

    let valido = true;

    $('.categoria-torneo-item').each(function () {
        const val = parseInt(
            $(this).find('.costo-inscripcion').val()
        );

        if (val !== 0) {
            $(this).find('.costo-inscripcion').addClass('is-invalid');
            valido = false;
        }
    });

    if (!valido) {
        Swal.fire(
            'Evento gratuito',
            'Si el torneo no es de pago, el costo de inscripción por categoría debe ser 0.',
            'warning'
        );
    }
    return valido;
}

function obtenerValorFijoInscripcion() {
    const esDePago = $('#de_pago').is(':checked');
    if (!esDePago) return null;

    const min = parseInt($('#valor_min').val());
    const max = $('#valor_max').val();

    if (!isNaN(min) && (!max || max === '')) {
        return min;
    }

    return null;
}

function aplicarValorFijoCategorias() {
    const valorFijo = obtenerValorFijoInscripcion();

    $('.categoria-torneo-item').each(function () {
        const $input = $(this).find('.costo-inscripcion');

        if (valorFijo !== null) {
            $input
                .val(valorFijo)
                .prop('disabled', true)
                .removeClass('is-invalid');
        }
    });
}
