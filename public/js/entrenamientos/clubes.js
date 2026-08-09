let paginaActual=1;
const porPagina=12;

document.addEventListener("DOMContentLoaded",()=>{

    if(document.getElementById("clubsGrid"))
        cargarClubes();

});

function cargarClubes(){

    $.ajax({

        url:`${apiUrl}/home/clubes?page=${paginaActual}&per_page=${porPagina}`,
        type:"GET",
        dataType:"json",

        success:r=>{

            renderClubes(r.data);
            renderPaginacion(r.meta);

        },

        error:e=>console.error(e)

    });

}

function renderClubes(clubes){

    const grid=$("#clubsGrid");

    grid.empty();

    if(!clubes?.length){

        grid.html(`
            <div class="col-12 text-center py-5">
                <i class="bi bi-shield-x display-4 text-muted"></i>
                <h5 class="text-muted mt-3">
                    No hay clubes disponibles
                </h5>
            </div>
        `);

        return;

    }

    clubes.forEach(club=>{

        const logo=club.logo
            ?`${apiUrlBase}${club.logo}`
            :"https://cdn-icons-png.flaticon.com/512/3069/3069172.png";

        const presidente=club.presidente
            ?`${club.presidente.nombre} ${club.presidente.apellido}`
            :"No registrado";

        grid.append(`

            <div class="club-card">

                <div class="club-header">

                    <img
                        src="${logo}"
                        class="club-logo"
                        alt="${club.nombre}">

                </div>

                <div class="club-body">

                    <div class="club-title">
                        ${club.nombre}
                    </div>

                    <div class="club-president">
                        <i class="bi bi-person-fill me-1"></i>
                        ${presidente}
                    </div>

                    <div class="club-info-item">
                        <i class="bi bi-geo-alt-fill"></i>
                        ${club.ubicacion??"Sin ubicación"}
                    </div>

                    <div class="club-info-item">
                        <i class="bi bi-diagram-3-fill"></i>
                        ${club.liga?.nombre??"Sin liga"}
                    </div>

                </div>

                <div class="club-footer">

                    <button
                        class="btn btn-chess w-100 fw-bold"
                        onclick="verEntrenamientos(${club.id})">

                        <i class="bi bi-calendar2-week-fill me-2"></i>

                        Ver entrenamientos

                    </button>

                </div>

            </div>

        `);

    });

}

function renderPaginacion(meta){

    const pag=$("#paginacion");

    pag.empty();

    if(!meta||meta.last_page<=1)
        return;

    for(let i=1;i<=meta.last_page;i++){

        pag.append(`

            <button
                class="btn btn-sm mx-1 ${i===meta.current_page?"btn-chess":"btn-outline-secondary"}"
                onclick="cambiarPagina(${i})">

                ${i}

            </button>

        `);

    }

}

function cambiarPagina(pagina){

    paginaActual=pagina;

    cargarClubes();

}

function verEntrenamientos(id){

    location.href=`/entrenamientos?club_id=${id}`;

}
