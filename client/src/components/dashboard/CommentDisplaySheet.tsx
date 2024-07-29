import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Input } from "../ui/Input";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatPublishDate } from "../../lib/dateformat";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../recoil/atoms/userAtom";
import { BsThreeDots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function CommentDisplaySheet() {
  const [commentInput, setCommentInput] = useState<string>();
  const [comments, setComment] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<number>(1);

  const { articleId } = useParams();

  const { id } = useRecoilValue(userAtom);

  useEffect(() => {
    async function getComments() {
      const commentRes = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/content/comment?articleId=${articleId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(commentRes);
      setComment(commentRes.data.getComment);
      setLoading(false);
    }
    getComments();
  }, [reload]);

  const handleCommentEntry = async () => {
    try {
      const postComment = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/content/comment`,
        {
          content: commentInput,
          articleId: Number(articleId),
          userId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCommentInput("");
      setReload((c) => c + 1);
      console.log(postComment);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    console.log("asdasdasd");
    try {
      const deleteComment = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/content/comment?commentId=${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(deleteComment);
      setReload((c) => c + 1);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="">
      <Sheet>
        <SheetTrigger>
          <div className="flex items-center gap-1">
            <CommentIcon width={24} height={24} />
            <span>{comments?.length}</span>
          </div>
        </SheetTrigger>
        <SheetContent className="font-notosans overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Responses ({comments?.length})</SheetTitle>
            <Input
              id="name"
              value={commentInput}
              placeholder="What are your thoughts?"
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              className="flex justify-center border py-2.5 rounded-lg bg-green-800 text-white font-bold"
              onClick={handleCommentEntry}
            >
              Respond
            </button>
          </SheetHeader>

          <div className="mt-5 ">
            <h1 className="text-gray-500 border-b pb-1">Comments</h1>
            {loading ? (
              ""
            ) : (
              <div className="mt-4 h-[25rem] pb-10">
                {comments?.map((item) => (
                  <div className="py-3 border-b" key={item.id}>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={item.user.profilePicture} />
                        <AvatarFallback>PP</AvatarFallback>
                      </Avatar>
                      <div className="text-xs flex items-start justify-between w-full">
                        <div>
                          <Link to={`/${item.user.username}`} key={item.id}>
                            <p className="font-bold">{item.user.name}</p>
                          </Link>
                          <div className="flex gap-1 text-gray-500">
                            <span>{formatPublishDate(item.createdAt!)}</span>
                          </div>
                        </div>
                        {item.user.id == id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <BsThreeDots />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="mr-5">
                              <DropdownMenuItem>
                                <p
                                  className="text-red-700 font-notosans"
                                  onClick={() => {
                                    handleDeleteComment(item.id);
                                  }}
                                >
                                  Delete
                                </p>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>

                    <div className="text-sm pt-1">{item.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface CommentIconProps {
  width: number;
  height: number;
}
const CommentIcon: React.FC<CommentIconProps> = ({ width, height }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className="comment-icon"
    >
      <path
        fill="#4b5563"
        d="M18.006 16.803c1.533-1.456 2.234-3.325 2.234-5.321C20.24 7.357 16.709 4 12.191 4S4 7.357 4 11.482c0 4.126 3.674 7.482 8.191 7.482.817 0 1.622-.111 2.393-.327.231.2.48.391.744.559 1.06.693 2.203 1.044 3.399 1.044.224-.008.4-.112.486-.287a.49.49 0 0 0-.042-.518c-.495-.67-.845-1.364-1.04-2.057a4 4 0 0 1-.125-.598zm-3.122 1.055-.067-.223-.315.096a8 8 0 0 1-2.311.338c-4.023 0-7.292-2.955-7.292-6.587 0-3.633 3.269-6.588 7.292-6.588 4.014 0 7.112 2.958 7.112 6.593 0 1.794-.608 3.469-2.027 4.72l-.195.168v.255c0 .056 0 .151.016.295.025.231.081.478.154.733.154.558.398 1.117.722 1.659a5.3 5.3 0 0 1-2.165-.845c-.276-.176-.714-.383-.941-.59z"
      ></path>
    </svg>
  );
};
