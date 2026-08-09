@extends('layouts.admin.app')

@section('title', 'Solicitudes')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/admin/app.css') }}">
@endsection

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
    <h2 class="fw-bold d-flex align-items-center text-primary title-principal">
        <i data-lucide="file-clock" class="me-2 icono-titulo"></i>
        Lista de Solicitudes
    </h2>
</div>

<div class="table-responsive shadow rounded">
    <table id="solicitudesTable" class="table table-striped align-middle mb-0 w-100">
        <thead class="table-dark text-center">
            <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Solicitante</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
            </tr>
        </thead>
    </table>
</div>

<div class="modal fade" id="autorizacionModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title fw-bold">Autorizar Solicitud</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="autorizacionSolicitudId">
                <div class="mb-3">
                    <label class="form-label fw-semibold">Solicitud</label>
                    <div id="autorizacionSolicitudInfo" class="form-control bg-body-secondary"></div>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Estado</label>
                    <div class="d-flex gap-4 mt-2">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="estadoSolicitud" id="estadoAprobada" value="aprobada">
                            <label class="form-check-label" for="estadoAprobada">Aprobar</label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="estadoSolicitud" id="estadoRechazada" value="rechazada">
                            <label class="form-check-label" for="estadoRechazada">Rechazar</label>
                        </div>
                    </div>
                </div>
                <div class="mb-0">
                    <label class="form-label fw-semibold">Comentario</label>
                    <textarea id="comentarioSolicitud" rows="4" class="form-control required" placeholder="Escriba el motivo de la decisión"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button class="btn btn-success" id="btnGuardarAutorizacion">Guardar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="solicitudModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-header">
                <div class="d-flex align-items-center gap-3">
                    <h4 class="modal-title fw-bold mb-0" id="solicitudModalLabel"></h4>
                    <div id="solicitudEstado"></div>
                </div>
                <button type="button"
                        class="btn-close"
                        data-bs-dismiss="modal">
                </button>
            </div>
            <div class="modal-body bg-light" id="solicitudDetalle"></div>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script src="{{ asset('js/admin/solicitudes.js') }}"></script>
@endpush
@endsection
