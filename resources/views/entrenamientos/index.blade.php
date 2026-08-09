@extends('layouts.app')
@section('title','Entrenamientos')

@section('styles')
<link rel="stylesheet" href="{{ asset('vendor/fullcalendar/index.global.min.css') }}">
<link rel="stylesheet" href="{{ asset('css/entrenamientos/entrenamientos.css') }}">
@endsection

@section('content')

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
    <div class="d-flex gap-2">
        <a href="javascript:void(0)" id="btnGoogleCalendar" class="btn btn-chess">
            <i class="bi bi-google me-2"></i>
            Conectar Google
        </a>
        <button id="btnSyncSelected" class="btn btn-success d-none" disabled>
            <i class="bi bi-google me-2"></i>
            Sincronizar
            (<span id="syncCount">0</span>)
        </button>
    </div>
</div>

<div class="card card-training mb-4">
    <div class="card-header-training">
        <i class="bi bi-calendar3 me-2"></i>
        Calendario de entrenamientos
    </div>
    <div class="card-body">
        <div class="training-layout">
            <div class="training-calendar">
                <div class="calendar-toolbar">
                    <div class="calendar-nav">
                        <button id="btnPrev" class="calendar-btn">
                            <i class="bi bi-chevron-left"></i>
                        </button>
                        <button id="btnNext" class="calendar-btn">
                            <i class="bi bi-chevron-right"></i>
                        </button>
                        <button id="btnToday" class="calendar-btn today">
                            Hoy
                        </button>
                    </div>
                    <div id="calendarTitle" class="calendar-title"></div>
                </div>
                <div id="calendar"></div>
            </div>
            <div class="training-detail">
                <div class="detail-header">
                    <i class="bi bi-info-circle me-2"></i>
                    Detalles del entrenamiento
                </div>
                <div id="trainingDetail" class="detail-body">
                    <div class="detail-empty">
                        <i class="bi bi-calendar2-week"></i>
                        <h5>Selecciona un entrenamiento</h5>
                        <p>
                            Haz clic sobre un entrenamiento del calendario para visualizar toda la información.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="googleCalendarContainer" class="card card-training">
    <div class="card-header-training">
        <i class="bi bi-google me-2 text-success"></i>
        Tu Google Calendar
    </div>
    <div class="card-body p-0">
        <iframe
            id="googleCalendarFrame"
            width="100%"
            height="520"
            frameborder="0"
            scrolling="no">
        </iframe>
    </div>
</div>

@endsection

@push('scripts')
<script src="{{ asset('vendor/fullcalendar/index.global.min.js') }}"></script>
<script src="{{ asset('js/entrenamientos/helpers.js') }}"></script>
<script src="{{ asset('js/entrenamientos/events.js') }}"></script>
<script src="{{ asset('js/entrenamientos/detail.js') }}"></script>
<script src="{{ asset('js/entrenamientos/calendar.js') }}"></script>
<script src="{{ asset('js/entrenamientos/google.js') }}"></script>
<script src="{{ asset('js/entrenamientos/entrenamientos.js') }}"></script>
@endpush
