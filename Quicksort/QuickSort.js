"use strict";
const LINEAS_CODIGO = 9;
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
const inputMios = obtenerElemento("misNumeros");
const btnUsar = obtenerElemento("btnUsar");
const aviso = obtenerElemento("aviso");
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
    pivoteFondo: "#5a4310",
    pivoteBorde: "#e3b341",
    pivoteTexto: "#fff4d6",
    menoresFondo: "#12363a",
    menoresBorde: "#4fb8b0",
    menoresTexto: "#e2fbf8",
    mayoresFondo: "#2a2548",
    mayoresBorde: "#8478d8",
    mayoresTexto: "#ece8ff",
};
let pasos = [];
let pasoActual = 0;
let playing = false;
let timer = null;
// Devuelve la zona [desde, hasta], o undefined si está vacía.
function zona(desde, hasta) {
    return desde <= hasta ? [desde, hasta] : undefined;
}
function calcularPasos(valores) {
    const arr = [...valores];
    const n = arr.length;
    const historial = [];
    const ordenado = Array.from({ length: n }, () => false);
    const registrar = (p) => {
        historial.push({
            arr: [...arr],
            rango: p.rango ?? null,
            pivote: p.pivote ?? null,
            i: p.i ?? null,
            j: p.j ?? null,
            menores: p.menores ?? null,
            mayores: p.mayores ?? null,
            comp: p.comp ?? [],
            ordenado: [...ordenado],
            done: p.done ?? false,
            titulo: p.titulo,
            explicacion: p.explicacion,
            detalle: p.detalle,
            lineaCodigo: p.lineaCodigo,
        });
    };
    const lista = (desde, hasta) => arr.slice(desde, hasta + 1).join(" · ");
    const ordenar = (lo, hi, nivel) => {
        if (lo > hi)
            return;
        if (lo === hi) {
            ordenado[lo] = true;
            registrar({
                rango: [lo, hi],
                comp: [lo],
                titulo: "Caso base: un solo número",
                explicacion: `En la posición ${lo + 1} solo queda el ${arr[lo]}.`,
                detalle: "Un solo número ya está ordenado: queda en su lugar definitivo.",
                lineaCodigo: 2,
            });
            return;
        }
        const rango = [lo, hi];
        const pivote = arr[hi];
        let i = lo - 1;
        registrar({
            rango,
            pivote: hi,
            i,
            titulo: `Elegimos el pivote (nivel ${nivel})`,
            explicacion: `Tomamos las posiciones ${lo + 1} a ${hi + 1}: ${lista(lo, hi)}. Como pivote usamos el último: ${pivote}.`,
            detalle: "Vamos a recorrer los demás comparándolos con el pivote: los menores se juntan a la izquierda y el resto se queda a la derecha.",
            lineaCodigo: 3,
        });
        for (let j = lo; j < hi; j++) {
            const valor = arr[j];
            const esMenor = valor < pivote;
            registrar({
                rango,
                pivote: hi,
                i,
                j,
                menores: zona(lo, i),
                mayores: zona(i + 1, j - 1),
                comp: [j],
                titulo: "Comparamos con el pivote",
                explicacion: `Comparamos ${valor} (posición ${j + 1}) con el pivote ${pivote}: ${valor} es ${esMenor ? "menor que" : "mayor o igual que"} ${pivote}.`,
                detalle: esMenor
                    ? "Es menor: tiene que terminar en la zona de la izquierda (los menores)."
                    : "No es menor: se queda en la zona de la derecha (mayores o iguales).",
                lineaCodigo: 5,
            });
            if (esMenor) {
                i++;
                const desplazado = arr[i];
                const mismo = i === j;
                if (!mismo) {
                    arr[i] = valor;
                    arr[j] = desplazado;
                }
                registrar({
                    rango,
                    pivote: hi,
                    i,
                    j,
                    menores: zona(lo, i),
                    mayores: zona(i + 1, j),
                    comp: mismo ? [j] : [i, j],
                    titulo: mismo ? "Ya está en la zona de menores" : "Intercambiamos",
                    explicacion: mismo
                        ? `El ${valor} ya está justo al final de la zona de menores (posición ${j + 1}), no hace falta moverlo.`
                        : `Intercambiamos las posiciones ${i + 1} y ${j + 1}: el ${valor} pasa a la zona de menores y el ${desplazado} se va a la zona de mayores.`,
                    detalle: `Zona de menores hasta ahora: ${lista(lo, i)}.`,
                    lineaCodigo: 6,
                });
            }
        }
        const destino = i + 1;
        if (destino !== hi) {
            arr[hi] = arr[destino];
            arr[destino] = pivote;
        }
        ordenado[destino] = true;
        registrar({
            rango,
            pivote: destino,
            menores: zona(lo, destino - 1),
            mayores: zona(destino + 1, hi),
            titulo: "Colocamos el pivote en su lugar",
            explicacion: destino === hi
                ? `El pivote ${pivote} ya estaba en la posición ${destino + 1}, que es la que le toca.`
                : `Intercambiamos el pivote ${pivote} con la posición ${destino + 1}: ahí le toca quedar.`,
            detalle: `A su izquierda todo es menor y a su derecha todo es mayor o igual, así que el ${pivote} ya no se vuelve a mover.`,
            lineaCodigo: 7,
        });
        const izquierda = destino - lo;
        const derecha = hi - destino;
        registrar({
            rango,
            pivote: destino,
            titulo: "Repetimos a cada lado del pivote",
            explicacion: `A la izquierda del pivote quedaron ${izquierda} número(s) y a la derecha ${derecha}. Aplicamos Quick Sort a cada lado por separado.`,
            detalle: `Izquierda: ${izquierda > 0 ? `posiciones ${lo + 1} a ${destino}` : "vacía"}. Derecha: ${derecha > 0 ? `posiciones ${destino + 2} a ${hi + 1}` : "vacía"}.`,
            lineaCodigo: 8,
        });
        ordenar(lo, destino - 1, nivel + 1);
        ordenar(destino + 1, hi, nivel + 1);
    };
    registrar({
        titulo: "Empezamos con una lista desordenada",
        explicacion: `Tenemos ${n} números. Quick Sort elige un pivote, manda los menores a su izquierda y los demás a su derecha, y repite lo mismo con cada lado.`,
        detalle: "Es otro ejemplo de «divide y vencerás»: aquí el pivote es el que reparte el trabajo.",
        lineaCodigo: 1,
    });
    ordenar(0, n - 1, 1);
    for (let p = 0; p < n; p++)
        ordenado[p] = true;
    registrar({
        done: true,
        titulo: "¡Lista ordenada!",
        explicacion: "Todos los números quedaron en su posición definitiva: de menor a mayor.",
        detalle: `Resultado final: ${arr.join(" · ")}.`,
        lineaCodigo: 9,
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
    const mainY = 96;
    const totalWidth = n * boxW + (n - 1) * margen;
    const startX = (W - totalWidth) / 2;
    const xDe = (k) => startX + k * (boxW + margen);
    const centroX = (k) => xDe(k) + boxW / 2;
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
    const enZona = (z, k) => z !== null && k >= z[0] && k <= z[1];
    // Fila del arreglo
    for (let k = 0; k < n; k++) {
        const dentro = enZona(estado.rango, k);
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
            alpha = 1;
        }
        else if (enZona(estado.menores, k)) {
            fondo = PALETA.menoresFondo;
            borde = PALETA.menoresBorde;
            texto = PALETA.menoresTexto;
        }
        else if (enZona(estado.mayores, k)) {
            fondo = PALETA.mayoresFondo;
            borde = PALETA.mayoresBorde;
            texto = PALETA.mayoresTexto;
        }
        else if (dentro) {
            fondo = PALETA.rangoFondo;
            borde = PALETA.rangoBorde;
            texto = PALETA.rangoTexto;
        }
        if (estado.pivote === k && !estado.done) {
            fondo = PALETA.pivoteFondo;
            borde = PALETA.pivoteBorde;
            texto = PALETA.pivoteTexto;
            alpha = 1;
        }
        if (estado.comp.includes(k)) {
            fondo = PALETA.compararFondo;
            borde = PALETA.compararBorde;
            texto = PALETA.compararTexto;
            alpha = 1;
        }
        dibujarCaja(xDe(k), mainY, estado.arr[k], fondo, borde, texto, alpha);
    }
    // Etiqueta "pivote" sobre la casilla del pivote
    if (estado.pivote !== null && !estado.done) {
        ctx.fillStyle = PALETA.pivoteBorde;
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("pivote", centroX(estado.pivote), mainY - 14);
    }
    // Indicadores i y j debajo de las casillas
    const { i, j, rango } = estado;
    if (j !== null) {
        const inicio = rango !== null ? rango[0] : 0;
        const iVisible = i !== null && i >= inicio;
        const mismo = iVisible && i === j;
        const marcar = (k, etiqueta, color) => {
            ctx.fillStyle = color;
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "center";
            ctx.fillText("▲", centroX(k), mainY + boxH + 12);
            ctx.fillText(etiqueta, centroX(k), mainY + boxH + 28);
        };
        marcar(j, mismo ? "i, j" : "j", PALETA.compararBorde);
        if (iVisible && !mismo && i !== null)
            marcar(i, "i", PALETA.menoresBorde);
    }
    // Llaves que marcan las zonas de menores y de mayores
    const llave = (z, texto, color) => {
        if (z === null)
            return;
        const x1 = xDe(z[0]);
        const x2 = xDe(z[1]) + boxW;
        const y = mainY + boxH + 62;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y - 6);
        ctx.lineTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.lineTo(x2, y - 6);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = color;
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(texto, (x1 + x2) / 2, y + 16);
    };
    llave(estado.menores, "< pivote", PALETA.menoresBorde);
    llave(estado.mayores, "≥ pivote", PALETA.mayoresBorde);
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
function cargar(valores) {
    detener();
    pasos = calcularPasos(valores);
    pasoActual = 0;
    barraPasos.max = String(pasos.length - 1);
    actualizarVista();
}
function generar() {
    const n = Number(inputNum.value);
    numValor.value = String(n);
    aviso.textContent = "";
    cargar(Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10));
}
function usarMisNumeros() {
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
    }, 450);
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
btnUsar.onclick = usarMisNumeros;
inputMios.onkeydown = (evento) => {
    if (evento.key === "Enter")
        usarMisNumeros();
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
    if (playing)
        detener();
    else
        play();
};
generar();
actualizarColorBarra(inputNum);
