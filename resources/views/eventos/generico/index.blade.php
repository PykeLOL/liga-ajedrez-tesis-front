@extends('layouts.app')
@section('title', $tipoEventoNombre.' - Liga Meta')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/eventos/reuniones.css') }}">
@endsection

@section('content')

<div class="container-fluid p-0">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="text-white fw-bold mb-1">
                <i class="bi bi-calendar2-event-fill text-chess-green me-2"></i>
                {{ $tipoEventoNombre }}
            </h2>
            <p class="text-muted mb-0">Mantente informado y participa en la comunidad.</p>
        </div>
        <div class="btn-group">
            <button type="button"
                class="btn btn-chess-secondary active"
                data-tipo="proximos">
                Próximos
            </button>
            <button type="button"
                class="btn btn-chess-secondary"
                data-tipo="finalizados">
                Finalizados
            </button>
        </div>
    </div>

    <div class="row g-4 eventos-container" data-tipo="proximos"></div>
    <div class="row g-4 eventos-container d-none" data-tipo="finalizados"></div>
    <div class="mt-4 text-center" id="paginacion"></div>
</div>
@endsection

@push('scripts')
<script>
    const tipoEventoId = {{ $tipoEventoId }};
    const tipoEventoSlug = "{{ $tipoEventoSlug }}";
</script>
<script src="{{ asset('js/eventos/generico.js') }}"></script>
@endpush
