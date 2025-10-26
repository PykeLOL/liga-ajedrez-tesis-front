@extends('layouts.app')
@section('title', 'Usuarios')
<link src="{{ asset('css/admin/usuarios.css') }}">
@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold text-dark">👥 Lista de Usuarios</h2>
</div>

<div class="table-responsive shadow rounded">
    <button id="btnNuevo" class="btn btn-success mb-3 d-none">
        <i class="bi bi-plus-circle"></i> Nuevo Usuario
    </button>
    <table id="usuariosTable" class="table table-striped align-middle mb-0 w-100">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Foto</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Email</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
            </tr>
        </thead>
    </table>
</div>

{{-- Modal para Crear/Editar Usuario --}}
<div class="modal fade" id="usuarioModal" tabindex="-1" aria-labelledby="usuarioModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title" id="usuarioModalLabel">Nuevo Usuario</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <form id="usuarioForm">
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control required" id="nombre" name="nombre" required>
            </div>
            <div class="mb-3">
                <label for="apellido" class="form-label">Apellido</label>
                <input type="text" class="form-control required" id="apellido" name="apellido" required>
            </div>
            <div class="mb-3">
                <label for="documento" class="form-label">Documento</label>
                <input type="text" class="form-control required" id="documento" name="documento" required>
            </div>
            <div class="mb-3">
                <label for="telefono" class="form-label">Telefono</label>
                <input type="text" class="form-control required" id="telefono" name="telefono" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Correo electrónico</label>
                <input type="email" class="form-control required" id="email" name="email" required>
            </div>
            <div class="mb-3">
                <label for="rol_id" class="form-label">Rol</label>
                <select id="rol_id" name="rol_id" class="form-select required" required style="width:100%"></select>
            </div>
            <div class="mb-3">
            <label for="imagen" class="form-label">Foto de perfil</label>
            <input type="file" class="form-control" id="imagen" name="imagen" accept="image/*">
            <div class="mt-2 text-center">
                <img id="previewImagen" src="" alt="Vista previa" class="img-thumbnail d-none" width="120">
            </div>
        </div>
          <input type="hidden" id="userId" name="userId">
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
        <h5 class="modal-title fw-bold" id="permisosTitulo">Permisos del Usuario</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body bg-light">
        <!-- Permisos Usuario -->
        <div class="card border-0 mb-4 shadow-sm">
          <div class="card-header bg-white border-0">
            <h6 class="fw-bold mb-0 text-primary">
              <i class="bi bi-person-check me-1"></i> Permisos por Usuario
            </h6>
          </div>
          <div class="card-body p-0">
            <table class="table table-hover mb-0" id="tablaPermisosUsuario">
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
            <div class="text-center mt-2 px-3 pb-2">
                <button class="btn btn-success btn-sm" id="btnAgregarPermiso">
                    <i class="bi bi-plus-circle"></i> Asignar Permiso
                </button>
            </div>
        </div>

        <!-- Permisos Rol -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-0">
            <h6 class="fw-bold mb-0 text-success" id="tituloRol">
              <i class="bi bi-shield-lock me-1"></i> Permisos por Rol
            </h6>
          </div>
          <div class="card-body p-0">
            <table class="table table-hover mb-0" id="tablaPermisosRol">
              <thead class="table-secondary">
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
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
        <h5 class="modal-title" id="permisosDisponiblesTitulo">Asignar Permiso al Usuario</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <table class="table table-sm table-hover" id="tablaPermisosDisponibles">
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
<script src="{{ asset('js/admin/usuarios.js') }}"></script>
@endpush
@endsection
