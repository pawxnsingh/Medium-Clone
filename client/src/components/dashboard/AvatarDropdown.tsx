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
} from "../ui/dropdown-menu";

import { useRecoilValue } from "recoil";
import { userAtom } from "../../recoil/atoms/userAtom";

const AvatarDropdown = () => {
  const user = useRecoilValue(userAtom);

  return (
    <div className="rounded-full w-[2.1rem] border ml-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <img
            className="rounded-full"
            src={user.profilePicture}
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
            <div className="text-slate-600">{user.email}</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AvatarDropdown;
