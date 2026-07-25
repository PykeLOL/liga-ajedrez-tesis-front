@extends('layouts.app')
@section('title', 'Inicio - Liga de Ajedrez del Meta')
@section('header_title', 'Portal Informativo')

@section('content')

{{-- =========================================================
     1. HERO SECTION
     ========================================================= --}}
<div class="p-5 mb-5 rounded-3 text-white position-relative shadow-lg overflow-hidden hero-section">
    <div class="position-absolute top-0 start-0 w-100 h-100 bg-overlay"></div>

    <div class="position-relative z-1 py-5 px-3 text-center text-md-start">
        <h1 class="display-3 fw-bold text-chess-green mb-3">Liga de Ajedrez del Meta</h1>
        <p class="col-md-8 fs-4 text-light opacity-90 mb-4">
            Estrategia, disciplina y excelencia. <br>
            La casa de los grandes maestros de nuestra región.
        </p>

        <div class="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start mt-4">
            {{-- Botón 3D Calendario --}}
            <a href="{{ url('/eventos/torneo') }}" class="btn btn-lg px-5 fw-bold d-flex align-items-center justify-content-center text-white btn-profundidad">
                <i class="bi bi-calendar-check me-2"></i> Ver Calendario de torneo
            </a>

            {{-- Botón Sobre Nosotros --}}
            <a href="{{ route('nosotros') }}" class="btn btn-outline-light btn-lg px-5 fw-bold d-flex align-items-center justify-content-center">
                <i class="bi bi-info-circle me-2"></i> Sobre Nosotros
            </a>
        </div>
    </div>
</div>

{{-- =========================================================
     2. SECCIÓN DE NOTICIAS (Grid 7/5)
     ========================================================= --}}
<div class="row g-4 mb-5">
    <div class="col-12">
        <h4 class="text-white border-start border-4 border-chess-green ps-3 mb-3 fw-bold">Actualidad Deportiva</h4>
    </div>

    {{-- A. Noticia Principal (Grande) --}}
    <div class="col-lg-7">
        <div class="card h-100 border-0 shadow-sm card-hover text-white overflow-hidden position-relative"
             style="background-color: #262421; border: 1px solid rgba(255,255,255,0.1);">

            <div class="img-wrapper overflow-hidden position-relative">
                <img src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80"
                     class="card-img-top w-100"
                     style="height: 280px; object-fit: cover; transition: transform 0.3s ease;"
                     alt="Torneo">
                <span class="badge bg-danger position-absolute top-0 start-0 m-3 shadow">TORNEO OFICIAL</span>
            </div>

            <div class="card-body p-4">
                <div class="text-chess-green mb-2 text-uppercase fw-bold" style="font-size: 0.8rem;">
                    <i class="bi bi-calendar-event me-1"></i> 14 Ene, 2026
                </div>
                <h3 class="card-title fw-bold mb-2">Gran Final Departamental 2025</h3>
                <p class="card-text text-muted mb-3" style="font-size: 0.95rem;">
                    Los mejores estrategas se reúnen en Villavicencio para definir los cupos a los Juegos Nacionales.
                </p>
                <span class="text-chess-green fw-bold text-decoration-none" style="font-size: 0.9rem;">
                    Leer completa <i class="bi bi-arrow-right ms-1"></i>
                </span>
                <a href="{{ route('noticias.index') }}" class="stretched-link"></a>
            </div>
        </div>
    </div>

    {{-- B. Noticias Secundarias (Lista Horizontal) --}}
    <div class="col-lg-5">
        <div class="d-flex flex-column gap-3 h-100">

            {{-- Noticia Pequeña 1 --}}
            <div class="card border-0 shadow-sm card-hover text-white overflow-hidden position-relative"
                 style="background-color: #262421; border: 1px solid rgba(255,255,255,0.1);">
                <div class="row g-0 align-items-center">
                    <div class="col-4">
                        <img src="https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=300&q=80"
                             class="img-fluid h-100 w-100" style="object-fit: cover; min-height: 110px;" alt="Ranking">
                    </div>
                    <div class="col-8">
                        <div class="card-body py-2 px-3">
                            <span class="badge bg-success mb-1" style="font-size: 0.65rem;">ELO FIDE</span>
                            <h6 class="card-title fw-bold mb-1 text-truncate">Ranking Actualizado</h6>
                            <small class="text-muted d-block mb-2">12 Abril, 2025</small>
                            <span class="text-chess-green fw-bold" style="font-size: 0.8rem;">Leer más <i class="bi bi-arrow-right"></i></span>
                            <a href="{{ route('noticias.index') }}" class="stretched-link"></a>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Noticia Pequeña 2 --}}
            <div class="card border-0 shadow-sm card-hover text-white overflow-hidden position-relative"
                 style="background-color: #262421; border: 1px solid rgba(255,255,255,0.1);">
                <div class="row g-0 align-items-center">
                    <div class="col-4">
                        <img src="https://images.unsplash.com/photo-1560174038-da43ac74f01b?auto=format&fit=crop&w=300&q=80"
                             class="img-fluid h-100 w-100" style="object-fit: cover; min-height: 110px;" alt="Clubes">
                    </div>
                    <div class="col-8">
                        <div class="card-body py-2 px-3">
                            <span class="badge bg-warning text-dark mb-1" style="font-size: 0.65rem;">CLUBES</span>
                            <h6 class="card-title fw-bold mb-1 text-truncate">Nuevo Club 'Rey Blanco'</h6>
                            <small class="text-muted d-block mb-2">10 Abril, 2025</small>
                            <span class="text-chess-green fw-bold" style="font-size: 0.8rem;">Leer más <i class="bi bi-arrow-right"></i></span>
                            <a href="{{ route('noticias.index') }}" class="stretched-link"></a>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Noticia Pequeña 3 --}}
            <div class="card border-0 shadow-sm card-hover text-white overflow-hidden position-relative"
                 style="background-color: #262421; border: 1px solid rgba(255,255,255,0.1);">
                <div class="row g-0 align-items-center">
                    <div class="col-4">
                        <img src="https://plus.unsplash.com/premium_photo-1673814660307-a7201b6357dd?q=80&w=300&auto=format&fit=crop"
                             class="img-fluid h-100 w-100" style="object-fit: cover; min-height: 110px;" alt="Capacitación">
                    </div>
                    <div class="col-8">
                        <div class="card-body py-2 px-3">
                            <span class="badge bg-info text-dark mb-1" style="font-size: 0.65rem;">CAPACITACIÓN</span>
                            <h6 class="card-title fw-bold mb-1 text-truncate">Seminario de Arbitraje</h6>
                            <small class="text-muted d-block mb-2">05 Abril, 2025</small>
                            <span class="text-chess-green fw-bold" style="font-size: 0.8rem;">Leer más <i class="bi bi-arrow-right"></i></span>
                            <a href="{{ route('noticias.index') }}" class="stretched-link"></a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

{{-- =========================================================
     3. FILA DOBLE: RANKING ELO + CLUBES
     ========================================================= --}}
<div class="row g-4 mb-5">

    {{-- A. TOP 5 ELO (Mitad Izquierda) --}}
    <div class="col-lg-6">
        <div class="card bg-dark-card text-white border-0 shadow-sm h-100" style="background-color: #262421; border: 1px solid rgba(255,255,255,0.1);">
            <div class="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center py-3" style="border-color: rgba(255,255,255,0.1) !important;">
                <h5 class="mb-0 fw-bold"><i class="bi bi-trophy-fill text-warning me-2"></i>Top 5 ELO</h5>
                <a href="{{ route('deportistas.topelo') }}" class="btn btn-sm btn-outline-light px-3">Ver Todo</a>
            </div>

            <div class="card-body p-0">
                <div class="list-group list-group-flush rounded-bottom">
                    {{-- Item 1 --}}
                    <a href="{{ url('/deportistas/mielo') }}" class="list-group-item list-group-item-action bg-transparent text-white text-decoration-none d-flex align-items-center py-3 border-secondary" style="border-color: rgba(255,255,255,0.1) !important;">
                        <span class="fw-bold fs-4 text-warning me-3 w-25px text-center">1</span>
                        <img src="https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=FFC107&color=000" class="rounded-circle me-3" width="40" height="40">
                        <div class="flex-grow-1 overflow-hidden">
                            <h6 class="mb-0 fw-bold text-truncate">Carlos Rodríguez</h6>
                            <small class="text-muted d-block text-truncate" style="color: #bababa !important;">Club Alfil Negro</small>
                        </div>
                        <span class="badge bg-success fs-6 ms-2">2350</span>
                    </a>
                    {{-- Item 2 --}}
                    <a href="{{ url('/deportistas/mielo') }}" class="list-group-item list-group-item-action bg-transparent text-white text-decoration-none d-flex align-items-center py-3 border-secondary" style="border-color: rgba(255,255,255,0.1) !important;">
                        <span class="fw-bold fs-4 text-secondary me-3 w-25px text-center">2</span>
                        <img src="https://ui-avatars.com/api/?name=Ana+Sofia&background=ADB5BD&color=000" class="rounded-circle me-3" width="40" height="40">
                        <div class="flex-grow-1 overflow-hidden">
                            <h6 class="mb-0 fw-bold text-truncate">Ana Sofía López</h6>
                            <small class="text-muted d-block text-truncate" style="color: #bababa !important;">Club Jaque Mate</small>
                        </div>
                        <span class="badge bg-secondary fs-6 ms-2">2100</span>
                    </a>
                    {{-- Item 3 --}}
                    <a href="{{ url('/deportistas/mielo') }}" class="list-group-item list-group-item-action bg-transparent text-white text-decoration-none d-flex align-items-center py-3 border-secondary" style="border-color: rgba(255,255,255,0.1) !important;">
                        <span class="fw-bold fs-4 text-danger me-3 w-25px text-center">3</span>
                        <img src="https://ui-avatars.com/api/?name=Pedro+Perez&background=E59866&color=000" class="rounded-circle me-3" width="40" height="40">
                        <div class="flex-grow-1 overflow-hidden">
                            <h6 class="mb-0 fw-bold text-truncate">Pedro Pérez</h6>
                            <small class="text-muted d-block text-truncate" style="color: #bababa !important;">Club Peón Pasado</small>
                        </div>
                        <span class="badge bg-secondary fs-6 ms-2">2050</span>
                    </a>
                    {{-- Item 4 --}}
                    <a href="{{ url('/deportistas/mielo') }}" class="list-group-item list-group-item-action bg-transparent text-white text-decoration-none d-flex align-items-center py-3 border-secondary" style="border-color: rgba(255,255,255,0.1) !important;">
                        <span class="fw-bold fs-5 text-muted me-3 w-25px text-center">4</span>
                        <img src="https://ui-avatars.com/api/?name=Maria+Gonzalez&background=random" class="rounded-circle me-3" width="40" height="40">
                        <div class="flex-grow-1 overflow-hidden">
                            <h6 class="mb-0 fw-bold text-truncate">María González</h6>
                            <small class="text-muted d-block text-truncate" style="color: #bababa !important;">Club Alfil Negro</small>
                        </div>
                        <span class="badge bg-dark border border-secondary text-muted fs-6 ms-2">2000</span>
                    </a>
                    {{-- Item 5 --}}
                    <a href="{{ url('/deportistas/mielo') }}" class="list-group-item list-group-item-action bg-transparent text-white text-decoration-none d-flex align-items-center py-3 border-0">
                        <span class="fw-bold fs-5 text-muted me-3 w-25px text-center">5</span>
                        <img src="https://ui-avatars.com/api/?name=Juan+Martinez&background=random" class="rounded-circle me-3" width="40" height="40">
                        <div class="flex-grow-1 overflow-hidden">
                            <h6 class="mb-0 fw-bold text-truncate">Juan Martínez</h6>
                            <small class="text-muted d-block text-truncate" style="color: #bababa !important;">Club Torre Fuerte</small>
                        </div>
                        <span class="badge bg-dark border border-secondary text-muted fs-6 ms-2">1950</span>
                    </a>
                </div>
            </div>
        </div>
    </div>

    {{-- B. CLUBES DESTACADOS (Mitad Derecha) --}}
    <div class="col-lg-6">
        <div class="card bg-dark-card text-white border-0 shadow-sm h-100" style="background-color: #262421; border: 1px solid rgba(255,255,255,0.1);">
            <div class="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center py-3" style="border-color: rgba(255,255,255,0.1) !important;">
                <h5 class="mb-0 fw-bold"><i class="bi bi-shield-shaded text-chess-green me-2"></i>Clubes Afiliados</h5>
                <a href="{{ route('clubes.index') }}" class="btn btn-sm btn-outline-light px-3">Ver Todos</a>
            </div>

            <div class="card-body">
                <p class="text-muted mb-4">Conoce los clubes oficiales donde puedes entrenar y competir.</p>

                {{-- Grid de Clubes (2 columnas internas) --}}
                <div class="row g-3">
                    <div class="col-md-6">
                        <a href="{{ route('clubes.index') }}" class="text-decoration-none text-white">
                            <div class="p-3 border border-secondary rounded d-flex align-items-center bg-dark-subtle club-card cursor-pointer h-100" style="border-color: rgba(255,255,255,0.1) !important; background-color: #1e1e1e !important;">
                                <div class="bg-white rounded-circle p-2 me-3 d-flex justify-content-center align-items-center shadow-sm" style="width: 50px; height: 50px;">
                                    <i class="bi bi-shield-fill text-dark fs-4"></i>
                                </div>
                                <div>
                                    <h6 class="mb-0 fw-bold">Alfil Negro</h6>
                                    <small class="text-chess-green">Villavicencio</small>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div class="col-md-6">
                        <a href="{{ route('clubes.index') }}" class="text-decoration-none text-white">
                            <div class="p-3 border border-secondary rounded d-flex align-items-center bg-dark-subtle club-card cursor-pointer h-100" style="border-color: rgba(255,255,255,0.1) !important; background-color: #1e1e1e !important;">
                                <div class="bg-white rounded-circle p-2 me-3 d-flex justify-content-center align-items-center shadow-sm" style="width: 50px; height: 50px;">
                                    <i class="bi bi-award-fill text-warning fs-4"></i>
                                </div>
                                <div>
                                    <h6 class="mb-0 fw-bold">Club Titán</h6>
                                    <small class="text-chess-green">Acacías</small>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div class="col-md-6">
                        <a href="{{ route('clubes.index') }}" class="text-decoration-none text-white">
                            <div class="p-3 border border-secondary rounded d-flex align-items-center bg-dark-subtle club-card cursor-pointer h-100" style="border-color: rgba(255,255,255,0.1) !important; background-color: #1e1e1e !important;">
                                <div class="bg-white rounded-circle p-2 me-3 d-flex justify-content-center align-items-center shadow-sm" style="width: 50px; height: 50px;">
                                    <i class="bi bi-lightning-fill text-primary fs-4"></i>
                                </div>
                                <div>
                                    <h6 class="mb-0 fw-bold">Torre Fuerte</h6>
                                    <small class="text-chess-green">Granada</small>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div class="col-md-6">
                        <a href="{{ route('clubes.index') }}" class="text-decoration-none text-white">
                            <div class="p-3 border border-secondary rounded d-flex align-items-center bg-dark-subtle club-card cursor-pointer h-100" style="border-color: rgba(255,255,255,0.1) !important; background-color: #1e1e1e !important;">
                                <div class="bg-white rounded-circle p-2 me-3 d-flex justify-content-center align-items-center shadow-sm" style="width: 50px; height: 50px;">
                                    <i class="bi bi-circle-fill text-danger fs-4"></i>
                                </div>
                                <div>
                                    <h6 class="mb-0 fw-bold">Peón Pasado</h6>
                                    <small class="text-chess-green">Restrepo</small>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>

                <div class="mt-4 text-center">
                    <a href="{{ route('clubes.index') }}" class="btn btn-outline-success w-100 py-2 fw-bold">
                        <i class="bi bi-plus-circle me-2"></i> ¿Quieres afiliar tu club?
                    </a>
                </div>
            </div>
        </div>
    </div>

</div>
@endsection
