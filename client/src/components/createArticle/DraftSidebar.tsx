import { useEffect, useState } from "react";
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
import { useRecoilValue } from "recoil";
import { userAtom } from "../../recoil/atoms/userAtom";

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

const DraftSidebar = () => {
  // this one is for to toggle the draft sidebar
  const [open, setOpen] = useState<Boolean>(false);
  // this below state variable is for highlighting the draft or published article tell which one is selected
  const [selectedDraftorPublishedArticle, setSelectedDraftorPublishedArticle] =
    useState<Number>();

  const { id } = useRecoilValue(userAtom);

  // when data is fetched, article will store all the article
  const [article, setArticle] = useState<articleType>();

  //  this is used to make the useEffect rerendered for new draft
  const [update, setUpdated] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function Article() {
      try {
        const articleObj = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/content/userarticle/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const articles = articleObj.data.getAllUserArticle;
        setArticle(articles);
        setSelectedDraftorPublishedArticle(articles[0].id);
        navigate(`/new-story?articleId=${articles[0].id}`);
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
    Article();
  }, [update]);

  const handleNewDraft = async () => {
    try {
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
      setUpdated((c) => c + 1);
      navigate(`/new-story?articleId=${newDraft.data.id}`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <div
      className={`hidden  md:inline-block min-h-screen bg-gray-50 font-notosans ${
        open ? "w-72 border-r border-gray-200 shrink-0" : "w-16"
      } px-4 text-white  duration-500`}
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
                      {item.title == "" ? "Untitled" : item.title}
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
                      {item.title == "" ? "Untitled" : item.title}
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
