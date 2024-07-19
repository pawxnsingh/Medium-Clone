import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { TfiWrite } from "react-icons/tfi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../recoil/atoms/user";

import profile from "../../assets/profile.svg";
import premiumstar from "../../assets/premiumstar.svg";
import library from "../../assets/library.svg";
import stats from "../../assets/stats.svg";
import stories from "../../assets/stories.svg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const Headerdashboard = () => {
  // @ts-ignore
  const { profilePicture, email } = useRecoilValue(userAtom);
  return (
    <div className=" z-50 top-0 left-0 w-full bg-white">
      {/* this is the top half of header */}
      <div className="flex relative items-center justify-between py-4 mx-5 md:mx- md:py-2">
        {/* this is header and search bar */}
        <div className="flex items-center gap-4">
          <div>
            <Link to="/">
              <h1 className="text-3xl font-extrabold font-serif">Quillfire</h1>
            </Link>
          </div>
          {/* search bar */}
          <div className="hidden md:flex items-center border rounded-full border-gray-100 bg-gray-50  p-1 font-sans py-2 px-2 ">
            <div className="mr-2 text-gray-500">
              <CiSearch size={25} />
            </div>
            <div className="">
              <input
                type="text"
                className="bg-transparent text-[#242424] placeholder:text-black/70 outline-none placeholder:font-notosans text-[14px]"
                placeholder="Search"
              />
            </div>
          </div>
        </div>

        {/* this is end */}
        <nav className="flex items-center gap-6">
          <Link
            to="/new-story"
            className="hidden lg:flex lg:items-center lg:gap-2 font-notosans text-[14px] text-black/70 "
          >
            <TfiWrite size={20} />
            <div>Write</div>
          </Link>

          <Link to="notification">
            <div className="text-black/60">
              <IoMdNotificationsOutline size={25} />
            </div>
          </Link>
          {/* this is the navigation of avatar */}
          <div className="rounded-full w-[2.1rem] border ml-3">
            {/* <img
              className="rounded-full"
              src="https://ipfs.io/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/965.jpg"
              alt="avatar"
            /> */}

            {/* <img
              className="rounded-full"
              src={`${profilePicture}`}
              alt="avatar"
            /> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  className="rounded-full"
                  src="https://ipfs.io/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/965.jpg"
                  alt="avatar"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[15rem] font-notosans overflow-x-hidden overflow-visible">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex items-center">
                    <div className="mr-3">
                      <img width={20} src={profile} alt="profile" />
                    </div>
                    <div>Profile</div>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center">
                    <div className="mr-3">
                      <img width={20} src={library} alt="profile" />
                    </div>
                    Library
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center">
                    <div className="mr-3">
                      <img width={20} src={stories} alt="profile" />
                    </div>
                    Stories
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <div className="mr-3">
                      <img width={20} src={stats} alt="sdfsdfs" />
                    </div>
                    Stats
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem>Setting</DropdownMenuItem>
                  <DropdownMenuItem>Refine recommendation</DropdownMenuItem>
                  <DropdownMenuItem>Manage publication</DropdownMenuItem>
                  <DropdownMenuItem>help</DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex justify-between">
                  Became a Quillfire Member
                  <img src={premiumstar} width={20} alt="premiumstar" />
                </DropdownMenuItem>

                <DropdownMenuItem>Create a Mastodon account</DropdownMenuItem>
                <DropdownMenuItem disabled>
                  Apply for author verifcation
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex flex-col gap-1">
                  <div>Log out</div>
                  <div className="text-slate-600">{"pawansingh@gmail.com"}</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <img src={`${profilePicture}`} alt="" /> */}
          </div>
        </nav>
      </div>

      {/* this is below half of the header */}
      <div className="relative py-4 md:py-3 border-b-black bg-gradient-to-r from-[rgb(251,240,184)] via-[rgb(255,227,48)] to-[rgb(255,192,23)]">
        <p className="flex flex-col mx-5 md:flex-row md:justify-center">
          <span className="font-bold mr-1">Be part of a better internet.</span>
          <Link to="/signin" className="underline">
            Get 20% off membership for a limited time
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Headerdashboard;
