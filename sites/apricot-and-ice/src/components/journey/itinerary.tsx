"use client";

import { useEffect, useRef } from "react";

// Day-by-day list with a line that fills as you read down it.
export function Itinerary({ days }: { days: { title: string; body: string }[] }) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const reading = window.innerHeight * 0.6;
      const progress = Math.min(1, Math.max(0, (reading - rect.top) / rect.height));
      list.style.setProperty("--progress", progress.toFixed(4));
      list.querySelectorAll<HTMLElement>("li").forEach((li) => {
        li.classList.toggle("is-past", li.getBoundingClientRect().top < reading);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <ol ref={listRef} className="itinerary">
      {days.map((day, i) => (
        <li key={day.title}>
          <span className="itinerary-day">Day {i + 1}</span>
          <h3>{day.title}</h3>
          <p>{day.body}</p>
        </li>
      ))}
    </ol>
  );
}
