import { atom } from "recoil";

export const userAtom = atom({
  key: "userAtom",
  default: {
    id: "",
    name: "",
    email: "",
    username: "",
    profilePicture: "",
  },
});
