<div id="sidebar" class="sidebar-chess">
    <div class="sidebar-header">
        <a href="{{ route('admin.index') }}" class="sidebar-brand text-decoration-none">
            <i data-lucide="crown" style="width: 24px; height: 24px;"></i>
            <span>PANEL ADMIN</span>
        </a>
    </div>

    <ul class="nav-chess">
        <li class="nav-item-chess" style="display:none">
            <a href="{{ route('admin.usuarios') }}"
            class="ver-usuarios nav-link-chess {{ request()->routeIs('admin.usuarios') ? 'active' : '' }}">
                <i data-lucide="user-round-cog"></i>
                <span>Usuarios</span>
            </a>
        </li>

        <li class="nav-item-chess" style="display:none">
            <a href="{{ route('admin.roles') }}"
            class="ver-roles nav-link-chess {{ request()->routeIs('admin.roles') ? 'active' : '' }}">
                <i data-lucide="pyramid"></i>
                <span>Roles</span>
            </a>
        </li>

        <li class="nav-item-chess" style="display:none">
            <a href="{{ route('admin.permisos') }}"
            class="ver-permisos nav-link-chess {{ request()->routeIs('admin.permisos') ? 'active' : '' }}">
                <i data-lucide="lock-keyhole"></i>
                <span>Permisos</span>
            </a>
        </li>

        <li class="nav-item-chess" style="display:none">
            <a href="{{ route('admin.modulos') }}"
            class="ver-modulos nav-link-chess {{ request()->routeIs('admin.modulos') ? 'active' : '' }}">
                <i data-lucide="container"></i>
                <span>Módulos</span>
            </a>
        </li>

        <li class="nav-item-chess" style="display:none">
            <a href="{{ route('admin.torneos') }}"
            class="ver-torneos nav-link-chess {{ request()->routeIs('admin.torneos') ? 'active' : '' }}">
                <i data-lucide="trophy"></i>
                <span>Torneos</span>
            </a>
        </li>

        <li class="nav-item-chess" style="display:none">
            <a href="{{ route('admin.eventos') }}"
            class="ver-eventos nav-link-chess {{ request()->routeIs('admin.eventos') ? 'active' : '' }}">
                <i data-lucide="calendar-1"></i>
                <span>Eventos</span>
            </a>
        </li>

        <li class="nav-item-chess" style="display:none">
            <a href="{{ route('admin.clubes') }}"
            class="ver-clubes nav-link-chess {{ request()->routeIs('admin.clubes') ? 'active' : '' }}">
                <i data-lucide="handshake"></i>
                <span>Clubes</span>
            </a>
        </li>

        <li class="nav-item-chess" style="display:none">
            <a href="{{ route('admin.deportistas') }}"
            class="ver-deportistas nav-link-chess {{ request()->routeIs('admin.deportistas') ? 'active' : '' }}">
                <i data-lucide="biceps-flexed"></i>
                <span>Deportistas</span>
            </a>
        </li>

        <li class="nav-item-chess" style="display:none">
            <a href="{{ route('admin.solicitudes') }}"
            class="ver-solicitudes nav-link-chess {{ request()->routeIs('admin.solicitudes') ? 'active' : '' }}">
                <i data-lucide="file-clock"></i>
                <span>Solicitudes</span>
            </a>
        </li>

        <li class="nav-item-chess" style="display:none">
            <a href="{{ route('admin.entrenadores') }}"
            class="ver-entrenadores nav-link-chess {{ request()->routeIs('admin.entrenadores') ? 'active' : '' }}">
                <i data-lucide="graduation-cap"></i>
                <span>Entrenadores</span>
            </a>
        </li>

        <li class="nav-item-chess" style="display:none">
            <a href="{{ route('admin.planes-entrenamiento') }}"
            class="ver-planes-entrenamiento nav-link-chess {{ request()->routeIs('admin.planes-entrenamiento') ? 'active' : '' }}">
                <i data-lucide="calendars"></i>
                <span>Planes de Entrenamiento</span>
            </a>
        </li>

        <li class="nav-item-chess" style="display:none">
            <a href="{{ route('admin.entrenamientos') }}"
            class="ver-entrenamientos nav-link-chess {{ request()->routeIs('admin.entrenamientos') ? 'active' : '' }}">
                <i data-lucide="calendar-days"></i>
                <span>Entrenamientos</span>
            </a>
        </li>
    </ul>

    <div class="sidebar-footer">
        <div class="opacity-75">Liga de Ajedrez</div>
        <div style="font-size: 0.7rem; margin-top: 5px;">© {{ date('Y') }} Versión 1.0</div>
    </div>
</div>
