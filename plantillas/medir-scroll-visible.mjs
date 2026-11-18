/**
 * Lo que VE el ojo al bajar por una página: cuántos fotogramas llegan a pantalla con el scroll movido, y el parón
 * más largo. Nació de un caso real: con la aceleración por hardware apagada, una web con Lenis iba a 1,7 fotogramas
 * por segundo y cloudflare.com fluida.
 *
 * Por qué no vale contar los requestAnimationFrame: con el scroll del navegador (cloudflare.com), la página se mueve
 * en otro hilo aunque el código vaya a 2 fotogramas por segundo; con Lenis, el scroll lo mueve el código y va a lo
 * que vaya el hilo principal. Aquí se mira la emisión de pantalla de Chrome (Page.screencastFrame), que trae la
 * posición del scroll de cada fotograma pintado: vale igual para las dos. Comparar SIEMPRE contra una web de
 * referencia fluida (https://www.cloudflare.com/es-es/) en las mismas condiciones y en la misma tanda: si el
 * ordenador está cargado con otra cosa, la referencia baja también y se nota.
 *
 * Uso (con la web servida; para lo publicado, su dirección). Se lanza DESDE una carpeta que tenga playwright o
 * playwright-core en node_modules (el repo de la web, o una carpeta de pruebas): lo busca en la carpeta actual.
 *   node medir-scroll-visible.mjs <url> [veces=3] [cpu=6] [px=tres pantallas, o hasta el final si es más corta]
 *   SIN_GRAFICA=1 node medir-scroll-visible.mjs ...   (como la aceleración por hardware apagada en el navegador)
 *   ALMACEN='{"clave":"valor"}' ...                    (localStorage antes de cargar: avisos de cookies, ofertas)
 *   ESPERA=8000 ...                                    (ms entre cargar y bajar; 5000 si no se dice)
 *
 * Las dos medidas de la casa: SIN_GRAFICA=1 con CPU 6 (un ordenador sin gráfica) y sin SIN_GRAFICA con CPU 4 (un
 * portátil normal). Ventana de 1920x1080.
 *
 * Ojo, aprendido midiendo:
 *  · Chrome «sin pantalla» (headless, el de Lighthouse) dibuja CON la gráfica. El dibujo por software solo sale con
 *    SIN_GRAFICA, que lanza Chrome con --disable-gpu --disable-gpu-compositing (abre una ventana y la cierra sola).
 *  · Una página con un marco del MISMO origen (una demo servida en local) no se comporta como en producción (otro
 *    origen): en local salía un parón de 0,7 s que en producción no existía. Lo que dependa del marco, medirlo en la
 *    web publicada.
 */
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const [URL, VECES = "3", CPU = "6", PX] = process.argv.slice(2);
if (!URL) {
  console.error("Falta la dirección: node medir-scroll-visible.mjs <url> [veces] [cpu] [px]");
  process.exit(1);
}

const desde = createRequire(pathToFileURL(`${process.cwd()}/`).href);
let modulo = null;
for (const nombre of ["playwright", "playwright-core", "@playwright/test"]) {
  try {
    modulo = await import(pathToFileURL(desde.resolve(nombre)).href);
    break;
  } catch {
    /* el siguiente */
  }
}
const chromium = modulo?.chromium ?? modulo?.default?.chromium;
if (!chromium) {
  console.error("No encuentro playwright en esta carpeta: lánzalo desde una que lo tenga (pnpm add -D playwright-core).");
  process.exit(1);
}

const chrome = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => existsSync(p));
const browser = await chromium.launch({
  headless: false,
  ...(chrome ? { executablePath: chrome } : {}),
  args: process.env.SIN_GRAFICA ? ["--disable-gpu", "--disable-gpu-compositing"] : [],
});
const almacen = process.env.ALMACEN ? JSON.parse(process.env.ALMACEN) : {};

const res = [];
for (let v = 0; v < Number(VECES); v++) {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, locale: "es-ES" });
  await ctx.addInitScript((datos) => {
    try {
      for (const [k, val] of Object.entries(datos)) localStorage.setItem(k, String(val));
    } catch {
      /* sin almacén */
    }
  }, almacen);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await page.goto(URL, { waitUntil: "load" });
  // Como una persona: el ratón entra en la página antes de bajar. Lo que una web arranca «con lo primero que haga
  // la persona» (un fondo 3D, por ejemplo) se arranca aquí, y no a media bajada, que no es lo que pasa de verdad.
  await page.mouse.move(900, 500);
  await page.mouse.move(960, 600, { steps: 5 });
  await page.waitForTimeout(Number(process.env.ESPERA ?? 5000));
  if (v === 0) {
    const grafica = await page.evaluate(() =>
      Boolean(document.createElement("canvas").getContext("webgl", { failIfMajorPerformanceCaveat: true })),
    );
    const ligero = await page.evaluate(() => document.documentElement.hasAttribute("data-ligero"));
    console.log(
      `${URL} · dibujo ${grafica ? "con la tarjeta gráfica" : "por software (sin gráfica)"} · modo ligero ${ligero ? "puesto" : "no"} · CPU ${CPU}x más lenta · 1920x1080`,
    );
  }
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(CPU) });
  const px = PX
    ? Number(PX)
    : await page.evaluate(() => Math.round(Math.min(innerHeight * 3, document.documentElement.scrollHeight - innerHeight)));
  const cuadros = [];
  cdp.on("Page.screencastFrame", (f) => {
    cuadros.push({ t: f.metadata.timestamp * 1000, y: f.metadata.scrollOffsetY });
    cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 5, everyNthFrame: 1, maxWidth: 192, maxHeight: 108 });
  await page.waitForTimeout(400);
  const t0 = Date.now();
  await cdp.send("Input.synthesizeScrollGesture", { x: 960, y: 600, yDistance: -px, speed: 1200, gestureSourceType: "mouse" });
  let ultimo = -1;
  let quieto = 0;
  for (let i = 0; i < 60 && quieto < 3; i++) {
    await page.waitForTimeout(250);
    const y = await page.evaluate(() => Math.round(scrollY));
    quieto = y === ultimo ? quieto + 1 : 0;
    ultimo = y;
  }
  const t1 = Date.now();
  await cdp.send("Page.stopScreencast");
  const ventana = cuadros.filter((c) => c.t >= t0 && c.t <= t1);
  const movidos = [];
  let antes = ventana.length ? ventana[0].y : 0;
  for (const c of ventana) {
    if (Math.abs(c.y - antes) > 0.5) movidos.push(c);
    antes = c.y;
  }
  let paron = 0;
  for (let i = 1; i < movidos.length; i++) paron = Math.max(paron, movidos[i].t - movidos[i - 1].t);
  const seg = movidos.length > 1 ? (movidos.at(-1).t - movidos[0].t) / 1000 : 0;
  res.push({ fps: seg ? movidos.length / seg : 0, paron, px, llego: ultimo });
  await ctx.close();
}
await browser.close();
const media = (k) => (res.reduce((a, r) => a + r[k], 0) / res.length).toFixed(1);
console.log(
  `El scroll se ve a ${media("fps")} fotogramas por segundo; el parón más largo, ${media("paron")} ms (${res.length} pasadas, ${res[0].px} px: ${res
    .map((r) => `${r.fps.toFixed(1)}/${Math.round(r.paron)}`)
    .join(", ")}).`,
);
