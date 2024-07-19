import { Link } from "react-router-dom";
import { PiHandsClappingFill } from "react-icons/pi";
import { RiMessage3Fill } from "react-icons/ri";
import { MdOutlineDoNotDisturbOn } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

const Blogcard = ({}) => {
  const profileImage =
    "https://miro.medium.com/v2/resize:fill:176:176/1*ZrjAV0zdZA-Lr18PbE2UgA.jpeg";
  const author = "Meng Li";
  const title = "Top 15 Python Tips to Solve Your Data Analysis Challenges";
  const subTitle = "Master Data Analysis with These Proven Python Methods";
  const noOfLike = 7;
  const date = "Apr 11";
  const commentcount = 16;
  const blogPicture =
    "https://loremflickr.com/cache/resized/65535_53147719513_c2c4e5623e_c_640_480_nofilter.jpg";

  return (
    <div className="flex flex-col border-b font-notosans mt-7">
      <Link to={`/username`} className="flex py-2 items-center gap-2 mb-1">
        <img
          src={profileImage}
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
