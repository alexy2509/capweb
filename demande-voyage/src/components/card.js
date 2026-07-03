const PLACEHOLDER_EMOJI = {
  santorin: "🏛️",
  kyoto: "⛩️",
  amalfi: "🍋",
  bali: "🌴",
  laponie: "🌌",
  maldives: "🐚",
  islande: "🌋",
  "fer-a-cheval": "🏔️",
  "breche-de-roland": "🥾",
  surprise: "🎁",
};

export function createDestinationCard(dest) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card card-destination";
  card.dataset.id = dest.id;
  card.setAttribute("aria-pressed", "false");

  const media = document.createElement("div");
  media.className = "card-media";
  media.textContent = PLACEHOLDER_EMOJI[dest.id] ?? "✈️";

  const img = document.createElement("img");
  img.loading = "lazy";
  img.alt = dest.nom;
  img.src = dest.img;
  img.onload = () => media.classList.add("has-photo");
  img.onerror = () => img.remove();
  media.appendChild(img);

  const shade = document.createElement("div");
  shade.className = "card-shade";

  const body = document.createElement("div");
  body.className = "card-body";
  body.innerHTML = `
    <h3>${dest.nom}</h3>
    ${dest.region ? `<span class="card-region">${dest.region}</span>` : ""}
  `;

  const check = document.createElement("span");
  check.className = "card-check";
  check.textContent = "♥";

  card.append(media, shade, body, check);

  if (dest.sportif) {
    const badge = document.createElement("span");
    badge.className = "card-badge";
    badge.textContent = "🥾 Sportif · nature";
    card.appendChild(badge);
  }

  return card;
}

export function createActivityCard(activite) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card card-activite";
  card.dataset.id = activite.id;
  card.setAttribute("aria-pressed", "false");
  card.innerHTML = `
    <span class="emoji">${activite.emoji}</span>
    <span class="label">${activite.label}</span>
    <span class="card-check">♥</span>
  `;
  return card;
}
