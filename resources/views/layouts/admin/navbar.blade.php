<nav class="navbar-chess">
    <div class="container-fluid d-flex align-items-center justify-content-between h-100 px-3">
        <button id="sidebarToggle" class="btn-icon-chess">
            <i data-lucide="menu"></i>
        </button>
        <div class="d-flex align-items-center gap-3">
            <a href="{{ route('home') }}" target="_blank" class="btn-icon-chess" title="Ir a la Página Web">
                <i data-lucide="external-link"></i>
            </a>
            <div class="vr bg-secondary opacity-25 mx-1" style="height: 24px;"></div>
            <div class="dropdown">
                <button
                    class="btn-icon-chess position-relative"
                    id="notificacionesDropdown"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <i data-lucide="bell"></i>
                    <span
                        id="contadorNotificaciones"
                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none">
                        0
                    </span>
                </button>
                <div
                    id="listaNotificaciones"
                    class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 p-0"
                    style="width: 360px; background-color:#262421;">
                    <div class="p-3 border-bottom border-secondary">
                        <strong class="text-white">
                            Notificaciones
                        </strong>
                    </div>
                    <div id="contenidoNotificaciones">
                        <div class="text-center text-secondary py-4">
                            Cargando...
                        </div>
                    </div>
                </div>
            </div>

            <div class="dropdown">
                <a href="#"
                   class="user-profile-link d-flex align-items-center gap-2 text-decoration-none dropdown-toggle"
                   id="userDropdown"
                   data-bs-toggle="dropdown"
                   aria-expanded="false">
                    <div id="userAvatar" class="avatar-circle">
                        U
                    </div>
                    <span id="userName"
                          class="d-none d-sm-block fw-semibold text-white small">
                        Cargando...
                    </span>
                </a>
                <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg border-0 mt-2 p-2"
                    aria-labelledby="userDropdown"
                    style="background-color: #262421; min-width: 200px;">
                    <li>
                        <a class="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2"
                           href="{{ route('admin.perfil') }}">
                            <i data-lucide="user" class="icon-sm"></i>
                            Mi Perfil
                        </a>
                    </li>
                    <li>
                        <hr class="dropdown-divider border-secondary opacity-25">
                    </li>
                    <li>
                        <button id="logoutBtn"
                                class="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-danger">
                            <i data-lucide="log-out" class="icon-sm"></i>
                            Cerrar Sesión
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</nav>
