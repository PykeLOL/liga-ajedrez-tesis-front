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

    {{-- NUESTRO CSS MAESTRO --}}
    <link rel="stylesheet" href="{{ asset('css/admin/app.css') }}">

    @yield('styles')
</head>
<body>
    @include('layouts.admin.navbar')
    @include('layouts.admin.sidebar')

    {{-- Contenido Principal --}}
    <div class="content-wrapper" style="margin-left: 240px; padding: 20px;">
        @yield('content')
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>

    {{-- SCRIPT MAESTRO: Iconos, Variables y Sidebar Toggle --}}
    <script>
        // 1. Inicializar Iconos
        lucide.createIcons();

        // 2. Variables Globales
        let apiUrl = "{{ env('API_URL') }}";
        let apiUrlBase = apiUrl.replace('/api', '');
        let loginUrl = "{{ route('login') }}";
        let dataTablesLangUrl = "{{ asset('js/datatables/es-ES.json') }}"
        let homeUrl = "{{ route('home') }}";

        // 3. LÓGICA DEL BOTÓN HAMBURGUESA (Sidebar Toggle)
        document.addEventListener('DOMContentLoaded', function() {
            const toggleBtn = document.getElementById('sidebarToggle');
            const sidebar = document.getElementById('sidebar');
            const navbar = document.querySelector('.navbar-chess');
            const mainContent = document.getElementById('mainContent'); // Asegúrate que tu div content-wrapper tenga este ID

            if (toggleBtn) {
                toggleBtn.addEventListener('click', function(e) {
                    e.preventDefault(); // Evitar comportamientos raros
                    document.body.classList.toggle('sidebar-collapsed');

                    // Forzar actualización de estilos si es necesario
                    if (document.body.classList.contains('sidebar-collapsed')) {
                        // Cerrado
                        if(sidebar) sidebar.style.transform = 'translateX(-100%)';
                        if(mainContent) mainContent.style.marginLeft = '0';
                        if(navbar) navbar.style.width = '100%';
                    } else {
                        // Abierto
                        if(sidebar) sidebar.style.transform = 'none';
                        if(mainContent) mainContent.style.marginLeft = '240px';
                        if(navbar) navbar.style.width = 'calc(100% - 240px)';
                    }
                });
            } else {
                console.error("El botón #sidebarToggle no se encontró en el DOM.");
            }
        });

        // 4. Validación de Rol (Seguridad Front)
        try {
            const user_data = JSON.parse(localStorage.getItem('user_data'));
            if (!user_data || (user_data.rol !== 'Administrador' && user_data.rol !== 'SuperAdmin')) {
                // Ajusta los roles según tu lógica real. Si falla, descomenta la redirección:
                // window.location.href = homeUrl;
            }
        } catch(e) {}
    </script>

    {{-- Tu App JS principal --}}
    <script src="{{ asset('js/app.js') }}"></script>
    @stack('scripts')
</body>
</html>
