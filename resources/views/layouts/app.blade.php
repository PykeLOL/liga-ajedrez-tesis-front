<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>@yield('title', 'Liga de Ajedrez del Meta')</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  {{-- CSS Libraries --}}
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
  <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">

  {{-- Custom Styles --}}
  <link rel="stylesheet" href="{{ asset('css/app.css') }}">
  {{-- <link rel="stylesheet" href="{{ asset('css/web-style.css') }}"> --}}

  @yield('styles')
</head>

<body>
  <div class="d-flex" id="wrapper">
    {{-- Sidebar --}}
    @include('layouts.sidebar')

    {{-- Page Content --}}
    <div id="page-content-wrapper" class="d-flex flex-column min-vh-100">
      @include('layouts.navbar')

      <main class="container-fluid px-4 py-4 flex-grow-1">
        @yield('content')
      </main>

      @include('layouts.footer')
    </div>
  </div>

  {{-- Scripts --}}
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
  <script src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

  <script src="https://unpkg.com/lucide@latest"></script>
  <script>lucide.createIcons();</script>

  {{-- Sidebar Toggle Script --}}
  <script>
    let apiUrl = "{{ env('API_URL') }}";
    let apiUrlBase = apiUrl.replace('/api', '');
    let dataTablesLangUrl = "{{ asset('js/datatables/es-ES.json') }}"
    document.addEventListener('DOMContentLoaded', function () {
      const wrapper = document.getElementById('wrapper');
      const toggleButton = document.getElementById('menu-toggle');
      if (toggleButton) {
        toggleButton.addEventListener('click', function () {
          wrapper.classList.toggle('toggled');
        });
      }
    });
  </script>

  <script src="{{ asset('js/app.js') }}"></script>

  {{-- Lógica Global de Alertas (Feedback Visual) --}}
  @if (session('success'))
      <script>
          document.addEventListener('DOMContentLoaded', function() {
              Swal.fire({
                  icon: 'success',
                  title: '¡Excelente!',
                  text: "{{ session('success') }}",
                  background: '#262421', /* Fondo estilo chess */
                  color: '#fff',
                  confirmButtonColor: '#81b64c', /* Verde chess */
                  confirmButtonText: 'Aceptar'
              });
          });
      </script>
  @endif

  @if (session('error'))
      <script>
          document.addEventListener('DOMContentLoaded', function() {
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: "{{ session('error') }}",
                  background: '#262421',
                  color: '#fff',
                  confirmButtonColor: '#d33',
                  confirmButtonText: 'Entendido'
              });
          });
      </script>
  @endif

  @stack('scripts')
</body>
</html>
