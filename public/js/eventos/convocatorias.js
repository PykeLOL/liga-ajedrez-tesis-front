/* public/js/modulos/convocatorias.js */

/**
 * Función para confirmar el cupo si el usuario clasificó
 */
function confirmarCupo(idProceso, titulo) {
    Swal.fire({
        title: '¿Aceptar cupo oficial?',
        html: `Estás a punto de confirmar tu participación en: <br><strong>${titulo}</strong>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#81b64c', // Verde Chess
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, confirmo mi asistencia',
        cancelButtonText: 'Cancelar',
        background: '#262421',
        color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            // Aquí tu compañero haría: fetch('/convocatorias/'+idProceso+'/confirmar')
            
            Swal.fire({
                title: '¡Selección Confirmada!',
                text: 'Has oficializado tu participación. La liga se pondrá en contacto contigo.',
                icon: 'success',
                confirmButtonColor: '#81b64c',
                background: '#262421',
                color: '#fff'
            });
        }
    });
}

/**
 * Función para inscribirse al torneo clasificatorio (Fase 1)
 */
function inscribirTorneoClasificatorio(idProceso, titulo) {
    Swal.fire({
        title: 'Inscripción a Clasificatorio',
        text: `¿Deseas inscribirte al torneo para disputar un cupo en ${titulo}?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3498db', // Azul informativo
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Inscribirme ahora',
        background: '#262421',
        color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            // Aquí backend: fetch('/convocatorias/'+idProceso+'/inscribir-torneo')

            Swal.fire({
                title: '¡Inscrito!',
                text: 'Te notificaremos cuando se publiquen los emparejamientos de la primera ronda.',
                icon: 'success',
                confirmButtonColor: '#81b64c',
                background: '#262421',
                color: '#fff'
            });
        }
    });
}

/**
 * Función para ver ranking completo (si no clasificó)
 */
function verRankingCompleto(idProceso) {
    Swal.fire({
        title: 'Ranking Completo',
        text: 'Esta funcionalidad cargará la tabla completa en una ventana modal.',
        icon: 'info',
        background: '#262421',
        color: '#fff',
        confirmButtonColor: '#81b64c'
    });
}