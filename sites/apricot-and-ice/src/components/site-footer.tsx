import Link from "next/link";
import { Logo } from "@/components/logo";
import { journeys } from "@/content/journeys";
import { places } from "@/content/places";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-cta">
          <h2>The valley keeps its own time.</h2>
          <Link href="/enquire" className="button button-apricot">
            Plan your journey
          </Link>
        </div>
        <div className="footer-grid">
          <div className="footer-about">
            <Link href="/" className="logo">
              <Logo />
              {site.name}
            </Link>
            <p>Small-group journeys in Hunza and the high Karakoram, planned in Karimabad and guided by people who grew up here.</p>
          </div>
          <div>
            <h3>Journeys</h3>
            <ul>
              {journeys.map((j) => (
                <li key={j.slug}>
                  <Link href={`/journeys/${j.slug}`}>{j.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Places</h3>
            <ul>
              {places.slice(0, 5).map((p) => (
                <li key={p.slug}>
                  <Link href={`/places#${p.slug}`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Plan</h3>
            <ul>
              <li>
                <Link href="/seasons">When to go</Link>
              </li>
              <li>
                <Link href="/about">About us</Link>
              </li>
              <li>
                <Link href="/enquire">Enquire</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{site.base}</p>
          <p>{site.credit}</p>
        </div>
      </div>
    </footer>
  );
}
