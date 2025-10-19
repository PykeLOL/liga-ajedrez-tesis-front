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

        function processQueue(new_token) {
            requestQueue.forEach(config => {
                config.headers["Authorization"] = "Bearer " + new_token;
                $.ajax(config);
            });
            requestQueue = [];
        }

        $.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            error: function(xhr, textStatus, errorThrown) {
                const originalRequest = this;
                if (xhr.status === 401 && !originalRequest.url.includes('/refresh')) {
                    if (isRefreshing) {
                        requestQueue.push(originalRequest);
                        return;
                    }
                    isRefreshing = true;
                    $.ajax({
                        url: `${apiUrl}/refresh`,
                        type: 'POST',
                        headers: { "Authorization": "Bearer " + token },
                        success: function(data) {
                            token = data.access_token;
                            sessionStorage.setItem('token', token);
                            $.ajaxSetup({
                                beforeSend: function(xhr) {
                                    xhr.setRequestHeader("Authorization", "Bearer " + token);
                                }
                            });
                            originalRequest.headers["Authorization"] = "Bearer " + token;
                            $.ajax(originalRequest);
                            processQueue(token);
                        },
                        error: function(refreshXhr) {
                            console.error("Fallo al refrescar el token:", refreshXhr);
                            sessionStorage.removeItem('token');
                            window.location.href = loginUrl;
                        },
                        complete: function() {
                            isRefreshing = false;
                        }
                    });
                }
            }
        });
    </script>
    @stack('scripts')
</body>
</html>
