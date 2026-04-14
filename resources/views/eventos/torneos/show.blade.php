@extends('layouts.app')
@section('title', 'Detalle del Torneo')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/eventos/torneos.css') }}">
@endsection

@section('content')
<div class="container py-4" id="torneoDetalle">
    <div class="mb-4">
        <h2 class="fw-bold text-white" id="tituloTorneo"></h2>
        <p class="text-muted mb-1" id="descripcionTorneo"></p>

        <span class="badge bg-success me-2" id="estadoTorneo"></span>
        <span class="badge bg-secondary" id="tipoEvento">
            {{ $tipoEventoNombre }}
        </span>
    </div>

    <div class="row g-4 mb-4">
        <div class="col-lg-8">
            <div class="card bg-dark-card mb-3">
                <div class="card-body">
                    <div class="row g-2" id="galeriaTorneo"></div>
                </div>
            </div>
            <div class="card bg-dark-card">
                <div class="card-header fw-bold text-white">
                    Categorías
                </div>
                <div class="card-body p-0">
                    <table class="table table-dark table-striped mb-0">
                        <thead>
                        <tr>
                            <th>Categoría</th>
                            <th>Inscritos</th>
                            <th>Cupos</th>
                            <th>Costo</th>
                        </tr>
                        </thead>
                        <tbody id="tablaCategorias"></tbody>
                    </table>
                </div>
            </div>

        </div>

        <div class="col-lg-4">
            <div class="card bg-dark-card mb-3">
                <div class="card-body small">
                    <p><i class="bi bi-calendar-event text-chess-green me-2"></i>
                        <span id="fechaTorneo"></span>
                    </p>
                    <p><i class="bi bi-clock text-chess-green me-2"></i>
                        <span id="horaTorneo"></span>
                    </p>
                    <p><i class="bi bi-geo-alt text-chess-green me-2"></i>
                        <span id="lugarTorneo"></span>
                    </p>
                    <a id="mapaTorneo" target="_blank"
                       class="btn btn-outline-secondary btn-sm w-100 mt-2">
                        Ver en Google Maps
                    </a>
                </div>
            </div>
            <div class="card bg-dark-card mb-3">
                <div class="card-body text-center">
                    <h5 class="fw-bold text-white">Inscripción</h5>
                    <p class="small text-muted" id="cuposTorneo"></p>

                    <button class="btn btn-chess fw-bold w-100">
                        Inscribirme
                    </button>
                </div>
            </div>
            <div class="card bg-dark-card">
                <div class="card-header fw-bold text-white">
                    Documentos
                </div>
                <div class="card-body" id="documentosTorneo"></div>
            </div>

        </div>
    </div>

    <div class="card bg-dark-card">
        <div class="card-header fw-bold text-white">
            Organizadores
        </div>
        <div class="card-body d-flex gap-3 flex-wrap" id="organizadoresTorneo"></div>
    </div>
</div>

<div class="modal fade" id="modalMedia" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content bg-dark border-0">
            <div class="modal-body p-0 position-relative">
                <button type="button"
                        class="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                        data-bs-dismiss="modal"></button>
                <button class="media-nav prev" onclick="cambiarMedia(-1)">
                    <i class="bi bi-chevron-left"></i>
                </button>
                <button class="media-nav next" onclick="cambiarMedia(1)">
                    <i class="bi bi-chevron-right"></i>
                </button>
                <div id="mediaViewer" class="p-4 text-center"></div>
                <div id="mediaDescripcion"
                     class="text-muted small text-center pb-3"></div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    const eventoId = {{ $eventoId }};
    const tipoEventoId = {{ $tipoEventoId }};
</script>
<script src="{{ asset('js/eventos/torneos.js') }}"></script>
@endpush
