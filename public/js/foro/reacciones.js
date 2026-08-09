function renderReaccionesPublicacion(foro){
    const usuarioActual = JSON.parse(localStorage.getItem('user_data') || 'null');
    const reacciones = foro.reacciones ?? [];

    const likes = reacciones.filter(r => r.reaccion?.nombre === 'Me gusta');
    const dislikes = reacciones.filter(r => r.reaccion?.nombre === 'No me gusta');

    const usuarioLike = usuarioActual
        ? likes.some(r => r.usuario_id === usuarioActual.id)
        : false;

    const usuarioDislike = usuarioActual
        ? dislikes.some(r => r.usuario_id === usuarioActual.id)
        : false;

    return `
        <button
            class="btn-reaccion btn-reaccion-publicacion like ${usuarioLike ? 'activo' : ''}"
            data-foro="${foro.id}"
            data-reaccion="1"
            data-eliminar="${usuarioLike}">
            <i class="bi bi-hand-thumbs-up-fill"></i>
            <span>${likes.length}</span>
        </button>
        <button
            class="btn-reaccion btn-reaccion-publicacion dislike ${usuarioDislike ? 'activo' : ''}"
            data-foro="${foro.id}"
            data-reaccion="2"
            data-eliminar="${usuarioDislike}">
            <i class="bi bi-hand-thumbs-down-fill"></i>
            <span>${dislikes.length}</span>
        </button>
    `;
}

function renderReaccionesComentario(comentario){
    const reacciones=comentario.reacciones??[];
    const usuario=JSON.parse(localStorage.getItem('user_data')??'{}');

    const likes=reacciones.filter(r=>r.reaccion?.nombre==='Me gusta');
    const dislikes=reacciones.filter(r=>r.reaccion?.nombre==='No me gusta');

    const usuarioLike=likes.some(r=>r.usuario_id===usuario.id);
    const usuarioDislike=dislikes.some(r=>r.usuario_id===usuario.id);

    return `
        <button
            class="btn-reaccion btn-reaccion-comentario like ${usuarioLike?'activo':''}"
            data-foro="${comentario.publicacion_id}"
            data-comentario="${comentario.id}"
            data-reaccion="1"
            data-eliminar="${usuarioLike}">
            <i class="bi bi-hand-thumbs-up-fill"></i>
            <span>${likes.length}</span>
        </button>
        <button
            class="btn-reaccion btn-reaccion-comentario dislike ${usuarioDislike?'activo':''}"
            data-foro="${comentario.publicacion_id}"
            data-comentario="${comentario.id}"
            data-reaccion="2"
            data-eliminar="${usuarioDislike}">
            <i class="bi bi-hand-thumbs-down-fill"></i>
            <span>${dislikes.length}</span>
        </button>
    `;
}

async function reaccionar (tipo, idPublicacion, idComentario, reaccionId, eliminar = false) {
    if (!requiereAutenticacion()) return;
    const url=tipo==='publicacion'
        ?`${foroApiUrl}/reaccion/${idPublicacion}`
        :`${foroApiUrl}/reaccion/${idPublicacion}/${idComentario}`;

    const method=eliminar?'DELETE':'POST';

    const formData=new FormData();
    formData.append('reaccion_id',reaccionId);

    try{
        await apiRequest({
            url,
            type:method,
            data:formData,
            processData:false,
            contentType:false
        });

        const modalAbierto=$('#modalDetalleForo').hasClass('show');
        if(modalAbierto){
            if(tipo==='publicacion'){
                actualizarReaccionPublicacion(
                    foroDetalleActual,
                    reaccionId,
                    eliminar
                );

                const indice=publicaciones.findIndex(x=>x.id===foroDetalleActual.id);
                if(indice!==-1){
                    publicaciones[indice]=foroDetalleActual;
                }

                $('.modal-foro-reacciones').html(
                    renderReaccionesPublicacion(foroDetalleActual)
                );
            }else{
                const comentario=foroDetalleActual.comentarios.find(
                    x=>x.id==idComentario
                );
                if(comentario){
                    actualizarReaccionComentario(
                        comentario,
                        reaccionId,
                        eliminar
                    );
                    $(`.btn-reaccion-comentario[data-comentario="${idComentario}"]`)
                        .closest('.foro-comentario-reacciones')
                        .html(
                            renderReaccionesComentario(comentario)
                        );
                }
            }
        }else{
            cargarForo();
        }
    }catch(xhr){
        validarRespuesta(xhr,'No fue posible registrar la reacción.');
    }
}

function actualizarReaccionPublicacion(foro,reaccionId,eliminar){
    const usuario=JSON.parse(localStorage.getItem('user_data')??'{}');
    foro.reacciones=foro.reacciones??[];
    foro.reacciones=foro.reacciones.filter(r=>r.usuario_id!==usuario.id);
    if(!eliminar){
        foro.reacciones.push({
            usuario_id:usuario.id,
            reaccion:{
                id:reaccionId,
                nombre:reaccionId===1?'Me gusta':'No me gusta'
            }
        });
    }
}

function actualizarReaccionComentario(comentario,reaccionId,eliminar){
    const usuario=JSON.parse(localStorage.getItem('user_data')??'{}');
    comentario.reacciones=comentario.reacciones??[];
    comentario.reacciones=comentario.reacciones.filter(r=>r.usuario_id!==usuario.id);
    if(!eliminar){
        comentario.reacciones.push({
            usuario_id:usuario.id,
            reaccion:{
                id:reaccionId,
                nombre:reaccionId===1?'Me gusta':'No me gusta'
            }
        });
    }
}
