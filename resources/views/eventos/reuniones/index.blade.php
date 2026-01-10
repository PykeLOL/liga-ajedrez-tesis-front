@extends('layouts.app')
@section('title', 'Reuniones y Asambleas - Liga Meta')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/eventos/reuniones.css') }}">
@endsection

@section('content')

@php
    $reuniones = [
        [
            'id' => 101,
            'titulo' => 'Asamblea General Ordinaria 2025',
            'tipo' => 'LIGA',
            'organizador' => 'Presidencia Liga Meta',
            'fecha' => '2025-03-15',
            'hora' => '02:00 PM',
            'lugar' => 'Auditorio IDERMETA',
            'motivo' => 'Elección de nuevos dignatarios y aprobación de presupuesto anual.',
            'asistentes_confirmados' => 14,
            'mi_estado' => false 
        ],
        [
            'id' => 102,
            'titulo' => 'Reunión Extraordinaria: Torneo Nacional',
            'tipo' => 'CLUB',
            'organizador' => 'Club Titán',
            'fecha' => '2025-03-20',
            'hora' => '06:30 PM',
            'lugar' => 'Sede Club Titán (Barrio El Buque)',
            'motivo' => 'Logística de viaje para la delegación que irá al Nacional en Cali. Costos y uniformes.',
            'asistentes_confirmados' => 8,
            'mi_estado' => true 
        ],
        [
            'id' => 103,
            'titulo' => 'Socialización Calendario II Semestre',
            'tipo' => 'LIGA',
            'organizador' => 'Comisión Técnica',
            'fecha' => '2025-04-05',
            'hora' => '09:00 AM',
            'lugar' => 'Virtual (Google Meet)',
            'motivo' => 'Definición de fechas para los selectivos departamentales.',
            'asistentes_confirmados' => 22,
            'mi_estado' => false
        ]
    ];
@endphp

<div class="container-fluid p-0">
    
    <div class="row mb-4 align-items-center">
        <div class="col-md-8">
            <h2 class="text-white fw-bold mb-1">
                <i class="bi bi-people-fill text-chess-green me-2"></i>Reuniones y Asambleas
            </h2>
            <p class="text-muted mb-0">Mantente informado y participa en las decisiones de tu comunidad.</p>
        </div>
        <div class="col-md-4 text-md-end mt-3 mt-md-0">
            <select class="form-select w-auto d-inline-block bg-dark text-light border-secondary">
                <option value="todas">Todas las reuniones</option>
                <option value="liga">Solo Liga</option>
                <option value="club">Mi Club</option>
            </select>
        </div>
    </div>

    <div class="row g-4">
        @foreach($reuniones as $reunion)
            @php
                $fechaObj = \Carbon\Carbon::parse($reunion['fecha']);
                $claseBorde = $reunion['tipo'] == 'LIGA' ? 'meeting-type-liga' : 'meeting-type-club';
                $badgeColor = $reunion['tipo'] == 'LIGA' ? 'bg-success' : 'bg-primary';
                $iconoTipo = $reunion['tipo'] == 'LIGA' ? 'bi-megaphone-fill' : 'bi-shield-shaded';
            @endphp

            <div class="col-12 col-xl-6">
                <div class="card card-meeting h-100 shadow-sm {{ $claseBorde }}">
                    <div class="card-body p-4 d-flex flex-column">
                        
                        {{-- Cabecera --}}
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div class="d-flex align-items-center gap-2">
                                <span class="badge {{ $badgeColor }} bg-opacity-75 d-flex align-items-center gap-1">
                                    <i class="bi {{ $iconoTipo }}"></i> {{ $reunion['tipo'] }}
                                </span>
                                <span class="text-muted small">
                                    <i class="bi bi-calendar3 ms-2"></i> {{ $fechaObj->isoFormat('D [de] MMMM, YYYY') }}
                                </span>
                            </div>
                            
                            <div class="attendance-badge text-muted border border-secondary">
                                <i class="bi bi-person-check-fill text-chess-green"></i>
                                <span>{{ $reunion['asistentes_confirmados'] }} confirmados</span>
                            </div>
                        </div>

                        <h4 class="fw-bold text-white mb-1">{{ $reunion['titulo'] }}</h4>
                        <p class="text-chess-green mb-3 small fw-semibold">
                            Convocado por: {{ $reunion['organizador'] }}
                        </p>

                        {{-- DETALLES (Aquí aplicamos el cambio de clase) --}}
                        <div class="meeting-details-box mb-4 flex-grow-1">
                            <div class="row g-2 mb-3">
                                <div class="col-md-6 small">
                                    <i class="bi bi-clock me-1"></i> 
                                    <strong>Hora:</strong> {{ $reunion['hora'] }}
                                </div>
                                <div class="col-md-6 small">
                                    <i class="bi bi-geo-alt me-1"></i> 
                                    <strong>Lugar:</strong> {{ $reunion['lugar'] }}
                                </div>
                            </div>
                            
                            <hr class="my-2">
                            
                            <div class="small mt-2">
                                <strong class="d-block mb-1 text-uppercase opacity-75" style="font-size: 0.7rem;">Orden del día / Motivo:</strong>
                                {{ $reunion['motivo'] }}
                            </div>
                        </div>

                        {{-- Botones --}}
                        <div class="d-flex gap-2 mt-auto">
                            @if($reunion['mi_estado'])
                                <button class="btn btn-success flex-grow-1 fw-bold" 
                                        onclick="toggleAsistencia(this, {{ $reunion['id'] }})">
                                    <i class="bi bi-check-circle-fill me-2"></i><span>Asistiré (Confirmado)</span>
                                </button>
                            @else
                                <button class="btn btn-chess-secondary flex-grow-1 fw-bold" 
                                        onclick="toggleAsistencia(this, {{ $reunion['id'] }})">
                                    <i class="bi bi-hand-thumbs-up me-2"></i><span>Asistiré</span>
                                </button>
                            @endif

                            <button class="btn btn-outline-secondary" title="Descargar PDF (Si existe)">
                                <i class="bi bi-file-earmark-pdf"></i>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>

@endsection

@push('scripts')
    <script src="{{ asset('js/eventos/reuniones.js') }}"></script>
@endpush 