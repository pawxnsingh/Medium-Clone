import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import Headerpublishing from "./Headerpublishing";
import { useEffect, useRef, useState } from "react";

import { CoverImage } from "./CoverImage";
import { AspectRatio } from "../ui/aspect-ratio";
import DraftSidebar from "./DraftSidebar";

import { IoMdClose } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../recoil/atoms/userAtom";
import { useSearchParams } from "react-router-dom";

import axios from "axios";
import { generateSignature } from "../../lib/signature";

const Newstory: React.FC = () => {
  // this is used to instantiate the editor
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");

  const [coverImage, setCoverImage] = useState<string>("");
  const [isImageSelected, setIsImageSelected] = useState<Boolean>(false);
  const [publicId, setPublicId] = useState<string>("");

  const [uploading, setUploading] = useState<Boolean>(false);

  const [selectedDraftorPublishedArticle, setSelectedDraftorPublishedArticle] =
    useState<Number>();

  const [initialContent, setInitialContent] = useState();

  const editor = useCreateBlockNote({
    // initialContent: JSON.parse(initialContent),
  });

  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("articleId");

  useEffect(() => {
    async function getArticle() {
      const article = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/content/article/${articleId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(article.data);

      console.log(article.data.getBlog.title);

      if (article.data.getBlog.title === null) {
        setTitle("");
      } else {
        setTitle(article.data.getBlog.title);
      }

      console.log(article.data.getBlog.subtitle);

      if (article.data.getBlog.subtitle === null) {
        setSubtitle("");
      } else {
        setSubtitle(article.data.getBlog.title);
      }

      console.log(article.data.getBlog.articleImage[0]);

      if (article.data.getBlog.articleImage.length === 0) {
        setCoverImage("");
        setIsImageSelected(false);
      } else {
        setCoverImage(article.data.getBlog.articleImage[0]);
        setIsImageSelected(true);
      }

      setInitialContent(article.data.getBlog.content);
      console.log(article.data.getBlog.content);
    }
    getArticle();
  }, [selectedDraftorPublishedArticle]);

  const { id } = useRecoilValue(userAtom);

  // almost done
  const publishArticle = async () => {
    // make a backend calls
    if (!isImageSelected) {
      alert("Please upload the cover image");
      return;
    }

    const publish = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/content/article`,
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

  // just make a post article req
  // save all the dettail threre
  // but just keep the isPublishtag to false
  //! make some more optimization like debouncing ya thothling
  const saveDraft = async () => {
    console.log("i got saved");
    const content = JSON.stringify(editor.document);
    const saveDraft = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/content/article/${articleId}`,
      {
        id: Number(articleId),
        authorId: Number(id),
        title: title,
        subtitle: subtitle,
        content: content,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(saveDraft.data);
    return saveDraft;
  };

  // i think this is benefiecial for the munual upload
  // put it also update the coverImage stateVariable adn isImageSelecred one as well
  // {articleid, id}
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

        const url = uploadImage.data;
        console.log(url);

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
        console.log("Database updated successfullt", updateBackendDB.data);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      }
    }
  };

  const handleUnsplashImageUpload = async () => {
    setUploading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/content/article/${articleId}`,
        {
          id: Number(articleId),
          authorId: Number(id),
          articleImage: [coverImage],
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
  };

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
    console.log("i got deleted");
    setCoverImage();
    setIsImageSelected(false);
  };
  console.log(coverImage);

  return (
    <div className="flex">
      <DraftSidebar
        selectedDraftorPublishedArticle={selectedDraftorPublishedArticle}
        setSelectedDraftorPublishedArticle={setSelectedDraftorPublishedArticle}
      />

      <div className="flex-grow">
        <Headerpublishing publishArticle={publishArticle} />
        <div className="flex justify-center w-sc reen mt-6">
          <div className="w-[67r em] md:mx-7 md:max-w-[55rem]">
            {isImageSelected ? (
              <AspectRatio ratio={17 / 11} className="mx-14 relative mb-10">
                {typeof coverImage === "string" ? (
                  <>
                    <img
                      src={coverImage}
                      alt="CoverImage"
                      className="w-full h-full object-cover"
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
              className="flex relative flex-col w-full px-[3.375rem]"
              onChange={saveDraft}
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
            <BlockNoteView
              onChange={saveDraft}
              theme={"light"}
              editor={editor}
            />
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
