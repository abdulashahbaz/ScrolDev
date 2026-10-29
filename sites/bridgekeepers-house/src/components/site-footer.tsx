import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { experiences } from "@/content/experiences";
import { rooms } from "@/content/rooms";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <h2>
            Cross the bridge.
            <br />
            <em>We&apos;ll keep the light on.</em>
          </h2>
          <div className="footer-contact">
            <p>Rooms from €180 a night, breakfast on the terrace included. Our team replies to every enquiry within a day.</p>
            <div>
              <Link href="/book" className="button button-copper">
                Check availability
              </Link>
            </div>
          </div>
        </div>
        <div className="footer-grid">
          <div>
            <Link href="/" className="logo">
              <LogoMark />
              <span>
                {site.short}
                <small>Mostar</small>
              </span>
            </Link>
          </div>
          <div>
            <h3>Stay</h3>
            <ul>
              {rooms.map((r) => (
                <li key={r.slug}>
                  <Link href={`/rooms/${r.slug}`}>{r.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>The house</h3>
            <ul>
              <li>
                <Link href="/dining">Terrace &amp; Kitchen</Link>
              </li>
              <li>
                <Link href="/story">Our story</Link>
              </li>
              <li>
                <Link href="/book">Book a stay</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Around Mostar</h3>
            <ul>
              {experiences.slice(0, 5).map((e) => (
                <li key={e.slug}>
                  <Link href={`/experiences#${e.slug}`}>{e.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{site.place}</p>
          <p>{site.credit}</p>
        </div>
      </div>
    </footer>
  );
}
