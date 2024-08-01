// Importing React hooks and libraries
import { useCallback, useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

// Importing custom components
import Headerpublishing from "./Headerpublishing";
import { CoverImage } from "./CoverImage";
import { AspectRatio } from "../ui/aspect-ratio";
import DraftSidebar from "./DraftSidebar";

// Importing Recoil atom
import { userAtom } from "../../recoil/atoms/userAtom";

// Importing utility functions
import { generateSignature } from "../../lib/signature";
import BlockNoteEditor from "./BlockNoteEditor";
import DraftSkeleton from "../skeleton/DraftSkeleton";
import { useCreateBlockNote } from "@blocknote/react";

const Newstory = () => {
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");

  const [isImageSelected, setIsImageSelected] = useState<boolean>(false);
  const [publicId, setPublicId] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("articleId");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { id } = useRecoilValue(userAtom);

  console.log(articleId);

  useEffect(() => {
    try {
      async function getArticle() {
        const article = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/content/article/${articleId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(article);

        const blog = article.data.getBlog;
        setTitle(blog?.title || "");
        setSubtitle(blog?.subtitle || "");
        setCoverImage(blog?.articleImage[0] || "");
        setIsImageSelected(blog.articleImage.length > 0);
        setIsLoading(false);
      }
      getArticle();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, [articleId]);

  const publishArticle = async () => {
    if (!isImageSelected) {
      alert("Please upload the cover image");
      return;
    }
    const publish = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/content/article/${articleId}`,
      {
        id: articleId,
        isPublished: true,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(publish, "article got published");
  };

  const debounceSaveDraft = useCallback(
    (
      fxn: (editor?: ReturnType<typeof useCreateBlockNote>) => Promise<any>,
      delay: number
    ) => {
      let debounceTimer: ReturnType<typeof setTimeout>;
      return function (this: unknown, ...args: []) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => fxn.apply(this, args), delay);
      };
    },
    []
  );

  const saveDraft = async (editor?: ReturnType<typeof useCreateBlockNote>) => {
    try {
      const markdown = await editor?.blocksToMarkdownLossy(editor?.document);
      console.log("logged");
      if (title.trim() || subtitle.trim() || markdown?.trim()) {
        const res = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/content/article/${articleId}`,
          {
            id: Number(articleId),
            authorId: Number(id),
            title: title,
            subtitle: subtitle,
            content: markdown,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        return res.data;
      } else {
        console.log("No content to save");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handleManualImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    setUploading(true);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "pawansingh");
      try {
        const uploadImage = await axios.post(
          "https://api.Cloudinary.com/v1_1/dkwsob2vo/image/upload",
          formData
        );

        const updateBackendDB = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/content/article/${articleId}`,
          {
            id: Number(articleId),
            authorId: Number(id),
            articleImage: [uploadImage.data.secure_url],
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setCoverImage(uploadImage.data.secure_url);
        setPublicId(uploadImage.data.public_id);
        setIsImageSelected(true);
        setUploading(false);

        console.log(
          "Image uploaded to Cloudinary:",
          uploadImage.data.secure_url
        );
        console.log("Database updated successfully", updateBackendDB.data);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      }
    }
  };

  async function handleUnsplashImageUpload(imageUrl: string) {
    setUploading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/content/article/${articleId}`,
        {
          id: Number(articleId),
          authorId: Number(id),
          articleImage: [imageUrl],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  }

  const HandleDeleteImage = async () => {
    const splitedUrl: String[] | undefined = coverImage?.split("/");

    if (splitedUrl && splitedUrl[2] === "res.cloudinary.com") {
      const url = "https://api.Cloudinary.com/v1_1/dkwsob2vo/image/destroy";

      const formData = new FormData();
      formData.append("public_id", publicId);
      formData.append("api_key", import.meta.env.VITE_API_KEY);
      const timeStamp = Math.floor(Date.now() / 1000);
      formData.append("timestamp", timeStamp.toString());
      const apiSecret = import.meta.env.VITE_API_SECRET;
      formData.append(
        "signature",
        await generateSignature(publicId, timeStamp, apiSecret)
      );

      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Image deleted successfully:", response.data);
    }
    // this articleid is coming from a query param
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/content/article/${articleId}`,
      {
        id: Number(articleId),
        authorId: Number(id),
        articleImage: [],
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setCoverImage("");
    setIsImageSelected(false);
  };

  return (
    <div className="flex">
      <DraftSidebar />
      <div className="w-full">
        <Headerpublishing publishArticle={publishArticle} />
        <div className="flex justify-center mt-6 px-[1rem] md:mx-10">
          <div className="w-[67rem] md:max-w-[55rem] pb-[150px]">
            {isLoading ? (
              <DraftSkeleton />
            ) : (
              <>
                <div>
                  {isImageSelected ? (
                    <AspectRatio ratio={17 / 11} className="relative mb-10">
                      {typeof coverImage === "string" ? (
                        <>
                          <img
                            src={coverImage}
                            alt="CoverImage"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <div className="absolute right-5 bottom-6 p-2 rounded-2xl font-bold font-notosans backdrop-blur-3xl text-white">
                            UNSPLASH
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      <div
                        className="absolute top-6 right-7 bg-white rounded-xl p-2"
                        onClick={() => {
                          setIsImageSelected(false);
                          HandleDeleteImage();
                        }}
                      >
                        <IoMdClose size={30} />
                      </div>
                    </AspectRatio>
                  ) : (
                    <CoverImage
                      handleManualImageUpload={handleManualImageUpload}
                      handleUnsplashImageUpload={handleUnsplashImageUpload}
                      setCoverImage={setCoverImage}
                      setIsImageSelected={setIsImageSelected}
                      uploading={uploading}
                    />
                  )}
                  <div
                    className="flex relative flex-col w-full"
                    onChange={async () =>
                      debounceSaveDraft(await saveDraft(), 1000)
                    }
                  >
                    <AutoResizeTextarea
                      value={title}
                      placeholder="Article Title..."
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={144}
                    />
                    <AutoResizeTextarea
                      value={subtitle}
                      placeholder="Article Subtitle..."
                      onChange={(e) => setSubtitle(e.target.value)}
                      subHeading={true}
                      maxLength={144}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="">
              <BlockNoteEditor
                isLoading={isLoading}
                debounceSaveDraft={debounceSaveDraft}
                saveDraft={saveDraft}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type autoResizePropsTypes = {
  value: string;
  onChange: (e: any) => void;
  placeholder: string;
  subHeading?: Boolean;
  maxLength: number;
};

const AutoResizeTextarea = ({
  value,
  onChange,
  placeholder,
  subHeading,
  maxLength,
}: autoResizePropsTypes) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      placeholder={placeholder}
      className={`w-full outline-none overflow-hidden resize-none font-bold placeholder:font-bold font-notosans ${
        subHeading
          ? "md:placeholder:text-2xl text-xl md:text-2xl italic text-gray-500"
          : "text-3xl md:placeholder:text-5xl md:text-[3rem]"
      } `}
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      ref={textareaRef}
    />
  );
};

export default Newstory;
