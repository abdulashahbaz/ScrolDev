import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { photos } from "@/content/photos";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="404"
      title="This path ends at the river."
      intro="The page you were looking for isn't here. The bridge still is."
      photo={photos.mostarDuskTown}
      alt="Mostar's old town at dusk"
    >
      <Link href="/" className="button">
        Back to the house
      </Link>
    </PageHero>
  );
}
