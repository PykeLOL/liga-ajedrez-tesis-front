/* public/js/modulos/reuniones.js */

function toggleAsistencia(btn, idReunion) {
    // Simulamos una petición AJAX
    const icon = btn.querySelector('i');
    const text = btn.querySelector('span');
    
    // Si ya estaba confirmado (clase btn-success), lo cancelamos
    if (btn.classList.contains('btn-success')) {
        // Volver a estado normal
        btn.classList.remove('btn-success');
        btn.classList.add('btn-chess-secondary');
        icon.classList.remove('bi-check-circle-fill');
        icon.classList.add('bi-hand-thumbs-up');
        text.innerText = 'Asistiré';
        
        // Feedback visual (Toast o alerta pequeña)
        // Swal.fire(...) si quisieras
    } else {
        // Confirmar asistencia
        btn.classList.remove('btn-chess-secondary');
        btn.classList.add('btn-success'); // Verde bootstrap o tu verde chess
        icon.classList.remove('bi-hand-thumbs-up');
        icon.classList.add('bi-check-circle-fill');
        text.innerText = 'Asistiré (Confirmado)';
        
        // Aquí tu compañero pondría el fetch('/reuniones/'+id+'/asistir')
    }
}