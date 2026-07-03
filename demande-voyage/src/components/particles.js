import gsap from "gsap";

export function createParticles(canvas) {
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let particles = [];
  let width = 0;
  let height = 0;
  let parallaxX = 0;
  let parallaxY = 0;

  function resize() {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    const count = Math.round((window.innerWidth * window.innerHeight) / 9000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: (Math.random() * 1.6 + 0.4) * window.devicePixelRatio,
      speed: (Math.random() * 0.15 + 0.03) * window.devicePixelRatio,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() > 0.7 ? "215,185,140" : "253,246,236",
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.y -= p.speed;
      if (p.y < -10) p.y = height + 10;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.hue},${p.opacity})`;
      ctx.arc(p.x + parallaxX, p.y + parallaxY, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.hue},${p.opacity})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function onPointerMove(e) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    parallaxX = ((clientX - cx) / cx) * 10 * window.devicePixelRatio;
    parallaxY = ((clientY - cy) / cy) * 10 * window.devicePixelRatio;
  }

  resize();
  window.addEventListener("resize", resize);

  if (reduceMotion) {
    drawStatic();
    return { destroy() {} };
  }

  window.addEventListener("pointermove", onPointerMove);
  gsap.ticker.add(draw);

  return {
    destroy() {
      gsap.ticker.remove(draw);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    },
  };
}
