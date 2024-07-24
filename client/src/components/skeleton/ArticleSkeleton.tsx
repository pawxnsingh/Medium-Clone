import { Skeleton } from "../ui/Skeleton";

const ArticleSkeleton = () => {
  return (
    <div className="flex justify-center w-screen">
      <div className="mt-8 w-[70rem] mx-7  md:max-w-[42.5rem]">
        <Skeleton className="w-[23rem] p-5" />
        <div className="mt-8 flex items-center">
          <Skeleton className="p-5 w-5 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="w-36 p-2" />
            <Skeleton className="w-24 p-2" />
          </div>
        </div>

        {Array.from({ length: 14 }, (_, index) => (
          <div className="mt-8 space-y-2" key={index}>
            <Skeleton className="md:w-[39rem] py-3" />
            <Skeleton className="md:w-[40rem] py-3" />
            <Skeleton className="md:w-[38rem] py-3" />
            <Skeleton className="md:w-[35rem] py-3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleSkeleton;
