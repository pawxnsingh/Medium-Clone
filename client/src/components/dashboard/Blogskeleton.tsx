import { Skeleton } from "../ui/skeleton";

const Blogskeleton = () => {
  return (
    <div className="flex flex-col border-b font-notosans mt-7">
      <Skeleton className="h-5 w-28 " />

      <div className="flex justify-between items-start ">
        <div className="space-y-2 mt-6">
          <Skeleton className="h-14 md:w-[27rem] w-[15rem]" />
          <Skeleton className="h-4 w-[13rem]" />
        </div>
        <div className="">
          <Skeleton className="w-[10rem] h-[7rem]" />
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 mb-5 mr-2 lg:mr-[10rem]">
        <Skeleton className="p-3 px-16" />
        <Skeleton className="p-3 px-16" />
      </div>
    </div>
  );
};

export default Blogskeleton;
