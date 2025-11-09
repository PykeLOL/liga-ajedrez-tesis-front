@extends('layouts.admin.app')
@section('title', 'Permisos')
@section('styles')
    {{-- Puedes crear un CSS si quieres, o borrar esta línea --}}
    <link rel="stylesheet" href="{{ asset('css/admin/permisos.css') }}">
@endsection
@section('content')
<div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
    <h2 class="fw-bold d-flex align-items-center text-primary title-principal">
        <i data-lucide="key-round" class="me-2 icono-titulo"></i> {{-- Icono cambiado --}}
        Lista de Permisos
    </h2>
</div>

<div class="table-responsive shadow rounded">
    <button class="btnNuevo btn btn-success mb-3 d-none shadow-sm fw-semibold px-3 py-2 d-flex align-items-center gap-2">
        <i data-lucide="plus-circle" class="icono-boton"></i> {{-- Icono cambiado --}}
        <span>Agregar Permiso</span>
    </button>

    <table id="permisosTable" class="table table-striped align-middle mb-0 w-100"> {{-- ID cambiado --}}
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

{{-- Título cambiado --}}
<div class="modal fade" id="permisoModal" tabindex="-1" aria-labelledby="permisoModalLabel" aria-hidden="true"> {{-- IDs cambiados --}}
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title" id="permisoModalLabel">Agregar Permiso</h5> {{-- IDs cambiados --}}
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <form id="permisoForm"> {{-- ID cambiado --}}
          <input type="hidden" id="permisoId"> {{-- ID cambiado --}}
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombre <span class="text-danger">*</span></label>
            <input type="text" class="form-control required" id="nombre" name="nombre" placeholder="Ej: crear-usuarios">
          </div>
          <div class="mb-3">
            <label for="descripcion" class="form-label">Descripción <span class="text-danger">*</span></label>
            <textarea class="form-control required" id="descripcion" name="descripcion" rows="3" placeholder="Ej: Permite crear nuevos usuarios en el sistema"></textarea>
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

{{-- Los otros modales de "Ver Permisos" y "Asignar Permisos" de roles.blade.php se eliminan, porque este módulo no los necesita --}}

@push('scripts')
<script src="{{ asset('js/admin/permisos.js') }}"></script>
@endpush
@endsection
