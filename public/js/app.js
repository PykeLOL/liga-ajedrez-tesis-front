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

function validarPermisosMenu(permisos) {
    document.querySelectorAll('.nav-link-chess').forEach(link => {
        const tienePermiso = [...link.classList].some(clase => permisos.includes(clase));
        const item = link.closest('.nav-item-chess');
        if (item && tienePermiso) item.style.display = '';
    });
}

async function validarPermisos(modulo, acciones) {
    const permisos = await obtenerPermisosUsuario();
    validarPermisosMenu(permisos);
    acciones.forEach(accion => {
        const nombrePermiso = `${accion}-${modulo}`;
        const selectores = getSelectorPorAccion(accion);
        selectores.forEach(selector => {
            if (permisos.includes(nombrePermiso)) {
                $(selector).removeClass('d-none');
            } else {
                $(selector).addClass('d-none');
            }
        });
    });
}

function getSelectorPorAccion(accion) {
    const map = {
        ver: ['.btnVer'],
        crear: ['.btnNuevo'],
        editar: ['.btnEditar', '.btnAsistencia', '.btnInscripciones'],
        eliminar: ['.btnEliminar'],
        permisos: ['.btnPermisos'],
        generar: ['.btnGenerar'],
        autorizar: ['.btnAutorizar'],
    };

    return map[accion] ?? [];
}

function datatableAjax(url, options = {}) {
    const config = {
        url: url,
        type: options.type || 'GET',
        contentType: options.contentType || 'application/json',
        data: options.data || null,
        xhrFields: { withCredentials: true },
        headers: {
            "Accept": "application/json"
        },
        ...options
    };

    return new Promise((resolve, reject) => {
        $.ajax(config).done(resolve).fail(async function(xhr) {
            if (xhr.status === 401) {
                try {
                    await refreshToken();
                    $.ajax(config).done(resolve).fail(reject);
                } catch (err) {
                    localStorage.removeItem('user_data');
                    window.location.href = loginUrl;
                }
            } else {
                reject(xhr);
            }
        });
    });
}

function apiRequest(options) {
    const isFormData = options.data instanceof FormData;
    const config = {
        type: options.type || 'GET',
        url: options.url,
        data: options.data || null,
        processData: !isFormData,
        contentType: isFormData ? false : (options.contentType || 'application/json'),
        xhrFields: { withCredentials: true }, // envía cookies automáticamente
        headers: {
            "Accept": "application/json"
        }
    };

    return new Promise((resolve, reject) => {
        $.ajax(config)
        .done(resolve)
        .fail(async function(xhr) {
            if (xhr.status === 401) {
                if (!estaAutenticado()) {
                    reject(xhr);
                    return;
                }
                try {
                    await refreshToken();
                    $.ajax(config).done(resolve).fail(reject);
                } catch (err) {
                    localStorage.removeItem('user_data');
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
            xhrFields: { withCredentials: true },
            success: function(data) {
                resolve();
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
            $(this).parent().append(
                '<div class="invalid-feedback d-block">Este campo es obligatorio</div>'
            );
        }
    });

    return valido;
}

function limpiarCamposRequeridos(formSelector) {
    $(`${formSelector} .is-invalid`).removeClass('is-invalid');
    $(`${formSelector} .invalid-feedback`).remove();
}

function apiRequestNoLogin(options) {
    const config = {
        type: options.type || 'GET',
        url: options.url,
        contentType: options.contentType || 'application/json',
        data: options.data || null,
        xhrFields: { withCredentials: true }, // envía cookies automáticamente
        headers: {
            "Accept": "application/json"
        }
    };

    return new Promise((resolve, reject) => {
        $.ajax(config)
        .done(resolve)
        .fail(async function(xhr) {
            if (xhr.status === 401) {
                try {
                    await refreshToken();
                    $.ajax(config).done(resolve).fail(reject);
                } catch (err) {
                    localStorage.removeItem('user_data');
                    //window.location.href = loginUrl;
                }
            } else {
                reject(xhr);
            }
        });
    });
}

function datatableAjaxNoLogin(url, options = {}) {
    const config = {
        url: url,
        type: options.type || 'GET',
        contentType: options.contentType || 'application/json',
        data: options.data || null,
        xhrFields: { withCredentials: true },
        headers: {
            "Accept": "application/json"
        },
        ...options
    };

    return new Promise((resolve, reject) => {
        $.ajax(config).done(resolve).fail(async function(xhr) {
            if (xhr.status === 401) {
                try {
                    await refreshToken();
                    $.ajax(config).done(resolve).fail(reject);
                } catch (err) {
                    localStorage.removeItem('user_data');
                }
            } else {
                reject(xhr);
            }
        });
    });
}

function estaAutenticado() {
    return getUsuarioActual() !== null;
}

function getUsuarioActual() {
    return JSON.parse(localStorage.getItem('user_data') || 'null');
}

function mostrarModalLogin() {
    document.querySelectorAll('.modal.show').forEach(modal => {
        bootstrap.Modal.getInstance(modal)?.hide();
    });

    const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById('modalLoginRequired')
    );

    modal.show();
}

function requiereAutenticacion() {
    if (estaAutenticado()) {
        return true;
    }

    mostrarModalLogin();
    return false;
}
