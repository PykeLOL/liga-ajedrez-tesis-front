$(function(){

const clubId=new URLSearchParams(location.search).get("club_id");
const clubMode=!!clubId;

if(!requiereAutenticacion())
    return;

const calendarEl=document.getElementById("calendar");

if(clubMode){

    document.title="Entrenamientos del club";

    $("h2").html(`
        <i class="bi bi-calendar2-week-fill text-chess-green me-2"></i>
        Entrenamientos del club
    `);

    $(".text-muted").text(
        "Consulta la programación de entrenamientos del club."
    );

    $("#btnGoogleCalendar").hide();
    $("#btnSyncSelected").hide();
    $("#googleCalendarContainer").hide();

}

TrainingEvents.load().then(()=>{

    TrainingCalendar.init(calendarEl,{
        trainings:TrainingEvents.all,
        color:TrainingEvents.color,
        select:event=>{

            TrainingEvents.setCurrent(event);

            TrainingDetail.render(
                event.extendedProps
            );

        }
    });

});

TrainingDetail.init("#trainingDetail",{

    selected:TrainingEvents.ids,

    toggle:id=>{

        if(clubMode)
            return;

        TrainingEvents.toggle(id);

        TrainingCalendar.recolor();

        const event=TrainingCalendar
            .instance()
            .getEventById(String(id));

        if(event){

            TrainingEvents.setCurrent(event);

            TrainingDetail.render(
                event.extendedProps
            );

        }

    }

});

if(!clubMode){

    TrainingGoogle.init({

        frame:"#googleCalendarFrame",

        btnGoogle:"#btnGoogleCalendar",

        btnSync:"#btnSyncSelected",

        selected:TrainingEvents.ids,

        clear:()=>{

            TrainingEvents.clear();

            TrainingCalendar.recolor();

        },

        afterSync:ids=>{

            TrainingEvents.markSynced(ids);

            TrainingCalendar.reload();

            const event=TrainingEvents.currentEvent();

            if(event){

                const updated=TrainingEvents.find(
                    event.extendedProps.id
                );

                if(updated)
                    TrainingDetail.render(updated);

            }

        },

        afterUser:()=>{}

    });

    TrainingGoogle.checkCallback();

    $(window).on("focus",()=>{

        const params=new URLSearchParams(location.search);

        if(params.get("google")==="ok"){

            TrainingGoogle.refreshUser().then(()=>{

                TrainingEvents.reload().then(()=>{

                    TrainingCalendar.reload();

                    TrainingGoogle.refreshCalendar();

                });

            });

        }

    });

}

window.trainingCalendar={

    reload(){

        TrainingEvents.reload().then(
            ()=>TrainingCalendar.reload()
        );

    },

    clear(){

        if(clubMode)
            return;

        TrainingEvents.clear();

        TrainingCalendar.recolor();

    },

    selected(){

        return TrainingEvents.ids();

    },

    trainings(){

        return TrainingEvents.all();

    },

    calendar(){

        return TrainingCalendar.instance();

    }

};

});
