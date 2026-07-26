@extends('layouts.admin.app')
@section('title', 'Gestión de Eventos')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/admin/eventos.css') }}">
@endsection

@section('content')

<div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
    <h2 class="fw-bold d-flex align-items-center text-primary title-principal">
        <i data-lucide="calendar-1" class="me-2 icono-titulo"></i>
        Lista de Eventos
    </h2>
</div>

<div class="d-flex justify-content-between align-items-center mb-3">
    <button class="btnNuevo btn btn-success mb-3 d-none shadow-sm fw-semibold px-3 py-2 d-flex align-items-center gap-2">
        <i data-lucide="calendar-plus" class="icono-boton"></i>
        <span>Agregar Evento</span>
    </button>
    <div class="filtro-evento d-flex align-items-center gap-3">
        <label class="mb-0">
            <i data-lucide="filter" class="me-1" style="width:15px"></i>
            Tipo de evento
        </label>
        <select id="filtroTipoEvento">
            <option value="">Todos</option>
        </select>
    </div>
</div>

<div class="card border-0 shadow-lg" style="background-color: transparent;">
    <div class="table-responsive rounded-2">
        <table id="eventosTable" class="table align-middle mb-0 w-100">
            <thead class="text-center" style="background-color: rgba(0,0,0,0.3); color: #81b64c;">
                <tr>
                    <th style="width: 50px;">ID</th>
                    <th style="display:none;"></th> <!-- tipo_evento_id -->
                    <th>Imagen Principal</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Lugar</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Organizador</th>
                    <th>Inscritos</th>
                    <th>Estado</th>
                    <th>Público</th>
                    <th class="text-end">Acciones</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>

<div class="modal fade" id="modalImagenEvento" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-dark border-0">
            <div class="modal-body p-2 text-center position-relative">
                <button type="button"
                        class="btn-close btn-close-white position-absolute top-0 end-0 m-2"
                        data-bs-dismiss="modal"></button>
                <img id="imagenEventoPreview"
                     src=""
                     class="img-fluid rounded shadow"
                     style="max-height: 80vh;">
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="eventoModal" tabindex="-1" aria-labelledby="eventoModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-xl">
    <div class="modal-content" style="background-color:#262421;color:white;border:1px solid rgba(255,255,255,0.1);">
      <div class="modal-header border-bottom">
        <h5 class="modal-title d-flex align-items-center gap-2" id="eventoModalLabel">
            <i data-lucide="trophy" style="width:22px;color:#81b64c"></i>
            Gestión de Evento
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body p-4">
        <form id="eventoForm">
            <input type="hidden" id="eventoId">
            <div class="row">
                <div class="col-md-6 mb-3 section-disabled">
                    <label class="form-label">Liga</label>
                    <select id="liga_id" class="form-control required" disabled></select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Tipo de evento *</label>
                    <select id="tipo_evento_id" class="form-control required"></select>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Nombre *</label>
                <input type="text" id="nombre" class="form-control required">
            </div>

            <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea id="descripcion" class="form-control" rows="3"></textarea>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Lugar *</label>
                    <input type="text" id="lugar" class="form-control required">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Dirección</label>
                    <input type="text" id="direccion" class="form-control">
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">URL mapa</label>
                <input type="url" id="url_mapa" class="form-control">
            </div>

            <div class="row align-items-start">
                <div class="col-md-3 mb-3">
                    <label class="form-label">Fecha inicio *</label>
                    <input
                        type="date"
                        id="fecha_inicio"
                        class="form-control required">
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Hora inicio</label>
                    <input
                        type="time"
                        id="hora_inicio"
                        class="form-control">
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Fecha fin *</label>
                    <input
                        type="date"
                        id="fecha_fin"
                        class="form-control required"
                        disabled>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label small text-muted">
                        Máx. participantes
                    </label>
                    <input type="number"
                        id="max_participantes"
                        class="form-control"
                        min="1"
                        placeholder="Ej: 64">
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Organizador</label>
                    <input type="text" id="organizador_nombre" class="form-control">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Contacto</label>
                    <input type="text" id="organizador_contacto" class="form-control">
                </div>
            </div>
            <div class="row">
                <div class="mb-4 mt-3">
                    <label class="form-label">Organizadores (Clubes)</label>
                    <button type="button"
                            class="btn btn-outline-success btn-sm"
                            id="btnSeleccionarClubes">
                        Seleccionar clubes
                    </button>
                    <div id="clubesSeleccionados"
                        class="d-flex flex-wrap gap-2 mt-2">
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="de_pago">
                    <label class="form-check-label" for="de_pago">
                        Evento de pago
                    </label>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Valor de inscripción (COP)</label>
                <div class="d-flex align-items-center gap-2">
                    <input type="number"
                           id="valor_min"
                           class="form-control"
                           placeholder="Desde"
                           min="0"
                           disabled>
                    <span class="fw-bold">-</span>
                    <input type="number"
                           id="valor_max"
                           class="form-control"
                           placeholder="Hasta"
                           min="0"
                           disabled>
                </div>
                <small class="text-muted">
                    Ingrese uno o ambos valores
                </small>
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
                    <label class="form-label m-0">Documentos</label>
                    <button type="button" class="btn btn-sm btn-outline-primary" id="addDocumento">
                        + Agregar documento
                    </button>
                </div>
                <div id="documentosContainer" class="row g-3"></div>
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
                        class="btn btn-secondary"
                        id="btnGuardarBorrador">
                    Guardar borrador
                </button>
                <button type="button"
                        class="btn btn-primary"
                        id="btnPublicar"
                        style="background:#81b64c;border:none">
                    Publicar evento
                </button>
            </div>
        </div>
    </div>
  </div>
</div>

<div class="modal fade" id="modalClubes" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-dark text-white">

            <div class="modal-header">
                <h5 class="modal-title">Seleccionar clubes organizadores</h5>
                <button type="button"
                        class="btn-close btn-close-white"
                        data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
                <div id="listaClubes" class="row g-2">
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary"
                        data-bs-dismiss="modal">
                    Cancelar
                </button>
                <button class="btn btn-success"
                        id="guardarClubes">
                    Guardar selección
                </button>
            </div>

        </div>
    </div>
</div>

@endsection

@push('scripts')
<script src="{{ asset('js/admin/eventos/eventos.js') }}"></script>
<script src="{{ asset('js/admin/eventos/media.js') }}"></script>
<script src="{{ asset('js/admin/eventos/documentos.js') }}"></script>
<script src="{{ asset('js/admin/eventos/organizadores.js') }}"></script>
<script src="{{ asset('js/admin/eventos/redesSociales.js') }}"></script>
@endpush
