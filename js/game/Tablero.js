"use strict";
import Casillero from "./Casillero.js";
import Ficha from "./Ficha.js";

export default class Tablero {
  casilleros = [];
  canvasJuego;
  tableroImg;
  rows;
  columns;
  casilleroImagen;
  animacionId;

  //---------------------Constructor---------------------------

  constructor(line) {
    if (line <= 0) {
      throw new Error("line debe ser un número entero positivo el numero es: ");
    }
    this.line = line;
    this.rows = line + 2;
    this.columns = line + 3;
    this.anchoColumna = 60;
    const casilleroImagen = new Image();
    casilleroImagen.src = "../img/icono/marcoCasillero.png";
    this.tableroImg = new Image();
    this.tableroImg.src = "../assets/tablero.png";
    this.canvasJuego = document.getElementById("canvaJuego");
    const imgTablero = new Image();
    imgTablero.src = "../assets/tablero.png";
    let offsetY = 0; 
    let direccion = 1; // 1 para subir, -1 para bajar
    const velocidad = 0.5; // Controla la velocidad de movimiento
    const maxDesplazamiento = 5; //
    this.initTablero();
  }

  //----- CREAR TABLERO---------------
  initTablero() {
    const offsetX =
      (this.canvasJuego.width - this.columns * this.anchoColumna) / 2;
    const offsetY =
      (this.canvasJuego.height - this.rows * this.anchoColumna) / 2;

    for (let i = 0; i < this.rows; i++) {
      this.casilleros[i] = [];
      for (let j = 0; j < this.columns; j++) {
        this.casilleros[i][j] = new Casillero(i, j, this.anchoColumna);
        this.casilleros[i][j].setPosicion(
          offsetX + j * this.anchoColumna,
          offsetY + i * this.anchoColumna
        );
      }
    }
  }

  //IMPRIMIR TABLERO EN CONSOLA
  imprimirTablero() {
    let output = "";

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const casillero = this.casilleros[i][j];
        const ficha = casillero.getFicha();

        output += ficha ? ficha.getEquipo() : ".";
        output += " ";
      }
      output += "\n";
    }
    console.log(output);
  }

  //Dibujar tablero

  dibujarTablero(ctx) {
    // ctx.clearRect(0, 0, this.canvasJuego.width, this.canvasJuego.height);

    const offsetX =
      (this.canvasJuego.width - this.columns * this.anchoColumna) / 2;
    const offsetY =
      (this.canvasJuego.height - this.rows * this.anchoColumna) / 2;

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.casilleros[i][j].dibujar(
          ctx,
          offsetX + j * this.anchoColumna,
          offsetY + i * this.anchoColumna
        );
      }
    }
    this.dibujarFlechas(ctx);
  }

  reiniciarTablero() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.casilleros[i][j].vaciar(); // Asegúrate de tener un método vaciar() en Casillero para resetear las fichas
      }
    }
    console.log("vacio casilleros");

    // Redibujar el tablero limpio
    const ctx = this.canvasJuego.getContext("2d");
    //this.dibujarTablero(ctx);
  }

  getCasillero(row, column) {
    return this.casilleros[row][column];
  }

  // //------COLOCAR FICHA------

  obtenerCasillero(posX, posY) {
    return this.casilleros[posX][posY];
  }

  isFull() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const casillero = this.casilleros[i][j];
        if (casillero.estaVacio()) {
          return false;
        }
      }
    }
    return true;
  }

  isInZoneDrop(fichaSeleccionada, ctx) {
    const anchoCasillero = this.anchoColumna;

    const zonaX = (this.canvasJuego.width - this.columns * anchoCasillero) / 2;

    const zonaY =
      (this.canvasJuego.height - this.rows * anchoCasillero) / 2 -
      anchoCasillero;

    const zonaAncho = this.columns * anchoCasillero;
    const zonaAlto = 50;

    if (
      fichaSeleccionada.getPosX() >= zonaX &&
      fichaSeleccionada.getPosX() <= zonaX + zonaAncho &&
      fichaSeleccionada.getPosY() >= zonaY &&
      fichaSeleccionada.getPosY() <= zonaY + zonaAlto
    ) {
      const columna = Math.floor(
        (fichaSeleccionada.getPosX() - zonaX) / anchoCasillero
      );
      console.log("Columna detectada: ", columna);

      if (this.columnaDisponible(columna)) {
        this.colocarFichaEnColumna(columna, fichaSeleccionada);
        return true;
      } else {
        console.log("Columna llena");
        return false;
      }
    } else {
      return false;
    }
  }

  dibujarFlechas(ctx) {
    const anchoCasillero = this.anchoColumna;
    const altoFlecha = 21;
    const anchoFlecha = 28;

    const zonaX = (this.canvasJuego.width - this.columns * anchoCasillero) / 2;
    const basePosY = ((this.canvasJuego.height - this.rows * anchoCasillero) / 2 - altoFlecha) - 7;

    const time = Date.now() * 0.003; 
    const offset = Math.sin(time) * 4; 

    for (let columna = 0; columna < this.columns; columna++) {
        const posX = zonaX + columna * anchoCasillero + anchoCasillero / 2;
        const posY = basePosY + offset; 

        ctx.fillStyle = "rgba(128, 128, 128, 0.9)"; //gris con un poco de transparencia
        ctx.beginPath();
        ctx.moveTo(posX - anchoFlecha / 2, posY);
        ctx.lineTo(posX + anchoFlecha / 2, posY);
        ctx.lineTo(posX, posY + altoFlecha);
        ctx.closePath();
        ctx.fill();
    }
  }
  
  colocarFichaEnColumna(columna, ficha) {
    const fila = this.ultimaFilaDisponible(columna);
    if (fila !== -1) {
      this.casilleros[fila][columna].colocarFicha(ficha);

      const casillero = this.casilleros[fila][columna];
      const posYInicial = 0;
      const posYFinal = casillero.getPosY() + casillero.ancho / 2;

      let posYActual = posYInicial;

      if (this.animacionId) {
        cancelAnimationFrame(this.animacionId);
      }

      const animacion = () => {
        posYActual += (posYFinal - posYActual) * 0.13;
        ficha.setPosicion(
          casillero.getPosX() + casillero.ancho / 2,
          posYActual
        );

        if (Math.abs(posYFinal - posYActual) < 1) {
          ficha.setPosicion(
            casillero.getPosX() + casillero.ancho / 2,
            posYFinal
          );
          return;
        }

        this.animacionId = requestAnimationFrame(animacion);
      };
      this.animacionId = requestAnimationFrame(animacion);
      return true;
    } else {
      console.log("La columna está llena");
      return false;
    }
  }

  columnaDisponible(columna) {
    return this.ultimaFilaDisponible(columna) !== -1;
  }

  ultimaFilaDisponible(columna) {
    if (columna < 0 || columna >= this.columns) {
      console.log("Posición fuera de los límites del tablero");
      return -1;
    }

    for (let i = this.rows - 1; i >= 0; i--) {
      if (
        this.casilleros[i] &&
        this.casilleros[i][columna] &&
        this.casilleros[i][columna].estaVacio()
      ) {
        return i;
      }
    }

    console.log(`Columna llena`);
    return -1;
  }

  //CHECKEOS
  //-----------VERIFICAR GANADOR-----------
  verifyWinner(fichaGanadora) {
    const anchoCasillero = this.anchoColumna;
    const zonaX = (this.canvasJuego.width - this.columns * anchoCasillero) / 2;
    const columna = Math.floor(
      (fichaGanadora.getPosX() - zonaX) / anchoCasillero
    );
    console.log("la columna eeees: " + columna);
    const fila = this.ultimaFilaDisponible(columna) + 1;
    console.log("la filaa eeeeess:" + fila);

    let casilleroActual = this.casilleros[fila][columna];

    return (
      this.verifyHorizontal(casilleroActual) ||
      this.verifyVertical(casilleroActual) ||
      this.verifyDiagonalDescendente(casilleroActual) ||
      this.verifyDiagonalAscendente(casilleroActual)
    );
  }

  //HORIZONTAL
  verifyHorizontal(casilleroActual) {
    if (!casilleroActual.estaVacio()) {
      return (
        this.checkHorizontal(casilleroActual, 1) ||
        this.checkHorizontal(casilleroActual, -1)
      );
    }
    return false;
  }

  verifyVertical(casilleroActual) {
    if (!casilleroActual.estaVacio()) {
      return (
        this.checkVertical(casilleroActual, 1) ||
        this.checkVertical(casilleroActual, -1)
      );
    }
    return false;
  }

  verifyDiagonalDescendente(casilleroActual) {
    if (!casilleroActual.estaVacio()) {
      return (
        this.checkDiagonalDescendente(casilleroActual, 1) ||
        this.checkDiagonalDescendente(casilleroActual, -1)
      );
    }
    return false;
  }

  verifyDiagonalAscendente(casilleroActual) {
    if (!casilleroActual.estaVacio()) {
      return (
        this.checkDiagonalAcsendente(casilleroActual, 1) ||
        this.checkDiagonalAcsendente(casilleroActual, -1)
      );
    }
    return false;
  }

  checkHorizontal(casilleroActual) {
    //console.log("entro");
    let cont = 1;

    if (casilleroActual.getFicha() === null) {
      return false;
    }

    const equipo = casilleroActual.getFicha().getEquipo();

    for (let i = casilleroActual.getColumn() + 1; i < this.columns; i++) {
      const fichaDerecha =
        this.casilleros[casilleroActual.getRow()][i].getFicha();

      if (fichaDerecha && fichaDerecha.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }

    for (let j = casilleroActual.getColumn() - 1; j >= 0; j--) {
      const fichaIzquierda =
        this.casilleros[casilleroActual.getRow()][j].getFicha();
      if (fichaIzquierda && fichaIzquierda.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }
    return cont === this.line;
  }

  checkVertical(casilleroActual) {
    let cont = 1;

    if (casilleroActual.getFicha() === null) {
      return false;
    }
    const equipo = casilleroActual.getFicha().getEquipo();

    for (let i = casilleroActual.getRow() + 1; i < this.rows; i++) {
      const fichaAbajo =
        this.casilleros[i][casilleroActual.getColumn()].getFicha();

      if (fichaAbajo && fichaAbajo.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }

    for (let j = casilleroActual.getRow() - 1; j >= 0; j--) {
      const fichaArriba =
        this.casilleros[j][casilleroActual.getColumn()].getFicha();
      if (fichaArriba && fichaArriba.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }
    return cont === this.line;
  }

  checkDiagonalDescendente(casilleroActual) {
    let cont = 1;

    if (casilleroActual.getFicha() === null) {
      return false;
    }
    const equipo = casilleroActual.getFicha().getEquipo();

    for (
      let i = casilleroActual.getRow() + 1, j = casilleroActual.getColumn() + 1;
      i < this.rows && j < this.columns;
      i++, j++
    ) {
      const fichaAbajoDerecha = this.casilleros[i][j].getFicha();

      if (fichaAbajoDerecha && fichaAbajoDerecha.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }

    for (
      let i = casilleroActual.getRow() + 1, j = casilleroActual.getColumn() - 1;
      i < this.rows && j >= 0;
      i++, j--
    ) {
      const fichaAbajoIzquierda = this.casilleros[i][j].getFicha();
      if (fichaAbajoIzquierda && fichaAbajoIzquierda.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }
    return cont === this.line;
  }

  checkDiagonalAcsendente(casilleroActual) {
    let cont = 1;

    if (casilleroActual.getFicha() === null) {
      return false;
    }

    const equipo = casilleroActual.getFicha().getEquipo();

    for (
      let i = casilleroActual.getRow() - 1, j = casilleroActual.getColumn() + 1;
      i >= 0 && j < this.columns;
      i--, j++
    ) {
      const fichaArribaDerecha = this.casilleros[i][j].getFicha();

      if (fichaArribaDerecha && fichaArribaDerecha.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }

    for (
      let i = casilleroActual.getRow() - 1, j = casilleroActual.getColumn() - 1;
      i >= 0 && j >= 0;
      i--, j--
    ) {
      const fichaArribaIzquierda = this.casilleros[i][j].getFicha();

      if (fichaArribaIzquierda && fichaArribaIzquierda.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }

    return cont === this.line;
  }
}

//export default Tablero;
