@extends('layouts.app')
@section('title', 'Noticias')

@section('content')

<div class="container py-5">
    {{-- Encabezado --}}
    <div class="row mb-5 text-center">
        <div class="col-lg-8 mx-auto">
            <h1 class="title-principal fw-bold mb-3">
                <i class="bi bi-newspaper me-2 text-chess-green"></i> Actualidad Deportiva
            </h1>
            <p class="text-muted fs-5">Todas las novedades de la Liga de Ajedrez del Meta</p>
        </div>
    </div>

    {{-- GRID DE NOTICIAS (Las mismas 4 del home) --}}
    <div class="row g-4">
        
        {{-- NOTICIA 1: Gran Final (La que era grande en el Home) --}}
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm card-hover text-white overflow-hidden" style="background-color: #262421; border: 1px solid rgba(255,255,255,0.1);">
                <div class="img-wrapper position-relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80" class="card-img-top w-100" style="height: 250px; object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    <span class="badge bg-danger position-absolute top-0 start-0 m-3 shadow">TORNEO OFICIAL</span>
                </div>
                <div class="card-body p-4 d-flex flex-column">
                    <div class="text-chess-green mb-2 text-uppercase fw-bold" style="font-size: 0.8rem;"><i class="bi bi-calendar-event me-1"></i> 14 Enero, 2026</div>
                    <h4 class="card-title fw-bold mb-3">Gran Final Departamental 2025</h4>
                    <p class="card-text text-muted mb-4 flex-grow-1">Los mejores estrategas del departamento se reúnen en Villavicencio para definir los cupos.</p>
                    <button class="btn btn-outline-light w-100 fw-bold btn-hover-green">Leer Artículo <i class="bi bi-arrow-right ms-2"></i></button>
                </div>
            </div>
        </div>

        {{-- NOTICIA 2: Ranking (La pequeña 1 del Home) --}}
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm card-hover text-white overflow-hidden" style="background-color: #262421; border: 1px solid rgba(255,255,255,0.1);">
                <div class="img-wrapper position-relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=800&q=80" class="card-img-top w-100" style="height: 250px; object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    <span class="badge bg-success position-absolute top-0 start-0 m-3 shadow">ELO FIDE</span>
                </div>
                <div class="card-body p-4 d-flex flex-column">
                    <div class="text-chess-green mb-2 text-uppercase fw-bold" style="font-size: 0.8rem;"><i class="bi bi-calendar-event me-1"></i> 12 Abril, 2025</div>
                    <h4 class="card-title fw-bold mb-3">Actualización Ranking Abril</h4>
                    <p class="card-text text-muted mb-4 flex-grow-1">Consulta los nuevos puntajes y variaciones tras el último torneo IRT Clásico.</p>
                    <button class="btn btn-outline-light w-100 fw-bold btn-hover-green">Leer Artículo <i class="bi bi-arrow-right ms-2"></i></button>
                </div>
            </div>
        </div>

        {{-- NOTICIA 3: Clubes (La pequeña 2 del Home) --}}
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm card-hover text-white overflow-hidden" style="background-color: #262421; border: 1px solid rgba(255,255,255,0.1);">
                <div class="img-wrapper position-relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1560174038-da43ac74f01b?auto=format&fit=crop&w=800&q=80" class="card-img-top w-100" style="height: 250px; object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    <span class="badge bg-warning text-dark position-absolute top-0 start-0 m-3 shadow">CLUBES</span>
                </div>
                <div class="card-body p-4 d-flex flex-column">
                    <div class="text-chess-green mb-2 text-uppercase fw-bold" style="font-size: 0.8rem;"><i class="bi bi-calendar-event me-1"></i> 10 Abril, 2025</div>
                    <h4 class="card-title fw-bold mb-3">Nuevo Club 'Rey Blanco'</h4>
                    <p class="card-text text-muted mb-4 flex-grow-1">Damos la bienvenida oficial a un nuevo club que se une a la liga para fomentar el deporte.</p>
                    <button class="btn btn-outline-light w-100 fw-bold btn-hover-green">Leer Artículo <i class="bi bi-arrow-right ms-2"></i></button>
                </div>
            </div>
        </div>

        {{-- NOTICIA 4: Capacitación (La pequeña 3 del Home) --}}
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm card-hover text-white overflow-hidden" style="background-color: #262421; border: 1px solid rgba(255,255,255,0.1);">
                <div class="img-wrapper position-relative overflow-hidden">
                    <img src="https://plus.unsplash.com/premium_photo-1673814660307-a7201b6357dd?q=80&w=800&auto=format&fit=crop" class="card-img-top w-100" style="height: 250px; object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    <span class="badge bg-info text-dark position-absolute top-0 start-0 m-3 shadow">CAPACITACIÓN</span>
                </div>
                <div class="card-body p-4 d-flex flex-column">
                    <div class="text-chess-green mb-2 text-uppercase fw-bold" style="font-size: 0.8rem;"><i class="bi bi-calendar-event me-1"></i> 05 Abril, 2025</div>
                    <h4 class="card-title fw-bold mb-3">Seminario de Arbitraje</h4>
                    <p class="card-text text-muted mb-4 flex-grow-1">Jornada de actualización de normas FIDE para árbitros departamentales y nacionales.</p>
                    <button class="btn btn-outline-light w-100 fw-bold btn-hover-green">Leer Artículo <i class="bi bi-arrow-right ms-2"></i></button>
                </div>
            </div>
        </div>

    </div>
</div>

{{-- Estilo Hover para los botones --}}
<style>
    .btn-hover-green:hover {
        background-color: #81b64c !important;
        border-color: #81b64c !important;
        color: white !important;
    }
</style>

@endsection