'use strict';
export default class Ficha {
    posXInicial;
    posYInicial;
    constructor(x,y,equipo, img) {
        this.posX = x;
        this.posY = y; 
        this.radio = 35;
        this.equipo = equipo;
        this.selected = false;
        this.image = new Image();
        this.image.src = this.definirEquipo(equipo);
        this.posXInicial=x;
        this.posYInicial=y;
    }

    dibujarFicha(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radio, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(this.image, this.posX - this.radio, this.posY - this.radio, this.radio * 2, this.radio * 2);
        ctx.restore();
        //console.log('ficha dibujada en:' + this.posX,this.posY);
        
    }

    esClickeada(x, y) {
        const dist = Math.sqrt((x - this.posX) ** 2 + (y - this.posY) ** 2);
        return dist <= this.radio;
    }

    setPosicion(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }

    getPosicion(){
        return this.getPosX, this.posY;
    }

    getEquipo(){
        return this.equipo;
    }

    getPosX() {
        return this.posX;
    }

    getPosY() {
        return this.posY;
    }

    setPosY(posY) {
        this.posY = posY;
    }

    setPosX(posX) {

        this.posX = posX;
    }

    resetPosicion(){
        console.log('reseto pos');
        this.posX=this.posXInicial;
        this.posY=this.posYInicial;
    }

    definirEquipo(equipo) {
        switch (equipo) {
            case "batman":
                return '../img/fichas/batman.png';
            case "joker":
                return '../img/fichas/joker.png';
            case "spiderman":
                return '../img/fichas/spiderman.png';
            case "hulk":
                return '../img/fichas/hulk.png';
            default:
                return null; 
        }
    }
}
