import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { CiImageOn, CiSearch } from "react-icons/ci";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { createApi } from "unsplash-js";
import { ApiResponse } from "unsplash-js/dist/helpers/response";
import { Photos } from "unsplash-js/dist/methods/search/types/response";

import { AspectRatio } from "../ui/aspect-ratio";
import { Skeleton } from "../ui/Skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const api = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
});

// type CoverImageProps = {
//   handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   setCoverImage: React.Dispatch<React.SetStateAction<string>>;
//   setIsImageSelected: React.Dispatch<React.SetStateAction<boolean>>;
// uploading: Boolean
// };

export function CoverImage({
  handleManualImageUpload,
  setCoverImage,
  setIsImageSelected,
  handleUnsplashImageUpload,
  uploading, //boolean
}: any) {
  const [imageSearch, setImageSearch] = useState<string>("");
  const [imageResponse, setImageResponse] = useState<ApiResponse<Photos>>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getImage() {
      const res = await api.search.getPhotos({
        query: "random",
        orientation: "landscape",
      });
      setImageResponse(res);
      setLoading(false);
    }
    getImage();
  }, []);

  const handleSearchImage = async () => {
    setLoading(true);
    const res = await api.search.getPhotos({
      query: imageSearch,
      orientation: "landscape",
    });
    setImageResponse(res);
    setLoading(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={uploading ? true : false}>
        <div
          className={`mx-[3.375rem] flex items-center gap-2 px-3 hover:bg-gray-200 rounded-full justify-start w-[8rem] mb-3 ${
            uploading ? "bg-slate-200" : ""
          }`}
        >
          {uploading ? (
            <span className="loader m-3"></span>
          ) : (
            <CiImageOn size={23} />
          )}
          <button
            className={`py-2 font-notosans text-sm font-semibold text-gray-600 text-nowrap`}
          >
            Add Cover
          </button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="ml-10">
        <Tabs
          defaultValue={uploading ? "null" : "uploadImage"}
          className="w-[400px] font-notosans"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="uploadImage">Upload</TabsTrigger>
            <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
          </TabsList>
          <TabsContent value="uploadImage">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
                <CardDescription>
                  Recommended dimension is 1600 x 840
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 p-3 mx-3 mb-5 border border-dashed rounded-3xl flex justify-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="imageUpload"
                  onChange={handleManualImageUpload}
                />
                <label
                  htmlFor="imageUpload"
                  className="gap-3 border flex justify-center items-center px-3 py-1 hover:bg-gray-100 rounded-full my-7 font-semibold"
                >
                  <IoCloudUploadOutline size={15} />
                  <span>Upload Image</span>
                </label>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unsplash">
            <Card className="pt-5">
              <CardContent className="space-y-2">
                <div className="w-full">
                  <div className="flex items-center justify-between w-full">
                    <input
                      type="text"
                      className="flex-grow p-2 border rounded outline-none placeholder:italic mr-2"
                      placeholder="Search an Image"
                      value={imageSearch}
                      onChange={(e) => setImageSearch(e.target.value)}
                    />
                    <button
                      className="px-4 border py-[0.43rem] rounded-xl"
                      onClick={handleSearchImage}
                    >
                      <CiSearch size={25} />
                    </button>
                  </div>
                  <div className="p-3 border mt-2">
                    <div className="grid grid-cols-2 overflow-auto h-[15rem] gap-2">
                      {imageResponse?.response?.results.map((image) => (
                        <RenderImageAndAttribute
                          key={image.id}
                          image={image}
                          isLoading={loading}
                          onClick={() => {
                            console.log("Image selected");
                            setCoverImage(image.urls.regular);
                            setIsImageSelected(true);
                            handleUnsplashImageUpload(image.urls.regular);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type RenderImageAndAttributeProps = {
  image: any;
  isLoading: boolean;
  onClick: () => void;
};

function RenderImageAndAttribute({
  image,
  isLoading,
  onClick,
}: RenderImageAndAttributeProps) {
  return (
    <div className="relative w-full h-full" onClick={onClick}>
      <AspectRatio ratio={16 / 12}>
        {isLoading ? (
          <Skeleton className="object-cover w-full h-full rounded-md" />
        ) : (
          <img
            src={image.urls.regular}
            alt={`Photo by ${image.user.username}`}
            className="object-cover w-full h-full rounded-md"
          />
        )}
      </AspectRatio>
      {isLoading ? (
        <Skeleton className="w-5 px-9 py-2 mt-1" />
      ) : (
        <span className="block text-sm capitalize text-gray-500">
          {image.user.username}
        </span>
      )}
    </div>
  );
}
