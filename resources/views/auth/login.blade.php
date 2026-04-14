@extends('layouts.auth')
@section('title', 'Iniciar Sesión')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/auth/login.css') }}">
@endsection

@section('content')
<div class="auth-wrapper">
    <div class="auth-form-side shadow-lg">
        <div class="d-flex flex-column align-items-start w-100">
            <a href="{{ route('home') }}" class="text-decoration-none mb-4">
                <img src="{{ asset('img/logo.png') }}" alt="Logo" class="auth-logo">
            </a>
            <h1 class="mb-1 text-white fw-bold">¡Bienvenido!</h1>
            <p class="mb-4 text-muted">Ingresa tus credenciales para continuar.</p>

            <form id="loginForm" class="w-100">
                <div class="mb-3 text-start">
                    <label for="email" class="form-label">Correo electrónico</label>
                    <input type="email" class="form-control" id="email" required placeholder="Ej. usuario@correo.com">
                </div>
                <div class="mb-3 text-start">
                    <label for="password" class="form-label">Contraseña</label>
                    <input type="password" class="form-control" id="password" required placeholder="••••••••">
                </div>

                <button type="submit" class="btn btn-primary w-100">Ingresar</button>
            </form>

            <div class="text-center w-100 mt-4">
                <a href="{{ route('registrarse') }}" class="text-decoration-none" style="color: #81b64c;">
                    ¿No tienes cuenta? <span class="fw-bold">Regístrate gratis</span>
                </a>
            </div>
        </div>
    </div>

    <div class="auth-image-side">
        <div class="position-absolute bottom-0 end-0 p-5 text-white text-end z-1">
            <h2 class="display-6 fw-bold">"El ajedrez es la vida en miniatura."</h2>
            <p class="opacity-75 fs-5">- Gary Kasparov</p>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
$(document).ready(function() {
    $.ajax({
        url: "{{ env('API_URL') }}/me",
        method: "GET",
        xhrFields: { withCredentials: true },
        success: function(resp) {
            if (!resp) {
                console.log("No hay sesión iniciada.");
                return;
            }
            const rol = resp.user.rol;
            if (rol && rol.toLowerCase() !== 'Deportista') {
                setTimeout(() => {
                    window.location.href = "{{ route('admin.index') }}";
                }, 300);
            } else {
                setTimeout(() => {
                    window.location.href = "{{ route('home') }}";
                }, 300);
            }
        }
    });
});

$('#loginForm').on('submit', function(e) {
    e.preventDefault();

    let email = $('#email').val();
    let password = $('#password').val();
    $.ajax({
        url: "{{ env('API_URL') }}/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ email: email, password: password }),
        xhrFields: { withCredentials: true },
        beforeSend: function() {
            Swal.fire({
                title: 'Iniciando sesión...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function(response) {
            Swal.close();
            if (response.user) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: 'Inicio de sesión correcto',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    localStorage.setItem('user_data', JSON.stringify(response.user));
                    localStorage.setItem('permisos', JSON.stringify(response.permisos));
                    const rol = response.user.rol;

                    if (rol && rol.toLowerCase() !== 'Deportista') {
                        setTimeout(() => {
                            window.location.href = "{{ route('admin.index') }}";
                        }, 300);
                    } else {
                        setTimeout(() => {
                            window.location.href = "{{ route('home') }}";
                        }, 300);
                    }
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: 'Respuesta inesperada del servidor.'
                });
            }
        },
        error: function(xhr) {
            Swal.close();
            let title = 'Error';
            let msg = 'Error desconocido';
            if (xhr.responseJSON && xhr.responseJSON.error) {
                title = xhr.responseJSON.error;
                msg = xhr.responseJSON.message;
            }
            Swal.fire({
                icon: 'error',
                title: title,
                text: msg
            });
        }
    });
});
</script>
@endpush
