$(document).ready(function () {
    validarSesion();
    initUsuariosTable();
    bindEvents();

    function validarSesion() {
        if (!token) {
            window.location.href = loginUrl;
        }
    }

    function initUsuariosTable() {
        console.log(`${apiUrl}/usuarios`)
        $('#usuariosTable').DataTable({
            ajax: {
                url: `${apiUrl}/usuarios`,
                type: 'GET',
                headers: { "Authorization": "Bearer " + token },
                dataSrc: ''
            },
            columns: [
                { data: 'id' },
                {
                    data: 'imagen_path',
                    render: function (path) {
                        const baseUrl = apiUrl.replace('/api', '');
                        console.log(`${baseUrl}/storage/${path}`)
                        if (path)
                            return `<img src="${baseUrl}/storage/${path}" class="rounded-circle" width="40" height="40">`;
                        else
                            return `<img src="${baseUrl}/storage/usuarios/default-user.png" class="rounded-circle" width="40" height="40">`;
                    }
                },
                { data: 'nombre' },
                { data: 'email' },
                { data: 'documento' },
                { data: 'telefono' },
                { data: 'rol' },
                {
                    data: null,
                    render: function (data) {
                        return `
                            <button class="editBtn btn btn-warning btn-sm" data-id="${data.id}">Editar</button>
                            <button class="deleteBtn btn btn-danger btn-sm" data-id="${data.id}">Eliminar</button>
                        `;
                    }
                }
            ],
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
            }
        });
    }

    function bindEvents() {
        $('#btnNuevo').on('click', function () {
            $('#usuarioForm')[0].reset();
            limpiarFormulario();
            $('#userId').val('');
            $('#usuarioModalLabel').text('Nuevo Usuario');
            $('#previewImagen').attr('src', '').addClass('d-none');
            $('#usuarioModal').modal('show');
        });

        $('#btnGuardar').on('click', function () {
            guardarUsuario();
        });

        $('#usuariosTable').on('click', '.editBtn', function () {
            const id = $(this).data('id');
            limpiarFormulario();
            editarUsuario(id);
        });

        $('#usuariosTable').on('click', '.deleteBtn', function () {
            const id = $(this).data('id');
            eliminarUsuario(id);
        });

        $('#logoutBtn').on('click', function () {
            sessionStorage.removeItem('token');
            window.location.href = loginUrl;
        });
    }

    function loadRoles() {
        $.ajax({
            url: `${apiUrl}/roles`,
            type: 'GET',
            headers: { "Authorization": "Bearer " + token },
            success: function (roles) {
                $('#rol_id').empty().append('<option value="">Seleccione un rol</option>');
                roles.forEach(r => $('#rol_id').append(`<option value="${r.id}">${r.nombre}</option>`));
            },
            error: function (xhr) {
                console.error('Error cargando roles:', xhr);
            }
        });
    }

    function guardarUsuario() {
        const id = $('#userId').val();
        const data = {
            nombre: $('#nombre').val(),
            email: $('#email').val(),
            documento: $('#documento').val(),
            telefono: $('#telefono').val(),
            rol_id: $('#rol_id').val(),
            imagen_base64: imagenBase64,
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/usuarios/${id}` : `${apiUrl}/usuarios/admin`;

        $.ajax({
            url,
            type: method,
            data: JSON.stringify(data),
            contentType: 'application/json',
            headers: { "Authorization": "Bearer " + token },
            success: function () {
                Swal.fire('Éxito', 'Usuario guardado correctamente', 'success');
                $('#usuarioModal').modal('hide');
                $('#usuariosTable').DataTable().ajax.reload(null, false);
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                Swal.fire('Error', 'No se pudo guardar el usuario', 'error');
            }
        });
    }

    function editarUsuario(id) {
        $.ajax({
            url: `${apiUrl}/usuarios/${id}`,
            type: 'GET',
            headers: { "Authorization": "Bearer " + token },
            success: function (user) {
                $('#usuarioModalLabel').text('Editar Usuario');
                $('#userId').val(user.id);
                $('#nombre').val(user.nombre);
                $('#email').val(user.email);
                $('#documento').val(user.documento);
                $('#telefono').val(user.telefono);
                $('#password').val('');
                loadRoles();
                const baseUrl = apiUrl.replace('/api', '');
                const imageUrl = user.imagen_path
                    ? `${baseUrl}/storage/${user.imagen_path}`
                    : `${baseUrl}/storage/usuarios/default-user.png`;

                $('#previewImagen')
                    .attr('src', imageUrl)
                    .removeClass('d-none');
                setTimeout(() => {
                    $('#rol_id').val(user.rol_id);
                }, 300);
                $('#usuarioModal').modal('show');
            },
            error: function (xhr) {
                console.error('Error obteniendo usuario:', xhr);
            }
        });
    }

    function eliminarUsuario(id) {
        Swal.fire({
            title: '¿Eliminar usuario?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${apiUrl}/usuarios/${id}`,
                    type: 'DELETE',
                    headers: { "Authorization": "Bearer " + token },
                    success: function () {
                        Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
                        $('#usuariosTable').DataTable().ajax.reload(null, false);
                    },
                    error: function (xhr) {
                        console.error(xhr);
                        Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
                    }
                });
            }
        });
    }

    function limpiarFormulario() {
        $('#userId').val('');
        $('#nombre, #email, #documento, #telefono, #password, #imagen').val('');
        $('#rol_id').empty();
        imagenBase64 = null;
    }

    let imagenBase64 = null;

    $('#imagen').on('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagenBase64 = e.target.result; // Esto es algo como "data:image/png;base64,iVBORw0K..."
                $('#previewImagen').attr('src', imagenBase64).show();
            };
            reader.readAsDataURL(file);
        }
    });
});
