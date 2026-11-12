/**
 * Visualizador 2D de Ordenamiento por Seleccion.
 * Equivalente en TypeScript del programa original en Python.
 */

type Step = {
  arr: number[];
  line: number;
  inicio?: number;
  minimo?: number;
  comp?: number;
  ordenadas: number;
};

const BG = "#ffffff";
const AZUL = "#1e88ff";
const ROJO = "#ff1a1a";
const AMARILLO = "#ffd600";
const NARANJA = "#ff9800";
const VERDE = "#43a047";
const RESALTADO = "#e6b800";
const CODE_KEYWORD = "#7aa2f7";
const CODE_FUNCTION = "#e0af68";
const CODE_NUMBER = "#ff9e64";
const CODE_TEXT = "#d6dcff";

const CODE = [
  "def selection_sort(lista):",
  "    for inicio in range(len(lista) - 1):",
  "        minimo = inicio",
  "        for comparando in range(inicio + 1, len(lista)):",
  "            if lista[comparando] < lista[minimo]:",
  "                minimo = comparando",
  "        lista[inicio], lista[minimo] = lista[minimo], lista[inicio]",
  "    return lista",
];

function generarPasos(datos: number[]): Step[] {
  const a = [...datos];
  const pasos: Step[] = [];
  const foto = (
    line: number,
    inicio?: number,
    minimo?: number,
    comp?: number,
    ordenadas = 0,
  ) => pasos.push({ arr: [...a], line, inicio, minimo, comp, ordenadas });

  for (let inicio = 0; inicio < a.length - 1; inicio++) {
    foto(1, inicio, undefined, undefined, inicio);
    let minimo = inicio;
    foto(2, inicio, minimo, undefined, inicio);
    for (let comp = inicio + 1; comp < a.length; comp++) {
      foto(3, inicio, minimo, comp, inicio);
      foto(4, inicio, minimo, comp, inicio);
      if (a[comp] < a[minimo]) {
        minimo = comp;
        foto(5, inicio, minimo, comp, inicio);
      }
    }
    [a[inicio], a[minimo]] = [a[minimo], a[inicio]];
    foto(6, inicio, minimo, undefined, inicio + 1);
  }
  foto(7, undefined, undefined, undefined, a.length);
  return pasos;
}

function randomInt(min: number, max: number, random: () => number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

class Visualizador {
  private cantidad: number;
  private random: () => number;
  private datos: number[];
  private pasos: Step[];
  private paso = 1;
  private reproduciendo = false;
  private timer?: number;

  private readonly host: HTMLElement;
  private readonly title: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly codePanel: HTMLElement;
  private readonly cantidadSlider: HTMLInputElement;
  private readonly pasoSlider: HTMLInputElement;
  private readonly playButton: HTMLButtonElement;

  constructor(cantidad = 15, semilla?: number) {
    this.cantidad = Math.max(5, Math.min(15, cantidad));
    this.random = this.crearRandom(semilla);
    this.datos = this.nuevosDatos(this.cantidad);
    this.pasos = generarPasos(this.datos);
    this.host = document.createElement("div");
    this.host.style.cssText = `width:min(1200px,100vw);height:min(680px,100vh);margin:auto;background:${BG};color:#111;font-family:"Roboto",Arial,sans-serif;padding:12px;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,55%) minmax(540px,45%);grid-template-rows:44px 54px minmax(0,1fr) 30px;overflow:hidden`;

    this.title = document.createElement("h1");
    this.title.style.cssText = "grid-column:1/3;text-align:center;margin:0;font-size:18px;font-weight:normal";
    this.host.append(this.title);

    const chartBox = document.createElement("div");
    chartBox.style.border = `1px solid #333`;
    chartBox.style.gridRow = "3";
    chartBox.style.gridColumn = "1";
    this.canvas = document.createElement("canvas");
    this.canvas.width = 900;
    this.canvas.height = 560;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    chartBox.append(this.canvas);
    this.ctx = this.canvas.getContext("2d")!;
    this.host.append(chartBox);

    this.codePanel = document.createElement("div");
    this.codePanel.style.cssText = "background:black;margin-left:8px;padding:18px 12px;font-family:monospace;font-size:11px;overflow:hidden";
    this.codePanel.style.gridRow = "3";
    this.codePanel.style.gridColumn = "2";
    this.host.append(this.codePanel);

    const controls = document.createElement("div");
    controls.style.cssText = "grid-column:2;align-self:end;height:78px;padding:8px;margin-left:8px;background:#222;border-top:1px solid #555;z-index:2;display:grid;grid-template-columns:1fr;gap:8px";
    controls.style.gridRow = "3";
    const cantidadLabel = document.createElement("label");
    cantidadLabel.innerHTML = `Cantidad: <strong id="cantidad-valor">${this.cantidad}</strong>`;
    this.cantidadSlider = document.createElement("input");
    this.cantidadSlider.type = "range";
    this.cantidadSlider.min = "5";
    this.cantidadSlider.max = "15";
    this.cantidadSlider.step = "1";
    this.cantidadSlider.value = String(this.cantidad);
    cantidadLabel.append(this.cantidadSlider);
    controls.append(cantidadLabel);

    const pasoLabel = document.createElement("label");
    pasoLabel.innerHTML = `Paso: <strong id="paso-valor">1</strong> / <span id="paso-total">${this.pasos.length}</span>`;
    this.pasoSlider = document.createElement("input");
    this.pasoSlider.type = "range";
    this.pasoSlider.min = "1";
    this.pasoSlider.step = "1";
    this.pasoSlider.value = "1";
    pasoLabel.append(this.pasoSlider);
    controls.append(pasoLabel);
    this.host.append(controls);

    const buttons = document.createElement("div");
    buttons.style.cssText = "grid-column:1/3;grid-row:2;display:flex;justify-content:center;align-items:start;gap:10px;padding-top:0";
    const addButton = (text: string, action: () => void) => {
      const button = document.createElement("button");
      button.textContent = text;
      button.style.cssText = "background:#70b7ff;color:#102b46;border:0;border-radius:999px;padding:10px 18px;font-family:'Roboto',Arial,sans-serif;font-weight:500;cursor:pointer;box-shadow:0 2px 5px rgba(0,0,0,.25)";
      button.onclick = action;
      buttons.append(button);
    };
    addButton("Usar 5", () => this.regenerar(5));
    addButton("Usar 15", () => this.regenerar(15));
    addButton("Iniciar Animacion", () => this.iniciarAnimacion());
    addButton("Anterior", () => this.irA(this.paso - 1));
    addButton("Siguiente", () => this.irA(this.paso + 1));
    this.playButton = document.createElement("button");
    this.playButton.textContent = "Reproducir";
    this.playButton.style.cssText = "background:#63d6a5;color:#111;border:0;border-radius:999px;padding:10px 18px;font-family:'Roboto',Arial,sans-serif;font-weight:500;cursor:pointer;box-shadow:0 2px 5px rgba(0,0,0,.25)";
    this.playButton.onclick = () => this.togglePlay();
    buttons.append(this.playButton);
    this.host.append(buttons);

    const legend = document.createElement("div");
    legend.style.cssText = "grid-column:1/3;grid-row:4;display:flex;justify-content:center;align-items:center;gap:24px;font-size:13px";
    [[ROJO, "inicio"], [NARANJA, "comparando"], [AMARILLO, "minimo"], [VERDE, "ordenado"]]
      .forEach(([color, text]) => {
        const item = document.createElement("span");
        item.innerHTML = `<b style="color:${color}">■</b> ${text}`;
        legend.append(item);
      });
    this.host.append(legend);

    this.cantidadSlider.oninput = () => {
      const cantidad = Number(this.cantidadSlider.value);
      document.getElementById("cantidad-valor")!.textContent = String(cantidad);
      this.regenerar(cantidad);
    };
    this.pasoSlider.oninput = () => this.irA(Number(this.pasoSlider.value));
  }

  montar(): HTMLElement {
    document.body.style.margin = "0";
    document.body.style.background = BG;
    document.body.append(this.host);
    this.actualizarSliderPasos();
    this.dibujar();
    return this.host;
  }

  private crearRandom(semilla?: number): () => number {
    let state = semilla === undefined ? Math.floor(Math.random() * 2147483647) : semilla;
    return () => {
      state = (state * 48271) % 2147483647;
      return (state - 1) / 2147483646;
    };
  }

  private nuevosDatos(n: number): number[] {
    const pool = Array.from({ length: 18 }, (_, i) => i + 3);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(this.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, n);
  }

  private regenerar(n: number): void {
    this.detener();
    this.cantidad = n;
    this.datos = this.nuevosDatos(n);
    this.pasos = generarPasos(this.datos);
    this.paso = 1;
    this.cantidadSlider.value = String(n);
    document.getElementById("cantidad-valor")!.textContent = String(n);
    this.actualizarSliderPasos();
    this.dibujar();
  }

  private iniciarAnimacion(): void {
    this.regenerar(this.cantidad);
    this.reproducir();
  }

  private actualizarSliderPasos(): void {
    this.pasoSlider.max = String(this.pasos.length);
    this.pasoSlider.value = String(this.paso);
    document.getElementById("paso-valor")!.textContent = String(this.paso);
    document.getElementById("paso-total")!.textContent = String(this.pasos.length);
  }

  private irA(paso: number): void {
    this.paso = Math.max(1, Math.min(this.pasos.length, paso));
    this.pasoSlider.value = String(this.paso);
    document.getElementById("paso-valor")!.textContent = String(this.paso);
    this.dibujar();
  }

  private togglePlay(): void {
    this.reproduciendo ? this.detener() : this.reproducir();
  }

  private reproducir(): void {
    if (this.paso >= this.pasos.length) this.irA(1);
    this.reproduciendo = true;
    this.playButton.textContent = "Pausar";
    this.timer = window.setInterval(() => {
      if (this.paso >= this.pasos.length) this.detener();
      else this.irA(this.paso + 1);
    }, 180);
  }

  private detener(): void {
    if (this.timer !== undefined) window.clearInterval(this.timer);
    this.timer = undefined;
    this.reproduciendo = false;
    this.playButton.textContent = "Reproducir";
  }

  private colores(p: Step): string[] {
    return p.arr.map((_, i) => {
      let color = AZUL;
      if (i < p.ordenadas) color = VERDE;
      if (i === p.comp) color = NARANJA;
      if (i === p.minimo) color = AMARILLO;
      if (i === p.inicio) color = ROJO;
      return color;
    });
  }

  private dibujar(): void {
    const p = this.pasos[this.paso - 1];
    this.title.textContent = `Paso ${this.paso}/${this.pasos.length} - Ordenamiento por Selección`;
    this.dibujar2D(p);
    this.dibujarCodigo(p.line);
  }

  private dibujar2D(p: Step): void {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, width, height);

    const colors = this.colores(p);
    const chartLeft = 55;
    const chartRight = width - 35;
    const chartTop = 55;
    const baseY = height - 75;
    const chartHeight = baseY - chartTop;
    const maxValue = Math.max(...p.arr, 20);
    const scale = (chartHeight - 18) / maxValue;

    ctx.strokeStyle = "#454545";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#bdbdbd";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let value = 0; value <= maxValue; value += 5) {
      const y = baseY - value * scale;
      ctx.beginPath();
      ctx.moveTo(chartLeft, y);
      ctx.lineTo(chartRight, y);
      ctx.stroke();
      ctx.fillText(String(value), chartLeft - 12, y);
    }

    ctx.strokeStyle = "#777";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(chartLeft, baseY);
    ctx.lineTo(chartRight, baseY);
    ctx.stroke();

    const availableWidth = chartRight - chartLeft;
    const gap = 12;
    const barWidth = Math.min(46, (availableWidth - gap * (p.arr.length - 1)) / p.arr.length);
    const totalWidth = barWidth * p.arr.length + gap * (p.arr.length - 1);
    const startX = chartLeft + (availableWidth - totalWidth) / 2;

    p.arr.forEach((value, i) => {
      const x = startX + i * (barWidth + gap);
      const barHeight = value * scale;

      ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = colors[i];
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, baseY - barHeight, barWidth, barHeight, [8, 8, 0, 0]);
      ctx.fill();
      ctx.stroke();
      ctx.shadowColor = "transparent";

      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(String(value), x + barWidth / 2, baseY - barHeight - 22);

      ctx.fillStyle = "#aaaaaa";
      ctx.font = "12px Arial";
      ctx.fillText(String(i), x + barWidth / 2, baseY + 25);
    });
  }

  private dibujarCodigo(lineaActiva: number): void {
    this.codePanel.replaceChildren();
    CODE.forEach((text, i) => {
      const row = document.createElement("div");
      row.style.cssText = `height:31px;line-height:31px;padding:0 8px;white-space:pre;width:max-content;max-width:100%;color:${i === lineaActiva ? "#1a1a1a" : CODE_TEXT};border-radius:6px;font-family:'Roboto Mono','Roboto',monospace`;
      if (i === lineaActiva) row.style.background = RESALTADO;
      const numero = document.createElement("span");
      numero.textContent = `${String(i + 1).padStart(2, " ")}  `;
      numero.style.color = i === lineaActiva ? "#1a1a1a" : "#555555";
      row.append(numero);

      text.split(/(\b(?:def|for|in|if|return|range|len)\b|\b\d+\b)/).forEach((token) => {
        const span = document.createElement("span");
        span.textContent = token;
        if (i !== lineaActiva) {
          if (/^(def|for|in|if|return)$/.test(token)) span.style.color = CODE_KEYWORD;
          else if (/^(range|len|selection_sort)$/.test(token)) span.style.color = CODE_FUNCTION;
          else if (/^\d+$/.test(token)) span.style.color = CODE_NUMBER;
        }
        row.append(span);
      });
      this.codePanel.append(row);
    });
  }
}

export function iniciar(cantidad = 15, semilla?: number): HTMLElement {
  return new Visualizador(cantidad, semilla).montar();
}
