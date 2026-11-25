const TEMA_INICIAL = window.SortLabTheme?.getPalette();
let BG = TEMA_INICIAL?.fondo || "#050505";
let PANEL = TEMA_INICIAL?.normalFondo || "#151515";
let AZUL = TEMA_INICIAL?.compararBorde || "#d6d6d6";
let ROJO = TEMA_INICIAL?.normalBorde || "#383838";
let AMARILLO = TEMA_INICIAL?.minimoBorde || "#e0bc72";
let NARANJA = TEMA_INICIAL?.pivoteBorde || "#e0bc72";
let VERDE = TEMA_INICIAL?.exitoBorde || "#64c9a7";

window.addEventListener("sortlab-theme-change", () => {
    if (!window.SortLabTheme) return;
    const tema = window.SortLabTheme.getPalette();
    BG = tema.fondo;
    PANEL = tema.normalFondo;
    AZUL = tema.compararBorde;
    ROJO = tema.normalBorde;
    AMARILLO = tema.minimoBorde;
    NARANJA = tema.pivoteBorde;
    VERDE = tema.exitoBorde;
    if (window.__sortLabVisualizer)
        window.__sortLabVisualizer.dibujar();
});
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
    
    const minimo = Math.min(...a);
    const maximo = Math.max(...a);
    const conteo = Array(maximo - minimo + 1).fill(0);
    
    const foto = (line, inicio, minVal, comp, ordenadas = 0) => 
        pasos.push({ arr: [...a], line, inicio, minimo: minVal, comp, ordenadas, conteo: [...conteo], minVal: minimo, maxVal: maximo });
    
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
    constructor(cantidad = 10, semilla) {
        this.paso = 1;
        this.reproduciendo = false;
        this.cantidad = Math.max(5, Math.min(15, cantidad));
        this.random = this.crearRandom(semilla);
        this.datos = this.nuevosDatos(this.cantidad);
        this.pasos = generarPasos(this.datos);
        this.host = this.crearInterfaz();
<<<<<<< HEAD
        this.animationFrame = undefined;
    }
    crearInterfaz() {
        const host = document.createElement("main");
        host.className = "selection-layout";
        host.style.cssText = `width:min(1200px,calc(100vw - 40px));height:min(900px,calc(100vh - 40px));margin:0;padding:14px 16px;background:${BG};border:1px solid #ffffff08;border-radius:12px;display:grid;grid-template-columns:minmax(420px,1.7fr) minmax(260px,.85fr);grid-template-rows:auto auto;align-content:start;gap:8px 14px;overflow:hidden;`;
=======
        window.SortLabTheme.crearControlVelocidad(this.host.querySelector("#play").parentElement);
        window.addEventListener("sortlab-speed-change", () => {
            if (this.timer !== undefined) {
                this.detener();
                this.reproducir();
            }
        });
    }
    crearInterfaz() {
        const host = document.createElement("main");
        host.className = "selection-layout insertion-layout";
        host.style.cssText = `width:min(980px,calc(100vw - 40px));height:min(680px,calc(100vh - 40px));margin:0;padding:14px 16px;background:${BG};border:1px solid #ffffff08;border-radius:12px;display:grid;grid-template-columns:minmax(420px,1.7fr) minmax(260px,.85fr);grid-template-rows:auto minmax(0,1fr);gap:8px 14px;overflow:hidden;`;
>>>>>>> origin/Presentacion
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
        const datos = [];
        for (let i = 0; i < n; i++) {
            datos.push(1 + Math.floor(this.random() * 9));
        }
        datos[0] = 4;
        datos[Math.max(1, Math.floor(n / 2))] = 4;
        return datos;
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
<<<<<<< HEAD
        }, 900);
=======
        }, Math.round(180 / window.SortLabTheme.getPlaybackSpeed()));
>>>>>>> origin/Presentacion
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
            if (i === p.inicio && (p.line === 4 || p.line === 9))
                return NARANJA;
            if (p.line === 9)
                return VERDE;
            return AZUL;
        });
    }
    dibujar() {
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
        document.getElementById("comparaciones").textContent = String(conteos);
        document.getElementById("intercambios").textContent = String(ordenados);
        this.explanation.textContent = "Counting Sort organiza los números creando un arreglo de conteos. Primero busca el mínimo y máximo, luego cuenta las ocurrencias de cada número y finalmente reconstruye el arreglo ordenado.";
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
    dibujar2D(p) {
        const ctx = this.ctx;
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = 210;
        if (this.canvas.width !== width) this.canvas.width = width;
        if (this.canvas.height !== height) this.canvas.height = height;
<<<<<<< HEAD
        if (this.animationFrame !== undefined)
            cancelAnimationFrame(this.animationFrame);

        const count = p.conteo || [];
        const minValue = p.minVal ?? 0;
        const range = count.length;
        const arrayGap = p.arr.length === 15 ? 7 : 8;
        const arrayCard = Math.min(34, Math.floor((width - 80 - arrayGap * (p.arr.length - 1)) / p.arr.length));
        const arrayWidth = arrayCard * p.arr.length + arrayGap * (p.arr.length - 1);
        const arrayStartX = (width - arrayWidth) / 2;
        const arrayY = 24;
        const countGap = 5;
        const countCardWidth = Math.min(48, Math.floor((width - 48 - countGap * (range - 1)) / range));
        const countCardHeight = 42;
        const countWidth = countCardWidth * range + countGap * (range - 1);
        const countStartX = (width - countWidth) / 2;
        const countY = height - countCardHeight - 8;
        const countTitleY = countY - 15;
        const duration = 760;
        let startTime;

        const drawCard = (x, y, w, h, value, color, size) => {
            ctx.shadowColor = "rgba(0,0,0,.35)";
            ctx.shadowBlur = 7;
=======
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
        const objetivo = Number(document.querySelector("#buscar-numero")?.value);
        p.arr.forEach((value, i) => {
            const x = startX + i * (cardWidth + gap);
            const seleccionado = i === p.inicio || (p.line === 9 && p.arr[i] === objetivo);
            const y = startY - (seleccionado ? 14 : 0);
            ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
            ctx.shadowBlur = 8;
>>>>>>> origin/Presentacion
            ctx.shadowOffsetY = 3;
            ctx.fillStyle = color;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 8);
            ctx.fill();
            ctx.stroke();
            ctx.shadowColor = "transparent";
            ctx.fillStyle = "#fff";
            ctx.font = `700 ${size}px Roboto, Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(value), x + w / 2, y + h / 2);
        };

        const render = (time) => {
            if (startTime === undefined) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = progress * progress * (3 - 2 * progress);
            ctx.fillStyle = PANEL;
            ctx.fillRect(0, 0, width, height);

            const outputMove = p.line === 9 && p.inicio !== undefined;
            const activeIndex = outputMove ? p.inicio : -1;
            p.arr.forEach((value, i) => {
                if (outputMove && i === activeIndex && progress < 1) return;
                let color = AZUL;
                if (p.line === 4 && i === p.inicio) color = NARANJA;
                if (p.line === 9 && (p.inicio === undefined || i < (p.ordenadas - 1))) color = VERDE;
                drawCard(arrayStartX + i * (arrayCard + arrayGap), arrayY, arrayCard, arrayCard, value, color, 18);
                ctx.fillStyle = "#bbaeb3";
                ctx.font = "12px Arial";
                ctx.fillText(String(i), arrayStartX + i * (arrayCard + arrayGap) + arrayCard / 2, arrayY + arrayCard + 15);
            });

            ctx.fillStyle = "#d7cdd1";
            ctx.font = "12px Roboto, Arial";
            ctx.textAlign = "left";
            ctx.fillText("Conteo por número", 12, countTitleY);
            for (let i = 0; i < range; i++) {
                const value = minValue + i;
                const x = countStartX + i * (countCardWidth + countGap);
                const countValue = count[i] || 0;
                let emitted = 0;
                if (p.line === 9) {
                    const completed = Math.max(0, p.ordenadas - (progress < 1 && p.inicio !== undefined ? 1 : 0));
                    emitted = p.arr.slice(0, completed).filter((number) => number === value).length;
                }
                const visibleCount = Math.max(0, countValue - emitted -
                    (p.line === 4 && p.minimo === value && progress < 1 ? 1 : 0));
                drawCard(x, countY, countCardWidth, countCardHeight, value, visibleCount > 0 ? VERDE : "#333333", Math.min(16, countCardWidth / 2));
                ctx.fillStyle = AMARILLO;
                ctx.font = "700 11px Roboto, Arial";
                ctx.textAlign = "center";
                ctx.fillText(`×${visibleCount}`, x + countCardWidth / 2, countY + countCardHeight - 7);
            }

            const isCountingMove = p.line === 4 && p.inicio !== undefined && range > 0;
            if (isCountingMove || outputMove) {
                const value = p.minimo;
                const valueIndex = value - minValue;
                const sourceX = isCountingMove
                    ? arrayStartX + p.inicio * (arrayCard + arrayGap)
                    : countStartX + valueIndex * (countCardWidth + countGap) + (countCardWidth - arrayCard) / 2;
                const sourceY = isCountingMove ? arrayY : countY;
                const targetX = isCountingMove
                    ? countStartX + valueIndex * (countCardWidth + countGap) + (countCardWidth - arrayCard) / 2
                    : arrayStartX + p.inicio * (arrayCard + arrayGap);
                const targetY = isCountingMove ? countY : arrayY;
                const x = sourceX + (targetX - sourceX) * eased;
                const y = sourceY + (targetY - sourceY) * eased;
                drawCard(x, y, arrayCard, arrayCard, value, NARANJA, 18);
            }

            if (progress < 1)
                this.animationFrame = requestAnimationFrame(render);
            else
                this.animationFrame = undefined;
        };
        this.animationFrame = requestAnimationFrame(render);
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
    window.__sortLabVisualizer = new Visualizador(cantidad, semilla);
    return window.__sortLabVisualizer.montar();
}
