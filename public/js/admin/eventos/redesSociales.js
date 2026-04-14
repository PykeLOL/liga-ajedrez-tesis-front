let redSocialIndex = 0;
let redesSocialesCache = [];
let selectsRedesSocialesCargados = false;

async function precargarSelectsRedesSociales() {
    if (selectsRedesSocialesCargados) return;
    const [redesSociales] = await Promise.all([
        apiRequest({ url: `${apiUrl}/select/redesSociales`, type: 'GET' })
    ]);
    redesSocialesCache = redesSociales;
    selectsRedesSocialesCargados = true;
}

$('#addRedSocial').on('click', async function () {
    await precargarSelectsRedesSociales();
    agregarRedSocial();
});

function agregarRedSocial() {
    $('#redesSocialesContainer').append(`
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 red-social-item">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <strong class="small">Red Social</strong>
                        <div class="btn-group btn-group-sm">
                            <button type="button" class="btn btn-outline-light red-arriba">↑</button>
                            <button type="button" class="btn btn-outline-light red-abajo">↓</button>
                            <button type="button" class="btn btn-outline-danger remove-redSocial">✕</button>
                        </div>
                    </div>
                    <div class="mb-2">
                        <label class="small">Red Social *</label>
                        <select class="form-control form-control-sm red-social-select required"></select>
                    </div>
                    <div class="mb-2">
                        <label class="small">Url *</label>
                        <input type="url"
                            class="form-control form-control-sm url-red-social required"
                            min="1">
                    </div>
                </div>
            </div>
        </div>
    `);

    const $item = $('#redesSocialesContainer .red-social-item').last();
    const $red = $item.find('.red-social-select');

    $red.append('<option value="">Seleccione</option>');
    redesSocialesCache.forEach(c =>
        $red.append(new Option(c.nombre, c.id))
    );

    redSocialIndex++;
    actualizarBotonesRedesSociales();
    return $item;
}

$(document).on('click', '.red-arriba', function () {
    const col = $(this).closest('.col-12');
    col.prev('.col-12').before(col);
    actualizarBotonesRedesSociales();
});

$(document).on('click', '.red-abajo', function () {
    const col = $(this).closest('.col-12');
    col.next('.col-12').after(col);
    actualizarBotonesRedesSociales();
});

$(document).on('click', '.remove-redSocial', function () {
    const $item = $(this).closest('.red-social-item');
    const redSocialId = $item.data('id');
    if (redSocialId) {
        redesSocialesEliminadas.push(redSocialId);
    }
    $item.closest('.col-12').remove();
    actualizarBotonesRedesSociales();
});

function actualizarBotonesRedesSociales() {
    const columnas = $('#redesSocialesContainer > div.col-12');
    columnas.each(function (i) {
        $(this).find('.red-arriba').prop('disabled', i === 0);
        $(this).find('.red-abajo').prop('disabled', i === columnas.length - 1);
    });
}

function validarRedesSocialesUnicas() {
    const items = $('.red-social-item');
    if (!items.length) {
        return true;
    }

    const redesUsadas = [];
    let valido = true;
    items.each(function () {
        const red = $(this).find('.red-social-select').val();
        const url = $(this).find('.url-red-social').val();

        if (!red || !url) {
            Swal.fire(
                'Datos incompletos',
                'Todas las redes sociales deben tener red y URL.',
                'warning'
            );
            valido = false;
            return false;
        }

        if (redesUsadas.includes(red)) {
            Swal.fire(
                'Red social duplicada',
                'No puede agregar la misma red social más de una vez.',
                'warning'
            );
            valido = false;
            return false;
        }
        redesUsadas.push(red);
    });
    return valido;
}

$(document).on('blur', '.url-red-social', function () {
    const $input = $(this);
    let valor = $input.val().trim();
    $input.removeClass('is-invalid');
    $input.next('.invalid-feedback').remove();
    if (!valor) return;
    const urlNormalizada = normalizarUrl(valor);

    if (!urlNormalizada) {
        $input.addClass('is-invalid');
        $input.after(`
            <div class="invalid-feedback">
                La URL ingresada no es válida.
            </div>
        `);
        return;
    }

    if (urlNormalizada !== valor) {
        $input.val(urlNormalizada);
    }
});

function normalizarUrl(url) {
    if (!url) return null;
    url = url.trim();

    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    try {
        const parsed = new URL(url);
        if (!parsed.hostname.includes('.')) {
            return null;
        }

        const partes = parsed.hostname.split('.');
        if (partes.some(p => p.length === 0)) {
            return null;
        }
        return parsed.href;
    } catch (e) {
        return null;
    }
}


function esUrlValida(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

async function cargarRedesSocialesEdit(redesSociales) {
    $('#redesSocialesContainer').empty();
    redSocialIndex = 0;
    redesSociallesEliminadas = [];
    for (const red of redesSociales) {
        const $item = await agregarRedSocial();
        $item.attr('data-id', red.id);
        $item.find('.red-social-select').val(red.red_social_id);
        $item.find('.url-red-social').val(red.url);
        redSocialIndex++;
    }
    actualizarBotonesRedesSociales();
}
