/* ==========================================================
   Kanzlei Kabatas – Bewegung
   Der Name ist der Waagebalken: Er pendelt, lässt sich anstoßen
   und die Schalen schwingen beim Scrollen nach.
   ========================================================== */

(() => {
  "use strict";

  const mq = (q) => window.matchMedia(q).matches;
  const reduced = mq("(prefers-reduced-motion: reduce)");
  const touch = mq("(pointer: coarse)");
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const DEG = Math.PI / 180;
  const SVG = "http://www.w3.org/2000/svg";

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);
  }

  /* ---------- Gedämpfte Feder: Balken + nachschwingende Schalen ---------- */

  class Spring {
    constructor() {
      this.angle = 0;
      this.vel = 0;
      this.target = 0;
      this.swing = 0;
      this.swingVel = 0;
    }

    step(dt) {
      if (reduced) {
        this.angle = this.target;
        this.vel = 0;
        this.swing = 0;
        return;
      }
      const acc = 34 * (this.target - this.angle) - 6.2 * this.vel;
      this.vel += acc * dt;
      this.angle += this.vel * dt;
      if (Math.abs(this.angle) > 12) { this.angle = Math.sign(this.angle) * 12; this.vel *= -0.3; }

      const swingTarget = clamp(-this.vel * 0.14, -12, 12);
      const sAcc = 48 * (swingTarget - this.swing) - 3.6 * this.swingVel;
      this.swingVel += sAcc * dt;
      this.swing += this.swingVel * dt;
    }

    kick(amount) { this.vel += amount; }
    sway(amount) { this.swingVel += amount; }
  }

  /* ---------- Text auf Breite setzen ---------- */

  function fit(el, width, maxSize = Infinity) {
    const host = el.parentElement;
    host.style.fontSize = "100px";
    const w = el.offsetWidth;
    const size = Math.min(maxSize, (100 * width) / w);
    host.style.fontSize = `${size.toFixed(2)}px`;
    return size;
  }

  /* ---------- Erster Bildschirm: der Name als Balken ---------- */

  const hero = document.querySelector(".hero");
  const monument = document.querySelector("[data-monument]");
  const word = document.querySelector("[data-beam]");
  const chars = word.querySelector(".monument__chars");
  const rig = document.querySelector("[data-rig]");
  const heroSpring = new Spring();
  const heroCopy = document.querySelector(".hero__copy");

  const el = (name, attrs) => {
    const node = document.createElementNS(SVG, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  };

  const parts = {
    post: el("path", { class: "rig-post" }),
    chainL: el("path", { class: "rig-chain" }),
    chainR: el("path", { class: "rig-chain" }),
    panL: el("path", { class: "rig-pan" }),
    panR: el("path", { class: "rig-pan" }),
    hookL: el("circle", { class: "rig-hook" }),
    hookR: el("circle", { class: "rig-hook" }),
  };
  Object.values(parts).forEach((p) => rig.appendChild(p));

  let F = 200; // Schriftgröße des Namens in px – alle Maße des Gestells hängen daran

  function layoutHero() {
    const avail = window.innerWidth - 2 * parseFloat(getComputedStyle(hero).getPropertyValue("--m") || 28);
    const copyBottom = heroCopy.getBoundingClientRect().bottom - hero.getBoundingClientRect().top;
    const byHeight = (window.innerHeight - copyBottom - 40) / 1.78;
    F = fit(chars, avail, Math.max(byHeight, window.innerWidth < 768 ? 60 : 140));
    monument.style.minHeight = `${Math.round(F * 1.78)}px`;
  }

  function drawRig() {
    const W = word.offsetWidth;
    const H = word.offsetHeight;
    const cx = word.offsetLeft + W / 2;
    const cy = word.offsetTop + H / 2;
    const a = heroSpring.angle * DEG;
    const cos = Math.cos(a);
    const sin = Math.sin(a);

    word.style.transform = `rotate(${heroSpring.angle.toFixed(3)}deg)`;

    // Aufhängepunkte unter K und S, mit dem Balken gedreht
    // Auf schmalen Bildschirmen ist der Name klein – das Gestell wächst mit, damit die Schalen lesbar bleiben
    const k = F < 120 ? 1.6 : 1;
    const hx = W / 2 - F * (k > 1 ? 0.55 : 0.38);
    const hy = H / 2 - F * 0.115;
    const hang = (side) => ({
      x: cx + side * hx * cos - hy * sin,
      y: cy + side * hx * sin + hy * cos,
    });

    const chain = F * 0.52 * k;
    const half = F * 0.34 * k;
    const depth = F * 0.15 * k;
    const s = heroSpring.swing * DEG;

    const pan = (side, chainEl, panEl, hookEl) => {
      const p = hang(side);
      // Schale hängt senkrecht und pendelt um den Aufhängepunkt
      const rot = (x, y) => ({
        x: p.x + x * Math.cos(s) - y * Math.sin(s),
        y: p.y + x * Math.sin(s) + y * Math.cos(s),
      });
      const l = rot(-half, chain);
      const r = rot(half, chain);
      const c1 = rot(-half * 0.72, chain + depth * 1.3);
      const c2 = rot(half * 0.72, chain + depth * 1.3);
      chainEl.setAttribute("d", `M${l.x} ${l.y} L${p.x} ${p.y} L${r.x} ${r.y}`);
      panEl.setAttribute("d", `M${l.x} ${l.y} L${r.x} ${r.y} C${c2.x} ${c2.y} ${c1.x} ${c1.y} ${l.x} ${l.y} Z`);
      hookEl.setAttribute("cx", p.x);
      hookEl.setAttribute("cy", p.y);
      hookEl.setAttribute("r", Math.max(3, F * 0.022));
    };

    pan(-1, parts.chainL, parts.panL, parts.hookL);
    pan(1, parts.chainR, parts.panR, parts.hookR);

    // Säule unter dem mittleren A bis zum Boden, mit Sockel
    const pw = F * 0.075;
    const bottom = monument.offsetHeight;
    const top = cy;
    const bw = F * 0.62;
    const bh = F * 0.09;
    parts.post.setAttribute(
      "d",
      `M${cx - pw / 2} ${top} H${cx + pw / 2} V${bottom - bh * 2} H${cx + bw * 0.32} V${bottom - bh} H${cx + bw / 2} V${bottom} H${cx - bw / 2} V${bottom - bh} H${cx - bw * 0.32} V${bottom - bh * 2} H${cx - pw / 2} Z`
    );
  }

  // Anstoßen: ziehen (Maus oder Finger, seitlich) oder Pfeiltasten
  let drag = null;
  let hoverTilt = 0;

  monument.addEventListener("pointerdown", (e) => {
    drag = { x: e.clientX, base: heroSpring.target };
    word.classList.add("is-dragging");
    monument.setPointerCapture(e.pointerId);
  });
  monument.addEventListener("pointermove", (e) => {
    if (drag) {
      drag.offset = clamp(((e.clientX - drag.x) / window.innerWidth) * 30, -7, 7);
    } else if (e.pointerType === "mouse") {
      hoverTilt = ((e.clientX / window.innerWidth) - 0.5) * 5;
    }
  });
  const release = () => {
    if (!drag) return;
    drag = null;
    word.classList.remove("is-dragging");
  };
  monument.addEventListener("pointerup", release);
  monument.addEventListener("pointercancel", release);
  monument.addEventListener("pointerleave", () => { hoverTilt = 0; });

  word.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { heroSpring.kick(-45); e.preventDefault(); }
    if (e.key === "ArrowRight") { heroSpring.kick(45); e.preventDefault(); }
  });

  let heroVisible = true;
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; }).observe(hero);

  /* ---------- Die Abwägung: Waage mit Gewichten ---------- */

  const PIVOT_X = 300;
  const PIVOT_Y = 130;
  const ARM = 210;

  function weightMarkup(label, index, good) {
    const width = [158, 138, 118][index];
    return `<g class="s-weight${good ? " s-weight--good" : ""}" data-index="${index}">
      <rect x="${-width / 2}" y="-27" width="${width}" height="25" />
      <text y="-14.5">${label}</text></g>`;
  }

  function panMarkup(side, labels, good) {
    return `<g class="s-pan-group" data-side="${side}">
      <path class="s-chain" d="M-100 200 L0 0 L100 200" />
      <circle class="s-post" r="6" />
      ${labels.map((w, i) => weightMarkup(w, i, good)).join("")}
      <path class="s-pan" d="M-108 200 H108 C80 244 -80 244 -108 200 Z" />
    </g>`;
  }

  class WeighScale {
    constructor(host, left, right) {
      host.innerHTML = `<svg class="scale-svg" viewBox="0 0 600 540">
        <path class="s-post" d="M292 120 H308 V470 H352 V490 H392 V510 H208 V490 H248 V470 H292 Z" />
        <path class="s-post" d="M300 70 L311 92 L300 114 L289 92 Z" />
        <g class="s-beam-group">
          <path class="s-beam" d="M80 126 H520 V134 H80 Z" />
          <circle class="s-beam" cx="300" cy="130" r="16" />
          <circle class="s-beam" cx="${PIVOT_X - ARM}" cy="${PIVOT_Y}" r="8" />
          <circle class="s-beam" cx="${PIVOT_X + ARM}" cy="${PIVOT_Y}" r="8" />
        </g>
        ${panMarkup("l", left, false)}
        ${panMarkup("r", right, true)}
      </svg>`;
      this.beam = host.querySelector(".s-beam-group");
      this.panL = host.querySelector('[data-side="l"]');
      this.panR = host.querySelector('[data-side="r"]');
      this.weightsL = [...this.panL.querySelectorAll(".s-weight")];
      this.weightsR = [...this.panR.querySelectorAll(".s-weight")];
      this.spring = new Spring();
      this.progress = reduced || !hasGsap ? 1 : 0;
    }

    static place(weight, d) {
      const index = Number(weight.dataset.index);
      const rest = 200 - index * 28;
      const y = rest - (1 - easeOutCubic(d)) * 260;
      weight.setAttribute("transform", `translate(0 ${y.toFixed(2)})`);
      weight.style.opacity = clamp(d * 2.5, 0, 1);
    }

    update(dt) {
      const p = this.progress;
      let left = 0;
      let right = 0;
      this.weightsL.forEach((w, i) => {
        const d = clamp((p - (0.04 + i * 0.09)) / 0.12, 0, 1);
        WeighScale.place(w, d);
        left += easeOutCubic(d);
      });
      this.weightsR.forEach((w, i) => {
        const d = clamp((p - (0.48 + i * 0.1)) / 0.12, 0, 1);
        WeighScale.place(w, d);
        right += easeOutCubic(d);
      });
      this.spring.target = (right - left) * 7;
      this.spring.step(dt);

      const a = this.spring.angle;
      const r = a * DEG;
      const dx = ARM * Math.cos(r);
      const dy = ARM * Math.sin(r);
      const s = this.spring.swing.toFixed(3);
      this.beam.setAttribute("transform", `rotate(${a.toFixed(3)} ${PIVOT_X} ${PIVOT_Y})`);
      this.panL.setAttribute("transform", `translate(${(PIVOT_X - dx).toFixed(2)} ${(PIVOT_Y - dy).toFixed(2)}) rotate(${s})`);
      this.panR.setAttribute("transform", `translate(${(PIVOT_X + dx).toFixed(2)} ${(PIVOT_Y + dy).toFixed(2)}) rotate(${s})`);
    }
  }

  const weighHost = document.querySelector("[data-weigh]");
  const weigh = new WeighScale(weighHost, ["Unsicherheit", "Fristen", "Gegenseite"], ["Erfahrung", "Strategie", "Einsatz"]);
  const steps = [...document.querySelectorAll(".weigh__steps li")];
  let weighVisible = false;
  new IntersectionObserver(([entry]) => { weighVisible = entry.isIntersecting; }, { rootMargin: "20% 0px" }).observe(weighHost);

  function markSteps(p) {
    const phase = p < 0.4 ? 0 : p < 0.82 ? 1 : 2;
    steps.forEach((li, i) => li.classList.toggle("is-on", i <= phase));
  }
  markSteps(weigh.progress);

  /* ---------- Ablauf: Akkordeon ---------- */

  const stages = [...document.querySelectorAll(".stage")];
  stages.forEach((stage) => {
    stage.querySelector(".stage__tab").addEventListener("click", () => {
      stages.forEach((s) => {
        const open = s === stage;
        s.classList.toggle("is-open", open);
        s.querySelector(".stage__tab").setAttribute("aria-expanded", String(open));
      });
      if (hasGsap) setTimeout(() => ScrollTrigger.refresh(), 500);
    });
  });

  /* ---------- Menü (Telefon & Tablet) ---------- */

  const menuButton = document.querySelector(".bar__menu");
  const menu = document.getElementById("menu");
  let lenis = null;

  function setMenu(open) {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.textContent = open ? "Schließen" : "Menü";
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  menuButton.addEventListener("click", () => setMenu(menu.hidden));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) setMenu(false); });

  /* ---------- Weiches Scrollen, Szenen und Auftritte (GSAP) ---------- */

  let lastScroll = window.scrollY;

  function setupMotion() {
    if (!hasGsap) return;

    // Gewicht beim Scrollen: Lenis, nur mit Mausrad, nie auf Touch oder bei reduzierter Bewegung
    if (window.Lenis && !reduced && !touch) {
      lenis = new Lenis({ lerp: 0.11, smoothWheel: true, anchors: true, autoRaf: false });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("is-smooth");
    }

    // Die Abwägung folgt der Scrollposition, die Seite läuft dabei normal weiter
    const proxy = { p: 0 };
    gsap.to(proxy, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: weighHost,
        start: "top 82%",
        end: "bottom 42%",
        scrub: reduced ? true : 0.9,
      },
      onUpdate: () => {
        weigh.progress = reduced ? 1 : proxy.p;
        markSteps(weigh.progress);
      },
    });

    if (reduced) return;

    // Signatur: Der Name wird beim Verlassen schwer und sinkt leicht
    gsap.to(monument, {
      scale: 0.93,
      yPercent: 7,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(heroCopy, {
      yPercent: -18,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "60% top", scrub: true },
    });

    // Auftritte: Überschrift, dann Text, dann Details – jeweils einmal
    const rise = gsap.utils.toArray("[data-rise]");
    gsap.set(rise, { opacity: 0, y: 26 });
    ScrollTrigger.batch(rise, {
      start: "top 88%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.07, overwrite: true }),
    });

    // Der lange Absatz steigt Zeile für Zeile aus seiner Maske
    if (window.SplitText) {
      document.fonts.ready.then(() => {
        document.querySelectorAll("[data-lines]").forEach((p) => {
          const split = new SplitText(p, { type: "lines", mask: "lines", linesClass: "split-line" });
          gsap.from(split.lines, {
            yPercent: 105,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: p, start: "top 86%", once: true },
          });
        });
      });
    }

    // Das große Wort der Rechtsgebiete rückt beim Scrollen leicht zusammen
    gsap.fromTo(".areas__word [data-fit]", { scale: 0.92, transformOrigin: "0% 100%" }, {
      scale: 1,
      ease: "none",
      scrollTrigger: { trigger: ".areas", start: "top bottom", end: "top 30%", scrub: true },
    });

    // Ablauf: die vier Felder öffnen sich von links nach rechts
    gsap.from(".stage", {
      clipPath: "inset(0 0 100% 0)",
      duration: 1.1,
      ease: "power4.inOut",
      stagger: 0.08,
      scrollTrigger: { trigger: ".stages", start: "top 85%", once: true },
      clearProps: "clipPath",
    });

    // Kontakt: die Adresse steigt aus ihrer Grundlinie
    gsap.from("[data-mailline]", {
      yPercent: 105,
      duration: 1,
      ease: "expo.out",
      stagger: 0.1,
      scrollTrigger: { trigger: ".contact__mail", start: "top 90%", once: true },
    });

    // Fußbereich: der Name wächst heran, während er hereinkommt
    gsap.fromTo(".footer__name [data-fit]", { scale: 0.94, transformOrigin: "50% 100%" }, {
      scale: 1,
      ease: "none",
      scrollTrigger: { trigger: ".footer", start: "top bottom", end: "top 20%", scrub: true },
    });
  }

  /* ---------- Schleife ---------- */

  let last = performance.now();

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;

    // Scrollen bringt die Schalen ins Schwingen
    const y = window.scrollY;
    const dy = y - lastScroll;
    lastScroll = y;
    if (!reduced && dy !== 0) {
      heroSpring.sway(clamp(dy, -60, 60) * 0.5);
      weigh.spring.sway(clamp(dy, -60, 60) * 0.35);
    }

    if (heroVisible) {
      const idle = reduced ? 0 : Math.sin(now / 1700) * 1.6 + Math.sin(now / 730) * 0.35;
      heroSpring.target = idle + hoverTilt + (drag && drag.offset ? drag.offset : 0);
      heroSpring.step(dt);
      drawRig();
    }

    if (weighVisible) weigh.update(dt);

    requestAnimationFrame(frame);
  }

  /* ---------- Start ---------- */

  function layoutAll() {
    layoutHero();
    const content = window.innerWidth - 2 * (window.innerWidth < 768 ? 20 : 28);
    document.querySelectorAll(".areas__word [data-fit], .footer__name [data-fit]").forEach((span) => fit(span, content * 0.985));
    drawRig();
    if (hasGsap) ScrollTrigger.refresh();
  }

  document.querySelector("[data-year]").textContent = new Date().getFullYear();

  layoutAll();
  weigh.update(0);
  document.fonts.ready.then(layoutAll);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutAll, 120);
  });

  setupMotion();
  requestAnimationFrame(frame);
})();
