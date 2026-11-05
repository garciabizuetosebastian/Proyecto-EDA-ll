"use strict";
const LINEAS_CODIGO = 8;
function obtenerElemento(id) {
    const elemento = document.getElementById(id);
    if (!elemento) {
        throw new Error(`No se encontró el elemento con id "${id}".`);
    }
    return elemento;
}
function obtenerContexto(canvas) {
    const contexto = canvas.getContext("2d");
    if (!contexto) {
        throw new Error("No se pudo obtener el contexto 2D del canvas.");
    }
    return contexto;
}
const canvas = obtenerElemento("canvas");
const inputNum = obtenerElemento("numInput");
const numValor = obtenerElemento("numValor");
const infoLabel = obtenerElemento("info");
const tituloPaso = obtenerElemento("tituloPaso");
const explicacionPaso = obtenerElemento("explicacionPaso");
const detallePaso = obtenerElemento("detallePaso");
const registro = obtenerElemento("registro");
const btnGenerar = obtenerElemento("btnGenerar");
const btnAnt = obtenerElemento("btnAnt");
const btnPlay = obtenerElemento("btnPlay");
const btnSig = obtenerElemento("btnSig");
const barraPasos = obtenerElemento("barraPasos");
const ctx = obtenerContexto(canvas);
const W = canvas.width;
const H = canvas.height;
function actualizarColorBarra(barra) {
    const minimo = Number(barra.min);
    const maximo = Number(barra.max);
    const valor = Number(barra.value);
    const porcentaje = maximo > minimo
        ? ((valor - minimo) / (maximo - minimo)) * 100
        : 0;
    barra.style.setProperty("--progreso", `${porcentaje}%`);
}
const PALETA = {
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
};
let pasos = [];
let pasoActual = 0;
let playing = false;
let timer = null;
function calcularPasos(n) {
    const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
    const historial = [];
    const aux = Array.from({ length: n }, () => null);
    const usados = Array.from({ length: n }, () => false);
    const ordenado = Array.from({ length: n }, () => false);
    const registrar = (p) => {
        historial.push({
            arr: [...arr],
            rango: p.rango ?? null,
            medio: p.medio ?? null,
            mezclando: p.mezclando ?? false,
            aux: [...aux],
            comp: p.comp ?? [],
            resaltarAux: p.resaltarAux ?? [],
            usados: [...usados],
            ordenado: [...ordenado],
            done: p.done ?? false,
            titulo: p.titulo,
            explicacion: p.explicacion,
            detalle: p.detalle,
            lineaCodigo: p.lineaCodigo,
        });
    };
    const mezclar = (lo, mid, hi) => {
        const rango = [lo, hi];
        const izquierda = arr.slice(lo, mid + 1);
        const derecha = arr.slice(mid + 1, hi + 1);
        registrar({
            rango,
            medio: mid,
            mezclando: true,
            titulo: "Mezclamos dos mitades ordenadas",
            explicacion: `Mezclamos [${izquierda.join(" · ")}] con [${derecha.join(" · ")}]. Ambas mitades ya están ordenadas.`,
            detalle: "Compararemos siempre los dos primeros (los menores) de cada mitad y pasaremos el menor a una lista auxiliar.",
            lineaCodigo: 4,
        });
        let i = lo;
        let j = mid + 1;
        let k = lo;
        while (i <= mid && j <= hi) {
            const izq = arr[i];
            const der = arr[j];
            const tomaIzquierda = izq <= der;
            registrar({
                rango,
                medio: mid,
                mezclando: true,
                comp: [i, j],
                titulo: "Comparamos los dos primeros",
                explicacion: `Comparamos ${izq} (izquierda) con ${der} (derecha): ${izq} ${tomaIzquierda ? "es menor o igual que" : "es mayor que"} ${der}.`,
                detalle: `En el siguiente paso pasaremos ${tomaIzquierda ? izq : der} al auxiliar.`,
                lineaCodigo: 5,
            });
            const idx = tomaIzquierda ? i : j;
            const valor = arr[idx];
            aux[k] = valor;
            usados[idx] = true;
            registrar({
                rango,
                medio: mid,
                mezclando: true,
                comp: [idx],
                resaltarAux: [k],
                titulo: `Colocamos ${valor} en el auxiliar`,
                explicacion: `${valor} va a la posición ${k + 1} de la lista auxiliar.`,
                detalle: `Auxiliar hasta ahora: ${aux.slice(lo, k + 1).join(" · ")}.`,
                lineaCodigo: 6,
            });
            if (tomaIzquierda)
                i++;
            else
                j++;
            k++;
        }
        if (i <= mid || j <= hi) {
            const sobraIzquierda = i <= mid;
            const desde = sobraIzquierda ? i : j;
            const hasta = sobraIzquierda ? mid : hi;
            const posiciones = [];
            const posicionesAux = [];
            for (let p = desde; p <= hasta; p++) {
                aux[k] = arr[p];
                usados[p] = true;
                posiciones.push(p);
                posicionesAux.push(k);
                k++;
            }
            registrar({
                rango,
                medio: mid,
                mezclando: true,
                comp: posiciones,
                resaltarAux: posicionesAux,
                titulo: "Copiamos los que sobran",
                explicacion: `La mitad ${sobraIzquierda ? "izquierda" : "derecha"} todavía tiene ${posiciones.length} número(s): ${posiciones.map((p) => arr[p]).join(" · ")}.`,
                detalle: "Ya están ordenados y son mayores que todo lo colocado, así que pasan tal cual al auxiliar.",
                lineaCodigo: 7,
            });
        }
        for (let p = lo; p <= hi; p++) {
            arr[p] = aux[p];
            usados[p] = false;
            ordenado[p] = true;
        }
        const posicionesRango = Array.from({ length: hi - lo + 1 }, (_, d) => lo + d);
        registrar({
            rango,
            mezclando: true,
            comp: posicionesRango,
            resaltarAux: posicionesRango,
            titulo: "Copiamos el auxiliar al arreglo",
            explicacion: `El auxiliar tiene los ${hi - lo + 1} números ordenados. Los copiamos a las posiciones ${lo + 1} a ${hi + 1}.`,
            detalle: `Este bloque queda ordenado: ${arr.slice(lo, hi + 1).join(" · ")}.`,
            lineaCodigo: 7,
        });
        for (let p = lo; p <= hi; p++)
            aux[p] = null;
    };
    const ordenar = (lo, hi, nivel) => {
        if (lo === hi) {
            ordenado[lo] = true;
            registrar({
                rango: [lo, hi],
                comp: [lo],
                titulo: "Caso base: un solo número",
                explicacion: `En la posición ${lo + 1} solo queda el ${arr[lo]}.`,
                detalle: "Una lista de un solo elemento ya está ordenada, no hay nada que hacer.",
                lineaCodigo: 2,
            });
            return;
        }
        const medio = Math.floor((lo + hi) / 2);
        registrar({
            rango: [lo, hi],
            medio,
            titulo: `Dividimos (nivel ${nivel})`,
            explicacion: `Tomamos las posiciones ${lo + 1} a ${hi + 1}: ${arr.slice(lo, hi + 1).join(" · ")}. Las partimos en dos mitades.`,
            detalle: `Izquierda: posiciones ${lo + 1} a ${medio + 1}. Derecha: posiciones ${medio + 2} a ${hi + 1}.`,
            lineaCodigo: 3,
        });
        ordenar(lo, medio, nivel + 1);
        ordenar(medio + 1, hi, nivel + 1);
        mezclar(lo, medio, hi);
    };
    registrar({
        titulo: "Empezamos con una lista desordenada",
        explicacion: `Tenemos ${n} números. Merge Sort divide la lista por la mitad una y otra vez hasta tener números sueltos, y luego los va mezclando en orden.`,
        detalle: "Esta estrategia se llama «divide y vencerás».",
        lineaCodigo: 1,
    });
    ordenar(0, n - 1, 1);
    for (let p = 0; p < n; p++)
        ordenado[p] = true;
    registrar({
        done: true,
        titulo: "¡Lista ordenada!",
        explicacion: "Todas las mitades quedaron mezcladas en orden. Los números quedaron de menor a mayor.",
        detalle: `Resultado final: ${arr.join(" · ")}.`,
        lineaCodigo: 8,
    });
    return historial;
}
function dibujarEstado(estado) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = PALETA.fondo;
    ctx.fillRect(0, 0, W, H);
    const n = estado.arr.length;
    const margen = 5;
    const anchoTotal = W - margen * (n + 1);
    const boxW = Math.min(60, anchoTotal / n);
    const boxH = 50;
    // Fila del arreglo arriba y fila del auxiliar abajo, centradas como bloque.
    const separacion = 80;
    const bloqueAlto = boxH * 2 + separacion;
    const mainY = Math.max(34, (H - bloqueAlto) / 2);
    const auxY = mainY + boxH + separacion;
    const totalWidth = n * boxW + (n - 1) * margen;
    const startX = (W - totalWidth) / 2;
    const xDe = (k) => startX + k * (boxW + margen);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const fuente = () => {
        if (boxW < 30)
            return "bold 12px Arial";
        if (boxW < 45)
            return "bold 16px Arial";
        return "bold 20px Arial";
    };
    const dibujarCaja = (x, y, valor, fondo, borde, texto, alpha) => {
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
        const dentro = estado.rango !== null && k >= estado.rango[0] && k <= estado.rango[1];
        let alpha = 1;
        if (!estado.done && estado.rango !== null && !dentro)
            alpha = 0.38;
        let fondo = PALETA.normalFondo;
        let borde = PALETA.normalBorde;
        let texto = PALETA.normalTexto;
        if (estado.done || estado.ordenado[k]) {
            fondo = PALETA.exitoFondo;
            borde = PALETA.exitoBorde;
            texto = PALETA.exitoTexto;
        }
        else if (dentro) {
            fondo = PALETA.rangoFondo;
            borde = PALETA.rangoBorde;
            texto = PALETA.rangoTexto;
        }
        if (estado.comp.includes(k)) {
            fondo = PALETA.compararFondo;
            borde = PALETA.compararBorde;
            texto = PALETA.compararTexto;
        }
        if (estado.usados[k])
            alpha = 0.3;
        dibujarCaja(xDe(k), mainY, estado.arr[k], fondo, borde, texto, alpha);
    }
    // Línea divisoria y etiquetas de las dos mitades
    if (estado.rango !== null && estado.medio !== null) {
        const [lo, hi] = estado.rango;
        const m = estado.medio;
        const xDiv = xDe(m + 1) - margen / 2;
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = PALETA.compararBorde;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(xDiv, mainY - 26);
        ctx.lineTo(xDiv, mainY + boxH + 8);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = PALETA.compararBorde;
        ctx.font = "bold 12px Arial";
        ctx.fillText("izquierda", (xDe(lo) + xDe(m) + boxW) / 2, mainY - 14);
        ctx.fillText("derecha", (xDe(m + 1) + xDe(hi) + boxW) / 2, mainY - 14);
    }
    // Lista auxiliar
    if (estado.mezclando && estado.rango !== null) {
        const [lo, hi] = estado.rango;
        for (let k = lo; k <= hi; k++) {
            const x = xDe(k);
            const valor = estado.aux[k];
            if (valor === null) {
                ctx.save();
                ctx.setLineDash([5, 4]);
                ctx.strokeStyle = PALETA.normalBorde;
                ctx.lineWidth = 2;
                ctx.strokeRect(x, auxY, boxW, boxH);
                ctx.restore();
            }
            else if (estado.resaltarAux.includes(k)) {
                dibujarCaja(x, auxY, valor, PALETA.compararFondo, PALETA.compararBorde, PALETA.compararTexto, 1);
            }
            else {
                dibujarCaja(x, auxY, valor, PALETA.exitoFondo, PALETA.exitoBorde, PALETA.exitoTexto, 1);
            }
        }
        ctx.fillStyle = PALETA.rangoBorde;
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "left";
        ctx.fillText("lista auxiliar", xDe(lo), auxY + boxH + 16);
        ctx.textAlign = "center";
    }
}
function actualizarVista() {
    if (pasos.length === 0)
        return;
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
        const elemento = obtenerElemento(`codigo-${linea}`);
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
function generar() {
    detener();
    const n = Number(inputNum.value);
    numValor.value = String(n);
    pasos = calcularPasos(n);
    pasoActual = 0;
    barraPasos.max = String(pasos.length - 1);
    actualizarVista();
}
function siguiente() {
    if (pasoActual < pasos.length - 1) {
        pasoActual++;
        actualizarVista();
    }
    else {
        detener();
    }
}
function anterior() {
    if (pasoActual > 0) {
        pasoActual--;
        actualizarVista();
    }
}
function play() {
    if (playing)
        return;
    if (pasoActual === pasos.length - 1)
        pasoActual = 0;
    playing = true;
    btnPlay.textContent = "Pausar";
    timer = window.setInterval(() => {
        siguiente();
        if (pasoActual >= pasos.length - 1)
            detener();
    }, 300);
}
function detener() {
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
    if (playing)
        detener();
    else
        play();
};
generar();
actualizarColorBarra(inputNum);
