const BG = "#ffffff";
const PANEL = "#151515";
const AZUL = "#4da3ff";
const ROJO = "#ff3158";
const AMARILLO = "#ffd166";
const NARANJA = "#ff8f42";
const VERDE = "#63d6a5";
type Paso = {
    arr: number[];
    line: number;
    inicio?: number;
    minimo?: number;
    comp?: number;
    ordenadas: number;
    conteo?: number[];
    minVal?: number;
    maxVal?: number;
};

const CODE = [
    "def counting_sort(lista):",
    "    minimo = min(lista)",
    "    maximo = max(lista)",
    "    conteo = [0] * (maximo - minimo + 1)",
    "    for numero in lista:",
    "        conteo[numero - minimo] += 1",
    "    resultado = []",
    "    for i in range(len(conteo)):",
    "        resultado.extend([i + minimo] * conteo[i])",
    "    return resultado",
];

function generarPasos(datos: number[]): Paso[] {
    const a = [...datos];
    const pasos: Paso[] = [];
    
    const minimo = Math.min(...a);
    const maximo = Math.max(...a);
    const conteo = Array(maximo - minimo + 1).fill(0);
    
    const foto = (line: number, inicio?: number, minVal?: number, comp?: number, ordenadas = 0): void => {
        pasos.push({ arr: [...a], line, inicio, minimo: minVal, comp, ordenadas, conteo: [...conteo], minVal: minimo, maxVal: maximo });
    };
    
    foto(1, minimo, undefined, undefined, 0);
    foto(2, maximo, undefined, undefined, 0);
    foto(3, undefined, undefined, undefined, 0);
    
    // Contar ocurrencias
    a.forEach((numero, indice) => {
        conteo[numero - minimo]++;
        foto(4, indice, numero, numero - minimo, 0);
    });
    
    // Reconstruir el arreglo ordenado con animaciones
    let indiceResultado = 0;
    for (let i = 0; i < conteo.length; i++) {
        const numero = i + minimo;
        for (let j = 0; j < conteo[i]; j++) {
            a[indiceResultado] = numero;
            indiceResultado++;
            foto(9, indiceResultado - 1, numero, i, indiceResultado);
        }
    }
    
    foto(9, undefined, undefined, undefined, a.length);
    return pasos;
}

class Visualizador {
    private paso: number;
    private reproduciendo: boolean;
    private cantidad: number;
    private random: () => number;
    private datos: number[];
    private pasos: Paso[];
    private timer?: number;
    private host: HTMLElement;
    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;
    private status!: HTMLElement;
    private explanation!: HTMLElement;
    private codePanel!: HTMLElement;
    private pasoSlider!: HTMLInputElement;
    private instructionsPanel!: HTMLElement;
    private playButton!: HTMLButtonElement;
    private cantidadSlider!: HTMLInputElement;
    private animationFrame?: number;

    constructor(cantidad = 10, semilla?: number) {
        this.paso = 1;
        this.reproduciendo = false;
        this.cantidad = Math.max(5, Math.min(15, cantidad));
        this.random = this.crearRandom(semilla);
        this.datos = this.nuevosDatos(this.cantidad);
        this.pasos = generarPasos(this.datos);
        this.host = this.crearInterfaz();
    }
    crearInterfaz() {
        const host = document.createElement("main");
        host.className = "selection-layout";
        host.style.cssText = `width:min(1200px,calc(100vw - 40px));height:min(900px,calc(100vh - 40px));margin:0;padding:14px 16px;background:${BG};border:1px solid #ffffff08;border-radius:12px;display:grid;grid-template-columns:minmax(420px,1.7fr) minmax(260px,.85fr);grid-template-rows:auto auto;align-content:start;gap:8px 14px;overflow:hidden;`;
        host.innerHTML = `
          <div style="grid-column:1/3;display:flex;align-items:center;justify-content:space-between;gap:24px">
            <h1 style="margin:0;color:#111;font-size:22px;font-weight:700">Aprende Counting Sort paso a paso</h1>
            <div style="width:290px;display:grid;gap:4px;font-size:13px">
              <div style="display:grid;grid-template-columns:125px 20px 145px;align-items:center">
                <strong style="color:#111">Cantidad de números:</strong>
                <span id="cantidad-valor" style="color:#111;font-weight:700;text-align:right">${this.cantidad}</span>
                <input id="cantidad-slider" type="range" min="5" max="15" value="${this.cantidad}" style="width:145px">
              </div>
              <div style="display:grid;grid-template-columns:125px 20px 145px;align-items:center">
                <strong style="color:#111">Seleccionar paso:</strong>
                <span style="color:#111;font-weight:700;text-align:right"><strong id="paso-num">1</strong></span>
                <input id="paso-slider" type="range" min="1" value="1" style="width:145px">
              </div>
            </div>
          </div>
          <section style="grid-column:1;grid-row:2;min-width:0;min-height:0;display:grid;grid-template-rows:auto auto;align-content:start;gap:8px;overflow:hidden">
            <div style="background:${PANEL};border:1px solid #ffffff18;border-radius:10px;padding:14px 16px 9px;box-shadow:inset 0 0 0 1px #ffffff03;min-height:0;display:flex;flex-direction:column;overflow:hidden">
              <div id="status" style="min-height:24px;color:#fff;font-size:15px;font-weight:500;margin-bottom:8px">Preparando la simulacion</div>
              <canvas id="chart" style="width:100%;height:210px;display:block"></canvas>
              <div style="display:flex;justify-content:center;gap:22px;padding:6px 0 3px;font-size:13px;color:#fff;font-family:'Roboto',Arial,sans-serif">
                <span><b style="color:${AZUL}">■</b> Arreglo Original</span>
                <span><b style="color:${VERDE}">■</b> Arreglo Ordenado</span>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px">
              <button id="nuevo" class="control">Nueva secuencia</button>
              <button id="anterior" class="control">Anterior</button>
              <button id="play" class="control primary">▶ Reproducir</button>
              <button id="siguiente" class="control">Siguiente</button>
            </div>
          </section>
          <aside class="selection-side" style="grid-column:2;grid-row:2;display:grid;grid-template-rows:150px 230px 130px;gap:8px;min-width:0;overflow:hidden">
            <section style="grid-row:1;background:${PANEL};border:1px solid #ffffff18;border-radius:10px;padding:10px 14px;overflow:hidden">
              <h2 style="font-size:16px;margin:0 0 7px;color:#fff">¿Qué hace el algoritmo?</h2>
              <p id="explanation" style="color:#d7cdd1;font-size:12px;line-height:1.35;margin:0"></p>
              <div style="height:1px;background:#ffffff12;margin:8px 0"></div>
              <div style="display:flex;justify-content:space-between;color:#d7cdd1;font-size:12px">
                <span>Comparaciones: <b id="comparaciones" style="color:#fff">0</b></span>
                <span>Intercambios: <b id="intercambios" style="color:#fff">0</b></span>
              </div>
            </section>
            <section style="grid-row:2;background:${PANEL};border:1px solid #ffffff18;border-radius:10px;padding:10px 14px;overflow:hidden">
              <h2 style="font-size:15px;margin:0 0 8px;color:#fff">Código en Python</h2>
              <div id="code" style="height:180px;background:#050505;border-radius:8px;padding:4px 6px;font-family:'Roboto Mono',monospace;font-size:8px;overflow:auto;scrollbar-gutter:stable"></div>
            </section>
            <section style="grid-row:3;background:${PANEL};border:1px solid #ffffff18;border-radius:10px;padding:10px 14px;overflow:hidden">
              <h2 style="font-size:15px;margin:0 0 7px;color:#fff">Instrucciones realizadas</h2>
              <div id="instructions" style="height:90px;overflow-y:auto;color:#d7cdd1;font-size:11px;line-height:1.35"></div>
            </section>
          </aside>`;
        const style = document.createElement("style");
        style.textContent = `.control{border:1px solid #ffffff35;background:#222222;color:#fff;border-radius:7px;padding:9px 14px;cursor:pointer}.control:hover{background:#3a3a3a}.control.primary{background:#63d6a5;border-color:#63d6a5;color:#111;font-weight:700}input[type="range"]{appearance:none;-webkit-appearance:none;height:6px;background:#5c5c5c;border-radius:4px}input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:#bdbdbd;border:2px solid #111;border-radius:50%;cursor:pointer}input[type="range"]::-moz-range-thumb{width:10px;height:10px;background:#bdbdbd;border:2px solid #111;border-radius:50%;cursor:pointer}.numero-unico{background:#ff3158;color:#fff;border-radius:10px;padding:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:700;font-size:16px;min-height:80px;transition:all 0.4s ease;border:2px solid transparent;text-align:center;box-shadow:0 2px 8px rgba(255,49,88,0.25)}.numero-unico .valor{font-size:24px;margin-bottom:4px}.numero-unico .conteo{font-size:12px;color:#ffd166;opacity:0.95;font-weight:600}.numero-unico.completado{background:#63d6a5;border-color:#fff;box-shadow:0 2px 8px rgba(99,214,165,0.25)}.numero-unico:hover{transform:scale(1.08)}@keyframes slideUp{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}`;
        host.append(style);
        this.canvas = host.querySelector<HTMLCanvasElement>("#chart")!;
        this.ctx = this.canvas.getContext("2d")!;
        this.status = host.querySelector<HTMLElement>("#status")!;
        this.explanation = host.querySelector<HTMLElement>("#explanation")!;
        this.codePanel = host.querySelector<HTMLElement>("#code")!;
        this.pasoSlider = host.querySelector<HTMLInputElement>("#paso-slider")!;
        this.instructionsPanel = host.querySelector<HTMLElement>("#instructions")!;
        this.playButton = host.querySelector<HTMLButtonElement>("#play")!;
        host.querySelector<HTMLButtonElement>("#nuevo")!.onclick = () => this.regenerar(this.cantidad);
        host.querySelector<HTMLButtonElement>("#anterior")!.onclick = () => this.irA(this.paso - 1);
        host.querySelector<HTMLButtonElement>("#siguiente")!.onclick = () => this.irA(this.paso + 1);
        this.playButton.onclick = () => this.togglePlay();
        this.cantidadSlider = host.querySelector<HTMLInputElement>("#cantidad-slider")!;
        this.cantidadSlider.oninput = () => this.regenerar(Number(this.cantidadSlider.value));
        this.pasoSlider.oninput = () => this.irA(Number(this.pasoSlider.value));
        return host;
    }
    montar() {
        document.body.style.margin = "0";
        document.body.style.background = BG;
        document.body.append(this.host);
        this.actualizarSliderPasos();
        this.dibujar();
        return this.host;
    }
    crearRandom(semilla?: number): () => number {
        let state = semilla === undefined ? Math.floor(Math.random() * 2147483647) : semilla;
        return () => {
            state = (state * 48271) % 2147483647;
            return (state - 1) / 2147483646;
        };
    }
    nuevosDatos(n: number): number[] {
        const datos = [];
        for (let i = 0; i < n; i++) {
            datos.push(1 + Math.floor(this.random() * 9));
        }
        datos[0] = 4;
        datos[Math.max(1, Math.floor(n / 2))] = 4;
        return datos;
    }
    regenerar(n: number): void {
        this.detener();
        this.cantidad = n;
        this.datos = this.nuevosDatos(n);
        this.pasos = generarPasos(this.datos);
        this.paso = 1;
        document.getElementById("cantidad-valor")!.textContent = String(n);
        this.actualizarSliderPasos();
        this.dibujar();
    }
    iniciarAnimacion(): void {
        this.regenerar(this.cantidad);
        this.reproducir();
    }
    actualizarSliderPasos(): void {
        this.pasoSlider.max = String(this.pasos.length);
        this.pasoSlider.value = String(this.paso);
        document.getElementById("paso-num")!.textContent = String(this.paso);
    }
    irA(paso: number): void {
        this.paso = Math.max(1, Math.min(this.pasos.length, paso));
        this.pasoSlider.value = String(this.paso);
        document.getElementById("paso-num")!.textContent = String(this.paso);
        this.dibujar();
    }
    togglePlay(): void {
        this.reproduciendo ? this.detener() : this.reproducir();
    }
    reproducir(): void {
        if (this.paso >= this.pasos.length)
            this.irA(1);
        this.reproduciendo = true;
        this.playButton.textContent = "Ⅱ Pausar";
        this.timer = window.setInterval(() => {
            if (this.paso >= this.pasos.length)
                this.detener();
            else
                this.irA(this.paso + 1);
        }, 900);
    }
    detener(): void {
        if (this.timer !== undefined)
            window.clearInterval(this.timer);
        this.timer = undefined;
        this.reproduciendo = false;
        this.playButton.textContent = "▶ Reproducir";
    }
    colores(p: Paso): string[] {
        return p.arr.map((_, i) => {
            if (i === p.inicio && (p.line === 4 || p.line === 9))
                return NARANJA;
            if (p.line === 9)
                return VERDE;
            return AZUL;
        });
    }
    dibujar(): void {
        const p = this.pasos[this.paso - 1];
        const estado = p.line === 9 ? "Ordenamiento completado - Arreglo ordenado" :
            p.line === 4 ? `Contando: posición ${p.inicio}, número ${p.minimo}` :
            p.line === 3 ? "Se crea el arreglo auxiliar de conteos" :
            p.line === 2 ? `Máximo encontrado: ${p.inicio}` :
            p.line === 1 ? `Mínimo encontrado: ${p.inicio}` :
            "Preparando Counting Sort";
        this.status.textContent = estado;
        const conteos = this.pasos.slice(0, this.paso).filter(x => x.line === 4).length;
        const ordenados = this.pasos[this.paso - 1].ordenadas || 0;
        document.getElementById("comparaciones")!.textContent = String(conteos);
        document.getElementById("intercambios")!.textContent = String(ordenados);
        this.explanation.textContent = "Counting Sort organiza los números creando un arreglo de conteos. Primero busca el mínimo y máximo, luego cuenta las ocurrencias de cada número y finalmente reconstruye el arreglo ordenado.";
        this.dibujar2D(p);
        this.dibujarCodigo(p.line);
        this.dibujarInstrucciones();
    }
    dibujarInstrucciones(): void {
        const instrucciones = this.pasos.slice(0, this.paso).map((paso, indice) => {
            let texto;
            switch (paso.line) {
                case 1: texto = "Se identifica el número mínimo."; break;
                case 2: texto = "Se identifica el número máximo."; break;
                case 3: texto = "Se crea el arreglo auxiliar de conteos."; break;
                case 4: texto = `Se registra una repetición en la posición ${paso.inicio}.`; break;
                case 9: texto = "Se terminó de recorrer el arreglo."; break;
                default: texto = "Se recorre el arreglo.";
            }
            return `<div style="border-bottom:1px solid #ffffff10;padding:6px 0"><span style="color:#ff91a2">${indice + 1}.</span> ${texto}</div>`;
        });
        const inicio = Math.max(0, instrucciones.length - 12);
        this.instructionsPanel.innerHTML = instrucciones.slice(inicio).join("");
        this.instructionsPanel.scrollTop = this.instructionsPanel.scrollHeight;
    }
    dibujar2D(p: Paso): void {
        const ctx = this.ctx;
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = 210;
        if (this.canvas.width !== width) this.canvas.width = width;
        if (this.canvas.height !== height) this.canvas.height = height;
        if (this.animationFrame !== undefined)
            cancelAnimationFrame(this.animationFrame);

        const conteo = p.conteo || [];
        const minimo = p.minVal ?? 0;
        const rango = conteo.length;
        const separacionArreglo = p.arr.length === 15 ? 7 : 8;
        const tamanoArreglo = Math.min(34, Math.floor((width - 80 - separacionArreglo * (p.arr.length - 1)) / p.arr.length));
        const anchoArreglo = tamanoArreglo * p.arr.length + separacionArreglo * (p.arr.length - 1);
        const inicioArreglo = (width - anchoArreglo) / 2;
        const yArreglo = 24;
        const separacionConteo = 5;
        const anchoConteo = Math.max(14, Math.min(48, Math.floor((width - 48 - separacionConteo * (rango - 1)) / rango)));
        const altoConteo = 42;
        const anchoTotalConteo = anchoConteo * rango + separacionConteo * (rango - 1);
        const inicioConteo = (width - anchoTotalConteo) / 2;
        const yConteo = height - altoConteo - 8;
        const duracion = 760;
        let inicioAnimacion: number | undefined;

        const dibujarTarjeta = (x: number, y: number, ancho: number, alto: number, valor: number, color: string, fuente: number): void => {
            ctx.shadowColor = "rgba(0,0,0,.35)";
            ctx.shadowBlur = 7;
            ctx.shadowOffsetY = 3;
            ctx.fillStyle = color;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x, y, ancho, alto, 8);
            ctx.fill();
            ctx.stroke();
            ctx.shadowColor = "transparent";
            ctx.fillStyle = "#fff";
            ctx.font = `700 ${fuente}px Roboto, Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(valor), x + ancho / 2, y + alto / 2);
        };

        const render = (tiempo: number): void => {
            if (inicioAnimacion === undefined) inicioAnimacion = tiempo;
            const progreso = Math.min((tiempo - inicioAnimacion) / duracion, 1);
            const suave = progreso * progreso * (3 - 2 * progreso);
            ctx.fillStyle = PANEL;
            ctx.fillRect(0, 0, width, height);

            const movimientoSalida = p.line === 9 && p.inicio !== undefined;
            p.arr.forEach((valor, indice) => {
                if (movimientoSalida && indice === p.inicio && progreso < 1) return;
                let color = AZUL;
                if (p.line === 4 && indice === p.inicio) color = NARANJA;
                if (p.line === 9 && (p.inicio === undefined || indice < (progreso < 1 ? p.ordenadas - 1 : p.ordenadas))) color = VERDE;
                const x = inicioArreglo + indice * (tamanoArreglo + separacionArreglo);
                dibujarTarjeta(x, yArreglo, tamanoArreglo, tamanoArreglo, valor, color, 18);
                ctx.fillStyle = "#bbaeb3";
                ctx.font = "12px Arial";
                ctx.fillText(String(indice), x + tamanoArreglo / 2, yArreglo + tamanoArreglo + 15);
            });

            ctx.fillStyle = "#d7cdd1";
            ctx.font = "12px Roboto, Arial";
            ctx.textAlign = "left";
            ctx.fillText("Conteo por número", 12, yConteo - 15);
            for (let indice = 0; indice < rango; indice++) {
                const valor = minimo + indice;
                const x = inicioConteo + indice * (anchoConteo + separacionConteo);
                const total = conteo[indice] || 0;
                let emitidos = 0;
                if (p.line === 9) {
                    const completados = Math.max(0, p.ordenadas - (progreso < 1 && p.inicio !== undefined ? 1 : 0));
                    emitidos = p.arr.slice(0, completados).filter((numero) => numero === valor).length;
                }
                const mostrar = Math.max(0, total - emitidos -
                    (p.line === 4 && p.minimo === valor && progreso < 1 ? 1 : 0));
                dibujarTarjeta(x, yConteo, anchoConteo, altoConteo, valor, mostrar > 0 ? VERDE : "#333333", Math.min(16, anchoConteo / 2));
                ctx.fillStyle = AMARILLO;
                ctx.font = "700 11px Roboto, Arial";
                ctx.textAlign = "center";
                ctx.fillText(`×${mostrar}`, x + anchoConteo / 2, yConteo + altoConteo - 7);
            }

            const movimientoConteo = p.line === 4 && p.inicio !== undefined && rango > 0;
            if (movimientoConteo || movimientoSalida) {
                const valor = p.minimo ?? 0;
                const indiceConteo = valor - minimo;
                const origenX = movimientoConteo
                    ? inicioArreglo + p.inicio! * (tamanoArreglo + separacionArreglo)
                    : inicioConteo + indiceConteo * (anchoConteo + separacionConteo) + (anchoConteo - tamanoArreglo) / 2;
                const origenY = movimientoConteo ? yArreglo : yConteo + (altoConteo - tamanoArreglo) / 2;
                const destinoX = movimientoConteo
                    ? inicioConteo + indiceConteo * (anchoConteo + separacionConteo) + (anchoConteo - tamanoArreglo) / 2
                    : inicioArreglo + p.inicio! * (tamanoArreglo + separacionArreglo);
                const destinoY = movimientoConteo ? yConteo + (altoConteo - tamanoArreglo) / 2 : yArreglo;
                const x = origenX + (destinoX - origenX) * suave;
                const y = origenY + (destinoY - origenY) * suave;
                dibujarTarjeta(x, y, tamanoArreglo, tamanoArreglo, valor, NARANJA, 18);
            }

            if (progreso < 1)
                this.animationFrame = requestAnimationFrame(render);
            else
                this.animationFrame = undefined;
        };
        this.animationFrame = requestAnimationFrame(render);
    }
    dibujarCodigo(lineaActiva: number): void {
        this.codePanel.replaceChildren();
        const valores = document.createElement("div");
        valores.style.cssText = "height:18px;line-height:18px;padding:0 2px;white-space:nowrap;overflow:hidden;color:#ff91a2;font-size:8px;font-family:'Roboto Mono',monospace";
        valores.textContent = `lista = [${this.pasos[0].arr.join(", ")}]`;
        this.codePanel.append(valores);
        CODE.forEach((text, i) => {
            const activa = i + 1 === lineaActiva;
            const row = document.createElement("div");
            row.style.cssText = `height:18px;line-height:18px;padding:0 2px;white-space:pre;width:max-content;min-width:100%;color:${activa ? "#fff" : "#d6dcff"};border-radius:2px;font-size:8px`;
            if (activa)
                row.style.background = "#ff3158";
            const numero = document.createElement("span");
            numero.textContent = `${String(i + 1).padStart(2, " ")}  `;
            numero.style.color = activa ? "#fff" : "#555555";
            row.append(numero);
            text.split(/(\b(?:def|for|in|if|return|range|len)\b|\b\d+\b)/).forEach((token) => {
                const span = document.createElement("span");
                span.textContent = token;
                if (!activa) {
                    if (/^(def|for|in|if|return)$/.test(token))
                            span.style.color = activa ? "#fff" : "#7aa2f7";
                    else if (/^(range|len|selection_sort)$/.test(token))
                            span.style.color = activa ? "#fff" : "#e0af68";
                    else if (/^\d+$/.test(token))
                            span.style.color = activa ? "#fff" : "#ff9e64";
                }
                row.append(span);
            });
            this.codePanel.append(row);
        });
    }
}
function iniciar(cantidad = 15, semilla?: number): HTMLElement {
    return new Visualizador(cantidad, semilla).montar();
}

export {};
