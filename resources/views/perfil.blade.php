@extends('layouts.app')

@section('title', 'Mi Perfil')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/perfil.css') }}">
@endsection

@section('content')

<div id="perfilLoader" class="text-center my-5">
    <div class="spinner-border text-primary" role="status"></div>
    <p class="mt-2 text-muted">Cargando perfil...</p>
</div>

<div id="perfilContainer" class="container mt-4" style="display:none;">

    {{-- HEADER --}}
    <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">

        <h2 class="fw-bold d-flex align-items-center text-primary title-principal">
            <i data-lucide="circle-user-round" class="me-2 icono-titulo"></i>
            Mi Perfil
        </h2>

    </div>

    <div class="row justify-content-center">

        <div class="col-xl-5 col-lg-6 col-md-8">

            <div class="card shadow-sm border-0 rounded-4 p-4 text-center">

                {{-- AVATAR --}}
                <div class="d-flex flex-column align-items-center">

                    <img id="userAvatar"
                         src=""
                         alt="Avatar"
                         class="rounded-circle shadow-sm mb-3"
                         style="
                            width: 140px;
                            height: 140px;
                            object-fit: cover;
                            border: 3px solid #0d6efd;
                         ">
                </div>

                {{-- NOMBRE --}}
                <h4 class="fw-bold mb-3" id="userNombre">
                    Cargando...
                </h4>

                {{-- INFO --}}
                <div class="text-start px-3">

                    <div class="mb-3 d-flex align-items-center">
                        <i data-lucide="mail" class="me-2 text-secondary"></i>
                        <span id="userEmail">—</span>
                    </div>

                    <div class="mb-3 d-flex align-items-center">
                        <i data-lucide="phone-call" class="me-2 text-secondary"></i>
                        <span id="userTelefono">—</span>
                    </div>

                    <div class="mb-3 d-flex align-items-center">
                        <i data-lucide="id-card" class="me-2 text-secondary"></i>
                        <span id="userDocumento">—</span>
                    </div>

                    <div class="mb-3 d-flex align-items-center">
                        <i data-lucide="shield" class="me-2 text-secondary"></i>

                        <span class="fw-semibold text-muted me-2">
                            Rol:
                        </span>

                        <span id="userRol">—</span>
                    </div>

                </div>

                {{-- BOTONES --}}
                <div class="mt-4">
                    <button id="btnEditarPerfil"
                            class="btnEditar btn btn-primary px-4">
                        <i data-lucide="edit-3" class="me-1"></i>
                        Editar Perfil
                    </button>

                </div>

                <div class="mt-2">

                    <button id="btnCambiarContrasena"
                            class="btn btn-outline-secondary px-4">

                        <i data-lucide="lock" class="me-1"></i>
                        Cambiar Contraseña
                    </button>

                </div>

            </div>
        </div>
    </div>
</div>

{{-- MODAL EDITAR PERFIL --}}
<div class="modal fade"
     id="modalEditarPerfil"
     tabindex="-1"
     aria-labelledby="modalEditarPerfilLabel"
     aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-sm">
            <div class="modal-header bg-primary text-white rounded-top-4">
                <h5 class="modal-title" id="modalEditarPerfilLabel">
                    Editar Perfil
                </h5>

                <button type="button"
                        class="btn-close btn-close-white"
                        data-bs-dismiss="modal">
                </button>
            </div>

            <form id="formEditarPerfil">

                <div class="modal-body">

                    {{-- FOTO --}}
                    <div class="mb-3 text-center">

                        <img id="previewAvatar"
                             src=""
                             class="rounded-circle mb-2 shadow-sm"
                             width="100"
                             height="100"
                             style="
                                object-fit:cover;
                                border:2px solid #0d6efd;
                             ">

                        <input type="file"
                               id="imagenPerfil"
                               name="imagen"
                               class="form-control form-control-sm mt-2">

                        <button type="button"
                                id="btnEliminarFoto"
                                class="btn btn-sm btn-outline-danger mt-2">

                            <i data-lucide="trash-2" class="me-1"></i>
                            Eliminar foto de perfil
                        </button>
                    </div>

                    {{-- NOMBRE --}}
                    <div class="mb-3">

                        <label class="form-label">
                            Nombre
                        </label>

                        <input disabled
                               type="text"
                               name="nombre"
                               id="nombre"
                               class="form-control-disabled">
                    </div>

                    {{-- APELLIDO --}}
                    <div class="mb-3">

                        <label class="form-label">
                            Apellido
                        </label>

                        <input disabled
                               type="text"
                               name="apellido"
                               id="apellido"
                               class="form-control-disabled">
                    </div>

                    {{-- DOCUMENTO --}}
                    <div class="mb-3">

                        <label class="form-label">
                            No. Documento
                        </label>

                        <input disabled
                               type="text"
                               name="documento"
                               id="documento"
                               class="form-control-disabled">
                    </div>

                    {{-- TELÉFONO --}}
                    <div class="mb-3">

                        <label class="form-label">
                            Teléfono
                        </label>

                        <input type="text"
                               name="telefono"
                               id="telefono"
                               class="form-control">
                    </div>

                    {{-- EMAIL --}}
                    <div class="mb-3">

                        <label class="form-label">
                            Correo
                        </label>

                        <input type="email"
                               name="email"
                               id="email"
                               class="form-control required">
                    </div>

                </div>

                <div class="modal-footer border-0">

                    <button type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal">

                        Cancelar
                    </button>

                    <button type="submit"
                            class="btn btn-success">

                        Guardar cambios
                    </button>

                </div>
            </form>
        </div>
    </div>
</div>

{{-- MODAL CAMBIAR CONTRASEÑA --}}
<div class="modal fade"
     id="modalCambiarContrasena"
     tabindex="-1"
     aria-labelledby="modalCambiarContrasenaLabel"
     aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered">

        <div class="modal-content rounded-4 border-0 shadow-sm">

            <div class="modal-header bg-secondary text-white rounded-top-4">

                <h5 class="modal-title" id="modalCambiarContrasenaLabel">
                    Cambiar Contraseña
                </h5>

                <button type="button"
                        class="btn-close btn-close-white"
                        data-bs-dismiss="modal">
                </button>
            </div>

            <form id="formCambiarContrasena">

                <div class="modal-body">

                    <div class="mb-3">

                        <label class="form-label">
                            Contraseña actual
                        </label>

                        <input type="password"
                               name="contrasena_actual"
                               id="contrasena_actual"
                               class="form-control required">
                    </div>

                    <div class="mb-3">

                        <label class="form-label">
                            Nueva contraseña
                        </label>

                        <input type="password"
                               name="contrasena_nueva"
                               id="contrasena_nueva"
                               class="form-control required">
                    </div>

                    <div class="mb-3">

                        <label class="form-label">
                            Confirmar nueva contraseña
                        </label>

                        <input type="password"
                               name="confirmar_contrasena"
                               id="confirmar_contrasena"
                               class="form-control required">
                    </div>

                </div>

                <div class="modal-footer border-0">

                    <button type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal">

                        Cancelar
                    </button>

                    <button type="submit"
                            class="btn btn-success">

                        Actualizar contraseña
                    </button>

                </div>
            </form>
        </div>
    </div>
</div>

@endsection
@push('scripts')
<script src="{{ asset('js/perfil.js') }}"></script>
@endpush
