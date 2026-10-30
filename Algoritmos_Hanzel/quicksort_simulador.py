"""
Quick Sort — Simulación interactiva con Números
=====================================================================================

Simulador paso a paso del algoritmo Quick Sort (partición de Lomuto, con el
último elemento como pivote), con interfaz gráfica en Tkinter.

Comando para compilar el programa:
    python quicksort_simulador.py

No necesita instalar nada: Tkinter viene incluido con Python.
(En algunas instalaciones de Linux hay que instalarlo: sudo apt install python3-tk)
=====================================================================================
"""

import random
import re
import tkinter as tk


# 1. El algoritmo, registrando una "foto" de cada paso
def quicksort_pasos(valores):
    """Ejecuta quick sort y devuelve la lista de pasos.

    Cada paso es un diccionario con:
      orden : ids de las casillas, en el orden en que están ahora
      lo, hi: límites del subarreglo que se está procesando
      pv    : posición del pivote
      i     : última posición de la zona de "menores que el pivote"
      j     : posición del elemento que se está comparando
      sw    : True si en este paso se acaba de hacer un intercambio
      ord   : posiciones que ya están en su lugar definitivo
      txt   : explicación del paso
    """
    a = list(enumerate(valores))          # (id, valor): el id sigue a la casilla
    pasos = []
    ordenados = set()

    def foto(txt, lo=None, hi=None, pv=None, i=None, j=None, sw=False):
        pasos.append({
            "orden": [x[0] for x in a],
            "lo": lo, "hi": hi, "pv": pv, "i": i, "j": j, "sw": sw,
            "ord": set(ordenados),
            "txt": txt,
        })

    def qs(lo, hi):
        if lo > hi:
            return
        if lo == hi:
            ordenados.add(lo)
            foto(f"Un solo elemento: {a[lo][1]} ya está en su lugar.", lo, hi)
            return

        pivote = a[hi][1]
        foto(f"Subarreglo [{lo}..{hi}]. Elijo como pivote el último elemento: {pivote}.", lo, hi, hi)

        i = lo - 1
        for j in range(lo, hi):
            foto(f"Comparo {a[j][1]} con el pivote {pivote}.", lo, hi, hi, i, j)
            if a[j][1] < pivote:
                i += 1
                if i != j:
                    a[i], a[j] = a[j], a[i]
                    foto(f"{a[i][1]} < {pivote}: lo intercambio hacia la zona de menores (posición {i}).",
                         lo, hi, hi, i, j, sw=True)
                else:
                    foto(f"{a[i][1]} < {pivote}: ya está en la zona de menores.", lo, hi, hi, i, j)
            else:
                foto(f"{a[j][1]} ≥ {pivote}: se queda a la derecha.", lo, hi, hi, i, j)

        a[i + 1], a[hi] = a[hi], a[i + 1]
        p = i + 1
        ordenados.add(p)
        foto(f"Coloco el pivote {pivote} en su posición final: {p}.", lo, hi, p)

        qs(lo, p - 1)
        qs(p + 1, hi)

    foto("Arreglo inicial.")
    qs(0, len(a) - 1)
    foto("¡Arreglo ordenado!")
    return pasos


# 2. Colores: (relleno, borde, texto)
COLORES = {
    "normal": ("#2e2e2e", "#4a4a4a", "#ffffff"),
    "rng":    ("#2e2e2e", "#9a9a9a", "#ffffff"),   # subarreglo actual
    "out":    ("#222222", "#333333", "#6a6a6a"),   # fuera del subarreglo
    "low":    ("#0d47a1", "#42a5f5", "#ffffff"),   # menores que el pivote
    "cmp":    ("#8b0000", "#ff5252", "#ffffff"),   # comparando / intercambiando
    "pv":     ("#b45309", "#ffb74d", "#ffffff"),   # pivote
    "ok":     ("#1b5e20", "#66bb6a", "#ffffff"),   # ya en su lugar
}


def clasificar(paso, pos):
    """Devuelve la clave de color que le toca a la casilla en la posición `pos`."""
    lo, hi, i, j = paso["lo"], paso["hi"], paso["i"], paso["j"]
    if pos in paso["ord"]:
        return "ok"
    if pos == paso["pv"]:
        return "pv"
    if pos == j or (paso["sw"] and pos == i):
        return "cmp"
    if i is not None and lo is not None and lo <= pos <= i:
        return "low"
    if lo is not None and lo <= pos <= hi:
        return "rng"
    if lo is not None:
        return "out"
    return "normal"


# 3. La interfaz
class SimuladorQuickSort(tk.Tk):
    ANCHO, ALTO = 920, 190      # tamaño del panel oscuro
    Y_CASILLA, H_CASILLA = 46, 44
    INTERVALO_MS = 700          # tiempo entre pasos al reproducir
    CUADROS_ANIM = 8            # cuadros de la animación de deslizamiento

    def __init__(self):
        super().__init__()
        self.title("Quick Sort — Simulación interactiva con Números")
        self.resizable(False, False)

        self.pasos = []
        self.actual = 0
        self.timer = None       # id del after() de la reproducción
        self.anim = None        # id del after() de la animación de deslizamiento
        self.rects, self.textos, self.x = [], [], {}
        self.w = 40

        self._construir()
        self.generar_aleatorios()

    # construcción de la ventana
    def _construir(self):
        marco = tk.Frame(self, padx=16, pady=12)
        marco.pack()

        tk.Label(marco, text="Quick Sort — Simulación interactiva con Números",
                 font=("Segoe UI", 14, "bold")).pack(anchor="w", pady=(0, 8))

        fila1 = tk.Frame(marco)
        fila1.pack(anchor="w", pady=3)
        tk.Label(fila1, text="Cantidad de números (5 a 20):").pack(side="left")
        self.cantidad = tk.Spinbox(fila1, from_=5, to=20, width=4)
        self.cantidad.delete(0, "end")
        self.cantidad.insert(0, "12")
        self.cantidad.pack(side="left", padx=6)
        tk.Button(fila1, text="↻ Generar Nuevo", command=self.generar_aleatorios).pack(side="left")

        fila2 = tk.Frame(marco)
        fila2.pack(anchor="w", pady=3)
        tk.Label(fila2, text="O escribe los tuyos:").pack(side="left")
        self.entrada = tk.Entry(fila2, width=34)
        self.entrada.pack(side="left", padx=6)
        self.entrada.bind("<Return>", lambda e: self.usar_mios())
        tk.Button(fila2, text="Usar mis números", command=self.usar_mios).pack(side="left")
        tk.Label(fila2, text="(ej: 7, 2, 9, 4, 1, 8)", fg="#888").pack(side="left", padx=6)

        self.lienzo = tk.Canvas(marco, width=self.ANCHO, height=self.ALTO,
                                bg="#1c1c1c", highlightthickness=0)
        self.lienzo.pack(pady=10)
        self.id_marca = self.lienzo.create_text(0, 0, text="▲ pivote", fill="#ffb74d",
                                                font=("Segoe UI", 9, "bold"), state="hidden")
        self.id_texto = self.lienzo.create_text(self.ANCHO / 2, self.ALTO - 30, text="",
                                                fill="#e0e0e0", font=("Segoe UI", 12),
                                                width=self.ANCHO - 40, justify="center")

        controles = tk.Frame(marco)
        controles.pack(fill="x")
        self.btn_ant = tk.Button(controles, text="⏮ Anterior", command=self.anterior)
        self.btn_ant.pack(side="left")
        self.btn_play = tk.Button(controles, text="▶ Reproducir", command=self.alternar_reproduccion)
        self.btn_play.pack(side="left", padx=8)
        self.btn_sig = tk.Button(controles, text="Siguiente ⏭", command=self.siguiente)
        self.btn_sig.pack(side="left")
        self.contador = tk.Label(controles, text="Paso: 1 / 1", fg="#555", font=("Segoe UI", 10))
        self.contador.pack(side="right")

        leyenda = tk.Frame(marco)
        leyenda.pack(anchor="w", pady=(10, 0))
        for clave, nombre in (("pv", "pivote"), ("cmp", "comparando / intercambiando"),
                              ("low", "menores que el pivote"), ("rng", "subarreglo actual"),
                              ("ok", "ya en su lugar")):
            relleno, borde, _ = COLORES[clave]
            tk.Label(leyenda, bg=relleno, highlightbackground=borde, highlightthickness=2,
                     width=1, height=1).pack(side="left", padx=(0, 4))
            tk.Label(leyenda, text=nombre, font=("Segoe UI", 9), fg="#444").pack(side="left", padx=(0, 14))

    # cargar datos
    def cargar(self, valores):
        self._pausar()
        self._cancelar_animacion()
        self.pasos = quicksort_pasos(valores)

        # borrar casillas anteriores y crear las nuevas
        for r, t in zip(self.rects, self.textos):
            self.lienzo.delete(r)
            self.lienzo.delete(t)
        n = len(valores)
        slot = self.ANCHO / n
        self.w = max(24, min(46, slot - 6))
        self.rects, self.textos, self.x = [], [], {}
        for idx, v in enumerate(valores):
            r = self.lienzo.create_rectangle(0, 0, 1, 1, width=2)
            t = self.lienzo.create_text(0, 0, text=str(v), fill="#ffffff", font=("Segoe UI", 12, "bold"))
            self.rects.append(r)
            self.textos.append(t)
            self.x[idx] = self._x_de(idx, n)
            self._poner_x(idx, self.x[idx])
        self.lienzo.tag_raise(self.id_marca)
        self.mostrar(0, animar=False)

    def generar_aleatorios(self):
        try:
            n = int(self.cantidad.get())
        except ValueError:
            n = 12
        n = max(5, min(20, n))
        self.cantidad.delete(0, "end")
        self.cantidad.insert(0, str(n))
        self.cargar([random.randint(1, 99) for _ in range(n)])

    def usar_mios(self):
        partes = [p for p in re.split(r"[\s,;]+", self.entrada.get()) if p]
        try:
            valores = [int(p) for p in partes]
        except ValueError:
            valores = []
        if not 2 <= len(valores) <= 20:
            self.lienzo.itemconfig(self.id_texto, text="Escribe entre 2 y 20 números enteros separados por comas.")
            return
        self.cargar(valores)

    # dibujo 
    def _x_de(self, pos, n):
        slot = self.ANCHO / n
        return pos * slot + (slot - self.w) / 2

    def _poner_x(self, idc, x):
        self.x[idc] = x
        y = self.Y_CASILLA
        self.lienzo.coords(self.rects[idc], x, y, x + self.w, y + self.H_CASILLA)
        self.lienzo.coords(self.textos[idc], x + self.w / 2, y + self.H_CASILLA / 2)

    def _cancelar_animacion(self):
        if self.anim:
            self.after_cancel(self.anim)
            self.anim = None

    def _animar(self, destinos):
        """Desliza cada casilla desde donde está hasta su nuevo lugar."""
        self._cancelar_animacion()
        inicio = dict(self.x)

        def cuadro(k):
            t = k / self.CUADROS_ANIM
            t = t * t * (3 - 2 * t)                 # arranque y frenado suaves
            for idc, xd in destinos.items():
                self._poner_x(idc, inicio[idc] + (xd - inicio[idc]) * t)
            self.anim = self.after(30, cuadro, k + 1) if k < self.CUADROS_ANIM else None

        cuadro(1)

    def mostrar(self, k, animar=True):
        self.actual = k
        paso = self.pasos[k]
        n = len(self.rects)

        destinos = {}
        for pos, idc in enumerate(paso["orden"]):
            relleno, borde, texto = COLORES[clasificar(paso, pos)]
            self.lienzo.itemconfig(self.rects[idc], fill=relleno, outline=borde)
            self.lienzo.itemconfig(self.textos[idc], fill=texto)
            destinos[idc] = self._x_de(pos, n)

        if animar:
            self._animar(destinos)
        else:
            for idc, xd in destinos.items():
                self._poner_x(idc, xd)

        # marca "▲ pivote" bajo la casilla del pivote (mientras no esté colocado)
        pv = paso["pv"]
        if pv is not None and pv not in paso["ord"]:
            self.lienzo.coords(self.id_marca, self._x_de(pv, n) + self.w / 2,
                               self.Y_CASILLA + self.H_CASILLA + 16)
            self.lienzo.itemconfig(self.id_marca, state="normal")
        else:
            self.lienzo.itemconfig(self.id_marca, state="hidden")

        self.lienzo.itemconfig(self.id_texto, text=paso["txt"])
        self.contador.config(text=f"Paso: {k + 1} / {len(self.pasos)}")
        self.btn_ant.config(state="normal" if k > 0 else "disabled")
        self.btn_sig.config(state="normal" if k < len(self.pasos) - 1 else "disabled")

    # navegación
    def anterior(self):
        self._pausar()
        if self.actual > 0:
            self.mostrar(self.actual - 1)

    def siguiente(self):
        self._pausar()
        if self.actual < len(self.pasos) - 1:
            self.mostrar(self.actual + 1)

    def alternar_reproduccion(self):
        if self.timer:
            self._pausar()
        else:
            if self.actual >= len(self.pasos) - 1:
                self.mostrar(0)
            self.btn_play.config(text="⏸ Pausar")
            self.timer = self.after(self.INTERVALO_MS, self._tick)

    def _tick(self):
        self.timer = None
        self.mostrar(self.actual + 1)
        if self.actual >= len(self.pasos) - 1:
            self.btn_play.config(text="▶ Reproducir")
        else:
            self.timer = self.after(self.INTERVALO_MS, self._tick)

    def _pausar(self):
        if self.timer:
            self.after_cancel(self.timer)
            self.timer = None
        self.btn_play.config(text="▶ Reproducir")


if __name__ == "__main__":
    SimuladorQuickSort().mainloop()
