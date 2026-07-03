import "./styles/variables.css";
import "./styles/glass.css";
import "./styles/main.css";

import { CONFIG } from "./config.js";
import { createRouter } from "./router.js";
import { createProgress } from "./components/progress.js";
import { createParticles } from "./components/particles.js";

import { initHeroStep } from "./steps/hero.js";
import { initLieuStep } from "./steps/lieu.js";
import { initDatesStep } from "./steps/dates.js";
import { initActivitesStep } from "./steps/activites.js";
import { initRecapStep } from "./steps/recap.js";
import { initFinalStep } from "./steps/final.js";

document.getElementById("recap-question").textContent = CONFIG.question;

createParticles(document.getElementById("particles-bg"));

const progressEl = document.getElementById("progress");
const progress = createProgress({
  trackEl: progressEl.querySelector(".progress-track"),
  planeEl: document.getElementById("progress-plane"),
  backBtn: document.getElementById("progress-back"),
  onBack: () => router.back(),
});

const steps = {};
const router = createRouter({ steps, progress, progressEl });

steps.hero = initHeroStep(router);
steps.lieu = initLieuStep(router);
steps.dates = initDatesStep(router);
steps.activites = initActivitesStep(router);
steps.recap = initRecapStep(router);
steps.final = initFinalStep();

router.goTo("hero");
