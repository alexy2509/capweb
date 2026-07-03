import { CONFIG } from "../config.js";
import { getState } from "../state.js";
import { buildMailto } from "../services/api.js";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function initFinalStep() {
  const messageEl = document.getElementById("final-message");
  const recapEl = document.getElementById("final-recap");
  const countdownEl = document.getElementById("final-countdown");
  const linksEl = document.getElementById("final-links");

  messageEl.textContent = CONFIG.messageFinal;

  function onEnter() {
    const state = getState();
    const { destination, dates, activites } = state;

    recapEl.innerHTML = `
      <div><strong>Destination</strong> · ${destination?.nom ?? "—"}</div>
      <div><strong>Dates</strong> · ${
        dates.debut && dates.fin
          ? `${formatDate(dates.debut)} → ${formatDate(dates.fin)} (${dates.nuits} nuit${dates.nuits > 1 ? "s" : ""})`
          : "—"
      }</div>
      <div><strong>Envies</strong> · ${activites.join(", ") || "—"}</div>
    `;

    countdownEl.textContent = "";
    if (dates.debut) {
      const days = Math.ceil((new Date(dates.debut) - new Date()) / 86400000);
      if (days > 0) countdownEl.textContent = `Plus que ${days} jour${days > 1 ? "s" : ""} avant le départ ✈️`;
    }

    linksEl.innerHTML = "";
    if (!state.envoi?.ok) {
      const payload = { destination: destination?.nom ?? null, dates, activites, reponse: "oui" };
      const mailtoLink = document.createElement("a");
      mailtoLink.href = buildMailto(payload);
      mailtoLink.className = "btn btn-ghost";
      mailtoLink.textContent = "M'envoyer ta réponse par email";
      linksEl.appendChild(mailtoLink);
    }
  }

  return { onEnter };
}
