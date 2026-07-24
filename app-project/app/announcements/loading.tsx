import { Skeleton, CardSkeletonGrid } from "@/components/Skeleton";

export default function LoadingAnnouncements() {
  return (
    <div className="container-page py-16">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-3 h-9 w-64" />
      <Skeleton className="mt-3 h-5 w-96 max-w-full" />
      <div className="mt-10">
        <CardSkeletonGrid count={6} />
      </div>
    </div>
  );
}
