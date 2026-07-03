import { stepEnter, stepLeave } from "./animations/transitions.js";

const STEP_ORDER = ["hero", "lieu", "dates", "activites", "recap", "final"];
const PROGRESS_STEPS = ["lieu", "dates", "activites", "recap"];

export function createRouter({ steps, progress, progressEl }) {
  let current = null;

  function elFor(id) {
    return document.getElementById(`step-${id}`);
  }

  async function goTo(id) {
    const nextEl = elFor(id);
    const prevEl = current ? elFor(current) : null;

    if (prevEl && prevEl !== nextEl) {
      await stepLeave(prevEl);
      prevEl.classList.remove("is-active");
    }

    nextEl.classList.add("is-active");
    steps[id]?.onEnter?.();
    stepEnter(nextEl);

    const progressIndex = PROGRESS_STEPS.indexOf(id);
    if (progressIndex >= 0) {
      progressEl.classList.add("is-visible");
      requestAnimationFrame(() => progress.update(progressIndex, PROGRESS_STEPS.length));
      progress.setBackVisible(true);
    } else {
      progressEl.classList.remove("is-visible");
    }

    current = id;
  }

  function back() {
    const idx = STEP_ORDER.indexOf(current);
    if (idx > 0) goTo(STEP_ORDER[idx - 1]);
  }

  function next() {
    const idx = STEP_ORDER.indexOf(current);
    if (idx < STEP_ORDER.length - 1) goTo(STEP_ORDER[idx + 1]);
  }

  return {
    goTo,
    back,
    next,
    get current() {
      return current;
    },
  };
}
