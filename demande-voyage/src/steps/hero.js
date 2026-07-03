import gsap from "gsap";
import { CONFIG } from "../config.js";
import { reduceMotion } from "../animations/transitions.js";

export function initHeroStep(router) {
  const titleEl = document.getElementById("hero-title");
  const subtitleEl = document.getElementById("hero-subtitle");
  const openBtn = document.getElementById("hero-open-btn");
  const envelope = document.getElementById("hero-envelope");
  const flap = envelope.querySelector(".envelope-flap");

  titleEl.textContent = "";
  CONFIG.titreHero.split("").forEach((c) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = c === " " ? " " : c;
    titleEl.appendChild(span);
  });
  subtitleEl.textContent = CONFIG.sousTitreHero;

  let played = false;

  function playIntro() {
    if (played) return;
    played = true;
    const tl = gsap.timeline();
    tl.fromTo(envelope, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
    const chars = titleEl.querySelectorAll(".char");
    if (reduceMotion) {
      tl.set(chars, { opacity: 1 });
    } else {
      tl.fromTo(
        chars,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.02, ease: "power2.out" },
        "-=0.1"
      );
    }
    tl.fromTo(subtitleEl, { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.2");
    tl.fromTo(openBtn, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
    if (!reduceMotion) {
      gsap.to(openBtn, {
        scale: 1.04,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });
    }
  }

  openBtn.addEventListener("click", () => {
    const tl = gsap.timeline({ onComplete: () => router.goTo("lieu") });
    tl.to(flap, {
      rotateX: reduceMotion ? 0 : -170,
      duration: reduceMotion ? 0.01 : 0.5,
      ease: "power2.in",
    });
    tl.to(envelope, { scale: reduceMotion ? 1 : 1.15, opacity: 0, duration: 0.4 }, "-=0.1");
  });

  return { onEnter: playIntro };
}
