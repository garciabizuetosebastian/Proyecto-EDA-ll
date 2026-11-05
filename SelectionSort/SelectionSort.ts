type Estado = {
  arr: number[];
  comparar: [number, number] | null;
  minimo: number | null;
  ordenados: number;
  done: boolean;
  titulo: string;
  explicacion: string;
  detalle: string;
  lineaCodigo: number;
};

type Paleta = {
  fondo: string;
  normalFondo: string;
  normalBorde: string;
  normalTexto: string;
  compararFondo: string;
  compararBorde: string;
  compararTexto: string;
  minimoFondo: string;
  minimoBorde: string;
  minimoTexto: string;
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

const PALETA: Paleta = {
  fondo: "#100c0e",
  normalFondo: "#261a20",
  normalBorde: "#593644",
  normalTexto: "#f0e2e7",
  compararFondo: "#762e48",
  compararBorde: "#d77a98",
  compararTexto: "#fff0f4",
  minimoFondo: "#694c27",
  minimoBorde: "#d5a35b",
  minimoTexto: "#fff2d6",
  exitoFondo: "#4a2636",
  exitoBorde: "#b65b79",
  exitoTexto: "#ffe8ef",
};

let pasos: Estado[] = [];
let pasoActual = 0;
let playing = false;
let timer: number | null = null;

function actualizarColorBarra(barra: HTMLInputElement): void {
  const minimo = Number(barra.min);
  const maximo = Number(barra.max);
  const valor = Number(barra.value);
  const porcentaje = maximo > minimo
    ? ((valor - minimo) / (maximo - minimo)) * 100
    : 0;
  barra.style.setProperty("--progreso", `${porcentaje}%`);
}

function calcularPasos(n: number): Estado[] {
  const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
  const historial: Estado[] = [];
  const len = arr.length;

  historial.push({
    arr: [...arr],
    comparar: null,
    minimo: null,
    ordenados: 0,
    done: false,
    titulo: "Empezamos con una lista desordenada",
    explicacion: `Tenemos ${n} números. Selection Sort buscará el menor de la parte desordenada.`,
    detalle: "En cada pasada, el menor encontrado ocupará la primera posición libre.",
    lineaCodigo: 2,
  });

  for (let i = 0; i < len - 1; i++) {
    let indiceMinimo = i;
    historial.push({
      arr: [...arr],
      comparar: null,
      minimo: indiceMinimo,
      ordenados: i,
      done: false,
      titulo: `Iniciamos la pasada ${i + 1}`,
      explicacion: `Buscamos el número menor desde la posición ${i + 1} hasta el final.`,
      detalle: `${i} número(s) al inicio ya quedaron en su posición correcta.`,
      lineaCodigo: 3,
    });

    for (let j = i + 1; j < len; j++) {
      historial.push({
        arr: [...arr],
        comparar: [indiceMinimo, j],
        minimo: indiceMinimo,
        ordenados: i,
        done: false,
        titulo: "Comparamos con el menor actual",
        explicacion: `Comparamos ${arr[j]} (posición ${j + 1}) con el menor actual, ${arr[indiceMinimo]} (posición ${indiceMinimo + 1}).`,
        detalle: arr[j] < arr[indiceMinimo]
          ? `${arr[j]} es menor; ahora será el nuevo candidato a mínimo.`
          : `${arr[j]} no es menor; conservamos ${arr[indiceMinimo]} como candidato.`,
        lineaCodigo: 6,
      });

      if (arr[j] < arr[indiceMinimo]) {
        indiceMinimo = j;
        historial.push({
          arr: [...arr],
          comparar: null,
          minimo: indiceMinimo,
          ordenados: i,
          done: false,
          titulo: "Actualizamos el mínimo",
          explicacion: `El nuevo menor es ${arr[indiceMinimo]}, en la posición ${indiceMinimo + 1}.`,
          detalle: `Seguimos buscando en el resto de la parte desordenada: ${arr.slice(i + 1).join(" · ")}.`,
          lineaCodigo: 6,
        });
      }
    }

    if (indiceMinimo !== i) {
      const valorInicio = arr[i];
      const valorMinimo = arr[indiceMinimo];
      [arr[i], arr[indiceMinimo]] = [arr[indiceMinimo], arr[i]];
      historial.push({
        arr: [...arr],
        comparar: [i, indiceMinimo],
        minimo: null,
        ordenados: i + 1,
        done: false,
        titulo: "Colocamos el mínimo en su posición",
        explicacion: `Intercambiamos ${valorMinimo} con ${valorInicio}; ${valorMinimo} queda en la posición ${i + 1}.`,
        detalle: `La lista queda: ${arr.join(" · ")}.`,
        lineaCodigo: 7,
      });
    } else {
      historial.push({
        arr: [...arr],
        comparar: null,
        minimo: i,
        ordenados: i + 1,
        done: false,
        titulo: "El mínimo ya está en su posición",
        explicacion: `${arr[i]} ya es el menor de la parte desordenada, así que no hace falta intercambiar.`,
        detalle: `La posición ${i + 1} queda fija.`,
        lineaCodigo: 7,
      });
    }
  }

  historial.push({
    arr: [...arr],
    comparar: null,
    minimo: null,
    ordenados: len,
    done: true,
    titulo: "¡Lista ordenada!",
    explicacion: "Terminamos las pasadas. Los números quedaron de menor a mayor.",
    detalle: `Resultado final: ${arr.join(" · ")}.`,
    lineaCodigo: 8,
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

    if (estado.done || k < estado.ordenados) {
      bgColor = PALETA.exitoFondo;
      borderColor = PALETA.exitoBorde;
      textColor = PALETA.exitoTexto;
    } else if (estado.comparar && (k === estado.comparar[0] || k === estado.comparar[1])) {
      bgColor = PALETA.compararFondo;
      borderColor = PALETA.compararBorde;
      textColor = PALETA.compararTexto;
    } else if (k === estado.minimo) {
      bgColor = PALETA.minimoFondo;
      borderColor = PALETA.minimoBorde;
      textColor = PALETA.minimoTexto;
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

  const estado = pasos[pasoActual];
  dibujarEstado(estado);
  barraPasos.value = String(pasoActual);
  actualizarColorBarra(barraPasos);
  infoLabel.textContent = `Paso: ${pasoActual + 1} / ${pasos.length}`;
  tituloPaso.textContent = estado.titulo;
  explicacionPaso.textContent = estado.explicacion;
  detallePaso.textContent = estado.detalle;
  btnAnt.disabled = pasoActual === 0;
  btnSig.disabled = pasoActual === pasos.length - 1;

  for (let linea = 1; linea <= 8; linea++) {
    const elemento = obtenerElemento<HTMLSpanElement>(`codigo-${linea}`);
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
  registro.querySelector(".actual")?.scrollIntoView({ block: "nearest" });
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