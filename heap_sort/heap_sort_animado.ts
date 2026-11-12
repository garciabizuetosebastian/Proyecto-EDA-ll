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
    comp?: number[];
    ordenadas: number;
    tamano?: number;
};

const CODE = [
    "def heap_sort(lista):",
    "    n = len(lista)",
    "    for inicio in range(n // 2 - 1, -1, -1):",
    "        convertir_en_monton(lista, n, inicio)",
    "    for final in range(n - 1, 0, -1):",
    "        lista[0], lista[final] = lista[final], lista[0]",
    "        convertir_en_monton(lista, final, 0)",
    "    return lista",
];

function generarPasos(datos: number[]): Paso[] {
    const a = [...datos];
    const pasos: Paso[] = [];
    const foto = (line: number, inicio?: number, minimo?: number, comp?: number[], ordenadas = 0, tamano = a.length): void => {
        pasos.push({ arr: [...a], line, inicio, minimo, comp, ordenadas, tamano });
    };
    const heapify = (tamano: number, raiz: number, ordenadas: number): void => {
        foto(3, raiz, undefined, undefined, ordenadas, tamano);
        let mayor = raiz;
        const izquierda = 2 * raiz + 1;
        const derecha = 2 * raiz + 2;
        if (izquierda < tamano) {
            foto(4, raiz, mayor, [raiz, izquierda], ordenadas, tamano);
            if (a[izquierda] > a[mayor]) mayor = izquierda;
        }
        if (derecha < tamano) {
            foto(4, raiz, mayor, [raiz, derecha], ordenadas, tamano);
            if (a[derecha] > a[mayor]) mayor = derecha;
        }
        if (mayor !== raiz) {
            [a[raiz], a[mayor]] = [a[mayor], a[raiz]];
            foto(5, raiz, mayor, undefined, ordenadas, tamano);
            heapify(tamano, mayor, ordenadas);
        }
    };
    for (let raiz = Math.floor(a.length / 2) - 1; raiz >= 0; raiz--) {
        foto(2, raiz, undefined, undefined, 0);
        heapify(a.length, raiz, 0);
    }
    for (let final = a.length - 1; final > 0; final--) {
        [a[0], a[final]] = [a[final], a[0]];
        foto(6, 0, final, undefined, a.length - final);
        heapify(final, 0, a.length - final);
    }
    foto(7, undefined, undefined, undefined, a.length);
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
        host.style.cssText = `width:min(980px,calc(100vw - 40px));height:min(680px,calc(100vh - 40px));margin:0;padding:14px 16px;background:${BG};border:1px solid #ffffff08;border-radius:12px;display:grid;grid-template-columns:minmax(420px,1.7fr) minmax(260px,.85fr);grid-template-rows:auto minmax(0,1fr);gap:8px 14px;overflow:hidden;`;
        host.innerHTML = `
          <div style="grid-column:1/3;display:flex;align-items:center;justify-content:space-between;gap:24px">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700">Aprende Heap Sort paso a paso</h1>
            <div style="width:290px;display:grid;gap:4px;font-size:13px">
              <div style="display:grid;grid-template-columns:125px 20px 145px;align-items:center">
                <strong>Cantidad de números:</strong>
                <span id="cantidad-valor" style="color:#ffffff;font-weight:700;text-align:right">${this.cantidad}</span>
                <input id="cantidad-slider" type="range" min="5" max="15" value="${this.cantidad}" style="width:145px;accent-color:#bdbdbd">
              </div>
              <div style="display:grid;grid-template-columns:125px 20px 145px;align-items:center">
                <strong>Seleccionar paso:</strong>
                <span style="color:#ffffff;font-weight:700;text-align:right"><strong id="paso-num">1</strong></span>
                <input id="paso-slider" type="range" min="1" value="1" style="width:145px;accent-color:#bdbdbd">
              </div>
            </div>
          </div>
          <section style="grid-column:1;grid-row:2;min-width:0">
            <div style="background:${PANEL};border:1px solid #ffffff18;border-radius:10px;padding:14px 16px 9px;box-shadow:inset 0 0 0 1px #ffffff03">
              <div id="status" style="min-height:24px;color:#ffffff;font-size:15px;font-weight:500;margin-bottom:8px">Preparando la simulacion</div>
              <div id="chart-scroll" style="height:390px;overflow:hidden;background:${PANEL};border-radius:8px">
                <canvas id="chart" style="width:100%;height:620px;display:block"></canvas>
              </div>
              <div style="display:flex;justify-content:center;gap:22px;padding:6px 0 3px;font-size:13px;color:#fff;background:transparent;font-family:'Roboto',Arial,sans-serif">
                <span><b style="color:${ROJO}">■</b> raíz/inicio</span>
                <span><b style="color:${AZUL}">■</b> padre e hijo comparados</span>
                <span><b style="color:${AMARILLO}">■</b> mayor actual</span>
                <span><b style="color:${VERDE}">■</b> ordenado</span>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px">
              <button id="nuevo" class="control">Nueva secuencia</button>
              <button id="anterior" class="control">Anterior</button>
              <button id="play" class="control primary">▶ Reproducir</button>
              <button id="siguiente" class="control">Siguiente</button>
            </div>
          </section>
          <aside class="selection-side" style="grid-column:2;grid-row:2;display:grid;grid-template-rows:150px 210px 130px;gap:8px;min-width:0;overflow:hidden">
            <section style="grid-row:1;background:${PANEL};border:1px solid #ffffff18;border-radius:10px;padding:10px 14px;overflow:hidden">
              <h2 style="font-size:16px;margin:0 0 7px">¿Qué hace el algoritmo?</h2>
              <p id="explanation" style="color:#bdbdbd;font-size:12px;line-height:1.35;margin:0"></p>
              <div style="height:1px;background:#ffffff12;margin:8px 0"></div>
              <div style="display:flex;justify-content:space-between;color:#bdbdbd;font-size:12px">
                <span>Comparaciones: <b id="comparaciones" style="color:#fff">0</b></span>
                <span>Intercambios: <b id="intercambios" style="color:#fff">0</b></span>
              </div>
              <div style="margin-top:5px;color:#bdbdbd;font-size:12px">
                Veces que se divide el montón: <b id="particiones" style="color:#ffd166">0</b>
              </div>
            </section>
            <section style="grid-row:2;background:${PANEL};border:1px solid #ffffff18;border-radius:10px;padding:10px 14px;overflow:hidden">
              <h2 style="font-size:15px;margin:0 0 8px">Código en Python</h2>
              <div id="code" style="height:152px;background:#050505;border-radius:8px;padding:4px 6px;font-family:'Roboto Mono',monospace;font-size:7px;overflow-y:auto;overflow-x:hidden;scrollbar-gutter:stable"></div>
            </section>
            <section style="grid-row:3;background:${PANEL};border:1px solid #ffffff18;border-radius:10px;padding:10px 14px;overflow:hidden">
              <h2 style="font-size:15px;margin:0 0 7px">Instrucciones realizadas</h2>
              <div id="instructions" style="height:90px;overflow-y:scroll;color:#bdbdbd;font-size:11px;line-height:1.35;scrollbar-gutter:stable"></div>
            </section>
          </aside>`;
        const style = document.createElement("style");
        style.textContent = `.control{border:1px solid #ffffff35;background:#222;color:#fff;border-radius:7px;padding:9px 14px;cursor:pointer}.control:hover{background:#3a3a3a}.control.primary{background:#63d6a5;border-color:#63d6a5;color:#111;font-weight:700}input[type="range"]{appearance:none;-webkit-appearance:none;height:6px;background:#8f8f8f;border-radius:4px}input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:#8f8f8f;border:2px solid #111;border-radius:50%;cursor:pointer}input[type="range"]::-moz-range-thumb{width:10px;height:10px;background:#8f8f8f;border:2px solid #111;border-radius:50%;cursor:pointer}`;
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
        this.cantidadSlider.oninput = () => {
            this.actualizarRango(this.cantidadSlider);
            this.regenerar(Number(this.cantidadSlider.value));
        };
        this.pasoSlider.oninput = () => {
            this.actualizarRango(this.pasoSlider);
            this.irA(Number(this.pasoSlider.value));
        };
        return host;
    }
    montar(): HTMLElement {
        document.body.style.margin = "0";
        document.body.style.background = BG;
        document.body.append(this.host);
        this.actualizarSliderPasos();
        this.actualizarRango(this.cantidadSlider);
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
        const pool = Array.from({ length: 30 }, (_, i) => i + 3);
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(this.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        return pool.slice(0, n);
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
        this.actualizarRango(this.pasoSlider);
    }
    actualizarRango(slider: HTMLInputElement): void {
        const minimo = Number(slider.min || 0);
        const maximo = Number(slider.max || 100);
        const avance = maximo === minimo ? 0 : ((Number(slider.value) - minimo) / (maximo - minimo)) * 100;
        slider.style.background = `linear-gradient(to right, #d0d0d0 0%, #d0d0d0 ${avance}%, #5c5c5c ${avance}%, #5c5c5c 100%)`;
    }
    irA(paso: number): void {
        this.paso = Math.max(1, Math.min(this.pasos.length, paso));
        this.pasoSlider.value = String(this.paso);
        document.getElementById("paso-num")!.textContent = String(this.paso);
        this.actualizarRango(this.pasoSlider);
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
        }, 180);
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
            let color = ROJO;
            if (i >= p.arr.length - p.ordenadas)
                color = VERDE;
            if (Array.isArray(p.comp) && p.comp.includes(i))
                color = AZUL;
            if (i === p.minimo)
                color = AMARILLO;
            if (i === p.inicio)
                color = ROJO;
            return color;
        });
    }
    descripcionMovimiento(p: Paso): string {
        if (p.line === 2)
            return `Se divide el arreglo desde la posición ${p.inicio}`;
        if (p.line === 3)
            return `Se ajusta el subárbol que comienza en la posición ${p.inicio}`;
        if (p.line === 4 && Array.isArray(p.comp))
            return `Comparación: posiciones ${p.comp.join(" y ")}`;
        if (p.line === 5)
            return `El mayor sube desde la posición ${p.minimo} hacia el padre ${p.inicio}`;
        if (p.line === 6)
            return "Se mueve la raíz al final y se reduce el montón";
        return "Movimiento del montón";
    }
    dibujar(): void {
        const p = this.pasos[this.paso - 1];
        const estado = p.line === 7 ? "Secuencia ordenada" :
            p.line === 6 ? `Se mueve la raíz y el elemento ${p.arr[p.minimo ?? 0]} queda definido` :
            p.line === 5 ? "Se intercambian nodos para conservar la propiedad de montón" :
            p.line === 4 ? "Se comparan exactamente padre e hijo, luego se elige el mayor actual" :
            p.line === 3 ? `Se convierte en montón desde la posición ${p.inicio}` :
            "Construyendo el montón inicial";
        this.status.textContent = estado;
        const vistos = this.pasos.slice(0, this.paso).filter(x => x.line === 4).length;
        const intercambios = this.pasos.slice(0, this.paso).filter(x => x.line === 5 || x.line === 6).length;
        const particiones = this.pasos.slice(0, this.paso).filter(x => x.line === 3).length;
        document.getElementById("comparaciones")!.textContent = String(vistos);
        document.getElementById("intercambios")!.textContent = String(intercambios);
        document.getElementById("particiones")!.textContent = String(particiones);
        this.explanation.textContent = p.line === 7 ?
            "Todos los números quedaron ordenados de menor a mayor. Heap Sort extrae primero los mayores y los coloca al final." :
            p.line === 4 ?
            "Se compara padre con hijo y se elige el mayor. Si el hijo es mayor, ese valor sube al lugar del padre." :
            p.line === 3 ?
            "El arreglo se divide para encontrar primero los padres de la mitad inferior. Cada subárbol se convierte en montón máximo." :
            "Se divide el arreglo por la mitad y se comienza desde sus últimos padres para construir el árbol de abajo hacia arriba.";
        this.dibujar2D(p);
        this.dibujarCodigo(p.line);
        this.dibujarInstrucciones();
    }
    dibujarInstrucciones(): void {
        const instrucciones = this.pasos.slice(0, this.paso).map((paso, indice) => {
            let texto;
            switch (paso.line) {
                case 1: texto = "Se inicia la construcción del montón."; break;
                case 2: texto = `Se procesa el nodo de la posición ${paso.inicio}.`; break;
                case 3: texto = `Se ajusta el montón desde la posición ${paso.inicio}.`; break;
                case 4: texto = "Se comparan exactamente dos posiciones: padre con un hijo. Se marca el mayor actual."; break;
                case 5: texto = "Como corresponde, se decide el mayor y se intercambia con la raíz."; break;
                case 6: texto = "Se coloca la raíz mayor al final de la zona ordenada."; break;
                default: texto = "La secuencia ya quedó ordenada.";
            }
            return `<div style="border-bottom:1px solid #ffffff10;padding:6px 0"><span style="color:#ffffff">${indice + 1}.</span> ${texto}</div>`;
        });
        this.instructionsPanel.innerHTML = instrucciones.join("");
    }
    dibujar2D(p: Paso): void {
        const ctx = this.ctx;
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = 390;
        if (this.canvas.width !== width) this.canvas.width = width;
        if (this.canvas.height !== height) this.canvas.height = height;
        this.canvas.style.height = `${height}px`;
        ctx.fillStyle = PANEL;
        ctx.fillRect(0, 0, width, height);
        const colors = this.colores(p);
        const cantidad = p.arr.length;
        const cardSize = cantidad <= 10 ? 34 : 29;
        const cardWidth = cardSize;
        const cardHeight = cardSize;
        const gap = cantidad === 15 ? 3 : 4;
        const arrayWidth = cardWidth * cantidad + gap * (cantidad - 1);
        const arrayX = Math.max(20, (width - arrayWidth) / 2);

        ctx.fillStyle = "#bdbdbd";
        ctx.font = "700 11px Roboto, Arial";
        ctx.textAlign = "left";
        ctx.fillText("Arreglo", 12, 15);
        p.arr.forEach((value, i) => {
            const x = arrayX + i * (cardWidth + gap);
            const y = 24;
            ctx.fillStyle = colors[i];
            ctx.strokeStyle = "#111";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x, y, cardWidth, cardHeight, 7);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#fff";
            ctx.font = "700 16px Roboto, Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(value), x + cardWidth / 2, y + cardHeight / 2);
            ctx.fillStyle = "#8f8f8f";
            ctx.font = "10px Arial";
            ctx.fillText(String(i), x + cardWidth / 2, y + cardHeight + 11);
        });

        const tamanoMonton = Math.max(0, p.tamano === undefined ? cantidad - p.ordenadas : p.tamano);
        const posiciones = new Map<number, { x: number; y: number }>();
        const niveles = Math.ceil(Math.log2(tamanoMonton + 1));
        let siguiente = 0;
        for (let nivel = 0; nivel < niveles && siguiente < tamanoMonton; nivel++) {
            const cantidadNivel = Math.min(2 ** nivel, tamanoMonton - siguiente);
            const separacion = Math.min(74, (width - 36) / Math.max(1, cantidadNivel));
            const xCentral = width / 2;
            const anchoNivel = (cantidadNivel - 1) * separacion;
            for (let columna = 0; columna < cantidadNivel; columna++) {
                posiciones.set(siguiente + columna, {
                    x: xCentral - anchoNivel / 2 + columna * separacion,
                    y: 112 + nivel * 58
                });
            }
            siguiente += cantidadNivel;
        }

        ctx.strokeStyle = "#555555";
        ctx.lineWidth = 2;
        posiciones.forEach((posicion, i) => {
            [2 * i + 1, 2 * i + 2].forEach(hijo => {
                const destino = posiciones.get(hijo);
                if (!destino) return;
                ctx.beginPath();
                ctx.moveTo(posicion.x, posicion.y + 16);
                ctx.lineTo(destino.x, destino.y - 16);
                ctx.stroke();
            });
        });

        posiciones.forEach((posicion, i) => {
            ctx.fillStyle = this.colores(p)[i];
            ctx.beginPath();
            ctx.roundRect(posicion.x - 17, posicion.y - 16, 34, 32, 7);
            ctx.fill();
            ctx.fillStyle = "#fff";
            ctx.font = "700 14px Roboto, Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(p.arr[i]), posicion.x, posicion.y);
            ctx.fillStyle = "#8f8f8f";
            ctx.font = "9px Arial";
            ctx.fillText(String(i), posicion.x, posicion.y + 27);
        });
    }
    dibujarCodigo(lineaActiva: number): void {
        this.codePanel.replaceChildren();
        const valores = document.createElement("div");
        valores.style.cssText = "height:18px;line-height:18px;padding:0 2px;white-space:nowrap;color:#ffffff;font-size:7px;font-family:'Roboto Mono',monospace;text-align:left";
        valores.textContent = `lista = [${this.pasos[0].arr.join(", ")}]`;
        this.codePanel.append(valores);
        CODE.forEach((text, i) => {
            const activa = i + 1 === lineaActiva;
            const row = document.createElement("div");
            row.style.cssText = `height:18px;line-height:18px;padding:0 2px;white-space:pre;width:100%;color:${activa ? "#fff" : "#d6dcff"};border-radius:2px;font-size:7px;text-align:left`;
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
