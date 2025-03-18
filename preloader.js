window.addEventListener("load", function() {
    const preloader = document.getElementById("preloader");
    const contador = document.getElementById("contador");
    const tiempoTotal = 3000; // Tiempo total (4 segundos)
    const incremento = 100;
    const intervalo = tiempoTotal / incremento;
    let valorActual = 0;

    const intervaloID = setInterval(() => {
        valorActual++;
        contador.textContent = `${valorActual}%`;

        if (valorActual >= incremento) {
            clearInterval(intervaloID);
            preloader.style.display = "none"; 
            document.body.classList.remove("hidden"); 
        }
    }, intervalo);
});