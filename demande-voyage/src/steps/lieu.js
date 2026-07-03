import { destinations } from "../data/destinations.js";
import { createDestinationCard } from "../components/card.js";
import { setState } from "../state.js";
import { popSelect } from "../animations/transitions.js";

export function initLieuStep(router) {
  const grid = document.getElementById("lieu-grid");
  const detail = document.getElementById("lieu-detail");
  const continueBtn = document.getElementById("lieu-continue");

  destinations.forEach((dest) => {
    const card = createDestinationCard(dest);
    card.addEventListener("click", () => select(dest, card));
    grid.appendChild(card);
  });

  function select(dest, card) {
    setState({ destination: { id: dest.id, nom: dest.nom } });
    grid.classList.add("has-selection");
    grid.querySelectorAll(".card").forEach((c) => {
      const isSelected = c === card;
      c.classList.toggle("is-selected", isSelected);
      c.setAttribute("aria-pressed", String(isSelected));
    });
    popSelect(card);
    detail.textContent = dest.phrase;
    continueBtn.disabled = false;
  }

  continueBtn.addEventListener("click", () => router.goTo("dates"));

  return { onEnter() {} };
}
