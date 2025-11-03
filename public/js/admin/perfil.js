$(document).ready(function () {
    const acciones = ['ver', 'editar'];
    const modulo = "perfil";

    validarPermisos(modulo, acciones);
    initPerfilData();
    cargarPermisosPerfil();

    let usuarioActual = null;
    let avatarActual = null;

    function initPerfilData() {
        apiRequest({ url: `${apiUrl}/perfil`, type: 'GET' })
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
                $('#userEmail').text(usuario.email);
                $('#userTelefono').text(usuario.telefono || 'No registrado');
                $('#userDocumento').text(usuario.documento);
                $('#userRol').text(usuario.rol?.nombre ?? 'Sin rol');
            })
            .catch(err => {
                console.error('Error cargando perfil:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema obteniendo tus datos, inicia sesión nuevamente.'
                }).then(() => window.location.href = loginUrl);
            });
    }

    function cargarPermisosPerfil() {
        apiRequest({
            url: `${apiUrl}/perfil/permisos`,
            type: 'GET'
        })
        .then(data => {
            $('#nombreRol').text(data.nombre_rol || 'Sin rol asignado');

            if ($.fn.DataTable.isDataTable('#tablaPermisosRol')) {
                $('#tablaPermisosRol').DataTable().destroy();
            }
            if ($.fn.DataTable.isDataTable('#tablaPermisosUsuario')) {
                $('#tablaPermisosUsuario').DataTable().destroy();
            }

            const permisosRolAgrupados = agruparPermisos(data.permisos_rol);
            const permisosUsuarioAgrupados = agruparPermisos(data.permisos_usuario);

            $('#tablaPermisosRol').DataTable({
                data: permisosRolAgrupados,
                columns: [
                    { data: 'modulo', title: 'Módulo' },
                    {
                        data: 'acciones',
                        title: 'Acciones',
                        render: function (acciones) {
                            if (!Array.isArray(acciones)) return '';
                            return acciones.map(a => {
                                const color = getBadgeColor(a);
                                return `<span class="badge ${color} me-1">${a}</span>`;
                            }).join('');
                        }
                    }
                ],
                language: { url: dataTablesLangUrl },
                paging: true,
                searching: true,
                info: false,
                order: [[0, 'asc']],
                responsive: true
            });

            $('#tablaPermisosUsuario').DataTable({
                data: permisosUsuarioAgrupados,
                columns: [
                    { data: 'modulo', title: 'Módulo' },
                    {
                        data: 'acciones',
                        title: 'Acciones',
                        render: function (acciones) {
                            if (!Array.isArray(acciones)) return '';
                            return acciones.map(a => {
                                const color = getBadgeColor(a);
                                return `<span class="badge ${color} me-1">${a}</span>`;
                            }).join('');
                        }
                    }
                ],
                language: { url: dataTablesLangUrl },
                paging: true,
                searching: true,
                info: false,
                order: [[0, 'asc']],
                responsive: true
            });
        })
        .catch(err => {
            console.error('Error cargando permisos:', err);
            Swal.fire('Error', 'No se pudieron cargar los permisos del perfil.', 'error');
        });
    }

    function agruparPermisos(permisos) {
        if (!permisos || permisos.length === 0) return [];

        const grupos = {};

        permisos.forEach(p => {
            if (!p.nombre) return;

            const partes = p.nombre.split('-');
            if (partes.length < 2) return;

            const accion = partes[0].charAt(0).toUpperCase() + partes[0].slice(1);
            const modulo = partes.slice(1).join('-').replaceAll('-', ' ');
            const moduloCapitalizado = modulo.charAt(0).toUpperCase() + modulo.slice(1);

            if (!grupos[moduloCapitalizado]) {
                grupos[moduloCapitalizado] = [];
            }

            if (!grupos[moduloCapitalizado].includes(accion)) {
                grupos[moduloCapitalizado].push(accion);
            }
        });

        // 🔹 Devolvemos el array sin hacer join
        return Object.entries(grupos).map(([modulo, acciones]) => ({
            modulo,
            acciones
        }));
    }

    function getBadgeColor(accion) {
        accion = accion.toLowerCase();
        if (accion.includes('ver')) return 'bg-primary';
        if (accion.includes('editar')) return 'bg-success';
        if (accion.includes('crear')) return 'bg-warning text-dark';
        if (accion.includes('eliminar')) return 'bg-danger';
        if (accion.includes('permisos')) return 'bg-info text-dark';
        return 'bg-secondary';
    }


    $(document).on('click', '#btnEditarPerfil', function () {
        const modal = new bootstrap.Modal('#modalEditarPerfil');
        modal.show();

        $('#previewAvatar').attr('src', avatarActual);
        $('#nombre').val(usuarioActual.nombre);
        $('#apellido').val(usuarioActual.apellido ?? '');
        $('#documento').val(usuarioActual.documento);
        $('#email').val(usuarioActual.email);
        $('#telefono').val(usuarioActual.telefono ?? '');

        const tel = usuarioActual.telefono ? usuarioActual.telefono.trim() : '';
        $('#editTelefono').val(tel);
    });

    let imagenBase64 = null;

    $('#imagenPerfil').on('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagenBase64 = e.target.result;
                $('#previewAvatar').attr('src', imagenBase64).show();
            };
            reader.readAsDataURL(file);
        }
    });

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
                    Swal.fire({ icon: 'success', title: 'Foto eliminada' });
                    initPerfilData();
                })
                .catch(err => console.error('Error eliminando foto:', err));
        }
    });

    $('#formEditarPerfil').on('submit', function (e) {
        e.preventDefault();
        if (!validarCamposRequeridos('#formEditarPerfil')) {
            Swal.fire('Advertencia', 'Por favor completa los campos obligatorios.', 'warning');
            return;
        }
        const data = {
            nombre: $('#nombre').val(),
            apellido: $('#apellido').val(),
            email: $('#email').val(),
            documento: $('#documento').val(),
            telefono: $('#telefono').val(),
            rol_id: $('#rol_id').val(),
            imagen_base64: imagenBase64,
        };

        apiRequest({
            url: `${apiUrl}/perfil`,
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json'
        })
            .then(() => {
                Swal.fire({ icon: 'success', title: 'Perfil actualizado' });
                initPerfilData();
                bootstrap.Modal.getInstance($('#modalEditarPerfil')).hide();
            })
            .catch(err => {
                console.error('Error actualizando perfil:', err);
                Swal.fire('Error', 'No se pudo actualizar el perfil.', 'error');
            });
    });

    $(document).on('input change', '.required', function() {
        if ($(this).val()?.trim()) {
            $(this).removeClass('is-invalid');
            $(this).next('.invalid-feedback').remove();
        }
    });

    $(document).on('click', '#btnCambiarContrasena', function () {
        const modal = new bootstrap.Modal('#modalCambiarContrasena');
        modal.show();

        $('#formCambiarContrasena')[0].reset();
    });

    $('#formCambiarContrasena').on('submit', function (e) {
        e.preventDefault();
        if (!validarCamposRequeridos('#formCambiarContrasena')) {
            Swal.fire('Advertencia', 'Por favor completa los campos obligatorios.', 'warning');
            return;
        }
        const actual = $('#contrasena_actual').val().trim();
        const nueva = $('#contrasena_nueva').val().trim();
        const confirmar = $('#confirmar_contrasena').val().trim();

        if (nueva === actual) {
            Swal.fire('Error', 'La nueva contraseña no puede ser igual a la actual.', 'warning');
            $('#contrasena_nueva').addClass('is-invalid');
            $('#contrasena_nueva').after('<div class="invalid-feedback">La nueva contraseña no puede ser igual a la actual.</div>');
            return;
        }
        if (nueva !== confirmar) {
            Swal.fire('Error', 'Las contraseñas nuevas no coinciden.', 'warning');
            $('#contrasena_nueva').addClass('is-invalid');
            $('#confirmar_contrasena').addClass('is-invalid');
            $('#contrasena_nueva').after('<div class="invalid-feedback">Las contraseñas no coinciden.</div>');
            $('#confirmar_contrasena').after('<div class="invalid-feedback">Las contraseñas no coinciden.</div>');
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
            bootstrap.Modal.getInstance($('#modalCambiarContrasena')).hide();
            $('#formCambiarContrasena')[0].reset();
        })
        .catch(err => {
            console.error('Error cambiando contraseña:', err);
            $('#contrasena_actual').removeClass('is-invalid');
            $('#contrasena_actual').next('.invalid-feedback').remove();
            const code = err?.status;
            const message = err?.responseJSON.message || 'No se pudo cambiar la contraseña.';

            if (code === 423) {
                $('#contrasena_actual').addClass('is-invalid');
                $('#contrasena_actual').after('<div class="invalid-feedback">La contraseña actual es incorrecta.</div>');
            }

            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: message
            });
        });
    });

});
