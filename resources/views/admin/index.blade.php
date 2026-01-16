@extends('layouts.admin.app')

@section('title', 'Panel Principal')

@section('content')
    <div class="container-fluid d-flex flex-column justify-content-center align-items-center" style="min-height: 70vh;">
    
    {{-- Icono decorativo opcional --}}
    <i data-lucide="layout-dashboard" class="mb-3 text-muted" style="width: 64px; height: 64px; opacity: 0.5;"></i>
    
    {{-- Título en VERDE CHESS --}}
    <h1 class="fw-bold mb-2" style="color: var(--chess-green);">
        Bienvenido al panel Administrativo
    </h1>
    
    {{-- Subtítulo en BLANCO --}}
    <p class="lead text-white opacity-75">
        Aquí podrás gestionar usuarios y otras secciones del sistema.
    </p>

</div>
@endsection
@push('scripts')
<script>
    validarPermisos(null, []);
</script>
@endpush
