function initTablaDeportistas(clubId) {
    if (!clubId) {
        if (tablaDeportistasModal) {
            tablaDeportistasModal.clear().draw();
        }
        return;
    }

    if ($.fn.DataTable.isDataTable('#deportistasModalTable')) {
        $('#deportistasModalTable').DataTable().destroy();
    }

    $('#checkTodosDeportistas').prop('checked', false);

    console.log(deportistasEntrenamiento);

    tablaDeportistasModal = $('#deportistasModalTable').DataTable({
        ajax: function(data, callback) {
            apiRequest({
                url: `${apiUrl}/select/deportistas?club_id=${clubId}`,
                type: 'GET'
            })
            .then(response => {
                const disponibles = response.filter(deportista =>
                    !deportistasEntrenamiento.some(d => d.id == deportista.id)
                );

                callback({ data: disponibles });
            })
            .catch(() => callback({ data: [] }));
        },
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        autoWidth: false,
        columns: [
            {
                data: null,
                orderable: false,
                searchable: false,
                className: 'text-center',
                render(data) {
                    return `
                        <input
                            type="checkbox"
                            class="deportista-modal-check"
                            value="${data.id}">
                    `;
                }
            },
            {
                data: 'nombre',
                render(data, type, row) {
                    return row.titulo
                        ? `${row.titulo} ${data}`
                        : data;
                }
            },
            { data: 'numero_identificacion' },
            { data: 'titulo' },
            { data: 'categoria' }
        ],
        language: {
            url: dataTablesLangUrl
        }
    });
}


function limpiarDeportistasEntrenamiento() {
    deportistasEntrenamiento = [];
    renderListaDeportistasEntrenamiento();
}

function renderListaDeportistasEntrenamiento() {
    const contenedor = $('#listaDeportistasEntrenamiento');
    contenedor.empty();

    if (!deportistasEntrenamiento.length) {
        contenedor.html(`
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    No hay deportistas agregados.
                </td>
            </tr>
        `);

        $('#btnEliminarDeportistas').prop('disabled', true);
        return;
    }

    deportistasEntrenamiento.forEach(deportista => {
        contenedor.append(`
            <tr>
                <td class="text-center">
                    <input
                        class="form-check-input deportista-check"
                        type="checkbox"
                        value="${deportista.id}">
                </td>
                <td>${deportista.nombre}</td>
                <td>${deportista.numero_identificacion ?? ''}</td>
                <td>${deportista.titulo ?? ''}</td>
                <td>${deportista.categoria ?? ''}</td>
            </tr>
        `);
    });

    $('#btnEliminarDeportistas').prop('disabled', true);
}

function abrirModalDeportistas() {
    const $select = $('#clubFiltroDeportistas');

    $select.val('').trigger('change');
    $('#deportistasModalTable tbody').empty();

    $('#modalDeportistas').modal('show');
}

function agregarDeportistasSeleccionados() {
    tablaDeportistasModal.rows().every(function () {
        const fila = this.data();

        const checked = $(this.node())
            .find('.deportista-modal-check')
            .is(':checked');

        if (checked) {
            deportistasEntrenamiento.push(fila);
        }
    });

    renderListaDeportistasEntrenamiento();

    $('#modalDeportistas').modal('hide');
}

function eliminarDeportistasSeleccionados() {
    const ids = $('.deportista-check:checked')
        .map(function () {
            return Number($(this).val());
        })
        .get();

    if (!ids.length) {
        return;
    }

    deportistasEntrenamiento = deportistasEntrenamiento.filter(
        deportista => !ids.includes(deportista.id)
    );

    renderListaDeportistasEntrenamiento();
}
