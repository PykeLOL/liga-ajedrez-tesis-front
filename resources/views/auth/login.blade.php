@extends('layouts.auth')

@section('title', 'Login')

@section('content')
<div class="login-card bg-white shadow rounded-4 p-4">
    <h3 class="text-center mb-4 fw-bold">Iniciar Sesión</h3>

    <form id="loginForm">
        <div class="mb-3">
            <label for="email" class="form-label">Correo electrónico</label>
            <input type="email" class="form-control" id="email" required placeholder="Ej. usuario@correo.com">
        </div>

        <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input type="password" class="form-control" id="password" required placeholder="••••••••">
        </div>

        <button type="submit" class="btn btn-primary w-100">Ingresar</button>
    </form>
    <div class="text-center mt-3">
        <a href="{{ route('registrarse') }}">¿No tienes cuenta? Regístrate</a>
    </div>
</div>
@endsection

@push('scripts')
<script>
$(document).ready(function() {
    if (sessionStorage.getItem('token')) {
        window.location.href = "{{ route('admin.index') }}";
        return;
    }

    $('#loginForm').on('submit', function(e) {
        e.preventDefault();

        let email = $('#email').val();
        let password = $('#password').val();
        $.ajax({
            url: "{{ env('API_URL') }}/login",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ email: email, password: password }),
            beforeSend: function() {
                Swal.fire({
                    title: 'Iniciando sesión...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });
            },
            success: function(response) {
                Swal.close();
                if (response.access_token) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Bienvenido!',
                        text: 'Inicio de sesión correcto',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        sessionStorage.setItem('token', response.access_token);
                        sessionStorage.setItem('user_data', JSON.stringify(response.user));
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
});
</script>
@endpush
