@extends('layouts.app')
@section('title', 'Inicio - Liga de Ajedrez del Meta')
@section('header_title', 'Portal Informativo')

@section('content')

<div class="p-5 mb-5 rounded-3 text-white position-relative shadow-lg overflow-hidden hero-section">
    <div class="position-absolute top-0 start-0 w-100 h-100 bg-overlay"></div>

    <div class="position-relative z-1 py-5 px-3 text-center text-md-start">
        <h1 class="display-3 fw-bold text-chess-green mb-3">
            Liga de Ajedrez del Meta
        </h1>

        <p class="col-md-8 fs-4 text-light opacity-90 mb-4">
            Estrategia, disciplina y excelencia.<br>
            La casa de los grandes maestros de nuestra región.
        </p>

        <div class="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start mt-4">
            <a href="{{ url('/eventos/torneo') }}"
               class="btn btn-lg px-5 fw-bold d-flex align-items-center justify-content-center text-white btn-profundidad">
                <i class="bi bi-calendar-check me-2"></i>
                Ver Calendario de torneo
            </a>
            <a href="{{ route('nosotros') }}"
               class="btn btn-outline-light btn-lg px-5 fw-bold d-flex align-items-center justify-content-center">
                <i class="bi bi-info-circle me-2"></i>
                Sobre Nosotros
            </a>
        </div>
    </div>
</div>

<div class="row g-4 mb-5">
    <div class="col-12">
        <h4 class="text-white border-start border-4 border-chess-green ps-3 mb-3 fw-bold">
            Actualidad Deportiva
        </h4>
    </div>

    <div class="col-lg-7" id="eventoPrincipal">
        <div class="card h-100 border-0 shadow-sm text-white"
             style="background:#262421">
            <div class="card-body d-flex justify-content-center align-items-center py-5">
                <div class="text-center text-muted">
                    <div class="spinner-border text-success mb-3"></div>
                    <div>Cargando evento principal...</div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-lg-5">
        <div
            id="eventosSecundarios"
            class="d-flex flex-column gap-3 h-100">
            <div class="card border-0 shadow-sm text-white"
                 style="background:#262421">
                <div class="card-body py-5 text-center text-muted">
                    <div class="spinner-border text-success mb-3"></div>
                    <div>
                        Cargando eventos...
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row g-4 mb-5">
    <div class="col-lg-6">
        <div class="card bg-dark-card text-white border-0 shadow-sm h-100" style="background:#262421;border:1px solid rgba(255,255,255,.1);">
            <div class="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center py-3" style="border-color:rgba(255,255,255,.1)!important;">
                <h5 class="mb-0 fw-bold"><i class="bi bi-trophy-fill text-warning me-2"></i>Top 5 ELO</h5>
                <a href="{{ route('deportistas.topelo') }}" class="btn btn-sm btn-outline-light px-3">Ver Todo</a>
            </div>
            <div class="card-body p-0">
                <div class="list-group list-group-flush rounded-bottom" id="topRanking">
                    <div class="text-center text-muted py-5">
                        <div class="spinner-border text-success mb-3"></div>
                        <div>Cargando ranking...</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-lg-6">
        <div class="card bg-dark-card text-white border-0 shadow-sm h-100" style="background:#262421;border:1px solid rgba(255,255,255,.1);">
            <div class="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center py-3" style="border-color:rgba(255,255,255,.1)!important;">
                <h5 class="mb-0 fw-bold">
                    <i class="bi bi-shield-shaded text-chess-green me-2"></i>
                    Clubes Afiliados
                </h5>
                <a href="{{ route('clubes.index') }}" class="btn btn-sm btn-outline-light px-3">
                    Ver Todos
                </a>
            </div>
            <div class="card-body">
                <p class="text-muted mb-4">
                    Conoce los clubes oficiales donde puedes entrenar y competir.
                </p>
                <div class="row g-3" id="clubesHome">
                    <div class="col-12 text-center text-muted py-5">
                        <div class="spinner-border text-success mb-3"></div>
                        <div>
                            Cargando clubes...
                        </div>
                    </div>
                </div>
                <div class="mt-4 text-center">
                    <a href="{{ route('clubes.index') }}"
                       class="btn btn-outline-success w-100 py-2 fw-bold">
                        <i class="bi bi-plus-circle me-2"></i>
                        ¿Quieres afiliar tu club?
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script>
    const rutaRanking="{{ route('deportistas.topelo') }}";
    const rutaClub="{{ route('clubes.show','__ID__') }}";
    const rutaMiElo="{{ route('deportistas.mielo') }}";
    const rutaEvento="{{ route('eventos.tipo',['__TIPO__']) }}";
</script>
<script src="{{ asset('js/home.js') }}"></script>
@endpush
