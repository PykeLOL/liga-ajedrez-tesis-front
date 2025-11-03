let permisosUsuario = null;

async function obtenerPermisosUsuario() {
    if (permisosUsuario) return permisosUsuario; // si ya se cargaron, no volver a llamar
    try {
        const response = await apiRequest({
            url: `${apiUrl}/usuarios/permisos/mi-usuario`,
            type: 'GET'
        });
        permisosUsuario = response.permisos || [];
        return permisosUsuario;
    } catch (err) {
        console.error('Error al obtener permisos:', err);
        permisosUsuario = [];
        return [];
    }
}

async function tienePermiso(nombrePermiso) {
    const permisos = await obtenerPermisosUsuario();
    return permisos.includes(nombrePermiso);
}

async function validarPermisos(modulo, acciones) {
    const permisos = await obtenerPermisosUsuario();
    acciones.forEach(accion => {
        const nombrePermiso = `${accion}-${modulo}`;
        const selectorBoton = getSelectorPorAccion(accion);
        if (!selectorBoton) return;
        if (permisos.includes(nombrePermiso)) {
            $(selectorBoton).removeClass('d-none');
        } else {
            $(selectorBoton).addClass('d-none');
        }
    });
}


function getSelectorPorAccion(accion) {
    const map = {
        ver: '#btnVer',
        crear: '.btnNuevo',
        editar: '.btnEditar',
        eliminar: '.btnEliminar',
        permisos: '.btnPermisos',
    };
    return map[accion];
}

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
                    localStorage.removeItem('token');
                    window.location.href = loginUrl;
                }
            } else {
                reject(xhr);
            }
        });
    });
}

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
                    localStorage.removeItem('token');
                    window.location.href = loginUrl;
                }
            } else {
                reject(xhr);
            }
        });
    });
}

function validarRespuesta(xhr, mensaje) {
    console.error('Error en la solicitud:', xhr);
        let titulo = 'Error';
        let icono = 'error';

        if (xhr.responseJSON) {
            const res = xhr.responseJSON;
            // Error de validación (422)
            if (res.errors) {
                titulo = 'Advertencia';
                icono = 'warning';
                const errores = Object.values(res.errors).flat();
                mensaje = errores.join('<br>');
            }
            // Error de permisos (403)
            else if (res.message && xhr.status === 403) {
                titulo = 'Advertencia';
                icono = 'warning';
                mensaje = 'No tienes permiso para realizar esta acción.';
            }
            // Mensaje genérico del backend
            else if (res.message) {
                mensaje = res.message;
            }
        }
        Swal.fire({
            title: titulo,
            html: mensaje,
            icon: icono
        });
}

function refreshToken() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${apiUrl}/refresh`,
            type: 'POST',
            headers: { "Authorization": "Bearer " + token },
            success: function(data) {
                const newToken = data.access_token;
                localStorage.setItem('token', newToken);
                resolve(newToken);
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

function validarCamposRequeridos(formSelector) {
    let valido = true;

    $(`${formSelector} .is-invalid`).removeClass('is-invalid');
    $(`${formSelector} .invalid-feedback`).remove();

    $(`${formSelector} .required`).each(function() {
        const valor = $(this).val()?.trim();
        if (!valor) {
            valido = false;
            $(this).addClass('is-invalid');
            $(this).after('<div class="invalid-feedback">Este campo es obligatorio</div>');
        }
    });

    return valido;
}

function limpiarCamposRequeridos(formSelector) {
    $(`${formSelector} .is-invalid`).removeClass('is-invalid');
    $(`${formSelector} .invalid-feedback`).remove();
}
