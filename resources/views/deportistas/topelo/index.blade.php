@extends('layouts.app')
@section('title', 'Ranking Departamental ELO')
@section('header_title', 'Ranking Oficial')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/deportistas/topelo.css') }}">
@endsection

@section('content')

@php
    // DATOS SIMULADOS (Esto vendrá de tu BD paginado)
    $jugadores = [
        ['id' => 1, 'pos' => 1, 'nombre' => 'Carlos Rodríguez', 'titulo' => 'IM', 'elo' => 2350, 'rapid' => 2400, 'blitz' => 2300, 'club' => 'Alfil Negro', 'foto' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'],
        ['id' => 2, 'pos' => 2, 'nombre' => 'Ana Sofía López', 'titulo' => 'WFM', 'elo' => 2100, 'rapid' => 2150, 'blitz' => 2050, 'club' => 'Jaque Mate', 'foto' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'],
        ['id' => 3, 'pos' => 3, 'nombre' => 'Pedro Pérez', 'titulo' => '', 'elo' => 2050, 'rapid' => 1900, 'blitz' => 1950, 'club' => 'Club Titán', 'foto' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'],
        ['id' => 4, 'pos' => 4, 'nombre' => 'Luisa Martínez', 'titulo' => '', 'elo' => 1980, 'rapid' => 2000, 'blitz' => 1900, 'club' => 'Peón Pasado', 'foto' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'],
        ['id' => 5, 'pos' => 5, 'nombre' => 'Jorge Gómez', 'titulo' => 'CM', 'elo' => 1950, 'rapid' => 1920, 'blitz' => 1980, 'club' => 'Alfil Negro', 'foto' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'],
        ['id' => 6, 'pos' => 6, 'nombre' => 'María Torres', 'titulo' => '', 'elo' => 1800, 'rapid' => 1850, 'blitz' => 1750, 'club' => 'Jaque Mate', 'foto' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'],
    ];
@endphp

<div class="container-fluid p-0">

    {{-- Barra de Filtros y Búsqueda --}}
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        
        {{-- Tabs de modalidad --}}
        <div class="btn-group" role="group">
            <input type="radio" class="btn-check" name="modalidad" id="std" checked>
            <label class="btn btn-outline-secondary text-white" for="std">Standard</label>

            <input type="radio" class="btn-check" name="modalidad" id="rpd">
            <label class="btn btn-outline-secondary text-white" for="rpd">Rapid</label>

            <input type="radio" class="btn-check" name="modalidad" id="blz">
            <label class="btn btn-outline-secondary text-white" for="blz">Blitz</label>
        </div>

        {{-- Buscador --}}
        <div class="position-relative">
            <input type="text" id="buscadorJugador" class="search-input" placeholder="Buscar jugador...">
            <i class="bi bi-search position-absolute text-muted" style="right: 15px; top: 10px;"></i>
        </div>
    </div>

    {{-- Tabla de Ranking --}}
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
                    @foreach($jugadores as $jugador)
                        {{-- 
                           AQUÍ ESTÁ EL TRUCO: 
                           Usamos data-href para guardar la URL del perfil.
                           El JS se encargará de hacer click en toda la fila.
                           Le pasamos el ID para simular que vamos al perfil de ESA persona.
                        --}}
                        <tr class="ranking-row rank-{{ $jugador['pos'] }}" 
                            onclick="irAPerfil('{{ route('deportistas.mielo') }}?id={{ $jugador['id'] }}')">
                            
                            <td class="rank-pos">{{ $jugador['pos'] }}</td>
                            
                            <td>
                                <div class="player-cell">
                                    <img src="{{ $jugador['foto'] }}" alt="Avatar" class="player-avatar">
                                    <div class="player-info">
                                        <span class="player-name">
                                            @if($jugador['titulo'])
                                                <span class="player-title">{{ $jugador['titulo'] }}</span>
                                            @endif
                                            {{ $jugador['nombre'] }}
                                        </span>
                                        <small class="text-muted d-md-none">{{ $jugador['club'] }}</small>
                                    </div>
                                </div>
                            </td>
                            
                            <td class="text-center elo-main">{{ $jugador['elo'] }}</td>
                            <td class="text-center text-muted d-none d-md-table-cell">{{ $jugador['rapid'] }}</td>
                            <td class="text-center text-muted d-none d-md-table-cell">{{ $jugador['blitz'] }}</td>
                            
                            <td class="d-none d-md-table-cell">
                                <span class="player-club"><i class="bi bi-shield-fill me-1"></i>{{ $jugador['club'] }}</span>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        {{-- Paginación Simulada (Estilo Bootstrap Dark) --}}
        <div class="d-flex justify-content-between align-items-center p-3 border-top border-secondary bg-dark-subtle">
            <div class="text-muted small">Mostrando 1-10 de 50 jugadores</div>
            <nav>
                <ul class="pagination pagination-sm mb-0">
                    <li class="page-item disabled"><a class="page-link" href="#">Anterior</a></li>
                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item"><a class="page-link" href="#">Siguiente</a></li>
                </ul>
            </nav>
        </div>
    </div>
</div>

@endsection

@push('scripts')
    <script src="{{ asset('js/deportistas/topelo.js') }}"></script>
@endpush