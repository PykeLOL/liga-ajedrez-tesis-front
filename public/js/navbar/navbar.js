document.addEventListener('DOMContentLoaded', function () {
    const userData = localStorage.getItem('user_data');
    const guestButtons = document.getElementById('guestButtons');
    const userDropdown = document.getElementById('userDropdownContainer');

    if (userData) {
        try {
            const user = JSON.parse(userData);

            guestButtons.classList.add('d-none');
            userDropdown.classList.remove('d-none');

            const nombre = user.nombre || 'Usuario';
            const apellido = user.apellido || '';
            const email = user.email || '';
            const imagen_path = user.imagen_path || '';

            document.getElementById('userNamePortal').textContent = nombre;

            document.getElementById('userFullNamePortal').textContent = nombre + ' ' + apellido;
            document.getElementById('userEmailPortal').textContent = email;

            if(imagen_path) {
                const avatarEl = document.getElementById('userAvatarPortal');
                avatarEl.textContent = '';
                const img = document.createElement('img');
                img.src = `${apiUrlBase}/storage/${imagen_path}`;
                img.alt = 'Avatar';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.classList.add('rounded-circle');
                avatarEl.appendChild(img);
            } else {
                document.getElementById('userAvatarPortal').textContent =
                    nombre.charAt(0).toUpperCase();
            }

        } catch (e) {
            console.error('Error leyendo user_data:', e);
        }
    }

    const logoutBtn = document.getElementById('logoutPortalBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function () {
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
                $.ajax({
                    url: `${apiUrl}/logout`,
                    type: "POST",
                    xhrFields: { withCredentials: true },
                    success: function(resp) {
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
                        localStorage.clear();
                        document.cookie = "jwt=; Max-Age=0; path=/";
                        window.location.href = '/login';
                    },
                    error: function(xhr) {
                        localStorage.clear();
                        document.cookie = "jwt=; Max-Age=0; path=/";
                        window.location.href = '/login';
                    }
                });
                window.location.href = "{{ route('login') }}";
            }
        });
    }
});
