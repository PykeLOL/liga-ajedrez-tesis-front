<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Panel Administrativo')</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" rel="stylesheet" />
</head>
<body>
    @include('layouts.navbar')
    @include('layouts.sidebar')

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
    <script>
        let token = sessionStorage.getItem('token');
        let apiUrl = "{{ env('API_URL') }}";
        let loginUrl = "{{ route('login') }}";
        let dataTablesLangUrl = "{{ asset('js/datatables/es-ES.json') }}"

        let isRefreshing = false;
        let requestQueue = [];

         function datatableAjax(url, options = {}) {
            const config = {
                url: url,
                type: 'GET',
                headers: { "Authorization": "Bearer " + token },
                ...options
            };

            return new Promise((resolve, reject) => {
                $.ajax(config).done(resolve).fail(async function(xhr) {
                    if (xhr.status === 401) {
                        try {
                            const newToken = await refreshToken();
                            token = newToken;
                            config.headers["Authorization"] = "Bearer " + newToken;
                            $.ajax(config).done(resolve).fail(reject); // reintenta solo esta petición
                        } catch (err) {
                            sessionStorage.removeItem('token');
                            window.location.href = loginUrl;
                        }
                    } else {
                        reject(xhr);
                    }
                });
            });
        }

        // === FUNCIÓN GENERAL PARA PETICIONES NORMALES ===
        function apiRequest(options) {
            const config = {
                type: options.type || 'GET',
                url: options.url,
                headers: { "Authorization": "Bearer " + token },
                contentType: options.contentType || 'application/json',
                data: options.data || null,
            };

            return new Promise((resolve, reject) => {
                $.ajax(config).done(resolve).fail(async function(xhr) {
                    if (xhr.status === 401) {
                        try {
                            const newToken = await refreshToken();
                            token = newToken;
                            config.headers["Authorization"] = "Bearer " + newToken;
                            $.ajax(config).done(resolve).fail(reject); // reintenta solo esta
                        } catch (err) {
                            sessionStorage.removeItem('token');
                            window.location.href = loginUrl;
                        }
                    } else {
                        reject(xhr);
                    }
                });
            });
        }

        // === FUNCIÓN PARA REFRESCAR EL TOKEN ===
        function refreshToken() {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: `${apiUrl}/refresh`,
                    type: 'POST',
                    headers: { "Authorization": "Bearer " + token },
                    success: function(data) {
                        const newToken = data.access_token;
                        sessionStorage.setItem('token', newToken);
                        resolve(newToken);
                    },
                    error: function(err) {
                        reject(err);
                    }
                });
            });
        }
    </script>
    @stack('scripts')
</body>
</html>
