<nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3"
     style="padding-left: 240px; z-index: 1030;">
    <a class="navbar-brand fw-bold" href="{{ route('admin.index') }}">
        <i data-lucide="compass" class="me-2"></i> <span>Panel Administrativo</span>
    </a>

    <div class="mx-auto"></div>

    <div class="d-flex align-items-center text-white">
        <a href="{{ route('home') }}" target="_blank" id="homeBtn"
           class="btn btn-outline-info btn-sm me-3 d-flex align-items-center gap-1">
            <i class="bi bi-box-arrow-up-right"></i> Página Web
        </a>
        <a href="/admin/perfil" id="userName"
           class="me-3 fw-semibold text-decoration-none text-white">
            Usuario
        </a>
        <button id="logoutBtn" class="btn btn-outline-light btn-sm">Cerrar Sesión</button>
    </div>
</nav>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const logoutBtn = document.getElementById('logoutBtn');
        const userNameEl = document.getElementById('userName');
        const userData = localStorage.getItem('user_data');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                userNameEl.textContent = user.nombre || 'Usuario';
            } catch (error) {
                console.error('Error al leer user_data:', error);
                userNameEl.textContent = 'Usuario';
            }
        } else {
            userNameEl.textContent = 'Invitado';
            userNameEl.removeAttribute('href');
            userNameEl.style.pointerEvents = 'none';
            userNameEl.style.opacity = '0.6';
        }

        logoutBtn.addEventListener('click', async () => {
            const result = await Swal.fire({
                title: '¿Cerrar sesión?',
                text: 'Tu sesión actual se cerrará.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, salir',
                cancelButtonText: 'Cancelar',
            });
            if (result.isConfirmed) {
                localStorage.clear();
                await Swal.fire({
                    icon: 'success',
                    title: 'Sesión cerrada',
                    timer: 1000,
                    showConfirmButton: false
                });

                window.location.href = '/login';
            }
        });
    });
</script>
