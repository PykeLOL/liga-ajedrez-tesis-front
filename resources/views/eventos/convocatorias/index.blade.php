@extends('layouts.app')
@section('title', 'Procesos de Selección - Liga Meta')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/eventos/convocatorias.css') }}">
@endsection

@section('content')

@php
    $procesos = [
        [
            'id' => 1,
            'titulo' => 'Selectivo Juegos Nacionales 2026',
            'modalidad' => 'Equipos (5 Tableros)',
            'fase_actual' => 'RESULTADOS_TORNEO',
            'cupos_disponibles' => 4,
            'descripcion' => 'Torneo Suizo a 7 rondas válido para ELO FIDE.',
            'fecha_limite' => '2025-02-10', // Fecha ya pasada
            'pdf_resolucion' => '/downloads/res-001-juegos-nacionales.pdf',
            'ranking' => [
                ['pos' => 1, 'nombre' => 'CM Jhon Doe', 'elo' => 2250, 'ptos' => 6.5, 'club' => 'Titán'],
                ['pos' => 2, 'nombre' => 'Ana Smith', 'elo' => 2100, 'ptos' => 6.0, 'club' => 'Alfil'],
                ['pos' => 3, 'nombre' => 'Carlos R.', 'elo' => 2050, 'ptos' => 5.5, 'club' => 'Peón'],
                ['pos' => 4, 'nombre' => 'Luisa Lane', 'elo' => 1980, 'ptos' => 5.0, 'club' => 'Jaque'],
                ['pos' => 5, 'nombre' => 'Pedro P.', 'elo' => 1950, 'ptos' => 4.5, 'club' => 'Titán'],
                ['pos' => 6, 'nombre' => 'Marta G.', 'elo' => 1800, 'ptos' => 4.0, 'club' => 'Alfil'],
            ],
            'mi_posicion' => 5 
        ],
        [
            'id' => 2,
            'titulo' => 'Nacional Sub-20 Individual',
            'modalidad' => 'Individual (Financiado)',
            'fase_actual' => 'INSCRIPCION_TORNEO',
            'cupos_disponibles' => 2,
            'descripcion' => 'Torneo clasificatorio Rápido (15+10).',
            'fecha_limite' => '2025-06-20', // Fecha futura
            'pdf_resolucion' => '/downloads/res-005-sub20.pdf',
            'ranking' => [],
            'mi_posicion' => null,
            'inscrito' => false 
        ]
    ];
@endphp

<div class="container-fluid p-0">
    <div class="mb-4">
        <h2 class="text-white fw-bold mb-1">
            <i class="bi bi-diagram-3-fill text-chess-green me-2"></i>Procesos de Selección
        </h2>
        <p class="text-muted mb-0">La selección se gana en el tablero. Consulta tu rendimiento y clasificación.</p>
    </div>

    <div class="row g-4">
        @foreach($procesos as $proc)
            @php
                // Cálculo simple de días restantes para la etiqueta de urgencia
                $limite = \Carbon\Carbon::parse($proc['fecha_limite']);
                $hoy = \Carbon\Carbon::now();
                $diasRestantes = $hoy->diffInDays($limite, false);
                $esUrgente = $diasRestantes > 0 && $diasRestantes <= 3;
            @endphp

            <div class="col-lg-6">
                <div class="card card-convocatoria h-100">
                    
                    {{-- Header Fase --}}
                    <div class="convocatoria-header">
                        <span class="badge bg-dark border border-secondary">{{ $proc['modalidad'] }}</span>
                        @if($proc['fase_actual'] == 'INSCRIPCION_TORNEO')
                            <span class="badge bg-primary bg-opacity-25 text-primary border border-primary">Inscripción Abierta</span>
                        @elseif($proc['fase_actual'] == 'RESULTADOS_TORNEO')
                            <span class="badge bg-warning bg-opacity-10 text-warning border border-warning">Resultados Preliminares</span>
                        @endif
                    </div>

                    <div class="card-body p-4 d-flex flex-column">
                        
                        {{-- Título y Botón PDF --}}
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h4 class="fw-bold text-white mb-1">{{ $proc['titulo'] }}</h4>
                                <p class="text-muted small mb-0">{{ $proc['descripcion'] }}</p>
                            </div>
                            <a href="{{ $proc['pdf_resolucion'] }}" class="btn btn-sm btn-outline-secondary ms-2 text-nowrap" target="_blank" title="Ver Resolución Completa">
                                <i class="bi bi-file-earmark-pdf text-danger"></i> PDF
                            </a>
                        </div>

                        {{-- Información de Fechas (Deadline) --}}
                        <div class="mb-3">
                             @if($proc['fase_actual'] == 'INSCRIPCION_TORNEO')
                                <div class="d-inline-flex align-items-center px-2 py-1 rounded border {{ $esUrgente ? 'bg-danger bg-opacity-10 border-danger text-danger' : 'bg-dark border-secondary text-muted' }}">
                                    <i class="bi bi-calendar-event me-2"></i>
                                    <small class="fw-bold">Cierre de Inscripción: {{ $limite->isoFormat('D [de] MMMM') }}</small>
                                </div>
                             @else
                                <div class="d-inline-flex align-items-center px-2 py-1 rounded bg-dark border border-secondary text-muted">
                                    <i class="bi bi-calendar-check me-2 text-chess-green"></i>
                                    <small>Fase de Inscripción Finalizada</small>
                                </div>
                             @endif
                        </div>

                        {{-- CAJA OSCURA DE DETALLES (Aquí aplicamos el contraste corregido) --}}
                        <div class="convocatoria-details-box mb-3 flex-grow-1">
                            
                            @if($proc['fase_actual'] == 'RESULTADOS_TORNEO')
                                {{-- TABLA DE RESULTADOS --}}
                                <h6 class="text-uppercase fw-bold mb-3 small ls-1 border-bottom border-secondary pb-2">
                                    <i class="bi bi-list-ol me-2"></i>Posiciones Parciales
                                </h6>
                                
                                <div class="table-responsive">
                                    <table class="merit-table">
                                        <tbody>
                                            @foreach($proc['ranking'] as $jugador)
                                                @php
                                                    $clasificado = $jugador['pos'] <= $proc['cupos_disponibles'];
                                                    $esMiUsuario = ($jugador['pos'] == $proc['mi_posicion']);
                                                @endphp
                                                <tr class="{{ $clasificado ? 'row-qualified' : 'row-eliminated' }} {{ $esMiUsuario ? 'border border-light' : '' }}">
                                                    <td><div class="rank-badge">{{ $jugador['pos'] }}</div></td>
                                                    <td class="w-100">
                                                        <div class="d-flex flex-column">
                                                            <span class="fw-bold text-white small">
                                                                {{ $jugador['nombre'] }} 
                                                                @if($esMiUsuario) <span class="badge bg-light text-dark ms-1" style="font-size: 0.65rem;">YO</span> @endif
                                                            </span>
                                                            <span class="small" style="color: #bbb;">{{ $jugador['club'] }} • {{ $jugador['elo'] }}</span>
                                                        </div>
                                                    </td>
                                                    <td class="text-end fw-bold text-chess-green">{{ $jugador['ptos'] }}</td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                                <div class="text-center mt-2">
                                    <small class="text-muted fst-italic" style="font-size: 0.75rem;">Clasifican los {{ $proc['cupos_disponibles'] }} primeros tableros.</small>
                                </div>

                            @else
                                {{-- INFO PREVIA AL TORNEO --}}
                                <div class="d-flex flex-column justify-content-center align-items-center text-center py-4">
                                    <i class="bi bi-trophy text-secondary mb-3 opacity-50" style="font-size: 3rem;"></i>
                                    <h6 class="fw-bold text-white">¡Prepárate para competir!</h6>
                                    <p class="small text-muted mb-0">Disputa uno de los <strong class="text-chess-green">{{ $proc['cupos_disponibles'] }} cupos financiados</strong>.</p>
                                </div>
                            @endif
                        </div>

                        {{-- Botones de Acción --}}
                        <div class="mt-auto">
                            @if($proc['fase_actual'] == 'RESULTADOS_TORNEO')
                                @if($proc['mi_posicion'] <= $proc['cupos_disponibles'])
                                    <div class="alert alert-success d-flex align-items-center mb-2 py-2 small border-0 bg-success bg-opacity-25 text-white">
                                        <i class="bi bi-check-circle-fill me-2 fs-5"></i>
                                        <div>¡Clasificado! Confirma tu cupo.</div>
                                    </div>
                                    <button class="btn btn-chess w-100 fw-bold" 
                                            onclick="confirmarCupo({{ $proc['id'] }}, '{{ $proc['titulo'] }}')">
                                        Confirmar Selección
                                    </button>
                                @else
                                    <div class="alert alert-secondary bg-dark border-secondary d-flex align-items-center mb-2 py-2 text-muted small">
                                        <i class="bi bi-x-circle me-2 fs-5"></i>
                                        <div>Puntaje insuficiente para clasificar.</div>
                                    </div>
                                    <button class="btn btn-outline-secondary w-100 btn-sm" 
                                            onclick="verRankingCompleto({{ $proc['id'] }})">
                                        Ver Ranking Completo
                                    </button>
                                @endif
                            @else
                                @if($proc['inscrito'])
                                    <button class="btn btn-success w-100 fw-bold disabled opacity-75">
                                        <i class="bi bi-check-circle-fill me-2"></i>Inscrito
                                    </button>
                                @else
                                    <button class="btn btn-chess w-100 fw-bold" 
                                            onclick="inscribirTorneoClasificatorio({{ $proc['id'] }}, '{{ $proc['titulo'] }}')">
                                        Inscribirme al Torneo
                                    </button>
                                @endif
                            @endif
                        </div>

                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/eventos/convocatorias.js') }}"></script>
@endpush