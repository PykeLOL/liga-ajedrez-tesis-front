let documentoIndex = 0;
let documentosEliminados = [];

$('#addDocumento').on('click', function () {
    agregarDocumento();
});

function agregarDocumento() {
    $('#documentosContainer').append(`
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 mb-2 documento-item">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <strong class="small">Documento</strong>
                        <div class="btn-group btn-group-sm">
                            <button type="button" class="btn btn-outline-light doc-arriba">↑</button>
                            <button type="button" class="btn btn-outline-light doc-abajo">↓</button>
                            <button type="button" class="btn btn-outline-danger remove-documento">✕</button>
                        </div>
                    </div>
                    <div class="documento-preview text-muted small mb-2">
                        Sin documento
                    </div>
                    <input type="file"
                        class="form-control form-control-sm mb-2 documento-archivo"
                        accept=".pdf,.doc,.docx,.xls,.xlsx">
                    <input type="text"
                        class="form-control form-control-sm documento-descripcion"
                        placeholder="Descripción">
                </div>
            </div>
        </div>
    `);
    documentoIndex++;
    actualizarBotonesDocumentos();
}

$(document).on('change', '.documento-archivo', function () {
    const file = this.files[0];
    if (!file) return;
    const item = $(this).closest('.documento-item');
    const preview = item.find('.documento-preview');
    const ext = file.name.split('.').pop().toLowerCase();

    let icon = 'file';
    let color = 'text-secondary';
    if (ext === 'pdf') {
        icon = 'file-text';
        color = 'text-danger';
    }
    else if (['doc', 'docx'].includes(ext)) {
        icon = 'file-text';
        color = 'text-primary';
    }
    else if (['xls', 'xlsx'].includes(ext)) {
        icon = 'file-spreadsheet';
        color = 'text-success';
    }
    preview.html(renderPreviewDocumento(file.name));
    lucide.createIcons();
});

$(document).on('click', '.doc-arriba', function () {
    const col = $(this).closest('.col-12');
    col.prev('.col-12').before(col);
    actualizarBotonesDocumentos();
});

$(document).on('click', '.doc-abajo', function () {
    const col = $(this).closest('.col-12');
    col.next('.col-12').after(col);
    actualizarBotonesDocumentos();
});

function actualizarBotonesDocumentos() {
    const columnas = $('#documentosContainer > div.col-12');
    columnas.each(function (index) {
        const col = $(this);
        col.find('.doc-arriba').prop('disabled', index === 0);
        col.find('.doc-abajo').prop('disabled', index === columnas.length - 1);
    });
}

$(document).on('click', '.remove-documento', function () {
    const $item = $(this).closest('.documento-item');
    const docId = $item.data('id');
    if (docId) {
        documentosEliminados.push(docId);
    }
    $item.closest('.col-12').remove();
});

function cargarDocumentosEdit(documentos) {
    $('#documentosContainer').empty();
    documentoIndex = 0;
    documentosEliminados = [];
    documentos.forEach(doc => {
        $('#documentosContainer').append(`
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 mb-2 documento-item" data-id="${doc.id}">
                    <div class="card-body p-3">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <strong class="small">Documento</strong>
                            <div class="btn-group btn-group-sm">
                                <button type="button" class="btn btn-outline-light doc-arriba">↑</button>
                                <button type="button" class="btn btn-outline-light doc-abajo">↓</button>
                                <button type="button" class="btn btn-outline-danger remove-documento">✕</button>
                            </div>
                        </div>
                        <div class="documento-preview mb-2">
                            ${renderPreviewDocumento(`${doc.nombre}.${doc.tipo}`)}
                        </div>
                        <input type="file"
                            class="form-control form-control-sm mb-2 documento-archivo"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx">
                        <input type="text"
                            class="form-control form-control-sm documento-descripcion"
                            value="${doc.descripcion ?? ''}"
                            placeholder="Descripción">
                    </div>
                </div>
            </div>
        `);
        documentoIndex++;
    });
    lucide.createIcons();
    actualizarBotonesDocumentos();
}

function renderPreviewDocumento(nombreCompleto) {
    const ext = nombreCompleto.split('.').pop().toLowerCase();

    let icon = 'file';
    let color = 'text-secondary';

    if (ext === 'pdf') {
        icon = 'file-text';
        color = 'text-danger';
    } else if (['doc', 'docx'].includes(ext)) {
        icon = 'file-text';
        color = 'text-primary';
    } else if (['xls', 'xlsx'].includes(ext)) {
        icon = 'file-spreadsheet';
        color = 'text-success';
    } else if (['ppt', 'pptx'].includes(ext)) {
        icon = 'presentation';
        color = 'text-warning';
    }

    return `
        <div class="d-flex align-items-center gap-2">
            <i data-lucide="${icon}" class="${color}" style="width:20px;height:20px"></i>
            <span class="small text-truncate">${nombreCompleto}</span>
        </div>
    `;
}

