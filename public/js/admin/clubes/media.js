let mediaIndex = 0;
let mediaEliminados = [];

$('#addMedia').on('click', function () {
    agregarMedia();
});

function agregarMedia() {
    $('#mediaContainer').append(`
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 mb-3 media-item" data-index="${mediaIndex}">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <strong class="small">Media</strong>
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge bg-warning text-dark d-none badge-principal">
                                ⭐ Principal
                            </span>
                            <div class="btn-group btn-group-sm">
                                <button type="button" class="btn btn-outline-light mover-arriba">↑</button>
                                <button type="button" class="btn btn-outline-light mover-abajo">↓</button>
                                <button type="button" class="btn btn-outline-danger remove-media">✕</button>
                            </div>
                        </div>
                    </div>
                    <select class="form-control form-control-sm mb-2 media-tipo">
                        <option value="imagen">Imagen</option>
                        <option value="video">Video</option>
                        <option value="url">YouTube</option>
                    </select>
                    <div class="media-preview mb-2 text-center text-muted small"
                        style="min-height:120px">
                        Sin preview
                    </div>
                    <input type="file"
                        class="form-control form-control-sm mb-2 media-archivo"
                        accept="image/*,video/*">
                    <input type="url"
                        class="form-control form-control-sm mb-2 media-url d-none"
                        placeholder="URL de YouTube">
                    <input type="text"
                        class="form-control form-control-sm media-descripcion"
                        placeholder="Descripción">
                </div>
            </div>
        </div>
    `);
    mediaIndex++;
    actualizarBotonesMedia();
    actualizarImagenPrincipal();
}

$(document).on('change', '.media-tipo', function () {
    const item = $(this).closest('.media-item');
    const col = $(this).closest('.col-12');
    const tipo = $(this).val();
    const esPrincipal = col.index() === 0;
    if (esPrincipal && tipo !== 'imagen') {
        $(this).val('imagen');
        return;
    }

    const $file = item.find('.media-archivo');
    const $url  = item.find('.media-url');
    const $preview = item.find('.media-preview');
    $preview.html('Sin preview');
    if (tipo === 'url') {
        $file.val('').addClass('d-none');
        $url.removeClass('d-none');
    } else {
        $url.val('').addClass('d-none');
        $file.removeClass('d-none');
    }

    actualizarBotonesMedia();
    actualizarImagenPrincipal();
});

$(document).on('change', '.media-archivo', function () {
    const file = this.files[0];
    if (!file) return;

    const item = $(this).closest('.media-item');
    const preview = item.find('.media-preview');
    const url = URL.createObjectURL(file);

    if (file.type.startsWith('image')) {
        preview.html(`
            <img src="${url}"
                class="img-fluid rounded"
                style="max-height:200px">
        `);
    }

    if (file.type.startsWith('video')) {
        preview.html(`
            <video controls
                class="w-100 rounded"
                style="max-height:200px">
                <source src="${url}">
            </video>
        `);
    }
});

$(document).on('input', '.media-url', function () {
    const url = $(this).val();
    const item = $(this).closest('.media-item');
    const preview = item.find('.media-preview');
    const id = obtenerYoutubeId(url);
    if (!id) {
        preview.html('<span class="text-muted">URL inválida</span>');
        return;
    }

    preview.html(`
        <div class="ratio ratio-16x9">
            <iframe src="https://www.youtube.com/embed/${id}"
                    allowfullscreen></iframe>
        </div>
    `);
});

function obtenerYoutubeId(url) {
    const match = url.match(/(youtu\.be\/|v=)([^&]+)/);
    return match ? match[2] : null;
}

$(document).on('click', '.mover-arriba', function () {
    const col = $(this).closest('.col-12');
    const item = col.find('.media-item');
    const tipo = item.find('.media-tipo').val();
    const esSegundo = col.index() === 1;
    if (esSegundo && tipo !== 'imagen') {
        Swal.fire(
            'Acción no permitida',
            'Solo una imagen puede ser la media principal.',
            'warning'
        );
        return;
    }

    col.prev('.col-12').before(col);
    actualizarBotonesMedia();
    actualizarImagenPrincipal();
});


$(document).on('click', '.mover-abajo', function () {
    const col = $(this).closest('.col-12');
    if (col.index() === 0) {
        Swal.fire(
            'Acción no permitida',
            'La imagen principal no se puede mover hacia abajo.',
            'warning'
        );
        return;
    }

    col.next('.col-12').after(col);
    actualizarBotonesMedia();
    actualizarImagenPrincipal();
});

$(document).on('click', '.remove-media', function () {
    const col = $(this).closest('.col-12');
    const columnas = $('#mediaContainer > div.col-12');
    const $item = $(this).closest('.media-item');
    const id = $item.data('id');

    if (col.index() === 0 && columnas.length > 1) {
        Swal.fire(
            'Acción no permitida',
            'No puede eliminar la imagen principal mientras existan otras medias.',
            'warning'
        );
        return;
    }

    if (id) {
        mediaEliminados.push(id);
    }

    col.remove();
    actualizarBotonesMedia();
    actualizarImagenPrincipal();
});

function actualizarBotonesMedia() {
    const columnas = $('#mediaContainer > div.col-12');
    columnas.each(function (index) {
        const col = $(this);
        const item = col.find('.media-item');
        const tipo = item.find('.media-tipo').val();
        const btnUp = col.find('.mover-arriba');
        const btnDown = col.find('.mover-abajo');

        if (index === 0) {
            btnUp.prop('disabled', true);
            btnDown.prop('disabled', true);
            return;
        }

        if (index === 1 && tipo !== 'imagen') {
            btnUp.prop('disabled', true);
        } else {
            btnUp.prop('disabled', false);
        }

        btnDown.prop('disabled', index === columnas.length - 1);
    });
}

function actualizarImagenPrincipal() {
    const columnas = $('#mediaContainer > div.col-12');
    columnas.each(function (index) {
        const item = $(this).find('.media-item');
        const badge = item.find('.badge-principal');
        const tipo = item.find('.media-tipo');
        const btnRemove = item.find('.remove-media');

        if (index === 0) {
            badge.removeClass('d-none');
            tipo.val('imagen').prop('disabled', true);
            btnRemove.prop('disabled', columnas.length > 1);
        } else {
            badge.addClass('d-none');
            tipo.prop('disabled', false);
            btnRemove.prop('disabled', false);
        }
    });
}

function validarImagenPrincipal() {
    const columnas = $('#mediaContainer > div.col-12');
    if (!columnas.length) {
        Swal.fire(
            'Advertencia',
            'Debe agregar al menos una imagen principal.',
            'warning'
        );
        return false;
    }

    const principal = columnas.first().find('.media-item');
    const tipo = principal.find('.media-tipo').val();
    const archivoInput = principal.find('.media-archivo')[0];
    const mediaId = principal.data('id');

    if (tipo !== 'imagen') {
        Swal.fire(
            'Advertencia',
            'La primera media debe ser una imagen.',
            'warning'
        );
        return false;
    }

    if (!mediaId && (!archivoInput || !archivoInput.files.length)) {
        Swal.fire(
            'Advertencia',
            'Debe seleccionar un archivo para la imagen principal.',
            'warning'
        );
        return false;
    }
    return true;
}

function cargarMediaEdit(media) {
    $('#mediaContainer').empty();
    mediaIndex = 0;
    mediaEliminados = [];
    media.forEach(m => {
        $('#mediaContainer').append(`
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 mb-3 media-item"
                    data-id="${m.id}"
                    data-index="${mediaIndex}">
                    <div class="card-body p-3">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <strong class="small">Media</strong>
                            <div class="d-flex align-items-center gap-2">
                                <span class="badge bg-warning text-dark d-none badge-principal">
                                    ⭐ Principal
                                </span>
                                <div class="btn-group btn-group-sm">
                                    <button type="button" class="btn btn-outline-light mover-arriba">↑</button>
                                    <button type="button" class="btn btn-outline-light mover-abajo">↓</button>
                                    <button type="button" class="btn btn-outline-danger remove-media">✕</button>
                                </div>
                            </div>
                        </div>
                        <select class="form-control form-control-sm mb-2 media-tipo">
                            <option value="imagen" ${m.tipo === 'imagen' ? 'selected' : ''}>Imagen</option>
                            <option value="video" ${m.tipo === 'video' ? 'selected' : ''}>Video</option>
                            <option value="url" ${m.tipo === 'url' ? 'selected' : ''}>YouTube</option>
                        </select>
                        <div class="media-preview mb-2 text-center text-muted small"
                            style="min-height:120px">
                            ${renderPreview(m)}
                        </div>
                        <input type="file"
                            class="form-control form-control-sm mb-2 media-archivo"
                            ${m.tipo === 'url' ? 'style="display:none"' : ''}>
                        <input type="url"
                            class="form-control form-control-sm mb-2 media-url
                                ${m.tipo !== 'url' ? 'd-none' : ''}"
                            value="${m.tipo === 'url' ? m.path : ''}"
                            placeholder="URL de YouTube">
                        <input type="text"
                            class="form-control form-control-sm media-descripcion"
                            value="${m.descripcion ?? ''}"
                            placeholder="Descripción">
                    </div>
                </div>
            </div>
        `);
        mediaIndex++;
    });
    actualizarBotonesMedia();
    actualizarImagenPrincipal();
}

function renderPreview(media) {
    if (!media || !media.tipo || !media.path) {
        return '<span class="text-muted small">Sin preview</span>';
    }

    if (media.tipo === 'imagen') {
        return `
            <img src="${apiUrlBase}/storage/${media.path}"
                class="img-fluid rounded shadow-sm"
                style="max-height:180px; object-fit:cover;">
        `;
    }

    if (media.tipo === 'video') {
        return `
            <video controls
                class="w-100 rounded shadow-sm"
                style="max-height:180px">
                <source src="${apiUrlBase}/storage/${media.path}">
                Tu navegador no soporta video.
            </video>
        `;
    }

    if (media.tipo === 'url') {
        const youtubeId = obtenerYoutubeId(media.path);
        if (!youtubeId) {
            return '<span class="text-danger small">URL de YouTube inválida</span>';
        }

        return `
            <div class="ratio ratio-16x9 rounded overflow-hidden">
                <iframe
                    src="https://www.youtube.com/embed/${youtubeId}"
                    allowfullscreen
                    loading="lazy">
                </iframe>
            </div>
        `;
    }
    return '<span class="text-muted small">Tipo no soportado</span>';
}

$(document).on('blur', '.media-url', function () {
    const $input = $(this);
    let valor = $input.val().trim();

    $input.removeClass('is-invalid');
    $input.next('.invalid-feedback').remove();

    if (!valor) return;

    const urlNormalizada = normalizarUrlYoutube(valor);

    if (!urlNormalizada) {
        $input.addClass('is-invalid');
        $input.after(`
            <div class="invalid-feedback">
                Solo se permiten URLs de YouTube.
            </div>
        `);
        return;
    }

    if (urlNormalizada !== valor) {
        $input.val(urlNormalizada);
    }
});

function normalizarUrlYoutube(url) {
    if (!url) return null;
    url = url.trim();

    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    return esUrlYoutube(url) ? url : null;
}

function esUrlYoutube(url) {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();

        if (host === 'youtu.be') {
            return parsed.pathname.length > 1;
        }

        if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
            if (parsed.searchParams.has('v')) {
                return parsed.searchParams.get('v').length > 0;
            }
            if (parsed.pathname.startsWith('/shorts/')) {
                return parsed.pathname.split('/shorts/')[1]?.length > 0;
            }
            return false;
        }
        return false;
    } catch (e) {
        return false;
    }
}

