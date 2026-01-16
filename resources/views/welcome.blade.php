@extends('layouts.app')
@section('title', 'Sobre Nosotros')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/app.css') }}">
@endsection

@section('content')
{{-- =========================================================
     SECCIÓN SOBRE NOSOTROS (Misión, Visión, Objetivos)
     ========================================================= --}}
<div id="sobre-nosotros" class="container py-5">
    
    {{-- Introducción --}}
    <div class="row mb-5 text-center">
        <div class="col-lg-8 mx-auto">
            <h2 class="title-principal fw-bold mb-3">
                <i class="bi bi-trophy-fill me-2"></i> Sobre nuestra Liga
            </h2>
            <p class="text-muted fs-5">
                Somos el organismo rector del ajedrez en el departamento del Meta, comprometidos con el desarrollo intelectual y deportivo de nuestros atletas desde las categorías base hasta el alto rendimiento.
            </p>
        </div>
    </div>

    {{-- Tarjetas de Misión y Visión --}}
    <div class="row g-4 mb-5">
        {{-- Misión --}}
        <div class="col-md-6">
            <div class="card h-100 p-4 hover-effect border-chess">
                <div class="card-body text-center">
                    <div class="icon-box mb-3 mx-auto">
                        <i class="bi bi-bullseye fs-1 text-chess-green"></i>
                    </div>
                    <h3 class="card-title fw-bold text-white mb-3">Misión</h3>
                    <p class="card-text text-muted">
                        Fomentar, organizar y dirigir la práctica del ajedrez en el departamento del Meta, promoviendo valores como la disciplina, la honestidad y el pensamiento estratégico, garantizando espacios para la formación de nuevos talentos y la competencia de alto nivel.
                    </p>
                </div>
            </div>
        </div>

        {{-- Visión --}}
        <div class="col-md-6">
            <div class="card h-100 p-4 hover-effect border-chess">
                <div class="card-body text-center">
                    <div class="icon-box mb-3 mx-auto">
                        <i class="bi bi-eye fs-1 text-chess-green"></i>
                    </div>
                    <h3 class="card-title fw-bold text-white mb-3">Visión</h3>
                    <p class="card-text text-muted">
                        Para el año 2030, seremos reconocidos como una de las ligas líderes en Colombia, destacándonos por nuestra gestión administrativa y por aportar Maestros Nacionales e Internacionales que representen con orgullo a nuestra región y al país.
                    </p>
                </div>
            </div>
        </div>
    </div>

    {{-- Objetivos --}}
    <div class="row">
        <div class="col-12">
            <div class="card p-4 border-chess">
                <div class="card-body">
                    <h3 class="fw-bold text-white mb-4 d-flex align-items-center">
                        <i class="bi bi-check-circle-fill text-chess-green me-3"></i> Objetivos Institucionales
                    </h3>
                    
                    <div class="row g-4">
                        <div class="col-md-6">
                            <ul class="list-unstyled">
                                <li class="mb-3 d-flex text-muted">
                                    <i class="bi bi-caret-right-fill text-chess-green me-2"></i>
                                    Masificar la práctica del ajedrez en instituciones educativas y municipios del Meta.
                                </li>
                                <li class="mb-3 d-flex text-muted">
                                    <i class="bi bi-caret-right-fill text-chess-green me-2"></i>
                                    Organizar torneos oficiales válidos para el ranking nacional (Elo) e internacional.
                                </li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <ul class="list-unstyled">
                                <li class="mb-3 d-flex text-muted">
                                    <i class="bi bi-caret-right-fill text-chess-green me-2"></i>
                                    Capacitar continuamente a entrenadores, árbitros y deportistas.
                                </li>
                                <li class="mb-3 d-flex text-muted">
                                    <i class="bi bi-caret-right-fill text-chess-green me-2"></i>
                                    Apoyar a los clubes afiliados en su fortalecimiento administrativo y deportivo.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection 