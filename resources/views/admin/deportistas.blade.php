@extends('layouts.admin.app')
@section('title', 'Gestión de Deportistas')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/admin/deportistas.css') }}">
@endsection

@section('content')

<div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3" style="border-color: rgba(255,255,255,0.1) !important;">
    <h2 class="title-principal d-flex align-items-center m-0 text-white">
        <i data-lucide="biceps-flexed" class="me-3 text-success" style="width: 32px; height: 32px;"></i>
        Lista de Deportistas
    </h2>
</div>
    <div class="mb-3">
        <button class="btnNuevo btn d-none shadow-sm fw-bold px-4 py-2 d-flex align-items-center gap-2 rounded-2 text-white"
                style="background-color: #81b64c; border:none;">
            <i data-lucide="plus-circle" style="width: 18px;"></i>
            <span>Agregar Deportista</span>
        </button>
    </div>
<div class="card border-0 shadow-lg" style="background-color: transparent;">
    <div class="table-responsive rounded-2">
        <table id="deportistasTable" class="table align-middle mb-0 w-100">
            <thead class="text-center" style="background-color: rgba(0,0,0,0.3); color: #81b64c;">
                <tr>
                    <th style="width: 50px;">ID</th>
                    <th>Foto</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Titulo</th>
                    <th>Elo Nacional</th>
                    <th>Elo Internacional</th>
                    <th>Fidu ID</th>
                    <th>Club Logo</th>
                    <th>Club Nombre</th>
                    <th class="text-end">Acciones</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>

<div class="modal fade" id="modalImagenDeportista" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-dark border-0">
            <div class="modal-body p-2 text-center position-relative">
                <button type="button"
                        class="btn-close btn-close-white position-absolute top-0 end-0 m-2"
                        data-bs-dismiss="modal"></button>
                <img id="imagenDeportistaPreview"
                     src=""
                     class="img-fluid rounded shadow"
                     style="max-height: 80vh;">
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="deportistaModal" tabindex="-1" aria-labelledby="deportistaModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-xl">
    <div class="modal-content" style="background-color:#262421;color:white;border:1px solid rgba(255,255,255,0.1);">
      <div class="modal-header border-bottom">
        <h5 class="modal-title d-flex align-items-center gap-2" id="deportistaModalLabel">
            <i data-lucide="trophy" style="width:22px;color:#81b64c"></i>
            Gestión de Deportista
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body p-4">
        <form id="deportistaForm">
            <input type="hidden" id="deportistaId">
            <h6 class="text-uppercase text-muted mb-3">Información Institucional</h6>
            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <label class="form-label">Liga</label>
                    <select id="liga_id" class="form-select required" disabled></select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Club *</label>
                    <select id="club_id" class="form-select required"></select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Usuario *</label>
                    <select id="usuario_id" class="form-select required"></select>
                </div>
            </div>

            <h6 class="text-uppercase text-muted mb-3">Información Personal</h6>
            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <label class="form-label">Nombre *</label>
                    <input type="text" id="nombre" class="form-control required" disabled>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Apellido *</label>
                    <input type="text" id="apellido" class="form-control required" disabled>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Identificación *</label>
                    <input type="text" id="numero_identificacion" class="form-control required" disabled>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Email *</label>
                    <input type="text" id="email" class="form-control required" disabled>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Teléfono *</label>
                    <input type="text" id="telefono" class="form-control required" disabled>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Fecha Nacimiento *</label>
                    <input type="date" id="fecha_nacimiento" class="form-control required">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Nacionalidad *</label>
                    <select id="nacionalidad_id" class="form-select required"></select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Género *</label>
                    <select id="genero_id" class="form-select required"></select>
                </div>
            </div>

            <h6 class="text-uppercase text-muted mb-3">Información FIDE</h6>
            <div class="row g-3 mb-4 align-items-end">
                <div class="col-md-4">
                    <label class="form-label">FIDE ID</label>
                    <input type="number" id="fide_id" class="form-control">
                </div>
                <div class="col-md-2">
                    <button type="button"
                            class="btn btn-info w-100 btnSincronizar">
                        <i data-lucide="refresh-ccw-dot"></i>
                        Sincronizar
                    </button>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Elo Nacional *</label>
                    <input type="number" id="elo_nacional" class="form-control required">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Elo Internacional *</label>
                    <input type="number"
                        id="elo_internacional"
                        class="form-control required"
                        disabled
                        value="0">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Título *</label>
                    <select id="titulo_id" class="form-select required" disabled></select>
                </div>
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
                        id="btnGuardar"
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
<script>
    let ratingFideUrl = "{{ env('RATING_FIDE_URL') }}";
</script>
<script src="{{ asset('js/admin/deportistas.js') }}"></script>
@endpush
