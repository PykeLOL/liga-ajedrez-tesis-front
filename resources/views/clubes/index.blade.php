@extends('layouts.app')
@section('title', 'Clubes - Liga de Ajedrez')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/clubes/clubes.css') }}">
@endsection

@section('content')

<div class="container-fluid p-0">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
            <h2 class="text-white fw-bold mb-1">
                <i class="bi bi-shield-shaded text-chess-green me-2"></i>Clubes Afiliados
            </h2>
            <p class="text-muted mb-0">
                Únete a un club oficial o registra el tuyo ante la liga.
            </p>
        </div>
        <button
            class="btn btn-outline-light border-secondary"
            onclick="abrirModalRegistroClub()">
            <i class="bi bi-plus-circle me-2"></i>
            Registrar mi Club
        </button>
    </div>
    <div class="clubs-grid" id="clubsGrid"></div>
    <div class="mt-4 d-flex justify-content-center" id="paginacion"></div>
</div>

<div class="modal fade" id="modalAfiliacion" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-dark-chess text-white border-secondary">
            <div class="modal-header border-secondary">
                <h5 class="modal-title fw-bold">
                    <i class="bi bi-person-plus-fill text-chess-green me-2"></i>
                    Solicitar Afiliación
                </h5>
                <button
                    type="button"
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>
            </div>
            <div class="modal-body">
                <form id="formAfiliacion">
                    <input type="hidden" id="club_id_afiliacion">
                    <div class="alert alert-secondary bg-dark border-secondary d-flex align-items-start mb-4">
                        <i class="bi bi-info-circle-fill fs-4 text-chess-green me-3"></i>
                        <div class="small text-muted">
                            La solicitud será enviada al club seleccionado y será revisada por su presidente antes de aprobar tu afiliación.
                        </div>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold">
                                Club
                            </label>
                            <input
                                id="nombreClubAfiliacion"
                                type="text"
                                class="form-control"
                                readonly>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold">
                                Solicitante
                            </label>
                            <input
                                id="solicitanteAfiliacion"
                                type="text"
                                class="form-control"
                                readonly>
                            <div class="form-text text-muted">
                                Este usuario será el solicitante de la afiliación.
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted small fw-bold">
                                Fecha de nacimiento
                            </label>
                            <input
                                id="fechaNacimientoAfiliacion"
                                type="date"
                                class="form-control"
                                required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted small fw-bold">
                                Género
                            </label>
                            <select
                                id="generoAfiliacion"
                                class="form-select"
                                required>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted small fw-bold">
                                Nacionalidad
                            </label>
                            <select
                                id="nacionalidadAfiliacion"
                                class="form-select"
                                required>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold">
                                ID FIDE
                            </label>
                            <input
                                id="fideAfiliacion"
                                type="text"
                                class="form-control"
                                placeholder="Opcional">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-chess-green small fw-bold">
                                <i class="bi bi-file-earmark-check me-1"></i>
                                Documento de Identidad (PDF)
                            </label>
                            <input
                                id="documentoAfiliacion"
                                type="file"
                                class="form-control border-chess-green"
                                accept=".pdf"
                                required>
                            <div class="form-text text-muted">
                                Adjunta una copia legible de tu documento de identidad.
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-secondary">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">
                    Cancelar
                </button>
                <button
                    type="button"
                    id="btnEnviarSolicitudAfiliacion"
                    class="btn btn-chess fw-bold">
                    Enviar Solicitud
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modalRegistroClub" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-dark-chess text-white border-secondary">
            <div class="modal-header border-secondary">
                <h5 class="modal-title fw-bold">
                    <i class="bi bi-building-add text-chess-green me-2"></i>
                    Registrar Nuevo Club
                </h5>
                <button
                    type="button"
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>
            </div>
            <div class="modal-body">
                <form id="formRegistroClub">
                    <div class="alert alert-secondary bg-dark border-secondary d-flex align-items-start mb-4">
                        <i class="bi bi-info-circle-fill fs-4 text-chess-green me-3"></i>
                        <div class="small text-muted">
                            La solicitud será registrada con el usuario autenticado y será revisada por la Liga antes de aprobar el club.
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold">
                                Nombre del Club
                            </label>
                            <input
                                id="nombreClub"
                                type="text"
                                class="form-control"
                                placeholder="Ej. Club Los Centauros"
                                required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold">
                                <i class="bi bi-person-lock me-1 text-chess-green"></i>
                                Representante de la solicitud
                            </label>
                            <input
                                id="presidenteClub"
                                type="text"
                                class="form-control"
                                readonly>
                            <div class="form-text text-muted">
                                Este usuario será el solicitante del registro del club.
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold">
                                Municipio
                            </label>
                            <select
                                id="municipioClub"
                                class="form-select"
                                required>
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold">
                                Dirección / Sede
                            </label>
                            <input
                                id="direccionClub"
                                type="text"
                                class="form-control"
                                placeholder="Ej. Cra 40 #..."
                                required>
                        </div>

                        <div class="col-12">
                            <label class="form-label text-muted small fw-bold">
                                Descripción del Club
                            </label>
                            <textarea
                                id="descripcionClub"
                                rows="3"
                                class="form-control"
                                placeholder="Describe brevemente el club, sus objetivos y actividades."
                                required></textarea>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-bold">
                                Logo del Club
                            </label>
                            <input
                                id="logoClub"
                                type="file"
                                class="form-control"
                                accept="image/*"
                                required>
                            <div class="form-text text-muted">
                                Imagen representativa del club.
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label text-chess-green small fw-bold">
                                <i class="bi bi-file-earmark-check me-1"></i>
                                Reconocimiento Deportivo (PDF)
                            </label>
                            <input
                                id="documentoClub"
                                type="file"
                                class="form-control border-chess-green"
                                accept=".pdf"
                                required>

                            <div class="form-text text-muted">
                                Documento obligatorio para validar el club.
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-secondary">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">
                    Cancelar
                </button>
                <button
                    type="button"
                    id="btnEnviarSolicitudClub"
                    class="btn btn-chess fw-bold">
                    Enviar a Validación
                </button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/clubes/clubes.js') }}"></script>
    <script src="{{ asset('js/clubes/solicitudes.js') }}"></script>
@endpush
