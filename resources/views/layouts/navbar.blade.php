<div class="ms-auto d-flex align-items-center gap-2 gap-md-3">
    <div id="guestButtons" class="d-flex align-items-center gap-2 gap-md-3">
        <a href="{{ route('login') }}" class="btn btn-chess px-3 px-md-4 py-2" title="Ingresar">
            <i class="bi bi-box-arrow-in-right"></i>
            <span class="d-none d-md-inline ms-1">Ingresar</span>
        </a>
        <a href="{{ route('registrarse') }}" class="btn btn-chess-secondary px-3 px-md-4 py-2" title="Registrarse">
            <i class="bi bi-person-plus-fill"></i>
            <span class="d-none d-md-inline ms-1">Registrarse</span>
        </a>
    </div>
    <div id="userDropdownContainer" class="d-none d-flex align-items-center gap-3">
        <div class="dropdown">
            <button
                class="btn btn-link text-white p-0 border-0 position-relative"
                id="notificacionesDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                <i data-lucide="bell" style="width:22px;height:22px;"></i>
                <span
                    id="contadorNotificaciones"
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none">
                    0
                </span>
            </button>
            <div
                id="listaNotificaciones"
                class="dropdown-menu dropdown-menu-end shadow border-0 p-0"
                style="width:380px;background:#262421;">
                <div class="p-3 border-bottom border-secondary">
                    <strong class="text-white">Notificaciones</strong>
                </div>
                <div id="contenidoNotificaciones">
                    <div class="text-center text-secondary py-4">
                        Cargando...
                    </div>
                </div>
            </div>
        </div>
        <div class="dropdown">
            <a
                href="#"
                class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                id="dropdownUserPortal"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                <div
                    id="userAvatarPortal"
                    class="rounded-circle d-flex align-items-center justify-content-center fw-bold me-2"
                    style="width:45px;height:45px;background:#81b64c;color:#fff;font-size:14px;">
                    U
                </div>
                <span
                    id="userNamePortal"
                    class="fw-semibold d-none d-md-inline">
                    Usuario
                </span>
            </a>
            <ul
                class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow border border-secondary"
                aria-labelledby="dropdownUserPortal"
                style="background:#262421;min-width:220px;">
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
