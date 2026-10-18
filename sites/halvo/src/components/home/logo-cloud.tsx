import { logos } from "@/content/customers";
import { FakeLogo } from "../fake-logo";

export function LogoCloud() {
  return (
    <section aria-label="Customers" className="relative border-y border-white/[0.06] py-12">
      <p className="container-x text-center text-sm text-dim">
        Operations teams at <span className="text-mute">1,200+ companies</span> run on Halvo
      </p>
      <div className="group mt-9 overflow-hidden mask-fade-x [--marquee-duration:45s]">
        {/* Two identical copies; the track slides by exactly one copy, then loops. */}
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center gap-16 pr-16 text-bone/55 sm:gap-20 sm:pr-20"
            >
              {logos.map((name) => (
                <li key={name} className="transition-colors duration-300 hover:text-bone">
                  <FakeLogo name={name} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
