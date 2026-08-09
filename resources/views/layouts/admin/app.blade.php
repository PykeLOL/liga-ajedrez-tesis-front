<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Panel Administrativo')</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" rel="stylesheet" />

    <link rel="stylesheet" href="{{ asset('css/admin/app.css') }}">

    @yield('styles')
</head>
<body>
    @include('layouts.admin.navbar')
    @include('layouts.admin.sidebar')

    <div id="mainContent" class="content-wrapper">
        @yield('content')
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>

    <script>
        lucide.createIcons();

        let apiUrl = "{{ env('API_URL') }}";
        let apiUrlBase = apiUrl.replace('/api', '');
        let loginUrl = "{{ route('login') }}";
        let dataTablesLangUrl = "{{ asset('js/datatables/es-ES.json') }}"
        let homeUrl = "{{ route('home') }}";

        document.addEventListener('DOMContentLoaded', () => {
            const toggle=document.getElementById('sidebarToggle');
            toggle?.addEventListener('click',()=>{
                if(window.innerWidth<992){
                    document.body.classList.toggle('sidebar-open');
                }else{
                    document.body.classList.toggle('sidebar-collapsed');
                }
            });
        });
    </script>

    <script src="{{ asset('js/app.js') }}"></script>
    <script src="{{ asset('js/admin/navbar/navbar.js') }}"></script>
    <script src="{{ asset('js/admin/navbar/notificaciones.js') }}"></script>
    @stack('scripts')
</body>
</html>
