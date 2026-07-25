@extends('layouts.app')
@section('title', 'Entrenamientos')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/entrenamientos/entrenamientos.css') }}">
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
@endsection

@section('content')
<div class="container-fluid p-0">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="text-white fw-bold mb-1">
                <i class="bi bi-calendar2-week-fill text-chess-green me-2"></i>
                Entrenamientos
            </h2>
            <p class="text-muted mb-0">
                Consulta tus entrenamientos y sincronízalos con Google Calendar.
            </p>
        </div>

        <a href="{{ env('API_URL') . '/home/entrenamientos/google/authorize' }}"
           class="btn btn-chess">
            <i class="bi bi-google me-2"></i>
            Conectar Google Calendar
        </a>
    </div>

    <div class="card card-training mb-4">
        <div class="card-header-training">
            <i class="bi bi-list-check me-2"></i>
            Próximos entrenamientos
        </div>

        <div class="card-body">
            <table id="entrenamientosTable"
                   class="table table-striped table-bordered w-100">
            </table>
        </div>
    </div>

    <div id="googleCalendarContainer"
         class="card card-training d-none">

        <div class="card-header-training">
            <i class="bi bi-calendar-event me-2"></i>
            Calendario
        </div>

        <div class="card-body p-0">

            <iframe
                id="googleCalendarFrame"
                width="100%"
                height="700"
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
<script src="{{ asset('js/entrenamientos.js') }}"></script>
@endpush
