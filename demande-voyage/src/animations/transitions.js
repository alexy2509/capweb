import gsap from "gsap";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function stepLeave(el) {
  if (reduceMotion) {
    gsap.set(el, { opacity: 0 });
    return Promise.resolve();
  }
  return gsap
    .timeline()
    .to(el, { opacity: 0, y: -24, duration: 0.35, ease: "power2.in" })
    .then(() => {});
}

export function stepEnter(el) {
  gsap.set(el, { opacity: 0, y: reduceMotion ? 0 : 24 });
  const tl = gsap.timeline();
  tl.to(el, { opacity: 1, y: 0, duration: reduceMotion ? 0.2 : 0.6, ease: "power3.out" });

  const cards = el.querySelectorAll(".card, .boarding-pass, .calendar");
  if (cards.length && !reduceMotion) {
    gsap.set(cards, { opacity: 0, y: 18, scale: 0.96 });
    tl.to(
      cards,
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: "power2.out" },
      "-=0.3"
    );
  } else if (cards.length) {
    gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
  }

  return tl;
}

export function popSelect(el) {
  if (reduceMotion) return;
  gsap.fromTo(el, { scale: 0.94 }, { scale: 1, duration: 0.35, ease: "back.out(2.5)" });
}

export function shakeInvalid(el) {
  if (reduceMotion) return;
  gsap.fromTo(
    el,
    { x: -6 },
    { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" }
  );
}

export { reduceMotion };
