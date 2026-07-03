import gsap from "gsap";
import confetti from "canvas-confetti";
import { CONFIG } from "../config.js";
import { getState, setState } from "../state.js";
import { sendReponse } from "../services/api.js";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function launchConfetti() {
  const colors = ["#f5b971", "#ef7d8e", "#5fc9c4", "#fdf6ec"];
  confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 }, colors });
  confetti({ particleCount: 60, spread: 100, startVelocity: 45, origin: { y: 0.5 }, colors, scalar: 0.9 });
  if (confetti.shapeFromText) {
    const heart = confetti.shapeFromText({ text: "❤️", scalar: 3 });
    confetti({ particleCount: 30, spread: 70, origin: { y: 0.55 }, shapes: [heart], scalar: 3 });
  }
}

export function initRecapStep(router) {
  const destEl = document.getElementById("recap-destination");
  const datesEl = document.getElementById("recap-dates");
  const activitesEl = document.getElementById("recap-activites");
  const stamp = document.getElementById("recap-stamp");
  const ouiBtn = document.getElementById("recap-oui");
  const nonBtn = document.getElementById("recap-non");
  const actionsEl = document.getElementById("recap-actions");

  if (!CONFIG.boutonFuyant) {
    nonBtn.remove();
  } else {
    let dodges = 0;
    const escape = () => {
      dodges += 1;
      if (dodges > 6) {
        gsap.to(nonBtn, { opacity: 0, duration: 0.3, onComplete: () => (nonBtn.style.pointerEvents = "none") });
        return;
      }
      const maxX = Math.max(actionsEl.clientWidth - nonBtn.offsetWidth, 40);
      const x = Math.random() * maxX - maxX / 2;
      const y = -(Math.random() * 30 + 10);
      gsap.to(nonBtn, { x, y, duration: 0.35, ease: "power2.out" });
    };
    nonBtn.addEventListener("pointerenter", escape);
    nonBtn.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        escape();
      },
      { passive: false }
    );
  }

  function onEnter() {
    const state = getState();
    destEl.textContent = state.destination?.nom ?? "—";
    const { debut, fin, nuits } = state.dates;
    datesEl.textContent =
      debut && fin ? `${formatDate(debut)} → ${formatDate(fin)} · ${nuits} nuit${nuits > 1 ? "s" : ""}` : "—";

    activitesEl.innerHTML = "";
    state.activites.forEach((label) => {
      const chip = document.createElement("span");
      chip.className = "bp-chip";
      chip.textContent = label;
      activitesEl.appendChild(chip);
    });

    gsap.set(stamp, { scale: 0, opacity: 0, rotate: -14 });
    gsap.to(stamp, { scale: 1, opacity: 1, duration: 0.5, delay: 0.9, ease: "back.out(3)" });
  }

  ouiBtn.addEventListener("click", async () => {
    ouiBtn.disabled = true;
    setState({ reponse: "oui" });
    launchConfetti();

    const state = getState();
    const payload = {
      destination: state.destination?.nom ?? null,
      dates: state.dates,
      activites: state.activites,
      reponse: "oui",
    };

    const timeout = new Promise((resolve) => setTimeout(() => resolve({ ok: false, timeout: true }), 2500));
    const result = await Promise.race([sendReponse(payload), timeout]);
    setState({ envoi: result });

    gsap.delayedCall(0.4, () => router.goTo("final"));
  });

  return { onEnter };
}
