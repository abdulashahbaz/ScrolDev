import Link from "next/link";
import { PageHero } from "@/components/page-hero";

export default function NotFound() {
  return (
    <PageHero eyebrow="404" title="This path ends at the river." intro="The page you were looking for isn't here. The valley still is." time={0.98} uid="hero-404">
      <Link href="/" className="button">
        Back to the start
      </Link>
    </PageHero>
  );
}
