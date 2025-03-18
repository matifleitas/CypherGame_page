'use strict'

let cards = document.querySelectorAll(".card-game")
let btnNext = document.querySelectorAll(".right");
let btnBefore = document.querySelectorAll(".left");
let cardPremium = document.querySelector(".cardPremium-game");
let cartCantItems = document.querySelector(".cart-cantItems");
let operacion = 0;
let counter = 0
let pixelWidth = 1;
let widthImg = (1600 / cards.length) + pixelWidth;
// let btnPlay=document.getElementById('btnJugar');
let canva=document.getElementById('canvaJuego');
// let fondoJuego=document.getElementById('fondoJuego');
// let portadaJuego=document.getElementById('gamePortada');

btnNext.forEach(btn => {
    btn.addEventListener("click", function (e) {
        // Encuentra el contenedor más cercano del carrusel en el que está el botón
        let cardContainer = e.target.closest(".conteiner-carruselPrimary");
        if (counter >= cards.length - 1) {
            counter = 0;
            operacion = 0;
            // Selecciona solo las tarjetas dentro de ese contenedor
            cards = cardContainer.querySelectorAll(".card-game");
            translateCarrousel(cards, operacion);
        }
        else {
            counter++;
            operacion = operacion + widthImg;
            cards = cardContainer.querySelectorAll(".card-game");
            translateCarrousel(cards, operacion);
        }
    });
});

btnBefore.forEach(btn => {
    btn.addEventListener("click", function (e) {
        let cardContainer = e.target.closest(".conteiner-carruselPrimary");
        counter--;

        if (counter < 0) {
            counter = cards.length - 1;
            cards = cardContainer.querySelectorAll(".card-game");
            operacion = widthImg * (cards.length - 1);
            translateCarrouselLeft(cards, operacion);
        }
        else {
            operacion = operacion - widthImg;
            cards = cardContainer.querySelectorAll(".card-game");
            translateCarrouselLeft(cards, operacion);
        }
    });
});

// -----------funciones-------------
function translateCarrousel(cardSize, operacion) {
    cardSize.forEach((card) => {
        card.style.transform = `translate(-${operacion}%) rotateX(3deg) rotateY(3deg) scale(1.04)`; //le doy el movimiento de zoom
        card.style.transition = "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";

        // Regresa a la pos normal
        setTimeout(() => {
            card.style.transform = `translate(-${operacion}%) rotateX(0deg) rotateY(0deg) scale(1)`;
        }, 200); 
    });
}

function translateCarrouselLeft(cardSize, operacion) {
    cardSize.forEach((card) => {
        card.style.transform = `translate(-${operacion}%) rotateX(-3deg) rotateY(-3deg) scale(1.03)`;
        card.style.transition = "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)"; 

        setTimeout(() => {
            card.style.transform = `translate(-${operacion}%) rotateX(0deg) rotateY(0deg) scale(1)`;
        }, 200); // A mitad de la transición
    });
}


let verticalNav = document.querySelector(".vertical-nav-wrapper")
document.querySelector('.btn-hamburguesa').addEventListener(
    'click', () => {
        if (verticalNav.style.transform === "translate(0%)") {
            verticalNav.style.transform = "translate(-100%)";
            conteinerVertical.style.transform = "translate(-100%)";
        } else {
            verticalNav.style.transform = "translate(0%)";
        }
    })

// cardPremium.addEventListener("click", () => {
//     cartCantItems.classList.remove("hidden-items");
// })

// btnPlay.addEventListener("click",()=>{
//     portadaJuego.classList.remove('mostrarJuego');
//     portadaJuego.classList.add('taparJuego');

//     fondoJuego.classList.remove('taparJuego');
//     fondoJuego.classList.add('mostrarJuego');;
// })
