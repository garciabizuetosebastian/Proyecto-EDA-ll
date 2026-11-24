(function () {
  const palettes = {
    violet: {
      css: {
        "--theme-bg": "#11131b",
        "--theme-surface": "#191c27",
        "--theme-raised": "#252a39",
        "--theme-border": "#34394b",
        "--theme-text": "#f1f3fa",
        "--theme-muted": "#a4aabd",
        "--theme-accent": "#a895ff",
        "--theme-accent-strong": "#7160c9",
        "--theme-accent-soft": "#302a4b",
        "--theme-range-track": "#373349",
        "--theme-canvas": "#11131b",
        "--theme-success": "#52c5a5",
        "--theme-success-dark": "#1d403b",
        "--theme-warning": "#e8c45f",
        "--theme-warning-dark": "#55451f"
      },
      colors: {
        fondo: "#11131b",
        normalFondo: "#25233a",
        normalBorde: "#514b78",
        normalTexto: "#edf0fa",
        rangoFondo: "#302a4b",
        rangoBorde: "#7160c9",
        rangoTexto: "#f1edff",
        compararFondo: "#514486",
        compararBorde: "#a895ff",
        compararTexto: "#ffffff",
        exitoFondo: "#1d403b",
        exitoBorde: "#52c5a5",
        exitoTexto: "#e6fff6",
        minimoFondo: "#55451f",
        minimoBorde: "#e8c45f",
        minimoTexto: "#fff8df",
        pivoteFondo: "#55451f",
        pivoteBorde: "#e8c45f",
        pivoteTexto: "#fff8df",
        menoresFondo: "#1d403b",
        menoresBorde: "#52c5a5",
        menoresTexto: "#e6fff6",
        mayoresFondo: "#302a4b",
        mayoresBorde: "#a895ff",
        mayoresTexto: "#f1edff",
        digitoColor: "#e8c45f",
        tenue: "#8990a3",
        cubetaFondo: "#181b25"
      }
    },
    ocean: {
      css: {
        "--theme-bg": "#10171d",
        "--theme-surface": "#17232a",
        "--theme-raised": "#20333c",
        "--theme-border": "#304752",
        "--theme-text": "#edf7fa",
        "--theme-muted": "#9eb4bc",
        "--theme-accent": "#6dd3e7",
        "--theme-accent-strong": "#39899b",
        "--theme-accent-soft": "#1c3b46",
        "--theme-range-track": "#29444d",
        "--theme-canvas": "#10171d",
        "--theme-success": "#52c5a5",
        "--theme-success-dark": "#1d403b",
        "--theme-warning": "#e8c45f",
        "--theme-warning-dark": "#55451f"
      },
      colors: {
        fondo: "#10171d",
        normalFondo: "#1d3038",
        normalBorde: "#3d6572",
        normalTexto: "#edf7fa",
        rangoFondo: "#1c3b46",
        rangoBorde: "#39899b",
        rangoTexto: "#e9fbff",
        compararFondo: "#285d6a",
        compararBorde: "#6dd3e7",
        compararTexto: "#f3fdff",
        exitoFondo: "#1d403b",
        exitoBorde: "#52c5a5",
        exitoTexto: "#e6fff6",
        minimoFondo: "#55451f",
        minimoBorde: "#e8c45f",
        minimoTexto: "#fff8df",
        pivoteFondo: "#55451f",
        pivoteBorde: "#e8c45f",
        pivoteTexto: "#fff8df",
        menoresFondo: "#1d403b",
        menoresBorde: "#52c5a5",
        menoresTexto: "#e6fff6",
        mayoresFondo: "#1c3b46",
        mayoresBorde: "#6dd3e7",
        mayoresTexto: "#e9fbff",
        digitoColor: "#e8c45f",
        tenue: "#78909a",
        cubetaFondo: "#162127"
      }
    },
    forest: {
      css: {
        "--theme-bg": "#111915",
        "--theme-surface": "#19241e",
        "--theme-raised": "#25342a",
        "--theme-border": "#35483a",
        "--theme-text": "#eff8f0",
        "--theme-muted": "#a3b6a5",
        "--theme-accent": "#7cdda6",
        "--theme-accent-strong": "#428c61",
        "--theme-accent-soft": "#203d2c",
        "--theme-range-track": "#2d4937",
        "--theme-canvas": "#111915",
        "--theme-success": "#56cdb2",
        "--theme-success-dark": "#194641",
        "--theme-warning": "#e8c45f",
        "--theme-warning-dark": "#55451f"
      },
      colors: {
        fondo: "#111915",
        normalFondo: "#20352a",
        normalBorde: "#42634d",
        normalTexto: "#eff8f0",
        rangoFondo: "#203d2c",
        rangoBorde: "#428c61",
        rangoTexto: "#ecfff2",
        compararFondo: "#326b49",
        compararBorde: "#7cdda6",
        compararTexto: "#f3fff7",
        exitoFondo: "#194641",
        exitoBorde: "#56cdb2",
        exitoTexto: "#e6fff8",
        minimoFondo: "#55451f",
        minimoBorde: "#e8c45f",
        minimoTexto: "#fff8df",
        pivoteFondo: "#55451f",
        pivoteBorde: "#e8c45f",
        pivoteTexto: "#fff8df",
        menoresFondo: "#194641",
        menoresBorde: "#56cdb2",
        menoresTexto: "#e6fff8",
        mayoresFondo: "#203d2c",
        mayoresBorde: "#7cdda6",
        mayoresTexto: "#ecfff2",
        digitoColor: "#e8c45f",
        tenue: "#83998a",
        cubetaFondo: "#18221c"
      }
    },
    sunset: {
      css: {
        "--theme-bg": "#1b1515",
        "--theme-surface": "#28201e",
        "--theme-raised": "#382925",
        "--theme-border": "#51403a",
        "--theme-text": "#fff3eb",
        "--theme-muted": "#c0a99b",
        "--theme-accent": "#ffad76",
        "--theme-accent-strong": "#b76b41",
        "--theme-accent-soft": "#493025",
        "--theme-range-track": "#583b2d",
        "--theme-canvas": "#1b1515",
        "--theme-success": "#6ac9a0",
        "--theme-success-dark": "#21473b",
        "--theme-warning": "#f0ca69",
        "--theme-warning-dark": "#65471d"
      },
      colors: {
        fondo: "#1b1515",
        normalFondo: "#392722",
        normalBorde: "#79513b",
        normalTexto: "#fff3eb",
        rangoFondo: "#493025",
        rangoBorde: "#b76b41",
        rangoTexto: "#fff2e8",
        compararFondo: "#8c5132",
        compararBorde: "#ffad76",
        compararTexto: "#fffaf5",
        exitoFondo: "#21473b",
        exitoBorde: "#6ac9a0",
        exitoTexto: "#e9fff4",
        minimoFondo: "#65471d",
        minimoBorde: "#f0ca69",
        minimoTexto: "#fff8df",
        pivoteFondo: "#65471d",
        pivoteBorde: "#f0ca69",
        pivoteTexto: "#fff8df",
        menoresFondo: "#21473b",
        menoresBorde: "#6ac9a0",
        menoresTexto: "#e9fff4",
        mayoresFondo: "#493025",
        mayoresBorde: "#ffad76",
        mayoresTexto: "#fff2e8",
        digitoColor: "#f0ca69",
        tenue: "#a48b7c",
        cubetaFondo: "#241b19"
      }
    },
    Black: {
      colorScheme: "dark",
      css: {
        "--theme-bg": "#050505",
        "--theme-surface": "#0d0d0d",
        "--theme-raised": "#171717",
        "--theme-border": "#2b2b2b",
        "--theme-text": "#f4f4f4",
        "--theme-muted": "#a3a3a3",
        "--theme-accent": "#d6d6d6",
        "--theme-accent-strong": "#8f8f8f",
        "--theme-accent-soft": "#242424",
        "--theme-range-track": "#383838",
        "--theme-canvas": "#050505",
        "--theme-success": "#64c9a7",
        "--theme-success-dark": "#193f37",
        "--theme-warning": "#e0bc72",
        "--theme-warning-dark": "#49391f"
      },
      colors: {
        fondo: "#050505",
        normalFondo: "#141414",
        normalBorde: "#383838",
        normalTexto: "#f4f4f4",
        rangoFondo: "#242424",
        rangoBorde: "#8f8f8f",
        rangoTexto: "#f4f4f4",
        compararFondo: "#333333",
        compararBorde: "#d6d6d6",
        compararTexto: "#ffffff",
        exitoFondo: "#193f37",
        exitoBorde: "#64c9a7",
        exitoTexto: "#e6fff6",
        minimoFondo: "#49391f",
        minimoBorde: "#e0bc72",
        minimoTexto: "#fff8df",
        pivoteFondo: "#49391f",
        pivoteBorde: "#e0bc72",
        pivoteTexto: "#fff8df",
        menoresFondo: "#193f37",
        menoresBorde: "#64c9a7",
        menoresTexto: "#e6fff6",
        mayoresFondo: "#242424",
        mayoresBorde: "#d6d6d6",
        mayoresTexto: "#f4f4f4",
        digitoColor: "#e0bc72",
        tenue: "#858585",
        cubetaFondo: "#101010"
      }
    },
    White: {
      colorScheme: "light",
      css: {
        "--theme-bg": "#f3f5f8",
        "--theme-surface": "#ffffff",
        "--theme-raised": "#e9edf3",
        "--theme-border": "#d4dbe6",
        "--theme-text": "#202635",
        "--theme-muted": "#606c80",
        "--theme-accent": "#5869c9",
        "--theme-accent-strong": "#4353ad",
        "--theme-accent-soft": "#e8ebfb",
        "--theme-range-track": "#d7dced",
        "--theme-canvas": "#f3f5f8",
        "--theme-success": "#21835f",
        "--theme-success-dark": "#d6f1e5",
        "--theme-warning": "#a66b08",
        "--theme-warning-dark": "#fbefcf"
      },
      colors: {
        fondo: "#f3f5f8",
        normalFondo: "#ffffff",
        normalBorde: "#c5cedc",
        normalTexto: "#202635",
        rangoFondo: "#e8ebfb",
        rangoBorde: "#5869c9",
        rangoTexto: "#303d8d",
        compararFondo: "#dce2ff",
        compararBorde: "#5869c9",
        compararTexto: "#202b69",
        exitoFondo: "#d6f1e5",
        exitoBorde: "#21835f",
        exitoTexto: "#15563f",
        minimoFondo: "#fbefcf",
        minimoBorde: "#a66b08",
        minimoTexto: "#684400",
        pivoteFondo: "#fbefcf",
        pivoteBorde: "#a66b08",
        pivoteTexto: "#684400",
        menoresFondo: "#d6f1e5",
        menoresBorde: "#21835f",
        menoresTexto: "#15563f",
        mayoresFondo: "#e8ebfb",
        mayoresBorde: "#5869c9",
        mayoresTexto: "#303d8d",
        digitoColor: "#a66b08",
        tenue: "#7b8493",
        cubetaFondo: "#e9edf3"
      }
    },
    wine: {
      colorScheme: "dark",
      css: {
        "--theme-bg": "#160d12",
        "--theme-surface": "#21131b",
        "--theme-raised": "#301d28",
        "--theme-border": "#543545",
        "--theme-text": "#f7eaf0",
        "--theme-muted": "#c0a5b2",
        "--theme-accent": "#e184a7",
        "--theme-accent-strong": "#a84d72",
        "--theme-accent-soft": "#422235",
        "--theme-range-track": "#553044",
        "--theme-canvas": "#160d12",
        "--theme-success": "#69caa3",
        "--theme-success-dark": "#1e4438",
        "--theme-warning": "#e9c36b",
        "--theme-warning-dark": "#51401f"
      },
      colors: {
        fondo: "#160d12",
        normalFondo: "#301d28",
        normalBorde: "#69465a",
        normalTexto: "#f7eaf0",
        rangoFondo: "#422235",
        rangoBorde: "#a84d72",
        rangoTexto: "#fbeaf1",
        compararFondo: "#71324d",
        compararBorde: "#e184a7",
        compararTexto: "#fff5f9",
        exitoFondo: "#1e4438",
        exitoBorde: "#69caa3",
        exitoTexto: "#e6fff5",
        minimoFondo: "#51401f",
        minimoBorde: "#e9c36b",
        minimoTexto: "#fff8e4",
        pivoteFondo: "#51401f",
        pivoteBorde: "#e9c36b",
        pivoteTexto: "#fff8e4",
        menoresFondo: "#1e4438",
        menoresBorde: "#69caa3",
        menoresTexto: "#e6fff5",
        mayoresFondo: "#422235",
        mayoresBorde: "#e184a7",
        mayoresTexto: "#fbeaf1",
        digitoColor: "#e9c36b",
        tenue: "#987c8a",
        cubetaFondo: "#21131b"
      }
    },
    purple: {
      colorScheme: "dark",
      css: {
        "--theme-bg": "#130e1b",
        "--theme-surface": "#1c1528",
        "--theme-raised": "#2a1e3e",
        "--theme-border": "#453355",
        "--theme-text": "#f3ecfb",
        "--theme-muted": "#b2a3c6",
        "--theme-accent": "#c394ff",
        "--theme-accent-strong": "#8052b6",
        "--theme-accent-soft": "#35254b",
        "--theme-range-track": "#463454",
        "--theme-canvas": "#130e1b",
        "--theme-success": "#69caa3",
        "--theme-success-dark": "#1e4438",
        "--theme-warning": "#e9c36b",
        "--theme-warning-dark": "#51401f"
      },
      colors: {
        fondo: "#130e1b",
        normalFondo: "#2a1e3e",
        normalBorde: "#594273",
        normalTexto: "#f3ecfb",
        rangoFondo: "#35254b",
        rangoBorde: "#8052b6",
        rangoTexto: "#f3eaff",
        compararFondo: "#57367b",
        compararBorde: "#c394ff",
        compararTexto: "#fffaff",
        exitoFondo: "#1e4438",
        exitoBorde: "#69caa3",
        exitoTexto: "#e6fff5",
        minimoFondo: "#51401f",
        minimoBorde: "#e9c36b",
        minimoTexto: "#fff8e4",
        pivoteFondo: "#51401f",
        pivoteBorde: "#e9c36b",
        pivoteTexto: "#fff8e4",
        menoresFondo: "#1e4438",
        menoresBorde: "#69caa3",
        menoresTexto: "#e6fff5",
        mayoresFondo: "#35254b",
        mayoresBorde: "#c394ff",
        mayoresTexto: "#f3eaff",
        digitoColor: "#e9c36b",
        tenue: "#9584a8",
        cubetaFondo: "#1c1528"
      }
    }
  };

  let activePalette = "violet";

  function applyPalette(name) {
    const palette = palettes[name];
    if (!palette) return;

    activePalette = name;
    Object.entries(palette.css).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
    document.documentElement.style.colorScheme = palette.colorScheme;
    document.documentElement.dataset.palette = name;
    window.dispatchEvent(new Event("sortlab-theme-change"));
  }

  const activeClawAnimations = new WeakMap();
  let velocidadReproduccion = 1;

  function crearControlVelocidad(contenedor) {
    const etiqueta = document.createElement("label");
    etiqueta.className = "sortlab-speed-control";
    etiqueta.append(document.createTextNode("Velocidad"));

    const entrada = document.createElement("input");
    entrada.type = "number";
    entrada.min = "0.25";
    entrada.max = "5";
    entrada.step = "0.25";
    entrada.value = String(velocidadReproduccion);
    entrada.setAttribute("aria-label", "Velocidad de reproducción");
    entrada.title = "1× es velocidad normal; 5× es el límite más rápido";

    const sufijo = document.createElement("span");
    sufijo.textContent = "×";
    etiqueta.append(entrada, sufijo);
    contenedor.append(etiqueta);

    const actualizar = () => {
      const valor = entrada.valueAsNumber;
      if (!Number.isFinite(valor) || valor < 0.25 || valor > 5) return;
      velocidadReproduccion = valor;
      window.dispatchEvent(new CustomEvent("sortlab-speed-change"));
    };

    entrada.addEventListener("input", actualizar);
    entrada.addEventListener("change", () => {
      const valor = entrada.valueAsNumber;
      if (!Number.isFinite(valor)) {
        entrada.value = String(velocidadReproduccion);
        return;
      }
      entrada.value = String(Math.min(5, Math.max(0.25, valor)));
      actualizar();
    });

    return entrada;
  }

  function dibujarGarrita(ctx, x, y, scale = 1, cierre = 1) {
    const tema = palettes[activePalette].colors;
    const apertura = 1 - cierre;
    const brazoX = 34 - 13 * cierre;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = tema.normalTexto;
    ctx.fillStyle = tema.normalFondo;

    ctx.beginPath();
    ctx.roundRect(-28, -52, 56, 13, 4);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-20, -39);
    ctx.lineTo(-20, -27);
    ctx.lineTo(20, -27);
    ctx.lineTo(20, -39);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-16, -27);
    ctx.lineTo(-12, -17);
    ctx.quadraticCurveTo(0, -8, 12, -17);
    ctx.lineTo(16, -27);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-11, -13);
    ctx.quadraticCurveTo(-15, -2, -23, 13);
    ctx.lineTo(-brazoX, 39 + 5 * apertura);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(11, -13);
    ctx.quadraticCurveTo(15, -2, 23, 13);
    ctx.lineTo(brazoX, 39 + 5 * apertura);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(0, 38 + 3 * apertura);
    ctx.stroke();
    ctx.restore();
  }

  function dibujarGarritas(canvas, puntos) {
    if (!puntos.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    for (const punto of puntos)
      dibujarGarrita(ctx, punto.x, punto.y, punto.scale, 1);
  }

  function animarIntercambio(canvas, movimientos, duracion = 1100) {
    if (!movimientos.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animacionAnterior = activeClawAnimations.get(canvas);
    if (animacionAnterior !== undefined)
      window.cancelAnimationFrame(animacionAnterior);

    const imagenBase = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const inicio = performance.now();
    let progresoAnterior = 0;
    const dibujarFrame = (ahora) => {
      ctx.putImageData(imagenBase, 0, 0);
      const progreso = Math.max(
        progresoAnterior,
        Math.min(1, (ahora - inicio) / (duracion / velocidadReproduccion))
      );
      progresoAnterior = progreso;
      const suave = progreso * progreso * (3 - 2 * progreso);
      const posiciones = movimientos.map((movimiento, indice) => ({
        movimiento,
        x: movimiento.x1 + (movimiento.x2 - movimiento.x1) * suave,
        y: movimiento.y1 + (movimiento.y2 - movimiento.y1) * suave
          + (movimientos.length > 1 ? (indice === 0 ? -8 : 8) * Math.sin(Math.PI * suave) : 0)
      }));

      ctx.fillStyle = palettes[activePalette].colors.fondo;
      for (const { movimiento } of posiciones) {
        for (const [x, y] of [
          [movimiento.x1, movimiento.limpiarY1 ?? movimiento.y1],
          [movimiento.x2, movimiento.limpiarY2 ?? movimiento.y2]
        ]) {
          const margen = 3;
          ctx.fillRect(
            x - movimiento.width / 2 - margen,
            y - movimiento.height / 2 - margen,
            movimiento.width + margen * 2,
            movimiento.height + margen * 2
          );
        }
      }

      for (const { movimiento, x, y } of posiciones) {
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, .35)";
        ctx.shadowBlur = 9;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = palettes[activePalette].colors.compararFondo;
        ctx.strokeStyle = palettes[activePalette].colors.compararBorde;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(
          x - movimiento.width / 2,
          y - movimiento.height / 2,
          movimiento.width,
          movimiento.height,
          8
        );
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.stroke();
        ctx.fillStyle = palettes[activePalette].colors.compararTexto;
        ctx.font = `bold ${movimiento.fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(movimiento.valor), x, y);
        ctx.restore();
      }

      for (const { movimiento, x, y } of posiciones) {
        dibujarGarrita(
          ctx,
          x,
          y - movimiento.height / 2 - 39 * movimiento.scale - 6,
          movimiento.scale,
          1
        );
      }

      if (progreso < 1) {
        activeClawAnimations.set(canvas, window.requestAnimationFrame(dibujarFrame));
      } else {
        ctx.putImageData(imagenBase, 0, 0);
        for (const movimiento of movimientos) {
          dibujarGarrita(
            ctx,
            movimiento.x2,
            movimiento.y2 - movimiento.height / 2 - 39 * movimiento.scale - 6,
            movimiento.scale,
            1
          );
        }
        activeClawAnimations.delete(canvas);
      }
    };

    activeClawAnimations.set(canvas, window.requestAnimationFrame(dibujarFrame));
  }

  window.SortLabTheme = {
    applyPalette,
    getPalette: function () {
      return palettes[activePalette].colors;
    },
    getPlaybackSpeed: function () {
      return velocidadReproduccion;
    },
    crearControlVelocidad,
    dibujarGarritas,
    animarIntercambio
  };

  window.addEventListener("message", function (event) {
    const message = event.data;
    if (event.source !== window.parent || !message || message.type !== "sortlab-theme") return;
    applyPalette(message.palette);
  });

  const requestedPalette = new URLSearchParams(window.location.search).get("palette");
  applyPalette(requestedPalette || "Black");
})();
