import { PageIntro } from "@/components/ui/PageIntro";
import { GALLERY_PAGE } from "@/lib/constants";

export function GalleryIntro() {
  return <PageIntro eyebrow={GALLERY_PAGE.eyebrow} title={GALLERY_PAGE.title} lead={GALLERY_PAGE.lead} />;
}
