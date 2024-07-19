import { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "./Carousel";
import Blogcard from "./Blogcard";
import { Skeleton } from "../ui/skeleton";
import Blogskeleton from "./Blogskeleton";

const DashboardContent = () => {
  const [blog, setBlogs] = useState([]);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    async function getBlogs() {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/content/articles`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBlogs(res.data.allBlog);
      setLoading(false);
    }
    getBlogs();
  }, []);

  return (
    <div className="w-screen px-5 lg:max-w-[680px]">
      <Carousel />
      <div>
        {loading &&
          Array.from({ length: 18 }, (_, index) => <Blogskeleton key={index} />)}

        {/* {blogs.map((item) => ( */}
        {/* <Blogcard /> */}
        {/* ))} */}
      </div>
    </div>
  );
};

export default DashboardContent;
