'use strict';
import Juego from './Juego.js';

document.addEventListener('DOMContentLoaded', () => {
    const formLineas = document.getElementById('formLineas');
    document.getElementById('changeScreen').addEventListener('click',()=> {
        document.getElementById('elementsPortada').classList.add('taparJuego');
        document.getElementById('formLineas').classList.remove('taparJuego');
        
    })

    formLineas.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const e1 = document.getElementById('equipo1').value;
        const e2 = document.getElementById('equipo2').value;
        
        if(e1 !== e2 && (e1 !== "" && e2 !== "")){
            const tipoSeleccionado = document.querySelector('input[name="tipo"]:checked').value;
            const cantidadEnLinea = parseInt(tipoSeleccionado);

            const juego = new Juego(cantidadEnLinea);

            document.getElementById("msjError").classList.add("taparJuego");
            juego.cambiarPantallas();
            juego.initGame();
        } else{
            document.getElementById("msjError").classList.remove("taparJuego");
        }
    });
});
