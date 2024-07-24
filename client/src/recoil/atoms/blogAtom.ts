import { atomFamily, selectorFamily } from "recoil";

export const blogAtoms = atomFamily({
  key: "blogAtomFamily",
  default: selectorFamily({
    key: "blogSelectorFamily",
    get: (a) => async () => {},
  }),
});
