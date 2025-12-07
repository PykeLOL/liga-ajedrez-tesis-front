@extends('layouts.app')
@section('title', 'Entrenamientos')
@section('styles')
    <link rel="stylesheet" href="{{ asset('css/entrenamientos.css') }}">
@endsection
@section('content')
    <h1>Hola mundo entrenamientos</h1>
@push('scripts')
<script src="{{ asset('js/entrenamientos.js') }}"></script>
@endpush
@endsection
