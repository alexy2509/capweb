import { CONFIG } from "../config.js";
import { createCalendar } from "../components/calendar.js";
import { setState } from "../state.js";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

export function initDatesStep(router) {
  const calendarEl = document.getElementById("dates-calendar");
  const summaryEl = document.getElementById("dates-summary");
  const continueBtn = document.getElementById("dates-continue");

  createCalendar({
    container: calendarEl,
    dateMin: CONFIG.dateMin,
    dateMax: CONFIG.dateMax,
    onChange: ({ debut, fin, nuits }) => {
      setState({ dates: { debut, fin, nuits } });
      if (fin) {
        summaryEl.textContent = `${nuits} nuit${nuits > 1 ? "s" : ""} de rêve, du ${formatDate(debut)} au ${formatDate(fin)}`;
        continueBtn.disabled = false;
      } else if (debut) {
        summaryEl.textContent = "Choisis la date de retour…";
        continueBtn.disabled = true;
      } else {
        summaryEl.textContent = "";
        continueBtn.disabled = true;
      }
    },
  });

  continueBtn.addEventListener("click", () => router.goTo("activites"));

  return { onEnter() {} };
}
