$(document).ready(function () {

    initPerfilData();

    let usuarioActual = null;
    let avatarActual = null;
    let imagenBase64 = null;

    function initPerfilData() {

        apiRequest({
            url: `${apiUrl}/perfil`,
            type: 'GET'
        })
        .then(usuario => {
            $('#perfilLoader').hide();
            $('#perfilContainer').show();

            usuarioActual = usuario;
            const baseUrl = apiUrl.replace('/api', '');

            avatarActual = usuario.imagen_path
                ? `${baseUrl}/storage/${usuario.imagen_path}`
                : `${baseUrl}/storage/usuarios/default-user.png`;

            $('#userAvatar').attr('src', avatarActual);
            $('#userNombre').text(`${usuario.nombre} ${usuario.apellido ?? ''}`.trim());
            $('#userEmail').text(usuario.email || 'No registrado');
            $('#userTelefono').text(usuario.telefono || 'No registrado');
            $('#userDocumento').text(usuario.numero_identificacion || 'No registrado');
            $('#userRol').text(usuario.rol?.nombre ?? 'Sin rol');

            localStorage.setItem('user_data', JSON.stringify({
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol?.nombre ?? '',
                imagen_path: usuario.imagen_path
            }));

            lucide.createIcons();
        })
        .catch(err => {

            console.error('Error cargando perfil:', err);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema obteniendo tus datos, inicia sesión nuevamente.'
            }).then(() => {

                window.location.href = loginUrl;

            });
        });
    }

    /*
    |--------------------------------------------------------------------------
    | EDITAR PERFIL
    |--------------------------------------------------------------------------
    */

    $(document).on('click', '#btnEditarPerfil', function () {

        const modal = new bootstrap.Modal(
            document.getElementById('modalEditarPerfil')
        );

        modal.show();
        $('#previewAvatar').attr('src', avatarActual);
        $('#nombre').val(usuarioActual.nombre || '');
        $('#apellido').val(usuarioActual.apellido || '');
        $('#documento').val(usuarioActual.numero_identificacion || '');
        $('#email').val(usuarioActual.email || '');
        $('#telefono').val(usuarioActual.telefono || '');
    });

    /*
    |--------------------------------------------------------------------------
    | PREVIEW IMAGEN
    |--------------------------------------------------------------------------
    */

    $('#imagenPerfil').on('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagenBase64 = e.target.result;
                $('#previewAvatar')
                    .attr('src', imagenBase64)
                    .show();
            };
            reader.readAsDataURL(file);
        }
    });

    /*
    |--------------------------------------------------------------------------
    | ELIMINAR FOTO
    |--------------------------------------------------------------------------
    */

    $('#btnEliminarFoto').on('click', async function () {
        const confirm = await Swal.fire({
            title: '¿Eliminar foto?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            apiRequest({
                url: `${apiUrl}/perfil/${usuarioActual.id}/eliminar-foto`,
                type: 'DELETE'
            })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Foto eliminada'
                });
                initPerfilData();
            })
            .catch(err => {
                console.error('Error eliminando foto:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar la foto.'
                });
            });
        }
    });

    /*
    |--------------------------------------------------------------------------
    | GUARDAR PERFIL
    |--------------------------------------------------------------------------
    */

    $('#formEditarPerfil').on('submit', function (e) {
        e.preventDefault();
        if (!validarCamposRequeridos('#formEditarPerfil')) {
            Swal.fire(
                'Advertencia',
                'Por favor completa los campos obligatorios.',
                'warning'
            );
            return;
        }

        const data = {
            email: $('#email').val(),
            telefono: $('#telefono').val(),
            imagen_base64: imagenBase64,
        };

        apiRequest({
            url: `${apiUrl}/perfil`,
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json'
        })
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Perfil actualizado'
            });
            initPerfilData();
            bootstrap.Modal
                .getInstance(document.getElementById('modalEditarPerfil'))
                .hide();

        })
        .catch(err => {
            console.error('Error actualizando perfil:', err);
            Swal.fire(
                'Error',
                'No se pudo actualizar el perfil.',
                'error'
            );
        });
    });

    /*
    |--------------------------------------------------------------------------
    | VALIDACIONES INPUTS
    |--------------------------------------------------------------------------
    */

    $(document).on('input change', '.required', function () {
        if ($(this).val()?.trim()) {
            $(this).removeClass('is-invalid');
            $(this).next('.invalid-feedback').remove();
        }
    });

    /*
    |--------------------------------------------------------------------------
    | ABRIR MODAL CONTRASEÑA
    |--------------------------------------------------------------------------
    */

    $(document).on('click', '#btnCambiarContrasena', function () {
        const modal = new bootstrap.Modal(
            document.getElementById('modalCambiarContrasena')
        );

        modal.show();
        $('#formCambiarContrasena')[0].reset();
        $('.invalid-feedback').remove();
        $('.is-invalid').removeClass('is-invalid');
    });

    /*
    |--------------------------------------------------------------------------
    | CAMBIAR CONTRASEÑA
    |--------------------------------------------------------------------------
    */

    $('#formCambiarContrasena').on('submit', function (e) {
        e.preventDefault();
        if (!validarCamposRequeridos('#formCambiarContrasena')) {

            Swal.fire(
                'Advertencia',
                'Por favor completa los campos obligatorios.',
                'warning'
            );

            return;
        }

        const actual = $('#contrasena_actual').val().trim();
        const nueva = $('#contrasena_nueva').val().trim();
        const confirmar = $('#confirmar_contrasena').val().trim();

        $('.invalid-feedback').remove();
        $('.is-invalid').removeClass('is-invalid');
        if (nueva === actual) {
            $('#contrasena_nueva').addClass('is-invalid');
            $('#contrasena_nueva').after(`
                <div class="invalid-feedback">
                    La nueva contraseña no puede ser igual a la actual.
                </div>
            `);
            Swal.fire(
                'Error',
                'La nueva contraseña no puede ser igual a la actual.',
                'warning'
            );
            return;
        }

        if (nueva !== confirmar) {
            $('#contrasena_nueva').addClass('is-invalid');
            $('#confirmar_contrasena').addClass('is-invalid');
            $('#contrasena_nueva').after(`
                <div class="invalid-feedback">
                    Las contraseñas no coinciden.
                </div>
            `);

            $('#confirmar_contrasena').after(`
                <div class="invalid-feedback">
                    Las contraseñas no coinciden.
                </div>
            `);

            Swal.fire(
                'Error',
                'Las contraseñas nuevas no coinciden.',
                'warning'
            );

            return;
        }

        apiRequest({
            url: `${apiUrl}/perfil/cambiar-contrasena`,
            type: 'PUT',
            data: JSON.stringify({
                actual,
                nueva
            }),
            contentType: 'application/json'
        })
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Contraseña actualizada',
                text: 'Tu contraseña se cambió correctamente.'
            });
            bootstrap.Modal
                .getInstance(document.getElementById('modalCambiarContrasena'))
                .hide();

            $('#formCambiarContrasena')[0].reset();

        })
        .catch(err => {
            console.error('Error cambiando contraseña:', err);
            $('#contrasena_actual')
                .removeClass('is-invalid');

            $('#contrasena_actual')
                .next('.invalid-feedback')
                .remove();

            const code = err?.status;
            const message =
                err?.responseJSON?.message
                || 'No se pudo cambiar la contraseña.';

            if (code === 423) {
                $('#contrasena_actual').addClass('is-invalid');
                $('#contrasena_actual').after(`
                    <div class="invalid-feedback">
                        La contraseña actual es incorrecta.
                    </div>
                `);
            }

            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: message
            });
        });
    });

});
