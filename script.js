/* ==========================================================
   Kanzlei Kabatas – Interaktionen & Animationen
   ========================================================== */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const DEG = Math.PI / 180;

  /* ---------- Waage der Justitia (SVG + Federphysik) ---------- */

  const PIVOT_X = 300;
  const PIVOT_Y = 150;
  const ARM = 200;

  let uid = 0;

  function weightMarkup(label, index, good) {
    const width = [150, 132, 114][index];
    return `
      <g class="s-weight${good ? " s-weight--good" : ""}" data-index="${index}">
        <rect x="${-width / 2}" y="-26" width="${width}" height="24" rx="12" />
        <text y="-14">${label}</text>
      </g>`;
  }

  function panMarkup(side, weights, good) {
    return `
      <g class="intro-pan">
        <g class="s-pan s-pan--${side}">
          <path class="s-chain" d="M0 0 L-94 190 M0 0 L94 190" />
          <circle cx="0" cy="0" r="6" fill="none" stroke="url(#gold-v-${uid})" stroke-width="3" />
          <g class="s-weights">${weights.map((w, i) => weightMarkup(w, i, good)).join("")}</g>
          <path d="M-104 190 L104 190 Q78 238 0 238 Q-78 238 -104 190 Z" fill="url(#gold-v-${uid})" />
          <path d="M-104 190 L104 190" stroke="#f6e7bf" stroke-width="2" stroke-linecap="round" />
        </g>
      </g>`;
  }

  function scaleMarkup({ left = [], right = [] } = {}) {
    uid += 1;
    return `
      <svg class="scale-svg" viewBox="0 0 600 560" role="presentation">
        <defs>
          <linearGradient id="gold-v-${uid}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#f6e2a8" />
            <stop offset=".45" stop-color="#c9a45c" />
            <stop offset="1" stop-color="#7d5e27" />
          </linearGradient>
          <linearGradient id="gold-h-${uid}" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#8c6b2e" />
            <stop offset=".4" stop-color="#f3dca0" />
            <stop offset=".6" stop-color="#d8b66f" />
            <stop offset="1" stop-color="#7d5e27" />
          </linearGradient>
        </defs>

        <g class="intro-base">
          <ellipse cx="300" cy="528" rx="150" ry="10" fill="#000" opacity=".25" />
          <path d="M190 522 L410 522 L388 500 L212 500 Z" fill="url(#gold-h-${uid})" />
          <path d="M236 500 L364 500 L344 482 L256 482 Z" fill="url(#gold-h-${uid})" />
        </g>

        <g class="intro-post">
          <rect x="291" y="128" width="18" height="356" rx="3" fill="url(#gold-h-${uid})" />
          <rect x="282" y="300" width="36" height="8" rx="4" fill="url(#gold-h-${uid})" />
          <path d="M300 82 L312 104 L300 126 L288 104 Z" fill="url(#gold-v-${uid})" />
          <circle cx="300" cy="76" r="6" fill="url(#gold-v-${uid})" />
        </g>

        <g class="intro-beam">
          <g class="s-beam">
            <path d="M92 146 Q300 124 508 146 L508 154 Q300 168 92 154 Z" fill="url(#gold-v-${uid})" />
            <circle cx="${PIVOT_X - ARM}" cy="${PIVOT_Y}" r="8" fill="url(#gold-v-${uid})" />
            <circle cx="${PIVOT_X + ARM}" cy="${PIVOT_Y}" r="8" fill="url(#gold-v-${uid})" />
            <circle cx="${PIVOT_X}" cy="${PIVOT_Y}" r="15" fill="url(#gold-h-${uid})" />
            <circle cx="${PIVOT_X}" cy="${PIVOT_Y}" r="5" fill="#5f4719" />
          </g>
        </g>

        ${panMarkup("l", left, false)}
        ${panMarkup("r", right, true)}
      </svg>`;
  }

  class Scale {
    constructor(el, weights) {
      el.innerHTML = scaleMarkup(weights);
      this.beam = el.querySelector(".s-beam");
      this.panL = el.querySelector(".s-pan--l");
      this.panR = el.querySelector(".s-pan--r");
      this.weightsL = [...this.panL.querySelectorAll(".s-weight")];
      this.weightsR = [...this.panR.querySelectorAll(".s-weight")];

      this.angle = 0;      // Neigung des Balkens (Grad)
      this.vel = 0;
      this.target = 0;
      this.swing = 0;      // Pendeln der Schalen (Grad)
      this.swingVel = 0;
      this.render();
    }

    step(dt) {
      if (reduceMotion) {
        this.angle = this.target;
        this.vel = 0;
      } else {
        // gedämpfte Feder für den Balken
        const acc = 38 * (this.target - this.angle) - 6.5 * this.vel;
        this.vel += acc * dt;
        this.angle += this.vel * dt;

        // Schalen schwingen träge gegen die Balkenbewegung nach
        const swingTarget = clamp(-this.vel * 0.12, -10, 10);
        const sAcc = 55 * (swingTarget - this.swing) - 4 * this.swingVel;
        this.swingVel += sAcc * dt;
        this.swing += this.swingVel * dt;
      }
      this.render();
    }

    render() {
      const a = this.angle * DEG;
      const dx = ARM * Math.cos(a);
      const dy = ARM * Math.sin(a);
      const s = this.swing.toFixed(3);
      this.beam.setAttribute("transform", `rotate(${this.angle.toFixed(3)} ${PIVOT_X} ${PIVOT_Y})`);
      this.panL.setAttribute("transform", `translate(${(PIVOT_X - dx).toFixed(2)} ${(PIVOT_Y - dy).toFixed(2)}) rotate(${s})`);
      this.panR.setAttribute("transform", `translate(${(PIVOT_X + dx).toFixed(2)} ${(PIVOT_Y + dy).toFixed(2)}) rotate(${s})`);
    }

    // Gewicht fällt in die Schale: d = 0 (noch oben) … 1 (liegt)
    static placeWeight(el, d) {
      const index = Number(el.dataset.index);
      const rest = 190 - index * 27;
      const t = easeOutCubic(d);
      const y = rest - (1 - t) * 240;
      el.setAttribute("transform", `translate(0 ${y.toFixed(2)})`);
      el.style.opacity = clamp(d * 2.5, 0, 1);
    }
  }

  /* ---------- Hero-Waage ---------- */

  const heroEl = document.querySelector('[data-scale="hero"]');
  const heroScale = heroEl ? new Scale(heroEl) : null;
  let mouseTilt = 0;

  if (heroScale && !reduceMotion) {
    const hero = document.querySelector(".hero");
    hero.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      mouseTilt = ((e.clientX / window.innerWidth) - 0.5) * 22;
    });
    hero.addEventListener("pointerleave", () => { mouseTilt = 0; });

    // Ein Klick auf die Waage stößt sie an
    heroEl.addEventListener("click", () => { heroScale.vel += (Math.random() > 0.5 ? 1 : -1) * 90; });
    heroEl.style.cursor = "pointer";
    heroEl.style.pointerEvents = "auto";
  }

  /* ---------- Abwägungs-Waage (scrollgesteuert) ---------- */

  const weighSection = document.querySelector(".weigh");
  const weighEl = document.querySelector('[data-scale="weigh"]');
  const weighScale = weighEl
    ? new Scale(weighEl, {
        left: ["Unsicherheit", "Fristen", "Gegenseite"],
        right: ["Erfahrung", "Strategie", "Einsatz"],
      })
    : null;
  const phases = [...document.querySelectorAll(".weigh__phase")];
  const weighBar = document.querySelector(".weigh__progress span");
  let currentPhase = 0;

  function updateWeigh() {
    if (!weighScale) return;
    const rect = weighSection.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const p = clamp(-rect.top / total, 0, 1);

    let left = 0;
    let right = 0;
    weighScale.weightsL.forEach((w, i) => {
      const d = clamp((p - (0.04 + i * 0.09)) / 0.1, 0, 1);
      Scale.placeWeight(w, d);
      left += easeOutCubic(d);
    });
    weighScale.weightsR.forEach((w, i) => {
      const d = clamp((p - (0.42 + i * 0.1)) / 0.1, 0, 1);
      Scale.placeWeight(w, d);
      right += easeOutCubic(d);
    });
    weighScale.target = (right - left) * 7;

    const phase = p < 0.36 ? 0 : p < 0.76 ? 1 : 2;
    if (phase !== currentPhase) {
      currentPhase = phase;
      phases.forEach((el, i) => {
        el.classList.toggle("is-active", i === phase);
        el.classList.toggle("is-past", i < phase);
      });
    }
    weighBar.style.transform = `scaleX(${p.toFixed(4)})`;
  }

  /* ---------- Ablauf: wachsende Linie ---------- */

  const steps = document.querySelector(".steps");
  const stepsLine = document.querySelector(".steps__line span");

  function updateSteps() {
    if (!steps) return;
    const rect = steps.getBoundingClientRect();
    const p = clamp((window.innerHeight * 0.65 - rect.top) / rect.height, 0, 1);
    stepsLine.style.transform = `scaleY(${p.toFixed(4)})`;
  }

  /* ---------- Navigation ---------- */

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("mobile-menu");
  let lastY = window.scrollY;

  function updateNav() {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    const menuOpen = toggle.getAttribute("aria-expanded") === "true";
    nav.classList.toggle("is-hidden", !menuOpen && y > 600 && y > lastY + 2);
    if (y < lastY - 2 || y <= 600) nav.classList.remove("is-hidden");
    lastY = y;
  }

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add("is-open"));
    } else {
      menu.classList.remove("is-open");
      setTimeout(() => { if (!menu.classList.contains("is-open")) menu.hidden = true; }, 800);
    }
  }

  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenu(false);
  });

  /* ---------- Scroll-Handler ---------- */

  const heroInner = document.querySelector(".hero__inner");

  function onScroll() {
    updateNav();
    updateWeigh();
    updateSteps();

    if (!reduceMotion && heroInner) {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        const p = y / window.innerHeight;
        heroEl.style.transform = `translate3d(0, ${(y * 0.18).toFixed(1)}px, 0)`;
        heroInner.style.opacity = (1 - p * 0.9).toFixed(3);
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---------- Animationsschleife ---------- */

  let last = performance.now();

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;

    if (heroScale) {
      const idle = reduceMotion ? 0 : Math.sin(now / 1400) * 3.5 + Math.sin(now / 610) * 0.8;
      heroScale.target = idle + mouseTilt;
      heroScale.step(dt);
    }
    if (weighScale) weighScale.step(dt);

    requestAnimationFrame(frame);
  }

  /* ---------- Reveal beim Scrollen ---------- */

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Mini-Waagen in den Karten ---------- */

  const symbol = document.getElementById("mini-scale");
  document.querySelectorAll(".card__icon svg").forEach((svg) => {
    svg.innerHTML = symbol.innerHTML;
  });

  /* ---------- Kontaktformular ---------- */

  const form = document.querySelector(".form");
  const status = form.querySelector(".form__status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll("[required]").forEach((input) => {
      const ok = input.type === "checkbox" ? input.checked : input.checkValidity() && input.value.trim() !== "";
      (input.closest(".field") || input.closest(".check")).classList.toggle("is-invalid", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      status.textContent = "Bitte füllen Sie alle markierten Felder aus.";
      return;
    }

    const data = new FormData(form);
    const subject = `Anfrage ${data.get("area")} – ${data.get("name")}`;
    const body = `${data.get("message")}\n\n${data.get("name")}\n${data.get("email")}`;
    status.textContent = "Vielen Dank! Ihr E-Mail-Programm wird geöffnet …";
    window.location.href = `mailto:info@kanzlei-kabatas.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  form.addEventListener("input", (e) => {
    const holder = e.target.closest(".field, .check");
    if (holder) holder.classList.remove("is-invalid");
  });

  /* ---------- Start ---------- */

  document.querySelector("[data-year]").textContent = new Date().getFullYear();

  const loader = document.querySelector(".loader");
  const started = performance.now();
  document.body.classList.add("is-loading");

  let introDone = false;
  function intro() {
    if (introDone) return;
    introDone = true;
    const wait = reduceMotion ? 0 : Math.max(0, 900 - (performance.now() - started));
    setTimeout(() => {
      loader.classList.add("is-done");
      document.body.classList.remove("is-loading");
      setTimeout(() => document.body.classList.add("is-ready"), reduceMotion ? 0 : 350);
      setTimeout(() => loader.remove(), 1400);
    }, wait);
  }

  (document.fonts ? document.fonts.ready : Promise.resolve()).then(intro);
  setTimeout(intro, 2500);

  onScroll();
  requestAnimationFrame(frame);
})();
