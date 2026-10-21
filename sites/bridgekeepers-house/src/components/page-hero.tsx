import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  photo: StaticImageData;
  alt: string;
  position?: string;
  children?: ReactNode;
  compact?: boolean;
};

export function PageHero({ eyebrow, title, intro, photo, alt, position = "center", children, compact }: Props) {
  return (
    <section className={compact ? "page-hero page-hero-compact" : "page-hero"} data-hero>
      <Image src={photo} alt={alt} fill priority placeholder="blur" sizes="100vw" className="page-hero-photo" style={{ objectPosition: position }} />
      <div className="page-hero-shade" aria-hidden="true" />
      <div className="wrap page-hero-content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {intro && <p className="page-hero-intro">{intro}</p>}
        {children && <div className="page-hero-actions">{children}</div>}
      </div>
    </section>
  );
}
