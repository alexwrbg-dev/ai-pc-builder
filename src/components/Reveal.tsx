"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** Fait apparaître son contenu quand il entre dans la fenêtre. `i` décale l'animation entre voisins. */
export default function Reveal({ children, i = 0, className = "" }: { children: ReactNode; i?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("in"); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ "--i": i } as CSSProperties}>{children}</div>;
}
