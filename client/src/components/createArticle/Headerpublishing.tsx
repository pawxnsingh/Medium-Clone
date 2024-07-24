import { Link } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";

import AvatarDropdown from "../dashboard/AvatarDropdown";

const Headerpublishing = ({ publishArticle }: any) => {
  return (
    <div className="z-50 sticky top-0 left-0 w-full backdrop-blur-sm lg:px-40 border-b border-gray-300">
      <div className="flex relative items-center justify-between py-6 mx-5 md:mx- md:py-4 ">
         
        <div className="flex items-center gap-4">
          <div>
            <Link to="/">
              <h1 className="text-3xl font-extrabold font-serif">Quillfire</h1>
            </Link>
          </div>
        </div>

        {/* this is end */}
        <nav className="flex items-center gap-6">
          <button
            onClick={publishArticle}
            className="bg-green-700 text-white px-3 py-0.5 rounded-full text-sm font-notosans pb-1 font-bold"
          >
            Publish
          </button>

          <Link to="">
            <div className="text-black/60">
              <IoMdNotificationsOutline size={25} />
            </div>
          </Link>
          {/* this is the navigation of avatar */}
          <AvatarDropdown />
        </nav>
      </div>
    </div>
  );
};

export default Headerpublishing;
