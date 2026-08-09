@extends('layouts.app')
@section('title','Ranking Departamental ELO')
@section('header_title','Ranking Oficial')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/deportistas/topelo.css') }}">
@endsection

@section('content')

<div class="container-fluid p-0">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div class="btn-group" role="group">
            <input type="radio" class="btn-check" name="modalidad" id="std" checked>
            <label class="btn btn-outline-secondary text-white" for="std">Standard</label>

            <input type="radio" class="btn-check" name="modalidad" id="rpd">
            <label class="btn btn-outline-secondary text-white" for="rpd">Rapid</label>

            <input type="radio" class="btn-check" name="modalidad" id="blz">
            <label class="btn btn-outline-secondary text-white" for="blz">Blitz</label>
        </div>

        <div class="position-relative">
            <input
                type="text"
                id="buscadorJugador"
                class="search-input"
                placeholder="Buscar jugador...">
            <i class="bi bi-search position-absolute text-muted" style="right:15px;top:10px;"></i>
        </div>
    </div>

    <div class="ranking-container shadow-sm">
        <div class="table-responsive">
            <table class="table-ranking">
                <thead>
                    <tr>
                        <th class="text-center">#</th>
                        <th>Jugador</th>
                        <th class="text-center">ELO Std</th>
                        <th class="text-center d-none d-md-table-cell">Rapid</th>
                        <th class="text-center d-none d-md-table-cell">Blitz</th>
                        <th>Club</th>
                    </tr>
                </thead>
                <tbody id="tablaJugadores">
                    <tr>
                        <td colspan="6" class="text-center text-muted py-5">
                            Cargando ranking...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="ranking-footer d-flex justify-content-between align-items-center p-3 border-top border-secondary">
            <div class="text-muted small" id="cantidadJugadores">
                Cargando...
            </div>
            <nav>
                <ul class="pagination pagination-sm mb-0" id="paginacionRanking">
                </ul>
            </nav>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script>
    const rutaPerfil = "{{ route('deportistas.mielo') }}";
    const rutaClub = "{{ route('clubes.show','__ID__') }}";
</script>
<script src="{{ asset('js/deportistas/topelo.js') }}"></script>
@endpush
