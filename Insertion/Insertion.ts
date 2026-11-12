type Estado = {
  arr: number[];
  rango: [number, number] | null;   // parte ordenada (más la clave en juego); lo demás queda fuera de foco
  hueco: number | null;             // posición vacía mientras la clave está "levantada"
  clave: number | null;             // valor de la clave que se está insertando
  comp: number[];                   // posiciones del arreglo resaltadas
  ordenado: boolean[];              // posiciones que ya forman la parte ordenada
  done: boolean;
  titulo: string;
  explicacion: string;
  detalle: string;
  lineaCodigo: number;
};

type Parcial = {
  titulo: string;
  explicacion: string;
  detalle: string;
  lineaCodigo: number;
  rango?: [number, number];
  hueco?: number;
  clave?: number;
  comp?: number[];
  done?: boolean;
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

const LINEAS_CODIGO = 7;

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

  // El primer número ya cuenta como una lista ordenada de un solo elemento.
  const ordenado: boolean[] = Array.from({ length: n }, (_, k) => k === 0);

  const registrar = (p: Parcial): void => {
    historial.push({
      arr: [...arr],
      rango: p.rango ?? null,
      hueco: p.hueco ?? null,
      clave: p.clave ?? null,
      comp: p.comp ?? [],
      ordenado: [...ordenado],
      done: p.done ?? false,
      titulo: p.titulo,
      explicacion: p.explicacion,
      detalle: p.detalle,
      lineaCodigo: p.lineaCodigo,
    });
  };

  registrar({
    rango: [0, 0],
    titulo: "Empezamos con una lista desordenada",
    explicacion: `Tenemos ${n} números. Insertion Sort va formando una parte ordenada a la izquierda, insertando un número a la vez en su lugar correcto.`,
    detalle: "El primer número ya cuenta como una lista ordenada de un solo elemento.",
    lineaCodigo: 1,
  });

  for (let i = 1; i < n; i++) {
    const clave = arr[i];
    const rango: [number, number] = [0, i];
    let j = i - 1;

    // La posición i entra a la zona de trabajo: sus i elementos ordenados + la clave levantada.
    ordenado[i] = true;

    registrar({
      rango,
      hueco: i,
      clave,
      titulo: `Pasada ${i}: tomamos la clave`,
      explicacion: `Tomamos ${clave} (posición ${i + 1}) y lo apartamos para buscarle su lugar en la parte ordenada.`,
      detalle: `Parte ordenada: ${arr.slice(0, i).join(" · ")}.`,
      lineaCodigo: 3,
    });

    while (j >= 0) {
      const mayor = arr[j] > clave;

      registrar({
        rango,
        hueco: j + 1,
        clave,
        comp: [j],
        titulo: `Pasada ${i}: comparamos con la clave`,
        explicacion: `Comparamos ${arr[j]} (posición ${j + 1}) con la clave ${clave}: ${arr[j]} ${mayor ? "es mayor" : "no es mayor"} que ${clave}.`,
        detalle: mayor
          ? "Como es mayor, lo desplazamos una posición hacia la derecha."
          : "Como no es mayor, la clave ya encontró su lugar y dejamos de buscar.",
        lineaCodigo: 4,
      });

      if (!mayor) break;

      const movido = arr[j];
      arr[j + 1] = arr[j];

      registrar({
        rango,
        hueco: j,
        clave,
        comp: [j + 1],
        titulo: "Desplazamos a la derecha",
        explicacion: `${movido} se mueve a la posición ${j + 2}. El hueco ahora está en la posición ${j + 1}.`,
        detalle: "El hueco se va corriendo hacia la izquierda mientras encontremos números mayores que la clave.",
        lineaCodigo: 5,
      });

      j--;
    }

    arr[j + 1] = clave;

    registrar({
      rango,
      comp: [j + 1],
      titulo: "Insertamos la clave",
      explicacion: `${clave} se coloca en la posición ${j + 2}.`,
      detalle: `${j < 0 ? "Llegamos al inicio de la lista. " : ""}Parte ordenada: ${arr.slice(0, i + 1).join(" · ")}.`,
      lineaCodigo: 6,
    });
  }

  for (let p = 0; p < n; p++) ordenado[p] = true;
  registrar({
    done: true,
    titulo: "¡Lista ordenada!",
    explicacion: "Insertamos todos los números en su lugar. Los números quedaron de menor a mayor.",
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

  // La clave "levantada" flota sobre la fila y las etiquetas van debajo;
  // centramos todo como un bloque.
  const elevacion = boxH + 14;
  const etiquetas = 34;
  const bloqueAlto = elevacion + boxH + etiquetas;
  const claveY = Math.max(24, (H - bloqueAlto) / 2);
  const mainY = claveY + elevacion;

  const totalWidth = n * boxW + (n - 1) * margen;
  const startX = (W - totalWidth) / 2;
  const xDe = (k: number): number => startX + k * (boxW + margen);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const fuente = (): string => {
    if (boxW < 30) return "bold 12px Arial";
    if (boxW < 45) return "bold 16px Arial";
    return "bold 20px Arial";
  };

  const dibujarCaja = (
    x: number,
    y: number,
    valor: number,
    fondo: string,
    borde: string,
    texto: string,
    alpha: number,
  ): void => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fondo;
    ctx.fillRect(x, y, boxW, boxH);
    ctx.strokeStyle = borde;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, boxW, boxH);
    ctx.fillStyle = texto;
    ctx.font = fuente();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(valor), x + boxW / 2, y + boxH / 2);
    ctx.restore();
  };

  // Fila principal
  for (let k = 0; k < n; k++) {
    const x = xDe(k);

    // Hueco: el espacio que dejó la clave al levantarse
    if (estado.hueco === k) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = PALETA.normalBorde;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, mainY, boxW, boxH);
      ctx.restore();
      continue;
    }

    const dentro = estado.rango !== null && k >= estado.rango[0] && k <= estado.rango[1];

    let alpha = 1;
    if (!estado.done && estado.rango !== null && !dentro) alpha = 0.38;

    let fondo = PALETA.normalFondo;
    let borde = PALETA.normalBorde;
    let texto = PALETA.normalTexto;

    if (estado.done || estado.ordenado[k]) {
      fondo = PALETA.exitoFondo;
      borde = PALETA.exitoBorde;
      texto = PALETA.exitoTexto;
    }

    if (!estado.done && estado.comp.includes(k)) {
      fondo = PALETA.compararFondo;
      borde = PALETA.compararBorde;
      texto = PALETA.compararTexto;
    }

    dibujarCaja(x, mainY, estado.arr[k], fondo, borde, texto, alpha);
  }

  // Línea divisoria y etiquetas: parte ordenada | por ordenar
  if (estado.rango !== null && !estado.done) {
    const [lo, hi] = estado.rango;
    const yEtiqueta = mainY + boxH + 20;

    ctx.fillStyle = PALETA.compararBorde;
    ctx.font = "bold 12px Arial";
    ctx.fillText("parte ordenada", (xDe(lo) + xDe(hi) + boxW) / 2, yEtiqueta);

    if (hi < n - 1) {
      const xDiv = xDe(hi + 1) - margen / 2;

      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = PALETA.compararBorde;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xDiv, mainY - 8);
      ctx.lineTo(xDiv, mainY + boxH + 8);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = PALETA.compararBorde;
      ctx.font = "bold 12px Arial";
      ctx.fillText("por ordenar", (xDe(hi + 1) + xDe(n - 1) + boxW) / 2, yEtiqueta);
    }
  }

  // Clave levantada, justo encima del hueco
  if (estado.clave !== null && estado.hueco !== null) {
    const x = xDe(estado.hueco);

    dibujarCaja(x, claveY, estado.clave, PALETA.compararFondo, PALETA.compararBorde, PALETA.compararTexto, 1);

    ctx.fillStyle = PALETA.compararBorde;
    ctx.font = "bold 12px Arial";
    ctx.fillText("clave", x + boxW / 2, claveY - 8);
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

  for (let linea = 1; linea <= LINEAS_CODIGO; linea++) {
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
  // El paso actual siempre es el último: bajamos solo el scroll del registro.
  // (scrollIntoView movía también la página completa.)
  registro.scrollTop = registro.scrollHeight;
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