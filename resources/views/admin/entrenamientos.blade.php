@extends('layouts.admin.app')
@section('title', 'Gestión de Entrenamientos')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/admin/entrenamientos.css') }}">
@endsection

@section('content')
<div id="loadingOverlay" class="loading-overlay d-none">
    <div class="spinner-border text-light" role="status"></div>
</div>

<div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
    <h2 class="fw-bold d-flex align-items-center text-primary title-principal">
        <i data-lucide="calendar-days" class="me-2 icono-titulo"></i>
        Lista de Entrenamientos
    </h2>
</div>

<div class="table-responsive shadow rounded">
    <button class="btnNuevo btn btn-success mb-3 d-none shadow-sm fw-semibold px-3 py-2 d-flex align-items-center gap-2">
        <i data-lucide="calendar-plus" class="icono-boton"></i>
        <span>Agregar Entrenamiento</span>
    </button>
</div>

<div class="card border-0 shadow-lg" style="background:transparent">
	<div class="table-responsive rounded-2">
        <table id="entrenamientosTable" class="table align-middle mb-0 w-100">
            <thead
                class="text-center"
                style="background:rgba(0,0,0,.3);color:#81b64c;">
                <tr>
                    <th style="width:60px;">ID</th>
                    <th>Tipo</th>
                    <th>Club</th>
                    <th>Categoría</th>
                    <th>Género</th>
                    <th>Entrenador</th>
                    <th>Fecha</th>
                    <th>Horario</th>
                    <th>Ubicación</th>
                    <th>Deportistas</th>
                    <th style="width:120px;">Acciones</th>
                </tr>
            </thead>
        </table>
    </div>
</div>
<div class="modal fade" id="entrenamientoModal" tabindex="-1" aria-labelledby="entrenamientoModalLabel" aria-hidden="true" >
	<div class="modal-dialog modal-xl modal-dialog-scrollable">
		<div class="modal-content entrenamiento-modal">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title">
                    <i data-lucide="calendar-days" class="text-success" style="width:22px;"></i>
                    <span id="entrenamientoModalLabel">
                        Nuevo Entrenamiento
                    </span>
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

			<div class="modal-body">
				<form id="entrenamientoForm">
					<input type="hidden" id="entrenamientoId">
					<div class="card seccion-card mb-4">
						<div class="card-body">
							<h6 class="seccion-titulo">
								¿Cómo desea crear el entrenamiento?
							</h6>
							<div class="row mt-3">
								<div class="col-md-6">
									<div class="form-check form-check-lg">
										<input
											class="form-check-input"
											type="radio"
											name="modo_creacion"
											id="modoManual"
											value="manual"
											checked>
										<label
											class="form-check-label"
											for="modoManual">
										<strong>Crear manualmente</strong>
										<small class="d-block text-muted">
										Diligencie toda la información del entrenamiento.
										</small>
										</label>
									</div>
								</div>
								<div class="col-md-6">
									<div class="form-check form-check-lg">
										<input
											class="form-check-input"
											type="radio"
											name="modo_creacion"
											id="modoPlan"
											value="plan">
										<label
											class="form-check-label"
											for="modoPlan">
										<strong>Crear desde un plan</strong>
										<small class="d-block text-muted">
										La información se copiará automáticamente desde un plan de entrenamiento.
										</small>
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div
                        id="contenedorPlan"
                        class="d-none">
                        <div class="card seccion-card mb-4">
                            <div class="card-body">
                                <div class="row align-items-end">
                                    <div class="col-md-12">
                                        <label class="form-label">
                                            Plan de entrenamiento
                                        </label>
                                        <select id="plan_entrenamiento_id" class="form-control"></select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            id="planResumen"
                            class="card resumen-plan d-none">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-4">
                                    <div>
                                        <h5 class="text-success mb-1">
                                            Resumen del Plan
                                        </h5>
                                        <small class="text-white opacity-50">
                                            Revise la información antes de crear el entrenamiento.
                                        </small>
                                    </div>
                                    <span
                                        id="planEstado"
                                        class="badge bg-success">
                                        Vigente
                                    </span>
                                </div>
                                <div class="row g-3">
                                    <div class="col-12">
                                        <label class="info-label">
                                            Nombre
                                        </label>
                                        <div
                                            id="planNombre"
                                            class="info-value fs-5 fw-semibold">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="info-label">
                                            Tipo
                                        </label>
                                        <div
                                            id="planTipo"
                                            class="info-value">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="info-label">
                                            Evento
                                        </label>
                                        <div class="d-flex align-items-center gap-2 flex-wrap">
                                            <span
                                                id="planEvento"
                                                class="info-value">
                                            </span>
                                            <a
                                                id="btnVerEvento"
                                                href="#"
                                                target="_blank"
                                                class="btn btn-outline-success btn-sm d-none">
                                                <i
                                                    data-lucide="external-link"
                                                    style="width:16px;height:16px;">
                                                </i>
                                                Ver evento
                                            </a>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="info-label">
                                            Club
                                        </label>
                                        <div
                                            id="planClub"
                                            class="info-value">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="info-label">
                                            Categoría
                                        </label>
                                        <div
                                            id="planCategoria"
                                            class="info-value">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="info-label">
                                            Entrenador
                                        </label>
                                        <div
                                            id="planEntrenador"
                                            class="info-value">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="info-label">
                                            Género
                                        </label>
                                        <div
                                            id="planGenero"
                                            class="info-value">
                                        </div>
                                    </div>
                                </div>

                                <div class="border-top my-4"></div>

                                <div class="row g-3">

                                    <div class="col-md-6">
                                        <label class="info-label">
                                            Fecha inicio
                                        </label>
                                        <div
                                            id="planFechaInicio"
                                            class="fw-bold mt-1">
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="info-label">
                                            Fecha fin
                                        </label>
                                        <div
                                            id="planFechaFin"
                                            class="fw-bold mt-1">
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <label class="info-label">
                                            Ubicación
                                        </label>
                                        <div
                                            id="planUbicacion"
                                            class="fw-bold mt-1">
                                        </div>

                                        <div
                                            id="contenedorMapa"
                                            class="mt-3 d-none">

                                            <a
                                                id="planMapa"
                                                href="#"
                                                target="_blank"
                                                class="btn btn-outline-success btn-sm">

                                                <i
                                                    data-lucide="map-pin"
                                                    style="width:16px;">
                                                </i>

                                                Ver ubicación en Google Maps

                                            </a>

                                        </div>
                                    </div>

                                </div>

                                <div class="border-top my-4"></div>

                                <div class="d-flex justify-content-between align-items-center mb-3">

                                    <h6 class="text-success fw-semibold mb-0">
                                        Horarios
                                    </h6>

                                    <span
                                        id="cantidadHorarios"
                                        class="badge bg-success">
                                        0
                                    </span>

                                </div>

                                <div id="listaHorarios"></div>

                                <div class="border-top my-4"></div>

                                <div
                                    id="previewDeportistas"
                                    class="preview-deportistas">
                                </div>

                            </div>

                        </div>

                    </div>
                    <br>
					<div id="contenedorManual">
						<div class="card seccion-card mb-4">
							<div class="card-body">
								<h5 class="text-success mb-4">
									Información General
								</h5>
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
										<label class="form-label">
										Club *
										</label>
										<select id="club_id" class="form-control required"></select>
									</div>
									<div class="col-md-3 mb-3">
										<label class="form-label">
										Categoría *
										</label>
										<select id="categoria_id" class="form-control required"></select>
									</div>
									<div class="col-md-3 mb-3">
										<label class="form-label">
										Género *
										</label>
										<select id="genero_id" class="form-control required"></select>
									</div>
								</div>
								<div class="row">
									<div class="col-md-6 mb-3">
										<label class="form-label">
										Entrenador *
										</label>
										<select id="entrenador_id" class="form-control required"></select>
									</div>
									<div class="col-md-6 mb-3">
										<label class="form-label">
										Nombre *
										</label>
										<input
											type="text"
											id="nombre"
											class="form-control required">
									</div>
								</div>
							</div>
						</div>
						<div class="card seccion-card mb-4">
							<div class="card-body">
								<h5 class="text-success mb-4">
									Ubicación
								</h5>
								<div class="mb-3">
									<label class="form-label">
									Lugar del entrenamiento *
									</label>
									<input
										type="text"
										id="ubicacion"
										class="form-control required">
								</div>
								<div class="mb-0">
									<label class="form-label">
									URL Google Maps
									</label>
									<input
										type="url"
										id="url_mapa"
										class="form-control">
									<small class="info-label">
									Opcional. Permite a los deportistas abrir la ubicación directamente en Google Maps.
									</small>
								</div>
							</div>
						</div>
						<div class="card seccion-card mb-4">
							<div class="card-body">
								<h5 class="text-success mb-4">
									Descripción
								</h5>
								<textarea
                                    id="descripcion"
                                    rows="5"
                                    class="form-control"
                                    placeholder="Ingrese una descripción del entrenamiento..."></textarea>
							</div>
						</div>
					</div>
					<div class="card seccion-card mb-4">
						<div class="card-body">
							<h5 class="text-success mb-4">
								Programación del entrenamiento
							</h5>
							<div class="row">
								<div class="col-md-4 mb-3">
									<label class="form-label">
									Fecha *
									</label>
									<input
										type="date"
										id="fecha"
										class="form-control required">
								</div>
								<div class="col-md-4 mb-3">
									<label class="form-label">
									Hora inicio *
									</label>
									<input
										type="time"
										id="hora_inicio"
										class="form-control required">
								</div>
								<div class="col-md-4 mb-3">
									<label class="form-label">
									Hora fin *
									</label>
									<input
										type="time"
										id="hora_fin"
										class="form-control required">
								</div>
							</div>
						</div>
					</div>
                    <div class="card seccion-card mb-4">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 class="text-success m-0">
                                        Deportistas
                                    </h5>
                                    <small class="info-label">
                                        Seleccione los deportistas que harán parte del entrenamiento.
                                    </small>
                                </div>
                                <div class="d-flex gap-2">
                                    <button
                                        type="button"
                                        id="btnEliminarDeportistas"
                                        class="btn btn-outline-danger btn-sm"
                                        disabled>
                                        <i data-lucide="trash-2" style="width:16px"></i>
                                        Eliminar
                                    </button>
                                    <button
                                        type="button"
                                        id="btnAgregarDeportistas"
                                        class="btn btn-success btn-sm">
                                        <i data-lucide="plus" style="width:16px"></i>
                                        Agregar deportistas
                                    </button>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th style="width:40px;"></th>
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
                    <div class="card seccion-card mb-4">
                        <div class="card-body">
                            <h5 class="text-success mb-4">
                                Observaciones
                            </h5>

                            <textarea
                                id="observaciones"
                                rows="4"
                                class="form-control"
                                placeholder="Observaciones del entrenamiento..."></textarea>
                        </div>
                    </div>
				</form>
			</div>
            <div
                class="modal fade"
                id="modalDeportistas"
                tabindex="-1"
                aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-scrollable">
                    <div class="modal-content entrenamiento-modal">
                        <div class="modal-header">
                            <div>
                                <h5 class="modal-title text-success">
                                    Agregar deportistas
                                </h5>
                                <small class="text-muted">
                                    Seleccione los deportistas que harán parte del entrenamiento.
                                </small>
                            </div>
                            <button
                                class="btn-close btn-close-white"
                                data-bs-dismiss="modal">
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
                                <table
                                    id="deportistasModalTable"
                                    class="table table-hover align-middle w-100">
                                    <thead>
                                        <tr>
                                            <th style="width:40px;">
                                                <input type="checkbox" id="checkTodosDeportistas">
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
			<div class="modal-footer">
				<button
					type="button"
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
@endsection
@push('scripts')
<script src="{{ asset('js/admin/entrenamientos/selectores.js') }}"></script>
<script src="{{ asset('js/admin/entrenamientos/planes.js') }}"></script>
<script src="{{ asset('js/admin/entrenamientos/deportistas.js') }}"></script>
<script src="{{ asset('js/admin/entrenamientos/entrenamientos.js') }}"></script>
@endpush
