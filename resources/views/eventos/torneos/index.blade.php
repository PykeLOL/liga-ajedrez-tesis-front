@extends('layouts.app')
@section('title', 'Torneos Oficiales - Liga Meta')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/eventos/torneos.css') }}">
@endsection

@section('content')

@php
    // DATOS DE EJEMPLO
    $torneos = [
        [
            'id' => 1,
            'nombre' => 'IRT Clásico "Ciudad de Villavicencio" 2025',
            'fecha_inicio' => '2025-05-15',
            'hora' => '09:00 AM',
            'lugar' => 'Biblioteca Germán Arciniegas',
            'ritmo' => 'Clásico (90+30)',
            'elo_req' => 'Sub-2000',
            'estado' => 'abierto', 
            'cupos' => '45/100',
            'imagen' => 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=500&q=80'
        ],
        [
            'id' => 2,
            'nombre' => 'Torneo Blitz Relámpago',
            'fecha_inicio' => '2025-05-20',
            'hora' => '06:00 PM',
            'lugar' => 'Club Titán',
            'ritmo' => 'Blitz (3+2)',
            'elo_req' => 'Abierto',
            'estado' => 'abierto',
            'cupos' => '12/50',
            'imagen' => 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&w=500&q=80'
        ],
        [
            'id' => 3,
            'nombre' => 'Departamental Sub-14 Clasificatorio',
            'fecha_inicio' => '2025-06-01',
            'hora' => '08:00 AM',
            'lugar' => 'Coliseo La Grama',
            'ritmo' => 'Rápido (15+10)',
            'elo_req' => 'Solo Sub-14',
            'estado' => 'proximo',
            'cupos' => '0/80',
            'imagen' => 'https://plus.unsplash.com/premium_photo-1673814660307-a7201b6357dd?q=80&w=500&auto=format&fit=crop'
        ]
    ];
@endphp

<div class="container-fluid p-0">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="text-white fw-bold mb-1"><i class="bi bi-trophy-fill text-chess-green me-2"></i>Torneos Oficiales</h2>
            <p class="text-muted mb-0">Inscríbete y compite en los eventos válidos para ELO.</p>
        </div>
        <div class="btn-group">
            <button type="button" class="btn btn-chess-secondary active">Próximos</button>
            <button type="button" class="btn btn-chess-secondary">Finalizados</button>
        </div>
    </div>

    <div class="row g-4">
        @foreach($torneos as $torneo)
            @php
                $fechaObj = \Carbon\Carbon::parse($torneo['fecha_inicio']);
            @endphp

            <div class="col-12 col-xl-6">
                {{-- CARD PRINCIPAL --}}
                <div class="card card-tournament h-100 shadow-sm">
                    <div class="card-tournament-inner">
                        
                        {{-- 1. FECHA (Izquierda) --}}
                        <div class="ticket-date">
                            <span class="text-chess-green fw-bold text-uppercase small ls-1">{{ $fechaObj->translatedFormat('M') }}</span>
                            <span class="text-white fw-bold display-5 lh-1 my-1">{{ $fechaObj->format('d') }}</span>
                            <small class="text-muted">{{ $fechaObj->format('Y') }}</small>
                        </div>

                        {{-- 2. IMAGEN (Centro) - ¡Aquí está de vuelta! --}}
                        <div class="tournament-img-wrapper">
                            <img src="{{ $torneo['imagen'] }}" alt="Imagen torneo">
                        </div>

                        {{-- 3. INFO (Derecha) --}}
                        <div class="tournament-body">
                            
                            {{-- Badges Header --}}
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="badge bg-secondary text-light small border border-secondary">{{ $torneo['ritmo'] }}</span>
                                <span class="badge small {{ $torneo['estado'] == 'abierto' ? 'badge-inscripcion-open' : 'badge-inscripcion-soon' }}">
                                    {{ $torneo['estado'] == 'abierto' ? 'Abierto' : 'Pronto' }}
                                </span>
                            </div>

                            {{-- Título Limitado --}}
                            <h5 class="fw-bold text-white mb-1 text-limit-1" title="{{ $torneo['nombre'] }}">
                                {{ $torneo['nombre'] }}
                            </h5>
                            
                            {{-- Info Ubicación Limitada --}}
                            <div class="text-muted small mb-3 text-limit-1">
                                <i class="bi bi-geo-alt-fill me-1 text-chess-green"></i> {{ $torneo['lugar'] }}
                                <span class="mx-1">•</span>
                                <i class="bi bi-clock me-1"></i> {{ $torneo['hora'] }}
                            </div>

                            {{-- Footer --}}
                            <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-10">
                                <small class="text-muted"><i class="bi bi-people-fill me-1"></i> {{ $torneo['cupos'] }}</small>
                                
                                <button class="btn btn-sm btn-chess px-3" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#modalTorneo"
                                        onclick="cargarInfoTorneo({{ json_encode($torneo) }})">
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>

{{-- EL MODAL Y EL JS SIGUEN IGUAL --}}
<div class="modal fade" id="modalTorneo" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-dark-card text-white border border-secondary">
            <div class="modal-header border-secondary">
                <h5 class="modal-title fw-bold" id="modalTitulo">...</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-0">
                <div class="row g-0">
                    <div class="col-md-5 d-none d-md-block" style="min-height: 300px; position:relative;">
                        <img id="modalImagen" src="" class="img-fluid h-100 w-100 object-fit-cover position-absolute" alt="...">
                    </div>
                    <div class="col-md-7 p-4">
                        <div class="d-flex gap-2 mb-3">
                            <span class="badge bg-chess-green" id="modalRitmo">Ritmo</span>
                            <span class="badge bg-dark border border-secondary" id="modalElo">ELO</span>
                        </div>
                        <h6 class="text-chess-green fw-bold mb-3 text-uppercase ls-1">Información General</h6>
                        <ul class="list-unstyled text-muted mb-4">
                            <li class="mb-2"><i class="bi bi-calendar-check me-2 text-white"></i> <span id="modalFecha"></span></li>
                            <li class="mb-2"><i class="bi bi-clock me-2 text-white"></i> <span id="modalHora"></span></li>
                            <li class="mb-2"><i class="bi bi-geo-alt me-2 text-white"></i> <span id="modalLugar"></span></li>
                        </ul>
                        <div class="alert bg-dark-subtle border-chess-green text-light d-flex align-items-center p-2 small">
                            <i class="bi bi-info-circle-fill text-chess-green fs-5 me-2"></i>
                            <div>Al inscribirte aceptas el reglamento.</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer border-secondary justify-content-between">
                <button type="button" class="btn btn-chess-secondary" data-bs-dismiss="modal">Cerrar</button>
                <form id="formInscripcion" action="" method="POST">
                    @csrf
                    <input type="hidden" name="torneo_id" id="inputTorneoId">
                    <button type="submit" class="btn btn-chess fw-bold">Confirmar Inscripción</button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/eventos/torneos.js') }}"></script>
@endpush