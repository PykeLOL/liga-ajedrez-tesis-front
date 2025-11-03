@extends('layouts.auth')

@section('title', 'Registrarse')

@section('content')
<div class="login-card bg-white shadow rounded-4 p-4">
    <h3 class="text-center mb-4 fw-bold">Crear cuenta</h3>

    <form id="registerForm" enctype="multipart/form-data">
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control required" id="nombre" name="nombre">
            </div>

            <div class="col-md-6 mb-3">
                <label for="apellido" class="form-label">Apellido</label>
                <input type="text" class="form-control required" id="apellido" name="apellido">
            </div>
        </div>

        <div class="mb-3">
            <label for="documento" class="form-label">Documento</label>
            <input type="text" class="form-control required" id="documento" name="documento">
        </div>

        <div class="mb-3">
            <label for="email" class="form-label">Correo electrónico</label>
            <input type="email" class="form-control required" id="email" name="email">
        </div>

        <div class="mb-3">
            <label for="telefono" class="form-label">Teléfono</label>
            <input type="text" class="form-control required" id="telefono" name="telefono">
        </div>

        <div class="mb-3">
            <label for="contraseña" class="form-label">Contraseña</label>
            <input type="password" class="form-control required" id="contraseña" name="contraseña">
        </div>

        <div class="mb-3">
            <label for="confirmar_contraseña" class="form-label">Confirmar Contraseña</label>
            <input type="password" class="form-control required" id="confirmar_contraseña" name="confirmar_contraseña">
        </div>

        <div class="mb-3">
            <label for="imagen" class="form-label">Foto de perfil (opcional)</label>
            <input type="file" class="form-control" id="imagen" name="imagen" accept="image/*">

            <div class="mt-3 text-center">
                <img id="previewImagen" src="#" alt="Vista previa" class="img-thumbnail d-none" width="120" style="border-radius: 50%;">
                <p id="previewTexto" class="text-muted small mt-2 d-none">Vista previa de tu foto</p>
            </div>
        </div>

        <button type="submit" class="btn btn-success w-100">Registrarse</button>

        <div class="text-center mt-3">
            <a href="{{ route('login') }}">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
    </form>
</div>
@endsection

@push('scripts')
<script>
$(document).ready(function() {
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();

        let formData = new FormData(this);

        if (!validarCamposRequeridos('#registerForm')) {
            Swal.fire('Advertencia', 'Por favor completa los campos obligatorios.', 'warning');
            return;
        }

        $.ajax({
            url: "{{ env('API_URL') }}/usuarios",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function() {
                Swal.fire({
                    title: 'Registrando usuario...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });
            },
            success: function(response) {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: '¡Cuenta creada!',
                    text: 'Tu usuario ha sido registrado correctamente',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = "{{ route('login') }}";
                });
            },
            error: function(xhr) {
                Swal.close();
                if (xhr.status === 422 && xhr.responseJSON.errors) {
                    let errors = xhr.responseJSON.errors;
                    let list = Object.values(errors).flat().join('<br>');
                    Swal.fire({
                        icon: 'warning',
                        title: 'Error de validación',
                        html: list
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al registrar',
                        text: xhr.responseJSON?.message || 'Error inesperado'
                    });
                }
            }
        });
    });

    $(document).on('input change', '.required', function() {
        if ($(this).val()?.trim()) {
            $(this).removeClass('is-invalid');
            $(this).next('.invalid-feedback').remove();
        }
    });

    $('#imagen').on('change', function () {
        const file = this.files[0];
        const preview = $('#previewImagen');
        const texto = $('#previewTexto');

        if (file) {
            // Validar tipo de archivo (solo imágenes)
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                Swal.fire('Archivo inválido', 'Por favor selecciona una imagen (JPG, PNG o WEBP).', 'warning');
                $(this).val('');
                preview.addClass('d-none');
                texto.addClass('d-none');
                return;
            }

            // Mostrar la vista previa
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.attr('src', e.target.result).removeClass('d-none');
                texto.removeClass('d-none');
            };
            reader.readAsDataURL(file);
        } else {
            // Si se quita la imagen, ocultar vista previa
            preview.addClass('d-none');
            texto.addClass('d-none');
        }
    });
});
</script>
@endpush
