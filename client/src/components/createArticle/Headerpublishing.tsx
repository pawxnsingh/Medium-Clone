import { Link } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";

import AvatarDropdown from "../dashboard/AvatarDropdown";
import { useToast } from "../ui/toast/use-toast";
import { formatPublishDate } from "../../lib/dateformat";

type headerPublishingType = {
  publishArticle: () => void;
};
// @ts-ignore
const Headerpublishing = ({ publishArticle }: headerPublishingType) => {
  const { toast } = useToast();

  return (
    <div className="z-50 sticky ov erflow-hidden top-0 left-0 bg-white lg:px-20 border-b border-gray-300">
      <div className="flex relative items-center justify-between py-6 mx-5 md:mx- md:py-4 ">
        <div>
          <Link to="/">
            <h1 className="text-3xl font-extrabold font-serif">Quillfire</h1>
          </Link>
        </div>
        <nav className="flex items-center gap-6">
          <button
            onClick={() => {
              toast({
                title: "Article published successfully ",
                description: formatPublishDate(new Date()),
              });
              publishArticle();
            }}
            className="bg-green-700 text-white px-3 py-0.5 rounded-full text-sm font-notosans pb-1 font-bold"
          >
            Publish
          </button>

          <Link to="">
            <div className="text-black/60">
              <IoMdNotificationsOutline size={25} />
            </div>
          </Link>
          <AvatarDropdown />
        </nav>
      </div>
    </div>
  );
};

export default Headerpublishing;
