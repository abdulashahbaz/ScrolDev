import type { Metadata, Viewport } from "next";
import { Cormorant, Jost } from "next/font/google";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import "./globals.css";

const display = Cormorant({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-display" });
const sans = Jost({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: site.title, template: `%s · ${site.short}` },
  description: site.description,
  applicationName: site.name,
  openGraph: { type: "website", siteName: site.name, title: site.title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#0b2421",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <Reveal />
      </body>
    </html>
  );
}
