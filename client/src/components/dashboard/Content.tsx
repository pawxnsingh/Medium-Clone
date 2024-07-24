import { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "./Carousel";
import Blogcard from "./Blogcard";
import Blogskeleton from "../skeleton/Blogskeleton";
import { Link } from "react-router-dom";

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
    console.log(blog);
  }, []);

  return (
    <div className="w-screen px-5 lg:max-w-[680px]">
      <Carousel />
      <div>
        {loading &&
          Array.from({ length: 18 }, (_, index) => (
            <Blogskeleton key={index} />
          ))}

        {blog.map((item: any) => (
          <Link key={item.id} to={`/${item.author.username}/${item.id}`}>
            <Blogcard item={item} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardContent;
