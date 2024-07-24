import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArticleSkeleton from "../skeleton/ArticleSkeleton";

const ArticleDisplay = () => {
  type urlTypes = {
    username: string;
    articleId: string;
  };

  const { username, articleId }: Partial<Readonly<urlTypes>> = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState();
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    async function fetchingAndValidating() {
      const res = await axios(
        `${import.meta.env.VITE_BACKEND_URL}/content/article/${articleId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (
        res.data.getBlog.author.username != username ||
        res.data.getBlog.id != articleId
      ) {
        console.log("incorrect url");
        navigate("/error");
      }
      setArticle(res.data.getBlog);
      setLoading(false);
    }
    fetchingAndValidating();
  }, []);

  return (
    <div className="">
      {loading ? (
        <ArticleSkeleton />
      ) : (
        <div className="flex justify-center w-screen">
          <div className="mt-8 w-[70rem] mx-7 md:max-w-[42.5rem]">
            hii there
            {/* here what is have to do is ki
            when a i recived a article i just put it there in the third party editor */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDisplay;
