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

import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

import { useRecoilValue } from "recoil";
import { userAtom } from "../../recoil/atoms/userAtom";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "../ui/toast/use-toast";
import { formatPublishDate } from "../../lib/dateformat";

const AvatarDropdown = () => {
  // const [user, setUser] = useState<any>();
  const user = useRecoilValue(userAtom);
  const [name, setName] = useState<string>(user?.name);
  const [username, setUsername] = useState<string>(user?.username);
  const [currentPassword, setCurrentPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const navigate = useNavigate();

  const handleUpdateNameUsername = async () => {
    try {
      const updateValue = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/update`,
        {
          name: name,
          username: username,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return updateValue;
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const updateValue = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/passwordchange`,
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return updateValue;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-full w-[2.1rem] border ml-3 ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <img
            className="rounded-full"
            src={user?.profilePicture}
            alt="avatar"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[15rem] font-notosans overflow-x-hidden overflow-visible">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Dialog>
              <DialogTrigger className="flex items-center px-2 py-1.5 text-sm hover:bg-slate-100 w-full rounded-sm">
                <div className="mr-3 flex items-center">
                  <img width={20} src={profile} alt="profile" />
                </div>
                <div>Profile</div>
              </DialogTrigger>

              <DialogContent className="font-notosans">
                <Tabs defaultValue="account" className="p-3">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                  </TabsList>

                  <TabsContent value="account">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>
                          Make changes to your account here. Click save when
                          you're done.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={`${username}`}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <button
                          className="rounded-md py-2 px-3 bg-green-700 text-white pb-3 text-sm font-medium"
                          onClick={async () => {
                            const update = await handleUpdateNameUsername();
                            if (update?.status === 200) {
                              toast({
                                title: "Profile published successfully ",
                                description: formatPublishDate(new Date()),
                              });
                            }
                          }}
                        >
                          Save changes
                        </button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="password">
                    <Card>
                      <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                          Change your password here. After saving, you'll be
                          logged out.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="current">Current password</Label>
                          <Input
                            id="current"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="new">New password</Label>
                          <Input
                            id="new"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <button
                          className="rounded-md py-2 px-3 bg-green-700 text-white pb-3 text-sm font-medium"
                          onClick={async () => {
                            const update = await handleUpdatePassword();
                            if (update?.status === 200) {
                              toast({
                                title: "Password published successfully ",
                                description: formatPublishDate(new Date()),
                              });
                            }
                          }}
                        >
                          Save password
                        </button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

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

          <DropdownMenuItem
            className="flex flex-col gap-1"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/signin");
            }}
          >
            <div>Log out</div>
            <div className="text-slate-600">{user?.email}</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AvatarDropdown;
