/* ------------------------------
   UTILIDADES
------------------------------ */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

/* ------------------------------
   HERO / LETRAS RANDOM
------------------------------ */

const splitElements = document.querySelectorAll(".split-random");

splitElements.forEach((element) => {
  const text = element.dataset.split || element.textContent.trim();
  element.innerHTML = "";

  const words = text.split(/\s+/);
  let charIndex = 0;

  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.classList.add("word");

    [...word].forEach((letter) => {
      const span = document.createElement("span");

      span.textContent = letter;
      span.classList.add("char");
      span.style.setProperty("--i", charIndex);
      span.style.setProperty("--random-y", Math.floor(Math.random() * 70) - 35);
      span.style.setProperty("--random-r", Math.floor(Math.random() * 24) - 12);

      wordSpan.appendChild(span);
      charIndex += 1;
    });

    element.appendChild(wordSpan);

    if (wordIndex < words.length - 1) {
      element.appendChild(document.createTextNode(" "));
      charIndex += 1;
    }
  });
});

/* ------------------------------
   REVEAL GENERAL
------------------------------ */

const revealItems = document.querySelectorAll(".reveal, .split-random");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px"
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

/* ------------------------------
   PARALLAX HERO
------------------------------ */

const parallaxItems = document.querySelectorAll("[data-parallax]");

function updateParallax() {
  const scrollY = window.scrollY;

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax) || 0.1;
    item.style.transform = `translateY(${scrollY * speed}px)`;
  });
}

/* ------------------------------
   TEXTO LIGADO AL SCROLL / SECCIÓN 00
------------------------------ */

const scrollWordBlocks = document.querySelectorAll(".scroll-words");

scrollWordBlocks.forEach((block) => {
  const text = block.dataset.text || block.textContent.trim();
  const parts = text
  .split(/(\[br\])/g)
  .flatMap((part) => {
    if (part === "[br]") return ["[br]"];
    return part.trim().split(/\s+/).filter(Boolean);
  });

block.innerHTML = "";

parts.forEach((part) => {
  if (part === "[br]") {
    block.appendChild(document.createElement("br"));
    return;
  }

  const span = document.createElement("span");
  span.classList.add("scroll-word");
  span.textContent = part + "\u00A0";
  block.appendChild(span);
});
});

function updateScrollWords() {
  scrollWordBlocks.forEach((block) => {
    const section = block.closest(".quote-section");

    if (!section) return;

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const totalScroll = rect.height - viewportHeight;
    const currentScroll = clamp(-rect.top, 0, totalScroll);
    const progress = totalScroll > 0 ? currentScroll / totalScroll : 0;

    const words = block.querySelectorAll(".scroll-word");
    const blockIndex = [...scrollWordBlocks].indexOf(block);

    words.forEach((word, index) => {
      const wordStart = blockIndex === 0
        ? (index / words.length) * 0.42
        : 0.34 + (index / words.length) * 0.48;

      const wordEnd = wordStart + 0.16;
      const localProgress = clamp((progress - wordStart) / (wordEnd - wordStart), 0, 1);

      const eased = 1 - Math.pow(1 - localProgress, 3);

      word.style.opacity = 0.08 + eased * 0.92;
      word.style.transform = `translateY(${(1 - eased) * 28}px) scale(${0.96 + eased * 0.04})`;
      word.style.filter = `blur(${(1 - eased) * 8}px)`;
    });
  });
}

/* ------------------------------
   ANATOMÍA / PANTALLA COMPLETA + ZOOM
------------------------------ */

const anatomyFullscreenSection = document.querySelector(".anatomy-fullscreen-section");
const anatomyImageStage = document.querySelector(".anatomy-fullscreen-image-stage");
const anatomyFirstImage = document.querySelector(".anatomy-image-first");
const anatomySecondImage = document.querySelector(".anatomy-image-second");
const anatomyCopySteps = document.querySelectorAll(".anatomy-copy-step");
const anatomyProgressBar = document.querySelector(".anatomy-progress");
const anatomyScreenHeader = document.querySelector(".anatomy-screen-header");
const firstBannerAnnotation = document.querySelector(".anatomy-annotation-first-banner");
const firstBannerTextLines = document.querySelector(".anatomy-text-lines-first");
const firstBannerButtonLine = document.querySelector(".anatomy-button-line-first");

const anatomyFullscreenStates = [
  /* ------------------------------
     PRIMERA IMAGEN / BANNER PRINCIPAL
  ------------------------------ */

  {
    layer: "first",
    scale: 1,
    x: 0,
    y: 0
  },
  {
    layer: "first",
    scale: 1.58,
    x: 0,
    y: 0
  },
  {
    layer: "first",
    scale: 1.58,
    x: 0,
    y: -10
  },
  {
    layer: "first",
    scale: 2.22,
    x: 0,
    y: -19
  },
  {
    layer: "first",
    scale: 2.52,
    x: 0,
    y: -21
  },
  {
    layer: "first",
    scale: 2.52,
    x: 0,
    y: -21
  },
  {
    layer: "first",
    scale: 2.52,
    x: 0,
    y: -21
  },

  /* ------------------------------
     SEGUNDA IMAGEN / 2CAPA.PNG

     Texto 1:
     Segunda capa
     → vista completa de la imagen
  ------------------------------ */

  {
    layer: "second",
    scale: 1.22,
    x: 0,
    y: 0
  },

  /* ------------------------------
     Texto 2:
     Información previa
     → zoom al texto principal del banner
  ------------------------------ */

  {
    layer: "second",
    scale: 2.18,
    x: 4,
    y: 24
  },

  /* ------------------------------
     Texto 3:
     Categorías de cookies
  ------------------------------ */

  {
    layer: "second",
    scale: 2.35,
    x: 27,
    y: -4
  },

  /* ------------------------------
     Texto 4:
     Acciones visibles
     Aceptar / guardar configuración / rechazar
  ------------------------------ */

  {
    layer: "second",
    scale: 2.62,
    x: 3,
    y: -38
  },

  /* ------------------------------
     Texto 5:
     Interruptores
  ------------------------------ */

  {
    layer: "second",
    scale: 2.22,
    x: -30,
    y: 8
  },

  /* ------------------------------
     Texto 6:
     Opciones activadas o desactivadas
     → mismo zoom de interruptores para evitar salto
  ------------------------------ */

  {
    layer: "second",
    scale: 2.22,
    x: -30,
    y: 8
  }
];

const textByVisualStep = [
  -1, // 0
  0,  // 1
  0,  // 2
  1,  // 3
  2,  // 4
  2,  // 5
  2,  // 6

  3,  // 7  Segunda capa / vista completa
  4,  // 8  Información previa / zoom texto principal
  5,  // 9  Categorías de cookies
  6,  // 10 Acciones visibles
  7,  // 11 Interruptores
  8   // 12 Opciones activadas o desactivadas
];

function updateFullscreenAnatomy() {
  if (
    !anatomyFullscreenSection ||
    !anatomyImageStage ||
    !anatomyFirstImage ||
    !anatomySecondImage
  ) return;

  const rect = anatomyFullscreenSection.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  const totalScroll = rect.height - viewportHeight;
  const currentScroll = clamp(-rect.top, 0, totalScroll);
  const progress = totalScroll > 0 ? currentScroll / totalScroll : 0;

  const maxIndex = anatomyFullscreenStates.length - 1;
  const rawIndex = progress * maxIndex;
  const currentIndex = Math.min(Math.floor(rawIndex), maxIndex - 1);
  const nextIndex = Math.min(currentIndex + 1, maxIndex);

  const localProgress = rawIndex - currentIndex;
  const eased = localProgress < 0.5
    ? 2 * localProgress * localProgress
    : 1 - Math.pow(-2 * localProgress + 2, 2) / 2;

  const currentState = anatomyFullscreenStates[currentIndex];
  const nextState = anatomyFullscreenStates[nextIndex];

  const visualStep = Math.round(rawIndex);
  const activeVisualState = anatomyFullscreenStates[visualStep] || anatomyFullscreenStates[0];

  const firstIsActive = activeVisualState.layer === "first";

  anatomyFirstImage.classList.toggle("is-visible", firstIsActive);
  anatomySecondImage.classList.toggle("is-visible", !firstIsActive);

  let scale = currentState.scale;
  let x = currentState.x;
  let y = currentState.y;

  if (currentState.layer === nextState.layer) {
    scale = lerp(currentState.scale, nextState.scale, eased);
    x = lerp(currentState.x, nextState.x, eased);
    y = lerp(currentState.y, nextState.y, eased);
  } else {
    scale = activeVisualState.scale;
    x = activeVisualState.x;
    y = activeVisualState.y;
  }

  anatomyImageStage.style.setProperty("--anatomy-scale", scale);
  anatomyImageStage.style.setProperty("--anatomy-x", `${x}%`);
  anatomyImageStage.style.setProperty("--anatomy-y", `${y}%`);

  const activeTextStep = textByVisualStep[visualStep] ?? -1;

  anatomyCopySteps.forEach((step, index) => {
    const isActive = index === activeTextStep;

    step.classList.toggle("is-active", isActive);

    /*
      Tercer texto: "Opciones visibles".
      Movimiento ligado al scroll.
      Solo se mueve en horizontal, desde su posición inicial hacia la izquierda.
    */
    if (index === 2) {
      const thirdTextProgress = clamp((rawIndex - 3.5) / 3, 0, 1);
      const thirdTextX = lerp(0, -1200, thirdTextProgress);

      step.style.setProperty("--copy-slide-x", `${thirdTextX}px`);
    } else {
      step.style.setProperty("--copy-slide-x", "0px");
    }
  });

  if (anatomyScreenHeader) {
    anatomyScreenHeader.classList.toggle("is-faded", visualStep >= 3);
  }

  if (firstBannerAnnotation) {
    const annotationIsVisible = firstIsActive && activeTextStep === 0;

    firstBannerAnnotation.classList.toggle("is-visible", annotationIsVisible);

    if (annotationIsVisible) {
      const annotationProgress = clamp((rawIndex - 0.5) / 2, 0, 1);
      const orbitAmount = 200;
      const offset = -annotationProgress * orbitAmount;

      firstBannerAnnotation.style.setProperty("--annotation-offset-one", offset.toFixed(2));
    }
  }

  if (firstBannerTextLines) {
    const linesAreVisible = firstIsActive && activeTextStep === 1;
    firstBannerTextLines.classList.toggle("is-visible", linesAreVisible);
  }

  if (firstBannerButtonLine) {
    const buttonLineIsVisible = firstIsActive && activeTextStep === 2;
    firstBannerButtonLine.classList.toggle("is-visible", buttonLineIsVisible);
  }

  if (anatomyProgressBar) {
    anatomyProgressBar.style.setProperty("--anatomy-progress", progress);
  }
}

/* ------------------------------
   VENTANA FALSA / SÍNTESIS FINAL
------------------------------ */

const fakePopupTriggers = document.querySelectorAll(".synthesis-popup-trigger");
const fakePopupWindow = document.querySelector(".fake-popup-window");
const fakePopupClose = document.querySelector(".fake-popup-close");
const fakePopupUrl = document.querySelector(".fake-popup-url");
const fakePages = document.querySelectorAll(".fake-webpage");

/* Cookie CUIDAR */
const careScreens = document.querySelectorAll(".care-cookie-screen");
const careConfigButtons = document.querySelectorAll("[data-care-config]");
const careCloseButtons = document.querySelectorAll("[data-care-close]");
const careConfigRows = document.querySelectorAll(".care-config-row");

/* Cookie EMPUJAR */
const pushScreens = document.querySelectorAll(".push-cookie-screen");
const pushConfigButtons = document.querySelectorAll("[data-push-config]");
const pushAcceptButtons = document.querySelectorAll("[data-push-accept]");
const pushCloseButtons = document.querySelectorAll("[data-push-close]");
const pushConfigRows = document.querySelectorAll(".push-config-row");

let fakePopupTimer = null;
let cookieDelayTimer = null;

/* ------------------------------
   CUIDAR
------------------------------ */

function showCareScreen(screenName) {
  careScreens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.careScreen === screenName);
  });
}

function hideCareCookie() {
  careScreens.forEach((screen) => {
    screen.classList.remove("is-active");
  });
}

function resetCareCookie() {
  hideCareCookie();

  document.querySelectorAll(".care-toggle").forEach((toggle, index) => {
    toggle.classList.toggle("is-on", index === 0);
  });
}

/* ------------------------------
   EMPUJAR
------------------------------ */

function showPushScreen(screenName) {
  pushScreens.forEach((screen) => {
    const isActive = screen.dataset.pushScreen === screenName;

    screen.classList.toggle("is-active", isActive);

    if (isActive) {
      screen.removeAttribute("hidden");
    } else {
      screen.setAttribute("hidden", "");
    }
  });
}

function hidePushCookie() {
  pushScreens.forEach((screen) => {
    screen.classList.remove("is-active");
    screen.setAttribute("hidden", "");
  });
}

function resetPushCookie() {
  hidePushCookie();

  document.querySelectorAll(".push-toggle").forEach((toggle) => {
    toggle.classList.add("is-on");
  });
}

/* ------------------------------
   POPUP GENERAL
------------------------------ */

function clearPopupTimers() {
  if (fakePopupTimer) {
    clearTimeout(fakePopupTimer);
    fakePopupTimer = null;
  }

  if (cookieDelayTimer) {
    clearTimeout(cookieDelayTimer);
    cookieDelayTimer = null;
  }
}

function renderFakePopupContent(mode, url) {
  if (fakePopupUrl) {
    fakePopupUrl.textContent = url;
  }

  fakePages.forEach((page) => {
    page.classList.toggle("is-active", page.dataset.fakePage === mode);
  });

  if (fakePopupWindow) {
    fakePopupWindow.classList.toggle("is-empujar", mode === "empujar");
    fakePopupWindow.classList.toggle("is-cuidar", mode === "cuidar");
  }

  resetCareCookie();
  resetPushCookie();
}

function openFakePopup(button) {
  if (!fakePopupWindow) return;

  const mode = button.dataset.fakePopupMode;
  const url = button.dataset.fakePopupUrl || "https://cookie.com/";

  clearPopupTimers();
  renderFakePopupContent(mode, url);

  fakePopupTriggers.forEach((item) => {
    item.classList.remove("is-active");
  });

  button.classList.add("is-active");

  fakePopupWindow.classList.add("is-visible", "is-loading");
  fakePopupWindow.classList.remove("is-loaded");
  fakePopupWindow.setAttribute("aria-hidden", "false");

  fakePopupWindow
    .closest(".synthesis-section")
    ?.classList.add("has-fake-popup-open");

  document.documentElement.classList.add("is-fake-popup-open");
  document.body.classList.add("is-fake-popup-open");

  fakePopupTimer = setTimeout(() => {
    fakePopupWindow.classList.remove("is-loading");
    fakePopupWindow.classList.add("is-loaded");

    cookieDelayTimer = setTimeout(() => {
      if (mode === "cuidar") {
        showCareScreen("intro");
      }

      if (mode === "empujar") {
        showPushScreen("intro");
      }
    }, 2500);
  }, 1400);
}

function closeFakePopup() {
  if (!fakePopupWindow) return;

  clearPopupTimers();

  fakePopupWindow.classList.remove(
    "is-visible",
    "is-loading",
    "is-loaded",
    "is-empujar",
    "is-cuidar"
  );

  fakePopupWindow.setAttribute("aria-hidden", "true");

  fakePopupWindow
    .closest(".synthesis-section")
    ?.classList.remove("has-fake-popup-open");

  document.documentElement.classList.remove("is-fake-popup-open");
  document.body.classList.remove("is-fake-popup-open");

  fakePopupTriggers.forEach((item) => {
    item.classList.remove("is-active");
  });

  resetCareCookie();
  resetPushCookie();
}

/* ------------------------------
   EVENTOS POPUP
------------------------------ */

fakePopupTriggers.forEach((button) => {
  button.addEventListener("click", () => {
    openFakePopup(button);
  });
});

if (fakePopupClose) {
  fakePopupClose.addEventListener("click", closeFakePopup);
}

/* ------------------------------
   EVENTOS CUIDAR
------------------------------ */

careConfigButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showCareScreen("config");
  });
});

careCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeFakePopup();
  });
});

careConfigRows.forEach((row) => {
  row.addEventListener("click", () => {
    const toggle = row.querySelector(".care-toggle");

    if (toggle) {
      toggle.classList.toggle("is-on");
    }
  });
});

/* ------------------------------
   EVENTOS EMPUJAR
------------------------------ */

pushConfigButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    showPushScreen("config");
  });
});

pushAcceptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeFakePopup();
  });
});

pushCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeFakePopup();
  });
});

pushConfigRows.forEach((row) => {
  row.addEventListener("click", () => {
    const toggle = row.querySelector(".push-toggle");

    if (toggle) {
      toggle.classList.toggle("is-on");
    }
  });
});

/* ------------------------------
   INTRO CORTINILLA
------------------------------ */

const introCurtainSection = document.querySelector(".intro-curtain-section");
const introCurtainOrange = document.querySelector(".intro-curtain-orange");
const introEyePupils = document.querySelectorAll(".intro-eyes .pupil");

function updateIntroCurtain() {
  if (!introCurtainSection || !introCurtainOrange) return;

  const rect = introCurtainSection.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  const totalScroll = rect.height - viewportHeight;
  const currentScroll = clamp(-rect.top, 0, totalScroll);
  const progress = totalScroll > 0 ? currentScroll / totalScroll : 0;

  const curtainProgress = clamp((progress - 0.25) / 0.47, 0, 1);
  const eased = 1 - Math.pow(1 - curtainProgress, 3);

  introCurtainOrange.style.transform = `translateY(${-eased * 100}%)`;
}

function updateIntroEyes() {
  if (!introCurtainSection || !introEyePupils.length) return;

  const rect = introCurtainSection.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  const totalScroll = rect.height - viewportHeight;
  const currentScroll = clamp(-rect.top, 0, totalScroll);
  const progress = totalScroll > 0 ? currentScroll / totalScroll : 0;

  /*
    Al principio miran hacia el texto.
    Al final bajan la mirada antes de pasar a la siguiente sección.
  */
  const eyeProgress = clamp((progress - 0.46) / 0.38, 0, 1);

  const eased = eyeProgress < 0.5
    ? 2 * eyeProgress * eyeProgress
    : 1 - Math.pow(-2 * eyeProgress + 2, 2) / 2;

const x = lerp(16, 8, eased);
const y = lerp(-8, 18, eased);

/*
  Brillo blanco:
  empieza arriba-derecha
  y termina abajo-derecha, un poco más desplazado.
*/
const shineX = lerp(9, 11, eased);
const shineY = lerp(-2, 12, eased);

introEyePupils.forEach((pupil) => {
  pupil.style.transform = `translate(${x}px, ${y}px)`;
  pupil.style.setProperty("--shine-x", `${shineX}px`);
  pupil.style.setProperty("--shine-y", `${shineY}px`);
});
}
/* ------------------------------
   LOOP DE SCROLL OPTIMIZADO
------------------------------ */

let ticking = false;

function updateOnScroll() {
  updateParallax();
  updateScrollWords();
  updateFullscreenAnatomy();
  updateIntroCurtain();
  updateIntroEyes();
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
});

window.addEventListener("resize", () => {
  updateScrollWords();
  updateFullscreenAnatomy();
  updateIntroCurtain();
  updateIntroEyes();
});

window.addEventListener("load", () => {
  updateParallax();
  updateScrollWords();
  updateFullscreenAnatomy();
  updateIntroCurtain();
  updateIntroEyes();
});

updateParallax();
updateScrollWords();
updateFullscreenAnatomy();
updateIntroCurtain();
updateIntroEyes();

/* ------------------------------
   DATOS 09 / CONTADOR PORCENTAJES
------------------------------ */

const dataItems = document.querySelectorAll(".data-editorial-item");

const dataCounterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const item = entry.target;
      const number = item.querySelector(".data-bar strong");

      if (!number || item.dataset.counted === "true") return;

      item.dataset.counted = "true";

      const finalValue = parseInt(number.textContent, 10);
      let currentValue = 0;

      const duration = 1100;
      const steps = 18;
      const increment = finalValue / steps;
      const stepTime = duration / steps;

      const counter = setInterval(() => {
        currentValue += increment;

        if (currentValue >= finalValue) {
          number.textContent = `${finalValue}%`;
          clearInterval(counter);
        } else {
          number.textContent = `${Math.round(currentValue)}%`;
        }
      }, stepTime);
    });
  },
  {
    threshold: 0.35
  }
);

dataItems.forEach((item) => {
  dataCounterObserver.observe(item);
});

/* ------------------------------
   DATOS 09 / BARRAS CON SCROLL
------------------------------ */

const editorialDataItems = document.querySelectorAll(".data-editorial-item");

function updateDataBarsOnScroll() {
  editorialDataItems.forEach((item) => {
    const bar = item.querySelector(".data-bar");
    const number = item.querySelector(".data-bar strong");

    if (!bar || !number) return;

    const rect = item.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    /*
      La barra empieza a cargar cuando entra por abajo
      y termina antes de llegar al centro.
    */
    const progress = clamp(
      (viewportHeight - rect.top) / (viewportHeight * 0.80),
      0,
      1
    );

    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const targetValue = parseFloat(
      getComputedStyle(item).getPropertyValue("--value")
    );

    const currentValue = Math.round(targetValue * eased);

    bar.style.setProperty("--fill", `${targetValue * eased}%`);
    bar.style.setProperty("--number-opacity", eased > 0.03 ? 1 : 0);

    number.textContent = `${currentValue}%`;

    item.classList.toggle("is-loading", eased > 0.03);
  });
}

window.addEventListener("scroll", updateDataBarsOnScroll, { passive: true });
window.addEventListener("resize", updateDataBarsOnScroll);
window.addEventListener("load", updateDataBarsOnScroll);

updateDataBarsOnScroll();

/* ------------------------------
   01 / COOKIE STORY CON SCROLL
------------------------------ */

const cookieStorySection = document.querySelector(".cookie-story-section");

function updateCookieStory() {
  if (!cookieStorySection) return;

  const rect = cookieStorySection.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  const totalScroll = rect.height - viewportHeight;
  const currentScroll = clamp(-rect.top, 0, totalScroll);
  const progress = totalScroll > 0 ? currentScroll / totalScroll : 0;

  let step = 0;

/* Primero no aparece nada.
   Luego aparece 01/ WEB al hacer scroll. */
if (progress > 0.12) {
  step = 1;
}

if (progress > 0.42) {
  step = 2;
}

if (progress > 0.72) {
  step = 3;
}

cookieStorySection.dataset.cookieStep = step;
}

window.addEventListener("scroll", updateCookieStory, { passive: true });
window.addEventListener("resize", updateCookieStory);
window.addEventListener("load", updateCookieStory);

updateCookieStory();

/* ------------------------------
   01B / COOKIE SISTEMA SOLAR
   Independiente de la sección 01 anterior
------------------------------ */

(() => {
  const solarSection = document.querySelector(".memory-solar-section");

  if (!solarSection) return;

  const solarSystem = solarSection.querySelector(".memory-solar-system");
  const planets = [...solarSection.querySelectorAll(".memory-solar-planet")];
  const rings = [...solarSection.querySelectorAll(".memory-solar-ring")];

  const caption = solarSection.querySelector(".memory-solar-caption");
  const captionTitle = solarSection.querySelector(".memory-solar-caption-title");
  const captionText = solarSection.querySelector(".memory-solar-caption-text");

  if (!solarSystem || !planets.length || !rings.length || !caption || !captionTitle || !captionText) return;

  function solarClamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function updateMemorySolar() {
    const sectionRect = solarSection.getBoundingClientRect();
    const systemRect = solarSystem.getBoundingClientRect();

    const viewportHeight = window.innerHeight;

    const totalScroll = sectionRect.height - viewportHeight;
    const currentScroll = solarClamp(-sectionRect.top, 0, totalScroll);
    const progress = totalScroll > 0 ? currentScroll / totalScroll : 0;

    const sun = solarSection.querySelector(".memory-solar-sun");
    const sunRect = sun.getBoundingClientRect();

    /*
      Centro real del sol COOKIE dentro de .memory-solar-system.
      Así las órbitas y planetas giran alrededor del sol.
    */
    const centerX = sunRect.left - systemRect.left + sunRect.width / 2;
    const centerY = sunRect.top - systemRect.top + sunRect.height / 2;

    const base = Math.min(systemRect.width, systemRect.height);

    /*
      5 órbitas circulares.
    */
    const orbitData = [
      {
        radiusX: Math.min(base * 0.24, 210),
        radiusY: Math.min(base * 0.24, 210),
        angle: -1.45
      },
      {
        radiusX: Math.min(base * 0.34, 295),
        radiusY: Math.min(base * 0.34, 295),
        angle: -0.15
      },
      {
        radiusX: Math.min(base * 0.42, 360),
        radiusY: Math.min(base * 0.42, 360),
        angle: 1.12
      },
      {
        radiusX: Math.min(base * 0.49, 440),
        radiusY: Math.min(base * 0.49, 440),
        angle: 2.48
      },
      {
        radiusX: Math.min(base * 0.58, 520),
        radiusY: Math.min(base * 0.58, 520),
        angle: 3.65
      }
    ];

    /*
      Pintamos las órbitas con los mismos radios que usan los planetas.
      Así las líneas no se van a otro lado.
    */
    rings.forEach((ring, index) => {
      const orbit = orbitData[index];

      if (!orbit) return;

      ring.style.setProperty("--orbit-x", `${centerX}px`);
      ring.style.setProperty("--orbit-y", `${centerY}px`);
      ring.style.setProperty("--orbit-w", `${orbit.radiusX * 2}px`);
      ring.style.setProperty("--orbit-h", `${orbit.radiusY * 2}px`);
    });

    /*
      Rotación lenta ligada al scroll.
      Sube 1.8 si quieres más vueltas.
      Baja 1.8 si quieres menos movimiento.
    */
    const globalRotation = progress * Math.PI * 1.8;

    const activeIndex = Math.min(
      planets.length - 1,
      Math.floor(progress * planets.length)
    );

    planets.forEach((planet, index) => {
      const orbit = orbitData[index];

      if (!orbit) return;

      const angle = orbit.angle + globalRotation;

      const x = centerX + Math.cos(angle) * orbit.radiusX;
      const y = centerY + Math.sin(angle) * orbit.radiusY;

      const isActive = index === activeIndex;
      const scale = isActive ? 1.12 : 0.94;

      planet.style.left = `${x}px`;
      planet.style.top = `${y}px`;
      planet.style.transform = `translate(-50%, -50%) scale(${scale})`;

      planet.classList.toggle("is-active", isActive);

      if (isActive) {
        captionTitle.textContent = planet.dataset.title;
        captionText.textContent = planet.dataset.text;

        /*
          El texto sigue al planeta, pero no cambia de lado
          según la posición en la órbita. Así evitamos el salto.
          Puedes ajustar cada planeta por separado aquí.
        */
        const captionOffsets = [
          { x: 110, y: -30 }, // 01/ SESIÓN INICIADA
          { x: 110, y: -30 }, // 02/ IDIOMA ELEGIDO
          { x: -390, y: -30 }, // 03/ PRODUCTOS EN EL CARRITO
          { x: 110, y: -30 }, // 04/ VISITAS A LA PÁGINA
          { x: 110, y: -30 }  // 05/ ANUNCIOS PERSONALIZADOS
        ];

        const offset = captionOffsets[index] || { x: 110, y: -30 };

        const labelX = x + offset.x;
        const labelY = y + offset.y;

        caption.style.left = `${labelX}px`;
        caption.style.top = `${labelY}px`;
        caption.classList.add("is-visible");
      }
    });
  }

  window.addEventListener("scroll", updateMemorySolar, { passive: true });
  window.addEventListener("resize", updateMemorySolar);
  window.addEventListener("load", updateMemorySolar);

  updateMemorySolar();
})();

/* ------------------------------
   02 / RECIBO DE ACEPTACIÓN
------------------------------ */

(() => {
  const section = document.querySelector(".cookie-accepting-section");

  if (!section) return;

  function receiptClamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function updateAcceptReceipt() {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const totalScroll = Math.max(rect.height - viewportHeight, 1);
    const currentScroll = receiptClamp(-rect.top, 0, totalScroll);
    const progress = currentScroll / totalScroll;

    let step = 0;

    if (progress > 0.12) step = 1;
    if (progress > 0.28) step = 2;
    if (progress > 0.44) step = 3;
    if (progress > 0.60) step = 4;
    if (progress > 0.76) step = 5;

    section.dataset.receiptStep = step;
  }

  window.addEventListener("scroll", updateAcceptReceipt, { passive: true });
  window.addEventListener("resize", updateAcceptReceipt);
  window.addEventListener("load", updateAcceptReceipt);

  updateAcceptReceipt();
})();

/* ------------------------------
   08 / FLECHAS NARANJAS UNA A UNA
------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  const wordArrows = document.querySelectorAll(".cookie-words-arrow");

  if (!wordArrows.length) return;

  function updateWordArrows() {
    const triggerLine = window.innerHeight * 0.62;

    wordArrows.forEach((arrow) => {
      const rect = arrow.getBoundingClientRect();

      const shouldBeActive = rect.top < triggerLine;

      arrow.classList.toggle("is-arrow-active", shouldBeActive);
    });
  }

  window.addEventListener("scroll", updateWordArrows, { passive: true });
  window.addEventListener("resize", updateWordArrows);
  window.addEventListener("load", updateWordArrows);

  updateWordArrows();
});

/* ------------------------------
   05 / QUÉ VEMOS PRIMERO - SECUENCIA POR SCROLL
------------------------------ */

(() => {
  const section = document.querySelector(".chapter-focus");
  if (!section) return;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function setFocusScene(scene) {
    section.dataset.focusScene = String(scene);
  }

  function updateFocusSequence() {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const totalScroll = Math.max(rect.height - viewportHeight, 1);
    const currentScroll = clamp(-rect.top, 0, totalScroll);
    const progress = currentScroll / totalScroll;

    /*
      0 = solo título y párrafo
      1 = caja blanca con instrucción
      2 = imagen del banner
      3 = pregunta
      4 = respuesta
      5 = cuadros de factores
    */

    if (progress < 0.16) {
      setFocusScene(0);
    } else if (progress < 0.32) {
      setFocusScene(1);
    } else if (progress < 0.50) {
      setFocusScene(2);
    } else if (progress < 0.64) {
      setFocusScene(3);
    } else if (progress < 0.78) {
      setFocusScene(4);
    } else {
      setFocusScene(5);
    }
  }

  window.addEventListener("scroll", updateFocusSequence, { passive: true });
  window.addEventListener("resize", updateFocusSequence);
  window.addEventListener("load", updateFocusSequence);

  updateFocusSequence();
})();

/* ------------------------------
   06 / RECORRIDOS SINCRONIZADOS
------------------------------ */

(() => {
  const section = document.querySelector("#apartado-06.cookie-route-section");
  if (!section) return;

  const stage = section.querySelector(".cookie-route-stage");
  if (!stage) return;

  const content = section.querySelector(".cookie-route-content");

  const shortHeading = section.querySelector(".cookie-route-short .cookie-route-heading");
  const longBlock = section.querySelector(".cookie-route-long");
  const longHeading = section.querySelector(".cookie-route-long .cookie-route-heading");
  const longCaption = section.querySelector(".cookie-route-caption-long");

  const short1 = section.querySelector(".route-short-1");
  const shortArrow1 = section.querySelector(".route-short-arrow-1");
  const short2 = section.querySelector(".route-short-2");
  const shortArrow2 = section.querySelector(".route-short-arrow-2");
  const short3 = section.querySelector(".route-short-3");

  const long1 = section.querySelector(".route-long-1");
  const longArrow1 = section.querySelector(".route-long-arrow-1");
  const long2 = section.querySelector(".route-long-2");
  const longArrow2 = section.querySelector(".route-long-arrow-2");
  const long3 = section.querySelector(".route-long-3");
  const longArrow3 = section.querySelector(".route-long-arrow-3");
  const long4 = section.querySelector(".route-long-4");
  const longArrow4 = section.querySelector(".route-long-arrow-4");
  const long5 = section.querySelector(".route-long-5");

  function routeClamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function toggle(el, condition) {
    if (!el) return;
    el.classList.toggle("is-visible", condition);
  }

  function updateCookieRoute() {
    const rect = stage.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const totalScroll = Math.max(stage.offsetHeight - viewportHeight, 1);

    /*
      Empieza un poco antes de que el sticky llegue arriba,
      para evitar la pantalla blanca vacía.
    */
    const currentScroll = routeClamp(
      viewportHeight * 0.68 - rect.top,
      0,
      totalScroll
    );

    const progress = currentScroll / totalScroll;

    /*
      Apariciones más repartidas y más tempranas.
      Así no ocurre que bajas y no ves nada.
    */
    const shortTitle = 0.03;
    const shortStep1 = 0.10;
    const shortStep2 = 0.17;
    const shortStep3 = 0.24;

    const longTitle = 0.36;
    const longStep1 = 0.43;
    const longStep2 = 0.50;
    const longStep3 = 0.57;
    const longStep4 = 0.64;
    const longStep5 = 0.71;
    const captionStep = 0.80;

    toggle(content, progress >= shortTitle);

    toggle(shortHeading, progress >= shortTitle);

    toggle(short1, progress >= shortStep1);

    toggle(shortArrow1, progress >= shortStep2);
    toggle(short2, progress >= shortStep2);

    toggle(shortArrow2, progress >= shortStep3);
    toggle(short3, progress >= shortStep3);

    toggle(longBlock, progress >= longTitle);
    toggle(longHeading, progress >= longTitle);

    toggle(long1, progress >= longStep1);

    toggle(longArrow1, progress >= longStep2);
    toggle(long2, progress >= longStep2);

    toggle(longArrow2, progress >= longStep3);
    toggle(long3, progress >= longStep3);

    toggle(longArrow3, progress >= longStep4);
    toggle(long4, progress >= longStep4);

    toggle(longArrow4, progress >= longStep5);
    toggle(long5, progress >= longStep5);

    toggle(longCaption, progress >= captionStep);
  }

  window.addEventListener("scroll", updateCookieRoute, { passive: true });
  window.addEventListener("resize", updateCookieRoute);
  window.addEventListener("load", updateCookieRoute);

  updateCookieRoute();
})();

/* ------------------------------
   04 / MARCAS VISUALES SEGUNDA CAPA
------------------------------ */

(() => {
  const section = document.querySelector(".anatomy-fullscreen-section");
  if (!section) return;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function updateAnatomyMarks() {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const totalScroll = Math.max(rect.height - viewportHeight, 1);
    const currentScroll = clamp(-rect.top, 0, totalScroll);
    const progress = currentScroll / totalScroll;

    /*
      Reparto manual de los 13 pasos visuales (0–12)
      para que "Información previa" dure más tiempo.
    */
    let visualStep = 0;

    if (progress < 0.08) {
      visualStep = 0;
    } else if (progress < 0.16) {
      visualStep = 1;
    } else if (progress < 0.24) {
      visualStep = 2;
    } else if (progress < 0.32) {
      visualStep = 3;
    } else if (progress < 0.40) {
      visualStep = 4;
    } else if (progress < 0.48) {
      visualStep = 5;
    } else if (progress < 0.56) {
      visualStep = 6;
    } else if (progress < 0.62) {
      visualStep = 7;
    } else if (progress < 0.75) {
      visualStep = 8; // Información previa: dura más
    } else if (progress < 0.82) {
      visualStep = 9;
    } else if (progress < 0.89) {
      visualStep = 10;
    } else if (progress < 0.95) {
      visualStep = 11;
    } else {
      visualStep = 12;
    }

    let mark = "none";

    if (visualStep === 8 && progress < 0.670) {
      mark = "info";
    } else if (progress >= 0.70 && progress < 0.770) {
      mark = "categories";
    } else if (visualStep === 10) {
      mark = "actions";
    } else if (visualStep === 11) {
      mark = "switches";
    } else if (visualStep === 12) {
      mark = "states";
    }

    section.setAttribute("data-anatomy-mark", mark);
  }

  window.addEventListener("scroll", updateAnatomyMarks, { passive: true });
  window.addEventListener("resize", updateAnatomyMarks);
  window.addEventListener("load", updateAnatomyMarks);

  updateAnatomyMarks();
})();