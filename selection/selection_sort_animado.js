const BG = "#ffffff";
const PANEL = "#151515";
const AZUL = "#4da3ff";
const ROJO = "#ff3158";
const AMARILLO = "#ffd166";
const NARANJA = "#ff8f42";
const VERDE = "#63d6a5";
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

function generarPasos(datos) {
    const a = [...datos];
    const pasos = [];
    const foto = (line, inicio, minimo, comp, ordenadas = 0) => pasos.push({ arr: [...a], line, inicio, minimo, comp, ordenadas });
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

class Visualizador {
    constructor(cantidad = 10, semilla) {
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
            <h1 style="margin:0;color:#111;font-size:22px;font-weight:700">Aprende Selection Sort paso a paso</h1>
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
          <section style="grid-column:1;grid-row:2;min-width:0">
            <div style="background:${PANEL};border:1px solid #ffffff18;border-radius:10px;padding:14px 16px 9px;box-shadow:inset 0 0 0 1px #ffffff03">
              <div id="status" style="min-height:24px;color:#fff;font-size:15px;font-weight:500;margin-bottom:8px">Preparando la simulacion</div>
              <canvas id="chart" style="width:100%;height:210px;display:block"></canvas>
              <div style="display:flex;justify-content:center;gap:22px;padding:6px 0 3px;font-size:13px;color:#fff;font-family:'Roboto',Arial,sans-serif">
                <span><b style="color:${ROJO}">■</b> sin revisar</span>
                <span><b style="color:${AZUL}">■</b> comparando</span>
                <span><b style="color:${AMARILLO}">■</b> mínimo</span>
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
        style.textContent = `.control{border:1px solid #ffffff35;background:#222222;color:#fff;border-radius:7px;padding:9px 14px;cursor:pointer}.control:hover{background:#3a3a3a}.control.primary{background:#63d6a5;border-color:#63d6a5;color:#111;font-weight:700}input[type="range"]{appearance:none;-webkit-appearance:none;height:6px;background:#5c5c5c;border-radius:4px}input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:#bdbdbd;border:2px solid #111;border-radius:50%;cursor:pointer}input[type="range"]::-moz-range-thumb{width:10px;height:10px;background:#bdbdbd;border:2px solid #111;border-radius:50%;cursor:pointer}`;
        host.append(style);
        this.canvas = host.querySelector("#chart");
        this.ctx = this.canvas.getContext("2d");
        this.status = host.querySelector("#status");
        this.explanation = host.querySelector("#explanation");
        this.codePanel = host.querySelector("#code");
        this.pasoSlider = host.querySelector("#paso-slider");
        this.instructionsPanel = host.querySelector("#instructions");
        this.playButton = host.querySelector("#play");
        host.querySelector("#nuevo").onclick = () => this.regenerar(this.cantidad);
        host.querySelector("#anterior").onclick = () => this.irA(this.paso - 1);
        host.querySelector("#siguiente").onclick = () => this.irA(this.paso + 1);
        this.playButton.onclick = () => this.togglePlay();
        this.cantidadSlider = host.querySelector("#cantidad-slider");
        this.cantidadSlider.oninput = (event) => {
            this.actualizarRango(this.cantidadSlider);
            this.regenerar(Number(event.target.value));
        };
        this.pasoSlider.oninput = (event) => {
            this.actualizarRango(this.pasoSlider);
            this.irA(Number(event.target.value));
        };
        return host;
    }
    montar() {
        document.body.style.margin = "0";
        document.body.style.background = BG;
        document.body.append(this.host);
        this.actualizarSliderPasos();
        this.actualizarRango(this.cantidadSlider);
        this.dibujar();
        return this.host;
    }
    crearRandom(semilla) {
        let state = semilla === undefined ? Math.floor(Math.random() * 2147483647) : semilla;
        return () => {
            state = (state * 48271) % 2147483647;
            return (state - 1) / 2147483646;
        };
    }
    nuevosDatos(n) {
        const pool = Array.from({ length: 30 }, (_, i) => i + 3);
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(this.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        return pool.slice(0, n);
    }
    regenerar(n) {
        this.detener();
        this.cantidad = n;
        this.datos = this.nuevosDatos(n);
        this.pasos = generarPasos(this.datos);
        this.paso = 1;
        document.getElementById("cantidad-valor").textContent = String(n);
        this.actualizarSliderPasos();
        this.dibujar();
    }
    iniciarAnimacion() {
        this.regenerar(this.cantidad);
        this.reproducir();
    }
    actualizarSliderPasos() {
        this.pasoSlider.max = String(this.pasos.length);
        this.pasoSlider.value = String(this.paso);
        document.getElementById("paso-num").textContent = String(this.paso);
        this.actualizarRango(this.pasoSlider);
    }
    actualizarRango(slider) {
        const minimo = Number(slider.min || 0);
        const maximo = Number(slider.max || 100);
        const avance = maximo === minimo ? 0 : ((Number(slider.value) - minimo) / (maximo - minimo)) * 100;
        slider.style.background = `linear-gradient(to right,#d0d0d0 0%,#d0d0d0 ${avance}%,#5c5c5c ${avance}%,#5c5c5c 100%)`;
    }
    irA(paso) {
        this.paso = Math.max(1, Math.min(this.pasos.length, paso));
        this.pasoSlider.value = String(this.paso);
        document.getElementById("paso-num").textContent = String(this.paso);
        this.actualizarRango(this.pasoSlider);
        this.dibujar();
    }
    togglePlay() {
        this.reproduciendo ? this.detener() : this.reproducir();
    }
    reproducir() {
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
    detener() {
        if (this.timer !== undefined)
            window.clearInterval(this.timer);
        this.timer = undefined;
        this.reproduciendo = false;
        this.playButton.textContent = "▶ Reproducir";
    }
    colores(p) {
        return p.arr.map((_, i) => {
            let color = ROJO;
            if (i < p.ordenadas)
                color = VERDE;
            if (i === p.comp)
                color = AZUL;
            if (i === p.minimo)
                color = AMARILLO;
            if (i === p.inicio)
                color = ROJO;
            return color;
        });
    }
    dibujar() {
        const p = this.pasos[this.paso - 1];
        const estado = p.line === 7 ? "Secuencia ordenada" :
            p.line === 6 ? `Se coloca ${p.arr[p.inicio]} en su posicion definitiva` :
            p.line === 5 ? `${p.arr[p.minimo]} es el nuevo mínimo` :
            p.line === 4 ? "Se compara el elemento con el mínimo actual" :
            p.comp !== undefined ? `Comparando posiciones ${p.minimo} y ${p.comp}` :
            "Seleccionando la siguiente posicion";
        this.status.textContent = estado;
        const vistos = this.pasos.slice(0, this.paso).filter(x => x.line === 4).length;
        const intercambios = this.pasos.slice(0, this.paso).filter(x => x.line === 6).length;
        document.getElementById("comparaciones").textContent = String(vistos);
        document.getElementById("intercambios").textContent = String(intercambios);
        this.explanation.textContent = p.line === 7 ?
            "Todos los números quedaron ordenados de menor a mayor. Selection Sort termina cuando no quedan posiciones por seleccionar." :
            "Busca el menor elemento desde la posición actual hasta el final. Cuando lo encuentra, lo intercambia con la posición que se está resolviendo.";
        this.dibujar2D(p);
        this.dibujarCodigo(p.line);
        this.dibujarInstrucciones();
    }
    dibujarInstrucciones() {
        const instrucciones = this.pasos.slice(0, this.paso).map((paso, indice) => {
            let texto;
            switch (paso.line) {
                case 1: texto = `Se inicia la posición ${paso.inicio}.`; break;
                case 2: texto = `El mínimo comienza en la posición ${paso.minimo}.`; break;
                case 3: texto = `Se prepara la comparación con la posición ${paso.comp}.`; break;
                case 4: texto = `Se compara la posición ${paso.comp} con el mínimo actual ${paso.minimo}.`; break;
                case 5: texto = `${paso.arr[paso.minimo]} pasa a ser el mínimo.`; break;
                case 6: texto = `Se intercambia la posición ${paso.inicio} con el mínimo ${paso.minimo}.`; break;
                default: texto = "La secuencia ya quedó ordenada.";
            }
            return `<div style="border-bottom:1px solid #ffffff10;padding:6px 0"><span style="color:#ff91a2">${indice + 1}.</span> ${texto}</div>`;
        });
        const inicio = Math.max(0, instrucciones.length - 12);
        this.instructionsPanel.innerHTML = instrucciones.slice(inicio).join("");
        this.instructionsPanel.scrollTop = this.instructionsPanel.scrollHeight;
    }
    dibujar2D(p) {
        const ctx = this.ctx;
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = 210;
        if (this.canvas.width !== width) this.canvas.width = width;
        if (this.canvas.height !== height) this.canvas.height = height;
        ctx.fillStyle = PANEL;
        ctx.fillRect(0, 0, width, height);
        const colors = this.colores(p);
        const cantidad = p.arr.length;
        const gap = cantidad === 15 ? 7 : 8;
        const maxTotalSize = width - 80;
        const cardSize = Math.min(34, Math.floor((maxTotalSize - gap * (cantidad - 1)) / cantidad));
        const cardWidth = cardSize;
        const cardHeight = cardSize;
        const totalWidth = cardWidth * cantidad + gap * (cantidad - 1);
        const startX = (width - totalWidth) / 2;
        const startY = (height - cardHeight) / 2 - 18;
        p.arr.forEach((value, i) => {
            const x = startX + i * (cardWidth + gap);
            const y = startY;
            ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
            ctx.shadowBlur = 8;
            ctx.shadowOffsetY = 3;
            ctx.fillStyle = colors[i];
            ctx.strokeStyle = "#111";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x, y, cardWidth, cardHeight, 9);
            ctx.fill();
            ctx.stroke();
            ctx.shadowColor = "transparent";
            ctx.fillStyle = "#ffffff";
            ctx.font = "700 18px Roboto, Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(value), x + cardWidth / 2, y + cardHeight / 2);
            ctx.fillStyle = "#bbaeb3";
            ctx.font = "12px Arial";
            ctx.fillText(String(i), x + cardWidth / 2, y + cardHeight + 22);
        });
    }
    dibujarCodigo(lineaActiva) {
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
function iniciar(cantidad = 15, semilla) {
    return new Visualizador(cantidad, semilla).montar();
}
