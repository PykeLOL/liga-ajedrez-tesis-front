/* public/js/modulos/ranking.js */

/**
 * Función para redirigir al perfil del jugador
 * @param {string} url - La ruta a la vista 'mielo'
 */
function irAPerfil(url) {
    // Redirección simple
    window.location.href = url;
}

// Lógica del buscador en tiempo real (Filtra la tabla sin recargar)
document.getElementById('buscadorJugador').addEventListener('keyup', function() {
    let filtro = this.value.toLowerCase();
    let filas = document.querySelectorAll('#tablaJugadores tr');

    filas.forEach(fila => {
        let nombre = fila.querySelector('.player-name').textContent.toLowerCase();
        let club = fila.querySelector('.player-club')?.textContent.toLowerCase() || '';
        
        if (nombre.includes(filtro) || club.includes(filtro)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
});