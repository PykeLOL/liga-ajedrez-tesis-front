@extends('layouts.admin.app') 

@section('title', 'Módulos')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/admin/roles.css') }}"> 
@endsection

@section('content') {{-- <-- Esta línea es clave --}}
<div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
    <h2 class="fw-bold d-flex align-items-center text-primary title-principal">
        <i data-lucide="layout-grid" class="me-2 icono-titulo"></i>
        Lista de Módulos
    </h2>
</div>

<div class="table-responsive shadow rounded">
    <button class="btnNuevo btn btn-success mb-3 d-none shadow-sm fw-semibold px-3 py-2 d-flex align-items-center gap-2">
        <i data-lucide="plus-circle" class="icono-boton"></i>
        <span>Agregar Módulo</span>
    </button>

    <table id="modulosTable" class="table table-striped align-middle mb-0 w-100">
        <thead class="table-dark text-center">
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
            </tr>
        </thead>
    </table>
</div>

<div class="modal fade" id="moduloModal" tabindex="-1" aria-labelledby="moduloModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title" id="moduloModalLabel">Agregar Módulo</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <form id="moduloForm">
          <input type="hidden" id="moduloId">
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombre <span class="text-danger">*</span></label>
            <input type="text" class="form-control required" id="nombre" name="nombre" placeholder="Ej: usuarios">
          </div>
          <div class="mb-3">
            <label for="descripcion" class="form-label">Descripción <span class="text-danger">*</span></label>
            <textarea class="form-control required" id="descripcion" name="descripcion" rows="3" placeholder="Ej: Módulo para administrar usuarios"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary btn-sm" id="btnGuardar">Guardar</button>
      </div>
    </div>
  </div>
</div>

@push('scripts')
<script src="{{ asset('js/admin/modulos.js') }}"></script>
@endpush
@endsection
