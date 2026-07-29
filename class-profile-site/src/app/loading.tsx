import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-marigold/30" />
        <span className="relative flex h-3 w-3 rounded-full bg-marigold" />
      </div>
      <p className="font-mono text-xs uppercase tracking-widest text-muted dark:text-muted-dark">
        Loading roll call…
      </p>
    </Container>
  );
}
