import { Skeleton } from "@/components/Skeleton";

export default function LoadingFaq() {
  return (
    <div className="container-page py-16">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-3 h-9 w-80 max-w-full" />
      <Skeleton className="mt-3 h-5 w-96 max-w-full" />
      <div className="mt-10 max-w-3xl space-y-10">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-3 h-40 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
