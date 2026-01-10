@extends('layouts.app')
@section('title', 'Inicio - Liga de Ajedrez del Meta')
@section('header_title', 'Portal Informativo')

@section('content')

{{-- Hero Section --}}
<div class="p-5 mb-4 rounded-3 text-white hero-bg position-relative shadow-lg overflow-hidden">
    <div class="position-absolute top-0 start-0 w-100 h-100 bg-overlay"></div>
    
    <div class="position-relative z-1 py-4 px-2">
        <h1 class="display-4 fw-bold text-chess-green">Liga de Ajedrez del Meta</h1>
        <p class="col-md-8 fs-5 text-light opacity-75">
            Fomentando la estrategia, la disciplina y la excelencia deportiva en nuestra región. 
            Consulta rankings, inscríbete a torneos oficiales y encuentra tu club ideal.
        </p>
        <div class="mt-4">
            <button class="btn btn-chess btn-lg px-4 me-2 fw-bold" type="button">
                <i class="bi bi-calendar-check me-2"></i>Ver Calendario
            </button>
            
            <button class="btn btn-chess-secondary btn-lg px-4 fw-bold" type="button">
                <i class="bi bi-info-circle me-2"></i>Sobre Nosotros
            </button>
        </div>
    </div>
</div>

<div class="row g-4 mb-5">
    <div class="col-12">
        <h4 class="text-white border-start border-4 border-chess-green ps-3 mb-3 fw-bold">Actualidad Deportiva</h4>
    </div>

    {{-- Noticia Principal (Grande) --}}
    <div class="col-lg-8">
        <div class="card h-100 border-0 shadow-sm card-hover bg-dark-card text-white overflow-hidden">
            <div class="img-wrapper">
                <img src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80" class="card-img-top zoom-effect" style="height: 400px; object-fit: cover;" alt="Torneo">
            </div>
            <div class="card-body p-4 position-relative">
                <span class="badge bg-danger mb-2 position-absolute top-0 start-0 m-3 shadow">TORNEO OFICIAL</span>
                <h2 class="card-title fw-bold mt-2">Gran Final Departamental 2025</h2>
                <p class="card-text text-muted fs-5">Los mejores estrategas del departamento se reúnen en Villavicencio para definir los cupos a los Juegos Nacionales. Consulta aquí los emparejamientos y resultados en vivo.</p>
                <a href="#" class="btn btn-link text-chess-green text-decoration-none p-0 fw-bold">Leer noticia completa <i class="bi bi-arrow-right"></i></a>
            </div>
        </div>
    </div>

    {{-- Noticias Secundarias (Refactorizado con Componentes) --}}
    <div class="col-lg-4">
        <div class="d-flex flex-column gap-3 h-100">
            
            <x-news-card 
                image="https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=300&q=80"
                category="ELO FIDE"
                title="Actualización Ranking Abril"
                date="12 Abril, 2025"
                badgeColor="success"
            />

            <x-news-card 
                image="https://images.unsplash.com/photo-1560174038-da43ac74f01b?auto=format&fit=crop&w=300&q=80"
                category="CLUBES"
                title="Nuevo Club 'Rey Blanco' se afilia a la liga"
                date="10 Abril, 2025"
                badgeColor="warning text-dark"
            />

            <x-news-card 
                image="https://plus.unsplash.com/premium_photo-1673814660307-a7201b6357dd?q=80&w=300&auto=format&fit=crop"
                category="CAPACITACIÓN"
                title="Seminario de Arbitraje Nacional"
                date="05 Abril, 2025"
                badgeColor="info text-dark"
            />

        </div>
    </div>
</div>

<div class="row g-4">
    
    {{-- Top ELO --}}
    <div class="col-lg-6">
        <div class="card bg-dark-card text-white border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center py-3">
                <h5 class="mb-0 fw-bold"><i class="bi bi-trophy-fill text-warning me-2"></i>Top 5 ELO Liga</h5>
                <a href="#" class="btn btn-sm btn-outline-light">Ver Ranking Completo</a>
            </div>
            <div class="card-body p-0">
                <div class="list-group list-group-flush rounded-bottom">
                    {{-- Item 1 --}}
                    <div class="list-group-item bg-transparent text-white d-flex align-items-center py-3 border-secondary">
                        <span class="fw-bold fs-4 text-warning me-3 w-25px">1</span>
                        <img src="https://ui-avatars.com/api/?name=Magnus+Carlsen&background=random" class="rounded-circle me-3" width="40" height="40">
                        <div class="flex-grow-1">
                            <h6 class="mb-0 fw-bold">Carlos Martinez</h6>
                            <small class="text-muted">Club Titán</small>
                        </div>
                        <span class="badge bg-chess-green fs-6">2350</span>
                    </div>
                    {{-- Item 2 --}}
                    <div class="list-group-item bg-transparent text-white d-flex align-items-center py-3 border-secondary">
                        <span class="fw-bold fs-4 text-secondary me-3 w-25px">2</span>
                        <img src="https://ui-avatars.com/api/?name=Hikaru+Nakamura&background=random" class="rounded-circle me-3" width="40" height="40">
                        <div class="flex-grow-1">
                            <h6 class="mb-0 fw-bold">Diana Lopez</h6>
                            <small class="text-muted">Club Alfil Negro</small>
                        </div>
                        <span class="badge bg-secondary fs-6">2280</span>
                    </div>
                    {{-- Item 3 --}}
                    <div class="list-group-item bg-transparent text-white d-flex align-items-center py-3 border-secondary">
                        <span class="fw-bold fs-4 text-danger me-3 w-25px">3</span>
                        <img src="https://ui-avatars.com/api/?name=Fabiano+Caruana&background=random" class="rounded-circle me-3" width="40" height="40">
                        <div class="flex-grow-1">
                            <h6 class="mb-0 fw-bold">Jorge Ramirez</h6>
                            <small class="text-muted">Club Jaque Mate</small>
                        </div>
                        <span class="badge bg-secondary fs-6">2150</span>
                    </div>
                     {{-- Item 4 --}}
                     <div class="list-group-item bg-transparent text-white d-flex align-items-center py-3 border-secondary">
                        <span class="fw-bold fs-5 text-muted me-3 w-25px">4</span>
                        <img src="https://ui-avatars.com/api/?name=Nepo&background=random" class="rounded-circle me-3" width="40" height="40">
                        <div class="flex-grow-1">
                            <h6 class="mb-0 fw-bold">Andres Castro</h6>
                            <small class="text-muted">Club Titán</small>
                        </div>
                        <span class="badge bg-dark border border-secondary text-muted fs-6">2100</span>
                    </div>
                     {{-- Item 5 --}}
                     <div class="list-group-item bg-transparent text-white d-flex align-items-center py-3 border-0">
                        <span class="fw-bold fs-5 text-muted me-3 w-25px">5</span>
                        <img src="https://ui-avatars.com/api/?name=Ding&background=random" class="rounded-circle me-3" width="40" height="40">
                        <div class="flex-grow-1">
                            <h6 class="mb-0 fw-bold">Sofia Vergara</h6>
                            <small class="text-muted">Club Peón Pasado</small>
                        </div>
                        <span class="badge bg-dark border border-secondary text-muted fs-6">2050</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Clubes --}}
    <div class="col-lg-6">
        <div class="card bg-dark-card text-white border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-bottom border-secondary py-3 d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold">
                    <i class="bi bi-shield-shaded text-chess-green me-2"></i>Clubes Afiliados
                </h5>
                {{-- Enlace "Ver todos" sutil --}}
                <a href="{{ route('clubes.index') }}" class="small text-muted text-decoration-none hover-white">Ver todos</a>
            </div>
            <div class="card-body">
                <p class="text-muted mb-4">Entrena con los mejores. Estos son los clubes oficiales avalados por la liga.</p>
                
                <div class="row g-3">
                    <div class="col-md-6">
                        {{-- Enlace que envuelve toda la tarjeta --}}
                        <a href="{{ route('clubes.index') }}" class="text-decoration-none text-white">
                            <div class="p-3 border border-secondary rounded d-flex align-items-center bg-dark-subtle club-card cursor-pointer h-100">
                                <div class="bg-white rounded-circle p-2 me-3 d-flex justify-content-center align-items-center" style="width: 50px; height: 50px;">
                                    <i class="bi bi-suit-spade-fill text-dark fs-4"></i> 
                                </div>
                                <div>
                                    <h6 class="mb-0 fw-bold">Club Titán</h6>
                                    <small class="text-chess-green">Villavicencio</small>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div class="col-md-6">
                        <a href="{{ route('clubes.index') }}" class="text-decoration-none text-white">
                            <div class="p-3 border border-secondary rounded d-flex align-items-center bg-dark-subtle club-card cursor-pointer h-100">
                                <div class="bg-white rounded-circle p-2 me-3 d-flex justify-content-center align-items-center" style="width: 50px; height: 50px;">
                                    <i class="bi bi-award-fill text-warning fs-4"></i>
                                </div>
                                <div>
                                    <h6 class="mb-0 fw-bold">Jaque Mate</h6>
                                    <small class="text-chess-green">Acacías</small>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div class="col-md-6">
                        <a href="{{ route('clubes.index') }}" class="text-decoration-none text-white">
                            <div class="p-3 border border-secondary rounded d-flex align-items-center bg-dark-subtle club-card cursor-pointer h-100">
                                <div class="bg-white rounded-circle p-2 me-3 d-flex justify-content-center align-items-center" style="width: 50px; height: 50px;">
                                    <i class="bi bi-lightning-fill text-primary fs-4"></i>
                                </div>
                                <div>
                                    <h6 class="mb-0 fw-bold">Alfil Negro</h6>
                                    <small class="text-chess-green">Granada</small>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div class="col-md-6">
                        <a href="{{ route('clubes.index') }}" class="text-decoration-none text-white">
                            <div class="p-3 border border-secondary rounded d-flex align-items-center bg-dark-subtle club-card cursor-pointer h-100">
                                <div class="bg-white rounded-circle p-2 me-3 d-flex justify-content-center align-items-center" style="width: 50px; height: 50px;">
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
                    {{-- Botón convertido en enlace --}}
                    <a href="{{ route('clubes.index') }}" class="btn btn-outline-success w-100">
                        ¿Quieres afiliar tu club?
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection 