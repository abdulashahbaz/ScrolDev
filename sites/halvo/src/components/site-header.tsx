"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bot,
  ChartLine,
  ChevronDown,
  Headset,
  Landmark,
  Lock,
  Menu,
  Plug,
  ScrollText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { productLinks, resourceLinks, solutionLinks, type NavLink } from "@/content/site";
import { posts } from "@/content/posts";
import { ButtonLink } from "./button";
import { Logo } from "./logo";
import { cn } from "@/lib/cn";
import { useSvgId } from "@/lib/use-svg-id";

type MenuId = "product" | "solutions" | "resources";

const icons: Record<MenuId, LucideIcon[]> = {
  product: [Bot, Workflow, ShieldCheck, ChartLine, Plug, Lock],
  solutions: [Landmark, Headset, TrendingUp, Users],
  resources: [BookOpen, ScrollText, Sparkles],
};

const menus: { id: MenuId; label: string; links: NavLink[] }[] = [
  { id: "product", label: "Product", links: productLinks },
  { id: "solutions", label: "Solutions", links: solutionLinks },
  { id: "resources", label: "Resources", links: resourceLinks },
];

const latestPost = [...posts].sort((a, b) => b.date.localeCompare(a.date))[0];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close every menu when the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const openMenu = (id: MenuId) => {
    clearTimeout(closeTimer.current);
    setOpen(id);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  const solid = scrolled || open !== null || mobileOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "absolute inset-0 -z-10 border-b transition-all duration-500 ease-out-expo",
          solid ? "border-white/[0.07] bg-ink-950/75 backdrop-blur-xl" : "border-transparent bg-transparent",
        )}
      />
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Halvo home" className="-m-1 p-1">
          <Logo id="header-logo" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block" onMouseLeave={scheduleClose}>
          <ul className="flex items-center gap-1">
            {menus.map((menu) => (
              <li key={menu.id} className="relative" onMouseEnter={() => openMenu(menu.id)}>
                <MenuTrigger
                  label={menu.label}
                  expanded={open === menu.id}
                  onToggle={() => setOpen((v) => (v === menu.id ? null : menu.id))}
                  panelId={`menu-${menu.id}`}
                />
                <AnimatePresence>
                  {open === menu.id && (
                    <motion.div
                      id={`menu-${menu.id}`}
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
                      onMouseEnter={() => openMenu(menu.id)}
                    >
                      <MenuPanel id={menu.id} links={menu.links} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
            <li>
              <NavItem href="/customers" active={pathname.startsWith("/customers")}>
                Customers
              </NavItem>
            </li>
            <li>
              <NavItem href="/pricing" active={pathname === "/pricing"}>
                Pricing
              </NavItem>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-3.5 py-2 text-sm text-mute transition-colors hover:text-bone sm:block"
          >
            Log in
          </Link>
          <ButtonLink href="/contact" className="hidden sm:inline-flex">
            Book a demo
          </ButtonLink>
          <button
            type="button"
            className="-mr-2 grid size-10 place-items-center rounded-full text-bone lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>{mobileOpen && <MobileMenu />}</AnimatePresence>
    </header>
  );
}

function MenuTrigger({
  label,
  expanded,
  onToggle,
  panelId,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  panelId: string;
}) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={panelId}
      onClick={onToggle}
      className={cn(
        "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors",
        expanded ? "text-bone" : "text-mute hover:text-bone",
      )}
    >
      {label}
      <ChevronDown
        aria-hidden="true"
        className={cn("size-3.5 transition-transform duration-300", expanded && "rotate-180")}
      />
    </button>
  );
}

function NavItem({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "block rounded-full px-3.5 py-2 text-sm transition-colors",
        active ? "text-bone" : "text-mute hover:text-bone",
      )}
    >
      {children}
    </Link>
  );
}

function MenuPanel({ id, links }: { id: MenuId; links: NavLink[] }) {
  const width = id === "product" ? "w-[600px]" : id === "solutions" ? "w-[640px]" : "w-[560px]";
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl",
        width,
      )}
    >
      <div className={cn("grid gap-1 p-2", id === "product" ? "grid-cols-2" : "grid-cols-[1fr_220px]")}>
        {id === "product" ? (
          links.map((link, i) => <MenuLink key={link.href} link={link} Icon={icons[id][i]} />)
        ) : (
          <>
            <div className="grid gap-1">
              {links.map((link, i) => (
                <MenuLink key={link.href} link={link} Icon={icons[id][i]} />
              ))}
            </div>
            <FeaturedCard id={id} />
          </>
        )}
      </div>
      {id === "product" && (
        <Link
          href="/changelog"
          className="group flex items-center justify-between border-t border-white/[0.07] bg-white/[0.02] px-5 py-3 text-sm text-mute transition-colors hover:text-bone"
        >
          <span>
            <span className="mr-2 rounded-full bg-ember/15 px-2 py-0.5 text-xs font-medium text-ember">New</span>
            Agents 2.0: handoffs, memory and a 3x faster runtime
          </span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

function MenuLink({ link, Icon }: { link: NavLink; Icon: LucideIcon }) {
  return (
    <Link href={link.href} className="group flex gap-3.5 rounded-xl p-3 transition-colors hover:bg-white/[0.04]">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-ink-800 text-mute transition-colors group-hover:border-ember/30 group-hover:text-ember">
        <Icon className="size-[18px]" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span>
        <span className="block text-sm font-medium text-bone">{link.title}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-mute">{link.description}</span>
      </span>
    </Link>
  );
}

function FeaturedCard({ id }: { id: MenuId }) {
  const gradientId = useSvgId("feat");
  const card =
    id === "solutions"
      ? {
          eyebrow: "Case study",
          title: "Northpeak closes the books in three days, not nine.",
          href: "/customers/northpeak",
        }
      : { eyebrow: latestPost.category, title: latestPost.title, href: `/blog/${latestPost.slug}` };
  return (
    <Link
      href={card.href}
      className="group relative flex flex-col justify-end overflow-hidden rounded-xl border border-white/[0.08] bg-ink-800 p-4"
    >
      <svg className="absolute inset-0 size-full" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 200 200">
        <defs>
          <radialGradient id={gradientId} cx="80%" cy="10%" r="90%">
            <stop offset="0" stopColor="#f5a65b" stopOpacity="0.45" />
            <stop offset="1" stopColor="#f5a65b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="200" height="200" fill={`url(#${gradientId})`} />
        {[30, 55, 80].map((r) => (
          <circle key={r} cx="170" cy="20" r={r} fill="none" stroke="#f5a65b" strokeOpacity="0.18" />
        ))}
      </svg>
      <span className="relative eyebrow text-ember">{card.eyebrow}</span>
      <span className="relative mt-2 text-sm font-medium leading-snug text-bone">{card.title}</span>
      <span className="relative mt-3 inline-flex items-center gap-1 text-[13px] text-mute transition-colors group-hover:text-bone">
        Read more <ArrowRight className="size-3.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

function MobileMenu() {
  return (
    <motion.div
      id="mobile-menu"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-ink-950/98 backdrop-blur-xl lg:hidden"
    >
      <motion.nav
        aria-label="Mobile"
        initial={{ y: -12 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="container-x flex flex-col gap-8 pb-10 pt-6"
      >
        {menus.map((menu) => (
          <div key={menu.id}>
            <p className="eyebrow text-dim">{menu.label}</p>
            <ul className="mt-3 grid gap-1">
              {menu.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block py-1.5 text-lg text-bone">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <ul className="grid gap-1 border-t border-white/[0.08] pt-6">
          {[
            { title: "Customers", href: "/customers" },
            { title: "Pricing", href: "/pricing" },
            { title: "Log in", href: "/login" },
          ].map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="block py-1.5 text-lg text-bone">
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink href="/contact" size="lg" arrow className="w-full">
          Book a demo
        </ButtonLink>
      </motion.nav>
    </motion.div>
  );
}
