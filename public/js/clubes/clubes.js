/* public/js/modulos/clubes.js */

// Variables para modales
let modalAfiliacion;
let modalRegistroClub;

document.addEventListener('DOMContentLoaded', function () {
    // Inicializar modales de Bootstrap
    modalAfiliacion = new bootstrap.Modal(document.getElementById('modalAfiliacion'));
    modalRegistroClub = new bootstrap.Modal(document.getElementById('modalRegistroClub'));
});

/**
 * Abre el modal para que un deportista se afilie
 */
function abrirModalAfiliacion(idClub, nombreClub) {
    document.getElementById('club_id_afiliacion').value = idClub;
    document.getElementById('lblNombreClub').textContent = nombreClub;
    modalAfiliacion.show();
}

/**
 * Simula el envío de la solicitud de afiliación
 */
function enviarSolicitudAfiliacion() {
    // Aquí iría la validación de archivos y el AJAX real con FormData
    
    // Simulación de éxito
    modalAfiliacion.hide();
    
    Swal.fire({
        title: '¡Solicitud Enviada!',
        text: 'El presidente del club revisará tus documentos. Te notificaremos cuando seas aceptado.',
        icon: 'success',
        confirmButtonColor: '#81b64c',
        background: '#262421',
        color: '#fff'
    });
}

/**
 * Abre el modal para registrar un nuevo club
 */
function abrirModalRegistroClub() {
    // Limpiar formulario si es necesario
    document.getElementById('formRegistroClub').reset();
    modalRegistroClub.show();
}

/**
 * Simula el envío del registro de nuevo club
 */
function enviarRegistroClub() {
    // Validar que se haya subido el PDF de reconocimiento (Simulado)
    
    modalRegistroClub.hide();

    Swal.fire({
        title: '¡Registro en Proceso!',
        text: 'Hemos recibido la documentación. La Liga validará el Reconocimiento Deportivo y habilitará tu club en la plataforma.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3498db',
        background: '#262421',
        color: '#fff'
    });
}