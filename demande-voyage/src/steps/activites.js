import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { activites } from "../data/activites.js";
import { createActivityCard } from "../components/card.js";
import { setState } from "../state.js";
import { reduceMotion } from "../animations/transitions.js";

gsap.registerPlugin(Flip);

export function initActivitesStep(router) {
  const grid = document.getElementById("activites-grid");
  const continueBtn = document.getElementById("activites-continue");
  const panierCount = document.getElementById("panier-count");
  const panierIcon = document.getElementById("panier-icon");

  const selected = new Map();

  activites.forEach((act) => {
    const card = createActivityCard(act);
    card.addEventListener("click", () => toggle(act, card));
    grid.appendChild(card);
  });

  function toggle(act, card) {
    const isSelected = selected.has(act.id);
    if (isSelected) {
      selected.delete(act.id);
      card.classList.remove("is-selected");
      card.setAttribute("aria-pressed", "false");
    } else {
      selected.set(act.id, act.label);
      card.classList.add("is-selected");
      card.setAttribute("aria-pressed", "true");
      flyToBasket(card);
    }
    updateCount();
    setState({ activites: Array.from(selected.values()) });
    continueBtn.disabled = selected.size === 0;
  }

  function flyToBasket(card) {
    if (reduceMotion) return;
    const emoji = card.querySelector(".emoji");
    const rect = emoji.getBoundingClientRect();
    const flyer = emoji.cloneNode(true);
    flyer.classList.add("panier-fly");
    flyer.style.position = "fixed";
    flyer.style.left = `${rect.left}px`;
    flyer.style.top = `${rect.top}px`;
    flyer.style.margin = "0";
    document.body.appendChild(flyer);

    Flip.fit(flyer, panierIcon, {
      duration: 0.6,
      ease: "power2.inOut",
      scale: true,
      absolute: true,
      onComplete: () => {
        flyer.remove();
        gsap.fromTo(
          panierIcon,
          { scale: 1 },
          { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 }
        );
      },
    });
  }

  function updateCount() {
    const n = selected.size;
    panierCount.textContent =
      n === 0 ? "Aucune envie ajoutée" : `${n} envie${n > 1 ? "s" : ""} ajoutée${n > 1 ? "s" : ""}`;
  }

  continueBtn.addEventListener("click", () => router.goTo("recap"));

  return { onEnter() {} };
}
