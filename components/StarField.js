"use client";

import { useEffect, useRef } from "react";

// Full-viewport fixed canvas: a starfield with slow twinkle plus a handful of
// slow-drifting "asteroids" (irregular rocky polygons). Pure canvas, no
// external assets, respects prefers-reduced-motion.
export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const STAR_COUNT = Math.min(220, Math.floor((width * height) / 8000));
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.35,
      twinkleSpeed: Math.random() * 0.015 + 0.004,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.85 ? "cyan" : "white"
    }));

    function makeAsteroid(x, y, size) {
      const points = 8 + Math.floor(Math.random() * 4);
      const verts = Array.from({ length: points }, (_, i) => {
        const angle = (i / points) * Math.PI * 2;
        const radius = size * (0.7 + Math.random() * 0.5);
        return { angle, radius };
      });
      return {
        x,
        y,
        size,
        verts,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.0015,
        driftX: (Math.random() - 0.5) * 0.12,
        driftY: Math.random() * 0.05 + 0.02,
        opacity: Math.random() * 0.25 + 0.18
      };
    }

    const ASTEROID_COUNT = width < 640 ? 3 : 6;
    let asteroids = Array.from({ length: ASTEROID_COUNT }, () =>
      makeAsteroid(Math.random() * width, Math.random() * height, Math.random() * 18 + 10)
    );

    function drawAsteroid(a) {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rotation);
      ctx.beginPath();
      a.verts.forEach((v, i) => {
        const px = Math.cos(v.angle) * v.radius;
        const py = Math.sin(v.angle) * v.radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      const grad = ctx.createLinearGradient(-a.size, -a.size, a.size, a.size);
      grad.addColorStop(0, `rgba(139,92,246,${a.opacity})`);
      grad.addColorStop(1, `rgba(34,211,238,${a.opacity * 0.6})`);
      ctx.fillStyle = grad;
      ctx.strokeStyle = `rgba(255,255,255,${a.opacity * 0.4})`;
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    let frame = 0;
    let raf;

    function tick() {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // subtle nebula glow
      const nebula = ctx.createRadialGradient(
        width * 0.8,
        height * 0.1,
        0,
        width * 0.8,
        height * 0.1,
        width * 0.7
      );
      nebula.addColorStop(0, "rgba(124,58,237,0.10)");
      nebula.addColorStop(1, "rgba(5,5,10,0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      stars.forEach((s) => {
        const alpha = reduceMotion
          ? s.baseAlpha
          : s.baseAlpha * (0.6 + 0.4 * Math.sin(frame * s.twinkleSpeed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle =
          s.hue === "cyan" ? `rgba(103,232,249,${alpha})` : `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      asteroids.forEach((a) => {
        if (!reduceMotion) {
          a.x += a.driftX;
          a.y += a.driftY;
          a.rotation += a.rotationSpeed;
          if (a.y - a.size > height) {
            a.y = -a.size;
            a.x = Math.random() * width;
          }
          if (a.x < -a.size) a.x = width + a.size;
          if (a.x > width + a.size) a.x = -a.size;
        }
        drawAsteroid(a);
      });

      raf = requestAnimationFrame(tick);
    }

    tick();

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-void-900"
    />
  );
}
