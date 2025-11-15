<!DOCTYPE html>
<html lang="es">
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Liga de Ajedrez del Meta')</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    @yield('styles')
</head>
<body>
    @include('layouts.navbar')
    {{-- @include('layouts.sidebar') --}}

    <div class="content-wrapper">
        @yield('content')
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        lucide.createIcons();
    </script>
    <script>
        let token = localStorage.getItem('token');
        let apiUrl = "{{ env('API_URL') }}";
        let loginUrl = "{{ route('login') }}";
        let dataTablesLangUrl = "{{ asset('js/datatables/es-ES.json') }}"
        let homeUrl = "{{ route('home') }}";

        let isRefreshing = false;
        let requestQueue = [];
    </script>
    <script src="{{ asset('js/app.js') }}"></script>
    @stack('scripts')
</body>
</html>
