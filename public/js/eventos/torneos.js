/* public/js/modulos/torneos.js */

/**
 * Carga la información del torneo seleccionado en el Modal
 * @param {Object} torneo - Objeto con los datos del torneo
 */
function cargarInfoTorneo(torneo) {
    // Elementos de texto
    const campos = ['nombre', 'hora', 'lugar', 'ritmo', 'cupos'];
    
    // Asignar título (que suele tener ID diferente o específico)
    document.getElementById('modalTitulo').textContent = torneo.nombre;
    
    // Asignar fecha (si necesitas formatear, hazlo aquí)
    document.getElementById('modalFecha').textContent = torneo.fecha_inicio;
    
    // Asignar ELO requerido
    document.getElementById('modalElo').textContent = torneo.elo_req;

    // Asignar resto de campos simples
    campos.forEach(campo => {
        const elemento = document.getElementById('modal' + capitalize(campo));
        if (elemento && torneo[campo]) {
            elemento.textContent = torneo[campo];
        }
    });

    // Asignar Imagen
    const imgElement = document.getElementById('modalImagen');
    if (imgElement) {
        imgElement.src = torneo.imagen;
        imgElement.alt = torneo.nombre;
    }

    // Asignar ID al input hidden del formulario
    const inputId = document.getElementById('inputTorneoId');
    if (inputId) {
        inputId.value = torneo.id;
    }
}

// Helper para capitalizar primera letra (nombre -> ModalNombre)
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}