<div id="sidebar" class="sidebar-chess">
    
    {{-- Header / Logo (Ahora con enlace) --}}
    <div class="sidebar-header">
        <a href="{{ route('admin.index') }}" class="sidebar-brand text-decoration-none">
            {{-- Icono --}}
            <i data-lucide="crown" style="width: 24px; height: 24px;"></i>
            <span>PANEL ADMIN</span>
        </a>
    </div>

    {{-- Lista de Navegación --}}
    <ul class="nav-chess">
        
        {{-- USUARIOS --}}
        <li class="nav-item-chess">
            <a href="{{ route('admin.usuarios') }}"
               class="ver-usuarios nav-link-chess {{ request()->routeIs('admin.usuarios') ? 'active' : '' }}">
                <i data-lucide="user-round-cog"></i> 
                <span>Usuarios</span>
            </a>
        </li>

        {{-- ROLES --}}
        <li class="nav-item-chess">
            <a href="{{ route('admin.roles') }}"
               class="ver-roles nav-link-chess {{ request()->routeIs('admin.roles') ? 'active' : '' }}">
                <i data-lucide="pyramid"></i> 
                <span>Roles</span>
            </a>
        </li>

        {{-- PERMISOS --}}
        <li class="nav-item-chess">
            <a href="{{ route('admin.permisos') }}"
               class="ver-permisos nav-link-chess {{ request()->routeIs('admin.permisos') ? 'active' : '' }}">
                <i data-lucide="lock-keyhole"></i> 
                <span>Permisos</span>
            </a>
        </li>

        {{-- MÓDULOS --}}
        <li class="nav-item-chess">
            <a href="{{ route('admin.modulos') }}"
               class="ver-modulos nav-link-chess {{ request()->routeIs('admin.modulos') ? 'active' : '' }}">
                <i data-lucide="container"></i> 
                <span>Módulos</span>
            </a>
        </li>

    </ul>

    {{-- Footer --}}
    <div class="sidebar-footer">
        <div class="opacity-75">Liga de Ajedrez</div>
        <div style="font-size: 0.7rem; margin-top: 5px;">© {{ date('Y') }} Versión 1.0</div>
    </div>
</div> 