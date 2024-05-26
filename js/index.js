

window.addEventListener('load', () => {
    funcionInicio();
    window.addEventListener('load',showProfile())
    document.getElementById("Buscar").addEventListener("click",
        () => buscar(document.getElementById("text").value));
                
        document.getElementById("text").addEventListener('keydown',
        (e)  => {  if (e.key ==="Enter")   buscar(document.getElementById("text").value); 
    });
});

function funcionInicio(){
    if( document.title == "ATI[UCV] 2024-1"
    // window.location.pathname === "/index.html" ||  window.location.pathname === "/"
){
        let parametros = window.location.search;
        let searchParams = new URLSearchParams(parametros);
        let idioma = searchParams.get('lan');
        
        if(!(idioma==='EN'||idioma==='PT'||idioma==='ES'))  idioma = 'ES'

        fetch(`conf/config${idioma}.json`).
        then(response => response.json()).
        then(listaTextos => {
            document.getElementById('nav1').innerHTML=`${listaTextos.sitio[0]} <sub>${listaTextos.sitio[1]}</sub>&nbsp;${listaTextos.sitio[2]}`

            fetch('datos/index.json').
            then(response => response.json()).
            then(listaPersonas => {    
                document.getElementById('nav2').innerHTML=`${listaTextos.saludo},&nbsp;<a href="./perfil.html?ci=${listaPersonas[0].ci}&lan=${idioma}"> ${listaPersonas[0].nombre} </a>`
            })
            document.getElementById('text').setAttribute('placeholder',`${listaTextos.nombre}...`)
            document.getElementById('Buscar').innerHTML = `${listaTextos.buscar}...`
            SumarInnerPorId('copyright',listaTextos.copyRight)
        })

        fetch('datos/index.json').
        then(response => response.json()).
        then(listaPersonas => {    
            
            listaPersonas.forEach(persona => {
                // console.log(persona.nombre+" "+persona.ci+"\n");
                let contenedor = document.getElementById('whiteboard');
                contenedor.innerHTML+=  `<a href = "perfil.html?ci=${persona.ci}&lan=${idioma}"><div class="profile"> <img src="directorio\/${persona.imagen}" class="image" title=""> <br> <span>${persona.nombre}</span></div></a>`

            });
        })
    }//else console.log('No estoy en inicio')
}

function SumarInnerPorId(id,valor,antes = false){
    if(typeof valor === 'object'){
        if(valor.length == 1)
            valor = valor[0]
        else {
            let string = valor [0];
            let length = valor.length
            for(let i = 1; i<valor.length;i++){
                if(i<length-1)
                    string+=`, ${valor[i]}`
                else
                    string+=` y ${valor[i]}`
            }
            valor = string
        }
    }   
    if(!antes)   document.getElementById(id).innerHTML+=valor;
    else    document.getElementById(id).innerHTML = valor + document.getElementById(id).innerHTML;
}

function buscar(nombre){
    let fondo = document.getElementById('whiteboard');
    fondo.innerHTML="";

    let parametros = window.location.search;
    let searchParams = new URLSearchParams(parametros);
    let idioma = searchParams.get('lan');
    
    if(!(idioma==='EN'||idioma==='PT'||idioma==='ES'))  idioma = 'ES'

    let hayResultado = false;
    fetch('datos/index.json').
    then(response => response.json()).
    then(listaPersonas => {    
        listaPersonas.forEach(persona => {
            let expReg = new RegExp(nombre,"i");
            if(persona.nombre.match(expReg)){
                hayResultado = true;
                console.log(hayResultado)

                fondo.innerHTML+=  `<a href = "perfil.html?ci=${persona.ci}&lan=${idioma}"><div class="profile"> <img src="directorio\/${persona.imagen}" class="image" title=""> <br> <span>${persona.nombre}</span></div></a>`
            }});
            if(!hayResultado){
                console.log(hayResultado)
                fetch(`conf/config${idioma}.json`).
                then(response => response.json()).
                then(listaTextos => {
                    textos = listaTextos.not_found.split("[query]");
                    fondo.innerHTML+=`<span id="noMatch"> ${textos[0]} "${document.getElementById("text").value}" ${textos[1]} </span>`
                })
            }
    })
}

function showProfile(){
    if(
        document.title.match(new RegExp("Perfil:"))
        // window.location.pathname==="/perfil.html"
    ){
        let parametros = window.location.search;
        let searchParams = new URLSearchParams(parametros);
        let idioma = searchParams.get('lan');
        
        if(!(idioma==='EN'||idioma==='PT'||idioma==='ES'))  idioma = 'ES'

        fetch(`conf/config${idioma}.json`).
        then(response => response.json()).
        then(listaTextos => {
            SumarInnerPorId('color-pregunta',listaTextos.color)
            SumarInnerPorId('libro-pregunta',listaTextos.libro)
            SumarInnerPorId('musica-pregunta',listaTextos.musica)
            SumarInnerPorId('juegos-pregunta',listaTextos.video_juego)
            SumarInnerPorId('lenguajes-pregunta',listaTextos.lenguajes)
            
            let cedula = searchParams.get('ci');
            fetch(`directorio/${cedula}/perfil.json`).
            then(response => response.json()).
            then( listaAtributos => {
                document.getElementById('nombre').innerHTML= listaAtributos.nombre;
                
                fetch('datos/index.json').
                then(response => response.json()).
                then(listaPersonas => {    
                    let personaActual = listaPersonas.find(persona => persona.ci == cedula);
                    document.title = `Perfil: ${personaActual.nombre}`;
                    document.getElementById('mi-foto').setAttribute("src","directorio\/"+personaActual.imagen);
                })
                SumarInnerPorId('descripcion',listaAtributos.descripcion)
                SumarInnerPorId('color-respuesta',listaAtributos.color)
                SumarInnerPorId('libro-respuesta',listaAtributos.libro)
                SumarInnerPorId('musica-respuesta',listaAtributos.musica)
                SumarInnerPorId('juegos-respuesta',listaAtributos.video_juego)
                SumarInnerPorId('lenguajes-respuesta',listaAtributos.lenguajes)
                
                let emailStrings = listaTextos.email.split("[email]");
                let contenidoEmail = `${emailStrings[0]} <a href=mailto:${listaAtributos.email} id=mail> <span id="correo-respuesta"> ${listaAtributos.email}</span></a> ${emailStrings[1]}`
                SumarInnerPorId('correo-pregunta',contenidoEmail)
            })
        })
    }//else console.log("No estoy en perfil")
}