@extends('layouts.admin.app')
@section('title', 'Gestión de Permisos')

@section('styles')
    {{-- CSS del módulo --}}
    <link rel="stylesheet" href="{{ asset('css/admin/app.css') }}">
@endsection

@section('content')

{{-- ENCABEZADO --}}
<div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3" style="border-color: rgba(255,255,255,0.1) !important;">
    <h2 class="title-principal d-flex align-items-center m-0 text-white">
        <i data-lucide="key-round" class="me-3 text-success" style="width: 32px; height: 32px;"></i> 
        Lista de Permisos
    </h2>
</div>
{{-- Botón Agregar --}}
    <div class="mb-3">
        <button class="btnNuevo btn d-none shadow-sm fw-bold px-4 py-2 d-flex align-items-center gap-2 rounded-2 text-white" 
                style="background-color: #81b64c; border:none;">
            <i data-lucide="plus-circle" style="width: 18px;"></i> 
            <span>Agregar Permiso</span>
        </button>
    </div>
{{-- CONTENEDOR PRINCIPAL --}}
<div class="card border-0 shadow-lg" style="background-color: transparent;">

    {{-- TABLA --}}
    <div class="table-responsive rounded-2">
        <table id="permisosTable" class="table align-middle mb-0 w-100"> 
            <thead class="text-center" style="background-color: rgba(0,0,0,0.3); color: #81b64c;">
                <tr>
                    <th style="width: 50px;">ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th class="text-end">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {{-- DataTables renderiza aquí --}}
            </tbody>
        </table>
    </div>
</div>

{{-- MODAL --}}
<div class="modal fade" id="permisoModal" tabindex="-1" aria-labelledby="permisoModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content" style="background-color: #262421; color: white; border: 1px solid rgba(255,255,255,0.1);">
      
      {{-- Modal Header --}}
      <div class="modal-header" style="border-bottom: 1px solid rgba(255,255,255,0.1);">
        <h5 class="modal-title d-flex align-items-center gap-2" id="permisoModalLabel">
            <i data-lucide="shield-check" style="width: 22px; color: #81b64c;"></i>
            <span>Gestión de Permiso</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" style="filter: invert(1);"></button>
      </div>

      {{-- Modal Body --}}
      <div class="modal-body p-4">
        <form id="permisoForm">
          <input type="hidden" id="permisoId">
          
          <div class="row">
            {{-- Select: Tipo de Acción --}}
            <div class="col-md-6">
              <div class="mb-3">
                <label for="tipoAccionSelect" class="form-label" style="color: #bababa;">Acción <span class="text-danger">*</span></label>
                <select class="form-control" id="tipoAccionSelect" name="tipo_accion_id" style="width: 100%;"></select>
              </div>
            </div>
            
            {{-- Select: Módulo --}}
            <div class="col-md-6">
              <div class="mb-3">
                <label for="moduloSelect" class="form-label" style="color: #bababa;">Módulo Objetivo <span class="text-danger">*</span></label>
                <select class="form-control" id="moduloSelect" name="modulo_id" style="width: 100%;"></select>
              </div>
            </div>
          </div>
          
          {{-- Nombre Generado Automáticamente --}}
          <div class="row">
            <div class="col-12">
              <div class="mb-3">
                <label for="nombreGenerado" class="form-label" style="color: #bababa;">Identificador Generado</label>
                <div class="input-group">
                    <span class="input-group-text border-secondary text-muted" style="background-color: #151515;"><i data-lucide="hash" style="width: 16px;"></i></span>
                    <input type="text" class="form-control" id="nombreGenerado" readonly placeholder="accion-modulo" 
                           style="background-color: #1e1e1e; border: 1px solid rgba(255,255,255,0.1); color: #fff;">
                </div>
                <input type="hidden" id="nombre" name="nombre"> 
                <small class="text-muted" style="font-size: 0.75rem;">Este campo se genera automáticamente.</small>
              </div>
            </div>
          </div>
          
          {{-- Descripción --}}
          <div class="row">
            <div class="col-12">
              <div class="mb-3">
                <label for="descripcion" class="form-label" style="color: #bababa;">Descripción <span class="text-danger">*</span></label>
                <textarea class="form-control required" id="descripcion" name="descripcion" rows="3" 
                          placeholder="Ej: Permite crear nuevos registros..."
                          style="background-color: #1e1e1e; border: 1px solid rgba(255,255,255,0.1); color: #fff;"></textarea>
              </div>
            </div>
          </div>
        </form>
      </div>

      {{-- Modal Footer --}}
      <div class="modal-footer" style="border-top: 1px solid rgba(255,255,255,0.1);">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="btnGuardar" style="background-color: #81b64c; border: none;">Guardar</button>
      </div>
    </div>
  </div>
</div>
@endsection

@push('scripts')
{{-- TU SCRIPT ORIGINAL QUE FUNCIONA (No lo tocamos) --}}
<script src="{{ asset('js/admin/permisos.js') }}"></script>
@endpush 