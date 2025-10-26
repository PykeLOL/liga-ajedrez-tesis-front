async function tienePermiso(nombrePermiso) {
    return new Promise((resolve, reject) => {
        apiRequest({
            url: `${apiUrl}/usuarios/permisos/mi-usuario`,
            type: 'GET'
        })
        .then(response => {
            console.log(response);
            const permisos = response.permisos || [];
            resolve(permisos.includes(nombrePermiso));
        })
        .catch(err => {
            console.error('Error al verificar permiso:', err);
            resolve(false);
        });
    });
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
                    sessionStorage.removeItem('token');
                    window.location.href = loginUrl;
                }
            } else {
                reject(xhr);
            }
        });
    });
}

// === FUNCIÓN GENERAL PARA PETICIONES NORMALES ===
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
                    sessionStorage.removeItem('token');
                    window.location.href = loginUrl;
                }
            } else {
                reject(xhr);
            }
        });
    });
}

// === FUNCIÓN PARA REFRESCAR EL TOKEN ===
function refreshToken() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${apiUrl}/refresh`,
            type: 'POST',
            headers: { "Authorization": "Bearer " + token },
            success: function(data) {
                const newToken = data.access_token;
                sessionStorage.setItem('token', newToken);
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
