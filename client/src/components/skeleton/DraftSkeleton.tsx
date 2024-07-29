import { Skeleton } from "../ui/Skeleton";

const DraftSkeleton = () => {
  return (
    <div>
      <Skeleton className="mx-[3.375rem] flex items-center gap-2 rounded-lg justify-start w-[8rem] mb-3 py-5" />

      <div className="flex relative flex-col w-full px-[3.375rem] space-y-3">
        <Skeleton className="w-full py-9" />
        <Skeleton className="w-full py-8" />

        <Skeleton className="md:w-[39rem] py-3" />
        <Skeleton className="md:w-[40rem] py-3" />
        <Skeleton className="md:w-[38rem] py-3" />
        <Skeleton className="md:w-[35rem] py-3" />
        <Skeleton className="w-full py-24" />
      </div>
    </div>
  );
};

export default DraftSkeleton;
