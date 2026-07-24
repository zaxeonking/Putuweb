import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gallery | Class Site" };

export default function GalleryPage() {
  return (
    <div className="container-page py-16">
      <h1 className="font-display text-3xl font-semibold text-ink-900">Gallery</h1>
      <p className="mt-3 max-w-2xl text-ink-600">
        Photos will appear here once the gallery module is built.
      </p>
    </div>
  );
}
