@extends('layouts.app')
@section('title', 'Mis Entrenamientos')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/entrenamientos.css') }}">
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
@endsection

@section('content')
<div class="container py-4">
    <h1 class="mb-4">Mis Entrenamientos</h1>

    <!-- Botón Google -->
    <div class="mb-3">
        <a href="{{ env('API_URL') . '/entrenamientos/google/authorize' }}" class="btn btn-primary">
            Conectar Google Calendar
        </a>
    </div>

    <!-- TABLA (SIEMPRE VISIBLE) -->
    <table id="entrenamientosTable" class="table table-striped table-bordered w-100">
        <thead></thead>
        <tbody></tbody>
    </table>

    <!-- CALENDARIO GOOGLE -->
    <div id="googleCalendarContainer" class="card shadow rounded-4 mt-4 d-none">
        <div class="card-body">
            <h4 class="mb-3">Calendario de Entrenamientos</h4>

            <iframe
                id="googleCalendarFrame"
                style="border:0"
                width="100%"
                height="650"
                frameborder="0"
                scrolling="no">
            </iframe>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>
<script src="{{ asset('js/misEntrenamientos.js') }}"></script>
@endpush
