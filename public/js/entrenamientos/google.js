const TrainingGoogle=(()=>{

let user=null;
let frame=null;
let btnGoogle=null;
let btnSync=null;
let getSelected=()=>[];
let clearSelected=()=>{};
let afterSync=()=>{};
let afterUser=()=>{};

const init=options=>{

    frame=$(options.frame);
    btnGoogle=$(options.btnGoogle);
    btnSync=$(options.btnSync);

    getSelected=options.selected||getSelected;
    clearSelected=options.clear||clearSelected;
    afterSync=options.afterSync||afterSync;
    afterUser=options.afterUser||afterUser;

    bind();
    loadUser();

};

const bind=()=>{

    btnGoogle.on("click",()=>{
        location.href=`${apiUrl}/home/entrenamientos/google/authorize`;
    });

    btnSync.on("click",sync);

};

const loadUser=()=>{
    try{
        user=JSON.parse(localStorage.getItem("user_data")||"{}");
    }catch(e){
        user={};
    }

    const connected=!!user.google_id;

    btnGoogle.toggleClass("d-none",connected);
    btnSync.toggleClass("d-none",!connected);

    if(connected){

        frame.attr(
            "src",
            `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(user.google_id||"primary")}&ctz=America/Bogota`
        );

    }

};

const refreshUser=()=>{

    return $.ajax({
        url:`${apiUrl}/me`,
        method:"GET",
        xhrFields:{withCredentials:true}
    }).done(r=>{
        console.log("refreshUser");
        console.log(r);
        if(!r?.user)
            return;

        user=r.user;

        localStorage.setItem(
            "user_data",
            JSON.stringify(user)
        );

        loadUser();

        afterUser(user);

    });

};

const sync=()=>{

    const ids=getSelected();

    if(!ids.length)
        return;

    btnSync.prop("disabled",true);

    $.ajax({

        url:`${apiUrl}/home/entrenamientos/google`,
        method:"POST",
        contentType:"application/json",
        xhrFields:{withCredentials:true},

        data:JSON.stringify({
            training_ids:ids
        }),

        success:r=>{

            TrainingHelpers.notify(
                "Éxito",
                r.message,
                "success"
            );

            clearSelected();

            afterSync(ids);

            loadUser();

        },

        error:x=>{

            TrainingHelpers.notify(
                "Error",
                x.responseJSON?.error||
                "No fue posible sincronizar los entrenamientos.",
                "error"
            );

        },

        complete:()=>{

            btnSync.prop(
                "disabled",
                getSelected().length===0
            );

        }

    });

};

const refreshCalendar=()=>{

    if(!user?.google_id)
        return;

    const src=frame.attr("src");

    if(src)
        frame.attr(
            "src",
            src.split("&_=")[0]+"&_="+Date.now()
        );

};

const checkCallback=()=>{

    const params=new URLSearchParams(location.search);

    if(params.get("google")==="ok"){

        TrainingHelpers.notify(
            "Éxito",
            "Google Calendar conectado correctamente.",
            "success"
        );

        refreshUser().then(refreshCalendar);

        history.replaceState({},document.title,location.pathname);

    }

    if(params.get("google")==="error"){

        TrainingHelpers.notify(
            "Error",
            "No fue posible conectar Google Calendar.",
            "error"
        );

        history.replaceState({},document.title,location.pathname);

    }

};

const currentUser=()=>user;

return{
    init,
    loadUser,
    refreshUser,
    refreshCalendar,
    checkCallback,
    currentUser
};

})();
