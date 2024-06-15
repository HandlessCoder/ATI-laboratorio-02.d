window.addEventListener('load', () => {
    funcionInicio();                                //esta es la funcion para cargar dinámicamente el contenido del mainpage
    document.getElementById("Buscar").addEventListener("click",     //event listener de la búsqueda en mainpage, al hacer click
        () => buscar(document.getElementById("text").value));
                
        document.getElementById("text").addEventListener('keydown', //event listener de la búsqueda en mainpage, al presionar enter
        (e)  => {  if (e.key ==="Enter")   buscar(document.getElementById("text").value); 
    });
});

function funcionInicio(){
    if( document.title == "ATI[UCV] 2024-1" //se verifica que el título de la página corresponda con la página principal
){      
        document.getElementById('profile-body').style.display = 'none'      //oculta el div de datos del perfil
        document.getElementById('mainpage-body').style.display = 'block'    //muestra el div de la página principal
        
        let parametros = window.location.search;                            //se obtienen los parámetros pasados por URL
        let searchParams = new URLSearchParams(parametros);                 //se convierte en objeto iterable
        let idioma = searchParams.get('lan');                               //se escoge el parámetro bajo el key "lan" para el idioma
        
        if(!(idioma==='EN'||idioma==='PT'||idioma==='ES'))  idioma = 'ES'   //si lo obtenido es distinto de ES, EN o PT, entonces será ES por defecto

        
        fetch(`conf/config${idioma}.json`).                                 //en funcion del idioma se cargan todos los textos de la página
        then(response => response.json()).
        then(listaTextos => {
            document.getElementById('nav1').innerHTML=`${listaTextos.sitio[0]} <sub>${listaTextos.sitio[1]}</sub>&nbsp;${listaTextos.sitio[2]}`

            fetch('datos/index.json').
            then(response => response.json()).
            then(listaPersonas => {    
                document.getElementById('nav2').innerHTML=`${listaTextos.saludo},&nbsp;<span id="main-user" onclick=" document.title = 'Perfil:';showProfile(${listaPersonas[0].ci})"> ${listaPersonas[0].nombre} </span>`
            })
            document.getElementById('text').setAttribute('placeholder',`${listaTextos.nombre}...`)
            document.getElementById('Buscar').innerHTML = `${listaTextos.buscar}...`
            SumarInnerPorId('copyright',listaTextos.copyRight)
        })

        fetch('datos/index.json').
        then(response => response.json()).                      //se cargan todos los datos de las personas almacenadas en el JSON file consultado
        then(listaPersonas => {    
            
            listaPersonas.forEach(persona => {
                SumarInnerPorId('whiteboard',`<div class="profile" onclick=" document.title = 'Perfil:';showProfile(${persona.ci})"> <img src="directorio\/${persona.imagen}" class="image" title=""> <br> <span>${persona.nombre}</span></div>`)
            });
        })
    }
}

function SumarInnerPorId(id,valor,antes = false){   //esta funcion se usa para facilitar la adicion de contenido en el innerHTML de las etiquetas del documento en cuestión
    if(typeof valor === 'object'){
        if(valor.length == 1)
            valor = valor[0]
        else {
            let string = valor [0];
            let length = valor.length       //si el value pasado es una lista, entonces esta se desarma para crear un string con todos los valores internos de la lista, usando comas e "y"
            for(let i = 1; i<valor.length;i++){
                if(i<length-1)
                    string+=`, ${valor[i]}`
                else
                    string+=` y ${valor[i]}`
            }
            valor = string
        }
    }   
    if(!antes)   document.getElementById(id).innerHTML+=valor;  //si el valor va después, se usa +=, si no entonces el valor deberá ir antes de lo que había anteriormente en el innerHTML
    else    document.getElementById(id).innerHTML = valor + document.getElementById(id).innerHTML;
}

function buscar(nombre){                            //funcion encargada de realizar la búsqueda de personas en el mainpage
    document.getElementById('whiteboard').innerHTML="";     //primero vacía el espacio de la muestra

    let parametros = window.location.search;
    let searchParams = new URLSearchParams(parametros);     //se hace el mismo trabajo de antes para obtener el idioma
    let idioma = searchParams.get('lan');
    
    if(!(idioma==='EN'||idioma==='PT'||idioma==='ES'))  idioma = 'ES'

    let hayResultado = false;
    fetch('datos/index.json').
    then(response => response.json()).
    then(listaPersonas => {    
        listaPersonas.forEach(persona => {
            let expReg = new RegExp(nombre,"i");    //se compara el nombre de cada persona contra la regExp generada por la búsqueda
            if(persona.nombre.match(expReg)){
                hayResultado = true;            //si se encuentra por lo menos un resultado, entonces se altera el valor de esta variable y se agrega donde corresponde
                console.log(hayResultado)
                SumarInnerPorId('whiteboard',`<div class="profile" onclick=" document.title = 'Perfil:';showProfile(${persona.ci})"> <img src="directorio\/${persona.imagen}" class="image" title=""> <br> <span>${persona.nombre}</span></div>`)
            }});
            if(!hayResultado){
                console.log(hayResultado)
                fetch(`conf/config${idioma}.json`).     //si no se encuentra nada, entonces se usa la configuración de idioma para mostrar un mensaje que reporte la inexistencia de algún nombre que coincida con la regExp ingresada.
                then(response => response.json()).
                then(listaTextos => {
                    textos = listaTextos.not_found.split("[query]");
                    SumarInnerPorId('whiteboard',`<span id="noMatch"> ${textos[0]} "${document.getElementById("text").value}" ${textos[1]} </span>`)
                })
            }
    })
}

function showProfile(cedula){                   //funcion usada para que se muestre el apartado de perfil en la web
    if(
        document.title.match(new RegExp("Perfil:"))             //se comprueba que se está en el estado correcto para poder ejecutar las instrucciones siguientes.
    ){
        document.getElementById('profile-body').style.display = 'block'         //se muestra el contenedor del perfil
        document.getElementById('mainpage-body').style.display = 'none'         //se oculta el contenedor del mainpage
        let parametros = window.location.search;
        let searchParams = new URLSearchParams(parametros);
        let idioma = searchParams.get('lan');
        
        if(!(idioma==='EN'||idioma==='PT'||idioma==='ES'))  idioma = 'ES'       //mismo conjunto de instrucciones para obtener el idioma.

        fetch(`conf/config${idioma}.json`).
        then(response => response.json()).
        then(listaTextos => {
            SumarInnerPorId('color-pregunta',listaTextos.color)
            SumarInnerPorId('libro-pregunta',listaTextos.libro)         //se usan los textos de cada idioma para ir llenando el arbol DOM del perfil
            SumarInnerPorId('musica-pregunta',listaTextos.musica)
            SumarInnerPorId('juegos-pregunta',listaTextos.video_juego)
            SumarInnerPorId('lenguajes-pregunta',listaTextos.lenguajes)
            
            fetch(`directorio/${cedula}/perfil.json`).
            then(response => response.json()).              //se imprime el nombre de la persona
            then( listaAtributos => {
                document.getElementById('nombre').innerHTML= listaAtributos.nombre;
                
                fetch('datos/index.json').
                then(response => response.json()).
                then(listaPersonas => {                     //se muestra la foto de la persona en la página
                    let personaActual = listaPersonas.find(persona => persona.ci == cedula);   
                    document.title = `Perfil: ${personaActual.nombre}`;
                    document.getElementById('mi-foto').setAttribute("src","directorio\/"+personaActual.imagen);
                })
                SumarInnerPorId('descripcion',listaAtributos.descripcion)
                SumarInnerPorId('color-respuesta',listaAtributos.color)
                SumarInnerPorId('libro-respuesta',listaAtributos.libro) //se concatenan las respuestas de cada persona en cada área
                SumarInnerPorId('musica-respuesta',listaAtributos.musica)
                SumarInnerPorId('juegos-respuesta',listaAtributos.video_juego)
                SumarInnerPorId('lenguajes-respuesta',listaAtributos.lenguajes)
                
                let emailStrings = listaTextos.email.split("[email]");
                let contenidoEmail = `${emailStrings[0]} <a href=mailto:${listaAtributos.email} id=mail> <span id="correo-respuesta"> ${listaAtributos.email}</span></a> ${emailStrings[1]}`
                SumarInnerPorId('correo-pregunta',contenidoEmail)

                //se añade el mensaje (dependiente del idioma) de que en caso de necesitar contactarlo, puede hacerlo a la dirección dada. También se añade el enlace mailto: a la dirección de correo
            })
        })
        document.getElementById('atras-anchor').setAttribute('href',`index.html?lan=${idioma}`)
    }
}