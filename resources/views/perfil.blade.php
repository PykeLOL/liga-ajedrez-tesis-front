@extends('layouts.app')
@section('title', 'Perfil')
@section('styles')
    <link rel="stylesheet" href="{{ asset('css/perfil.css') }}">
@endsection
@section('content')
<div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
    <h2 class="fw-bold d-flex align-items-center text-primary title-principal">
        <i data-lucide="circle-users" class="me-2 icono-titulo"></i>
        Mi Perfil
    </h2>
</div>

@push('scripts')
<script src="{{ asset('js/perfil.js') }}"></script>
@endpush
@endsection
