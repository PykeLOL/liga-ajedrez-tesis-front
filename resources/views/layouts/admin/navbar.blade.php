<nav class="navbar-chess">
    <div class="container-fluid d-flex align-items-center justify-content-between h-100 px-3">

        {{-- 1. BOTÓN HAMBURGUESA (Minimizar Sidebar) --}}
        <button id="sidebarToggle" class="btn-icon-chess">
            <i data-lucide="menu"></i>
        </button>

        {{-- 2. ZONA DERECHA (Web, Perfil, Salir) --}}
        <div class="d-flex align-items-center gap-3">

            {{-- Botón Ir a la Web --}}
            <a href="{{ route('home') }}" target="_blank" class="btn-icon-chess" title="Ir a la Página Web">
                <i data-lucide="external-link"></i>
            </a>

            <div class="vr bg-secondary opacity-25 mx-1" style="height: 24px;"></div>

            {{-- 3. DROPDOWN DE USUARIO --}}
            <div class="dropdown">
                <a href="#" class="user-profile-link d-flex align-items-center gap-2 text-decoration-none dropdown-toggle"
                   id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">

                    {{-- Avatar Circular --}}
                    <div id="userAvatar" class="avatar-circle">U</div>

                    {{-- Nombre de Usuario (ID="userName" para tu script) --}}
                    <span id="userName" class="d-none d-sm-block fw-semibold text-white small">
                        Cargando...
                    </span>
                </a>

                {{-- Menú Desplegable --}}
                <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg border-0 mt-2 p-2"
                    aria-labelledby="userDropdown" style="background-color: #262421; min-width: 200px;">

                    <li>
                        <a class="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2" href="{{ route('admin.perfil') }}">
                            <i data-lucide="user" class="icon-sm"></i> Mi Perfil
                        </a>
                    </li>

                    <li><hr class="dropdown-divider border-secondary opacity-25"></li>

                    <li>
                        {{-- Botón Cerrar Sesión (ID="logoutBtn" para tu script) --}}
                        <button id="logoutBtn" class="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-danger">
                            <i data-lucide="log-out" class="icon-sm"></i> Cerrar Sesión
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</nav>

<script>
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

                // Actualizar Nombre
                userNameEl.textContent = user.nombre || 'Usuario';

                // Actualizar Avatar
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
            // Si es invitado, deshabilitamos el link de perfil
            const profileLink = document.getElementById('userDropdown');
            if(profileLink) {
                profileLink.removeAttribute('href');
                profileLink.style.pointerEvents = 'none';
                profileLink.style.opacity = '0.6';
            }
        }

        // Lógica de Logout Original
        logoutBtn.addEventListener('click', async () => {
            const result = await Swal.fire({
                title: '¿Cerrar sesión?',
                text: 'Tu sesión actual se cerrará.',
                icon: 'warning',
                background: '#262421', // Fondo oscuro estilo Chess
                color: '#fff',         // Texto blanco
                showCancelButton: true,
                confirmButtonText: 'Sí, salir',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6'
            });

            if (result.isConfirmed) {
                localStorage.clear();
                $.ajax({
                    url: "{{ env('API_URL') }}/logout",
                    type: "POST",
                    xhrFields: { withCredentials: true }, // envía cookies
                    success: function(resp) {
                        localStorage.clear();
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
</script>
