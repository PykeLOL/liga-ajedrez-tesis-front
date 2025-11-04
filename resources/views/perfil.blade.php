@extends('layouts.app')
@section('title', 'Perfil')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/perfil.css') }}">
@endsection

@section('content')
<div id="perfilLoader" class="text-center my-5">
  <div class="spinner-border text-primary" role="status"></div>
  <p class="mt-2 text-muted">Cargando perfil...</p>
</div>

<div id="perfilContainer" class="container mt-4" style="display:none;">
    <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h2 class="fw-bold d-flex align-items-center text-primary title-principal">
            <i data-lucide="circle-user-round" class="me-2 icono-titulo"></i>
            Perfil de Usuario
        </h2>
    </div>

    <div class="row g-4">
        <div class="col-lg-4">
            <div class="card shadow-sm border-0 rounded-4 p-4 text-center h-100">
                <div class="d-flex flex-column align-items-center">
                    <img id="userAvatar" src="" alt="Avatar"
                        class="rounded-circle shadow-sm mb-3"
                        style="width: 140px; height: 140px; object-fit: cover; border: 3px solid #0d6efd;">
                </div>
                <h4 class="fw-bold mb-3" id="userNombre">Cargando...</h4>
                <div class="text-start px-3">
                    <div class="mb-2"><i data-lucide="mail" class="me-2 text-secondary"></i><span id="userEmail">—</span></div>
                    <div class="mb-2"><i data-lucide="phone-call" class="me-2 text-secondary"></i><span id="userTelefono">—</span></div>
                    <div class="mb-2"><i data-lucide="id-card" class="me-2 text-secondary"></i><span id="userDocumento">—</span></div>
                    <div class="mb-2">
                        <i data-lucide="shield" class="me-2 text-secondary"></i>
                        <span class="fw-semibold text-muted">Rol:</span> <span id="userRol">—</span>
                    </div>
                </div>

                <div class="mt-4">
                    <button id="btnEditarPerfil" class="btnEditar editar-perfil btn btn-primary px-4 d-none">
                        <i data-lucide="edit-3" class="me-1"></i> Editar Perfil
                    </button>
                </div>

                <div class="mt-2">
                    <button id="btnCambiarContrasena" class="btn btn-outline-secondary px-4">
                        <i data-lucide="lock" class="me-1"></i> Cambiar Contraseña
                    </button>
                </div>
            </div>
        </div>

        <div class="col-lg-8">
            <div class="card shadow-sm border-0 rounded-4 p-4 h-100">
                <h5 class="fw-bold mb-3 d-flex align-items-center text-primary">
                    <i data-lucide="key-round" class="me-2"></i> Permisos
                </h5>

                <div class="mb-3">
                    <h6 class="fw-semibold text-muted">
                        Permisos por Rol: <span id="nombreRol" class="text-primary"></span>
                    </h6>
                </div>

                <!-- Tabla de permisos por Rol -->
                <div class="table-responsive mb-4">
                    <table id="tablaPermisosRol" class="table table-striped table-bordered w-100"></table>
                </div>

                <!-- Tabla de permisos por Usuario -->
                <div class="table-responsive">
                    <h6 class="fw-semibold text-muted">Permisos por Usuario</h6>
                    <table id="tablaPermisosUsuario" class="table table-striped table-bordered w-100"></table>
                </div>
            </div>
        </div>

    </div>
</div>

<div class="modal fade" id="modalEditarPerfil" tabindex="-1" aria-labelledby="modalEditarPerfilLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow-sm">
      <div class="modal-header bg-primary text-white rounded-top-4">
        <h5 class="modal-title" id="modalEditarPerfilLabel">Editar Perfil</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>

      <form id="formEditarPerfil">
        <div class="modal-body">
          <div class="mb-3 text-center">
            <img id="previewAvatar" src="" class="rounded-circle mb-2 shadow-sm"
                 width="100" height="100" style="object-fit:cover; border:2px solid #0d6efd;">
            <input type="file" id="imagenPerfil" name="imagen" class="form-control form-control-sm mt-2">
            <button type="button" id="btnEliminarFoto" class="btn btn-sm btn-outline-danger mt-2">
              <i data-lucide="trash-2" class="me-1"></i> Eliminar foto de perfil
            </button>
          </div>

          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" name="nombre" id="nombre" class="form-control required">
          </div>
          <div class="mb-3">
            <label class="form-label">Apellido</label>
            <input type="text" name="apellido" id="apellido" class="form-control required">
          </div>
          <div class="mb-3">
            <label class="form-label">No. Documento</label>
            <input type="text" name="documento" id="documento" class="form-control required">
          </div>
          <div class="mb-3">
            <label class="form-label">Teléfono</label>
            <input type="text" name="telefono" id="telefono" class="form-control">
          </div>
          <div class="mb-3">
            <label class="form-label">Correo</label>
            <input type="email" name="email" id="email" class="form-control required">
          </div>
        </div>

        <div class="modal-footer border-0">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="submit" class="btn btn-success">Guardar cambios</button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- Modal Cambiar Contraseña -->
<div class="modal fade" id="modalCambiarContrasena" tabindex="-1" aria-labelledby="modalCambiarContrasenaLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow-sm">
      <div class="modal-header bg-secondary text-white rounded-top-4">
        <h5 class="modal-title" id="modalCambiarContrasenaLabel">Cambiar Contraseña</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>

      <form id="formCambiarContrasena">
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Contraseña actual</label>
            <input type="password" name="contrasena_actual" id="contrasena_actual" class="form-control required">
          </div>
          <div class="mb-3">
            <label class="form-label">Nueva contraseña</label>
            <input type="password" name="contrasena_nueva" id="contrasena_nueva" class="form-control required">
          </div>
          <div class="mb-3">
            <label class="form-label">Confirmar nueva contraseña</label>
            <input type="password" name="confirmar_contrasena" id="confirmar_contrasena" class="form-control required">
          </div>
        </div>

        <div class="modal-footer border-0">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="submit" class="btn btn-success">Actualizar contraseña</button>
        </div>
      </form>
    </div>
  </div>
</div>

@endsection
@push('scripts')
<script src="{{ asset('js/perfil.js') }}"></script>
@endpush
