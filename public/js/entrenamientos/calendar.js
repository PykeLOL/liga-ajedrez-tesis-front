const TrainingCalendar=(()=>{

let calendar=null;
let el=null;
let getTrainings=()=>[];
let getColor=()=>"#f1c40f";
let onSelect=()=>{};

const init=(calendarEl,options={})=>{
    el=calendarEl;
    getTrainings=options.trainings||getTrainings;
    getColor=options.color||getColor;
    onSelect=options.select||onSelect;
    build();
    bind();
};

const build=()=>{

    if(calendar)
        calendar.destroy();

    calendar=new FullCalendar.Calendar(el,{
        locale:"es",
        timeZone:"America/Bogota",
        initialView:"dayGridMonth",
        firstDay:1,
        fixedWeekCount:false,
        expandRows:true,
        height:"auto",
        dayMaxEvents:2,
        headerToolbar:false,
        now:new Date(),

        events:getEvents(),

        eventContent:eventTemplate,

        eventDidMount:e=>{

            e.el.style.borderColor=e.event.backgroundColor;

            const dot=e.el.querySelector(".event-dot");

            if(dot)
                dot.style.background=e.event.backgroundColor;

        },

        eventClick:e=>{

            calendar.getEvents().forEach(x=>x.setProp("classNames",[]));

            e.event.setProp("classNames",["selected-event"]);

            onSelect(e.event);

        },

        datesSet:updateTitle

    });

    calendar.render();

    updateTitle();

};

const getEvents=()=>getTrainings().map(t=>({

    id:String(t.id),
    title:t.tipo_entrenamiento,
    start:`${t.fecha}T${t.hora_inicio}`,
    end:`${t.fecha}T${t.hora_fin}`,
    backgroundColor:getColor(t),
    borderColor:getColor(t),
    textColor:"#fff",
    extendedProps:t

}));

const eventTemplate=arg=>{

    const t=arg.event.extendedProps;
    const color=arg.event.backgroundColor;

    return{

        html:`
            <div class="event-card">
                <div class="event-hour">
                    <span class="event-dot" style="background:${color}"></span>
                    ${TrainingHelpers.hour(t.hora_inicio)}
                </div>
                <div class="event-title">
                    ♟ ${t.tipo_entrenamiento}
                </div>
            </div>
        `

    };

};

const reload=()=>{

    if(!calendar)
        return;

    calendar.removeAllEvents();

    getEvents().forEach(e=>calendar.addEvent(e));

};

const recolor=()=>{

    if(!calendar)
        return;

    calendar.getEvents().forEach(e=>{

        const color=getColor(e.extendedProps);

        e.setProp("backgroundColor",color);
        e.setProp("borderColor",color);

        const el=e.el;

        if(el){

            el.style.borderColor=color;

            const dot=el.querySelector(".event-dot");

            if(dot)
                dot.style.background=color;

        }

    });

};

const updateTitle=()=>{

    if(calendar)
        $("#calendarTitle").text(calendar.view.title);

};

const bind=()=>{

    $("#btnPrev").off().on("click",()=>{
        calendar.prev();
        updateTitle();
    });

    $("#btnNext").off().on("click",()=>{
        calendar.next();
        updateTitle();
    });

    $("#btnToday").off().on("click",()=>{
        calendar.today();
        updateTitle();
    });

};

const instance=()=>calendar;

return{
    init,
    reload,
    recolor,
    instance
};

})();
