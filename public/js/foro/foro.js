const foroApiUrl = `${apiUrl}/home/foro`;
let publicaciones=[];
let foroDetalleActual=null;

document.addEventListener('DOMContentLoaded',()=>{
    bindEvents();
    cargarForo();
});

function bindEvents(){
    $('#btnRecargar').on('click',cargarForo);

    $('#txtBuscar').on('input',function(){
        const texto=$(this).val().toLowerCase().trim();

        if(!texto){
            pintarForo(publicaciones);
            return;
        }

        pintarForo(publicaciones.filter(x=>
            x.titulo.toLowerCase().includes(texto)||
            x.contenido.toLowerCase().includes(texto)||
            `${x.usuario.nombre} ${x.usuario.apellido}`.toLowerCase().includes(texto)
        ));
    });

    $('#foroContainer')
    .on('click','.forum-card',function(e){
        if($(e.target).closest('button,video,a').length){
            return;
        }
        abrirDetalleForo($(this).data('id'));
    })
    .on('click','.btn-reaccion-publicacion',function(e){
        e.stopPropagation();
        reaccionar(
            'publicacion',
            $(this).data('foro'),
            null,
            $(this).data('reaccion'),
            $(this).data('eliminar')
        );

    })
    .on('click','.btn-reaccion-comentario',function(e){
        e.stopPropagation();
        reaccionar(
            'comentario',
            $(this).data('foro'),
            $(this).data('comentario'),
            $(this).data('reaccion'),
            $(this).data('eliminar')
        );
    });

    $('#modalDetalleForo')
    .on('click','.btn-reaccion-publicacion',function(e){
        e.preventDefault();
        e.stopPropagation();
        reaccionar(
            'publicacion',
            $(this).data('foro'),
            null,
            $(this).data('reaccion'),
            $(this).data('eliminar')
        );
    })
    .on('click','.btn-reaccion-comentario',function(e){
        e.preventDefault();
        e.stopPropagation();
        reaccionar(
            'comentario',
            $(this).data('foro'),
            $(this).data('comentario'),
            $(this).data('reaccion'),
            $(this).data('eliminar')
        );
    })
    .on('click','#btnComentar',function(){
        comentarPublicacion(
            $(this).data('foro')
        );
    });

    $('#modalDetalleForo').on('hidden.bs.modal',function(){
        $(this).find('iframe').each(function(){
            $(this).attr('src',$(this).attr('src'));
        });
    });

    $('#modalDetalleForo').on('hidden.bs.modal',function(){
        $(this).find('video').each(function(){
            this.pause();
            this.currentTime=0;

        });

        $(this).find('iframe').each(function(){
            $(this).attr('src',$(this).attr('src'));
        });
    });

    $('#mediaContainer')
    .on('change','.media-archivo',previewArchivo);

    $(document).on('click','.btnEliminarComentario',function(){
        eliminarComentario(
            $(this).data('foro'),
            $(this).data('comentario')
        );
    });

    $('#mediaContainer')
        .on('change','.media-tipo',cambiarTipo)
        .on('click','.btnLimpiarMedia',function(){
            const item=$(this).closest('.media-item');
            item.find('.media-preview').remove();
            item.find('.media-archivo').val('');
            item.find('.media-url').val('');
            item.find('.media-descripcion').val('');
        });

    $('#btnPublicar').on('click',publicarTema);

    $('#btnNuevoTema').on('click',function(){
        if (!requiereAutenticacion()) return;

        if(!$('#mediaContainer .media-item').length){
            agregarMedia();
        }

        bootstrap.Modal.getOrCreateInstance(
            document.getElementById('modalNuevoTema')
        ).show();
    });
}

function cargarForo(){
    $('#foroLoader').show();
    apiRequest({
        url: foroApiUrl,
        type:'GET'
    }).then( response => {
        publicaciones=response;
        pintarForo(publicaciones);
    }).catch( xhr => {
        validarRespuesta(xhr,'No fue posible cargar las publicaciones.');
    }).finally(() => {
        $('#foroLoader').hide();
    });
}

function pintarForo(lista){
    if(!lista.length){
        $('#foroContainer').html(`
            <div class="text-center py-5">
                <i class="bi bi-chat-square-text display-2 text-secondary"></i>
                <h4 class="text-white mt-3">Aún no hay publicaciones</h4>
                <p class="text-muted mb-0">Sé el primero en iniciar una discusión.</p>
            </div>
        `);
        return;
    }

    $('#foroContainer').html(lista.map(renderPublicacion).join(''));
}

function renderPublicacion(foro){
    const usuario=foro.usuario??{};
    const nombre=`${usuario.nombre??''} ${usuario.apellido??''}`.trim();
    const avatar=usuario.imagen_path?`${apiUrlBase}/storage/${usuario.imagen_path}`:`https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=81b64c&color=fff`;

    return `
    <div class="col-xxl-4 col-lg-6 col-12">
        <div class="forum-card" data-id="${foro.id}">
            <div class="foro-header">
                <img src="${avatar}" class="foro-avatar">
                <div class="foro-header-info">
                    <h6>${nombre}</h6>
                    <small>${formatearFecha(foro.fecha)}</small>
                </div>
                <button class="btn btn-link text-secondary p-0">
                    <i class="bi bi-three-dots"></i>
                </button>
            </div>
            <h5 class="foro-titulo">
                ${escapeHtml(foro.titulo)}
            </h5>
            <div class="foro-contenido">
                ${escapeHtml(foro.contenido)}
            </div>
            <div class="foro-media">
                ${renderMedia(foro.media??[])}
            </div>
            <div class="foro-reacciones">
                ${renderReaccionesPublicacion(foro)}
            </div>
            <div class="foro-footer">
                <span><i class="bi bi-chat"></i> ${foro.comentarios?.length??0}</span>
                <span><i class="bi bi-images"></i> ${foro.media?.length??0}</span>
            </div>
            <div class="foro-comentarios">
                ${renderComentarios(foro.comentarios??[])}
            </div>
        </div>
    </div>`;
}

function formatearFecha(fecha){
    const f=new Date(fecha.replace(' ','T'));
    const ahora=new Date();
    const diff=Math.floor((ahora-f)/1000);

    if(diff<60)return'Hace unos segundos';
    if(diff<3600)return`Hace ${Math.floor(diff/60)} min`;
    if(diff<86400)return`Hace ${Math.floor(diff/3600)} horas`;
    if(diff<604800)return`Hace ${Math.floor(diff/86400)} días`;

    return f.toLocaleDateString('es-CO',{
        day:'2-digit',
        month:'short',
        year:'numeric'
    });
}

function avatar(usuario){
    if(!usuario){
        return 'https://ui-avatars.com/api/?name=NA&background=262421&color=ffffff';
    }

    return usuario.imagen_path
        ? `${apiUrlBase}/storage/${usuario.imagen_path}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(`${usuario.nombre ?? ''} ${usuario.apellido ?? ''}`.trim() || 'Usuario')}&background=262421&color=ffffff`;
}

function escapeHtml(texto){
    return $('<div>').text(texto??'').html();
}

function limpiarFormulario(){
    $('#foroId').val('');
    $('#titulo').val('');
    $('#contenido').val('');
    $('#mediaContainer').html('');
    actualizarContadorMedia();
}

function publicarTema(){
    if (!requiereAutenticacion()) return;
    const formData=new FormData();

    formData.append('liga_id', 1);
    formData.append('titulo',$('#titulo').val());
    formData.append('contenido',$('#contenido').val());

    $('.media-item').each(function(i){
        const tipo=$(this).find('.media-tipo').val();

        formData.append(`media[${i}][tipo]`,tipo);
        formData.append(`media[${i}][orden]`,i+1);
        formData.append(`media[${i}][descripcion]`,$(this).find('.media-descripcion').val());

        if(tipo==='url'){
            formData.append(`media[${i}][url]`,$(this).find('.media-url').val());
        }else{
            const archivo=$(this).find('.media-archivo')[0].files[0];
            if(archivo){
                formData.append(`media[${i}][archivo]`,archivo);
            }
        }
    });

    apiRequest({
        url:foroApiUrl,
        type:'POST',
        data:formData,
        processData:false,
        contentType:false
    }).then(()=>{
        bootstrap.Modal.getInstance(document.getElementById('modalNuevoTema')).hide();

        Swal.fire({
            icon:'success',
            title:'Publicación creada',
            text:'Tu publicación fue creada correctamente.',
            background:'#262421',
            color:'#fff',
            confirmButtonColor:'#81b64c'
        });

        limpiarFormulario();
        cargarForo();

    }).catch(xhr=>{
        validarRespuesta(xhr,'No fue posible crear la publicación.');
    });
}

function abrirDetalleForo(id){
    foroDetalleActual=publicaciones.find(x=>x.id==id);

    if(!foroDetalleActual){
        return;
    }

    $('#detalleForoBody').html(
        renderDetalleForo(foroDetalleActual)
    );
    const modal=document.getElementById('modalDetalleForo');
    let instancia=bootstrap.Modal.getInstance(modal);
    if(!instancia){
        instancia=new bootstrap.Modal(modal);
    }

    instancia.show();
}

function renderDetalleForo(foro){
    const usuario=foro.usuario??{};
    const nombre=`${usuario.nombre??''} ${usuario.apellido??''}`.trim();
    const usuarioActual=JSON.parse(localStorage.getItem('user_data')??'{}');

    return `
        <div class="foro-header">
            <img
                class="foro-avatar"
                src="${avatar(usuario)}">
            <div class="foro-header-info">
                <h6>${nombre}</h6>
                <small>${formatearFecha(foro.fecha)}</small>
            </div>
            <button class="btn btn-link text-secondary p-0">
                <i class="bi bi-three-dots"></i>
            </button>
        </div>

        <h2 class="mb-3 fw-bold">
            ${escapeHtml(foro.titulo)}
        </h2>

        <div class="modal-foro-contenido mb-3">
            ${escapeHtml(foro.contenido).replace(/\n/g,'<br>')}
        </div>

        ${renderMediaModal(foro.media??[])}

        <div class="modal-foro-reacciones mb-3">
            ${renderReaccionesPublicacion(foro)}
        </div>

        <div class="modal-foro-footer mb-3">
            <span><i class="bi bi-chat"></i> ${foro.comentarios?.length??0}</span>
            <span><i class="bi bi-images"></i> ${foro.media?.length??0}</span>
        </div>
        <hr>
        <div class="modal-comentarios">
            ${(foro.comentarios??[]).length
                ? foro.comentarios.map(c=>renderComentario(c,foro.id)).join('')
                :
                `<div class="text-center text-muted py-4">
                    No hay comentarios todavía.
                </div>`
            }
        </div>
        <hr>
        <div class="modal-nuevo-comentario">
            <div class="d-flex gap-3">
                <img
                    class="foro-avatar"
                    src="${avatar(JSON.parse(localStorage.getItem('user_data')))}">
                <div class="flex-grow-1">
                    <textarea
                        id="txtNuevoComentario"
                        class="form-control"
                        rows="2"
                        placeholder="Escribe un comentario..."></textarea>
                    <div class="text-end mt-2">
                        <button
                            class="btn btnNuevo"
                            id="btnComentar"
                            data-foro="${foro.id}">
                            <i class="bi bi-send me-2"></i>
                            Comentar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
