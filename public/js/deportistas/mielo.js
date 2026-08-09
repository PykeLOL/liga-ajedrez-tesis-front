let datosStandard = [];
let datosRapid = [];
let datosBlitz = [];
let etiquetasMeses = [];

const params = new URLSearchParams(window.location.search);
const deportistaId = params.get('id');

const colorStandard = '#3b82f6';
const colorRapid = '#eab308';
const colorBlitz = '#ef4444';
const colorGrid = 'rgba(255,255,255,.1)';
const colorText = '#bababa';

document.addEventListener('DOMContentLoaded', () => {
    if(!deportistaId && !requiereAutenticacion()){
        return;
    }

    cargarMiElo();
});

function cargarMiElo() {
    const url = deportistaId
        ? `${apiUrl}/home/deportistas/elo/${deportistaId}`
        : `${apiUrl}/home/deportistas/mi-elo`;

    apiRequest({
        url,
        type: 'GET'
    })
    .then(response => {
        llenarPerfil(response);
        construirDatosGrafico(response.historial || []);
        crearGrafico();
    })
    .catch(xhr => validarRespuesta(xhr, 'No fue posible cargar la información del ELO.'));
}

function llenarPerfil(data) {
    const usuario = data.usuario ?? {};
    const club = data.club ?? {};
    const deportista = data.deportista ?? {};
    const elo = data.elo_actual ?? {};

    const nombreCompleto = `${usuario.nombre ?? ''} ${usuario.apellido ?? ''}`.trim();

    $('#fotoPerfil').attr(
        'src',
        usuario.foto_perfil
            ? apiUrlBase + usuario.foto_perfil
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreCompleto)}&background=262421&color=ffffff&size=300`
    );

    $('#nombreJugador').text(`${usuario.nombre ?? ''} ${usuario.apellido ?? ''}`.trim());
    $('#clubJugador').text(club.nombre ?? '-');
    $('#fideId').text(deportista.fide_id ?? '-');
    $('#edadJugador').text(usuario.edad ?? '-');

    $('#eloNacional').text(deportista.elo_nacional ?? '-');
    $('#eloInternacional').text(deportista.elo_internacional ?? '-');
    $('#categoriaJugador').text(deportista.categoria ?? '-');

    $('#tituloCompleto').text(deportista.titulo ?? 'Sin título');
    $('#paisJugador').text(deportista.nacionalidad ?? '-');

    $('#eloStandard').text(elo.standard ?? '-');
    $('#eloRapid').text(elo.rapid ?? '-');
    $('#eloBlitz').text(elo.blitz ?? '-');

    actualizarTitulo(deportista.titulo);
    actualizarVariacion('standard', data.historial);
    actualizarVariacion('rapid', data.historial);
    actualizarVariacion('blitz', data.historial);
}

function actualizarTitulo(titulo) {
    titulo = (titulo || '').toUpperCase();

    let texto = 'ST';
    let clase = 'bg-danger';

    if (titulo === 'GM' || titulo === 'GRAN MAESTRO') {
        texto = 'GM';
        clase = 'bg-dark';
    } else if (titulo === 'IM' || titulo === 'MAESTRO INTERNACIONAL') {
        texto = 'IM';
        clase = 'bg-primary';
    } else if (titulo === 'FM' || titulo === 'MAESTRO FIDE') {
        texto = 'FM';
        clase = 'bg-success';
    } else if (titulo === 'CM') {
        texto = 'CM';
        clase = 'bg-warning text-dark';
    }

    $('#tituloBadge')
        .removeClass()
        .addClass(`badge border border-dark rounded-pill badge-title ${clase}`)
        .text(texto);
}

function actualizarVariacion(tipo, historial) {
    const lista = historial
        .filter(x => x.tipo === tipo)
        .sort((a, b) => `${b.anio}${b.mes}`.localeCompare(`${a.anio}${a.mes}`));

    const actual = lista[0]?.elo;
    const anterior = lista[1]?.elo;

    let badge = $(`#badge${capitalizar(tipo)}`);
    let barra = $(`#barra${capitalizar(tipo)}`);

    badge.removeClass();

    if (actual == null) {
        badge
            .addClass('badge bg-secondary bg-opacity-10 text-secondary border border-secondary')
            .html('<i class="bi bi-dash"></i> 0');
        barra.css('width', '0%');
        return;
    }

    const variacion = anterior == null ? 0 : actual - anterior;

    if (variacion > 0) {
        badge
            .addClass('badge bg-success bg-opacity-10 text-success border border-success')
            .html(`<i class="bi bi-arrow-up-short"></i> +${variacion}`);
    } else if (variacion < 0) {
        badge
            .addClass('badge bg-danger bg-opacity-10 text-danger border border-danger')
            .html(`<i class="bi bi-arrow-down-short"></i> ${variacion}`);
    } else {
        badge
            .addClass('badge bg-secondary bg-opacity-10 text-secondary border border-secondary')
            .html('<i class="bi bi-dash"></i> 0');
    }

    barra.css('width', `${Math.min(actual / 3000 * 100,100)}%`);
}

function construirDatosGrafico(historial) {
    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

    const fechas = [...new Set(
        historial.map(x => `${x.anio}-${x.mes.padStart(2,'0')}`)
    )]
    .sort()
    .slice(-12);

    etiquetasMeses = fechas.map(f => {
        const [a,m]=f.split('-');
        return `${meses[parseInt(m)-1]}`;
    });

    datosStandard = fechas.map(f => buscarElo(historial,'standard',f));
    datosRapid = fechas.map(f => buscarElo(historial,'rapid',f));
    datosBlitz = fechas.map(f => buscarElo(historial,'blitz',f));
}

function buscarElo(historial,tipo,fecha){
    const item=historial.find(x=>x.tipo===tipo&&`${x.anio}-${x.mes.padStart(2,'0')}`===fecha);
    return item?item.elo:null;
}

function capitalizar(txt){
    return txt.charAt(0).toUpperCase()+txt.slice(1);
}

function crearGrafico() {
    const ctx = document.getElementById('eloChart').getContext('2d');

    if (window.miGraficoElo)
        window.miGraficoElo.destroy();

    window.miGraficoElo = new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetasMeses,
            datasets: [
                {
                    label: 'Standard',
                    data: datosStandard,
                    borderColor: colorStandard,
                    backgroundColor: colorStandard,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    spanGaps: true,
                    tension: .3
                },
                {
                    label: 'Rapid',
                    data: datosRapid,
                    borderColor: colorRapid,
                    backgroundColor: colorRapid,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    spanGaps: true,
                    tension: .3
                },
                {
                    label: 'Blitz',
                    data: datosBlitz,
                    borderColor: colorBlitz,
                    backgroundColor: colorBlitz,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    spanGaps: true,
                    tension: .3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: colorText,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#262421',
                    titleColor: '#fff',
                    bodyColor: '#bababa',
                    borderColor: '#555',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: {
                        color: colorGrid
                    },
                    ticks: {
                        color: colorText
                    }
                },
                y: {
                    grid: {
                        color: colorGrid
                    },
                    ticks: {
                        color: colorText
                    },
                    suggestedMin: Math.min(
                        ...[
                            ...datosStandard,
                            ...datosRapid,
                            ...datosBlitz
                        ].filter(x => x != null)
                    ) - 30
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

window.actualizarGrafico = function(tipo) {
    const chart = window.miGraficoElo;

    if (!chart)
        return;

    if (tipo === 'todos') {
        chart.setDatasetVisibility(0, true);
        chart.setDatasetVisibility(1, true);
        chart.setDatasetVisibility(2, true);
    } else if (tipo === 'standard') {
        chart.setDatasetVisibility(0, true);
        chart.setDatasetVisibility(1, false);
        chart.setDatasetVisibility(2, false);
    } else if (tipo === 'rapid') {
        chart.setDatasetVisibility(0, false);
        chart.setDatasetVisibility(1, true);
        chart.setDatasetVisibility(2, false);
    } else if (tipo === 'blitz') {
        chart.setDatasetVisibility(0, false);
        chart.setDatasetVisibility(1, false);
        chart.setDatasetVisibility(2, true);
    }

    chart.update();
};
