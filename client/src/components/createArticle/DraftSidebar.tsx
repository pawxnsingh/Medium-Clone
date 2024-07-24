import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { BsLayoutSidebarInset } from "react-icons/bs";
import { BsLayoutSidebarInsetReverse } from "react-icons/bs";
import { FaDraftingCompass } from "react-icons/fa";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import axios from "axios";

type articleType = {
  id: Number;
  title: string;
  subtitle: string;
  content: string;
  articleImage: [string];
  isPublished: Boolean;
  authorId: Number;
  createdAt: Date;
  updatedAt: Date;
}[];

const DraftSidebar = ({
  selectedDraftorPublishedArticle,
  setSelectedDraftorPublishedArticle,
}: {
  selectedDraftorPublishedArticle: Number | undefined;
  setSelectedDraftorPublishedArticle: React.Dispatch<
    React.SetStateAction<Number | undefined>
  >;
}) => {
  const [open, setOpen] = useState<Boolean>(false);
  const [article, setArticle] = useState<articleType | undefined>();
  // this is used to make the useEffect rerendered for new draft
  const [update, setUpdated] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    async function Article() {
      const articleObj = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/content/userarticle`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setArticle(articleObj.data.getAllUserArticle);
    }
    Article();
  }, [update]);

  const handleNewDraft = async () => {
    const newDraft = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/content/article`,
      {
        authodId: "random",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(newDraft);
    setUpdated((c) => c + 1);
    const id = newDraft.data.id;
    navigate(`/new-story?articleId=${id}`);
  };

  console.log(selectedDraftorPublishedArticle);

  return (
    <div
      className={`hidden md:inline-block min-h-screen bg-gray-50 font-notosans ${
        open ? "w-72 border-r border-gray-200" : "w-16"
      } px-4 text-white  duration-300`}
    >
      <div className="py-3 flex justify-end">
        {open ? (
          <BsLayoutSidebarInset
            color="gray"
            className="cursor-pointer mt-2.5"
            size={26}
            onClick={() => setOpen(!open)}
          />
        ) : (
          <BsLayoutSidebarInsetReverse
            color="gray"
            className="cursor-pointer mt-2.5"
            size={26}
            onClick={() => setOpen(!open)}
          />
        )}
      </div>

      <div
        className={`flex flex-col items-center justify-center whitespace-pre ${
          !open && "hidden opacity-5"
        }  mt-7`}
      >
        <Link
          to={"/new-story"}
          className="border rounded-lg  w-full text-black"
          onClick={handleNewDraft}
        >
          <div className="flex gap-3 items-center justify-center hover:bg-gray-100 py-2.5">
            <FaDraftingCompass size={20} />
            <h1>New Draft</h1>
          </div>
        </Link>

        {/* here put some collapsible  */}
        <div className="w-full px-2">
          <Accordion type="single" collapsible className="text-black ">
            <AccordionItem value="item-1" className="mb-7 mt-5">
              <AccordionTrigger className="hover:no-underline text-sm">
                MY DRAFTS
              </AccordionTrigger>
              {article
                ?.filter((item) => !item.isPublished)
                .map((item, index) => {
                  return (
                    <AccordionContent
                      key={index}
                      className={`border mb-1 py-2 px-3 overflow-hidden hover:bg-slate-100 truncate rounded-md ${
                        selectedDraftorPublishedArticle === item.id &&
                        "bg-slate-200 hover:bg-slate-200"
                      }`}
                      onClick={() => {
                        setSelectedDraftorPublishedArticle(item.id);
                        navigate(`/new-story?articleId=${item.id}`);
                      }}
                    >
                      {item.title === null ? "Untitled" : item.title}
                    </AccordionContent>
                  );
                })}
            </AccordionItem>

            <AccordionItem value="item-2" className="text-sm">
              <AccordionTrigger className="hover:no-underline">
                PUBLISHED
              </AccordionTrigger>

              {article
                ?.filter((item) => item.isPublished)
                .map((item, index) => {
                  return (
                    <AccordionContent
                      key={index}
                      className={`border mb-1 py-2 px-3 overflow-hidden hover:bg-slate-100 truncate rounded-md ${
                        selectedDraftorPublishedArticle === item.id &&
                        "bg-slate-200 hover:bg-slate-200"
                      }`}
                      onClick={() => {
                        setSelectedDraftorPublishedArticle(item.id);
                        navigate(`/new-story?articleId=${item.id}`);
                      }}
                    >
                      {item.title}
                    </AccordionContent>
                  );
                })}
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default DraftSidebar;
