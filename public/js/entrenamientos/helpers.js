const TrainingHelpers=(()=>{

const hour=value=>{
    if(!value)return"";
    const[h,m]=value.split(":");
    let hh=parseInt(h);
    const ampm=hh>=12?"PM":"AM";
    hh=hh%12||12;
    return`${hh}:${m} ${ampm}`;
};

const formatDate=value=>
    new Date(value+"T00:00:00").toLocaleDateString("es-CO",{
        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric"
    });

const players=list=>{
    if(!list?.length)return"Sin deportistas";
    return list.map(d=>`${d.titulo?d.titulo+" ":""}${d.nombre} ${d.apellido}`).join("<br>");
};

const notify=(title,text,icon)=>
    Swal.fire({
        title,
        text,
        icon,
        confirmButtonColor:"#81b64c"
    });

return{
    hour,
    formatDate,
    players,
    notify
};

})();
