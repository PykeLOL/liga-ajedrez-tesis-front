@extends('layouts.app')
@section('title', 'Torneos Oficiales - Liga Meta')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/eventos/torneos.css') }}">
@endsection

@section('content')
<div class="container-fluid p-0">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="text-white fw-bold mb-1">
                <i class="bi bi-trophy-fill text-chess-green me-2"></i>
                Torneos Oficiales
            </h2>
            <p class="text-muted mb-0">
                Inscríbete y compite en los eventos válidos para ELO.
            </p>
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

@include('eventos.torneos.modal')
@endsection

@push('scripts')
<script>
    const tipoEventoId = {{ $tipoEventoId }};
    const tipoEventoSlug = "{{ $tipoEventoSlug }}";
</script>
<script src="{{ asset('js/eventos/torneos.js') }}"></script>
@endpush
