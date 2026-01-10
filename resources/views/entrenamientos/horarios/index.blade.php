@extends('layouts.app')
@section('title', 'Entrenamientos')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/entrenamientos.css') }}"> 
@endsection

@section('content')
<div class="container py-4">
    <h1 class="mb-4">Mis Entrenamientos</h1> 
</div>
@endsection

@push('scripts') 
<script src="{{ asset('js/entrenamientos.js') }}"></script>
@endpush
