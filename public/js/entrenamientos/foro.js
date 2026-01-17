document.addEventListener('DOMContentLoaded', function() {
    
    // Simulación de Publicar Tema
    const btnPublicar = document.getElementById('btnPublicar');
    
    if(btnPublicar){
        btnPublicar.addEventListener('click', function() {
            // Cerramos el modal
            const modalEl = document.getElementById('modalNuevoTema');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();

            // Mostramos alerta de éxito
            Swal.fire({
                title: '¡Tema Publicado!',
                text: 'Tu discusión ha sido creada exitosamente.',
                icon: 'success',
                background: '#262421',
                color: '#fff',
                confirmButtonColor: '#81b64c',
                confirmButtonText: 'Genial'
            }).then(() => {
                // Aquí harías el submit real del formulario o recargarías la página
                // document.getElementById('formNuevoTema').submit();
                location.reload(); 
            });
        });
    }

    // Efecto click en toda la tarjeta (para no obligar a dar click solo en el título)
    const cards = document.querySelectorAll('.forum-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Si no le dio click a un botón específico, redirigir
            // Aquí pondrías la ruta al detalle del tema
            // window.location.href = 'ruta/al/detalle';
            console.log("Ir al detalle del tema...");
        });
    });
});