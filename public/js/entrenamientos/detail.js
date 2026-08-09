const TrainingDetail=(()=>{

let container=null;
let getSelected=()=>[];
let toggle=()=>{};

const clubMode=!!new URLSearchParams(location.search).get("club_id");

const init=(el,options={})=>{
    container=$(el);
    getSelected=options.selected||getSelected;
    toggle=options.toggle||toggle;
    bind();
};

const bind=()=>{

    if(clubMode)
        return;

    $(document)
        .off("click","#toggleTraining")
        .on("click","#toggleTraining",function(){
            toggle(Number($(this).data("id")));
        });

};

const render=t=>{

    const selected=getSelected().includes(t.id);

    container.html(`

        ${
            clubMode
            ?`<span class="training-status synced">Entrenamiento del club</span>`
            :`<span class="training-status ${t.google_sync?'synced':'pending'}">
                ${t.google_sync?'Google sincronizado':'Pendiente por sincronizar'}
            </span>`
        }

        <div class="training-title">
            ${t.tipo_entrenamiento}
        </div>

        <div class="training-info">
            <i class="bi bi-calendar-event"></i>
            <div>
                <strong>Fecha</strong>
                ${TrainingHelpers.formatDate(t.fecha)}
            </div>
        </div>

        <div class="training-info">
            <i class="bi bi-clock"></i>
            <div>
                <strong>Horario</strong>
                ${TrainingHelpers.hour(t.hora_inicio)}
                -
                ${TrainingHelpers.hour(t.hora_fin)}
            </div>
        </div>

        <div class="training-info">
            <i class="bi bi-person"></i>
            <div>
                <strong>Entrenador</strong>
                ${t.entrenador}
            </div>
        </div>

        <div class="training-info">
            <i class="bi bi-building"></i>
            <div>
                <strong>Club</strong>
                ${t.club}
            </div>
        </div>

        <div class="training-info">
            <i class="bi bi-mortarboard"></i>
            <div>
                <strong>Categoría</strong>
                ${t.categoria}
            </div>
        </div>

        <div class="training-info">
            <i class="bi bi-gender-ambiguous"></i>
            <div>
                <strong>Género</strong>
                ${t.genero}
            </div>
        </div>

        <div class="training-info">
            <i class="bi bi-geo-alt"></i>
            <div>
                <strong>Ubicación</strong>
                ${t.ubicacion}
            </div>
        </div>

        <div class="training-info">
            <i class="bi bi-people"></i>
            <div>
                <strong>Deportistas</strong>
                ${TrainingHelpers.players(t.deportistas)}
            </div>
        </div>

        ${
            t.url_mapa
            ?`
                <a
                    href="${t.url_mapa}"
                    target="_blank"
                    class="btn btn-outline-success w-100 mt-2">

                    <i class="bi bi-map me-2"></i>
                    Ver ubicación

                </a>
            `
            :""
        }

        ${
            clubMode
            ?""
            :t.google_sync
                ?""
                :`
                    <button
                        id="toggleTraining"
                        data-id="${t.id}"
                        class="btn ${selected?'btn-primary':'btn-warning'} w-100 mt-2">

                        <i class="bi ${selected?'bi-check-circle-fill':'bi-plus-circle'} me-2"></i>

                        ${selected?'Quitar selección':'Seleccionar entrenamiento'}

                    </button>
                `
        }

    `);

};

return{
    init,
    render
};

})();
