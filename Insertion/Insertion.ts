/**
 * Interfaz que define el estado en cada paso del algoritmo.
 */
interface SortState {
    array: number[];
    currentI: number | null;
    currentJ: number | null;
    key: number | null;
    status: string;
}

/**
 * Generador que ejecuta Insertion Sort y emite el estado actual
 * en cada comparación y movimiento.
 */
export function* insertionSortGenerator(arr: number[]): Generator<SortState, void, unknown> {
    const a = [...arr];
    const n = a.length;

    for (let i = 1; i < n; i++) {
        const key = a[i];
        let j = i - 1;

        // Estado cuando se selecciona la nueva clave (key)
        yield {
            array: [...a],
            currentI: i,
            currentJ: j,
            key: key,
            status: `Insertando el elemento ${key} (índice ${i})`
        };

        // Mover los elementos de a[0..i-1] que son mayores que key
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];

            // Estado durante el desplazamiento de elementos
            yield {
                array: [...a],
                currentI: i,
                currentJ: j,
                key: key,
                status: `Desplazando ${a[j]} a la derecha`
            };

            j--;
        }

        a[j + 1] = key;

        // Estado tras colocar la clave en su posición final para esta iteración
        yield {
            array: [...a],
            currentI: i,
            currentJ: j + 1,
            key: key,
            status: `Colocado ${key} en el índice ${j + 1}`
        };
    }

    // Estado final
    yield {
        array: [...a],
        currentI: null,
        currentJ: null,
        key: null,
        status: '¡Ordenamiento completado!'
    };
}

/**
 * Renderiza el estado en un elemento HTML5 Canvas simulando las celdas cuadradas.
 */
export function drawFrame(canvas: HTMLCanvasElement, state: SortState): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const arr = state.array;
    const n = arr.length;
    
    const boxSize = 50;
    const gap = 10;
    const startX = 20;
    const startY = 60;

    // Ajustar el tamaño del canvas automáticamente
    canvas.width = Math.max(800, startX + n * (boxSize + gap) + 20);
    canvas.height = 180;

    // Fondo general oscuro (#1e1e1e)
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Renderizado del título / estado
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(state.status, startX, 35);

    // Dibujar cada caja
    arr.forEach((val, idx) => {
        const x = startX + idx * (boxSize + gap);
        const y = startY;

        const isActive = idx === state.currentI || idx === state.currentJ;

        const borderColor = isActive ? '#e74c3c' : '#555555';
        const faceColor = isActive ? '#c0392b' : '#2a2a2a';
        const lineWidth = isActive ? 3 : 1;

        // Dibujar el fondo del recuadro
        ctx.fillStyle = faceColor;
        ctx.fillRect(x, y, boxSize, boxSize);

        // Dibujar el borde del recuadro
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, boxSize, boxSize);

        // Dibujar el texto numérico (blanco centrado)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val.toString(), x + boxSize / 2, y + boxSize / 2);
    });
}

/**
 * Controlador para la simulación (Pausa, Paso a paso y Ejecución automática)
 */
export class InsertionSortVisualizer {
    private sorter: Generator<SortState, void, unknown> | null = null;
    private isPaused: boolean = false;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public init(data: number[]): void {
        this.sorter = insertionSortGenerator(data);
        this.isPaused = false;
    }

    public pause(): void {
        this.isPaused = !this.isPaused;
        console.log(`Estado de pausa: ${this.isPaused}`);
    }

    public step(): void {
        if (this.sorter) {
            const result = this.sorter.next();
            if (!result.done && result.value) {
                drawFrame(this.canvas, result.value);
            } else {
                console.log("El algoritmo ha finalizado.");
            }
        }
    }

    public async runAuto(delayMs: number = 800): Promise<void> {
        if (!this.sorter) return;

        let result = this.sorter.next();
        while (!result.done) {
            if (result.value) {
                drawFrame(this.canvas, result.value);
            }

            // Espera simulada (delay)
            await new Promise((resolve) => setTimeout(resolve, delayMs));

            // Si se activa la pausa, detiene el bucle automático
            while (this.isPaused) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }

            result = this.sorter.next();
        }
    }
}