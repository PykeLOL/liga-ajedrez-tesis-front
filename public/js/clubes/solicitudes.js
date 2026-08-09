let modalRegistroClub;
let modalAfiliacion;

const usuario=JSON.parse(localStorage.getItem('user_data')??'{}');

$(function () {
    modalRegistroClub = new bootstrap.Modal('#modalRegistroClub');
    modalAfiliacion = new bootstrap.Modal('#modalAfiliacion');

    $('#btnEnviarSolicitudClub').on('click', enviarSolicitudClub);
    $('#btnEnviarSolicitudAfiliacion').on('click', enviarSolicitudAfiliacion);
});

async function abrirModalRegistroClub() {
    if (!requiereAutenticacion()) return;

    $('#formRegistroClub')[0].reset();
    $('#presidenteClub').val(usuario.nombre);
    await cargarMunicipios();
    modalRegistroClub.show();
}

async function cargarMunicipios() {
    const municipios = await apiRequestNoLogin({
        url: `${apiUrl}/select/municipios?departamento_id=21`,
        type: 'GET'
    });

    const select = $('#municipioClub');

    if (select.hasClass('select2-hidden-accessible')) select.select2('destroy');

    select.empty().append('<option value="">Seleccione un municipio</option>');

    municipios.forEach(m => select.append(`<option value="${m.id}">${m.nombre}</option>`));

    select.select2({
        width: '100%',
        placeholder: 'Seleccione un municipio',
        dropdownParent: $('#modalRegistroClub')
    });
}

async function enviarSolicitudClub() {
    const formData = new FormData();

    formData.append('liga_id', 1);
    formData.append('nombre', $('#nombreClub').val());
    formData.append('municipio_id', $('#municipioClub').val());
    formData.append('direccion', $('#direccionClub').val());
    formData.append('descripcion', $('#descripcionClub').val());
    formData.append('logo', $('#logoClub')[0].files[0]);
    formData.append('documento', $('#documentoClub')[0].files[0]);

    try {
        await apiRequest({
            url: `${apiUrl}/home/solicitudes/club`,
            type: 'POST',
            data: formData
        });

        modalRegistroClub.hide();

        Swal.fire({
            title: 'Solicitud enviada',
            text: 'La Liga revisará la información enviada.',
            icon: 'success',
            confirmButtonColor: '#81b64c',
            background: '#262421',
            color: '#fff'
        });
    } catch (e) {
        if (e.status === 400 && e.responseJSON?.message) {
            return Swal.fire({
                title: 'Información',
                text: e.responseJSON.message,
                icon: 'info',
                confirmButtonColor: '#105ea7',
                background: '#262421',
                color: '#fff'
            });
        }
        validarRespuesta(e, 'No fue posible registrar la solicitud.');
    }
}

async function abrirModalAfiliacion(idClub, nombreClub) {
    if (!requiereAutenticacion()) return;

    if (usuario.rol !== 'Deportista') {
        return Swal.fire({
            title: 'Información',
            text: 'Solo los usuarios con el rol de Deportista pueden solicitar la afiliación a un club.',
            icon: 'info',
            confirmButtonColor: '#105ea7',
            background: '#262421',
            color: '#fff'
        });
    }

    $('#formAfiliacion')[0].reset();
    $('#club_id_afiliacion').val(idClub);
    $('#nombreClubAfiliacion').val(nombreClub);
    $('#solicitanteAfiliacion').val(usuario.nombre);

    await cargarGeneros();
    await cargarNacionalidades();

    modalAfiliacion.show();
}

async function cargarGeneros() {
    const generos = await apiRequestNoLogin({
        url: `${apiUrl}/select/generos`,
        type: 'GET'
    });

    const select = $('#generoAfiliacion');

    if (select.hasClass('select2-hidden-accessible')) select.select2('destroy');

    select.empty().append('<option value="">Seleccione un género</option>');

    generos.forEach(g => select.append(`<option value="${g.id}">${g.nombre}</option>`));

    select.select2({
        width: '100%',
        placeholder: 'Seleccione un género',
        dropdownParent: $('#modalAfiliacion')
    });
}

async function cargarNacionalidades() {
    const nacionalidades = await apiRequestNoLogin({
        url: `${apiUrl}/select/nacionalidades`,
        type: 'GET'
    });

    const select = $('#nacionalidadAfiliacion');

    if (select.hasClass('select2-hidden-accessible')) select.select2('destroy');

    select.empty().append('<option value="">Seleccione una nacionalidad</option>');

    nacionalidades.forEach(n => select.append(`<option value="${n.id}">${n.nombre}</option>`));

    select.select2({
        width: '100%',
        placeholder: 'Seleccione una nacionalidad',
        dropdownParent: $('#modalAfiliacion')
    });
}

async function enviarSolicitudAfiliacion() {
    const formData = new FormData();

    formData.append('club_id', $('#club_id_afiliacion').val());
    formData.append('fecha_nacimiento', $('#fechaNacimientoAfiliacion').val());
    formData.append('genero_id', $('#generoAfiliacion').val());
    formData.append('nacionalidad_id', $('#nacionalidadAfiliacion').val());
    formData.append('fide_id', $('#fideAfiliacion').val());
    formData.append('documento', $('#documentoAfiliacion')[0].files[0]);

    try {
        await apiRequest({
            url: `${apiUrl}/home/solicitudes/deportista`,
            type: 'POST',
            data: formData
        });

        modalAfiliacion.hide();

        Swal.fire({
            title: 'Solicitud enviada',
            text: 'El club revisará tu solicitud de afiliación.',
            icon: 'success',
            confirmButtonColor: '#81b64c',
            background: '#262421',
            color: '#fff'
        });
    } catch (e) {
        if (e.status === 400 && e.responseJSON?.message) {
            return Swal.fire({
                title: 'Información',
                text: e.responseJSON.message,
                icon: 'info',
                confirmButtonColor: '#105ea7',
                background: '#262421',
                color: '#fff'
            });
        }

        validarRespuesta(e, 'No fue posible registrar la solicitud.');
    }
}
