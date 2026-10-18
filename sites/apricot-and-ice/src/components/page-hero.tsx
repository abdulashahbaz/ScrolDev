import type { ReactNode } from "react";
import { Landscape } from "@/components/scene/landscape";
import type { Season } from "@/lib/palette";

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  time: number;
  season?: Season;
  uid: string;
  foreground?: boolean;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, intro, time, season, uid, foreground, children }: Props) {
  return (
    <section className="page-hero" data-hero>
      <Landscape time={time} season={season} uid={uid} foreground={foreground} className="page-hero-scene" />
      <div className="page-hero-fade" aria-hidden="true" />
      <div className="wrap page-hero-content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {intro && <p className="page-hero-intro">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
