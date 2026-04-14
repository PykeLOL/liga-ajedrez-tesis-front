<div class="border-end bg-dark-chess" id="sidebar-wrapper">
    <div class="sidebar-heading border-bottom border-secondary">
        <a href="{{ route('home') }}" class="text-decoration-none d-flex align-items-center justify-content-center gap-3">
            <img src="{{ asset('img/logo.png') }}" alt="Logo" class="sidebar-logo">
            <span class="fs-5 fw-bold text-white text-uppercase ls-1" style="line-height: 1;">Liga del Meta</span>
        </a>
    </div>

    <div class="list-group list-group-flush my-3">

        <a href="{{ route('home') }}"
           class="list-group-item list-group-item-action {{ request()->routeIs('home') ? 'active' : '' }}">
            <i class="bi bi-house-door-fill"></i> Inicio
        </a>

        @php
            $eventosActive     = request()->routeIs('eventos.*');
            $entrenoActive    = request()->routeIs('entrenamientos.*');
            $deportistasActive= request()->routeIs('deportistas.*');
        @endphp

        <a href="#submenuEventos"
           class="list-group-item list-group-item-action {{ $eventosActive ? 'active' : '' }}"
           data-bs-toggle="collapse"
           aria-expanded="{{ $eventosActive ? 'true' : 'false' }}">
            <i class="bi bi-calendar-event-fill"></i> Eventos
            <i class="bi bi-chevron-down small-icon"></i>
        </a>

        <div class="collapse {{ $eventosActive ? 'show' : '' }}" id="submenuEventos">
            <div class="bg-dark-subtle ps-2">

                @forelse($tiposEventosSidebar as $tipo)
                    <a href="{{ route('eventos.tipo', $tipo['slug']) }}"
                       class="list-group-item list-group-item-action py-2
                       {{ request()->is('eventos/'.$tipo['slug']) ? 'text-chess-green' : '' }}">
                        <i class="bi bi-calendar2-event-fill"></i> {{ $tipo['nombre'] }}
                    </a>
                @empty
                    <div class="text-muted small p-2">No hay tipos de eventos</div>
                @endforelse

            </div>
        </div>

        <a href="#submenuEntreno"
           class="list-group-item list-group-item-action {{ $entrenoActive ? 'active' : '' }}"
           data-bs-toggle="collapse"
           aria-expanded="{{ $entrenoActive ? 'true' : 'false' }}">
            <i class="bi bi-mortarboard-fill"></i> Entrenamiento
            <i class="bi bi-chevron-down small-icon"></i>
        </a>

        <div class="collapse {{ $entrenoActive ? 'show' : '' }}" id="submenuEntreno">
            <div class="bg-dark-subtle ps-2">
                <a href="{{ route('entrenamientos.horarios') }}"
                   class="list-group-item list-group-item-action py-2 {{ request()->routeIs('entrenamientos.horarios') ? 'text-chess-green' : '' }}">
                    <i class="bi bi-clock-fill"></i> Horarios
                </a>

                <a href="{{ route('entrenamientos.foro') }}"
                   class="list-group-item list-group-item-action py-2 {{ request()->routeIs('entrenamientos.foro') ? 'text-chess-green' : '' }}">
                    <i class="bi bi-chat-dots-fill"></i> Foro
                </a>
            </div>
        </div>

        <a href="#submenuDeportistas"
           class="list-group-item list-group-item-action {{ $deportistasActive ? 'active' : '' }}"
           data-bs-toggle="collapse"
           aria-expanded="{{ $deportistasActive ? 'true' : 'false' }}">
            <i class="bi bi-person-lines-fill"></i> Deportistas
            <i class="bi bi-chevron-down small-icon"></i>
        </a>

        <div class="collapse {{ $deportistasActive ? 'show' : '' }}" id="submenuDeportistas">
            <div class="bg-dark-subtle ps-2">
                <a href="{{ route('deportistas.mielo') }}"
                   class="list-group-item list-group-item-action py-2 {{ request()->routeIs('deportistas.mielo') ? 'text-chess-green' : '' }}">
                    <i class="bi bi-bar-chart-line-fill"></i> Mi ELO
                </a>

                <a href="{{ route('deportistas.topelo') }}"
                   class="list-group-item list-group-item-action py-2 {{ request()->routeIs('deportistas.topelo') ? 'text-chess-green' : '' }}">
                    <i class="bi bi-graph-up-arrow"></i> Ranking Elo
                </a>

                <a href="{{ route('deportistas.palmares') }}"
                   class="list-group-item list-group-item-action py-2 {{ request()->routeIs('deportistas.palmares') ? 'text-chess-green' : '' }}">
                    <i class="bi bi-award-fill"></i> Palmarés
                </a>
            </div>
        </div>

        <a href="{{ route('clubes.index') }}"
           class="list-group-item list-group-item-action {{ request()->routeIs('clubes.index') ? 'active' : '' }}">
            <i class="bi bi-shield-shaded"></i> Clubes
        </a>
        <a href="{{ route('noticias.index') }}" class="list-group-item list-group-item-action {{ request()->routeIs('noticias.index') ? 'active' : '' }}">
            <span><i class="bi bi-newspaper"></i> Noticias</span>
        </a>
        @if(auth()->check() && auth()->user()->role_id === 1)
            <div class="mt-auto border-top border-secondary p-3">
                <a href="{{ route('admin.index') }}" class="btn btn-chess-secondary w-100 btn-sm">
                    <i class="bi bi-speedometer2"></i> Ir al Panel Admin
                </a>
            </div>
        @endif
    </div>
</div>
