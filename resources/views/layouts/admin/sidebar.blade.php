<!-- Sidebar -->
<div id="sidebar" class="bg-dark text-white vh-100 position-fixed top-0 start-0 d-flex flex-column shadow" style="width: 220px;">
    <div class="p-3 border-bottom border-secondary">
        <h5 class="mb-0 fw-bold text-center">.</h5>
    </div>

    <ul class="nav flex-column mt-3">
        <li class="nav-item" style="display: none;">
            <a href="{{ route('admin.usuarios') }}"
               class="ver-usuarios nav-link text-white px-3 py-2 d-flex align-items-center gap-2 {{ request()->routeIs('admin.usuarios') ? 'active' : '' }}">
                <i data-lucide="user-round-cog" class="me-2"></i> <span>Usuarios</span>
            </a>
        </li>
        <li class="nav-item" style="display: none;">
            <a href="{{ route('admin.roles') }}"
               class="ver-roles nav-link text-white px-3 py-2 d-flex align-items-center gap-2 {{ request()->routeIs('admin.roles') ? 'active' : '' }}">
                <i data-lucide="pyramid" class="me-2"></i> <span>Roles</span>
            </a>
        </li>
        <li class="nav-item" style="display: none;">
            <a href="{{ route('admin.permisos') }}"
               class="ver-permisos nav-link text-white px-3 py-2 d-flex align-items-center gap-2 {{ request()->routeIs('admin.permisos') ? 'active' : '' }}">
                <i data-lucide="lock-keyhole" class="me-2"></i> <span>Permisos</span>
            </a>
        </li>
        <li class="nav-item" style="display: none;">
            <a href="{{ route('admin.modulos') }}"
               class="ver-modulos nav-link text-white px-3 py-2 d-flex align-items-center gap-2 {{ request()->routeIs('admin.modulos') ? 'active' : '' }}">
                <i data-lucide="container" class="me-2"></i> <span>Modulos</span>
            </a>
        </li>
    </ul>

    <div class="mt-auto text-center p-3 small text-muted border-top border-secondary">
        © {{ date('Y') }} Panel Admin
    </div>
</div>

<!-- Iconos Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">

<style>
    /* Sidebar activo */
    #sidebar .nav-link:hover,
    #sidebar .nav-link.active {
        background-color: #0d6efd;
        color: #fff !important;
        border-radius: 0.375rem;
    }

    /* Ajustar margen del contenido principal */
    .content-wrapper {
        margin-left: 220px;
        padding: 20px;
    }
</style>
