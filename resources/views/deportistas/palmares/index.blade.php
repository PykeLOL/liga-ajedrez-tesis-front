@extends('layouts.app')
@section('title', 'Palmarés - Medallero Histórico')
@section('header_title', 'Palmarés Deportivo')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/deportistas/palmares.css') }}">
@endsection

@section('content')

@php
    // DATOS SIMULADOS (Ordenados por Oro DESC, Plata DESC, Bronce DESC)
    $medallero = [
        ['id' => 1, 'nombre' => 'Carlos Rodríguez', 'club' => 'Alfil Negro', 'oro' => 10, 'plata' => 2, 'bronce' => 1, 'foto' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'],
        ['id' => 2, 'nombre' => 'Ana Sofía López', 'club' => 'Jaque Mate', 'oro' => 8, 'plata' => 5, 'bronce' => 2, 'foto' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'],
        ['id' => 3, 'nombre' => 'Jorge Gómez', 'club' => 'Club Titán', 'oro' => 5, 'plata' => 8, 'bronce' => 4, 'foto' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'],
        ['id' => 4, 'nombre' => 'Luisa Martínez', 'club' => 'Peón Pasado', 'oro' => 5, 'plata' => 1, 'bronce' => 6, 'foto' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'],
        ['id' => 5, 'nombre' => 'Pedro Pérez', 'club' => 'Alfil Negro', 'oro' => 2, 'plata' => 4, 'bronce' => 10, 'foto' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'],
    ];
@endphp

<div class="container-fluid p-0">

    {{-- Encabezado --}}
    <div class="mb-4">
        <h2 class="fw-bold text-white mb-1">
            <i class="bi bi-trophy-fill text-warning me-2"></i>Medallero Histórico
        </h2>
        <p class="text-muted">Ranking basado en cantidad de primeros lugares (Criterio Olímpico).</p>
    </div>

    {{-- Tarjeta Principal --}}
    <div class="palmares-card shadow-lg">
        <div class="table-responsive">
            <table class="table-medals">
                <thead>
                    <tr>
                        <th style="width: 60px;">Pos</th>
                        <th class="text-start">Deportista / Club</th>
                        <th title="Primer Lugar"><i class="bi bi-trophy-fill text-warning fs-5"></i></th>
                        <th title="Segundo Lugar"><i class="bi bi-medal-fill text-secondary fs-5"></i></th>
                        <th title="Tercer Lugar"><i class="bi bi-medal-fill text-danger fs-5"></i></th>
                        <th title="Total de Podios">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($medallero as $index => $jugador)
                        @php 
                            $pos = $index + 1;
                            $total = $jugador['oro'] + $jugador['plata'] + $jugador['bronce'];
                            // Clase especial para el top 3
                            $rowClass = $pos <= 3 ? "top-$pos" : "";
                        @endphp

                        <tr class="{{ $rowClass }}" onclick="irAPerfilPalmares('{{ route('deportistas.mielo') }}?id={{ $jugador['id'] }}')">
                            
                            {{-- Columna Posición --}}
                            <td><span class="rank-badge">{{ $pos }}</span></td>
                            
                            {{-- Columna Jugador --}}
                            <td class="text-start">
                                <div class="d-flex align-items-center">
                                    <img src="{{ $jugador['foto'] }}" alt="Foto" class="mini-avatar">
                                    <div>
                                        <div class="fw-bold text-white">{{ $jugador['nombre'] }}</div>
                                        <small class="text-chess-green">{{ $jugador['club'] }}</small>
                                    </div>
                                </div>
                            </td>

                            {{-- Medallas de Oro --}}
                            <td>
                                <span class="medal-count count-gold">{{ $jugador['oro'] }}</span>
                            </td>

                            {{-- Medallas de Plata --}}
                            <td>
                                <span class="medal-count count-silver">{{ $jugador['plata'] }}</span>
                            </td>

                            {{-- Medallas de Bronce --}}
                            <td>
                                <span class="medal-count count-bronze">{{ $jugador['bronce'] }}</span>
                            </td>

                            {{-- Total Podios --}}
                            <td>
                                <span class="badge bg-dark border border-secondary text-muted rounded-pill px-3">
                                    {{ $total }}
                                </span>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>

@endsection

@push('scripts')
    <script src="{{ asset('js/deportistas/palmares.js') }}"></script>
@endpush