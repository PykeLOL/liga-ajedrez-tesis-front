@extends('layouts.app')
@section('title','Entrenamientos por Club')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/clubes/clubes.css') }}">
@endsection

@section('content')

<div class="d-flex justify-content-between align-items-center mb-4">

    <div>

        <h2 class="text-white fw-bold mb-1">
            <i class="bi bi-shield-shaded text-chess-green me-2"></i>
            Entrenamientos por Club
        </h2>

        <p class="text-muted mb-0">
            Selecciona un club para consultar su programación de entrenamientos.
        </p>

    </div>

</div>

<div id="clubsGrid" class="clubs-grid"></div>

<div
    id="paginacion"
    class="d-flex justify-content-center mt-4">
</div>

@endsection

@push('scripts')
<script src="{{ asset('js/entrenamientos/clubes.js') }}"></script>
@endpush
