import { LayoutGrid, Trophy, Users, Bus, BookOpen, PartyPopper, Camera } from "lucide-react";
import { GalleryCategoryOption } from "@/types";

export const CATEGORY_ICONS: Record<GalleryCategoryOption["icon"], typeof Camera> = {
  "layout-grid": LayoutGrid,
  trophy: Trophy,
  users: Users,
  bus: Bus,
  "book-open": BookOpen,
  "party-popper": PartyPopper,
  camera: Camera,
};

// Maps a photo's category id straight to its representative icon, so cards
// and the lightbox don't need to cross-reference GALLERY_CATEGORIES.
export const CATEGORY_ICON_BY_ID: Record<Exclude<GalleryCategoryOption["id"], "all">, typeof Camera> = {
  "field-day": Trophy,
  gatherings: Users,
  trips: Bus,
  academics: BookOpen,
  celebrations: PartyPopper,
  candid: Camera,
};
