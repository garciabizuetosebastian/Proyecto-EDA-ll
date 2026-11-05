type Estado = {
  arr: (number | null)[];           // lista principal (null = casilla vacía)
  cubetas: number[][];              // contenido de las 10 cubetas (0 a 9)
  digito: number | null;            // dígito que se analiza (0 = unidades, 1 = decenas...)
  comp: number[];                   // posiciones de la lista resaltadas
  usados: boolean[];                // números que ya se repartieron en una cubeta
  cubetaActiva: number | null;      // cubeta con la que se trabaja
  flecha: [number, number] | null;  // (posición en la lista, cubeta) para dibujar la flecha
  ancho: number;                    // cantidad de dígitos con que se muestran los números
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
  digito?: number;
  comp?: number[];
  cubetaActiva?: number;
  flecha?: [number, number];
  done?: boolean;
};

type Palette = {
  fondo: string;
  normalFondo: string;
  normalBorde: string;
  normalTexto: string;
  rangoFondo: string;
  rangoBorde: string;
  rangoTexto: string;
  compararFondo: string;
  compararBorde: string;
  compararTexto: string;
  exitoFondo: string;
  exitoBorde: string;
  exitoTexto: string;
  digitoColor: string;
  tenue: string;
  cubetaFondo: string;
};

const LINEAS_CODIGO = 7;
const NOMBRES_DIGITO: string[] = ["unidades", "decenas", "centenas", "millares"];

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
const inputMios = obtenerElemento<HTMLInputElement>("misNumeros");
const btnUsar = obtenerElemento<HTMLButtonElement>("btnUsar");
const aviso = obtenerElemento<HTMLSpanElement>("aviso");
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

  rangoFondo: "#33222a",
  rangoBorde: "#8a4a63",
  rangoTexto: "#f0e2e7",

  compararFondo: "#762e48",
  compararBorde: "#d77a98",
  compararTexto: "#fff0f4",

  exitoFondo: "#4a2636",
  exitoBorde: "#b65b79",
  exitoTexto: "#ffe8ef",

  digitoColor: "#e3b341",   // dígito que se está analizando
  tenue: "#7a6470",         // ceros de relleno a la izquierda
  cubetaFondo: "#181115",
};

let pasos: Estado[] = [];
let pasoActual: number = 0;
let playing: boolean = false;
let timer: number | null = null;

function calcularPasos(valores: number[]): Estado[] {
  const n = valores.length;
  const numDigitos = String(Math.max(...valores)).length;
  const historial: Estado[] = [];

  let arr: (number | null)[] = [...valores];
  let cubetas: number[][] = Array.from({ length: 10 }, () => []);
  let usados: boolean[] = Array.from({ length: n }, () => false);

  const registrar = (p: Parcial): void => {
    historial.push({
      arr: [...arr],
      cubetas: cubetas.map((c) => [...c]),
      digito: p.digito ?? null,
      comp: p.comp ?? [],
      usados: [...usados],
      cubetaActiva: p.cubetaActiva ?? null,
      flecha: p.flecha ?? null,
      ancho: numDigitos,
      done: p.done ?? false,
      titulo: p.titulo,
      explicacion: p.explicacion,
      detalle: p.detalle,
      lineaCodigo: p.lineaCodigo,
    });
  };

  registrar({
    titulo: "Empezamos con una lista desordenada",
    explicacion: `Tenemos ${n} números de hasta ${numDigitos} dígito(s). Radix Sort no compara los números entre sí: los reparte en 10 cubetas (0 a 9) según uno de sus dígitos.`,
    detalle: `Haremos ${numDigitos} pasada(s), una por cada dígito, empezando por el de más a la derecha (las unidades).`,
    lineaCodigo: 1,
  });

  for (let d = 0; d < numDigitos; d++) {
    const nombre = NOMBRES_DIGITO[d] ?? `posición ${d + 1}`;
    const divisor = 10 ** d;
    const digitoDe = (v: number): number => Math.floor(v / divisor) % 10;

    cubetas = Array.from({ length: 10 }, () => []);
    usados = Array.from({ length: n }, () => false);

    registrar({
      digito: d,
      titulo: `Pasada ${d + 1} de ${numDigitos}: las ${nombre}`,
      explicacion: `Ahora solo nos fijamos en el dígito de las ${nombre} de cada número (está resaltado en la lista).`,
      detalle: "Preparamos 10 cubetas vacías, numeradas del 0 al 9.",
      lineaCodigo: 3,
    });

    // 1) Repartir: cada número va a la cubeta de su dígito
    for (let k = 0; k < n; k++) {
      const valor = arr[k] as number;
      const cubeta = digitoDe(valor);
      cubetas[cubeta].push(valor);
      usados[k] = true;

      registrar({
        digito: d,
        comp: [k],
        cubetaActiva: cubeta,
        flecha: [k, cubeta],
        titulo: `Repartimos el ${valor}`,
        explicacion: `El dígito de las ${nombre} de ${valor} es ${cubeta}. Lo mandamos a la cubeta ${cubeta}.`,
        detalle: `Cubeta ${cubeta} hasta ahora (de arriba hacia abajo): ${cubetas[cubeta].join(" · ")}.`,
        lineaCodigo: 5,
      });
    }

    registrar({
      digito: d,
      titulo: "Todo repartido",
      explicacion: `Los ${n} números ya están en sus cubetas.`,
      detalle: "Ahora los recogemos en orden: primero la cubeta 0, luego la 1, y así hasta la 9. Dentro de cada cubeta, de arriba hacia abajo.",
      lineaCodigo: 6,
    });

    // 2) Recoger: se vacían las cubetas de la 0 a la 9 sobre la lista
    arr = Array.from({ length: n }, (): number | null => null);
    usados = Array.from({ length: n }, () => false);

    let k = 0;
    for (let b = 0; b < 10; b++) {
      if (cubetas[b].length === 0) continue;

      const contenido = [...cubetas[b]];
      const posiciones: number[] = [];
      for (const valor of contenido) {
        arr[k] = valor;
        posiciones.push(k);
        k++;
      }
      cubetas[b] = [];

      const primera = posiciones[0] + 1;
      const ultima = posiciones[posiciones.length - 1] + 1;
      registrar({
        digito: d,
        comp: posiciones,
        cubetaActiva: b,
        titulo: `Recogemos la cubeta ${b}`,
        explicacion: `Pasamos ${contenido.join(" · ")} de la cubeta ${b} a ${primera === ultima ? `la posición ${primera}` : `las posiciones ${primera} a ${ultima}`} de la lista.`,
        detalle: `Llevamos ${k} de ${n} números recogidos.`,
        lineaCodigo: 6,
      });
    }

    registrar({
      digito: d,
      titulo: `Pasada ${d + 1} terminada`,
      explicacion: `Después de repartir por las ${nombre}, la lista quedó: ${arr.join(" · ")}.`,
      detalle: d < numDigitos - 1
        ? "Los que tienen el mismo dígito conservan el orden que traían (por eso el método es estable). Repetimos con el siguiente dígito."
        : "Ya usamos todos los dígitos.",
      lineaCodigo: 2,
    });
  }

  registrar({
    done: true,
    titulo: "¡Lista ordenada!",
    explicacion: "Después de la última pasada la lista quedó de menor a mayor. Radix Sort nunca comparó dos números entre sí.",
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
  const boxW = Math.min(64, anchoTotal / n);
  const boxH = 50;
  const mainY = 40;

  const totalWidth = n * boxW + (n - 1) * margen;
  const startX = (W - totalWidth) / 2;
  const xDe = (k: number): number => startX + k * (boxW + margen);

  const tamanoFuente = boxW < 34 ? 12 : boxW < 48 ? 15 : 19;

  // Dibuja un número con relleno de ceros; el dígito analizado va resaltado.
  const dibujarNumero = (
    valor: number,
    cx: number,
    cy: number,
    tamano: number,
    colorBase: string,
    digito: number | null,
  ): void => {
    const texto = String(valor).padStart(estado.ancho, "0");
    const ceros = texto.length - String(valor).length;

    ctx.save();
    ctx.font = `bold ${tamano}px monospace`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const anchoCaracter = ctx.measureText("0").width;
    const x0 = cx - (anchoCaracter * texto.length) / 2;

    for (let c = 0; c < texto.length; c++) {
      const posicionDigito = texto.length - 1 - c;
      if (digito !== null && posicionDigito === digito) {
        ctx.fillStyle = PALETA.digitoColor;
      } else if (c < ceros) {
        ctx.fillStyle = PALETA.tenue;
      } else {
        ctx.fillStyle = colorBase;
      }
      ctx.fillText(texto.charAt(c), x0 + c * anchoCaracter, cy);
    }
    ctx.restore();
  };

  // Etiqueta del dígito que se analiza
  if (estado.digito !== null) {
    const nombre = NOMBRES_DIGITO[estado.digito] ?? `posición ${estado.digito + 1}`;
    ctx.fillStyle = PALETA.digitoColor;
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(`Dígito que analizamos: ${nombre}`, 16, 18);
  }

  // Fila de la lista principal
  for (let k = 0; k < n; k++) {
    const valor = estado.arr[k];
    const x = xDe(k);

    if (valor === null) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = PALETA.normalBorde;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, mainY, boxW, boxH);
      ctx.restore();
      continue;
    }

    let fondo = PALETA.normalFondo;
    let borde = PALETA.normalBorde;
    let texto = PALETA.normalTexto;
    let alpha = 1;

    if (estado.done) {
      fondo = PALETA.exitoFondo;
      borde = PALETA.exitoBorde;
      texto = PALETA.exitoTexto;
    } else if (estado.digito !== null) {
      fondo = PALETA.rangoFondo;
      borde = PALETA.rangoBorde;
      texto = PALETA.rangoTexto;
    }

    if (estado.usados[k]) alpha = 0.3;

    if (estado.comp.includes(k)) {
      fondo = PALETA.compararFondo;
      borde = PALETA.compararBorde;
      texto = PALETA.compararTexto;
      alpha = 1;
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fondo;
    ctx.fillRect(x, mainY, boxW, boxH);
    ctx.strokeStyle = borde;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, mainY, boxW, boxH);
    dibujarNumero(valor, x + boxW / 2, mainY + boxH / 2, tamanoFuente, texto, estado.done ? null : estado.digito);
    ctx.restore();
  }

  // Cubetas del 0 al 9
  const cubetaW = 72;
  const hueco = (W - 10 * cubetaW) / 11;
  const xCubeta = (b: number): number => hueco + b * (cubetaW + hueco);
  const cubetaY = 170;
  const cubetaH = H - cubetaY - 16;

  const maxLargo = Math.max(1, ...estado.cubetas.map((c) => c.length));
  const fichaH = Math.min(28, (cubetaH - 12) / maxLargo);
  const fichaW = cubetaW - 12;

  for (let b = 0; b < 10; b++) {
    const x = xCubeta(b);
    const activa = estado.cubetaActiva === b;

    ctx.fillStyle = activa ? "#2a1620" : PALETA.cubetaFondo;
    ctx.fillRect(x, cubetaY, cubetaW, cubetaH);
    ctx.strokeStyle = activa ? PALETA.compararBorde : PALETA.normalBorde;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, cubetaY, cubetaW, cubetaH);

    ctx.fillStyle = activa ? PALETA.compararBorde : PALETA.rangoBorde;
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(b), x + cubetaW / 2, cubetaY - 14);

    const fichas = estado.cubetas[b];
    for (let f = 0; f < fichas.length; f++) {
      const y = cubetaY + 6 + f * fichaH;
      const esNueva = activa && estado.flecha !== null && f === fichas.length - 1;

      ctx.fillStyle = esNueva ? PALETA.compararFondo : PALETA.exitoFondo;
      ctx.fillRect(x + 6, y, fichaW, fichaH - 3);
      ctx.strokeStyle = esNueva ? PALETA.compararBorde : PALETA.exitoBorde;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 6, y, fichaW, fichaH - 3);

      dibujarNumero(
        fichas[f],
        x + cubetaW / 2,
        y + (fichaH - 3) / 2,
        Math.min(15, fichaH - 8),
        esNueva ? PALETA.compararTexto : PALETA.exitoTexto,
        estado.digito,
      );
    }
  }

  // Flecha desde el número que se reparte hasta su cubeta
  if (estado.flecha !== null) {
    const [k, b] = estado.flecha;
    const x1 = xDe(k) + boxW / 2;
    const y1 = mainY + boxH + 2;
    const x2 = xCubeta(b) + cubetaW / 2;
    const y2 = cubetaY - 30;

    ctx.save();
    ctx.strokeStyle = PALETA.compararBorde;
    ctx.fillStyle = PALETA.compararBorde;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
    const angulo = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 10 * Math.cos(angulo - 0.4), y2 - 10 * Math.sin(angulo - 0.4));
    ctx.lineTo(x2 - 10 * Math.cos(angulo + 0.4), y2 - 10 * Math.sin(angulo + 0.4));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
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
  const pasoVisible = registro.querySelector(".actual");
  pasoVisible?.scrollIntoView({ block: "nearest" });
}

function cargar(valores: number[]): void {
  detener();
  pasos = calcularPasos(valores);
  pasoActual = 0;
  barraPasos.max = String(pasos.length - 1);
  actualizarVista();
}

function generar(): void {
  const n = Number(inputNum.value);
  numValor.value = String(n);
  aviso.textContent = "";
  cargar(Array.from({ length: n }, () => Math.floor(Math.random() * 999) + 1));
}

function usarMisNumeros(): void {
  const valores = inputMios.value
    .split(/[\s,;]+/)
    .filter((texto) => texto !== "")
    .map((texto) => Number(texto));

  const validos = valores.length >= 2
    && valores.length <= 16
    && valores.every((v) => Number.isInteger(v) && v >= 0 && v <= 999);

  if (!validos) {
    aviso.textContent = "Escribe entre 2 y 16 números enteros (de 0 a 999) separados por comas.";
    return;
  }

  aviso.textContent = "";
  cargar(valores);
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
  }, 450);
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
btnUsar.onclick = usarMisNumeros;
inputMios.onkeydown = (evento: KeyboardEvent) => {
  if (evento.key === "Enter") usarMisNumeros();
};
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
