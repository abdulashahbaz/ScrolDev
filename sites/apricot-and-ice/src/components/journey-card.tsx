import Link from "next/link";
import { Icon } from "@/components/icon";
import { Landscape } from "@/components/scene/landscape";
import { formatPrice, type Journey } from "@/content/journeys";

export function JourneyCard({ journey, delay = 0 }: { journey: Journey; delay?: number }) {
  return (
    <Link href={`/journeys/${journey.slug}`} className="journey-card" data-reveal style={{ "--reveal-delay": `${delay}s` } as React.CSSProperties}>
      <div className="journey-art">
        <Landscape time={journey.scene.time} season={journey.scene.season} uid={`card-${journey.slug}`} />
        <span className="journey-days">{journey.days} days</span>
      </div>
      <div className="journey-body">
        <h3>
          {journey.name}
          <Icon name="arrowUpRight" size={22} className="journey-arrow" />
        </h3>
        <p>{journey.summary}</p>
        <dl className="journey-meta">
          <div>
            <dt>Level</dt>
            <dd>{journey.level}</dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>{journey.window}</dd>
          </div>
          <div>
            <dt>From</dt>
            <dd>{formatPrice(journey.priceFrom)}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
