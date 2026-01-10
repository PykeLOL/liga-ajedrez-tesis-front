/* public/js/modulos/mielo.js */

document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('eloChart').getContext('2d');

    // Colores FIDE / Chess.com
    const colorStandard = '#3b82f6'; // Azul
    const colorRapid = '#eab308';    // Amarillo
    const colorBlitz = '#ef4444';    // Rojo
    const colorGrid = 'rgba(255, 255, 255, 0.1)';
    const colorText = '#bababa';

    // DATOS SIMULADOS (Luego conectaremos esto a tu API/BD)
    const etiquetasMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    const datosStandard = [1800, 1810, 1805, 1820, 1835, 1830, 1845, 1850, 1850, 1860, 1845, 1850];
    const datosRapid    = [1880, 1890, 1900, 1895, 1910, 1920, 1915, 1930, 1925, 1920, 1915, 1920];
    const datosBlitz    = [1700, 1720, 1750, 1740, 1760, 1755, 1770, 1780, 1775, 1785, 1790, 1780];

    // Inicializamos el gráfico globalmente para poder acceder desde la función de filtro
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
                    tension: 0.3 // Curvatura suave
                },
                {
                    label: 'Rapid',
                    data: datosRapid,
                    borderColor: colorRapid,
                    backgroundColor: colorRapid,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.3
                },
                {
                    label: 'Blitz',
                    data: datosBlitz,
                    borderColor: colorBlitz,
                    backgroundColor: colorBlitz,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: colorText, font: { size: 12, weight: 'bold' } }
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
                    grid: { color: colorGrid },
                    ticks: { color: colorText }
                },
                y: {
                    grid: { color: colorGrid },
                    ticks: { color: colorText },
                    suggestedMin: 1600 // Para que la línea no quede pegada abajo
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
});

/**
 * Filtra las líneas del gráfico según el botón presionado
 */
function actualizarGrafico(tipo) {
    const chart = window.miGraficoElo;
    
    // Visibilidad por índice: 0=Standard, 1=Rapid, 2=Blitz
    if (tipo === 'todos') {
        chart.setDatasetVisibility(0, true);
        chart.setDatasetVisibility(1, true);
        chart.setDatasetVisibility(2, true);
    } else if (tipo === 'standard') {
        chart.setDatasetVisibility(0, true);
        chart.setDatasetVisibility(1, false);
        chart.setDatasetVisibility(2, false);
    } else if (tipo === 'blitz') {
        chart.setDatasetVisibility(0, false);
        chart.setDatasetVisibility(1, false);
        chart.setDatasetVisibility(2, true);
    }
    chart.update();
}