<nav class="navbar navbar-expand-lg navbar-dark bg-dark-chess py-3 px-3 px-md-4 border-bottom border-secondary shadow-sm sticky-top" style="z-index: 1020;">
    <div class="container-fluid">

        {{-- IZQUIERDA --}}
        <div class="d-flex align-items-center">

            <button
                id="menu-toggle"
                type="button"
                class="btn btn-link p-0 border-0 text-white me-3"
                aria-label="Abrir/cerrar menú">

                <i class="bi bi-list fs-3"></i>
            </button>

            <h2 class="fs-6 fs-md-5 m-0 fw-bold text-white text-truncate" style="max-width: 200px;">
                @yield('header_title', 'Liga de Ajedrez')
            </h2>
        </div>

        {{-- DERECHA --}}
        <div class="ms-auto d-flex align-items-center gap-2 gap-md-3">

            {{-- BOTONES INVITADO --}}
            <div id="guestButtons" class="d-flex align-items-center gap-2 gap-md-3">

                <a href="{{ route('login') }}"
                   class="btn btn-chess px-3 px-md-4 py-2"
                   title="Ingresar">

                    <i class="bi bi-box-arrow-in-right"></i>

                    <span class="d-none d-md-inline ms-1">
                        Ingresar
                    </span>
                </a>

                <a href="{{ route('registrarse') }}"
                   class="btn btn-chess-secondary px-3 px-md-4 py-2"
                   title="Registrarse">

                    <i class="bi bi-person-plus-fill"></i>

                    <span class="d-none d-md-inline ms-1">
                        Registrarse
                    </span>
                </a>

            </div>

            {{-- USUARIO LOGUEADO --}}
            <div id="userDropdownContainer" class="dropdown d-none">

                <a href="#"
                   class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                   id="dropdownUserPortal"
                   data-bs-toggle="dropdown"
                   aria-expanded="false">

                    {{-- AVATAR --}}
                    <div id="userAvatarPortal"
                         class="rounded-circle d-flex align-items-center justify-content-center fw-bold me-2"
                         style="
                            width: 45px;
                            height: 45px;
                            background-color: #81b64c;
                            color: white;
                            font-size: 14px;
                         ">
                        U
                    </div>

                    {{-- NOMBRE --}}
                    <span id="userNamePortal"
                          class="fw-semibold d-none d-md-inline">
                        Usuario
                    </span>
                </a>

                {{-- DROPDOWN --}}
                <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow border border-secondary"
                    aria-labelledby="dropdownUserPortal"
                    style="background-color: #262421; min-width: 220px;">

                    <li class="px-3 py-2 border-bottom border-secondary">

                        <div id="userFullNamePortal" class="fw-bold text-white">
                            Usuario
                        </div>

                        <small id="userEmailPortal" class="text-light opacity-75">
                            correo@email.com
                        </small>
                    </li>

                    <li>
                        <a class="dropdown-item text-white hover-green" href="{{ route('perfil') }}">
                            <i class="bi bi-person-circle me-2"></i>
                            Mi Perfil
                        </a>
                    </li>

                    <li>
                        <hr class="dropdown-divider bg-secondary">
                    </li>

                    <li>
                        <button id="logoutPortalBtn" class="dropdown-item text-danger">
                            <i class="bi bi-box-arrow-right me-2"></i>
                            Cerrar Sesión
                        </button>
                    </li>

                </ul>
            </div>

        </div>
    </div>
</nav>

<style>
    .dropdown-item.hover-green:hover {
        background-color: #81b64c !important;
        color: white !important;
    }
</style>

<script>
    document.addEventListener('DOMContentLoaded', function () {

        const userData = localStorage.getItem('user_data');

        const guestButtons = document.getElementById('guestButtons');
        const userDropdown = document.getElementById('userDropdownContainer');

        if (userData) {

            try {

                const user = JSON.parse(userData);

                // Mostrar dropdown usuario
                guestButtons.classList.add('d-none');
                userDropdown.classList.remove('d-none');

                // Datos
                const nombre = user.nombre || 'Usuario';
                const apellido = user.apellido || '';
                const email = user.email || '';
                const imagen_path = user.imagen_path || '';
                const apiUrlBase = "{{ env('API_URL') }}".replace('/api', '');

                // Navbar
                document.getElementById('userNamePortal').textContent = nombre;

                // Dropdown
                document.getElementById('userFullNamePortal').textContent = nombre + ' ' + apellido;
                document.getElementById('userEmailPortal').textContent = email;

                console.log(user);
                console.log(imagen_path);
                // Avatar
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

        // LOGOUT
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
                        url: "{{ env('API_URL') }}/logout",
                        type: "POST",
                        xhrFields: { withCredentials: true }, // envía cookies
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
                            window.location.href = '/login';
                        },
                        error: function(xhr) {
                            localStorage.clear();
                            window.location.href = '/login';
                        }
                    });
                    window.location.href = "{{ route('login') }}";
                }
            });
        }
    });
</script>
