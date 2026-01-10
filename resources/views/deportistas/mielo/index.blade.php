@extends('layouts.app')
@section('title', 'Mi ELO y Progreso')
@section('header_title', 'Estadísticas del Jugador')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/deportistas/mielo.css') }}">
@endsection

@section('content')

{{-- Librería Chart.js --}}
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div class="container-fluid p-0">

    <div class="row g-4 mb-4">
        
        {{-- COLUMNA IZQUIERDA: PERFIL --}}
        <div class="col-lg-4">
            <div class="card bg-card border-0 shadow-sm h-100">
                <div class="card-body text-center p-4">
                    
                    <div class="profile-img-container">
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" 
                             alt="Foto Perfil" class="profile-img">
                        <span class="badge bg-danger border border-dark rounded-pill badge-title">IM</span>
                    </div>

                    <h4 class="text-white fw-bold mb-1">Carlos Rodríguez</h4>
                    <p class="text-muted mb-3">
                        <i class="bi bi-geo-alt-fill text-chess-green"></i> Villavicencio, Meta
                    </p>

                    <div class="d-flex justify-content-center gap-2 mb-4">
                        <span class="badge bg-dark-subtle border border-secondary text-white fw-normal px-3 py-2">
                            ID FIDE: 1234567
                        </span>
                        <span class="badge bg-dark-subtle border border-secondary text-white fw-normal px-3 py-2">
                            Edad: 24
                        </span>
                    </div>

                    <div class="row g-2 text-center border-top border-secondary pt-3">
                        <div class="col-4 border-end border-secondary">
                            <h5 class="fw-bold text-white mb-0">145</h5>
                            <small class="text-muted small-label">PARTIDAS</small>
                        </div>
                        <div class="col-4 border-end border-secondary">
                            <h5 class="fw-bold text-success mb-0">60%</h5>
                            <small class="text-muted small-label">VICTORIAS</small>
                        </div>
                        <div class="col-4">
                            <h5 class="fw-bold text-white mb-0">#4</h5>
                            <small class="text-muted small-label">RANKING</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- COLUMNA DERECHA: TARJETAS DE ELO --}}
        <div class="col-lg-8">
            <div class="row g-3 h-100">
                
                {{-- Standard --}}
                <div class="col-md-4">
                    <div class="elo-card h-100 d-flex flex-column">
                        <div class="elo-icon-bg"><i class="bi bi-clock"></i></div>
                        <div class="card-body flex-grow-1">
                            <h6 class="text-muted text-uppercase small fw-bold mb-3">Clásico (Standard)</h6>
                            <h2 class="display-5 fw-bold text-white mb-1">1850</h2>
                            <span class="badge bg-success bg-opacity-10 text-success border border-success">
                                <i class="bi bi-arrow-up-short"></i> +12
                            </span>
                            <small class="text-muted ms-2">este mes</small>
                        </div>
                        <div class="progress progress-dark mt-auto mx-3 mb-3">
                            <div class="progress-bar bg-primary" style="width: 70%"></div>
                        </div>
                    </div>
                </div>

                {{-- Rapid --}}
                <div class="col-md-4">
                    <div class="elo-card h-100 d-flex flex-column">
                        <div class="elo-icon-bg"><i class="bi bi-stopwatch"></i></div>
                        <div class="card-body flex-grow-1">
                            <h6 class="text-muted text-uppercase small fw-bold mb-3">Rápido (Rapid)</h6>
                            <h2 class="display-5 fw-bold text-white mb-1">1920</h2>
                            <span class="badge bg-danger bg-opacity-10 text-danger border border-danger">
                                <i class="bi bi-arrow-down-short"></i> -5
                            </span>
                            <small class="text-muted ms-2">este mes</small>
                        </div>
                        <div class="progress progress-dark mt-auto mx-3 mb-3">
                            <div class="progress-bar bg-warning" style="width: 75%"></div>
                        </div>
                    </div>
                </div>

                {{-- Blitz --}}
                <div class="col-md-4">
                    <div class="elo-card h-100 d-flex flex-column">
                        <div class="elo-icon-bg"><i class="bi bi-lightning-charge"></i></div>
                        <div class="card-body flex-grow-1">
                            <h6 class="text-muted text-uppercase small fw-bold mb-3">Blitz</h6>
                            <h2 class="display-5 fw-bold text-white mb-1">1780</h2>
                            <span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">
                                <i class="bi bi-dash"></i> 0
                            </span>
                            <small class="text-muted ms-2">este mes</small>
                        </div>
                        <div class="progress progress-dark mt-auto mx-3 mb-3">
                            <div class="progress-bar bg-danger" style="width: 65%"></div>
                        </div>
                    </div>
                </div>

                {{-- Resumen Actividad --}}
                <div class="col-12 mt-3">
                    <div class="card bg-dark-chess text-white border-0 h-100">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h5 class="fw-bold mb-1">Último Torneo Jugado</h5>
                                <p class="text-muted mb-0">Torneo Departamental Clasificatorio - Villavicencio</p>
                            </div>
                            <div class="text-end">
                                <span class="d-block fs-5 fw-bold text-chess-green">4.5 / 7</span>
                                <small class="text-muted">Puntos</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- SECCIÓN GRÁFICO --}}
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

                <input type="radio" class="btn-check" name="btnradio" id="btnradio3" onclick="actualizarGrafico('blitz')">
                <label class="btn btn-outline-secondary" for="btnradio3">Blitz</label>
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

{{-- INYECCIÓN DEL SCRIPT SEPARADO --}}
@push('scripts')
    <script src="{{ asset('js/deportistas/mielo.js') }}"></script>
@endpush