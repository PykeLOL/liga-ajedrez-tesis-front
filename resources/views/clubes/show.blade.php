@extends('layouts.app')
@section('title', 'Detalle del Club')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/clubes/clubes.css') }}">
    <link rel="stylesheet" href="{{ asset('css/clubes/clubes-show.css') }}">
    <link rel="stylesheet" href="{{ asset('css/clubes/clubes-show-deportistas.css') }}">
@endsection

@section('content')

<div class="container py-4" id="clubDetalle">
    <div class="d-flex align-items-center gap-3 mb-4">
        <img id="clubLogo"
             src="https://cdn-icons-png.flaticon.com/512/3069/3069172.png"
             class="rounded shadow"
             style="width:110px;height:110px;object-fit:cover">
        <div>
            <h2 class="fw-bold text-white mb-1" id="clubNombre"></h2>
            <div class="text-muted" id="clubUbicacion"></div>
        </div>
    </div>

    <hr class="border-secondary opacity-25 my-4">
    <div class="club-summary mb-4">
        <div class="presidente-box text-center">
            <img id="presidenteFoto"
                 src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                 class="rounded-circle mb-2">
            <div id="clubPresidente" class="fw-bold text-chess-green"></div>
            <div class="presidente-badge">Presidente</div>
        </div>

        <div class="club-info">
            <div class="info-line">
                <i class="bi bi-envelope-fill"></i>
                <span id="clubContacto"></span>
            </div>
            <div class="info-line">
                <i class="bi bi-geo-alt-fill"></i>
                <span id="clubDireccion"></span>
            </div>
            <div class="info-line">
                <i class="bi bi-diagram-3-fill"></i>
                <span id="clubLiga"></span>
            </div>
        </div>

        <div id="galeriaClub" class="club-galeria"></div>
    </div>

    <div class="map-container mb-5">
        <iframe
            id="clubMapa"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>
    </div>

    <h4 class="text-chess-green mb-3">
        <i class="bi bi-people-fill me-2"></i>Deportistas afiliados
    </h4>

    <div class="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4" id="clubDeportistas"></div>
</div>

<div class="modal fade" id="modalMedia" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-dark border-0">
            <div class="modal-body position-relative p-0">

                <button type="button"
                        class="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                        data-bs-dismiss="modal"></button>

                <button class="media-arrow left" onclick="cambiarMedia(-1)">
                    <i class="bi bi-chevron-left"></i>
                </button>

                <button class="media-arrow right" onclick="cambiarMedia(1)">
                    <i class="bi bi-chevron-right"></i>
                </button>

                <div id="mediaViewer" class="media-viewer"></div>
                <div id="mediaDescripcion" class="media-desc"></div>

            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modalDeportista" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-dark border-0">
            <div class="card-deportista p-4 text-white">
                <div class="row">
                    <div class="col-md-4 text-center border-end">
                        <img id="cardFoto"
                             class="card-foto mb-3">
                        <h4 id="cardNombre" class="fw-bold"></h4>
                        <div id="cardTitulo" class="text-warning"></div>
                        <div id="cardCategoria" class="small text-muted"></div>
                    </div>

                    <div class="col-md-8">
                        <div class="row text-center mb-3">
                            <div class="col">
                                <div class="stat-box">
                                    <div class="stat-value" id="statNacional"></div>
                                    <div class="stat-label">Nacional</div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="stat-box">
                                    <div class="stat-value" id="statInter"></div>
                                    <div class="stat-label">Internacional</div>
                                </div>
                            </div>
                        </div>

                        <div class="radar-wrapper">
                            <canvas id="eloRadar"></canvas>
                        </div>

                        <div class="info-grid mt-4">
                            <div class="info-card">
                                <div class="info-label">Nacionalidad</div>
                                <div class="info-value" id="cardNacionalidad"></div>
                            </div>
                            <div class="info-card">
                                <div class="info-label">Liga</div>
                                <div class="info-value" id="cardLiga"></div>
                            </div>
                            <div class="info-card">
                                <div class="info-label">Edad</div>
                                <div class="info-value" id="cardEdad"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    window.clubId = {{ request()->route('id') }};
    let apiFideUrl = "{{ env('API_FIDE_URL') }}";
    let ratingFideUrl = "{{ env('RATING_FIDE_URL') }}";
</script>

@endsection

@push('scripts')
    <script src="{{ asset('js/clubes/show.js') }}"></script>
@endpush
