import type { Metadata } from "next";

export const metadata: Metadata = { title: "About | Class Site" };

export default function AboutPage() {
  return (
    <div className="container-page py-16">
      <h1 className="font-display text-3xl font-semibold text-ink-900">About the Class</h1>
      <p className="mt-3 max-w-2xl text-ink-600">
        This page will be built out by the content module. For now it confirms the
        shared layout, navigation, and footer render correctly on a public route.
      </p>
    </div>
  );
}
