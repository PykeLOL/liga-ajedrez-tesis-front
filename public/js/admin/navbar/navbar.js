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

document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    const userNameEl = document.getElementById('userName');
    const userAvatarEl = document.getElementById('userAvatar'); // Referencia al avatar

    const userData = localStorage.getItem('user_data');

    if (userData) {
        try {
            const user = JSON.parse(userData);
            userNameEl.textContent = user.nombre || 'Usuario';

            if (user.imagen_path) {
                userAvatarEl.innerHTML = `
                    <img
                        src="${apiUrlBase}/storage/${user.imagen_path}"
                        alt="${user.nombre}"
                        class="w-100 h-100 rounded-circle"
                        style="object-fit: cover;"
                    >
                `;
            } else {
                userAvatarEl.textContent =
                    (user.nombre || 'A').charAt(0).toUpperCase();
            }

        } catch (error) {
            console.error('Error al leer user_data:', error);
            userNameEl.textContent = 'Usuario';
        }
    } else {
        userNameEl.textContent = 'Invitado';
        const profileLink = document.getElementById('userDropdown');
        if(profileLink) {
            profileLink.removeAttribute('href');
            profileLink.style.pointerEvents = 'none';
            profileLink.style.opacity = '0.6';
        }
    }

    logoutBtn.addEventListener('click', async () => {
        const result = await Swal.fire({
            title: '¿Cerrar sesión?',
            text: 'Tu sesión actual se cerrará.',
            icon: 'warning',
            background: '#262421',
            color: '#fff',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        });

        if (result.isConfirmed) {
            localStorage.clear();
            $.ajax({
                url: `${apiUrl}/logout`,
                type: "POST",
                xhrFields: { withCredentials: true },
                success: function(resp) {
                    localStorage.clear();
                    document.cookie = "jwt=; Max-Age=0; path=/";
                    Swal.fire({
                        icon: 'success',
                        title: 'Sesión cerrada',
                        timer: 1000,
                        showConfirmButton: false,
                        background: '#262421',
                        color: '#fff'
                    }).then(() => {
                        window.location.href = '/login';
                    });
                },
                error: function(xhr) {
                    localStorage.clear();
                    document.cookie = "jwt=; Max-Age=0; path=/";
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo cerrar la sesión. Intenta de nuevo.',
                        background: '#262421',
                        color: '#fff'
                    });
                }
            });
        }
    });
});
