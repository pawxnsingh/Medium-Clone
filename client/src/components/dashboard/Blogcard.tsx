import { Link } from "react-router-dom";
import { PiHandsClappingFill } from "react-icons/pi";
import { RiMessage3Fill } from "react-icons/ri";
import { MdOutlineDoNotDisturbOn } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { dateformat } from "../../lib/dateformat";

const Blogcard = ({ item }: any) => {
  const profilePicture = item.author.profilePicture;
  const author = item.author.name;
  const title = item.title;
  const subTitle = item.subtitle;
  const noOfLike = item.clap.length;
  const date = dateformat(item.createdAt);
  const commentcount = item.comment.length;
  const blogPicture = item.articleImage[0];

  return (
    <div className="flex flex-col border-b font-notosans mt-7">
      <Link to={`/username`} className="flex py-2 items-center gap-2 mb-1">
        <img
          src={profilePicture}
          width={20}
          alt="profileImage"
          className="rounded-full"
        />
        <h1 className="text-xs font-medium hover:underline">{author}</h1>
      </Link>
      <div className="flex justify-between items-start ">
        <div className="flex flex-col">
          <h1 className="text-[1.1rem] font-extrabold mb-1">{title}</h1>
          <p className="text-gray-600 mb-3">{subTitle}</p>
        </div>
        <div className="ml-12">
          <img
            src={blogPicture}
            width={160}
            alt="blogPicture"
            className="w-[10rem]"
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-3 mb-5 mr-2 lg:mr-[10rem]">
        <div className="flex gap-2">
          <div>{date}</div>
          <div className="flex items-center gap-1">
            <PiHandsClappingFill />
            <h1>{noOfLike}</h1>
          </div>
          <div className="flex items-center gap-1">
            <RiMessage3Fill />
            <h1>{commentcount}</h1>
          </div>
        </div>
        <div className="flex gap-5">
          <MdOutlineDoNotDisturbOn />
          <FaRegBookmark />
          <BsThreeDots />
        </div>
      </div>
    </div>
  );
};

export default Blogcard;
