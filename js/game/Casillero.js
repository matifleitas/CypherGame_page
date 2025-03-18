"use strict";

export default class Casillero {
  imagen;
  constructor(numRow, numColumn, ancho) {
    if (typeof numRow !== "number" || numRow < 0) {
      throw new Error("numRow debe ser un número positivo");
    }
    if (typeof numColumn !== "number" || numColumn < 0) {
      throw new Error("numColumn debe ser un número positivo");
    }

    this.ancho = ancho;

    this.posX = numColumn * ancho;
    this.posY = numRow * ancho;
    this.numRow = numRow;
    this.numColumn = numColumn;
    this.ficha = null;
    this.imagen = new Image();
    this.imagen.src = "../img/icono/marcoCasillero.png";
  }

  getRow(){
    return this.numRow;
  }

  getColumn(){
    return this.numColumn;
  }

  eliminarFicha() {
    this.ficha = null;
  }

  setPosicion(x, y){
    this.posX = x;
    this.posY = y;
  }

  setPosY(y) {
    this.posY = y;
  }

  setPosX(x) {
    this.posX = x;
  }

  colocarFicha(ficha) {
    this.ficha = ficha; // Asigna la ficha al casillero
    // Asigna la posición inicial de la ficha basada en el centro del casillero
    ficha.setPosicion(
      this.getPosX() + this.ancho / 2,
      this.getPosY() + this.ancho / 2
    );
  }

  getFicha() {
    if (this.ficha) {
      return this.ficha;
    } else {
      return null;
    }
  }
  estaVacio() {
    return this.ficha === null;
  }

  getCasillero() {
    return this;
  }

  setImagen(imagen) {
    // Método para establecer la imagen
    this.imagen = imagen;
  }

  getPosY() {
    return this.posY;
  }

  getPosX() {
    return this.posX;
  }

  dibujar(ctx, posX, posY) {
    ctx.beginPath();
    if (this.imagen) {
      ctx.drawImage(this.imagen, posX, posY, 60, 61);
      if (this.ficha != null) {
        this.ficha.dibujarFicha(ctx);
      }
    }
  }

  soyCasilleroDrop() {
    return this.numRow === 0;
  }

  vaciar() {
    this.ficha = null;
  }
}

