@extends('layouts.app')
@section('title','Mi ELO y Progreso')
@section('header_title','Estadísticas del Jugador')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/deportistas/mielo.css') }}">
@endsection

@section('content')

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div class="container-fluid p-0">
    <div class="row g-4 mb-4">
        <div class="col-lg-4">
            <div class="card bg-card border-0 shadow-sm h-100">
                <div class="card-body text-center p-4">
                    <div class="profile-img-container">
                        <img
                            id="fotoPerfil"
                            src="https://ui-avatars.com/api/?name=##&background=262421&color=ffffff&size=300"
                            alt="Foto Perfil"
                            class="profile-img">
                        <span id="tituloBadge" class="badge bg-danger border border-dark rounded-pill badge-title">ST</span>
                    </div>
                    <h4 id="nombreJugador" class="text-white fw-bold mb-1">Cargando...</h4>
                    <p class="text-muted mb-3">
                        <i class="bi bi-geo-alt-fill text-chess-green"></i>
                        <span id="clubJugador">Cargando...</span>
                    </p>
                    <div class="d-flex justify-content-center gap-2 mb-4">
                        <span class="badge info-badge">
                            ID FIDE: <span id="fideId">-</span>
                        </span>

                        <span class="badge info-badge">
                            Edad: <span id="edadJugador">-</span>
                        </span>
                    </div>
                    <div class="row g-2 text-center border-top border-secondary pt-3">
                        <div class="col-4 border-end border-secondary">
                            <h5 id="eloNacional" class="fw-bold text-white mb-0">-</h5>
                            <small class="text-muted small-label">ELO NACIONAL</small>
                        </div>
                        <div class="col-4 border-end border-secondary">
                            <h5 id="eloInternacional" class="fw-bold text-success mb-0">-</h5>
                            <small class="text-muted small-label">ELO FIDE</small>
                        </div>
                        <div class="col-4">
                            <h5 id="categoriaJugador" class="fw-bold text-white mb-0">-</h5>
                            <small class="text-muted small-label">CATEGORÍA</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-8">
            <div class="row g-3 h-100">
                <div class="col-md-4">
                    <div class="elo-card h-100 d-flex flex-column">
                        <div class="elo-icon-bg">
                            <i class="bi bi-clock"></i>
                        </div>
                        <div class="card-body flex-grow-1">
                            <h6 class="text-muted text-uppercase small fw-bold mb-3">Clásico (Standard)</h6>
                            <h2 id="eloStandard" class="display-5 fw-bold text-white mb-1">-</h2>
                            <span id="badgeStandard" class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">
                                <i class="bi bi-dash"></i> <span>0</span>
                            </span>
                            <small class="text-muted ms-2">este mes</small>
                        </div>
                        <div class="progress progress-dark mt-auto mx-3 mb-3">
                            <div id="barraStandard" class="progress-bar bg-primary" style="width:0%"></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="elo-card h-100 d-flex flex-column">
                        <div class="elo-icon-bg">
                            <i class="bi bi-stopwatch"></i>
                        </div>
                        <div class="card-body flex-grow-1">
                            <h6 class="text-muted text-uppercase small fw-bold mb-3">Rápido (Rapid)</h6>
                            <h2 id="eloRapid" class="display-5 fw-bold text-white mb-1">-</h2>
                            <span id="badgeRapid" class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">
                                <i class="bi bi-dash"></i> <span>0</span>
                            </span>
                            <small class="text-muted ms-2">este mes</small>
                        </div>
                        <div class="progress progress-dark mt-auto mx-3 mb-3">
                            <div id="barraRapid" class="progress-bar bg-warning" style="width:0%"></div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="elo-card h-100 d-flex flex-column">
                        <div class="elo-icon-bg">
                            <i class="bi bi-lightning-charge"></i>
                        </div>
                        <div class="card-body flex-grow-1">
                            <h6 class="text-muted text-uppercase small fw-bold mb-3">Blitz</h6>
                            <h2 id="eloBlitz" class="display-5 fw-bold text-white mb-1">-</h2>
                            <span id="badgeBlitz" class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">
                                <i class="bi bi-dash"></i> <span>0</span>
                            </span>
                            <small class="text-muted ms-2">este mes</small>
                        </div>
                        <div class="progress progress-dark mt-auto mx-3 mb-3">
                            <div id="barraBlitz" class="progress-bar bg-danger" style="width:0%"></div>
                        </div>
                    </div>
                </div>

                <div class="col-12 mt-3">
                    <div class="card bg-dark-chess text-white border-0 h-100">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h5 class="fw-bold mb-1">Información FIDE</h5>
                                <p id="tituloCompleto" class="text-muted mb-0">Sin título</p>
                            </div>
                            <div class="text-end">
                                <span id="paisJugador" class="d-block fs-5 fw-bold text-chess-green">-</span>
                                <small class="text-muted">Federación</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     </div>

    <div class="card bg-card border-secondary shadow-sm mb-4">
        <div class="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center py-3">
            <h5 class="fw-bold text-white mb-0">
                <i class="bi bi-graph-up text-chess-green me-2"></i>Progreso de ELO (Últimos 12 meses)
            </h5>
            <div class="btn-group btn-group-sm" role="group">
                <input type="radio" class="btn-check" name="btnradio" id="btnradio1" checked onclick="actualizarGrafico('todos')">
                <label class="btn btn-outline-secondary" for="btnradio1">Todos</label>

                <input type="radio" class="btn-check" name="btnradio" id="btnradio2" onclick="actualizarGrafico('standard')">
                <label class="btn btn-outline-secondary" for="btnradio2">Standard</label>

                <input type="radio" class="btn-check" name="btnradio" id="btnradio3" onclick="actualizarGrafico('rapid')">
                <label class="btn btn-outline-secondary" for="btnradio3">Rapid</label>

                <input type="radio" class="btn-check" name="btnradio" id="btnradio4" onclick="actualizarGrafico('blitz')">
                <label class="btn btn-outline-secondary" for="btnradio4">Blitz</label>
            </div>
        </div>
        <div class="card-body">
            <div class="chart-container">
                <canvas id="eloChart"></canvas>
            </div>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script src="{{ asset('js/deportistas/mielo.js') }}"></script>
@endpush
