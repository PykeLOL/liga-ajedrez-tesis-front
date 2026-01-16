// Script para el Sidebar y Navbar
window.addEventListener('DOMContentLoaded', event => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            // Alternar clase en el body
            document.body.classList.toggle('sb-sidenav-toggled');
            
            // Guardar estado en localStorage (opcional, para recordar si estaba abierto/cerrado)
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
});