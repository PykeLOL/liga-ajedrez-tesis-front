<nav class="navbar navbar-expand-lg navbar-dark bg-dark-chess py-3 px-4 border-bottom border-secondary shadow-sm sticky-top" style="z-index: 1020;">
    <div class="container-fluid">
        
    <div class="d-flex align-items-center">
        <button
            id="menu-toggle"
            type="button"
            class="btn btn-link p-0 border-0 text-white me-3"
            aria-label="Abrir/cerrar menú"
            aria-controls="sidebar-wrapper">
            <i class="bi bi-list fs-3"></i>
        </button>

        <h2 class="fs-5 m-0 fw-bold text-white">
         @yield('header_title', 'Liga de Ajedrez')
        </h2>
    </div>


        <div class="ms-auto d-flex align-items-center gap-3">
            @guest
                <a href="{{ route('login') }}" class="btn btn-chess px-4 py-2">
                    <i class="bi bi-box-arrow-in-right"></i> Ingresar
                </a>

                <a href="{{ route('registrarse') }}" class="btn btn-chess-secondary px-4 py-2">
                    <i class="bi bi-person-plus-fill"></i> Registrarse
                </a>
            @else
                <div class="dropdown">
                    <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="https://ui-avatars.com/api/?name={{ Auth::user()->name }}&background=81b64c&color=fff" alt="User" width="32" height="32" class="rounded-circle me-2">
                        <span class="fw-semibold d-none d-sm-inline">{{ Auth::user()->name }}</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow" aria-labelledby="dropdownUser1">
                        <li><a class="dropdown-item" href="#">Mi Perfil</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                            <form action="{{ route('logout') }}" method="POST">
                                @csrf
                                <button type="submit" class="dropdown-item text-danger">
                                    <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                                </button>
                            </form>
                        </li>
                    </ul>
                </div>
            @endguest
        </div>

    </div>
</nav> 