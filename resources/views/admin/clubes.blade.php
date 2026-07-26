@extends('layouts.admin.app')
@section('title', 'Gestión de Clubes')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/admin/clubes.css') }}">
@endsection

@section('content')

<div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
    <h2 class="fw-bold d-flex align-items-center text-primary title-principal">
        <i data-lucide="handshake" class="me-2 icono-titulo"></i>
        Lista de Clubes
    </h2>
</div>

<div class="table-responsive shadow rounded">
    <button class="btnNuevo btn btn-success mb-3 d-none shadow-sm fw-semibold px-3 py-2 d-flex align-items-center gap-2">
        <i data-lucide="plus-circle" class="icono-boton"></i>
        <span>Agregar Club</span>
    </button>
</div>

<div class="card border-0 shadow-lg" style="background-color: transparent;">
    <div class="table-responsive rounded-2">
        <table id="clubesTable" class="table align-middle mb-0 w-100">
            <thead class="text-center" style="background-color: rgba(0,0,0,0.3); color: #81b64c;">
                <tr>
                    <th style="width: 50px;">ID</th>
                    <th>Logo</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Ubicación</th>
                    <th>Presidente</th>
                    <th>Contacto</th>
                    <th class="text-end">Acciones</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>

<div class="modal fade" id="modalImagenClub" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-dark border-0">
            <div class="modal-body p-2 text-center position-relative">
                <button type="button"
                        class="btn-close btn-close-white position-absolute top-0 end-0 m-2"
                        data-bs-dismiss="modal"></button>
                <img id="imagenClubPreview"
                     src=""
                     class="img-fluid rounded shadow"
                     style="max-height: 80vh;">
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="clubModal" tabindex="-1" aria-labelledby="clubModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-xl">
    <div class="modal-content" style="background-color:#262421;color:white;border:1px solid rgba(255,255,255,0.1);">
      <div class="modal-header border-bottom">
        <h5 class="modal-title d-flex align-items-center gap-2" id="clubModalLabel">
            <i data-lucide="trophy" style="width:22px;color:#81b64c"></i>
            Gestión de Club
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body p-4">
        <form id="clubForm">
            <input type="hidden" id="clubId">
            <div class="mb-4 text-center">
                <label class="form-label d-block mb-2">Logo del club *</label>

                <div class="d-flex flex-column align-items-center gap-2">
                    <div class="logo-preview logo-preview-centered">
                        <span class="text-muted small">Sin logo</span>
                    </div>

                    <input type="file"
                        id="logo"
                        class="form-control form-control-sm w-auto"
                        accept="image/*">

                    <small class="text-muted">
                        JPG, PNG o WEBP
                    </small>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3 section-disabled">
                    <label class="form-label">Liga</label>
                    <select id="liga_id" class="form-control required" disabled></select>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Nombre *</label>
                    <input type="text" id="nombre" class="form-control required">
                </div>

                <div class="col-md-6 mb-3">
                    <label class="form-label">Presidente *</label>
                    <select id="presidente_id" class="form-control required"></select>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Descripcion *</label>
                <textarea id="descripcion" class="form-control" rows="3"></textarea>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Ubicacion *</label>
                    <input type="text" id="ubicacion" class="form-control required">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Dirección *</label>
                    <input type="text" id="direccion" class="form-control">
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">URL mapa</label>
                    <input type="url" id="url_mapa" class="form-control">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Contacto (email)*</label>
                    <input type="email" id="contacto" class="form-control required">
                </div>
            </div>

            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="form-label m-0">Media</label>
                    <button type="button" class="btn btn-sm btn-success" id="addMedia">
                        + Agregar media
                    </button>
                </div>
                <div id="mediaContainer" class="row g-3"></div>
            </div>

            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="form-label m-0">Redes Sociales</label>
                    <button type="button" class="btn btn-sm btn-outline-success" id="addRedSocial">
                        + Agregar red social
                    </button>
                </div>
                <div id="redesSocialesContainer" class="row g-3"></div>
            </div>
        </form>
      </div>

        <div class="modal-footer border-top d-flex justify-content-between">
            <button type="button"
                    class="btn btn-outline-secondary"
                    data-bs-dismiss="modal">
                Cancelar
            </button>
            <div class="d-flex gap-2">
                <button type="button"
                        class="btn btn-primary"
                        id="btnPublicar"
                        style="background:#81b64c;border:none">
                    Guardar
                </button>
            </div>
        </div>
    </div>
  </div>
</div>

@endsection

@push('scripts')
<script src="{{ asset('js/admin/clubes/clubes.js') }}"></script>
<script src="{{ asset('js/admin/clubes/media.js') }}"></script>
<script src="{{ asset('js/admin/clubes/redesSociales.js') }}"></script>
@endpush
