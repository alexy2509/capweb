import { CONFIG } from "../config.js";

function formatRecap(data) {
  const { destination, dates, activites, reponse } = data;
  const lignesActivites = activites.map((a) => `  - ${a}`).join("\n");
  return (
    `Elle a répondu : ${reponse === "oui" ? "OUI 💛" : reponse}\n\n` +
    `Destination : ${destination ?? "—"}\n` +
    `Dates : du ${dates.debut ?? "—"} au ${dates.fin ?? "—"} (${dates.nuits ?? "—"} nuits)\n` +
    `Activités :\n${lignesActivites || "  —"}\n`
  );
}

export function buildMailto(data) {
  const subject = encodeURIComponent("Demande en voyage — sa réponse 💌");
  const body = encodeURIComponent(formatRecap(data));
  return `mailto:${CONFIG.emailNotif}?subject=${subject}&body=${body}`;
}

export async function sendReponse(data) {
  const payload = { ...data, horodatage: new Date().toISOString() };

  if (CONFIG.backend === "web3forms" && CONFIG.web3formsAccessKey) {
    try {
      const res = await fetch(CONFIG.web3formsEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: CONFIG.web3formsAccessKey,
          subject: "Demande en voyage — sa réponse 💌",
          from_name: "Le site de la demande",
          message: formatRecap(payload),
          ...payload,
        }),
      });
      const json = await res.json();
      return { ok: !!json.success, payload };
    } catch (err) {
      return { ok: false, payload, error: err };
    }
  }

  if (CONFIG.backend === "php" && CONFIG.apiEndpoint) {
    try {
      const res = await fetch(CONFIG.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return { ok: res.ok, payload };
    } catch (err) {
      return { ok: false, payload, error: err };
    }
  }

  return { ok: false, payload, skipped: true };
}
