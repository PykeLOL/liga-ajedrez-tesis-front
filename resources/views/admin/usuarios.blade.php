@extends('layouts.app')
@section('title', 'Usuarios')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold text-dark">👥 Lista de Usuarios</h2>
</div>

<div class="table-responsive shadow rounded">
    <button id="btnNuevo" class="btn btn-success mb-3">
        <i class="bi bi-plus-circle"></i> Nuevo Usuario
    </button>
    <table id="usuariosTable" class="table table-striped align-middle mb-0 w-100">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Foto</th>
                <th>Nombre</th>
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
                <input type="text" class="form-control" id="nombre" name="nombre" required>
            </div>
            <div class="mb-3">
                <label for="documento" class="form-label">Documento</label>
                <input type="text" class="form-control" id="documento" name="documento" required>
            </div>
            <div class="mb-3">
                <label for="telefono" class="form-label">Telefono</label>
                <input type="text" class="form-control" id="telefono" name="telefono" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Correo electrónico</label>
                <input type="email" class="form-control" id="email" name="email" required>
            </div>
            <div class="mb-3">
                <label for="rol_id" class="form-label">Rol</label>
                <select id="rol_id" name="rol_id" class="form-select" required style="width:100%"></select>
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
@push('scripts')
<script src="{{ asset('js/admin/usuarios.js') }}"></script>
@endpush
@endsection
