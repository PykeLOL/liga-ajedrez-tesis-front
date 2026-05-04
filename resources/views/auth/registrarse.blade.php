@extends('layouts.auth')
@section('title', 'Registrarse')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/auth/registrarse.css') }}">
@endsection

@section('content')
<div class="auth-wrapper">
    {{-- LADO IZQUIERDO: FORMULARIO --}}
    <div class="auth-form-side shadow-lg">
        <div class="form-content-wrapper">

            <a href="{{ route('home') }}" class="text-decoration-none d-block mb-3">
                <img src="{{ asset('img/logo.png') }}" alt="Logo" class="auth-logo">
            </a>

            <h2 class="fw-bold text-white mb-1">Crear cuenta</h2>
            <p class="text-muted mb-4 small">Únete a la comunidad de ajedrez más grande del Meta.</p>

            {{-- TU FORMULARIO ORIGINAL (Con tus IDs y Names exactos) --}}
            <form id="registerForm" enctype="multipart/form-data">
                <div class="row g-2">
                    <div class="col-md-6 mb-3 text-start">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control required" id="nombre" name="nombre">
                    </div>
                    <div class="col-md-6 mb-3 text-start">
                        <label for="apellido" class="form-label">Apellido</label>
                        <input type="text" class="form-control required" id="apellido" name="apellido">
                    </div>
                </div>

                <div class="mb-3">
                    <label for="tipo_identificacion_id" class="form-label">Tipo Identificacion</label>
                    <select id="tipo_identificacion_id" name="tipo_identificacion_id" class="form-select required" required style="width:100%"></select>
                </div>

                <div class="mb-3 text-start">
                    <label for="numero_identificacion" class="form-label">Documento</label>
                    <input type="text" class="form-control required" id="numero_identificacion" name="numero_identificacion">
                </div>

                <div class="mb-3 text-start">
                    <label for="email" class="form-label">Correo electrónico</label>
                    <input type="email" class="form-control required" id="email" name="email">
                </div>

                <div class="mb-3 text-start">
                    {{-- Corregido: ID 'telefono' en lugar de 'celular' --}}
                    <label for="telefono" class="form-label">Teléfono</label>
                    <input type="text" class="form-control required" id="telefono" name="telefono">
                </div>

                <div class="mb-3 text-start">
                    {{-- Corregido: ID 'contraseña' en lugar de 'password' --}}
                    <label for="contraseña" class="form-label">Contraseña</label>
                    <input type="password" class="form-control required" id="contraseña" name="contraseña">
                </div>

                <div class="mb-3 text-start">
                    {{-- Agregado: Confirmar contraseña --}}
                    <label for="confirmar_contraseña" class="form-label">Confirmar Contraseña</label>
                    <input type="password" class="form-control required" id="confirmar_contraseña" name="confirmar_contraseña">
                </div>

                <div class="mb-4 text-start">
                    <label for="imagen" class="form-label">Foto de perfil (opcional)</label>
                    <input type="file" class="form-control" id="imagen" name="imagen" accept="image/*">

                    {{-- Preview de imagen original --}}
                    <div class="mt-3 text-center">
                        <img id="previewImagen" src="#" alt="Vista previa" class="d-none" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 2px solid #81b64c; margin: 0 auto;">
                        <p id="previewTexto" class="text-muted small mt-2 d-none">Vista previa de tu foto</p>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary w-100 mb-3">Registrarse</button>
            </form>

            <div class="text-center w-100 text-muted small pb-4">
                ¿Ya tienes cuenta? <a href="{{ route('login') }}" class="text-decoration-none fw-bold" style="color: #81b64c;">Inicia sesión</a>
            </div>
        </div>
    </div>

    {{-- LADO DERECHO: IMAGEN --}}
    <div class="auth-image-side">
        <div class="position-absolute bottom-0 end-0 p-5 text-white text-end z-1">
            <h3 class="fw-bold">Compite con los mejores</h3>
            <p class="opacity-75">Torneos, rankings y comunidad en un solo lugar.</p>
        </div>
    </div>
</div>
@endsection
@push('scripts')
<script>
$(document).ready(function() {
    loadTiposIdentificacion();
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
                    localStorage.clear();
                    $.ajax({
                        url: "{{ env('API_URL') }}/logout",
                        type: "POST",
                        xhrFields: { withCredentials: true }, // envía cookies
                        success: function(resp) {
                            localStorage.clear();
                            window.location.href = '{{ route('login') }}';
                        },
                        error: function(xhr) {
                            localStorage.clear();
                            window.location.href = '{{ route('login') }}';
                        }
                    });
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
            preview.addClass('d-none');
            texto.addClass('d-none');
        }
    });

    function loadTiposIdentificacion() {
        apiRequest({
            url: `{{ env('API_URL') }}/select/tipos-identificacion`,
            type: 'GET'
        })
        .then(tiposIdentificacion => {
            const $tipoIdentificacionSelect = $('#tipo_identificacion_id');
            $tipoIdentificacionSelect.empty().append('<option value="">Seleccione un tipo de identificacion</option>');
            tiposIdentificacion.forEach(t => {
                $tipoIdentificacionSelect.append(new Option(t.nombre, t.id, false, false));
            });
            if ($tipoIdentificacionSelect.hasClass('select2-hidden-accessible')) {
                $tipoIdentificacionSelect.trigger('change.select2');
            } else {
                $tipoIdentificacionSelect.select2({
                    placeholder: 'Seleccione un tipo de identificacion',
                    allowClear: true,
                    width: 'resolve',
                    dropdownParent: $('#usuarioModal')
                });
            }
        })
        .catch(xhr => console.error('Error cargando tipos de identificacion:', xhr));
    }
});
</script>
@endpush
