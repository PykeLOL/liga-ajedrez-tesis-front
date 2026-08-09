@extends('layouts.app')
@section('title','Foro de Entrenamiento')
@section('header_title','Comunidad y Dudas')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/foro/foro.css') }}">
@endsection

@section('content')
<div class="container-fluid py-4">
    <div class="row align-items-center g-3 mb-4">
        <div class="col-lg-5">
            <h2 class="text-white fw-bold mb-1"><i class="bi bi-chat-square-text-fill text-chess-green me-2"></i>Comunidad de Ajedrez</h2>
            <p class="text-muted mb-0">Comparte análisis, dudas, partidas y estrategias con la comunidad.</p>
        </div>
        <div class="col-lg-7">
            <div class="d-flex gap-2">
                <div class="input-group flex-grow-1">
                    <span class="input-group-text bg-dark-input border-secondary text-muted"><i class="bi bi-search"></i></span>
                    <input id="txtBuscar" class="form-control bg-dark-input text-white border-secondary" placeholder="Buscar publicaciones...">
                </div>
                <button class="btn btn-outline-light" id="btnRecargar"><i class="bi bi-arrow-clockwise"></i></button>
                <button class="btn btnNuevo fw-bold px-4" id="btnNuevoTema"><i class="bi bi-plus-lg me-2"></i>Publicar</button>
            </div>
        </div>
    </div>

    <div id="foroContainer" class="row g-4">
        <div id="foroLoader" class="text-center py-5">
            <div class="spinner-border text-success"></div>
            <p class="text-muted mt-3 mb-0">Cargando publicaciones...</p>
        </div>
    </div>
</div>

<div class="modal fade" id="modalNuevoTema" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header border-secondary">
                <h5 class="modal-title fw-bold text-white"><i class="bi bi-chat-square-text me-2 text-chess-green"></i>Nueva publicación</h5>
                <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="formNuevoTema">
                    <input type="hidden" id="foroId">
                    <div class="mb-3">
                        <label class="form-label text-chess-green fw-semibold">Título</label>
                        <input id="titulo" class="form-control" maxlength="255">
                    </div>
                    <div class="mb-4">
                        <label class="form-label text-chess-green fw-semibold">Contenido</label>
                        <textarea id="contenido" rows="6" class="form-control"></textarea>
                    </div>
                    <div class="mb-3">
                        <div class="fw-semibold text-chess-green">Multimedia</div>
                        <small class="text-muted">Puedes adjuntar una imagen, un video o un enlace de YouTube.</small>
                    </div>

                    <div id="mediaContainer"></div>
                </form>
            </div>
            <div class="modal-footer border-secondary">
                <small class="me-auto text-muted" id="contadorMedia">Sin archivos adjuntos</small>
                <button class="btn btn-outline-light" data-bs-dismiss="modal">Cancelar</button>
                <button class="btn btnNuevo" id="btnPublicar"><i class="bi bi-send me-2"></i>Publicar</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modalDetalleForo" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">

            <div class="modal-header border-secondary">
                <h5 class="modal-title text-white fw-bold">
                    <i class="bi bi-chat-square-text-fill text-chess-green me-2"></i>
                    Publicación
                </h5>

                <button
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>
            </div>

            <div class="modal-body p-0">
                <div id="detalleForoBody" class="modal-foro-body"></div>
            </div>

        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('js/foro/foro.js') }}"></script>
<script src="{{ asset('js/foro/media.js') }}"></script>
<script src="{{ asset('js/foro/comentarios.js') }}"></script>
<script src="{{ asset('js/foro/reacciones.js') }}"></script>
@endpush
