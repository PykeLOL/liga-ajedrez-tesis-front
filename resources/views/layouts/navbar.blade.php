<nav class="navbar navbar-expand-lg navbar-dark bg-dark-chess py-3 px-3 px-md-4 border-bottom border-secondary shadow-sm sticky-top" style="z-index: 1020;">
    <div class="container-fluid">
        
        {{-- LADO IZQUIERDO: Botón Menú + Título --}}
        <div class="d-flex align-items-center">
            <button
                id="menu-toggle"
                type="button"
                class="btn btn-link p-0 border-0 text-white me-3"
                aria-label="Abrir/cerrar menú"
                aria-controls="sidebar-wrapper">
                <i class="bi bi-list fs-3"></i>
            </button>

            {{-- Título: Se reduce un poco la fuente en móviles --}}
            <h2 class="fs-6 fs-md-5 m-0 fw-bold text-white text-truncate" style="max-width: 200px;">
             @yield('header_title', 'Liga de Ajedrez')
            </h2>
        </div>

        {{-- LADO DERECHO: Botones de Acción --}}
        <div class="ms-auto d-flex align-items-center gap-2 gap-md-3">
            @guest
                {{-- Botón Ingresar: En móvil solo muestra ícono --}}
                <a href="{{ route('login') }}" class="btn btn-chess px-3 px-md-4 py-2" title="Ingresar">
                    <i class="bi bi-box-arrow-in-right"></i> 
                    <span class="d-none d-md-inline ms-1">Ingresar</span>
                </a>

                {{-- Botón Registrarse: En móvil solo muestra ícono --}}
                <a href="{{ route('registrarse') }}" class="btn btn-chess-secondary px-3 px-md-4 py-2" title="Registrarse">
                    <i class="bi bi-person-plus-fill"></i> 
                    <span class="d-none d-md-inline ms-1">Registrarse</span>
                </a>
            @else
                <div class="dropdown">
                    <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="https://ui-avatars.com/api/?name={{ Auth::user()->name }}&background=81b64c&color=fff" alt="User" width="32" height="32" class="rounded-circle me-2 border border-secondary">
                        {{-- Nombre oculto en móviles muy pequeños --}}
                        <span class="fw-semibold d-none d-md-inline">{{ Auth::user()->name }}</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow border border-secondary" aria-labelledby="dropdownUser1" style="background-color: #262421;">
                        <li><a class="dropdown-item text-white hover-green" href="#">Mi Perfil</a></li>
                        <li><hr class="dropdown-divider bg-secondary"></li>
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

{{-- Estilo extra pequeño para hover del dropdown --}}
<style>
    .dropdown-item.hover-green:hover {
        background-color: #81b64c !important;
        color: white !important;
    }
</style>