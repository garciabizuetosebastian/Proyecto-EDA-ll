const BG = "#ffffff";
const PANEL = "#151515";
const AZUL = "#4da3ff";
const ROJO = "#ff3158";
const AMARILLO = "#ffd166";
const NARANJA = "#ff8f42";
const VERDE = "#63d6a5";
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

function generarPasos(datos) {
    const a = [...datos];
    const pasos = [];
    const foto = (line, inicio, minimo, comp, ordenadas = 0) => pasos.push({ arr: [...a], line, inicio, minimo, comp, ordenadas });
    const minimo = Math.min(...a);
    foto(1, minimo, undefined, undefined, 0);
    const maximo = Math.max(...a);
    foto(2, maximo, undefined, undefined, 0);
    const conteo = Array(maximo - minimo + 1).fill(0);
    foto(3, undefined, undefined, undefined, 0);
    a.forEach((numero, indice) => {
        conteo[numero - minimo]++;
        foto(4, indice, numero, numero - minimo, 0);
    });
    foto(5, undefined, undefined, undefined, 0);
    foto(9, undefined, undefined, undefined, a.length);
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
          <section style="grid-column:1;grid-row:2;min-width:0">
            <div style="background:${PANEL};border:1px solid #ffffff18;border-radius:10px;padding:14px 16px 9px;box-shadow:inset 0 0 0 1px #ffffff03">
              <div id="status" style="min-height:24px;color:#fff;font-size:15px;font-weight:500;margin-bottom:8px">Preparando la simulacion</div>
              <canvas id="chart" style="width:100%;height:210px;display:block"></canvas>
              <div style="display:flex;justify-content:center;gap:22px;padding:6px 0 3px;font-size:13px;color:#fff;font-family:'Roboto',Arial,sans-serif">
                <span><b style="color:${ROJO}">■</b> sin revisar</span>
                <span><b style="color:${NARANJA}">■</b> leyendo</span>
                <span><b style="color:${VERDE}">■</b> coincidencia encontrada</span>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px">
              <button id="nuevo" class="control">Nueva secuencia</button>
              <button id="anterior" class="control">Anterior</button>
              <button id="play" class="control primary">▶ Reproducir</button>
              <button id="siguiente" class="control">Siguiente</button>
            </div>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px;font-size:13px">
              <label>Arreglo (máx. 15): <input id="arreglo-personalizado" type="text" value="${this.datos.join(", ")}" style="width:190px;padding:6px;border-radius:6px;border:1px solid #f0446155;background:#090507;color:#fff"></label>
              <button id="aplicar-arreglo" class="control">Aplicar arreglo</button>
              <label>Número a buscar: <input id="buscar-numero" type="number" value="4" min="-99" max="99" style="width:70px;padding:6px;border:0;outline:none;box-shadow:none;background:#090507;color:#fff;appearance:textfield;-moz-appearance:textfield"></label>
            </div>
            <div id="resultado-busqueda" style="margin-top:10px;padding:10px;border-radius:7px;background:#bdbdbd;color:#111;font-size:15px;font-weight:700">El número 4 aparece 0 veces</div>
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
        style.textContent = `.control{border:1px solid #ffffff35;background:#222222;color:#fff;border-radius:7px;padding:9px 14px;cursor:pointer}.control:hover{background:#3a3a3a}.control.primary{background:#63d6a5;border-color:#63d6a5;color:#111;font-weight:700}input[type="range"]{appearance:none;-webkit-appearance:none;height:6px;background:#5c5c5c;border-radius:4px}input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:#bdbdbd;border:2px solid #111;border-radius:50%;cursor:pointer}input[type="range"]::-moz-range-thumb{width:10px;height:10px;background:#bdbdbd;border:2px solid #111;border-radius:50%;cursor:pointer}#buscar-numero::-webkit-inner-spin-button,#buscar-numero::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}#buscar-numero:focus{border:0;outline:none;box-shadow:none}`;
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
        host.querySelector("#aplicar-arreglo").onclick = () => this.aplicarArreglo();
        host.querySelector("#buscar-numero").oninput = () => {
            this.actualizarResultado();
            this.dibujar();
        };
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
        this.actualizarResultado();
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
        const datos = [];
        for (let i = 0; i < n; i++) {
            datos.push(1 + Math.floor(this.random() * 9));
        }
        datos[0] = 4;
        datos[Math.max(1, Math.floor(n / 2))] = 4;
        return datos;
    }
    aplicarArreglo() {
        const entrada = document.querySelector("#arreglo-personalizado").value;
        const datos = entrada.split(",").map(v => Number(v.trim())).filter(v => Number.isFinite(v));
        if (!datos.length)
            return;
        this.cantidad = Math.max(1, Math.min(15, datos.length));
        this.datos = datos.slice(0, this.cantidad);
        this.pasos = generarPasos(this.datos);
        this.paso = 1;
        this.actualizarSliderPasos();
        this.dibujar();
        this.actualizarResultado();
        document.getElementById("cantidad-valor").textContent = String(this.cantidad);
        document.querySelector("#cantidad-slider").value = String(Math.max(5, this.cantidad));
    }
    actualizarResultado() {
        const objetivo = Number(document.querySelector("#buscar-numero").value);
        const minimo = Math.min(...this.datos);
        const maximo = Math.max(...this.datos);
        const conteos = Array(maximo - minimo + 1).fill(0);
        this.datos.forEach(numero => conteos[numero - minimo]++);
        const indice = objetivo - minimo;
        const veces = indice >= 0 && indice < conteos.length ? conteos[indice] : 0;
        document.querySelector("#resultado-busqueda").textContent =
            `El número ${objetivo} aparece ${veces} ${veces === 1 ? "vez" : "veces"}`;
    }
    regenerar(n) {
        this.detener();
        this.cantidad = n;
        this.datos = this.nuevosDatos(n);
        this.pasos = generarPasos(this.datos);
        this.paso = 1;
        document.getElementById("cantidad-valor").textContent = String(n);
        document.querySelector("#arreglo-personalizado").value = this.datos.join(", ");
        this.actualizarSliderPasos();
        this.dibujar();
        this.actualizarResultado();
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
        const objetivo = Number(document.querySelector("#buscar-numero")?.value);
        return p.arr.map((_, i) => {
            let color = ROJO;
            if (i < p.inicio && p.arr[i] === objetivo)
                color = VERDE;
            if (p.arr[i] === objetivo && p.line === 9)
                color = VERDE;
            if (i === p.inicio)
                color = NARANJA;
            return color;
        });
    }
    dibujar() {
        const p = this.pasos[this.paso - 1];
        const estado = p.line === 9 ? "Busqueda terminada; la secuencia mantiene su orden original" :
            p.line === 4 ? `Leyendo la posición ${p.inicio}: número ${p.minimo}` :
            p.line === 3 ? "Se crea el arreglo auxiliar de conteos" :
            p.line === 2 ? `Máximo encontrado: ${p.inicio}` :
            p.line === 1 ? `Mínimo encontrado: ${p.inicio}` :
            "Preparando Counting Sort";
        this.status.textContent = estado;
        const vistos = this.pasos.slice(0, this.paso).filter(x => x.line === 4).length;
        const intercambios = this.pasos.slice(0, this.paso).filter(x => x.line === 6).length;
        document.getElementById("comparaciones").textContent = String(vistos);
        document.getElementById("intercambios").textContent = String(intercambios);
        this.explanation.textContent = "Recorre el arreglo sin cambiar su orden. Los números naranjas se están leyendo y las coincidencias con el número buscado se iluminan en verde.";
        this.dibujar2D(p);
        this.dibujarCodigo(p.line);
        this.dibujarInstrucciones();
    }
    dibujarInstrucciones() {
        const instrucciones = this.pasos.slice(0, this.paso).map((paso, indice) => {
            let texto;
            switch (paso.line) {
                case 1: texto = "Se identifica el número mínimo."; break;
                case 2: texto = "Se identifica el número máximo."; break;
                case 3: texto = "Se crea el arreglo auxiliar de conteos."; break;
                case 4: texto = "Se registra una repetición en el arreglo de conteo."; break;
                case 5: texto = "Se inicia la reconstrucción ordenada del arreglo."; break;
                case 8: texto = `Se coloca el número ${paso.minimo} en la posición ${paso.inicio}.`; break;
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
