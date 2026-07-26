@extends('layouts.admin.app')
@section('title', 'Gestión de Planes de Entrenamiento')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/admin/planes-entrenamiento.css') }}">
@endsection

@section('content')
<div id="loadingOverlay" class="loading-overlay d-none">
    <div class="spinner-border text-light" role="status"></div>
</div>

<div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3" style="border-color:rgba(255,255,255,.1)!important;">
    <h2 class="title-principal d-flex align-items-center m-0 text-white">
		<i data-lucide="calendars" class="me-3 text-success" style="width:32px;height:32px;"></i>
		Lista de Planes de Entrenamiento
	</h2>
</div>
<div class="mb-3">
    <button
        class="btnNuevo btn d-none shadow-sm fw-bold px-4 py-2 d-flex align-items-center gap-2 rounded-2 text-white"
        style="background:#81b64c;border:none;">
    <i data-lucide="layers-plus" style="width:18px;"></i>
    <span>Agregar Plan de Entrenamiento</span>
    </button>
</div>
<div class="card border-0 shadow-lg" style="background:transparent">
    <div class="table-responsive rounded-2">
        <table
            id="planesEntrenamientoTable"
            class="table align-middle mb-0 w-100">
            <thead
                class="text-center"
                style="background:rgba(0,0,0,.3);color:#81b64c;">
                <tr>
                    <th style="width: 60px">ID</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Club</th>
                    <th>Categoría</th>
                    <th>Género</th>
                    <th>Entrenador</th>
                    <th>Fecha</th>
                    <th>Horario</th>
                    <th>Ubicación</th>
                    <th>Deportistas</th>
                    <th>Estado</th>
                    <th style="width: 150px">Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>
<div class="modal fade" id="planEntrenamientoModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content entrenamiento-modal">
            <div class="modal-header">
                <h5 class="modal-title d-flex align-items-center gap-2">
                <i
                    data-lucide="calendar-range"
                    class="text-success"
                    style="width: 22px"
                >
                </i>
                <span id="planEntrenamientoModalLabel">
                    Nuevo Plan de Entrenamiento
                </span>
                </h5>
                <button
                class="btn-close btn-close-white"
                data-bs-dismiss="modal">
                </button>
            </div>
            <div class="modal-body">
                <form id="planEntrenamientoForm">
                    <input type="hidden" id="planEntrenamientoId">
                    <div class="card seccion-card mb-4">
                        <div class="card-body">
                            <h5 class="text-success mb-4">Información General</h5>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                <label class="form-label">
                                    Tipo entrenamiento *
                                </label>
                                <select id="tipo_entrenamiento_id" class="form-control required"></select>
                                </div>
                                <div class="col-md-6 mb-3">
                                <label class="form-label">
                                    Evento relacionado
                                </label>
                                <select id="evento_id" class="form-control"></select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                <label class="form-label"> Club * </label>
                                <select id="club_id" class="form-control required"></select>
                                </div>
                                <div class="col-md-3 mb-3">
                                <label class="form-label"> Categoría * </label>
                                <select id="categoria_id" class="form-control required"></select>
                                </div>
                                <div class="col-md-3 mb-3">
                                <label class="form-label"> Género * </label>
                                <select id="genero_id" class="form-control required"></select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                <label class="form-label"> Entrenador * </label>
                                <select id="entrenador_id" class="form-control required"></select>
                                </div>
                                <div class="col-md-6 mb-3">
                                <label class="form-label"> Nombre del plan * </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    class="form-control required"
                                />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card seccion-card mb-4">
                        <div class="card-body">
                            <h5 class="text-success mb-4">Ubicación</h5>
                            <div class="mb-3">
                                <label class="form-label">
                                Lugar del entrenamiento *
                                </label>
                                <input
                                type="text"
                                id="ubicacion"
                                class="form-control required"
                                />
                            </div>
                            <div>
                                <label class="form-label"> URL Google Maps </label>
                                <input type="url" id="url_mapa" class="form-control" />
                                <small class="info-label">
                                Opcional. Permite a los deportistas abrir la
                                ubicación directamente desde Google Maps.
                                </small>
                            </div>
                        </div>
                    </div>
                    <div class="card seccion-card mb-4">
                        <div class="card-body">
                            <h5 class="text-success mb-4">Descripción</h5>
                            <textarea
                                id="descripcion"
                                rows="5"
                                class="form-control"
                                placeholder="Ingrese una descripción del plan de entrenamiento..."
                            ></textarea>
                        </div>
                    </div>
                    <div class="card seccion-card mb-4">
                        <div class="card-body">
                            <h5 class="text-success mb-4">Vigencia del Plan</h5>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                <label class="form-label"> Fecha inicio * </label>
                                <input
                                    type="date"
                                    id="fecha_inicio"
                                    class="form-control required"
                                />
                                </div>
                                <div class="col-md-6 mb-3">
                                <label class="form-label"> Fecha fin * </label>
                                <input
                                    type="date"
                                    id="fecha_fin"
                                    class="form-control required"
                                />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card seccion-card mb-4">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                <h5 class="text-success m-0">Horarios del Plan</h5>
                                <small class="info-label">
                                    Agregue uno o varios horarios semanales para
                                    generar automáticamente los entrenamientos.
                                </small>
                                </div>
                                <button
                                type="button"
                                id="btnAgregarHorario"
                                class="btn btn-success btn-sm">
                                <i data-lucide="plus" style="width: 16px"> </i>
                                Agregar horario
                                </button>
                            </div>
                            <div id="contenedorHorarios"></div>
                        </div>
                    </div>
                    <div class="card seccion-card mb-4">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                <h5 class="text-success m-0">Deportistas</h5>
                                <small class="info-label">
                                    Seleccione los deportistas que harán parte del
                                    plan de entrenamiento.
                                </small>
                                </div>
                                <div class="d-flex gap-2">
                                <button
                                    type="button"
                                    id="btnEliminarDeportistas"
                                    class="btn btn-outline-danger btn-sm"
                                    disabled>
                                    <i data-lucide="trash-2" style="width: 16px"> </i>
                                    Eliminar
                                </button>
                                <button
                                    type="button"
                                    id="btnAgregarDeportistas"
                                    class="btn btn-success btn-sm">
                                    <i data-lucide="plus" style="width: 16px"> </i>
                                    Agregar deportistas
                                </button>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th style="width: 40px"></th>
                                        <th>Nombre</th>
                                        <th>Documento</th>
                                        <th>Título</th>
                                        <th>Categoría</th>
                                    </tr>
                                </thead>
                                <tbody id="listaDeportistasEntrenamiento">
                                    <tr>
                                        <td colspan="5" class="text-center text-muted py-4">
                                            No hay deportistas agregados.
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button"
                    class="btn btn-outline-secondary"
                    data-bs-dismiss="modal">
                    Cancelar
                </button>
                <button
                    type="button"
                    id="btnGuardar"
                    class="btn text-white"
                    style="background:#81b64c;border:none;">
                    <i data-lucide="save" style="width:16px;"></i>
                    Guardar
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modalDeportistas" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content entrenamiento-modal">
            <div class="modal-header">
                <div>
                    <h5 class="modal-title text-success">
						Agregar deportistas
					</h5>
                    <small class="text-muted">
					    Seleccione los deportistas que harán parte del plan de entrenamiento.
					</small>
                </div>
                <button class="btn-close btn-close-white" data-bs-dismiss="modal">
                </button>
            </div>
            <div class="modal-body">
                <div class="row mb-3">
                    <div class="col-md-5">
                        <label class="form-label">
                            Club
                        </label>
                        <select id="clubFiltroDeportistas" class="form-control"></select>
                    </div>
                </div>
                <div class="table-responsive">
                    <table id="deportistasModalTable" class="table table-hover align-middle w-100">
                        <thead>
                            <tr>
                                <th style="width: 40px">
                                    <input type="checkbox" id="checkTodosDeportistas" />
                                </th>
                                <th>Nombre</th>
                                <th>Documento</th>
                                <th>Título</th>
                                <th>Categoría</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-outline-secondary"
                    data-bs-dismiss="modal">
                    Cancelar
                </button>
                <button
                    type="button"
                    id="btnConfirmarAgregarDeportistas"
                    class="btn btn-success">
                    Agregar seleccionados
                    <span id="cantidadSeleccionadosModal">(0)</span>
                </button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modalGenerarEntrenamientos" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content entrenamiento-modal">
            <div class="modal-header">
                <div>
                    <h5 class="modal-title text-success d-flex align-items-center gap-2">
                        <i data-lucide="calendar-cog" style="width:22px"></i>
                        Generar entrenamientos
                    </h5>
                    <small class="info-label">
                        Revise los entrenamientos que serán creados automáticamente.
                    </small>
                </div>
                <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div id="previewAdvertencia" class="alert alert-warning d-none mb-4"></div>
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="card bg-dark border-secondary h-100">
                            <div class="card-body text-center">
                                <h3 id="previewTotalEntrenamientos" class="text-success mb-1">0</h3>
                                <small class="info-label">Entrenamientos a generar</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card bg-dark border-secondary h-100">
                            <div class="card-body text-center">
                                <h3 id="previewTotalDeportistas" class="text-success mb-1">0</h3>
                                <small class="info-label">Deportistas por entrenamiento</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 d-flex flex-column">
                        <h6 class="text-success mb-3">Entrenamientos</h6>
                        <div class="table-responsive flex-grow-1" style="max-height:450px;overflow-y:auto;">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="sticky-top">
                                    <tr>
                                        <th style="width:120px">Fecha</th>
                                        <th style="width:120px">Día</th>
                                        <th>Horario</th>
                                    </tr>
                                </thead>
                                <tbody id="previewEntrenamientos" class="text-center"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-lg-6 d-flex flex-column">
                        <h6 class="text-success mb-3">Deportistas</h6>
                        <div class="table-responsive flex-grow-1" style="max-height:450px;overflow-y:auto;">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="sticky-top">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Documento</th>
                                    </tr>
                                </thead>
                                <tbody id="previewDeportistas" class="text-center"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    Cancelar
                </button>
                <button id="btnConfirmarGeneracion" class="btn text-white" style="background:#81b64c;border:none;">
                    <i data-lucide="calendar-cog" style="width:16px"></i>
                    Generar entrenamientos
                </button>
            </div>
        </div>
    </div>
</div>
@endsection
@push('scripts')
    <script src="{{ asset('js/admin/planes-entrenamiento/selectores.js') }}"></script>
    <script src="{{ asset('js/admin/planes-entrenamiento/horarios.js') }}"></script>
    <script src="{{ asset('js/admin/planes-entrenamiento/deportistas.js') }}"></script>
    <script src="{{ asset('js/admin/planes-entrenamiento/planes-entrenamiento.js') }}"></script>
    <script src="{{ asset('js/admin/planes-entrenamiento/generar.js') }}"></script>
@endpush
