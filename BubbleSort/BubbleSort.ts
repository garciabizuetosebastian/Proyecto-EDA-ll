type Estado = {
  arr: number[];
  comp: [number, number] | null;
  done: boolean;
  titulo: string;
  explicacion: string;
  detalle: string;
  lineaCodigo: number;
};

type Palette = {
  fondo: string;
  normalFondo: string;
  normalBorde: string;
  normalTexto: string;
  compararFondo: string;
  compararBorde: string;
  compararTexto: string;
  exitoFondo: string;
  exitoBorde: string;
  exitoTexto: string;
};

function obtenerElemento<T extends HTMLElement>(id: string): T {
  const elemento = document.getElementById(id);
  if (!elemento) {
    throw new Error(`No se encontró el elemento con id "${id}".`);
  }
  return elemento as T;
}

function obtenerContexto(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const contexto = canvas.getContext("2d");
  if (!contexto) {
    throw new Error("No se pudo obtener el contexto 2D del canvas.");
  }
  return contexto;
}

const canvas = obtenerElemento<HTMLCanvasElement>("canvas");
const inputNum = obtenerElemento<HTMLInputElement>("numInput");
const numValor = obtenerElemento<HTMLOutputElement>("numValor");
const infoLabel = obtenerElemento<HTMLSpanElement>("info");
const tituloPaso = obtenerElemento<HTMLHeadingElement>("tituloPaso");
const explicacionPaso = obtenerElemento<HTMLParagraphElement>("explicacionPaso");
const detallePaso = obtenerElemento<HTMLParagraphElement>("detallePaso");
const registro = obtenerElemento<HTMLOListElement>("registro");
const btnGenerar = obtenerElemento<HTMLButtonElement>("btnGenerar");
const btnAnt = obtenerElemento<HTMLButtonElement>("btnAnt");
const btnPlay = obtenerElemento<HTMLButtonElement>("btnPlay");
const btnSig = obtenerElemento<HTMLButtonElement>("btnSig");
const barraPasos = obtenerElemento<HTMLInputElement>("barraPasos");
const ctx = obtenerContexto(canvas);

const W = canvas.width;
const H = canvas.height;

function actualizarColorBarra(barra: HTMLInputElement): void {
  const minimo = Number(barra.min);
  const maximo = Number(barra.max);
  const valor = Number(barra.value);
  const porcentaje = maximo > minimo
    ? ((valor - minimo) / (maximo - minimo)) * 100
    : 0;
  barra.style.setProperty("--progreso", `${porcentaje}%`);
}

const PALETA: Palette = {
  fondo: "#100c0e",
  normalFondo: "#261a20",
  normalBorde: "#593644",
  normalTexto: "#f0e2e7",

  compararFondo: "#762e48",
  compararBorde: "#d77a98",
  compararTexto: "#fff0f4",

  exitoFondo: "#4a2636",
  exitoBorde: "#b65b79",
  exitoTexto: "#ffe8ef",
};

let pasos: Estado[] = [];
let pasoActual: number = 0;
let playing: boolean = false;
let timer: number | null = null;

function calcularPasos(n: number): Estado[] {
  const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
  const historial: Estado[] = [];

  historial.push({
    arr: [...arr],
    comp: null,
    done: false,
    titulo: "Empezamos con una lista desordenada",
    explicacion: `Tenemos ${n} números. Bubble Sort revisará números vecinos de izquierda a derecha.`,
    detalle: "En cada comparación, el número mayor irá avanzando hacia el extremo derecho.",
    lineaCodigo: 2,
  });

  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    historial.push({
      arr: [...arr],
      comp: null,
      done: false,
      titulo: `Iniciamos la pasada ${i + 1}`,
      explicacion: "Empezamos una nueva vuelta desde el principio de la lista.",
      detalle: `${i} número(s) al final ya quedaron en su posición correcta. Lista: ${arr.join(" · ")}.`,
      lineaCodigo: 3,
    });

    for (let j = 0; j < len - i - 1; j++) {
      historial.push({
        arr: [...arr],
        comp: null,
        done: false,
        titulo: "Avanzamos al siguiente par",
        explicacion: `En esta pasada vamos a revisar los elementos de las posiciones ${j + 1} y ${j + 2}.`,
        detalle: "La barra roja aparecerá al comparar estos dos vecinos.",
        lineaCodigo: 4,
      });

      const izquierda = arr[j];
      const derecha = arr[j + 1];
      const hayQueIntercambiar = izquierda > derecha;
      const comparacion = `${izquierda} ${hayQueIntercambiar ? "es mayor" : "no es mayor"} que ${derecha}`;
      const posiciones = `Los elementos están en las posiciones ${j + 1} y ${j + 2}.`;

      historial.push({
        arr: [...arr],
        comp: [j, j + 1],
        done: false,
        titulo: `Pasada ${i + 1}: comparamos dos vecinos`,
        explicacion: `Comparamos ${izquierda} (izquierda) con ${derecha} (derecha): ${comparacion}.`,
        detalle: hayQueIntercambiar
          ? `Como están en orden descendente, en el siguiente paso los intercambiaremos. ${posiciones}`
          : `No hace falta intercambiarlos: el menor ya está a la izquierda. ${posiciones}`,
        lineaCodigo: 5,
      });

      if (hayQueIntercambiar) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        historial.push({
          arr: [...arr],
          comp: [j, j + 1],
          done: false,
          titulo: "Intercambiamos los números",
          explicacion: `${izquierda} y ${derecha} cambiaron de lugar. Ahora ${derecha} queda a la izquierda de ${izquierda}.`,
          detalle: `La lista queda: ${arr.join(" · ")}. El número mayor avanzó una posición hacia la derecha.`,
          lineaCodigo: 6,
        });
      }
    }
  }
  historial.push({
    arr: [...arr],
    comp: null,
    done: true,
    titulo: "¡Lista ordenada!",
    explicacion: "Terminamos de recorrer los pares vecinos. Los números quedaron de menor a mayor.",
    detalle: `Resultado final: ${arr.join(" · ")}.`,
    lineaCodigo: 7,
  });
  return historial;
}

function dibujarEstado(estado: Estado): void {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = PALETA.fondo;
  ctx.fillRect(0, 0, W, H);

  const n = estado.arr.length;
  const margen = 5;
  const anchoTotal = W - margen * (n + 1);
  const boxW = Math.min(60, anchoTotal / n);
  const boxH = 50;
  const startY = (H - boxH) / 2;

  const totalWidth = n * boxW + (n - 1) * margen;
  const startX = (W - totalWidth) / 2;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let k = 0; k < n; k++) {
    const x = startX + k * (boxW + margen);

    let bgColor = PALETA.normalFondo;
    let borderColor = PALETA.normalBorde;
    let textColor = PALETA.normalTexto;

    if (estado.done) {
      bgColor = PALETA.exitoFondo;
      borderColor = PALETA.exitoBorde;
      textColor = PALETA.exitoTexto;
    } else if (estado.comp && (k === estado.comp[0] || k === estado.comp[1])) {
      bgColor = PALETA.compararFondo;
      borderColor = PALETA.compararBorde;
      textColor = PALETA.compararTexto;
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(x, startY, boxW, boxH);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, startY, boxW, boxH);

    ctx.fillStyle = textColor;
    if (boxW < 30) ctx.font = "bold 12px Arial";
    else if (boxW < 45) ctx.font = "bold 16px Arial";
    else ctx.font = "bold 20px Arial";

    ctx.fillText(String(estado.arr[k]), x + boxW / 2, startY + boxH / 2);
  }
}

function actualizarVista(): void {
  if (pasos.length === 0) return;

  dibujarEstado(pasos[pasoActual]);
  barraPasos.value = String(pasoActual);
  actualizarColorBarra(barraPasos);
  infoLabel.textContent = `Paso: ${pasoActual + 1} / ${pasos.length}`;
  const estado = pasos[pasoActual];
  tituloPaso.textContent = estado.titulo;
  explicacionPaso.textContent = estado.explicacion;
  detallePaso.textContent = estado.detalle;
  btnAnt.disabled = pasoActual === 0;
  btnSig.disabled = pasoActual === pasos.length - 1;

  for (let linea = 1; linea <= 7; linea++) {
    const elemento = obtenerElemento<HTMLLIElement>(`codigo-${linea}`);
    elemento.classList.toggle("activa", estado.lineaCodigo === linea);
  }

  const elementosRegistro = pasos.slice(0, pasoActual + 1).map((paso, indice) => {
    const elemento = document.createElement("li");
    elemento.textContent = `${paso.titulo}: ${paso.explicacion}`;
    if (indice === pasoActual) {
      elemento.classList.add("actual");
      elemento.setAttribute("aria-current", "step");
    }
    return elemento;
  });
  registro.replaceChildren(...elementosRegistro);
  const pasoVisible = registro.querySelector(".actual");
  pasoVisible?.scrollIntoView({ block: "nearest" });
}

function generar(): void {
  detener();
  const n = Number(inputNum.value);
  numValor.value = String(n);
  pasos = calcularPasos(n);
  pasoActual = 0;
  barraPasos.max = String(pasos.length - 1);
  actualizarVista();
}

function siguiente(): void {
  if (pasoActual < pasos.length - 1) {
    pasoActual++;
    actualizarVista();
  } else {
    detener();
  }
}

function anterior(): void {
  if (pasoActual > 0) {
    pasoActual--;
    actualizarVista();
  }
}

function play(): void {
  if (playing) return;
  if (pasoActual === pasos.length - 1) pasoActual = 0;

  playing = true;
  btnPlay.textContent = "Pausar";

  timer = window.setInterval(() => {
    siguiente();
    if (pasoActual >= pasos.length - 1) detener();
  }, 300);
}

function detener(): void {
  playing = false;
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
  btnPlay.textContent = "Reproducir";
}

btnGenerar.onclick = generar;
inputNum.oninput = () => {
  numValor.value = inputNum.value;
  actualizarColorBarra(inputNum);
};
btnAnt.onclick = () => {
  detener();
  anterior();
};
btnSig.onclick = () => {
  detener();
  siguiente();
};
barraPasos.oninput = () => {
  detener();
  pasoActual = Number(barraPasos.value);
  actualizarVista();
};
btnPlay.onclick = () => {
  if (playing) detener();
  else play();
};

generar();
actualizarColorBarra(inputNum);