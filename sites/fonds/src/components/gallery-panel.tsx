import { useMemo, type Ref } from "react";
import { looks } from "../content/site";
import { buildLayout } from "../lib/layout";

// The black panel that slides up over the hero. Card scale and the inner
// wrapper's position are written every frame by the scroll engine in App.
export function GalleryPanel({
  ref,
  wrapRef,
  cols,
}: {
  ref: Ref<HTMLDivElement>;
  wrapRef: Ref<HTMLDivElement>;
  cols: number;
}) {
  const cells = useMemo(() => buildLayout(looks.length, cols), [cols]);

  return (
    <div ref={ref} className="fixed inset-0 z-10 overflow-hidden bg-black" style={{ transform: "translateY(100%)" }}>
      <div ref={wrapRef} className="w-full pt-[min(400px,40vh)]">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {cells.map((index, i) => {
            const key = `${cols}-${i}`;
            if (index < 0) return <div key={key} aria-hidden className="aspect-[2/3]" />;
            const look = looks[index];
            return (
              <figure
                key={key}
                className="bp-card aspect-[2/3] overflow-hidden bg-neutral-900"
                style={{ transform: "scale(0)", transformOrigin: i % cols < cols / 2 ? "right bottom" : "left bottom" }}
              >
                <img src={look.src} alt={look.alt} loading="lazy" decoding="async" className="size-full object-cover" />
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
