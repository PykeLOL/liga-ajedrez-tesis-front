@extends('layouts.app')
@section('title', 'Entrenamientos')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/entrenamientos.css') }}">
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
@endsection

@section('content')
<div class="container py-4">
    <h1 class="mb-4">Mis Entrenamientos</h1>

    <!-- Botón para conectar Google Calendar -->
    <div class="mb-3">
        <a href="{{ url('/api/google/authorize') }}" class="btn btn-primary">
            Conectar Google Calendar
        </a>
    </div>

    <!-- Tabla de entrenamientos -->
    <table id="trainingsTable" class="table table-striped table-bordered">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- Se llenará dinámicamente vía JS -->
        </tbody>
    </table>
</div>
@endsection

@push('scripts')
<script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>
<script src="{{ asset('js/entrenamientos.js') }}"></script>
@endpush
