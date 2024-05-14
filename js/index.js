window.addEventListener('load',funcionInicio());

function funcionInicio(){
    fetch('datos/index.json').
    then(response => response.json()).
    then(listaPersonas => {    
        
        listaPersonas.forEach(persona => {
            console.log(persona.nombre+" "+persona.ci+"\n");
            let contenedor = document.getElementById('whiteboard');
            
            let newDiv = document.createElement('div');
            newDiv.classList.add('profile');
            newDiv.innerHTML = `<img src="${persona.imagen}" class="image" title=""> <br> <span>${persona.nombre}</span>`;

            contenedor.appendChild(newDiv);
        });
    })
}