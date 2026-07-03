const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

function toISO(date) {
  return date.toISOString().slice(0, 10);
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function sameDay(a, b) {
  return a && b && toISO(a) === toISO(b);
}

export function createCalendar({ container, dateMin, dateMax, onChange }) {
  const min = startOfDay(new Date(dateMin));
  const max = startOfDay(new Date(dateMax));

  let viewDate = new Date(min.getFullYear(), min.getMonth(), 1);
  let rangeStart = null;
  let rangeEnd = null;

  container.innerHTML = `
    <div class="calendar-nav">
      <button type="button" class="cal-prev" aria-label="Mois précédent">‹</button>
      <span class="calendar-month-label"></span>
      <button type="button" class="cal-next" aria-label="Mois suivant">›</button>
    </div>
    <div class="calendar-weekdays">${WEEKDAYS.map((w) => `<span>${w}</span>`).join("")}</div>
    <div class="calendar-days"></div>
  `;

  const label = container.querySelector(".calendar-month-label");
  const daysEl = container.querySelector(".calendar-days");
  const prevBtn = container.querySelector(".cal-prev");
  const nextBtn = container.querySelector(".cal-next");

  function isSameMonth(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  function render() {
    label.textContent = viewDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    prevBtn.disabled = isSameMonth(viewDate, min);
    nextBtn.disabled = isSameMonth(viewDate, max);

    daysEl.innerHTML = "";
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = startOfDay(new Date());

    for (let i = 0; i < startOffset; i++) {
      const empty = document.createElement("span");
      empty.className = "calendar-day is-empty";
      daysEl.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "calendar-day";
      btn.textContent = String(d);

      const disabled = date < min || date > max || date < today;
      if (disabled) {
        btn.classList.add("is-disabled");
        btn.disabled = true;
      } else {
        btn.addEventListener("click", () => selectDate(date));
      }

      if (sameDay(date, today)) btn.classList.add("is-today");
      if (rangeStart && sameDay(date, rangeStart)) btn.classList.add("is-start");
      if (rangeEnd && sameDay(date, rangeEnd)) btn.classList.add("is-end");
      if (rangeStart && rangeEnd && date > rangeStart && date < rangeEnd) {
        btn.classList.add("is-in-range");
      }

      daysEl.appendChild(btn);
    }
  }

  function selectDate(date) {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      rangeStart = date;
      rangeEnd = null;
    } else if (date < rangeStart) {
      rangeEnd = rangeStart;
      rangeStart = date;
    } else {
      rangeEnd = date;
    }
    render();
    emitChange();
  }

  function emitChange() {
    if (!rangeStart) {
      onChange({ debut: null, fin: null, nuits: 0 });
      return;
    }
    if (!rangeEnd) {
      onChange({ debut: toISO(rangeStart), fin: null, nuits: 0 });
      return;
    }
    const nuits = Math.round((rangeEnd - rangeStart) / 86400000);
    onChange({ debut: toISO(rangeStart), fin: toISO(rangeEnd), nuits });
  }

  prevBtn.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    render();
  });

  nextBtn.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    render();
  });

  render();

  return {
    reset() {
      rangeStart = null;
      rangeEnd = null;
      viewDate = new Date(min.getFullYear(), min.getMonth(), 1);
      render();
    },
  };
}
