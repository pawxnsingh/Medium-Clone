import axios from "axios";
import { useState, useEffect, SVGProps } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JSX } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Button from "./Button";
import Blogcard from "./dashboard/Blogcard";

type userTypes = {
  id: number;
  name: string;
  email: string;
  username: string;
  profilePicture: string;
};

const Profilepage = () => {
  const [user, setUser] = useState<userTypes>();
  const [article, setArticle] = useState<any>();
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserDetails() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/profile/${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const ArticleResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/content/articles?authorId=${
            res.data.id
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setArticle(ArticleResponse.data.allBlog);

        const user = res.data;
        setUser({
          id: user.id,
          name: user.name,
          email: user?.email,
          username: user?.username,
          profilePicture: user?.profilePicture,
        });
      } catch (error) {
        console.log(error);
        // navigate("/404")
        throw error;
      }
    }
    getUserDetails();
  }, [username]);

  console.log(user);
  console.log(article);

  return (
    <div className="flex  mx-28 font-notosans items-center">
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="h-48 w-full">
            <img
              src="https://plus.unsplash.com/premium_photo-1676478746671-a2df7f1ee0d7?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex items-center border-r">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>PP</AvatarFallback>
            </Avatar>
            <div className="p-4">
              <h1 className="text-4xl font-bold">{user?.name}</h1>
              <h1 className="text-lg font-medium text-gray-500">
                {user?.username}
              </h1>
            </div>
          </div>

          <p className="text-gray-500 border-r">
            The True Photographic History of "The Rule"
          </p>

          <div className="flex items-center space-x-4 mt-4 border-r">
            <a className="text-black border-b-2 border-gray-400">Articles</a>
          </div>
          <hr />

          <div className="flex flex-col pb-[150px]">
            {article?.map((item: any) => (
              <Blogcard item={item} />
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/3 hidden md:block p-4  mt-7 ">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-500">∞ Followers</p>
            <p className="mt-2 text-center text-gray-500">
              Living a creative life, a student of high magic, and hopefully
              growing wiser as I age. • Ex-Lucasfilm, Netflix, Adobe. • Here are
              some stories and photos.
            </p>
            <div className="flex space-x-2 mt-4">
              <Button className="bg-green-600 text-white">Follow</Button>
              <Button className="bg-green-600 text-white flex items-center justify-center">
                <MailIcon className="w-4 h-4 mt-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profilepage;

function MailIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
