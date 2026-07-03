import gsap from "gsap";

export function createProgress({ trackEl, planeEl, backBtn, onBack }) {
  backBtn.addEventListener("click", () => onBack());

  function update(index, total) {
    const fraction = total <= 1 ? 0 : index / (total - 1);
    const width = trackEl.getBoundingClientRect().width;
    gsap.to(planeEl, {
      left: fraction * width,
      duration: 0.7,
      ease: "power2.out",
    });
  }

  function setBackVisible(visible) {
    backBtn.style.visibility = visible ? "visible" : "hidden";
  }

  return { update, setBackVisible };
}
