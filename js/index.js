window.addEventListener('load',funcionInicio());

function funcionInicio(){
    if(window.location.pathname === "/index.html"){
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
                contenedor.innerHTML+=  `<a href = "perfil.html?ci=${persona.ci}&lan=${idioma}"><div class="profile"> <img src="${persona.imagen}" class="image" title=""> <br> <span>${persona.nombre}</span></div></a>`

            });
        })
    }//else console.log('No estoy en inicio')
}

window.addEventListener('load',showProfile())

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

function showProfile(){
    if(window.location.pathname==="/perfil.html"){

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
            
            fetch(`${cedula}/perfil.json`).
            then(response => response.json()).
            then( listaAtributos => {
                document.getElementById('nombre').innerHTML= listaAtributos.nombre;
                
                fetch('datos/index.json').
                then(response => response.json()).
                then(listaPersonas => {    
                    document.getElementById('mi-foto').setAttribute("src",listaPersonas.
                    find(persona => persona.ci == cedula).imagen);
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