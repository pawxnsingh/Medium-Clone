import { selector } from "recoil";
import { userAtom } from "../atoms/user";

export const isAuthenticatedSelector = selector({
  key: "isAuthenticatedSelector",
  get: ({ get }) => {
    const user = get(userAtom);
    if (user.email === "" && user.id === "") {
      return false;
    }
    return true;
  },
});
