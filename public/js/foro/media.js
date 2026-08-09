function renderMedia(media){
    if(!media.length)return'';

    const principal=media[0];

    if(principal.tipo==='imagen'){
        return`
        <div class="position-relative mb-3">
            <img src="${apiUrlBase}/storage/${principal.path}" class="img-fluid rounded w-100 foro-imagen">
            ${media.length>1?`<span class="badge bg-dark position-absolute top-0 end-0 m-3">+${media.length-1}</span>`:''}
        </div>`;
    }

    if(principal.tipo==='video'){
        return`
        <div class="position-relative mb-3">
            <video controls class="rounded w-100 foro-video">
                <source src="${apiUrlBase}/storage/${principal.path}">
            </video>
            ${media.length>1?`<span class="badge bg-dark position-absolute top-0 end-0 m-3">+${media.length-1}</span>`:''}
        </div>`;
    }

    if(principal.tipo==='url'){
        const video=getYoutubeId(principal.path);

        return`
        <div class="position-relative mb-3">
            <img src="https://img.youtube.com/vi/${video}/hqdefault.jpg" class="img-fluid rounded w-100 foro-imagen">
            <div class="foro-play">
                <i class="bi bi-play-circle-fill"></i>
            </div>
        </div>`;
    }

    return'';
}

function actualizarContadorMedia(){
    const item=$('#mediaContainer .media-item');
    if(!item.length){
        $('#contadorMedia').text('Sin archivo adjunto');
        return;
    }

    const tieneArchivo=item.find('.media-archivo')[0]?.files.length;
    const tieneUrl=item.find('.media-url').val()?.trim();
    $('#contadorMedia').text(
        tieneArchivo||tieneUrl
            ?'1 archivo adjunto'
            :'Sin archivo adjunto'
    );
}

function agregarMedia(){
    if($('#mediaContainer .media-item').length){
        return;
    }
    const total=$('.media-item').length+1;

    $('#mediaContainer').append(`
        <div class="media-item card border-secondary bg-dark p-3 mb-3">
            <div class="row g-3">
                <div class="col-md-3">
                    <select class="form-select media-tipo">
                        <option value="imagen">Imagen</option>
                        <option value="video">Video</option>
                        <option value="url">YouTube</option>
                    </select>
                </div>

                <div class="col-md-7 media-input">
                    <input type="file" class="form-control media-archivo" accept="image/*">
                </div>

                <div class="col-md-2 d-grid">
                    <button type="button" class="btn btn-outline-secondary btnLimpiarMedia">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>

                <div class="col-12">
                    <input class="form-control media-descripcion" placeholder="Descripción (opcional)">
                </div>
            </div>
            <input type="hidden" class="media-orden" value="${total}">
        </div>
    `);

    actualizarContadorMedia();
}

function cambiarTipo(){
    const tipo=$(this).val();
    const input=$(this).closest('.media-item').find('.media-input');

    if(tipo==='imagen'){
        input.html('<input type="file" class="form-control media-archivo" accept="image/*">');
    }

    if(tipo==='video'){
        input.html('<input type="file" class="form-control media-archivo" accept="video/*">');
    }

    if(tipo==='url'){
        input.html('<input class="form-control media-url" placeholder="https://youtube.com/...">');
    }
}

function getYoutubeId(url){
    const r=url.match(/(?:youtu\.be\/|youtube\.com\/.*v=)([^&]+)/);
    return r?r[1]:'';
}

function reordenarMedia(){
    $('.media-item').each(function(i){
        $(this).find('.media-orden').val(i+1);
    });

    actualizarContadorMedia();
}

function previewArchivo(){
    const file=this.files[0];
    if(!file)return;

    const item=$(this).closest('.media-item');
    item.find('.media-preview').remove();

    const url=URL.createObjectURL(file);

    if(file.type.startsWith('image')){
        item.append(`
            <img
                src="${url}"
                class="media-preview rounded mt-3"
                style="width:100%;max-height:300px;object-fit:cover;">
        `);
        return;
    }

    if(file.type.startsWith('video')){
        item.append(`
            <video
                controls
                class="media-preview rounded mt-3"
                style="width:100%;max-height:300px;">
                <source src="${url}">
            </video>
        `);
    }
}

function getYoutubeThumbnail(url){
    const id=getYoutubeId(url);
    return id?`https://img.youtube.com/vi/${id}/hqdefault.jpg`:'';
}

function getYoutubeId(url){
    const r=url.match(/(?:youtu\.be\/|youtube\.com\/.*(?:v=|embed\/|shorts\/))([^?&/]+)/);
    return r?r[1]:'';
}


function abrirYoutube(url){
    window.open(url,'_blank');
}

function renderMediaModal(media){
    if(!media.length){
        return '';
    }

    const principal=media[0];
    if(principal.tipo==='imagen'){
        return `
            <div class="modal-media mb-3">
                <img
                    src="${apiUrlBase}/storage/${principal.path}"
                    class="modal-imagen">
            </div>
        `;
    }

    if(principal.tipo==='video'){
        return `
            <div class="modal-media mb-3">
                <video
                    class="modal-video"
                    controls>
                    <source src="${apiUrlBase}/storage/${principal.path}">
                </video>
            </div>
        `;
    }

    if(principal.tipo==='url'){
        const id=getYoutubeId(principal.path);
        return `
            <div class="modal-media modal-media-youtube mb-3">
                <iframe
                    class="modal-youtube"
                    src="https://www.youtube.com/embed/${id}?rel=0"
                    allowfullscreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share">
                </iframe>
            </div>
        `;
    }

    return '';
}
