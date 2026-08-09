const TrainingEvents=(()=>{

let trainings=[];
let selected=[];
let current=null;

const clubId=new URLSearchParams(location.search).get("club_id");
const clubMode=!!clubId;

let sync=$("#syncCount");
let btn=$("#btnSyncSelected");

const endpoint=clubMode
    ?`${apiUrl}/home/entrenamientos/${clubId}`
    :`${apiUrl}/home/entrenamientos/mis-entrenamientos`;

const load=()=>datatableAjax(endpoint).then(r=>{
    trainings=Array.isArray(r)?r:[];
    return trainings;
});

const all=()=>trainings;

const currentEvent=()=>current;

const setCurrent=e=>current=e;

const color=t=>{

    if(clubMode)
        return"#43a047";

    if(t.google_sync)
        return"#43a047";

    if(selected.includes(t.id))
        return"#1e88e5";

    return"#f1c40f";

};

const toggle=id=>{

    if(clubMode)
        return;

    if(selected.includes(id))
        selected=selected.filter(x=>x!==id);
    else
        selected.push(id);

    refresh();

};

const refresh=()=>{

    if(clubMode)
        return;

    sync.text(selected.length);

    btn.prop(
        "disabled",
        !selected.length
    );

};

const clear=()=>{

    selected=[];

    refresh();

};

const ids=()=>[...selected];

const selectedItems=()=>trainings.filter(t=>selected.includes(t.id));

const isSelected=id=>selected.includes(id);

const find=id=>trainings.find(t=>t.id===id);

const update=(id,data)=>{

    const i=trainings.findIndex(x=>x.id===id);

    if(i<0)
        return;

    trainings[i]={
        ...trainings[i],
        ...data
    };

};

const markSynced=ids=>{

    ids.forEach(id=>{

        const t=find(id);

        if(t)
            t.google_sync=true;

    });

};

const remove=id=>{

    trainings=trainings.filter(x=>x.id!==id);

    selected=selected.filter(x=>x!==id);

    refresh();

};

const add=t=>{

    trainings.push(t);

};

const reload=()=>load();

return{
    load,
    reload,
    all,
    add,
    remove,
    find,
    update,
    color,
    toggle,
    clear,
    ids,
    refresh,
    markSynced,
    isSelected,
    selectedItems,
    currentEvent,
    setCurrent,
    clubMode,
    clubId
};

})();
