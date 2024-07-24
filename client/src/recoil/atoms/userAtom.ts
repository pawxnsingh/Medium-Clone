import axios from "axios";
import { atom, selector } from "recoil";

export const userAtom = atom({
  key: "userAtom",
  default: selector({
    key: "userSelector",
    get: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/getuser`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);
      return res.data;
    },
  }),
});
