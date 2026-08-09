function renderComentarios(comentarios){
    if(!comentarios.length)return'';

    return`
    <div class="border-top border-secondary mt-4 pt-3">

        ${comentarios.slice(0,2).map(c=>`
            <div class="mb-3">
                <div class="fw-semibold text-chess-green">${c.usuario.nombre} ${c.usuario.apellido}</div>
                <div class="text-light">${c.comentario}</div>
            </div>
        `).join('')}

        ${comentarios.length>2?`
            <a href="#" class="text-chess-green text-decoration-none fw-semibold">
                Ver los ${comentarios.length} comentarios →
            </a>
        `:''}

    </div>`;
}

function renderComentario(c, foroId){
    const usuarioActual = getUsuarioActual();

    return `
        <div class="modal-comentario">
            <img
                class="foro-avatar"
                src="${avatar(c.usuario)}">
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center">
                    <strong>${c.usuario.nombre} ${c.usuario.apellido}</strong>
                    ${usuarioActual && c.usuario_id === usuarioActual.id ? `
                        <button
                            class="btn btn-sm btn-link text-danger btnEliminarComentario"
                            data-foro="${foroId}"
                            data-comentario="${c.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    ` : ''}
                </div>
                <small class="text-muted d-block mb-1">
                    ${formatearFecha(c.created_at)}
                </small>
                <div>
                    ${escapeHtml(c.comentario)}
                </div>
                <div class="foro-comentario-reacciones mt-2">
                    ${renderReaccionesComentario(c)}
                </div>
            </div>
        </div>
    `;
}

async function comentarPublicacion(idPublicacion){
    if (!requiereAutenticacion()) return;
    const comentario=$('#txtNuevoComentario').val().trim();
    if(!comentario){
        Swal.fire({
            icon:'warning',
            title:'Comentario vacío',
            text:'Escribe un comentario.',
            background:'#262421',
            color:'#fff',
            confirmButtonColor:'#81b64c'
        });

        return;
    }

    const formData=new FormData();
    formData.append('comentario',comentario);
    try{
        const response=await apiRequest({
            url:`${foroApiUrl}/comentar/${idPublicacion}`,
            type:'POST',
            data:formData,
            processData:false,
            contentType:false
        });

        response.comentario.reacciones=[];
        foroDetalleActual.comentarios.push(response.comentario);

        $('.modal-comentarios').append(
            renderComentario(response.comentario,idPublicacion)
        );

        $('#txtNuevoComentario').val('');
        $('.modal-foro-footer span:first').html(`
            <i class="bi bi-chat"></i>
            ${foroDetalleActual.comentarios.length}
        `);
    }catch(xhr){
        validarRespuesta(
            xhr,
            'No fue posible agregar el comentario.'
        );
    }
}

async function eliminarComentario(idPublicacion,idComentario){
    const result=await Swal.fire({
        title:'¿Eliminar comentario?',
        text:'Esta acción no se puede deshacer.',
        icon:'warning',
        background:'#262421',
        color:'#fff',
        showCancelButton:true,
        confirmButtonColor:'#dc3545',
        cancelButtonColor:'#6c757d',
        confirmButtonText:'Eliminar'
    });
    if(!result.isConfirmed){
        return;
    }
    try{
        await apiRequest({
            url:`${foroApiUrl}/comentar/${idPublicacion}/${idComentario}`,
            type:'DELETE'
        });
        const response=await apiRequest({
            url:foroApiUrl,
            type:'GET'
        });
        publicaciones=response;
        $('#detalleForoBody').html(
            renderDetalleForo(
                publicaciones.find(x=>x.id==idPublicacion)
            )
        );
    }catch(xhr){
        validarRespuesta(xhr,'No fue posible eliminar el comentario.');
    }
}
