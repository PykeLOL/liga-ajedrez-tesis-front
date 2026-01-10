@extends('layouts.app')
@section('title', 'Clubes - Liga de Ajedrez')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/clubes/clubes.css') }}">
@endsection

@section('content')

@php
    // DATOS SIMULADOS (Esto vendría de tu BD)
    $clubes = [
        [
            'id' => 1,
            'nombre' => 'Club Alfil Negro',
            'presidente' => 'Carlos Martínez',
            'municipio' => 'Villavicencio',
            'direccion' => 'Polideportivo La Esperanza',
            'descripcion' => 'Dedicados a la formación de talentos juveniles desde 2010. Entrenamientos intensivos.',
            'logo' => 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png' // Icono ejemplo
        ],
        [
            'id' => 2,
            'nombre' => 'Club Rey de Reyes',
            'presidente' => 'Ana Sofía López',
            'municipio' => 'Acacías',
            'direccion' => 'Casa de la Cultura',
            'descripcion' => 'El ajedrez es cultura. Promovemos el deporte ciencia en todo el municipio.',
            'logo' => 'https://cdn-icons-png.flaticon.com/512/2646/2646960.png'
        ],
        [
            'id' => 3,
            'nombre' => 'Jaque Mate Granada',
            'presidente' => 'Pedro Pérez',
            'municipio' => 'Granada',
            'direccion' => 'Parque Central',
            'descripcion' => 'Club recreativo y competitivo. Torneos blitz todos los viernes.',
            'logo' => 'https://cdn-icons-png.flaticon.com/512/4121/4121044.png'
        ]
    ];
@endphp

<div class="container-fluid p-0">
    
    {{-- Encabezado --}}
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
            <h2 class="text-white fw-bold mb-1">
                <i class="bi bi-shield-shaded text-chess-green me-2"></i>Clubes Afiliados
            </h2>
            <p class="text-muted mb-0">Únete a un club oficial o registra el tuyo ante la liga.</p>
        </div>
        {{-- Botón para Propietarios --}}
        <button class="btn btn-outline-light border-secondary" onclick="abrirModalRegistroClub()">
            <i class="bi bi-plus-circle me-2"></i>Registrar mi Club
        </button>
    </div>

    {{-- Grid de Clubes --}}
    <div class="clubs-grid">
        @foreach($clubes as $club)
            <div class="club-card">
                <div class="club-header">
                    <img src="{{ $club['logo'] }}" alt="Logo {{ $club['nombre'] }}" class="club-logo">
                </div>
                <div class="club-body">
                    <div class="club-title">{{ $club['nombre'] }}</div>
                    <div class="club-president">Pres. {{ $club['presidente'] }}</div>
                    
                    <div class="club-info-item">
                        <i class="bi bi-geo-alt-fill"></i>
                        <span>{{ $club['municipio'] }}</span>
                    </div>
                    <div class="club-info-item">
                        <i class="bi bi-pin-map-fill"></i>
                        <span>{{ $club['direccion'] }}</span>
                    </div>
                    
                    <div class="club-desc">
                        "{{ $club['descripcion'] }}"
                    </div>
                </div>
                <div class="club-footer">
                    <button class="btn btn-chess w-100 fw-bold" 
                            onclick="abrirModalAfiliacion({{ $club['id'] }}, '{{ $club['nombre'] }}')">
                        Solicitar Afiliación
                    </button>
                </div>
            </div>
        @endforeach
    </div>

</div>

{{-- MODAL 1: AFILIARSE A UN CLUB (Para deportistas) --}}
<div class="modal fade" id="modalAfiliacion" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark-chess text-white border-secondary">
            <div class="modal-header border-secondary">
                <h5 class="modal-title fw-bold">
                    <i class="bi bi-person-plus-fill text-chess-green me-2"></i>Afiliarse a <span id="lblNombreClub" class="text-chess-green"></span>
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="formAfiliacion">
                    <input type="hidden" id="club_id_afiliacion">
                    
                    <div class="alert alert-secondary bg-dark border-secondary d-flex align-items-center mb-3">
                        <i class="bi bi-info-circle fs-4 me-3 text-chess-green"></i>
                        <div class="small text-muted">
                            Tus datos personales se tomarán de tu perfil. Solo necesitamos los documentos requeridos.
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label small fw-bold text-muted">1. Copia de Documento (PDF)</label>
                        <input type="file" class="form-control form-control-sm" accept=".pdf" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label small fw-bold text-muted">2. Certificado EPS/Seguro (PDF)</label>
                        <input type="file" class="form-control form-control-sm" accept=".pdf" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-secondary">
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-chess fw-bold" onclick="enviarSolicitudAfiliacion()">
                    Enviar Solicitud
                </button>
            </div>
        </div>
    </div>
</div>

{{-- MODAL 2: REGISTRAR NUEVO CLUB (Para propietarios) --}}
<div class="modal fade" id="modalRegistroClub" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-dark-chess text-white border-secondary">
            <div class="modal-header border-secondary">
                <h5 class="modal-title fw-bold">
                    <i class="bi bi-building-add text-chess-green me-2"></i>Registrar Nuevo Club
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="formRegistroClub">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold">Nombre del Club</label>
                            <input type="text" class="form-control" placeholder="Ej. Club Los Centauros" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold">Presidente / Representante</label>
                            <input type="text" class="form-control" placeholder="Nombre completo" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold">Municipio</label>
                            <select class="form-select">
                                <option>Villavicencio</option>
                                <option>Acacías</option>
                                <option>Granada</option>
                                <option>Restrepo</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold">Dirección / Sede</label>
                            <input type="text" class="form-control" placeholder="Ej. Cra 40 #..." required>
                        </div>
                        <div class="col-12">
                            <label class="form-label text-muted small fw-bold">Descripción Breve</label>
                            <textarea class="form-control" rows="2" placeholder="Describe el club..."></textarea>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold">Logo del Club (Imagen)</label>
                            <input type="file" class="form-control" accept="image/*">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label text-chess-green small fw-bold">
                                <i class="bi bi-file-earmark-check me-1"></i>Reconocimiento Deportivo (PDF)
                            </label>
                            <input type="file" class="form-control border-chess-green" accept=".pdf" required>
                            <div class="form-text text-muted" style="font-size: 0.7rem;">
                                Requisito indispensable para validar el club.
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-secondary">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-chess fw-bold" onclick="enviarRegistroClub()">
                    Enviar a Validación
                </button>
            </div>
        </div>
    </div>
</div>

@endsection

@push('scripts')
    <script src="{{ asset('js/clubes/clubes.js') }}"></script>
@endpush