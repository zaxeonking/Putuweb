import { Skeleton, CardSkeletonGrid } from "@/components/Skeleton";

export default function LoadingAchievements() {
  return (
    <div className="container-page py-16">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-3 h-9 w-72" />
      <Skeleton className="mt-3 h-5 w-96 max-w-full" />
      <Skeleton className="mt-10 h-40 w-full rounded-2xl" />
      <div className="mt-10">
        <CardSkeletonGrid count={6} />
      </div>
    </div>
  );
}
