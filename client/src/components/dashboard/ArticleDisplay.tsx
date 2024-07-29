import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArticleSkeleton from "../skeleton/ArticleSkeleton";
import { AspectRatio } from "../ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatPublishDate } from "../../lib/dateformat";
import { Clap } from "./Blogcard";
import { CommentDisplaySheet } from "./CommentDisplaySheet";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../recoil/atoms/userAtom";
import { toast } from "../ui/toast/use-toast";
import { BsThreeDots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

type clapTypes = {
  articleId: number;
  count: number;
  createdAt: Date;
  id: number;
  updatedAt: Date;
  userId: number;
};

type authorInfoTypes = {
  email: string;
  username: string;
  profilePicture: string;
  name: string;
};

type articleTypes = {
  content?: string;
  id: number;
  subtitle: string;
  createdAt: Date;
  title: string;
};

const ArticleDisplay = () => {
  type urlTypes = {
    username: string;
    articleId: string;
  };

  const { articleId }: Partial<Readonly<urlTypes>> = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<articleTypes>();
  const [articleImage, setArticleImage] = useState<string>();
  const [authorInfo, setAuthorInfo] = useState<authorInfoTypes>();
  const [clap, setClap] = useState<clapTypes[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useRecoilValue(userAtom);
  const editor = useCreateBlockNote();

  useEffect(() => {
    async function fetchingAndValidating() {
      try {
        const res = await axios(
          `${import.meta.env.VITE_BACKEND_URL}/content/article/${articleId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res);
        const article = res.data.getBlog;
        setArticleImage(article.articleImage[0]);
        setAuthorInfo(article.author);
        setClap(article.clap);
        setArticle({
          id: article.id,
          title: article.title,
          subtitle: article.subtitle,
          createdAt: article.createdAt,
        });
        const blocks = await editor.tryParseMarkdownToBlocks(article.content);
        editor.replaceBlocks(editor.document, blocks);
        setLoading(false);
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    }
    fetchingAndValidating();
  }, []);

  const handleClap = async () => {
    const postClap = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/content/addClap`,
      {
        articleId: Number(articleId),
        userId: Number(id),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return postClap;
  };

  const handleRemoveClap = async () => {
    const postClap = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/content/removeClap`,
      {
        data: {
          articleId: Number(articleId),
          userId: Number(id),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return postClap;
  };

  return (
    <div className="font-notosans">
      {loading ? (
        <ArticleSkeleton />
      ) : (
        <div className="flex justify-center mt-6 mx-4 md:mx-10">
          <div className="w-[67rem] md:mx-7 md:max-w-[55rem] pb-[150px]">
            <div className="md:px-[3.375rem] ">
              <div
                className="flex relative flex-col w-full font-bold font-notosans text-3xl
                md:text-5xl md:text-[3rem]"
              >
                <div>{article?.title}</div>
                <div className="md:placeholder:text-2xl text-xl md:text-2xl italic text-gray-500">
                  <div className="my-1 md:my-3">{article?.subtitle}</div>
                </div>
              </div>
              {/* this is the article info section */}
              <div className="">
                <Link to={`/${authorInfo?.username}`}>
                  <div className="flex items-center gap-3 my-6">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={authorInfo?.profilePicture} />
                      <AvatarFallback>PP</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">{authorInfo?.name}</p>
                      <div className="flex gap-1 text-gray-500">
                        <span>4 min read</span>
                        <span>·</span>
                        <span>{formatPublishDate(article?.createdAt!)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center justify-between border-y my-7 px-5 py-3 text-gray-500">
                  <div className="flex gap-5  items-center">
                    <div
                      className="flex items-center gap-2"
                      onClick={async () => {
                        const res = handleClap();
                        toast({
                          title:
                            (await res).status === 200
                              ? "Clap already exist"
                              : "Article Clapped",
                          description: formatPublishDate(new Date()),
                        });
                      }}
                    >
                      <Clap width={18} height={18} />
                      <span>{clap?.length}</span>
                    </div>

                    <div className="pt-1.5">
                      <CommentDisplaySheet />
                    </div>
                  </div>
                  {/*  */}
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <BsThreeDots />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="mr-8">
                        <DropdownMenuItem>
                          <p
                            className="text-red-700 font-notosans"
                            onClick={() => {
                              toast({
                                title: "Clap Removed",
                                description: formatPublishDate(new Date()),
                              });
                              handleRemoveClap();
                            }}
                          >
                            Remove Clap
                          </p>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              {articleImage && (
                <AspectRatio ratio={17 / 11} className="relative mb-10">
                  <>
                    <img
                      src={articleImage}
                      alt="CoverImage"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute right-5 bottom-6 p-2 rounded-2xl font-bold font-notosans backdrop-blur-3xl text-white">
                      UNSPLASH
                    </div>
                  </>
                </AspectRatio>
              )}
              <BlockNoteView editor={editor} theme={"light"} editable={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDisplay;
