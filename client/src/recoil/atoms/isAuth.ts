import { selector } from "recoil";
import { userAtom } from "./userAtom";

export const isAuth = selector({
  key: "isAuthSelector",
  get: ({ get }) => {
    const user = get(userAtom);
    return Boolean(user);
  },
});
