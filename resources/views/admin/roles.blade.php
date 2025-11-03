@extends('layouts.admin.app')
@section('title', 'Roles')
@section('styles')
    <link rel="stylesheet" href="{{ asset('css/admin/roles.css') }}">
@endsection
@section('content')
<div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
    <h2 class="fw-bold d-flex align-items-center text-primary title-principal">
        <i data-lucide="pyramid" class="me-2 icono-titulo"></i>
        Lista de Roles
    </h2>
</div>

<div class="table-responsive shadow rounded">
    <button class="btnNuevo btn btn-success mb-3 d-none shadow-sm fw-semibold px-3 py-2 d-flex align-items-center gap-2">
        <i data-lucide="user-round-plus" class="icono-boton"></i>
        <span>Agregar Rol</span>
    </button>

    <table id="rolesTable" class="table table-striped align-middle mb-0 w-100">
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

<!-- Modal para Crear/Editar Rol -->
<div class="modal fade" id="rolModal" tabindex="-1" aria-labelledby="rolModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title" id="rolModalLabel">Nuevo Rol</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <form id="rolForm">
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control required" id="nombre" name="nombre" required>
            </div>
            <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción</label>
                <input type="text" class="form-control required" id="descripcion" name="descripcion" required>
            </div>
        </div>
          <input type="hidden" id="rolId" name="rolId">
          <div class="text-end">
            <button id="btnGuardar" type="button" class="btn btn-success">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Modal Permisos -->
<div class="modal fade" id="modalPermisos" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content shadow-lg border-0">

      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title fw-bold" id="permisosTitulo">Permisos del Rol</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body bg-light">
        <!-- Permisos Rol -->
        <div class="card border-0 mb-4 shadow-sm">
          <div class="card-header bg-white border-0">
            <h6 class="fw-bold mb-0 text-primary">
              <i class="bi bi-person-check me-1"></i> Permisos por Rol
            </h6>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover mb-0 w-100" id="tablaPermisosRol">
                <thead class="table-secondary">
                    <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
                </table>
            </div>
          </div>
            <div class="text-center mt-2 px-3 pb-2">
                <button class="btn btn-success btn-sm" id="btnAgregarPermiso">
                    <i class="bi bi-plus-circle"></i> Asignar Permiso
                </button>
            </div>
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Asignar Permiso -->
<div class="modal fade" id="modalAgregarPermiso" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-success text-white">
        <h5 class="modal-title" id="permisosDisponiblesTitulo">Asignar Permiso al Rol</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <table class="table table-sm table-hover w-100" id="tablaPermisosDisponibles">
          <thead class="table-light">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th class="text-center">Acción</th>
            </tr>
          </thead>
          <tbody class="text-muted">
            <tr class="text-center"><td colspan="3">Cargando permisos disponibles...</td></tr>
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

@push('scripts')
<script src="{{ asset('js/admin/roles.js') }}"></script>
@endpush
@endsection
