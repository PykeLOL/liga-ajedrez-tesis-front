@extends('layouts.admin.app')

@section('title', 'Gestión de Entrenadores')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/admin/entrenadores.css') }}">
@endsection

@section('content')

<div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
    <h2 class="fw-bold d-flex align-items-center text-primary title-principal">
        <i data-lucide="graduation-cap" class="me-2 icono-titulo"></i>
        Lista de Entrenadores
    </h2>
</div>

<div class="table-responsive shadow rounded">
    <button class="btnNuevo btn btn-success mb-3 d-none shadow-sm fw-semibold px-3 py-2 d-flex align-items-center gap-2">
        <i data-lucide="plus-circle" class="icono-boton"></i>
        <span>Agregar Entrenador</span>
    </button>
</div>

<div class="card border-0 shadow-lg" style="background-color: transparent;">
    <div class="table-responsive rounded-2">
        <table id="entrenadoresTable" class="table align-middle mb-0 w-100">
            <thead class="text-center" style="background-color: rgba(0,0,0,0.3); color: #81b64c;">
                <tr>
                    <th style="width: 50px;">ID</th>
                    <th>Entrenador</th>
                    <th>Documento</th>
                    <th>FIDE ID</th>
                    <th>Club</th>
                    <th>Género</th>
                    <th>Categorías</th>
                    <th>Certificaciones</th>
                    <th>Estado</th>
                    <th class="text-end">Acciones</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>


<div class="modal fade"
     id="entrenadorModal"
     tabindex="-1"
     aria-labelledby="entrenadorModalLabel"
     aria-hidden="true">

    <div class="modal-dialog modal-xl">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="entrenadorModalLabel">
                    Nuevo Entrenador
                </h5>

                <button type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close">
                </button>
            </div>

            <div class="modal-body p-4">
                <form id="entrenadorForm">
                    <input type="hidden" id="entrenadorId">

                    <h6 class="text-uppercase text-muted mb-3">
                        Información Institucional
                    </h6>

                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label">Club</label>
                            <select id="club_id" class="form-select"></select>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Usuario *</label>
                            <select id="usuario_id" class="form-select required"></select>
                        </div>
                    </div>

                    <h6 class="text-uppercase text-muted mb-3">
                        Información Personal
                    </h6>

                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label">Fecha Nacimiento *</label>
                            <input type="date"
                                   id="fecha_nacimiento"
                                   class="form-control required">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Nacionalidad *</label>
                            <select id="nacionalidad_id"
                                    class="form-select required">
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Género *</label>
                            <select id="genero_id"
                                    class="form-select required">
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Estado *</label>
                            <select id="estado"
                                    class="form-select required">
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <h6 class="text-uppercase text-muted mb-3">
                        Información FIDE
                    </h6>

                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label">FIDE ID</label>
                            <input type="text"
                                   id="fide_id"
                                   class="form-control"
                                   maxlength="50">
                        </div>
                    </div>

                    <h6 class="text-uppercase text-muted mb-3">Información Profesional</h6>

                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label">Experiencia (años)</label>
                            <input type="number"
                                   id="experiencia_anios"
                                   class="form-control"
                                   min="0">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Especialidad</label>
                            <input type="text"
                                   id="especialidad"
                                   class="form-control">
                        </div>
                    </div>

                    <h6 class="text-uppercase text-muted mb-3">
                        Categorías
                    </h6>

                    <div class="row g-3 mb-4">
                        <div class="col-12">
                            <label class="form-label">
                                Categorías que puede entrenar
                            </label>

                            <select id="categorias"
                                    class="form-select"
                                    multiple>
                            </select>
                        </div>
                    </div>

                    <h6 class="text-uppercase text-muted mb-3">
                        Certificaciones
                    </h6>

                    <div class="mb-3">
                        <button type="button"
                                class="btn btn-outline-success btn-sm"
                                id="btnAgregarCertificacion">
                            <i data-lucide="plus"></i>
                            Agregar certificación
                        </button>
                    </div>

                    <div id="certificacionesContainer"></div>

                </form>
            </div>

            <div class="modal-footer border-top d-flex justify-content-between">
                <button type="button"
                        class="btn btn-outline-secondary"
                        data-bs-dismiss="modal">
                    Cancelar
                </button>

                <div class="d-flex gap-2">
                    <button type="submit"
                            class="btn btn-primary"
                            id="btnGuardar"
                            form="entrenadorForm"
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
<script src="{{ asset('js/admin/entrenadores.js') }}"></script>
@endpush
