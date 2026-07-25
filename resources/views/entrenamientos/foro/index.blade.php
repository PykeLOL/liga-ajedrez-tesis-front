@extends('layouts.app')
@section('title', 'Foro de Entrenamiento')
@section('header_title', 'Comunidad y Dudas')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/entrenamientos/foro.css') }}">
@endsection

@section('content')

<div class="container-fluid py-4">

    {{-- BARRA SUPERIOR: Buscador + Botón Nuevo --}}
    <div class="row mb-4 align-items-center g-3">
        <div class="col-md-6">
            <h2 class="text-white fw-bold mb-0">
                <i class="bi bi-chat-square-text-fill text-chess-green me-2"></i>Foro de Estudiantes
            </h2>
            <p class="text-muted mb-0">Comparte estrategias, resuelve dudas y analiza partidas.</p>
        </div>
        <div class="col-md-6 d-flex justify-content-md-end gap-3">
            <div class="input-group w-auto">
                <span class="input-group-text bg-dark-input border-secondary text-muted"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control bg-dark-input text-white border-secondary" placeholder="Buscar tema...">
            </div>
            <button class="btn btnNuevo px-4 fw-bold" data-bs-toggle="modal" data-bs-target="#modalNuevoTema">
                <i class="bi bi-plus-lg me-2"></i>Nuevo Tema
            </button>
        </div>
    </div>

    {{-- FILTROS DE CATEGORÍA (Pestañas) --}}
    <ul class="nav nav-pills mb-4 gap-2" id="pills-tab" role="tablist">
        <li class="nav-item"><button class="nav-link active rounded-pill" type="button">Todo</button></li>
        <li class="nav-item"><button class="nav-link rounded-pill" type="button">Aperturas</button></li>
        <li class="nav-item"><button class="nav-link rounded-pill" type="button">Táctica</button></li>
        <li class="nav-item"><button class="nav-link rounded-pill" type="button">Finales</button></li>
        <li class="nav-item"><button class="nav-link rounded-pill" type="button">Análisis</button></li>
    </ul>

    {{-- LISTADO DE TEMAS (Simulación) --}}
    <div class="d-flex flex-column gap-3">

        @php
            // DATOS SIMULADOS (Esto vendrá de tu Controlador)
            $temas = [
                [
                    'id' => 1,
                    'titulo' => '¿Cómo jugar contra la Defensa Siciliana?',
                    'autor' => 'Carlos Rodríguez',
                    'avatar' => 'https://ui-avatars.com/api/?name=Carlos+R&background=FFC107&color=000',
                    'categoria' => 'Aperturas',
                    'badge' => 'warning',
                    'vistas' => 124,
                    'respuestas' => 15,
                    'fecha' => 'Hace 2 horas',
                    'resuelto' => false
                ],
                [
                    'id' => 2,
                    'titulo' => 'Ayuda con este ejercicio de mate en 3',
                    'autor' => 'Ana Sofía',
                    'avatar' => 'https://ui-avatars.com/api/?name=Ana+S&background=ADB5BD&color=000',
                    'categoria' => 'Táctica',
                    'badge' => 'danger',
                    'vistas' => 45,
                    'respuestas' => 8,
                    'fecha' => 'Hace 5 horas',
                    'resuelto' => true // Tema Resuelto
                ],
                [
                    'id' => 3,
                    'titulo' => 'Torre vs Alfil en finales: Consejos',
                    'autor' => 'Juan Martínez',
                    'avatar' => 'https://ui-avatars.com/api/?name=Juan+M&background=random',
                    'categoria' => 'Finales',
                    'badge' => 'info',
                    'vistas' => 230,
                    'respuestas' => 32,
                    'fecha' => 'Ayer',
                    'resuelto' => false
                ]
            ];
        @endphp

        @foreach($temas as $tema)
            {{-- TARJETA DE TEMA --}}
            <div class="card forum-card border-0 shadow-sm p-3">
                <div class="d-flex align-items-center">

                    {{-- Columna 1: Avatar y Votos --}}
                    <div class="d-flex flex-column align-items-center me-4 text-center" style="min-width: 60px;">
                        <img src="{{ $tema['avatar'] }}" class="rounded-circle mb-2 border border-secondary" width="45" height="45">
                    </div>

                    {{-- Columna 2: Info Principal --}}
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="badge bg-{{ $tema['badge'] }} bg-opacity-10 text-{{ $tema['badge'] }} border border-{{ $tema['badge'] }} rounded-pill" style="font-size: 0.7rem;">
                                {{ $tema['categoria'] }}
                            </span>
                            @if($tema['resuelto'])
                                <span class="badge bg-success rounded-pill"><i class="bi bi-check-circle me-1"></i>Resuelto</span>
                            @endif
                            <small class="text-muted ms-auto d-md-none">{{ $tema['fecha'] }}</small>
                        </div>

                        <a href="#" class="text-white text-decoration-none h5 fw-bold mb-1 d-block topic-link">
                            {{ $tema['titulo'] }}
                        </a>

                        <p class="text-muted small mb-0">
                            Publicado por <span class="text-chess-green">{{ $tema['autor'] }}</span> • {{ $tema['fecha'] }}
                        </p>
                    </div>

                    {{-- Columna 3: Estadísticas (Oculto en móvil muy pequeño) --}}
                    <div class="d-none d-md-flex gap-4 ms-4 text-center">
                        <div>
                            <h5 class="mb-0 fw-bold text-white">{{ $tema['respuestas'] }}</h5>
                            <small class="text-muted" style="font-size: 0.75rem;">Respuestas</small>
                        </div>
                        <div>
                            <h5 class="mb-0 fw-bold text-muted">{{ $tema['vistas'] }}</h5>
                            <small class="text-muted" style="font-size: 0.75rem;">Vistas</small>
                        </div>
                    </div>

                    {{-- Flecha "Ir" --}}
                    <div class="ms-3 d-none d-md-block">
                        <a href="#" class="btn btn-icon-chess rounded-circle">
                            <i class="bi bi-chevron-right text-muted"></i>
                        </a>
                    </div>
                </div>
            </div>
        @endforeach

    </div>

    {{-- PAGINACIÓN --}}
    <div class="mt-4 d-flex justify-content-center">
        <nav>
            <ul class="pagination pagination-sm">
                <li class="page-item disabled"><a class="page-link bg-transparent border-secondary text-muted" href="#">Anterior</a></li>
                <li class="page-item active"><a class="page-link border-chess-green bg-chess-green text-white" href="#">1</a></li>
                <li class="page-item"><a class="page-link bg-transparent border-secondary text-white" href="#">2</a></li>
                <li class="page-item"><a class="page-link bg-transparent border-secondary text-muted" href="#">Siguiente</a></li>
            </ul>
        </nav>
    </div>

</div>

{{-- MODAL NUEVO TEMA --}}
<div class="modal fade" id="modalNuevoTema" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header border-bottom border-secondary">
                <h5 class="modal-title fw-bold text-white"><i class="bi bi-pen me-2 text-chess-green"></i>Crear Nuevo Tema</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formNuevoTema">
                    <div class="mb-3">
                        <label class="form-label text-chess-green fw-bold">Título de la discusión</label>
                        <input type="text" class="form-control" placeholder="Ej: Duda sobre el Gambito de Dama...">
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted">Categoría</label>
                            <select class="form-select">
                                <option selected>Seleccionar...</option>
                                <option>Aperturas</option>
                                <option>Táctica</option>
                                <option>Finales</option>
                                <option>Torneos</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted">Etiquetas (Opcional)</label>
                            <input type="text" class="form-control" placeholder="Ej: principiante, siciliana">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted">Contenido</label>
                        <textarea class="form-control" rows="5" placeholder="Describe tu pregunta o tema aquí..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-top border-secondary">
                <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btnNuevo" id="btnPublicar">Publicar Tema</button>
            </div>
        </div>
    </div>
</div>

@endsection

@section('scripts')
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="{{ asset('js/entrenamientos/foro.js') }}"></script>
@endsection
